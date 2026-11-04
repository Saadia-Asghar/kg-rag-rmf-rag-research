"""Pre-registered sweep: does Poincare geometry reduce multi-hop hallucination?

Hop hallucination (graph-grounded definition): a retrieved compound is
*unsupported* when no exact typed path connects the query to it in the
training graph (2-hop: disease-treats-compound; 3-hop: disease-associated
gene-binds-compound). Held-out answer edges are removed before training, as in
run_main_rmf_rag_benchmark.py.

The pre-registration (hypothesis, configurations, metrics, statistics) is
written to results/hallucination_sweep/preregistration.json before any model
is trained. Learning rates are selected on seed-7 validation MRR only; test
queries are evaluated only in the final phase.

Usage: python research/scripts/run_hallucination_geometry_sweep.py [--workers N]
"""
from __future__ import annotations

import argparse
import csv
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

sys.path.insert(0, str(Path(__file__).resolve().parent))
import run_main_rmf_rag_benchmark as bench  # noqa: E402

OUT = bench.ROOT / "research" / "results" / "hallucination_sweep"

DIMS = (2, 4, 8, 16)
CURVATURES = (1.0, 10.0)
LR_GRID = (0.1, 0.3, 1.0)
EPOCHS = 150
BATCH_SIZE = 256
MARGIN = bench.MARGIN
TUNING_SEED = 7
SEEDS = (7, 17, 29, 43, 101, 211, 307, 401, 503, 601)
NEW_SEEDS = (211, 307, 401, 503, 601)

PREREGISTRATION = {
    "title": "Does Poincare geometry reduce multi-hop hallucination in biomedical KG retrieval?",
    "motivation": (
        "Exploratory observation from the 16-d, curvature-1, 60-epoch run (seeds 7-101): "
        "Poincare top-1 answers on 3-hop test queries were path-supported more often than "
        "Euclidean answers in 5/5 seeds (mean +0.133, 95% CI [-0.043, 0.309]); on 2-hop they "
        "were less often supported (-0.090). This sweep tests whether the 3-hop effect is real "
        "and whether it grows in the regime where hyperbolic geometry is expected to help "
        "(low dimension, higher curvature, longer training)."
    ),
    "definition_hop_hallucination": (
        "HHR@1 = fraction of queries whose top-1 compound has no exact typed path from the query "
        "in the training graph. Unsupported@10 = mean fraction of the top-10 compounds without such a path."
    ),
    "primary_hypothesis": (
        "H1: on 3-hop test queries, Poincare retrieval has a different (expected: lower) HHR@1 "
        "than Euclidean retrieval of the same dimension."
    ),
    "primary_test": (
        "For each of the 8 Poincare configurations (dims 2,4,8,16 x curvature 1,10) versus the "
        "Euclidean model of the same dimension: two-sided paired t-test over the 10 seeds on "
        "per-seed 3-hop test HHR@1; Holm-Bonferroni correction across the 8 comparisons at alpha 0.05. "
        "Exact two-sided sign test reported alongside."
    ),
    "secondary_outcomes": [
        "3-hop test Unsupported@10 (same test and correction)",
        "3-hop test MRR (accuracy must be reported next to hallucination; a lower HHR with lower MRR is not an improvement)",
        "2-hop test HHR@1, Unsupported@10 and MRR",
        "Effect of typed-path verification reranking on HHR@1 and MRR for both geometries",
        "Sensitivity analysis: primary test restricted to the 5 seeds never inspected before (211, 307, 401, 503, 601)",
    ],
    "fixed_settings": {
        "dims": DIMS, "poincare_curvatures": CURVATURES, "lr_grid": LR_GRID, "epochs": EPOCHS,
        "batch_size": BATCH_SIZE, "margin": MARGIN, "seeds": SEEDS, "tuning_seed": TUNING_SEED,
        "lr_selection": "per configuration, highest mean of 2-hop and 3-hop validation MRR on the tuning seed",
        "query_cap": bench.QUERY_CAP,
    },
    "curvature_implementation": (
        "Models are trained on the ball of radius 1/sqrt(c). For evaluation, vectors are multiplied "
        "by sqrt(c); geodesic distances then scale by 1/sqrt(c) and origin log/exp maps commute with "
        "the scaling, so rankings equal those of the curvature-c model."
    ),
}

