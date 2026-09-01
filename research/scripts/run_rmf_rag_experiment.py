#!/usr/bin/env python3
"""Reproducible Euclidean-vs-hyperbolic graph retrieval pilot.

This is intentionally a small, CPU-friendly research prototype. It uses the
Kaggle disease/drug records to construct a heterogeneous graph:

    disease -> shared disease-name token -> drug

One disease/drug edge is held out for diseases with at least two observed
drugs. The models then rank drugs for the disease using the graph embeddings.
The report clearly labels the recoverable evaluation subset and limitations.
"""

from __future__ import annotations

import csv
import html
import json
import math
import random
import re
from collections import Counter, defaultdict, deque
from pathlib import Path
from typing import Iterable

import numpy as np


ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "research" / "data" / "disease_drug_kaggle.json"
RESULTS_DIR = ROOT / "research" / "results"
SEED = 17
DIM = 8

STOPWORDS = {
    "a",
    "an",
    "and",
    "at",
    "by",
    "disorder",
    "disease",
    "for",
    "in",
    "of",
    "or",
    "the",
    "to",
    "type",
    "with",
}


def normalize(value: str) -> str:
    value = value.lower().replace("’", "'")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def parse_disease(question: str) -> str:
    match = re.search(r"^Disease:\s*(.*?)\.\s*What is the recommended drug\?", question, re.I)
    if match:
        return normalize(match.group(1))
    return normalize(question)


def tokens(value: str) -> set[str]:
    return {
        token
        for token in normalize(value).split()
        if len(token) >= 4 and token not in STOPWORDS
    }


def load_pairs() -> list[tuple[str, str]]:
    records = json.loads(DATA_PATH.read_text())
    pairs = {(parse_disease(row["input"]), normalize(row["output"])) for row in records}
    return sorted(pairs)


def make_split(pairs: list[tuple[str, str]], rng: random.Random):
    by_disease: dict[str, list[str]] = defaultdict(list)
    for disease, drug in pairs:
        by_disease[disease].append(drug)

    train: set[tuple[str, str]] = set(pairs)
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

    # A held-out edge is recoverable if the training graph still contains a
    # shared-name-token route from its disease to the held-out drug.
    test = [
        (disease, drug)
        for disease, drug in held_out
        if drug in train_drugs
        and any(drug in token_to_drugs[token] for token in disease_tokens[disease])
    ]
    return sorted(train), sorted(test), sorted(held_out)


def build_graph(train: list[tuple[str, str]]):
    diseases = sorted({d for d, _ in train})
    drugs = sorted({drug for _, drug in train})
    disease_tokens = {disease: tokens(disease) for disease in diseases}
    shared_tokens = sorted({token for values in disease_tokens.values() for token in values})

    nodes = (
        [f"disease::{value}" for value in diseases]
        + [f"token::{value}" for value in shared_tokens]
        + [f"drug::{value}" for value in drugs]
    )
    index = {node: i for i, node in enumerate(nodes)}
    types = ["disease"] * len(diseases) + ["token"] * len(shared_tokens) + ["drug"] * len(drugs)
    by_type: dict[str, list[int]] = defaultdict(list)
    for i, node_type in enumerate(types):
        by_type[node_type].append(i)

    edges: set[tuple[int, int]] = set()
    adjacency: dict[int, set[int]] = defaultdict(set)
    for disease, drug in train:
        disease_idx = index[f"disease::{disease}"]
        drug_idx = index[f"drug::{drug}"]
        # Direct training links are retained for training diseases with more
        # than one drug. Held-out links are absent by construction.
        edges.add((disease_idx, drug_idx))
        for token in disease_tokens[disease]:
            token_idx = index[f"token::{token}"]
            edges.add((disease_idx, token_idx))
            edges.add((token_idx, drug_idx))

    for left, right in edges:
        adjacency[left].add(right)
        adjacency[right].add(left)

    return {
        "nodes": nodes,
        "index": index,
        "types": types,
        "by_type": dict(by_type),
        "edges": sorted(edges),
        "adjacency": adjacency,
        "diseases": diseases,
        "drugs": drugs,
        "disease_tokens": disease_tokens,
    }


def project_ball(values: np.ndarray, max_norm: float = 0.92) -> np.ndarray:
    norms = np.linalg.norm(values, axis=1, keepdims=True)
    scale = np.minimum(1.0, max_norm / np.maximum(norms, 1e-12))
    return values * scale


