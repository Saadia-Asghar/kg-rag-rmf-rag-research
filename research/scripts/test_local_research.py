"""Behavioral checks for the query interface and full-denominator scoring."""
import csv
import json
import threading
import unittest
from http.server import ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.request import urlopen

from local_query_app import PilotModel, RESULTS, make_handler, render
from run_local_audit import metrics_from_predictions


class EvaluationTests(unittest.TestCase):
    def test_missing_answers_remain_in_denominator(self):
        scores = metrics_from_predictions([{"target_rank": 1}, {"target_rank": 5}, {"target_rank": None}])
        self.assertAlmostEqual(scores["recall_at_1"], 1 / 3)
        self.assertAlmostEqual(scores["recall_at_5"], 2 / 3)
        self.assertAlmostEqual(scores["mrr"], 0.4)

    def test_empty_subset_rejected(self):
        with self.assertRaises(ValueError):
            metrics_from_predictions([])


class QueryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.model = PilotModel()

    def test_all_recoverable_ranks_match_original_predictions(self):
        with (RESULTS / "predictions.csv").open(encoding="utf-8", newline="") as handle:
            original = list(csv.DictReader(handle))
        queries = {row["disease"]: self.model.query(row["disease"]) for row in original if row["model"] == "euclidean"}
        mapping = {"lexical_baseline": "lexical", "euclidean": "euclidean", "rmf_rag_hyperbolic": "hyperbolic"}
        for row in original:
            ranked = queries[row["disease"]]["rankings"][mapping[row["model"]]]
            self.assertEqual(ranked["target_rank"], int(row["target_rank"]))
            self.assertEqual(ranked["top10"][0]["drug"], row["top1_prediction"])

    def test_unknown_and_empty_queries_rejected(self):
        for text in ("", "x" * 201, "not-a-disease-zzzz"):
            with self.assertRaises(ValueError):
                self.model.query(text)

    def test_render_escapes_input(self):
        page = render(self.model, value='<script>alert(1)</script>').decode()
        self.assertNotIn('<script>', page)
        self.assertIn('&lt;script&gt;', page)

    def test_http_queries_and_unknown_routes(self):
        with ThreadingHTTPServer(("127.0.0.1", 0), make_handler(self.model)) as server:
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            base = f"http://127.0.0.1:{server.server_port}"
            try:
                with urlopen(base + '/api/query?q=cancer', timeout=10) as response:
                    packet = json.load(response)
                self.assertEqual(packet['rankings']['hyperbolic']['target_rank'], 2)
                for path, code in (('/api/query?q=', 400), ('/../../pyproject.toml', 404)):
                    with self.assertRaises(HTTPError) as raised:
                        urlopen(base + path, timeout=10)
                    self.assertEqual(raised.exception.code, code)
            finally:
                server.shutdown()
                thread.join(timeout=5)


if __name__ == '__main__':
    unittest.main()
