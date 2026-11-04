"""Build the IEEE conference-format paper (DOCX) from ieee_paper.md and result files.

Layout follows the IEEE conference template: US Letter, two columns of 3.5 in
with a 0.25 in gap, Times New Roman 10 pt body, 24 pt title, "Abstract—" and
"Index Terms—" in bold 9 pt, Roman-numeral small-caps section headings,
"TABLE I" captions above tables, "Fig. 1." captions below figures and 8 pt
references. Table values are read from result files, never typed by hand.

Source syntax in ieee_paper.md:
  # Title                      %author: name | line | line ...
  !abstract: text              !keywords: text
  ## Heading  (numbered I, II, ...)   ## *Heading (unnumbered)
  ### Subheading (lettered A, B, ...)
  {{TABLE:key|Title}}          {{FIGURE:file.png|Caption}}
  - bullet                     [n] reference
"""
from __future__ import annotations

import csv
import json
import re
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt

ROOT = Path(__file__).resolve().parents[2]
PAPER = ROOT / "research" / "paper"
MAIN = ROOT / "research" / "results" / "main_benchmark"
SWEEP = ROOT / "research" / "results" / "hallucination_sweep"
FONT = "Times New Roman"
ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]


# ------------------------------------------------------------------ data
def _csv(path: Path) -> list[dict]:
    with path.open(encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def pm(row: dict, metric: str, mean_key: str = "{m}_mean", digits: int = 3) -> str:
    mean = float(row[mean_key.format(m=metric)])
    half = (float(row[f"{metric}_ci95_high"]) - float(row[f"{metric}_ci95_low"])) / 2
    return f"{mean:.{digits}f}±{half:.{digits}f}"


def chance() -> tuple[int, float]:
    nodes = json.loads((MAIN / "node_index_seed7.json").read_text(encoding="utf-8"))
    n = sum(1 for node in nodes if node["kind"] == "Compound")
    return n, sum(1.0 / r for r in range(1, n + 1)) / n


def table_accuracy():
    rows = {(r["split"], r["method"]): r for r in _csv(MAIN / "aggregate_metrics.csv")}
    header = ["Method", "2-hop R@10", "2-hop MRR", "3-hop R@10", "3-hop MRR"]
    names = {"lexical": "Lexical", "euclidean": "Euclidean", "poincare": "Poincaré"}
    body = []
    for method, label in names.items():
        a, b = rows[("2hop_test", method)], rows[("3hop_test", method)]
        body.append([label, pm(a, "recall_at_10"), pm(a, "mrr"), pm(b, "recall_at_10"), pm(b, "mrr")])
    n, mrr = chance()
    body.append([f"Random ({n})", f"{10 / n:.3f}", f"{mrr:.3f}", f"{10 / n:.3f}", f"{mrr:.3f}"])
    return header, body


def _label(name: str) -> str:
    if name.startswith("euclidean"):
        return f"E, d={name.split('_d')[1]}"
    d, c = name.split("_d")[1].split("_c")
    return f"P, d={d}, c={c}"


def _sweep_order() -> list[str]:
    names = [f"euclidean_d{d}" for d in (2, 4, 8, 16)]
    names += [f"poincare_d{d}_c{c}" for d in (2, 4, 8, 16) for c in (1, 10)]
    return sorted(names, key=lambda n: (int(n.split("_d")[1].split("_")[0]), not n.startswith("e"), n))


def table_sweep():
    rows = {(r["config"], r["split"]): r for r in _csv(SWEEP / "summary.csv")}
    header = ["Config.", "3-hop MRR", "3-hop HHR@1", "2-hop MRR", "2-hop HHR@1"]
    body = []
    for name in _sweep_order():
        a, b = rows[(name, "3hop_test")], rows[(name, "2hop_test")]
        body.append([_label(name), pm(a, "mrr"), pm(a, "hhr_at_1"), pm(b, "mrr"), pm(b, "hhr_at_1")])
    return header, body


def _p(value: str) -> str:
    p = float(value)
    return "<0.001" if p < 0.001 else f"{p:.3f}"


def table_paired():
    rows = {(r["poincare"], r["split"], r["metric"]): r
            for r in _csv(SWEEP / "comparisons.csv") if r["seed_set"] == "all_10_seeds"}
    header = ["P vs E", "3-hop ΔHHR@1", "p_Holm", "2-hop ΔHHR@1", "p_Holm", "3-hop ΔMRR"]
    body = []
    for name in [n for n in _sweep_order() if n.startswith("poincare")]:
        h3 = rows[(name, "3hop_test", "hhr_at_1")]
        h2 = rows[(name, "2hop_test", "hhr_at_1")]
        m3 = rows[(name, "3hop_test", "mrr")]
        body.append([
            _label(name).replace("P, ", ""),
            f"{float(h3['mean_diff']):+.3f} ({h3['negative']}/10)", _p(h3["p_holm"]),
            f"{float(h2['mean_diff']):+.3f} ({h2['negative']}/10)", _p(h2["p_holm"]),
            f"{float(m3['mean_diff']):+.3f}",
        ])
    return header, body


def table_grounding():
    rows = {(r["split"], r["method"]): r for r in _csv(MAIN / "aggregate_metrics.csv")}
    names = [("euclidean", "Euclidean"), ("poincare", "Poincaré (full)"),
             ("poincare_no_geodesic", "– geodesic ranking"),
             ("poincare_no_hop_weighting", "– hop weighting"),
             ("poincare_no_parallel_transport", "– tangent composition"),
             ("poincare_with_path_verification", "+ path verification")]
    header = ["Configuration", "3-hop MRR", "3-hop HHR@1", "2-hop MRR", "2-hop HHR@1"]
    body = []
    for method, label in names:
        a, b = rows[("3hop_test", method)], rows[("2hop_test", method)]
        body.append([label, f"{float(a['mrr_mean']):.3f}",
                     f"{1 - float(a['top1_path_verified_rate_mean']):.3f}",
                     f"{float(b['mrr_mean']):.3f}",
                     f"{1 - float(b['top1_path_verified_rate_mean']):.3f}"])
    return header, body


TABLES = {"accuracy": table_accuracy, "sweep": table_sweep, "paired": table_paired,
          "grounding": table_grounding}


# ------------------------------------------------------------------ layout
def _set_cols(section, num: int, space_in: float = 0.25) -> None:
    sect_pr = section._sectPr
    for old in sect_pr.findall(qn("w:cols")):
        sect_pr.remove(old)
    cols = OxmlElement("w:cols")
    cols.set(qn("w:num"), str(num))
    cols.set(qn("w:space"), str(int(space_in * 1440)))
    sect_pr.append(cols)


def _page(section) -> None:
    section.page_width, section.page_height = Inches(8.5), Inches(11)
    section.top_margin, section.bottom_margin = Inches(0.75), Inches(1.0)
    section.left_margin = section.right_margin = Inches(0.625)


def _run(paragraph, text: str, size: float = 10, bold=False, italic=False, small_caps=False):
    run = paragraph.add_run(text)
    run.font.name = FONT
    run._element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:eastAsia"), FONT)
    run.font.size = Pt(size)
    run.bold, run.italic = bold, italic
    run.font.small_caps = small_caps
    return run


INLINE = re.compile(r"(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)")


def _inline(paragraph, text: str, size: float = 10, bold: bool = False) -> None:
    for part in INLINE.split(text):
        if not part:
            continue
        if part.startswith("**"):
            _run(paragraph, part[2:-2], size, bold=True)
        elif part.startswith("*"):
            _run(paragraph, part[1:-1], size, bold=bold, italic=True)
        elif part.startswith("`"):
            r = _run(paragraph, part[1:-1], size - 1, bold=bold)
            r.font.name = "Courier New"
        else:
            _run(paragraph, part, size, bold=bold)


def _fmt(paragraph, align=WD_ALIGN_PARAGRAPH.JUSTIFY, before=0, after=0, indent=None):
    pf = paragraph.paragraph_format
    paragraph.alignment = align
    pf.space_before, pf.space_after = Pt(before), Pt(after)
    pf.line_spacing = 1.0
    if indent is not None:
        pf.first_line_indent = Inches(indent)
    return paragraph


def _borders(table) -> None:
    """IEEE-style rules: top, header bottom and table bottom lines only."""
    tbl_pr = table._tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "bottom"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), "6")
        el.set(qn("w:color"), "000000")
        borders.append(el)
    for edge in ("left", "right", "insideH", "insideV"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "nil")
        borders.append(el)
    tbl_pr.append(borders)
    for cell in table.rows[0].cells:
        tc_pr = cell._tc.get_or_add_tcPr()
        cb = OxmlElement("w:tcBorders")
        b = OxmlElement("w:bottom")
        b.set(qn("w:val"), "single")
        b.set(qn("w:sz"), "4")
        b.set(qn("w:color"), "000000")
        cb.append(b)
        tc_pr.append(cb)