def poincare_distance(left: np.ndarray, right: np.ndarray) -> float:
    left_norm = min(float(np.dot(left, left)), 0.999)
    right_norm = min(float(np.dot(right, right)), 0.999)
    squared = float(np.dot(left - right, left - right))
    argument = 1.0 + (2.0 * squared) / max((1.0 - left_norm) * (1.0 - right_norm), 1e-9)
    return float(np.arccosh(max(argument, 1.0)))


def sample_negative(
    left: int,
    right: int,
    graph: dict,
    rng: np.random.Generator,
) -> int:
    right_type = graph["types"][right]
    candidates = graph["by_type"][right_type]
    forbidden = graph["adjacency"].get(left, set())
    for _ in range(30):
        candidate = int(candidates[int(rng.integers(0, len(candidates)))])
        if candidate != right and candidate not in forbidden:
            return candidate
    return int(candidates[int(rng.integers(0, len(candidates)))])


def train_euclidean(graph: dict, epochs: int = 100) -> np.ndarray:
    rng = np.random.default_rng(SEED)
    embeddings = rng.normal(0.0, 0.08, size=(len(graph["nodes"]), DIM))
    learning_rate = 0.018
    margin = 0.35

    for _ in range(epochs):
        order = rng.permutation(len(graph["edges"]))
        for edge_idx in order:
            left, right = graph["edges"][int(edge_idx)]
            negative = sample_negative(left, right, graph, rng)
            x, y, z = embeddings[left], embeddings[right], embeddings[negative]
            positive_delta = x - y
            negative_delta = x - z
            positive_distance = float(np.dot(positive_delta, positive_delta))
            negative_distance = float(np.dot(negative_delta, negative_delta))
            if margin + positive_distance - negative_distance <= 0:
                continue
            grad_x = 2.0 * positive_delta - 2.0 * negative_delta
            grad_y = -2.0 * positive_delta
            grad_z = 2.0 * negative_delta
            embeddings[left] -= learning_rate * grad_x
            embeddings[right] -= learning_rate * grad_y
            embeddings[negative] -= learning_rate * grad_z
        embeddings = np.clip(embeddings, -1.5, 1.5)
    return embeddings


def numerical_gradient(
    embeddings: np.ndarray,
    node: int,
    other: np.ndarray,
    epsilon: float = 0.0008,
) -> np.ndarray:
    original = embeddings[node].copy()
    gradient = np.zeros(DIM)
    for dim in range(DIM):
        embeddings[node, dim] = original[dim] + epsilon
        plus = poincare_distance(embeddings[node], other)
        embeddings[node, dim] = original[dim] - epsilon
        minus = poincare_distance(embeddings[node], other)
        gradient[dim] = (plus - minus) / (2.0 * epsilon)
        embeddings[node, dim] = original[dim]
    return gradient


def train_poincare(graph: dict, epochs: int = 36) -> np.ndarray:
    rng = np.random.default_rng(SEED)
    embeddings = project_ball(rng.normal(0.0, 0.045, size=(len(graph["nodes"]), DIM)))
    learning_rate = 0.028
    margin = 0.22
    sampled_per_epoch = min(1800, len(graph["edges"]))

    for _ in range(epochs):
        order = rng.choice(len(graph["edges"]), size=sampled_per_epoch, replace=False)
        for edge_idx in order:
            left, right = graph["edges"][int(edge_idx)]
            negative = sample_negative(left, right, graph, rng)
            positive_distance = poincare_distance(embeddings[left], embeddings[right])
            negative_distance = poincare_distance(embeddings[left], embeddings[negative])
            if margin + positive_distance - negative_distance <= 0:
                continue

            # This small numerical-gradient implementation keeps the demo
            # dependency-light and makes the geometry explicit for a paper.
            grad_left_pos = numerical_gradient(embeddings, left, embeddings[right])
            grad_left_neg = numerical_gradient(embeddings, left, embeddings[negative])
            grad_right = numerical_gradient(embeddings, right, embeddings[left])
            grad_negative = numerical_gradient(embeddings, negative, embeddings[left])
            embeddings[left] -= learning_rate * (grad_left_pos - grad_left_neg)
            embeddings[right] -= learning_rate * grad_right
            embeddings[negative] += learning_rate * grad_negative
            embeddings = project_ball(embeddings)
    return embeddings


