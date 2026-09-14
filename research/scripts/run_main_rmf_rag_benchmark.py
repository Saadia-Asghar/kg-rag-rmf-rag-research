#!/usr/bin/env python3
"""Reproducible RMF-RAG benchmark on the licensed portion of Hetionet v1.0.

The benchmark answers two typed retrieval tasks:

* 2-hop: Gene -> Disease -> Compound (treats/palliates)
* 3-hop: Gene -> Disease -> Gene -> Compound (binds)

Held-out terminal edges make the evaluation a link-retrieval problem rather
than a lookup. The graph, query sets, model scores, confidence intervals, and
paper-ready tables are written below research/.
"""

from __future__ import annotations

import bz2
import csv
import hashlib
import json
import math
import random
import re
import statistics
import subprocess
import urllib.request
from collections import Counter, defaultdict, deque
from pathlib import Path
from typing import Iterable

import numpy as np


ROOT = Path(__file__).resolve().parents[2]
SNAPSHOT = ROOT / "research_data" / "hetionet" / "hetionet-v1.0.json.bz2"
RESULTS = ROOT / "research" / "results" / "main_benchmark"
QUERY_DIR = ROOT / "research" / "query_sets"
SNAPSHOT_URL = (
    "https://media.githubusercontent.com/media/hetio/hetionet/main/"
    "hetnet/json/hetionet-v1.0.json.bz2"
)
SNAPSHOT_SHA256 = "a342ab57e9073e6c02bb5e109d1f16917e6f933be4e5c77ebbaebfa26b984c19"
SEEDS = [7, 17, 29, 43, 101]
DIM = 16
EPOCHS = 24
NEGATIVES_PER_EDGE = 1
LEARNING_RATE = 0.035
MARGIN = 0.45
MAX_QUERIES_PER_SET = 500
LICENSES = {"CC BY 4.0", "CC0 1.0"}


def normalize(value: object) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", str(value).lower())).strip()


def ensure_snapshot() -> None:
    SNAPSHOT.parent.mkdir(parents=True, exist_ok=True)
    if SNAPSHOT.exists():
        digest = hashlib.sha256(SNAPSHOT.read_bytes()).hexdigest()
        if digest == SNAPSHOT_SHA256:
            return
        raise RuntimeError(f"Snapshot hash mismatch for {SNAPSHOT}: {digest}")
    print(f"Downloading Hetionet snapshot to {SNAPSHOT}")
    urllib.request.urlretrieve(SNAPSHOT_URL, SNAPSHOT)
    digest = hashlib.sha256(SNAPSHOT.read_bytes()).hexdigest()
    if digest != SNAPSHOT_SHA256:
        raise RuntimeError(f"Downloaded snapshot hash mismatch: {digest}")


def load_snapshot() -> tuple[dict, dict[tuple[str, str], str]]:
    ensure_snapshot()
    with bz2.open(SNAPSHOT, "rt", encoding="utf-8") as handle:
        raw = json.load(handle)
    nodes = {
        (node["kind"], str(node["identifier"])): {
            "name": node.get("name", str(node["identifier"])),
            "data": node.get("data", {}),
        }
        for node in raw["nodes"]
        if node["kind"] in {"Gene", "Disease", "Compound"}
    }
    return raw, nodes


def endpoint_key(endpoint: list[object]) -> tuple[str, str]:
    return str(endpoint[0]), str(endpoint[1])


def edge_key(edge: dict) -> tuple:
    return (
        endpoint_key(edge["source_id"]),
        endpoint_key(edge["target_id"]),
        edge["kind"],
    )


