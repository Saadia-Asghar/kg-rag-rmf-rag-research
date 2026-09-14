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
DEFAULT_FULL_BENCHMARK = (
    ROOT / "research" / "results" / "main_benchmark" / "full_test_evidence.json"
)

_PMCID_PATTERN = re.compile(r"^PMC[0-9]+$")
_PMID_PATTERN = re.compile(r"^[0-9]+$")
_DOI_PATTERN = re.compile(r"^10\.[0-9]{4,9}/\S+$")
_NO_LICENSED_RECORD = "no_licensed_record"
_DIRECT_LABEL_PREFIX = "direct_"
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


def _evidence_support_label(status: str) -> str:
    if status == _NO_LICENSED_RECORD:
        return _NO_LICENSED_RECORD
    if status.startswith(_DIRECT_LABEL_PREFIX):
        return "direct_support"
    return "context_only"


def _coverage_group(rows: list[dict]) -> dict:
    statuses = Counter(row["evidence"]["status"] for row in rows)
    support = Counter(_evidence_support_label(row["evidence"]["status"]) for row in rows)
    total = len(rows)
    return {
        "candidate_lookups": total,
        "queries": len({(row["seed"], row["query_id"]) for row in rows}),
        "unique_queries": len({row["query_id"] for row in rows}),
        "evidence_status_counts": dict(sorted(statuses.items())),
        "evidence_support_counts": dict(
            sorted(
                support.items(),
                key=lambda item: (
                    {"direct_support": 0, "context_only": 1, _NO_LICENSED_RECORD: 2}.get(
                        item[0], 3
                    ),
                    item[0],
                ),
            )
        ),
        "coverage_rates": {
            "licensed_record": (
                (total - support[_NO_LICENSED_RECORD]) / total if total else 0.0
            ),
            "direct_support": support["direct_support"] / total if total else 0.0,
            "any_text_context": (
                (support["direct_support"] + support["context_only"]) / total
                if total
                else 0.0
            ),
        },
    }


def build_coverage_summary(rows: list[dict]) -> dict:
    """Summarize lookup coverage without mixing it into Recall/MRR metrics."""
    by_hop: dict[str, list[dict]] = defaultdict(list)
    by_method: dict[str, list[dict]] = defaultdict(list)
    by_hop_method: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        hop = str(row["hop"])
        method = row["method"]
        by_hop[hop].append(row)
        by_method[method].append(row)
        by_hop_method[f"{hop}hop::{method}"].append(row)
    return {
        "basis": "top-ranked candidates retained per saved test query and method",
        "overall": _coverage_group(rows),
        "by_hop": {
            key: _coverage_group(by_hop[key]) for key in sorted(by_hop, key=int)
        },
        "by_method": {
            key: _coverage_group(by_method[key]) for key in sorted(by_method)
        },
        "by_hop_and_method": {
            key: _coverage_group(by_hop_method[key])
            for key in sorted(by_hop_method)
        },
    }


