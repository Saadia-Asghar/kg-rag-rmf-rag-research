# Geometry or Grounding? Hyperbolic Embeddings and Multi-Hop Hallucination in Biomedical Knowledge-Graph Retrieval

^Saadia Asghar
^[Department, University — to be completed]
^Supervisor: [Name — to be completed]
^Draft manuscript, November 2026

## Abstract

Knowledge-graph retrieval-augmented generation (KG-RAG) can *hallucinate across hops*: a multi-hop retriever may return an entity that no real chain of relations connects to the question. Hyperbolic (Poincaré) embeddings have been proposed as a remedy because curved space represents hierarchical, multi-hop structure with low distortion, but this claim has rarely been tested under controlled conditions. We define a measurable, graph-grounded notion of hop hallucination: the hop-hallucination rate HHR@1 is the fraction of queries whose top-ranked answer has no exact typed path from the query in the training graph. We then compare Euclidean and Poincaré retrievers with matched data, triplets, mini-batches, negatives and epochs, and with learning rates selected on validation data only. The evaluation uses leakage-controlled 2-hop (Gene→Disease→Compound) and 3-hop (Gene→Disease→Gene→Compound) tasks on a provenance-filtered subset of Hetionet v1.0. In a pre-registered sweep over embedding dimension (2–16), curvature (1 and 10) and ten seeds, Poincaré geometry reduced 3-hop hop hallucination at dimension 8 (HHR@1 0.553 versus 0.694; difference −0.141, 95% CI [−0.224, −0.059], Holm-adjusted p = 0.030, lower in 10 of 10 seeds) with unchanged accuracy (MRR 0.079 versus 0.080). The other seven pre-registered comparisons were not significant. On 2-hop queries, Poincaré embeddings of dimension 4 and 8 produced 3–6 points fewer hallucinated top answers than Euclidean embeddings, in 8–10 of 10 seeds (Holm p < 0.02), at equal MRR. At dimension 2 both geometries failed to learn the tasks, and at dimension 16 the advantage faded. Relation-aware TransE- and MuRP-style baselines roughly doubled 3-hop filtered MRR (0.256–0.278 versus 0.125–0.157) and lowered 3-hop HHR@1 to 0.303–0.344; within this family, hyperbolic geometry again lowered 2-hop hallucination at dimension 16 (−0.173, 10 of 10 seeds) at equal filtered MRR. Explicit typed-path verification, by contrast, removed almost all hop hallucinations for every model (3-hop HHR@1 = 0.026, the share of queries with no supported candidate). Hyperbolic geometry therefore gives a modest, dimension-dependent reduction in hop hallucination without loss of accuracy, while structural grounding is far more effective. Along the way, we show that under-training and mismatched optimisers can each manufacture or hide geometry effects.

**Keywords:** knowledge graphs; retrieval-augmented generation; hallucination; hyperbolic embeddings; Poincaré ball; biomedical retrieval; multi-hop reasoning; reproducibility

## 1. Introduction

Retrieval-augmented generation (RAG) reduces hallucination in language models by grounding their output in retrieved knowledge [1]. When the knowledge source is a graph, retrieval must follow relational paths, which has motivated graph-based RAG [2] and biomedical KG-augmented prompting [3]. Multi-hop retrieval, however, introduces its own failure mode. A retriever that answers "which compound acts on a gene associated with this disease?" may return a compound that is close to the query in embedding space but not connected to it by any real chain of relations. We call this a **hop hallucination**: the retrieved answer looks plausible, yet the reasoning path that would justify it does not exist. In a RAG system, such an answer becomes ungrounded context for the generator.

Hyperbolic geometry is a natural candidate for reducing hop hallucination. The volume of a hyperbolic ball grows exponentially with its radius, so trees and hierarchies can be embedded with low distortion [6, 7], and Poincaré embeddings [5], hyperbolic neural networks [8] and hyperbolic KG embeddings [9, 10] have reported advantages over Euclidean counterparts, especially at low dimension. If curved space preserves multi-hop structure better, a hyperbolic retriever should place path-connected answers closer to the query and therefore hallucinate fewer hops.

Testing this claim fairly is harder than it seems. Changing the geometry usually also changes the optimiser, effective learning rate, training budget or negative sampling, and KG-embedding results are known to be highly sensitive to such choices [15, 16]. Single-seed comparisons can be dominated by random variation [19]. Multi-hop evaluation adds the risk of answer leakage, where the held-out answer edge remains in the training graph.

This paper asks: **under matched, leakage-controlled conditions, does Poincaré geometry reduce multi-hop hallucination in biomedical KG retrieval, and how does it compare with explicit structural grounding?** Our contributions are:

