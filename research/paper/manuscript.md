# Does Hyperbolic Geometry Help Biomedical Multi-Hop Knowledge-Graph Retrieval? A Controlled, Leakage-Aware Evaluation on Hetionet

^Saadia Asghar
^[Department, University — to be completed]
^Supervisor: [Name — to be completed]
^Draft manuscript, November 2026

## Abstract

Hyperbolic embeddings are frequently proposed for knowledge-graph (KG) retrieval because negatively curved space can represent hierarchical structure with low distortion. Reported gains, however, are often confounded by differences in optimiser, training budget, negative sampling or answer leakage between the compared models. We present RMF-RAG, a controlled framework for comparing Euclidean and Poincaré-ball retrievers for typed multi-hop retrieval in a biomedical KG. Both geometries share the same graph, triplets, mini-batch order, negative samples, embedding dimension, margin, epoch budget and candidate pool; the Poincaré model is trained with Riemannian stochastic gradient descent and ball projection, and the learning rate is selected per geometry on validation data only. We evaluate on a provenance-filtered subset of Hetionet v1.0 (3,200 Gene–Disease, 1,145 Disease–Compound and 823 Gene–Compound edges) with two tasks: 2-hop Gene→Disease→Compound and 3-hop Gene→Disease→Gene→Compound retrieval, removing all validation and test answer edges before training. Across five seeds and 500 test queries per task and seed, both learned geometries are far above random ranking on the 3-hop task (test MRR 0.095 Euclidean and 0.091 Poincaré versus 0.011 for random ranking; Recall@10 0.221 and 0.242 versus 0.015), but only marginally above random on the 2-hop task (MRR 0.017 and 0.019). Paired per-seed differences between Poincaré and Euclidean retrieval are small and their 95% confidence intervals include zero for every task and metric. Ablations show that hop-weighted query composition matters (3-hop MRR drops from 0.091 to 0.070 without it), whereas geodesic ranking and tangent-space composition have no measurable effect because the learned Poincaré embeddings remain close to the origin (maximum norm ≈ 0.29), where the ball is nearly Euclidean. We also show that an earlier configuration of the same benchmark was severely under-trained and produced chance-level results for both geometries, and that an earlier pilot advantage for Euclidean retrieval disappeared once the optimisers were matched. Under matched, leakage-controlled conditions we therefore find no evidence that hyperbolic geometry improves biomedical multi-hop retrieval at this scale, and we argue that optimisation confounds deserve as much attention as geometry in such comparisons.

**Keywords:** knowledge graphs; retrieval-augmented generation; hyperbolic embeddings; Poincaré ball; biomedical retrieval; multi-hop reasoning; reproducibility

## 1. Introduction

Retrieval-augmented generation (RAG) grounds the output of language models in retrieved external knowledge [1]. When that knowledge is a graph rather than a text corpus, retrieval must identify entities and relational paths, which has motivated graph-based RAG systems [2] and biomedical KG-augmented prompting [3]. Biomedical KGs are a demanding setting: they combine heterogeneous entity types, high-degree hub nodes, multi-hop mechanistic paths such as gene–disease–drug chains, and partly hierarchical organisation [4, 17].

Hyperbolic geometry is an attractive candidate representation for such graphs. The volume of a hyperbolic ball grows exponentially with its radius, so trees and other hierarchies can be embedded with arbitrarily low distortion in two dimensions [7], and many real networks exhibit latent hyperbolic structure [6]. Poincaré embeddings [5], hyperbolic neural networks [8] and hyperbolic multi-relational KG embeddings [9, 10] have reported improvements over Euclidean counterparts, particularly at low dimension.

Comparisons between geometries are, however, easy to confound. Changing the geometry usually also changes the optimiser (Riemannian versus Euclidean updates), the effective learning rate, the training budget, or the negative-sampling scheme. KG-embedding benchmarks are known to be highly sensitive to such training choices [15, 16], and conclusions drawn from a single seed can be dominated by run-to-run variance [19]. Multi-hop retrieval adds a further risk: if the edge that answers a held-out query remains in the training graph, a retriever can succeed by memorisation rather than inference.

