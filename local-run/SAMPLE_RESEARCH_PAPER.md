# Evaluating Hyperbolic Embeddings for Disease Drug Retrieval

**Sample manuscript for supervisor review. Author names, affiliation, and target venue must be supplied before submission.**

## Abstract

We evaluate a small hyperbolic graph-retrieval implementation on a public disease–drug dataset and examine how evaluation coverage changes its apparent performance. The dataset contains 1,000 records and 880 normalized unique disease–drug pairs. For each of five random seeds, one drug link is withheld from each of 182 diseases having multiple observed drugs. We compare lexical token overlap, Euclidean graph embeddings, and Poincaré-distance graph embeddings. The original seed-17 experiment evaluates 19 token-recoverable links and gives Recall@5 of 47.37%, 0%, and 21.05%, respectively. Repeating the experiment across five seeds yields mean Recall@5 of 43.37%, 12.71%, and 19.08% on the selected recoverable subsets. When all 182 held-out links per seed are included and targets absent from the training vocabulary count as misses, mean Recall@5 falls to 4.62%, 2.20%, and 2.64%. The hyperbolic variant therefore exceeds the Euclidean variant on mean Recall@5 in this implementation but underperforms the lexical baseline. Unequal training budgets, a small selected subset, synthetic token bridges, and incomplete candidate coverage prevent attributing the differences to geometry alone. This study provides a reproducible pilot audit; it does not establish a novel RAG architecture, biomedical reasoning capability, or superiority to published systems.

**Keywords:** hyperbolic embeddings; graph retrieval; evaluation coverage; reproducibility; disease–drug dataset.

## 1 Introduction

The original experiment appears favorable to hyperbolic embeddings when compared only with its Euclidean baseline: four of nineteen held-out answers appear in the hyperbolic top five, while none appear in the Euclidean top five. However, a lexical baseline retrieves nine of those same nineteen answers. These counts motivate a broader evaluation rather than a general accuracy claim.

We investigate two questions. First, does the ordering of the three included methods persist across random seeds? Second, how much does restricting evaluation to token-recoverable links change the reported retrieval score? The study focuses on the executable disease–drug pilot in the supplied repository [1]. It makes three limited contributions: an independent local reproduction of its saved seed-17 metrics, a five-seed audit with a full held-out denominator, and an interactive interface that exposes the actual model rankings and hidden dataset answers.

These contributions concern evaluation and reproducibility. They do not constitute evidence that hyperbolic retrieval itself is new. Moreover, the implementation performs entity ranking without an LLM generation stage; the repository label RMF-RAG should not be read as confirmation that the complete proposed RAG architecture has been implemented.

## 2 Related work and scope

Hyperbolic knowledge graph embeddings precede this pilot. MuRP embeds multi-relational data in the Poincaré ball [2], and low-dimensional hyperbolic knowledge graph models have been studied for link prediction [3]. More directly related work includes HyperbolicRAG, which combines hierarchical hyperbolic representations with retrieval [4], and HyperRAG, which uses hyperbolic structuring for query-aware retrieval [5]. These works rule out treating the broad combination of hyperbolic geometry and retrieval as a new contribution.

The repository also discusses D-RAG [6], SG-RAG [7], and KG2RAG [8], among other systems. Their tasks and evaluation protocols differ from this disease–drug link-ranking pilot. We have not executed their implementations in the present study. Consequently, their published QA scores are not placed in the same numerical comparison table as our Recall@5 results. A defensible future comparison would run applicable systems on shared data, splits, answer sets, and scoring rules.

This focused literature check is not an exhaustive novelty assessment. Any proposed new mechanism would require a closer comparison of its equations, implementation, and experimental role with prior work before submission.

## 3 Data and graph construction

The source is the disease–drug dataset by erolatik distributed through Kaggle [9], with a snapshot included in the repository. The input contains 1,000 records. Disease and drug text is lowercased, punctuation is normalized, and duplicate pairs are removed, leaving 880 unique pairs. Dataset recommendations are treated as recorded labels, not independently adjudicated medical ground truth.