- A measurable, graph-grounded definition of hop hallucination for KG retrieval (HHR@1 and Unsupported@10), reported alongside accuracy so that groundedness cannot be traded silently against correctness.
- A controlled framework (RMF-RAG) in which Euclidean and Poincaré retrievers see identical triplets, mini-batches, negatives and epochs, with learning rates selected on validation data only, and a leakage-controlled Hetionet v1.0 benchmark for typed 2-hop and 3-hop retrieval.
- A pre-registered sweep over dimension, curvature and ten seeds showing that Poincaré geometry reduces hop hallucination modestly and only in an intermediate range of dimensions, at unchanged accuracy.
- Relation-aware TransE- and MuRP-style baselines evaluated under the standard filtered ranking protocol, which test whether the geometry effect generalises beyond relation-free retrievers.
- Evidence that explicit typed-path verification removes almost all hop hallucination regardless of model, together with an analysis of its cost when the target relation is exactly the missing link.
- Two documented optimisation confounds (under-training and mismatched optimisers) that would otherwise have produced misleading geometry conclusions.

## 2. Related work

**Retrieval-augmented generation and graph retrieval.** RAG couples a parametric generator with non-parametric retrieval [1]. GraphRAG builds and summarises entity graphs for query-focused summarisation [2], and biomedical KG-RAG retrieves context from a curated biomedical KG to improve LLM answers [3]. These systems assume that the retrieved graph context is relevant and connected to the question; our hop-hallucination metrics measure when this assumption fails at the retrieval stage, before any text is generated.

**Knowledge-graph embeddings and multi-hop queries.** Translational models such as TransE [12] embed entities so that true triples are close. Query-embedding methods such as GQE [13] and Query2box [14] compose embeddings along relational paths to answer multi-hop queries without explicitly traversing them, so their answers need not be supported by an existing path. Large-scale re-evaluations show that training configuration often matters as much as model architecture [15, 16], which motivates our matched-training design.

**Hyperbolic representations.** Real networks can have latent hyperbolic geometry [6], and trees embed with low distortion in the hyperbolic plane [7]. Poincaré embeddings trained with Riemannian SGD [5, 11] were followed by hyperbolic neural networks [8], multi-relational Poincaré embeddings (MuRP) [9], attention-based hyperbolic KG embeddings (AttH) [10] and mixed-curvature spaces [20]. These studies evaluate link-prediction accuracy; Recent hyperbolic RAG systems, HyperbolicRAG [21], HypRAG [22] and HyperRAG [23], report better retrieval or answer quality, and [21], [22] cite hallucination as motivation, but, to our knowledge, none measures unsupported multi-hop answers against a Euclidean counterpart trained under matched conditions.

**Biomedical KGs.** Hetionet integrates 29 public resources into a heterogeneous network of 47,031 nodes and 2,250,197 relationships and was used to prioritise drugs for repurposing [4, 18]. Bonner et al. [17] review public datasets for building drug-discovery KGs; we additionally restrict ours to relations whose reuse licence is recorded in Hetionet's edge metadata.

## 3. Methods

### 3.1 Data and relation filtering

We use the official Hetionet v1.0 JSON snapshot [18]. The Zenodo archive was verified against its published MD5 checksum, and the SHA-256 of the extracted `hetionet-v1.0.json.bz2` (`a342ab57…984c19`) is recorded with every run. To keep every training relation traceable to an explicitly reusable source, we retain three relation types: Gene–Disease `associates` edges from DISEASES (CC BY 4.0; 3,200 edges), Disease–Compound `treats` and `palliates` edges from PharmacotherapyDB (CC0 1.0; 755 and 390 edges, 1,145 in total), and Gene–Compound `binds` edges from DrugCentral (CC BY 4.0; 823 edges). The runner checks these frozen counts and halts on any drift. The resulting graph contains 3,039 nodes: 2,240 genes, 133 diseases and 666 compounds.

### 3.2 Tasks, splits and leakage control

The system must rank all 666 compounds for each query:

- **2-hop:** given a gene *g* and a disease *d* with (*g*, associates, *d*), retrieve the compound *c* with (*d*, treats/palliates, *c*).
- **3-hop:** given a gene *g*, a disease *d* and a bridge gene *g′* such that (*g*, associates, *d*) and (*g′*, associates, *d*), retrieve the compound *c* with (*g′*, binds, *c*).

