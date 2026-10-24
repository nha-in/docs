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
  page fields in the footer, header rows that repeat, one captioned inline
  image per screenshot for a ui report and none for an ft report, a
  screenshots listing for the annexure bundle, and no unmasked 12 digit number;
- every tested case has one evidence table with the four fixed fields in
  order, its result line carrying status, passes, marking and error code;
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
- the M1 skill's page classifier, scripts/lib/test-case-page.mjs, says what
  plan says for every M1 case, for a government and a private entity;
- plan lists the 100 M1 cases in sheet order with their applicability: the
  demographic group not applicable for a private entity, SHARE_PATIENT_PROFILE_701
  mandatory;
- build writes a PDF beside the DOCX that opens, and its text holds the cover
  title, the fourteen section openers in order, every case id, the header
  eyebrow, CONFIDENTIAL and the page count, with numbers masked and none of
  the leak fixtures' secrets; --format docx writes no PDF and --format pdf no
  DOCX;
- the report's shape, on a synthetic M1 run with made up data and generated
  screenshots in both orientations, several per case: every screenshot is
  embedded with its source pixels, up to 300 dpi at its printed size, and
  prints readably (portrait 45 mm wide or more, landscape across the text
  width); no heading ends a page; every page outside the evidence holds four
  lines of text; the counts table is there, adds up and matches the inputs,
  for all cases and for mandatory ones, and the PDF's and the DOCX's ready
  lines agree with the open mandatory cases; "No result" appears nowhere; with
  some cases blocked, not tested, NA or run outside their entity type, the
  evidence holds only tested cases, every other case is in the not tested
  table once, and the failures log holds only failed, blocked and conditional
  pass cases;
- a mandatory NA nobody agreed is not tested; the either rule is met by one
  case; hand typed statuses the script does not know are shown as such; hand
  typed conditions, needs and failure reasons are masked in both files;
- build never fails on an empty, unreadable or WebP screenshot, a very tall
  capture or text far longer than a page;
- P1's cases fall under the PHR sheet's section headings.

Usage: python3 scripts/check-test-report.py [path to an alternative atom] [--sample OUT.pdf]
--sample keeps the all tested synthetic M1 PDF at OUT.pdf.
Needs python-docx, openpyxl, Pillow and reportlab, and pypdf or pdftotext to
read the PDF. Exits 0 when every check passes.
"""
import json
import re
import uuid
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import openpyxl
from docx import Document
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ARGS = sys.argv[1:]
SAMPLE = Path(ARGS.pop(ARGS.index("--sample") + 1)) if "--sample" in ARGS else None
ARGS = [a for a in ARGS if a != "--sample"]
ATOM = Path(ARGS[0]) if ARGS else ROOT / "catalogue" / "shared" / "concepts" / "test-report.md"
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
CASE_FIELDS = ["Result", "Expected result", "Observed", "Request IDs"]
LOG = ["Test case ID", "Status", "Iterations", "Failure reason", "Error code"]
NOT_TESTED = ["Test case ID", "Title", "Marking", "Status", "Needed, or why not applicable"]
COUNTS = ["Cases in NHA's sheet", "Applicable to this integrator", "Tested", "Passed", "Conditional pass", "Failed",
          "Blocked", "Not tested", "Not applicable"]
KEYS = ["cases", "applicable", "tested", "passed", "conditional pass", "failed", "blocked", "not tested",
        "not applicable"]
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
         JWT: "[token]", "Name: asha verma": "Name: [masked]", "NAME=Ravi kumar rao": "NAME=[masked]",
         "DOB 01/01/1990": "DOB [masked]", "date of birth: 1990-01-01": "date of birth: [masked]",
         "seen on 12/03/2024": "seen on [date]"}
# Parts of the corpus that must never appear in any form once masked.
SECRETS = ["opaque123x", "opaque456y", "opaque789z", "Asha", "Verma", "411001", "1990", "iVBORw0", "MG Road",
           "asha@example", "verma", "kumar", "12/03/2024"]
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
    """Case id to its evidence as {field: value}: the "<id>: <title>" heading and the table of the
    fixed fields under it, with the marking read from the result line."""
    from docx.table import Table
    found, heading = {}, None
    for el in doc.element.body.iterchildren():
        if el.tag.endswith("}p"):
            style = el.xpath("string(./w:pPr/w:pStyle/@w:val)")
            heading = "".join(x.text or "" for x in el.xpath(".//w:t")) if style == "Heading3" else heading
        elif el.tag.endswith("}tbl") and heading:
            t = Table(el, doc._body)
            if [r.cells[0].text for r in t.rows] == CASE_FIELDS:
                case, _, title = heading.partition(": ")
                values = {r.cells[0].text: r.cells[1].text for r in t.rows}
                marking = re.search(r"Marking: (.+?)\.(?: |$)", values["Result"])
                values.update({"Test case ID": case, "Title": title, "Marking": marking.group(1) if marking else ""})
                found[case] = values
            heading = None
    return found


def table_rows(doc, header):
    """The body rows of the first table with this header, as lists of cell text."""
    t = next((t for t in doc.tables if header_of(t) == header), None)
    return [[c.text for c in r.cells] for r in t.rows[1:]] if t else None


def captions(doc):
    """Every figure caption, in the body or in a table cell."""
    def walk(container):
        for p in container.paragraphs:
            if p.style.name == "Caption":
                yield p.text
        for t in container.tables:
            for row in t.rows:
                for cell in row.cells:
                    yield from walk(cell)
    return list(walk(doc))


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


def pdf_pages(path):
    """Each page's text lines, with pypdf."""
    from pypdf import PdfReader
    return [[line.strip() for line in (page.extract_text() or "").splitlines() if line.strip()]
            for page in PdfReader(str(path)).pages]