_DATA: dict = {}
_GRAPHS: dict = {}


def _init_worker(data: dict) -> None:
    torch.set_num_threads(1)
    _DATA.update(data)


def _seed_graph(seed: int):
    if seed not in _GRAPHS:
        _, _, graph, queries = bench._prepare_seed(
            _DATA["nodes"], _DATA["gd"], _DATA["dc"], _DATA["cg"], seed
        )
        _GRAPHS[seed] = (graph, queries)
    return _GRAPHS[seed]


def train_one(graph: dict, seed: int, geometry: str, dim: int, curvature: float, lr: float):
    config = bench.RetrieverConfig(
        num_nodes=len(graph["nodes"]), dim=dim, margin=MARGIN, curvature=curvature
    )
    bench.set_seed(seed)
    if geometry == "euclidean":
        model = bench.EuclideanRetriever(config)
        optimizer = torch.optim.SGD(model.parameters(), lr=lr)
    else:
        model = bench.PoincareRetriever(config)
        optimizer = bench.PoincareRSGD(model, lr=lr)

    first_loss = last_loss = float("nan")
    for epoch in range(EPOCHS):
        anchor, positive, negative = bench._epoch_triplets(graph, seed, epoch)
        total, batches = 0.0, 0
        for start in range(0, anchor.numel(), BATCH_SIZE):
            optimizer.zero_grad()
            loss = model.triplet_loss(
                anchor[start:start + BATCH_SIZE],
                positive[start:start + BATCH_SIZE],
                negative[start:start + BATCH_SIZE],
            )
            loss.backward()
            optimizer.step()
            total += float(loss.detach())
            batches += 1
        if epoch == 0:
            first_loss = total / batches
        last_loss = total / batches

    if geometry == "euclidean":
        vectors = model.embedding.weight.detach().cpu().numpy().astype(np.float64)
    else:
        vectors = model.embedding.detach().cpu().numpy().astype(np.float64) * math.sqrt(curvature)
    max_norm = float(np.linalg.norm(vectors, axis=1).max())  # Poincare: norm in the unit-ball picture
    return vectors, first_loss, last_loss, max_norm


def evaluate(graph: dict, queries: list[dict], vectors: np.ndarray, geometry: str) -> dict:
    method = "euclidean" if geometry == "euclidean" else "poincare"
    stats = {
        variant: {"mrr": 0.0, "r1": 0, "r5": 0, "r10": 0, "hhr1": 0, "unsup10": 0.0}
        for variant in ("base", "pv")
    }
    for query in queries:
        ranking = bench.rank_query(
            method=method, query=query, graph=graph, vectors=vectors, docs={}, idf={}
        )
        verified_ids = bench.verified_compounds(query, graph)
        supported = {c for c in ranking if graph["index"][("Compound", c)] in verified_ids}
        reranked = sorted(ranking, key=lambda c: c not in supported)  # stable: keeps distance order
        target = str(query["target_compound"])
        for variant, ranked in (("base", ranking), ("pv", reranked)):
            s = stats[variant]
            rank = ranked.index(target) + 1
            s["mrr"] += 1.0 / rank
            s["r1"] += rank <= 1
            s["r5"] += rank <= 5
            s["r10"] += rank <= 10
            s["hhr1"] += ranked[0] not in supported
            s["unsup10"] += sum(c not in supported for c in ranked[:10]) / 10.0
    n = max(len(queries), 1)
    out = {"queries": len(queries)}
    for variant, s in stats.items():
        prefix = "" if variant == "base" else "pv_"
        out[f"{prefix}mrr"] = s["mrr"] / n
        out[f"{prefix}recall_at_1"] = s["r1"] / n
        out[f"{prefix}recall_at_5"] = s["r5"] / n
        out[f"{prefix}recall_at_10"] = s["r10"] / n
        out[f"{prefix}hhr_at_1"] = s["hhr1"] / n
        out[f"{prefix}unsupported_at_10"] = s["unsup10"] / n
    return out