Terminal answer edges are split deterministically per seed. Disease–Compound edges are split within each disease (15% validation, 15% test, remainder training, for diseases with at least three compounds), and Gene–Compound edges are split globally (10% validation, 10% test). **All validation and test terminal edges are removed from the training graph** before embedding training and before path verification. Queries are enumerated from the held-out edges, capped at 500 per task, split and seed by seeded sampling, and frozen to JSONL files.

### 3.3 Retrievers

Every node receives a trainable embedding initialised from N(0, 0.01²).

**Euclidean retriever.** Distance is the L2 norm, and parameters are updated by mini-batch SGD.

**Poincaré retriever.** Embeddings lie in the open ball of radius 1/√c for curvature *c*, with geodesic distance d_c(x, y) = (1/√c) · arcosh(1 + 2c‖x − y‖² / ((1 − c‖x‖²)(1 − c‖y‖²))). Gradients are computed with PyTorch autograd and converted to Riemannian gradients by the inverse squared conformal factor ((1 − c‖x‖²)/2)², following Riemannian SGD [5, 11], and embeddings are projected back inside the ball after every update.

**Training objective.** Both models minimise the margin loss max(0, γ + d(a, p) − d(a, n)) with γ = 0.45 over every directed training edge (*a*, *p*). Each positive is paired with one type-matched, non-neighbouring negative *n* sampled deterministically from the seed and epoch. **Both geometries receive exactly the same triplets in the same mini-batch order** (batch size 256).

**Query composition and ranking.** A query embedding is a hop-weighted combination of the query entities, with weights increasing towards the entity nearest the answer: (0.5, 1) for (*g*, *d*) and (1/3, 1/2, 1) for (*g*, *d*, *g′*), normalised to sum to one. Euclidean queries use a weighted mean. Poincaré queries map entities to the tangent space at the origin, average them and map back with the exponential map. Candidates are ranked by distance to the query embedding.

**Lexical baseline.** Each compound is represented by the identifier tokens of the compound and its training-graph neighbours, and candidates are ranked by IDF-weighted token overlap with the query identifiers.

### 3.4 Hop hallucination and path verification

A compound *c* is **path-supported** for a query if an exact typed path exists in the training graph: for 2-hop queries, a `treats`/`palliates` edge from the query disease to *c*; for 3-hop queries, a `binds` edge from *c* to any gene associated with the query disease. A compound without such a path is **unsupported**, so ranking it first is a hop hallucination. We report:

- **HHR@1 (hop-hallucination rate):** the fraction of queries whose top-ranked compound is unsupported;
- **Unsupported@10:** the mean fraction of unsupported compounds among the top 10.

Because the answer edge of each held-out query is removed, the correct 2-hop answer is never path-supported. Hop hallucination therefore measures *groundedness*, not correctness, and must always be read together with accuracy (MRR, Recall@k). **Typed-path verification** is a grounding constraint that reranks candidates so that path-supported compounds come first, keeping the geometric order within each group.

### 3.5 Main benchmark configuration

The main benchmark uses 16-dimensional embeddings, curvature 1 and 60 epochs, with five seeds (7, 17, 29, 43, 101). For each geometry we searched the learning-rate grid {0.03, 0.1, 0.3, 1, 3} on seed 7 and selected the value with the highest mean validation MRR over 2-hop and 3-hop queries. Both geometries selected 0.1 (Table 10). Four Poincaré ablations isolate RMF-RAG components: no geodesic ranking (Euclidean distance inside the ball), no hop weighting (equal weights), no tangent composition (direct averaging and re-projection), and typed-path verification.

### 3.6 Pre-registered hallucination sweep

Hyperbolic advantages are expected to be largest at low dimension and high curvature [5, 9, 10]. The main benchmark (16 dimensions, curvature 1) suggested, in exploratory analysis, that Poincaré answers were more often path-supported on 3-hop queries. To test this properly, we wrote a pre-registration before training any sweep model. It fixed the hypothesis, configurations, metrics and statistical tests and is stored with the results. The sweep trains Euclidean models of dimension *d* ∈ {2, 4, 8, 16} and Poincaré models of the same dimensions with curvature *c* ∈ {1, 10}, giving 12 configurations, each for 150 epochs. The learning rate of each configuration is selected from {0.1, 0.3, 1} on seed-7 validation MRR only. Each configuration is then trained and evaluated with ten seeds (7, 17, 29, 43, 101, 211, 307, 401, 503, 601), five of which had never been inspected.

