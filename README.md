# KG-RAG / RMF-RAG Research

This repository studies when hyperbolic geometry helps biomedical knowledge-graph retrieval. It contains a reproducible disease-drug pilot, a controlled Euclidean-vs-Poincare implementation, and a restored multi-hop Hetionet benchmark runner.

## 1. Reproduce the existing pilot

```bash
python -m pip install -r requirements-pilot.txt
python research/scripts/run_rmf_rag_experiment.py
python research/scripts/run_local_audit.py
```

The verified historical five-seed audit uses seeds 7, 17, 29, 43, and 101. On all held-out links, mean Recall@5 is 4.62% lexical, 2.20% Euclidean, and 2.64% for the original hyperbolic prototype. These are preliminary pilot results. The historical learned models used unequal training budgets, so these values do not establish hyperbolic superiority.

## 2. Run the controlled geometry experiment

```bash
python -m pip install -r requirements-research.txt
python -m pytest -q research/tests/test_controlled_retrievers.py
python research/scripts/run_controlled_geometry_experiment.py
```

The controlled experiment matches the Euclidean and Poincare models on graph, split, dimension, margin, epochs, negative samples, candidate pool, and seeds. The Poincare model uses PyTorch autograd, Riemannian gradient scaling, and projection inside the ball instead of the finite-difference optimizer used by the original pilot.

## 3. Run the full Hetionet multi-hop benchmark

The restored runner is:

```bash
python research/scripts/run_main_rmf_rag_benchmark.py
```

It uses the licensed relation subset of Hetionet v1.0 and builds two leakage-controlled tasks:

- 2-hop: Gene -> Disease -> Compound
- 3-hop: Gene -> Disease -> Gene -> Compound

Validation/test terminal answer edges are removed before embedding training. The runner creates frozen query sets, trains matched Euclidean and Poincare models across five seeds, evaluates lexical and typed-path baselines, runs geometry/path ablations, saves per-query predictions, computes confidence intervals, and writes paper-ready tables.

If automatic snapshot retrieval is unavailable, download the Hetionet v1.0 archived release from Zenodo record `268568`, extract `hetnet/json/hetionet-v1.0.json.bz2`, and place it at `research_data/hetionet/hetionet-v1.0.json.bz2`, or set `HETIONET_JSON_BZ2` to the snapshot path.

## Research status

The controlled model code and restored multi-hop runner were freshly reproduced on the official Hetionet v1.0 snapshot (SHA-256 `a342ab57e9073e6c02bb5e109d1f16917e6f933be4e5c77ebbaebfa26b984c19`) using seeds 7, 17, 29, 43, and 101. The exact query sets, predictions, embeddings, confidence intervals, tables, SVG figure, and HTML report are in `research/results/main_benchmark/`. On test MRR, Poincare is 0.009 versus Euclidean 0.009 for 2-hop retrieval, and 0.011 versus 0.009 for 3-hop retrieval; the five-seed confidence intervals overlap, so this run does not establish a conclusive geometry advantage.

See `research/REPRODUCIBILITY_STATUS.md`, `research/SUPERVISOR_UPDATE.md`, `research/PAPER_DRAFT_VERIFIED.md`, and `research/EXPERIMENT_COMPLETION_PLAN.md`.