def run_job(job: dict) -> list[dict]:
    start = time.time()
    graph, queries = _seed_graph(job["seed"])
    vectors, first_loss, last_loss, max_norm = train_one(
        graph, job["seed"], job["geometry"], job["dim"], job["curvature"], job["lr"]
    )
    splits = ("2hop_validation", "3hop_validation") if job["phase"] == "tune" else (
        "2hop_validation", "3hop_validation", "2hop_test", "3hop_test")
    rows = []
    for split in splits:
        metrics = evaluate(graph, queries[split], vectors, job["geometry"])
        rows.append({**job, "split": split, "first_loss": first_loss, "final_loss": last_loss,
                     "max_norm": max_norm, "seconds": round(time.time() - start, 1), **metrics})
    return rows


def config_name(geometry: str, dim: int, curvature: float) -> str:
    return f"euclidean_d{dim}" if geometry == "euclidean" else f"poincare_d{dim}_c{curvature:g}"


def configs() -> list[tuple[str, int, float]]:
    return [("euclidean", d, 1.0) for d in DIMS] + [
        ("poincare", d, c) for d, c in product(DIMS, CURVATURES)
    ]


# ---------------------------------------------------------------- statistics
def _betacf(a: float, b: float, x: float) -> float:
    tiny, qab, qap, qam = 1e-300, a + b, a + 1.0, a - 1.0
    c, d = 1.0, 1.0 - qab * x / qap
    d = 1.0 / (d if abs(d) > tiny else tiny)
    h = d
    for m in range(1, 300):
        m2 = 2 * m
        aa = m * (b - m) * x / ((qam + m2) * (a + m2))
        d = 1.0 + aa * d
        d = 1.0 / (d if abs(d) > tiny else tiny)
        c = 1.0 + aa / c
        c = c if abs(c) > tiny else tiny
        h *= d * c
        aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2))
        d = 1.0 + aa * d
        d = 1.0 / (d if abs(d) > tiny else tiny)
        c = 1.0 + aa / c
        c = c if abs(c) > tiny else tiny
        delta = d * c
        h *= delta
        if abs(delta - 1.0) < 1e-14:
            break
    return h


def betainc(a: float, b: float, x: float) -> float:
    if x <= 0.0:
        return 0.0
    if x >= 1.0:
        return 1.0
    log_bt = (math.lgamma(a + b) - math.lgamma(a) - math.lgamma(b)
              + a * math.log(x) + b * math.log(1.0 - x))
    if x < (a + 1.0) / (a + b + 2.0):
        return math.exp(log_bt) * _betacf(a, b, x) / a
    return 1.0 - math.exp(log_bt) * _betacf(b, a, 1.0 - x) / b


def t_two_sided_p(t: float, df: int) -> float:
    return betainc(df / 2.0, 0.5, df / (df + t * t))


def t_critical_975(df: int) -> float:
    lo, hi = 0.0, 50.0
    for _ in range(200):
        mid = (lo + hi) / 2
        if t_two_sided_p(mid, df) > 0.05:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def paired_test(diffs: list[float]) -> dict:
    n = len(diffs)
    mean = statistics.mean(diffs)
    sd = statistics.stdev(diffs) if n > 1 else 0.0
    se = sd / math.sqrt(n) if n > 1 else 0.0
    t = mean / se if se > 0 else (0.0 if mean == 0 else math.copysign(float("inf"), mean))
    p = t_two_sided_p(t, n - 1) if math.isfinite(t) else 0.0
    half = t_critical_975(n - 1) * se
    pos = sum(d > 0 for d in diffs)
    neg = sum(d < 0 for d in diffs)
    k, m = min(pos, neg), pos + neg
    sign_p = min(1.0, 2 * sum(math.comb(m, i) for i in range(k + 1)) / 2 ** m) if m else 1.0
    return {"n": n, "mean_diff": mean, "ci95_low": mean - half, "ci95_high": mean + half,
            "t": t, "p": p, "positive": pos, "negative": neg, "sign_test_p": sign_p}


