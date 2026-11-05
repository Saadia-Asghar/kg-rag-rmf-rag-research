# Geometry or Grounding? Hyperbolic Embeddings and Multi-Hop Hallucination in Biomedical Knowledge-Graph Retrieval

%author: Saadia Asghar | Faculty of Computer Science and Engineering | Ghulam Ishaq Khan Institute of Engineering Sciences and Technology | Topi, Khyber Pakhtunkhwa, Pakistan
%author: Zakarya Ahmed | Faculty of Computer Science and Engineering | Ghulam Ishaq Khan Institute of Engineering Sciences and Technology | Topi, Khyber Pakhtunkhwa, Pakistan

!abstract: Knowledge-graph retrieval-augmented generation (KG-RAG) can hallucinate across hops: a multi-hop retriever may return an entity that no real chain of relations connects to the question. Hyperbolic embeddings have been proposed as a remedy, but this has rarely been tested under controlled conditions. Adapting path-grounded notions of hallucination to retrieval, we measure a hop-hallucination rate (HHR@1), the fraction of queries whose top-ranked answer has no exact typed path from the query in the training graph, and compare Euclidean and Poincaré retrievers trained with identical triplets, mini-batches, negatives and epochs and validation-selected learning rates on leakage-controlled 2-hop and 3-hop gene–disease–compound tasks from Hetionet v1.0. In a pre-registered sweep over dimension (2–16), curvature (1, 10) and ten seeds, Poincaré geometry reduced 3-hop hop hallucination at dimension 8 (HHR@1 0.553 vs. 0.694; Holm-adjusted p = 0.030; lower in 10 of 10 seeds) with unchanged accuracy; the other seven pre-registered comparisons were not significant, and on 2-hop queries dimensions 4 and 8 hallucinated 3–6 points less (Holm p < 0.02). Relation-aware TransE- and MuRP-style baselines roughly doubled 3-hop filtered MRR (0.256–0.278 vs. 0.125–0.157) and lowered 3-hop HHR@1 to 0.303–0.344; within this family, hyperbolic geometry again lowered 2-hop hallucination at dimension 16 (−0.173; 10 of 10 seeds) at equal filtered MRR. Enforcing path support by reranking removes hop hallucination by construction (3-hop HHR@1 0.026, the share of queries with no supported candidate); it changes 3-hop MRR by −0.013 to +0.015 for dimensions 4–16 but lowers 2-hop MRR by 29–62%. Relation-aware scoring and structural grounding matter more than curvature, which gives a modest, model- and dimension-dependent reduction in hop hallucination. We also document how under-training and mismatched optimisers manufactured or hid geometry effects in our own earlier runs.

!keywords: knowledge graphs, retrieval-augmented generation, hallucination, hyperbolic embeddings, Poincaré ball, biomedical retrieval, multi-hop reasoning, reproducibility

## Introduction

Retrieval-augmented generation (RAG) grounds language-model output in retrieved knowledge and was shown to generate more specific and factual text than a parametric-only model [1]. When the knowledge source is a graph, retrieval must follow relational paths, which has motivated graph-based RAG [2] and biomedical KG-augmented prompting [3]. Multi-hop retrieval, however, introduces its own failure mode. A retriever asked which compound acts on a gene associated with a disease may return a compound that is close to the query in embedding space but connected to it by no real chain of relations. Following path-grounded notions of hallucination in KG-grounded dialogue [24] and faithful KG reasoning [25], [26], we call this a **hop hallucination**. The answer looks plausible, yet the path that would justify it does not exist, and in a RAG system it becomes ungrounded context for the generator.

Hyperbolic geometry is a natural candidate remedy. Hyperbolic space grows exponentially with radius, so trees and hierarchies embed with low distortion [6], [7], and Poincaré embeddings [5] and hyperbolic KG embeddings [9], [10] have outperformed Euclidean counterparts, with the largest gains reported at low dimension [9], [10]; hyperbolic neural networks match or outperform their Euclidean variants on several tasks [8]. If curved space preserves multi-hop structure better, a hyperbolic retriever should place path-connected answers closer to the query and hallucinate fewer hops.

