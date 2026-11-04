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
    ieee_sweep_panels("hhr_at_1", "HHR@1 (lower is better)", "ieee_fig_hhr.png")
    ieee_sweep_panels("mrr", "MRR", "ieee_fig_mrr.png")
    ieee_pipeline()
    print(f"Wrote figures to {OUT}")


# ------------------------------------------------- IEEE column-width figures
def ieee_sweep_panels(metric: str, ylabel: str, filename: str) -> None:
    """Two side-by-side panels (3-hop, 2-hop), 3.5 in wide, for one metric."""
    path = ROOT / "research" / "results" / "hallucination_sweep" / "summary.csv"
    with path.open(encoding="utf-8") as handle:
        rows = {(r["config"], r["split"]): r for r in csv.DictReader(handle)}
    dims = [2, 4, 8, 16]
    series = [
        ("Euclidean", "euclidean_d{}", COLORS["euclidean"], "o", "-"),
        ("Poincaré, c=1", "poincare_d{}_c1", COLORS["poincare"], "s", "-"),
        ("Poincaré, c=10", "poincare_d{}_c10", "#805ad5", "^", "--"),
    ]
    plt.rcParams.update({"font.family": "serif", "font.serif": ["Times New Roman", "DejaVu Serif"]})
    fig, axes = plt.subplots(1, 2, figsize=(3.5, 1.85))
    for ax, (split, title) in zip(axes, (("3hop_test", "3-hop"), ("2hop_test", "2-hop"))):
        for label, pattern, color, marker, style in series:
            keys = [(pattern.format(d), split) for d in dims]
            mean = [float(rows[k][f"{metric}_mean"]) for k in keys]
            low = [m - float(rows[k][f"{metric}_ci95_low"]) for m, k in zip(mean, keys)]
            high = [float(rows[k][f"{metric}_ci95_high"]) - m for m, k in zip(mean, keys)]
            ax.errorbar(dims, mean, yerr=[low, high], label=label, color=color, marker=marker,
                        linestyle=style, capsize=1.5, linewidth=0.9, markersize=2.5, elinewidth=0.6)
        if metric == "mrr":
            ax.axhline(chance_mrr(), color="black", linestyle=":", linewidth=0.7)
        ax.set_xscale("log", base=2)
        ax.set_xticks(dims)
        ax.set_xticklabels([str(d) for d in dims])
        ax.set_xlabel("Dimension", fontsize=7)
        ax.set_title(title, fontsize=7.5)
        ax.tick_params(labelsize=6, length=2)
        ax.spines[["top", "right"]].set_visible(False)
    axes[0].set_ylabel(ylabel, fontsize=7)
    handles, labels = axes[0].get_legend_handles_labels()
    fig.legend(handles, labels, loc="upper center", ncol=3, fontsize=6, frameon=False,
               bbox_to_anchor=(0.5, 1.02))
    fig.tight_layout(rect=(0, 0, 1, 0.9), pad=0.3, w_pad=0.8)
    fig.savefig(OUT / filename, dpi=600)
    plt.close(fig)
    plt.rcParams.update(plt.rcParamsDefault)


def ieee_pipeline() -> None:
    """Schematic of the evaluation pipeline, 3.5 in wide."""
    from matplotlib.patches import FancyBboxPatch

    plt.rcParams.update({"font.family": "serif", "font.serif": ["Times New Roman", "DejaVu Serif"]})
    fig, ax = plt.subplots(figsize=(3.5, 2.55))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7.3)
    ax.axis("off")

    def box(x, y, w, h, text, color):
        ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05,rounding_size=0.15",
                                    linewidth=0.6, edgecolor="#333333", facecolor=color))
        ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontsize=6, linespacing=1.15)

    def arrow(x1, y1, x2, y2):
        ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                    arrowprops={"arrowstyle": "-|>", "linewidth": 0.6, "color": "#333333",
                                "mutation_scale": 6})

    box(0.1, 6.0, 4.6, 1.1, "Hetionet v1.0 (checksum-verified)\nlicence filter: G–D, D–C, G–C", "#edf2f7")
    box(5.3, 6.0, 4.6, 1.1, "Seeded split of answer edges\nval./test edges removed", "#edf2f7")
    arrow(4.7, 6.55, 5.3, 6.55)
    box(0.1, 4.2, 4.6, 1.2, "Euclidean retriever\nSGD", "#dbeafe")
    box(5.3, 4.2, 4.6, 1.2, "Poincaré retriever (curvature c)\nRiemannian SGD + projection", "#fde2cf")
    arrow(6.2, 6.0, 2.4, 5.4)
    arrow(7.6, 6.0, 7.6, 5.4)
    box(0.1, 2.4, 9.8, 1.2, "Hop-weighted query composition (gene, disease, bridge gene)\n"
        "rank all 666 compounds by distance", "#f0fff4")
    arrow(2.4, 4.2, 2.4, 3.6)
    arrow(7.6, 4.2, 7.6, 3.6)
    box(0.1, 0.2, 4.6, 1.5, "Accuracy\nRecall@k, MRR\n(vs. random ranking)", "#fefcbf")
    box(5.3, 0.2, 4.6, 1.5, "Groundedness\nHHR@1, Unsupported@10\n± typed-path verification", "#fed7d7")
    arrow(2.4, 2.4, 2.4, 1.7)
    arrow(7.6, 2.4, 7.6, 1.7)
    fig.tight_layout(pad=0.1)
    fig.savefig(OUT / "ieee_fig_pipeline.png", dpi=600)
    plt.close(fig)
    plt.rcParams.update(plt.rcParamsDefault)


if __name__ == "__main__":
    main()