The graph contains disease nodes, drug nodes, and nodes representing disease-name tokens. Tokens shorter than four characters and a fixed stopword list are excluded. A training pair creates a disease–drug edge, disease–token edges, and token–drug edges. Token bridges allow related disease names to share drug neighborhoods. These bridges are a modeling construction; they are not curated gene, molecular, or therapeutic relations.

The seed-17 graph has 1,652 nodes and 3,138 undirected adjacency edges derived from 698 retained disease–drug pairs. The dataset contains no gene nodes or gold gene–disease–drug reasoning paths. Therefore, a claim about biological multi-hop reasoning cannot be evaluated with this graph alone.

## 4 Methods

### 4.1 Held-out protocol

For each disease having at least two recorded drugs, one drug is chosen using a seeded random generator and its direct pair is withheld. This produces 182 held-out links per seed. All graph edges are then constructed from retained training pairs. The candidate set is the set of drugs observed in those training pairs.

The original evaluation includes a held-out pair only when its drug remains in the candidate set and there is a shared disease-name-token route to that drug in the training data. We call this the recoverable subset. Across seeds 7, 17, 29, 43, and 101, the subset contains 23, 19, 16, 18, and 21 queries, respectively. It is a deliberately selected subset rather than the full test population.

Our audit also scores all 182 held-out pairs. Between 90 and 96 target drugs per seed are absent from the training vocabulary. Such cases receive zero reciprocal rank and zero recall credit, while remaining in the denominator. These failures measure coverage limitations of the end-to-end candidate pipeline, rather than ranking error among available candidates.

### 4.2 Lexical baseline

For a query disease and candidate drug, the lexical method computes Jaccard token overlap with each training disease associated with that drug and retains the maximum. Candidates are sorted by decreasing overlap with alphabetical tie breaking. This method is not BM25 and does not use a pretrained text embedding model.

### 4.3 Euclidean embeddings

The Euclidean model learns eight-dimensional vectors using a margin-based positive-versus-negative edge objective. Connected nodes are encouraged to have a smaller squared Euclidean distance than sampled negative nodes. The implementation uses 100 epochs, learning rate 0.018, margin 0.35, and coordinate clipping. At inference, candidates are ranked by increasing squared Euclidean distance from the disease vector.

### 4.4 Hyperbolic embeddings

The hyperbolic model uses eight-dimensional vectors inside the Poincaré ball. For vectors x and y, distance is computed as:

`d(x,y) = arcosh(1 + 2 ||x-y||² / ((1-||x||²)(1-||y||²)))`.

The code includes numerical stabilization and projection to a maximum vector norm of 0.92. Training uses finite-difference gradients, a margin objective, 36 epochs, learning rate 0.028, margin 0.22, and at most 1,800 sampled graph edges per epoch. Its coordinate-gradient updates and projection are not a complete Riemannian optimization or learned geodesic-flow implementation. There is no parallel transport, learned flow field, cross-attention module, or generated-answer stage in the executable pilot.

The models have equal vector dimensionality but different margins, learning rates, update counts, and training procedures. We retain those choices to audit the original program. Thus, the experiment compares these implementations and does not isolate the causal effect of replacing Euclidean geometry with hyperbolic geometry.

## 5 Evaluation and reproducibility

Recall@k is the fraction of queries whose single withheld target appears among the first k ranked candidates. Mean reciprocal rank is the average of 1/r, where r is the target rank; absent-vocabulary targets contribute zero in full-set evaluation. The protocol scores one recorded target per query. It does not enumerate all medically valid drugs, and it leaves other known training drugs in the candidate ranking. A future multi-answer or filtered evaluation may produce different results and must be reported as a different protocol.

