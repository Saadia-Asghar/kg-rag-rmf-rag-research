# KG-RAG / RMF-RAG Research

## Run the query lab locally

The runnable application compares lexical, Euclidean, and hyperbolic disease–drug retrieval. It is a retrieval pilot, with no LLM answer generation or API key requirement.

```bash
python -m pip install -r requirements-pilot.txt
python -X utf8 research/scripts/local_query_app.py
```

Open http://localhost:8766 and enter a disease such as `cancer`. See [local testing instructions](research/LOCAL_TESTING.md) for retraining, tests, and the five-seed audit.

**Measured result:** across five seeds on all 182 held-out links, mean Recall@5 is 4.62% lexical, 2.20% Euclidean, and 2.64% hyperbolic. The pilot does not establish superiority to the cited papers. [Audit results](local-run/extended/summary.md) · [Sample research paper](local-run/SAMPLE_RESEARCH_PAPER.md).

**Reproducibility limitation:** `research/scripts/run_main_rmf_rag_benchmark.py` and the Hetionet query sets/model files referenced by the older instructions are absent from the source revision. The saved Hetionet report is not a locally reproduced experiment. The five-seed audit concerns the disease–drug pilot only.

Reproducible research project for comparing lexical, Euclidean, and hyperbolic retrieval on biomedical knowledge-graph pilots.

See `research/README.md` for commands and `research/PAPER_DRAFT_SECTIONS.md` for paper-ready methods, results, and limitations.

This repository contains preliminary pilot evidence only; the full gene-to-disease-to-drug benchmark requires a curated biomedical graph such as PrimeKG or Hetionet.
