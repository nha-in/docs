#!/usr/bin/env python3
"""Checks the test report script the test skills ship, against NHA's own sheets.

The script integrators copy lives in one place, the python block of
catalogue/shared/concepts/test-report.md. This takes that block, not a copy,
fills copies of NHA's M1 and HPR workbooks with the writer from
catalogue/shared/concepts/test-workbook-write-back.md, and checks:

- the gate exits 1 and names a mandatory case that is FAIL, NA or blank, and
  exits 0 when every mandatory case is PASS, an optional failure included;
- the CRT_ABHA_114 / CRT_ABHA_115 either rule: one passing satisfies a
  government entity, while a private entity needs CRT_ABHA_114 itself;
- build refuses while the gate fails, and refuses a meta.json that carries a
  field named like a credential;
- the report has the cover and twelve section headings in order, a results
  table with one row per case, one inline image per screenshot for a ui
  report and none for an ft report, and no unmasked 12 digit number.

Usage: python3 scripts/check-test-report.py [path to an alternative atom]
Needs python-docx, openpyxl and Pillow. Exits 0 when every check passes.
"""
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import openpyxl
from docx import Document
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ATOM = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "catalogue" / "shared" / "concepts" / "test-report.md"
WRITER = ROOT / "catalogue" / "shared" / "concepts" / "test-workbook-write-back.md"
RAW = ROOT / "catalogue" / "hiecm" / "openapi" / ".raw"
M1 = RAW / "nha-2026-10-22-m1-tests" / "M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx"
HPR = RAW / "nha-2026-10-02-m4-tests" / "HPR_Test_Cases.xlsx"
SECTIONS = ["Document control", "Executive summary", "ABDM details", "Scope",
            "Test environment and tools", "Approach and methodology", "Test data",
            "Results summary", "Evidence", "Failures and iterations log", "Conclusion", "Annexures"]
failures = []


def fail(message):
    failures.append(message)
    print(f"FAIL {message}")


def ok(condition, message):
    if condition:
        print(f"ok   {message}")
    else:
        fail(message)


def block(path):
    found = re.search(r"```python\n(.*?)\n```", path.read_text(), re.S)
    if not found:
        sys.exit(f"no python block in {path}")
    return found.group(1) + "\n"


def doc_text(doc):
    def walk(container):
        for p in container.paragraphs:
            yield p.text
        for t in container.tables:
            for row in t.rows:
                for cell in row.cells:
                    yield from walk(cell)
    return "\n".join(walk(doc))


