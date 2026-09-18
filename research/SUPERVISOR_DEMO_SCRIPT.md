# Supervisor demonstration script

## Start the local tester

From the repository root, start the saved-result viewer:

```powershell
python research/scripts/live_benchmark_app.py --port 8770
```

Open `http://127.0.0.1:8770/` in a browser. If Windows does not recognize `python`, run the Python executable installed on the computer, followed by `research/scripts/live_benchmark_app.py --port 8770`.

This page reads `research/results/main_benchmark/predictions.jsonl`. It does not train the model during the demonstration. Each click selects a saved prediction from the completed benchmark.

## Explain the page

Say: "This is a result inspector. Each setting selects one frozen test query and one saved model result. The page then shows the ranked compounds, the correct held-out compound, its rank, and whether the best path passes the typed graph-path check."

- **Hop 2** means `Gene -> Disease -> Compound`.
- **Hop 3** means `Gene -> Disease -> Gene -> Compound`.
- **Seed** selects one of five repeated runs: 7, 17, 29, 43, or 101.
- **Query index** selects one saved test question.
- **Method** selects lexical, Euclidean, Poincare, or Poincare plus path verification.
- **Top K** controls how many top-ranked compounds appear on screen.
- **Held-out target** is the correct compound removed from training for that test query.
- **Target rank** is the position of that correct compound among all candidate compounds.

## Explain Recall@5

Say: "Recall@5 asks whether the correct hidden compound appears in the first five results. If it appears, that query is a success. If it appears at rank 566, it is not a Recall@5 success."

Use this successful saved example:

- Hop: 2
- Seed: 101
- Method: Euclidean
- Query index: 222
- Top K: 5

The held-out target is `DB00544` and its rank is 4, so it appears in the top five.

## Explain the datasets

Say: "The Kaggle disease-drug dataset is an early 1,000-row pilot. It has no gene relationships. The main benchmark uses official Hetionet v1.0 because it contains Gene, Disease, and Compound relations needed for 2-hop and 3-hop retrieval."

The Hetionet run retains documented reusable relations: 3,200 Gene-Disease edges, 1,145 Disease-Compound edges, and 823 Gene-Compound edges.

## Explain the design and novelty

Say: "The contribution is a controlled and reproducible biomedical graph-retrieval benchmark. The system removes terminal answer edges before training, fixes the query sets, runs five seeds, trains Euclidean and Poincare models with matched settings, saves every prediction and embedding, and provides a local evidence inspector."

The study compares two geometries fairly. It also tests a typed-path-verification configuration. That verifier supplies the largest measured 3-hop change.

## Explain the result honestly

Say: "Poincare's 3-hop MRR is 0.011 and Euclidean's is 0.009, but the five-seed confidence intervals overlap. I therefore do not claim Poincare geometry is conclusively better. The separate Poincare plus typed-path-verification configuration achieved 3-hop Recall@5 of 0.110."

## Final 30-second script

"I built a reproducible biomedical graph-retrieval benchmark using official Hetionet v1.0. I use frozen five-seed test queries and remove answer edges before training, so the model cannot memorize the test answer. Recall@5 measures whether the correct hidden compound appears in the first five suggestions. This local tester lets us inspect every saved prediction, including failures. The strongest measured gain is from typed path verification. The current data does not prove that Poincare geometry alone is better than Euclidean geometry."
