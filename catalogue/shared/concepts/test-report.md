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
  asks for, as a designed PDF to submit and a Word copy to edit, with a cover,
  a contents list and fourteen fixed sections, each case's evidence in one
  fixed table with its REQUEST-IDs, Aadhaar, ABHA and mobile numbers masked and
  no credential, token or OTP in it.
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
status `PASS` in the run type's column. A mandatory case that is `FAIL` or
blank stops it, and so does one that is `NA` unless NHA agreed it is not run.

| Run type | Report | Evidence per case |
|---|---|---|
| `ui` | The exit report NHA asks for | The screenshots under `abdm-ft/evidence/<case id>/` |
| `ft` | The same structure | The `FT Response with Code` value in place of screenshots |

The report is a PDF, the file you submit, with a Word copy beside it that you
can edit. Both hold the same text. The PDF is drawn in the ABDM Sandbox design
system: a navy cover with the key facts in a ruled grid, a contents list with
page numbers, each section opened by a rule and a numbered label, hairline
tables, the counts as tiles, and each screenshot framed and captioned. Every
page after the cover carries the report title in its header and
`Confidential` with `Page N of M` in its footer. Its parts come in this order,
each from a fixed source, so two reports for the same milestone read the same
way.

| Part | What it holds | Comes from |
|---|---|---|
| Cover | Title, product, organisation, milestone, run type, document id, version, release date, a confidentiality line | `meta.json`, `--run` |
| Contents | Every section and every case id with its page number. The Word copy holds a contents field that Word fills in on opening | The headings below |
| 1. Document control | Document title, id, version, prepared, reviewed, approved and released by, release date; change history; distribution list by name, organisation and role | `meta.json` `document` |
| 2. Executive summary | The run in one paragraph: cases, PASS, FAIL, NA, no result, whether every mandatory case holds, how many took more than one pass | The workbook's counts |
| 3. ABDM details | Entity, product, category, role, entity type, milestone, API version, run type, dates, days, most passes any case took, executed by, recordings | `meta.json`, the workbook |
| 4. Results summary | A counts table, a table by the workbook's Function column, and one row per case with marking, status and iterations; any mandatory case NHA agreed is not run, with the agreement | The workbook, `agreed_not_run` |
| 5. Scope and limitations | Applications and URLs; role, entity type, run type, workbook, tabs, cases; optional cases not passed; the limitation that results hold for the build tested on those dates, and any `limitations` | `meta.json`, the workbook |
| 6. Flow details | For linking and consent flows: the ABHA address used and the HI types created or tested | `meta.json` `flows` |
| 7. Test environment and tools | Browser, Playwright, PHR app, emulator, the model that ran the agent, with versions | `meta.json` `environment` |
| 8. Test team | Name, role and qualifications of each tester, reviewer and approver | `meta.json` `team` |
| 9. Approach and methodology | How the agent ran cases, the three pass limit, how OTPs and consents were given, the run type, REQUEST-IDs, and what PASS, FAIL, NA and no result mean | Fixed text, `--run` |
| 10. Test data | The ABHA numbers and addresses used, masked | `meta.json` `test_data` |
| 11. Evidence | Per case, a heading with its id and title, then one table of test case ID, title, marking, expected result, observed, status, iterations, failure reason with any error code, and request ids; then the response with its code; then each screenshot with a numbered caption naming the case and step | The workbook, `findings`, `--manifest`, the evidence folder |
| 12. Failures and iterations log | Every case not PASS or that took more than one pass, with its failure reason and error code | The workbook |
| 13. Conclusion and sign-off | The result in one paragraph, then a sign-off table for preparer, reviewer and approver with date and signature | The counts, `meta.json` `document` |
| 14. Annexures | Recording links, the completed workbook, the REQUEST-ID manifest, the evidence folder | `meta.json`, the arguments |

The only prose you write is the one line finding per case, in `meta.json`.
The observed value is that finding, else the Remarks value; the response
with its code follows the table. A failure reason is the Remarks value, else the response,
with any `ABDM-` or `MIS-` code, HTTP 4xx or 5xx status or exception named in them. Request
ids come from the run's manifest JSON, the file the test skill writes beside
the run log, given with `--manifest`. A request id that is a UUID is printed as
it is, so a reviewer can look it up in the gateway's record; anything else in
that field is masked like the rest of the report.

What the report never holds: a login, password, client secret, token or OTP,
an unmasked Aadhaar number, ABHA number or mobile, and anyone's email or phone
number. The team and distribution tables take a name, a role and an
organisation only.

How the marking column is read. It is the first column whose name holds both
`Mandatory` and `Optional`, in any case and spacing: `Mandatory/ Optional` on
the HMIS and HPR sheets, `Optional / Mandatory` on the PHR sheet.

| Marking in the sheet | Government entity | Private entity |
|---|---|---|
| `Mandatory`, `Yes` | Mandatory | Mandatory |
| `Mandatory` then a list of mandatory and optional fields, as on PHR's profile cases | Mandatory | Mandatory |
| `No`, `Optional`, `Non-Mandatory` | Optional | Optional |
| `Mandatory for Private` | Optional | Mandatory |
| `Mandatory for Government` | Mandatory | Optional |
| `Mandatory for Private /Government (Optional only if ...)` | Mandatory, flagged conditional | Mandatory, flagged conditional |
| `Either of the test cases X or Y is mandatory for Government` | X or Y must pass; one passing satisfies both | The row carrying it is optional; the other case keeps its own marking |
| `Yes (if ...)`, `Yes, if ...`, `Yes(only if ...)` | Mandatory, flagged conditional | Mandatory, flagged conditional |
| Blank | Mandatory, flagged not marked | Mandatory, flagged not marked |
| Anything else, such as a note in the marking cell | Mandatory, flagged unrecognised | Mandatory, flagged unrecognised |

A group's Applicable To comes first. When the row that heads a group names one entity type only, such as M1's demographic authentication group, `Government`, every case in it is not for the other entity type, whatever its own marking says: for a private entity, CRT_ABHA_301 to 309 are not mandatory.

A mandatory case can have no meaning in a run type, such as a screen only case
in an `ft` run, or be a conditional case your system does not offer. Record it
`not-run` only after NHA agrees it does not apply, and say so in its remarks.
Then add it to `agreed_not_run` in `meta.json`, with who at NHA agreed and
when: `"agreed_not_run": {"<case id>": "<who at NHA agreed, and when>"}`. The gate passes a mandatory `NA` case only when it is listed there, and
the report lists every such case with its agreement in the results summary and
in the failures and iterations log. An unlisted mandatory `NA` still blocks.
The check also prints every case it treated as conditional, so the person
signing off sees them.

## Before you start

- The workbook the run wrote into, with its results, as `shared.concept.test-workbook-write-back` leaves it.
- For a `ui` report, the screenshots under `abdm-ft/evidence/<case id>/`, one folder per case id as `cases` prints it. They are placed in name order, so name them `01-consent.png`, `02-otp.png`. Blur any Aadhaar number, OTP or full mobile on a screenshot before it goes in the folder: the script masks text, not images.
- Python 3.9 or later with `openpyxl`, `Pillow`, `python-docx` and `reportlab`: `pip install openpyxl pillow python-docx reportlab`. On Python 3.9, ReportLab 5 does not install; use `pip install "reportlab<5"`. All four are open source (MIT, the HPND licence, MIT and BSD). ReportLab draws the PDF itself, so no office suite is needed.
- Optionally, the design system's fonts as `.ttf` files: Newsreader for headings, Public Sans for text and JetBrains Mono for labels and case ids, all under the SIL Open Font License. The script looks in the folder given with `--fonts`, then `abdm-ft/fonts/`, then `~/Library/Fonts`, `/Library/Fonts` and `/usr/share/fonts`, and prints which it used. A font it does not find is replaced by the PDF's own Times-Roman, Helvetica or Courier, which are the design system's fallbacks, so the report is complete either way.
- The script below, saved as `abdm-ft/abdm_report.py`.
- A `meta.json` for the report, written by you, with placeholder values replaced. It carries no credential: the script refuses any field named like `password`, `secret`, `token` or `credentials`, and any value that holds a token or a credential's label with its value, such as `client secret: ...`. `agreed_not_run` is only for mandatory cases NHA agreed are not run; leave it `{}` otherwise. `flows` is for M2 and M3 linking and consent flows; leave it `[]` for M1. `team` and `distribution` carry no email or phone number.
- For request ids in the report, the run's manifest JSON, which the test skill writes beside the run log at the end of the run. It is optional: without it each case reads `No manifest given`. The script refuses a manifest that holds a credential, as it does `meta.json`.

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
  "team": [{"name": "<TESTER NAME>", "role": "Tester", "qualifications": "<QUALIFICATIONS, OR LEAVE EMPTY>"}],
  "flows": [{"name": "<FLOW, SUCH AS HIP INITIATED LINKING>", "abha_addresses": ["<TEST ABHA ADDRESS>@sbx"], "hi_types": ["<HI TYPE, SUCH AS PRESCRIPTION>"]}],
  "limitations": [],
  "findings": {"CRT_ABHA_101": "The Create ABHA option opens the Aadhaar consent screen."},
  "agreed_not_run": {},
  "recordings": [{"title": "M1 ui run, full trace", "link": "<LINK TO THE RECORDING>"}]
}
```

```python
"""Check that a functional test run may be reported, and write the report.

  python3 abdm_report.py check WORKBOOK --run ft|ui --entity government|private [--meta meta.json]
  python3 abdm_report.py build WORKBOOK --run ft|ui --meta meta.json --evidence DIR --out REPORT.pdf
      [--manifest RUN.json] [--format pdf|docx|both] [--fonts DIR]

check lists every mandatory case not PASS for the run type and exits 1, or
exits 0 when there is none. build refuses unless check passes, then writes the
report. A mandatory case NA passes only when meta.json's agreed_not_run names it.
--manifest is the run's manifest of case ids to REQUEST-IDs, printed per case.
build writes REPORT.pdf, the report to submit, and REPORT.docx beside it, the
editable copy; --format picks one of them. The PDF uses Newsreader, Public Sans
and JetBrains Mono where it finds them (--fonts DIR, abdm-ft/fonts, then the
system's font folders), else Times-Roman, Helvetica and Courier.
Needs openpyxl, Pillow, python-docx and reportlab
(pip install openpyxl pillow python-docx reportlab).
"""
import argparse, json, re, sys
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
# Header names vary by sheet and spacing: "Mandatory/ Optional" on HMIS and
# HPR, "Optional / Mandatory" on PHR; "Functionality", "Feature" or "Test Title".
TITLE = ["functionality", "feature", "test title"]
OPTIONAL = ("no", "optional", "non-mandatory", "non mandatory", "not mandatory")
FORBIDDEN = re.compile(r"pass(word|wd)|secret|token|credential|api[_ -]?key|private[_ -]?key", re.I)
# A JWT: three base64url segments, the first a JSON header, so starting eyJ.
JWT = re.compile(r"\beyJ[\w-]+\.[\w-]+\.[\w-]*")
SECRET_WORDS = r"pass(?:word|wd)|secret|token|otp|credentials?|api[ _-]?key|private[ _-]?key"