def body_lines(lines, title):
    """A page's lines less its header, its footer and its figure captions."""
    chrome = re.compile(r"^(?:" + re.escape(title.upper()) + r"|CONFIDENTIAL|PAGE \d+ OF \d+|CONFIDENTIAL\s*PAGE \d+ OF \d+)$")
    caption = re.compile(r"^(?:Fig \d+, step \d+\s*)+$")
    return [x for x in lines if not chrome.match(x) and not caption.match(x)]


def placed_images(path):
    """Every image drawn in the PDF: (page, embedded width px, height px, printed width mm, height mm)."""
    from pypdf import PdfReader
    found = []
    for n, page in enumerate(PdfReader(str(path)).pages):
        xobjects = page["/Resources"].get("/XObject", {}) if "/Resources" in page else {}
        sizes = {k: (int(v.get_object()["/Width"]), int(v.get_object()["/Height"])) for k, v in xobjects.items()
                 if v.get_object().get("/Subtype") == "/Image"}
        data = page.get_contents().get_data().decode("latin1")
        for w, h, name in re.findall(r"([\d.]+) 0 0 ([\d.]+) [\d.-]+ [\d.-]+ cm\s*(/\S+) Do", data):
            if name in sizes:
                found.append((n + 1, sizes[name][0], sizes[name][1], float(w) / 72 * 25.4, float(h) / 72 * 25.4))
    return found


def page_marks(path):
    """For each page: the lowest point drawn in the frame, text or image, in mm from the frame top,
    and the bottom of the first image drawn on it, likewise, or None."""
    from pypdf import PdfReader
    from pypdf.generic import ContentStream
    reader = PdfReader(str(path))
    top, bottom = 842 - 56.69, 56.69   # A4 frame inside 20 mm margins, in points

    def mul(m, c):
        return [m[0] * c[0] + m[1] * c[2], m[0] * c[1] + m[1] * c[3], m[2] * c[0] + m[3] * c[2],
                m[2] * c[1] + m[3] * c[3], m[4] * c[0] + m[5] * c[2] + c[4], m[4] * c[1] + m[5] * c[3] + c[5]]
    out = []
    for page in reader.pages:
        ys, first = [], None
        xobjects = page["/Resources"].get("/XObject", {}) if "/Resources" in page else {}
        images = {k for k, v in xobjects.items() if v.get_object().get("/Subtype") == "/Image"}
        ctm, stack = [1, 0, 0, 1, 0, 0], []
        for operands, op in ContentStream(page.get_contents(), reader).operations:
            if op == b"q":
                stack.append(ctm)
            elif op == b"Q" and stack:
                ctm = stack.pop()
            elif op == b"cm":
                ctm = mul([float(x) for x in operands], ctm)
            elif op == b"Do" and operands and operands[0] in images:
                low = min(ctm[5], ctm[5] + ctm[3])
                ys.append(low)
                first = low if first is None else first

        def text(t, cm, tm, *_):
            if t.strip():
                ys.append(tm[5] * cm[3] + cm[5])
        page.extract_text(visitor_text=text)
        inside = [y for y in ys if bottom - 2 <= y <= top]
        to_mm = lambda y: (top - y) / 72 * 25.4
        out.append((to_mm(min(inside)) if inside else 0.0, to_mm(first) if first is not None else None))
    return out


def evidence_filled(path, label):
    """No evidence page less than half filled, but the last one and a page whose next block could not fit."""
    pages = pdf_pages(path)
    starts = [n for n, lines in enumerate(pages) if "11 · EVIDENCE" in " ".join(lines)]
    ends = [n for n, lines in enumerate(pages) if "12 · FAILURES" in " ".join(lines)]
    if not (starts and ends):
        return fail(f"{label}: the evidence section is not found")
    marks, frame = page_marks(path), 257.0
    half = []
    for n in range(starts[0], ends[0] - 1):
        used, (_, nxt) = marks[n][0], marks[n + 1]
        # The next page's first block ends with its first screenshot and caption.
        fits = nxt is not None and nxt + 8 <= frame - used
        if used < frame / 2 and (nxt is None or fits):
            half.append((n + 1, round(used)))
    ok(not half, f"{label}: no evidence page is less than half filled when its next block would fit: {half[:6]}")


HEADINGS = SECTIONS + ["Change history", "Distribution", "Results by function", "Conditional passes",
                       "Mandatory cases NHA agreed not to run", "Cases not tested"]