**Primary test (pre-registered).** For each of the 8 Poincaré configurations against the Euclidean model of the same dimension: a two-sided paired t-test over the ten seeds on per-seed 3-hop test HHR@1, with Holm–Bonferroni correction across the 8 comparisons at α = 0.05. Secondary outcomes, each corrected within its own family of 8 comparisons, are 3-hop Unsupported@10 and MRR, the corresponding 2-hop measures, the effect of path verification, and a sensitivity analysis on the five new seeds only.

### 3.7 Evaluation and statistics

We report Recall@1/5/10 and MRR over all 666 candidates using raw ranking, in which other known answers are not filtered out, and, for the baseline comparison (Section 3.9), also filtered ranking [12], in which the other known true answers of the final hop (in any split) are removed before the target is ranked. HHR@1 is always computed on the raw ranking, which is what a system returns. Under random ranking, Recall@k = k/666 and MRR = H₆₆₆/666 ≈ 0.011. Means across seeds are reported with two-sided 95% t-intervals, and geometry comparisons use paired per-seed differences.

### 3.8 Disease–drug pilot

A small pilot built from 1,000 disease–drug question–answer records from a public Kaggle dataset [24] links disease nodes, disease-name token nodes and drug nodes. For every disease with at least two drugs, one pair is held out before graph construction, and evaluation uses the held-out pairs whose drug remains reachable (16–23 queries per seed, about 468 candidate drugs). The pilot has no validation split, so it reuses the main benchmark's validation-selected settings (learning rate 0.1, 60 epochs, batch size 256).

### 3.9 Relation-aware baselines (additional analysis)

To test whether the conclusions hold for stronger, relation-aware models, we add TransE-style [12] and MuRP-style [9] retrievers that learn one transformation per directed relation type: d(h, r, t) = ‖e_h + w_r − e_t‖ in Euclidean space, and d(h, r, t) = d_B(exp_0(R_r log_0(e_h)), e_t ⊕ w_r) in the Poincaré ball, with Möbius addition ⊕ and a diagonal relation matrix R_r. To keep training matched, both use the same margin loss, triplets, mini-batches and 150 epochs as the sweep; MuRP's entity biases and logistic loss are omitted. They score the final hop: (*d*, treats, ?) for 2-hop and (*g′*, binds, ?) for 3-hop queries. Each method selects its learning rate per dimension (8 and 16) from {0.1, 0.3, 1} on seed-7 validation MRR, and all are evaluated over the same ten seeds. The relation-free models selected the same learning rates as in the sweep and reproduced its results exactly. This analysis was added after the pre-registered sweep and is reported as secondary.

## 4. Results

### 4.1 Training diagnostics

In the main benchmark, training reduced the mean triplet loss from 0.448 to about 0.335 for both geometries across all seeds (Figure 1), and the maximum Poincaré embedding norm grew from 0.067 to about 0.29. The two geometries followed almost identical loss curves. The loss was still decreasing at epoch 60, which motivated the longer 150-epoch budget of the sweep.

{{FIGURE:fig_training_loss.png|**Figure 1.** Main benchmark: mean training triplet loss per epoch for the five seeds (16 dimensions, learning rate 0.1, batch size 256).}}

### 4.2 Retrieval accuracy (main benchmark)

On the 3-hop task, both learned geometries retrieve the correct compound far more often than random ranking (Table 1, Figure 2). Euclidean MRR is 0.095 [0.077, 0.112] and Poincaré MRR is 0.091 [0.050, 0.131], against 0.011 for random ranking; Recall@10 is 0.221 and 0.242, against 0.015. On the 2-hop task, learned retrieval is only marginally above random (MRR 0.017 and 0.019), for reasons analysed in Section 5. The identifier-only lexical baseline is at or below random on both tasks. Paired per-seed accuracy differences between the geometries all include zero (Table 2).

Table 1. Main benchmark: held-out test accuracy (16 dimensions; mean over five seeds with 95% t-interval; 500 queries per task and seed; 666 candidate compounds). Interval bounds are clipped to [0, 1].

{{TABLE:main_test}}

{{FIGURE:fig_test_mrr.png|**Figure 2.** Main benchmark: test MRR with 95% confidence intervals over five seeds. The dashed line marks the expected MRR of random ranking.}}

Table 2. Main benchmark: paired per-seed accuracy differences, Poincaré minus Euclidean.

{{TABLE:paired}}

### 4.3 Hop hallucination: pre-registered sweep

Figure 3 and Tables 3–6 report the sweep. Three patterns stand out.

**Dimension 2 is too small for both geometries.** Both geometries barely learn the 3-hop task at *d* = 2 (MRR 0.021–0.035, against 0.011 for random ranking), and more than 90% of their top-ranked 3-hop answers are hallucinated. No geometry difference is detectable.

