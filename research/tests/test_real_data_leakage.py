"""Leakage audit on the real Hetionet v1.0 data (skipped when the snapshot is absent).

For every seed used in the paper this checks that no validation or test answer
edge is visible to training or to path verification, that the splits are
disjoint, and that the frozen query files equal a fresh regeneration.
Run time is about one to two minutes because the snapshot must be loaded.
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "research" / "scripts"))

import run_main_rmf_rag_benchmark as bench  # noqa: E402

SEEDS = (7, 17, 29, 43, 101, 211, 307, 401, 503, 601)
MAIN_SEEDS = (7, 17, 29, 43, 101)


def _snapshot_available() -> bool:
    override = os.environ.get("HETIONET_JSON_BZ2")
    return bool(override and Path(override).exists()) or bench.SNAPSHOT.exists()


pytestmark = pytest.mark.skipif(not _snapshot_available(), reason="Hetionet snapshot not available")


@pytest.fixture(scope="module")
def data():
    raw, nodes = bench.load_snapshot(bench.ensure_snapshot())
    gd, dc, cg, _ = bench.relation_sets(bench.selected_edges(raw))
    bench.validate_relation_counts(gd, dc, cg)
    return nodes, gd, dc, cg


@pytest.mark.parametrize("seed", SEEDS)
def test_no_held_out_answer_edge_reaches_training(data, seed):
    nodes, gd, dc, cg = data
    dc_splits, cg_splits, graph, queries = bench._prepare_seed(nodes, gd, dc, cg, seed)

    for splits in (dc_splits, cg_splits):
        assert not (splits["train"] & splits["validation"])
        assert not (splits["train"] & splits["test"])
        assert not (splits["validation"] & splits["test"])

    held_dc = dc_splits["validation"] | dc_splits["test"]
    held_cg = cg_splits["validation"] | cg_splits["test"]
    assert not (graph["train_disease_compound"] & held_dc)
    assert not (graph["train_gene_compound"] & held_cg)

    index = graph["index"]
    edges = set(graph["edges"])
    for disease, compound in held_dc:
        a, b = index[("Disease", disease)], index[("Compound", compound)]
        assert (min(a, b), max(a, b)) not in edges
    for gene, compound in held_cg:
        a, b = index[("Gene", gene)], index[("Compound", compound)]
        assert (min(a, b), max(a, b)) not in edges

    for name, rows in queries.items():
        split = "validation" if "validation" in name else "test"
        for q in rows:
            if q["hop"] == 2:
                assert (q["disease"], q["target_compound"]) in dc_splits[split]
                assert q["target_compound"] not in graph["compounds_by_disease"].get(q["disease"], set())
            else:
                assert (q["bridge_gene"], q["target_compound"]) in cg_splits[split]
                assert q["target_compound"] not in graph["compounds_by_gene"].get(q["bridge_gene"], set())


@pytest.mark.parametrize("seed", MAIN_SEEDS)
def test_frozen_query_files_match_regeneration(data, seed):
    nodes, gd, dc, cg = data
    _, _, _, queries = bench._prepare_seed(nodes, gd, dc, cg, seed)
    for name, rows in queries.items():
        path = ROOT / "research" / "query_sets" / f"{name}_seed{seed}.jsonl"
        frozen = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
        assert frozen == json.loads(json.dumps(rows))
        assert len(frozen) == bench.QUERY_CAP
