#!/usr/bin/env python3
"""Matched five-seed Euclidean vs Poincare retrieval experiment.

This runner uses the repository's existing disease-drug pilot data. It is a
controlled geometry experiment, not the full gene-disease-compound benchmark.
The Euclidean and Poincare models use identical node IDs, graph edges, negative
samples, dimensionality, margins and epoch counts.

Outputs are written to research/results/controlled_geometry/.
"""
from __future__ import annotations

import csv
import json
import math
import random
import re
import statistics
import sys
from collections import defaultdict
from pathlib import Path

import torch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from research.models.controlled_retrievers import (  # noqa: E402
    EuclideanRetriever,
    PoincareRetriever,
    PoincareRSGD,
    RetrieverConfig,
    rank_candidates,
    set_seed,
)

DATA_PATH = ROOT / "research" / "data" / "disease_drug_kaggle.json"
OUT_DIR = ROOT / "research" / "results" / "controlled_geometry"
SEEDS = [7, 17, 29, 43, 101]
DIM = 16
# The pilot has no validation split, so its optimisation settings are fixed in
# advance and transferred from the Hetionet benchmark, where they were selected
# on validation MRR only (both geometries selected lr = 0.1). The pilot test
# set is never used for tuning.
EPOCHS = 60
BATCH_SIZE = 256
MARGIN = 0.45
EUCLIDEAN_LR = 0.1
POINCARE_LR = 0.1
CURVATURE = 1.0

STOPWORDS = {
    "a", "an", "and", "at", "by", "disorder", "disease", "for", "in",
    "of", "or", "the", "to", "type", "with",
}


def normalize(value: str) -> str:
    value = value.lower().replace("’", "'")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def parse_disease(question: str) -> str:
    match = re.search(
        r"^Disease:\s*(.*?)\.\s*What is the recommended drug\?", question, re.I
    )
    return normalize(match.group(1) if match else question)


def tokens(value: str) -> set[str]:
    return {
        token for token in normalize(value).split()
        if len(token) >= 4 and token not in STOPWORDS
    }


def load_pairs() -> list[tuple[str, str]]:
    records = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    pairs = {
        (parse_disease(row["input"]), normalize(row["output"]))
        for row in records
    }
    return sorted(pairs)


def make_split(pairs: list[tuple[str, str]], seed: int):
    rng = random.Random(seed)
    by_disease: dict[str, list[str]] = defaultdict(list)
    for disease, drug in pairs:
        by_disease[disease].append(drug)

    train = set(pairs)
    held_out: list[tuple[str, str]] = []
    for disease, drugs in sorted(by_disease.items()):
        if len(drugs) >= 2:
            chosen = rng.choice(sorted(drugs))
            train.remove((disease, chosen))
            held_out.append((disease, chosen))

    train_drugs = {drug for _, drug in train}
    disease_tokens = {disease: tokens(disease) for disease in by_disease}
    token_to_drugs: dict[str, set[str]] = defaultdict(set)
    for disease, drug in train:
        for token in disease_tokens[disease]:
            token_to_drugs[token].add(drug)

    recoverable = [
        (disease, drug)
        for disease, drug in held_out
        if drug in train_drugs
        and any(drug in token_to_drugs[token] for token in disease_tokens[disease])
    ]
    return sorted(train), sorted(recoverable), sorted(held_out)


def build_graph(train: list[tuple[str, str]]):
    diseases = sorted({d for d, _ in train})
    drugs = sorted({drug for _, drug in train})
    disease_tokens = {disease: tokens(disease) for disease in diseases}
    token_values = sorted({t for values in disease_tokens.values() for t in values})

    nodes = (
        [f"disease::{d}" for d in diseases]
        + [f"token::{t}" for t in token_values]
        + [f"drug::{d}" for d in drugs]
    )
    index = {node: i for i, node in enumerate(nodes)}
    node_type: list[str] = (
        ["disease"] * len(diseases)
        + ["token"] * len(token_values)
        + ["drug"] * len(drugs)
    )
    by_type: dict[str, list[int]] = defaultdict(list)
    for i, kind in enumerate(node_type):
        by_type[kind].append(i)

    edges: set[tuple[int, int]] = set()
    neighbours: dict[int, set[int]] = defaultdict(set)
    for disease, drug in train:
        disease_id = index[f"disease::{disease}"]
        drug_id = index[f"drug::{drug}"]
        edges.add((disease_id, drug_id))
        for token in disease_tokens[disease]:
            token_id = index[f"token::{token}"]
            edges.add((disease_id, token_id))
            edges.add((token_id, drug_id))

    for left, right in edges:
        neighbours[left].add(right)
        neighbours[right].add(left)

    return {
        "nodes": nodes,
        "index": index,
        "node_type": node_type,
        "by_type": dict(by_type),
        "edges": sorted(edges),
        "neighbours": neighbours,
        "drugs": drugs,
    }


