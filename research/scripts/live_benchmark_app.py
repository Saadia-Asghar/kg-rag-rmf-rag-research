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
    rows = groups.get((seed, hop, method), [])
    index = min(max(int(params.get("index", ["0"])[0]), 0), max(len(rows) - 1, 0))
    row = rows[index] if rows else None
    escape = html.escape
    body = ""
    if row:
        predictions = "".join(f"<li>{escape(compound)}</li>" for compound in row["top10_predictions"])
        target_note = "Target is in the top ten." if row["target_compound"] in row["top10_predictions"] else "Target is outside the top ten."
        body = f"""
        <section><h2>Frozen test query {index + 1} of {len(rows)}</h2>
        <p><b>Query ID:</b> {escape(row['query_id'])}<br><b>Held-out target:</b> {escape(row['target_compound'])}<br>
        <b>Target rank:</b> {row['target_rank']}<br><b>Top prediction path verified:</b> {row['top1_path_verified']}</p>
        <p>{target_note} This page replays saved predictions from the completed benchmark; it does not generate a clinical recommendation.</p>
        <h3>Top ten retrieved compounds</h3><ol>{predictions}</ol></section>"""
    query = urlencode({"seed": seed, "hop": hop, "method": method, "index": index})
    page_text = f"""<!doctype html><html lang='en'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>
    <title>RMF-RAG live benchmark replay</title><style>
    body{{margin:0;background:#f4f7fb;color:#172033;font:16px/1.55 system-ui,sans-serif}}main{{max-width:920px;margin:auto;padding:34px 20px}}section,form{{background:#fff;border:1px solid #d9e0ea;border-radius:12px;padding:22px;margin:18px 0}}h1{{font-size:34px;margin-bottom:6px}}label{{display:block;font-weight:650;margin-top:12px}}select,button{{font:inherit;padding:10px;margin-top:4px}}button{{background:#174dc4;color:#fff;border:0;border-radius:7px}}.note{{background:#edf4ff;border-left:4px solid #2563eb;padding:12px 16px}}</style>
    <main><h1>RMF-RAG live benchmark replay</h1><p>Interactive inspection of frozen predictions from the completed five-seed Hetionet v1.0 test run.</p>
    <p class='note'>This is retrieval research. A predicted compound or graph path is not medical advice.</p>
    <form method='get'><label>Seed{select('seed', [7,17,29,43,101], seed)}</label><label>Task{select('hop', [2,3], hop)}</label><label>Method{select('method', ['lexical','euclidean','poincare','poincare_with_path_verification'], method)}</label><label>Query index<input name='index' type='number' min='0' max='{max(len(rows)-1, 0)}' value='{index}'></label><button type='submit'>Load saved prediction</button></form>
    {body}<p><a href='/report.html'>Open aggregate benchmark report</a> · <a href='/?{query}'>Permalink to this replay</a></p></main></html>"""
    return page_text.encode("utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8768)
    args = parser.parse_args()
    groups = load_predictions()

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:
            route = urlsplit(self.path)
            if route.path == "/report.html":
                body = (RESULTS / "report.html").read_bytes()
                mime = "text/html; charset=utf-8"
            elif route.path == "/":
                body = page(groups, parse_qs(route.query, keep_blank_values=True))
                mime = "text/html; charset=utf-8"
            else:
                body, mime = b"Not found", "text/plain; charset=utf-8"
            self.send_response(200 if route.path in {"/", "/report.html"} else 404)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    with ThreadingHTTPServer(("127.0.0.1", args.port), Handler) as server:
        print(f"Live benchmark replay: http://127.0.0.1:{args.port}/", flush=True)
        server.serve_forever()


if __name__ == "__main__":
    main()
