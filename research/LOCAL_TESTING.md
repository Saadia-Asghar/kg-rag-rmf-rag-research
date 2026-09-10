# Local testing and research demonstration

## Start the app

Use Python 3.12 or a compatible Python version. The verified runs used NumPy 2.3.5. The broader Replit pyproject is not needed for this pilot.

```bash
python -m pip install -r requirements-pilot.txt
python -X utf8 research/scripts/local_query_app.py
```

Open http://localhost:8766. On Windows, `./start-local.ps1 -Python 'path/to/python.exe'` also launches the app. Keep that terminal running. The app binds only to the local computer.

Enter `cancer` and click **Compare retrieval**. The saved seed-17 model ranks the held-out answer, vinblastine, at 17 for lexical, 9 for Euclidean, and 2 for hyperbolic retrieval. Try other diseases too: one favorable example does not establish aggregate accuracy. Only names present in the graph are supported. This is not an LLM chatbot.

The Research slides link is optional. It requires the separate Vite presentation on port 5173; it does not run model queries. The original research report and sample paper work from the Python query app.

## Reproduce the original experiment

```bash
python -X utf8 -u research/scripts/run_rmf_rag_experiment.py
python -X utf8 research/scripts/query_demo.py cancer
python -X utf8 research/scripts/evaluate_evidence.py --validate-only
```

The training command overwrites the original pilot embeddings, predictions, and report in research/results. Restart the query app after retraining so it reloads the new vectors. Evidence validation checks the saved manifest and packets, not article truth or model accuracy.

## Repeat the five-seed audit

```bash
python -X utf8 -u research/scripts/run_local_audit.py
python -X utf8 -m unittest discover -s research/scripts -p test_local_research.py -v
```

The audit writes local-run/extended: exact splits, node ordering, embeddings, per-query ranks, per-seed metrics, aggregate CSV, and file/software provenance. It preserves the original pilot outputs. Full-set scores count absent-vocabulary targets as misses. This audit retains the original unequal model training budgets; it is not an isolated causal test of geometry.

## What to show a professor

1. State the question: does this hyperbolic pilot improve held-out drug ranking under the stated protocol?
2. Show the source data and exact train/test split. Explain that 16–23 recoverable examples per seed are only a subset of 182 held-out links.
3. Run the experiment and inspect per-query predictions, not just screenshots.
4. Show all three baselines, including the lexical baseline that wins Recall@5.
5. Show the five-seed tables and variability. Do not call repeated overlapping splits independent datasets.
6. Explain absent-vocabulary targets, multiple potentially valid drug answers, token-derived graph edges, and unequal training budgets.
7. Present the paper as a preliminary reproducibility and evaluation study. The current code contains no learned geodesic flow, parallel transport, cross-attention, or generated-answer module.

## Work still required for a new-method publication

Define a contribution that is distinct from existing hyperbolic retrieval and KGQA. Recover or implement the complete intended method. Select a shared benchmark and reproduce relevant published baselines on identical splits. Match training/tuning budgets and, for RAG, the generator and context budget. Tune only on validation data; freeze settings before test evaluation. Report answer/retrieval metrics separately, component ablations, failure cases, compute cost, and uncertainty. A real biomedical multi-hop claim requires typed biomedical paths and suitable evidence labels.

The cited papers cover different tasks; their percentages cannot be compared directly with this pilot's Recall@5. The repository's literature review is an inventory, not verified baseline execution. Prior work to add includes HyperbolicRAG (arXiv:2511.18808) and HyperRAG (ACL 2026, doi:10.18653/v1/2026.acl-long.986).