def labelled(words):
    """A value after a label naming a secret: "client secret: x", "OTP 482913", "otp":"482913"."""
    return re.compile(
        r"(\b[\w-]*(?:" + words + r")[\w-]*['\"]?\s*[:=]\s*['\"]?)([^\s'\",;}]+)"
        r"|(\b(?:" + words + r")\b\s+(?:is\s+)?)((?=[^\s,;]*\d)[^\s,;]{4,})", re.I)


LABELLED = labelled(SECRET_WORDS)
# What meta.json may never hold as a value. An OTP is masked, not refused: it
# has expired by the time a report is written, and findings name the OTP step.
LABELLED_CREDENTIAL = labelled(r"pass(?:word|wd)|secret|token|credentials?|api[ _-]?key|private[ _-]?key")
LABEL = re.compile(r"\b(?:" + SECRET_WORDS + r")\b", re.I)
IMAGES = (".png", ".jpg", ".jpeg", ".gif", ".bmp")
RUN_NAME = {"ui": "UI functional test", "ft": "API functional test"}
SECTIONS = ["Document control", "Executive summary", "ABDM details", "Results summary",
            "Scope and limitations", "Flow details", "Test environment and tools", "Test team",
            "Approach and methodology", "Test data", "Evidence", "Failures and iterations log",
            "Conclusion and sign-off", "Annexures"]
# The fixed fields of each case's evidence table, in order.
CASE_FIELDS = ["Test case ID", "Title", "Marking", "Expected result", "Observed", "Status",
               "Iterations", "Failure reason", "Request IDs"]
# A REQUEST-ID is a UUID. Only a UUID is printed as it is; anything else is masked.
UUID = re.compile(r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}")
# An error code or exception named in a response or remark.
ERROR = re.compile(r"\b(?:ABDM|MIS|HIS|HIU|HIP|CM|PHR|UHI)-\d{3,5}\b|\bHTTP [45]\d{2}\b|\b[A-Z]\w*(?:Exception|Error)\b")


def norm(text):
    return re.sub(r"\s+", " ", str(text if text is not None else "")).strip()


def mask(text):
    """A JWT to [token], a value after a secret's label to [redacted], ABHA numbers to
    XX-XXXX-XXXX-1234, any other 12 digit run to XXXX XXXX 1234, a mobile to XXXXXX1234."""
    text = JWT.sub("[token]", str(text))
    text = LABELLED.sub(lambda m: (m.group(1) or m.group(3)) + "[redacted]", text)
    text = re.sub(r"(?<!\d)\d{2}[ -]?\d{4}[ -]?\d{4}[ -]?(\d{4})(?!\d)", r"XX-XXXX-XXXX-\1", text)
    text = re.sub(r"(?<!\d)\d{4}[ -]?\d{4}[ -]?(\d{4})(?!\d)", r"XXXX XXXX \1", text)
    return re.sub(r"(?<!\d)[6-9]\d{4}[ -]?\d(\d{4})(?!\d)", r"XXXXXX\1", text)


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


def find(cols, words):
    """The first column, in sheet order, whose name holds one of the words."""
    for word in words:
        for name, col in sorted(cols.items(), key=lambda x: x[1]):
            if word in name.lower() and not name.endswith(" (run)"):
                return col
    return None


def marking_col(cols):
    return next((col for name, col in sorted(cols.items(), key=lambda x: x[1])
                 if "mandatory" in name.lower() and "optional" in name.lower()), None)


def value(ws, row, top, cols, names, original):
    """The run's value. Where NHA's own cell had text, the writer put the run's value
    in "<column> (run)", and only that column is read for the row, even when blank."""
    col = next((cols[n] for n in names if n in cols), None)
    if col is None:
        return ""
    cell = anchor(ws, row, col)
    run_col = cols.get(norm(ws.cell(top, col).value) + " (run)")
    if run_col:
        if original is None:
            sys.exit("the workbook has a (run) column but no .before-abdm-run copy beside it, so NHA's "
                     "text cannot be told from the run's: restore the copy the writer made")
        nha = original[ws.title][cell.coordinate].value if ws.title in original.sheetnames else None
        if norm(nha):
            return norm(anchor(ws, row, run_col).value)
    return norm(cell.value)


def classify(text, entity):
    """(kind, label, note, pair ids) for one marking and entity type."""
    t = norm(text)
    low = t.lower()
    if not t:
        return "mandatory", "Not marked, treated as mandatory", "no marking: treated as mandatory", None
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
        return "mandatory", "Unrecognised, treated as mandatory", "unrecognised marking: treated as mandatory", None
    rest = m.group(2)
    if not rest:
        return "mandatory", "Mandatory", None, None
    if rest.startswith("•"):
        # PHR's profile cases: "Mandatory" then a bullet list of the mandatory and optional fields.
        return "mandatory", "Mandatory", "lists mandatory and optional fields: the case is mandatory", None
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
    return "mandatory", "Unrecognised, treated as mandatory", "unrecognised marking: treated as mandatory", None


def iterations(text):
    try:
        return int(float(text))
    except (TypeError, ValueError):
        return 0


def group_applies(ws, top, cols):
    """Each case row's group Applicable To, carried down from the row that heads the group."""
    acol, icol = cols.get("Applicable To"), cols.get("Test Case ID")
    if not acol or not icol:
        return {}
    out, current = {}, ""
    for r in range(top + 1, ws.max_row + 1):
        applies = norm(anchor(ws, r, acol).value)
        if applies:
            current = applies
        if norm(ws.cell(r, icol).value):
            out[r] = current
    return out


def restricted_to(applies):
    """The one entity type a group is for, when it names only one: government or private."""
    low = applies.lower()
    gov, priv = "gov" in low, "priv" in low
    if "all" in low or "both" in low or gov == priv:
        return None
    return "government" if gov else "private"


def read_cases(path, run, entity):
    """Every case in sheet order, with its marking, the run's values and treatment."""
    wb = load(path)
    path = Path(path)
    # The copy the writer made before its first write: what NHA's own cells held.
    backup = path.with_name(path.stem + ".before-abdm-run" + path.suffix)
    original = load(backup) if backup.exists() else None
    out = []
    applies_by = {}
    for case, (ws, row) in index(wb).items():
        top, cols = header_row(ws)
        if ws.title not in applies_by:
            applies_by[ws.title] = group_applies(ws, top, cols)
        mcol = marking_col(cols)
        marking = norm(anchor(ws, row, mcol).value) if mcol else ""
        tcol = find(cols, TITLE)
        title = norm(anchor(ws, row, tcol).value) if tcol else ""
        ecol = find(cols, ["expected result"])
        fcol = cols.get("Function")
        kind, label, note, pair = classify(marking, entity)
        rec = {"id": case, "sheet": ws.title, "title": title or case, "marking": marking,
               "kind": kind, "label": label, "note": note, "pair": pair,
               "expected": norm(anchor(ws, row, ecol).value) if ecol else "",
               "function": (norm(anchor(ws, row, fcol).value) if fcol else "") or ws.title}
        rec["applies"] = applies_by[ws.title].get(row, "")
        for key, names in COLUMNS[run].items():
            rec[key] = value(ws, row, top, cols, names, original)
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
    # A group the sheet marks for one entity type only, such as M1's demographic authentication
    # for Government, is not for the other one, whatever its cases' own markings say.
    for rec in out:
        only = restricted_to(rec["applies"])
        if only and only != entity:
            rec.update(kind="optional", pair=None, label="Not for a " + entity + " entity",
                       note="the group applies to " + rec["applies"] + " only: not for a " + entity + " entity")
    groups = {k: v for k, v in groups.items() if any(by_id[i]["kind"] == "pair" for i in v if i in by_id)}
    return out, list(groups.values())


def gate(recs, groups, agreed):
    """Mandatory cases not PASS. NA passes only on a case NHA agreed not to run."""
    blocking = []
    by_id = {r["id"]: r for r in recs}

    def through(r):
        return r["status"] == "PASS" or (r["status"] == "NA" and r["id"] in agreed)

    for r in recs:
        if r["kind"] == "mandatory" and not through(r):
            blocking.append(r["id"] + ": " + (r["status"] or "blank"))
    for ids in groups:
        present = [by_id[i] for i in ids if i in by_id]
        if present and not any(through(r) for r in present):
            blocking.append(" or ".join(r["id"] for r in present) + ": " +
                            ", ".join(r["status"] or "blank" for r in present))
    return blocking


