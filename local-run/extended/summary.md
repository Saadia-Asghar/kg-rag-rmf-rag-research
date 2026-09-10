# Five-seed pilot audit

Seeds: 7, 17, 29, 43, 101. Original algorithms and unequal training budgets retained.
All-held-out scores include out-of-vocabulary answers as misses. Recoverable is the original selected subset.

| Subset | Method | Mean Recall@1 | Mean Recall@5 | Mean MRR |
|---|---|---:|---:|---:|
| all_held_out | euclidean | 0.33% | 2.20% | 0.01962 |
| all_held_out | lexical_baseline | 0.00% | 4.62% | 0.02412 |
| all_held_out | rmf_rag_hyperbolic | 0.22% | 2.64% | 0.02064 |
| recoverable | euclidean | 1.74% | 12.71% | 0.09259 |
| recoverable | lexical_baseline | 0.00% | 43.37% | 0.19289 |
| recoverable | rmf_rag_hyperbolic | 1.90% | 19.08% | 0.11278 |

aggregate_metrics.csv includes SD and exploratory t intervals across seeds (df=4). They describe seed sensitivity only; overlapping splits are not independent datasets.
No cited-paper model has been evaluated here. Hyperbolic geometry alone is not a new contribution.
All per-query ranks, splits, model vectors, software versions, and hashes are saved in this directory.
