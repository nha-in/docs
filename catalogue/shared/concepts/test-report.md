---
id: shared.concept.test-report
type: concept
gateway: shared
milestone: n/a
version: abdm-v3
title: Turn a completed test run into the final test report
summary: >
  When every mandatory case in NHA's workbook is PASS for a run type, a script
  reads the workbook and the run's screenshots and writes the test report NHA
  asks for, as a Word document in a fixed thirteen section structure, with
  Aadhaar and ABHA numbers masked and no credential in it.
sources:
  - url: https://github.com/nha-in/docs/blob/main/catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/MANIFEST.md
    status: reference
    note: >
      NHA's request of 22 October 2026: run the cases in its workbook, write
      the results into the same sheet, and produce the final test report from
      the run. The report structure is the common ground of the empanelled
      agencies' M1 to M3 functional testing reports NHA sent with it.
related:
  concepts:
    - shared.concept.test-workbook-write-back
---

# Turn a completed test run into the final test report

## In plain words

A functional test run ends with NHA's workbook filled in, one row per case.
The test report is the document a reviewer signs off: who tested what, when,
with which tools, the status of every case, and the evidence for each one. It
is built from the workbook, not written by hand, so the report and the sheet
always agree.

The report is written only when the run has passed. Its gate is every
mandatory case that applies to your entity type, government or private, with
status `PASS` in the run type's column. A mandatory case that is `FAIL`,
`NA` or blank stops it.

| Run type | Report | Evidence per case |
|---|---|---|
| `ui` | The exit report NHA asks for | The screenshots under `abdm-ft/evidence/<case id>/` |
| `ft` | The same structure | The `FT Response with Code` value in place of screenshots |

The report has thirteen sections, in this order: cover, document control,
executive summary, ABDM details, scope, test environment and tools, approach
and methodology, test data, results summary, evidence, failures and iterations
log, conclusion, annexures. Every table comes from the workbook or from
`meta.json`. The only prose you write is the one line finding per case, in
`meta.json`; the executive summary and the conclusion are built from the
counts.

How the `Mandatory/ Optional` column is read:

| Marking in the sheet | Government entity | Private entity |
|---|---|---|
| `Mandatory`, `Yes` | Mandatory | Mandatory |
| `No`, `Optional`, `Non-Mandatory` | Optional | Optional |
| `Mandatory for Private` | Optional | Mandatory |
| `Mandatory for Government` | Mandatory | Optional |
| `Mandatory for Private /Government (Optional only if ...)` | Mandatory, flagged conditional | Mandatory, flagged conditional |
| `Either of the test cases X or Y is mandatory for Government` | X or Y must pass; one passing satisfies both | The row carrying it is optional; the other case keeps its own marking |
| `Yes (if ...)`, `Yes, if ...`, `Yes(only if ...)` | Mandatory, flagged conditional | Mandatory, flagged conditional |
| Blank or anything else | Mandatory, flagged unrecognised | Mandatory, flagged unrecognised |

A conditional case your system does not offer still blocks the report until
it is recorded. Record it `not-run` only after NHA agrees it does not apply,
and say so in its remarks: the gate counts `NA` on a mandatory case as not
passed, and the check prints every case it treated as conditional so the
person signing off sees them.

## Before you start

- The workbook the run wrote into, with its results, as `shared.concept.test-workbook-write-back` leaves it.
- For a `ui` report, the screenshots under `abdm-ft/evidence/<case id>/`, one folder per case id as `cases` prints it. They are placed in name order, so name them `01-consent.png`, `02-otp.png`. Blur any Aadhaar number, OTP or full mobile on a screenshot before it goes in the folder: the script masks text, not images.
- Python 3.9 or later with `python-docx`, `openpyxl` and `Pillow`: `pip install python-docx openpyxl pillow`. All three are open source (MIT, MIT and the HPND licence).
- LibreOffice, if you want a PDF beside the Word file. Without it, export the PDF from Word or LibreOffice yourself.
- The script below, saved as `abdm-ft/abdm_report.py`.
- A `meta.json` for the report, written by you, with placeholder values replaced. It carries no credential: the script refuses any field named like `password`, `secret`, `token` or `credentials`.