def selected_edges(raw: dict) -> list[dict]:
    """Keep only relation/source combinations with explicit reusable licenses."""
    keep: list[dict] = []
    for edge in raw["edges"]:
        data = edge.get("data", {})
        license_name = data.get("license")
        sources = data.get("sources", [])
        if isinstance(sources, str):
            sources = [sources]
        source = endpoint_key(edge["source_id"])[0]
        target = endpoint_key(edge["target_id"])[0]
        kind = edge["kind"]
        valid = (
            kind == "associates"
            and {source, target} == {"Gene", "Disease"}
            and license_name == "CC BY 4.0"
            and sources == ["DISEASES"]
        ) or (
            kind in {"treats", "palliates"}
            and {source, target} == {"Compound", "Disease"}
            and license_name == "CC0 1.0"
            and data.get("source") == "PharmacotherapyDB"
        ) or (
            kind == "binds"
            and {source, target} == {"Compound", "Gene"}
            and license_name == "CC BY 4.0"
            and len(sources) == 1
            and sources[0].startswith("DrugCentral")
        )
        if valid:
            keep.append(edge)
    return keep


def relation_sets(edges: list[dict]):
    gd: set[tuple[str, str]] = set()  # gene, disease
    dc: set[tuple[str, str]] = set()  # disease, compound
    cg: set[tuple[str, str]] = set()  # gene, compound
    typed: list[tuple[tuple[str, str], tuple[str, str], str]] = []
    for edge in edges:
        left, right = endpoint_key(edge["source_id"]), endpoint_key(edge["target_id"])
        if {left[0], right[0]} == {"Gene", "Disease"}:
            gene = left[1] if left[0] == "Gene" else right[1]
            disease = left[1] if left[0] == "Disease" else right[1]
            gd.add((gene, disease))
            typed.extend([(("Gene", gene), ("Disease", disease), edge["kind"])])
        elif edge["kind"] in {"treats", "palliates"}:
            compound = left[1] if left[0] == "Compound" else right[1]
            disease = left[1] if left[0] == "Disease" else right[1]
            dc.add((disease, compound))
            typed.extend([(("Disease", disease), ("Compound", compound), edge["kind"])])
        elif edge["kind"] == "binds":
            compound = left[1] if left[0] == "Compound" else right[1]
            gene = left[1] if left[0] == "Gene" else right[1]
            cg.add((gene, compound))
            typed.extend([(("Gene", gene), ("Compound", compound), edge["kind"])])
    return gd, dc, cg, typed


def split_edges(
    values: Iterable[tuple[str, str]], seed: int, minimum_train_per_group: bool = False
) -> dict[str, set[tuple[str, str]]]:
    """Deterministically split edge tuples, optionally retaining a train edge per disease."""
    rng = random.Random(seed)
    groups: dict[str, list[tuple[str, str]]] = defaultdict(list)
    for left, right in sorted(values):
        groups[left if minimum_train_per_group else "__all__"].append((left, right))
    train: set[tuple[str, str]] = set()
    validation: set[tuple[str, str]] = set()
    test: set[tuple[str, str]] = set()
    for group in groups.values():
        ordered = list(group)
        rng.shuffle(ordered)
        if minimum_train_per_group and len(ordered) >= 3:
            n_test = max(1, int(round(len(ordered) * 0.2)))
            n_val = max(1, int(round(len(ordered) * 0.15)))
            n_test = min(n_test, len(ordered) - 2)
            n_val = min(n_val, len(ordered) - n_test - 1)
        else:
            n_test = max(1, int(round(len(ordered) * 0.2)))
            n_val = max(1, int(round(len(ordered) * 0.15)))
            if len(ordered) == 1:
                n_test, n_val = 1, 0
            elif len(ordered) == 2:
                n_test, n_val = 1, 0
            else:
                n_test = min(n_test, len(ordered) - 1)
                n_val = min(n_val, len(ordered) - n_test)
        test.update(ordered[:n_test])
        validation.update(ordered[n_test : n_test + n_val])
        train.update(ordered[n_test + n_val :])
    return {"train": train, "validation": validation, "test": test}


def cap_queries(queries: list[dict], seed: int) -> list[dict]:
    queries = sorted(queries, key=lambda q: q["query_id"])
    if len(queries) <= MAX_QUERIES_PER_SET:
        return queries
    rng = random.Random(seed)
    chosen = rng.sample(queries, MAX_QUERIES_PER_SET)
    return sorted(chosen, key=lambda q: q["query_id"])


