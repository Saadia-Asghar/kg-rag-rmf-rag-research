"""Live typed-path exploration of the pinned Hetionet snapshot (not a benchmark)."""
from __future__ import annotations

import argparse
import bz2
from collections import defaultdict
import hashlib
import html
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import re
from urllib.parse import parse_qs, urlencode, urlsplit

ROOT = Path(__file__).resolve().parents[2]
SNAPSHOT = ROOT / 'research_data/hetionet/hetionet-v1.0.json.bz2'
SHA256 = 'a342ab57e9073e6c02bb5e109d1f16917e6f933be4e5c77ebbaebfa26b984c19'
LICENSES = {'CC0 1.0', 'CC BY 3.0', 'CC BY 4.0'}
EXAMPLE = 'Which compounds connect to AKT3 through epilepsy in 2 hops?'


def key(value):
    return (value[0], str(value[1]))


class Graph:
    def __init__(self, payload):
        self.nodes = {key((n['kind'], n['identifier'])): n for n in payload['nodes']}
        self.adj = defaultdict(list)
        self.edge_count = 0
        for edge in payload['edges']:
            source, target = key(edge['source_id']), key(edge['target_id'])
            signature = (source[0], edge['kind'], target[0])
            if signature not in {('Disease', 'associates', 'Gene'),
                                 ('Compound', 'binds', 'Gene'),
                                 ('Compound', 'treats', 'Disease'),
                                 ('Compound', 'palliates', 'Disease')}:
                continue
            if edge.get('data', {}).get('license') not in LICENSES:
                continue
            self.adj[source].append((target, edge))
            self.adj[target].append((source, edge))
            self.edge_count += 1
        self.aliases = {}
        for node_id, node in self.nodes.items():
            if node_id not in self.adj or node_id[0] not in {'Gene', 'Disease'}:
                continue
            aliases = [str(node['name']).lower(),
                       ('gene ' + node_id[1]) if node_id[0] == 'Gene' else node_id[1].lower()]
            if node_id == ('Disease', 'DOID:1826'):
                aliases.append('epilepsy')
            for alias in aliases:
                self.aliases.setdefault(alias, set()).add(node_id)

    @classmethod
    def load(cls):
        if hashlib.sha256(SNAPSHOT.read_bytes()).hexdigest() != SHA256:
            raise ValueError('Hetionet snapshot hash mismatch')
        with bz2.open(SNAPSHOT, 'rt', encoding='utf-8') as source:
            return cls(json.load(source))

    def parse(self, question):
        if not question.strip() or len(question) > 500:
            raise ValueError('Enter a full question of 1–500 characters.')
        text = question.lower()
        if re.search(r'\b(not|without|except|exclude|excluding|best|safe|safest|dose|dosage|recommend|cure|effective|efficacy)\b', text):
            raise ValueError('This explorer supports positive graph-connection questions only. Negation, efficacy and treatment recommendations require a different evaluator.')
        if not re.search(r'\b(compounds?|drugs?)\b', text):
            raise ValueError('Ask which compounds connect to a gene through a disease.')
        hops = set(re.findall(r'\b(\d+|two|three)[ -]*hops?\b', text))
        hops = { {'two': '2', 'three': '3'}.get(h, h) for h in hops }
        if len(hops) != 1 or next(iter(hops)) not in {'2', '3'}:
            raise ValueError('Specify exactly one hop count: 2 hops or 3 hops.')
        matched = set()
        for alias, ids in self.aliases.items():
            if re.search(r'(?<![a-z0-9])' + re.escape(alias) + r'(?![a-z0-9])', text):
                matched.update(ids)
        genes = {n for n in matched if n[0] == 'Gene'}
        diseases = {n for n in matched if n[0] == 'Disease'}
        if len(genes) != 1 or len(diseases) != 1:
            raise ValueError('Name exactly one recognized gene and one disease (symbols or identifiers). Ambiguous entities are not guessed.')
        return next(iter(genes)), next(iter(diseases)), int(next(iter(hops)))

    def describe(self, node_id):
        node = self.nodes[node_id]
        # DrugBank compound labels have separate noncommercial licensing.
        return {'kind': node_id[0], 'id': node_id[1],
                'label': node_id[1] if node_id[0] == 'Compound' else node['name']}

    def query(self, question):
        gene, disease, hops = self.parse(question)
        paths = defaultdict(list)
        prefixes = [edge for neighbor, edge in self.adj[gene]
                    if neighbor == disease and edge['kind'] == 'associates']
        for first in prefixes:
            for neighbor, second in self.adj[disease]:
                if hops == 2 and neighbor[0] == 'Compound' and second['kind'] in {'treats', 'palliates'}:
                    paths[neighbor].append(([gene, disease, neighbor], [first, second]))
                elif hops == 3 and neighbor[0] == 'Gene' and neighbor != gene and second['kind'] == 'associates':
                    for compound, third in self.adj[neighbor]:
                        if compound[0] == 'Compound' and third['kind'] == 'binds':
                            paths[compound].append(([gene, disease, neighbor, compound], [first, second, third]))
        candidates = []
        for compound, evidence in sorted(paths.items(), key=lambda item: (-len(item[1]), item[0])):
            candidates.append({'compound': self.describe(compound), 'path_count': len(evidence),
                               'paths': [{'nodes': [self.describe(n) for n in nodes],
                                          'edges': edges} for nodes, edges in evidence]})
        return {'question': question, 'gene': self.describe(gene), 'disease': self.describe(disease),
                'hops': hops, 'snapshot_sha256': SHA256, 'mode': 'full_snapshot_exploration',
                'ranking': 'Descending distinct typed-path count; compound identifier breaks ties. No learned embedding score or probability.',
                'answer': 'Graph connections found.' if candidates else 'Abstain: no matching path in the selected licensed graph.',
                'candidates': candidates, 'candidate_count': len(candidates),
                'limitations': 'Uses observed graph edges, not held-out predictions. No LLM is invoked. Path support is not clinical efficacy, answer accuracy, or a measured hallucination rate.'}


