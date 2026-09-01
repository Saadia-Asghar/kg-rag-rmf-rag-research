# RMF-RAG disease–drug retrieval pilot

This folder contains a reproducible, CPU-friendly experiment using the Kaggle
`disease-drug-dataset` by `erolatik`.

## Run the experiment

```bash
python research/scripts/run_rmf_rag_experiment.py
```

## Run one practical query

```bash
python research/scripts/query_demo.py "cancer"
```

The query command loads the saved hyperbolic embeddings and ranks the five
nearest drug nodes by Poincaré geodesic distance.

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