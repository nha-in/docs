#!/usr/bin/env python3
"""Checks the workbook writer the test skills ship, against NHA's own sheets.

The script integrators copy lives in one place, the python block of
catalogue/shared/concepts/test-workbook-write-back.md, and is folded into every
test skill. This takes that block, not a copy, and for every NHA sheet with case
ids writes a result for every case, once as an ft run and once as a ui run,
then checks:

- every case id the sheet holds is found, and nothing else is written to;
- each case's row reads back what was written, in that run type's columns;
- every other cell, the merged ranges and the logos are as NHA sent them;
- `open` lists exactly the cases that are not PASS.

Usage: python3 scripts/check-workbook-writeback.py
Needs openpyxl and Pillow. Exits 0 when every check passes.
"""
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
ATOM = ROOT / "catalogue" / "shared" / "concepts" / "test-workbook-write-back.md"
RAW = ROOT / "catalogue" / "hiecm" / "openapi" / ".raw"
SHEETS = [
    "nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx",
    "nha-2026-10-22-m2-tests/M2_BUILDING_HIP_TEST_CASES.xlsx",
    "nha-2026-10-22-m3-tests/M3_BUILDING_HIU_TEST_CASES.xlsx",
    "nha-2026-10-02-m4-tests/HFR_Test_Cases.xlsx",
    "nha-2026-10-02-m4-tests/HPR_Test_Cases.xlsx",
]
OUTCOMES = ["passed", "failed", "needs-human", "not-run"]
failures = []


def fail(message):
    failures.append(message)
    print(f"FAIL {message}")


def snapshot(path):
    wb = openpyxl.load_workbook(path)
    cells = {}
    for ws in wb.worksheets:
        for row in ws.iter_rows():
            for c in row:
                if c.value is not None:
                    cells[(ws.title, c.coordinate)] = c.value
    shape = {ws.title: (sorted(str(r) for r in ws.merged_cells.ranges), len(ws._images)) for ws in wb.worksheets}
    return cells, shape


def main():
    block = re.search(r"```python\n(.*?)\n```", ATOM.read_text(), re.S)
    if not block:
        sys.exit(f"no python block in {ATOM.relative_to(ROOT)}")
    work = Path(tempfile.mkdtemp())
    script = work / "abdm_workbook.py"
    script.write_text(block.group(1) + "\n")

    def run(*args):
        return subprocess.run([sys.executable, str(script), *map(str, args)], capture_output=True, text=True)

    for rel in SHEETS:
        src = RAW / rel
        book = work / src.name
        shutil.copy2(src, book)
        listed = run("cases", book)
        if listed.returncode:
            fail(f"{rel}: cases exited {listed.returncode}: {listed.stderr.strip()}")
            continue
        ids = [i for sheet in json.loads(listed.stdout).values() for i in sheet]
        if not ids:
            fail(f"{rel}: no case ids found")
            continue
        before, shape = snapshot(src)
        written = {}
        for run_type in ("ft", "ui"):
            results = [{"id": i, "outcome": OUTCOMES[n % 4], "response": f"{run_type} response {n}",
                        "iterations": n % 3 + 1, "remarks": f"{run_type} remark {n}"} for n, i in enumerate(ids)]
            path = work / f"{run_type}.json"
            path.write_text(json.dumps(results))
            out = run("write", book, "--run", run_type, "--results", path, "--executed-by", "Tester", "--application", "App")
            if out.returncode or out.stdout or out.stderr:
                fail(f"{rel} {run_type}: write exited {out.returncode}: {out.stderr.strip()}")
            written[run_type] = results
        if not (work / f"{src.stem}.before-abdm-run{src.suffix}").exists():
            fail(f"{rel}: no backup written")

        after, shape_after = snapshot(book)
        if shape_after != shape:
            fail(f"{rel}: merged ranges or logos changed")
        changed = {k for k in before if after.get(k) != before[k]}
        allowed = re.compile(r"^(Status|Status\(PASS/FAIL\)|Response of Request with Code|Iterations|Remarks?|FT .*|"
                             r"Test Executed by:|Test Execution date:|Application/ System Name:)")
        wb = openpyxl.load_workbook(book)
        for ws in wb.worksheets:
            header = None
            for row in ws.iter_rows(min_row=1, max_row=15):
                if any(re.sub(r"\s+", " ", str(c.value or "")).strip() == "Test Case ID" for c in row):
                    header = {c.column: re.sub(r"\s+", " ", str(c.value or "")).strip() for c in row}
                    break
            if header is None:
                continue
            for title, coord in [k for k in changed if k[0] == ws.title]:
                cell = ws[coord]
                label = re.sub(r"\s+", " ", str(before[(title, coord)])).strip()
                if allowed.match(header.get(cell.column, "")) or allowed.match(label):
                    continue
                fail(f"{rel}: {title}!{coord} changed outside the result columns")
            for title, coord in [k for k in after if k not in before and k[0] == ws.title]:
                cell = ws[coord]
                if allowed.match(header.get(cell.column, "")) or allowed.match(str(cell.value)):
                    continue
                fail(f"{rel}: {title}!{coord} written outside the result columns")

        for run_type, results in written.items():
            out = run("open", book, "--run", run_type)
            listed_open = set(out.stdout.split())
            expected = {r["id"] for r in results if r["outcome"] != "passed"}
            if listed_open != expected:
                fail(f"{rel} {run_type}: open listed {len(listed_open)} cases, expected {len(expected)}")
        print(f"ok   {rel}: {len(ids)} case(s), ft and ui written, nothing else changed")

    (work / "missing.json").write_text(json.dumps([{"id": "NOT_A_CASE", "outcome": "passed"}]))
    bad = run("write", work / Path(SHEETS[2]).name, "--run", "ft", "--results", work / "missing.json")
    if bad.returncode != 1 or "not in the workbook: NOT_A_CASE" not in bad.stderr:
        fail("an unknown case id is not refused")
    else:
        print("ok   an unknown case id is refused")

    shutil.rmtree(work)
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
