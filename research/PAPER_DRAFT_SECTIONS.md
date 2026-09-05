# Paper-ready draft sections

## Dataset and licensing

We evaluated RMF-RAG on Hetionet v1.0, an integrative biomedical knowledge
graph containing 47,031 nodes and 2,250,197 relationships. We used the archived
JSON snapshot with SHA-256
`a342ab57e9073e6c02bb5e109d1f16917e6f933be4e5c77ebbaebfa26b984c19`.
Hetionet original content is released under CC0 1.0, while integrated records
retain source-specific licenses.

To make the evaluation legally reusable, we selected only relations carrying
an explicit CC0 1.0 or CC BY 4.0 license from attributable sources. The
benchmark subgraph contains 3,200 DISEASES CC BY 4.0 Gene–Disease
`associates` edges, 1,145 PharmacotherapyDB CC0 1.0 Disease–Compound
`treats`/`palliates` edges, and 823 DrugCentral CC BY 4.0 Gene–Compound
`binds` edges. Edges with noncommercial, share-alike, ODbL, missing-license,
or ambiguous provenance metadata were excluded. Full creator attribution,
license URIs, and modification notices accompany the benchmark.

Dataset citation: Himmelstein DS et al. “Systematic integration of biomedical
knowledge prioritizes drugs for repurposing.” *eLife* 2017;6:e26726.
<https://doi.org/10.7554/eLife.26726>

### Licensed text evidence layer

Graph connectivity was augmented with a frozen evidence manifest from the
Europe PMC Open Access subset. Europe PMC is operated by EMBL-EBI; the source
API, Open Access policy, retrieval date, and attribution policy are recorded in
`research/data/EVIDENCE_SOURCE.md`. The manifest retains only records whose
metadata reports a **CC BY** license and stores each record's PMCID, PMID, DOI,
title, landing-page URL, and a short verbatim abstract excerpt. PMCID is the
primary reproducible identifier, and each record can be rechecked through the
Europe PMC REST API. CC BY-NC, CC BY-ND, CC BY-NC-ND, and unlicensed records are
excluded.

Evidence is deliberately typed rather than treated as a binary clinical
grounding signal. `direct_but_species_limited` and `direct_but_preclinical`
records name a candidate and address a seizure phenotype but do not establish
human clinical utility. `context_only` records describe anesthesia,
perioperative care, or a drug class without establishing that the candidate
treats the queried disease. `no_licensed_record` is an absence from the frozen
manifest, not evidence of inefficacy. These distinctions are emitted for every
top-ten candidate in the 2-hop and 3-hop query demos.

## Query construction and leakage control

We constructed two typed drug-retrieval tasks:

1. **2-hop:** Gene → Disease → Compound, using `associates` followed by
   `treats` or `palliates`.
2. **3-hop:** Gene → Disease → Gene → Compound, using two `associates`
   relations followed by `binds`.

For each random seed, terminal Disease–Compound and Gene–Compound answer edges
were assigned to train, validation, or test partitions. Validation and test
terminal edges were removed before model training. Disease–Compound edges were
split within disease so diseases with at least three drugs retained at least
one training edge. Exact JSONL query sets are saved for every seed, hop count,
and split.

The evaluation used seeds 7, 17, 29, 43, and 101. Each seed contained 500
2-hop validation and 500 2-hop test queries. Depending on the held-out bind
edges that admitted a licensed three-edge path, the 3-hop sets contained
153–177 validation and 166–252 test queries. Query generation was capped at
500 examples per hop/split/seed after deterministic sampling.

## Models and matched training budget

We compared a lexical baseline, a Euclidean graph embedding, and a
Poincaré-ball graph embedding. The lexical method used IDF-weighted token
overlap between the gene/disease query context and candidate compound text.
Both learned models used the same training graph, 16 dimensions, 24 epochs,
one type-matched negative per positive edge, margin 0.45, and learning rate
0.035. Euclidean training used squared L2 distance. Poincaré training used
geodesic distance with Riemannian-scaled gradients and projection inside the
unit ball.

The reusable lexical baseline used IDF-weighted overlap between query
identifiers and identifiers in each candidate compound's licensed train-graph
neighborhood. This avoids restricted compound labels while retaining a
non-degenerate symbolic retrieval comparison.

The full RMF-RAG retrieval configuration used Poincaré geodesic ranking,
inverse-hop context weights, radial parallel transport through the origin, and
reported exact typed-path verification. Ablations independently replaced
geodesic ranking with chord distance, removed hop weighting, removed parallel
transport, or added typed-path-support reranking.

We report Recall@1, Recall@5, Recall@10, mean reciprocal rank (MRR), and the
fraction of top-ranked predictions supported by a training-graph path within
the query hop budget. Confidence intervals are two-sided 95% t intervals over
five random seeds (four degrees of freedom).

## Main test results

