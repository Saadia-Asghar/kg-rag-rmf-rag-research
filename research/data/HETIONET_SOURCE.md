# Hetionet v1.0 source and reuse record

This benchmark uses the archived Hetionet v1.0 JSON snapshot:

- **Snapshot:** `research_data/hetionet/hetionet-v1.0.json.bz2`
- **Canonical download:** <https://media.githubusercontent.com/media/hetio/hetionet/main/hetnet/json/hetionet-v1.0.json.bz2>
- **Repository:** <https://github.com/hetio/hetionet>
- **SHA-256:** `a342ab57e9073e6c02bb5e109d1f16917e6f933be4e5c77ebbaebfa26b984c19`
- **Citation:** Himmelstein DS et al. “Systematic integration of biomedical
  knowledge prioritizes drugs for repurposing.” *eLife* 2017;6:e26726.
  DOI: <https://doi.org/10.7554/eLife.26726>

The Hetionet repository states that its original content is released under
**CC0 1.0**, while integrated resources retain per-node and per-edge license
metadata. The benchmark therefore filters the snapshot to relations with an
explicit reusable license:

| Benchmark relation | Hetionet edge type | Selected license |
|---|---|---|
| Gene–Disease | DISEASES `associates` | CC BY 4.0 |
| Disease–Compound | PharmacotherapyDB `treats`, `palliates` | CC0 1.0 |
| Gene–Compound | DrugCentral `binds` | CC BY 4.0 |

No co-sourced, CC BY-NC, CC BY-SA, ODbL, or missing-license edge is used for
the reported benchmark. Compound names and descriptions can inherit
noncommercial source licenses, so the reusable lexical baseline uses public
database identifiers only and generated query/result files do not redistribute
node labels or descriptions. The source repository’s license notice and
source-license table remain the authority for downstream redistribution. The
runner verifies the hash before using an archive and can download the exact
snapshot in a fresh checkout.

Creator attribution, license URIs, versioned provenance links, and modification
notices are recorded in `HETIONET_ATTRIBUTION.md`.