# Paper-ready draft sections

## Dataset

We conducted a pilot experiment using the public *disease-drug-dataset*
published by `erolatik` on Kaggle under the Apache 2.0 license. The downloaded
file contained 1,000 question-answer records in which each question identified
a disease and each answer supplied a recommended drug. After normalization and
duplicate removal, 880 unique disease–drug pairs remained.

Dataset URL: https://www.kaggle.com/datasets/erolatik/disease-drug-dataset

## Graph construction

We represented diseases, informative disease-name tokens, and drugs as three
node types. For every training pair, the graph contained a direct disease–drug
edge and an indirect disease→token→drug route. Common stop words and generic
terms were removed. The final training graph contained 1,652 nodes and 3,138
edges.

This construction is an experimental proxy for hierarchical retrieval. Token
edges are not curated biomedical relations and should not be presented as such.

## Evaluation protocol

Using random seed 17, one drug edge was held out for every disease associated
with at least two unique drugs. This produced 182 held-out edges. We evaluated
the 19-query recoverable subset for which the target drug remained reachable
through a shared token route in the training graph. This restriction avoids
counting information that was completely absent from the training graph as a
retrieval failure.

We compared three methods:

1. **Lexical baseline:** ranks a drug using disease-name token overlap with its
   observed training diseases.
2. **Euclidean graph embedding:** learns eight-dimensional vectors using
   contrastive edge training and squared Euclidean distance.
3. **RMF-RAG pilot:** learns eight-dimensional Poincaré-ball vectors using the
   same graph and a geodesic-distance contrastive objective.

We report Recall@k, mean reciprocal rank (MRR), and the proportion of top-ranked
predictions supported by a graph path of at most three hops.

## Results

| Method | Recall@1 | Recall@3 | Recall@5 | Recall@10 | MRR | Top-1 grounded |
|---|---:|---:|---:|---:|---:|---:|
| Lexical baseline | 0.0% | 21.1% | 47.4% | 73.7% | 0.199 | 100.0% |
| Euclidean embedding | 0.0% | 0.0% | 0.0% | 21.1% | 0.060 | 94.7% |
| RMF-RAG hyperbolic embedding | 0.0% | 10.5% | 21.1% | 47.4% | 0.131 | 94.7% |

The hyperbolic model improved Recall@5 from 0.0% to 21.1%, Recall@10 from
21.1% to 47.4%, and MRR from 0.060 to 0.131 relative to the learned Euclidean
model. This is a 120.5% relative MRR increase over the Euclidean embedding.
However, the lexical baseline remained stronger, reaching 47.4% Recall@5 and
0.199 MRR. No model recovered a correct drug at rank 1.

## Interpretation

The pilot provides limited evidence that Poincaré geometry represents the
constructed branching graph more effectively than an equivalently small
Euclidean embedding. It does not establish that hyperbolic retrieval is better
than all simple baselines. The lexical method benefits directly from the
disease-name token construction and therefore remains a strong baseline on this
dataset.

The negative result is useful: geometry alone is insufficient when the graph
contains weak, automatically constructed relations. A full RMF-RAG system
should combine geodesic retrieval with semantic text embeddings, curated
biomedical relations, parallel context transport, and evidence-grounded answer
generation.

## Limitations

The test set contains only 19 recoverable queries and is too small for strong
statistical conclusions. The source lacks genes, relation labels, evidence
passages, timestamps, and annotated multi-hop reasoning paths. Disease-name
tokens are lexical proxies rather than medical ontology concepts. The reported
numbers should therefore be described as preliminary proof-of-concept results,
not state-of-the-art biomedical question-answering performance.

## Recommended main experiment

For a publishable follow-up, evaluate on a curated biomedical knowledge graph
such as PrimeKG or Hetionet. Create explicit 2-hop and 3-hop query sets, compare
Euclidean and Poincaré retrieval under identical training budgets, and add
ablations for geodesic retrieval, curvature-aware hop weighting, parallel
transport, and path verification. Report confidence intervals over at least
five random seeds.