| Task | Method | Recall@1 | Recall@5 | MRR | Top-1 path verified |
|---|---|---:|---:|---:|---:|
| 2-hop | Lexical | 0.000 [0.000, 0.000] | 0.006 [0.003, 0.010] | 0.009 [0.008, 0.011] | 0.958 [0.945, 0.971] |
| 2-hop | Euclidean | 0.000 [0.000, 0.002] | 0.011 [0.006, 0.016] | 0.013 [0.011, 0.015] | 0.854 [0.811, 0.897] |
| 2-hop | Poincaré / RMF-RAG | 0.000 [0.000, 0.002] | 0.007 [0.000, 0.015] | 0.012 [0.011, 0.014] | 0.866 [0.821, 0.911] |
| 3-hop | Lexical | 0.006 [0.000, 0.023] | 0.022 [0.000, 0.055] | 0.022 [0.000, 0.045] | 0.462 [0.295, 0.629] |
| 3-hop | Euclidean | 0.002 [0.000, 0.008] | 0.011 [0.000, 0.028] | 0.011 [0.002, 0.020] | 0.044 [0.000, 0.092] |
| 3-hop | Poincaré / RMF-RAG | 0.005 [0.000, 0.015] | 0.007 [0.000, 0.015] | 0.015 [0.006, 0.024] | 0.053 [0.006, 0.099] |

Poincaré retrieval did not improve mean MRR over the Euclidean model on the
2-hop task (0.012 versus 0.013), while it increased 3-hop MRR from 0.011 to
0.015. The confidence intervals overlap, so neither difference should be
described as statistically conclusive. Recall remained low for every method,
showing that holding out terminal biomedical edges is substantially harder
than the earlier lexical-token pilot.

## Ablation findings

The ablations did not support a simple claim that every geometric component
improves retrieval. On 3-hop test queries, replacing geodesic ranking with
Poincaré chord distance produced MRR 0.016 versus 0.015 for the full
configuration. Removing hop weighting produced MRR 0.018, and removing
parallel transport produced MRR 0.020. These estimates have wide and
overlapping confidence intervals, but their direction indicates that the
current weighting and transport approximations require further calibration.

Exact typed-path reranking increased top-1 path verification from 0.866 to
0.949 on 2-hop test queries and from 0.053 to 0.686 on 3-hop test queries. It
reduced MRR on both tasks, illustrating a precision–coverage tradeoff: graph
verification can reject unsupported candidates without guaranteeing recovery
of a deliberately held-out terminal edge.

## Evidence-grounding evaluation

We added a small frozen gold-standard calibration set in
`research/data/evidence_gold_standard.json`, independent of method ranking and
defined without using Recall/MRR. It contains eight
query–candidate annotations spanning the two demo queries. Each annotation
separates: (1) typed path support in the training graph, (2) support from a
licensed text record, and (3) therapeutic plausibility within the source's
scope. The accompanying `research/scripts/evaluate_evidence.py` joins the
calibration set to saved demo rankings and reports annotated-candidate coverage
by each dimension without recomputing Recall or MRR.

The calibration set intentionally contains positive, context-only, and
no-record examples. For example, a CC BY veterinary article directly supports
zonisamide for epileptic seizures in dogs but is species-limited; a CC BY
perioperative article places propofol or anesthetic selection in an epilepsy
surgery context but does not support an epilepsy-treatment claim. This is a
research calibration set rather than clinical expert consensus. Its role is to
prevent a retrieved path or a relevant article from being presented as a
therapeutic recommendation.

## Interpretation and limitations

This experiment is a reproducible, leakage-controlled benchmark on explicit
biomedical relations, not evidence of clinical utility. It improves materially
on the Kaggle pilot by using licensed gene, disease, and compound edges,
explicit 2-hop and 3-hop paths, matched learned-model budgets, five seeds,
confidence intervals, and fully saved predictions.

The evidence extension remains a small, source-scoped calibration layer, not a
clinical validation study. It does not evaluate dosage, temporal knowledge,
adverse-event constraints, contraindications, or patient-specific suitability,
and it does not replace independent clinical review. The selected CC0/CC BY
relation subset is smaller than the full Hetionet graph, and the 3-hop `binds`
endpoint measures molecular target connectivity rather than an approved
treatment recommendation. Candidate rankings and cited snippets must not be
interpreted as medical advice.

The principal result is therefore a calibrated negative one: hyperbolic
geometry yields a modest 3-hop MRR gain but no 2-hop gain over a matched
Euclidean embedding, while the individual RMF-RAG components do not yet show
consistent retrieval gains. Future work should tune these components only on
validation splits, incorporate licensed semantic biomedical text, and evaluate
externally curated drug-repurposing labels before making stronger claims.

## Reproducibility package

The ten-week engineering build is complete as a retrieval benchmark. A fresh
checkout can rerun `research/scripts/run_main_rmf_rag_benchmark.py`, rebuild the
self-contained `results/main_benchmark/report.html`, inspect exact held-out
2-hop and 3-hop queries with `research/scripts/main_query_demo.py`, and run
`research/scripts/evaluate_evidence.py` against the saved demo packets. The
query demo emits method rankings plus graph-path support and cited licensed-text
status for every candidate. The evidence evaluator reports those dimensions
separately from Recall/MRR. These outputs make the benchmark auditable without
requiring an external model API or treating a retrieved compound as medical
advice.