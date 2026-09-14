# Attribution manifest for the reusable Hetionet benchmark subset

This benchmark is a modified subset of Hetionet v1.0. It retains identifiers
and selected relationships, removes all other node properties and relations
from generated query/result files, creates new train/validation/test partitions,
and adds model predictions and aggregate statistics.

The versioned source-license registry used for the selection is:
<https://github.com/dhimmel/integrate/blob/d482033bcaa913a976faf4a6ee08497281c739c3/licenses/README.md>.

## Hetionet integration

- **Creators:** Daniel S. Himmelstein, Antoine Lizee, Christine Hessler, Leo
  Brueggeman, Sabrina L. Chen, Dexter Hadley, Ari Green, Pouya Khankhanian,
  Sergio E. Baranzini
- **Work:** “Systematic integration of biomedical knowledge prioritizes drugs
  for repurposing”
- **DOI:** <https://doi.org/10.7554/eLife.26726>
- **Repository original-content license:** CC0 1.0
- **Modification notice:** This benchmark filters Hetionet by relation,
  underlying source, and per-edge license; holds out terminal edges; and
  generates new queries, embeddings, predictions, and statistics.

## DISEASES gene–disease associations

- **Creator/institution:** JensenLab, University of Copenhagen
- **Work:** Pletscher-Frankild S, Pallejà A, Tsafou K, Binder JX, Jensen LJ.
  “DISEASES: Text mining and data integration of disease–gene associations.”
  *Methods* 2015;74:83–89.
- **DOI:** <https://doi.org/10.1016/j.ymeth.2014.11.020>
- **License:** CC BY 4.0
- **License URI:** <https://creativecommons.org/licenses/by/4.0/>
- **Selected data:** Hetionet `associates` edges whose source list is exactly
  `DISEASES` and whose per-edge license is CC BY 4.0. Co-sourced edges are
  excluded.
- **Modification notice:** Associations are represented as identifier pairs,
  repartitioned for retrieval, and used without source text.

## DrugCentral gene–compound binding relationships

- **Creator/institution:** DrugCentral team, University of New Mexico
- **Work:** Ursu O et al. “DrugCentral: online drug compendium.” *Nucleic Acids
  Research* 2017;45(D1):D932–D939.
- **DOI:** <https://doi.org/10.1093/nar/gkw993>
- **License:** CC BY 4.0
- **License URI:** <https://creativecommons.org/licenses/by/4.0/>
- **Versioned license evidence:** <https://github.com/olegursu/drugtarget/blob/9a6d84bed8650c6c507a2d3d786814c774568610/LICENSE>
- **Selected data:** Hetionet `binds` edges whose singleton source list is a
  `DrugCentral` source variant and whose per-edge license is CC BY 4.0.
  Co-sourced edges are excluded.
- **Modification notice:** Binding records are represented as identifier pairs,
  repartitioned for retrieval, and used without compound labels or descriptions.

## PharmacotherapyDB disease–compound indications

- **Creator:** Daniel S. Himmelstein and Project Rephetio contributors
- **Source repository:** <https://github.com/dhimmel/indications>
- **Archived dataset DOI:** <https://doi.org/10.6084/m9.figshare.3103054.v1>
- **License:** CC0 1.0
- **License URI:** <https://creativecommons.org/publicdomain/zero/1.0/>
- **Selected data:** Hetionet `treats` and `palliates` edges whose source is
  `PharmacotherapyDB` and whose per-edge license is CC0 1.0.
- **Modification notice:** Indications are represented as identifier pairs,
  repartitioned for retrieval, and used without compound labels or descriptions.

## Generated files

The JSONL/CSV/Markdown files under `research/query_sets/` and
`research/results/main_benchmark/` are derived research outputs. They contain
public identifiers and aggregate values rather than restricted node text. This
manifest must remain with redistributed benchmark outputs so CC BY attribution
and modification notices travel with the data.