Testing this fairly is difficult. Changing the geometry usually also changes the optimiser, effective learning rate, training budget or negative sampling, and KG-embedding results are highly sensitive to such choices [15], [16]. Single-seed comparisons can be dominated by random variation [19], and multi-hop evaluation risks answer leakage. We therefore ask: *under matched, leakage-controlled conditions, does Poincaré geometry reduce multi-hop hallucination in biomedical KG retrieval, and how does it compare with explicit structural grounding?* Our contributions are:

- a rank-based adaptation of path-grounded hallucination [24]–[26] to embedding retrievers (HHR@1, Unsupported@10), always reported alongside accuracy;
- a controlled framework (RMF-RAG) in which Euclidean and Poincaré retrievers share identical triplets, mini-batches, negatives and epochs, evaluated on a leakage-controlled Hetionet v1.0 benchmark;
- a pre-registered sweep over dimension, curvature and ten seeds showing a modest, dimension-dependent reduction in hop hallucination from hyperbolic geometry at unchanged accuracy;
- relation-aware TransE- and MuRP-style baselines under the standard filtered ranking protocol, testing whether the geometry effect generalises beyond relation-free retrievers;
- a measurement of the accuracy cost of enforcing path support by reranking, which removes hop hallucination by construction;
- a case study of two optimisation confounds that, consistent with [15], [16], would otherwise have produced misleading geometry conclusions.

## Related Work

*Retrieval-augmented generation.* RAG couples a generator with non-parametric retrieval [1]. GraphRAG summarises entity graphs for query-focused summarisation [2], and biomedical KG-RAG retrieves context from a curated KG to improve LLM answers [3]. These systems rely on retrieved graph context being connected to the question; HHR@1 measures when it is not, at retrieval time, before any text is generated.

*Path-grounded hallucination.* Neural Path Hunter [24] treats a dialogue response as hallucinated when its claims are not supported by paths in a KG neighbourhood, and RoG [25] and graph-constrained reasoning (GCR) [26] make LLM reasoning faithful by restricting it to paths that exist in the KG. We apply the same path criterion to the *ranked output of embedding retrievers* rather than to generated text, and our typed-path verification is a simple instance of the graph-constrained idea in [26].

*KG embeddings and multi-hop queries.* TransE [12] embeds entities so that true triples are close, and query-embedding methods such as GQE [13] and Query2box [14] compose embeddings along relational paths without traversing them, so their answers need not be path-supported. Re-evaluations show that training configuration often matters as much as architecture [15], [16].

*Hyperbolic representations.* Real networks can have latent hyperbolic geometry [6]. Poincaré embeddings trained with Riemannian SGD [5], [11] were followed by hyperbolic neural networks [8], MuRP [9], AttH [10] and mixed-curvature spaces [20]. These works evaluate link-prediction accuracy. Recent hyperbolic RAG systems, HyperbolicRAG [21], HypRAG [22] and HyperRAG [23], report better retrieval or answer quality, and [21], [22] cite hallucination as motivation, but, to our knowledge, none measures unsupported multi-hop answers against a Euclidean counterpart trained under matched conditions.

*Biomedical KGs.* Hetionet integrates 29 public resources into 47,031 nodes and 2,250,197 relationships [4], [18]. Bonner *et al.* [17] review public datasets for building drug-discovery KGs; we additionally restrict ours to relations whose reuse licence is recorded in Hetionet's edge metadata.

## Methodology

Fig. 1 summarises the evaluation pipeline.

{{FIGURE:ieee_fig_pipeline.png|RMF-RAG evaluation pipeline. Both retrievers receive identical triplets, mini-batches, negatives and epochs; learning rates are selected on validation data only; validation and test answer edges are removed before training.}}

### Data and Relation Filtering

We use the official Hetionet v1.0 snapshot [18], whose release archive matches the MD5 checksum published on Zenodo; the SHA-256 of the extracted file is recorded with every run. To keep every relation traceable to a reusable source, we retain only edges whose licence, as recorded in Hetionet's edge metadata, permits reuse: Gene–Disease *associates* edges from DISEASES (CC BY 4.0; 3,200), Disease–Compound *treats*/*palliates* edges from PharmacotherapyDB (CC0; 1,145) and Gene–Compound *binds* edges from DrugCentral (CC BY 4.0; 823). The graph has 3,039 nodes: 2,240 genes, 133 diseases and 666 compounds.

