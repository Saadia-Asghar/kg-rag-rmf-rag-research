"""Local, read-only interface to the original pilot's trained embeddings."""
from __future__ import annotations

import argparse
import html
import json
import random
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlsplit

import numpy as np

import run_rmf_rag_experiment as pilot

ROOT = Path(__file__).resolve().parents[2]
RESULTS = ROOT / "research/results"
STYLE = """*{box-sizing:border-box}body{margin:0;background:#f4f7fb;color:#172033;font:16px/1.6 system-ui,sans-serif}
main{max-width:1120px;margin:auto;padding:36px 24px}nav{display:flex;gap:20px;flex-wrap:wrap}
a{color:#174dc4}h1{font-size:38px;line-height:1.2;color:#102338}h2{font-size:22px}
.card{background:white;border:1px solid #d9e0ea;border-radius:14px;padding:24px;margin:20px 0}
.muted{color:#526176}.notice{border-left:4px solid #2563eb;padding:12px 18px;background:#edf4ff}
label{display:block;font-weight:650}input,button{font:inherit;padding:12px;border-radius:8px;border:1px solid #8292aa}
input{width:min(100%,540px)}button{background:#174dc4;color:white;border:0;cursor:pointer;margin:8px 0}
input:focus,button:focus,a:focus{outline:3px solid #68a0ff;outline-offset:3px}
.columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.columns .card{padding:18px}
li{padding:7px 0;overflow-wrap:anywhere}.target{background:#e2f6ec;font-weight:700}
table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:10px;border-bottom:1px solid #dde3ec}
.scroll{overflow-x:auto}.error{color:#9f1822}small{display:block;color:#526176}
@media(max-width:760px){.columns{grid-template-columns:1fr}h1{font-size:30px}main{padding:22px 16px}}
"""


class PilotModel:
    def __init__(self) -> None:
        metadata = json.loads((RESULTS / "metrics.json").read_text(encoding="utf-8"))
        seed = metadata["metadata"]["seed"]
        self.train, recoverable, held_out = pilot.make_split(pilot.load_pairs(), random.Random(seed))
        self.graph = pilot.build_graph(self.train)
        self.targets = dict(held_out)
        self.recoverable = {d for d, _ in recoverable}
        saved_index = json.loads((RESULTS / "model_index.json").read_text(encoding="utf-8"))
        if self.graph["nodes"] != saved_index["nodes"]:
            raise ValueError("Saved embeddings do not match the source graph; rerun the pilot.")
        with np.load(RESULTS / "trained_embeddings.npz", allow_pickle=False) as saved:
            self.vectors = {name: saved[name].copy() for name in ("euclidean", "hyperbolic")}
        for vectors in self.vectors.values():
            if vectors.shape != (len(self.graph["nodes"]), saved_index["embedding_dimension"]):
                raise ValueError("Invalid embedding shape.")
            if not np.isfinite(vectors).all():
                raise ValueError("Non-finite embeddings.")
        self.metrics = metadata

    def query(self, text: str) -> dict:
        if not text.strip() or len(text) > 200:
            raise ValueError("Enter a disease name of 1–200 characters.")
        disease = pilot.normalize(text)
        if disease not in self.graph["diseases"]:
            raise ValueError("Disease not found. Choose a name from the suggestions; this pilot has no free-text question model.")
        drugs = self.graph["drugs"]
        source_idx = self.graph["index"][f"disease::{disease}"]
        target = self.targets.get(disease)
        rankings = {}
        for method in ("lexical", "euclidean", "hyperbolic"):
            scores = []
            for drug in drugs:
                if method == "lexical":
                    score = pilot.lexical_score(disease, drug, self.train)
                else:
                    vectors = self.vectors[method]
                    source = vectors[source_idx]
                    candidate = vectors[self.graph["index"][f"drug::{drug}"]]
                    score = -(float(np.dot(source - candidate, source - candidate)) if method == "euclidean"
                              else pilot.poincare_distance(source, candidate))
                scores.append((drug, score))
            scores.sort(key=lambda item: (-item[1], item[0]))
            ordered = [drug for drug, _ in scores]
            rankings[method] = {
                "target_rank": ordered.index(target) + 1 if target in ordered else None,
                "top10": [{"drug": drug, "score": score, "is_target": drug == target} for drug, score in scores[:10]],
            }
        return {"disease": disease, "target": target, "target_in_candidates": target in drugs,
                "in_original_evaluation": disease in self.recoverable, "rankings": rankings}


