# Full RMF-RAG completion checklist

## Controlled pilot

- [x] Replace finite-difference hyperbolic training with PyTorch autograd.
- [x] Add Riemannian gradient scaling and Poincare-ball projection.
- [x] Match negative samples across Euclidean and Poincare models.
- [x] Match dimension, margin, epochs, candidate pool, and seeds.
- [x] Add unit tests for geometry, optimization, projection, and ranking.
- [ ] Run the controlled script on the complete repository pilot dataset in the target checkout.
- [ ] Commit generated controlled metrics/predictions.

## Full biomedical multi-hop benchmark implementation

- [x] Freeze the benchmark definition to Hetionet v1.0.
- [x] Add snapshot source, version, checksum computation, license filtering, and provenance outputs.
- [x] Define exact 2-hop and 3-hop typed tasks.
- [x] Add deterministic train/validation/test query generation.
- [x] Remove validation/test terminal answer edges before training.
- [x] Add expected relation-count drift checks.
- [x] Implement identifier-based lexical baseline.
- [x] Implement matched Euclidean baseline.
- [x] Implement matched Poincare model with Riemannian updates.
- [x] Implement typed-path verification/reranking.
- [x] Add five-seed evaluation loop.
- [x] Save every per-query prediction.
- [x] Report Recall@1/5/10, MRR, and path verification.
- [x] Add 95% t intervals across seeds.
- [x] Add geodesic, hop-weighting, tangent-composition, and path-verification ablations.
- [x] Add synthetic tests for relation filtering, splits, leakage, query construction, ranking modes, and training.

## Full biomedical multi-hop benchmark execution

- [ ] Place/download the Hetionet v1.0 snapshot in the clean target checkout.
- [ ] Complete all five real-data seeds without relation-count or leakage failures.
- [ ] Inspect query counts and every seed for anomalies.
- [ ] Commit regenerated query sets, metadata, aggregate metrics, and paper tables as appropriate.
- [ ] Replace historical Hetionet values in the manuscript with regenerated values only.
- [ ] Re-run the saved query demos and evidence validator against the fresh model artifacts.

## RAG/evidence layer

- [x] Existing repository includes stable literature identifiers and a frozen evidence manifest/calibration set.
- [ ] Revalidate the evidence packets against the freshly regenerated benchmark rankings.
- [ ] Evaluate citation correctness independently of retrieval accuracy if generation is added.
- [ ] Evaluate answer groundedness if an LLM generator is added.
- [ ] Freeze generator model/version/prompt/temperature for any end-to-end evaluation.
- [x] Keep graph connectivity separate from therapeutic/clinical utility claims.

## Paper-completion gate

- [ ] Final result tables generated directly from the fresh benchmark metrics.
- [ ] Figures generated from saved data rather than manually typed values.
- [ ] Literature claims checked against original publications.
- [x] Methods draft now matches the implemented benchmark design.
- [x] Limitations explicitly separate pilot, benchmark reproduction, evidence, and clinical scope.
- [ ] A clean checkout reproduces the headline table end to end.

The **implementation** is complete and test-validated. The **empirical benchmark** is complete only after the five-seed real-data Hetionet run finishes and regenerates its outputs. The **research paper** is complete only after those fresh results and verified references replace historical placeholders.