def lexical_score(disease: str, drug: str, train: list[tuple[str, str]]) -> float:
    query_tokens = tokens(disease)
    evidence = [other for other, candidate in train if candidate == drug]
    if not evidence:
        return 0.0
    return max(
        (
            len(query_tokens & tokens(other)) / max(len(query_tokens | tokens(other)), 1)
            for other in evidence
        ),
        default=0.0,
    )


def evaluate(
    name: str,
    test: list[tuple[str, str]],
    graph: dict,
    train: list[tuple[str, str]],
    embeddings: np.ndarray | None = None,
) -> tuple[dict, list[dict]]:
    candidates = graph["drugs"]
    rows: list[dict] = []
    reciprocal_ranks: list[float] = []
    hits = {1: 0, 3: 0, 5: 0, 10: 0}
    grounded = 0

    for disease, target in test:
        if embeddings is None:
            scored = [(drug, lexical_score(disease, drug, train)) for drug in candidates]
        else:
            disease_vector = embeddings[graph["index"][f"disease::{disease}"]]
            scored = [
                (
                    drug,
                    -(
                        float(np.dot(disease_vector - embeddings[graph["index"][f"drug::{drug}"]], disease_vector - embeddings[graph["index"][f"drug::{drug}"]]))
                        if name == "euclidean"
                        else poincare_distance(disease_vector, embeddings[graph["index"][f"drug::{drug}"]])
                    ),
                )
                for drug in candidates
            ]
        ranking = [drug for drug, _ in sorted(scored, key=lambda item: (-item[1], item[0]))]
        rank = ranking.index(target) + 1
        reciprocal_ranks.append(1.0 / rank)
        for k in hits:
            hits[k] += int(rank <= k)

        start = graph["index"][f"disease::{disease}"]
        goal = graph["index"][f"drug::{ranking[0]}"]
        queue = deque([(start, 0)])
        visited = {start}
        path_length = None
        while queue:
            current, distance = queue.popleft()
            if current == goal:
                path_length = distance
                break
            for neighbour in graph["adjacency"].get(current, set()):
                if neighbour not in visited:
                    visited.add(neighbour)
                    queue.append((neighbour, distance + 1))
        grounded += int(path_length is not None and path_length <= 3)
        rows.append(
            {
                "model": name,
                "disease": disease,
                "target_drug": target,
                "top1_prediction": ranking[0],
                "target_rank": rank,
                "top5_predictions": " | ".join(ranking[:5]),
                "top1_path_length": path_length if path_length is not None else "",
                "top1_grounded_within_3_hops": bool(path_length is not None and path_length <= 3),
            }
        )

    count = len(test)
    metrics = {
        "model": name,
        "test_queries": count,
        "recall_at_1": hits[1] / count,
        "recall_at_3": hits[3] / count,
        "recall_at_5": hits[5] / count,
        "recall_at_10": hits[10] / count,
        "mrr": sum(reciprocal_ranks) / count,
        "top1_graph_grounding_rate": grounded / count,
    }
    return metrics, rows