def epoch_triplets(graph: dict, seed: int, epoch: int):
    """Generate the exact same type-matched negatives for both geometries."""
    rng = random.Random(seed * 100_003 + epoch)
    order = list(range(len(graph["edges"])))
    rng.shuffle(order)
    anchors, positives, negatives = [], [], []

    for edge_idx in order:
        left, right = graph["edges"][edge_idx]
        candidates = graph["by_type"][graph["node_type"][right]]
        forbidden = graph["neighbours"].get(left, set())
        valid = [c for c in candidates if c != right and c not in forbidden]
        if not valid:
            continue
        negative = rng.choice(valid)
        anchors.append(left)
        positives.append(right)
        negatives.append(negative)

    return (
        torch.tensor(anchors, dtype=torch.long),
        torch.tensor(positives, dtype=torch.long),
        torch.tensor(negatives, dtype=torch.long),
    )


def train_models(graph: dict, seed: int):
    set_seed(seed)
    config = RetrieverConfig(
        num_nodes=len(graph["nodes"]), dim=DIM, margin=MARGIN,
        curvature=CURVATURE,
    )
    euclidean = EuclideanRetriever(config)
    set_seed(seed)
    poincare = PoincareRetriever(config)
    # Matched optimisers: plain SGD in Euclidean space and Riemannian SGD on the
    # Poincare ball, identical mini-batches, batch order and epoch budget.
    e_opt = torch.optim.SGD(euclidean.parameters(), lr=EUCLIDEAN_LR)
    p_opt = PoincareRSGD(poincare, lr=POINCARE_LR)

    history = []
    for epoch in range(EPOCHS):
        a_all, p_all, n_all = epoch_triplets(graph, seed, epoch)
        if a_all.numel() == 0:
            raise RuntimeError("No valid triplets were generated")

        e_total = p_total = 0.0
        batches = 0
        for start in range(0, a_all.numel(), BATCH_SIZE):
            a = a_all[start:start + BATCH_SIZE]
            p = p_all[start:start + BATCH_SIZE]
            n = n_all[start:start + BATCH_SIZE]

            e_opt.zero_grad()
            e_loss = euclidean.triplet_loss(a, p, n)
            e_loss.backward()
            e_opt.step()

            p_opt.zero_grad()
            p_loss = poincare.triplet_loss(a, p, n)
            p_loss.backward()
            p_opt.step()

            e_total += float(e_loss.detach())
            p_total += float(p_loss.detach())
            batches += 1

        history.append({
            "epoch": epoch + 1,
            "euclidean_loss": e_total / batches,
            "poincare_loss": p_total / batches,
            "poincare_max_norm": poincare.max_norm(),
        })
    return euclidean, poincare, history


def evaluate(model, model_name: str, graph: dict, test: list[tuple[str, str]]):
    candidate_ids = torch.tensor(
        [graph["index"][f"drug::{drug}"] for drug in graph["drugs"]],
        dtype=torch.long,
    )
    id_to_drug = {graph["index"][f"drug::{d}"]: d for d in graph["drugs"]}
    hits = {1: 0, 3: 0, 5: 0, 10: 0}
    reciprocal_ranks = []
    rows = []

    with torch.no_grad():
        for disease, target in test:
            query_id = graph["index"][f"disease::{disease}"]
            ranked_ids, distances = rank_candidates(model, query_id, candidate_ids)
            ranking = [id_to_drug[int(i)] for i in ranked_ids.tolist()]
            rank = ranking.index(target) + 1
            reciprocal_ranks.append(1.0 / rank)
            for k in hits:
                hits[k] += int(rank <= k)
            rows.append({
                "model": model_name,
                "disease": disease,
                "target_drug": target,
                "target_rank": rank,
                "top1_prediction": ranking[0],
                "top5_predictions": " | ".join(ranking[:5]),
                "top1_distance": float(distances[0]),
            })

    count = len(test)
    if count == 0:
        raise RuntimeError("No recoverable held-out queries in this seed")
    metrics = {
        "model": model_name,
        "test_queries": count,
        **{f"recall_at_{k}": hits[k] / count for k in hits},
        "mrr": statistics.mean(reciprocal_ranks),
    }
    return metrics, rows