def agreed_cases(meta):
    """meta.json's agreed_not_run: case id to who at NHA agreed it is not run, and when."""
    agreed = meta.get("agreed_not_run") or {}
    if not isinstance(agreed, dict) or not all(isinstance(v, str) and v.strip() for v in agreed.values()):
        sys.exit('agreed_not_run must map each case id to who at NHA agreed and when, such as '
                 '{"CRT_ABHA_101": "<NAME>, NHA, email of 2026-10-21"}')
    return {norm(k).replace(" ", ""): norm(v) for k, v in agreed.items()}


def run_check(path, run, entity, agreed):
    recs, groups = read_cases(path, run, entity)
    if not recs:
        sys.exit("no Test Case ID column with ids in " + Path(path).name + ": nothing to report on")
    for r in recs:
        if r["note"]:
            print("marking " + r["id"] + ' "' + r["marking"] + '": ' + r["note"])
        r["agreed"] = agreed.get(r["id"]) if r["status"] == "NA" and r["kind"] in ("mandatory", "pair") else None
        if r["agreed"]:
            print("agreed not run " + r["id"] + ": " + mask(r["agreed"]))
    blocking = gate(recs, groups, agreed)
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
    elif isinstance(meta, str):
        # A value holding a token, or a credential's label with its value, such as "client secret: x".
        if JWT.search(meta) or LABELLED_CREDENTIAL.search(meta) or (
                re.search(r"\bclient[ _-]?secret\b", meta, re.I)):
            found.append(where + " (its value)")
    return found


def request_ids(path):
    """The run's manifest: case id to its REQUEST-IDs. Takes {"<id>": [..]}, {"<id>": "<rid>"},
    {"<id>": {"request_ids": [..]}}, the same under "cases", or a list of {"id": .., "request_ids": [..]}."""
    if not path:
        return None
    data = json.loads(Path(path).read_text())
    bad = forbidden(data, "manifest")
    if bad:
        sys.exit("the manifest carries a credential, which never goes in a report: " + ", ".join(bad))
    if isinstance(data, dict) and isinstance(data.get("cases"), (dict, list)):
        data = data["cases"]
    if isinstance(data, list):
        data = {str(x.get("id") or x.get("case") or ""): x for x in data if isinstance(x, dict)}
    out = {}
    for case, ids in (data.items() if isinstance(data, dict) else []):
        if isinstance(ids, dict):
            ids = ids.get("request_ids") or ids.get("requestIds") or ids.get("request_id") or []
        if isinstance(ids, str):
            ids = [ids]
        out[norm(case).replace(" ", "")] = [norm(i) for i in ids if norm(i)]
    return out


def days(start, end):
    try:
        return (date.fromisoformat(end) - date.fromisoformat(start)).days + 1
    except (TypeError, ValueError):
        return ""




def codes(*texts):
    """The error codes and exceptions named in a response or remark."""
    found = []
    for text in texts:
        for c in ERROR.findall(text or ""):
            if c not in found:
                found.append(c)
    return ", ".join(found)


def shown(row, header=False):
    """A table row as text. A value beside a label naming a secret, such as "OTP used", is never shown."""
    secret = len(row) == 2 and not header and LABEL.search(str(row[0] or ""))
    return ["[redacted]" if secret and c == 1 and text else str(text if text is not None else "")
            for c, text in enumerate(row)]