```json
{
  "organisation": "<YOUR ORGANISATION'S REGISTERED NAME>",
  "product": "<YOUR PRODUCT NAME>",
  "milestone": "M1",
  "api_version": "V3",
  "category": "HMIS",
  "entity_type": "private",
  "role": "HIP",
  "executed_by": "<TESTER NAME>",
  "test_dates": {"start": "2026-10-20", "end": "2026-10-23"},
  "applications": [{"name": "<YOUR PRODUCT NAME> web", "url": "https://<YOUR TEST HOST>/"}],
  "environment": {
    "browser": "Chromium",
    "browser_version": "<VERSION PLAYWRIGHT REPORTS>",
    "playwright": "<PLAYWRIGHT VERSION>",
    "phr_app": "ABHA app",
    "phr_app_version": "<VERSION ON THE TEST DEVICE>",
    "emulator": "<EMULATOR NAME AND ANDROID VERSION>",
    "model": "<MODEL THAT RAN THE AGENT>"
  },
  "test_data": [
    {"item": "ABHA number used", "value": "XX-XXXX-XXXX-1234"},
    {"item": "ABHA address used", "value": "<TEST ABHA ADDRESS>@sbx"}
  ],
  "document": {
    "id": "FT-M1",
    "version": "1.0",
    "release_date": "2026-10-24",
    "prepared_by": "<NAME, ROLE>",
    "reviewed_by": "<NAME, ROLE>",
    "approved_by": "<NAME, ROLE>",
    "released_by": "<NAME, ROLE>",
    "change_history": [{"version": "1.0", "date": "2026-10-24", "by": "<NAME>", "change": "First issue"}],
    "distribution": [{"name": "<NAME>", "organisation": "<ORGANISATION>", "role": "<ROLE>"}]
  },
  "findings": {"CRT_ABHA_101": "The Create ABHA option opens the Aadhaar consent screen."},
  "recordings": [{"title": "M1 ui run, full trace", "link": "<LINK TO THE RECORDING>"}]
}
```