def page(result=None, question='', error=''):
    esc = html.escape
    sections = ''
    if result:
        sections = '<h2>' + esc(result['answer']) + '</h2><p>' + esc(result['ranking']) + '</p>'
        sections += '<p>' + str(result['candidate_count']) + ' candidates; displaying first 20. JSON contains all paths.</p>'
        for candidate in result['candidates'][:20]:
            sections += '<section><h3>' + esc(candidate['compound']['id']) + ' · ' + str(candidate['path_count']) + ' paths</h3>'
            for path in candidate['paths'][:5]:
                labels = [n['label'] for n in path['nodes']]
                sections += '<p>' + esc(' → '.join(labels)) + '</p>'
                for edge in path['edges']:
                    sections += '<details><summary>' + esc(edge['kind']) + ' · source and license</summary><pre>' + esc(json.dumps(edge, indent=2)) + '</pre></details>'
            sections += '</section>'
        sections += '<a href="/api/query?' + esc(urlencode({'q': question}), quote=True) + '">Download/view complete query evidence JSON</a>'
    examples = [EXAMPLE, EXAMPLE.replace('2 hops', '3 hops')]
    links = ' '.join('<p><a href="/?' + esc(urlencode({'q': q}), quote=True) + '">' + esc(q) + '</a></p>' for q in examples)
    return ('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>Live Hetionet query explorer</title><style>body{font:17px/1.6 system-ui;background:#f4f7fb;color:#172033;max-width:1000px;margin:40px auto;padding:20px}section,form{background:white;padding:22px;margin:20px 0;border:1px solid #ccc;border-radius:12px}textarea{width:95%;min-height:100px;font:inherit}button{padding:12px;font:inherit}pre{white-space:pre-wrap;overflow-wrap:anywhere}a{color:#174dc4}</style>'
            '<h1>Live multi-hop graph questions</h1><p>Each submitted query traverses the verified Hetionet snapshot. Supported templates: Gene → Disease → Compound (2 hops), or Gene → Disease → another Gene → Compound (3 hops).</p>'
            '<p><strong>Research prototype:</strong> graph evidence only. This page does not measure hallucinations or prove treatment efficacy. Ranking is path count, not a trained RMF model. Historical demos: <a href="http://localhost:8766/">previous app</a>.</p>'
            '<form method="get"><label for="q">Full question</label><br><textarea id="q" name="q" required maxlength="500">' + esc(question) + '</textarea><br><button>Run live query</button></form>'
            '<p role="alert">' + esc(error) + '</p>' + links + sections + '</html>').encode('utf-8')


def handler(graph):
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            route = urlsplit(self.path)
            status, result, question, error = 200, None, '', ''
            if route.path not in {'/', '/api/query'}:
                self.send_error(404)
                return
            try:
                params = parse_qs(route.query, max_num_fields=4, keep_blank_values=True)
                question = params.get('q', [''])[0]
                if 'q' in params or route.path == '/api/query':
                    result = graph.query(question)
            except ValueError as exc:
                status, error = 400, str(exc)
            is_api = route.path == '/api/query'
            body = json.dumps(result if not error else {'error': error}).encode() if is_api else page(result, question, error)
            self.send_response(status)
            self.send_header('Content-Type', 'application/json; charset=utf-8' if is_api else 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'")
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.end_headers()
            self.wfile.write(body)

    return Handler


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8767)
    args = parser.parse_args()
    graph = Graph.load()
    print(f'Loaded {graph.edge_count} licensed edges. http://localhost:{args.port}/', flush=True)
    with ThreadingHTTPServer(('127.0.0.1', args.port), handler(graph)) as server:
        server.serve_forever()
