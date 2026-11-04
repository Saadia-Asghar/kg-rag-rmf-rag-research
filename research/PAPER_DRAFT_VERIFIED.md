> **Superseded (November 2026).** The current manuscript is `research/paper/manuscript.md` (built to `research/paper/RMF-RAG_manuscript.docx` / `.pdf` by `research/paper/build_manuscript.py`). Results below this note predate the corrected mini-batch training and are kept only for history.

# Paper draft, verified-claim version

## Working title

**When Does Hyperbolic Geometry Help Biomedical Knowledge-Graph Retrieval? A Controlled RMF-RAG Evaluation**

## Abstract

Knowledge graphs encode relational structures that can be difficult to represent in flat embedding spaces, motivating the use of hyperbolic geometry for hierarchical and multi-hop retrieval. This work develops RMF-RAG, a controlled biomedical knowledge-graph retrieval framework for comparing Euclidean and Poincare representations under matched training conditions. A reproducible disease-drug pilot establishes the evaluation workflow but does not show hyperbolic superiority: across five historical seeds, all-held-out Recall@5 is 4.62% for a lexical baseline, 2.20% for the Euclidean prototype, and 2.64% for the original hyperbolic prototype. Because those learned models used unequal training budgets, we implement a new PyTorch comparison with matched negatives, dimensionality, epochs, candidate pools, and seeds, and replace finite-difference Poincare optimization with autograd-based Riemannian updates. We further restore a leakage-controlled Hetionet v1.0 benchmark for typed Gene-Disease-Compound 2-hop and 3-hop retrieval, including five-seed evaluation, confidence intervals, per-query predictions, typed-path verification, and component ablations. The benchmark implementation is test-validated, while final real-data results must be regenerated before any historical Hetionet values are used as headline evidence. The study is designed to support either a positive or negative conclusion about hyperbolic retrieval rather than presupposing an advantage.

Fresh-results addendum: the official-Hetionet five-seed run described in this manuscript has now completed. Its held-out test MRR is 0.009 for both Euclidean and Poincare 2-hop retrieval, and 0.009 versus 0.011 for Euclidean versus Poincare 3-hop retrieval. Because the corresponding five-seed 95% t intervals overlap, the manuscript makes no conclusive geometry-superiority claim.

## 1. Introduction

Retrieval-augmented generation and knowledge-graph retrieval systems increasingly rely on dense representations to identify relevant entities and paths. Biomedical graphs pose a demanding setting because they contain heterogeneous entity types, multi-hop relations, high-degree hubs, and potentially hierarchical structure. Euclidean embedding spaces are simple and effective, but they can require increasing dimensionality to represent tree-like growth with low distortion. Hyperbolic spaces, particularly the Poincare ball, provide exponentially expanding volume and are therefore a natural candidate for representing hierarchical graph neighborhoods.

This work asks a narrower empirical question than a general claim that curved geometry is better: **under matched experimental conditions, when does Poincare geometry improve biomedical multi-hop retrieval relative to Euclidean geometry?** This framing matters because geometry changes can be confounded by different optimizers, training budgets, negative samples, candidate pools, or leakage from held-out answer edges.

The project contributes a controlled Euclidean/Poincare implementation, explicit leakage controls, a reproducible five-seed evaluation design, typed multi-hop benchmark construction, and ablations that separate geometry from path constraints and other retrieval components. The framework also keeps graph connectivity separate from literature evidence and clinical utility.

## 2. Verified pilot evidence

The currently reproduced pilot is built from disease-drug question-answer records. Its graph is constructed from disease nodes, shared disease-name token nodes, and drug nodes. One drug association is held out for eligible diseases and retrieval models rank candidate drugs.

The historical five-seed audit uses seeds 7, 17, 29, 43, and 101. On all held-out links, the lexical baseline achieves mean Recall@5 of 4.62% and MRR of 0.02412. The original Euclidean prototype achieves Recall@5 of 2.20% and MRR of 0.01962. The original hyperbolic prototype achieves Recall@5 of 2.64% and MRR of 0.02064. On the recoverable subset, Recall@5 is 43.37% lexical, 12.71% Euclidean, and 19.08% hyperbolic.

These results are preliminary. The historical Euclidean and hyperbolic trainers use unequal budgets, and the pilot topology is based on lexical tokens rather than curated biological relations. The results therefore motivate a controlled experiment but do not establish that hyperbolic geometry is superior.

## 3. Controlled geometry implementation

The controlled implementation uses PyTorch for both learned retrievers. Each node receives a trainable embedding of the same dimension. For Euclidean retrieval, distance is the L2 norm. For the Poincare model with curvature parameter c, embeddings are constrained to the open ball and candidates are ranked by geodesic distance.

Both models use the same positive edges, deterministic type-matched negative samples, margin objective, embedding dimension, epoch count, learning rate schedule, candidate pool, and random seeds. The Poincare implementation uses automatic differentiation, converts Euclidean gradients to Riemannian gradients using the conformal factor of the ball, and projects updated embeddings into the valid manifold. This removes the finite-difference approximation used by the earlier prototype and makes the geometry comparison substantially better controlled.

## 4. Full biomedical benchmark design

The restored benchmark runner targets Hetionet v1.0. It retains relations with explicit reusable provenance corresponding to the research design: DISEASES Gene-Disease `associates` edges under CC BY 4.0, PharmacotherapyDB Disease-Compound `treats`/`palliates` edges under CC0 1.0, and DrugCentral Gene-Compound `binds` edges under CC BY 4.0. The runner checks the frozen expected counts of 3,200, 1,145, and 823 edges respectively and stops on unexpected drift by default.