def make_queries(
    gd: set[tuple[str, str]],
    dc: set[tuple[str, str]],
    cg: set[tuple[str, str]],
    splits: dict[str, dict[str, set[tuple[str, str]]]],
    seed: int,
) -> dict[str, list[dict]]:
    genes_by_disease: dict[str, list[str]] = defaultdict(list)
    diseases_by_gene: dict[str, list[str]] = defaultdict(list)
    for gene, disease in sorted(gd):
        genes_by_disease[disease].append(gene)
        diseases_by_gene[gene].append(disease)
    compounds_by_gene: dict[str, list[str]] = defaultdict(list)
    for gene, compound in sorted(cg):
        compounds_by_gene[gene].append(compound)

    output: dict[str, list[dict]] = {}
    for split in ("train", "validation", "test"):
        two_hop: list[dict] = []
        for disease, compound in sorted(splits["dc"][split]):
            for gene in genes_by_disease.get(disease, [])[:4]:
                two_hop.append(
                    {
                        "query_id": f"2hop::{split}::{gene}::{disease}::{compound}",
                        "hop": 2,
                        "source_gene": gene,
                        "disease": disease,
                        "target_compound": compound,
                        "path_template": "Gene-associates-Disease-treats_or_palliates-Compound",
                    }
                )
        output[f"2hop_{split}"] = cap_queries(two_hop, seed + len(split))

        three_hop: list[dict] = []
        for intermediate_gene, compound in sorted(splits["cg"][split]):
            for disease in diseases_by_gene.get(intermediate_gene, [])[:3]:
                for source_gene in genes_by_disease.get(disease, [])[:3]:
                    if source_gene == intermediate_gene:
                        continue
                    three_hop.append(
                        {
                            "query_id": (
                                f"3hop::{split}::{source_gene}::{disease}::"
                                f"{intermediate_gene}::{compound}"
                            ),
                            "hop": 3,
                            "source_gene": source_gene,
                            "disease": disease,
                            "intermediate_gene": intermediate_gene,
                            "target_compound": compound,
                            "path_template": "Gene-associates-Disease-associates-Gene-binds-Compound",
                        }
                    )
        output[f"3hop_{split}"] = cap_queries(three_hop, seed + len(split) + 11)
    return output


def build_graph(
    nodes: dict[tuple[str, str], dict],
    gd: set[tuple[str, str]],
    dc: set[tuple[str, str]],
    cg: set[tuple[str, str]],
    removed_dc: set[tuple[str, str]],
    removed_cg: set[tuple[str, str]],
) -> dict:
    used = set()
    edge_pairs: set[tuple[tuple[str, str], tuple[str, str]]] = set()
    for gene, disease in gd:
        left, right = ("Gene", gene), ("Disease", disease)
        used.update((left, right))
        edge_pairs.add(tuple(sorted((left, right))))
    for disease, compound in dc - removed_dc:
        left, right = ("Disease", disease), ("Compound", compound)
        used.update((left, right))
        edge_pairs.add(tuple(sorted((left, right))))
    for gene, compound in cg - removed_cg:
        left, right = ("Gene", gene), ("Compound", compound)
        used.update((left, right))
        edge_pairs.add(tuple(sorted((left, right))))
    # Keep every candidate compound and every query node even when held out.
    used.update(("Compound", compound) for _, compound in dc | {(g, c) for g, c in cg})
    used.update(("Gene", gene) for gene, _ in gd)
    used.update(("Disease", disease) for _, disease in gd)
    ordered_nodes = sorted(used)
    index = {node: i for i, node in enumerate(ordered_nodes)}
    edges = [(index[left], index[right]) for left, right in sorted(edge_pairs)]
    adjacency: dict[int, set[int]] = defaultdict(set)
    for left, right in edges:
        adjacency[left].add(right)
        adjacency[right].add(left)
    by_type: dict[str, list[int]] = defaultdict(list)
    for i, (kind, _) in enumerate(ordered_nodes):
        by_type[kind].append(i)
    return {
        "nodes": ordered_nodes,
        "index": index,
        "edges": edges,
        "adjacency": adjacency,
        "by_type": by_type,
        "candidate_compounds": sorted(index[("Compound", c)] for c in {x[1] for x in dc | cg}),
        "node_data": nodes,
        "gene_disease": gd,
        "train_disease_compound": dc - removed_dc,
        "train_gene_compound": cg - removed_cg,
    }


