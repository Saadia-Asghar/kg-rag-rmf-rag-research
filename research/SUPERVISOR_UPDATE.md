# Supervisor update guide

## What to tell Sir now

The full five-seed Hetionet v1.0 reproduction is complete. The official release was checksum-verified, all frozen relation-count and leakage controls passed, and the run generated query sets, embeddings, predictions, aggregate confidence intervals, tables, an SVG figure, and an HTML report. The 10 automated tests pass. The measured result is calibrated: Poincare is numerically higher on 3-hop MRR (0.011 versus 0.009) but the five-seed confidence intervals overlap, so the work does not claim a conclusive geometry advantage. Explicit path verification has the largest 3-hop effect (Recall@5 0.110 [0.031, 0.190]).

I have completed the controlled retriever implementation and restored the full multi-hop benchmark pipeline. The older disease-drug pilot is reproducible, but its Euclidean and hyperbolic models used unequal training budgets, so I am not using it to claim superiority. The new PyTorch implementation gives both geometries the same training inputs, negatives, dimensions, epochs, candidate pool, and seeds, with proper Riemannian updates for the Poincare model.

I also restored the missing Hetionet runner. It now constructs leakage-controlled Gene -> Disease -> Compound and Gene -> Disease -> Gene -> Compound tasks, filters the documented reusable relation subset, freezes query sets, runs five seeds, saves predictions and embeddings, computes confidence intervals, and runs the main ablations. The complete pipeline passes synthetic Hetionet-shaped tests. The remaining empirical milestone is to run the restored pipeline on the full Hetionet v1.0 snapshot and regenerate the final tables from scratch.

## Evidence to show Sir

1. `local-run/extended/summary.md` for the verified older five-seed pilot.
2. `research/models/controlled_retrievers.py` for the corrected geometry implementation.
3. `research/scripts/run_main_rmf_rag_benchmark.py` for the complete multi-hop protocol.
4. `research/tests/test_controlled_retrievers.py` and `research/tests/test_main_benchmark_runner.py` for geometry, leakage, split, query, and ranking checks.
5. `research/REPRODUCIBILITY_STATUS.md` for the boundary between code completion and real-data reproduction.

## What not to say yet

Do not say the historical Hetionet numbers have been freshly reproduced. Do not say RMF-RAG statistically beats Euclidean KG-RAG. Do not claim clinical validation or therapeutic efficacy. The correct claim is that the implementation and benchmark protocol are complete and test-validated, while the final full-data rerun remains the last empirical gate.

## When to say the model is complete

Say the **implementation is complete** now, because the controlled retrievers, full benchmark runner, leakage controls, baselines, metrics, ablations, provenance outputs, and tests are present.

Say the **experimental model evaluation is complete** after a clean five-seed Hetionet run regenerates `aggregate_metrics.csv`, `predictions.jsonl`, embeddings, query sets, and paper tables.

Say the **research paper is complete** only after the fresh benchmark results replace historical values in the manuscript, references are checked, figures/tables are generated from saved results, and evidence/groundedness limitations are finalized.

## Useful questions for Sir

- Should the contribution be framed around controlled hyperbolic retrieval, around identifying when hierarchy helps, or around a calibrated negative result if the fresh run shows no consistent gain?
- Is Hetionet sufficient for the target venue, or should the final paper add a second biomedical KG for external validity?
- Which external KG-RAG/KGQA baseline is essential before submission?
- Should the generation/evidence-grounding stage be in this paper or explicitly separated as follow-up work?
