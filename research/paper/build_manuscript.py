"""Build the manuscript (DOCX) from manuscript.md plus saved result files.

Text comes from research/paper/manuscript.md. Lines of the form
``{{TABLE:name}}`` and ``{{FIGURE:file|caption}}`` are replaced with tables
generated from result files and with the generated figures, so reported
numbers in tables are never typed by hand.
"""
from __future__ import annotations

import csv
import json
import math
import re
import statistics
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt

ROOT = Path(__file__).resolve().parents[2]
PAPER = ROOT / "research" / "paper"
MAIN = ROOT / "research" / "results" / "main_benchmark"
PILOT = ROOT / "research" / "results" / "controlled_geometry"

NAMES = {
    "lexical": "Lexical (identifier TF-IDF)",
    "euclidean": "Euclidean",
    "poincare": "Poincaré",
    "poincare_no_geodesic": "Poincaré, no geodesic ranking",
    "poincare_no_hop_weighting": "Poincaré, no hop weighting",
    "poincare_no_parallel_transport": "Poincaré, no tangent composition",
    "poincare_with_path_verification": "Poincaré + typed-path verification",
}


def fmt(row: dict, metric: str, mean_key: str = "{m}_mean") -> str:
    mean = float(row[mean_key.format(m=metric)])
    low = max(float(row[f"{metric}_ci95_low"]), 0.0)
    high = min(float(row[f"{metric}_ci95_high"]), 1.0)
    return f"{mean:.3f} [{low:.3f}, {high:.3f}]"


def main_rows() -> dict:
    with (MAIN / "aggregate_metrics.csv").open(encoding="utf-8") as handle:
        return {(r["split"], r["method"]): r for r in csv.DictReader(handle)}


def chance() -> tuple[int, float, float, float]:
    nodes = json.loads((MAIN / "node_index_seed7.json").read_text(encoding="utf-8"))
    n = sum(1 for node in nodes if node["kind"] == "Compound")
    mrr = sum(1.0 / r for r in range(1, n + 1)) / n
    return n, mrr, 5 / n, 10 / n


def table_main(split_suffix: str) -> tuple[list[str], list[list[str]]]:
    rows = main_rows()
    header = ["Task", "Method", "Recall@1", "Recall@5", "Recall@10", "MRR"]
    body = []
    for hop in ("2hop", "3hop"):
        for method in ("lexical", "euclidean", "poincare"):
            r = rows[(f"{hop}_{split_suffix}", method)]
            body.append([hop.replace("hop", "-hop"), NAMES[method]] + [
                fmt(r, m) for m in ("recall_at_1", "recall_at_5", "recall_at_10", "mrr")
            ])
    n, mrr, r5, r10 = chance()
    body.append(["both", f"Random ranking ({n} candidates)", f"{1/n:.3f}", f"{r5:.3f}", f"{r10:.3f}", f"{mrr:.3f}"])
    return header, body


def table_ablation() -> tuple[list[str], list[list[str]]]:
    rows = main_rows()
    header = ["Task", "Configuration", "Recall@5", "Recall@10", "MRR", "Top-1 path verified"]
    body = []
    for hop in ("2hop", "3hop"):
        for method in ("poincare", "poincare_no_geodesic", "poincare_no_hop_weighting",
                       "poincare_no_parallel_transport", "poincare_with_path_verification"):
            r = rows[(f"{hop}_test", method)]
            body.append([hop.replace("hop", "-hop"), NAMES[method]] + [
                fmt(r, m) for m in ("recall_at_5", "recall_at_10", "mrr", "top1_path_verified_rate")
            ])
    return header, body