def content(path, run, meta, evidence, recs, groups, manifest=None, draft=None):
    """What the report says, as a list of blocks. The DOCX and the PDF draw the same blocks."""
    dm = meta.get("document", {})
    dates = meta.get("test_dates", {})
    milestone = meta.get("milestone", "")
    entity = meta["entity_type"]
    label = RUN_NAME[run]
    title = milestone + " " + label + " report"
    if draft:
        # A draft carries the mark on every page, so it is never mistaken for the report to submit.
        title = "Draft " + title
    rids = request_ids(manifest)
    safe = set()  # text printed unmasked: a list of REQUEST-IDs that are all UUIDs
    blocks = []

    def add(*block):
        blocks.append(block)

    def table(rows, header=None):
        add("table", rows, header)

    n = len(recs)
    passed = sum(1 for r in recs if r["status"] == "PASS")
    failed = sum(1 for r in recs if r["status"] == "FAIL")
    na = sum(1 for r in recs if r["status"] == "NA")
    blank = n - passed - failed - na
    mandatory = sum(1 for r in recs if r["kind"] == "mandatory") + len(groups)
    retried = [r for r in recs if r["iterations"] > 1]
    log = [r for r in recs if r["iterations"] > 1 or r["status"] != "PASS"]
    agreed = [r for r in recs if r.get("agreed")]
    findings = meta.get("findings", {})
    if agreed:
        held = (" All " + str(mandatory) + " mandatory cases that apply to a " + entity + " entity are PASS, except " +
                str(len(agreed)) + " NA that NHA agreed not to run, listed in the results summary.")
    else:
        held = " All " + str(mandatory) + " mandatory cases that apply to a " + entity + " entity are PASS."
    if draft:
        held = (" This is a draft, not the report to submit: " + str(len(draft)) + " of the " + str(mandatory) +
                " mandatory cases that apply to a " + entity + " entity are not yet PASS, listed below.")

    def reason(r):
        """Why a case failed, or what an earlier pass hit: the remark, else the response, with its codes."""
        if r.get("agreed"):
            return "Agreed not run: " + r["agreed"]
        if r["status"] == "PASS" and r["iterations"] <= 1:
            return "None"
        text = r["remarks"] or r["response"] or "Not recorded"
        if r["status"] == "PASS":
            text = "Passed on pass " + str(r["iterations"]) + ". Earlier passes: " + text
        return text

    def rid_text(r):
        if rids is None:
            return "No manifest given"
        ids = rids.get(r["id"], [])
        if not ids:
            return "None in the manifest"
        text = ", ".join(ids)
        if all(UUID.fullmatch(i) for i in ids):
            safe.add(text)
        return text

    # 1. Document control
    add("h1", SECTIONS[0])
    table([["Document title", title], ["Document id", dm.get("id", "FT-" + milestone)],
           ["Version", dm.get("version", "")], ["Prepared by", dm.get("prepared_by", "")],
           ["Reviewed by", dm.get("reviewed_by", "")], ["Approved by", dm.get("approved_by", "")],
           ["Released by", dm.get("released_by", "")], ["Release date", dm.get("release_date", "")]])
    add("h2", "Change history")
    history = dm.get("change_history", [])
    table([[h.get("version", ""), h.get("date", ""), h.get("by", ""), h.get("change", "")] for h in history]
          or [["", "", "", ""]], header=["Version", "Date", "By", "Change"])
    add("h2", "Distribution")
    dist = dm.get("distribution", [])
    table([[d.get("name", ""), d.get("organisation", ""), d.get("role", "")] if isinstance(d, dict)
           else [str(d), "", ""] for d in dist] or [["", "", ""]], header=["Name", "Organisation", "Role"])

    # 2. Executive summary
    add("h1", SECTIONS[1])
    add("lead",
        "This report records the " + label + " run of " + meta.get("product", "") + " by " +
        meta.get("organisation", "") + " against ABDM " + milestone + ", API version " +
        meta.get("api_version", "V3") + ", from " + dates.get("start", "") + " to " + dates.get("end", "") +
        ". The workbook " + Path(path).name + " holds " + str(n) + " cases. " + str(passed) + " are PASS, " +
        str(failed) + " FAIL, " + str(na) + " NA and " + str(blank) + " have no result." + held + " " +
        str(len(retried)) + " cases took more than one pass.")
    if draft:
        add("callout", ["Draft. The report to submit is built only when every mandatory case below is PASS."])
        add("h2", "Mandatory cases not yet passed")
        table([line.split(": ", 1) if ": " in line else [line, ""] for line in draft],
              header=["Test case ID", "Status"])

    # 3. ABDM details
    add("h1", SECTIONS[2])
    recordings = meta.get("recordings", [])
    table([["Entity name", meta.get("organisation", "")], ["Product name", meta.get("product", "")],
           ["Category", meta.get("category", "")], ["Role", meta.get("role", "")], ["Entity type", entity],
           ["Milestone", milestone], ["API version", meta.get("api_version", "V3")],
           ["Run type", run + ", " + label],
           ["Test execution dates", dates.get("start", "") + " to " + dates.get("end", "")],
           ["Number of days for testing", meta.get("test_days", days(dates.get("start"), dates.get("end")))],
           ["Most passes any case took", max([r["iterations"] for r in recs] or [0])],
           ["Test executed by", meta.get("executed_by", "")],
           ["Recordings", str(len(recordings)) + " listed in the annexures" if recordings else "None"]])

    # 4. Results summary: counts, then by function, then one row per case.
    add("h1", SECTIONS[3])
    add("stats", [["Cases in the workbook", n], ["PASS", passed], ["FAIL", failed], ["NA", na], ["No result", blank],
                  ["Mandatory for a " + entity + " entity", mandatory], ["Took more than one pass", len(retried)]])
    add("h2", "Results by function")
    functions = []
    for r in recs:
        if r["function"] not in functions:
            functions.append(r["function"])
    rows = []
    for fn in functions:
        these = [r for r in recs if r["function"] == fn]
        rows.append([fn, len(these), sum(1 for r in these if r["status"] == "PASS"),
                     sum(1 for r in these if r["status"] == "FAIL"), sum(1 for r in these if r["status"] == "NA"),
                     sum(1 for r in these if r["kind"] == "mandatory" and r["status"] != "PASS" and not r.get("agreed"))])
    table(rows, header=["Function", "Cases", "PASS", "FAIL", "NA", "Mandatory not PASS"])
    add("h2", "Results by case")
    table([[r["id"], r["title"], r["label"], (r["status"] or "Not recorded") + (" (agreed not run)" if r.get("agreed")
            else ""), r["iterations"] or ""] for r in recs],
          header=["Test case ID", "Title", "Marking", "Status", "Iterations"])
    if agreed:
        add("h2", "Mandatory cases NHA agreed not to run")
        add("note", ["NHA agreed that each case below does not apply. The gate lets a mandatory NA through only "
                     "when it is listed here with who agreed and when."])
        table([[r["id"], r["title"], r["agreed"]] for r in agreed], header=["Test case ID", "Title", "Agreed by and when"])

    # 5. Scope and limitations
    add("h1", SECTIONS[4])
    apps = meta.get("applications", [])
    table([[a.get("name", ""), a.get("url", "")] if isinstance(a, dict) else [str(a), ""] for a in apps]
          or [["", ""]], header=["Application", "URL"])
    add("gap")
    sheets = sorted(set(r["sheet"] for r in recs), key=[r["sheet"] for r in recs].index)
    table([["Role", meta.get("role", "")], ["Entity type", entity], ["Run type", run],
           ["Workbook", Path(path).name], ["Tabs", ", ".join(sheets)], ["Cases", n]])
    skipped = [r for r in recs if r["kind"] == "optional" and r["status"] != "PASS"]
    add("h2", "Optional cases not passed")
    if skipped:
        table([[r["id"], r["title"], r["status"] or "Not recorded"] for r in skipped],
              header=["Test case ID", "Title", "Status"])
    else:
        add("para", "Every optional case is PASS.")
    add("h2", "Limitations")
    add("callout", ["The results hold for the build and configuration tested from " + dates.get("start", "") +
                    " to " + dates.get("end", "") + ". A later change to the code or the configuration can change them."]
        + [str(x) for x in meta.get("limitations", [])])

    # 6. Flow details
    add("h1", SECTIONS[5])
    flows = meta.get("flows", [])
    if flows:
        table([[f.get("name", ""), ", ".join(f.get("abha_addresses", [])), ", ".join(f.get("hi_types", []))]
               for f in flows if isinstance(f, dict)],
              header=["Flow", "ABHA address used", "HI types created or tested"])
    else:
        add("para", "No linking or consent flow in this milestone.")

    # 7. Test environment and tools
    add("h1", SECTIONS[6])
    env = dict(meta.get("environment", {}))
    names = [("browser", "Browser"), ("browser_version", "Browser version"), ("playwright", "Playwright"),
             ("phr_app", "PHR app"), ("phr_app_version", "PHR app version"), ("emulator", "Emulator"),
             ("model", "Model that ran the agent")]
    rows = [[name, env.pop(key, "Not used")] for key, name in names]
    rows += [[key, val] for key, val in env.items()]
    table(rows, header=["Tool", "Version or value"])

    # 8. Test team
    add("h1", SECTIONS[7])
    team = meta.get("team", [])
    table([[m.get("name", ""), m.get("role", ""), m.get("qualifications", "")] for m in team if isinstance(m, dict)]
          or [[meta.get("executed_by", ""), "Tester", ""]], header=["Name", "Role", "Qualifications"])

    # 9. Approach and methodology
    add("h1", SECTIONS[8])
    add("bullets", [
        "An agent ran every case in the workbook's order, following the module's test skill, and wrote each "
        "result into the workbook as the case ended.",
        "Each case had at most three passes. Iterations is the number of passes a case took, whether it ended "
        "PASS or FAIL.",
        "Every OTP and every consent or approval came from a person at the moment the case needed it. Where "
        "a screen took a typed OTP, the agent entered the OTP the person gave it into that screen and never "
        "stored it.",
        "For a case that passes through the PHR app, the proof is one PHR app screenshot showing the consent "
        "granted or the record visible. The agent checked the application side.",
        ("Run type ui: the agent drove the application's screens with Playwright and kept a screenshot per step."
         if run == "ui" else
         "Run type ft: each case was judged on the calls to the ABDM sandbox and the callbacks received. The "
         "evidence for each case is the response with its code."),
        "Every call carried a fresh REQUEST-ID. Where a manifest is given, each case lists its REQUEST-IDs, which "
        "a reviewer can look up in the gateway's own record.",
    ])
    table([["PASS", "The case's expected result was observed."],
           ["FAIL", "The expected result was not observed in three passes. The failure reason says what was."],
           ["NA", "The case was not run: optional and not offered, or mandatory with NHA's agreement."],
           ["Not recorded", "The case has no result in the workbook."]], header=["Status", "Meaning"])

    # 10. Test data
    add("h1", SECTIONS[9])
    data = meta.get("test_data", [])
    if isinstance(data, dict):
        data = [{"item": k, "value": v} for k, v in data.items()]
    table([[d.get("item", ""), d.get("value", "")] for d in data] or [["", ""]], header=["Item", "Value"])

    # 11. Evidence: per case a fixed table, the response with its code, then captioned screenshots.
    add("h1", SECTIONS[10])
    figure = 0
    for r in recs:
        observed = findings.get(r["id"]) or r["remarks"] or "None recorded."
        err = codes(r["response"], r["remarks"]) if r["status"] != "PASS" or r["iterations"] > 1 else ""
        values = [r["id"], r["title"], r["label"], r["expected"] or "Not given in the workbook", observed,
                  (r["status"] or "Not recorded") + (" (agreed not run)" if r.get("agreed") else ""),
                  r["iterations"] or "", reason(r) + (("" if reason(r).endswith(".") else ".") + " Error code: " + err
                                                      + "." if err else ""), rid_text(r)]
        shots = []
        if run == "ui":
            folder = Path(evidence) / r["id"]
            files = sorted(f for f in folder.iterdir() if f.suffix.lower() in IMAGES) if folder.is_dir() else []
            for step, shot in enumerate(files, 1):
                figure += 1
                shots.append((shot, figure, step))
        add("case", r, values, r["response"], shots)

    # 12. Failures and iterations log
    add("h1", SECTIONS[11])
    if log:
        table([[r["id"], r["status"] or "Not recorded", r["iterations"] or "", reason(r),
                codes(r["response"], r["remarks"]) or "None found"] for r in log],
              header=["Test case ID", "Status", "Iterations", "Failure reason", "Error code"])
    else:
        add("para", "No case failed and no case took more than one pass.")

    # 13. Conclusion and sign-off
    add("h1", SECTIONS[12])
    add("lead",
        "In the " + run + " run of " + meta.get("product", "") + " for " + milestone + "," +
        held.replace(" All", " all", 1) + " Of " + str(n) + " cases, " +
        str(passed) + " are PASS, " + str(failed) + " FAIL, " + str(na) + " NA and " + str(blank) +
        " have no result.")
    table([["Prepared by", dm.get("prepared_by", ""), "", ""], ["Reviewed by", dm.get("reviewed_by", ""), "", ""],
           ["Approved by", dm.get("approved_by", ""), "", ""]], header=["Sign-off", "Name", "Date", "Signature"])

    # 14. Annexures
    add("h1", SECTIONS[13])
    table([[x.get("title", ""), x.get("link", "")] if isinstance(x, dict) else [str(x), ""] for x in recordings]
          or [["", ""]], header=["Recording", "Link"])
    add("gap")
    table([["Completed workbook", Path(path).name],
           ["REQUEST-ID manifest", Path(manifest).name if manifest else "Not given"],
           ["Evidence folder", (str(evidence) if run == "ui" else "Not used: the responses are the evidence")]],
          header=["Annexure", "File"])

    return {
        "title": title, "label": label, "run": run, "milestone": milestone, "entity": entity, "safe": safe,
        "draft": draft or [],
        "product": meta.get("product", ""), "organisation": meta.get("organisation", ""), "blocks": blocks,
        "cover": [["Product", meta.get("product", "")], ["Organisation", meta.get("organisation", "")],
                  ["Milestone", milestone], ["Report type", label + " (run type " + run + ")"],
                  ["Document id", dm.get("id", "FT-" + milestone)], ["Version", dm.get("version", "")],
                  ["Release date", dm.get("release_date", "")]],
        "facts": [["Document id", dm.get("id", "FT-" + milestone)], ["Version", dm.get("version", "")],
                  ["Release date", dm.get("release_date", "")], ["Run type", run + ", " + label],
                  ["Entity type", entity], ["Test dates", dates.get("start", "") + " to " + dates.get("end", "")],
                  ["Executed by", meta.get("executed_by", "")]],
        "confidential": ("Confidential. Aadhaar, ABHA and mobile numbers are masked, and the report "
                         "holds no credential, token or OTP."),
    }