def render(model: PilotModel, query: dict | None = None, error: str = "", value: str = "") -> bytes:
    escape = html.escape
    options = "".join(f'<option value="{escape(name, quote=True)}"></option>' for name in model.graph["diseases"])
    examples = " · ".join(f'<a href="/?{urlencode({"q": name})}">{escape(name.title())}</a>'
                          for name in ("cancer", "bladder cancer", "colorectal cancer"))
    results = ""
    if query:
        target = query["target"]
        target_text = f'Held-out dataset answer: <strong>{escape(target.title())}</strong>.' if target else 'No held-out answer exists for this disease; use this query for exploration only.'
        if target and not query["target_in_candidates"]:
            target_text += ' This answer is absent from the training candidate vocabulary and cannot be retrieved.'
        subset = "Included" if query["in_original_evaluation"] else "Not included"
        cards = []
        for method, ranking in query["rankings"].items():
            items = "".join(f'<li class="{"target" if item["is_target"] else ""}">{escape(item["drug"].title())}'
                            f'<small>Ranking score: {item["score"]:.4f}</small></li>' for item in ranking["top10"])
            rank = ranking["target_rank"]
            rank_text = f'Hidden-answer rank: {rank}' if rank else 'Hidden-answer rank: unavailable'
            cards.append(f'<section class="card"><h2>{escape(method.title())}</h2><p>{rank_text}</p><ol>{items}</ol></section>')
        results = f'<h2>Results for {escape(query["disease"].title())}</h2><p>{target_text}</p><p class="muted">{subset} in the original 19-query evaluation. Green marks the hidden dataset answer. Scores are method-specific; they are not probabilities.</p><div class="columns">{"".join(cards)}</div>'
    rows = "".join(f'<tr><th>{escape(row["model"])}</th><td>{row["recall_at_1"]:.1%}</td><td>{row["recall_at_5"]:.1%}</td><td>{row["mrr"]:.4f}</td></tr>' for row in model.metrics["models"])
    page = f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RMF-RAG · Query lab</title><style>{STYLE}</style>
<main><nav><a href="/">Query lab</a><a href="/report">Original pilot report</a><a href="/audit">Five-seed audit</a><a href="/paper">Sample paper</a><a href="http://127.0.0.1:5173/">Research slides</a></nav>
<h1>Test the trained retrieval model</h1><p class="muted">Compare lexical overlap, Euclidean distance and Poincaré distance on the same disease–drug graph.</p>
<p class="notice">This is a working retrieval pilot, with no LLM answer generation. Drug rankings are dataset experiments, not treatment recommendations.</p>
<section class="card"><form action="/" method="get"><label for="disease">Disease name</label><p class="muted">Select an existing disease, then compare the top ten retrieved drugs.</p><input id="disease" name="q" list="diseases" maxlength="200" required value="{escape(value, quote=True)}" placeholder="e.g. cancer"><datalist id="diseases">{options}</datalist> <button type="submit">Compare retrieval</button></form><p>Try: {examples}</p><p class="error" role="alert">{escape(error)}</p></section>
{results}<section class="card"><h2>Reproduced seed-17 results</h2><p>19 recoverable queries out of 182 held-out links. All three methods scored 0% Recall@1.</p><div class="scroll"><table><thead><tr><th>Method</th><th>Recall@1</th><th>Recall@5</th><th>MRR</th></tr></thead><tbody>{rows}</tbody></table></div><p class="muted">These results do not establish better accuracy than the cited papers. The full Hetionet benchmark runner is missing from the source repository.</p></section></main></html>'''
    return page.encode("utf-8")


def make_handler(model: PilotModel):
    class Handler(BaseHTTPRequestHandler):
        def send_content(self, body: bytes, mime: str, status: int = 200) -> None:
            self.send_response(status)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'")
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self) -> None:
            route = urlsplit(self.path)
            if route.path in ("/", "/api/query"):
                try:
                    params = parse_qs(route.query, max_num_fields=4, keep_blank_values=True)
                    value = params.get("q", [""])[0]
                    result = model.query(value) if "q" in params else None
                    if route.path == "/api/query":
                        if result is None:
                            raise ValueError("A disease query is required.")
                        self.send_content(json.dumps(result).encode(), "application/json; charset=utf-8")
                    else:
                        self.send_content(render(model, result, value=value), "text/html; charset=utf-8")
                except ValueError as exc:
                    if route.path == "/api/query":
                        self.send_content(json.dumps({"error": str(exc)}).encode(), "application/json", 400)
                    else:
                        self.send_content(render(model, error=str(exc)), "text/html; charset=utf-8", 400)
                return
            documents = {
                "/report": (RESULTS / "report.html", "text/html; charset=utf-8"),
                "/audit": (ROOT / "local-run/extended/summary.md", "text/plain; charset=utf-8"),
                "/paper": (ROOT / "local-run/SAMPLE_RESEARCH_PAPER.html", "text/html; charset=utf-8"),
            }
            if route.path in documents:
                path, mime = documents[route.path]
                if path.is_file():
                    self.send_content(path.read_bytes(), mime)
                else:
                    self.send_content(b"This document is still being prepared. Return to the query lab and check again later.", "text/plain", 503)
                return
            self.send_content(b"Not found", "text/plain", 404)
    return Handler


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8766)
    args = parser.parse_args()
    model = PilotModel()
    with ThreadingHTTPServer(("127.0.0.1", args.port), make_handler(model)) as server:
        print(f"Query lab: http://127.0.0.1:{args.port}/", flush=True)
        server.serve_forever()


if __name__ == "__main__":
    main()
