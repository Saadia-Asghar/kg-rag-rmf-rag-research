#!/usr/bin/env python3
"""Evaluate evidence grounding separately from link-retrieval metrics.

The evaluator joins saved query-demo rankings to a frozen calibration set. It
reports graph-path support, licensed-text support, and therapeutic-plausibility
labels as separate dimensions; it never recomputes or relabels Recall/MRR.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_MANIFEST = ROOT / "research" / "data" / "biomedical_evidence_manifest.json"
DEFAULT_GOLD = ROOT / "research" / "data" / "evidence_gold_standard.json"
DEFAULT_OUTPUT = ROOT / "research" / "results" / "main_benchmark" / "evidence_review.json"
DEFAULT_DEMOS = (
    ROOT / "research" / "results" / "main_benchmark" / "query_demo_2hop.json",
    ROOT / "research" / "results" / "main_benchmark" / "query_demo_3hop.json",
)

_PMCID_PATTERN = re.compile(r"^PMC[0-9]+$")
_PMID_PATTERN = re.compile(r"^[0-9]+$")
_DOI_PATTERN = re.compile(r"^10\.[0-9]{4,9}/\S+$")
_NO_LICENSED_RECORD = "no_licensed_record"
_PACKET_RECORD_FIELDS = {
    "record_id": "record_id",
    "pmcid": "pmcid",
    "pmid": "pmid",
    "doi": "doi",
    "license": "license",
    "authors": "authors",
    "title": "title",
    "source_url": "source_url",
    "scope": "evidence_scope",
    "snippet": "snippet",
}


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def validate_manifest(manifest: dict) -> list[str]:
    """Return actionable errors for the frozen licensed-evidence manifest."""
    if not isinstance(manifest, dict):
        return ["manifest must be an object"]
    errors: list[str] = []
    records = manifest.get("records")
    if not isinstance(records, list):
        return ["manifest.records must be a list"]

    record_ids: set[str] = set()
    for index, record in enumerate(records):
        prefix = f"manifest.records[{index}]"
        if not isinstance(record, dict):
            errors.append(f"{prefix} must be an object")
            continue

        record_id = record.get("record_id")
        if not isinstance(record_id, str) or not record_id.strip():
            errors.append(f"{prefix}.record_id must be non-empty")
        elif record_id in record_ids:
            errors.append(f"{prefix}.record_id duplicates {record_id}")
        else:
            record_ids.add(record_id)

        identifiers = (
            ("pmcid", _PMCID_PATTERN, "a PMCID such as PMC123"),
            ("pmid", _PMID_PATTERN, "a numeric PMID"),
            ("doi", _DOI_PATTERN, "a DOI such as 10.1000/example"),
        )
        for field, pattern, description in identifiers:
            value = record.get(field)
            if not isinstance(value, str) or not value.strip():
                errors.append(f"{prefix}.{field} must be non-empty")
            elif not pattern.fullmatch(value):
                errors.append(f"{prefix}.{field} must be {description}")

        if record.get("license") != "CC BY":
            errors.append(f"{prefix}.license must be exactly CC BY")

        snippet = record.get("snippet")
        if not isinstance(snippet, str) or not snippet.strip():
            errors.append(f"{prefix}.snippet must be non-empty")

        label = record.get("evidence_label")
        if not isinstance(label, str) or not label.strip():
            errors.append(f"{prefix}.evidence_label must be non-empty")

        compound_ids = record.get("compound_ids")
        if not isinstance(compound_ids, list):
            errors.append(f"{prefix}.compound_ids must be a list")
        elif any(not isinstance(compound_id, str) or not compound_id.strip() for compound_id in compound_ids):
            errors.append(f"{prefix}.compound_ids must contain only non-empty strings")

    return errors


def _manifest_indexes(manifest: dict) -> tuple[dict[str, dict], dict[str, list[dict]]]:
    records_by_id: dict[str, dict] = {}
    records_by_compound: dict[str, list[dict]] = defaultdict(list)
    for record in manifest.get("records", []):
        if not isinstance(record, dict):
            continue
        record_id = record.get("record_id")
        if isinstance(record_id, str):
            records_by_id.setdefault(record_id, record)
        for compound_id in record.get("compound_ids", []):
            if isinstance(compound_id, str):
                records_by_compound[compound_id].append(record)
    return records_by_id, records_by_compound


def _validate_packet_record(
    packet_record: object,
    *,
    compound: str,
    status: str,
    records_by_id: dict[str, dict],
    records_by_compound: dict[str, list[dict]],
    location: str,
) -> list[str]:
    errors: list[str] = []
    if not isinstance(packet_record, dict):
        return [f"{location} must be an object"]

    record_id = packet_record.get("record_id")
    manifest_record = records_by_id.get(record_id)
    if manifest_record is None:
        errors.append(f"{location}.record_id {record_id!r} is absent from the manifest")
        return errors

    if manifest_record not in records_by_compound.get(compound, []):
        errors.append(
            f"{location}.record_id {record_id!r} is not licensed evidence for "
            f"candidate {compound}"
        )
    if status != manifest_record.get("evidence_label"):
        errors.append(
            f"{location} status {status!r} does not match manifest evidence_label "
            f"{manifest_record.get('evidence_label')!r}"
        )

    for packet_field, manifest_field in _PACKET_RECORD_FIELDS.items():
        expected = manifest_record.get(manifest_field)
        if packet_record.get(packet_field) != expected:
            errors.append(
                f"{location}.{packet_field} does not match manifest record "
                f"{record_id!r}"
            )
    return errors


def validate_demo(demo: dict, manifest: dict, *, path: Path | None = None) -> list[str]:
    """Return errors when a saved demo packet drifts from the evidence manifest."""
    location = str(path) if path else "demo"
    if not isinstance(demo, dict):
        return [f"{location} must be an object"]
    errors: list[str] = []
    records_by_id, records_by_compound = _manifest_indexes(manifest)

    evidence_source = demo.get("evidence_source")
    if not isinstance(evidence_source, dict):
        errors.append(f"{location}.evidence_source must be an object")
    else:
        if evidence_source.get("manifest") != "research/data/biomedical_evidence_manifest.json":
            errors.append(f"{location}.evidence_source.manifest points to the wrong manifest")
        if evidence_source.get("citation_key") != "PMCID":
            errors.append(f"{location}.evidence_source.citation_key must be PMCID")

    rankings = demo.get("rankings")
    if not isinstance(rankings, dict):
        return errors + [f"{location}.rankings must be an object"]

    for method, ranking in rankings.items():
        if not isinstance(ranking, list):
            errors.append(f"{location}.rankings.{method} must be a list")
            continue
        for row_index, row in enumerate(ranking):
            row_location = f"{location}.rankings.{method}[{row_index}]"
            if not isinstance(row, dict):
                errors.append(f"{row_location} must be an object")
                continue

            compound = row.get("compound")
            if not isinstance(compound, str) or not compound.strip():
                errors.append(f"{row_location}.compound must be non-empty")
                continue

            evidence = row.get("evidence")
            if not isinstance(evidence, dict):
                errors.append(f"{row_location}.evidence must be an object")
                continue
            status = evidence.get("status")
            if not isinstance(status, str) or not status.strip():
                errors.append(f"{row_location}.evidence.status must be explicit")
                continue

            packet_records = evidence.get("records")
            if not isinstance(packet_records, list):
                errors.append(f"{row_location}.evidence.records must be a list")
                continue

            if status == _NO_LICENSED_RECORD:
                if packet_records:
                    errors.append(
                        f"{row_location} no_licensed_record cannot cite records"
                    )
                if compound in records_by_compound:
                    errors.append(
                        f"{row_location} marks {compound} as no_licensed_record "
                        "but the manifest has licensed evidence"
                    )
                lookup = evidence.get("lookup")
                if not isinstance(lookup, dict) or lookup.get("compound_id") != compound:
                    errors.append(
                        f"{row_location}.evidence.lookup.compound_id must match candidate"
                    )
                continue

            if not packet_records:
                errors.append(
                    f"{row_location} status {status!r} must cite at least one record"
                )
                continue
            for record_index, packet_record in enumerate(packet_records):
                errors.extend(
                    _validate_packet_record(
                        packet_record,
                        compound=compound,
                        status=status,
                        records_by_id=records_by_id,
                        records_by_compound=records_by_compound,
                        location=f"{row_location}.evidence.records[{record_index}]",
                    )
                )
    return errors


def validate_evidence(manifest_path: Path, demo_paths: list[Path]) -> dict[str, int]:
    """Validate a manifest and all saved packets, raising on any drift."""
    manifest = load_json(manifest_path)
    errors = validate_manifest(manifest)
    checked_candidates = 0
    for demo_path in demo_paths:
        demo = load_json(demo_path)
        errors.extend(validate_demo(demo, manifest, path=demo_path))
        rankings = demo.get("rankings", {})
        if isinstance(rankings, dict):
            checked_candidates += sum(
                len(ranking)
                for ranking in rankings.values()
                if isinstance(ranking, list)
            )

    if errors:
        details = "\n".join(f"- {error}" for error in errors)
        raise ValueError(f"Evidence validation failed with {len(errors)} error(s):\n{details}")
    return {"manifest_records": len(manifest["records"]), "demo_candidates": checked_candidates}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--demo",
        action="append",
        type=Path,
        help="Saved query_demo JSON; pass once for each hop/query packet. "
        "Defaults to the saved 2-hop and 3-hop packets in validation-only mode.",
    )
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument(
        "--validate-only",
        action="store_true",
        help="Validate the manifest and demo packets without writing an evidence review.",
    )
    parser.add_argument("--gold", type=Path, default=DEFAULT_GOLD)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    if args.validate_only:
        demo_paths = [path.resolve() for path in (args.demo or DEFAULT_DEMOS)]
    else:
        if not args.demo:
            parser.error("--demo is required unless --validate-only is used")
        demo_paths = [path.resolve() for path in args.demo]
    manifest_path = args.manifest.resolve()
    summary = validate_evidence(manifest_path, demo_paths)
    if args.validate_only:
        print(
            "Evidence validation passed: "
            f"{summary['manifest_records']} manifest records and "
            f"{summary['demo_candidates']} demo candidates checked."
        )
        return

    gold_path = args.gold.resolve()
    gold = load_json(gold_path)
    annotations = {
        (row["query_id"], row["compound"]): row for row in gold["annotations"]
    }
    observed: dict[str, dict[str, dict[str, int | bool | None]]] = defaultdict(dict)
    for demo_path in demo_paths:
        demo = load_json(demo_path)
        query_id = demo["query"]["query_id"]
        for method, ranking in demo["rankings"].items():
            for row in ranking:
                annotation_key = (query_id, row["compound"])
                if annotation_key in annotations:
                    observed[method][f"{query_id}::{row['compound']}"] = {
                        "rank": row["rank"],
                        "graph_path_support_observed": row["path_verified_in_train_graph"],
                    }

    dimension_counts = {
        "graph_path_support": Counter(),
        "evidence_support": Counter(),
        "therapeutic_plausibility": Counter(),
    }
    for row in annotations.values():
        dimension_counts["graph_path_support"][str(row["graph_path_support"])] += 1
        dimension_counts["evidence_support"][row["evidence_support"]] += 1
        dimension_counts["therapeutic_plausibility"][row["therapeutic_plausibility"]] += 1

    method_summary = {}
    for method, rows in observed.items():
        by_dimension = {
            "graph_path_support": Counter(),
            "evidence_support": Counter(),
            "therapeutic_plausibility": Counter(),
        }
        for key, observation in rows.items():
            query_id, compound = key.rsplit("::", 1)
            annotation = annotations[(query_id, compound)]
            by_dimension["graph_path_support"][
                str(annotation["graph_path_support"])
            ] += 1
            by_dimension["evidence_support"][annotation["evidence_support"]] += 1
            by_dimension["therapeutic_plausibility"][
                annotation["therapeutic_plausibility"]
            ] += 1
        top_ranked: dict[str, dict] = {}
        for demo_path in demo_paths:
            demo = load_json(demo_path)
            query_id = demo["query"]["query_id"]
            ranking = demo["rankings"].get(method, [])
            if ranking and (query_id, ranking[0]["compound"]) in annotations:
                annotation = annotations[(query_id, ranking[0]["compound"])]
                top_ranked[query_id] = {
                    "compound": ranking[0]["compound"],
                    "graph_path_support_observed": ranking[0][
                        "path_verified_in_train_graph"
                    ],
                    "graph_path_support_gold": annotation["graph_path_support"],
                    "graph_path_agrees": ranking[0][
                        "path_verified_in_train_graph"
                    ]
                    == annotation["graph_path_support"],
                    "evidence_support": annotation["evidence_support"],
                    "therapeutic_plausibility": annotation[
                        "therapeutic_plausibility"
                    ],
                }
        method_summary[method] = {
            "annotated_candidates_retrieved": len(rows),
            "top_ranked_annotated_queries": len(top_ranked),
            "top_ranked_dimensions": {
                "graph_path_agreement": sum(
                    row["graph_path_agrees"] for row in top_ranked.values()
                ),
                "graph_path_support": dict(
                    Counter(
                        str(row["graph_path_support_gold"])
                        for row in top_ranked.values()
                    )
                ),
                "evidence_support": dict(
                    Counter(row["evidence_support"] for row in top_ranked.values())
                ),
                "therapeutic_plausibility": dict(
                    Counter(
                        row["therapeutic_plausibility"]
                        for row in top_ranked.values()
                    )
                ),
            },
            "top_ranked_annotations": top_ranked,
            "annotated_candidates_by_rank": sorted(
                [
                    {
                        "query_id": key.rsplit("::", 1)[0],
                        "compound": key.rsplit("::", 1)[1],
                        **value,
                    }
                    for key, value in rows.items()
                ],
                key=lambda item: (item["query_id"], item["rank"]),
            ),
            "dimensions": {name: dict(counts) for name, counts in by_dimension.items()},
        }

    output = {
        "schema_version": "1.0",
        "gold_standard": str(gold_path.relative_to(ROOT)),
        "demo_packets": [str(path.relative_to(ROOT)) for path in demo_paths],
        "annotated_candidates": len(annotations),
        "gold_set_dimensions": {name: dict(counts) for name, counts in dimension_counts.items()},
        "method_views": method_summary,
        "interpretation": (
            "These are evidence-grounding labels and coverage views, not "
            "Recall/MRR and not clinical validation. Direct or supportive text "
            "does not establish safety, efficacy, dosage, or patient suitability."
        ),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()