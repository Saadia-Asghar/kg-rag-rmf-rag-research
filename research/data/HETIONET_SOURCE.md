# Hetionet benchmark source

- Dataset: Hetionet v1.0
- Canonical repository: https://github.com/hetio/hetionet
- Archived release: https://zenodo.org/records/268568
- Local snapshot: `research_data/hetionet/hetionet-v1.0.json.bz2`
- SHA-256 computed by this run: `a342ab57e9073e6c02bb5e109d1f16917e6f933be4e5c77ebbaebfa26b984c19`
- Citation: Himmelstein DS et al. Systematic integration of biomedical knowledge prioritizes drugs for repurposing. eLife 2017;6:e26726. https://doi.org/10.7554/eLife.26726

## Relation-level inclusion rule

Only relations with explicit reusable provenance are retained:

- DISEASES `Disease-associates-Gene`, CC BY 4.0.
- PharmacotherapyDB `Compound-treats-Disease` and `Compound-palliates-Disease`, CC0 1.0.
- DrugCentral `Compound-binds-Gene`, CC BY 4.0.

Expected frozen counts are 3,200 Gene-Disease, 1,145 Disease-Compound, and 823 Gene-Compound edges. The benchmark fails on count drift unless `ALLOW_EDGE_COUNT_DRIFT=1` is explicitly set for exploratory work.
