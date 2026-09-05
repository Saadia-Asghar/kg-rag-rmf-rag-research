# Licensed biomedical evidence source

The evidence layer uses the **Europe PMC Open Access subset** as a text
discovery and citation source:

- **Provider:** Europe PMC, operated by EMBL-EBI
- **API:** <https://www.ebi.ac.uk/europepmc/webservices/rest/>
- **Open-access policy:** <https://www.ebi.ac.uk/europepmc/about/oa-policy>
- **Record landing pages:** `https://europepmc.org/articles/{PMCID}`
- **Retrieval date for the frozen manifest:** 2026-09-02
- **Manifest:** `research/data/biomedical_evidence_manifest.json`

Only records whose Europe PMC metadata reports **CC BY** are included. Records
marked CC BY-NC, CC BY-ND, CC BY-NC-ND, or with no license are excluded. The
manifest stores PMCID, PMID, DOI, article authors, title, license, landing-page URL, and a short
verbatim abstract excerpt. PMCID is the primary reproducible identifier;
PMID and DOI are retained as cross-checks.

This is an evidence-triage layer, not a clinical guideline. A source record can
support a biomedical relationship, provide perioperative/class context, or fail
to support the candidate at all. In particular:

- A **direct** excerpt names the candidate compound and addresses the disease
  or seizure phenotype.
- **Context-only** excerpts concern anesthesia, a drug class, or a related
  setting and do not establish that the candidate treats the queried disease.
- **No licensed record** means this frozen manifest found no candidate-specific
  CC BY record; it is not evidence that the candidate is ineffective.

The quoted excerpts are intentionally short and are not a substitute for
reading the full article. Attribution to the article authors and publisher
remains with the cited source. This repository redistributes identifiers and
short excerpts only; it does not redistribute full article text.

## Reproducible lookup

The records in the manifest can be rechecked by querying Europe PMC with their
stable PMCID values, for example:

```text
https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&resultType=core&query=PMCID:PMC11168201
```

The benchmark demo reads the frozen manifest locally. It does not make a live
network request during ranking, so an identical checkout produces the same
evidence packet even if Europe PMC search results change.

Before results are shipped, run
`python research/scripts/evaluate_evidence.py --validate-only`. This check
verifies the manifest identifiers, CC BY-only policy, record uniqueness, and
non-empty excerpts, then cross-checks every cited demo record and every
candidate's explicit evidence status against the frozen manifest.