def page_rules(path, title, label, ids=(), groups=(), sources=None):
    """Every screenshot printed readably with every pixel it has, up to 300 dpi at its printed size;
    no heading ends a page; every page outside the evidence holds four lines besides its chrome."""
    pages = pdf_pages(path)
    small, short = [], []
    for page, pw, ph, mw, mh in placed_images(path):
        portrait = ph > pw
        if (portrait and mw < 44.5) or (not portrait and mw < 139.5):
            small.append((page, round(mw, 1)))
        src = (sources or {}).get("tall" if portrait else "wide")
        if src and ph < 3 * pw:
            want = min(src[0], int(mw / 25.4 * 300))
            if pw < want - 1:
                short.append((page, pw, want))
    ok(not small, f"{label}: every screenshot prints readably, portrait 45 mm wide or more, landscape 140 mm "
                  f"or more: {small[:4]}")
    ok(not short, f"{label}: every screenshot keeps its source pixels, up to 300 dpi: {short[:4]}")
    starts = [n for n, lines in enumerate(pages) if "11 · EVIDENCE" in " ".join(lines)]
    ends = [n for n, lines in enumerate(pages) if "12 · FAILURES" in " ".join(lines)]
    evidence = range(starts[0], ends[0]) if starts and ends else range(0)
    thin = [n + 1 for n, lines in enumerate(pages) if n and n not in evidence and len(body_lines(lines, title)) < 4]
    ok(not thin, f"{label}: every page outside the evidence holds four lines of text: pages {thin[:8]}")
    heads = set(HEADINGS) | set(groups)
    case_head = re.compile(r"^(?:" + "|".join(re.escape(i) for i in ids) + r")\s{2,}\S") if ids else None
    alone = []
    for n, lines in enumerate(pages[1:], 2):
        body = body_lines(lines, title)
        last = body[-1] if body else ""
        if (last in heads or re.match(r"^\d\d · ", last) or
                (case_head and n - 1 in evidence and case_head.match(last))):
            alone.append((n, last))
    ok(not alone, f"{label}: no heading ends a page: {alone[:4]}")
    return pages


def region(flat, start, end):
    """The PDF text between two section openers, such as 11 EVIDENCE and 12 FAILURES."""
    a = flat.find(start)
    b = flat.find(end, a + 1)
    return flat[a:b] if a >= 0 and b > a else ""


def ids_in(text, ids):
    return [i for i in ids if re.search(r"(?<![A-Z0-9_])" + re.escape(i) + r"(?![A-Z0-9_#])", text)]


def counts_in(flat):
    """The counts table as the PDF prints it: label, then all cases, then mandatory."""
    found = {}
    for label, key in zip(COUNTS, KEYS):
        m = re.search(re.escape(label) + r"\s+(\d+)\s+(\d+)", flat)
        if m:
            found[key] = (int(m.group(1)), int(m.group(2)))
    return found


