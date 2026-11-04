"""Tests for the TransE-style / MuRP-style baselines and filtered ranking."""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import pytest
import torch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "research" / "scripts"))
sys.path.insert(0, str(ROOT / "research" / "models"))
sys.path.insert(0, str(Path(__file__).resolve().parent))

import run_baseline_comparison as base  # noqa: E402
import run_main_rmf_rag_benchmark as bench  # noqa: E402
from relational_retrievers import (  # noqa: E402
    MixedRSGD, MuRPStyle, TransEStyle, exp0, log0, mobius_add, poincare_distance)
from test_main_benchmark_runner import node_lookup, synthetic_raw  # noqa: E402


def test_mobius_addition_identities():
    torch.manual_seed(0)
    x = torch.randn(5, 4) * 0.2
    y = torch.randn(5, 4) * 0.2
    zero = torch.zeros(5, 4)
    torch.testing.assert_close(mobius_add(zero, y), y)
    torch.testing.assert_close(mobius_add(x, zero), x)
    torch.testing.assert_close(mobius_add(-x, x), zero, atol=1e-6, rtol=0)
    near_edge_x = 0.95 * x / torch.linalg.vector_norm(x, dim=-1, keepdim=True)
    near_edge_y = 0.95 * y / torch.linalg.vector_norm(y, dim=-1, keepdim=True)
    assert torch.linalg.vector_norm(mobius_add(near_edge_x, near_edge_y), dim=-1).max() < 1.0


def test_exp_log_inverse_and_distance():
    torch.manual_seed(1)
    x = torch.randn(6, 3) * 0.3
    torch.testing.assert_close(exp0(log0(x)), x, atol=1e-6, rtol=1e-5)
    d = poincare_distance(x, x.flip(0))
    assert (d >= 0).all()
    assert poincare_distance(x, x).max() < 1e-3


def _graph_and_codes():
    raw = synthetic_raw()
    gd, dc, cg, _ = bench.relation_sets(bench.selected_edges(raw))
    graph = bench.build_graph(node_lookup(raw), gd, dc, cg)
    codes = torch.tensor([base.TYPE_CODE[t] for t in graph["node_types"]], dtype=torch.long)
    return graph, codes


@pytest.mark.parametrize("cls", [TransEStyle, MuRPStyle])
def test_relational_models_learn(cls):
    graph, codes = _graph_and_codes()
    torch.manual_seed(3)
    model = cls(len(graph["nodes"]), len(base.REL), 4, 0.45)
    optimizer = MixedRSGD(model, 0.3)
    losses = []
    for epoch in range(40):
        a, p, n = bench._epoch_triplets(graph, 3, epoch)
        r = base.REL_TABLE[codes[a], codes[p]]
        assert (r >= 0).all()
        optimizer.zero_grad()
        loss = model.triplet_loss(a, r, p, n)
        loss.backward()
        optimizer.step()
        losses.append(float(loss.detach()))
    assert losses[-1] < losses[0]
    for p in model.ball_parameters():
        assert torch.linalg.vector_norm(p, dim=-1).max() < 1.0


def test_filtered_ranking_and_hallucination_metrics():
    graph, _ = _graph_and_codes()
    order = {"C4": 0.05, "C1": 0.1, "C3": 0.2, "C2": 0.3}
    dist = np.array([order[c] for c in graph["compounds"]])
    query = {"hop": 2, "gene": "G1", "disease": "D1", "target_compound": "C2"}
    known = {"D1": {"C1", "C2", "C3"}}
    m = base.evaluate(graph, [query], lambda q: dist, dc_by_disease=known, cg_by_gene={})
    assert m["mrr"] == pytest.approx(1 / 4)           # raw order C4, C1, C3, C2
    assert m["filtered_mrr"] == pytest.approx(1 / 2)  # C1 and C3 are other true answers
    assert m["hhr_at_1"] == 1.0                       # C4 has no D1 path
    assert m["pv_hhr_at_1"] == 0.0
    assert m["pv_mrr"] == pytest.approx(1 / 3)        # C1, C3, C2, then C4
