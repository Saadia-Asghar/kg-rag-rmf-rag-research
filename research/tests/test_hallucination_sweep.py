"""Tests for the pre-registered hop-hallucination sweep."""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import numpy as np
import pytest
import torch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "research" / "scripts"))
sys.path.insert(0, str(Path(__file__).resolve().parent))

import run_hallucination_geometry_sweep as sweep  # noqa: E402
import run_main_rmf_rag_benchmark as bench  # noqa: E402
from test_main_benchmark_runner import node_lookup, synthetic_raw  # noqa: E402


# ------------------------------------------------------------------ statistics
def test_t_distribution_matches_reference_values():
    assert sweep.t_two_sided_p(2.776, 4) == pytest.approx(0.05, abs=5e-4)
    assert sweep.t_two_sided_p(2.262, 9) == pytest.approx(0.05, abs=5e-4)
    assert sweep.t_two_sided_p(0.0, 9) == pytest.approx(1.0)
    assert sweep.t_critical_975(4) == pytest.approx(2.776, abs=1e-3)
    assert sweep.t_critical_975(9) == pytest.approx(2.262, abs=1e-3)


def test_paired_test_and_sign_test():
    result = sweep.paired_test([-0.1, -0.2, -0.15, -0.05, -0.12, -0.3, -0.08, -0.11, -0.2, -0.14])
    assert result["negative"] == 10 and result["positive"] == 0
    assert result["sign_test_p"] == pytest.approx(2 / 2 ** 10)
    assert result["ci95_high"] < 0
    assert result["p"] < 0.001


def test_holm_correction():
    assert sweep.holm([0.01, 0.04, 0.03]) == pytest.approx([0.03, 0.06, 0.06])
    assert sweep.holm([0.5, 0.9]) == pytest.approx([1.0, 1.0])


# ------------------------------------------------------- curvature equivalence
def _log0_c(x: np.ndarray, c: float) -> np.ndarray:
    n = np.linalg.norm(x, axis=-1, keepdims=True)
    return np.arctanh(math.sqrt(c) * n) * x / (math.sqrt(c) * n)


def _exp0_c(v: np.ndarray, c: float) -> np.ndarray:
    n = np.linalg.norm(v, axis=-1, keepdims=True)
    return np.tanh(math.sqrt(c) * n) * v / (math.sqrt(c) * n)


def test_curvature_rescaling_preserves_distances_and_composition():
    c = 10.0
    rng = np.random.default_rng(3)
    points = rng.normal(size=(8, 5)) * 0.06
    assert np.linalg.norm(points, axis=1).max() < 1 / math.sqrt(c)

    model = bench.PoincareRetriever(bench.RetrieverConfig(num_nodes=2, dim=5, margin=0.45, curvature=c))
    left = torch.tensor(points[:1], dtype=torch.float64).expand(7, 5)
    right = torch.tensor(points[1:], dtype=torch.float64)
    d_c = model.distance(left, right).numpy()
    d_1 = bench._poincare_distance_numpy(points[0] * math.sqrt(c), points[1:] * math.sqrt(c))
    np.testing.assert_allclose(d_c * math.sqrt(c), d_1, atol=1e-6)

    weights = np.array([1 / 3, 1 / 2, 1.0])
    weights = weights / weights.sum()
    composed_c = _exp0_c(np.sum(_log0_c(points[:3], c) * weights[:, None], axis=0, keepdims=True), c)
    composed_1 = bench._exp0(np.sum(bench._log0(points[:3] * math.sqrt(c)) * weights[:, None],
                                    axis=0, keepdims=True))
    np.testing.assert_allclose(composed_c * math.sqrt(c), composed_1, atol=1e-6)


# ------------------------------------------------------ hallucination metrics
def _synthetic_graph():
    raw = synthetic_raw()
    nodes = node_lookup(raw)
    gd, dc, cg, _ = bench.relation_sets(bench.selected_edges(raw))
    return bench.build_graph(nodes, gd, dc, cg)


def test_hop_hallucination_metrics_and_path_verification():
    graph = _synthetic_graph()
    vectors = np.zeros((len(graph["nodes"]), 2))
    idx = graph["index"]
    # Query (G1, D1) composes to the origin. C4 is nearest but has no D1 path.
    vectors[idx[("Compound", "C4")]] = [0.01, 0.0]
    vectors[idx[("Compound", "C1")]] = [0.5, 0.0]
    vectors[idx[("Compound", "C2")]] = [0.6, 0.0]
    vectors[idx[("Compound", "C3")]] = [0.7, 0.0]
    for gene in ("G2", "G3", "G4"):
        vectors[idx[("Gene", gene)]] = [0.0, 0.9]
    vectors[idx[("Disease", "D2")]] = [0.0, -0.9]
    query = {"hop": 2, "gene": "G1", "disease": "D1", "target_compound": "C2"}

    supported = {c for c in graph["compounds"]
                 if idx[("Compound", c)] in bench.verified_compounds(query, graph)}
    assert supported == {"C1", "C2", "C3"}

    metrics = sweep.evaluate(graph, [query], vectors, "euclidean")
    assert metrics["hhr_at_1"] == 1.0
    assert metrics["unsupported_at_10"] == pytest.approx(0.1)
    assert metrics["mrr"] == pytest.approx(1 / 3)
    assert metrics["pv_hhr_at_1"] == 0.0
    assert metrics["pv_mrr"] == pytest.approx(1 / 2)

    poincare = sweep.evaluate(graph, [query], vectors, "poincare")
    assert poincare["hhr_at_1"] == 1.0
    assert poincare["pv_hhr_at_1"] == 0.0


def test_train_one_is_deterministic_and_stays_in_ball():
    graph = _synthetic_graph()
    old = sweep.EPOCHS
    sweep.EPOCHS = 3
    try:
        a = sweep.train_one(graph, 29, "poincare", 4, 10.0, 0.3)
        b = sweep.train_one(graph, 29, "poincare", 4, 10.0, 0.3)
    finally:
        sweep.EPOCHS = old
    np.testing.assert_array_equal(a[0], b[0])
    assert a[3] < 1.0


# --------------------------------------------------- pre-registration integrity
def test_saved_preregistration_matches_script_settings():
    path = ROOT / "research" / "results" / "hallucination_sweep" / "preregistration.json"
    if not path.exists():
        pytest.skip("sweep has not been run")
    saved = json.loads(path.read_text(encoding="utf-8"))
    expected = json.loads(json.dumps(sweep.PREREGISTRATION["fixed_settings"]))
    assert saved["fixed_settings"] == expected
    assert saved["primary_test"] == sweep.PREREGISTRATION["primary_test"]
    assert "written_at" in saved
