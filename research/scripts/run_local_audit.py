"""Repeat the unchanged pilot across five seeds, including all held-out links.

This extends evaluation coverage; it does not implement a new retrieval method.
Training budgets are inherited from the original pilot and remain unequal.
"""
from __future__ import annotations

import csv
import hashlib
import json
import math
import platform
import random
import statistics
import time
from pathlib import Path

import numpy as np

import run_rmf_rag_experiment as pilot

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "local-run/extended"
SEEDS = (7, 17, 29, 43, 101)
METRICS = ("recall_at_1", "recall_at_3", "recall_at_5", "recall_at_10", "mrr")


def metrics_from_predictions(rows: list[dict]) -> dict:
    """Missing-vocabulary answers count as misses in the full denominator."""
    if not rows:
        raise ValueError("Cannot score an empty evaluation set.")
    ranks = [row["target_rank"] for row in rows]
    result = {f"recall_at_{k}": sum(rank is not None and rank <= k for rank in ranks) / len(ranks)
              for k in (1, 3, 5, 10)}
    result["mrr"] = sum(1 / rank if rank is not None else 0 for rank in ranks) / len(ranks)
    return result


def run_seed(seed: int) -> list[dict]:
    pilot.SEED = seed
    pairs = pilot.load_pairs()
    train, recoverable, held_out = pilot.make_split(pairs, random.Random(seed))
    graph = pilot.build_graph(train)
    candidates = set(graph["drugs"])
    in_vocab = [(d, drug) for d, drug in held_out if drug in candidates]
    missing = [(d, drug) for d, drug in held_out if drug not in candidates]
    recoverable_set = set(recoverable)
    folder = OUTPUT / f"seed{seed}"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "split.json").write_text(json.dumps({"seed": seed, "train": train,
        "held_out": held_out, "recoverable": recoverable, "missing_vocabulary": missing}, indent=2), encoding="utf-8")
    print(f"Seed {seed}: {len(held_out)} held-out; {len(recoverable)} recoverable; {len(missing)} out of vocabulary", flush=True)
    start = time.perf_counter()
    euclidean = pilot.train_euclidean(graph)
    euclidean_seconds = time.perf_counter() - start
    start = time.perf_counter()
    hyperbolic = pilot.train_poincare(graph)
    hyperbolic_seconds = time.perf_counter() - start
    np.savez_compressed(folder / "embeddings.npz", euclidean=euclidean, hyperbolic=hyperbolic)
    (folder / "nodes.json").write_text(json.dumps(graph["nodes"]), encoding="utf-8")
    results = []
    for method, vectors, seconds in (("lexical_baseline", None, 0),
                                    ("euclidean", euclidean, euclidean_seconds),
                                    ("rmf_rag_hyperbolic", hyperbolic, hyperbolic_seconds)):
        _, predicted = pilot.evaluate(method, in_vocab, graph, train, vectors)
        rows = [{**row, "seed": seed, "in_candidate_vocabulary": True,
                 "recoverable": (row["disease"], row["target_drug"]) in recoverable_set} for row in predicted]
        rows.extend({"model": method, "seed": seed, "disease": d, "target_drug": drug,
                     "target_rank": None, "in_candidate_vocabulary": False, "recoverable": False}
                    for d, drug in missing)
        rows.sort(key=lambda row: row["disease"])
        with (folder / f"{method}_predictions.jsonl").open("w", encoding="utf-8") as handle:
            for row in rows:
                handle.write(json.dumps(row) + "\n")
        for subset, selected in (("all_held_out", rows),
                                 ("recoverable", [row for row in rows if row["recoverable"]])):
            result = {"seed": seed, "subset": subset, "model": method, "queries": len(selected),
                      "missing_vocabulary": len(missing) if subset == "all_held_out" else 0,
                      "training_seconds": seconds, **metrics_from_predictions(selected)}
            results.append(result)
            print(f"  {method} / {subset}: R@5={result['recall_at_5']:.4f}, MRR={result['mrr']:.4f}", flush=True)
    return results


def aggregate(rows: list[dict]) -> list[dict]:
    summary = []
    groups = sorted({(row["subset"], row["model"]) for row in rows})
    for subset, model in groups:
        selected = [row for row in rows if row["subset"] == subset and row["model"] == model]
        for metric in METRICS:
            values = [row[metric] for row in selected]
            mean = statistics.mean(values)
            sd = statistics.stdev(values)
            # Student t, df=4, two-sided 95%. Seed variability only, not a
            # population-level interval: the same dataset is reused each run.
            half_width = 2.7764451051977987 * sd / math.sqrt(len(values))
            summary.append({"subset": subset, "model": model, "metric": metric,
                            "seeds": len(values), "mean": mean, "std": sd,
                            "seed_t95_low": mean - half_width, "seed_t95_high": mean + half_width})
    return summary


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    provenance = {"source_commit": "e8d4e1c594a773f6d117079db8553ba84394d47d",
                  "python": platform.python_version(), "numpy": np.__version__, "platform": platform.platform(),
                  "seeds": SEEDS, "started_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                  "note": "Exploratory seed sensitivity audit of unchanged pilot, not matched-budget or paper-baseline comparison."}
    for name, path in (("dataset", pilot.DATA_PATH), ("pilot", Path(pilot.__file__)), ("audit", Path(__file__))):
        provenance[f"{name}_sha256"] = hashlib.sha256(path.read_bytes()).hexdigest()
    (OUTPUT / "provenance.json").write_text(json.dumps(provenance, indent=2), encoding="utf-8")
    rows = []
    for seed in SEEDS:
        rows.extend(run_seed(seed))
        (OUTPUT / "metrics.json").write_text(json.dumps(rows, indent=2), encoding="utf-8")
    summary = aggregate(rows)
    for name, data in (("metrics_by_seed.csv", rows), ("aggregate_metrics.csv", summary)):
        with (OUTPUT / name).open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(data[0]))
            writer.writeheader()
            writer.writerows(data)
    lines = ["# Five-seed pilot audit", "", "Seeds: 7, 17, 29, 43, 101. Original algorithms and unequal training budgets retained.",
             "All-held-out scores include out-of-vocabulary answers as misses. Recoverable is the original selected subset.", "",
             "| Subset | Method | Mean Recall@1 | Mean Recall@5 | Mean MRR |", "|---|---|---:|---:|---:|"]
    for subset, model in sorted({(row["subset"], row["model"]) for row in rows}):
        values = {row["metric"]: row["mean"] for row in summary if row["subset"] == subset and row["model"] == model}
        lines.append(f"| {subset} | {model} | {values['recall_at_1']:.2%} | {values['recall_at_5']:.2%} | {values['mrr']:.5f} |")
    lines += ["", "aggregate_metrics.csv includes SD and exploratory t intervals across seeds (df=4). They describe seed sensitivity only; overlapping splits are not independent datasets.",
              "No cited-paper model has been evaluated here. Hyperbolic geometry alone is not a new contribution.",
              "All per-query ranks, splits, model vectors, software versions, and hashes are saved in this directory."]
    (OUTPUT / "summary.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("Audit complete.", flush=True)


if __name__ == "__main__":
    main()