Two typed tasks are created. The 2-hop task is Gene -> Disease -> Compound. The 3-hop task is Gene -> Disease -> Gene -> Compound. Terminal Disease-Compound and Gene-Compound answer edges are split before training. Validation and test answer edges are removed from the graph used to train the embeddings and from typed-path verification, preventing direct terminal-edge leakage.

For every seed, the runner writes the exact query sets to JSONL. It trains matched Euclidean and Poincare embeddings and evaluates lexical, Euclidean, Poincare, and typed-path-constrained variants. It saves per-query predictions and reports Recall@1, Recall@5, Recall@10, mean reciprocal rank, and top-1 typed-path verification rate. Aggregate results use two-sided 95% t intervals across five seeds.

## 5. Ablations

The benchmark includes ablations for geodesic versus chord-style ranking, hop weighting, tangent-space composition used for multi-hop context, and explicit typed-path verification/reranking. Additional components should not be claimed as part of RMF-RAG unless they have executable code and a corresponding ablation. Hyperparameters must be selected using training/validation data rather than test results.

## 6. Fresh Hetionet reproduction results

The official Hetionet v1.0 Zenodo archive was checksum-verified against its published MD5 before extraction. The compressed JSON snapshot used by this run has SHA-256 `a342ab57e9073e6c02bb5e109d1f16917e6f933be4e5c77ebbaebfa26b984c19`. The run completed all five fixed seeds (7, 17, 29, 43, and 101), generated 500 frozen queries per hop/split/seed, and passed the frozen relation-count checks: 3,200 Gene-Disease, 1,145 Disease-Compound, and 823 Gene-Compound edges.

On the held-out 2-hop task, Euclidean Recall@5 is 0.007 [0.002, 0.012] and MRR is 0.009 [0.006, 0.013]; Poincare Recall@5 is 0.004 [0.000, 0.007] and MRR is 0.009 [0.007, 0.011]. On 3-hop, Euclidean Recall@5 is 0.006 [-0.005, 0.016] and MRR is 0.009 [0.003, 0.015]; Poincare Recall@5 is 0.008 [-0.002, 0.017] and MRR is 0.011 [0.004, 0.018]. The Poincare intervals overlap the Euclidean intervals, so the results are calibrated descriptive evidence rather than a significance claim. Path-verification reranking substantially improves 3-hop Recall@5 to 0.110 [0.031, 0.190], but it is a separate constrained ranking configuration rather than a pure geometry effect.

The frozen query sets, per-query predictions, embeddings, seed metrics, aggregate confidence intervals, tables, and generated figure/report are retained under `research/query_sets/` and `research/results/main_benchmark/`.

## 7. Reproducibility status

The controlled geometry code and full benchmark runner are present and test-validated. The test suite verifies Poincare-distance behavior, optimization, ball projection, candidate ranking, relation filtering, train/validation/test split disjointness, held-out terminal-edge removal, typed query construction, benchmark ranking modes, and matched-training smoke behavior.

The full Hetionet v1.0 real-data rerun completed from the official archive in this environment. The results in Section 6 are generated from that run, not from the repository's historical artifacts.

## 8. Evidence and RAG scope

Graph retrieval is not equivalent to evidence-grounded generation or clinical validation. The existing evidence layer associates selected candidate compounds with frozen literature records and explicitly distinguishes direct, context-only, species-limited/preclinical, and no-record cases. A graph path or a relevant article must not be converted into an unsupported treatment recommendation.

If an LLM generation stage is evaluated, its model version, prompt, temperature, and evidence formatting should be frozen. Retrieval accuracy, path validity, citation correctness, and answer groundedness should be evaluated separately.

## 9. Limitations

The pilot uses lexical token structure rather than a curated biomedical KG. Five seeds on one dataset quantify seed sensitivity but not external validity across independent biomedical graphs. The restored benchmark uses a deliberately restricted relation subset to preserve explicit provenance and licensing, which reduces coverage compared with the entire Hetionet network. The 3-hop `binds` endpoint measures molecular connectivity and must not be interpreted as a treatment recommendation. The final benchmark has not yet been rerun on the real snapshot in this environment, so historical Hetionet numbers are not treated as current evidence.

## 10. Conclusion

The research is structured to produce a calibrated result rather than a predetermined victory claim. The verified pilot shows only a small difference between the original Euclidean and hyperbolic prototypes and is confounded by unequal budgets. The revised implementation removes that confound and restores a complete leakage-controlled multi-hop benchmark protocol. The next empirical step is a clean five-seed Hetionet v1.0 rerun. Only those regenerated outputs should determine whether Poincare geometry improves 2-hop or 3-hop retrieval and which RMF-RAG components survive ablation.

## References to verify for the final venue

- Nickel, M. and Kiela, D. *Poincare Embeddings for Learning Hierarchical Representations*. NeurIPS, 2017.
- Himmelstein, D. S. et al. *Systematic integration of biomedical knowledge prioritizes drugs for repurposing*. eLife, 2017.
- Add the exact KG-RAG, GraphRAG, D-RAG, biomedical KGQA, and RAG-evaluation papers used by the final method only after checking the original publications and matching each manuscript claim to a source.