We first reran the original program at seed 17 and obtained metrics identical to the committed JSON. We then retrained both embedding methods for seeds 7, 17, 29, 43, and 101. The audit preserves exact splits, node order, embeddings, per-query target ranks, software versions, and SHA-256 hashes. It ran on Windows using CPython 3.12.14 and NumPy 2.3.5, with CPU computation and no external LLM API. The original reproduction used the then-available CPython 3.12.13 runtime.

Aggregate values are unweighted means of seed-level scores. The machine-readable output also contains seed standard deviations and exploratory Student-t intervals with four degrees of freedom. The splits overlap and reuse the same underlying dataset; those intervals describe observed seed variability, not independent-dataset generalization or formal evidence of superiority.

## 6 Results

### 6.1 Original seed-17 reproduction

| Method | Evaluated queries | Recall@1 | Recall@5 | MRR |
|---|---:|---:|---:|---:|
| Lexical | 19 | 0.00% | 47.37% | 0.19949 |
| Euclidean | 19 | 0.00% | 0.00% | 0.05961 |
| Hyperbolic | 19 | 0.00% | 21.05% | 0.13143 |

Hyperbolic retrieval improves on the included Euclidean baseline on Recall@5 and MRR, but lexical retrieval performs best on both. All methods fail to place the single hidden target first for these nineteen queries.

### 6.2 Five-seed evaluation

| Evaluation population | Method | Mean Recall@1 | Mean Recall@5 | Mean MRR |
|---|---|---:|---:|---:|
| All 182 held-out links per seed | Lexical | 0.00% | 4.62% | 0.02412 |
| All 182 held-out links per seed | Euclidean | 0.33% | 2.20% | 0.01962 |
| All 182 held-out links per seed | Hyperbolic | 0.22% | 2.64% | 0.02064 |
| Recoverable subset | Lexical | 0.00% | 43.37% | 0.19289 |
| Recoverable subset | Euclidean | 1.74% | 12.71% | 0.09259 |
| Recoverable subset | Hyperbolic | 1.90% | 19.08% | 0.11278 |

On the full denominator, the hyperbolic mean Recall@5 exceeds the Euclidean mean by approximately 0.44 percentage points, but trails the lexical mean by approximately 1.98 percentage points. Hyperbolic Recall@5 exceeds Euclidean Recall@5 in three of the five full-set runs and is lower in two. Hyperbolic mean Recall@1 is lower than Euclidean mean Recall@1. These observations do not support describing hyperbolic retrieval as uniformly better.

Coverage strongly affects interpretation. Around half of the held-out target drugs are absent from the candidate vocabulary. Even among available targets, the original token-recoverable subset favors cases connected through the lexical structure used to build the graph. Reporting only that subset would hide the poor full-pipeline coverage.

### 6.3 Variability across random seeds

| Method on all 182 held-out links | Mean Recall@5 | Seed SD in percentage points | Exploratory 95% seed interval |
|---|---:|---:|---:|
| Lexical | 4.62% | 0.74 | 3.70% to 5.53% |
| Euclidean | 2.20% | 1.29 | 0.60% to 3.80% |
| Hyperbolic | 2.64% | 0.81 | 1.63% to 3.65% |

These intervals use the mean plus or minus 2.776 times the sample standard deviation divided by the square root of five. They are descriptive intervals over the five seed-level scores. The data and test diseases overlap across seeds, and we do not interpret the intervals as independent-population confidence bounds or use their overlap as a hypothesis test. No statistically established superiority claim is made.

### 6.4 Live comparison of retrieved outputs

The local query application computes rankings at request time using the saved seed-17 embeddings. Training is completed beforehand. The exact request is sent to each of the three ranking methods with the same graph and drug candidates. The hidden target is used for display and scoring, not to select or reorder candidates. The application returns ranked drug names; it does not generate explanatory answers with an LLM.

We inspected the three example queries already offered by the application: cancer, bladder cancer, and colorectal cancer. They are illustrative, non-random cases and are not an additional test set. The complete response packets are preserved in `local-run/live-demo-packets.json`.