### Tasks and Leakage Control

Every query ranks all 666 compounds. In the **2-hop** task, given a gene *g* and an associated disease *d*, retrieve a compound *c* that treats or palliates *d*. In the **3-hop** task, given *g*, *d* and a bridge gene *g′* associated with *d*, retrieve a compound *c* that binds *g′*. Terminal answer edges are split per seed (Disease–Compound within each disease, 15%/15% validation/test; Gene–Compound globally, 10%/10%), and **all validation and test answer edges are removed from the training graph** before training and path verification. Gene–Disease edges only provide query context and are not held out. Queries are capped at 500 per task, split and seed and frozen to JSONL.

### Retrievers and Training

Each node has a trainable embedding initialised from N(0, 0.01²). The Euclidean retriever uses L2 distance and SGD. The Poincaré retriever lives in the ball of radius 1/√c and uses the geodesic distance d_c(x, y) = c^(−1/2) arcosh(1 + 2c‖x − y‖² / ((1 − c‖x‖²)(1 − c‖y‖²))). Its Euclidean gradients are rescaled by ((1 − c‖x‖²)/2)² (Riemannian SGD [5], [11]), and the points are projected back into the ball after each step. Both minimise max(0, γ + d(a, p) − d(a, n)) with γ = 0.45 over every directed training edge, with one type-matched, non-neighbouring negative per positive. **Both receive identical triplets in identical mini-batch order** (batch size 256). A query embedding is a hop-weighted combination of the query entities, with weights (0.5, 1) for (*g*, *d*) and (1/3, 1/2, 1) for (*g*, *d*, *g′*), formed in Euclidean space or, for Poincaré, in the tangent space at the origin via the logarithmic and exponential maps. An identifier-only TF-IDF ranker serves as a non-learned baseline.

### Hop Hallucination and Path Verification

