# RMF-RAG research experiments

## Verified pilot

The repository contains a reproducible disease-drug retrieval pilot and a five-seed audit. Run it with:

```bash
python research/scripts/run_rmf_rag_experiment.py
python research/scripts/run_local_audit.py
```

The original audit is useful for validating the older prototype. It retained unequal training budgets and therefore is not the final Euclidean-vs-hyperbolic comparison.

## Controlled Euclidean vs Poincare experiment

```bash
python -m pip install -r requirements-research.txt
python -m pytest -q research/tests/test_controlled_retrievers.py
python research/scripts/run_controlled_geometry_experiment.py
```

The controlled runner uses identical splits, dimensionality, margin, epochs, candidate sets, negative samples, and seed schedule for both learned models. The Poincare model uses autograd, Riemannian gradient scaling, and ball projection.

Outputs are written to `research/results/controlled_geometry/` and should be used instead of the unequal-budget pilot when discussing geometry.

## Full Hetionet benchmark

The missing multi-hop runner has been restored as:

```bash
python research/scripts/run_main_rmf_rag_benchmark.py
```

The runner uses the reusable licensed subset of Hetionet v1.0 and implements:

- Gene -> Disease -> Compound 2-hop retrieval
- Gene -> Disease -> Gene -> Compound 3-hop retrieval
- terminal-edge leakage control before model training
- deterministic train/validation/test query generation
- lexical, Euclidean, Poincare, and typed-path retrieval
- five seeds and 95% t intervals
- per-query predictions and saved embeddings
- geodesic, hop-weighting, tangent-composition, and path-verification ablations
- provenance/checksum records and paper-ready tables

The expected relation counts are 3,200 DISEASES Gene-Disease `associates` edges, 1,145 PharmacotherapyDB Disease-Compound `treats`/`palliates` edges, and 823 DrugCentral Gene-Compound `binds` edges. The runner stops on count drift unless exploratory override is explicitly enabled.

The benchmark snapshot belongs at `research_data/hetionet/hetionet-v1.0.json.bz2`. You can instead set `HETIONET_JSON_BZ2` to an existing Hetionet v1.0 snapshot.

### Main outputs

- `results/main_benchmark/metadata.json`
- `results/main_benchmark/metrics_by_seed.csv`
- `results/main_benchmark/aggregate_metrics.csv`
- `results/main_benchmark/predictions.jsonl`
- `results/main_benchmark/embeddings_seed*.npz`
- `results/main_benchmark/paper_table.md`
- `results/main_benchmark/ablation_table.md`
- `results/main_benchmark/report.html`
- `query_sets/*`
- `data/HETIONET_SOURCE.md`
- `data/HETIONET_ATTRIBUTION.md`

After the benchmark finishes, use `main_query_demo.py` and `evaluate_evidence.py` to inspect saved retrieval/evidence packets.

## Scientific status

The official Hetionet v1.0 archive was checksum-verified and the full real-data five-seed run completed in this environment. The saved artifacts in `results/main_benchmark/` are fresh outputs from that run. The held-out 3-hop MRR is 0.009 for Euclidean and 0.011 for Poincare, but the five-seed confidence intervals overlap; the work therefore makes no conclusive geometry-superiority claim. The separate typed-path-verification configuration achieved 3-hop Recall@5 of 0.110.

## Start the local result tester

The tester replays saved benchmark predictions. It does not retrain a model when you click a control.

```powershell
cd <repository-root>
python research/scripts/live_benchmark_app.py --port 8770
```

Then open `http://127.0.0.1:8770/`. Choose a hop, seed, method, query index, and Top K, then select **Run retrieval**. See `SUPERVISOR_DEMO_SCRIPT.md` for a plain-language explanation and presentation script.