def project_ball(values: np.ndarray, radius: float = 0.999) -> np.ndarray:
    norms = np.linalg.norm(values, axis=1, keepdims=True)
    scale = np.minimum(1.0, radius / np.maximum(norms, 1e-12))
    return values * scale


def poincare_distance(x: np.ndarray, y: np.ndarray) -> float:
    x2, y2 = float(np.dot(x, x)), float(np.dot(y, y))
    delta = float(np.dot(x - y, x - y))
    z = 1.0 + 2.0 * delta / max((1.0 - x2) * (1.0 - y2), 1e-9)
    return float(np.arccosh(max(z, 1.0)))


def poincare_gradient(x: np.ndarray, y: np.ndarray) -> np.ndarray:
    x2, y2 = float(np.dot(x, x)), float(np.dot(y, y))
    one_x, one_y = max(1.0 - x2, 1e-6), max(1.0 - y2, 1e-6)
    delta = float(np.dot(x - y, x - y))
    denominator = one_x * one_y
    z = 1.0 + 2.0 * delta / denominator
    dz = 4.0 * (x - y) / denominator + 4.0 * delta * x / (one_x * one_x * one_y)
    return dz / max(math.sqrt(max(z * z - 1.0, 1e-8)), 1e-4)


def mobius_add(x: np.ndarray, y: np.ndarray) -> np.ndarray:
    x2, y2, xy = float(np.dot(x, x)), float(np.dot(y, y)), float(np.dot(x, y))
    denominator = max(1.0 + 2.0 * xy + x2 * y2, 1e-9)
    return ((1.0 + 2.0 * xy + y2) * x + (1.0 - x2) * y) / denominator


def logmap_zero(point: np.ndarray) -> np.ndarray:
    norm = float(np.linalg.norm(point))
    if norm < 1e-12:
        return np.zeros_like(point)
    return np.arctanh(min(norm, 0.999999)) * point / norm


def expmap_zero(tangent: np.ndarray) -> np.ndarray:
    norm = float(np.linalg.norm(tangent))
    if norm < 1e-12:
        return np.zeros_like(tangent)
    return np.tanh(norm) * tangent / norm


def logmap(point: np.ndarray, target: np.ndarray) -> np.ndarray:
    delta = mobius_add(-point, target)
    norm = float(np.linalg.norm(delta))
    if norm < 1e-12:
        return np.zeros_like(point)
    conformal = 2.0 / max(1.0 - float(np.dot(point, point)), 1e-9)
    return (2.0 / conformal) * np.arctanh(min(norm, 0.999999)) * delta / norm


def transport_to_zero(point: np.ndarray, tangent: np.ndarray) -> np.ndarray:
    """Exact radial parallel transport from point to the Poincare-ball origin."""
    conformal = 2.0 / max(1.0 - float(np.dot(point, point)), 1e-9)
    return (conformal / 2.0) * tangent


def negative_node(left: int, right: int, graph: dict, rng: np.random.Generator) -> int:
    choices = graph["by_type"][graph["nodes"][right][0]]
    for _ in range(20):
        candidate = int(choices[int(rng.integers(0, len(choices)))])
        if candidate != left and candidate != right and candidate not in graph["adjacency"].get(left, set()):
            return candidate
    return int(choices[int(rng.integers(0, len(choices)))])


