import { execFile as execFileCallback } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { Router, type IRouter } from "express";
import {
  RunModelQueryQueryParams,
  RunModelQueryResponse,
} from "@workspace/api-zod";

const execFile = promisify(execFileCallback);
const router: IRouter = Router();
const allowedMethods = new Set([
  "lexical",
  "euclidean",
  "poincare",
  "poincare_with_path_verification",
]);

type DemoCandidate = {
  rank: number;
  compound: string;
  path_verified_in_train_graph: boolean;
  evidence: {
    status: string;
    records?: Array<{
      title?: string;
      source_url?: string;
      snippet?: string;
    }>;
  };
};

type RawDemo = {
  query: {
    query_id: string;
    hop: number;
    source_gene: string;
    disease: string;
    intermediate_gene?: string;
  };
  seed: number;
  split: string;
  rankings: Record<string, DemoCandidate[]>;
  interpretation: string;
};

function numericQueryValue(
  value: unknown,
): string | number | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  if (typeof value === "string" && value.trim() !== "") {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : value;
  }
  return value as string | number | undefined;
}

router.get("/model/query", async (req, res): Promise<void> => {
  const parsedParams = RunModelQueryQueryParams.safeParse({
    ...req.query,
    hop: numericQueryValue(req.query.hop),
    seed: numericQueryValue(req.query.seed),
    queryIndex: numericQueryValue(req.query.queryIndex),
    topK: numericQueryValue(req.query.topK),
  });

  if (!parsedParams.success) {
    res.status(400).json({ error: parsedParams.error.message });
    return;
  }

  const { hop, split, seed, queryIndex, method, topK } = parsedParams.data;
  if (!allowedMethods.has(method)) {
    res.status(400).json({ error: "Unsupported retrieval method" });
    return;
  }

  const workspaceRoot = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "../../..",
  );
  const scriptPath = path.join(
    workspaceRoot,
    "research",
    "scripts",
    "main_query_demo.py",
  );
  const savedDemoPath = path.join(
    workspaceRoot,
    "research",
    "results",
    "main_benchmark",
    `query_demo_${hop}hop.json`,
  );
  const hasSavedDemo =
    split === "test" && seed === 101 && queryIndex === 0;

  let tempDir: string | undefined;
  try {
    let raw: RawDemo;
    if (hasSavedDemo) {
      raw = JSON.parse(await readFile(savedDemoPath, "utf8")) as RawDemo;
    } else {
      tempDir = await mkdtemp(path.join(os.tmpdir(), "rmf-rag-query-"));
      const outputPath = path.join(tempDir, "query.json");
      await execFile(
        "python",
        [
          scriptPath,
          "--hop",
          String(hop),
          "--split",
          split,
          "--seed",
          String(seed),
          "--query-index",
          String(queryIndex),
          "--top-k",
          String(topK),
          "--output",
          outputPath,
        ],
        {
          cwd: workspaceRoot,
          maxBuffer: 20 * 1024 * 1024,
        },
      );
      raw = JSON.parse(await readFile(outputPath, "utf8")) as RawDemo;
    }
    const ranking = raw.rankings[method];
    if (!ranking) {
      res.status(400).json({ error: `No ranking returned for method: ${method}` });
      return;
    }

    const response = RunModelQueryResponse.parse({
      query: {
        queryId: raw.query.query_id,
        hop: raw.query.hop,
        split: raw.split,
        seed: raw.seed,
        sourceGene: raw.query.source_gene,
        disease: raw.query.disease,
        intermediateGene: raw.query.intermediate_gene ?? null,
      },
      method,
      candidates: ranking.slice(0, topK).map((candidate) => {
        const record = candidate.evidence.records?.[0];
        return {
          rank: candidate.rank,
          compound: candidate.compound,
          pathVerifiedInTrainGraph: candidate.path_verified_in_train_graph,
          evidence: {
            status: candidate.evidence.status,
            title: record?.title ?? null,
            sourceUrl: record?.source_url ?? null,
            snippet: record?.snippet ?? null,
          },
        };
      }),
      interpretation: raw.interpretation,
    });
    res.json(response);
  } catch (error) {
    req.log.error({ err: error, hop, split, seed, queryIndex, method }, "Model query failed");
    res.status(500).json({ error: "The saved model query could not be completed." });
  } finally {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  }
});

export default router;