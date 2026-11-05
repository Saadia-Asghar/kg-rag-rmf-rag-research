# Claim–evidence ledger for the IEEE manuscript

This file lists every factual statement in `ieee_paper.md` and the evidence that supports it. All
numbers in the text are recomputed from result files by `research/paper/check_claims.py`; all
methodological statements point to code and to automated tests; all literature statements point to
the original source, checked against the publisher, arXiv, proceedings or DOI record in November 2026.

Run the checks:

```bash
python research/paper/check_claims.py research/paper/ieee_paper.md research/paper/manuscript.md
python -m pytest -q research/tests        # 37 tests; set HETIONET_JSON_BZ2 to include the 15 real-data tests
```

## A. Data

| Statement in the paper | Evidence |
|---|---|
| Official Hetionet v1.0 snapshot; release archive matches the MD5 published on Zenodo | Zenodo record 268568 lists MD5 `acce866650fc8bc27ac274b7dddf003e`; `md5sum hetionet-v1.0.0.zip` gives the same value. |
| SHA-256 of the extracted file is recorded with every run | `research/results/*/metadata.json`, field `snapshot_sha256` = `a342ab57…984c19`; equals `sha256sum` of the snapshot. |
| Only edges whose licence in Hetionet's metadata permits reuse: DISEASES associates (CC BY 4.0; 3,200), PharmacotherapyDB treats/palliates (CC0; 1,145), DrugCentral binds (CC BY 4.0; 823) | `run_main_rmf_rag_benchmark.py`: `selected_edges`, `_license_ok`, `validate_relation_counts` (halts on drift); `research/data/HETIONET_ATTRIBUTION.md`; tests `test_license_filter_and_relation_orientation`, real-data fixture in `test_real_data_leakage.py`. |
| 3,039 nodes: 2,240 genes, 133 diseases, 666 compounds | `research/results/main_benchmark/node_index_seed7.json` (counts by `kind`). |
| Hetionet integrates 29 resources, 47,031 nodes, 2,250,197 relationships | Himmelstein et al., eLife 2017 [4]; Hetionet GitHub README. |
| Pilot: 1,000 disease–drug question–answer pairs from a public Kaggle dataset [27] | `research/data/disease_drug_kaggle.json` (1,000 records); provenance in `research/data/SOURCE.md` (Kaggle user `erolatik`, downloaded 2026-09-01). The paper does not state the dataset's licence. |

## B. Method

| Statement | Evidence |
|---|---|
| Validation and test answer edges removed before training and path verification; Gene–Disease edges are context only | `split_edges`, `build_graph(removed_dc, removed_cg)`, `verified_compounds` (uses the training graph only); synthetic test in `test_main_benchmark_runner.py` and `test_no_held_out_answer_edge_reaches_training` (real data, all 10 seeds). |
| Queries capped at 500 per task, split and seed; frozen to JSONL | `QUERY_CAP = 500`, `write_query_sets`; `test_frozen_query_files_match_regeneration` asserts equality with regeneration and length 500. |
| Euclidean SGD; Poincaré geodesic distance, Riemannian gradient rescaling ((1 − c‖x‖²)/2)², projection into the ball | `research/models/controlled_retrievers.py` (`PoincareRetriever.distance`, `PoincareRSGD.step`, `project`); `test_controlled_retrievers.py`. |
| Both geometries receive identical triplets in identical mini-batch order (batch 256) | Both training loops call `_epoch_triplets(graph, seed, epoch)` (deterministic per seed and epoch) and slice batches of `BATCH_SIZE = 256`; `test_train_one_is_deterministic_and_stays_in_ball`. |
| Curvature-c models evaluated by rescaling vectors by √c | `test_curvature_rescaling_preserves_distances_and_composition`. |
| Hop weights (0.5, 1) and (1/3, 1/2, 1); tangent-space composition | `_hop_weights`, `_compose_query_vector`. |
| HHR@1, Unsupported@10 and path verification as defined | `run_hallucination_geometry_sweep.evaluate`, `run_baseline_comparison.evaluate`; tests `test_hop_hallucination_metrics_and_path_verification`, `test_filtered_ranking_and_hallucination_metrics` (hand-checked values). |
| Filtered ranking removes other known true answers of the final hop (any split) | `run_baseline_comparison.evaluate`; `test_filtered_ranking_and_hallucination_metrics`. |
| TransE-style and MuRP-style baselines (no MuRP entity biases, shared margin loss), final-hop scoring | `research/models/relational_retrievers.py`; `run_baseline_comparison.distance_function`; `test_relational_retrievers.py`. |
| Learning rates selected on seed-7 validation MRR only | Tuning phases evaluate only `*_validation` splits; selections in each `metadata.json` and `tuning.csv`. |
| Pre-registration saved before any sweep model was trained | The sweep's `main()` writes `preregistration.json` before creating the worker pool; `written_at 2026-11-04T12:25:48`; `test_saved_preregistration_matches_script_settings`. |
| Paired two-sided t-tests, Holm–Bonferroni, exact sign tests, 95% t-intervals | `run_hallucination_geometry_sweep.py` (`t_two_sided_p`, `paired_test`, `holm`); tests check reference t-table values and a Holm example. |

