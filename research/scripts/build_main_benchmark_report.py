#!/usr/bin/env python3
"""Rebuild the Hetionet HTML report only from saved benchmark outputs."""
from __future__ import annotations

import csv
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RESULTS = ROOT / "research" / "results" / "main_benchmark"
OUTPUT = RESULTS / "report.html"
FIGURE = RESULTS / "test_mrr_comparison.svg"

LABELS = {
    "lexical": "Lexical",
    "euclidean": "Euclidean",
    "poincare": "RMF-RAG hyperbolic",
    "poincare_no_geodesic": "No geodesic ranking",
    "poincare_no_hop_weighting": "No hop weighting",
    "poincare_no_parallel_transport": "No origin-tangent composition",
    "poincare_with_path_verification": "Path verification rerank",
}


def read_rows() -> list[dict[str, str]]:
    with (RESULTS / "aggregate_metrics.csv").open(encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def cell(row: dict[str, str], metric: str) -> str:
    return (
        f"{float(row[f'{metric}_mean']):.3f} "
        f"[{float(row[f'{metric}_ci95_low']):.3f}, "
        f"{float(row[f'{metric}_ci95_high']):.3f}]"
    )


def result_table(rows: list[dict[str, str]]) -> str:
    body = "".join(
        "<tr>"
        f"<td>{html.escape(row['split'])}</td>"
        f"<td>{html.escape(LABELS.get(row['method'], row['method']))}</td>"
        f"<td>{cell(row, 'recall_at_1')}</td>"
        f"<td>{cell(row, 'recall_at_5')}</td>"
        f"<td>{cell(row, 'recall_at_10')}</td>"
        f"<td>{cell(row, 'mrr')}</td>"
        f"<td>{cell(row, 'top1_path_verified_rate')}</td>"
        "</tr>"
        for row in sorted(rows, key=lambda item: (item['split'], item['method']))
    )
    return (
        "<table><thead><tr><th>Split</th><th>Method</th><th>Recall@1</th>"
        "<th>Recall@5</th><th>Recall@10</th><th>MRR</th>"
        "<th>Top-1 path verified</th></tr></thead><tbody>" + body + "</tbody></table>"
    )


def interpretation(rows: list[dict[str, str]]) -> str:
    lookup = {(row['split'], row['method']): row for row in rows}
    notes = []
    for split in ('2hop_test', '3hop_test'):
        euc = lookup.get((split, 'euclidean'))
        hyp = lookup.get((split, 'poincare'))
        if not euc or not hyp:
            continue
        e = float(euc['mrr_mean'])
        h = float(hyp['mrr_mean'])
        direction = 'higher' if h > e else 'lower' if h < e else 'equal'
        notes.append(f"{split.replace('_test','')}: Poincare mean MRR is {direction} than Euclidean ({h:.3f} vs {e:.3f}).")
    if not notes:
        return "No Euclidean/Poincare test comparison is available in the saved outputs."
    return " ".join(notes) + " Confidence intervals should be inspected before describing any difference as conclusive."


def write_mrr_figure(rows: list[dict[str, str]]) -> None:
    """Write a dependency-free SVG from the saved five-seed test aggregates."""
    lookup = {(row['split'], row['method']): row for row in rows}
    values = [
        ("2-hop Euclidean", lookup[('2hop_test', 'euclidean')]),
        ("2-hop Poincare", lookup[('2hop_test', 'poincare')]),
        ("3-hop Euclidean", lookup[('3hop_test', 'euclidean')]),
        ("3-hop Poincare", lookup[('3hop_test', 'poincare')]),
    ]
    maximum = max(float(row['mrr_ci95_high']) for _, row in values)
    scale = 360 / maximum if maximum else 1.0
    bars = []
    for index, (label, row) in enumerate(values):
        mean = float(row['mrr_mean'])
        low = max(0.0, float(row['mrr_ci95_low']))
        high = float(row['mrr_ci95_high'])
        y = 55 + index * 60
        bars.append(
            f"<text x='10' y='{y + 18}'>{html.escape(label)}</text>"
            f"<rect x='180' y='{y}' width='{mean * scale:.1f}' height='24' fill='#2563eb'/>"
            f"<line x1='{180 + low * scale:.1f}' y1='{y + 12}' x2='{180 + high * scale:.1f}' y2='{y + 12}' stroke='#111827' stroke-width='2'/>"
            f"<text x='550' y='{y + 18}'>{mean:.3f}</text>"
        )
    FIGURE.write_text(
        "<svg xmlns='http://www.w3.org/2000/svg' width='650' height='320' viewBox='0 0 650 320'>"
        "<style>text{font:14px Arial;fill:#111827}</style>"
        "<text x='10' y='25' font-weight='bold'>Hetionet test MRR (mean; line = 95% t interval)</text>"
        + "".join(bars) + "</svg>", encoding='utf-8'
    )


def main() -> None:
    metadata = json.loads((RESULTS / 'metadata.json').read_text(encoding='utf-8'))
    rows = read_rows()
    write_mrr_figure(rows)
    test_rows = [row for row in rows if row['split'].endswith('_test')]
    selected = metadata.get('selected_edges', {})
    page = f"""<!doctype html><html lang='en'><head><meta charset='utf-8'>
<title>RMF-RAG Hetionet Benchmark</title><style>
body{{font-family:Arial,sans-serif;max-width:1180px;margin:40px auto;padding:0 20px;color:#102033;background:#f7f9fb}}
main{{background:white;padding:32px;border-radius:16px}} h1{{font-size:40px}} table{{border-collapse:collapse;width:100%;font-size:13px}}
th,td{{border:1px solid #d7e0e8;padding:9px}} th{{background:#e9f5f0}} .note{{padding:16px;background:#ecfdf5;border-left:4px solid #059669;margin:20px 0}} .warn{{background:#fff7ed;border-left-color:#d97706}} code{{background:#eef2f5;padding:2px 5px}}</style></head><body><main>
<h1>RMF-RAG Hetionet Benchmark</h1>
<p>Dataset: {html.escape(metadata.get('dataset',''))}. Seeds: {html.escape(str(metadata.get('seeds',[])))}.</p>
<p>Selected edges: Gene-Disease {selected.get('gene_disease','?')}, Disease-Compound {selected.get('disease_compound','?')}, Gene-Compound {selected.get('gene_compound','?')}.</p>
{result_table(test_rows)}
<p><img src='test_mrr_comparison.svg' alt='Test MRR comparison with 95 percent confidence intervals'></p>
<div class='note'><strong>Measured interpretation.</strong> {html.escape(interpretation(rows))}</div>
<div class='note warn'><strong>Scope boundary.</strong> This evaluates graph retrieval. A verified graph path or literature record is not a clinical treatment recommendation.</div>
<p>Snapshot SHA-256: <code>{html.escape(metadata.get('snapshot_sha256',''))}</code></p>
<p>{html.escape(metadata.get('dataset_citation',''))}</p>
</main></body></html>"""
    OUTPUT.write_text(page, encoding='utf-8')
    print(f"Wrote {OUTPUT}")


if __name__ == '__main__':
    main()