def t95(values: list[float]) -> tuple[float, float, float]:
    mean = statistics.mean(values)
    if len(values) < 2:
        return mean, mean, mean
    # t_(0.975,4) for the fixed five-seed design.
    t_critical = 2.776 if len(values) == 5 else 1.96
    half = t_critical * statistics.stdev(values) / math.sqrt(len(values))
    return mean, mean - half, mean + half


def aggregate(seed_metrics: list[dict]):
    output = []
    metric_names = ["recall_at_1", "recall_at_3", "recall_at_5", "recall_at_10", "mrr"]
    for model in ["euclidean", "poincare"]:
        selected = [row for row in seed_metrics if row["model"] == model]
        row = {"model": model, "seeds": len(selected)}
        for metric in metric_names:
            mean, low, high = t95([float(item[metric]) for item in selected])
            row[metric] = mean
            row[f"{metric}_ci95_low"] = low
            row[f"{metric}_ci95_high"] = high
        output.append(row)
    return output


def main() -> None:
    if not DATA_PATH.exists():
        raise SystemExit(f"Missing data file: {DATA_PATH}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pairs = load_pairs()
    all_metrics, all_predictions, all_history = [], [], []

    for seed in SEEDS:
        train, test, held_out = make_split(pairs, seed)
        graph = build_graph(train)
        euclidean, poincare, history = train_models(graph, seed)
        for entry in history:
            all_history.append({"seed": seed, **entry})

        for model, name in [(euclidean, "euclidean"), (poincare, "poincare")]:
            metrics, predictions = evaluate(model, name, graph, test)
            metrics.update({
                "seed": seed,
                "train_pairs": len(train),
                "held_out_pairs": len(held_out),
                "recoverable_test_queries": len(test),
                "nodes": len(graph["nodes"]),
                "edges": len(graph["edges"]),
            })
            all_metrics.append(metrics)
            all_predictions.extend({"seed": seed, **row} for row in predictions)

    aggregate_metrics = aggregate(all_metrics)
    metadata = {
        "scope": "disease-drug retrieval pilot; not full gene-disease-compound RMF-RAG",
        "seeds": SEEDS,
        "dimension": DIM,
        "epochs": EPOCHS,
        "margin": MARGIN,
        "curvature": CURVATURE,
        "euclidean_learning_rate": EUCLIDEAN_LR,
        "poincare_learning_rate": POINCARE_LR,
        "batch_size": BATCH_SIZE,
        "optimizer": "mini-batch SGD (Euclidean) and Riemannian SGD (Poincare); identical batches and epochs; settings transferred from Hetionet validation tuning",
        "negative_sampling": "one deterministic type-matched negative per positive edge per epoch; shared across geometries",
        "leakage_control": "one disease-drug pair held out per disease with >=2 drugs; held-out links removed before graph construction",
    }

    (OUT_DIR / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    (OUT_DIR / "metrics_by_seed.json").write_text(json.dumps(all_metrics, indent=2), encoding="utf-8")
    (OUT_DIR / "aggregate_metrics.json").write_text(json.dumps(aggregate_metrics, indent=2), encoding="utf-8")
    (OUT_DIR / "training_history.json").write_text(json.dumps(all_history, indent=2), encoding="utf-8")

    if all_predictions:
        with (OUT_DIR / "predictions.csv").open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(all_predictions[0]))
            writer.writeheader()
            writer.writerows(all_predictions)

    lines = [
        "# Controlled geometry pilot",
        "",
        "This table is generated from matched Euclidean and Poincare training budgets.",
        "It is a disease-drug retrieval pilot and must not be presented as the full RMF-RAG benchmark.",
        "",
        "| Model | Recall@1 | Recall@5 | Recall@10 | MRR |",
        "|---|---:|---:|---:|---:|",
    ]
    for row in aggregate_metrics:
        def fmt(metric: str) -> str:
            return f"{row[metric]:.4f} [{row[metric + '_ci95_low']:.4f}, {row[metric + '_ci95_high']:.4f}]"
        lines.append(f"| {row['model']} | {fmt('recall_at_1')} | {fmt('recall_at_5')} | {fmt('recall_at_10')} | {fmt('mrr')} |")
    (OUT_DIR / "paper_table.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(json.dumps(aggregate_metrics, indent=2))
    print(f"Wrote controlled experiment outputs to {OUT_DIR}")


if __name__ == "__main__":
    main()
