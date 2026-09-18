#!/usr/bin/env python3
"""Reproducible Hetionet benchmark for the RMF-RAG research project.

The benchmark intentionally separates graph-link retrieval from clinical claims.
It uses a license-filtered Hetionet v1.0 subgraph and evaluates two typed tasks:

    2-hop: Gene -> Disease -> Compound
    3-hop: Gene -> Disease -> Gene -> Compound

Terminal Disease-Compound and Gene-Compound answer edges are split before model
training. Euclidean and Poincare retrievers use the same graph, node IDs,
embedding dimension, epochs, margin, and deterministic type-matched negatives.

This module also exposes helper functions used by ``main_query_demo.py``:
``load_snapshot``, ``selected_edges``, ``relation_sets``, ``split_edges``,
``build_graph``, ``build_documents``, ``rank_query``, and
``verified_compounds``.
"""
from __future__ import annotations

import bz2
import csv
import hashlib
import html
import json
import math
import os
import random
import re
import statistics
import sys
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path
from typing import Iterable

import numpy as np
import torch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from research.models.controlled_retrievers import (  # noqa: E402
    EuclideanRetriever,
    PoincareRetriever,
    PoincareRSGD,
    RetrieverConfig,
    set_seed,
)

DATA_DIR = ROOT / "research_data" / "hetionet"
SNAPSHOT = DATA_DIR / "hetionet-v1.0.json.bz2"
RESULTS = ROOT / "research" / "results" / "main_benchmark"
QUERY_DIR = ROOT / "research" / "query_sets"

# GitHub normally resolves this LFS object to the actual binary. If a pointer is
# returned instead, the error message below points to the archived release.
HETIONET_URL = (
    "https://github.com/hetio/hetionet/raw/main/hetnet/json/"
    "hetionet-v1.0.json.bz2"
)
ZENODO_RECORD = "https://zenodo.org/records/268568"
DATASET_CITATION = (
    "Himmelstein DS et al. Systematic integration of biomedical knowledge "
    "prioritizes drugs for repurposing. eLife 2017;6:e26726. "
    "https://doi.org/10.7554/eLife.26726"
)

SEEDS = (7, 17, 29, 43, 101)
DIM = 16
EPOCHS = 24
MARGIN = 0.45
LEARNING_RATE = 0.035
CURVATURE = 1.0
QUERY_CAP = 500
EXPECTED_SELECTED_COUNTS = {
    "gene_disease": 3200,
    "disease_compound": 1145,
    "gene_compound": 823,
}

MAIN_METHODS = ("lexical", "euclidean", "poincare")
ABLATION_METHODS = (
    "poincare_no_geodesic",
    "poincare_no_hop_weighting",
    "poincare_no_parallel_transport",
    "poincare_with_path_verification",
)
ALL_METHODS = MAIN_METHODS + ABLATION_METHODS
METRICS = (
    "recall_at_1",
    "recall_at_5",
    "recall_at_10",
    "mrr",
    "top1_path_verified_rate",
)

NodeKey = tuple[str, str]
Pair = tuple[str, str]


def _norm_text(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "").strip()).casefold()


def _node_key(value: Iterable[object]) -> NodeKey:
    kind, identifier = value
    return str(kind), str(identifier)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def ensure_snapshot(path: Path = SNAPSHOT) -> Path:
    """Ensure the compressed Hetionet snapshot exists locally.

    ``HETIONET_JSON_BZ2`` can point at an already downloaded snapshot. This is
    the most reliable option for offline or Git-LFS-restricted environments.
    """
    override = os.environ.get("HETIONET_JSON_BZ2")
    if override:
        candidate = Path(override).expanduser().resolve()
        if not candidate.exists():
            raise FileNotFoundError(f"HETIONET_JSON_BZ2 does not exist: {candidate}")
        return candidate

    if path.exists() and path.stat().st_size > 1024:
        return path

    path.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading Hetionet v1.0 to {path} ...")
    try:
        request = urllib.request.Request(
            HETIONET_URL,
            headers={"User-Agent": "kg-rag-rmf-rag-research/1.0"},
        )
        with urllib.request.urlopen(request, timeout=120) as response, path.open("wb") as output:
            first = response.read(256)
            if first.startswith(b"version https://git-lfs.github.com/spec/v1"):
                raise RuntimeError("GitHub returned a Git LFS pointer instead of the dataset")
            output.write(first)
            while True:
                chunk = response.read(1024 * 1024)
                if not chunk:
                    break
                output.write(chunk)
    except Exception as exc:
        path.unlink(missing_ok=True)
        raise RuntimeError(
            "Unable to download the Hetionet JSON snapshot automatically. "
            f"Download the Hetionet v1.0 archive from {ZENODO_RECORD}, extract "
            "hetnet/json/hetionet-v1.0.json.bz2, and place it at "
            f"{path}, or set HETIONET_JSON_BZ2. Original error: {exc}"
        ) from exc

    return path