This paper therefore asks a deliberately narrow question: **under matched and leakage-controlled conditions, does Poincaré geometry improve biomedical multi-hop retrieval relative to Euclidean geometry?** Our contributions are:

- A controlled implementation of matched Euclidean and Poincaré retrievers in which both geometries see identical triplets, mini-batches, negatives, dimension, margin and epochs, with learning rates selected per geometry on validation data only.
- A leakage-controlled, provenance-filtered Hetionet v1.0 benchmark for typed 2-hop and 3-hop retrieval, with frozen query sets, five seeds, per-query predictions and confidence intervals.
- Component ablations that separate geodesic ranking, hop-weighted query composition, tangent-space composition and explicit typed-path verification.
- A calibrated empirical answer: both geometries learn useful 3-hop retrieval, but we find no reliable difference between them, and we document two optimisation confounds that would otherwise have produced misleading conclusions.

## 2. Related work

**Retrieval-augmented generation and graph retrieval.** RAG couples a parametric generator with non-parametric retrieval [1]. GraphRAG builds and summarises entity graphs to support query-focused summarisation [2], and KG-RAG for biomedicine retrieves context from a curated biomedical KG to improve LLM answers [3]. Our work concerns the retrieval component only: we evaluate whether the geometry of the embedding space used to rank KG candidates affects retrieval quality, and we keep generation, citation correctness and clinical validity out of scope.

**Knowledge-graph embeddings and multi-hop queries.** Translational models such as TransE [12] embed entities and relations so that true triples are close. Query-embedding methods such as GQE [13] and Query2box [14] compose embeddings along relational paths to answer multi-hop queries. Large-scale re-evaluations have shown that training configuration often matters as much as model architecture [15, 16], which motivates our emphasis on matched training.

**Hyperbolic representations.** Krioukov et al. [6] argued that complex networks have latent hyperbolic geometry; Sarkar [7] showed that trees embed with low distortion in the hyperbolic plane. Nickel and Kiela [5] introduced Poincaré embeddings trained with Riemannian SGD [11], and subsequent work extended hyperbolic representations to neural networks [8], multi-relational KGs (MuRP) [9], attention-based KG embeddings (AttH) [10] and mixed-curvature product spaces [20]. These studies typically report the largest hyperbolic gains at very low dimension and on strongly hierarchical data; our benchmark tests whether such gains appear in a matched, typed biomedical retrieval setting.

**Biomedical KGs.** Hetionet integrates 29 public resources into a heterogeneous network of 47,031 nodes and 2,250,197 relationships and was used to prioritise drugs for repurposing [4, 18]. Bonner et al. [17] review biomedical KGs for drug discovery and highlight licensing and provenance issues that motivate our relation filtering.

## 3. Methods

### 3.1 Data and relation filtering

We use the official Hetionet v1.0 JSON snapshot [18]. The Zenodo archive was verified against its published MD5 checksum, and the SHA-256 of the extracted `hetionet-v1.0.json.bz2` (`a342ab57…984c19`) is recorded in the run metadata. To keep every training relation traceable to an explicitly reusable source, we retain only three relation types: Gene–Disease `associates` edges from DISEASES (CC BY 4.0; 3,200 edges), Disease–Compound `treats` and `palliates` edges from PharmacotherapyDB (CC0 1.0; 755 and 390 edges, 1,145 in total), and Gene–Compound `binds` edges from DrugCentral (CC BY 4.0; 823 edges). The runner checks these frozen counts and halts on any drift. The resulting graph contains 3,039 nodes: 2,240 genes, 133 diseases and 666 compounds.

### 3.2 Tasks, splits and leakage control

We define two typed retrieval tasks in which the system must rank all 666 compounds:

- **2-hop:** given a gene *g* and a disease *d* with (*g*, associates, *d*), retrieve the compound *c* with (*d*, treats/palliates, *c*).
- **3-hop:** given a gene *g*, a disease *d* and a bridge gene *g′* such that (*g*, associates, *d*) and (*g′*, associates, *d*), retrieve the compound *c* with (*g′*, binds, *c*).