def train_euclidean(graph: dict, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    vectors = rng.normal(0.0, 0.08, size=(len(graph["nodes"]), DIM))
    for _ in range(EPOCHS):
        for edge_index in rng.permutation(len(graph["edges"])):
            left, right = graph["edges"][int(edge_index)]
            negative = negative_node(left, right, graph, rng)
            x, y, z = vectors[left], vectors[right], vectors[negative]
            pos = x - y
            neg = x - z
            loss = MARGIN + float(np.dot(pos, pos)) - float(np.dot(neg, neg))
            if loss <= 0:
                continue
            vectors[left] -= LEARNING_RATE * (2 * pos - 2 * neg)
            vectors[right] += LEARNING_RATE * 2 * pos
            vectors[negative] -= LEARNING_RATE * 2 * neg
        vectors = np.clip(vectors, -1.5, 1.5)
    return vectors


def train_poincare(graph: dict, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    vectors = project_ball(rng.normal(0.0, 0.035, size=(len(graph["nodes"]), DIM)))
    for _ in range(EPOCHS):
        for edge_index in rng.permutation(len(graph["edges"])):
            left, right = graph["edges"][int(edge_index)]
            negative = negative_node(left, right, graph, rng)
            x, y, z = vectors[left], vectors[right], vectors[negative]
            pos = poincare_distance(x, y)
            neg = poincare_distance(x, z)
            if MARGIN + pos - neg <= 0:
                continue
            # Riemannian-scaled geodesic gradients, with the same samples and
            # number of updates as the Euclidean objective.
            grad_x = poincare_gradient(x, y) - poincare_gradient(x, z)
            grad_y = poincare_gradient(y, x)
            grad_z = poincare_gradient(z, x)
            vectors[left] -= LEARNING_RATE * ((1 - np.dot(x, x)) ** 2 / 4) * grad_x
            vectors[right] -= LEARNING_RATE * ((1 - np.dot(y, y)) ** 2 / 4) * grad_y
            vectors[negative] += LEARNING_RATE * ((1 - np.dot(z, z)) ** 2 / 4) * grad_z
        vectors = project_ball(vectors)
    return vectors


def text_tokens(text: str) -> set[str]:
    return {token for token in normalize(text).split() if len(token) > 2}


def build_documents(nodes: dict, graph: dict) -> tuple[dict[int, set[str]], dict[str, float]]:
    """Build a reusable lexical neighborhood baseline from identifiers only.

    Compound labels in Hetionet can inherit noncommercial source licenses, so
    the benchmark neither scores nor redistributes them. Candidate documents
    include identifiers for their retained licensed graph neighbors, making
    overlap informative without importing restricted labels.
    """
    docs: dict[int, set[str]] = {}
    document_frequency = Counter()
    for i, node in enumerate(graph["nodes"]):
        tokens = text_tokens(node[1])
        if node[0] == "Compound":
            for neighbor in graph["adjacency"].get(i, set()):
                tokens |= text_tokens(graph["nodes"][neighbor][1])
        docs[i] = tokens
        document_frequency.update(docs[i])
    total = max(len(docs), 1)
    idf = {token: math.log((1 + total) / (1 + count)) + 1 for token, count in document_frequency.items()}
    return docs, idf


def verified_compounds(query: dict, graph: dict) -> set[int]:
    """Return candidates supported by the exact typed path for this query."""
    source_gene = query["source_gene"]
    disease = query["disease"]
    if (source_gene, disease) not in graph["gene_disease"]:
        return set()
    if query["hop"] == 2:
        compounds = {
            compound
            for linked_disease, compound in graph["train_disease_compound"]
            if linked_disease == disease
        }
    else:
        intermediate = query["intermediate_gene"]
        if (intermediate, disease) not in graph["gene_disease"]:
            return set()
        compounds = {
            compound
            for linked_gene, compound in graph["train_gene_compound"]
            if linked_gene == intermediate
        }
    return {graph["index"][("Compound", compound)] for compound in compounds}


def query_vector(
    query: dict,
    vectors: np.ndarray,
    graph: dict,
    hop_weighting: bool,
    parallel_transport: bool,
    hyperbolic: bool,
):
    source = vectors[graph["index"][("Gene", query["source_gene"])]]
    context = [vectors[graph["index"][("Disease", query["disease"])] ]]
    if query["hop"] == 3:
        context.append(vectors[graph["index"][("Gene", query["intermediate_gene"])]])
    if not context:
        return source
    if hop_weighting:
        weights = [1.0] + ([0.5] if query["hop"] == 3 else [])
    else:
        weights = [1.0] * len(context)
    if parallel_transport:
        # Map context displacements into the source tangent space, parallel
        # transport them radially to the origin, aggregate, then map back.
        tangent = logmap_zero(source)
        for weight, point in zip(weights, context):
            tangent += weight * transport_to_zero(source, logmap(source, point))
        result = expmap_zero(tangent / (1.0 + sum(weights)))
    else:
        result = np.average([source, *context], axis=0, weights=[1.0, *weights])
    return project_ball(result.reshape(1, -1))[0] if hyperbolic else result


def lexical_scores(query: dict, graph: dict, docs: dict[int, set[str]], idf: dict[str, float], nodes: dict):
    source_node = ("Gene", query["source_gene"])
    disease_node = ("Disease", query["disease"])
    query_text = set(docs[graph["index"][source_node]]) | set(docs[graph["index"][disease_node]])
    if query["hop"] == 3:
        query_text |= set(docs[graph["index"][("Gene", query["intermediate_gene"])]])
    scored = []
    for candidate in graph["candidate_compounds"]:
        overlap = query_text & docs[candidate]
        scored.append((candidate, sum(idf.get(token, 1.0) for token in overlap)))
    return scored


def rank_query(
    query: dict,
    method: str,
    graph: dict,
    vectors: np.ndarray | None,
    docs: dict[int, set[str]],
    idf: dict[str, float],
    nodes: dict,
):
    if method == "lexical":
        scored = lexical_scores(query, graph, docs, idf, nodes)
    else:
        q = query_vector(
            query,
            vectors,
            graph,
            hop_weighting=method != "poincare_no_hop_weighting",
            parallel_transport=(
                method.startswith("poincare") and method != "poincare_no_parallel_transport"
            ),
            hyperbolic=method.startswith("poincare"),
        )
        scored = []
        for candidate in graph["candidate_compounds"]:
            candidate_vector = vectors[candidate]
            if method in {"euclidean", "poincare_no_geodesic"}:
                value = -float(np.dot(q - candidate_vector, q - candidate_vector))
            else:
                value = -poincare_distance(q, candidate_vector)
            scored.append((candidate, value))
    if method == "poincare_with_path_verification":
        verified = verified_compounds(query, graph)
        scored = [(node, score + (0.12 if node in verified else -0.12)) for node, score in scored]
    return [
        graph["nodes"][node][1]
        for node, _ in sorted(scored, key=lambda item: (-item[1], graph["nodes"][item[0]][1]))
    ]


def evaluate_method(
    method: str,
    queries: list[dict],
    graph: dict,
    vectors: np.ndarray | None,
    docs: dict[int, set[str]],
    idf: dict[str, float],
    nodes: dict,
    seed: int,
    split: str,
) -> tuple[dict, list[dict]]:
    ranks: list[int] = []
    rows: list[dict] = []
    verified_hits = 0
    for query in queries:
        ranking = rank_query(query, method, graph, vectors, docs, idf, nodes)
        target_rank = ranking.index(query["target_compound"]) + 1
        verified = verified_compounds(query, graph)
        top1 = ranking[0]
        top1_node = graph["index"][("Compound", top1)]
        top1_verified = top1_node in verified
        verified_hits += int(top1_verified)
        ranks.append(target_rank)
        rows.append(
            {
                **query,
                "seed": seed,
                "split": split,
                "method": method,
                "target_rank": target_rank,
                "top1_prediction": top1,
                "top5_predictions": ranking[:5],
                "target_path_verified_in_train_graph": (
                    graph["index"][("Compound", query["target_compound"])] in verified
                ),
                "top1_path_verified_in_train_graph": top1_verified,
            }
        )
    n = len(ranks)
    if not n:
        return {"seed": seed, "split": split, "method": method, "queries": 0}, rows
    return {
        "seed": seed,
        "split": split,
        "method": method,
        "queries": n,
        "recall_at_1": sum(rank <= 1 for rank in ranks) / n,
        "recall_at_5": sum(rank <= 5 for rank in ranks) / n,
        "recall_at_10": sum(rank <= 10 for rank in ranks) / n,
        "mrr": sum(1 / rank for rank in ranks) / n,
        "top1_path_verified_rate": verified_hits / n,
    }, rows


def confidence(values: list[float]) -> tuple[float, float, float]:
    mean = statistics.mean(values) if values else 0.0
    if len(values) < 2:
        return mean, mean, mean
    se = statistics.stdev(values) / math.sqrt(len(values))
    half_width = 2.776 * se  # two-sided 95% t interval, df=4
    return mean, max(0.0, mean - half_width), min(1.0, mean + half_width)


def write_csv(path: Path, rows: list[dict]) -> None:
    if not rows:
        path.write_text("")
        return
    keys = list(rows[0])
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=keys)
        writer.writeheader()
        writer.writerows(rows)


def write_paper_table(metrics: list[dict], path: Path, title: str) -> None:
    groups: dict[tuple[str, str], list[dict]] = defaultdict(list)
    for row in metrics:
        groups[(row["split"], row["method"])].append(row)
    lines = [f"# {title}", "", "Values are mean across five seeds with a 95% t confidence interval.", ""]
    lines.append("| Split | Method | Recall@1 | Recall@5 | MRR | Top-1 path verified |")
    lines.append("|---|---|---:|---:|---:|---:|")
    for (split, method), rows in sorted(groups.items()):
        values = []
        for metric in ("recall_at_1", "recall_at_5", "mrr", "top1_path_verified_rate"):
            mean, low, high = confidence([float(row.get(metric, 0)) for row in rows])
            values.append(f"{mean:.3f} [{low:.3f}, {high:.3f}]")
        lines.append(f"| {split} | {method} | " + " | ".join(values) + " |")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    RESULTS.mkdir(parents=True, exist_ok=True)
    QUERY_DIR.mkdir(parents=True, exist_ok=True)
    raw, nodes = load_snapshot()
    edges = selected_edges(raw)
    gd, dc, cg, _ = relation_sets(edges)
    all_metrics: list[dict] = []
    all_predictions: list[dict] = []
    query_counts: dict[str, dict[str, int]] = {}

    methods = [
        "lexical",
        "euclidean",
        "poincare",
        "poincare_no_geodesic",
        "poincare_no_hop_weighting",
        "poincare_no_parallel_transport",
        "poincare_with_path_verification",
    ]
    for seed in SEEDS:
        dc_splits = split_edges(dc, seed, minimum_train_per_group=True)
        cg_splits = split_edges(cg, seed + 1000)
        splits = {"dc": dc_splits, "cg": cg_splits}
        queries = make_queries(gd, dc, cg, splits, seed)
        query_counts[str(seed)] = {name: len(items) for name, items in queries.items()}
        for name, items in queries.items():
            with (QUERY_DIR / f"{name}_seed{seed}.jsonl").open("w", encoding="utf-8") as handle:
                for query in items:
                    handle.write(json.dumps(query) + "\n")

        graph = build_graph(
            nodes,
            gd,
            dc,
            cg,
            removed_dc=dc - dc_splits["train"],
            removed_cg=cg - cg_splits["train"],
        )
        docs, idf = build_documents(nodes, graph)
        print(f"seed={seed} graph_nodes={len(graph['nodes'])} graph_edges={len(graph['edges'])}")
        euclidean = train_euclidean(graph, seed)
        poincare = train_poincare(graph, seed)
        vectors = {"euclidean": euclidean, "poincare": poincare}
        for hop in (2, 3):
            for split in ("validation", "test"):
                items = queries[f"{hop}hop_{split}"]
                for method in methods:
                    vector = vectors["euclidean"] if method == "euclidean" else poincare
                    if method == "lexical":
                        vector = None
                    metric, rows = evaluate_method(
                        method, items, graph, vector, docs, idf, nodes, seed, f"{hop}hop_{split}"
                    )
                    metric["hop"] = hop
                    all_metrics.append(metric)
                    all_predictions.extend(rows)
        np.savez_compressed(
            RESULTS / f"embeddings_seed{seed}.npz",
            euclidean=euclidean,
            poincare=poincare,
        )
        print(f"  queries: {query_counts[str(seed)]}")

    write_csv(RESULTS / "metrics_by_seed.csv", all_metrics)
    with (RESULTS / "predictions.jsonl").open("w", encoding="utf-8") as handle:
        for row in all_predictions:
            handle.write(json.dumps(row) + "\n")

    aggregate: list[dict] = []
    for (split, method), rows in sorted(
        ((key, list(group)) for key, group in __import__("itertools").groupby(
            sorted(all_metrics, key=lambda r: (r["split"], r["method"])),
            key=lambda r: (r["split"], r["method"]),
        ))
    ):
        aggregate_row = {"split": split, "method": method, "seeds": len(rows)}
        for metric in ("recall_at_1", "recall_at_5", "recall_at_10", "mrr", "top1_path_verified_rate"):
            mean, low, high = confidence([float(row.get(metric, 0)) for row in rows])
            aggregate_row[f"{metric}_mean"] = mean
            aggregate_row[f"{metric}_ci95_low"] = low
            aggregate_row[f"{metric}_ci95_high"] = high
        aggregate.append(aggregate_row)
    write_csv(RESULTS / "aggregate_metrics.csv", aggregate)

    metadata = {
        "dataset": "Hetionet v1.0",
        "snapshot_path": str(SNAPSHOT.relative_to(ROOT)),
        "snapshot_url": SNAPSHOT_URL,
        "snapshot_sha256": SNAPSHOT_SHA256,
        "dataset_citation": (
            "Himmelstein et al. Systematic integration of biomedical knowledge "
            "prioritizes drugs for repurposing. eLife 2017;6:e26726. "
            "https://doi.org/10.7554/eLife.26726"
        ),
        "snapshot_license": "Repository original content CC0 1.0; per-node/edge licenses retained.",
        "selected_relation_licenses": {
            "Gene-Disease associates": "CC BY 4.0",
            "Disease-Compound treats/palliates": "CC0 1.0",
            "Gene-Compound binds": "CC BY 4.0",
        },
        "selected_relation_sources": {
            "Gene-Disease associates": "DISEASES",
            "Disease-Compound treats/palliates": "PharmacotherapyDB",
            "Gene-Compound binds": "DrugCentral source variants",
        },
        "selected_edges": {"gene_disease": len(gd), "disease_compound": len(dc), "gene_compound": len(cg)},
        "seeds": SEEDS,
        "embedding_dimension": DIM,
        "epochs": EPOCHS,
        "negative_samples_per_edge": NEGATIVES_PER_EDGE,
        "training_budget": "same edges, epochs, negative sampling, dimension, and learning rate for Euclidean/Poincare",
        "query_sets": query_counts,
        "query_definitions": {
            "2hop": "Gene -> Disease -> Compound, terminal treats/palliates edge held out by split.",
            "3hop": "Gene -> Disease -> Gene -> Compound, terminal binds edge held out by split.",
        },
        "confidence_intervals": "two-sided 95% t interval across five random seeds (df=4)",
    }
    (RESULTS / "metadata.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    write_paper_table(all_metrics, RESULTS / "paper_table.md", "RMF-RAG Hetionet benchmark")
    ablation_methods = {
        "poincare",
        "poincare_no_geodesic",
        "poincare_no_hop_weighting",
        "poincare_no_parallel_transport",
        "poincare_with_path_verification",
    }
    write_paper_table(
        [row for row in all_metrics if row["method"] in ablation_methods],
        RESULTS / "ablation_table.md",
        "RMF-RAG ablations",
    )
    print(f"Saved {len(all_predictions)} raw predictions and {len(all_metrics)} seed metrics under {RESULTS}")


if __name__ == "__main__":
    main()