**Poincaré geometry reduces hop hallucination at intermediate dimension.** In the primary pre-registered test, the 8-dimensional, curvature-1 Poincaré retriever hallucinated fewer 3-hop top answers than the 8-dimensional Euclidean retriever: HHR@1 0.553 versus 0.694, a difference of −0.141 [−0.224, −0.059] (Holm-adjusted p = 0.030), lower in all 10 seeds. Accuracy was unchanged (MRR 0.079 versus 0.080, difference −0.001 [−0.026, +0.024]). The other seven primary comparisons were not significant after correction. In the sensitivity analysis restricted to the five never-inspected seeds, the difference for this configuration was −0.114 [−0.274, +0.046] and lower in all five seeds. The direction is consistent, but five seeds alone do not reach significance. At *d* = 4 and *c* = 1, Poincaré embeddings also placed fewer unsupported compounds in the 3-hop top 10 (Unsupported@10 −0.088 [−0.125, −0.052], Holm p = 0.003, 10 of 10 seeds).

The 2-hop task shows the clearest effect (Table 6). At *d* = 4 and *d* = 8, Poincaré embeddings with either curvature reduced HHR@1 by 3.4–6.0 percentage points and Unsupported@10 by 1.8–7.1 points (Holm p < 0.02; lower in 8–10 of 10 seeds). MRR was unchanged in every case (|ΔMRR| ≤ 0.002).

**The advantage fades at dimension 16.** At *d* = 16, neither 3-hop nor 2-hop HHR@1 differed significantly, and 2-hop Unsupported@10 was slightly *higher* for Poincaré embeddings (+0.046 and +0.056, Holm p ≤ 0.009). With 16 dimensions, Euclidean space appears to have enough capacity to represent the typed structure, consistent with the literature's finding that hyperbolic benefits are concentrated at low dimension [5, 10]. Higher curvature (*c* = 10) pushed embeddings further towards the boundary of the ball (maximum normalised norm 0.85–0.98, versus 0.38–0.64 for *c* = 1) but did not increase the benefit.

{{FIGURE:fig_hallucination_sweep.png|**Figure 3.** Pre-registered sweep: hop-hallucination rate (top) and accuracy (bottom) against embedding dimension, mean and 95% CI over ten seeds. Lower HHR@1 is better; the dotted line marks random-ranking MRR.}}

Table 3. Sweep, 3-hop test: accuracy and hop hallucination (mean over ten seeds with 95% t-interval; LR = selected learning rate). The last column is HHR@1 after typed-path verification.

{{TABLE:sweep_3hop}}

Table 4. Sweep, 3-hop test: paired differences, Poincaré minus Euclidean of the same dimension (ten seeds; negative ΔHHR@1 and ΔUnsupported@10 mean fewer hallucinations). The ΔHHR@1 column is the pre-registered primary test; p-values are Holm-adjusted within each family of eight comparisons.

{{TABLE:sweep_paired_3hop}}

Table 5. Sweep, 2-hop test: accuracy and hop hallucination (mean over ten seeds with 95% t-interval).

{{TABLE:sweep_2hop}}

Table 6. Sweep, 2-hop test: paired differences, Poincaré minus Euclidean of the same dimension (ten seeds; Holm-adjusted).

{{TABLE:sweep_paired_2hop}}

### 4.4 Grounding by typed-path verification

Because HHR@1 is defined by path support, promoting path-supported compounds removes hop hallucination by construction: it reduced 3-hop HHR@1 to 0.026 for every configuration (Table 3, last column), the share of queries for which no candidate is path-supported at all, and 2-hop HHR@1 to 0. The informative result is therefore its cost in accuracy. On 3-hop queries, MRR changed by −0.013 to +0.015 for every model with d ≥ 4 (main benchmark: 0.092 versus 0.091; Table 7) and rose by 0.04–0.05 for the weak d = 2 models. On 2-hop queries it lowered MRR by 29–62% across all models (main benchmark: 0.019 → 0.010). Because the held-out answer edge is removed, the correct compound is never path-supported, and promoting supported compounds pushes it down. Grounding to known paths therefore prevents hallucination but also prevents the discovery of genuinely new links, a trade-off that any KG-RAG system must make explicitly.

### 4.5 Component ablations

Table 7 reports the Poincaré ablations from the main benchmark. Hop weighting is the only composition component with a clear effect: removing it lowers 3-hop MRR from 0.091 to 0.070 and Recall@5 from 0.112 to 0.093. Geodesic ranking and tangent-space composition leave every metric unchanged to three decimal places. With main-benchmark embeddings inside a radius of about 0.29, the ball is nearly Euclidean, so the logarithmic and exponential maps at the origin are close to the identity.