def holm(pvalues: list[float]) -> list[float]:
    order = sorted(range(len(pvalues)), key=lambda i: pvalues[i])
    adjusted = [0.0] * len(pvalues)
    running = 0.0
    for rank, i in enumerate(order):
        running = max(running, min(1.0, (len(pvalues) - rank) * pvalues[i]))
        adjusted[i] = running
    return adjusted


# ---------------------------------------------------------------- driver
def write_csv(path: Path, rows: list[dict]) -> None:
    keys: list[str] = []
    for row in rows:
        keys.extend(k for k in row if k not in keys)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=keys)
        writer.writeheader()
        writer.writerows(rows)


def analyse(final_rows: list[dict]) -> tuple[list[dict], list[dict]]:
    by = {(r["config"], r["split"], r["seed"]): r for r in final_rows}
    summary = []
    for name in sorted({r["config"] for r in final_rows}):
        for split in ("2hop_test", "3hop_test", "2hop_validation", "3hop_validation"):
            rows = [by[(name, split, s)] for s in SEEDS if (name, split, s) in by]
            if not rows:
                continue
            entry = {"config": name, "split": split, "seeds": len(rows)}
            for metric in ("mrr", "recall_at_10", "hhr_at_1", "unsupported_at_10",
                           "pv_mrr", "pv_recall_at_10", "pv_hhr_at_1", "max_norm", "final_loss"):
                values = [float(r[metric]) for r in rows]
                mean = statistics.mean(values)
                half = t_critical_975(len(values) - 1) * statistics.stdev(values) / math.sqrt(len(values))
                entry[f"{metric}_mean"] = mean
                entry[f"{metric}_ci95_low"] = mean - half
                entry[f"{metric}_ci95_high"] = mean + half
            summary.append(entry)

    comparisons = []
    families: dict[tuple, list[int]] = {}
    for d, c in product(DIMS, CURVATURES):
        p_name, e_name = config_name("poincare", d, c), config_name("euclidean", d, 1.0)
        for split in ("3hop_test", "2hop_test"):
            for metric in ("hhr_at_1", "unsupported_at_10", "mrr"):
                for seed_set, label in ((SEEDS, "all_10_seeds"), (NEW_SEEDS, "new_5_seeds")):
                    diffs = [float(by[(p_name, split, s)][metric]) - float(by[(e_name, split, s)][metric])
                             for s in seed_set]
                    result = paired_test(diffs)
                    comparisons.append({"poincare": p_name, "euclidean": e_name, "dim": d, "curvature": c,
                                        "split": split, "metric": metric, "seed_set": label,
                                        "per_seed_diffs": " ".join(f"{x:+.3f}" for x in diffs), **result})
                    families.setdefault((split, metric, label), []).append(len(comparisons) - 1)
    for indices in families.values():
        adjusted = holm([comparisons[i]["p"] for i in indices])
        for i, p_adj in zip(indices, adjusted):
            comparisons[i]["p_holm"] = p_adj
            comparisons[i]["primary"] = (
                comparisons[i]["split"] == "3hop_test" and comparisons[i]["metric"] == "hhr_at_1"
                and comparisons[i]["seed_set"] == "all_10_seeds"
            )
    return summary, comparisons


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workers", type=int, default=max(1, (mp.cpu_count() or 2) - 1))
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)

    prereg_path = OUT / "preregistration.json"
    if not prereg_path.exists():
        prereg = {**PREREGISTRATION, "written_at": dt.datetime.now().isoformat(timespec="seconds")}
        prereg_path.write_text(json.dumps(prereg, indent=2) + "\n", encoding="utf-8")
    print(f"Pre-registration: {prereg_path}", flush=True)

    snapshot = bench.ensure_snapshot()
    raw, nodes = bench.load_snapshot(snapshot)
    gd, dc, cg, _ = bench.relation_sets(bench.selected_edges(raw))
    bench.validate_relation_counts(gd, dc, cg)
    keep = ({("Gene", g) for g, _ in gd} | {("Gene", g) for g, _ in cg}
            | {("Disease", d) for _, d in gd} | {("Disease", d) for d, _ in dc}
            | {("Compound", c) for _, c in dc} | {("Compound", c) for _, c in cg})
    data = {"nodes": {k: v for k, v in nodes.items() if k in keep}, "gd": gd, "dc": dc, "cg": cg}
    del raw, nodes

    ctx = mp.get_context("spawn")
    with ctx.Pool(args.workers, initializer=_init_worker, initargs=(data,)) as pool:
        tune_jobs = [
            {"phase": "tune", "config": config_name(g, d, c), "geometry": g, "dim": d,
             "curvature": c, "lr": lr, "seed": TUNING_SEED}
            for (g, d, c), lr in product(configs(), LR_GRID)
        ]
        tune_rows: list[dict] = []
        for rows in pool.imap_unordered(run_job, tune_jobs):
            tune_rows.extend(rows)
            r = rows[-1]
            print(f"tune {r['config']:18s} lr={r['lr']:<4} loss {r['first_loss']:.3f}->{r['final_loss']:.3f} "
                  f"({r['seconds']}s)", flush=True)
        write_csv(OUT / "tuning.csv", tune_rows)

        selected = {}
        for name in sorted({j["config"] for j in tune_jobs}):
            scores = {}
            for lr in LR_GRID:
                rows = [r for r in tune_rows if r["config"] == name and r["lr"] == lr]
                scores[lr] = statistics.mean(float(r["mrr"]) for r in rows)
            selected[name] = max(LR_GRID, key=lambda lr: (scores[lr], -lr))
        print("Selected learning rates:", json.dumps(selected, sort_keys=True), flush=True)

        final_jobs = [
            {"phase": "final", "config": config_name(g, d, c), "geometry": g, "dim": d,
             "curvature": c, "lr": selected[config_name(g, d, c)], "seed": seed}
            for (g, d, c), seed in product(configs(), SEEDS)
        ]
        final_rows: list[dict] = []
        done = 0
        for rows in pool.imap_unordered(run_job, final_jobs):
            final_rows.extend(rows)
            done += 1
            r3 = next(r for r in rows if r["split"] == "3hop_test")
            print(f"final {done:3d}/{len(final_jobs)} {r3['config']:18s} seed={r3['seed']:<4} "
                  f"3hop MRR={r3['mrr']:.3f} HHR@1={r3['hhr_at_1']:.3f}", flush=True)

    final_rows.sort(key=lambda r: (r["config"], r["seed"], r["split"]))
    write_csv(OUT / "per_seed.csv", final_rows)
    summary, comparisons = analyse(final_rows)
    write_csv(OUT / "summary.csv", summary)
    write_csv(OUT / "comparisons.csv", comparisons)
    (OUT / "metadata.json").write_text(json.dumps({
        "dataset": "Hetionet v1.0", "snapshot_sha256": bench.sha256_file(snapshot),
        "selected_learning_rates": selected, "completed_at": dt.datetime.now().isoformat(timespec="seconds"),
        "torch_version": torch.__version__, "numpy_version": np.__version__,
    }, indent=2) + "\n", encoding="utf-8")

    print("\nPRIMARY (3-hop test HHR@1, Poincare - Euclidean, 10 seeds, Holm):", flush=True)
    for c in comparisons:
        if c.get("primary"):
            print(f"  {c['poincare']:18s} diff={c['mean_diff']:+.3f} [{c['ci95_low']:+.3f},{c['ci95_high']:+.3f}] "
                  f"p={c['p']:.4f} p_holm={c['p_holm']:.4f} sign {c['negative']}-/{c['positive']}+", flush=True)
    print(f"Wrote {OUT}", flush=True)


if __name__ == "__main__":
    main()
