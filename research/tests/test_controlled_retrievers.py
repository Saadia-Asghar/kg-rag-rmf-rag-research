from __future__ import annotations

import sys
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


def tiny_triplets():
    anchor = torch.tensor([0, 1, 2, 3], dtype=torch.long)
    positive = torch.tensor([4, 5, 6, 7], dtype=torch.long)
    negative = torch.tensor([7, 6, 5, 4], dtype=torch.long)
    return anchor, positive, negative


def test_poincare_distance_is_finite_and_symmetric():
    set_seed(7)
    model = PoincareRetriever(RetrieverConfig(num_nodes=8, dim=5))
    a = model.node_vectors(torch.tensor([0, 1]))
    b = model.node_vectors(torch.tensor([2, 3]))
    d1 = model.distance(a, b)
    d2 = model.distance(b, a)
    assert torch.isfinite(d1).all()
    assert torch.allclose(d1, d2, atol=1e-6)


def test_riemannian_optimizer_keeps_points_inside_ball():
    set_seed(17)
    model = PoincareRetriever(RetrieverConfig(num_nodes=8, dim=6, margin=0.4))
    optimizer = PoincareRSGD(model, lr=0.08)
    anchor, positive, negative = tiny_triplets()
    for _ in range(80):
        optimizer.zero_grad()
        loss = model.triplet_loss(anchor, positive, negative)
        loss.backward()
        optimizer.step()
    assert model.max_norm() < model.radius + 1e-6


def test_euclidean_loss_can_decrease():
    set_seed(29)
    model = EuclideanRetriever(RetrieverConfig(num_nodes=8, dim=6, margin=0.4))
    optimizer = torch.optim.Adam(model.parameters(), lr=0.03)
    anchor, positive, negative = tiny_triplets()
    initial = float(model.triplet_loss(anchor, positive, negative).detach())
    for _ in range(100):
        optimizer.zero_grad()
        loss = model.triplet_loss(anchor, positive, negative)
        loss.backward()
        optimizer.step()
    final = float(model.triplet_loss(anchor, positive, negative).detach())
    assert final <= initial


def test_poincare_loss_can_decrease():
    set_seed(43)
    model = PoincareRetriever(RetrieverConfig(num_nodes=8, dim=6, margin=0.4))
    optimizer = PoincareRSGD(model, lr=0.08)
    anchor, positive, negative = tiny_triplets()
    initial = float(model.triplet_loss(anchor, positive, negative).detach())
    for _ in range(120):
        optimizer.zero_grad()
        loss = model.triplet_loss(anchor, positive, negative)
        loss.backward()
        optimizer.step()
    final = float(model.triplet_loss(anchor, positive, negative).detach())
    assert final <= initial


def test_candidate_ranking_returns_all_candidates():
    set_seed(101)
    model = EuclideanRetriever(RetrieverConfig(num_nodes=10, dim=4))
    candidates = torch.tensor([5, 6, 7, 8, 9], dtype=torch.long)
    ranked, distances = rank_candidates(model, 0, candidates)
    assert set(ranked.tolist()) == set(candidates.tolist())
    assert torch.all(distances[1:] >= distances[:-1])