Terminal answer edges are split deterministically per seed. Disease–Compound edges are split within each disease (15% validation, 15% test, remainder training, for diseases with at least three compounds); Gene–Compound edges are split globally (10% validation, 10% test). **All validation and test terminal edges are removed from the training graph** before embedding training and before typed-path verification, so no held-out answer edge is visible to any method. Queries are enumerated from the held-out edges and capped at 500 per task, split and seed by seeded sampling. The resulting query sets are frozen to JSONL files.

### 3.3 Retrievers

Every node receives a trainable 16-dimensional embedding initialised from N(0, 0.01²).

**Euclidean retriever.** Distance is the L2 norm, and parameters are updated by mini-batch SGD.

**Poincaré retriever.** Embeddings lie in the open unit ball (curvature *c* = 1) and the distance is the geodesic distance d(x, y) = arcosh(1 + 2‖x − y‖² / ((1 − ‖x‖²)(1 − ‖y‖²))). Gradients are computed with PyTorch autograd and converted to Riemannian gradients by the inverse squared conformal factor, ((1 − ‖x‖²)/2)², following Riemannian SGD [5, 11]. After each update, embeddings are projected back inside the ball (maximum norm 1 − 10⁻⁵).

**Training objective.** Both models minimise the margin loss max(0, γ + d(a, p) − d(a, n)) with γ = 0.45 over every directed training edge (*a*, *p*). Each positive is paired with one type-matched negative *n* that is not a neighbour of the anchor, sampled deterministically from the seed and epoch. **Both geometries receive exactly the same triplets in the same mini-batch order** (batch size 256, 60 epochs).

**Learning-rate selection.** For each geometry we searched the same grid {0.03, 0.1, 0.3, 1, 3} on seed 7 and selected the value with the highest mean validation MRR over the 2-hop and 3-hop validation queries. Test queries were never used during selection. Both geometries selected a learning rate of 0.1 (Table 6), so the final models share all hyperparameters.

**Query composition and ranking.** A query embedding is formed as a weighted combination of the query entities. Hop weights increase towards the entity closest to the answer: (0.5, 1) for (*g*, *d*) in 2-hop queries and (1/3, 1/2, 1) for (*g*, *d*, *g′*) in 3-hop queries, normalised to sum to one. In Euclidean space this is a weighted mean. In the Poincaré ball, entities are mapped to the tangent space at the origin with the logarithmic map, averaged and mapped back with the exponential map. Candidates are ranked by distance to the query embedding (geodesic distance for Poincaré).

**Lexical baseline.** As a non-learned reference, each compound is represented by the identifier tokens of the compound and its training-graph neighbours, and candidates are ranked by IDF-weighted token overlap with the query identifiers. No restricted labels or descriptions are used.

### 3.4 Ablations

Four Poincaré variants isolate RMF-RAG components: (i) *no geodesic ranking*, which ranks by Euclidean distance in the ball; (ii) *no hop weighting*, which uses equal weights; (iii) *no tangent composition*, which averages ball coordinates directly and re-projects; and (iv) *typed-path verification*, which reranks candidates so that compounds reachable by an exact typed path in the training graph come first, ordered by Poincaré distance.

### 3.5 Evaluation

We report Recall@1, Recall@5, Recall@10 and mean reciprocal rank (MRR) over all 666 candidate compounds (raw ranking: other known answers are not filtered out), plus the proportion of top-1 predictions supported by an exact typed path in the training graph. Under uniformly random ranking the expected values are Recall@k = k/666 and MRR = H₆₆₆/666 ≈ 0.011. Experiments use seeds 7, 17, 29, 43 and 101. We report means across seeds with two-sided 95% t-intervals (4 degrees of freedom) and, for the geometry comparison, paired per-seed differences with their own t-intervals. With five seeds these intervals describe seed sensitivity and are not a substitute for a formal multiple-comparison analysis.

### 3.6 Disease–drug pilot

