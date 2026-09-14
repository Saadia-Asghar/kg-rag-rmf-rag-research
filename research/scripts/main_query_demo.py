#!/usr/bin/env python3
"""Run one auditable query through the saved Hetionet benchmark models.

This is a deterministic retrieval/evidence packet demo. It does not generate
clinical advice; every returned candidate is labeled with typed training-graph
support and with evidence status from the frozen licensed-text manifest.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from run_main_rmf_rag_benchmark import (  # noqa: E402
    build_documents,
    build_graph,
    load_snapshot,
    rank_query,
    relation_sets,
    selected_edges,
    split_edges,
    verified_compounds,
)
from evaluate_evidence import build_coverage_summary, validate_manifest  # noqa: E402


RESULTS = ROOT / "research" / "results" / "main_benchmark"
QUERY_DIR = ROOT / "research" / "query_sets"
EVIDENCE_MANIFEST = ROOT / "research" / "data" / "biomedical_evidence_manifest.json"
FULL_EVIDENCE_OUTPUT = RESULTS / "full_test_evidence.json"

METHODS = (
    "lexical",
    "euclidean",
    "poincare",
    "poincare_no_geodesic",
    "poincare_no_hop_weighting",
    "poincare_no_parallel_transport",
    "poincare_with_path_verification",
)


def load_query(path: Path, index: int) -> dict:
    rows = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    if not rows:
        raise ValueError(f"No queries found in {path}")
    if index < 0 or index >= len(rows):
        raise IndexError(f"Query index {index} is outside 0..{len(rows) - 1}")
    return rows[index]


def build_query_graph(seed: int) -> tuple[dict, dict, dict, dict]:
    raw, nodes = load_snapshot()
    edges = selected_edges(raw)
    gd, dc, cg, _ = relation_sets(edges)
    dc_splits = split_edges(dc, seed, minimum_train_per_group=True)
    cg_splits = split_edges(cg, seed + 1000)
    graph = build_graph(
        nodes,
        gd,
        dc,
        cg,
        removed_dc=dc - dc_splits["train"],
        removed_cg=cg - cg_splits["train"],
    )
    docs, idf = build_documents(nodes, graph)
    return graph, docs, idf, nodes


def load_evidence_manifest() -> dict[str, dict]:
    """Index frozen CC BY source records by public compound identifier."""
    manifest = json.loads(EVIDENCE_MANIFEST.read_text(encoding="utf-8"))
    errors = validate_manifest(manifest)
    if errors:
        details = "\n".join(f"- {error}" for error in errors)
        raise ValueError(f"Evidence manifest validation failed:\n{details}")
    return {
        compound_id: record
        for record in manifest["records"]
        for compound_id in record.get("compound_ids", [])
    }


def candidate_evidence(compound: str, evidence_by_compound: dict[str, dict]) -> dict:
    record = evidence_by_compound.get(compound)
    if not record:
        return {
            "status": "no_licensed_record",
            "records": [],
            "lookup": {
                "compound_id": compound,
                "source": "Europe PMC Open Access subset",
                "license_filter": "CC BY only",
            },
        }
    return {
        "status": record["evidence_label"],
        "records": [
            {
                "record_id": record["record_id"],
                "pmcid": record["pmcid"],
                "pmid": record["pmid"],
                "doi": record["doi"],
                "license": record["license"],
                "authors": record["authors"],
                "title": record["title"],
                "source_url": record["source_url"],
                "scope": record["evidence_scope"],
                "snippet": record["snippet"],
            }
        ],
    }


def candidate_evidence_lookup(compound: str, evidence_by_compound: dict[str, dict]) -> dict:
    """Return a compact manifest-backed lookup without copying article text."""
    record = evidence_by_compound.get(compound)
    if not record:
        return {
            "status": "no_licensed_record",
            "record_ids": [],
        }
    return {
        "status": record["evidence_label"],
        "record_ids": [record["record_id"]],
    }


def methods_for_seed(seed: int) -> dict[str, np.ndarray | None]:
    embedding_path = RESULTS / f"embeddings_seed{seed}.npz"
    with np.load(embedding_path) as saved:
        euclidean = saved["euclidean"].copy()
        poincare = saved["poincare"].copy()
    return {
        "lexical": None,
        "euclidean": euclidean,
        "poincare": poincare,
        "poincare_no_geodesic": poincare,
        "poincare_no_hop_weighting": poincare,
        "poincare_no_parallel_transport": poincare,
        "poincare_with_path_verification": poincare,
    }


def ranked_candidates(
    query: dict,
    method: str,
    graph: dict,
    docs: dict,
    idf: dict,
    nodes: dict,
    vectors: np.ndarray | None,
    top_k: int,
) -> list[str]:
    ranking = rank_query(
        method=method,
        query=query,
        graph=graph,
        vectors=vectors,
        docs=docs,
        idf=idf,
        nodes=nodes,
    )
    return ranking[:top_k]


def build_full_test_evidence(
    *,
    top_k: int = 10,
    seeds: tuple[int, ...] = (7, 17, 29, 43, 101),
) -> dict:
    """Create manifest-backed evidence lookups for every saved test ranking."""
    if top_k < 1:
        raise ValueError("--top-k must be at least 1")

    evidence_by_compound = load_evidence_manifest()
    lookup_rows: list[dict] = []
    for seed in seeds:
        graph, docs, idf, nodes = build_query_graph(seed)
        vectors_by_method = methods_for_seed(seed)
        for hop in (2, 3):
            query_path = QUERY_DIR / f"{hop}hop_test_seed{seed}.jsonl"
            queries = [
                json.loads(line)
                for line in query_path.read_text(encoding="utf-8").splitlines()
                if line.strip()
            ]
            for query in queries:
                for method in METHODS:
                    ranking = ranked_candidates(
                        query,
                        method,
                        graph,
                        docs,
                        idf,
                        nodes,
                        vectors_by_method[method],
                        top_k,
                    )
                    for rank, compound in enumerate(ranking, start=1):
                        lookup_rows.append(
                            {
                                "query_id": query["query_id"],
                                "seed": seed,
                                "hop": hop,
                                "method": method,
                                "rank": rank,
                                "compound": compound,
                                "evidence": candidate_evidence_lookup(
                                    compound, evidence_by_compound
                                ),
                            }
                        )

    output = {
        "schema_version": "1.0",
        "dataset": "Hetionet v1.0",
        "split": "test",
        "ranking_cutoff": top_k,
        "methods": list(METHODS),
        "seeds": list(seeds),
        "evidence_source": {
            "manifest": "research/data/biomedical_evidence_manifest.json",
            "policy": "Europe PMC Open Access records filtered to CC BY",
            "citation_key": "PMCID",
            "text_policy": (
                "This index stores statuses and stable manifest record IDs only; "
                "it does not redistribute article text."
            ),
        },
        "candidate_lookups": lookup_rows,
        "coverage": build_coverage_summary(lookup_rows),
        "interpretation": (
            "Coverage is calculated over the top-ranked candidates retained at the "
            "ranking cutoff for each saved test query and method. It is evidence "
            "lookup coverage, not Recall/MRR, graph-path validation, or clinical "
            "validation. Direct text support remains bounded by the cited source "
            "scope."
        ),
    }
    return output


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seed", type=int, default=101, choices=(7, 17, 29, 43, 101))
    parser.add_argument("--hop", type=int, default=3, choices=(2, 3))
    parser.add_argument("--split", choices=("validation", "test"), default="test")
    parser.add_argument("--query-index", type=int, default=0)
    parser.add_argument("--query-id", help="Exact query_id from a saved JSONL query set")
    parser.add_argument("--output", type=Path, default=RESULTS / "query_demo.json")
    parser.add_argument(
        "--all-test",
        action="store_true",
        help="Build the full manifest-backed evidence index for every saved test query.",
    )
    parser.add_argument(
        "--top-k",
        type=int,
        default=10,
        help="Number of ranked candidates retained per query and method (default: 10).",
    )
    args = parser.parse_args()

    if args.all_test:
        output = build_full_test_evidence(top_k=args.top_k)
        output_path = args.output
        if output_path == RESULTS / "query_demo.json":
            output_path = FULL_EVIDENCE_OUTPUT
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
        print(
            f"Wrote {output_path} with "
            f"{len(output['candidate_lookups'])} candidate lookups."
        )
        return

    query_path = QUERY_DIR / f"{args.hop}hop_{args.split}_seed{args.seed}.jsonl"
    if args.query_id:
        matching = [
            json.loads(line)
            for line in query_path.read_text(encoding="utf-8").splitlines()
            if line.strip() and json.loads(line)["query_id"] == args.query_id
        ]
        if not matching:
            raise ValueError(f"Query id not found in {query_path}: {args.query_id}")
        query = matching[0]
    else:
        query = load_query(query_path, args.query_index)

    graph, docs, idf, nodes = build_query_graph(args.seed)
    evidence_by_compound = load_evidence_manifest()
    embedding_path = RESULTS / f"embeddings_seed{args.seed}.npz"
    with np.load(embedding_path) as saved:
        euclidean = saved["euclidean"]
        poincare = saved["poincare"]

    verified = verified_compounds(query, graph)
    methods = {
        "lexical": None,
        "euclidean": euclidean,
        "poincare": poincare,
        "poincare_no_geodesic": poincare,
        "poincare_no_hop_weighting": poincare,
        "poincare_no_parallel_transport": poincare,
        "poincare_with_path_verification": poincare,
    }
    rankings: dict[str, list[dict]] = {}
    for method, vectors in methods.items():
        ranking = rank_query(method=method, query=query, graph=graph, vectors=vectors, docs=docs, idf=idf, nodes=nodes)
        rankings[method] = [
            {
                "rank": rank,
                "compound": compound,
                "path_verified_in_train_graph": graph["index"][("Compound", compound)] in verified,
                "evidence": candidate_evidence(compound, evidence_by_compound),
            }
            for rank, compound in enumerate(ranking[:10], start=1)
        ]

    output = {
        "dataset": "Hetionet v1.0",
        "seed": args.seed,
        "split": args.split,
        "query": query,
        "typed_path_definition": (
            "Gene -> Disease -> Compound"
            if args.hop == 2
            else "Gene -> Disease -> Gene -> Compound"
        ),
        "target_present_in_training_path_support": (
            graph["index"][("Compound", query["target_compound"])] in verified
        ),
        "evidence_source": {
            "manifest": "research/data/biomedical_evidence_manifest.json",
            "policy": "Europe PMC Open Access records filtered to CC BY",
            "citation_key": "PMCID",
        },
        "rankings": rankings,
        "interpretation": (
            "path_verified_in_train_graph reports graph connectivity only. "
            "evidence.status reports frozen licensed-text support separately; "
            "context_only and no_licensed_record do not support a therapeutic "
            "claim. This packet is for research retrieval only and is not a "
            "clinical recommendation."
        ),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()