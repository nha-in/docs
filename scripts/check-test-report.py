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
  page for every case, and only a mandatory PHR failure blocks;
- a CONDITIONAL PASS passes the gate for a mandatory case, is printed with
  its condition, counted on its own and listed with its condition in the
  report; a case's steps render as a Step, Result and Note table; the writer
  refuses a conditional-pass with no condition;
- plan lists the 100 M1 cases in sheet order with their applicability: the
  demographic group not applicable for a private entity, SHARE_PATIENT_PROFILE_701
  mandatory;
- build writes a PDF beside the DOCX that opens, and its text holds the cover
  title, the fourteen section openers in order, every case id, the header
  eyebrow, CONFIDENTIAL and the page count, with numbers masked and none of
  the leak fixtures' secrets; --format docx writes no PDF and --format pdf no
  DOCX.

Usage: python3 scripts/check-test-report.py [path to an alternative atom]
Needs python-docx, openpyxl, Pillow and reportlab, and pypdf or pdftotext to
read the PDF. Exits 0 when every check passes.
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
# Identity values a result may carry by mistake, and how each must read once masked.
# check-test-report.py carries the same corpus, and checks both scripts mask it alike.
JWT = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0In0.c2lnbmF0dXJlX3g5"
LEAKS = {"234567890123": "XXXX XXXX 0123", "2345 6789 0126": "XXXX XXXX 0126", "2345-6789-0127": "XXXX XXXX 0127",
         "91-2345-6789-0124": "XX-XXXX-XXXX-0124", "91234567890125": "XX-XXXX-XXXX-0125",
         "asha.verma@sbx": "xxxxxxerma@sbx", "priya_k99@abdm": "xxxxx_k99@abdm", "abc@sbx": "xxx@sbx",
         "9876543210": "XXXXXX3210", "09876543211": "XXXXXX3211", "098765 43212": "XXXXXX3212",
         "987 654 3213": "XXXXXX3213", "98-7654-3214": "XXXXXX3214", "+91 98765 43215": "XXXXXX3215",
         '"firstName": "Asha"': '"firstName": "[masked]"', '"lastName": "Verma"': '"lastName": "[masked]"',
         '"dob": "01-01-1990"': '"dob": "[masked]"', '"yearOfBirth": "1990"': '"yearOfBirth": "[masked]"',
         '"address": "12 MG Road Pune"': '"address": "[masked]"', '"pinCode": "411001"': '"pinCode": "[masked]"',
         '"email": "asha@example.invalid"': '"email": "[masked]"', '"photo": "iVBORw0KGgoAAAANS"': '"photo": "[masked]"',
         "name: Asha Verma": "name: [masked]", '"tokens": {"token": "opaque123x"}': '"tokens": {"token": "[redacted]"}',
         "X-token: Bearer opaque456y": "X-token: [redacted]", "Authorization: Bearer opaque789z": "Authorization: Bearer [redacted]",
         JWT: "[token]"}
# Parts of the corpus that must never appear in any form once masked.
SECRETS = ["opaque123x", "opaque456y", "opaque789z", "Asha", "Verma", "411001", "1990", "iVBORw0", "MG Road",
           "asha@example"]
# Joined with a separator no masking rule reads across.
CORPUS_TEXT = " ; ".join(LEAKS)
failures = []


def fail(message):
    failures.append(message)
    print(f"FAIL {message}")


def ok(condition, message):
    if condition:
        print(f"ok   {message}")
    else:
        fail(message)


def masker(source):
    """The mask() a script defines, run without its main()."""
    space = {"__name__": "masker"}
    exec(compile(source, "masker", "exec"), space)
    return space["mask"]


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


def pdf_text(path):
    """The PDF's text, with pypdf if it is installed, else with poppler's pdftotext."""
    try:
        from pypdf import PdfReader
        return "\n".join(page.extract_text() or "" for page in PdfReader(str(path)).pages)
    except ImportError:
        pass
    if not shutil.which("pdftotext"):
        sys.exit("reading the PDF needs pypdf (pip install pypdf) or pdftotext on PATH")
    out = subprocess.run(["pdftotext", "-layout", str(path), "-"], capture_output=True, text=True)
    if out.returncode:
        return ""
    return out.stdout