Before the Hetionet benchmark, the same matched retrievers were evaluated on a small disease–drug pilot built from 1,000 public disease–drug question–answer records. Its graph links disease nodes, disease-name token nodes and drug nodes. For every disease with at least two drugs, one pair is held out and removed before graph construction, and evaluation uses the held-out pairs whose drug remains reachable (16–23 queries per seed, about 468 candidate drugs). The pilot has no validation split, so it reuses the optimisation settings selected on the Hetionet validation data (learning rate 0.1, 60 epochs, batch size 256).

## 4. Results

### 4.1 Training diagnostics

Training reduced the mean triplet loss from 0.448 to about 0.335 for both geometries across all seeds (Figure 1), and the maximum Poincaré embedding norm grew from 0.067 to about 0.29. The two geometries followed almost identical loss curves. The loss was still decreasing at epoch 60, so neither model is fully converged; the epoch budget is identical for both geometries, and its effect on the comparison is discussed in Section 6.

{{FIGURE:fig_training_loss.png|**Figure 1.** Mean training triplet loss per epoch for the five seeds (selected learning rate 0.1, batch size 256).}}

### 4.2 Main benchmark

Table 1 reports held-out test results. On the 3-hop task, both learned geometries retrieve the correct compound far more often than random ranking: Euclidean MRR is 0.095 [0.077, 0.112] and Poincaré MRR is 0.091 [0.050, 0.131], against 0.011 for random ranking; Recall@10 is 0.221 and 0.242 respectively, against 0.015. On the 2-hop task, learned retrieval is only marginally above random (MRR 0.017 Euclidean and 0.019 Poincaré). The identifier-only lexical baseline is at or below random on both tasks, confirming that the identifiers carry no answer information.

Table 1. Held-out test results on Hetionet v1.0 (mean over five seeds with 95% t-interval; 500 queries per task and seed; 666 candidate compounds). Interval bounds are clipped to [0, 1].

{{TABLE:main_test}}

{{FIGURE:fig_test_mrr.png|**Figure 2.** Test MRR with 95% confidence intervals over five seeds. The dashed line marks the expected MRR of random ranking over 666 compounds.}}

### 4.3 Euclidean versus Poincaré

Table 2 reports paired per-seed differences (Poincaré minus Euclidean). Every 95% interval includes zero, and neither geometry wins consistently across seeds: for example, Poincaré has higher 3-hop test MRR in only two of five seeds. The validation results (Table 3) show the same pattern. On the tuning seed alone, Poincaré had a noticeably higher mean validation MRR than Euclidean (0.068 versus 0.052; Table 6), but this advantage did not persist across seeds, which illustrates why single-seed comparisons can mislead.

Table 2. Paired per-seed differences, Poincaré minus Euclidean.

{{TABLE:paired}}

Table 3. Validation results (mean over five seeds with 95% t-interval).

{{TABLE:main_validation}}

### 4.4 Ablations

Table 4 reports the Poincaré ablations on the test split. **Hop weighting** is the only composition component with a clear effect: removing it lowers 3-hop MRR from 0.091 to 0.070 and Recall@5 from 0.112 to 0.093, consistent with the intuition that the entity adjacent to the answer (the bridge gene) should dominate the query. **Geodesic ranking** and **tangent-space composition** leave every metric unchanged to three decimal places. This is expected given the training diagnostics: with all embeddings inside a radius of about 0.29, the conformal factor varies little and the logarithmic and exponential maps at the origin are close to the identity, so the Poincaré model operates in an almost Euclidean region of the ball.

**Typed-path verification** behaves differently on the two tasks. On 3-hop retrieval it raises the share of path-supported top-1 predictions from 0.466 to 0.968 while leaving accuracy essentially unchanged (MRR 0.092 versus 0.091). On 2-hop retrieval it reduces MRR to 0.010, around the random level. This is a direct consequence of leakage control: the answer edge of a 2-hop test query is removed from the training graph, so the correct compound can never be verified, and promoting verified compounds pushes it down. Path verification therefore improves interpretability on 3-hop queries but should not be used as a ranking constraint when the target relation is exactly the missing link.

