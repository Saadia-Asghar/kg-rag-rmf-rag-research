from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "research" / "scripts"))

import run_main_rmf_rag_benchmark as bench  # noqa: E402


def edge(source_kind, source_id, target_kind, target_id, kind, source, license_name):
    return {
        "source_id": [source_kind, source_id],
        "target_id": [target_kind, target_id],
        "kind": kind,
        "direction": "both",
        "data": {"source": source, "license": license_name},
    }


def synthetic_raw():
    nodes = []
    for kind, identifiers in {
        "Gene": ["G1", "G2", "G3", "G4"],
        "Disease": ["D1", "D2"],
        "Compound": ["C1", "C2", "C3", "C4"],
    }.items():
        for identifier in identifiers:
            nodes.append({"kind": kind, "identifier": identifier, "name": identifier, "data": {}})

    edges = [
        edge("Disease", "D1", "Gene", "G1", "associates", "DISEASES", "CC BY 4.0"),
        edge("Disease", "D1", "Gene", "G2", "associates", "DISEASES", "CC BY 4.0"),
        edge("Disease", "D2", "Gene", "G3", "associates", "DISEASES", "CC BY 4.0"),
        edge("Disease", "D2", "Gene", "G4", "associates", "DISEASES", "CC BY 4.0"),
        edge("Compound", "C1", "Disease", "D1", "treats", "PharmacotherapyDB", "CC0 1.0"),
        edge("Compound", "C2", "Disease", "D1", "palliates", "PharmacotherapyDB", "CC0 1.0"),
        edge("Compound", "C3", "Disease", "D1", "treats", "PharmacotherapyDB", "CC0 1.0"),
        edge("Compound", "C2", "Disease", "D2", "treats", "PharmacotherapyDB", "CC0 1.0"),
        edge("Compound", "C3", "Disease", "D2", "palliates", "PharmacotherapyDB", "CC0 1.0"),
        edge("Compound", "C4", "Disease", "D2", "treats", "PharmacotherapyDB", "CC0 1.0"),
        edge("Compound", "C1", "Gene", "G1", "binds", "DrugCentral", "CC BY 4.0"),
        edge("Compound", "C2", "Gene", "G2", "binds", "DrugCentral", "CC BY 4.0"),
        edge("Compound", "C3", "Gene", "G3", "binds", "DrugCentral", "CC BY 4.0"),
        edge("Compound", "C4", "Gene", "G4", "binds", "DrugCentral", "CC BY 4.0"),
        # Must be filtered out.
        edge("Disease", "D1", "Gene", "G3", "associates", "DisGeNET", "CC BY-NC 4.0"),
    ]
    return {"nodes": nodes, "edges": edges}


def node_lookup(raw):
    return {(n["kind"], str(n["identifier"])): n for n in raw["nodes"]}


def test_license_filter_and_relation_orientation():
    raw = synthetic_raw()
    selected = bench.selected_edges(raw)
    gd, dc, cg, provenance = bench.relation_sets(selected)
    assert len(selected) == 14
    assert ("G1", "D1") in gd
    assert ("D1", "C1") in dc
    assert ("G1", "C1") in cg
    assert ("G3", "D1") not in gd
    assert provenance["sources"]


def test_split_is_disjoint_and_keeps_training_edge_per_group():
    edges = {("D1", f"C{i}") for i in range(1, 7)} | {("D2", f"X{i}") for i in range(1, 5)}
    split = bench.split_edges(edges, seed=17, minimum_train_per_group=True)
    assert not (split["train"] & split["validation"])
    assert not (split["train"] & split["test"])
    assert not (split["validation"] & split["test"])
    assert split["train"] | split["validation"] | split["test"] == edges
    assert any(disease == "D1" for disease, _ in split["train"])
    assert any(disease == "D2" for disease, _ in split["train"])


def test_removed_terminal_edges_are_not_in_training_graph():
    raw = synthetic_raw()
    nodes = node_lookup(raw)
    gd, dc, cg, _ = bench.relation_sets(bench.selected_edges(raw))
    removed_dc = {("D1", "C3")}
    removed_cg = {("G3", "C3")}
    graph = bench.build_graph(nodes, gd, dc, cg, removed_dc=removed_dc, removed_cg=removed_cg)
    assert ("D1", "C3") not in graph["train_disease_compound"]
    assert ("G3", "C3") not in graph["train_gene_compound"]
    d = graph["index"][("Disease", "D1")]
    c = graph["index"][("Compound", "C3")]
    assert c not in graph["neighbours"][d]


def test_query_generation_and_all_rankers_return_complete_candidate_set():
    raw = synthetic_raw()
    nodes = node_lookup(raw)
    gd, dc, cg, _ = bench.relation_sets(bench.selected_edges(raw))
    dc_splits = {
        "train": dc - {("D1", "C3")},
        "validation": set(),
        "test": {("D1", "C3")},
    }
    cg_splits = {
        "train": cg - {("G3", "C3")},
        "validation": set(),
        "test": {("G3", "C3")},
    }
    graph = bench.build_graph(
        nodes,
        gd,
        dc,
        cg,
        removed_dc=dc - dc_splits["train"],
        removed_cg=cg - cg_splits["train"],
    )
    query_sets = bench.make_queries(gd, dc_splits, cg_splits, seed=7)
    assert query_sets["2hop_test"]
    assert query_sets["3hop_test"]
    docs, idf = bench.build_documents(nodes, graph)

    rng = np.random.default_rng(7)
    euclidean = rng.normal(0, 0.05, size=(len(graph["nodes"]), 6)).astype(np.float32)
    poincare = bench._project_ball_numpy(
        rng.normal(0, 0.03, size=(len(graph["nodes"]), 6))
    ).astype(np.float32)

    query = query_sets["2hop_test"][0]
    for method in bench.ALL_METHODS:
        vectors = euclidean if method == "euclidean" else poincare if method != "lexical" else None
        ranking = bench.rank_query(
            method=method,
            query=query,
            graph=graph,
            vectors=vectors,
            docs=docs,
            idf=idf,
            nodes=nodes,
        )
        assert set(ranking) == set(graph["compounds"])
        assert len(ranking) == len(graph["compounds"])


def test_matched_training_smoke(monkeypatch):
    raw = synthetic_raw()
    nodes = node_lookup(raw)
    gd, dc, cg, _ = bench.relation_sets(bench.selected_edges(raw))
    graph = bench.build_graph(nodes, gd, dc, cg)
    monkeypatch.setattr(bench, "EPOCHS", 3)
    monkeypatch.setattr(bench, "DIM", 6)
    euclidean, poincare, history = bench.train_embeddings(graph, seed=29)
    assert euclidean.shape == poincare.shape == (len(graph["nodes"]), 6)
    assert len(history) == 3
    assert np.isfinite(euclidean).all()
    assert np.isfinite(poincare).all()
    assert np.max(np.linalg.norm(poincare, axis=1)) < 1.0