A compound is *path-supported* if an exact typed path links it to the query in the training graph: a *treats*/*palliates* edge from *d* (2-hop), or a *binds* edge to any gene associated with *d* (3-hop). **HHR@1** is the fraction of queries whose top-ranked compound is unsupported, and **Unsupported@10** is the mean unsupported fraction of the top 10. Because held-out answer edges are removed, the correct 2-hop answer is never supported. HHR therefore measures *groundedness*, not correctness, and is always read with MRR and Recall@k. *Typed-path verification* reranks supported compounds first while keeping the geometric order within each group.

### Experimental Protocol

**Main benchmark.** 16 dimensions, curvature 1, 60 epochs and seeds {7, 17, 29, 43, 101}. The learning rate is selected separately for each geometry from {0.03, 0.1, 0.3, 1, 3} on seed-7 validation MRR; both selected 0.1. Ablations remove geodesic ranking, hop weighting or tangent-space composition, or add path verification.

**Pre-registered sweep.** Exploratory analysis of the main benchmark suggested more path-supported 3-hop answers for Poincaré retrieval. Before training any sweep model, we saved a pre-registration fixing the hypothesis, configurations, metrics and tests. The sweep trains Euclidean models with *d* ∈ {2, 4, 8, 16} and Poincaré models with the same *d* and *c* ∈ {1, 10} for 150 epochs. The learning rate of each configuration is selected from {0.1, 0.3, 1} on seed-7 validation MRR. Each configuration is evaluated over ten seeds, five of them never inspected before. The **primary test** compares each of the 8 Poincaré configurations with the Euclidean model of the same dimension using a two-sided paired t-test over seeds on 3-hop test HHR@1, with Holm–Bonferroni correction (α = 0.05). Secondary outcomes (2-hop HHR@1, Unsupported@10, MRR) are corrected within their own families.

**Relation-aware baselines (additional analysis).** To test whether the conclusions hold for stronger models, we add TransE-style [12] and MuRP-style [9] retrievers that learn one transformation per directed relation type: d(h, r, t) = ‖e_h + w_r − e_t‖ in Euclidean space, and d(h, r, t) = d_B(exp_0(R_r log_0(e_h)), e_t ⊕ w_r) in the Poincaré ball, with Möbius addition ⊕ and a diagonal matrix R_r. To keep training matched they use the same margin loss, triplets, mini-batches and 150 epochs as the sweep (MuRP's entity biases and logistic loss are omitted), and they score only the final hop: (*d*, treats/palliates, ?) for 2-hop and (*g′*, binds, ?) for 3-hop queries. They therefore differ from the relation-free retrievers in two ways, relation-specific transformations and final-hop scoring instead of hop-weighted composition of all query entities, and the comparison does not separate the two. Each method selects its learning rate per dimension (8, 16) from {0.1, 0.3, 1} on seed-7 validation MRR; the relation-free models selected the same rates as in the sweep and reproduced its results exactly. This analysis was added after the pre-registered sweep and is reported as secondary.

**Metrics.** Recall@k and MRR use raw ranking over all 666 candidates and, for the baseline comparison, also the standard filtered ranking [12], which removes the other known true answers of the final hop (in any split) before ranking the target. Random raw ranking gives Recall@10 = 0.015 and MRR = H₆₆₆/666 ≈ 0.011. HHR@1 is always computed on the raw ranking, i.e. on what the system returns. Intervals are two-sided 95% t-intervals across seeds.

## Results

### Training and Accuracy

In the main benchmark, the loss fell from 0.448 to about 0.335 for both geometries with nearly identical curves. Both geometries learn the 3-hop task far above random ranking (Table I): MRR is 0.095 for Euclidean and 0.091 for Poincaré retrieval, against 0.011 for random ranking. 2-hop accuracy is only marginally above random (Section V). Paired accuracy differences between the geometries were not significant for any task or metric.

{{TABLE:accuracy|Main Benchmark Test Accuracy (d = 16, Five Seeds, Mean ± 95% CI Half-Width)}}

### Hop Hallucination Across Dimensions

Fig. 2, Fig. 3 and Tables II–III report the pre-registered sweep. **At d = 2 both geometries fail.** 3-hop MRR is 0.021–0.035, barely above random, and over 90% of top-ranked 3-hop answers are unsupported. **At intermediate dimension, Poincaré geometry can reduce hop hallucination.** In the primary test, the Poincaré retriever with *d* = 8 and *c* = 1 hallucinated fewer 3-hop top answers than its Euclidean counterpart: HHR@1 0.553 vs. 0.694, a difference of −0.141 (95% CI [−0.224, −0.059], Holm p = 0.030), lower in all 10 seeds. MRR was unchanged (0.079 vs. 0.080). The other seven primary comparisons were not significant. On the five never-inspected seeds alone, the difference was −0.114 and lower in all five, but not significant on its own. On 2-hop queries, Poincaré embeddings with *d* ∈ {4, 8} reduced HHR@1 by 3.4–6.0 points (Holm p < 0.02; 8–10 of 10 seeds) with |ΔMRR| ≤ 0.002. **At d = 16 the advantage fades**: no HHR@1 difference is significant, and 2-hop Unsupported@10 is slightly higher for Poincaré retrieval. Higher curvature (*c* = 10) pushed embeddings closer to the boundary of the ball but did not increase the benefit.

{{FIGURE:ieee_fig_hhr.png|Hop-hallucination rate HHR@1 against embedding dimension (mean and 95% CI over ten seeds; lower is better).}}

{{FIGURE:ieee_fig_mrr.png|Accuracy (MRR) against embedding dimension; the dotted line marks random ranking. Where Poincaré retrieval hallucinates significantly less (Fig. 2), its MRR is not significantly lower.}}

{{TABLE:sweep|Sweep Test Results (Ten Seeds, Mean ± 95% CI Half-Width); E = Euclidean, P = Poincaré}}

{{TABLE:paired|Paired Differences, Poincaré − Euclidean at Equal d (Ten Seeds). Negative ΔHHR@1 = Fewer Hallucinations; Parentheses: Seeds Lower}}

### Relation-Aware Baselines and Filtered Ranking

Table IV compares the relation-free retrievers with the relation-aware baselines. Relation-aware final-hop scoring has a far larger effect than geometry. On 3-hop queries, the TransE- and MuRP-style models reach filtered MRR 0.256–0.278, against 0.125–0.157 for the relation-free retrievers, and lower HHR@1 to 0.303–0.344 (vs. 0.553–0.694); all eight of these 3-hop differences are significant (Holm p < 0.01; 9–10 of 10 seeds). On 2-hop queries the relational models are also more accurate (filtered MRR 0.071–0.079 vs. 0.043–0.054) but hallucinate *more* (HHR@1 0.194–0.417 vs. 0.060–0.120): a plausible reason is that, by modelling the treatment relation, they rank compounds not yet linked to the disease, which includes the held-out answer. Within the relational family, geometry again has no significant effect on 3-hop queries, but at *d* = 16 the MuRP-style model hallucinated 17.3 points fewer 2-hop top answers than the TransE-style model (95% CI [−0.234, −0.111], Holm p < 0.001, 10 of 10 seeds) with equal filtered MRR (+0.003, not significant). Filtered ranking raises 2-hop MRR by a factor of about 2–3 for every model, confirming that raw ranking penalised predictions of a disease's other true treatments.

{{TABLE:baselines|Relation-Free vs. Relation-Aware (TransE-/MuRP-Style) Retrievers (Ten Seeds, Mean ± 95% CI Half-Width); fMRR = Filtered MRR; HHR@1 on Raw Ranking}}

### Grounding by Typed-Path Verification

Because HHR@1 is defined by path support, promoting supported compounds removes hop hallucination by construction: 3-hop HHR@1 falls to 0.026 for every model (the remaining queries have no supported candidate at all) and 2-hop HHR@1 to 0. The informative result is its cost. On 3-hop queries it changes MRR by −0.013 to +0.015 for every model with *d* ≥ 4 (main benchmark: 0.092 with verification vs. 0.091 without; Table V) and raises it by 0.04–0.05 for the weak *d* = 2 models. On 2-hop queries it lowers MRR by 29–62% across all models (main benchmark: 0.019 to 0.010), because the held-out answer is never path-supported. Grounding therefore prevents hallucination but also blocks discovery of new links.

{{TABLE:grounding|Main Benchmark Ablations and Grounding (d = 16, Five Seeds, Means); HHR@1 = 1 − Top-1 Path-Supported Rate}}

### Ablations and Optimisation Confounds

Hop weighting is the only composition component with a clear effect: removing it lowers 3-hop MRR from 0.091 to 0.070. Geodesic ranking and tangent-space composition change nothing at three decimals, consistent with the main-benchmark embeddings staying below norm 0.30, where the ball is nearly Euclidean. Three confounds would have misled us. A pilot on 1,000 disease–drug question–answer pairs from a public Kaggle dataset [27], which trained the Euclidean model with Adam and the Poincaré model with full-batch Riemannian SGD showed a spurious Euclidean advantage (MRR 0.107 vs. 0.020) that vanished with matched optimisers (0.074 vs. 0.059). An under-trained configuration (24 full-batch steps; loss 0.4495 → 0.4486) put both geometries at chance level. A single-seed validation comparison favoured Poincaré retrieval by about 30% but did not replicate across seeds.

## Discussion

*Geometry.* Hyperbolic embeddings did not significantly improve accuracy in any configuration, but at intermediate dimension they made rankings more grounded. One explanation, which we did not test directly, is that curved space keeps path-connected neighbourhoods compact in few dimensions, so that a query composed from connected entities lands nearer to reachable compounds. The effect is modest, confined to *d* = 4–8 and, on 3-hop queries, significant in one of eight pre-registered configurations. It also depends on the training budget: in the 60-epoch main benchmark, 2-hop Poincaré answers were *less* often supported than Euclidean ones (HHR@1 0.170 vs. 0.080; Table V). In the relation-aware family the effect reappeared on 2-hop queries at *d* = 16 but not on 3-hop queries, so where it appears depends on the model. This is evidence that geometry *can* contribute to groundedness, not a general guarantee.

*Geometry versus grounding.* Enforcing path support eliminates hop hallucination by design, whereas the best geometry reduced it by 14 points; the practical question is therefore what grounding costs. For KG-RAG systems whose priority is to avoid ungrounded hops, structural grounding should come first, with geometry as a secondary refinement. Geometry still orders candidates within each group and is the only mechanism available when no supported candidate exists or new links are sought.

*Relation modelling, groundedness and novelty.* Relation-aware final-hop scoring improved accuracy far more than changing curvature and, on 3-hop queries, also roughly halved hop hallucination. On 2-hop queries the same models returned more unsupported compounds, plausibly because a model that generalises the treatment relation proposes links that are not yet in the graph, as the held-out answers are. HHR@1 thus exposes a trade-off between groundedness and novelty that accuracy alone hides; a KG-RAG system should choose deliberately and apply path verification where ungrounded answers are unacceptable.

*Limitations.* HHR@1 measures graph groundedness, not hallucination in generated text, and a supported answer is not necessarily correct or clinically meaningful (*binds* measures molecular connectivity, not treatment). On 3-hop queries only one pre-registered comparison was significant, and the 2-hop effects are secondary outcomes. All results come from one licence-filtered subset of one KG, use distance-based embeddings with a fixed margin and learning rates tuned on one seed, and do not evaluate generation. Our MuRP-style baseline omits MuRP's entity biases and logistic loss to keep the objective matched, we do not evaluate attention-based models such as AttH [10], and the baseline comparison was added after the pre-registration.

## Conclusion

We tested whether hyperbolic geometry reduces multi-hop hallucination in biomedical KG retrieval, using matched training, leakage control and a pre-registered sweep. Hyperbolic embeddings did not make retrieval more accurate, but at intermediate dimension they made it more grounded. At *d* = 8, Poincaré retrieval hallucinated 14 points fewer 3-hop top answers in every seed, and at *d* = 4–8 it consistently hallucinated fewer 2-hop answers, both at unchanged accuracy. Relation-aware baselines roughly doubled 3-hop filtered accuracy and roughly halved 3-hop hop hallucination, and within that family hyperbolic geometry again reduced 2-hop hallucination at *d* = 16. Enforcing path support removes hop hallucination by construction, at little cost on 3-hop queries but at the cost of novel-link discovery on 2-hop queries. Our answer to “geometry or grounding?” is *grounding and relation modelling first, geometry as a modest complement*. Code, the pre-registration, frozen query sets, predictions and results are available at https://github.com/Saadia-Asghar/kg-rag-rmf-rag-research (branch complete-rmf-rag-research).

## *Acknowledgment

The authors thank Prof. Shahabuddin Ansari, Ghulam Ishaq Khan Institute of Engineering Sciences and Technology, for supervising this research.

## *References

[1] P. Lewis *et al.*, “Retrieval-augmented generation for knowledge-intensive NLP tasks,” in *Proc. Adv. Neural Inf. Process. Syst. (NeurIPS)*, vol. 33, 2020, pp. 9459–9474.

[2] D. Edge *et al.*, “From local to global: A graph RAG approach to query-focused summarization,” arXiv:2404.16130, 2024.

[3] K. Soman *et al.*, “Biomedical knowledge graph-optimized prompt generation for large language models,” *Bioinformatics*, vol. 40, no. 9, Art. no. btae560, 2024.

[4] D. S. Himmelstein *et al.*, “Systematic integration of biomedical knowledge prioritizes drugs for repurposing,” *eLife*, vol. 6, Art. no. e26726, 2017.

[5] M. Nickel and D. Kiela, “Poincaré embeddings for learning hierarchical representations,” in *Proc. Adv. Neural Inf. Process. Syst. (NeurIPS)*, vol. 30, 2017, pp. 6338–6347.

[6] D. Krioukov, F. Papadopoulos, M. Kitsak, A. Vahdat, and M. Boguñá, “Hyperbolic geometry of complex networks,” *Phys. Rev. E*, vol. 82, no. 3, Art. no. 036106, 2010.

[7] R. Sarkar, “Low distortion Delaunay embedding of trees in hyperbolic plane,” in *Proc. 19th Int. Symp. Graph Drawing (GD)*, Eindhoven, The Netherlands, 2011.

[8] O.-E. Ganea, G. Bécigneul, and T. Hofmann, “Hyperbolic neural networks,” in *Proc. Adv. Neural Inf. Process. Syst. (NeurIPS)*, vol. 31, 2018, pp. 5345–5355.

[9] I. Balažević, C. Allen, and T. Hospedales, “Multi-relational Poincaré graph embeddings,” in *Proc. Adv. Neural Inf. Process. Syst. (NeurIPS)*, vol. 32, 2019, pp. 4463–4473.

[10] I. Chami, A. Wolf, D.-C. Juan, F. Sala, S. Ravi, and C. Ré, “Low-dimensional hyperbolic knowledge graph embeddings,” in *Proc. 58th Annu. Meeting Assoc. Comput. Linguistics (ACL)*, 2020, pp. 6901–6914.

[11] S. Bonnabel, “Stochastic gradient descent on Riemannian manifolds,” *IEEE Trans. Autom. Control*, vol. 58, no. 9, pp. 2217–2229, Sep. 2013.

[12] A. Bordes, N. Usunier, A. Garcia-Durán, J. Weston, and O. Yakhnenko, “Translating embeddings for modeling multi-relational data,” in *Proc. Adv. Neural Inf. Process. Syst. (NeurIPS)*, vol. 26, 2013, pp. 2787–2795.

[13] W. L. Hamilton, P. Bajaj, M. Zitnik, D. Jurafsky, and J. Leskovec, “Embedding logical queries on knowledge graphs,” in *Proc. Adv. Neural Inf. Process. Syst. (NeurIPS)*, vol. 31, 2018, pp. 2026–2037.

[14] H. Ren, W. Hu, and J. Leskovec, “Query2box: Reasoning over knowledge graphs in vector space using box embeddings,” in *Proc. Int. Conf. Learn. Represent. (ICLR)*, 2020.

[15] M. Ali *et al.*, “Bringing light into the dark: A large-scale evaluation of knowledge graph embedding models under a unified framework,” *IEEE Trans. Pattern Anal. Mach. Intell.*, vol. 44, no. 12, pp. 8825–8845, Dec. 2022.

[16] D. Ruffinelli, S. Broscheit, and R. Gemulla, “You CAN teach an old dog new tricks! On training knowledge graph embeddings,” in *Proc. Int. Conf. Learn. Represent. (ICLR)*, 2020.

[17] S. Bonner *et al.*, “A review of biomedical datasets relating to drug discovery: A knowledge graph perspective,” *Briefings Bioinf.*, vol. 23, no. 6, Art. no. bbac404, 2022.

[18] D. S. Himmelstein, “dhimmel/hetionet v1.0.0: Hetionet v1.0 in JSON, TSV, and Neo4j formats,” Zenodo, 2017, doi: 10.5281/zenodo.268568.

[19] X. Bouthillier *et al.*, “Accounting for variance in machine learning benchmarks,” in *Proc. Mach. Learn. Syst. (MLSys)*, vol. 3, 2021.

[20] A. Gu, F. Sala, B. Gunel, and C. Ré, “Learning mixed-curvature representations in product spaces,” in *Proc. Int. Conf. Learn. Represent. (ICLR)*, 2019.

[21] L. Cao, R. Wang, J. Li, Z. Zhou, and M. Yang, “HyperbolicRAG: Enhancing retrieval-augmented generation with hyperbolic representations,” arXiv:2511.18808, 2025.

[22] H. Madhu *et al.*, “HypRAG: Hyperbolic dense retrieval for retrieval augmented generation,” arXiv:2602.07739, 2026.

[23] C. Zhou *et al.*, “Query-aware knowledge retrieval via hyperbolic structuring,” in *Proc. 64th Annu. Meeting Assoc. Comput. Linguistics (ACL)*, 2026, pp. 21601–21614.

[24] N. Dziri, A. Madotto, O. Zaïane, and A. J. Bose, “Neural path hunter: Reducing hallucination in dialogue systems via path grounding,” in *Proc. Conf. Empirical Methods Natural Lang. Process. (EMNLP)*, 2021.

[25] L. Luo, Y.-F. Li, G. Haffari, and S. Pan, “Reasoning on graphs: Faithful and interpretable large language model reasoning,” in *Proc. Int. Conf. Learn. Represent. (ICLR)*, 2024.

[26] L. Luo, Z. Zhao, G. Haffari, Y.-F. Li, C. Gong, and S. Pan, “Graph-constrained reasoning: Faithful reasoning on knowledge graphs with large language models,” in *Proc. Int. Conf. Mach. Learn. (ICML)*, 2025.

[27] erolatik, “disease-drug-dataset,” Kaggle. [Online]. Available: https://www.kaggle.com/datasets/erolatik/disease-drug-dataset (accessed Sep. 1, 2026).
