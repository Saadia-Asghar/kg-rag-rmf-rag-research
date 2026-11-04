# Reproducibility status

## Verified evidence

The existing disease-drug pilot is runnable from the repository and has a five-seed audit. Seeds are 7, 17, 29, 43, and 101. On the all-held-out set, mean Recall@5 is 4.62% lexical, 2.20% Euclidean, and 2.64% for the original hyperbolic prototype. Mean MRR is 0.02412, 0.01962, and 0.02064 respectively. These values do not establish hyperbolic superiority.

The original learned-model comparison retained unequal training budgets, so it is an audit of the old prototype rather than the final controlled geometry experiment.

## Controlled geometry implementation

`research/models/controlled_retrievers.py` provides matched PyTorch Euclidean and Poincare retrievers. The Poincare model uses geodesic distance, PyTorch autograd, Riemannian gradient scaling, and projection inside the ball.

`research/scripts/run_controlled_geometry_experiment.py` uses the same graph, split, dimensions, margin, epochs, negative samples, candidate pool, metrics, and five seeds for both learned models. It saves per-seed metrics, predictions, training histories, aggregate means, and exploratory 95% t intervals.

## Restored full multi-hop benchmark

`research/scripts/run_main_rmf_rag_benchmark.py` restores the previously missing Hetionet benchmark path. The code now implements:

- versioned Hetionet v1.0 snapshot acquisition or `HETIONET_JSON_BZ2` override
- explicit source/license filtering for the claimed reusable relation subset
- expected relation-count checks (3,200 Gene-Disease, 1,145 Disease-Compound, 823 Gene-Compound)
- deterministic 2-hop and 3-hop train/validation/test query generation
- validation/test terminal-edge removal before training
- matched Euclidean and Poincare training budgets and negative samples
- lexical, Euclidean, Poincare, and typed-path ranking
- five-seed evaluation with Recall@1/5/10, MRR, path verification, and 95% t intervals
- geodesic, hop-weighting, tangent-composition, and path-verification ablations
- per-query predictions, frozen query sets, embeddings, metadata, provenance, and paper tables

The restored helper API is compatible with the existing `research/scripts/main_query_demo.py`.

## Validation performed on the restored code

The completion bundle's test suite checks Poincare distance, optimization, ball projection, ranking, relation filtering, split disjointness, leakage removal, typed query construction, all benchmark ranking modes, and matched-training smoke behavior. All tests pass in the validation environment.

This validates the code path, not the historical empirical numbers.

## What still requires a real-data run

Completed on 2026-09-14: the official Hetionet v1.0 archive matched Zenodo's published MD5, and the extracted snapshot SHA-256 is `a342ab57e9073e6c02bb5e109d1f16917e6f933be4e5c77ebbaebfa26b984c19`. `run_main_rmf_rag_benchmark.py` completed all five seeds and regenerated the frozen query sets, predictions, embeddings, confidence intervals, tables, SVG figure, and HTML report. The fresh held-out metrics are recorded in `research/results/main_benchmark/aggregate_metrics.csv`; the study does not claim a conclusive Poincare advantage because the Euclidean and Poincare five-seed confidence intervals overlap.

Therefore, today it is accurate to say:

- the controlled retriever implementation is complete
- the full multi-hop benchmark runner is restored and test-validated
- the full real-data benchmark reproduction is complete
- no clinical validation claim is supported

## Final completion gate

The retrieval study can be called empirically complete once a clean checkout downloads/loads the frozen Hetionet snapshot, passes the relation-count and leakage checks, completes all five seeds, regenerates query sets and result artifacts, and produces the headline tables directly from those outputs. The paper is complete only after those fresh results replace historical values and the evidence/groundedness claims are checked separately.

## Training correction (November 2026)

The first Hetionet run (one full-batch step per epoch, 24 epochs) was under-trained: loss moved only from 0.4495 to 0.4486 and all learned methods ranked at chance level (random-ranking MRR over 666 compounds is 0.0106). The runner now trains both geometries with identical mini-batches (batch size 256, 60 epochs) and selects each geometry's learning rate from {0.03, 0.1, 0.3, 1, 3} on seed-7 validation MRR only; both selected 0.1. The controlled pilot previously used Adam for Euclidean and full-batch RSGD for Poincare; it now uses matched mini-batch SGD/RSGD with the same settings. All results in `research/results/` and the manuscript in `research/paper/` come from these corrected runs. Headline test MRR (3-hop): Euclidean 0.095, Poincare 0.091; paired differences include zero on every task and metric.
