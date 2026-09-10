"""Render the bundled sample Markdown paper as a printable, offline HTML file."""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def inline(text: str) -> str:
    escaped = html.escape(text)
    escaped = re.sub(r"`([^`]+)`", r"<code>\1</code>", escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    return re.sub(r"https://[^\s<]+", lambda match: f'<a href="{match.group(0)}">{match.group(0)}</a>', escaped)


def render_markdown(source: str) -> str:
    blocks = []
    for block in source.strip().split("\n\n"):
        lines = block.splitlines()
        if block.startswith("#"):
            marker, title = block.split(" ", 1)
            level = min(len(marker), 6)
            blocks.append(f'<h{level}>{inline(title)}</h{level}>')
        elif block.startswith("|"):
            rows = []
            for index, line in enumerate(lines):
                if index == 1 and re.fullmatch(r"[|:\-\s]+", line):
                    continue
                tag = "th" if index == 0 else "td"
                cells = "".join(f'<{tag}>{inline(cell.strip())}</{tag}>' for cell in line.strip("|").split("|"))
                rows.append(f'<tr>{cells}</tr>')
            blocks.append('<div class="table"><table>' + "".join(rows) + '</table></div>')
        elif all(re.match(r"\d+\. ", line) for line in lines):
            blocks.append('<ol>' + "".join(f'<li>{inline(re.sub(r"^\d+\. ", "", line))}</li>' for line in lines) + '</ol>')
        else:
            blocks.append(f'<p>{inline(" ".join(lines))}</p>')
    return "\n".join(blocks)


def main() -> None:
    source = ROOT / "local-run/SAMPLE_RESEARCH_PAPER.md"
    target = source.with_suffix(".html")
    body = render_markdown(source.read_text(encoding="utf-8"))
    style = '''body{margin:0;background:#eef1f5;color:#18202c;font:17px/1.7 Georgia,serif}
main{max-width:900px;margin:32px auto;padding:50px 60px;background:white}h1{font-size:34px;line-height:1.25}h2{font-size:24px;margin-top:34px}h3{font-size:19px}a{color:#174dc4;overflow-wrap:anywhere}nav{font:15px system-ui}table{width:100%;border-collapse:collapse;font:14px/1.5 system-ui}th,td{text-align:left;padding:10px;border-bottom:1px solid #ccd3df}th{background:#eef3f8}.table{overflow-x:auto}code{font-size:.85em;overflow-wrap:anywhere}li{margin:12px 0}p{text-align:left}
@media(max-width:700px){main{margin:0;padding:24px 18px}h1{font-size:28px}}
@media print{body{background:white;font-size:11pt}main{max-width:none;margin:0;padding:0}nav{display:none}h1{font-size:22pt}h2,h3{break-after:avoid}tr{break-inside:avoid}table{font-size:9pt}.table{overflow:visible}a{color:black}p{orphans:3;widows:3}@page{size:A4;margin:20mm}'''
    target.write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sample research paper — disease drug retrieval</title><style>{style}</style></head><body><main><nav><a href="http://localhost:8766/">Open the query lab</a> · Sample manuscript · Use browser Print to save as PDF</nav>{body}</main></body></html>', encoding="utf-8")
    print(target)


if __name__ == '__main__':
    main()
