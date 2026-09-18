# RMF-RAG beginner study guide

This guide explains what the project is doing, what to study first, and which
resources help with each part. You do not need to understand all of the
mathematics before running the project.

## 1. The project in very simple words

This project uses a **biomedical knowledge graph**. A knowledge graph is a map
of facts represented as:

```text
Gene ── associated with ── Disease ── treated by ── Compound
```

The model is asked to rank possible compounds when the final compound is
hidden. It learns from the remaining graph connections, ranks every candidate
compound, and is checked against the hidden answer.

The project is not making a new medicine and is not giving treatment advice.
It is testing whether graph-retrieval models can recover known relationships
under a controlled evaluation.

## 2. What each dataset is for

| Dataset or source | Role in this project |
|---|---|
| **Hetionet v1.0** | Main public biomedical knowledge graph for the five-seed 2-hop and 3-hop benchmark |
| **Kaggle disease–drug dataset** | Earlier small pilot only; it is not the main gene–disease–compound benchmark |
| **Europe PMC CC BY records** | Separate text-evidence layer used after ranking to check provenance and supporting papers |
| **Evidence gold standard** | Eight calibration labels used to check graph support, text support, and plausibility |
| **Generated JSONL query sets** | Frozen train, validation, and test questions used for repeatable experiments |

Main Hetionet source records:

- Official repository: <https://github.com/hetio/hetionet>
- Downloaded snapshot: `hetionet-v1.0.json.bz2`
- Paper: <https://doi.org/10.7554/eLife.26726>
- Local source and license record: `research/data/HETIONET_SOURCE.md`

The benchmark uses documented, reusable relations from the graph:

- Gene–Disease
- Disease–Compound
- Gene–Compound

## 3. The order of events in the experiment

Learn this sequence. It is the most important part of the project:

```text
1. Load the public Hetionet graph
2. Select typed 2-hop and 3-hop paths
3. Hide the final answer edge for each test question
4. Train Euclidean and Poincaré node embeddings
5. Rank all candidate compounds
6. Find the hidden target's rank
7. Calculate Recall@K and MRR
8. Optionally verify the required typed graph path
9. Attach Europe PMC evidence separately
10. Save every prediction and summary metric
```

### 2-hop and 3-hop questions

```text
2-hop: Gene → Disease → Compound
3-hop: Gene → Disease → Gene → Compound
```

For a test query, the terminal answer compound is removed before training.
The model therefore cannot simply memorize the answer edge.

## 4. Where Poincaré is used

Poincaré is the geometry used inside one of the embedding models.

- A node embedding gives every gene, disease, and compound a mathematical
  position.
- Euclidean embedding uses ordinary flat space.
- Poincaré embedding uses curved hyperbolic space.
- The model learns positions from known graph relationships.
- During ranking, candidate compounds are scored against the query.

Poincaré is used for:

1. Training hyperbolic node positions.
2. Scoring and ranking candidate compounds.

Poincaré is **not** used for:

- Downloading the dataset.
- Creating the train/test split.
- Hiding the answer edge.
- Attaching Europe PMC evidence.
- Performing typed path verification.

Path verification is a separate post-retrieval check. It asks whether the
retrieved candidate has the required sequence of relation types.

## 5. What Recall@5 and MRR mean

### Recall@5

Recall@5 asks:

> Did the correct hidden compound appear anywhere in the first five ranked
> suggestions?

- Target rank 4: success.
- Target rank 566: failure.
- 20 successful queries out of 100: Recall@5 = `20 / 100 = 0.20 = 20%`.

The `5` is the cutoff. Recall@1 checks one result, Recall@5 checks five,
and Recall@10 checks ten.

### MRR

MRR rewards a correct answer more when it appears near the top:

```text
rank 1   → reciprocal score 1/1   = 1.00
rank 4   → reciprocal score 1/4   = 0.25
rank 566 → reciprocal score 1/566 ≈ 0.002
```

The project averages these reciprocal scores over the test queries and repeats
the experiment for five seeds. The slide titled **Offline benchmark result:
mean MRR** shows those saved aggregate averages, not one live query.

## 6. Offline code versus the live Model Tester

### Offline benchmark code

The benchmark script runs many fixed queries for five seeds and writes:

```text
research/results/main_benchmark/aggregate_metrics.csv
research/results/main_benchmark/predictions.jsonl
```

This is where the reported mean Recall and mean MRR numbers come from.

### Live Model Tester

The tester is an inspector for one saved result at a time. It does not train
the model again and it does not calculate the five-seed average.

It lets you select:

- Hop: 2-hop or 3-hop
- Split: train, validation, or test
- Seed
- Query index
- Method: lexical, Euclidean, Poincaré, or an ablation
- Top K: 1, 3, 5, 7, or 10

It then shows:

- Top candidate compounds
- Hidden target
- Target rank
- Whether the target is inside Top K
- Typed path verification
- Evidence status and source details
- Exact query and run metadata

The tester showing a failed example is intentional. A result with target rank
566 demonstrates that the system is showing saved outcomes honestly rather
than displaying only successful examples.

## 7. Commands to run the project

Run these commands from the repository root.

