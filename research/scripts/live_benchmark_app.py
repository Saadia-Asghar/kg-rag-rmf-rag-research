#!/usr/bin/env python3
"""Serve an interactive replay of the frozen Hetionet benchmark predictions."""
from __future__ import annotations

import argparse
import html
import json
from collections import defaultdict
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlsplit

ROOT = Path(__file__).resolve().parents[2]
RESULTS = ROOT / "research" / "results" / "main_benchmark"


def load_predictions() -> dict[tuple[int, int, str], list[dict]]:
    groups: dict[tuple[int, int, str], list[dict]] = defaultdict(list)
    for line in (RESULTS / "predictions.jsonl").read_text(encoding="utf-8").splitlines():
        if line.strip():
            row = json.loads(line)
            if row["split"].endswith("_test"):
                groups[(row["seed"], row["hop"], row["method"])].append(row)
    for rows in groups.values():
        rows.sort(key=lambda row: row["query_id"])
    return groups


def select(name: str, values: list[object], current: object) -> str:
    options = "".join(
        f"<option value='{html.escape(str(value))}'{' selected' if str(value) == str(current) else ''}>{html.escape(str(value))}</option>"
        for value in values
    )
    return f"<select name='{name}'>{options}</select>"


def page(groups: dict[tuple[int, int, str], list[dict]], params: dict[str, list[str]]) -> bytes:
    seed = int(params.get("seed", ["101"])[0])
    hop = int(params.get("hop", ["3"])[0])
    method = params.get("method", ["poincare"])[0]
    top_k = min(max(int(params.get("top_k", ["5"])[0]), 1), 10)
    rows = groups.get((seed, hop, method), [])
    index = min(max(int(params.get("index", ["0"])[0]), 0), max(len(rows) - 1, 0))
    row = rows[index] if rows else None
    escape = html.escape
    body = ""
    if row:
        predictions = "".join(
            f"<li><span class='rank'>{rank}</span><code>{escape(compound)}</code>"
            f"{' <span class=\"match\">held-out target</span>' if compound == row['target_compound'] else ''}</li>"
            for rank, compound in enumerate(row["top10_predictions"][:top_k], start=1)
        )
        target_note = "Target is in the top ten." if row["target_compound"] in row["top10_predictions"] else "Target is outside the top ten."
        body = f"""
        <section class='results'><h2>Ranked retrieval</h2><h3>Candidate compounds</h3><ol>{predictions}</ol>
        <aside><h3>Run metadata</h3><dl><dt>Query</dt><dd>{escape(row['query_id'])}</dd><dt>Held-out target</dt><dd>{escape(row['target_compound'])}</dd><dt>Target rank</dt><dd>{row['target_rank']}</dd><dt>Path verification</dt><dd>{row['top1_path_verified']}</dd></dl>
        <h3>Verification ledger</h3><p>{target_note} Predictions come from the frozen five-seed benchmark output.</p></aside></section>"""
    query = urlencode({"seed": seed, "hop": hop, "method": method, "index": index, "top_k": top_k})
    page_text = f"""<!doctype html><html lang='en'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>
    <title>RMF-RAG model tester</title><style>
    :root{{--ink:#142033;--muted:#65748b;--line:#d7dee8;--navy:#142d4d;--blue:#1969e8;--paper:#f7f9fc;--panel:#fff;--green:#e5f7ec}}*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font:15px/1.5 Arial,sans-serif}}main{{max-width:1120px;margin:auto;padding:30px 24px 60px}}header{{border-bottom:1px solid var(--line);padding-bottom:22px}}h1{{font-size:34px;margin:0 0 7px}}h2{{font-size:22px;margin:0 0 16px}}h3{{font-size:17px;margin:0 0 10px}}.eyebrow{{font-size:12px;letter-spacing:.12em;font-weight:bold;color:var(--blue)}}.sub{{color:var(--muted);margin:0}}.layout{{display:grid;grid-template-columns:355px 1fr;gap:22px;margin-top:24px}}.panel{{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:20px}}label{{display:block;font-size:12px;font-weight:bold;letter-spacing:.08em;text-transform:uppercase;margin:16px 0 5px}}select,input,button{{font:inherit;border-radius:7px;padding:10px;width:100%;border:1px solid #aeb9c8;background:#fff}}button{{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:bold;margin-top:18px;cursor:pointer}}.reset{{display:block;text-align:center;margin-top:12px;color:var(--blue);font-size:13px}}.endpoint{{font:12px ui-monospace,monospace;color:var(--muted);margin-top:18px}}.results{{display:grid;grid-template-columns:minmax(0,1fr) 275px;gap:24px}}ol{{margin:0;padding:0;list-style:none;border-top:1px solid var(--line)}}li{{display:flex;gap:12px;align-items:center;padding:11px 4px;border-bottom:1px solid var(--line)}}.rank{{width:24px;color:var(--muted);font-weight:bold}}code{{font-size:14px}}.match{{margin-left:auto;background:var(--green);color:#17603b;padding:2px 7px;border-radius:10px;font-size:11px}}aside{{border-left:1px solid var(--line);padding-left:22px}}dl{{margin:0}}dt{{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-top:11px}}dd{{margin:2px 0;overflow-wrap:anywhere}}.boundary{{margin-top:22px;background:#fff7ed;border-left:4px solid #d97706;padding:16px 18px}}.boundary p{{margin:4px 0 0}}@media(max-width:800px){{.layout,.results{{grid-template-columns:1fr}}aside{{border-left:0;border-top:1px solid var(--line);padding:18px 0 0}}}}</style>
    <main><header><div class='eyebrow'>LOCAL MODEL BENCH</div><h1>Model tester</h1><p class='sub'>Set the exact benchmark slice and inspect how the model got there. Same inputs, same retrieval.</p></header>
    <div class='layout'><form class='panel' method='get'><h2>Query configuration</h2><h3>Deterministic retrieval run</h3><label>Hop</label>{select('hop', [2,3], hop)}<label>Split</label><select disabled><option selected>Test</option></select><label>Seed</label>{select('seed', [7,17,29,43,101], seed)}<label>Query index</label><input name='index' type='number' min='0' max='{max(len(rows)-1, 0)}' value='{index}'><label>Method</label>{select('method', ['lexical','euclidean','poincare','poincare_with_path_verification'], method)}<label>Top K</label>{select('top_k', [1,3,5,7,10], top_k)}<button type='submit'>Run retrieval</button><a class='reset' href='/?seed=101&hop=3&method=poincare&index=0&top_k=5'>Reset defaults</a><p class='endpoint'>GET /api/model/query</p></form>
    <div>{body or "<section class='panel'><h2>Ranked retrieval</h2><p>Run a query to populate the retrieval metadata and benchmark context.</p></section>"}<section class='boundary'><h2>Research boundary</h2><p>This console reports model retrieval, graph verification, and evidence provenance only. It is not clinical advice, a treatment recommendation, or a substitute for expert review.</p></section><p><a href='/report.html'>Open aggregate benchmark report</a> · <a href='/?{query}'>Permalink to this run</a></p></div></div></main></html>"""
    return page_text.encode("utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8768)
    args = parser.parse_args()
    groups = load_predictions()

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:
            route = urlsplit(self.path)
            if route.path == "/api/model/query":
                body = json.dumps({"run": page(groups, parse_qs(route.query, keep_blank_values=True)).decode("utf-8")}).encode("utf-8")
                mime = "application/json; charset=utf-8"
            elif route.path == "/report.html":
                body = (RESULTS / "report.html").read_bytes()
                mime = "text/html; charset=utf-8"
            elif route.path == "/":
                body = page(groups, parse_qs(route.query, keep_blank_values=True))
                mime = "text/html; charset=utf-8"
            else:
                body, mime = b"Not found", "text/plain; charset=utf-8"
            self.send_response(200 if route.path in {"/", "/report.html", "/api/model/query"} else 404)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    with ThreadingHTTPServer(("127.0.0.1", args.port), Handler) as server:
        print(f"Live benchmark replay: http://127.0.0.1:{args.port}/", flush=True)
        server.serve_forever()


if __name__ == "__main__":
    main()