def load_snapshot(snapshot_path: Path | None = None) -> tuple[dict, dict[NodeKey, dict]]:
    """Load Hetionet's compressed JSON and return raw data plus node lookup."""
    path = snapshot_path or ensure_snapshot()
    if not path.exists():
        raise FileNotFoundError(path)
    with bz2.open(path, "rt", encoding="utf-8") as handle:
        raw = json.load(handle)
    nodes = {
        (str(node["kind"]), str(node["identifier"])): node
        for node in raw.get("nodes", [])
    }
    if not nodes or not raw.get("edges"):
        raise ValueError("Hetionet snapshot does not contain nodes and edges")
    return raw, nodes


def _license_ok(value: object, expected: str) -> bool:
    normalized = _norm_text(value).replace("creative commons", "cc")
    expected = expected.casefold()
    if expected == "cc0":
        return normalized.startswith("cc0") or "cc0 1.0" in normalized
    if expected == "cc by 4.0":
        return "cc by 4.0" in normalized or "cc-by 4.0" in normalized
    return normalized == expected


def selected_edges(raw: dict) -> list[dict]:
    """Return only the licensed relation subset used by the benchmark."""
    selected: list[dict] = []
    for edge in raw.get("edges", []):
        source = _node_key(edge["source_id"])
        target = _node_key(edge["target_id"])
        kinds = {source[0], target[0]}
        relation = str(edge.get("kind", ""))
        data = edge.get("data") or {}
        # Hetionet v1.0 stores a list under ``sources``.  Retain the singular
        # fallback for the compact synthetic fixtures used by the unit tests.
        source_values = data.get("sources", data.get("source", []))
        if isinstance(source_values, str):
            source_values = [source_values]
        source_names = [_norm_text(value) for value in source_values]
        source_db = " ".join(source_names)
        license_name = data.get("license")

        keep = False
        if (
            kinds == {"Disease", "Gene"}
            and relation == "associates"
            and source_names == ["diseases"]
            and _license_ok(license_name, "cc by 4.0")
        ):
            keep = True
        elif (
            kinds == {"Disease", "Compound"}
            and relation in {"treats", "palliates"}
            and "pharmacotherapydb" in source_db
            and _license_ok(license_name, "cc0")
        ):
            keep = True
        elif (
            kinds == {"Gene", "Compound"}
            and relation == "binds"
            and len(source_names) == 1
            and source_names[0].startswith("drugcentral")
            and _license_ok(license_name, "cc by 4.0")
        ):
            keep = True

        if keep:
            selected.append(edge)
    return selected


def relation_sets(edges: Iterable[dict]) -> tuple[set[Pair], set[Pair], set[Pair], dict]:
    """Convert selected raw edges to typed pair sets.

    Returns ``(gene_disease, disease_compound, gene_compound, provenance)``.
    Pair identifiers are strings to keep JSON serialization deterministic.
    """
    gd: set[Pair] = set()
    dc: set[Pair] = set()
    cg: set[Pair] = set()
    provenance: Counter[tuple[str, str, str]] = Counter()

    for edge in edges:
        source = _node_key(edge["source_id"])
        target = _node_key(edge["target_id"])
        relation = str(edge["kind"])
        data = edge.get("data") or {}
        sources = data.get("sources", data.get("source", []))
        if isinstance(sources, str):
            sources = [sources]
        provenance[(relation, "; ".join(str(source) for source in sources), str(data.get("license", "")))] += 1

        pair = {source[0]: source[1], target[0]: target[1]}
        kinds = {source[0], target[0]}
        if kinds == {"Gene", "Disease"} and relation == "associates":
            gd.add((pair["Gene"], pair["Disease"]))
        elif kinds == {"Disease", "Compound"} and relation in {"treats", "palliates"}:
            dc.add((pair["Disease"], pair["Compound"]))
        elif kinds == {"Gene", "Compound"} and relation == "binds":
            cg.add((pair["Gene"], pair["Compound"]))

    return gd, dc, cg, {
        "sources": [
            {"relation": relation, "source": source, "license": license_name, "edges": count}
            for (relation, source, license_name), count in sorted(provenance.items())
        ]
    }


def validate_relation_counts(gd: set[Pair], dc: set[Pair], cg: set[Pair]) -> None:
    actual = {
        "gene_disease": len(gd),
        "disease_compound": len(dc),
        "gene_compound": len(cg),
    }
    if actual == EXPECTED_SELECTED_COUNTS:
        return
    message = (
        "Licensed relation counts differ from the frozen benchmark definition. "
        f"Expected {EXPECTED_SELECTED_COUNTS}; got {actual}. "
        "This usually indicates a different Hetionet snapshot or provenance metadata."
    )
    if os.environ.get("ALLOW_EDGE_COUNT_DRIFT") == "1":
        print(f"WARNING: {message}")
    else:
        raise ValueError(message + " Set ALLOW_EDGE_COUNT_DRIFT=1 only for exploratory runs.")