| Query | Hidden dataset target | Method | First retrieved drug | Target rank | Target in top five |
|---|---|---|---|---:|---|
| Cancer | Vinblastine | Lexical | Fluorouracil | 17 | No |
| Cancer | Vinblastine | Euclidean | Cisplatin | 9 | No |
| Cancer | Vinblastine | Hyperbolic | Anastrozole | 2 | Yes |
| Bladder cancer | Doxorubicin | Lexical | Cisplatin | 10 | No |
| Bladder cancer | Doxorubicin | Euclidean | Cisplatin | 21 | No |
| Bladder cancer | Doxorubicin | Hyperbolic | Cisplatin | 185 | No |
| Colorectal cancer | Bevacizumab | Lexical | Cetuximab | 4 | Yes |
| Colorectal cancer | Bevacizumab | Euclidean | Sunitinib | 8 | No |
| Colorectal cancer | Bevacizumab | Hyperbolic | Carboplatin | 13 | No |

For cancer, the hyperbolic top five are anastrozole, vinblastine, methylprednisolone, famciclovir, and erlotinib. The Euclidean top five are cisplatin, fluorouracil, meloxicam, ofloxacin, and paroxetine. Relative to the single withheld label, hyperbolic retrieval succeeds at k=5 while Euclidean retrieval fails. Both fail at k=1. The appropriate claim is an improvement in the target's rank on this query, not that the hyperbolic model provides the correct first answer.

The other cases show the limits of this example. For colorectal cancer, the lexical method places bevacizumab fourth, while Euclidean and hyperbolic methods place it eighth and thirteenth. For bladder cancer, all methods miss the hidden label in their top five, and the hyperbolic rank is substantially worse. The fact that all three retrieve cisplatin first does not establish that cisplatin is medically wrong: the metric tests recovery of a particular withheld dataset link, not the clinical validity of every other candidate. These contrasting cases prevent a favorable example from being mistaken for general superiority.

## 7 Limitations and missing artifacts

This study is small, uses constructed token relations, and evaluates single-label retrieval against a recommendation dataset without independent clinical annotation. Its negative sampler can fall back to a random candidate after repeated rejection attempts, which may introduce false negatives during training. The training objectives and budgets are unequal, and no validation-based hyperparameter search was conducted in this audit. The selected recoverable subset and candidate coverage materially affect the scores. These limitations should be addressed before using the experiment to support a method-level conclusion.

The source revision also includes a saved Hetionet report and narrative claiming a larger benchmark. However, its referenced `run_main_rmf_rag_benchmark.py`, query sets, raw main-benchmark predictions, and trained model files are absent. We therefore make no empirical claims from those saved main-benchmark results. A local validation of seven frozen evidence records and eighty saved candidate entries checks internal consistency only; it does not reproduce the missing experiment or independently confirm the biomedical statements.

## 8 Next study

A stronger study should first define a precise new mechanism and distinguish it from prior hyperbolic retrieval work. A possible research question is whether a relation-aware method improves complete-path retrieval under a controlled evaluation, but that is a future hypothesis, not a contribution demonstrated here.

For a biomedical claim, the next implementation needs a curated typed graph, documented licensing, held-out answer edges, and separately labeled graph-path and text evidence. For general multi-hop QA, a shared benchmark such as MetaQA must be used with applicable published implementations and the same split and answer metric. Either direction requires matched tuning budgets, an untouched test set, multiple seeds, component ablations, failure analysis, and per-query outputs. If the claim concerns RAG answers, the generator and context budget must be held fixed across retrievers, and answer accuracy must be measured separately from retrieval recall.

## 9 Conclusion

The executable pilot can be reproduced and tested interactively. Across five seeds, its hyperbolic variant has higher mean Recall@5 than its Euclidean variant, while a simple lexical baseline performs better than both. Extending evaluation to all held-out links reveals low candidate coverage and much lower scores. The present evidence supports a preliminary evaluation study and further controlled experiments; it does not establish a novel superior RAG method.