def main():
    work = Path(tempfile.mkdtemp())
    report = work / "abdm_report.py"
    writer = work / "abdm_workbook.py"
    report.write_text(block(ATOM))
    writer.write_text(block(WRITER))

    def run(script, *args):
        return subprocess.run([sys.executable, str(script), *map(str, args)], capture_output=True, text=True)

    def fill(book, kind, results):
        path = work / f"{book.stem}-{kind}.json"
        path.write_text(json.dumps(results))
        out = run(writer, "write", book, "--run", kind, "--results", path)
        if out.returncode:
            sys.exit(f"the writer failed on {book.name}: {out.stderr.strip()}")

    def ids_of(book):
        out = run(writer, "cases", book)
        return [i for sheet in json.loads(out.stdout).values() for i in sheet]

    def results(ids, change=None, remarks=None):
        change, remarks = change or {}, remarks or {}
        return [{"id": i, "outcome": change.get(i, "passed"), "response": f"HTTP 200 for {i}",
                 "iterations": 3 if change.get(i, "passed") != "passed" else (2 if i == "CRT_ABHA_105" else 1),
                 "remarks": remarks.get(i, f"run remark {i}")} for i in ids]

    def check(book, kind, entity):
        return run(report, "check", book, "--run", kind, "--entity", entity)

    m1 = work / M1.name
    shutil.copy2(M1, m1)
    ids = ids_of(m1)

    # The gate on M1.
    fill(m1, "ui", results(ids))
    for entity in ("government", "private"):
        out = check(m1, "ui", entity)
        ok(out.returncode == 0, f"M1 ui all PASS: the gate passes for a {entity} entity")
    out = check(m1, "ui", "government")
    ok('marking CRT_ABHA_112 "' in out.stdout and "conditional: treated as mandatory" in out.stdout,
       "M1: the conditional marking on CRT_ABHA_112 is printed with its treatment")

    fill(m1, "ft", results(ids, {"CRT_ABHA_105": "failed"}))
    out = check(m1, "ft", "government")
    ok(out.returncode == 1 and "not passed CRT_ABHA_105: FAIL" in out.stdout
       and out.stdout.count("not passed ") == 1, "M1 ft one mandatory FAIL: the gate exits 1 naming CRT_ABHA_105 alone")
    meta_path = work / "meta.json"
    meta = {
        "organisation": "<ORGANISATION>", "product": "<PRODUCT>", "milestone": "M1", "api_version": "V3",
        "category": "HMIS", "entity_type": "government", "role": "HIP", "executed_by": "<TESTER>",
        "test_dates": {"start": "2026-10-20", "end": "2026-10-23"},
        "applications": [{"name": "<PRODUCT> web", "url": "https://test.example.invalid/"}],
        "environment": {"browser": "Chromium", "browser_version": "<V>", "playwright": "<V>", "model": "<MODEL>"},
        "test_data": [{"item": "Aadhaar used", "value": "1234 5678 9012"},
                      {"item": "ABHA number used", "value": "91-1234-5678-4321"}],
        "document": {"id": "FT-M1", "version": "1.0", "release_date": "2026-10-24", "prepared_by": "<A>",
                     "reviewed_by": "<B>", "approved_by": "<C>", "released_by": "<D>",
                     "change_history": [{"version": "1.0", "date": "2026-10-24", "by": "<A>", "change": "First issue"}],
                     "distribution": [{"name": "<B>", "organisation": "<ORG>", "role": "Reviewer"}]},
        "findings": {"CRT_ABHA_101": "The Create ABHA option opens the consent screen."},
        "recordings": [{"title": "M1 ui run", "link": "https://test.example.invalid/trace.zip"}],
    }
    meta_path.write_text(json.dumps(meta))
    out = run(report, "build", m1, "--run", "ft", "--meta", meta_path, "--out", work / "refused.docx")
    ok(out.returncode == 1 and "not passed CRT_ABHA_105: FAIL" in out.stdout and not (work / "refused.docx").exists(),
       "M1 ft build refuses while the gate fails, with the same list")

    # The either rule, on the ui columns.
    cases = [
        ({"CRT_ABHA_114": "failed", "CRT_ABHA_115": "needs-human"}, 1, 1),
        ({"CRT_ABHA_114": "failed"}, 0, 1),
        ({"CRT_ABHA_115": "failed"}, 0, 0),
    ]
    for change, gov, priv in cases:
        fill(m1, "ui", results(ids, change))
        g, p = check(m1, "ui", "government"), check(m1, "ui", "private")
        what = ", ".join(f"{k} {v}" for k, v in change.items())
        ok(g.returncode == gov and p.returncode == priv,
           f"either rule, {what}: government exits {gov}, private exits {priv}")
        if gov:
            ok("not passed CRT_ABHA_114 or CRT_ABHA_115: FAIL, blank" in g.stdout,
               "either rule: government lists the pair together")
        if priv:
            ok("not passed CRT_ABHA_114: FAIL" in p.stdout and "CRT_ABHA_115" not in p.stdout.split("marking")[0]
               and "not passed CRT_ABHA_115" not in p.stdout, "either rule: private lists CRT_ABHA_114 alone")

    fill(m1, "ui", results(ids, {"CRT_ABHA_101": "not-run"}))
    out = check(m1, "ui", "government")
    ok(out.returncode == 1 and "not passed CRT_ABHA_101: NA" in out.stdout, "NA on a mandatory case blocks the gate")

    # An optional failure does not block; its remark carries numbers to mask.
    fill(m1, "ui", results(ids, {"CRT_ABHA_103": "failed"},
                           {"CRT_ABHA_103": "Aadhaar 234567890123 and ABHA 91234567890123 shown in clear"}))
    ok(check(m1, "ui", "government").returncode == 0, "an optional FAIL does not block the gate")

    evidence = work / "evidence"
    sizes = {"CRT_ABHA_101": [(800, 500), (800, 500)], "CRT_ABHA_102": [(640, 400)], "VRFY_ABHA_101": [(360, 1600)]}
    for case, dims in sizes.items():
        (evidence / case).mkdir(parents=True)
        for n, dim in enumerate(dims):
            Image.new("RGB", dim, (200, 200, 200)).save(evidence / case / f"{n + 1:02d}-step.png")
        (evidence / case / "notes.txt").write_text("not an image")
    out_doc = work / "out" / "report-m1.docx"
    out = run(report, "build", m1, "--run", "ui", "--meta", meta_path, "--evidence", evidence, "--out", out_doc)
    ok(out.returncode == 0 and out_doc.exists(), f"M1 ui build writes the report: {out.stderr.strip()}")
    if out_doc.exists():
        doc = Document(str(out_doc))
        heads = [p.text for p in doc.paragraphs if p.style.name in ("Title", "Heading 1")]
        ok(heads == ["M1 UI functional test report"] + SECTIONS, f"M1 ui: cover and 12 headings in order: {heads}")
        table = next((t for t in doc.tables if [c.text for c in t.rows[0].cells][:2] == ["Test case ID", "Title"]), None)
        ok(table is not None and len(table.rows) - 1 == len(ids),
           f"M1 ui: results table has one row per case ({len(ids)})")
        ok(len(doc.inline_shapes) == 4, f"M1 ui: 4 inline images, got {len(doc.inline_shapes)}")
        text = doc_text(doc)
        ok(not re.search(r"(?<!\d)\d{12}(?!\d)|\d{4} \d{4} \d{4}|\d{14}", text),
           "M1 ui: no 12 or 14 digit number unmasked")
        ok("XXXX XXXX 9012" in text and "XXXX XXXX 0123" in text and "XX-XXXX-XXXX-0123" in text
           and "XX-XXXX-XXXX-4321" in text, "M1 ui: Aadhaar and ABHA numbers masked with the last four kept")
        ok("The Create ABHA option opens the consent screen." in text and "run remark CRT_ABHA_102" in text,
           "M1 ui: findings from meta.json, else the Remarks value")

    bad = dict(meta, environment=dict(meta["environment"], password="x"))
    (work / "bad.json").write_text(json.dumps(bad))
    out = run(report, "build", m1, "--run", "ui", "--meta", work / "bad.json", "--out", work / "bad.docx")
    ok(out.returncode == 1 and "password" in out.stderr and not (work / "bad.docx").exists(),
       "a meta.json with a password field is refused")

    fill(m1, "ft", results(ids))
    ft_doc = work / "out" / "report-m1-ft.docx"
    out = run(report, "build", m1, "--run", "ft", "--meta", meta_path, "--evidence", evidence, "--out", ft_doc)
    if out.returncode == 0 and ft_doc.exists():
        doc = Document(str(ft_doc))
        heads = [p.text for p in doc.paragraphs if p.style.name in ("Title", "Heading 1")]
        ok(heads == ["M1 API functional test report"] + SECTIONS and len(doc.inline_shapes) == 0
           and "HTTP 200 for CRT_ABHA_101" in doc_text(doc), "M1 ft report: same headings, responses, no images")
    else:
        fail(f"M1 ft build failed: {out.stderr.strip()}")

    # HPR: Mandatory and Non-Mandatory, and NHA text in Remarks.
    hpr = work / HPR.name
    shutil.copy2(HPR, hpr)
    hids = ids_of(hpr)
    ws = openpyxl.load_workbook(HPR).worksheets[0]
    marks = {}
    for row in ws.iter_rows(min_row=1, max_row=15):
        names = [re.sub(r"\s+", " ", str(c.value or "")).strip() for c in row]
        if "Test Case ID" in names:
            top, idc, mc = row[0].row, names.index("Test Case ID") + 1, names.index("Mandatory/ Optional") + 1
            for r in range(top + 1, ws.max_row + 1):
                cid = str(ws.cell(r, idc).value or "").replace(" ", "")
                if cid and cid not in marks:
                    marks[cid] = str(ws.cell(r, mc).value or "").strip()
            break
    must = next(i for i in hids if marks.get(i) == "Mandatory")
    may = next(i for i in hids if marks.get(i) == "Non-Mandatory")
    fill(hpr, "ui", results(hids))
    ok(check(hpr, "ui", "government").returncode == 0 and check(hpr, "ui", "private").returncode == 0,
       "HPR ui all PASS: the gate passes")
    fill(hpr, "ft", results(hids, {may: "failed"}))
    ok(check(hpr, "ft", "private").returncode == 0, f"HPR ft: a Non-Mandatory FAIL ({may}) does not block")
    fill(hpr, "ft", results(hids, {may: "failed", must: "failed"}))
    out = check(hpr, "ft", "private")
    ok(out.returncode == 1 and f"not passed {must}: FAIL" in out.stdout and may not in out.stdout,
       f"HPR ft: a Mandatory FAIL ({must}) blocks, the Non-Mandatory one is not listed")
    hpr_doc = work / "out" / "report-hpr.docx"
    out = run(report, "build", hpr, "--run", "ui", "--meta", meta_path, "--evidence", evidence, "--out", hpr_doc)
    if out.returncode == 0:
        doc = Document(str(hpr_doc))
        table = next((t for t in doc.tables if [c.text for c in t.rows[0].cells][:2] == ["Test case ID", "Title"]), None)
        ok(table is not None and len(table.rows) - 1 == len(hids) and f"run remark {hids[1]}" in doc_text(doc),
           f"HPR ui report: one row per case ({len(hids)}), the run's remark read past NHA's text")
    else:
        fail(f"HPR ui build failed: {out.stderr.strip()}")

    shutil.rmtree(work)
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