def validate_full_benchmark(
    benchmark: dict, manifest: dict, *, path: Path | None = None
) -> list[str]:
    """Validate every compact lookup and its independently recomputed coverage."""
    location = str(path) if path else "full_benchmark"
    errors: list[str] = []
    if not isinstance(benchmark, dict):
        return [f"{location} must be an object"]
    if benchmark.get("schema_version") != "1.0":
        errors.append(f"{location}.schema_version must be '1.0'")
    if benchmark.get("split") != "test":
        errors.append(f"{location}.split must be 'test'")
    methods = benchmark.get("methods")
    if not isinstance(methods, list) or not methods or any(
        not isinstance(method, str) or not method for method in methods
    ):
        errors.append(f"{location}.methods must be a non-empty list of names")
        methods = []
    elif len(set(methods)) != len(methods):
        errors.append(f"{location}.methods must not contain duplicates")
    seeds = benchmark.get("seeds")
    if not isinstance(seeds, list) or not seeds or any(
        not isinstance(seed, int) for seed in seeds
    ):
        errors.append(f"{location}.seeds must be a non-empty list of integers")
        seeds = []
    cutoff = benchmark.get("ranking_cutoff")
    if not isinstance(cutoff, int) or cutoff < 1:
        errors.append(f"{location}.ranking_cutoff must be a positive integer")
        cutoff = 0

    records_by_id, records_by_compound = _manifest_indexes(manifest)
    rows = benchmark.get("candidate_lookups")
    if not isinstance(rows, list):
        return errors + [f"{location}.candidate_lookups must be a list"]

    seen: set[tuple[int, str, str, int]] = set()
    for index, row in enumerate(rows):
        row_location = f"{location}.candidate_lookups[{index}]"
        if not isinstance(row, dict):
            errors.append(f"{row_location} must be an object")
            continue
        query_id = row.get("query_id")
        seed = row.get("seed")
        hop = row.get("hop")
        method = row.get("method")
        rank = row.get("rank")
        compound = row.get("compound")
        key = (seed, query_id, method, rank)
        if not isinstance(query_id, str) or not query_id:
            errors.append(f"{row_location}.query_id must be non-empty")
        if not isinstance(seed, int) or seed not in seeds:
            errors.append(f"{row_location}.seed must be listed in {location}.seeds")
        if hop not in (2, 3):
            errors.append(f"{row_location}.hop must be 2 or 3")
        if method not in methods:
            errors.append(f"{row_location}.method must be listed in {location}.methods")
        if not isinstance(rank, int) or rank < 1 or rank > cutoff:
            errors.append(f"{row_location}.rank must be between 1 and ranking_cutoff")
        if not isinstance(compound, str) or not compound:
            errors.append(f"{row_location}.compound must be non-empty")
        if all(
            isinstance(value, (int, str))
            for value in (seed, query_id, method, rank)
        ):
            if key in seen:
                errors.append(f"{row_location} duplicates lookup key {key!r}")
            seen.add(key)

        evidence = row.get("evidence")
        if not isinstance(evidence, dict):
            errors.append(f"{row_location}.evidence must be an object")
            continue
        status = evidence.get("status")
        record_ids = evidence.get("record_ids")
        if not isinstance(status, str) or not status:
            errors.append(f"{row_location}.evidence.status must be explicit")
            continue
        if not isinstance(record_ids, list) or any(
            not isinstance(record_id, str) for record_id in record_ids
        ):
            errors.append(f"{row_location}.evidence.record_ids must be a list of strings")
            continue
        if status == _NO_LICENSED_RECORD:
            if record_ids:
                errors.append(f"{row_location} no_licensed_record cannot cite records")
            if compound in records_by_compound:
                errors.append(
                    f"{row_location} marks {compound} as no_licensed_record but the "
                    "manifest has licensed evidence"
                )
        elif not record_ids:
            errors.append(f"{row_location} {status!r} must cite at least one record")
        for record_id in record_ids:
            record = records_by_id.get(record_id)
            if record is None:
                errors.append(
                    f"{row_location}.evidence.record_ids contains unknown {record_id!r}"
                )
                continue
            if record not in records_by_compound.get(compound, []):
                errors.append(
                    f"{row_location}.evidence record {record_id!r} is not licensed "
                    f"evidence for candidate {compound}"
                )
            if record.get("evidence_label") != status:
                errors.append(
                    f"{row_location}.evidence.status {status!r} does not match "
                    f"manifest record {record_id!r}"
                )
        if status == _NO_LICENSED_RECORD and evidence.get("lookup") is not None:
            errors.append(
                f"{row_location}.evidence.lookup is not permitted for compact "
                "full-test rows"
            )

    expected: set[tuple[int, str, str, int]] = set()
    missing_query_sets: list[str] = []
    for seed in seeds:
        for hop in (2, 3):
            query_path = ROOT / "research" / "query_sets" / f"{hop}hop_test_seed{seed}.jsonl"
            if not query_path.exists():
                missing_query_sets.append(str(query_path))
                continue
            query_ids = [
                json.loads(line)["query_id"]
                for line in query_path.read_text(encoding="utf-8").splitlines()
                if line.strip()
            ]
            expected.update(
                (seed, query_id, method, rank)
                for query_id in query_ids
                for method in methods
                for rank in range(1, cutoff + 1)
            )
    if missing_query_sets:
        errors.append(
            f"{location} cannot verify completeness; missing query sets: "
            + ", ".join(missing_query_sets)
        )
    if expected:
        missing = expected - seen
        extra = seen - expected
        if missing:
            errors.append(
                f"{location} is missing {len(missing)} expected candidate lookups"
            )
        if extra:
            errors.append(
                f"{location} contains {len(extra)} candidate lookups not present "
                "in the saved test query sets"
            )
    coverage = benchmark.get("coverage")
    if not isinstance(coverage, dict):
        errors.append(f"{location}.coverage must be an object")
    elif not errors:
        expected = build_coverage_summary(rows)
        if coverage != expected:
            errors.append(f"{location}.coverage does not match candidate_lookups")
    return errors


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


def validate_evidence(
    manifest_path: Path,
    demo_paths: list[Path],
    full_benchmark_path: Path | None = None,
) -> dict[str, int]:
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
    full_candidates = 0
    if full_benchmark_path is not None:
        if not full_benchmark_path.exists():
            errors.append(f"{full_benchmark_path} does not exist")
        else:
            full_benchmark = load_json(full_benchmark_path)
            errors.extend(
                validate_full_benchmark(
                    full_benchmark, manifest, path=full_benchmark_path
                )
            )
            rows = full_benchmark.get("candidate_lookups", [])
            if isinstance(rows, list):
                full_candidates = len(rows)

    if errors:
        details = "\n".join(f"- {error}" for error in errors)
        raise ValueError(f"Evidence validation failed with {len(errors)} error(s):\n{details}")
    return {
        "manifest_records": len(manifest["records"]),
        "demo_candidates": checked_candidates,
        "full_test_candidates": full_candidates,
    }


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
        "--full-benchmark",
        type=Path,
        default=DEFAULT_FULL_BENCHMARK,
        help="Full-test compact evidence index. Defaults to the saved benchmark index.",
    )
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
    full_benchmark_path = args.full_benchmark.resolve()
    summary = validate_evidence(manifest_path, demo_paths, full_benchmark_path)
    if args.validate_only:
        print(
            "Evidence validation passed: "
            f"{summary['manifest_records']} manifest records and "
            f"{summary['demo_candidates']} demo candidates plus "
            f"{summary['full_test_candidates']} full-test candidate lookups checked."
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
        "full_benchmark": str(full_benchmark_path.relative_to(ROOT)),
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