```python
"""Check that a functional test run may be reported, and write the report.

  python3 abdm_report.py check WORKBOOK --run ft|ui --entity government|private
  python3 abdm_report.py build WORKBOOK --run ft|ui --meta meta.json --evidence DIR --out REPORT.docx

check lists every mandatory case not PASS for the run type and exits 1, or
exits 0 when there is none. build refuses unless check passes, then writes the
report. Needs python-docx, openpyxl and Pillow
(pip install python-docx openpyxl pillow). With LibreOffice's soffice on PATH,
build also writes a PDF.
"""
import argparse, json, re, shutil, subprocess, sys
from datetime import date
from pathlib import Path

import openpyxl

# The workbook layout shared.concept.test-workbook-write-back writes: the first
# column a name matches, with a "<column> (run)" column where NHA had text.
COLUMNS = {
    "ui": {"status": ["Status(PASS/FAIL)", "Status"], "response": ["Response of Request with Code"],
           "iterations": ["Iterations"], "remarks": ["Remarks", "Remark"]},
    "ft": {"status": ["FT Status"], "response": ["FT Response with Code"],
           "iterations": ["FT Iterations"], "remarks": ["FT Remarks"]},
}
MARKING = ["Mandatory/ Optional", "Mandatory/Optional", "Mandatory / Optional"]
TITLE = ["Functionality", "Feature"]
OPTIONAL = ("no", "optional", "non-mandatory", "non mandatory", "not mandatory")
FORBIDDEN = re.compile(r"pass(word|wd)|secret|token|credential|api[_ -]?key|private[_ -]?key", re.I)
IMAGES = (".png", ".jpg", ".jpeg", ".gif", ".bmp")
RUN_NAME = {"ui": "UI functional test", "ft": "API functional test"}
SECTIONS = ["Document control", "Executive summary", "ABDM details", "Scope",
            "Test environment and tools", "Approach and methodology", "Test data",
            "Results summary", "Evidence", "Failures and iterations log", "Conclusion", "Annexures"]


def norm(text):
    return re.sub(r"\s+", " ", str(text if text is not None else "")).strip()


def mask(text):
    """ABHA numbers to XX-XXXX-XXXX-1234, any other 12 digit run to XXXX XXXX 1234."""
    text = re.sub(r"(?<!\d)\d{2}[ -]?\d{4}[ -]?\d{4}[ -]?(\d{4})(?!\d)", r"XX-XXXX-XXXX-\1", str(text))
    return re.sub(r"(?<!\d)\d{4}[ -]?\d{4}[ -]?(\d{4})(?!\d)", r"XXXX XXXX \1", text)


def load(path):
    return openpyxl.load_workbook(path, rich_text=True)


def header_row(ws):
    """The header row and, for each name, the first column carrying it."""
    for row in ws.iter_rows(min_row=1, max_row=15):
        names = [norm(c.value) for c in row]
        if "Test Case ID" in names:
            cols = {}
            for name, cell in zip(names, row):
                if name:
                    cols.setdefault(name, cell.column)
            return row[0].row, cols
    return None, {}


def cases(ws):
    """Case id to its first row. A repeated id gets #2, #3, as the writer does."""
    top, cols = header_row(ws)
    if top is None:
        return {}
    found, col = {}, cols["Test Case ID"]
    for r in range(top + 1, ws.max_row + 1):
        value = norm(ws.cell(r, col).value)
        if not value:
            continue
        base = key = value.replace(" ", "")
        n = 2
        while key in found:
            key, n = base + "#" + str(n), n + 1
        found[key] = r
    return found


def anchor(ws, row, col):
    for rng in ws.merged_cells.ranges:
        if rng.min_row <= row <= rng.max_row and rng.min_col <= col <= rng.max_col:
            return ws.cell(rng.min_row, rng.min_col)
    return ws.cell(row, col)


def index(wb):
    rows, twice = {}, []
    for ws in wb.worksheets:
        for case, row in cases(ws).items():
            if case in rows:
                twice.append(case)
            rows.setdefault(case, (ws, row))
    if twice:
        sys.exit("case id on more than one tab: " + ", ".join(twice))
    return rows


def value(ws, row, top, cols, names):
    """The run's value: its "(run)" column when that holds one, else the column."""
    col = next((cols[n] for n in names if n in cols), None)
    if col is None:
        return ""
    run_col = cols.get(norm(ws.cell(top, col).value) + " (run)")
    if run_col:
        got = norm(anchor(ws, row, run_col).value)
        if got:
            return got
    return norm(anchor(ws, row, col).value)


def classify(text, entity):
    """(kind, label, note, pair ids) for one marking and entity type."""
    t = norm(text)
    low = t.lower()
    if not t:
        return "mandatory", "Mandatory", "no marking: treated as mandatory", None
    if low.startswith("either"):
        ids = [i.replace(" ", "") for i in re.findall(r"\b[A-Z][A-Z0-9]*(?: ?_[A-Z0-9]+)+\b", t)]
        gov, priv = "gov" in low, "priv" in low
        if (entity == "government" and gov) or (entity == "private" and priv) or not (gov or priv):
            return "pair", "Either " + " or ".join(ids), "either rule: one of " + " or ".join(ids) + " must pass", ids
        return "optional", "Optional", "either rule names the other entity type: optional for " + entity, None
    if low in OPTIONAL or low.startswith(("optional", "non-mandatory", "non mandatory", "not mandatory", "no ")):
        return "optional", "Optional", None, None
    m = re.match(r"(mandatory|yes)\b[\s,:]*(.*)$", low)
    if not m:
        return "mandatory", "Mandatory", "unrecognised marking: treated as mandatory", None
    rest = m.group(2)
    if not rest:
        return "mandatory", "Mandatory", None, None
    conditional = "(" in rest or re.search(r"\bif\b", rest) is not None
    who = re.match(r"for\s+(.*)$", rest)
    if who and m.group(1) == "mandatory":
        head = who.group(1).split("(")[0]
        gov, priv = "gov" in head, "priv" in head
        if (gov or priv) and not ((entity == "government" and gov) or (entity == "private" and priv)):
            return "optional", "Optional", "mandatory for the other entity type only: optional for " + entity, None
        if conditional:
            return "mandatory", "Mandatory (conditional)", "conditional: treated as mandatory", None
        return "mandatory", "Mandatory", "mandatory for " + entity, None
    if conditional:
        return "mandatory", "Mandatory (conditional)", "conditional: treated as mandatory", None
    return "mandatory", "Mandatory", "unrecognised marking: treated as mandatory", None


def iterations(text):
    try:
        return int(float(text))
    except (TypeError, ValueError):
        return 0


def read_cases(path, run, entity):
    """Every case in sheet order, with its marking, the run's values and treatment."""
    wb = load(path)
    out = []
    for case, (ws, row) in index(wb).items():
        top, cols = header_row(ws)
        mcol = next((cols[n] for n in MARKING if n in cols), None)
        marking = norm(anchor(ws, row, mcol).value) if mcol else ""
        tcol = next((cols[n] for n in TITLE if n in cols), None)
        title = norm(anchor(ws, row, tcol).value) if tcol else ""
        kind, label, note, pair = classify(marking, entity)
        rec = {"id": case, "sheet": ws.title, "title": title or case, "marking": marking,
               "kind": kind, "label": label, "note": note, "pair": pair}
        for key, names in COLUMNS[run].items():
            rec[key] = value(ws, row, top, cols, names)
        rec["status"] = rec["status"].upper()
        rec["iterations"] = iterations(rec["iterations"])
        out.append(rec)
    # The either rule binds every case it names, whatever their own marking.
    groups = {}
    for rec in out:
        if rec["kind"] == "pair":
            groups[tuple(sorted(rec["pair"]))] = rec["pair"]
    by_id = {rec["id"]: rec for rec in out}
    for ids in groups.values():
        for i in ids:
            if i in by_id:
                other = [x for x in ids if x != i]
                by_id[i].update(kind="pair", pair=ids, label="Either, with " + " or ".join(other),
                                note="either rule: one of " + " or ".join(ids) + " must pass")
    return out, list(groups.values())


def gate(recs, groups):
    blocking = []
    by_id = {r["id"]: r for r in recs}
    for r in recs:
        if r["kind"] == "mandatory" and r["status"] != "PASS":
            blocking.append(r["id"] + ": " + (r["status"] or "blank"))
    for ids in groups:
        present = [by_id[i] for i in ids if i in by_id]
        if present and not any(r["status"] == "PASS" for r in present):
            blocking.append(" or ".join(r["id"] for r in present) + ": " +
                            ", ".join(r["status"] or "blank" for r in present))
    return blocking


def run_check(path, run, entity):
    recs, groups = read_cases(path, run, entity)
    if not recs:
        sys.exit("no Test Case ID column with ids in " + Path(path).name + ": nothing to report on")
    for r in recs:
        if r["note"]:
            print("marking " + r["id"] + ' "' + r["marking"] + '": ' + r["note"])
    blocking = gate(recs, groups)
    for line in blocking:
        print("not passed " + line)
    mandatory = sum(1 for r in recs if r["kind"] == "mandatory") + len(groups)
    print(str(len(blocking)) + " of " + str(mandatory) + " mandatory case(s) for a " + entity +
          " entity not PASS in the " + run + " run")
    return recs, groups, blocking


def forbidden(meta, where="meta.json"):
    found = []
    if isinstance(meta, dict):
        for k, v in meta.items():
            if FORBIDDEN.search(str(k)):
                found.append(where + "." + str(k))
            found += forbidden(v, where + "." + str(k))
    elif isinstance(meta, list):
        for n, v in enumerate(meta):
            found += forbidden(v, where + "[" + str(n) + "]")
    return found


def days(start, end):
    try:
        return (date.fromisoformat(end) - date.fromisoformat(start)).days + 1
    except (TypeError, ValueError):
        return ""


def build(path, run, meta, evidence, out, recs, groups):
    from docx import Document
    from docx.enum.text import WD_BREAK
    from docx.shared import Pt
    from PIL import Image

    doc = Document()
    sec = doc.sections[0]
    width = sec.page_width - sec.left_margin - sec.right_margin
    height = sec.page_height - sec.top_margin - sec.bottom_margin
    dm = meta.get("document", {})
    dates = meta.get("test_dates", {})
    milestone = meta.get("milestone", "")
    entity = meta["entity_type"]

    def table(rows, header=None):
        t = doc.add_table(rows=0, cols=len(header or rows[0]))
        t.style = "Table Grid"
        for n, row in enumerate(([header] if header else []) + rows):
            cells = t.add_row().cells
            for cell, text in zip(cells, row):
                cell.text = str(text if text is not None else "")
                if header and n == 0:
                    for p in cell.paragraphs:
                        for r in p.runs:
                            r.bold = True
        return t

    def heading(text):
        doc.add_heading(text, level=1)

    n = len(recs)
    passed = sum(1 for r in recs if r["status"] == "PASS")
    failed = sum(1 for r in recs if r["status"] == "FAIL")
    na = sum(1 for r in recs if r["status"] == "NA")
    blank = n - passed - failed - na
    mandatory = sum(1 for r in recs if r["kind"] == "mandatory") + len(groups)
    retried = [r for r in recs if r["iterations"] > 1]
    log = [r for r in recs if r["iterations"] > 1 or r["status"] != "PASS"]
    label = RUN_NAME[run]

    # 1. Cover
    doc.add_heading(milestone + " " + label + " report", level=0)
    table([["Product", meta.get("product", "")], ["Organisation", meta.get("organisation", "")],
           ["Milestone", milestone], ["Report type", label + " (run type " + run + ")"],
           ["Document id", dm.get("id", "FT-" + milestone)], ["Release date", dm.get("release_date", "")]])
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

    # 2. Document control
    heading(SECTIONS[0])
    table([["Document id", dm.get("id", "FT-" + milestone)], ["Version", dm.get("version", "")],
           ["Prepared by", dm.get("prepared_by", "")], ["Reviewed by", dm.get("reviewed_by", "")],
           ["Approved by", dm.get("approved_by", "")], ["Released by", dm.get("released_by", "")],
           ["Release date", dm.get("release_date", "")]])
    doc.add_heading("Change history", level=2)
    history = dm.get("change_history", [])
    table([[h.get("version", ""), h.get("date", ""), h.get("by", ""), h.get("change", "")] for h in history]
          or [["", "", "", ""]], header=["Version", "Date", "By", "Change"])
    doc.add_heading("Distribution", level=2)
    dist = dm.get("distribution", [])
    table([[d.get("name", ""), d.get("organisation", ""), d.get("role", "")] if isinstance(d, dict)
           else [str(d), "", ""] for d in dist] or [["", "", ""]], header=["Name", "Organisation", "Role"])

    # 3. Executive summary
    heading(SECTIONS[1])
    doc.add_paragraph(
        "This report records the " + label + " run of " + meta.get("product", "") + " by " +
        meta.get("organisation", "") + " against ABDM " + milestone + ", API version " +
        meta.get("api_version", "V3") + ", from " + dates.get("start", "") + " to " + dates.get("end", "") +
        ". The workbook " + Path(path).name + " holds " + str(n) + " cases. " + str(passed) + " are PASS, " +
        str(failed) + " FAIL, " + str(na) + " NA and " + str(blank) + " have no result. All " + str(mandatory) +
        " mandatory cases that apply to a " + entity + " entity are PASS. " + str(len(retried)) +
        " cases took more than one pass.")

    # 4. ABDM details
    heading(SECTIONS[2])
    table([["Entity name", meta.get("organisation", "")], ["Product name", meta.get("product", "")],
           ["Category", meta.get("category", "")], ["Milestone", milestone],
           ["API version", meta.get("api_version", "V3")],
           ["Test execution dates", dates.get("start", "") + " to " + dates.get("end", "")],
           ["Number of days for testing", meta.get("test_days", days(dates.get("start"), dates.get("end")))],
           ["Most passes any case took", max([r["iterations"] for r in recs] or [0])],
           ["Test executed by", meta.get("executed_by", "")]])

    # 5. Scope
    heading(SECTIONS[3])
    apps = meta.get("applications", [])
    table([[a.get("name", ""), a.get("url", "")] if isinstance(a, dict) else [str(a), ""] for a in apps]
          or [["", ""]], header=["Application", "URL"])
    doc.add_paragraph("")
    sheets = sorted(set(r["sheet"] for r in recs), key=[r["sheet"] for r in recs].index)
    table([["Role", meta.get("role", "")], ["Entity type", entity],
           ["Workbook", Path(path).name], ["Tabs", ", ".join(sheets)], ["Cases", n]])

    # 6. Test environment and tools
    heading(SECTIONS[4])
    env = dict(meta.get("environment", {}))
    names = [("browser", "Browser"), ("browser_version", "Browser version"), ("playwright", "Playwright"),
             ("phr_app", "PHR app"), ("phr_app_version", "PHR app version"), ("emulator", "Emulator"),
             ("model", "Model that ran the agent")]
    rows = [[title, env.pop(key, "Not used")] for key, title in names]
    rows += [[key, val] for key, val in env.items()]
    table(rows, header=["Tool", "Version or value"])

    # 7. Approach and methodology
    heading(SECTIONS[5])
    for line in [
        "An agent ran every case in the workbook's order, following the module's test skill, and wrote each "
        "result into the workbook as the case ended.",
        "Each case had at most three passes. Iterations is the number of passes a case took, whether it ended "
        "PASS or FAIL.",
        "A person entered every OTP and gave every consent or approval the case needed. The agent waited for "
        "each of these steps and did not perform them.",
        "For a case that passes through the PHR app, the proof is one PHR app screenshot showing the consent "
        "granted or the record visible. The agent checked the application side.",
        ("Run type ui: the agent drove the application's screens with Playwright and kept a screenshot per step."
         if run == "ui" else
         "Run type ft: each case was judged on the calls to the ABDM sandbox and the callbacks received. The "
         "evidence for each case is the response with its code."),
    ]:
        doc.add_paragraph(line, style="List Bullet")

    # 8. Test data
    heading(SECTIONS[6])
    data = meta.get("test_data", [])
    if isinstance(data, dict):
        data = [{"item": k, "value": v} for k, v in data.items()]
    table([[d.get("item", ""), d.get("value", "")] for d in data] or [["", ""]], header=["Item", "Value"])

    # 9. Results summary
    heading(SECTIONS[7])
    table([[r["id"], r["title"], r["label"], r["status"] or "Not recorded", r["iterations"] or ""] for r in recs],
          header=["Test case ID", "Title", "Marking", "Status", "Iterations"])

    # 10. Evidence
    heading(SECTIONS[8])
    findings = meta.get("findings", {})
    for r in recs:
        doc.add_heading(r["id"] + ": " + r["title"], level=2)
        doc.add_paragraph("Status: " + (r["status"] or "Not recorded") + ". Finding: " +
                          (findings.get(r["id"]) or r["remarks"] or "None recorded."))
        if run == "ft":
            if r["response"]:
                p = doc.add_paragraph()
                code = p.add_run(r["response"])
                code.font.name = "Courier New"
                code.font.size = Pt(9)
            continue
        folder = Path(evidence) / r["id"]
        shots = sorted(f for f in folder.iterdir() if f.suffix.lower() in IMAGES) if folder.is_dir() else []
        for shot in shots:
            with Image.open(shot) as im:
                w, h = im.size
            # Page width, unless that makes a tall phone screenshot overrun the page.
            if h * width > 0.85 * height * w:
                doc.add_picture(str(shot), height=int(0.85 * height))
            else:
                doc.add_picture(str(shot), width=width)
            doc.add_paragraph(shot.name)

    # 11. Failures and iterations log
    heading(SECTIONS[9])
    if log:
        table([[r["id"], r["status"] or "Not recorded", r["iterations"] or "", r["remarks"]] for r in log],
              header=["Test case ID", "Status", "Iterations", "Remarks"])
    else:
        doc.add_paragraph("No case failed and no case took more than one pass.")

    # 12. Conclusion
    heading(SECTIONS[10])
    doc.add_paragraph(
        "All " + str(mandatory) + " mandatory cases that apply to a " + entity + " entity are PASS in the " +
        run + " run of " + meta.get("product", "") + " for " + milestone + ". Of " + str(n) + " cases, " +
        str(passed) + " are PASS, " + str(failed) + " FAIL, " + str(na) + " NA and " + str(blank) +
        " have no result.")

    # 13. Annexures
    heading(SECTIONS[11])
    recs_links = meta.get("recordings", [])
    table([[x.get("title", ""), x.get("link", "")] if isinstance(x, dict) else [str(x), ""] for x in recs_links]
          or [["", ""]], header=["Recording", "Link"])
    doc.add_paragraph("The completed workbook: " + Path(path).name)

    # Mask every run of text the document holds, tables included.
    def paragraphs(container):
        for p in container.paragraphs:
            yield p
        for t in container.tables:
            for row in t.rows:
                for cell in row.cells:
                    for p in paragraphs(cell):
                        yield p
    for p in paragraphs(doc):
        for r in p.runs:
            if r.text:
                r.text = mask(r.text)

    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(out))
    print("wrote " + str(out))
    if shutil.which("soffice"):
        subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(out.parent), str(out)],
                       check=False)
        print("wrote " + str(out.with_suffix(".pdf")))
    else:
        print("soffice is not on PATH: export the PDF from Word or LibreOffice")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("action", choices=["check", "build"])
    p.add_argument("workbook")
    p.add_argument("--run", choices=["ft", "ui"], required=True)
    p.add_argument("--entity", choices=["government", "private"])
    p.add_argument("--meta")
    p.add_argument("--evidence", default="abdm-ft/evidence")
    p.add_argument("--out")
    a = p.parse_args()
    meta = {}
    if a.action == "build":
        if not (a.meta and a.out):
            sys.exit("build needs --meta and --out")
        meta = json.loads(Path(a.meta).read_text())
        bad = forbidden(meta)
        if bad:
            sys.exit("meta.json carries a field named like a credential, which never goes in a report: " +
                     ", ".join(bad))
        meta["entity_type"] = a.entity or meta.get("entity_type")
    entity = a.entity or meta.get("entity_type")
    if entity not in ("government", "private"):
        sys.exit("--entity, or entity_type in meta.json, must be government or private")
    recs, groups, blocking = run_check(a.workbook, a.run, entity)
    if blocking:
        if a.action == "build":
            print("no report: every mandatory case must be PASS first", file=sys.stderr)
        sys.exit(1)
    if a.action == "build":
        build(a.workbook, a.run, meta, a.evidence, a.out, recs, groups)


if __name__ == "__main__":
    main()
```

