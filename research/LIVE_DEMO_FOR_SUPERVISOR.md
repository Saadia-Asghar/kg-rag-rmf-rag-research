# Live demonstration for your supervisor

Open http://localhost:8766/?q=cancer on the computer running the app. Localhost links work only on that computer. The full manuscript is at http://localhost:8766/paper.

## Explain the experiment first

Say: “Sir, I am comparing three retrieval methods on the same disease–drug graph. I hide one known dataset link before training, then test where each method ranks that hidden drug. These are lexical and Euclidean baselines versus the hyperbolic variant. They are not implementations of the research papers in my literature review.”

The models are already trained. Clicking Compare retrieval computes their rankings live; it does not retrain the models or call an LLM. A ranked drug is an experimental output, not a clinical recommendation.

## Example one where hyperbolic retrieval helps

Enter `cancer`, click **Compare retrieval**, and scroll to the three result columns.

| Method | First retrieved drug | Rank of hidden target vinblastine | Found within top five |
|---|---|---:|---|
| Lexical baseline | Fluorouracil | 17 | No |
| Euclidean baseline | Cisplatin | 9 | No |
| Hyperbolic variant | Anastrozole | 2 | Yes |

Say: “For this query, the dataset answer I withheld was vinblastine. The Euclidean baseline places it ninth, while the hyperbolic variant places it second. Therefore, hyperbolic retrieval succeeds at Recall@5 on this example. It does not give the hidden answer first; all three methods fail Recall@1 here.”

Do not say “Euclidean gives a medically wrong answer and my method gives a medically correct answer.” This experiment checks a single hidden dataset label, not every drug's clinical validity.

## Example two where the lexical baseline wins

Enter `colorectal cancer` and click **Compare retrieval**.

The hidden target is bevacizumab. Its ranks are lexical 4, Euclidean 8, and hyperbolic 13. Only the lexical method retrieves it within the top five.

Say: “This counterexample shows that my hyperbolic variant does not always improve retrieval. That is why I evaluate the full test set rather than relying on one demonstration.”

## Example three where all methods fail at five

Enter `bladder cancer` and click **Compare retrieval**.

The hidden target is doxorubicin. Its ranks are lexical 10, Euclidean 21, and hyperbolic 185. All methods miss the target in the top five. All three first retrieve cisplatin, demonstrating why the first output and the hidden-answer rank must be reported separately.

## Show the overall evidence

Click **Five-seed audit**. On all 182 held-out links per seed, mean Recall@5 is:

| Method | Mean Recall@5 |
|---|---:|
| Lexical | 4.62% |
| Euclidean | 2.20% |
| Hyperbolic | 2.64% |

Say: “Across five seeds, hyperbolic retrieval has slightly higher mean Recall@5 than this Euclidean baseline, but the lexical baseline performs best. This is a reproducible pilot, not proof that the proposed full architecture is superior.”

The original 19-query report covers only seed 17's selected recoverable subset. Its percentages are not the five-seed full-set percentages. About half of the held-out drugs are absent from the training candidate vocabulary. This limits retrieval before ranking even begins.

## What to show in the code

Open research/scripts/run_rmf_rag_experiment.py and explain:

1. `make_split` hides answers before graph construction.
2. `build_graph` builds disease, token, and drug nodes using training pairs.
3. `train_euclidean` and `train_poincare` learn the two vector representations.
4. `lexical_score` supplies the third baseline.
5. `evaluate` computes the withheld target's position and the metrics.

Then show research/scripts/run_local_audit.py for the five seeds and the full denominator. Show research/scripts/local_query_app.py for the live interface. Explain that this code does not implement LLM generation, parallel transport, learned geodesic flow, or the missing Hetionet benchmark.

## Reproduce it rather than only showing screenshots

From the repository root, use the Python executable that has NumPy installed:

```powershell
python -X utf8 -u research/scripts/run_local_audit.py
python -X utf8 -m unittest discover -s research/scripts -p test_local_research.py -v
```

Save the resulting metrics, splits, and raw prediction files with the paper. The current demonstration responses are saved in local-run/live-demo-packets.json. The full manuscript includes the method, results, variability, favorable and unfavorable examples, limitations, and references.

If asked whether the method is novel, say: “Hyperbolic graph retrieval already has prior work. I still need to define and implement a specific new contribution and compare it fairly with relevant published systems. The current contribution is the reproducible pilot and its evaluation audit.”