def paired_differences() -> list[dict]:
    with (MAIN / "metrics_by_seed.csv").open(encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    by = {(r["split"], r["method"], r["seed"]): r for r in rows}
    seeds = sorted({r["seed"] for r in rows}, key=int)
    out = []
    for split in ("2hop_test", "3hop_test", "2hop_validation", "3hop_validation"):
        for metric in ("mrr", "recall_at_10"):
            d = [float(by[(split, "poincare", s)][metric]) - float(by[(split, "euclidean", s)][metric]) for s in seeds]
            mean = statistics.mean(d)
            half = 2.776 * statistics.stdev(d) / math.sqrt(len(d))
            out.append({"split": split, "metric": metric, "mean": mean, "low": mean - half,
                        "high": mean + half, "wins": sum(x > 0 for x in d), "n": len(d)})
    return out


def table_paired() -> tuple[list[str], list[list[str]]]:
    header = ["Split", "Metric", "Poincaré − Euclidean (mean)", "95% CI (paired t, 4 df)", "Seeds favouring Poincaré"]
    body = []
    for r in paired_differences():
        body.append([r["split"].replace("_", " ").replace("hop", "-hop"),
                     "MRR" if r["metric"] == "mrr" else "Recall@10",
                     f"{r['mean']:+.4f}", f"[{r['low']:+.4f}, {r['high']:+.4f}]",
                     f"{r['wins']}/{r['n']}"])
    return header, body


def table_tuning() -> tuple[list[str], list[list[str]]]:
    meta = json.loads((MAIN / "metadata.json").read_text(encoding="utf-8"))
    sel = meta["learning_rate_selection"]
    header = ["Geometry", "Learning rate", "Val. MRR 2-hop", "Val. MRR 3-hop", "Mean", "Final train loss"]
    body = []
    for g in sel["grid"]:
        chosen = g["learning_rate"] == sel[f"{g['geometry']}_learning_rate"]
        body.append([("Euclidean" if g["geometry"] == "euclidean" else "Poincaré") + (" (selected)" if chosen else ""),
                     f"{g['learning_rate']:g}", f"{g['validation_mrr_2hop']:.4f}",
                     f"{g['validation_mrr_3hop']:.4f}", f"{g['validation_mrr_mean']:.4f}",
                     f"{g['final_train_loss']:.3f}"])
    return header, body


def table_pilot() -> tuple[list[str], list[list[str]]]:
    agg = json.loads((PILOT / "aggregate_metrics.json").read_text(encoding="utf-8"))
    header = ["Model", "Recall@1", "Recall@5", "Recall@10", "MRR"]
    body = []
    for r in agg:
        body.append([NAMES[r["model"]]] + [fmt(r, m, "{m}") for m in ("recall_at_1", "recall_at_5", "recall_at_10", "mrr")])
    return header, body


SWEEP = ROOT / "research" / "results" / "hallucination_sweep"


def _sweep_configs() -> list[str]:
    dims = (2, 4, 8, 16)
    return [f"euclidean_d{d}" for d in dims] + [f"poincare_d{d}_c{c}" for d in dims for c in (1, 10)]


def _sweep_label(name: str) -> str:
    if name.startswith("euclidean"):
        return f"Euclidean, d = {name.split('_d')[1]}"
    d, c = name.split("_d")[1].split("_c")
    return f"Poincaré, d = {d}, c = {c}"


def table_sweep(split: str) -> tuple[list[str], list[list[str]]]:
    with (SWEEP / "summary.csv").open(encoding="utf-8") as handle:
        rows = {(r["config"], r["split"]): r for r in csv.DictReader(handle)}
    lrs = json.loads((SWEEP / "metadata.json").read_text(encoding="utf-8"))["selected_learning_rates"]
    header = ["Configuration", "LR", "MRR", "Recall@10", "HHR@1", "Unsupported@10", "HHR@1 after path verif."]
    order = sorted(_sweep_configs(), key=lambda n: (int(n.split("_d")[1].split("_")[0]), n))
    body = []
    for name in order:
        r = rows[(name, split)]
        body.append([_sweep_label(name), f"{lrs[name]:g}", fmt(r, "mrr"), fmt(r, "recall_at_10"),
                     fmt(r, "hhr_at_1"), fmt(r, "unsupported_at_10"), f"{float(r['pv_hhr_at_1_mean']):.3f}"])
    return header, body


def table_sweep_paired(split: str) -> tuple[list[str], list[list[str]]]:
    with (SWEEP / "comparisons.csv").open(encoding="utf-8") as handle:
        rows = [r for r in csv.DictReader(handle) if r["split"] == split and r["seed_set"] == "all_10_seeds"]
    by = {(r["poincare"], r["metric"]): r for r in rows}
    header = ["Poincaré vs Euclidean (same d)", "ΔHHR@1 [95% CI]", "p (Holm)", "Seeds lower",
              "ΔUnsupported@10 [95% CI]", "p (Holm)", "ΔMRR [95% CI]", "p (Holm)"]
    body = []
    for name in [n for n in _sweep_configs() if n.startswith("poincare")]:
        cells = [_sweep_label(name)]
        for metric in ("hhr_at_1", "unsupported_at_10", "mrr"):
            r = by[(name, metric)]
            cells.append(f"{float(r['mean_diff']):+.3f} [{float(r['ci95_low']):+.3f}, {float(r['ci95_high']):+.3f}]")
            p = float(r["p_holm"])
            cells.append("<0.001" if p < 0.001 else f"{p:.3f}")
            if metric == "hhr_at_1":
                cells.append(f"{r['negative']}/{r['n']}")
        body.append(cells)
    return header, body


BASELINES = ROOT / "research" / "results" / "baselines"


def table_baselines() -> tuple[list[str], list[list[str]]]:
    with (BASELINES / "summary.csv").open(encoding="utf-8") as handle:
        rows = {(r["config"], r["split"]): r for r in csv.DictReader(handle)}
    labels = {"euclidean": "Euclidean (relation-free)", "poincare": "Poincaré (relation-free)",
              "transe": "TransE-style (relational)", "murp": "MuRP-style (relational)"}
    header = ["Model", "d", "3-hop fMRR", "3-hop HHR@1", "2-hop fMRR", "2-hop HHR@1"]
    body = []
    for d in (8, 16):
        for method, label in labels.items():
            a, b = rows[(f"{method}_d{d}", "3hop_test")], rows[(f"{method}_d{d}", "2hop_test")]
            body.append([label, str(d), fmt(a, "filtered_mrr"), fmt(a, "hhr_at_1"),
                         fmt(b, "filtered_mrr"), fmt(b, "hhr_at_1")])
    return header, body


TABLES = {
    "baselines": table_baselines,
    "sweep_3hop": lambda: table_sweep("3hop_test"),
    "sweep_2hop": lambda: table_sweep("2hop_test"),
    "sweep_paired_3hop": lambda: table_sweep_paired("3hop_test"),
    "sweep_paired_2hop": lambda: table_sweep_paired("2hop_test"),
    "main_test": lambda: table_main("test"),
    "main_validation": lambda: table_main("validation"),
    "ablation": table_ablation,
    "paired": table_paired,
    "tuning": table_tuning,
    "pilot": table_pilot,
}


def _shade(cell, color: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), color)
    tc_pr.append(shd)