## What happens

1. When the last case is recorded and written into the workbook, run the gate for the run type and your entity type:

   ```bash
   python3 abdm-ft/abdm_report.py check <workbook> --run ui --entity private
   ```

   It prints one `marking` line for every case whose marking is entity specific, conditional, an either rule or unrecognised, with how it was treated. Then one `not passed <id>: <status>` line per mandatory case in the way, an either pair as `<id> or <id>: <status>, <status>`, and a count.

2. If it exits `1`, the run is not finished. Rerun the cases it lists, as `open` in `shared.concept.test-workbook-write-back` does, and run `check` again. Do not run `build`.

3. Only when `check` exits `0`, write the one line findings into `meta.json` under `findings`, keyed by case id. A case without one gets its Remarks value. Then build:

   ```bash
   python3 abdm-ft/abdm_report.py build <workbook> --run ui --meta abdm-ft/meta.json --evidence abdm-ft/evidence --out abdm-ft/report-m1.docx
   ```

   `entity_type` in `meta.json` is the entity type, unless `--entity` is given. `build` runs the gate again and refuses with the same list if it fails.

4. For an `ft` report, use `--run ft` in both commands. The evidence for each case is its `FT Response with Code` value, and `--evidence` is not read.

5. With `soffice` on PATH, `build` also writes `report-m1.pdf`. Otherwise it prints that the PDF can be exported from Word or LibreOffice.

