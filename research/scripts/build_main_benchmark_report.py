#!/usr/bin/env python3
"""Build a self-contained HTML report from the main benchmark outputs."""

from __future__ import annotations

import csv
import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESULTS = ROOT / "research" / "results" / "main_benchmark"
OUTPUT = RESULTS / "report.html"

METHOD_LABELS = {
    "lexical": "Lexical",
    "euclidean": "Euclidean",
    "poincare": "RMF-RAG hyperbolic",
    "poincare_no_geodesic": "No geodesic ranking",
    "poincare_no_hop_weighting": "No hop weighting",
    "poincare_no_parallel_transport": "No parallel transport",
    "poincare_with_path_verification": "Path verification rerank",
}


def read_rows() -> list[dict[str, str]]:
    with (RESULTS / "aggregate_metrics.csv").open(encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def value(row: dict[str, str], metric: str) -> str:
    mean = float(row[f"{metric}_mean"])
    low = float(row[f"{metric}_ci95_low"])
    high = float(row[f"{metric}_ci95_high"])
    return f"{mean:.3f} [{low:.3f}, {high:.3f}]"


def table(rows: list[dict[str, str]], title: str) -> str:
    rows = sorted(rows, key=lambda row: (row["split"], row["method"]))
    body = "".join(
        "<tr>"
        f"<td>{html.escape(row['split'])}</td>"
        f"<td>{html.escape(METHOD_LABELS.get(row['method'], row['method']))}</td>"
        f"<td>{value(row, 'recall_at_1')}</td>"
        f"<td>{value(row, 'recall_at_5')}</td>"
        f"<td>{value(row, 'mrr')}</td>"
        f"<td>{value(row, 'top1_path_verified_rate')}</td>"
        "</tr>"
        for row in rows
    )
    return (
        f"<h2>{html.escape(title)}</h2>"
        "<table><thead><tr><th>Split</th><th>Method</th><th>Recall@1</th>"
        "<th>Recall@5</th><th>MRR</th><th>Top-1 path verified</th></tr></thead>"
        f"<tbody>{body}</tbody></table>"
    )


def main() -> None:
    metadata = json.loads((RESULTS / "metadata.json").read_text(encoding="utf-8"))
    rows = read_rows()
    test_rows = [row for row in rows if row["split"].endswith("_test")]
    ablation_rows = [
        row
        for row in test_rows
        if row["method"] in {"poincare", *set(METHOD_LABELS) - {"lexical", "euclidean", "poincare"}}
    ]
    selected_edges = metadata["selected_edges"]
    stat_cards = "".join(
        f"<div class='stat'><strong>{html.escape(str(value))}</strong><span>{html.escape(label)}</span></div>"
        for value, label in (
            (len(metadata["seeds"]), "random seeds"),
            (selected_edges["gene_disease"], "Gene–Disease edges"),
            (selected_edges["disease_compound"], "Disease–Compound edges"),
            (selected_edges["gene_compound"], "Gene–Compound edges"),
        )
    )
    page = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>RMF-RAG Hetionet Benchmark</title>
  <style>
    :root {{ color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }}
    body {{ margin: 0; color: #102033; background: #f4f7fa; }}
    main {{ max-width: 1180px; margin: 0 auto; padding: 48px 24px 72px; }}
    .eyebrow {{ color: #047857; font-size: 13px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }}
    h1 {{ margin: 10px 0 8px; font-size: clamp(32px, 5vw, 58px); line-height: 1.04; }}
    h2 {{ margin: 40px 0 12px; font-size: 24px; }}
    .lede {{ max-width: 760px; color: #526276; font-size: 18px; line-height: 1.55; }}
    .stats {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 28px 0; }}
    .stat {{ padding: 18px; background: #0e2134; border-radius: 14px; color: white; }}
    .stat strong {{ display: block; color: #6ee7b7; font-size: 28px; }}
    .stat span {{ display: block; margin-top: 6px; color: #d6e1ea; font-size: 13px; }}
    table {{ width: 100%; border-collapse: collapse; background: white; border: 1px solid #d7e0e8; border-radius: 12px; overflow: hidden; font-size: 14px; }}
    th, td {{ padding: 12px 14px; border-bottom: 1px solid #e5ebf0; text-align: left; }}
    th {{ background: #e9f5f0; color: #075a43; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; }}
    tr:last-child td {{ border-bottom: 0; }}
    .callout {{ margin-top: 28px; padding: 20px 22px; border-left: 4px solid #059669; background: #ecfdf5; line-height: 1.55; }}
    .warning {{ border-left-color: #d97706; background: #fff7ed; }}
    code {{ padding: 2px 5px; border-radius: 4px; background: #e8eef3; }}
    footer {{ margin-top: 44px; color: #64748b; font-size: 13px; line-height: 1.6; }}
    @media (max-width: 760px) {{ .stats {{ grid-template-columns: repeat(2, 1fr); }} table {{ display: block; overflow-x: auto; white-space: nowrap; }} }}
  </style>
</head>
<body>
<main>
  <div class="eyebrow">Reproducible research artifact</div>
  <h1>RMF-RAG Hetionet Benchmark</h1>
  <p class="lede">A five-seed, license-filtered evaluation of typed biomedical link retrieval. Terminal answer edges are held out before training, and every aggregate value includes a two-sided 95% confidence interval across seeds.</p>
  <div class="stats">{stat_cards}</div>
  {table(test_rows, "Main test results")}
  {table(ablation_rows, "Test-set ablations")}
  <div class="callout"><strong>Calibrated finding.</strong> Poincaré retrieval improves 3-hop MRR over the matched Euclidean model (0.015 vs 0.011), but not 2-hop MRR (0.012 vs 0.013). The intervals overlap, so neither difference is statistically conclusive.</div>
  <div class="callout warning"><strong>Scope boundary.</strong> This is graph link retrieval, not clinical evidence or a treatment recommendation. The next scientific phase requires licensed semantic evidence, independent therapeutic labels, and human evaluation.</div>
  <footer>
    Snapshot: {html.escape(metadata["dataset"])} · SHA-256: <code>{html.escape(metadata["snapshot_sha256"])}</code><br>
    Citation: {html.escape(metadata["dataset_citation"])}<br>
    Rebuild with <code>python research/scripts/run_main_rmf_rag_benchmark.py</code>.
  </footer>
</main>
</body>
</html>
"""
    OUTPUT.write_text(page, encoding="utf-8")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()