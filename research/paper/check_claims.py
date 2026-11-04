"""Recompute every key number quoted in the paper text and check it appears there.

Usage: python research/paper/check_claims.py [paper.md ...]
Exit code 1 if any claim fails. Tables are generated from result files by the
builders, so this script covers numbers written in prose.
"""
from __future__ import annotations

import csv
import json
import math
import statistics
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MAIN = ROOT / "research" / "results" / "main_benchmark"
SWEEP = ROOT / "research" / "results" / "hallucination_sweep"
PILOT = ROOT / "research" / "results" / "controlled_geometry"


def _csv(path: Path) -> list[dict]:
    with path.open(encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def f3(x: float) -> str:
    return f"{x:.3f}"


def claims() -> list[tuple[str, bool, list[str]]]:
    """Return (description, numeric condition holds, strings that must appear in text)."""
    out: list[tuple[str, bool, list[str]]] = []
    main = {(r["split"], r["method"]): r for r in _csv(MAIN / "aggregate_metrics.csv")}
    summ = {(r["config"], r["split"]): r for r in _csv(SWEEP / "summary.csv")}
    comp = {(r["poincare"], r["split"], r["metric"], r["seed_set"]): r for r in _csv(SWEEP / "comparisons.csv")}
    g = lambda r, k: float(r[k])  # noqa: E731

    # Main benchmark accuracy.
    e3, p3 = main[("3hop_test", "euclidean")], main[("3hop_test", "poincare")]
    out.append(("3-hop main MRR", True, [f3(g(e3, "mrr_mean")), f3(g(p3, "mrr_mean"))]))
    nodes = json.loads((MAIN / "node_index_seed7.json").read_text(encoding="utf-8"))
    n = sum(1 for x in nodes if x["kind"] == "Compound")
    chance = sum(1 / r for r in range(1, n + 1)) / n
    out.append(("candidates and chance MRR", n == 666, ["666", f3(chance), f3(10 / n)]))

    seed_rows = _csv(MAIN / "metrics_by_seed.csv")
    by = {(r["split"], r["method"], r["seed"]): r for r in seed_rows}
    seeds = sorted({r["seed"] for r in seed_rows}, key=int)
    all_include_zero = True
    for split in ("2hop_test", "3hop_test"):
        for metric in ("recall_at_1", "recall_at_5", "recall_at_10", "mrr"):
            d = [g(by[(split, "poincare", s)], metric) - g(by[(split, "euclidean", s)], metric) for s in seeds]
            half = 2.776 * statistics.stdev(d) / math.sqrt(len(d))
            all_include_zero &= (statistics.mean(d) - half) <= 0 <= (statistics.mean(d) + half)
    out.append(("main paired accuracy differences not significant", all_include_zero, []))

    pv3, pv2 = main[("3hop_test", "poincare_with_path_verification")], main[("2hop_test", "poincare_with_path_verification")]
    p2 = main[("2hop_test", "poincare")]
    out.append(("path verification main MRR", True,
                [f3(g(pv3, "mrr_mean")), f3(g(p2, "mrr_mean")), f3(g(pv2, "mrr_mean"))]))
    out.append(("no hop weighting 3-hop MRR", True,
                [f3(g(main[("3hop_test", "poincare_no_hop_weighting")], "mrr_mean"))]))
    hhr = lambda split, m: 1 - g(main[(split, m)], "top1_path_verified_rate_mean")  # noqa: E731
    out.append(("main 2-hop HHR@1 P vs E", True, [f3(hhr("2hop_test", "poincare")), f3(hhr("2hop_test", "euclidean"))]))

    # Sweep primary result.
    pr = comp[("poincare_d8_c1", "3hop_test", "hhr_at_1", "all_10_seeds")]
    out.append(("primary d8 c1 HHR", g(pr, "p_holm") < 0.05 and int(pr["negative"]) == 10,
                [f3(g(summ[("poincare_d8_c1", "3hop_test")], "hhr_at_1_mean")),
                 f3(g(summ[("euclidean_d8", "3hop_test")], "hhr_at_1_mean")),
                 f"{g(pr, 'mean_diff'):.3f}".replace("-", "−"), f3(g(pr, "p_holm")),
                 f"[{g(pr, 'ci95_low'):.3f}, {g(pr, 'ci95_high'):.3f}]".replace("-", "−")]))
    out.append(("d8 accuracy unchanged", True,
                [f3(g(summ[("poincare_d8_c1", "3hop_test")], "mrr_mean")),
                 f3(g(summ[("euclidean_d8", "3hop_test")], "mrr_mean"))]))
    others = [k for k in comp if k[1:] == ("3hop_test", "hhr_at_1", "all_10_seeds") and k[0] != "poincare_d8_c1"]
    out.append(("other seven primary comparisons n.s.",
                len(others) == 7 and all(g(comp[k], "p_holm") >= 0.05 for k in others), []))
    ns = comp[("poincare_d8_c1", "3hop_test", "hhr_at_1", "new_5_seeds")]
    out.append(("new-seed sensitivity", int(ns["negative"]) == 5 and g(ns, "ci95_high") > 0,
                [f"{g(ns, 'mean_diff'):.3f}".replace("-", "−")]))

    # 2-hop secondary.
    two = [comp[(f"poincare_d{d}_c{c}", "2hop_test", "hhr_at_1", "all_10_seeds")] for d in (4, 8) for c in (1, 10)]
    diffs = [-g(r, "mean_diff") for r in two]
    mrr2 = [abs(g(comp[(f"poincare_d{d}_c{c}", "2hop_test", "mrr", "all_10_seeds")], "mean_diff"))
            for d in (4, 8) for c in (1, 10)]
    out.append(("2-hop d4/d8 HHR reductions",
                max(g(r, "p_holm") for r in two) < 0.02 and min(int(r["negative"]) for r in two) >= 8
                and max(mrr2) <= 0.0025,
                [f"{100 * min(diffs):.1f}", f"{100 * max(diffs):.1f}", "p < 0.02"]))

    # d = 2 failure and path-verification floor.
    d2 = [g(summ[(c, "3hop_test")], "mrr_mean") for c in ("euclidean_d2", "poincare_d2_c1", "poincare_d2_c10")]
    d2h = [g(summ[(c, "3hop_test")], "hhr_at_1_mean") for c in ("euclidean_d2", "poincare_d2_c1", "poincare_d2_c10")]
    out.append(("d = 2 fails", min(d2h) > 0.9, [f3(min(d2)), f3(max(d2))]))
    pv = {round(g(r, "pv_hhr_at_1_mean"), 3) for (c, s), r in summ.items() if s == "3hop_test"}
    pv2s = {round(g(r, "pv_hhr_at_1_mean"), 3) for (c, s), r in summ.items() if s == "2hop_test"}
    out.append(("path-verification floor", len(pv) == 1 and pv2s == {0.0}, [f3(pv.pop())]))

    # Pilot.
    agg = {r["model"]: r for r in json.loads((PILOT / "aggregate_metrics.json").read_text(encoding="utf-8"))}
    out.append(("pilot matched MRR", True, [f3(agg["euclidean"]["mrr"]), f3(agg["poincare"]["mrr"])]))

    # Training loss of main benchmark.
    hist = json.loads((MAIN / "training_history.json").read_text(encoding="utf-8"))
    first = statistics.mean(h["euclidean_loss"] for h in hist if h["epoch"] == 1)
    last = statistics.mean(h["euclidean_loss"] for h in hist if h["epoch"] == max(x["epoch"] for x in hist))
    out.append(("main loss", round(first, 3) == 0.448 and abs(last - 0.335) < 0.005, ["0.448", "0.335"]))

    # Relation-aware baselines and filtered ranking.
    base_dir = ROOT / "research" / "results" / "baselines"
    if (base_dir / "summary.csv").exists():
        bs = {(r["config"], r["split"]): r for r in _csv(base_dir / "summary.csv")}
        bc = {(r["family"], r["a"], r["split"], r["metric"]): r for r in _csv(base_dir / "comparisons.csv")}
        rel = [f"{m}_d{d}" for m in ("transe", "murp") for d in (8, 16)]
        free = [f"{m}_d{d}" for m in ("euclidean", "poincare") for d in (8, 16)]

        def rng(names, split, metric):
            vals = [g(bs[(n, split)], f"{metric}_mean") for n in names]
            return f"{min(vals):.3f}–{max(vals):.3f}"

        out.append(("baseline 3-hop filtered MRR ranges", True,
                    [rng(rel, "3hop_test", "filtered_mrr"), rng(free, "3hop_test", "filtered_mrr")]))
        out.append(("baseline 3-hop HHR ranges", True,
                    [rng(rel, "3hop_test", "hhr_at_1"), rng(free, "3hop_test", "hhr_at_1")]))
        out.append(("baseline 2-hop ranges", True,
                    [rng(rel, "2hop_test", "filtered_mrr"), rng(free, "2hop_test", "filtered_mrr"),
                     rng(rel, "2hop_test", "hhr_at_1"), rng(free, "2hop_test", "hhr_at_1")]))
        eight = [bc[("relational_vs_free_" + ("euclidean" if n.startswith("transe") else "hyperbolic"), n, "3hop_test", m)]
                 for n in rel for m in ("filtered_mrr", "hhr_at_1")]
        out.append(("all eight 3-hop relational vs relation-free differences significant",
                    all(g(r, "p_holm") < 0.01 and max(int(r["positive"]), int(r["negative"])) >= 9 for r in eight), []))
        geo3 = [bc[("geometry_relational", f"murp_d{d}", "3hop_test", m)] for d in (8, 16) for m in ("hhr_at_1", "filtered_mrr")]
        out.append(("no significant 3-hop geometry effect within relational family",
                    all(g(r, "p_holm") >= 0.05 for r in geo3), []))
        m16 = bc[("geometry_relational", "murp_d16", "2hop_test", "hhr_at_1")]
        f16 = bc[("geometry_relational", "murp_d16", "2hop_test", "filtered_mrr")]
        out.append(("MuRP vs TransE 2-hop d16",
                    g(m16, "p_holm") < 0.001 and int(m16["negative"]) == 10 and g(f16, "p_holm") >= 0.05,
                    [f"{-100 * g(m16, 'mean_diff'):.1f} points",
                     f"[{g(m16, 'ci95_low'):.3f}, {g(m16, 'ci95_high'):.3f}]".replace("-", "−"),
                     f"+{g(f16, 'mean_diff'):.3f}"]))
        ratios = [g(bs[(n, "2hop_test")], "filtered_mrr_mean") / g(bs[(n, "2hop_test")], "mrr_mean") for n in rel + free]
        out.append(("filtered raises 2-hop MRR about 2-3x", 1.8 <= min(ratios) and max(ratios) <= 3.0, ["2–3"]))
        pv_rel = {round(g(bs[(n, "3hop_test")], "pv_hhr_at_1_mean"), 3) for n in rel}
        out.append(("path verification floor for relational models", pv_rel == {0.026}, []))
    return out


def main() -> int:
    papers = [Path(p) for p in sys.argv[1:]] or [ROOT / "research" / "paper" / "ieee_paper.md"]
    failures = 0
    for paper in papers:
        text = paper.read_text(encoding="utf-8")
        print(f"== {paper.name}")
        for description, ok, needles in claims():
            missing = [s for s in needles if s not in text]
            status = "OK " if ok and not missing else "FAIL"
            failures += status == "FAIL"
            extra = f"  missing in text: {missing}" if missing else ""
            extra += "" if ok else "  numeric condition false"
            print(f"  [{status}] {description}{extra}")
    print("ALL CLAIMS VERIFIED" if not failures else f"{failures} CLAIM(S) FAILED")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