def _cell_margins(table, twips: int = 40) -> None:
    tbl_pr = table._tbl.tblPr
    mar = OxmlElement("w:tblCellMar")
    for side in ("left", "right"):
        el = OxmlElement(f"w:{side}")
        el.set(qn("w:w"), str(twips))
        el.set(qn("w:type"), "dxa")
        mar.append(el)
    tbl_pr.append(mar)


def add_table(doc, number: int, title: str, header: list[str], body: list[list[str]]) -> None:
    cap = _fmt(doc.add_paragraph(), WD_ALIGN_PARAGRAPH.CENTER, before=6)
    _run(cap, f"TABLE {ROMAN[number - 1]}", 8, small_caps=True)
    cap.paragraph_format.keep_with_next = True
    title_p = _fmt(doc.add_paragraph(), WD_ALIGN_PARAGRAPH.CENTER, after=3)
    _run(title_p, title, 8, small_caps=True)
    title_p.paragraph_format.keep_with_next = True
    table = doc.add_table(rows=1, cols=len(header))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True
    _borders(table)
    _cell_margins(table)
    for i, text in enumerate(header):
        p = table.rows[0].cells[i].paragraphs[0]
        _fmt(p, WD_ALIGN_PARAGRAPH.CENTER if i else WD_ALIGN_PARAGRAPH.LEFT)
        _run(p, text, 7, bold=True)
    for row in body:
        cells = table.add_row().cells
        for i, text in enumerate(row):
            p = cells[i].paragraphs[0]
            _fmt(p, WD_ALIGN_PARAGRAPH.CENTER if i else WD_ALIGN_PARAGRAPH.LEFT)
            _run(p, text, 7)
    _fmt(doc.add_paragraph(), after=2)


