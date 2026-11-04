"""Relation-aware baselines: TransE-style (Euclidean) and MuRP-style (Poincare).

Both models learn one transformation per directed relation type and are trained
with the same margin objective, triplets, mini-batches and epochs as the
relation-free retrievers in controlled_retrievers.py, so that only the model
family and geometry change.

* TransE-style [Bordes et al., 2013]: d(h, r, t) = || e_h + w_r - e_t ||.
* MuRP-style [Balazevic et al., 2019]: d(h, r, t) = d_B( exp0(R_r * log0(e_h)), e_t (+) w_r ),
  with a diagonal relation matrix R_r, a relation translation w_r in the ball and
  Mobius addition (+). Unlike the original MuRP we use the shared margin loss
  and no entity biases, so that the training objective stays matched.
"""
from __future__ import annotations

import torch
from torch import nn

EPS = 1e-5


def project_ball(x: torch.Tensor, eps: float = EPS) -> torch.Tensor:
    norm = torch.linalg.vector_norm(x, dim=-1, keepdim=True).clamp_min(1e-15)
    return x * torch.clamp((1.0 - eps) / norm, max=1.0)


def mobius_add(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    """Mobius addition on the unit Poincare ball (curvature 1)."""
    xy = (x * y).sum(dim=-1, keepdim=True)
    x2 = (x * x).sum(dim=-1, keepdim=True)
    y2 = (y * y).sum(dim=-1, keepdim=True)
    num = (1.0 + 2.0 * xy + y2) * x + (1.0 - x2) * y
    den = 1.0 + 2.0 * xy + x2 * y2
    return num / den.clamp_min(1e-15)


def log0(y: torch.Tensor) -> torch.Tensor:
    norm = torch.linalg.vector_norm(y, dim=-1, keepdim=True).clamp(1e-15, 1.0 - 1e-6)
    return torch.atanh(norm) * y / norm


def exp0(v: torch.Tensor) -> torch.Tensor:
    norm = torch.linalg.vector_norm(v, dim=-1, keepdim=True).clamp_min(1e-15)
    return torch.tanh(norm) * v / norm


def poincare_distance(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    x2 = (x * x).sum(dim=-1)
    y2 = (y * y).sum(dim=-1)
    d2 = ((x - y) ** 2).sum(dim=-1)
    arg = 1.0 + 2.0 * d2 / ((1.0 - x2) * (1.0 - y2)).clamp_min(EPS)
    return torch.acosh(arg.clamp_min(1.0 + 1e-7))


class TransEStyle(nn.Module):
    hyperbolic = False

    def __init__(self, num_nodes: int, num_relations: int, dim: int, margin: float,
                 init_std: float = 1e-2) -> None:
        super().__init__()
        self.margin = margin
        self.entity = nn.Parameter(torch.randn(num_nodes, dim) * init_std)
        self.relation = nn.Parameter(torch.randn(num_relations, dim) * init_std)

    def transform(self, head_ids: torch.Tensor, rel_ids: torch.Tensor) -> torch.Tensor:
        return self.entity[head_ids] + self.relation[rel_ids]

    def distance(self, head_ids, rel_ids, tail_ids) -> torch.Tensor:
        return torch.linalg.vector_norm(self.transform(head_ids, rel_ids) - self.entity[tail_ids], dim=-1)

    def triplet_loss(self, a, r, p, n) -> torch.Tensor:
        return torch.relu(self.margin + self.distance(a, r, p) - self.distance(a, r, n)).mean()

    @torch.no_grad()
    def candidate_distances(self, head_id: int, rel_id: int, candidate_ids: torch.Tensor) -> torch.Tensor:
        query = self.transform(torch.tensor([head_id]), torch.tensor([rel_id]))
        return torch.linalg.vector_norm(query - self.entity[candidate_ids], dim=-1)

    def ball_parameters(self) -> list[nn.Parameter]:
        return []


class MuRPStyle(nn.Module):
    hyperbolic = True

    def __init__(self, num_nodes: int, num_relations: int, dim: int, margin: float,
                 init_std: float = 1e-2) -> None:
        super().__init__()
        self.margin = margin
        self.entity = nn.Parameter(project_ball(torch.randn(num_nodes, dim) * init_std))
        self.relation = nn.Parameter(project_ball(torch.randn(num_relations, dim) * init_std))
        self.diag = nn.Parameter(1.0 + torch.randn(num_relations, dim) * init_std)

    def head_transform(self, head_ids, rel_ids) -> torch.Tensor:
        return project_ball(exp0(self.diag[rel_ids] * log0(self.entity[head_ids])))

    def tail_transform(self, tail_ids, rel_ids) -> torch.Tensor:
        return project_ball(mobius_add(self.entity[tail_ids], self.relation[rel_ids]))

    def distance(self, head_ids, rel_ids, tail_ids) -> torch.Tensor:
        return poincare_distance(self.head_transform(head_ids, rel_ids), self.tail_transform(tail_ids, rel_ids))

    def triplet_loss(self, a, r, p, n) -> torch.Tensor:
        return torch.relu(self.margin + self.distance(a, r, p) - self.distance(a, r, n)).mean()

    @torch.no_grad()
    def candidate_distances(self, head_id: int, rel_id: int, candidate_ids: torch.Tensor) -> torch.Tensor:
        k = candidate_ids.numel()
        head = self.head_transform(torch.tensor([head_id]), torch.tensor([rel_id])).expand(k, -1)
        tail = self.tail_transform(candidate_ids, torch.full((k,), rel_id, dtype=torch.long))
        return poincare_distance(head, tail)

    def ball_parameters(self) -> list[nn.Parameter]:
        return [self.entity, self.relation]


class MixedRSGD:
    """SGD for Euclidean parameters; Riemannian SGD + projection for ball parameters."""

    def __init__(self, model: nn.Module, lr: float) -> None:
        self.model = model
        self.lr = lr
        self.ball = {id(p) for p in model.ball_parameters()}

    def zero_grad(self) -> None:
        for p in self.model.parameters():
            if p.grad is not None:
                p.grad.zero_()

    @torch.no_grad()
    def step(self) -> None:
        for p in self.model.parameters():
            if p.grad is None:
                continue
            if id(p) in self.ball:
                scale = ((1.0 - (p * p).sum(dim=-1, keepdim=True)).clamp_min(EPS) ** 2) / 4.0
                p.add_(scale * p.grad, alpha=-self.lr)
                p.copy_(project_ball(p))
            else:
                p.add_(p.grad, alpha=-self.lr)
