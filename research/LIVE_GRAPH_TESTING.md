# Live graph question testing

Run `python research/scripts/live_graph_qa.py`, then open http://localhost:8767/.
The first startup parses the full compressed snapshot and can take a minute.
Requires Python standard library only. Download the source snapshot to
`research_data/hetionet/hetionet-v1.0.json.bz2` from
https://media.githubusercontent.com/media/hetio/hetionet/main/hetnet/json/hetionet-v1.0.json.bz2.
The loader checks SHA256
`a342ab57e9073e6c02bb5e109d1f16917e6f933be4e5c77ebbaebfa26b984c19`.

## Professor demonstration

1. Ask: “Which compounds connect to AKT3 through epilepsy in 2 hops?”
2. Change only “2 hops” to “3 hops”. Observe the additional intermediate gene.
3. Expand edge evidence to inspect the relation, original endpoints, sources,
   and license. Traversal can reverse a stored edge; the original direction is
   retained in its JSON. An association chain does not imply causation.
4. Submit a question containing an unknown gene or “not connected”. The app
   should reject it rather than silently substitute a saved example.
5. Save the complete JSON through the result link. Rankings use descending
   path counts, with identifier ordering for ties. Scores are not probabilities.

The interface accepts a constrained question language: one known gene, one known
disease and an explicit two- or three-hop count. It is not a general semantic
question parser. Gene numeric IDs require the prefix “gene”, e.g. “gene 6323”.
It searches a permissively licensed relation subset, so absence of a path is not
proof of absence in biology or the full graph. Compound identifiers are used
instead of redistributing noncommercial DrugBank names.

## What this demonstrates

Real query-time traversal of typed paths. The two-hop template is
Gene–associates–Disease–treats/palliates–Compound. The three-hop template is
Gene–associates–Disease–associates–another Gene–binds–Compound.
Results include actual evidence edges rather than a prerecorded ranking.

## What remains before research conclusions

This explorer uses the full observed licensed graph. It has no held-out test,
trained Euclidean/Poincaré comparison, or LLM generation. Therefore it provides
neither accuracy measurements nor a hallucination reduction estimate. The old
saved-packet page on port 8766 is a separate historical demonstration.

For a publication experiment, freeze query and answer-edge splits before
training; match model dimensions, update counts and negative examples; compare
five seeds; evaluate answer recall/MRR and full supporting-path recovery; and
run ablations. For hallucinations, preserve actual model generations and obtain
claim-level evidence labels independent of the answer-selection policy. Report
unsupported-claim rate together with answer coverage and correctness: abstaining
on every question is not a useful improvement. Clinical truth and text entailment
cannot be established by a path-count heuristic.

The pasted attachment's claimed PyTorch/Geoopt patch was not attached as source
code. No claim that those models have been installed, trained, or verified is
made here. Novelty requires a literature comparison as well as implementation.

Run behavioral tests with:
`python -m unittest discover -s research/scripts -p test_live_graph_qa.py -v`.
These synthetic test fixtures are software tests, not biomedical benchmark data.