## C. Numerical results

Every number quoted in the text is recomputed from these files by `check_claims.py` (all pass):
`research/results/main_benchmark/` (main benchmark), `research/results/hallucination_sweep/`
(pre-registered sweep), `research/results/baselines/` (relation-aware baselines) and
`research/results/controlled_geometry/` (pilot). Tables are generated from the same files by
`build_ieee_paper.py`, so no table value is typed by hand.

Reproducibility: all four experiments were re-run from scratch and reproduced every metric exactly
(only wall-clock timing columns and timestamps differ).

## D. Historical numbers (optimisation confounds)

| Statement | Evidence (git commit `8b62205`) |
|---|---|
| Pilot with Adam (Euclidean) vs full-batch RSGD (Poincaré): MRR 0.107 vs 0.020 | `research/results/controlled_geometry/aggregate_metrics.json`; optimiser lines in `research/scripts/run_controlled_geometry_experiment.py` at that commit. |
| Under-trained run: 24 full-batch steps, loss 0.4495 → 0.4486, chance-level accuracy | `research/results/main_benchmark/training_history.json` and `aggregate_metrics.csv` (3-hop MRR 0.009 / 0.011) at that commit. |
| Single-seed validation advantage of about 30% that did not replicate | Current `research/results/main_benchmark/metadata.json`, `learning_rate_selection` (0.0675 vs 0.0515). |
| Matched pilot: MRR 0.074 vs 0.059 | Current `research/results/controlled_geometry/aggregate_metrics.json`. |

## E. Literature (each checked against the original source)

