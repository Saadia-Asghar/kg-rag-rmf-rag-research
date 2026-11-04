"""Generate manuscript figures directly from saved benchmark outputs.

Reads only files written by run_main_rmf_rag_benchmark.py; no values are
typed by hand. Requires matplotlib (not part of the core research requirements).
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
MAIN = ROOT / "research" / "results" / "main_benchmark"
OUT = ROOT / "research" / "paper" / "figures"

LABELS = {
    "lexical": "Lexical",
    "euclidean": "Euclidean",
    "poincare": "Poincaré",
    "poincare_with_path_verification": "Poincaré + path verif.",
}
COLORS = {
    "lexical": "#8c8c8c",
    "euclidean": "#2b6cb0",
    "poincare": "#c05621",
    "poincare_with_path_verification": "#2f855a",
}


def _rows() -> dict[tuple[str, str], dict]:
    with (MAIN / "aggregate_metrics.csv").open(encoding="utf-8") as handle:
        return {(r["split"], r["method"]): r for r in csv.DictReader(handle)}


def chance_mrr() -> float:
    nodes = json.loads((MAIN / "node_index_seed7.json").read_text(encoding="utf-8"))
    n = sum(1 for node in nodes if node["kind"] == "Compound")
    return sum(1.0 / r for r in range(1, n + 1)) / n


def figure_mrr() -> None:
    rows = _rows()
    chance = chance_mrr()
    methods = list(LABELS)
    tasks = [("2hop_test", "2-hop test"), ("3hop_test", "3-hop test")]
    fig, axes = plt.subplots(1, 2, figsize=(9, 3.6))
    for ax, (split, title) in zip(axes, tasks):
        means, lows, highs = [], [], []
        for m in methods:
            r = rows[(split, m)]
            mean = float(r["mrr_mean"])
            means.append(mean)
            lows.append(mean - max(float(r["mrr_ci95_low"]), 0.0))
            highs.append(float(r["mrr_ci95_high"]) - mean)
        x = list(range(len(methods)))
        ax.bar(x, means, yerr=[lows, highs], capsize=4,
               color=[COLORS[m] for m in methods], edgecolor="black", linewidth=0.5)
        ax.axhline(chance, color="black", linestyle="--", linewidth=1, label="random ranking")
        ax.legend(fontsize=7, frameon=False, loc="upper left")
        ax.set_xticks(x)
        ax.set_xticklabels([LABELS[m] for m in methods], rotation=20, ha="right", fontsize=8)
        ax.set_title(title, fontsize=10)
        ax.set_ylabel("MRR (mean and 95% CI, 5 seeds)", fontsize=8)
        ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    fig.savefig(OUT / "fig_test_mrr.png", dpi=300)
    plt.close(fig)


def figure_loss() -> None:
    history = json.loads((MAIN / "training_history.json").read_text(encoding="utf-8"))
    fig, ax = plt.subplots(figsize=(5, 3.2))
    seeds = sorted({h["seed"] for h in history})
    for i, seed in enumerate(seeds):
        sel = [h for h in history if h["seed"] == seed]
        ep = [h["epoch"] for h in sel]
        ax.plot(ep, [h["euclidean_loss"] for h in sel], color=COLORS["euclidean"],
                alpha=0.7, linewidth=1, label="Euclidean" if i == 0 else None)
        ax.plot(ep, [h["poincare_loss"] for h in sel], color=COLORS["poincare"],
                alpha=0.7, linewidth=1, label="Poincaré" if i == 0 else None)
    ax.set_xlabel("Epoch", fontsize=9)
    ax.set_ylabel("Mean triplet loss", fontsize=9)
    ax.legend(fontsize=8, frameon=False)
    ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    fig.savefig(OUT / "fig_training_loss.png", dpi=300)
    plt.close(fig)


def figure_sweep() -> None:
    """Hop-hallucination rate and MRR versus dimension (pre-registered sweep)."""
    path = ROOT / "research" / "results" / "hallucination_sweep" / "summary.csv"
    if not path.exists():
        return
    with path.open(encoding="utf-8") as handle:
        rows = {(r["config"], r["split"]): r for r in csv.DictReader(handle)}
    dims = sorted({int(c.split("_d")[1].split("_")[0]) for c, _ in rows})
    series = [
        ("Euclidean", lambda d: f"euclidean_d{d}", COLORS["euclidean"], "o", "-"),
        ("Poincaré, c = 1", lambda d: f"poincare_d{d}_c1", COLORS["poincare"], "s", "-"),
        ("Poincaré, c = 10", lambda d: f"poincare_d{d}_c10", "#805ad5", "^", "--"),
    ]
    panels = [("hhr_at_1", "3hop_test", "3-hop: hallucinated top-1 (HHR@1)"),
              ("hhr_at_1", "2hop_test", "2-hop: hallucinated top-1 (HHR@1)"),
              ("mrr", "3hop_test", "3-hop: accuracy (MRR)"),
              ("mrr", "2hop_test", "2-hop: accuracy (MRR)")]
    fig, axes = plt.subplots(2, 2, figsize=(9, 6.2))
    for ax, (metric, split, title) in zip(axes.flat, panels):
        for label, name, color, marker, style in series:
            mean = [float(rows[(name(d), split)][f"{metric}_mean"]) for d in dims]
            low = [m - float(rows[(name(d), split)][f"{metric}_ci95_low"]) for m, d in zip(mean, dims)]
            high = [float(rows[(name(d), split)][f"{metric}_ci95_high"]) - m for m, d in zip(mean, dims)]
            ax.errorbar(dims, mean, yerr=[low, high], label=label, color=color, marker=marker,
                        linestyle=style, capsize=3, linewidth=1.2, markersize=4)
        if metric == "mrr":
            ax.axhline(chance_mrr(), color="black", linestyle=":", linewidth=1, label="random ranking")
        ax.set_xscale("log", base=2)
        ax.set_xticks(dims)
        ax.set_xticklabels([str(d) for d in dims])
        ax.set_xlabel("Embedding dimension", fontsize=8)
        ax.set_title(title, fontsize=9)
        ax.tick_params(labelsize=8)
        ax.spines[["top", "right"]].set_visible(False)
    axes[0, 0].legend(fontsize=7, frameon=False)
    axes[1, 0].legend(fontsize=7, frameon=False)
    fig.tight_layout()
    fig.savefig(OUT / "fig_hallucination_sweep.png", dpi=300)
    plt.close(fig)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    figure_mrr()
    figure_loss()
    figure_sweep()
    print(f"Wrote figures to {OUT}")


if __name__ == "__main__":
    main()
