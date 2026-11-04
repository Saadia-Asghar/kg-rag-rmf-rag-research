"""Relation-aware baselines and filtered ranking (additional analysis, not pre-registered).

Compares four retrievers under matched conditions (same triplets, mini-batches,
negatives, margin, 150 epochs, ten seeds, per-method learning rate selected on
seed-7 validation MRR from {0.1, 0.3, 1}):

* euclidean / poincare: the relation-free retrievers of the main study (c = 1);
* transe / murp: relation-specific TransE-style and MuRP-style models
  (research/models/relational_retrievers.py) that score the final hop:
  2-hop (disease, treats, ?) and 3-hop (bridge gene, binds, ?).

Every method is scored with raw ranking (as in the main study) and with the
standard filtered ranking, in which other known true answers of the final hop
(in any split) are removed before the target's rank is computed. Hop
hallucination (HHR@1, Unsupported@10) is measured on the raw ranking, i.e. on
what the system actually returns.

Usage: python research/scripts/run_baseline_comparison.py [--workers N]
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import multiprocessing as mp
import statistics
import sys
import time
from itertools import product
from pathlib import Path

import numpy as np
import torch

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parent / "models"))
import run_hallucination_geometry_sweep as sweep  # noqa: E402
import run_main_rmf_rag_benchmark as bench  # noqa: E402
from relational_retrievers import MixedRSGD, MuRPStyle, TransEStyle  # noqa: E402

OUT = bench.ROOT / "research" / "results" / "baselines"
METHODS = ("euclidean", "poincare", "transe", "murp")
DIMS = (8, 16)
LR_GRID = (0.1, 0.3, 1.0)
SEEDS = sweep.SEEDS
TUNING_SEED = sweep.TUNING_SEED
TYPE_CODE = {"Gene": 0, "Disease": 1, "Compound": 2}
# Directed relation id for (anchor type, positive type).
REL = {(0, 1): 0, (1, 0): 1, (1, 2): 2, (2, 1): 3, (0, 2): 4, (2, 0): 5}
REL_TABLE = torch.full((3, 3), -1, dtype=torch.long)
for (a, b), r in REL.items():
    REL_TABLE[a, b] = r
DISEASE_TO_COMPOUND, GENE_TO_COMPOUND = REL[(1, 2)], REL[(0, 2)]

_DATA: dict = {}
_GRAPHS: dict = {}


def _init_worker(data: dict) -> None:
    torch.set_num_threads(1)
    _DATA.update(data)


def _seed_graph(seed: int):
    if seed not in _GRAPHS:
        _, _, graph, queries = bench._prepare_seed(_DATA["nodes"], _DATA["gd"], _DATA["dc"], _DATA["cg"], seed)
        codes = torch.tensor([TYPE_CODE[t] for t in graph["node_types"]], dtype=torch.long)
        _GRAPHS[seed] = (graph, queries, codes)
    return _GRAPHS[seed]


def train_relational(graph: dict, codes: torch.Tensor, seed: int, method: str, dim: int, lr: float):
    bench.set_seed(seed)
    cls = TransEStyle if method == "transe" else MuRPStyle
    model = cls(len(graph["nodes"]), len(REL), dim, sweep.MARGIN)
    optimizer = MixedRSGD(model, lr)
    first = last = float("nan")
    for epoch in range(sweep.EPOCHS):
        a, p, n = bench._epoch_triplets(graph, seed, epoch)
        r = REL_TABLE[codes[a], codes[p]]
        total, batches = 0.0, 0
        for s in range(0, a.numel(), sweep.BATCH_SIZE):
            sl = slice(s, s + sweep.BATCH_SIZE)
            optimizer.zero_grad()
            loss = model.triplet_loss(a[sl], r[sl], p[sl], n[sl])
            loss.backward()
            optimizer.step()
            total += float(loss.detach())
            batches += 1
        if epoch == 0:
            first = total / batches
        last = total / batches
    return model, first, last


def evaluate(graph: dict, queries: list[dict], distance_fn, dc_by_disease=None, cg_by_gene=None) -> dict:
    """Raw, filtered and hop-hallucination metrics for one method on one query set."""
    compounds = graph["compounds"]
    position = {c: i for i, c in enumerate(compounds)}
    dc_all = _DATA["dc_by_disease"] if dc_by_disease is None else dc_by_disease
    cg_all = _DATA["cg_by_gene"] if cg_by_gene is None else cg_by_gene
    acc = {k: 0.0 for k in ("mrr", "r1", "r5", "r10", "fmrr", "fr1", "fr5", "fr10",
                            "hhr1", "unsup10", "pv_hhr1", "pv_mrr")}
    for query in queries:
        dist = np.asarray(distance_fn(query), dtype=np.float64)
        order = np.argsort(dist, kind="stable")  # ties broken by compound id, as in the main study
        verified = bench.verified_compounds(query, graph)
        supported = np.array([graph["index"][("Compound", c)] in verified for c in compounds], dtype=bool)
        target = position[str(query["target_compound"])]
        rank_pos = np.empty(len(compounds), dtype=np.int64)
        rank_pos[order] = np.arange(len(compounds))
        rank = int(rank_pos[target]) + 1
        if int(query["hop"]) == 2:
            known = dc_all.get(str(query["disease"]), set())
        else:
            known = cg_all.get(str(query["bridge_gene"]), set())
        others = [position[c] for c in known if c in position and position[c] != target]
        frank = rank - int(sum(rank_pos[i] < rank_pos[target] for i in others))
        pv_order = np.concatenate([order[supported[order]], order[~supported[order]]])
        pv_rank = int(np.nonzero(pv_order == target)[0][0]) + 1
        acc["mrr"] += 1 / rank
        acc["fmrr"] += 1 / frank
        for k in (1, 5, 10):
            acc[f"r{k}"] += rank <= k
            acc[f"fr{k}"] += frank <= k
        acc["hhr1"] += not supported[order[0]]
        acc["unsup10"] += float((~supported[order[:10]]).sum()) / 10.0
        acc["pv_hhr1"] += not supported[pv_order[0]]
        acc["pv_mrr"] += 1 / pv_rank
    n = max(len(queries), 1)
    names = {"r1": "recall_at_1", "r5": "recall_at_5", "r10": "recall_at_10", "fmrr": "filtered_mrr",
             "fr1": "filtered_recall_at_1", "fr5": "filtered_recall_at_5", "fr10": "filtered_recall_at_10",
             "hhr1": "hhr_at_1", "unsup10": "unsupported_at_10", "pv_hhr1": "pv_hhr_at_1"}
    return {"queries": len(queries), **{names.get(k, k): v / n for k, v in acc.items()}}


def distance_function(method: str, graph: dict, trained):
    if method in ("euclidean", "poincare"):
        vectors = trained
        cand = np.array([graph["index"][("Compound", c)] for c in graph["compounds"]])
        cand_vecs = vectors[cand]

        def fn(query):
            q = bench._compose_query_vector(query, graph, vectors, poincare=method == "poincare")
            if method == "euclidean":
                return np.linalg.norm(cand_vecs - q, axis=1)
            return bench._poincare_distance_numpy(q, cand_vecs)
        return fn

    model = trained
    cand_t = torch.tensor([graph["index"][("Compound", c)] for c in graph["compounds"]], dtype=torch.long)

    def fn(query):
        if int(query["hop"]) == 2:
            head, rel = graph["index"][("Disease", str(query["disease"]))], DISEASE_TO_COMPOUND
        else:
            head, rel = graph["index"][("Gene", str(query["bridge_gene"]))], GENE_TO_COMPOUND
        return model.candidate_distances(head, rel, cand_t).numpy()
    return fn


def run_job(job: dict) -> list[dict]:
    start = time.time()
    graph, queries, codes = _seed_graph(job["seed"])
    if job["method"] in ("euclidean", "poincare"):
        trained, first, last, _ = sweep.train_one(graph, job["seed"], job["method"], job["dim"], 1.0, job["lr"])
    else:
        trained, first, last = train_relational(graph, codes, job["seed"], job["method"], job["dim"], job["lr"])
    fn = distance_function(job["method"], graph, trained)
    splits = ("2hop_validation", "3hop_validation") if job["phase"] == "tune" else (
        "2hop_validation", "3hop_validation", "2hop_test", "3hop_test")
    return [{**job, "split": s, "first_loss": first, "final_loss": last,
             "seconds": round(time.time() - start, 1), **evaluate(graph, queries[s], fn)} for s in splits]


def config(method: str, dim: int) -> str:
    return f"{method}_d{dim}"


def analyse(rows: list[dict]) -> tuple[list[dict], list[dict]]:
    by = {(r["config"], r["split"], r["seed"]): r for r in rows}
    metrics = ("mrr", "recall_at_10", "filtered_mrr", "filtered_recall_at_1", "filtered_recall_at_10",
               "hhr_at_1", "unsupported_at_10", "pv_hhr_at_1", "pv_mrr", "final_loss")
    summary = []
    for name in sorted({r["config"] for r in rows}):
        for split in ("2hop_test", "3hop_test", "2hop_validation", "3hop_validation"):
            sel = [by[(name, split, s)] for s in SEEDS]
            entry = {"config": name, "split": split, "seeds": len(sel)}
            for m in metrics:
                v = [float(r[m]) for r in sel]
                half = sweep.t_critical_975(len(v) - 1) * statistics.stdev(v) / math.sqrt(len(v))
                entry.update({f"{m}_mean": statistics.mean(v), f"{m}_ci95_low": statistics.mean(v) - half,
                              f"{m}_ci95_high": statistics.mean(v) + half})
            summary.append(entry)

    pairs = {"geometry_relational": ("murp", "transe"), "geometry_relation_free": ("poincare", "euclidean"),
             "relational_vs_free_euclidean": ("transe", "euclidean"),
             "relational_vs_free_hyperbolic": ("murp", "poincare")}
    comparisons, families = [], {}
    for family, (a, b) in pairs.items():
        for d in DIMS:
            for split in ("3hop_test", "2hop_test"):
                for metric in ("hhr_at_1", "filtered_mrr", "mrr"):
                    diffs = [float(by[(config(a, d), split, s)][metric]) - float(by[(config(b, d), split, s)][metric])
                             for s in SEEDS]
                    comparisons.append({"family": family, "a": config(a, d), "b": config(b, d), "dim": d,
                                        "split": split, "metric": metric, **sweep.paired_test(diffs)})
                    families.setdefault((family, split, metric), []).append(len(comparisons) - 1)
    for idx in families.values():
        for i, p in zip(idx, sweep.holm([comparisons[i]["p"] for i in idx])):
            comparisons[i]["p_holm"] = p
    return summary, comparisons


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workers", type=int, default=max(1, (mp.cpu_count() or 2) - 1))
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)

    snapshot = bench.ensure_snapshot()
    raw, nodes = bench.load_snapshot(snapshot)
    gd, dc, cg, _ = bench.relation_sets(bench.selected_edges(raw))
    bench.validate_relation_counts(gd, dc, cg)
    keep = ({("Gene", g) for g, _ in gd} | {("Gene", g) for g, _ in cg} | {("Disease", d) for _, d in gd}
            | {("Disease", d) for d, _ in dc} | {("Compound", c) for _, c in dc} | {("Compound", c) for _, c in cg})
    dc_by_disease: dict[str, set[str]] = {}
    for d, c in dc:
        dc_by_disease.setdefault(d, set()).add(c)
    cg_by_gene: dict[str, set[str]] = {}
    for g, c in cg:
        cg_by_gene.setdefault(g, set()).add(c)
    data = {"nodes": {k: v for k, v in nodes.items() if k in keep}, "gd": gd, "dc": dc, "cg": cg,
            "dc_by_disease": dc_by_disease, "cg_by_gene": cg_by_gene}
    del raw, nodes

    with mp.get_context("spawn").Pool(args.workers, initializer=_init_worker, initargs=(data,)) as pool:
        tune_jobs = [{"phase": "tune", "config": config(m, d), "method": m, "dim": d, "lr": lr, "seed": TUNING_SEED}
                     for m, d, lr in product(METHODS, DIMS, LR_GRID)]
        tune_rows = [r for rows in pool.imap_unordered(run_job, tune_jobs) for r in rows]
        sweep.write_csv(OUT / "tuning.csv", tune_rows)
        selected = {}
        for name in sorted({j["config"] for j in tune_jobs}):
            score = {lr: statistics.mean(float(r["mrr"]) for r in tune_rows if r["config"] == name and r["lr"] == lr)
                     for lr in LR_GRID}
            selected[name] = max(LR_GRID, key=lambda lr: (score[lr], -lr))
        print("Selected learning rates:", json.dumps(selected, sort_keys=True), flush=True)

        final_jobs = [{"phase": "final", "config": config(m, d), "method": m, "dim": d,
                       "lr": selected[config(m, d)], "seed": s} for m, d, s in product(METHODS, DIMS, SEEDS)]
        rows, done = [], 0
        for out in pool.imap_unordered(run_job, final_jobs):
            rows.extend(out)
            done += 1
            r3 = next(r for r in out if r["split"] == "3hop_test")
            print(f"final {done:3d}/{len(final_jobs)} {r3['config']:14s} seed={r3['seed']:<4} "
                  f"3hop fMRR={r3['filtered_mrr']:.3f} HHR@1={r3['hhr_at_1']:.3f}", flush=True)

    rows.sort(key=lambda r: (r["config"], r["seed"], r["split"]))
    sweep.write_csv(OUT / "per_seed.csv", rows)
    summary, comparisons = analyse(rows)
    sweep.write_csv(OUT / "summary.csv", summary)
    sweep.write_csv(OUT / "comparisons.csv", comparisons)
    (OUT / "metadata.json").write_text(json.dumps({
        "analysis": "additional baseline comparison (not pre-registered)",
        "snapshot_sha256": bench.sha256_file(snapshot), "selected_learning_rates": selected,
        "methods": METHODS, "dims": DIMS, "lr_grid": LR_GRID, "epochs": sweep.EPOCHS, "seeds": SEEDS,
        "completed_at": dt.datetime.now().isoformat(timespec="seconds"),
    }, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT}", flush=True)


if __name__ == "__main__":
    main()
