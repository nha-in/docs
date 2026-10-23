#!/usr/bin/env python3
"""Checks the workbook writer the test skills ship, against NHA's own sheets.

The script integrators copy lives in one place, the python block of
catalogue/shared/concepts/test-workbook-write-back.md, and is folded into the
test skills. This takes that block, not a copy, and for every NHA sheet writes
a result for every case, once as an ft run and once as a ui run, then checks:

- the case ids the script finds are the ones the test case page shows, in the
  same order, including the PHR ids it builds from the rows;
- the four FT columns sit right after NHA's last header (after the added
  Test Case ID column on the PHR sheet);
- every case reads back all four values in its run type's columns: NHA's own
  for ui, or the "(run)" column where NHA had already written in that cell;
- every cell NHA filled still holds exactly what NHA put there, with its
  formatted runs, and every new cell is one the writer was meant to write;
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
PAGES = ROOT / "site" / "docs" / "hiecm" / "v3" / "resources" / "test-cases"
SHEETS = [
    ("nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx", "m1"),
    ("nha-2026-10-22-m2-tests/M2_BUILDING_HIP_TEST_CASES.xlsx", "m2"),
    ("nha-2026-10-22-m3-tests/M3_BUILDING_HIU_TEST_CASES.xlsx", "m3"),
    ("nha-2026-10-02-m4-tests/HFR_Test_Cases.xlsx", "m4"),
    ("nha-2026-10-02-m4-tests/HPR_Test_Cases.xlsx", "m4"),
    ("nha-2026-10-01-phr-tests/PHR_MOBILE_APP_TEST_CASES.xlsx", "phr"),
]
OUTCOMES = ["passed", "failed", "needs-human", "not-run"]
STATUS = {"passed": "PASS", "failed": "FAIL", "needs-human": "", "not-run": "NA"}
UI = [["Status(PASS/FAIL)", "Status"], ["Response of Request with Code"], ["Iterations"], ["Remarks", "Remark"]]
FT = ["FT Status", "FT Response with Code", "FT Iterations", "FT Remarks"]
LABELS = ("Test Executed by:", "Test Execution date:", "Application/ System Name:")
failures = []


def fail(message):
    failures.append(message)
    print(f"FAIL {message}")


def norm(text):
    return re.sub(r"\s+", " ", str(text or "")).strip()


def header(ws):
    """Header row, first column of each name, and the last header column."""
    for row in ws.iter_rows(min_row=1, max_row=15):
        names = [norm(c.value) for c in row]
        if "Test Case ID" in names or any(re.fullmatch(r"s\.\s*no", n.lower()) for n in names):
            first = {}
            for name, cell in zip(names, row):
                if name:
                    first.setdefault(name, cell.column)
            return row[0].row, first, max(first.values())
    return None, {}, 0


def merged_anchor(ws, row, col):
    for rng in ws.merged_cells.ranges:
        if rng.min_row <= row <= rng.max_row and rng.min_col <= col <= rng.max_col:
            return rng.min_row, rng.min_col
    return row, col


def cells(wb):
    return {(ws.title, c.coordinate): c.value for ws in wb.worksheets
            for row in ws.iter_rows() for c in row if c.value not in (None, "")}


def page_ids(page):
    text = (PAGES / f"{page}.mdx").read_text()
    return [norm(i) for i in re.findall(r'<Link id="[^"]+" to="#[^"]+">([^<]+)</Link>', text)]


def main():
    block = re.search(r"```python\n(.*?)\n```", ATOM.read_text(), re.S)
    if not block:
        sys.exit(f"no python block in {ATOM.relative_to(ROOT)}")
    work = Path(tempfile.mkdtemp())
    script = work / "abdm_workbook.py"
    script.write_text(block.group(1) + "\n")

    def run(*args):
        return subprocess.run([sys.executable, str(script), *map(str, args)], capture_output=True, text=True)

    m4_ids = []
    for rel, page in SHEETS:
        src = RAW / rel
        book = work / src.name
        shutil.copy2(src, book)
        fails_before = len(failures)
        listed = run("cases", book)
        if listed.returncode:
            fail(f"{rel}: cases exited {listed.returncode}: {listed.stderr.strip()}")
            continue
        ids = [i for sheet in json.loads(listed.stdout).values() for i in sheet]
        shown = [re.sub(r"#\d+$", "", i).replace(" ", "") for i in ids]
        if page == "m4":
            m4_ids += shown
        else:
            want = [i.replace(" ", "") for i in page_ids(page)]
            if shown != want:
                fail(f"{rel}: the script finds {len(ids)} ids, the page shows {len(want)}, or not in the same order")

        nha = openpyxl.load_workbook(src, rich_text=True)
        results = {r: [{"id": i, "outcome": OUTCOMES[n % 4], "response": f"{r} response {n}",
                        "iterations": n % 3 + 1, "remarks": f"{r} remark {n}"} for n, i in enumerate(ids)]
                   for r in ("ft", "ui")}
        for r in ("ft", "ui"):
            path = work / f"{r}.json"
            path.write_text(json.dumps(results[r]))
            out = run("write", book, "--run", r, "--results", path, "--executed-by", "Tester A", "--application", "App")
            if out.returncode or out.stdout or out.stderr:
                fail(f"{rel} {r}: write exited {out.returncode}: {out.stderr.strip()}")
        if not (work / f"{src.stem}.before-abdm-run{src.suffix}").exists():
            fail(f"{rel}: no backup written")

        got = openpyxl.load_workbook(book, rich_text=True)
        before, after = cells(nha), cells(got)
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
        for ws in nha.worksheets:
            a, b = ws, got[ws.title]
            if sorted(map(str, a.merged_cells.ranges)) != sorted(map(str, b.merged_cells.ranges)) \
                    or len(a._images) != len(b._images):
                fail(f"{rel}: {ws.title} merged ranges or logos changed")

        # Where every value should be, from the written sheet's own header.
        expected = {}
        by_id = {}
        for ws in got.worksheets:
            top, cols, _ = header(ws)
            if top is None or "Test Case ID" not in cols:
                continue
            _, nha_cols, nha_last = header(nha[ws.title])
            start = nha_last + 1 if "Test Case ID" in nha_cols else nha_last + 2
            for k, name in enumerate(FT):
                if cols.get(name) != start + k:
                    fail(f"{rel}: {ws.title} '{name}' is in column {cols.get(name)}, not {start + k}")
            if "Test Case ID" not in nha_cols:
                expected[(ws.title, ws.cell(top, cols["Test Case ID"]).coordinate)] = "Test Case ID"
            for name in [n for names in UI for n in names] + FT + [n for n in cols if n.endswith(" (run)")]:
                if name in cols:
                    expected.setdefault((ws.title, ws.cell(top, cols[name]).coordinate), name)
            n = {}
            for r in range(top + 1, ws.max_row + 1):
                value = norm(ws.cell(r, cols["Test Case ID"]).value).replace(" ", "")
                if not value:
                    continue
                n[value] = n.get(value, 0) + 1
                key = value if n[value] == 1 else f"{value}#{n[value]}"
                by_id[key] = (ws, top, cols, r)
                if "Test Case ID" not in nha_cols:
                    expected[(ws.title, ws.cell(r, cols["Test Case ID"]).coordinate)] = value
        for r, res_list in results.items():
            for res in res_list:
                if res["id"] not in by_id:
                    fail(f"{rel}: {res['id']} has no row")
                    continue
                ws, top, cols, row = by_id[res["id"]]
                remark = ("Needs tester: " + res["remarks"]) if res["outcome"] == "needs-human" else res["remarks"]
                values = [STATUS[res["outcome"]], res["response"], res["iterations"], remark]
                for k in range(4):
                    if r == "ft":
                        col = cols[FT[k]]
                    else:
                        col = next(cols[n] for n in UI[k] if n in cols)
                        arow, acol = merged_anchor(ws, row, col)
                        if norm(nha[ws.title].cell(arow, acol).value):
                            col = cols.get(f"{norm(ws.cell(top, col).value)} (run)")
                            if col is None:
                                fail(f"{rel}: {ws.title} row {row} holds NHA text but has no '(run)' column")
                                continue
                    arow, acol = merged_anchor(ws, row, col)
                    coord = ws.cell(arow, acol).coordinate
                    expected[(ws.title, coord)] = values[k]
        for key, value in expected.items():
            if key in before:
                continue
            if norm(after.get(key)) != norm(value):
                fail(f"{rel}: {key[0]}!{key[1]} reads {after.get(key)!r}, expected {value!r}")
        for key, value in after.items():
            if key in before or key in expected:
                continue
            fail(f"{rel}: {key[0]}!{key[1]} = {value!r} written outside its place")

        for r in ("ft", "ui"):
            out = run("open", book, "--run", r)
            want_open = {x["id"] for x in results[r] if x["outcome"] not in ("passed", "not-run")}
            if set(out.stdout.split()) != want_open:
                fail(f"{rel} {r}: open listed {len(set(out.stdout.split()))} cases, expected {len(want_open)}")

        if any(norm(v).startswith(LABELS[0]) for v in before.values()):
            again = run("write", book, "--run", "ft", "--results", work / "ft.json", "--executed-by", "Tester B")
            labels = [norm(v) for v in cells(openpyxl.load_workbook(book)).values() if norm(v).startswith(LABELS[0])]
            if again.returncode or labels != [f"{LABELS[0]} Tester B"] * len(labels):
                fail(f"{rel}: a second write did not update the tester: {labels}")
        state = "ok  " if len(failures) == fails_before else "FAIL"
        print(f"{state} {rel}: {len(ids)} case(s)")

    want_m4 = [i.replace(" ", "") for i in page_ids("m4") if i != "No id"]
    if m4_ids != want_m4:
        fail(f"M4: the script finds {len(m4_ids)} ids across HFR and HPR, the page shows {len(want_m4)}")

    (work / "missing.json").write_text(json.dumps([{"id": "NOT_A_CASE", "outcome": "passed"}]))
    bad = run("write", work / Path(SHEETS[2][0]).name, "--run", "ft", "--results", work / "missing.json")
    if bad.returncode != 1 or "not in the workbook: NOT_A_CASE" not in bad.stderr:
        fail("an unknown case id is not refused")
    else:
        print("ok   an unknown case id is refused")

    shutil.rmtree(work)
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
