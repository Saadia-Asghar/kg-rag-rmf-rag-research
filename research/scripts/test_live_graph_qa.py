"""Behavioral tests; synthetic fixtures are not research benchmark results."""
import unittest
from live_graph_qa import Graph, page


def fixture():
    nodes = [('Gene', 6323, 'SCN1A'), ('Gene', 2, 'A2M'),
             ('Disease', 'DOID:1826', 'epilepsy syndrome'),
             ('Compound', 'DB00001', 'example')]
    edges = [('Disease', 'DOID:1826', 'associates', 'Gene', 6323),
             ('Disease', 'DOID:1826', 'associates', 'Gene', 2),
             ('Compound', 'DB00001', 'treats', 'Disease', 'DOID:1826'),
             ('Compound', 'DB00001', 'binds', 'Gene', 2)]
    return {'nodes': [{'kind': kind, 'identifier': ident, 'name': name} for kind, ident, name in nodes],
            'edges': [{'source_id': [sk, si], 'target_id': [tk, ti], 'kind': rel,
                       'data': {'license': 'CC BY 4.0'}} for sk, si, rel, tk, ti in edges]}


class LiveGraphTests(unittest.TestCase):
    def test_exact_hops(self):
        graph = Graph(fixture())
        for hops in (2, 3):
            result = graph.query(f'Which compounds connect SCN1A through epilepsy in {hops} hops?')
            self.assertEqual(result['candidate_count'], 1)
            path = result['candidates'][0]['paths'][0]
            self.assertEqual(len(path['edges']), hops)
            self.assertEqual(len({n['id'] for n in path['nodes']}), hops + 1)

    def test_unlicensed_edge_not_used(self):
        payload = fixture()
        payload['edges'][2]['data']['license'] = 'CC BY-NC 4.0'
        result = Graph(payload).query('Which compounds connect SCN1A through epilepsy in 2 hops?')
        self.assertEqual(result['candidate_count'], 0)

    def test_no_silent_question_substitution(self):
        graph = Graph(fixture())
        for q in ['Which compounds do not connect SCN1A through epilepsy in 2 hops?',
                  'Which compounds connect SCN1A through epilepsy in 4 hops?',
                  'Which compounds connect SCN1A through epilepsy?',
                  'Which compounds connect SCN1A and A2M through epilepsy in 2 hops?',
                  'Which compounds connect UNKNOWN through epilepsy in 2 hops?']:
            with self.assertRaises(ValueError):
                graph.query(q)

    def test_html_escaped(self):
        result = page(question='<script>alert(1)</script>').decode()
        self.assertNotIn('<script>', result)
        self.assertIn('&lt;script&gt;', result)


if __name__ == '__main__':
    unittest.main()