def pdf_checks(path, title, ids, label):
    """The PDF opens; the section openers in order, every case id, header and footer in its text."""
    ok(path.exists(), f"{label}: build writes {path.name} beside the DOCX")
    if not path.exists():
        return ""
    text = pdf_text(path)
    flat = re.sub(r"\s+", " ", text)
    ok(path.read_bytes()[:5] == b"%PDF-" and len(flat) > 1000, f"{label}: the PDF opens and has text")
    at, order = 0, True
    for n, name in enumerate(SECTIONS, 1):
        mark = "%02d \u00b7 %s" % (n, name.upper())
        found = flat.find(mark, at)
        if found < 0 or flat.find(name, found + len(mark)) < 0:
            order = False
            break
        at = found + len(mark)
    ok(order, f"{label}: the fourteen section openers and headings appear in order")
    missing = [i for i in ids if i not in flat]
    ok(not missing, f"{label}: every case id is in the PDF text ({len(ids)}): {missing[:5]}")
    ok(flat.count(title.upper()) >= 3 and flat.count("CONFIDENTIAL") >= 3 and re.search(r"PAGE 3 OF \d+", flat),
       f"{label}: header eyebrow, CONFIDENTIAL and PAGE N OF M on the inner pages")
    ok("Contents" in flat and "functional test report," in flat, f"{label}: the cover title and the contents page")
    ok(not re.search(r"(?<!\d)\d{12}(?!\d)|\d{4} \d{4} \d{4}|\d{14}", text), f"{label}: no 12 or 14 digit number unmasked")
    return flat


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
    report_mask, writer_mask = masker(report.read_text()), masker(writer.read_text())

    # The masking corpus: the report masks every value, and the writer's mask() gives the same text.
    missed = [raw for raw, masked in LEAKS.items() if raw in report_mask(CORPUS_TEXT) or masked not in report_mask(CORPUS_TEXT)]
    missed += [x for x in SECRETS if x in report_mask(CORPUS_TEXT)]
    ok(not missed, f"masking: the report masks every value in the corpus: {missed[:4]}")
    samples = list(LEAKS) + [CORPUS_TEXT, "HTTP 200 " + CORPUS_TEXT, "6f1c2a4e-1234-5678-9012-0a1b2c3d4e5f",
                             "Steps: 1 PASS; 2 needs tester (asha.verma@sbx); 3 PASS"]
    differ = [x for x in samples if report_mask(x) != writer_mask(x)]
    ok(not differ, f"masking: the writer's and the report's mask() agree on the whole corpus: {differ[:2]}")
    ok(report_mask("6f1c2a4e-1234-5678-9012-0a1b2c3d4e5f") == "6f1c2a4e-1234-5678-9012-0a1b2c3d4e5f",
       "masking: a UUID with digit segments is left whole")

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
    out = run(report, "build", m1, "--run", "ft", "--meta", meta_path, "--out", work / "draft.pdf", "--draft",
              "--format", "pdf")
    draft_text = pdf_text(work / "draft.pdf") if (work / "draft.pdf").exists() else ""
    ok(out.returncode == 0 and "Draft M1" in draft_text and "Mandatory cases not yet passed" in draft_text
       and "CRT_ABHA_105" in draft_text and "MANDATORY CASES NOT YET PASS" in draft_text,
       "M1 ft build --draft writes a PDF marked Draft that lists the mandatory cases not yet passed")
    gov = run(report, "check", m1, "--run", "ft", "--entity", "government")
    priv = run(report, "check", m1, "--run", "ft", "--entity", "private")
    ok("CRT_ABHA_301" not in priv.stdout.split("not passed")[-1] and "not for a private entity" in priv.stdout,
       "M1 demographic authentication group, Applicable To Government, is not mandatory for a private entity")

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
    flat = pdf_checks(out_doc.with_suffix(".pdf"), "M1 UI functional test report", ids, "M1 ui PDF")
    ok("XXXX XXXX 9012" in flat and "XX-XXXX-XXXX-4321" in flat and RID[0] in flat and "FIGURE 4" in flat,
       "M1 ui PDF: numbers masked as in the DOCX, REQUEST-IDs printed, the four screenshots captioned")
    only = work / "out" / "only-docx.docx"
    out = run(report, "build", m1, "--run", "ui", "--meta", meta_path, "--evidence", evidence, "--out", only,
              "--format", "docx")
    ok(out.returncode == 0 and only.exists() and not only.with_suffix(".pdf").exists(),
       "--format docx writes the DOCX and no PDF")
    only = work / "out" / "only-pdf.pdf"
    out = run(report, "build", m1, "--run", "ui", "--meta", meta_path, "--evidence", evidence, "--out", only,
              "--format", "pdf")
    ok(out.returncode == 0 and only.exists() and not only.with_suffix(".docx").exists(),
       "--format pdf writes the PDF and no DOCX")

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
        flat = pdf_checks(leak_doc.with_suffix(".pdf"), "M1 API functional test report", ids, "leaks PDF")
        for secret, what in ((jwt, "the JWT"), ("eyJhbGci", "any part of the JWT"), ("9876543210", "the mobile"),
                             ("Zx9SecretValue77", "the client secret"), ("482913", "the OTP in findings"),
                             ("771234", "the OTP in test data"), ("tester@example.invalid", "a team email"),
                             ("9123456780", "a team phone")):
            ok(secret not in flat and secret not in flat.replace(" ", ""), f"leaks: {what} is not in the PDF text")
        ok("[token]" in flat and "XXXXXX3210" in flat and "[redacted]" in flat,
           "leaks: the PDF masks as the DOCX does")
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
        # The report masks every text it prints, a title too: "(name@abdm)" reads "(xxxx@abdm)".
        differ = [i for i in pids if re.sub(r"\s+", " ", rows.get(i, ["", ""])[1]) != report_mask(titles.get(i, ""))]
        ok(not differ, f"PHR: titles are read from Test Title and agree with the page for every case: {differ[:5]}")
    else:
        fail(f"PHR ui build failed: {out.stderr.strip()}")
    must = next(i for i in pids if page[i] == "Mandatory")
    may = next(i for i in pids if page[i] == "Optional")
    fill(phr, "ui", results(pids, {must: "failed", may: "failed"}))
    out = check(phr, "ui", "private")
    ok(out.returncode == 1 and f"not passed {must}: FAIL" in out.stdout and out.stdout.count("not passed ") == 1,
       f"PHR: a mandatory FAIL ({must}) blocks and is the only case listed, the Optional FAIL ({may}) does not")

    # Conditional pass and steps, on M1's ui columns.
    cond_results = results(ids, {"CRT_ABHA_113": "conditional-pass"},
                            {"CRT_ABHA_113": "Number shown; the address sits on another screen"})
    for res in cond_results:
        if res["id"] == "CRT_ABHA_113":
            res["iterations"] = 1
        if res["id"] == "CRT_ABHA_103":
            res.update(outcome="needs-human", remarks="a second ABHA address, asked at readiness and at the case")
            res["steps"] = [{"step": 1, "outcome": "passed"},
                            {"step": 2, "outcome": "needs-human", "note": "a second ABHA address"},
                            {"step": 3, "outcome": "passed"}]
    fill(m1, "ui", cond_results)
    out = check(m1, "ui", "private")
    ok(out.returncode == 0 and "conditional pass CRT_ABHA_113: Number shown; the address sits on another screen"
       in out.stdout, "conditional pass: a mandatory CONDITIONAL PASS passes the gate and is printed with its condition")
    cond_doc = work / "out" / "report-conditional.docx"
    out = run(report, "build", m1, "--run", "ui", "--entity", "private", "--meta", meta_path, "--evidence", evidence,
              "--out", cond_doc, "--format", "docx")
    if out.returncode == 0 and cond_doc.exists():
        doc = Document(str(cond_doc))
        stats = next((t for t in doc.tables if header_of(t) == ["Measure", "Count"]), None)
        counts = {r.cells[0].text: r.cells[1].text for r in stats.rows[1:]} if stats else {}
        ok(counts.get("Conditional pass") == "1" and counts.get("PASS") == str(len(ids) - 2)
           and counts.get("No result") == "1",
           f"conditional pass: counted on its own: {counts}")
        listed = next((t for t in doc.tables if header_of(t) == ["Test case ID", "Title", "Condition"]), None)
        ok(listed is not None and len(listed.rows) == 2 and listed.rows[1].cells[0].text == "CRT_ABHA_113"
           and "another screen" in listed.rows[1].cells[2].text, "conditional pass: listed with its condition")
        by_fn = next((t for t in doc.tables if header_of(t)[:4] == ["Function", "Cases", "PASS", "Conditional pass"]), None)
        ok(by_fn is not None and sum(int(r.cells[3].text) for r in by_fn.rows[1:]) == 1,
           "conditional pass: the table by function counts it in its own column")
        ev = evidence_tables(doc).get("CRT_ABHA_113", {})
        ok(ev.get("Status") == "CONDITIONAL PASS" and ev.get("Failure reason", "").startswith("Condition: "),
           f"conditional pass: its evidence names the condition: {ev.get('Failure reason')}")
        step_tables = [t for t in doc.tables if header_of(t) == ["Step", "Result", "Note"]]
        ok(len(step_tables) == 1 and [[c.text for c in r.cells] for r in step_tables[0].rows[1:]] ==
           [["1", "PASS", ""], ["2", "needs tester", "a second ABHA address"], ["3", "PASS", ""]],
           "steps: a case with steps shows a Step, Result and Note table in its evidence")
    else:
        fail(f"conditional pass build failed: {out.stderr.strip()}")
    (work / "nocond.json").write_text(json.dumps([{"id": "CRT_ABHA_113", "outcome": "conditional-pass", "remarks": ""}]))
    out = run(writer, "write", m1, "--run", "ui", "--results", work / "nocond.json")
    ok(out.returncode != 0 and "conditional-pass needs remarks" in out.stderr,
       "conditional pass: the writer refuses one with no condition")

    # Hand typed statuses: read in any case and spacing; a CONDITIONAL PASS with no condition blocks.
    hand = work / "hand" / M1.name
    hand.parent.mkdir()
    shutil.copy2(M1, hand)
    fill(hand, "ui", results(ids))
    wb = openpyxl.load_workbook(hand)
    ws = wb.worksheets[0]
    for row in ws.iter_rows(min_row=1, max_row=15):
        names = [re.sub(r"\s+", " ", str(c.value or "")).strip() for c in row]
        if "Test Case ID" in names:
            top, idc = row[0].row, names.index("Test Case ID") + 1
            sc, rc = names.index("Status(PASS/FAIL)") + 1, names.index("Remarks") + 1
            break
    where = {str(ws.cell(r, idc).value or "").replace(" ", ""): r for r in range(top + 1, ws.max_row + 1)}
    ws.cell(where["CRT_ABHA_101"], sc).value = " pass "
    ws.cell(where["CRT_ABHA_102"], sc).value = "Conditional pass"
    ws.cell(where["CRT_ABHA_104"], rc).value = "Aadhaar 2345 6789 0126 mobile +91 98765 43215 " + '"firstName": "Asha"'
    wb.save(hand)
    out = check(hand, "ui", "private")
    ok(out.returncode == 0, "hand typed: ' pass ' and 'Conditional pass' with a condition pass the gate")
    hand_doc = work / "out" / "report-hand.docx"
    run(report, "build", hand, "--run", "ui", "--entity", "private", "--meta", meta_path, "--out", hand_doc,
        "--format", "docx")
    text = doc_text(Document(str(hand_doc))) if hand_doc.exists() else ""
    ok(text and "2345 6789 0126" not in text and "98765 43215" not in text and "Asha" not in text
       and "XXXX XXXX 0126" in text and "XXXXXX3215" in text,
       "hand typed: Remarks written into the sheet by hand are masked in the report")
    wb = openpyxl.load_workbook(hand)
    wb.worksheets[0].cell(where["CRT_ABHA_102"], rc).value = None
    wb.save(hand)
    out = check(hand, "ui", "private")
    ok(out.returncode == 1 and "not passed CRT_ABHA_102: CONDITIONAL PASS with no condition in Remarks" in out.stdout,
       "hand typed: a mandatory CONDITIONAL PASS with empty Remarks blocks the gate")

    # plan: every M1 case, in sheet order, with its applicability for the entity type.
    fresh = work / "plan" / M1.name
    fresh.parent.mkdir()
    shutil.copy2(M1, fresh)
    out = run(report, "plan", fresh, "--run", "ui", "--entity", "private")
    lines = [line for line in out.stdout.splitlines() if not line.startswith("total ")]
    rows = {line.split(" | ")[0]: line.split(" | ") for line in lines}
    ok(out.returncode == 0 and len(lines) == 100 and [line.split(" | ")[0] for line in lines] == ids,
       f"plan: one line per M1 case in sheet order ({len(lines)})")
    ok(rows.get("CRT_ABHA_301", ["", "", ""])[2].startswith("not applicable"),
       f"plan: CRT_ABHA_301 is not applicable for a private entity: {rows.get('CRT_ABHA_301')}")
    ok(rows.get("SHARE_PATIENT_PROFILE_701", ["", "", ""])[2] == "mandatory; applies: PHR App (read as all)",
       f"plan: SHARE_PATIENT_PROFILE_701 is mandatory: {rows.get('SHARE_PATIENT_PROFILE_701')}")
    ok(all(r[3] == "open" for r in rows.values()) and out.stdout.splitlines()[-1].startswith("total 100 cases"),
       "plan: an unrun workbook reads open for every case, then the totals")

    shutil.rmtree(work)
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