### Main five-seed benchmark

```bash
python research/scripts/run_main_rmf_rag_benchmark.py
```

This verifies or downloads the Hetionet snapshot, creates the fixed query
sets, trains both model geometries, evaluates the rankings, and writes the
main result files.

### Run one main-benchmark query

```bash
python research/scripts/main_query_demo.py --hop 3 --split test --seed 101
```

### Run the original pilot

```bash
python research/scripts/run_rmf_rag_experiment.py
```

### Run the small practical query demo

```bash
python research/scripts/query_demo.py "cancer"
```

### Rebuild the HTML report

```bash
python research/scripts/build_main_benchmark_report.py
```

### Validate evidence and regression tests

```bash
python -m unittest discover -s research/tests && \
  python research/scripts/evaluate_evidence.py --validate-only
```

### Start the local tester

```bash
python research/scripts/live_benchmark_app.py --port 8770
```

Then open `http://127.0.0.1:8770/` in a browser.

## 8. Recommended study order

### Step A — Learn graphs and knowledge graphs

Watch or read:

1. **Knowledge graphs: A short introduction to the core concepts of
   biomedical knowledge graphs**  
   YouTube: <https://www.youtube.com/watch?v=-jkKlY9UA_Y>
2. **Stanford CS224W: Machine Learning with Graphs — Knowledge Graph
   Embeddings**  
   YouTube: <https://www.youtube.com/watch?v=isI_TUMoP60>
3. Read the Hetionet paper:  
   <https://doi.org/10.7554/eLife.26726>

After this step, you should be able to explain what a node, edge, relation,
path, and biomedical knowledge graph are.

### Step B — Learn graph embeddings

1. **Knowledge Graph Embeddings Tutorial: From Theory to Practice**  
   YouTube: <https://www.youtube.com/watch?v=gX_KHaU8ChI>
2. Tutorial website: <https://kge-tutorial-ecai2020.github.io/>
3. PyKEEN paper and evaluation library:  
   <https://jmlr.org/papers/volume22/20-825/20-825.pdf>
4. PyKEEN documentation: <https://pykeen.readthedocs.io/en/stable/>

Focus on the idea that the model turns entities into vectors or positions and
uses those positions to score likely links.

### Step C — Learn Poincaré and hyperbolic embeddings

1. **Hyperbolic Embeddings Tutorial — DiffGeo4DL NeurIPS 2020**  
   YouTube: <https://www.youtube.com/watch?v=MdPk3qD4Wig>
2. **Poincaré Embeddings for Learning Hierarchical Representations**  
   Paper: <https://arxiv.org/abs/1705.08039>
3. Read the project explanation in `research/PAPER_DRAFT_SECTIONS.md`.

You only need the core intuition first: hyperbolic space can represent
branching or hierarchical structures differently from flat Euclidean space.
Do not claim from this alone that Poincaré must always perform better.

### Step D — Learn ranked-retrieval evaluation

1. Stanford Information Retrieval book, evaluation of ranked retrieval:  
   <https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html>
2. PyKEEN metrics documentation:  
   <https://pykeen.readthedocs.io/en/stable/api/pykeen.evaluation.RankBasedEvaluator.html>
3. Re-read the Recall@5 and MRR section above.

Practice by taking a list of ranked compounds and manually calculating:

- Whether the target is in the first 5.
- The reciprocal rank `1 / rank`.
- The average reciprocal rank for several queries.

### Step E — Learn leakage-safe experiments

Study these project files while following the experiment sequence:

- `research/scripts/run_main_rmf_rag_benchmark.py`
- `research/scripts/main_query_demo.py`
- `research/results/main_benchmark/predictions.jsonl`
- `research/results/main_benchmark/aggregate_metrics.csv`

Ask yourself:

1. Which edges are visible during training?
2. Which answer edge is hidden?
3. When is the hidden target revealed?
4. Which file stores each prediction?
5. Which result is a single query and which is an aggregate?

## 9. What to tell your supervisor

> Hetionet is a public biomedical knowledge graph connecting genes, diseases,
> and compounds. I use it to create typed 2-hop and 3-hop retrieval questions.
> I remove the terminal answer edge before training, then compare Euclidean and
> Poincaré graph embeddings under the same settings. Each model ranks all
> candidate compounds. Recall@5 checks whether the hidden answer appears in
> the first five results, while MRR rewards a higher rank. I repeat the
> experiment for five seeds and save every prediction. The live Model Tester
> inspects one saved query; it is separate from the offline code that creates
> the aggregate benchmark averages. Typed path verification and evidence
> provenance are separate checks, and the project is not clinical advice.

## 10. Claims to avoid

Do not say:

- “Poincaré always wins.”
- “The model discovered a new medicine.”
- “The tester created the benchmark average.”
- “The result proves clinical effectiveness.”
- “The project uses a K-map algorithm.”

Say instead:

- “The project compares Euclidean and Poincaré geometry.”
- “The result is a controlled graph-retrieval benchmark.”
- “The strongest measured improvement came from typed path verification.”
- “The live tester makes saved predictions inspectable.”
- “The current evidence is not a universal win and is not clinical validation.”