Table 4. Poincaré component ablations on the test split (mean over five seeds with 95% t-interval).

{{TABLE:ablation}}

### 4.5 Disease–drug pilot

With matched optimisers, the pilot also shows no clear geometry effect (Table 5): Euclidean MRR is 0.074 [0.057, 0.091] and Poincaré MRR is 0.059 [0.036, 0.083], against about 0.014 for random ranking, and Recall@10 is 0.187 versus 0.177. An earlier version of this pilot had trained the Euclidean model with Adam and the Poincaré model with full-batch Riemannian SGD. That version reported a large apparent Euclidean advantage (MRR 0.107 versus 0.020) that disappears once the optimisers are matched. The apparent gap was an optimisation artefact rather than a property of the geometry.

Table 5. Disease–drug pilot with matched optimisers (mean over five seeds with 95% t-interval; 16–23 test queries per seed). The pilot is small, and its intervals are wide.

{{TABLE:pilot}}

### 4.6 Sensitivity to the training regime

An earlier configuration of the Hetionet benchmark took one full-batch gradient step per epoch for 24 epochs. Under that configuration the training loss moved only from 0.4495 to 0.4486, and both geometries ranked the test answer at chance level (3-hop MRR 0.009 Euclidean and 0.011 Poincaré, median rank about 350 of 666). Reporting "no significant difference" from that run would have been technically true and scientifically meaningless. We report it because it shows that matched comparisons must also verify that both models have actually been trained, for example by reporting loss curves and a random-ranking reference.

## 5. Discussion

**Geometry.** Under matched training, both geometries learn the 3-hop task to a similar degree, and the remaining differences lie within seed-to-seed variation. The most plausible explanation is that, at this scale and with this objective, the learned Poincaré embeddings never leave the near-Euclidean region around the origin, so the representational advantages of negative curvature are never exercised. Hyperbolic gains reported in the literature are largest at very low dimension and on strongly hierarchical graphs [5, 9, 10]. Our 16-dimensional embeddings of a typed tripartite graph may provide enough Euclidean capacity that curvature is unnecessary. A different objective, a learnable or larger curvature, lower dimension or a larger and more hierarchical relation subset might change this conclusion, and our framework is designed to test such variants without reintroducing confounds.

**Why 2-hop retrieval is hard here.** The 2-hop task asks for a compound that treats a disease *without* the corresponding Disease–Compound edge being observed. The disease's training-set compounds, which are also genuine treatments, are naturally embedded closest to it and are counted as errors under raw ranking. This is the standard motivation for the *filtered* ranking protocol in KG completion [12], in which other known true answers are removed before scoring. We used raw ranking in this study and will adopt filtered ranking in future work; we expect it to raise absolute 2-hop scores without favouring either geometry.

**Methodological lessons.** Two of our intermediate results would have supported misleading claims: a large Euclidean advantage in the pilot caused by mismatched optimisers, and a chance-level "tie" in the benchmark caused by under-training. In addition, a single-seed validation comparison favoured Poincaré retrieval by about 30%, and this did not replicate. Geometry comparisons should therefore report matched optimisers, loss curves, a random-ranking reference, several seeds and paired differences.

**Retrieval versus clinical evidence.** A high-ranked compound in this benchmark means that the compound is close to the query in an embedding of public association data. It is not evidence of therapeutic efficacy. The 3-hop `binds` endpoint in particular measures molecular connectivity, not treatment. RMF-RAG keeps graph retrieval separate from its literature-evidence layer, which labels candidate compounds as having direct, context-only, preclinical-only or no supporting records, and no output of this work should be read as a treatment recommendation.

## 6. Limitations

