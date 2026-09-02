# RMF-RAG research benchmarks

This folder contains the original Kaggle pilot and the main benchmark on the
licensed portion of Hetionet v1.0. The pilot is retained for comparison but is
not a gene–disease–drug evaluation.

## Main Hetionet benchmark

```bash
python research/scripts/run_main_rmf_rag_benchmark.py
```

The runner verifies/downloads `research_data/hetionet/hetionet-v1.0.json.bz2`,
creates reproducible train/validation/test query sets for 2-hop and 3-hop typed
paths, trains Euclidean and Poincaré models under matched budgets across five
seeds, and writes:

- `results/main_benchmark/predictions.jsonl` — raw per-query predictions
- `results/main_benchmark/metrics_by_seed.csv` — seed-level metrics
- `results/main_benchmark/aggregate_metrics.csv` — means and 95% confidence intervals
- `results/main_benchmark/paper_table.md` and `ablation_table.md` — paper-ready tables
- `results/main_benchmark/report.html` — self-contained visual benchmark report
- `results/main_benchmark/query_demo.json` — auditable sample query/evidence packet
- `query_sets/*` — exact JSONL query sets used by each seed/split
- `data/HETIONET_SOURCE.md` — citation, hash, and relation-level license record
- `data/HETIONET_ATTRIBUTION.md` — source creators, license URIs, and modification notices

The tasks are Gene → Disease → Compound for 2-hop retrieval and Gene → Disease
→ Gene → Compound for 3-hop retrieval. Terminal answer edges are held out from
the training graph. Ablations cover geodesic ranking, hop weighting, parallel
transport, and exact typed-path verification. To avoid redistributing
noncommercial compound labels, the reusable lexical baseline compares query
identifiers with identifiers in each compound's licensed train-graph
neighborhood.

## Original pilot

```bash
python research/scripts/run_rmf_rag_experiment.py
```

## Run one practical query

```bash
python research/scripts/query_demo.py "cancer"
```

The query command loads the saved hyperbolic embeddings and ranks the five
nearest drug nodes by Poincaré geodesic distance.

## Run one main-benchmark query

```bash
python research/scripts/main_query_demo.py --hop 3 --split test --seed 101
```

This loads the saved seed-101 embeddings and the exact held-out query set,
returns the top ten candidates for lexical, Euclidean, Poincaré, and
path-verification retrieval, and marks whether each candidate is supported by
the typed training graph. It is an evidence packet for research inspection,
not a clinical recommendation.

Rebuild the report independently with:

```bash
python research/scripts/build_main_benchmark_report.py
```

## Outputs

- `results/metrics.json` — exact metrics and experiment metadata
- `results/predictions.csv` — per-query rankings for all three methods
- `results/trained_embeddings.npz` — trained Euclidean and hyperbolic vectors
- `results/model_index.json` — node-to-vector index
- `results/report.html` — readable experiment report
- `PAPER_DRAFT_SECTIONS.md` — methods/results text for a research draft

## Scientific scope

This is a **pilot link-retrieval experiment**, not a validation of the complete
gene→disease→drug RMF-RAG proposal. The Kaggle dataset contains disease–drug
answers but no genes, evidence passages, or curated multi-hop paths. Use the
result as preliminary evidence and motivation for a larger benchmark.

The main Hetionet build now supplies the licensed gene/disease/compound
benchmark, typed 2-hop and 3-hop queries, five-seed confidence intervals,
component ablations, a reproducible query/evidence packet, and a self-contained
report. It still does not claim clinical utility or replace independent
therapeutic validation.