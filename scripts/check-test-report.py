#!/usr/bin/env python3
"""Checks the test report script the test skills ship, against NHA's own sheets.

The script integrators copy lives in one place, the python block of
catalogue/shared/concepts/test-report.md. This takes that block, not a copy,
fills copies of NHA's M1, HPR and PHR workbooks with the writer from
catalogue/shared/concepts/test-workbook-write-back.md, and checks:

- the gate exits 1 and names a mandatory case that is FAIL, NA or blank, and
  exits 0 when every mandatory case is PASS, an optional failure included;
- the CRT_ABHA_114 / CRT_ABHA_115 either rule: one passing satisfies a
  government entity, while a private entity needs CRT_ABHA_114 itself;
- build refuses while the gate fails, and refuses a meta.json that carries a
  field named like a credential, a JWT or a client secret as a value;
- the report has the cover, a contents field and the fourteen section
  headings in order, the report title in the page header, Confidential and
  page fields in the footer, header rows that repeat, a results table with
  one row per case, one captioned inline image per screenshot for a ui
  report and none for an ft report, and no unmasked 12 digit number;
- every case has one evidence table with the nine fixed fields in order,
  carrying its status, iterations and a failure reason with its error code;
- with --manifest, each case's REQUEST-IDs appear in its evidence table, a
  case the manifest omits says so, a manifest holding a token is refused,
  and without one every case reads "No manifest given";
- where NHA's own status cell has text, only the "(run)" column is read, so
  NHA's PASS never stands in for a run's blank;
- a JWT, a mobile number, a client secret and an OTP from a Response cell,
  Remarks, findings or test data never reach the DOCX text, tables included;
- agreed_not_run lets a mandatory NA through only when it lists the case, and
  the report then lists the case with its agreement;
- PHR's "Optional / Mandatory" markings are read, agree with the PHR test case
  page for every case, and only a mandatory PHR failure blocks.

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
HPR = RAW / "nha-2026-10-22-m4-tests" / "HPR_Test_Cases.xlsx"
PHR = RAW / "nha-2026-10-01-phr-tests" / "PHR_MOBILE_APP_TEST_CASES.xlsx"
PHR_PAGE = ROOT / "site" / "docs" / "hiecm" / "v3" / "resources" / "test-cases" / "phr.mdx"
SECTIONS = ["Document control", "Executive summary", "ABDM details", "Results summary",
            "Scope and limitations", "Flow details", "Test environment and tools", "Test team",
            "Approach and methodology", "Test data", "Evidence", "Failures and iterations log",
            "Conclusion and sign-off", "Annexures"]
CASE_FIELDS = ["Test case ID", "Title", "Marking", "Expected result", "Observed", "Status",
               "Iterations", "Failure reason", "Request IDs"]
RESULTS = ["Test case ID", "Title", "Marking", "Status", "Iterations"]
LOG = ["Test case ID", "Status", "Iterations", "Failure reason", "Error code"]
RID = ["6f1c2a4e-1b2c-4d3e-8f90-0a1b2c3d4e5f", "a02d7c11-9e8f-4a6b-b5c4-d3e2f1a0b9c8",
       "b7a1e3d2-5c4b-4a39-8271-605f4e3d2c1b"]
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


def header_of(table):
    return [c.text for c in table.rows[0].cells]


def evidence_tables(doc):
    """Case id to its evidence table as {field: value}, for every table with the fixed fields."""
    found = {}
    for t in doc.tables:
        if header_of(t) == ["Field", "Value"] and [r.cells[0].text for r in t.rows[1:]] == CASE_FIELDS:
            values = {r.cells[0].text: r.cells[1].text for r in t.rows[1:]}
            found[values["Test case ID"]] = values
    return found


def layout(doc, title):
    """The contents field, the page header and footer, and repeating header rows."""
    body = doc.element.body.xml
    head = doc.sections[0].header
    foot = doc.sections[0].footer._element.xml
    repeat = all("w:tblHeader" in t.rows[0]._tr.xml for t in doc.tables if header_of(t)[:1] in
                 (["Test case ID"], ["Field"], ["Version"], ["Name"], ["Tool"], ["Item"], ["Recording"]))
    return {"toc": "TOC \\o" in body, "header": head.paragraphs[0].text == title,
            "footer": "Confidential" in foot and " PAGE " in foot and " NUMPAGES " in foot, "repeat": repeat}


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

    def results(ids, change=None, remarks=None, responses=None):
        change, remarks, responses = change or {}, remarks or {}, responses or {}
        return [{"id": i, "outcome": change.get(i, "passed"), "response": responses.get(i, f"HTTP 200 for {i}"),
                 "iterations": 3 if change.get(i, "passed") != "passed" else (2 if i == "CRT_ABHA_105" else 1),
                 "remarks": remarks.get(i, f"run remark {i}")} for i in ids]

    def check(book, kind, entity, *extra):
        return run(report, "check", book, "--run", kind, "--entity", entity, *extra)

    def results_table(doc):
        table = next((t for t in doc.tables if header_of(t) == RESULTS), None)
        return {row.cells[0].text: [c.text for c in row.cells] for row in table.rows[1:]} if table else {}

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
                           {"CRT_ABHA_103": "ABDM-1204 Aadhaar 234567890123 and ABHA 91234567890123 shown in clear"}))
    ok(check(m1, "ui", "government").returncode == 0, "an optional FAIL does not block the gate")

    evidence = work / "evidence"
    sizes = {"CRT_ABHA_101": [(800, 500), (800, 500)], "CRT_ABHA_102": [(640, 400)], "VRFY_ABHA_101": [(360, 1600)]}
    for case, dims in sizes.items():
        (evidence / case).mkdir(parents=True)
        for n, dim in enumerate(dims):
            Image.new("RGB", dim, (200, 200, 200)).save(evidence / case / f"{n + 1:02d}-step.png")
        (evidence / case / "notes.txt").write_text("not an image")
    manifest = work / "m1-run.json"
    manifest.write_text(json.dumps({"CRT_ABHA_101": RID[:2], "CRT_ABHA_102": RID[2], "VRFY_ABHA_101": ["234567890123"]}))
    out_doc = work / "out" / "report-m1.docx"
    out = run(report, "build", m1, "--run", "ui", "--meta", meta_path, "--evidence", evidence, "--out", out_doc,
              "--manifest", manifest)
    ok(out.returncode == 0 and out_doc.exists(), f"M1 ui build writes the report: {out.stderr.strip()}")
    if out_doc.exists():
        doc = Document(str(out_doc))
        heads = [p.text for p in doc.paragraphs if p.style.name in ("Title", "Heading 1")]
        ok(heads == ["M1 UI functional test report"] + SECTIONS, f"M1 ui: cover and 14 headings in order: {heads}")
        parts = layout(doc, "M1 UI functional test report")
        ok(all(parts.values()), f"M1 ui: contents field, page header, footer and repeating header rows: {parts}")
        table = next((t for t in doc.tables if header_of(t) == RESULTS), None)
        ok(table is not None and len(table.rows) - 1 == len(ids),
           f"M1 ui: results table has one row per case ({len(ids)})")
        ok(len(doc.inline_shapes) == 4, f"M1 ui: 4 inline images, got {len(doc.inline_shapes)}")
        captions = [p.text for p in doc.paragraphs if p.style.name == "Caption"]
        ok(len(captions) == 4 and captions[0] == "Figure 1: CRT_ABHA_101, step 1 (01-step.png)"
           and captions[3] == "Figure 4: VRFY_ABHA_101, step 1 (01-step.png)", f"M1 ui: one numbered caption per screenshot: {captions}")
        ev = evidence_tables(doc)
        ok(sorted(ev) == sorted(ids), f"M1 ui: one evidence table with the nine fields per case ({len(ev)} of {len(ids)})")
        e101, e102, e103 = ev.get("CRT_ABHA_101", {}), ev.get("CRT_ABHA_102", {}), ev.get("CRT_ABHA_103", {})
        ok(e101.get("Request IDs") == ", ".join(RID[:2]) and e102.get("Request IDs") == RID[2]
           and ev.get("CRT_ABHA_104", {}).get("Request IDs") == "None in the manifest",
           "M1 ui: the manifest's REQUEST-IDs appear per case, a case it omits says so")
        ok(e101.get("Status") == "PASS" and e101.get("Iterations") == "1" and e101.get("Failure reason") == "None"
           and e101.get("Expected result") not in ("", "Not given in the workbook"),
           "M1 ui: a passed case carries status, iterations, the workbook's expected result and no failure reason")
        ok(e103.get("Status") == "FAIL" and e103.get("Iterations") == "3" and "ABDM-1204" in e103.get("Failure reason", ""),
           f"M1 ui: a failed case carries FAIL, 3 iterations and its error code: {e103}")
        log = next((t for t in doc.tables if header_of(t) == LOG), None)
        ok(log is not None and any(r.cells[0].text == "CRT_ABHA_103" and r.cells[4].text == "ABDM-1204" for r in log.rows),
           "M1 ui: the failures log names the error code")
        ok(any(r.cells[0].text == "Run type" and r.cells[1].text.startswith("ui") for t in doc.tables for r in t.rows
               if len(r.cells) == 2), "M1 ui: ABDM details carry the run type")
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
        ok(all(layout(doc, "M1 API functional test report").values()), "M1 ft report: contents, page header and footer")
        ev = evidence_tables(doc)
        ok(len(ev) == len(ids) and all(v["Request IDs"] == "No manifest given" for v in ev.values()),
           "M1 ft report: without --manifest every case reads No manifest given")
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

    # The (run) fallback: NHA's own Status cell says PASS, the run left the case blank.
    fb = work / "fallback" / M1.name
    fb.parent.mkdir()
    shutil.copy2(M1, fb)
    wb = openpyxl.load_workbook(fb)
    for ws in wb.worksheets:
        for row in ws.iter_rows(min_row=1, max_row=15):
            names = [re.sub(r"\s+", " ", str(c.value or "")).strip() for c in row]
            if "Test Case ID" in names and "Status(PASS/FAIL)" in names:
                idc, sc = names.index("Test Case ID") + 1, names.index("Status(PASS/FAIL)") + 1
                for r in range(row[0].row + 1, ws.max_row + 1):
                    if str(ws.cell(r, idc).value or "").replace(" ", "") == "CRT_ABHA_101":
                        ws.cell(r, sc).value = "PASS"
                break
    wb.save(fb)
    fill(fb, "ui", results(ids, {"CRT_ABHA_101": "needs-human"}))
    out = check(fb, "ui", "government")
    ok(out.returncode == 1 and "not passed CRT_ABHA_101: blank" in out.stdout,
       "fallback: NHA's own PASS beside a needs-human run blocks, read from the (run) column alone")
    fill(fb, "ui", results(ids))
    ok(check(fb, "ui", "government").returncode == 0, "fallback: the run's PASS in the (run) column passes")

    # agreed_not_run: a mandatory NA blocks unless meta.json lists it with the agreement.
    agreement = "Asha Rao, NHA, email of 2026-10-21"
    fill(m1, "ft", results(ids, {"CRT_ABHA_101": "not-run"}))
    out = check(m1, "ft", "government", "--meta", meta_path)
    ok(out.returncode == 1 and "not passed CRT_ABHA_101: NA" in out.stdout, "agreed_not_run: an unlisted mandatory NA blocks")
    agreed_meta = work / "agreed.json"
    agreed_meta.write_text(json.dumps(dict(meta, agreed_not_run={"CRT_ABHA_101": agreement})))
    out = check(m1, "ft", "government", "--meta", agreed_meta)
    ok(out.returncode == 0 and "agreed not run CRT_ABHA_101: " + agreement in out.stdout,
       "agreed_not_run: a listed mandatory NA passes the gate and is printed")
    agreed_doc = work / "out" / "report-agreed.docx"
    out = run(report, "build", m1, "--run", "ft", "--meta", agreed_meta, "--out", agreed_doc)
    if out.returncode == 0 and agreed_doc.exists():
        doc = Document(str(agreed_doc))
        listed = next((t for t in doc.tables if [c.text for c in t.rows[0].cells] ==
                       ["Test case ID", "Title", "Agreed by and when"]), None)
        log = next((t for t in doc.tables if header_of(t) == LOG), None)
        ok(listed is not None and [c.text for c in listed.rows[1].cells][0::2] == ["CRT_ABHA_101", agreement]
           and len(listed.rows) == 2, "agreed_not_run: the results summary lists the case with its agreement")
        ok(log is not None and any(r.cells[0].text == "CRT_ABHA_101" and agreement in r.cells[3].text for r in log.rows),
           "agreed_not_run: the failures log carries the agreement")
    else:
        fail(f"agreed_not_run build failed: {out.stderr.strip()}")

    # Leaks: a JWT and a mobile in a Response cell, a client secret in Remarks, an OTP in findings and test data.
    jwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0In0.c2lnbmF0dXJlX3g5"
    fill(m1, "ft", results(ids, responses={"CRT_ABHA_102": f"HTTP 200 Authorization: Bearer {jwt} mobile 9876543210"},
                           remarks={"CRT_ABHA_103": "client secret: Zx9SecretValue77 sent in the header"}))
    leak_meta = work / "leak.json"
    leak_meta.write_text(json.dumps(dict(meta, findings={"CRT_ABHA_101": "OTP 482913 accepted on the second screen"},
                                         team=[{"name": "<TESTER>", "role": "Tester", "email": "tester@example.invalid",
                                                "phone": "9123456780"}],
                                         test_data=meta["test_data"] + [{"item": "OTP used", "value": "771234"}])))
    leak_doc = work / "out" / "report-leak.docx"
    out = run(report, "build", m1, "--run", "ft", "--meta", leak_meta, "--out", leak_doc)
    if out.returncode == 0 and leak_doc.exists():
        text = doc_text(Document(str(leak_doc)))
        for secret, what in ((jwt, "the JWT"), ("eyJhbGci", "any part of the JWT"), ("9876543210", "the mobile"),
                             ("Zx9SecretValue77", "the client secret"), ("482913", "the OTP in findings"),
                             ("771234", "the OTP in test data"), ("tester@example.invalid", "a team email"),
                             ("9123456780", "a team phone")):
            ok(secret not in text, f"leaks: {what} is not in the DOCX text")
        ok("[token]" in text and "XXXXXX3210" in text and "client secret: [redacted]" in text
           and "OTP [redacted]" in text, "leaks: masked as [token], XXXXXX3210 and [redacted]")
    else:
        fail(f"leak build failed: {out.stderr.strip()}")
    for name, bad_meta in (("a client secret value", dict(meta, findings={"CRT_ABHA_101": "client secret: abc123x"})),
                           ("a JWT value", dict(meta, recordings=[{"title": "trace", "link": "https://x.invalid/?t=" + jwt}]))):
        path = work / "secret.json"
        path.write_text(json.dumps(bad_meta))
        out = run(report, "build", m1, "--run", "ft", "--meta", path, "--out", work / "secret.docx")
        ok(out.returncode == 1 and "meta.json carries a credential" in out.stderr and not (work / "secret.docx").exists(),
           f"a meta.json with {name} is refused")

    bad_manifest = work / "bad-manifest.json"
    bad_manifest.write_text(json.dumps({"CRT_ABHA_101": {"request_ids": RID[:1], "token": jwt}}))
    out = run(report, "build", m1, "--run", "ft", "--meta", meta_path, "--manifest", bad_manifest,
              "--out", work / "bad-manifest.docx")
    ok(out.returncode == 1 and "manifest carries a credential" in out.stderr and not (work / "bad-manifest.docx").exists(),
       "a manifest holding a token is refused")

    # PHR: "Optional / Mandatory" and "Test Title", ids added by the writer, markings as the page shows them.
    phr = work / PHR.name
    shutil.copy2(PHR, phr)
    pids = ids_of(phr)
    page = dict((i, m) for i, m in re.findall(
        r"<Link id=\"phr_[a-z0-9_]+\"[^>]*>(PHR_[A-Z0-9_]+)</Link><br/>Row [^<]*<br/>([^|]*?) \|", PHR_PAGE.read_text()))
    titles = dict((i, re.sub(r"\s+", " ", m)) for i, m in re.findall(
        r"<Link id=\"phr_[a-z0-9_]+\"[^>]*>(PHR_[A-Z0-9_]+)</Link><br/>[^|]*\| \*\*(.*?)\*\*", PHR_PAGE.read_text()))
    ok(sorted(page) == sorted(pids), f"PHR: the page and the writer name the same {len(pids)} cases")
    fill(phr, "ui", results(pids))
    out = check(phr, "ui", "private")
    ok(out.returncode == 0, "PHR ui all PASS: the gate passes")
    printed = dict(re.findall(r'^marking (\S+) "(.*)": ', out.stdout, re.M))
    phr_doc = work / "out" / "report-phr.docx"
    out = run(report, "build", phr, "--run", "ui", "--meta", meta_path, "--evidence", evidence, "--out", phr_doc)
    if out.returncode == 0:
        rows = results_table(Document(str(phr_doc)))

        def expected(mark):
            if mark == "Optional":
                return "Optional"
            if mark == "Not marked":
                return "Not marked, treated as mandatory"
            return "Mandatory" if mark.startswith("Mandatory") else "Unrecognised, treated as mandatory"
        wrong = [i for i in pids if i not in rows or rows[i][2] != expected(page[i])]
        ok(not wrong, f"PHR: the report's marking agrees with the page for all {len(pids)} cases: {wrong[:5]}")
        noted = [i for i, m in page.items() if m not in ("Mandatory", "Optional")]
        ok(all(printed.get(i) == ("" if page[i] == "Not marked" else page[i]) for i in noted),
           f"PHR: check prints the {len(noted)} markings that are not plain, as the page shows them")
        ok(sum(1 for i in pids if rows.get(i, ["", "", ""])[2] == "Optional") == 15,
           "PHR: NHA's 15 Optional cases are Optional")
        differ = [i for i in pids if re.sub(r"\s+", " ", rows.get(i, ["", ""])[1]) != titles.get(i)]
        ok(not differ, f"PHR: titles are read from Test Title and agree with the page for every case: {differ[:5]}")
    else:
        fail(f"PHR ui build failed: {out.stderr.strip()}")
    must = next(i for i in pids if page[i] == "Mandatory")
    may = next(i for i in pids if page[i] == "Optional")
    fill(phr, "ui", results(pids, {must: "failed", may: "failed"}))
    out = check(phr, "ui", "private")
    ok(out.returncode == 1 and f"not passed {must}: FAIL" in out.stdout and out.stdout.count("not passed ") == 1,
       f"PHR: a mandatory FAIL ({must}) blocks and is the only case listed, the Optional FAIL ({may}) does not")

    shutil.rmtree(work)
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