- **One dataset, one scale.** All benchmark results come from one provenance-filtered subset of one KG. The five seeds measure seed sensitivity, not generalisation to other graphs, relation types or larger subsets of Hetionet.
- **Restricted relations.** We deliberately excluded relations without explicit reusable licences. This reduces graph coverage and may remove hierarchical structure that would favour hyperbolic geometry.
- **Model family.** We study distance-based entity embeddings with fixed curvature, a single margin loss and dimension 16. We do not evaluate relation-specific hyperbolic models such as MuRP or AttH [9, 10], learnable curvature or mixed-curvature spaces [20].
- **Tuning scope and convergence.** Learning rates were tuned on one seed and a five-point grid; the dimension, margin and epoch budget were fixed in advance rather than tuned. Training loss was still decreasing after 60 epochs, so longer training could raise absolute scores; because both geometries share the same budget and nearly identical loss curves, we do not expect this to favour either one, but it has not been tested.
- **Raw ranking.** We report raw rather than filtered ranks, which depresses absolute 2-hop scores (Section 5).
- **Statistical power.** With five seeds, paired intervals are wide (for example ±0.046 for the 3-hop MRR difference), so small geometry effects cannot be excluded.
- **Pilot size.** The pilot uses lexical token structure rather than curated biomedical relations and has only 16–23 test queries per seed.
- **No generation evaluation.** We evaluate retrieval only. Citation correctness, answer groundedness and clinical validity require separate evaluation with a frozen generator.

## 7. Conclusion

We built a controlled, leakage-aware benchmark to test whether Poincaré geometry improves biomedical multi-hop KG retrieval. With matched data, triplets, optimiser budgets and validation-selected learning rates, both Euclidean and Poincaré retrievers learn the 3-hop Gene→Disease→Gene→Compound task well above random ranking, but we find no reliable difference between them on either task. Hop-weighted query composition helps, explicit typed-path verification improves interpretability for 3-hop queries, and the geometry-specific components have no measurable effect because the learned hyperbolic embeddings remain near the origin. Equally important, matching the optimisers and checking that both models actually train were each enough to change the study's conclusion. We release the code, frozen query sets, per-query predictions, embeddings and result tables so that future hyperbolic retrieval methods can be evaluated under the same controls.

## Data and code availability