def write_docx(m, out):
    """The editable copy, in Word's format: the same blocks, with Word's contents and page fields."""
    from docx import Document
    from docx.enum.text import WD_BREAK
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    from docx.shared import Pt
    from PIL import Image

    doc = Document()
    sec = doc.sections[0]
    width = sec.page_width - sec.left_margin - sec.right_margin
    height = sec.page_height - sec.top_margin - sec.bottom_margin

    def field(paragraph, code, placeholder=""):
        """A Word field, such as PAGE or a TOC, that Word fills in when the document opens."""
        def char(kind):
            r = paragraph.add_run()
            el = OxmlElement("w:fldChar")
            el.set(qn("w:fldCharType"), kind)
            r._r.append(el)
        char("begin")
        r = paragraph.add_run()
        instr = OxmlElement("w:instrText")
        instr.set(qn("xml:space"), "preserve")
        instr.text = " " + code + " "
        r._r.append(instr)
        char("separate")
        paragraph.add_run(placeholder)
        char("end")

    def table(rows, header=None):
        t = doc.add_table(rows=0, cols=len(header or rows[0]))
        t.style = "Table Grid"
        for n, row in enumerate(([header] if header else []) + rows):
            cells = t.add_row().cells
            for c, (cell, text) in enumerate(zip(cells, shown(row, header and n == 0))):
                cell.text = text
                if (header and n == 0) or (len(row) == 2 and c == 0 and not header):
                    for p in cell.paragraphs:
                        for r in p.runs:
                            r.bold = True
            if header and n == 0:
                # The header row repeats on every page the table runs to.
                tr = t.rows[0]._tr.get_or_add_trPr()
                el = OxmlElement("w:tblHeader")
                el.set(qn("w:val"), "true")
                tr.append(el)
        return t

    def page_break():
        doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

    # Page header and footer on every page: the report title; Confidential and page N of M.
    sec.header.paragraphs[0].text = m["title"]
    foot = sec.footer.paragraphs[0]
    foot.add_run("Confidential, page ")
    field(foot, "PAGE", "1")
    foot.add_run(" of ")
    field(foot, "NUMPAGES", "1")

    # Cover
    doc.add_heading(m["title"], level=0)
    table(m["cover"])
    doc.add_paragraph(m["confidential"])
    page_break()

    # Contents: a Word TOC field over the headings below.
    p = doc.add_paragraph()
    p.add_run("Contents").bold = True
    field(doc.add_paragraph(), 'TOC \\o "1-2" \\h \\z \\u',
          "Open in Word and update fields to build the contents.")
    settings = doc.settings.element
    upd = OxmlElement("w:updateFields")
    upd.set(qn("w:val"), "true")
    settings.append(upd)
    page_break()

    for block in m["blocks"]:
        kind = block[0]
        if kind == "h1":
            doc.add_heading(block[1], level=1)
        elif kind == "h2":
            doc.add_heading(block[1], level=2)
        elif kind == "table":
            table(block[1], header=block[2])
        elif kind == "stats":
            table(block[1], header=["Measure", "Count"])
        elif kind in ("para", "lead"):
            doc.add_paragraph(block[1])
        elif kind in ("bullets", "callout"):
            for line in block[1]:
                doc.add_paragraph(line, style="List Bullet")
        elif kind == "gap":
            doc.add_paragraph("")
        elif kind == "case":
            r, values, response, shots = block[1:]
            doc.add_heading(r["id"] + ": " + r["title"], level=2)
            table([[k, v] for k, v in zip(CASE_FIELDS, values)], header=["Field", "Value"])
            if response:
                p = doc.add_paragraph()
                p.add_run("Response with code: ").bold = True
                code = p.add_run(response)
                code.font.name = "Courier New"
                code.font.size = Pt(9)
            for shot, figure, step in shots:
                with Image.open(shot) as im:
                    w, h = im.size
                # Page width, unless that makes a tall phone screenshot overrun the page.
                if h * width > 0.75 * height * w:
                    doc.add_picture(str(shot), height=int(0.75 * height))
                else:
                    doc.add_picture(str(shot), width=width)
                doc.add_paragraph("Figure " + str(figure) + ": " + r["id"] + ", step " + str(step) +
                                  " (" + shot.name + ")", style="Caption")
        # "note" blocks are the PDF's callouts; the DOCX carries the same facts in its tables.

    # Mask every run of text the document holds, tables, header and footer included.
    def paragraphs(container):
        for p in container.paragraphs:
            yield p
        for t in container.tables:
            for row in t.rows:
                for cell in row.cells:
                    for p in paragraphs(cell):
                        yield p
    for part in (doc, sec.header, sec.footer):
        for p in paragraphs(part):
            for r in p.runs:
                if r.text and r.text not in m["safe"]:
                    masked = mask(r.text)
                    if masked != r.text:
                        r.text = masked
    doc.save(str(out))
    print("wrote " + str(out))


# The ABDM Sandbox design system: colours, and the fonts it names with their PDF fallbacks.
INK = {"navy": "#112044", "deep": "#0B1630", "blue": "#264488", "ink": "#1C2333", "ink2": "#3A4460",
       "ink3": "#4A5368", "ink4": "#6A738A", "orange": "#E8791F", "otext": "#B4530F", "peach": "#FBF1E7",
       "mist": "#F4F6FA", "line": "#DDE2EE", "dark": "#1C2333", "ice": "#C9D4EE", "off": "#FFFDF8"}
FONTS = {"serif": (["newsreader-light.ttf", "newsreader_18pt-light.ttf", "newsreader-regular.ttf", "newsreader.ttf"],
                   "Times-Roman", "Newsreader"),
         "sans": (["publicsans-regular.ttf", "publicsans.ttf"], "Helvetica", "Public Sans"),
         "mono": (["jetbrainsmono-regular.ttf", "jetbrainsmono.ttf"], "Courier", "JetBrains Mono")}
MILESTONES = {"M1": "M1 Identity", "M2": "M2 Health Information Provider", "M3": "M3 Health Information User",
              "M4": "M4 Registry Integration"}
# Column widths, as shares of the text width, for the tables the report holds.
WIDTHS = {
    ("Version", "Date", "By", "Change"): [.12, .18, .25, .45],
    ("Name", "Organisation", "Role"): [.34, .36, .30],
    ("Function", "Cases", "PASS", "FAIL", "NA", "Mandatory not PASS"): [.38, .11, .11, .11, .11, .18],
    ("Test case ID", "Title", "Marking", "Status", "Iterations"): [.24, .36, .17, .10, .13],
    ("Test case ID", "Title", "Agreed by and when"): [.25, .37, .38],
    ("Test case ID", "Title", "Status"): [.25, .60, .15],
    ("Test case ID", "Status", "Iterations", "Failure reason", "Error code"): [.22, .09, .13, .38, .18],
    ("Flow", "ABHA address used", "HI types created or tested"): [.30, .35, .35],
    ("Name", "Role", "Qualifications"): [.34, .26, .40],
    ("Status", "Meaning"): [.20, .80],
    ("Sign-off", "Name", "Date", "Signature"): [.18, .34, .18, .30],
}


def find_fonts(extra=None):
    """Register Newsreader, Public Sans and JetBrains Mono where found, else Times-Roman, Helvetica and Courier."""
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    dirs = ([Path(extra)] if extra else []) + [
        Path("abdm-ft/fonts"), Path(__file__).resolve().parent / "fonts", Path.home() / "Library" / "Fonts",
        Path("/Library/Fonts"), Path("/usr/share/fonts")]
    chosen, notes = {}, []
    for role, (names, fallback, family) in FONTS.items():
        for d in dirs:
            if role in chosen or not d.is_dir():
                continue
            files = {}
            for f in d.rglob("*.ttf"):
                files.setdefault(f.name.lower(), f)
            for name in names:
                if name in files and role not in chosen:
                    try:
                        pdfmetrics.registerFont(TTFont("abdm-" + role, str(files[name])))
                        chosen[role] = "abdm-" + role
                        notes.append(family + " from " + str(files[name]))
                    except Exception:
                        pass
        if role not in chosen:
            chosen[role] = fallback
            notes.append(family + " not found, " + fallback + " in its place")
    print("fonts: " + "; ".join(notes))
    return chosen