Table 7. Main benchmark: Poincaré component ablations on the test split (mean over five seeds with 95% t-interval).

{{TABLE:ablation}}

### 4.6 Disease–drug pilot and optimisation confounds

With matched optimisers, the pilot shows no clear geometry effect on accuracy (Table 8): Euclidean MRR is 0.074 [0.057, 0.091] and Poincaré MRR is 0.059 [0.036, 0.083], against about 0.014 for random ranking. An earlier version of this pilot trained the Euclidean model with Adam and the Poincaré model with full-batch Riemannian SGD, and reported a large apparent Euclidean advantage (MRR 0.107 versus 0.020) that disappears once the optimisers are matched.

An earlier configuration of the main benchmark had the opposite problem. With one full-batch gradient step per epoch for 24 epochs, the loss moved only from 0.4495 to 0.4486, and both geometries ranked the answers at chance level (3-hop MRR 0.009 and 0.011). A third, smaller trap appeared during tuning: on the tuning seed alone, Poincaré validation MRR exceeded Euclidean validation MRR by about 30% (0.068 versus 0.052; Table 10), but the difference did not persist across seeds. Each of these would have supported a misleading conclusion about geometry.

Table 8. Disease–drug pilot with matched optimisers (mean over five seeds with 95% t-interval; 16–23 test queries per seed).

{{TABLE:pilot}}

### 4.7 Relation-aware baselines and filtered ranking

Table 9 compares the relation-free retrievers with the relation-aware baselines. Relation modelling has a far larger effect than geometry. On 3-hop queries, the TransE- and MuRP-style models reach filtered MRR 0.256–0.278, against 0.125–0.157 for the relation-free retrievers, and lower HHR@1 to 0.303–0.344 (versus 0.553–0.694); all eight of these 3-hop differences are significant (Holm p < 0.01; 9–10 of 10 seeds). On 2-hop queries the relational models are also more accurate (filtered MRR 0.071–0.079 versus 0.043–0.054) but hallucinate *more* (HHR@1 0.194–0.417 versus 0.060–0.120): by modelling the *treats* relation they rank compounds that are not yet linked to the disease, which includes the held-out answer. Within the relational family, geometry again has no significant effect on 3-hop queries, but at *d* = 16 the MuRP-style model hallucinated 17.3 points fewer 2-hop top answers than the TransE-style model (95% CI [−0.234, −0.111], Holm p < 0.001, 10 of 10 seeds) with equal filtered MRR (+0.003, not significant). Filtered ranking raises 2-hop MRR by a factor of about 2–3 for every model, confirming that raw ranking penalised predictions of a disease's other true treatments. Path verification again lowered 3-hop HHR@1 to 0.026 for the relational models.

Table 9. Relation-aware baselines and filtered ranking (test split; mean over ten seeds with 95% t-interval; fMRR = filtered MRR; HHR@1 on the raw ranking).

{{TABLE:baselines}}

## 5. Discussion

**Geometry and hop hallucination.** Our results support a qualified version of the original hypothesis. Hyperbolic embeddings did not improve retrieval *accuracy* in any configuration, but at intermediate dimension (4–8) they made the ranking more *grounded*: fewer of the top-ranked compounds were unsupported by a real typed path, with no loss of accuracy. This fits the motivation for hyperbolic geometry. Curved space can keep path-connected neighbourhoods compact with few dimensions, so a query composed from connected entities lands closer to compounds that are reachable from it. The effect is modest, confined to a range of dimensions and, on 3-hop queries, significant in only one of eight pre-registered configurations. It also depends on the training budget: in the 60-epoch main benchmark, 2-hop Poincaré top answers were *less* often path-supported than Euclidean ones (HHR@1 0.170 versus 0.080; Table 7 reports the complementary path-supported rates of 0.830 and 0.920). In the relation-aware family the effect reappeared on 2-hop queries at *d* = 16 but not on 3-hop queries, so where it appears depends on the model. It should therefore be read as evidence that geometry *can* contribute to groundedness, not as a general guarantee.

**Geometry versus grounding.** Enforcing path support eliminates hop hallucination by design, whereas the best geometry choice reduced it by 14 points; the practical question is therefore what grounding costs. For a KG-RAG system whose main goal is to avoid ungrounded hops, structural grounding should therefore come first, and geometry is a secondary refinement. The two are complementary. Geometry shapes the order *within* supported and unsupported candidates, and it remains the only mechanism available when no supported candidate exists or when new links are sought.