## Appendix A What the implementation executes

1. Load the included disease–drug records, normalize their names, and remove duplicate pairs.
2. Hide one recorded drug link per eligible disease using the chosen seed.
3. Build the training graph from retained pairs and shared disease-name tokens.
4. Train Euclidean and Poincaré-distance embeddings using the original program's settings.
5. Rank each training-vocabulary drug with lexical overlap or the corresponding embedding distance.
6. Locate the hidden target in the ranking and calculate Recall@k and reciprocal rank. In full-set scoring, retain absent-vocabulary targets as misses.
7. Save model vectors, exact splits, per-query ranks, and aggregate results. The query interface loads these vectors and recomputes rankings for each entered disease.

The original training implementation is `research/scripts/run_rmf_rag_experiment.py`. The additional audit is `research/scripts/run_local_audit.py`, and the interactive interface is `research/scripts/local_query_app.py`. The latter two expose and evaluate the existing methods; they do not add a new trained retrieval algorithm.

## Appendix B Demonstration and reproducibility protocol

1. Install `requirements-pilot.txt` in a Python environment and run `python -X utf8 research/scripts/local_query_app.py` from the repository root.
2. Open `http://localhost:8766/`, enter `cancer`, and select Compare retrieval. Record the first candidate separately from the hidden target's rank.
3. Repeat with `colorectal cancer` and `bladder cancer`. Show both success and failure cases before interpreting the results.
4. Open the five-seed audit and use its full evaluation table for general performance statements. Do not replace that table with the demonstration cases.
5. To reproduce training and evaluation, run `python -X utf8 -u research/scripts/run_local_audit.py`. Inspect the saved splits and per-query JSONL files in `local-run/extended`.
6. Run `python -X utf8 -m unittest discover -s research/scripts -p test_local_research.py -v`. The six checks cover query agreement with original predictions, missing-target scoring, invalid inputs, HTML escaping, and HTTP behavior. Passing software checks is distinct from demonstrating model accuracy.

The term baseline in this demonstration means the lexical and Euclidean implementations included in this repository. It does not mean that D-RAG, SG-RAG, KG2RAG, or another published system was executed. A future comparison to those systems requires their implementations or a justified reproduction on a compatible shared benchmark.

## References

1. Saadia-Asghar. KG-RAG / RMF-RAG research repository. Source revision e8d4e1c594a773f6d117079db8553ba84394d47d. https://github.com/Saadia-Asghar/kg-rag-rmf-rag-research
2. Balažević et al. Multi-relational Poincaré Graph Embeddings. 2019. https://arxiv.org/abs/1905.09791
3. Chami et al. Low-Dimensional Hyperbolic Knowledge Graph Embeddings. ACL 2020. https://aclanthology.org/2020.acl-main.617/
4. Cao et al. HyperbolicRAG: Enhancing Retrieval-Augmented Generation with Hyperbolic Representations. Preprint, 2025. https://arxiv.org/abs/2511.18808
5. Zhou et al. Query-Aware Knowledge Retrieval via Hyperbolic Structuring. ACL 2026. https://aclanthology.org/2026.acl-long.986/
6. Gao et al. D-RAG: Differentiable Retrieval-Augmented Generation for Knowledge Graph Question Answering. EMNLP 2025. https://aclanthology.org/2025.emnlp-main.1793/
7. Saleh et al. SG-RAG: Multi-Hop Question Answering With Large Language Models Through Knowledge Graphs. ICNLSP 2024. https://aclanthology.org/2024.icnlsp-1.45/
8. Zhu et al. Knowledge Graph-Guided Retrieval Augmented Generation. NAACL 2025. https://aclanthology.org/2025.naacl-long.449/
9. erolatik. Disease Drug Dataset. Kaggle. https://www.kaggle.com/datasets/erolatik/disease-drug-dataset