def write_pdf(m, out, fonts_dir=None):
    """The report to submit, drawn in the ABDM Sandbox design system with ReportLab."""
    from io import BytesIO
    from xml.sax.saxutils import escape
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_RIGHT
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.units import mm
    from reportlab.pdfbase.pdfmetrics import stringWidth
    from reportlab.platypus import (BaseDocTemplate, CondPageBreak, Flowable, Frame, Image as Picture,
                                    KeepTogether, NextPageTemplate, PageBreak, PageTemplate, Paragraph, Spacer, Table,
                                    TableStyle)
    from PIL import Image

    F = find_fonts(fonts_dir)
    C = {k: colors.HexColor(v) for k, v in INK.items()}
    W, H = A4
    M = 20 * mm
    TW = W - 2 * M
    safe = m["safe"]

    def clean(text):
        """Every string drawn goes through the DOCX's mask, a list of UUID REQUEST-IDs excepted."""
        text = str(text if text is not None else "")
        return text if text in safe else mask(text)

    def style(name, font, size, lead, color, **kw):
        return ParagraphStyle(name, fontName=F[font], fontSize=size, leading=lead, textColor=C[color], **kw)

    S = {
        "body": style("body", "sans", 9.5, 14.5, "ink3", spaceAfter=6),
        "lead": style("lead", "sans", 11, 17, "ink2", spaceAfter=8),
        "cell": style("cell", "sans", 8.8, 12.6, "ink3"),
        "strong": style("strong", "sans", 8.8, 12.6, "ink"),
        "id": style("id", "mono", 7.8, 11.5, "ink"),
        "code": style("code", "mono", 7.6, 11, "ink2"),
        "h1": style("h1", "serif", 27, 32, "navy", spaceAfter=14),
        "h2": style("h2", "serif", 17, 21, "navy", spaceBefore=16, spaceAfter=8),
        "case": style("case", "serif", 15, 19, "navy", spaceAfter=8),
        "note": style("note", "sans", 9.5, 14.5, "ink2"),
        "chev": style("chev", "serif", 13, 14.5, "orange"),
        "page": style("page", "mono", 8, 12, "ink4", alignment=TA_RIGHT),
        "toc": style("toc", "sans", 10.5, 14, "ink"),
        "tocid": style("tocid", "mono", 7.2, 10, "ink3"),
        "tocpage": style("tocpage", "mono", 7.2, 10, "ink4", alignment=TA_RIGHT),
        "digit": style("digit", "mono", 24, 28, "off"),
        "cover": style("cover", "serif", 38, 43, "off"),
        "coversub": style("coversub", "sans", 11.5, 16, "ice"),
        "fact": style("fact", "sans", 10, 13.5, "ink"),
    }

    def para(text, s="body"):
        return Paragraph(escape(clean(text)), S[s])

    class Tracked(Flowable):
        """Mono uppercase with wide tracking, which a Paragraph cannot draw: wraps on spaces."""

        def __init__(self, text, size=7.2, color="otext", space=None, upper=True, after=0):
            Flowable.__init__(self)
            text = clean(text)
            self.text = text.upper() if upper else text
            self.size, self.color, self.after = size, color, after
            self.space = size * 0.12 if space is None else space
            self.lead = size * 1.45

        def measure(self, s):
            return stringWidth(s, F["mono"], self.size) + self.space * max(len(s) - 1, 0)

        def wrap(self, aw, ah):
            lines, cur = [], ""
            for word in self.text.split(" "):
                trial = cur + " " + word if cur else word
                if cur and self.measure(trial) > aw:
                    lines.append(cur)
                    cur = word
                else:
                    cur = trial
            lines.append(cur)
            widest = max(self.measure(x) for x in lines)
            if widest > aw:
                # One word wider than its cell, such as ITERATIONS: tighten the tracking, then the size.
                self.space = 0
                widest = max(self.measure(x) for x in lines)
                if widest > aw:
                    self.size *= aw / widest
                    widest = aw
            self.lines = lines
            self.width = min(aw, widest)
            self.height = len(lines) * self.lead + self.after
            return self.width, self.height

        def draw(self):
            c = self.canv
            c.setFont(F["mono"], self.size)
            c.setFillColor(C[self.color])
            for i, line in enumerate(self.lines):
                # The first baseline sits where a 9pt Paragraph's would, so labels line up with cell text.
                c.drawString(0, self.height - self.after - i * self.lead - self.size * 1.2, line, charSpace=self.space)

    class Rule(Flowable):
        """A rule across the text width. At the top of a page it drops the space above it, and a
        hairline between cases drops altogether, so it never doubles the header's rule."""

        def __init__(self, color="dark", width=1, before=0, after=10, top=True):
            Flowable.__init__(self)
            self.color, self.weight, self.before, self.after, self.top = color, width, before, after, top

        def wrap(self, aw, ah):
            self.width = aw
            self.skip = ah >= H - 2 * M - 1 and not self.top
            at_top = ah >= H - 2 * M - 1
            self.height = 0 if self.skip else (0 if at_top else self.before) + self.after + self.weight
            return aw, self.height

        def draw(self):
            if self.skip:
                return
            self.canv.setStrokeColor(C[self.color])
            self.canv.setLineWidth(self.weight)
            y = self.after + self.weight / 2.0
            self.canv.line(0, y, self.width, y)

    class Mark(Flowable):
        """A zero size marker whose page the contents list records."""

        def __init__(self, key):
            Flowable.__init__(self)
            self.toc_key = key

        def wrap(self, aw, ah):
            return 0, 0

        def draw(self):
            pass

    def status(text):
        word = clean(text).split(" ")[0].upper()
        color = "blue" if word == "PASS" else "otext" if word == "FAIL" else "ink4"
        return Tracked(text or "Not recorded", size=7.2, color=color, space=0.6)

    def grid(rows, header=None, pad=6.5):
        """Hairline rules only, a mist header row of mono labels that repeats, Paragraphs that wrap."""
        cols = len(header or rows[0])
        shares = WIDTHS.get(tuple(header or ())) or ([.34, .66] if cols == 2 else [1.0 / cols] * cols)
        body = []
        for row in rows:
            texts = shown(row)
            cells = []
            for c, text in enumerate(texts):
                name = header[c] if header else ("Label" if c == 0 else texts[0])
                if not header and c == 0:
                    cells.append(Tracked(text, size=6.8, color="ink4", space=0.7))
                elif name == "Status":
                    cells.append(status(text))
                elif name == "Test case ID":
                    cells.append(para(text, "id"))
                elif not header:
                    cells.append(para(text, "strong"))
                else:
                    cells.append(para(text, "cell"))
            body.append(cells)
        data = ([[Tracked(h, size=6.6, color="ink3", space=0.7) for h in header]] if header else []) + body
        t = Table(data, colWidths=[TW * s for s in shares], repeatRows=1 if header else 0, hAlign="LEFT",
                  rowHeights=None)
        cmds = [("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7), ("TOPPADDING", (0, 0), (-1, -1), pad),
                ("BOTTOMPADDING", (0, 0), (-1, -1), pad),
                ("LINEBELOW", (0, 0), (-1, -1), 0.6, C["line"]), ("LINEABOVE", (0, 0), (-1, 0), 0.6, C["line"])]
        if header:
            cmds += [("BACKGROUND", (0, 0), (-1, 0), C["mist"]), ("TOPPADDING", (0, 0), (-1, 0), 7),
                     ("BOTTOMPADDING", (0, 0), (-1, 0), 5.5)]
            if header[0] == "Sign-off":
                cmds += [("TOPPADDING", (0, 1), (-1, -1), 14), ("BOTTOMPADDING", (0, 1), (-1, -1), 14)]
        t.setStyle(TableStyle(cmds))
        return t

    def callout(lines, s="note"):
        rows = [[Paragraph("›", S["chev"]), para(line, s)] for line in lines]
        t = Table(rows, colWidths=[28, TW - 28], hAlign="LEFT")
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), C["peach"]), ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (0, -1), 13), ("LEFTPADDING", (1, 0), (1, -1), 2),
            ("RIGHTPADDING", (0, 0), (0, -1), 0), ("RIGHTPADDING", (1, 0), (1, -1), 16), ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5), ("TOPPADDING", (0, 0), (-1, 0), 12),
            ("BOTTOMPADDING", (0, -1), (-1, -1), 12)]))
        return t

    def bullets(lines):
        rows = [[Paragraph("›", S["chev"]), para(line, "note")] for line in lines]
        t = Table(rows, colWidths=[16, TW - 16], hAlign="LEFT")
        t.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7), ("LINEBELOW", (0, 0), (-1, -2), 0.6, C["line"])]))
        return [t, Spacer(1, 12)]

    def tiles(rows):
        """The counts as navy-deep tiles: off-white mono digits over an ice mono label."""
        short = {"Cases in the workbook": "Cases", "Took more than one pass": "More than one pass"}
        gap = 6

        def tile(label, count, width):
            t = Table([[Paragraph(escape(clean(count)), S["digit"])],
                       [Tracked(short.get(label, label), size=6.4, color="ice", space=0.7)]],
                      colWidths=[width], rowHeights=[34, 26])
            t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), C["deep"]), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                                   ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                                   ("TOPPADDING", (0, 0), (-1, 0), 10), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                                   ("TOPPADDING", (0, 1), (-1, 1), 4)]))
            return t

        out = []
        for chunk in (rows[:4], rows[4:]):
            width = (TW - gap * (len(chunk) - 1)) / len(chunk)
            cells, widths = [], []
            for i, (label, count) in enumerate(chunk):
                if i:
                    cells.append("")
                    widths.append(gap)
                cells.append(tile(label, count, width))
                widths.append(width)
            row = Table([cells], colWidths=widths, hAlign="LEFT")
            row.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                                     ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
            out += [row, Spacer(1, gap)]
        return out

    class Shot(Flowable):
        """A screenshot at the text width and at most 60 percent of the page height, in a hairline frame,
        with its caption. It shrinks to as little as 60 percent of that to finish a page rather than leave a gap."""

        def __init__(self, shot, figure, step, case):
            Flowable.__init__(self)
            with Image.open(shot) as im:
                w, h = im.size
            self.shot, self.ratio = shot, h / float(w)
            self.full = min(TW, 0.6 * H / self.ratio)
            self.caption = Tracked("FIGURE " + str(figure) + " \u00b7 " + case + ", STEP " + str(step) + " \u00b7 " +
                                   shot.name, size=6.8, color="ink4", space=0.5, upper=False)

        def wrap(self, aw, ah):
            _, ch = self.caption.wrap(aw, ah)
            self.ch = ch
            extra = 16 + 7 + ch + 6
            w = min(self.full, aw)
            if w * self.ratio + extra > ah and (ah - extra) / self.ratio >= 0.6 * w:
                w = (ah - extra) / self.ratio
            self.w = w
            self.width, self.height = aw, w * self.ratio + extra
            return self.width, self.height

        def draw(self):
            c = self.canv
            h = self.w * self.ratio
            y = self.ch + 6 + 7
            c.drawImage(str(self.shot), 0, y, width=self.w, height=h)
            c.setStrokeColor(C["line"])
            c.setLineWidth(0.6)
            c.rect(0, y, self.w, h, stroke=1, fill=0)
            self.caption.drawOn(c, 0, 6)

    def tall(shot):
        with Image.open(shot) as im:
            return im.size[1] > 1.2 * im.size[0]

    def opener(number, name):
        return [CondPageBreak(170), Rule("dark", 1, before=14, after=12), Mark("s" + str(number)),
                Tracked("%02d · %s" % (number, name), size=7.5, color="otext", space=1.0, after=8),
                Paragraph(escape(clean(name)), S["h1"])]

    def story(marks, total):
        out = [NextPageTemplate("inner"), PageBreak()]
        out += [Rule("dark", 1, after=12), Tracked("Contents", size=7.5, color="otext", space=1.0, after=8),
                Paragraph("Contents", S["h1"])]
        case_ids = [b[1]["id"] for b in m["blocks"] if b[0] == "case"]

        def sections(names, first):
            rows = [[Tracked("%02d" % (first + i), size=7.5, color="otext", space=0.6), para(name, "toc"),
                     para(str(marks.get("s" + str(first + i), 0)), "page")] for i, name in enumerate(names)]
            t = Table(rows, colWidths=[40, TW - 80, 40], hAlign="LEFT")
            t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                   ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 7),
                                   ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                                   ("LINEBELOW", (0, 0), (-1, -1), 0.6, C["line"])]))
            return t

        def ident(text, width):
            """A case id on as few lines as fit, broken after an underscore, never inside a number."""
            text, size, lines, cur = clean(text), S["tocid"].fontSize, [], ""
            for part in re.findall(r"[^_]+_?|_", text):
                if cur and stringWidth(cur + part, F["mono"], size) > width:
                    lines.append(cur)
                    cur = part
                else:
                    cur += part
            lines.append(cur)
            return Paragraph("<br/>".join(escape(x) for x in lines), S["tocid"])

        split = SECTIONS.index("Evidence") + 1
        out.append(sections(SECTIONS[:split], 1))
        if case_ids:
            col = (TW - 40) / 3.0
            per = -(-len(case_ids) // 3)
            rows = []
            for j in range(per):
                row = []
                for k in range(3):
                    n = k * per + j
                    if n < len(case_ids):
                        row += [ident(case_ids[n], col - 34), para(str(marks.get("c" + case_ids[n], 0)), "tocpage")]
                    else:
                        row += ["", ""]
                rows.append([""] + row)
            cases_t = Table(rows, colWidths=[40] + [col - 30, 30] * 3, hAlign="LEFT")
            cases_t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                         ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (2, 0), (2, -1), 14),
                                         ("RIGHTPADDING", (4, 0), (4, -1), 14),
                                         ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                                         ("TOPPADDING", (0, 0), (-1, 0), 9), ("BOTTOMPADDING", (0, -1), (-1, -1), 9),
                                         ("LINEBELOW", (0, -1), (-1, -1), 0.6, C["line"])]))
            out.append(cases_t)
        out.append(sections(SECTIONS[split:], split + 1))
        out.append(PageBreak())

        section = 0
        for block in m["blocks"]:
            kind = block[0]
            if kind == "h1":
                section += 1
                if block[1] in ("Results summary", "Evidence", "Failures and iterations log") and section > 1:
                    out.append(PageBreak())
                out += opener(section, block[1])
            elif kind == "h2":
                out += [CondPageBreak(110), Paragraph(escape(clean(block[1])), S["h2"])]
            elif kind == "table":
                out += [grid(block[1], block[2]), Spacer(1, 10)]
            elif kind == "stats":
                out += tiles(block[1])
            elif kind in ("para", "lead"):
                out.append(para(block[1], kind if kind == "lead" else "body"))
            elif kind == "bullets":
                out += bullets(block[1])
            elif kind in ("callout", "note"):
                out += [callout(block[1]), Spacer(1, 10)]
            elif kind == "gap":
                out.append(Spacer(1, 10))
            elif kind == "case":
                r, values, response, shots = block[1:]
                head = [CondPageBreak(200), Rule("line", 0.6, before=6, after=14, top=False), Mark("c" + r["id"]),
                        Tracked(r["id"], size=7.5, color="otext", space=0.9, after=5),
                        Paragraph(escape(clean(r["title"])), S["case"]),
                        grid([[k, v] for k, v in zip(CASE_FIELDS, values)], pad=4.6)]
                if response:
                    code = Table([[Tracked("Response with code", size=6.6, color="ink4", space=0.7, after=3)],
                                  [para(response, "code")]], colWidths=[TW], hAlign="LEFT")
                    code.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), C["mist"]),
                                              ("LEFTPADDING", (0, 0), (-1, -1), 9), ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                                              ("TOPPADDING", (0, 0), (-1, 0), 8), ("BOTTOMPADDING", (0, -1), (-1, -1), 8),
                                              ("TOPPADDING", (0, 1), (-1, 1), 0), ("BOTTOMPADDING", (0, 0), (-1, 0), 0)]))
                    head += [Spacer(1, 8), code]
                out.append(KeepTogether(head))
                k = 0
                while k < len(shots):
                    # Two phone screenshots in a row sit side by side.
                    pair = shots[k:k + 2]
                    if len(pair) == 2 and all(tall(x[0]) for x in pair):
                        a, b = [Shot(x[0], x[1], x[2], r["id"]) for x in pair]
                        t = Table([[a, "", b]], colWidths=[(TW - 16) / 2.0, 16, (TW - 16) / 2.0], hAlign="LEFT")
                        t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "BOTTOM"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                               ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0),
                                               ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
                        out.append(t)
                        k += 2
                    else:
                        out.append(Shot(*(shots[k] + (r["id"],))))
                        k += 1
                out.append(Spacer(1, 12))
        return out

    eyebrow = clean(m["title"]).upper()

    def tracked(c, x, y, text, size, color, space, right=False):
        text = clean(text)
        c.setFont(F["mono"], size)
        c.setFillColor(C[color])
        if right:
            x -= stringWidth(text, F["mono"], size) + space * (len(text) - 1)
        c.drawString(x, y, text, charSpace=space)

    def inner(c, d):
        c.saveState()
        tracked(c, M, H - 13 * mm, eyebrow, 6.8, "ink4", 0.8)
        c.setStrokeColor(C["line"])
        c.setLineWidth(0.6)
        c.line(M, H - 15.5 * mm, W - M, H - 15.5 * mm)
        c.line(M, 15 * mm, W - M, 15 * mm)
        tracked(c, M, 11 * mm, "CONFIDENTIAL", 6.8, "ink4", 0.8)
        tracked(c, W - M, 11 * mm, "PAGE " + str(d.page) + " OF " + str(d.total or d.page), 6.8, "ink4", 0.8,
                right=True)
        c.restoreState()

    def cover(c, d):
        import math
        c.saveState()
        top = H * 0.47
        c.setFillColor(C["navy"])
        c.rect(0, top, W, H - top, stroke=0, fill=1)
        # The Ashoka wheel, bleeding off the top right: 24 spokes and three rings, ice at 11 percent.
        p = c.beginPath()
        p.rect(0, top, W, H - top)
        c.clipPath(p, stroke=0, fill=0)
        cx, cy, R = W - 22 * mm, H - 18 * mm, 92 * mm
        c.setStrokeColor(C["ice"])
        c.setStrokeAlpha(0.11)
        c.setLineWidth(1.4)
        for radius in (R, R * 0.86, R * 0.16):
            c.circle(cx, cy, radius, stroke=1, fill=0)
        for k in range(24):
            a = 2 * math.pi * k / 24
            c.line(cx + R * 0.16 * math.cos(a), cy + R * 0.16 * math.sin(a),
                   cx + R * 0.86 * math.cos(a), cy + R * 0.86 * math.sin(a))
        c.restoreState()
        c.saveState()
        c.setFillColor(C["orange"])
        c.rect(M, H - 26 * mm, 18 * mm, 2, stroke=0, fill=1)
        tracked(c, M, H - 33 * mm, "ABDM SANDBOX · FUNCTIONAL TEST REPORT", 7.8, "orange", 1.4)
        if m.get("draft"):
            tracked(c, M, H - 39 * mm, "DRAFT · " + str(len(m["draft"])) + " MANDATORY CASES NOT YET PASS", 7.8, "ice", 1.4)
        tail = MILESTONES.get(m["milestone"].upper(), m["milestone"])
        lead = ("Draft " + m["label"]) if m.get("draft") else (m["label"][:1].upper() + m["label"][1:])
        head = (escape(clean(lead + " report, ")) +
                '<font color="' + INK["orange"] + '">' + escape(clean(tail)) + "</font>")
        title = Paragraph(head, S["cover"])
        _, th = title.wrap(TW * 0.86, H)
        sub = Paragraph(escape(clean(m["product"])) + " &#183; " + escape(clean(m["organisation"])), S["coversub"])
        _, sh = sub.wrap(TW * 0.86, H)
        sub.drawOn(c, M, top + 16 * mm)
        title.drawOn(c, M, top + 16 * mm + sh + 8 * mm)
        # Key facts as a ruled-box grid: four across, then three.
        cells = []
        for label, value in m["facts"]:
            cells.append([Tracked(label, size=6.6, color="ink4", space=0.7, after=4), para(value, "fact")])
        rows = [cells[:4], [cells[4], cells[6], cells[5], ""]]
        facts = Table(rows, colWidths=[TW / 4.0] * 4)
        facts.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.8, C["line"]), ("INNERGRID", (0, 0), (-1, -1), 0.8, C["line"]),
                                   ("SPAN", (2, 1), (3, 1)), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                                   ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                                   ("TOPPADDING", (0, 0), (-1, -1), 10), ("BOTTOMPADDING", (0, 0), (-1, -1), 12)]))
        _, fh = facts.wrap(TW, H)
        facts.drawOn(c, M, top - 14 * mm - fh)
        note = callout([m["confidential"]])
        _, nh = note.wrap(TW, H)
        note.drawOn(c, M, 22 * mm)
        c.restoreState()

    class Doc(BaseDocTemplate):
        def afterFlowable(self, f):
            key = getattr(f, "toc_key", None)
            if key and key not in self.marks:
                self.marks[key] = self.page

    marks, total, pdf = {}, 0, b""
    for attempt in range(4):
        buf = BytesIO()
        d = Doc(buf, pagesize=A4, leftMargin=M, rightMargin=M, topMargin=M, bottomMargin=M,
                title=clean(m["title"]), author=clean(m["organisation"]), subject="ABDM functional test report")
        d.marks, d.total = {}, total
        frame = Frame(M, M, TW, H - 2 * M, id="body", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        d.addPageTemplates([PageTemplate("cover", [frame], onPage=cover), PageTemplate("inner", [frame], onPage=inner)])
        d.build(story(marks, total))
        pdf = buf.getvalue()
        if d.marks == marks and d.page == total:
            break
        marks, total = d.marks, d.page
    Path(out).write_bytes(pdf)
    print("wrote " + str(out))


def build(path, run, meta, evidence, out, recs, groups, manifest=None, fmt="both", fonts_dir=None, draft=None):
    """Write the report: the PDF to submit and the DOCX to edit, beside each other."""
    m = content(path, run, meta, evidence, recs, groups, manifest, draft)
    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if fmt in ("docx", "both"):
        write_docx(m, out.with_suffix(".docx"))
    if fmt in ("pdf", "both"):
        write_pdf(m, out.with_suffix(".pdf"), fonts_dir)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("action", choices=["check", "build"])
    p.add_argument("workbook")
    p.add_argument("--run", choices=["ft", "ui"], required=True)
    p.add_argument("--entity", choices=["government", "private"])
    p.add_argument("--meta")
    p.add_argument("--evidence", default="abdm-ft/evidence")
    p.add_argument("--out")
    p.add_argument("--manifest")
    p.add_argument("--format", choices=["pdf", "docx", "both"], default="both")
    p.add_argument("--fonts")
    p.add_argument("--draft", action="store_true",
                   help="build even when mandatory cases are not PASS, marked Draft on every page")
    a = p.parse_args()
    meta = {}
    if a.action == "build" and not (a.meta and a.out):
        sys.exit("build needs --meta and --out")
    if a.meta:
        meta = json.loads(Path(a.meta).read_text())
        bad = forbidden(meta)
        if bad:
            sys.exit("meta.json carries a credential, a field named like one or a value holding one, "
                     "which never goes in a report: " + ", ".join(bad))
        meta["entity_type"] = a.entity or meta.get("entity_type")
    entity = a.entity or meta.get("entity_type")
    if entity not in ("government", "private"):
        sys.exit("--entity, or entity_type in meta.json, must be government or private")
    recs, groups, blocking = run_check(a.workbook, a.run, entity, agreed_cases(meta))
    if blocking and not (a.action == "build" and a.draft):
        if a.action == "build":
            print("no report: every mandatory case must be PASS first. --draft writes a draft marked as one",
                  file=sys.stderr)
        sys.exit(1)
    if a.action == "build":
        build(a.workbook, a.run, meta, a.evidence, a.out, recs, groups, a.manifest, a.format, a.fonts,
              blocking if blocking else None)


if __name__ == "__main__":
    main()
```

## What happens

1. When the last case is recorded and written into the workbook, run the gate for the run type and your entity type:

   ```bash
   python3 abdm-ft/abdm_report.py check <workbook> --run ui --entity private --meta abdm-ft/meta.json
   ```

   `--meta` is optional for `check`: it is read for `agreed_not_run`. The script prints one `marking` line for every case whose marking is entity specific, conditional, an either rule, a field list, blank or unrecognised, with how it was treated, and one `agreed not run <id>: <agreement>` line per mandatory `NA` case `agreed_not_run` lets through. Then one `not passed <id>: <status>` line per mandatory case in the way, an either pair as `<id> or <id>: <status>, <status>`, and a count.

2. If it exits `1`, the run is not finished, but the tester still gets a PDF of where it stands. Build the draft:

   ```bash
   python3 abdm-ft/abdm_report.py build <workbook> --run ui --meta abdm-ft/meta.json --evidence abdm-ft/evidence --manifest abdm-ft/m1-<YYYYMMDD-HHMM>.json --out abdm-ft/draft-report-m1.pdf --draft
   ```

   The draft is the same report, marked Draft on the cover and in the header of every page, with the mandatory cases not yet passed listed first in the executive summary. It is never the report to submit. Then rerun the cases `check` listed, as `open` in `shared.concept.test-workbook-write-back` does, and run `check` again. Every run ends with a PDF: the report when `check` exits `0`, the draft when it does not.

3. Only when `check` exits `0`, write the one line findings into `meta.json` under `findings`, keyed by case id. A case without one gets its Remarks value. Then build:

   ```bash
   python3 abdm-ft/abdm_report.py build <workbook> --run ui --meta abdm-ft/meta.json --evidence abdm-ft/evidence --manifest abdm-ft/m1-<YYYYMMDD-HHMM>.json --out abdm-ft/report-m1.pdf
   ```

   `entity_type` in `meta.json` is the entity type, unless `--entity` is given. `build` runs the gate again and refuses with the same list if it fails. `--manifest` is optional. It writes `abdm-ft/report-m1.pdf`, the report to submit, and `abdm-ft/report-m1.docx` beside it, the editable copy, whichever of the two suffixes `--out` names. `--format pdf` writes the PDF alone and `--format docx` the Word copy alone; the default is `both`. `--fonts <folder>` points it at the design system's fonts if they are somewhere else.

4. Submit the PDF as it is: its contents list and page numbers are already filled in. If you edit the Word copy instead, open it in Word or LibreOffice and accept the prompt to update fields, which fills in its contents and page count, then export it to PDF. A screenshot that needs a highlight box gets it before it goes in the evidence folder.

5. For an `ft` report, use `--run ft` in both commands. The evidence for each case is its `FT Response with Code` value, and `--evidence` is not read.

## How you know it worked

- `check` exits `0` and its last line reads `0 of <n> mandatory case(s) for a <entity> entity not PASS in the <run> run`.
- `build` prints a `fonts:` line naming each font it used or replaced, then `wrote abdm-ft/report-m1.docx` and `wrote abdm-ft/report-m1.pdf`, and exits `0`.
- The PDF opens on a navy cover with the milestone in orange, the key facts in a ruled grid and the confidentiality note. Page 2 is the contents, with every section and every case id and its page. Every later page reads the report title at the top left and `Confidential` and `Page N of M` at the bottom.
- Both files open with the cover and the contents, then the fourteen headings from Document control to Annexures, in order. Every page of the Word copy has the report title at the top and `Confidential, page N of M` at the bottom.
- The results summary has one row per case in the workbook, after the counts. Each case's evidence section starts with its nine row table, then its response, then its screenshots in name order, each captioned with its figure number, case id and step: `FIGURE <n> · <case id>, STEP <k> · <file>` in the PDF, `Figure <n>: <case id>, step <k> (<file>)` in the Word copy.
- With `--manifest`, each case's Request IDs row lists the REQUEST-IDs the manifest gives it, or reads `None in the manifest`.
- No 12 digit number appears anywhere in either file, the PDF's header and footer included: an Aadhaar number reads `XXXX XXXX 1234` and an ABHA number `XX-XXXX-XXXX-1234`, with the last four digits kept. A 10 digit mobile reads `XXXXXX1234`.
- No token or secret appears in it: a JWT reads `[token]`, and a value after a label naming a password, secret, token, OTP, credential, API key or private key reads `[redacted]`. This covers the workbook's Response and Remarks values and the findings, as well as `meta.json`.

## When it goes wrong

| Observed | Cause | Do |
|---|---|---|
| `ModuleNotFoundError: No module named 'docx'` or `'reportlab'` | python-docx or ReportLab is not installed | `pip install openpyxl pillow python-docx reportlab` |
| `ImportError: reportlab requires 3.10+` | A ReportLab release newer than your Python was installed, on Python 3.9 | `pip install "reportlab<5"`, or use Python 3.10 or later |
| `fonts: Public Sans not found, Helvetica in its place` | That font is not in any folder the script looks in | Nothing, the report is complete with the fallback. For the design system's own face, put its `.ttf` files in `abdm-ft/fonts/` and build again |
| `not passed CRT_ABHA_105: FAIL` | A mandatory case failed | Fix the cause the Remarks name, rerun the case, write it back, run `check` again |
| `not passed <id>: NA` | A mandatory case was recorded not run, and `agreed_not_run` does not list it | Run it, or agree with NHA that it does not apply, keep the reason in its remarks, and add it to `agreed_not_run` with who agreed and when. Pass `--meta` to `check` |
| `agreed_not_run must map each case id` | An entry has no agreement text | Write who at NHA agreed and when for every case listed |
| `not passed <id>: blank` | The case needs a tester step, or never ran | Finish it with the tester, then write it back |
| `marking <id> "...": unrecognised marking: treated as mandatory`, or `no marking` | NHA used a marking the script does not know, such as PHR's note on row P1 3.6, or left it blank | Ask NHA what it means for your entity type. Never edit NHA's marking to pass the gate |
| `meta.json carries a credential` | `meta.json` has a password, secret, token or credentials field, or a value holding a JWT or a credential's label with its value | Delete the field or the value. A report never carries a credential |
| `the workbook has a (run) column but no .before-abdm-run copy` | The writer's copy of NHA's workbook was moved or deleted | Put it back beside the workbook. Without it the script cannot tell NHA's text from the run's |
| `case id on more than one tab` | Two tabs carry the same id | Ask NHA which one counts |
| `no Test Case ID column with ids` | The workbook has no case ids, as NHA's PHR workbook does not, and no write has added them yet | Write the run's results with `shared.concept.test-workbook-write-back` first: its first write adds the `Test Case ID` column |
| `the manifest carries a credential` | The manifest JSON holds a token, secret or password field or value | Write the manifest as the test skill does, case ids to request ids and nothing else |
| The Word copy's contents page reads `Open in Word and update fields` | Its fields have not been updated since the script wrote them. The PDF is not affected | Open the file in Word or LibreOffice and update fields, then save |
| A screenshot is missing from the report | Its file is not under `<evidence>/<case id>/`, or its extension is not png, jpg, gif or bmp | Move it into the case's folder, named as `cases` prints the id, and build again |