**Relation modelling, groundedness and novelty.** The 2-hop task asks for a compound that treats a disease *without* the corresponding edge being observed. Relation-free models rank the disease's training-set compounds, which are also genuine treatments, first; this keeps their 2-hop HHR@1 low but is counted as error under raw ranking, and filtered ranking more than doubles their MRR. Relation-aware models generalise the *treats* relation and propose compounds that are not yet linked to the disease, as the held-out answers are: they are more accurate but return more unsupported answers. HHR@1 therefore exposes a trade-off between groundedness and novelty that accuracy alone hides, and a KG-RAG system should choose deliberately, applying path verification where ungrounded answers are unacceptable. On 3-hop queries, explicit relation modelling improved accuracy and groundedness at the same time, far more than any change of curvature.

**Methodological lessons.** Under-training made both geometries look identical at chance level, mismatched optimisers produced a spurious Euclidean advantage, and a single-seed comparison produced a spurious Poincaré advantage. Geometry comparisons should report matched optimisers, loss curves, a random-ranking reference, several seeds and paired differences, and claims about hallucination should be tested with a pre-registered analysis.

**Retrieval versus clinical evidence.** A path-supported, high-ranked compound in this benchmark is connected to the query in public association data. It is not evidence of therapeutic efficacy, and the 3-hop `binds` endpoint measures molecular connectivity rather than treatment. Our hallucination metrics measure graph groundedness, not medical truth.

## 6. Limitations

- **Graph-grounded definition of hallucination.** HHR@1 measures whether a retrieved answer is supported by a typed path in the training graph. It does not measure hallucination in generated text, and a supported answer is not necessarily correct.
- **Statistical scope.** On 3-hop queries only one of eight pre-registered comparisons was significant, and on the five never-inspected seeds alone its interval included zero. The clearer 2-hop effects are secondary outcomes, corrected within their own families but not across families.
- **One dataset, one scale.** All results come from one provenance-filtered subset of one KG, and the effects may differ on other graphs, relation types or larger subsets.
- **Restricted relations.** Excluding relations without explicit reusable licences reduces coverage and may remove hierarchical structure that would favour hyperbolic geometry.
- **Model family.** All models use distance-based embeddings with a fixed margin of 0.45. Our MuRP-style baseline omits MuRP's entity biases and logistic loss to keep the objective matched, and we do not evaluate attention-based models such as AttH [10], learnable curvature or mixed-curvature spaces [20]. The baseline comparison was added after the pre-registration and is secondary.
- **Tuning scope.** Learning rates were tuned on one seed and a small grid; the dimension, margin and epoch budget were fixed in advance.
- **Pilot size.** The pilot uses lexical token structure and has only 16–23 test queries per seed.
- **No generation evaluation.** We evaluate retrieval only. The effect on hallucination in generated answers requires a frozen generator and separate evaluation of citation correctness and groundedness.

## 7. Conclusion

We asked whether hyperbolic geometry reduces multi-hop hallucination in biomedical KG retrieval, and we tested it with matched training, leakage control and a pre-registered sweep. Hyperbolic embeddings did not make retrieval more accurate, but at intermediate dimension they made it more grounded. At dimension 8, Poincaré retrieval hallucinated 14 points fewer 3-hop top answers than Euclidean retrieval in every seed, and at dimensions 4–8 it consistently hallucinated fewer 2-hop answers, both at unchanged accuracy. Relation-aware baselines roughly doubled 3-hop filtered accuracy and halved 3-hop hop hallucination, and within that family hyperbolic geometry again reduced 2-hop hallucination at dimension 16. Explicit typed-path verification reduced hop hallucination much further for both geometries, but at the cost of novel-link discovery on 2-hop queries. Our answer to "geometry or grounding?" is therefore *grounding and relation modelling first, geometry as a modest complement*. We release the code, pre-registration, frozen query sets, per-query predictions, embeddings and result tables so that future methods can be evaluated for both accuracy and groundedness under the same controls.

## Data and code availability

