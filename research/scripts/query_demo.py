#!/usr/bin/env python3
"""Run a practical query against the trained pilot embeddings."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[2]
RESULTS = ROOT / "research" / "results"


def normalize(value: str) -> str:
    value = value.lower().replace("’", "'")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def poincare_distance(left: np.ndarray, right: np.ndarray) -> float:
    left_norm = min(float(np.dot(left, left)), 0.999)
    right_norm = min(float(np.dot(right, right)), 0.999)
    squared = float(np.dot(left - right, left - right))
    argument = 1.0 + (2.0 * squared) / max((1.0 - left_norm) * (1.0 - right_norm), 1e-9)
    return float(np.arccosh(max(argument, 1.0)))


def main() -> None:
    disease = normalize(" ".join(sys.argv[1:]) if len(sys.argv) > 1 else "cancer")
    model_index = json.loads((RESULTS / "model_index.json").read_text())
    nodes = model_index["nodes"]
    index = {node: i for i, node in enumerate(nodes)}
    disease_node = f"disease::{disease}"
    if disease_node not in index:
        available = [node.split("::", 1)[1] for node in nodes if node.startswith("disease::")]
        suggestions = sorted(available, key=lambda item: abs(len(item) - len(disease)))[:8]
        raise SystemExit(
            f'Disease "{disease}" is not in this pilot graph.\n'
            f"Try one of: {', '.join(suggestions)}"
        )

    embeddings = np.load(RESULTS / "trained_embeddings.npz")["hyperbolic"]
    source = embeddings[index[disease_node]]
    ranked = []
    for node in nodes:
        if not node.startswith("drug::"):
            continue
        drug = node.split("::", 1)[1]
        ranked.append((poincare_distance(source, embeddings[index[node]]), drug))
    ranked.sort()

    print(f'Query: "What drug is connected to {disease.title()}?"')
    print("RMF-RAG hyperbolic retrieval:")
    for rank, (distance, drug) in enumerate(ranked[:5], 1):
        print(f"  {rank}. {drug.title():40s} geodesic_distance={distance:.4f}")
    print("\nThis is a retrieval ranking, not medical advice.")


if __name__ == "__main__":
    main()