def add_table(doc: Document, header: list[str], body: list[list[str]]) -> None:
    table = doc.add_table(rows=1, cols=len(header))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, text in enumerate(header):
        cell = table.rows[0].cells[i]
        cell.text = ""
        run = cell.paragraphs[0].add_run(text)
        run.bold = True
        run.font.size = Pt(8)
        _shade(cell, "E7EDF5")
    for row in body:
        cells = table.add_row().cells
        for i, text in enumerate(row):
            cells[i].text = ""
            run = cells[i].paragraphs[0].add_run(text)
            run.font.size = Pt(8)
    doc.add_paragraph()


INLINE = re.compile(r"(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)")


def add_inline(paragraph, text: str) -> None:
    for part in INLINE.split(text):
        if not part:
            continue
        if part.startswith("**"):
            paragraph.add_run(part[2:-2]).bold = True
        elif part.startswith("*"):
            paragraph.add_run(part[1:-1]).italic = True
        elif part.startswith("`"):
            run = paragraph.add_run(part[1:-1])
            run.font.name = "Consolas"
            run.font.size = Pt(9)
        else:
            paragraph.add_run(part)


def build() -> Path:
    doc = Document()
    style = doc.styles["Normal"]
    style.font.name = "Times New Roman"
    style.font.size = Pt(11)
    for section in doc.sections:
        section.left_margin = section.right_margin = Inches(1)

    lines = (PAPER / "manuscript.md").read_text(encoding="utf-8").splitlines()
    para_buf: list[str] = []

    def flush() -> None:
        if para_buf:
            p = doc.add_paragraph()
            p.paragraph_format.space_after = Pt(6)
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            add_inline(p, " ".join(para_buf))
            para_buf.clear()

    for line in lines:
        stripped = line.strip()
        if not stripped:
            flush()
            continue
        if stripped.startswith("{{TABLE:"):
            flush()
            header, body = TABLES[stripped[8:-2]]()
            add_table(doc, header, body)
        elif stripped.startswith("{{FIGURE:"):
            flush()
            name, caption = stripped[9:-2].split("|", 1)
            doc.add_picture(str(PAPER / "figures" / name), width=Inches(6.2 if "mrr" in name else 4.5))
            doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
            cap = doc.add_paragraph()
            cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            add_inline(cap, caption)
            for run in cap.runs:
                run.font.size = Pt(9)
        elif stripped.startswith("# "):
            flush()
            title = doc.add_paragraph()
            title.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = title.add_run(stripped[2:])
            run.bold = True
            run.font.size = Pt(16)
        elif stripped.startswith("## "):
            flush()
            doc.add_heading(stripped[3:], level=1)
        elif stripped.startswith("### "):
            flush()
            doc.add_heading(stripped[4:], level=2)
        elif re.match(r"^Table \d+\.", stripped):
            flush()
            cap = doc.add_paragraph()
            add_inline(cap, stripped)
            for run in cap.runs:
                run.font.size = Pt(9)
            cap.paragraph_format.keep_with_next = True
        elif stripped.startswith("- "):
            flush()
            add_inline(doc.add_paragraph(style="List Bullet"), stripped[2:])
        elif re.match(r"^\[\d+\]", stripped):
            flush()
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.3)
            p.paragraph_format.first_line_indent = Inches(-0.3)
            add_inline(p, stripped)
            for run in p.runs:
                run.font.size = Pt(9.5)
        elif stripped.startswith("^"):
            flush()
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            add_inline(p, stripped[1:].strip())
        else:
            para_buf.append(stripped)
    flush()

    out = PAPER / "RMF-RAG_manuscript.docx"
    doc.save(out)
    return out


if __name__ == "__main__":
    print(build())