## How you know it worked

- `check` exits `0` and its last line reads `0 of <n> mandatory case(s) for a <entity> entity not PASS in the <run> run`.
- `build` prints `wrote abdm-ft/report-m1.docx` and exits `0`.
- The document opens with the cover, then the twelve headings from Document control to Annexures, in order. The results summary has one row per case in the workbook. Each case's evidence section holds its screenshots in name order, or its response for an `ft` report.
- No 12 digit number appears anywhere in it: an Aadhaar number reads `XXXX XXXX 1234` and an ABHA number `XX-XXXX-XXXX-1234`, with the last four digits kept.

## When it goes wrong

| Observed | Cause | Do |
|---|---|---|
| `ModuleNotFoundError: No module named 'docx'` | python-docx is not installed | `pip install python-docx openpyxl pillow` |
| `not passed CRT_ABHA_105: FAIL` | A mandatory case failed | Fix the cause the Remarks name, rerun the case, write it back, run `check` again |
| `not passed <id>: NA` | A mandatory case was recorded not run | Run it, or agree with NHA that it does not apply and keep the reason in its remarks. The gate still counts it until it is PASS |
| `not passed <id>: blank` | The case needs a tester step, or never ran | Finish it with the tester, then write it back |
| `marking <id> "...": unrecognised marking: treated as mandatory` | NHA used a marking the script does not know | Ask NHA what it means for your entity type. Never edit NHA's marking to pass the gate |
| `meta.json carries a field named like a credential` | `meta.json` has a password, secret, token or credentials field | Delete the field. A report never carries a credential |
| `case id on more than one tab` | Two tabs carry the same id | Ask NHA which one counts |
| `no Test Case ID column with ids` | The workbook has no case ids, as the PHR workbook does not yet | Wait for the version of the workbook with ids. A report without them has nothing to stand on |
| A screenshot is missing from the report | Its file is not under `<evidence>/<case id>/`, or its extension is not png, jpg, gif or bmp | Move it into the case's folder, named as `cases` prints the id, and build again |