All code, the pre-registration (`research/results/hallucination_sweep/preregistration.json`), the frozen query sets (`research/query_sets/`), per-seed embeddings, per-query predictions, aggregate metrics, sweep results and figures (`research/results/`, `research/paper/figures/`) are in the project repository (https://github.com/Saadia-Asghar/kg-rag-rmf-rag-research). The main benchmark is reproduced with `python research/scripts/run_main_rmf_rag_benchmark.py` and the sweep with `python research/scripts/run_hallucination_geometry_sweep.py`, after placing the official Hetionet v1.0 snapshot [18] at `research_data/hetionet/hetionet-v1.0.json.bz2` or setting `HETIONET_JSON_BZ2`. The automated test suite (10 tests) checks the geometry, optimisation, projection, relation filtering, split disjointness, leakage removal, query construction and ranking modes.

## Appendix A. Learning-rate selection (main benchmark)

Table 10. Validation MRR on the tuning seed (seed 7) for each geometry and learning rate. Test data were not used. Both geometries selected 0.1.

{{TABLE:tuning}}

## Appendix B. Validation results (main benchmark)

Table 11. Main benchmark validation accuracy (mean over five seeds with 95% t-interval).

{{TABLE:main_validation}}

## References

[1] P. Lewis, E. Perez, A. Piktus, F. Petroni, V. Karpukhin, N. Goyal, H. Küttler, M. Lewis, W. Yih, T. Rocktäschel, S. Riedel and D. Kiela. Retrieval-augmented generation for knowledge-intensive NLP tasks. In *Advances in Neural Information Processing Systems 33 (NeurIPS)*, 2020.

[2] D. Edge, H. Trinh, N. Cheng, J. Bradley, A. Chao, A. Mody, S. Truitt, D. Metropolitansky, R. O. Ness and J. Larson. From local to global: A graph RAG approach to query-focused summarization. *arXiv:2404.16130*, 2024.

[3] K. Soman, P. W. Rose, J. H. Morris, R. E. Akbas, B. Smith, B. Peetoom, C. Villouta-Reyes, G. Cerono, Y. Shi, A. Rizk-Jackson, S. Israni, C. A. Nelson, S. Huang and S. E. Baranzini. Biomedical knowledge graph-optimized prompt generation for large language models. *Bioinformatics*, 40(9):btae560, 2024.

[4] D. S. Himmelstein, A. Lizee, C. Hessler, L. Brueggeman, S. L. Chen, D. Hadley, A. Green, P. Khankhanian and S. E. Baranzini. Systematic integration of biomedical knowledge prioritizes drugs for repurposing. *eLife*, 6:e26726, 2017. https://doi.org/10.7554/eLife.26726

[5] M. Nickel and D. Kiela. Poincaré embeddings for learning hierarchical representations. In *Advances in Neural Information Processing Systems 30 (NeurIPS)*, 2017.

[6] D. Krioukov, F. Papadopoulos, M. Kitsak, A. Vahdat and M. Boguñá. Hyperbolic geometry of complex networks. *Physical Review E*, 82(3):036106, 2010.

[7] R. Sarkar. Low distortion Delaunay embedding of trees in hyperbolic plane. In *Graph Drawing: 19th International Symposium (GD 2011)*, Eindhoven, The Netherlands, 2011.

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

[18] D. S. Himmelstein. dhimmel/hetionet v1.0.0: Hetionet v1.0 in JSON, TSV, and Neo4j formats. Zenodo, 2017. doi:10.5281/zenodo.268568

[19] X. Bouthillier, P. Delaunay, M. Bronzi, A. Trofimov, B. Nichyporuk, J. Szeto, N. Sepah, E. Raff, K. Madan, V. Voleti, S. E. Kahou, V. Michalski, D. Serdyuk, T. Arbel, C. Pal, G. Varoquaux and P. Vincent. Accounting for variance in machine learning benchmarks. In *Proceedings of Machine Learning and Systems (MLSys)*, 2021.

[20] A. Gu, F. Sala, B. Gunel and C. Ré. Learning mixed-curvature representations in product spaces. In *International Conference on Learning Representations (ICLR)*, 2019.

[21] L. Cao, R. Wang, J. Li, Z. Zhou and M. Yang. HyperbolicRAG: Enhancing retrieval-augmented generation with hyperbolic representations. *arXiv:2511.18808*, 2025.

[22] H. Madhu, N. Bui, A. Maatouk, L. Tassiulas, S. Krishnaswamy, M. Yang, S. Ganguly, K. Srinivasan and R. Ying. HypRAG: Hyperbolic dense retrieval for retrieval augmented generation. *arXiv:2602.07739*, 2026.

[23] C. Zhou, J. Dong, Y. Xiao, S. Chen, S. Dong, D. Yin, X. Sun, Z. Xu and X. Huang. Query-aware knowledge retrieval via hyperbolic structuring. In *Proceedings of the 64th Annual Meeting of the Association for Computational Linguistics (ACL)*, pages 21601–21614, 2026.

[24] erolatik. disease-drug-dataset. Kaggle. https://www.kaggle.com/datasets/erolatik/disease-drug-dataset (accessed 1 September 2026).
