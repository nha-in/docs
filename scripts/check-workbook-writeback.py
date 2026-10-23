#!/usr/bin/env python3
"""Checks the workbook writer the test skills ship, against NHA's own sheets.

The script integrators copy lives in one place, the python block of
catalogue/shared/concepts/test-workbook-write-back.md, and is folded into the
M1 to M4 test skills. This takes that block, not a copy, and for every NHA
sheet with case ids writes a result for every case, once as an ft run and once
as a ui run, then checks:

- every case reads back all four values at the column they belong in: NHA's
  own for ui, or its "(run)" column where NHA had already written in that cell,
  and four FT columns right after the last header for ft;
- every cell NHA filled still holds exactly what NHA put there, with its
  formatted runs, and no new cell appears anywhere else;
- the merged ranges and the logos are as NHA sent them;
- `open` lists exactly the cases not passed and not marked not run;
- a second write with another tester updates the header block;
- an unknown case id is refused.

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
from openpyxl.cell.rich_text import CellRichText

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
STATUS = {"passed": "PASS", "failed": "FAIL", "needs-human": "", "not-run": "NA"}
UI = {"status": ["Status(PASS/FAIL)", "Status"], "response": ["Response of Request with Code"],
      "iterations": ["Iterations"], "remarks": ["Remarks", "Remark"]}
FT = ["FT Status", "FT Response with Code", "FT Iterations", "FT Remarks"]
LABELS = ("Test Executed by:", "Test Execution date:", "Application/ System Name:")
failures = []


def fail(message):
    failures.append(message)
    print(f"FAIL {message}")


def norm(text):
    return re.sub(r"\s+", " ", str(text or "")).strip()


def header(ws):
    for row in ws.iter_rows(min_row=1, max_row=15):
        names = [norm(c.value) for c in row]
        if "Test Case ID" in names:
            first = {}
            for name, cell in zip(names, row):
                if name:
                    first.setdefault(name, cell.column)
            return row[0].row, first, max(first.values())
    return None, {}, 0


def case_rows(ws, top, id_col):
    found = {}
    for r in range(top + 1, ws.max_row + 1):
        value = norm(ws.cell(r, id_col).value)
        if value:
            base = key = value.replace(" ", "")
            n = 2
            while key in found:
                key, n = base + "#" + str(n), n + 1
            found[key] = r
    return found


def anchor(ws, row, col):
    for rng in ws.merged_cells.ranges:
        if rng.min_row <= row <= rng.max_row and rng.min_col <= col <= rng.max_col:
            return rng.min_row, rng.min_col
    return row, col


def cells(wb):
    return {(ws.title, c.coordinate): c.value for ws in wb.worksheets
            for row in ws.iter_rows() for c in row if c.value not in (None, "")}


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
        nha = openpyxl.load_workbook(src, rich_text=True)
        expected_cells = {}  # (sheet, coordinate) -> value the writer must have put there
        allowed_headers = {}  # (sheet, coordinate) -> header text the writer may add
        id_sheet = {}
        for ws in nha.worksheets:
            top, first, last = header(ws)
            if top is None:
                continue
            for case, row in case_rows(ws, top, first["Test Case ID"]).items():
                id_sheet[case] = (ws, top, first, last, row)

        results = {r: [{"id": i, "outcome": OUTCOMES[n % 4], "response": f"{r} response {n}",
                        "iterations": n % 3 + 1, "remarks": f"{r} remark {n}"} for n, i in enumerate(ids)]
                   for r in ("ft", "ui")}
        extra_ui = {}  # per sheet, ui fields that had no column and were added
        for r in ("ft", "ui"):
            for res in results[r]:
                ws, top, first, last, row = id_sheet[res["id"]]
                values = {"status": STATUS[res["outcome"]], "response": res["response"],
                          "iterations": res["iterations"],
                          "remarks": ("Needs tester: " + res["remarks"]) if res["outcome"] == "needs-human" else res["remarks"]}
                for k, key in enumerate(["status", "response", "iterations", "remarks"]):
                    if r == "ft":
                        col = last + 1 + k
                        allowed_headers[(ws.title, ws.cell(top, col).coordinate)] = FT[k]
                    else:
                        col = next((first[n] for n in UI[key] if n in first), None)
                        if col is None:
                            added = extra_ui.setdefault(ws.title, [])
                            if key not in added:
                                added.append(key)
                            col = last + 4 + added.index(key) + 1
                            allowed_headers[(ws.title, ws.cell(top, col).coordinate)] = UI[key][0]
                    arow, acol = anchor(ws, row, col)
                    coord = ws.cell(arow, acol).coordinate
                    if norm(ws[coord].value):
                        coord = (ws.title, coord, "run")
                    expected_cells[(ws.title, coord) if isinstance(coord, str) else coord] = values[key]
            path = work / f"{r}.json"
            path.write_text(json.dumps(results[r]))
            out = run("write", book, "--run", r, "--results", path, "--executed-by", "Tester A", "--application", "App")
            if out.returncode or out.stdout or out.stderr:
                fail(f"{rel} {r}: write exited {out.returncode}: {out.stderr.strip()}")

        if not (work / f"{src.stem}.before-abdm-run{src.suffix}").exists():
            fail(f"{rel}: no backup written")
        got = openpyxl.load_workbook(book, rich_text=True)
        before, after = cells(nha), cells(got)

        # NHA's cells: exactly as sent, except the header block labels.
        for key, value in before.items():
            if norm(value).startswith(LABELS):
                continue
            if after.get(key) != value:
                fail(f"{rel}: {key[0]}!{key[1]} NHA's value changed")
                break
        rich_before = sum(isinstance(v, CellRichText) for v in before.values())
        rich_after = sum(isinstance(v, CellRichText) for v in after.values())
        if rich_after < rich_before:
            fail(f"{rel}: {rich_before - rich_after} formatted cell(s) lost their runs")
        for title in [ws.title for ws in nha.worksheets]:
            a, b = nha[title], got[title]
            if sorted(map(str, a.merged_cells.ranges)) != sorted(map(str, b.merged_cells.ranges)) \
                    or len(a._images) != len(b._images):
                fail(f"{rel}: {title} merged ranges or logos changed")

        # Every written value where it belongs, and nothing written elsewhere.
        placed = set()
        for key, value in expected_cells.items():
            if len(key) == 3:  # NHA had written here; the value is in the "(run)" column
                title, coord, _ = key
                ws = got[title]
                top, cols, _ = header(ws)
                base = norm(ws.cell(top, ws[coord].column).value)
                col = cols.get(f"{base} (run)")
                if col is None:
                    fail(f"{rel}: {title}!{coord} holds NHA text but no '{base} (run)' column was added")
                    continue
                coord = ws.cell(ws[coord].row, col).coordinate
                allowed_headers[(title, ws.cell(top, col).coordinate)] = f"{base} (run)"
            else:
                title, coord = key
            placed.add((title, coord))
            if norm(got[title][coord].value) != norm(value):
                fail(f"{rel}: {title}!{coord} reads {got[title][coord].value!r}, expected {value!r}")
        for key, value in after.items():
            if key in before or key in placed:
                continue
            if allowed_headers.get(key) == norm(value):
                continue
            fail(f"{rel}: {key[0]}!{key[1]} = {value!r} written outside its place")

        for r in ("ft", "ui"):
            out = run("open", book, "--run", r)
            want = {x["id"] for x in results[r] if x["outcome"] not in ("passed", "not-run")}
            if set(out.stdout.split()) != want:
                fail(f"{rel} {r}: open listed {len(set(out.stdout.split()))} cases, expected {len(want)}")

        has_block = any(norm(v).startswith(LABELS[0]) for v in before.values())
        if has_block:
            again = run("write", book, "--run", "ft", "--results", work / "ft.json", "--executed-by", "Tester B")
            labels = [norm(v) for v in cells(openpyxl.load_workbook(book)).values() if norm(v).startswith(LABELS[0])]
            if again.returncode or labels != [f"{LABELS[0]} Tester B"] * len(labels):
                fail(f"{rel}: a second write did not update the tester: {labels}")
        print(f"ok   {rel}: {len(ids)} case(s) checked" if not failures else f"..   {rel}: {len(ids)} case(s)")

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
