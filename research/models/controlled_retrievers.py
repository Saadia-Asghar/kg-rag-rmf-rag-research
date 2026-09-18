"""Matched Euclidean and Poincare retrievers for controlled RMF-RAG experiments.

The two models share the same node IDs, dimensionality, triplet objective and
negative samples. Only the geometry and optimizer differ. The hyperbolic model
uses the Poincare ball, PyTorch autograd for analytic derivatives, Riemannian
gradient scaling, and projection back into the valid ball after each update.

This module deliberately avoids hidden framework magic so that the geometry is
auditable in an undergraduate research project.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

import torch
from torch import nn


@dataclass(frozen=True)
class RetrieverConfig:
    num_nodes: int
    dim: int = 32
    margin: float = 0.5
    curvature: float = 1.0
    init_std: float = 1e-2
    eps: float = 1e-5


class EuclideanRetriever(nn.Module):
    def __init__(self, config: RetrieverConfig) -> None:
        super().__init__()
        self.config = config
        self.embedding = nn.Embedding(config.num_nodes, config.dim)
        nn.init.normal_(self.embedding.weight, mean=0.0, std=config.init_std)

    def node_vectors(self, node_ids: torch.Tensor) -> torch.Tensor:
        return self.embedding(node_ids)

    @staticmethod
    def distance(left: torch.Tensor, right: torch.Tensor) -> torch.Tensor:
        return torch.linalg.vector_norm(left - right, dim=-1)

    def triplet_loss(
        self,
        anchor_ids: torch.Tensor,
        positive_ids: torch.Tensor,
        negative_ids: torch.Tensor,
    ) -> torch.Tensor:
        anchor = self.node_vectors(anchor_ids)
        positive = self.node_vectors(positive_ids)
        negative = self.node_vectors(negative_ids)
        d_pos = self.distance(anchor, positive)
        d_neg = self.distance(anchor, negative)
        return torch.relu(self.config.margin + d_pos - d_neg).mean()


class PoincareRetriever(nn.Module):
    def __init__(self, config: RetrieverConfig) -> None:
        super().__init__()
        if config.curvature <= 0:
            raise ValueError("curvature must be positive")
        self.config = config
        initial = torch.empty(config.num_nodes, config.dim).normal_(
            mean=0.0, std=config.init_std
        )
        self.embedding = nn.Parameter(self.project(initial))

    @property
    def radius(self) -> float:
        return (1.0 - self.config.eps) / (self.config.curvature ** 0.5)

    def project(self, value: torch.Tensor) -> torch.Tensor:
        max_norm = (1.0 - self.config.eps) / (self.config.curvature ** 0.5)
        norm = torch.linalg.vector_norm(value, dim=-1, keepdim=True).clamp_min(1e-15)
        scale = torch.clamp(max_norm / norm, max=1.0)
        return value * scale

    def node_vectors(self, node_ids: torch.Tensor) -> torch.Tensor:
        return self.embedding[node_ids]

    def distance(self, left: torch.Tensor, right: torch.Tensor) -> torch.Tensor:
        c = self.config.curvature
        eps = self.config.eps
        left_sq = (left * left).sum(dim=-1)
        right_sq = (right * right).sum(dim=-1)
        delta_sq = ((left - right) ** 2).sum(dim=-1)

        denom = (1.0 - c * left_sq) * (1.0 - c * right_sq)
        denom = denom.clamp_min(eps)
        argument = 1.0 + (2.0 * c * delta_sq) / denom
        argument = argument.clamp_min(1.0 + eps)
        return torch.acosh(argument) / (c ** 0.5)

    def triplet_loss(
        self,
        anchor_ids: torch.Tensor,
        positive_ids: torch.Tensor,
        negative_ids: torch.Tensor,
    ) -> torch.Tensor:
        anchor = self.node_vectors(anchor_ids)
        positive = self.node_vectors(positive_ids)
        negative = self.node_vectors(negative_ids)
        d_pos = self.distance(anchor, positive)
        d_neg = self.distance(anchor, negative)
        return torch.relu(self.config.margin + d_pos - d_neg).mean()

    @torch.no_grad()
    def max_norm(self) -> float:
        return float(torch.linalg.vector_norm(self.embedding, dim=-1).max().cpu())


class PoincareRSGD:
    """Minimal Riemannian SGD for the Poincare ball.

    For curvature c, the conformal factor is lambda_x = 2/(1-c||x||^2).
    The Riemannian gradient is lambda_x^-2 times the Euclidean gradient.
    A projected additive update is used as a first-order retraction.
    """

    def __init__(self, model: PoincareRetriever, lr: float = 0.05) -> None:
        if lr <= 0:
            raise ValueError("learning rate must be positive")
        self.model = model
        self.lr = lr

    def zero_grad(self) -> None:
        if self.model.embedding.grad is not None:
            self.model.embedding.grad.zero_()

    @torch.no_grad()
    def step(self) -> None:
        parameter = self.model.embedding
        if parameter.grad is None:
            return
        c = self.model.config.curvature
        sq_norm = (parameter * parameter).sum(dim=-1, keepdim=True)
        scale = ((1.0 - c * sq_norm).clamp_min(self.model.config.eps) ** 2) / 4.0
        riemannian_grad = scale * parameter.grad
        parameter.add_(riemannian_grad, alpha=-self.lr)
        parameter.copy_(self.model.project(parameter))


def rank_candidates(
    model: EuclideanRetriever | PoincareRetriever,
    query_node_id: int,
    candidate_node_ids: torch.Tensor,
) -> tuple[torch.Tensor, torch.Tensor]:
    """Return candidate IDs and distances sorted nearest first."""
    query_id = torch.tensor([query_node_id], dtype=torch.long, device=candidate_node_ids.device)
    query = model.node_vectors(query_id).expand(candidate_node_ids.shape[0], -1)
    candidates = model.node_vectors(candidate_node_ids)
    distances = model.distance(query, candidates)
    order = torch.argsort(distances)
    return candidate_node_ids[order], distances[order]


def set_seed(seed: int) -> None:
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