| Ref | What the paper attributes to it | Verified against |
|---|---|---|
| [1] Lewis et al., NeurIPS 2020, pp. 9459–9474 | RAG grounds output in retrieved knowledge and generates more specific and factual text than a parametric-only model | arXiv 2005.11401 abstract; NeurIPS proceedings metadata |
| [2] Edge et al., arXiv:2404.16130 | GraphRAG summarises entity graphs for query-focused summarisation | arXiv abstract page |
| [3] Soman et al., Bioinformatics 40(9) btae560, 2024 | Biomedical KG-RAG retrieves context from a curated KG (SPOKE) to improve LLM answers | PMC / ADS records |
| [4] Himmelstein et al., eLife 6:e26726, 2017 | Hetionet: 29 resources, 47,031 nodes, 2,250,197 relationships; drug repurposing | eLife article |
| [5] Nickel & Kiela, NeurIPS 2017, pp. 6338–6347 | Poincaré embeddings outperform Euclidean ones on hierarchical data; Riemannian SGD | arXiv 1705.08039 abstract; NeurIPS metadata |
| [6] Krioukov et al., Phys. Rev. E 82, 036106, 2010 | Latent hyperbolic geometry of complex networks | arXiv 1006.5169; ADS record |
| [7] Sarkar, Graph Drawing (GD 2011) | Low-distortion embedding of trees in the hyperbolic plane | Edinburgh Research Explorer record (page numbers omitted: not verified) |
| [8] Ganea et al., NeurIPS 2018, pp. 5345–5355 | Hyperbolic networks match or outperform Euclidean variants on several tasks | arXiv 1805.09112 abstract; NeurIPS metadata |
| [9] Balažević et al., NeurIPS 2019, pp. 4463–4473 | MuRP outperforms its Euclidean counterpart, particularly at lower dimensionality | arXiv 1905.09791 abstract; NeurIPS metadata |
| [10] Chami et al., ACL 2020, pp. 6901–6914 | AttH improves over Euclidean and hyperbolic baselines in low dimensions | arXiv 2005.00545 abstract; Crossref DOI 10.18653/v1/2020.acl-main.617 |
| [11] Bonnabel, IEEE TAC 58(9):2217–2229, 2013 | Stochastic gradient descent on Riemannian manifolds | arXiv 1111.5280; DOI 10.1109/TAC.2013.2254619 |
| [12] Bordes et al., NeurIPS 2013, pp. 2787–2795 | TransE; the filtered ranking protocol | NeurIPS proceedings; later papers describing the filtered protocol of Bordes et al. |
| [13] Hamilton et al., NeurIPS 2018, pp. 2026–2037 | GQE composes embeddings for logical queries | NeurIPS metadata |
| [14] Ren et al., ICLR 2020 | Query2box | Stanford SAIL ICLR 2020 list |
| [15] Ali et al., IEEE TPAMI 44(12):8825–8845, 2022 | Training configuration strongly affects KG-embedding results | Crossref DOI 10.1109/tpami.2021.3124805 |
| [16] Ruffinelli et al., ICLR 2020 | With appropriate training, differences between KG-embedding architectures shrink or reverse | ICLR 2020 poster page; OpenReview BkxSmlBFvr |
| [17] Bonner et al., Brief. Bioinform. 23(6) bbac404, 2022 | Review of public datasets for drug-discovery KGs (no licensing claim attributed) | arXiv 2102.10062 abstract; DOI 10.1093/bib/bbac404 |
| [18] Himmelstein, Zenodo, doi 10.5281/zenodo.268568 | The data release used | Zenodo record (title, single creator, DOI, MD5) |
| [19] Bouthillier et al., MLSys 3, 2021 | Variance in ML benchmarks | MLSys proceedings page (page numbers omitted: not verified) |
| [20] Gu et al., ICLR 2019 | Mixed-curvature product spaces | DBLP record |
| [21] Cao et al., arXiv:2511.18808 | HyperbolicRAG; better than RAG and graph-RAG baselines; hallucination cited as motivation | arXiv abstract |
| [22] Madhu et al., arXiv:2602.07739 | HypRAG; hyperbolic dense retrieval; hallucination cited as motivation | arXiv abstract |
| [23] Zhou et al., ACL 2026, pp. 21601–21614 | HyperRAG; query-aware hyperbolic retrieval outperforming baselines (no hallucination claim attributed) | ACL Anthology record |
| [24] Dziri et al., EMNLP 2021 | Hallucination as claims unsupported by KG paths (path grounding) | arXiv 2104.08455 |
| [25] Luo et al., ICLR 2024 | RoG: faithful reasoning grounded in KG relation paths | arXiv 2310.01061 |
| [26] Luo et al., ICML 2025 | GCR: reasoning constrained to paths that exist in the KG | arXiv 2410.13080 |
| [27] erolatik, Kaggle disease-drug-dataset | Source of the pilot data | Kaggle dataset page; `research/data/SOURCE.md` |

Novelty statement ("to our knowledge, none measures unsupported multi-hop answers against a
Euclidean counterpart trained under matched conditions"): based on searches of arXiv, the ACL
Anthology and general web search in November 2026 for hyperbolic RAG, path-grounded hallucination
and KG faithfulness; the closest work ([21]–[26]) is cited and the differences are stated.

## F. What the paper does not claim

- No claim about hallucination in LLM-generated text, clinical correctness or therapeutic value.
- No claim that hyperbolic geometry improves accuracy (no significant positive accuracy difference was found).
- No claim beyond this licence-filtered Hetionet subset; no AttH, learnable-curvature or generation experiments.
- The relational-baseline comparison is labelled as secondary (added after the pre-registration) and
  does not separate relation-specific transforms from final-hop scoring.