All code, the frozen query sets (`research/query_sets/`), per-seed embeddings, per-query predictions, aggregate metrics, learning-rate selection grid and figures (`research/results/main_benchmark/`, `research/paper/figures/`) are in the project repository (https://github.com/Saadia-Asghar/kg-rag-rmf-rag-research). The benchmark is reproduced with `python research/scripts/run_main_rmf_rag_benchmark.py` after placing the official Hetionet v1.0 snapshot [18] at `research_data/hetionet/hetionet-v1.0.json.bz2` or setting `HETIONET_JSON_BZ2`. The automated test suite (10 tests) checks the geometry, optimisation, projection, relation filtering, split disjointness, leakage removal, query construction and ranking modes.

## Appendix A. Learning-rate selection

Table 6. Validation MRR on the tuning seed (seed 7) for each geometry and learning rate. Test data were not used. Both geometries selected 0.1.

{{TABLE:tuning}}

## References

[1] P. Lewis, E. Perez, A. Piktus, F. Petroni, V. Karpukhin, N. Goyal, H. Küttler, M. Lewis, W. Yih, T. Rocktäschel, S. Riedel and D. Kiela. Retrieval-augmented generation for knowledge-intensive NLP tasks. In *Advances in Neural Information Processing Systems 33 (NeurIPS)*, 2020.

[2] D. Edge, H. Trinh, N. Cheng, J. Bradley, A. Chao, A. Mody, S. Truitt and J. Larson. From local to global: A graph RAG approach to query-focused summarization. *arXiv:2404.16130*, 2024.

[3] K. Soman, P. W. Rose, J. H. Morris, R. E. Akbas, B. Smith, B. Peetoom, C. Villouta-Reyes, G. Cerono, Y. Shi, A. Rizk-Jackson, S. Israni, C. A. Nelson, S. Huang and S. E. Baranzini. Biomedical knowledge graph-optimized prompt generation for large language models. *Bioinformatics*, 40(9):btae560, 2024.

[4] D. S. Himmelstein, A. Lizee, C. Hessler, L. Brueggeman, S. L. Chen, D. Hadley, A. Green, P. Khankhanian and S. E. Baranzini. Systematic integration of biomedical knowledge prioritizes drugs for repurposing. *eLife*, 6:e26726, 2017. https://doi.org/10.7554/eLife.26726

[5] M. Nickel and D. Kiela. Poincaré embeddings for learning hierarchical representations. In *Advances in Neural Information Processing Systems 30 (NeurIPS)*, 2017.

[6] D. Krioukov, F. Papadopoulos, M. Kitsak, A. Vahdat and M. Boguñá. Hyperbolic geometry of complex networks. *Physical Review E*, 82(3):036106, 2010.

[7] R. Sarkar. Low distortion Delaunay embedding of trees in hyperbolic plane. In *Graph Drawing (GD 2011)*, Lecture Notes in Computer Science 7034, Springer, 2012.

[8] O.-E. Ganea, G. Bécigneul and T. Hofmann. Hyperbolic neural networks. In *Advances in Neural Information Processing Systems 31 (NeurIPS)*, 2018.

[9] I. Balažević, C. Allen and T. Hospedales. Multi-relational Poincaré graph embeddings. In *Advances in Neural Information Processing Systems 32 (NeurIPS)*, 2019.

[10] I. Chami, A. Wolf, D.-C. Juan, F. Sala, S. Ravi and C. Ré. Low-dimensional hyperbolic knowledge graph embeddings. In *Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics (ACL)*, 2020.

[11] S. Bonnabel. Stochastic gradient descent on Riemannian manifolds. *IEEE Transactions on Automatic Control*, 58(9):2217–2229, 2013.

[12] A. Bordes, N. Usunier, A. Garcia-Durán, J. Weston and O. Yakhnenko. Translating embeddings for modeling multi-relational data. In *Advances in Neural Information Processing Systems 26 (NeurIPS)*, 2013.

[13] W. L. Hamilton, P. Bajaj, M. Zitnik, D. Jurafsky and J. Leskovec. Embedding logical queries on knowledge graphs. In *Advances in Neural Information Processing Systems 31 (NeurIPS)*, 2018.

[14] H. Ren, W. Hu and J. Leskovec. Query2box: Reasoning over knowledge graphs in vector space using box embeddings. In *International Conference on Learning Representations (ICLR)*, 2020.

[15] M. Ali, M. Berrendorf, C. T. Hoyt, L. Vermue, M. Galkin, S. Sharifzadeh, A. Fischer, V. Tresp and J. Lehmann. Bringing light into the dark: A large-scale evaluation of knowledge graph embedding models under a unified framework. *IEEE Transactions on Pattern Analysis and Machine Intelligence*, 44(12):8825–8845, 2022.

[16] D. Ruffinelli, S. Broscheit and R. Gemulla. You CAN teach an old dog new tricks! On training knowledge graph embeddings. In *International Conference on Learning Representations (ICLR)*, 2020.

[17] S. Bonner, I. P. Barrett, C. Ye, R. Swiers, O. Engkvist, A. Bender, C. T. Hoyt and W. L. Hamilton. A review of biomedical datasets relating to drug discovery: a knowledge graph perspective. *Briefings in Bioinformatics*, 23(6):bbac404, 2022.

[18] D. S. Himmelstein et al. Hetionet v1.0 data release. Zenodo, 2017. https://zenodo.org/records/268568

[19] X. Bouthillier, P. Delaunay, M. Bronzi, A. Trofimov, B. Nichyporuk, J. Szeto, N. Sepah, E. Raff, K. Madan, V. Voleti, S. E. Kahou, V. Michalski, D. Serdyuk, T. Arbel, C. Pal, G. Varoquaux and P. Vincent. Accounting for variance in machine learning benchmarks. In *Proceedings of Machine Learning and Systems (MLSys)*, 2021.

[20] A. Gu, F. Sala, B. Gunel and C. Ré. Learning mixed-curvature representations in product spaces. In *International Conference on Learning Representations (ICLR)*, 2019.