def render_report(metrics: list[dict], predictions: list[dict], metadata: dict) -> str:
    def pct(value: float) -> str:
        return f"{value * 100:.1f}%"

    metric_rows = "".join(
        f"<tr><th>{html.escape(row['model'].title())}</th>"
        f"<td>{pct(row['recall_at_1'])}</td><td>{pct(row['recall_at_3'])}</td>"
        f"<td>{pct(row['recall_at_5'])}</td><td>{pct(row['mrr'])}</td>"
        f"<td>{pct(row['top1_graph_grounding_rate'])}</td></tr>"
        for row in metrics
    )
    examples = []
    for row in predictions:
        if row["model"] == "rmf_rag_hyperbolic" and (
            "diabet" in row["disease"] or len(examples) < 5
        ):
            examples.append(row)
    example_rows = "".join(
        f"<tr><td>{html.escape(row['disease'].title())}</td>"
        f"<td>{html.escape(row['target_drug'].title())}</td>"
        f"<td>{html.escape(row['top1_prediction'].title())}</td>"
        f"<td>#{row['target_rank']}</td>"
        f"<td>{html.escape(row['top5_predictions'].title())}</td></tr>"
        for row in examples[:8]
    )
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>RMF-RAG Pilot Experiment</title>
<style>
:root {{ color-scheme: light; --navy:#102338; --blue:#2563eb; --green:#059669; --ink:#172033; --muted:#667085; --line:#d9e0ea; --soft:#f4f7fb; }}
* {{ box-sizing:border-box; }} body {{ margin:0; font-family:Inter,ui-sans-serif,system-ui,sans-serif; color:var(--ink); background:var(--soft); }}
main {{ max-width:1120px; margin:0 auto; padding:44px 28px 72px; }} .eyebrow {{ color:var(--green); letter-spacing:.12em; text-transform:uppercase; font-size:12px; font-weight:800; }}
h1 {{ font-size:42px; line-height:1.08; margin:12px 0 10px; color:var(--navy); }} h2 {{ margin-top:36px; color:var(--navy); }}
.lead {{ max-width:800px; color:var(--muted); font-size:18px; line-height:1.55; }} .grid {{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin:28px 0; }}
.stat {{ background:white; border:1px solid var(--line); border-radius:14px; padding:18px; }} .stat b {{ display:block; color:var(--blue); font-size:28px; }} .stat span {{ color:var(--muted); font-size:13px; }}
.card {{ background:white; border:1px solid var(--line); border-radius:16px; padding:20px; margin-top:18px; }} table {{ width:100%; border-collapse:collapse; font-size:14px; }} th,td {{ text-align:left; padding:12px 10px; border-bottom:1px solid var(--line); vertical-align:top; }} th {{ color:var(--navy); background:#eef3f8; }} tr:last-child td {{ border-bottom:0; }}
.callout {{ border-left:4px solid var(--green); background:#ecfdf5; padding:14px 16px; line-height:1.5; margin-top:18px; }} .note {{ color:var(--muted); font-size:13px; line-height:1.55; }}
code {{ background:#eef3f8; padding:2px 6px; border-radius:5px; }} @media(max-width:750px) {{ main {{ padding:28px 16px; }} h1 {{ font-size:32px; }} .grid {{ grid-template-columns:repeat(2,1fr); }} table {{ font-size:12px; }} th,td {{ padding:8px 5px; }} }}
</style></head>
<body><main>
<div class="eyebrow">Reproducible research pilot · seed {metadata['seed']}</div>
<h1>RMF-RAG: does curved graph space improve retrieval?</h1>
<p class="lead">A small, honest experiment on the Kaggle disease–drug dataset. We hide one known drug link, train two graph embedding models, and measure whether the correct drug is recovered in the ranked results.</p>
<div class="grid">
<div class="stat"><b>{metadata['source_rows']:,}</b><span>Kaggle source rows</span></div>
<div class="stat"><b>{metadata['unique_pairs']:,}</b><span>unique disease–drug pairs</span></div>
<div class="stat"><b>{metadata['train_pairs']:,}</b><span>training graph links</span></div>
<div class="stat"><b>{metadata['test_queries']:,}</b><span>recoverable test queries</span></div>
</div>
<div class="callout"><b>What this proves:</b> a measurable retrieval comparison on a real public dataset. <b>What it does not prove:</b> that the method solves gene→disease→drug reasoning. This Kaggle source has no gene edges, so that claim needs a second biomedical knowledge graph benchmark.</div>
<h2>Results</h2>
<div class="card"><table><thead><tr><th>Model</th><th>Recall@1</th><th>Recall@3</th><th>Recall@5</th><th>MRR</th><th>Top-1 graph grounded</th></tr></thead><tbody>{metric_rows}</tbody></table></div>
<p class="note">Recall@k means “the correct held-out drug appeared in the first k results.” MRR rewards a correct answer appearing near the top. Graph grounded means the top prediction had a ≤3-hop path in the training graph.</p>
<h2>What the model is doing</h2>
<div class="card"><p>We turn each record into a small graph: <b>disease → shared disease-name token → drug</b>. For example, diseases that share meaningful words create reusable paths to drugs. The Euclidean model learns flat distances. RMF-RAG learns the same graph with Poincaré-ball distances, where the boundary gives more room to represent branching structure.</p><p>The test set contains only held-out links that remain reachable through another disease sharing a token with the target drug. That avoids scoring impossible queries as model failures.</p></div>
<h2>Example predictions</h2>
<div class="card"><table><thead><tr><th>Query disease</th><th>Hidden answer</th><th>RMF-RAG top-1</th><th>Answer rank</th><th>Top 5 candidates</th></tr></thead><tbody>{example_rows}</tbody></table></div>
<h2>Reproduce it</h2>
<div class="card"><p>From the workspace root:</p><p><code>python research/scripts/run_rmf_rag_experiment.py</code></p><p class="note">Outputs: <code>research/results/metrics.json</code>, <code>predictions.csv</code>, and this report. The source citation and dataset limitation are recorded in <code>research/data/SOURCE.md</code>.</p></div>
<h2>Paper-ready limitations</h2>
<div class="card"><ul><li>The dataset is a disease→drug recommendation collection, not a curated gene–disease–drug KG.</li><li>The graph contains disease-name token bridges that are an experimental construction, not ground-truth biomedical relations.</li><li>This is a CPU-friendly pilot with a small embedding dimension and a held-out-link protocol; report it as preliminary evidence.</li><li>A stronger paper should add PrimeKG, Hetionet, Bio2RDF, or another licensed biomedical KG and include 2-hop/3-hop answer-path annotations.</li></ul></div>
</main></body></html>"""


def main() -> None:
    random.seed(SEED)
    rng = random.Random(SEED)
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    pairs = load_pairs()
    train, test, held_out = make_split(pairs, rng)
    graph = build_graph(train)

    print(f"Loaded {len(pairs)} unique pairs from Kaggle source")
    print(f"Train pairs: {len(train)} | Held out: {len(held_out)} | Recoverable test: {len(test)}")
    print(f"Graph: {len(graph['nodes'])} nodes, {len(graph['edges'])} edges")
    print("Training Euclidean embedding...")
    euclidean = train_euclidean(graph)
    print("Training Poincare embedding...")
    hyperbolic = train_poincare(graph)

    all_metrics: list[dict] = []
    all_predictions: list[dict] = []
    for name, embeddings in [
        ("lexical_baseline", None),
        ("euclidean", euclidean),
        ("rmf_rag_hyperbolic", hyperbolic),
    ]:
        metrics, rows = evaluate(name, test, graph, train, embeddings)
        all_metrics.append(metrics)
        all_predictions.extend(rows)
        print(
            f"{name}: Recall@1={metrics['recall_at_1']:.3f}, "
            f"Recall@5={metrics['recall_at_5']:.3f}, MRR={metrics['mrr']:.3f}"
        )

    metadata = {
        "seed": SEED,
        "source_rows": len(json.loads(DATA_PATH.read_text())),
        "unique_pairs": len(pairs),
        "train_pairs": len(train),
        "held_out_edges": len(held_out),
        "test_queries": len(test),
        "graph_nodes": len(graph["nodes"]),
        "graph_edges": len(graph["edges"]),
        "embedding_dimension": DIM,
        "dataset": "Kaggle disease-drug-dataset by erolatik",
        "dataset_url": "https://www.kaggle.com/datasets/erolatik/disease-drug-dataset",
        "evaluation": "one held-out drug per disease with at least two observed drugs; recoverable subset only",
    }
    np.savez_compressed(
        RESULTS_DIR / "trained_embeddings.npz",
        euclidean=euclidean,
        hyperbolic=hyperbolic,
    )
    (RESULTS_DIR / "model_index.json").write_text(
        json.dumps(
            {
                "nodes": graph["nodes"],
                "embedding_dimension": DIM,
                "geometry": {
                    "euclidean": "squared L2 distance",
                    "hyperbolic": "Poincare-ball geodesic distance",
                },
            },
            indent=2,
        )
        + "\n"
    )
    (RESULTS_DIR / "metrics.json").write_text(
        json.dumps({"metadata": metadata, "models": all_metrics}, indent=2) + "\n"
    )
    with (RESULTS_DIR / "predictions.csv").open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(all_predictions[0]))
        writer.writeheader()
        writer.writerows(all_predictions)
    (RESULTS_DIR / "report.html").write_text(render_report(all_metrics, all_predictions, metadata))
    print(f"Saved trained embeddings, metrics, predictions, and report in {RESULTS_DIR}")


if __name__ == "__main__":
    main()