def adds_up(c):
    return (c["applicable"] == c["tested"] + c["blocked"] + c["not tested"]
            and c["tested"] == c["passed"] + c["conditional pass"] + c["failed"]
            and c["cases"] == c["applicable"] + c["not applicable"])


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
        """Case id to [id, title, marking], from each tested case's evidence."""
        return {i: [i, v["Title"], v["Marking"]] for i, v in evidence_tables(doc).items()}

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
    ok(out.returncode == 0 and "Draft M1" in draft_text and "1 mandatory case is still open." in draft_text
       and "CRT_ABHA_105" in draft_text and "MANDATORY CASES NOT YET PASS" in draft_text,
       "M1 ft build --draft writes a PDF marked Draft that counts the open mandatory cases and logs the failure")
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
    sizes = {"CRT_ABHA_101": [(800, 500), (800, 500)], "CRT_ABHA_102": [(640, 400)], "VRFY_ABHA_101": [(720, 1560)]}
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
        ok(len(doc.inline_shapes) == 4, f"M1 ui: 4 inline images, got {len(doc.inline_shapes)}")
        caps = captions(doc)
        ok(caps == ["Figure 1, step 1", "Figure 2, step 2", "Figure 3, step 1", "Figure 4, step 1"],
           f"M1 ui: one numbered caption per screenshot: {caps}")
        listing = out_doc.with_name("report-m1-screenshots.json")
        figures = json.loads(listing.read_text())["figures"] if listing.exists() else []
        ok([(f["figure"], f["case"], Path(f["file"]).name) for f in figures] ==
           [(1, "CRT_ABHA_101", "01-step.png"), (2, "CRT_ABHA_101", "02-step.png"), (3, "CRT_ABHA_102", "01-step.png"),
            (4, "VRFY_ABHA_101", "01-step.png")], f"M1 ui: the screenshots listing names each full size file: {figures}")
        ev = evidence_tables(doc)
        ok(sorted(ev) == sorted(ids), f"M1 ui: one evidence table with the four fields per tested case ({len(ev)} of {len(ids)})")
        e101, e102, e103 = ev.get("CRT_ABHA_101", {}), ev.get("CRT_ABHA_102", {}), ev.get("CRT_ABHA_103", {})
        ok(e101.get("Request IDs") == ", ".join(RID[:2]) and e102.get("Request IDs") == RID[2]
           and ev.get("CRT_ABHA_104", {}).get("Request IDs") == "None in the manifest"
           and ev.get("VRFY_ABHA_101", {}).get("Request IDs") == "[invalid id]",
           "M1 ui: the manifest's REQUEST-IDs appear per case, a case it omits says so, one not a UUID is not printed")
        ok(e101.get("Result") == "PASS, 1 pass. Marking: Mandatory."
           and e101.get("Expected result") not in ("", "Not given in the workbook"),
           f"M1 ui: a passed case's result line and the workbook's expected result: {e101.get('Result')}")
        ok(e103.get("Result", "").startswith("FAIL, 3 passes. Marking: Optional.") and "ABDM-1204" in e103.get("Result", ""),
           f"M1 ui: a failed case's result line carries FAIL, 3 passes and its error code: {e103.get('Result')}")
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
    ok("XXXX XXXX 9012" in flat and "XX-XXXX-XXXX-4321" in flat and RID[0] in flat and "Fig 4, step 1" in flat,
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
        ok(len(evidence_tables(doc)) == len(hids) and f"run remark {hids[1]}" in doc_text(doc),
           f"HPR ui report: evidence for every case ({len(hids)}), the run's remark read past NHA's text")
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
        rest = table_rows(doc, NOT_TESTED) or []
        ok(listed is not None and [c.text for c in listed.rows[1].cells][0::2] == ["CRT_ABHA_101", agreement]
           and len(listed.rows) == 2, "agreed_not_run: the results summary lists the case with its agreement")
        ok(any(r[0] == "CRT_ABHA_101" and r[3] == "Not applicable" and agreement in r[4] for r in rest)
           and table_rows(doc, LOG) is None and "CRT_ABHA_101" not in evidence_tables(doc),
           "agreed_not_run: the not tested table carries the agreement; no evidence and no failures log entry")
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
    tabs = json.loads(run(writer, "cases", phr).stdout)
    p1 = list(tabs.values())[0]
    planned = {x.split(" | ")[0]: x.split(" | ")[1] for x in
               run(report, "plan", phr, "--run", "ui", "--entity", "private").stdout.splitlines() if " | " in x}
    sizes = {}
    for i in p1:
        sizes[planned.get(i, "")] = sizes.get(planned.get(i, ""), 0) + 1
    ok(len(sizes) > 1 and max(sizes.values()) <= 20,
       f"PHR: P1's cases fall under the sheet's section headings, none holding over 20: {sizes}")
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
        shown_titles = [(i, rows.get(i, ["", ""])[1], report_mask(titles.get(i, ""))) for i in differ[:2]]
        ok(not differ, f"PHR: titles are read from Test Title and agree with the page for every case: {shown_titles}")
    else:
        fail(f"PHR ui build failed: {out.stderr.strip()}")
    must = next(i for i in pids if page[i] == "Mandatory")
    may = next(i for i in pids if page[i] == "Optional")
    fill(phr, "ui", results(pids, {must: "failed", may: "failed"}))
    out = check(phr, "ui", "private")
    ok(out.returncode == 1 and f"not passed {must}: FAIL" in out.stdout and out.stdout.count("not passed ") == 1,
       f"PHR: a mandatory FAIL ({must}) blocks and is the only case listed, the Optional FAIL ({may}) does not")

    # Conditional pass, steps and a blocked case, on M1's ui columns.
    cond_results = results(ids, {"CRT_ABHA_113": "conditional-pass"},
                            {"CRT_ABHA_113": "Number shown; the address sits on another screen"})
    for res in cond_results:
        if res["id"] == "CRT_ABHA_113":
            res["iterations"] = 1
        if res["id"] == "CRT_ABHA_103":
            res.update(outcome="failed", remarks="ABDM-1204 on the second screen")
            res["steps"] = [{"step": 1, "outcome": "passed"},
                            {"step": 2, "outcome": "failed", "note": "the error banner did not show"},
                            {"step": 3, "outcome": "not-run"}]
        if res["id"] == "CRT_ABHA_201":
            res.update(outcome="needs-human", remarks="")
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
        counts = {r[0]: r[1] for r in table_rows(doc, ["Measure", "All cases", "Mandatory"]) or []}
        ok(counts.get("Conditional pass") == "1"
           and int(counts.get("Passed", 0)) + 3 + int(counts.get("Not applicable", 0)) == len(ids)
           and counts.get("Failed") == "1" and counts.get("Blocked") == "1" and counts.get("Not tested") == "0",
           f"conditional pass: counted on its own, the blocked case apart: {counts}")
        listed = next((t for t in doc.tables if header_of(t) == ["Test case ID", "Title", "Condition"]), None)
        ok(listed is not None and len(listed.rows) == 2 and listed.rows[1].cells[0].text == "CRT_ABHA_113"
           and "another screen" in listed.rows[1].cells[2].text, "conditional pass: listed with its condition")
        by_fn = table_rows(doc, ["Function", "Cases", "Passed", "Conditional pass", "Failed", "Blocked", "Not tested",
                                 "Not applicable"])
        ok(by_fn is not None and sum(int(r[3]) for r in by_fn) == 1 and sum(int(r[5]) for r in by_fn) == 1
           and sum(int(r[1]) for r in by_fn) == len(ids),
           "conditional pass: the table by function counts it, and the blocked case, in their own columns")
        ev = evidence_tables(doc)
        e113 = ev.get("CRT_ABHA_113", {})
        ok(e113.get("Result", "").startswith("CONDITIONAL PASS, 1 pass.") and "another screen" in e113.get("Observed", ""),
           f"conditional pass: its evidence names the condition: {e113}")
        step_tables = [t for t in doc.tables if header_of(t) == ["Step", "Result", "Note"]]
        ok(len(step_tables) == 1 and [[c.text for c in r.cells] for r in step_tables[0].rows[1:]] ==
           [["1", "PASS", ""], ["2", "FAIL", "the error banner did not show"], ["3", "not run", ""]],
           "steps: a tested case with steps shows a Step, Result and Note table in its evidence")
        rest = {r[0]: r for r in table_rows(doc, NOT_TESTED) or [] if r[3] != "Run, not applicable"}
        ok("CRT_ABHA_201" not in ev and list(rest) == ["CRT_ABHA_201"] and rest["CRT_ABHA_201"][3] == "Blocked"
           and "a second ABHA address" in rest["CRT_ABHA_201"][4],
           f"blocked: no evidence, one row in the not tested table with what it needs, from its step when Remarks "
           f"are empty: {list(rest.values())}")
        log = table_rows(doc, LOG) or []
        ok([(r[0], r[1]) for r in log] == [("CRT_ABHA_103", "Failed"), ("CRT_ABHA_113", "Conditional pass"),
                                           ("CRT_ABHA_201", "Blocked")],
           f"failures log: only failed, conditional pass and blocked: {[(r[0], r[1]) for r in log]}")
        ok("No result" not in doc_text(doc), "the Word copy never says No result")
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

    # Hand typed cells the writer never masked, in a failure reason, a need and a condition; and
    # statuses the script does not know, shown as such.
    leak = "Aadhaar 2345 6789 0128 mobile 9876543219 at rahul.k@sbx, Name: rahul kumar; DOB 02/03/1991"
    wb = openpyxl.load_workbook(hand)
    ws = wb.worksheets[0]
    ws.cell(where["CRT_ABHA_102"], rc).value = "the hint is missing"
    for case, status, remark in (("CRT_ABHA_103", "FAIL", leak), ("CRT_ABHA_201", None, "Needs tester: " + leak),
                                 ("CRT_ABHA_113", "CONDITIONAL PASS", leak), ("CRT_ABHA_202", "Passed", ""),
                                 ("CRT_ABHA_203", "N/A", ""), ("CRT_ABHA_204", "blocked", ""),
                                 ("CRT_ABHA_205", "Pass \u2713", "")):
        ws.cell(where[case], sc).value = status
        ws.cell(where[case], rc).value = remark
    wb.save(hand)
    cells_doc = work / "out" / "report-cells.docx"
    out = run(report, "build", hand, "--run", "ui", "--entity", "private", "--meta", meta_path, "--out", cells_doc,
              "--draft")
    ok(out.returncode == 0 and cells_doc.exists(), f"hand typed cells: the report builds: {out.stderr.strip()[-200:]}")
    if cells_doc.exists():
        doc = Document(str(cells_doc))
        texts = (doc_text(doc), re.sub(r"\s+", " ", pdf_text(cells_doc.with_suffix(".pdf"))))
        for raw, what in (("2345 6789 0128", "the Aadhaar number"), ("9876543219", "the mobile"),
                          ("rahul", "the ABHA address and the name"), ("kumar", "the labelled name"),
                          ("02/03/1991", "the date of birth")):
            ok(all(raw not in x for x in texts), f"hand typed cells: {what} reaches neither the PDF nor the DOCX")
        ok(all("XXXX XXXX 0128" in x and "Name: [masked]" in x for x in texts),
           "hand typed cells: the condition, need and failure reason are masked in both")
        rest = {r[0]: r for r in table_rows(doc, NOT_TESTED) or []}
        shown_statuses = [rest.get(i, [""] * 5)[4] for i in ("CRT_ABHA_202", "CRT_ABHA_203", "CRT_ABHA_204",
                                                             "CRT_ABHA_205")]
        ok(shown_statuses == ["Unrecognised status: Passed", "Unrecognised status: N/A", "Unrecognised status: blocked",
                              "Unrecognised status: Pass \u2713"],
           f"hand typed: a status the script does not know is shown as one: {shown_statuses}")

    # The either rule in the report: one passing meets it, and the other's FAIL is no mandatory failure;
    # with both blank, the ready line and the counts agree on what is open.
    for change, open_count in (({"CRT_ABHA_114": "failed"}, 0), ({"CRT_ABHA_114": "skip", "CRT_ABHA_115": "skip"}, 1)):
        book = work / ("either-" + str(open_count)) / M1.name
        book.parent.mkdir()
        shutil.copy2(M1, book)
        fill(book, "ui", [x for x in results(ids, change) if x["outcome"] != "skip"])
        pair_doc = book.parent / "report.docx"
        out = run(report, "build", book, "--run", "ui", "--entity", "government", "--meta", meta_path, "--out",
                  pair_doc, "--format", "docx", "--draft")
        doc = Document(str(pair_doc)) if pair_doc.exists() else None
        counts = {r[0]: int(r[2]) for r in table_rows(doc, ["Measure", "All cases", "Mandatory"]) or []} if doc else {}
        said = [p.text for p in doc.paragraphs if p.text.endswith("still open.") or p.text == "Ready for sandbox exit."] \
            if doc else []
        line = "Ready for sandbox exit." if not open_count else "1 mandatory case is still open."
        ok(said and said[0] == line and counts.get("Failed", 0) + counts.get("Blocked", 0) + counts.get("Not tested", 0)
           == open_count, f"either rule, {change}: {open_count} open in the ready line and in the counts: {said} {counts}")
        if not open_count and doc:
            ok("Either rule: CRT_ABHA_114 or CRT_ABHA_115 satisfies it." in
               evidence_tables(doc).get("CRT_ABHA_114", {}).get("Result", ""),
               "either rule: the other case's FAIL says the pair is met")

    # Whatever the evidence holds, build ends in a PDF: an empty file, a WebP, files Pillow cannot
    # read, a very tall capture, and text far longer than a page.
    odd = work / "odd-evidence" / "CRT_ABHA_101"
    odd.mkdir(parents=True)
    (odd / "01-zero.png").write_bytes(b"")
    Image.new("RGB", (1080, 2340), (200, 210, 220)).save(odd / "02-shot.webp")
    (odd / "03-shot.heic").write_bytes(b"not an image")
    (odd / "04-scan.pdf").write_bytes(b"%PDF-1.4 not really")
    Image.new("RGB", (600, 2600), (220, 210, 200)).save(odd / "05-tall.png")
    odd_book = work / "odd" / M1.name
    odd_book.parent.mkdir()
    shutil.copy2(M1, odd_book)
    long_text = " ".join(["word%d" % n for n in range(2500)])
    fill(odd_book, "ui", results(ids, remarks={"CRT_ABHA_105": long_text}))
    fill(odd_book, "ft", results(ids, responses={"CRT_ABHA_101": long_text}))
    wb = openpyxl.load_workbook(odd_book)
    for ws in wb.worksheets:
        top, cols = None, {}
        for row in ws.iter_rows(min_row=1, max_row=15):
            names = [re.sub(r"\s+", " ", str(c.value or "")).strip() for c in row]
            if "Test Case ID" in names:
                top = row[0].row
                ec = next(n + 1 for n, x in enumerate(names) if "expected result" in x.lower())
                idc = names.index("Test Case ID") + 1
        for r in range(top + 1, ws.max_row + 1) if top else ():
            if str(ws.cell(r, idc).value or "").replace(" ", "") == "CRT_ABHA_104":
                ws.cell(r, ec).value = long_text
    wb.save(odd_book)
    odd_meta = work / "odd-meta.json"
    odd_meta.write_text(json.dumps(dict(meta, findings={"CRT_ABHA_102": long_text})))
    for kind in ("ui", "ft"):
        odd_pdf = work / "odd" / f"report-{kind}.pdf"
        out = run(report, "build", odd_book, "--run", kind, "--meta", odd_meta, "--evidence", odd.parent,
                  "--out", odd_pdf)
        ok(out.returncode == 0 and odd_pdf.exists() and "LayoutError" not in out.stderr,
           f"odd evidence, {kind}: long expected, observed, remarks and response text build: {out.stderr.strip()[-200:]}")
    odd_pdf = work / "odd" / "report-ui.pdf"
    if odd_pdf.exists():
        flat = re.sub(r"\s+", " ", pdf_text(odd_pdf))
        words = doc_text(Document(str(odd_pdf.with_suffix(".docx"))))
        unread = ["01-zero.png", "03-shot.heic", "04-scan.pdf"]
        ok(all("Screenshot could not be read: " + f in flat and "Screenshot could not be read: " + f in words
               for f in unread), "odd evidence: each file that cannot be read is named in the PDF and the DOCX")
        placed = placed_images(odd_pdf)
        ok(len(placed) == 3 and all(mw >= 44.5 for _, _, _, mw, _ in placed) and all(mh < 200 for *_, mh in placed),
           f"odd evidence: the WebP prints, the very tall capture prints in two parts that fit a page: {placed}")

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

    # The M1 skill's router and functionality files read each case's marking
    # from the generated test case page through scripts/lib/test-case-page.mjs.
    # It must say what plan says, for both entity types, on every case.
    for entity in ("government", "private"):
        planned = run(report, "plan", fresh, "--run", "ui", "--entity", entity).stdout.splitlines()
        want = {x.split(" | ")[0]: x.split(" | ")[2].split(" (")[0].split(";")[0].strip()
                for x in planned if " | " in x and not x.startswith("total ")}
        page = subprocess.run(["node", str(ROOT / "scripts" / "lib" / "test-case-page.mjs"), "m1", entity],
                              capture_output=True, text=True)
        got = {x.split(" | ")[0]: x.split(" | ")[1] for x in page.stdout.splitlines() if " | " in x}
        differ = sorted(i for i in set(want) | set(got) if want.get(i) != got.get(i))
        ok(page.returncode == 0 and len(got) == 100 and not differ,
           f"the skill's page classifier agrees with plan for a {entity} entity: "
           f"{[(i, want.get(i), got.get(i)) for i in differ][:5]} {page.stderr.strip()[-200:]}")

    shape_checks(work, report, writer, run, ids)

    shutil.rmtree(work)
    sys.exit(1 if failures else 0)

def shape_checks(work, report, writer, run, ids):
    """The report's shape on a synthetic M1 run: made up names, generated screenshots, several per case."""
    from PIL import ImageDraw
    title = "M1 UI functional test report"
    evidence = work / "shape-evidence"
    for n, case in enumerate(ids):
        (evidence / case).mkdir(parents=True)
        for k, kind in enumerate([["wide", "wide"], ["tall", "tall", "tall"], ["wide", "tall"]][n % 3], 1):
            size = (1440, 900) if kind == "wide" else (1080, 2340)
            im = Image.new("RGB", size, (244, 246, 250))
            draw = ImageDraw.Draw(im)
            draw.rectangle([0, 0, size[0], size[1] // 12], fill=(17, 32, 68))
            draw.rectangle([size[0] // 12, size[1] // 5, size[0] * 11 // 12, size[1] * 3 // 10], outline=(38, 68, 136),
                           width=6)
            draw.text((40, size[1] // 3), f"SYNTHETIC SCREEN {case} step {k}", fill=(28, 35, 51))
            im.save(evidence / case / f"{k:02d}-step.png")
    meta = {
        "organisation": "Example Clinic Software (fictional)", "product": "DemoHMS", "milestone": "M1",
        "api_version": "V3", "category": "HMIS", "entity_type": "government", "role": "HIP",
        "executed_by": "Test User A", "test_dates": {"start": "2026-10-20", "end": "2026-10-23"},
        "applications": [{"name": "DemoHMS web", "url": "https://demohms.example.invalid/"}],
        "environment": {"browser": "Chromium", "browser_version": "0.0 (synthetic)", "playwright": "0.0",
                        "model": "synthetic"},
        "test_data": [{"item": "ABHA number used", "value": "XX-XXXX-XXXX-0000"}],
        "document": {"id": "FT-M1-SAMPLE", "version": "0.1", "release_date": "2026-10-24", "prepared_by": "Test User A",
                     "reviewed_by": "Test User B", "approved_by": "Test User C", "released_by": "Test User C",
                     "change_history": [{"version": "0.1", "date": "2026-10-24", "by": "Test User A",
                                         "change": "Synthetic sample"}],
                     "distribution": [{"name": "Test User B", "organisation": "Example (fictional)", "role": "Reviewer"}]},
        "team": [{"name": "Test User A", "role": "Tester", "qualifications": ""}],
        "flows": [], "limitations": ["Synthetic data: every value in this sample is made up."], "findings": {},
        "agreed_not_run": {}, "recordings": [{"title": "M1 ui run, synthetic", "link": "https://demohms.example.invalid/t.zip"}],
    }
    manifest = work / "shape-manifest.json"
    manifest.write_text(json.dumps({case: [str(uuid.UUID(int=n * 7919 + 1))] for n, case in enumerate(ids)}))
    bucket = {"passed": "passed", "conditional-pass": "conditional pass", "failed": "failed", "needs-human": "blocked",
              "not-run": "not applicable"}

    def build(name, entity, outcomes, *extra):
        """Write the outcomes into a fresh M1 copy, build both formats; return the paths and expected counts."""
        book = work / name / M1.name
        book.parent.mkdir()
        shutil.copy2(M1, book)
        plan = run(report, "plan", book, "--run", "ui", "--entity", entity).stdout
        lines = [x.split(" | ") for x in plan.splitlines() if " | " in x and not x.startswith("total ")]
        kinds = {x[0]: x[2] for x in lines}
        groups = sorted(set(x[1] for x in lines))
        rows = [{"id": case, "outcome": o, "iterations": 3 if o == "failed" else 1 + (n % 7 == 0),
                 "response": ("HTTP 422 ABDM-1204 for " if o == "failed" else "HTTP 200 for ") + case,
                 "remarks": {"passed": "The screen showed the expected result", "failed": "ABDM-1204 on the OTP step",
                             "conditional-pass": "Expected result met; the hint text is missing",
                             "needs-human": "a second ABHA address", "not-run": "the product does not offer it"}[o]}
                for n, (case, o) in enumerate(outcomes.items()) if o]
        path = work / f"{name}.json"
        path.write_text(json.dumps(rows))
        out = run(writer, "write", book, "--run", "ui", "--results", path)
        if out.returncode:
            sys.exit(f"the writer failed on the synthetic run: {out.stderr.strip()}")
        (work / f"{name}-meta.json").write_text(json.dumps(dict(meta, entity_type=entity)))
        pdf = work / name / "report-m1.pdf"
        built = run(report, "build", book, "--run", "ui", "--meta", work / f"{name}-meta.json", "--evidence", evidence,
                    "--manifest", manifest, "--out", pdf, *extra)
        ok(built.returncode == 0 and pdf.exists(), f"{name}: build writes the report: {built.stderr.strip()[-300:]}")

        def partners(case):
            m = re.match(r"mandatory, either (.+)$", kinds[case])
            return m.group(1).split(" or ") if m else [case]

        def met(case):
            return any(outcomes.get(i) in ("passed", "conditional-pass") for i in partners(case))

        def standing(case):
            """Plan's not applicable wins; a mandatory not-run nobody agreed is not tested."""
            o = outcomes.get(case)
            if kinds[case].startswith("not applicable"):
                return "not applicable"
            if o == "not-run" and kinds[case].startswith(("mandatory", "conditional")) and not (
                    len(partners(case)) > 1 and met(case)):
                return "not tested"
            return bucket[o] if o else "not tested"

        def tally(cases):
            c = {k: sum(1 for i in cases if standing(i) == k) for k in KEYS[3:]}
            c.update(cases=len(cases), tested=c["passed"] + c["conditional pass"] + c["failed"])
            c["applicable"] = c["tested"] + c["blocked"] + c["not tested"]
            return c
        # Each mandatory case once, and each either pair once: by the case that met it, else one tried.
        mandatory, pairs = [], []
        for i in ids:
            if not kinds[i].startswith(("mandatory", "conditional")):
                continue
            if len(partners(i)) == 1:
                mandatory.append(i)
            elif partners(i) not in pairs:
                pairs.append(partners(i))
                members = [x for x in partners(i) if kinds.get(x, "").startswith("mandatory")]
                good = [x for x in members if outcomes.get(x) in ("passed", "conditional-pass")]
                tried = [x for x in members if outcomes.get(x) in ("failed", "needs-human")]
                mandatory.append((good or tried or members)[0])
        return (pdf, {k: (tally(ids)[k], tally(mandatory)[k]) for k in KEYS}, standing, check_out(book, entity),
                groups)

    def check_out(book, entity):
        return run(report, "check", book, "--run", "ui", "--entity", entity).stdout

    def report_checks(name, pdf, expected, standing, gate):
        flat = re.sub(r"\s+", " ", pdf_text(pdf)) if pdf.exists() else ""
        found = counts_in(flat)
        ok(found == expected, f"{name}: the counts table is there and matches the inputs: {found} vs {expected}")
        ok(found and adds_up({k: v[0] for k, v in found.items()}) and adds_up({k: v[1] for k, v in found.items()}),
           f"{name}: the counts add up, for all cases and for mandatory ones")
        open_lines = gate.count("not passed ")
        line = ("Ready for sandbox exit." if not open_lines else
                f"{open_lines} mandatory case{' is' if open_lines == 1 else 's are'} still open.")
        ok(line in flat, f"{name}: the summary ends on the line {line!r}")
        ok(open_lines == expected["failed"][1] + expected["blocked"][1] + expected["not tested"][1],
           f"{name}: the open mandatory cases in the ready line ({open_lines}) are the mandatory failed, blocked "
           f"and not tested in the counts")
        doc = Document(str(pdf.with_suffix(".docx"))) if pdf.with_suffix(".docx").exists() else None
        said = [p.text for p in doc.paragraphs if re.fullmatch(
            r"Ready for sandbox exit\.|\d+ mandatory cases? (?:is|are) still open\.", p.text)] if doc else []
        ok(said == [line, line], f"{name}: the Word copy's summary and conclusion carry the PDF's ready line: {said}")
        words = doc_text(doc) if doc else ""
        ok("No result" not in flat and "No result" not in words, f"{name}: \"No result\" appears nowhere")
        word_counts = {r[0]: (int(r[1]), int(r[2])) for r in (table_rows(doc, ["Measure", "All cases", "Mandatory"]) or [])} if doc else {}
        ok(word_counts == {label: expected[k] for label, k in zip(COUNTS, KEYS)},
           f"{name}: the Word copy's counts table matches the PDF's")
        tested = [i for i in ids if standing(i) in ("passed", "conditional pass", "failed")]
        shown = ids_in(region(flat, "11 · EVIDENCE", "12 · FAILURES"), ids)
        ok(shown == tested, f"{name}: evidence holds the tested cases only ({len(shown)} of {len(tested)}): "
                            f"{sorted(set(shown) ^ set(tested))[:5]}")
        logged = ids_in(region(flat, "12 · FAILURES", "13 · CONCLUSION"), ids)
        due = [i for i in ids if standing(i) in ("failed", "blocked", "conditional pass")]
        ok(logged == due, f"{name}: the failures log holds only failed, blocked and conditional pass cases: {logged}")
        if doc:
            log = [r[0] for r in table_rows(doc, LOG) or []]
            rest = [r[0] for r in table_rows(doc, NOT_TESTED) or []]
            ok(log == due and rest == [i for i in ids if i not in tested] and sorted(evidence_tables(doc)) == sorted(tested),
               f"{name}: the Word copy holds the same evidence, log and not tested table as the PDF")
        return flat

    # Every case tested: mostly passed, conditional passes and optional failures, two or three screenshots each.
    every = {case: "passed" for case in ids}
    every.update({"CRT_ABHA_103": "failed", "CRT_ABHA_105_FA": "failed", "VRFY_ABHA_601": "failed",
                  "CRT_ABHA_113": "conditional-pass", "VRFY_ABHA_305": "conditional-pass"})
    sources = {"wide": (1440, 900), "tall": (1080, 2340)}
    pdf, expected, standing, gate, groups = build("shape-all", "government", every)
    if pdf.exists():
        page_rules(pdf, title, "shape, every case tested", ids, groups, sources)
        evidence_filled(pdf, "shape, every case tested")
        report_checks("shape, every case tested", pdf, expected, standing, gate)
        if SAMPLE:
            SAMPLE.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(pdf, SAMPLE)
            print(f"sample: {SAMPLE}, {len(pdf_pages(pdf))} pages")

    # Some cases blocked, not tested or NA, for a private entity: the demographic group does not apply.
    mixed = dict(every)
    mixed.update({case: None for case in ids if case.startswith("CRT_ABHA_30")})
    # VRFY_ABHA_202 is mandatory and recorded NA with no agreement: open, not tested.
    # CRT_ABHA_301 was run though its group is for government only: not applicable, run.
    mixed.update({"VRFY_ABHA_101": "needs-human", "CRT_ABHA_201": "needs-human", "VRFY_ABHA_102": None,
                  "CRT_ABHA_401": None, "CRT_ABHA_402": "not-run", "VRFY_ABHA_202": "not-run",
                  "CRT_ABHA_301": "failed"})
    pdf, expected, standing, gate, groups = build("shape-mixed", "private", mixed, "--draft")
    if pdf.exists():
        report_checks("shape, some not tested", pdf, expected, standing, gate)
        page_rules(pdf, "Draft " + title, "shape, some not tested", ids, groups, sources)
        doc = Document(str(pdf.with_suffix(".docx")))
        rest = {r[0]: r for r in table_rows(doc, NOT_TESTED) or []}
        ok(rest.get("VRFY_ABHA_202", ["", "", "", ""])[3] == "Not tested" and "without NHA's agreement"
           in rest.get("VRFY_ABHA_202", [""] * 5)[4],
           f"a mandatory NA nobody agreed is not tested, with what to do: {rest.get('VRFY_ABHA_202')}")
        ok(rest.get("CRT_ABHA_301", ["", "", "", ""])[3] == "Run, not applicable"
           and "Run, result FAIL" in rest.get("CRT_ABHA_301", [""] * 5)[4],
           f"a case run in a group not for this entity stays not applicable, with its result: {rest.get('CRT_ABHA_301')}")


if __name__ == "__main__":
    main()