def build() -> Path:
    doc = Document()
    normal = doc.styles["Normal"]
    normal.font.name = FONT
    normal.font.size = Pt(10)
    _page(doc.sections[0])
    _set_cols(doc.sections[0], 1)

    lines = (PAPER / "ieee_paper.md").read_text(encoding="utf-8").splitlines()
    authors: list[list[str]] = []
    buffer: list[str] = []
    state = {"section": 0, "sub": 0, "table": 0, "figure": 0, "two_col": False, "refs": False}

    def flush() -> None:
        if buffer:
            p = _fmt(doc.add_paragraph(), indent=0.2)
            _inline(p, " ".join(buffer))
            buffer.clear()

    def start_two_columns() -> None:
        if state["two_col"]:
            return
        if authors:
            table = doc.add_table(rows=1, cols=len(authors))
            table.alignment = WD_TABLE_ALIGNMENT.CENTER
            for cell, author in zip(table.rows[0].cells, authors):
                p = _fmt(cell.paragraphs[0], WD_ALIGN_PARAGRAPH.CENTER)
                _run(p, author[0], 11)
                for i, line in enumerate(author[1:]):
                    q = _fmt(cell.add_paragraph(), WD_ALIGN_PARAGRAPH.CENTER)
                    _run(q, line, 10, italic=i < 2)
        _fmt(doc.add_paragraph(), after=6)
        section = doc.add_section(WD_SECTION.CONTINUOUS)
        _page(section)
        _set_cols(section, 2)
        state["two_col"] = True

    for line in lines:
        s = line.strip()
        if not s:
            flush()
            continue
        if s.startswith("# "):
            p = _fmt(doc.add_paragraph(), WD_ALIGN_PARAGRAPH.CENTER, after=10)
            _run(p, s[2:], 24)
        elif s.startswith("%author:"):
            authors.append([part.strip() for part in s[8:].split("|")])
        elif s.startswith("!abstract:"):
            start_two_columns()
            p = _fmt(doc.add_paragraph(), after=6)
            _run(p, "Abstract", 9, bold=True, italic=True)
            _run(p, "—", 9, bold=True)
            _inline(p, s[10:].strip(), 9, bold=True)
        elif s.startswith("!keywords:"):
            p = _fmt(doc.add_paragraph(), after=6)
            _run(p, "Index Terms", 9, bold=True, italic=True)
            _run(p, "—", 9, bold=True)
            _run(p, s[10:].strip(), 9, bold=True)
        elif s.startswith("## "):
            flush()
            title = s[3:]
            p = _fmt(doc.add_paragraph(), WD_ALIGN_PARAGRAPH.CENTER, before=8, after=4)
            p.paragraph_format.keep_with_next = True
            if title.startswith("*"):
                _run(p, title[1:], 10, small_caps=True)
                state["refs"] = title[1:].lower().startswith("reference")
            else:
                _run(p, f"{ROMAN[state['section']]}. ", 10)
                _run(p, title, 10, small_caps=True)
                state["section"] += 1
                state["refs"] = False
            state["sub"] = 0
        elif s.startswith("### "):
            flush()
            p = _fmt(doc.add_paragraph(), WD_ALIGN_PARAGRAPH.LEFT, before=4, after=2)
            p.paragraph_format.keep_with_next = True
            _run(p, f"{chr(ord('A') + state['sub'])}. {s[4:]}", 10, italic=True)
            state["sub"] += 1
        elif s.startswith("{{TABLE:"):
            flush()
            key, title = s[8:-2].split("|", 1)
            state["table"] += 1
            header, body = TABLES[key]()
            add_table(doc, state["table"], title, header, body)
        elif s.startswith("{{FIGURE:"):
            flush()
            name, caption = s[9:-2].split("|", 1)
            state["figure"] += 1
            pic = _fmt(doc.add_paragraph(), WD_ALIGN_PARAGRAPH.CENTER, before=4)
            pic.add_run().add_picture(str(PAPER / "figures" / name), width=Inches(3.45))
            pic.paragraph_format.keep_with_next = True
            cap = _fmt(doc.add_paragraph(), after=6)
            _run(cap, f"Fig. {state['figure']}. ", 8)
            _inline(cap, caption, 8)
        elif s.startswith("- "):
            flush()
            p = _fmt(doc.add_paragraph())
            p.paragraph_format.left_indent = Inches(0.18)
            p.paragraph_format.first_line_indent = Inches(-0.12)
            _inline(p, "• " + s[2:])
        elif state["refs"] and re.match(r"^\[\d+\]", s):
            flush()
            p = _fmt(doc.add_paragraph(), after=1)
            p.paragraph_format.left_indent = Inches(0.28)
            p.paragraph_format.first_line_indent = Inches(-0.28)
            _inline(p, s, 8)
        else:
            buffer.append(s)
    flush()
    out = PAPER / "RMF-RAG_IEEE.docx"
    doc.save(out)
    return out


if __name__ == "__main__":
    print(build())
