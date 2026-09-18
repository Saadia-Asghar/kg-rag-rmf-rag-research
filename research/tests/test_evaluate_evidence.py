#!/usr/bin/env python3
"""Regression tests for the frozen evidence manifest and saved packets."""

from __future__ import annotations

import copy
import json
import sys
import unittest
from pathlib import Path


RESEARCH_ROOT = Path(__file__).resolve().parents[1]
FIXTURE_ROOT = Path(__file__).resolve().parent / "fixtures"
sys.path.insert(0, str(RESEARCH_ROOT / "scripts"))

from evaluate_evidence import validate_demo, validate_manifest  # noqa: E402


def load_fixture(name: str) -> dict:
    return json.loads((FIXTURE_ROOT / name).read_text(encoding="utf-8"))


class EvidenceValidationFixturesTest(unittest.TestCase):
    def setUp(self) -> None:
        self.manifest = load_fixture("valid_manifest.json")
        self.demo = load_fixture("valid_demo.json")

    def test_valid_manifest_and_demo_fixture_pass(self) -> None:
        self.assertEqual(validate_manifest(self.manifest), [])
        self.assertEqual(validate_demo(self.demo, self.manifest), [])

    def test_rejects_non_cc_by_license(self) -> None:
        manifest = copy.deepcopy(self.manifest)
        manifest["records"][0]["license"] = "CC BY-NC"

        errors = validate_manifest(manifest)

        self.assertTrue(any("license must be exactly CC BY" in error for error in errors))

    def test_rejects_missing_or_malformed_identifiers(self) -> None:
        cases = (
            ("pmcid", None, "must be non-empty"),
            ("pmcid", "PMC-not-a-number", "must be a PMCID"),
            ("pmid", None, "must be non-empty"),
            ("pmid", "12A45", "must be a numeric PMID"),
            ("doi", None, "must be non-empty"),
            ("doi", "doi:example", "must be a DOI"),
        )

        for field, value, expected_text in cases:
            with self.subTest(field=field, value=value):
                manifest = copy.deepcopy(self.manifest)
                if value is None:
                    del manifest["records"][0][field]
                else:
                    manifest["records"][0][field] = value

                errors = validate_manifest(manifest)

                self.assertTrue(any(expected_text in error for error in errors))

    def test_rejects_blank_snippets(self) -> None:
        manifest = copy.deepcopy(self.manifest)
        manifest["records"][0]["snippet"] = " \n "

        errors = validate_manifest(manifest)

        self.assertTrue(any("snippet must be non-empty" in error for error in errors))

    def test_rejects_duplicate_record_ids(self) -> None:
        manifest = copy.deepcopy(self.manifest)
        manifest["records"][1]["record_id"] = manifest["records"][0]["record_id"]

        errors = validate_manifest(manifest)

        self.assertTrue(any("record_id duplicates PMC123" in error for error in errors))

    def test_rejects_missing_candidate_status(self) -> None:
        demo = copy.deepcopy(self.demo)
        del demo["rankings"]["lexical"][0]["evidence"]["status"]

        errors = validate_demo(demo, self.manifest)

        self.assertTrue(
            any("evidence.status must be explicit" in error for error in errors)
        )

    def test_rejects_unknown_cited_record(self) -> None:
        demo = copy.deepcopy(self.demo)
        demo["rankings"]["lexical"][0]["evidence"]["records"][0]["record_id"] = (
            "PMC999"
        )

        errors = validate_demo(demo, self.manifest)

        self.assertTrue(
            any("record_id 'PMC999' is absent from the manifest" in error for error in errors)
        )

    def test_rejects_stale_packet_fields(self) -> None:
        packet_fields = {
            "pmcid": "PMC999",
            "pmid": "9999999",
            "doi": "10.1234/stale",
            "license": "CC BY-NC",
            "authors": "Stale Author.",
            "title": "Stale title",
            "source_url": "https://example.com/stale",
            "scope": "Stale scope.",
            "snippet": "Stale snippet.",
        }

        for field, stale_value in packet_fields.items():
            with self.subTest(field=field):
                demo = copy.deepcopy(self.demo)
                demo["rankings"]["lexical"][0]["evidence"]["records"][0][field] = (
                    stale_value
                )

                errors = validate_demo(demo, self.manifest)

                self.assertTrue(
                    any(
                        f".{field} does not match manifest record 'PMC123'" in error
                        for error in errors
                    )
                )


if __name__ == "__main__":
    unittest.main()