def split_edges(
    edges: set[Pair],
    seed: int,
    minimum_train_per_group: bool = False,
) -> dict[str, set[Pair]]:
    """Deterministically split terminal answer edges into train/validation/test."""
    rng = random.Random(seed)
    train: set[Pair] = set()
    validation: set[Pair] = set()
    test: set[Pair] = set()

    if minimum_train_per_group:
        grouped: dict[str, list[Pair]] = defaultdict(list)
        for edge in sorted(edges):
            grouped[edge[0]].append(edge)
        for group_edges in grouped.values():
            values = sorted(group_edges)
            rng.shuffle(values)
            n = len(values)
            if n < 3:
                train.update(values)
                continue
            n_hold = max(1, int(round(n * 0.15)))
            n_hold = min(n_hold, (n - 1) // 2)
            validation.update(values[:n_hold])
            test.update(values[n_hold : 2 * n_hold])
            train.update(values[2 * n_hold :])
    else:
        values = sorted(edges)
        rng.shuffle(values)
        n = len(values)
        if n < 3:
            return {"train": set(values), "validation": set(), "test": set()}
        n_hold = max(1, int(round(n * 0.10)))
        n_hold = min(n_hold, (n - 1) // 2)
        validation.update(values[:n_hold])
        test.update(values[n_hold : 2 * n_hold])
        train.update(values[2 * n_hold :])

    assert not (train & validation or train & test or validation & test)
    assert train | validation | test == edges
    return {"train": train, "validation": validation, "test": test}


def build_graph(
    nodes: dict[NodeKey, dict],
    gd: set[Pair],
    dc: set[Pair],
    cg: set[Pair],
    *,
    removed_dc: set[Pair] | None = None,
    removed_cg: set[Pair] | None = None,
) -> dict:
    """Build a training graph while retaining held-out entities as candidates."""
    removed_dc = removed_dc or set()
    removed_cg = removed_cg or set()
    train_dc = dc - removed_dc
    train_cg = cg - removed_cg

    active_keys: set[NodeKey] = set()
    for gene, disease in gd:
        active_keys.update({("Gene", gene), ("Disease", disease)})
    for disease, compound in dc:
        active_keys.update({("Disease", disease), ("Compound", compound)})
    for gene, compound in cg:
        active_keys.update({("Gene", gene), ("Compound", compound)})

    kind_order = {"Gene": 0, "Disease": 1, "Compound": 2}
    node_keys = sorted(active_keys, key=lambda key: (kind_order.get(key[0], 99), key[1]))
    index = {key: i for i, key in enumerate(node_keys)}
    node_types = [key[0] for key in node_keys]
    by_type: dict[str, list[int]] = defaultdict(list)
    for i, kind in enumerate(node_types):
        by_type[kind].append(i)

    integer_edges: set[tuple[int, int]] = set()
    neighbours: dict[int, set[int]] = defaultdict(set)

    def add(left: NodeKey, right: NodeKey) -> None:
        a, b = index[left], index[right]
        pair = (min(a, b), max(a, b))
        integer_edges.add(pair)
        neighbours[a].add(b)
        neighbours[b].add(a)

    diseases_by_gene: dict[str, set[str]] = defaultdict(set)
    genes_by_disease: dict[str, set[str]] = defaultdict(set)
    compounds_by_disease: dict[str, set[str]] = defaultdict(set)
    compounds_by_gene: dict[str, set[str]] = defaultdict(set)

    for gene, disease in gd:
        add(("Gene", gene), ("Disease", disease))
        diseases_by_gene[gene].add(disease)
        genes_by_disease[disease].add(gene)
    for disease, compound in train_dc:
        add(("Disease", disease), ("Compound", compound))
        compounds_by_disease[disease].add(compound)
    for gene, compound in train_cg:
        add(("Gene", gene), ("Compound", compound))
        compounds_by_gene[gene].add(compound)

    return {
        "nodes": node_keys,
        "node_records": {key: nodes.get(key, {"kind": key[0], "identifier": key[1]}) for key in node_keys},
        "index": index,
        "node_types": node_types,
        "by_type": dict(by_type),
        "edges": sorted(integer_edges),
        "neighbours": neighbours,
        "diseases_by_gene": {k: set(v) for k, v in diseases_by_gene.items()},
        "genes_by_disease": {k: set(v) for k, v in genes_by_disease.items()},
        "compounds_by_disease": {k: set(v) for k, v in compounds_by_disease.items()},
        "compounds_by_gene": {k: set(v) for k, v in compounds_by_gene.items()},
        "compounds": sorted({compound for _, compound in dc | cg}),
        "full_gene_disease": set(gd),
        "train_disease_compound": set(train_dc),
        "train_gene_compound": set(train_cg),
    }


def _identifier_tokens(value: str) -> set[str]:
    value = re.sub(r"([A-Za-z])([0-9])", r"\1 \2", value)
    value = re.sub(r"([0-9])([A-Za-z])", r"\1 \2", value)
    return {token.casefold() for token in re.findall(r"[A-Za-z0-9]+", value) if token}


def build_documents(
    nodes: dict[NodeKey, dict], graph: dict
) -> tuple[dict[str, set[str]], dict[str, float]]:
    """Build an identifier-only lexical baseline without restricted labels."""
    docs: dict[str, set[str]] = {}
    for compound in graph["compounds"]:
        compound_key = ("Compound", compound)
        compound_idx = graph["index"][compound_key]
        tokens = set(_identifier_tokens(compound))
        for neighbour_idx in graph["neighbours"].get(compound_idx, set()):
            neighbour_key = graph["nodes"][neighbour_idx]
            tokens.update(_identifier_tokens(neighbour_key[1]))
        docs[compound] = tokens

    document_frequency: Counter[str] = Counter()
    for tokens in docs.values():
        document_frequency.update(tokens)
    count = max(len(docs), 1)
    idf = {
        token: math.log((count + 1) / (frequency + 1)) + 1.0
        for token, frequency in document_frequency.items()
    }
    return docs, idf


def _query_keys(query: dict) -> list[NodeKey]:
    if int(query["hop"]) == 2:
        return [("Gene", str(query["gene"])), ("Disease", str(query["disease"]))]
    return [
        ("Gene", str(query["gene"])),
        ("Disease", str(query["disease"])),
        ("Gene", str(query["bridge_gene"])),
    ]


def _hop_weights(query: dict, equal: bool = False) -> np.ndarray:
    if int(query["hop"]) == 2:
        weights = np.array([0.5, 1.0], dtype=np.float64)
    else:
        weights = np.array([1.0 / 3.0, 0.5, 1.0], dtype=np.float64)
    if equal:
        weights[:] = 1.0
    return weights / weights.sum()


def _project_ball_numpy(values: np.ndarray, eps: float = 1e-5) -> np.ndarray:
    values = np.asarray(values, dtype=np.float64)
    norms = np.linalg.norm(values, axis=-1, keepdims=True)
    scale = np.minimum(1.0, (1.0 - eps) / np.maximum(norms, 1e-15))
    return values * scale


def _log0(values: np.ndarray, eps: float = 1e-8) -> np.ndarray:
    values = _project_ball_numpy(values)
    norms = np.linalg.norm(values, axis=-1, keepdims=True)
    clipped = np.clip(norms, 0.0, 1.0 - 1e-7)
    factor = np.arctanh(clipped) / np.maximum(norms, eps)
    return values * factor


def _exp0(values: np.ndarray, eps: float = 1e-8) -> np.ndarray:
    norms = np.linalg.norm(values, axis=-1, keepdims=True)
    factor = np.tanh(norms) / np.maximum(norms, eps)
    return _project_ball_numpy(values * factor)


def _poincare_distance_numpy(query: np.ndarray, candidates: np.ndarray) -> np.ndarray:
    query = _project_ball_numpy(query.reshape(1, -1))[0]
    candidates = _project_ball_numpy(candidates)
    q2 = float(np.dot(query, query))
    c2 = np.sum(candidates * candidates, axis=1)
    delta2 = np.sum((candidates - query) ** 2, axis=1)
    denom = np.maximum((1.0 - q2) * (1.0 - c2), 1e-12)
    argument = 1.0 + 2.0 * delta2 / denom
    return np.arccosh(np.maximum(argument, 1.0))


def _compose_query_vector(
    query: dict,
    graph: dict,
    vectors: np.ndarray,
    *,
    poincare: bool,
    hop_weighting: bool = True,
    transport: bool = True,
) -> np.ndarray:
    keys = _query_keys(query)
    ids = [graph["index"][key] for key in keys]
    selected = np.asarray(vectors[ids], dtype=np.float64)
    weights = _hop_weights(query, equal=not hop_weighting)
    if not poincare:
        return np.sum(selected * weights[:, None], axis=0)
    if transport:
        tangent = _log0(selected)
        return _exp0(np.sum(tangent * weights[:, None], axis=0, keepdims=True))[0]
    return _project_ball_numpy(np.sum(selected * weights[:, None], axis=0, keepdims=True))[0]


def verified_compounds(query: dict, graph: dict) -> set[int]:
    """Return compound node indices with an exact typed path in the train graph."""
    disease = str(query["disease"])
    source_gene = str(query["gene"])
    if disease not in graph["diseases_by_gene"].get(source_gene, set()):
        return set()

    compounds: set[str] = set()
    if int(query["hop"]) == 2:
        compounds.update(graph["compounds_by_disease"].get(disease, set()))
    else:
        for bridge_gene in graph["genes_by_disease"].get(disease, set()):
            compounds.update(graph["compounds_by_gene"].get(bridge_gene, set()))
    return {
        graph["index"][("Compound", compound)]
        for compound in compounds
        if ("Compound", compound) in graph["index"]
    }


def rank_query(
    *,
    method: str,
    query: dict,
    graph: dict,
    vectors: np.ndarray | None,
    docs: dict[str, set[str]],
    idf: dict[str, float],
    nodes: dict[NodeKey, dict] | None = None,
) -> list[str]:
    """Rank all compound candidates for one query."""
    candidates = graph["compounds"]
    if method == "lexical":
        query_tokens: set[str] = set()
        for _, identifier in _query_keys(query):
            query_tokens.update(_identifier_tokens(identifier))
        query_weight = math.sqrt(sum(idf.get(t, 1.0) ** 2 for t in query_tokens)) or 1.0

        scored: list[tuple[float, str]] = []
        for compound in candidates:
            doc = docs.get(compound, set())
            overlap = query_tokens & doc
            numerator = sum(idf.get(token, 1.0) ** 2 for token in overlap)
            doc_weight = math.sqrt(sum(idf.get(t, 1.0) ** 2 for t in doc)) or 1.0
            score = numerator / (query_weight * doc_weight)
            scored.append((score, compound))
        return [compound for _, compound in sorted(scored, key=lambda item: (-item[0], item[1]))]

    if vectors is None:
        raise ValueError(f"Method {method} requires embedding vectors")

    candidate_ids = np.array(
        [graph["index"][("Compound", compound)] for compound in candidates],
        dtype=np.int64,
    )
    candidate_vectors = np.asarray(vectors[candidate_ids], dtype=np.float64)

    if method == "euclidean":
        query_vector = _compose_query_vector(query, graph, vectors, poincare=False)
        distances = np.linalg.norm(candidate_vectors - query_vector, axis=1)
    else:
        hop_weighting = method != "poincare_no_hop_weighting"
        transport = method != "poincare_no_parallel_transport"
        query_vector = _compose_query_vector(
            query,
            graph,
            vectors,
            poincare=True,
            hop_weighting=hop_weighting,
            transport=transport,
        )
        if method == "poincare_no_geodesic":
            distances = np.linalg.norm(candidate_vectors - query_vector, axis=1)
        else:
            distances = _poincare_distance_numpy(query_vector, candidate_vectors)

    ranking_indices = list(range(len(candidates)))
    if method == "poincare_with_path_verification":
        verified = verified_compounds(query, graph)
        ranking_indices.sort(
            key=lambda i: (
                graph["index"][("Compound", candidates[i])] not in verified,
                float(distances[i]),
                candidates[i],
            )
        )
    else:
        ranking_indices.sort(key=lambda i: (float(distances[i]), candidates[i]))
    return [candidates[i] for i in ranking_indices]


def _epoch_triplets(graph: dict, seed: int, epoch: int) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    rng = random.Random(seed * 100_003 + epoch)
    directed: list[tuple[int, int]] = []
    for left, right in graph["edges"]:
        directed.append((left, right))
        directed.append((right, left))
    rng.shuffle(directed)

    anchors: list[int] = []
    positives: list[int] = []
    negatives: list[int] = []
    for left, right in directed:
        candidates = graph["by_type"][graph["node_types"][right]]
        forbidden = graph["neighbours"].get(left, set())
        negative = None
        for _ in range(50):
            candidate = rng.choice(candidates)
            if candidate != right and candidate not in forbidden:
                negative = candidate
                break
        if negative is None:
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


def train_embeddings(graph: dict, seed: int) -> tuple[np.ndarray, np.ndarray, list[dict]]:
    """Train matched Euclidean and Poincare link-retrieval embeddings."""
    config = RetrieverConfig(
        num_nodes=len(graph["nodes"]),
        dim=DIM,
        margin=MARGIN,
        curvature=CURVATURE,
    )
    set_seed(seed)
    euclidean = EuclideanRetriever(config)
    set_seed(seed)
    poincare = PoincareRetriever(config)
    euclidean_optimizer = torch.optim.SGD(euclidean.parameters(), lr=LEARNING_RATE)
    poincare_optimizer = PoincareRSGD(poincare, lr=LEARNING_RATE)

    history: list[dict] = []
    for epoch in range(EPOCHS):
        anchor, positive, negative = _epoch_triplets(graph, seed, epoch)
        if anchor.numel() == 0:
            raise RuntimeError("No training triplets could be generated")

        euclidean_optimizer.zero_grad()
        euclidean_loss = euclidean.triplet_loss(anchor, positive, negative)
        euclidean_loss.backward()
        euclidean_optimizer.step()

        poincare_optimizer.zero_grad()
        poincare_loss = poincare.triplet_loss(anchor, positive, negative)
        poincare_loss.backward()
        poincare_optimizer.step()

        history.append(
            {
                "seed": seed,
                "epoch": epoch + 1,
                "euclidean_loss": float(euclidean_loss.detach()),
                "poincare_loss": float(poincare_loss.detach()),
                "poincare_max_norm": poincare.max_norm(),
            }
        )

    return (
        euclidean.embedding.weight.detach().cpu().numpy().astype(np.float32),
        poincare.embedding.detach().cpu().numpy().astype(np.float32),
        history,
    )


def _sample_queries(rows: list[dict], seed: int, label: str) -> list[dict]:
    rows = sorted(rows, key=lambda row: row["query_id"])
    if len(rows) <= QUERY_CAP:
        return rows
    rng = random.Random(f"{seed}:{label}")
    return sorted(rng.sample(rows, QUERY_CAP), key=lambda row: row["query_id"])


def make_queries(
    gd: set[Pair],
    dc_splits: dict[str, set[Pair]],
    cg_splits: dict[str, set[Pair]],
    seed: int,
) -> dict[str, list[dict]]:
    genes_by_disease: dict[str, list[str]] = defaultdict(list)
    diseases_by_gene: dict[str, list[str]] = defaultdict(list)
    for gene, disease in sorted(gd):
        genes_by_disease[disease].append(gene)
        diseases_by_gene[gene].append(disease)

    result: dict[str, list[dict]] = {}
    for split in ("validation", "test"):
        two_hop: list[dict] = []
        for disease, compound in sorted(dc_splits[split]):
            for gene in genes_by_disease.get(disease, []):
                two_hop.append(
                    {
                        "query_id": f"2h:{seed}:{split}:{gene}:{disease}:{compound}",
                        "hop": 2,
                        "gene": gene,
                        "disease": disease,
                        "target_compound": compound,
                    }
                )
        result[f"2hop_{split}"] = _sample_queries(two_hop, seed, f"2hop_{split}")

        three_hop: list[dict] = []
        for bridge_gene, compound in sorted(cg_splits[split]):
            for disease in diseases_by_gene.get(bridge_gene, []):
                source_genes = [g for g in genes_by_disease.get(disease, []) if g != bridge_gene]
                for gene in source_genes:
                    three_hop.append(
                        {
                            "query_id": (
                                f"3h:{seed}:{split}:{gene}:{disease}:"
                                f"{bridge_gene}:{compound}"
                            ),
                            "hop": 3,
                            "gene": gene,
                            "disease": disease,
                            "bridge_gene": bridge_gene,
                            "target_compound": compound,
                        }
                    )
        result[f"3hop_{split}"] = _sample_queries(three_hop, seed, f"3hop_{split}")
    return result


def write_query_sets(query_sets: dict[str, list[dict]], seed: int) -> None:
    QUERY_DIR.mkdir(parents=True, exist_ok=True)
    for split_name, rows in query_sets.items():
        path = QUERY_DIR / f"{split_name}_seed{seed}.jsonl"
        path.write_text(
            "".join(json.dumps(row, sort_keys=True) + "\n" for row in rows),
            encoding="utf-8",
        )


def evaluate_method(
    *,
    seed: int,
    split_name: str,
    queries: list[dict],
    method: str,
    graph: dict,
    euclidean: np.ndarray,
    poincare: np.ndarray,
    docs: dict[str, set[str]],
    idf: dict[str, float],
    nodes: dict[NodeKey, dict],
) -> tuple[dict, list[dict]]:
    hits = {1: 0, 5: 0, 10: 0}
    reciprocal_ranks: list[float] = []
    verified_top1 = 0
    predictions: list[dict] = []

    vectors = None
    if method == "euclidean":
        vectors = euclidean
    elif method != "lexical":
        vectors = poincare

    for query in queries:
        ranking = rank_query(
            method=method,
            query=query,
            graph=graph,
            vectors=vectors,
            docs=docs,
            idf=idf,
            nodes=nodes,
        )
        target = str(query["target_compound"])
        rank = ranking.index(target) + 1
        reciprocal_ranks.append(1.0 / rank)
        for k in hits:
            hits[k] += int(rank <= k)
        verified = verified_compounds(query, graph)
        top1_index = graph["index"][("Compound", ranking[0])]
        top1_verified = top1_index in verified
        verified_top1 += int(top1_verified)
        predictions.append(
            {
                "seed": seed,
                "split": split_name,
                "method": method,
                "query_id": query["query_id"],
                "hop": query["hop"],
                "target_compound": target,
                "target_rank": rank,
                "top1_prediction": ranking[0],
                "top1_path_verified": top1_verified,
                "top10_predictions": ranking[:10],
            }
        )

    count = len(queries)
    if count == 0:
        return {
            "seed": seed,
            "split": split_name,
            "method": method,
            "queries": 0,
            "recall_at_1": 0.0,
            "recall_at_5": 0.0,
            "recall_at_10": 0.0,
            "mrr": 0.0,
            "top1_path_verified_rate": 0.0,
        }, predictions
    return {
        "seed": seed,
        "split": split_name,
        "method": method,
        "queries": count,
        "recall_at_1": hits[1] / count,
        "recall_at_5": hits[5] / count,
        "recall_at_10": hits[10] / count,
        "mrr": statistics.mean(reciprocal_ranks),
        "top1_path_verified_rate": verified_top1 / count,
    }, predictions


def _t95(values: list[float]) -> tuple[float, float, float]:
    mean = statistics.mean(values)
    if len(values) < 2:
        return mean, mean, mean
    critical = 2.776 if len(values) == 5 else 1.96
    half = critical * statistics.stdev(values) / math.sqrt(len(values))
    return mean, mean - half, mean + half


def aggregate_metrics(seed_rows: list[dict]) -> list[dict]:
    grouped: dict[tuple[str, str], list[dict]] = defaultdict(list)
    for row in seed_rows:
        grouped[(row["split"], row["method"])].append(row)

    output: list[dict] = []
    for (split_name, method), rows in sorted(grouped.items()):
        aggregate = {
            "split": split_name,
            "method": method,
            "seeds": len(rows),
            "queries_mean": statistics.mean(float(row["queries"]) for row in rows),
        }
        for metric in METRICS:
            mean, low, high = _t95([float(row[metric]) for row in rows])
            aggregate[f"{metric}_mean"] = mean
            aggregate[f"{metric}_ci95_low"] = low
            aggregate[f"{metric}_ci95_high"] = high
        output.append(aggregate)
    return output


def _write_csv(path: Path, rows: list[dict]) -> None:
    if not rows:
        path.write_text("", encoding="utf-8")
        return
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def _metric_cell(row: dict, metric: str) -> str:
    return (
        f"{row[f'{metric}_mean']:.3f} "
        f"[{row[f'{metric}_ci95_low']:.3f}, {row[f'{metric}_ci95_high']:.3f}]"
    )


def write_tables(aggregate: list[dict]) -> None:
    rows = {(row["split"], row["method"]): row for row in aggregate}
    main_lines = [
        "| Task | Method | Recall@1 | Recall@5 | Recall@10 | MRR | Top-1 path verified |",
        "|---|---|---:|---:|---:|---:|---:|",
    ]
    labels = {"lexical": "Lexical", "euclidean": "Euclidean", "poincare": "Poincare / RMF-RAG"}
    for split_name in ("2hop_test", "3hop_test"):
        task = "2-hop" if split_name.startswith("2hop") else "3-hop"
        for method in MAIN_METHODS:
            row = rows.get((split_name, method))
            if not row:
                continue
            main_lines.append(
                f"| {task} | {labels[method]} | {_metric_cell(row, 'recall_at_1')} | "
                f"{_metric_cell(row, 'recall_at_5')} | {_metric_cell(row, 'recall_at_10')} | "
                f"{_metric_cell(row, 'mrr')} | {_metric_cell(row, 'top1_path_verified_rate')} |"
            )
    (RESULTS / "paper_table.md").write_text("\n".join(main_lines) + "\n", encoding="utf-8")

    ablation_lines = [
        "| Task | Configuration | Recall@5 | MRR | Top-1 path verified |",
        "|---|---|---:|---:|---:|",
    ]
    for split_name in ("2hop_test", "3hop_test"):
        task = "2-hop" if split_name.startswith("2hop") else "3-hop"
        for method in ("poincare",) + ABLATION_METHODS:
            row = rows.get((split_name, method))
            if not row:
                continue
            ablation_lines.append(
                f"| {task} | {method} | {_metric_cell(row, 'recall_at_5')} | "
                f"{_metric_cell(row, 'mrr')} | {_metric_cell(row, 'top1_path_verified_rate')} |"
            )
    (RESULTS / "ablation_table.md").write_text("\n".join(ablation_lines) + "\n", encoding="utf-8")


def write_source_docs(snapshot_hash: str, provenance: dict) -> None:
    data_dir = ROOT / "research" / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    source_text = f"""# Hetionet benchmark source\n\n- Dataset: Hetionet v1.0\n- Canonical repository: https://github.com/hetio/hetionet\n- Archived release: {ZENODO_RECORD}\n- Local snapshot: `research_data/hetionet/hetionet-v1.0.json.bz2`\n- SHA-256 computed by this run: `{snapshot_hash}`\n- Citation: {DATASET_CITATION}\n\n## Relation-level inclusion rule\n\nOnly relations with explicit reusable provenance are retained:\n\n- DISEASES `Disease-associates-Gene`, CC BY 4.0.\n- PharmacotherapyDB `Compound-treats-Disease` and `Compound-palliates-Disease`, CC0 1.0.\n- DrugCentral `Compound-binds-Gene`, CC BY 4.0.\n\nExpected frozen counts are 3,200 Gene-Disease, 1,145 Disease-Compound, and 823 Gene-Compound edges. The benchmark fails on count drift unless `ALLOW_EDGE_COUNT_DRIFT=1` is explicitly set for exploratory work.\n"""
    (data_dir / "HETIONET_SOURCE.md").write_text(source_text, encoding="utf-8")
    attribution_text = "# Hetionet relation attribution\n\n" + "\n".join(
        f"- `{item['relation']}` — source: {item['source']}; license: {item['license']}; retained edges: {item['edges']}"
        for item in provenance.get("sources", [])
    ) + "\n\nHetionet original repository content is CC0, while integrated records retain source-specific licensing. Preserve source attribution when redistributing derived benchmark outputs.\n"
    (data_dir / "HETIONET_ATTRIBUTION.md").write_text(attribution_text, encoding="utf-8")


def build_report_inline(metadata: dict, aggregate: list[dict]) -> None:
    labels = {
        "lexical": "Lexical",
        "euclidean": "Euclidean",
        "poincare": "RMF-RAG hyperbolic",
        "poincare_no_geodesic": "No geodesic ranking",
        "poincare_no_hop_weighting": "No hop weighting",
        "poincare_no_parallel_transport": "No origin-tangent composition",
        "poincare_with_path_verification": "Path verification rerank",
    }
    test_rows = [row for row in aggregate if row["split"].endswith("_test")]
    table_rows = "".join(
        "<tr>"
        f"<td>{html.escape(row['split'])}</td>"
        f"<td>{html.escape(labels.get(row['method'], row['method']))}</td>"
        f"<td>{_metric_cell(row, 'recall_at_1')}</td>"
        f"<td>{_metric_cell(row, 'recall_at_5')}</td>"
        f"<td>{_metric_cell(row, 'mrr')}</td>"
        f"<td>{_metric_cell(row, 'top1_path_verified_rate')}</td>"
        "</tr>"
        for row in test_rows
    )
    page = f"""<!doctype html><html lang='en'><head><meta charset='utf-8'>
<title>RMF-RAG Hetionet Benchmark</title><style>
body{{font-family:Arial,sans-serif;max-width:1180px;margin:40px auto;padding:0 20px;color:#102033}}
h1{{font-size:42px}} table{{border-collapse:collapse;width:100%;font-size:14px}} th,td{{border:1px solid #d7e0e8;padding:9px}} th{{background:#e9f5f0}} .note{{padding:16px;background:#fff7ed;border-left:4px solid #d97706;margin:20px 0}} code{{background:#eef2f5;padding:2px 5px}}</style></head><body>
<h1>RMF-RAG Hetionet Benchmark</h1>
<p>Five-seed typed biomedical link retrieval with terminal answer edges removed before training.</p>
<table><thead><tr><th>Split</th><th>Method</th><th>Recall@1</th><th>Recall@5</th><th>MRR</th><th>Top-1 path verified</th></tr></thead><tbody>{table_rows}</tbody></table>
<div class='note'><strong>Scope:</strong> graph retrieval and source-scoped evidence are not clinical recommendations. Hyperbolic gains, if any, must be interpreted with their confidence intervals.</div>
<p>Snapshot SHA-256: <code>{html.escape(metadata['snapshot_sha256'])}</code></p>
<p>{html.escape(DATASET_CITATION)}</p>
</body></html>"""
    (RESULTS / "report.html").write_text(page, encoding="utf-8")


def main() -> None:
    RESULTS.mkdir(parents=True, exist_ok=True)
    QUERY_DIR.mkdir(parents=True, exist_ok=True)

    snapshot_path = ensure_snapshot()
    snapshot_hash = sha256_file(snapshot_path)
    raw, nodes = load_snapshot(snapshot_path)
    edges = selected_edges(raw)
    gd, dc, cg, provenance = relation_sets(edges)
    validate_relation_counts(gd, dc, cg)
    write_source_docs(snapshot_hash, provenance)

    all_metrics: list[dict] = []
    all_predictions: list[dict] = []
    all_history: list[dict] = []
    per_seed_query_counts: dict[str, dict[str, int]] = {}

    for seed in SEEDS:
        print(f"\n=== Seed {seed} ===")
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
        query_sets = make_queries(gd, dc_splits, cg_splits, seed)
        write_query_sets(query_sets, seed)
        per_seed_query_counts[str(seed)] = {name: len(rows) for name, rows in query_sets.items()}

        docs, idf = build_documents(nodes, graph)
        euclidean, poincare, history = train_embeddings(graph, seed)
        all_history.extend(history)
        np.savez_compressed(
            RESULTS / f"embeddings_seed{seed}.npz",
            euclidean=euclidean,
            poincare=poincare,
        )
        (RESULTS / f"node_index_seed{seed}.json").write_text(
            json.dumps(
                [
                    {"index": i, "kind": kind, "identifier": identifier}
                    for i, (kind, identifier) in enumerate(graph["nodes"])
                ],
                indent=2,
            ) + "\n",
            encoding="utf-8",
        )

        for split_name, queries in query_sets.items():
            for method in ALL_METHODS:
                metrics, predictions = evaluate_method(
                    seed=seed,
                    split_name=split_name,
                    queries=queries,
                    method=method,
                    graph=graph,
                    euclidean=euclidean,
                    poincare=poincare,
                    docs=docs,
                    idf=idf,
                    nodes=nodes,
                )
                all_metrics.append(metrics)
                all_predictions.extend(predictions)
                print(
                    f"{split_name:16s} {method:34s} "
                    f"R@5={metrics['recall_at_5']:.4f} MRR={metrics['mrr']:.4f}"
                )

    aggregate = aggregate_metrics(all_metrics)
    metadata = {
        "dataset": "Hetionet v1.0",
        "dataset_citation": DATASET_CITATION,
        "snapshot_path": str(snapshot_path.relative_to(ROOT) if snapshot_path.is_relative_to(ROOT) else snapshot_path),
        "snapshot_sha256": snapshot_hash,
        "seeds": list(SEEDS),
        "selected_edges": {
            "gene_disease": len(gd),
            "disease_compound": len(dc),
            "gene_compound": len(cg),
        },
        "relation_provenance": provenance,
        "training": {
            "dimension": DIM,
            "epochs": EPOCHS,
            "margin": MARGIN,
            "learning_rate": LEARNING_RATE,
            "curvature": CURVATURE,
            "negative_sampling": "one deterministic type-matched negative per directed positive edge per epoch, shared across geometries",
            "optimizer": "Euclidean SGD and Poincare Riemannian SGD; same learning rate and epoch budget",
        },
        "query_cap_per_hop_split_seed": QUERY_CAP,
        "query_counts": per_seed_query_counts,
        "leakage_control": (
            "validation/test Disease-Compound and Gene-Compound terminal edges are removed "
            "from the training graph before embedding training and typed-path verification"
        ),
        "scope": "research link retrieval; not clinical utility or medical advice",
    }

    (RESULTS / "metadata.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    _write_csv(RESULTS / "metrics_by_seed.csv", all_metrics)
    _write_csv(RESULTS / "aggregate_metrics.csv", aggregate)
    (RESULTS / "training_history.json").write_text(json.dumps(all_history, indent=2) + "\n", encoding="utf-8")
    with (RESULTS / "predictions.jsonl").open("w", encoding="utf-8") as handle:
        for row in all_predictions:
            handle.write(json.dumps(row, sort_keys=True) + "\n")
    write_tables(aggregate)
    build_report_inline(metadata, aggregate)

    print(f"\nWrote reproducible benchmark outputs to {RESULTS}")
    print("Next: run research/scripts/main_query_demo.py and research/scripts/evaluate_evidence.py")


if __name__ == "__main__":
    main()
