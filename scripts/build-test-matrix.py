#!/usr/bin/env python3
"""Build every module's test matrix from NHA's own certification sheets.

NHA publishes the certification test cases as spreadsheets, recorded under
catalogue/openapi/.raw/nha-2026-09-04. A developer preparing for certification
needs the id NHA will ask about, the marking NHA gave it, and the calls NHA
points the case at. Anything this portal invents in that position is worse than
nothing, because it looks like a certification requirement and is not one.

Five sheets, four modules:

    m1  ABHA-Creation-and-Verification-with-APIs-V1.1.xlsx   1 worksheet
    m2  M2-Building-HIP-with-APIs-Updated-Aug-22.xlsx        1 worksheet
    m3  M3-Building-HIU-APIs-Updated-Aug-22.xlsx             1 worksheet
    m4  HFR-M4-Mar-16-2024.xlsx                              4 worksheets
        HPR-Test-Cases-Final.xlsx                            1 worksheet

The sheets are inconsistent in ways worth knowing about, all handled below.

Ids appear in mixed case (Health_RECORD_CREATION), with a trailing space
(VRFY_ABHA ), with an internal space (SHARE _PATIENT_PROFILE), and five carry
no number at all (HIP_INIT_GRANT_CONSENT_).

The header row is not row 1. It sits at row 9 in the M1 sheet, row 10 in M2,
row 6 in M3 and row 1 in the HFR and HPR sheets, under a block of "Test
Executed By" administration. It is found by looking for the Test Case ID
column rather than by a row number.

The marking column is not a binary anywhere. It reads Mandatory or Optional in
the M1, M2 and M3 sheets, Mandatory or Non-Mandatory in the HPR sheet, and Yes
or No in the four HFR sheets, which is the same question asked about a field
rather than about a case. It also carries twelve distinct conditional forms,
from "Yes (if facilityId not present)" to "Either of the test cases
CRT_ABHA_114 or CRT_ABHA_115 is mandatory for Governement". Flattening those to
Optional is what published HFR-002, a field NHA requires whenever no facility
id is given, as a case an integrator may skip. They become Conditional and
carry NHA's own wording, unedited.

A cell is sometimes merged down a run of rows, which openpyxl reads as one
value followed by blanks. Two columns need that merge read back out.

The marking column. Inheritance is taken from the sheet's own merged ranges
rather than from the last value seen, because the two disagree: in the M3 sheet
"Any one of them is mandatory" is merged across HIU_FLOW_106 to 113 and nothing
else, while carrying the last value down would have applied it to every case
after 113 as well. Two cases across all five sheets carry no marking and sit in
no merge. Those are published as Unmarked, because NHA left them blank and
calling them Optional would be this portal deciding.

The API column, and this one decides how much of the sheet is usable. NHA
lists a use case's calls once, in a cell merged down every case in that use
case, so the calls belong to the whole run and not to the row they are printed
on. Reading only the printed row found the calls for 17 of M1's 66 cases, 4 of
M2's 36 and 1 of M3's 16, and left every other case looking as though NHA had
named no call for it. Reading the merge finds them for 66, 30 and 13. The HFR
and HPR sheets print a URL on each row instead and are unaffected.

Two sheets repeat themselves, and they repeat differently. The HFR bridge
linkage worksheet lists HFR-118 to HFR-123 twice, character for character:
those are one set of six cases printed twice, so the repeat is dropped. The M1
sheet gives VRFY_ABHA_501 to two different cases, biometric ABHA verification
and reading a profile from an ABHA QR code. That is a numbering mistake, not a
repeat, and both cases are real, so both are published and each says that NHA
uses the id twice. Dropping the second is what deleted the QR code case.

The M1 sheet also heads three separate runs of verification cases "ABHA
Verification" with nothing on the page to tell them apart. A repeated group
heading carries the range of ids underneath it, which is NHA's own data rather
than a title this portal invented.

Cases this portal added that are not in NHA's sheets are kept, in their own
group, each marked as not being an NHA test case.

Usage: python3 scripts/build-test-matrix.py [--check]
"""
import json
import re
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "catalogue" / "openapi" / ".raw" / "nha-2026-09-04"
OUT = ROOT / "site" / "src" / "data" / "test-matrix"

SHEETS = {
    "m1": {
        "module": "M1",
        "title": "ABHA identity, registration and login",
        "books": [{"file": "ABHA-Creation-and-Verification-with-APIs-V1.1.xlsx"}],
    },
    "m2": {
        "module": "M2",
        "title": "Care context linking and data sharing",
        "books": [{"file": "M2-Building-HIP-with-APIs-Updated-Aug-22.xlsx"}],
    },
    "m3": {
        "module": "M3",
        "title": "Consent management and health record fetch",
        "books": [{"file": "M3-Building-HIU-APIs-Updated-Aug-22.xlsx"}],
    },
    "m4": {
        "module": "M4",
        "title": "HPR and HFR registration",
        # Two books, and the HFR one carries a worksheet per stage of
        # onboarding. Each worksheet is its own group, prefixed so a reader
        # can tell a registration case from a bridge linkage case.
        "books": [
            {"file": "HFR-M4-Mar-16-2024.xlsx", "prefix": "HFR"},
            {"file": "HPR-Test-Cases-Final.xlsx", "prefix": "HPR"},
        ],
    },
}

PORTAL_GROUP_ID = "portal-additional-checks"
PORTAL_GROUP_LABEL = "Further checks this portal suggests"
PORTAL_PREFIX = "Not an NHA test case."

# The marking column, normalised. Anything not listed is conditional, and the
# cell's own wording is published beside the badge rather than thrown away.
PLAIN_MANDATORY = {"mandatory", "yes", "m", "mandtory"}
PLAIN_OPTIONAL = {"optional", "non-mandatory", "nonmandatory", "no", "o"}


def clean(value):
    if value is None:
        return ""
    text = str(value).replace("\r", " ")
    text = re.sub(r"\s*\n\s*", " ", text)
    return re.sub(r"\s{2,}", " ", text).strip()


def marking(text):
    """NHA's marking, as (type, condition).

    `condition` is NHA's own words, kept whenever the marking is not one of the
    plain forms, because "mandatory if you implement HIP initiated linking with
    direct auth" is an instruction and "Conditional" on its own is not.

    An empty cell returns (None, "") so the caller can tell a blank apart from
    a marking, and decide between a merge above it and Unmarked.
    """
    key = clean(text).lower().rstrip(".")
    if not key:
        return None, ""
    if key in PLAIN_MANDATORY:
        return "Mandatory", ""
    if key in PLAIN_OPTIONAL:
        return "Optional", ""
    return "Conditional", clean(text)


def columns(header):
    found = {}
    for index, name in enumerate(header):
        key = clean(name).lower()
        if not key:
            continue
        if "test case id" in key:
            found["id"] = index
        elif "functionality" in key:
            found["functionality"] = index
        elif key.startswith("feature"):
            found["feature"] = index
        elif key.startswith("function"):
            found["function"] = index
        elif "applicable" in key:
            found["applies"] = index
        elif "mandatory" in key:
            found["type"] = index
        elif key.startswith("test case"):
            found["case"] = index
        elif "steps" in key:
            found["steps"] = index
        elif "expected" in key:
            found["expected"] = index
        elif "actual name of data fields" in key:
            found["field"] = index
        # "V3 APIs", "v0.5 APIs" and the HFR/HPR sheets' plain "APIs". The v3
        # column wins where a sheet has both, because v0.5 is the retired API
        # and pointing a reader at it is worse than pointing at nothing.
        elif key == "v3 apis" or key == "v3 api":
            found["apis"] = index
        elif key == "apis" and "apis" not in found:
            found["apis"] = index
    return found


def extract(path, sheet_prefix=None):
    book = openpyxl.load_workbook(path, data_only=True)
    groups = []
    for sheet in book.worksheets:
        groups.extend(extract_sheet(sheet, sheet_prefix, len(book.worksheets) > 1))
    return groups


def merged_down(sheet, column_index):
    """Row number to cell text, for every row a merge in that column covers.

    openpyxl puts a merged range's value in its top left cell and leaves the
    rest of the range empty. This expands the range back out, so a case sitting
    in the middle of "Any one of them is mandatory" reads that marking rather
    than a blank, and a case sitting under a use case's list of calls reads the
    list rather than nothing.
    """
    if column_index is None:
        return {}
    spread = {}
    for span in sheet.merged_cells.ranges:
        if not (span.min_col <= column_index + 1 <= span.max_col):
            continue
        value = clean(sheet.cell(row=span.min_row, column=span.min_col).value)
        if not value:
            continue
        for row in range(span.min_row, span.max_row + 1):
            spread[row] = value
    return spread


def extract_sheet(sheet, sheet_prefix, name_the_sheet):
    # Row numbers are kept because the merged ranges are addressed by them.
    numbered = [
        (cells[0].row, [clean(cell.value) for cell in cells])
        for cells in sheet.iter_rows()
        if cells
    ]
    header = next(
        (i for i, (_, row) in enumerate(numbered)
         if any("Test Case ID" in cell for cell in row)),
        None,
    )
    if header is None:
        return []
    column = columns(numbered[header][1])
    inherited = merged_down(sheet, column.get("type"))
    shared_apis = merged_down(sheet, column.get("apis"))
    groups, current = [], None

    def start(label):
        nonlocal current
        if name_the_sheet:
            label = f"{clean(sheet.title)}: {label}"
        elif sheet_prefix:
            label = f"{sheet_prefix}: {label}"
        current = {"id": "", "label": label, "rows": []}
        groups.append(current)

    for number, row in numbered[header + 1:]:

        def cell(key):
            index = column.get(key)
            return row[index] if index is not None and index < len(row) else ""

        identifier = re.sub(r"\s+", "", cell("id"))
        if not identifier:
            # A group heading: a short number or nothing in the first column, a
            # name in the second, and no test id of its own. The HFR sheets put
            # the heading in the first column instead ("Search API"), with
            # everything else blank.
            if len(row) > 1 and row[0] and row[1] and len(row[0]) <= 5:
                start(row[1])
            elif row and row[0] and not any(row[1:]) and len(row[0]) <= 60:
                start(row[0])
            continue
        if len(identifier) > 60 or "_" not in identifier and "-" not in identifier:
            continue
        if current is None:
            start("Test cases")

        kind, condition = marking(cell("type"))
        if kind is None:
            # Blank in its own cell. A merge above it is the sheet saying this
            # case shares the marking of the run it sits in.
            kind, condition = marking(inherited.get(number, ""))
        if kind is None:
            # Blank, and in no merge. NHA left it unmarked, so this portal says
            # so rather than picking one.
            kind, condition = "Unmarked", ""

        detail = []
        if cell("feature"):
            detail.append(f"Feature: {cell('feature')}.")
        if cell("function"):
            detail.append(f"Function: {cell('function')}.")
        if cell("applies"):
            detail.append(f"Applies to: {cell('applies')}.")
        if cell("field"):
            detail.append(f"Field: {cell('field')}.")
        if cell("case"):
            detail.append(f"Test: {cell('case')}")
        if cell("steps"):
            detail.append(f"Steps: {cell('steps')}")

        # The row's own cell first, then the merge it sits inside. A row that
        # prints its own calls is naming them for itself; a blank row inside a
        # merge is covered by the use case's list above it.
        listed = cell("apis") or shared_apis.get(number, "")
        urls = list(dict.fromkeys(re.findall(r"https?://[^\s,)\"]+", listed)))
        urls = [u.rstrip(".").rstrip(",") for u in urls]

        current["rows"].append({
            "id": identifier,
            "type": kind,
            # NHA's own words when the marking is not a plain one. Empty
            # otherwise, so the renderer can show the badge alone.
            "condition": condition,
            "functionality": cell("functionality") or cell("case")[:80] or identifier,
            "expected": cell("expected") or cell("case") or "",
            # The calls NHA points this case at, as URLs, so the site can join
            # them to operations rather than reading them out of prose.
            "apis": urls,
            "api": None,
            "webhook": None,
            "detail": " ".join(detail).strip(),
        })

    groups = [group for group in groups if group["rows"]]
    return groups


REUSED_ID = "NHA gives this id to more than one case."


def dedupe(groups):
    """Drop a row only when the same case is printed twice.

    Two different things look the same at the id column and are not. NHA's
    bridge linkage worksheet prints HFR-118 to HFR-123 twice, identically, so
    the second printing is one set of cases counted twice. The M1 sheet gives
    VRFY_ABHA_501 to biometric verification and again to reading an ABHA QR
    code, which is one id over two real cases.

    So the key is the whole case, not the id. Identical means dropped.
    Same id, different case means both are kept and both say so, because the
    id is what NHA will ask about at certification and renaming either would
    defeat the only reason this file exists.
    """
    seen = set()
    dropped = 0
    for group in groups:
        rows = []
        for row in group["rows"]:
            key = (row["id"], row["functionality"], row["expected"])
            if key in seen:
                dropped += 1
                continue
            seen.add(key)
            rows.append(row)
        group["rows"] = rows

    counts = {}
    for group in groups:
        for row in group["rows"]:
            counts[row["id"]] = counts.get(row["id"], 0) + 1
    for group in groups:
        for row in group["rows"]:
            if counts.get(row["id"], 0) > 1 and REUSED_ID not in (row["detail"] or ""):
                row["detail"] = f"{REUSED_ID} {row['detail']}".strip()
    return [group for group in groups if group["rows"]], dropped


def disambiguate(groups):
    """A heading NHA uses more than once gets the ids underneath it.

    The M1 sheet heads three runs "ABHA Verification": one for Aadhaar OTP, one
    for mobile OTP and one for the communication mobile number. On the page
    they are told apart by position. In a searchable list they are three
    identical rows, which is what made the matrix look broken.
    """
    counts = {}
    for group in groups:
        counts[group["label"]] = counts.get(group["label"], 0) + 1
    for group in groups:
        if counts.get(group["label"], 0) < 2 or not group["rows"]:
            continue
        ids = [row["id"] for row in group["rows"]]
        span = ids[0] if len(ids) == 1 else f"{ids[0]} to {ids[-1]}"
        group["label"] = f"{group['label']} ({span})"
    return groups


def slugs(groups):
    seen = {}
    for group in groups:
        base = re.sub(r"[^a-z0-9]+", "-", group["label"].lower()).strip("-")[:48]
        seen[base] = seen.get(base, 0) + 1
        group["id"] = base if seen[base] == 1 else f"{base}-{seen[base]}"
    return groups


def carried_over(path, nha_ids):
    """The portal's own cases from the previous matrix, minus anything NHA covers."""
    if not path.exists():
        return None
    previous = json.loads(path.read_text())
    kept = []
    for group in previous.get("groups", []):
        already = group.get("id") == PORTAL_GROUP_ID
        for row in group["rows"]:
            if not already and row["id"] in nha_ids:
                continue
            detail = row.get("detail") or ""
            if not detail.startswith(PORTAL_PREFIX):
                context = f" It sat under {group['label']!r}." if group.get("label") else ""
                detail = f"{PORTAL_PREFIX}{context} {detail}".strip()
            kept.append({
                "condition": "",
                "apis": [],
                **row,
                "detail": detail,
                # A case this portal wrote is not a certification requirement,
                # whatever the old file called it. Saying Mandatory here would
                # be this portal inventing an NHA marking.
                "type": "Portal check",
            })
    if not kept:
        return None
    return {"id": PORTAL_GROUP_ID, "label": PORTAL_GROUP_LABEL, "rows": kept}


def build(name, spec):
    groups = []
    for book in spec["books"]:
        groups.extend(extract(RAW / book["file"], book.get("prefix")))
    groups, repeated = dedupe(groups)
    groups = slugs(disambiguate(groups))
    nha_ids = {row["id"] for group in groups for row in group["rows"]}
    extra = carried_over(OUT / f"{name}.json", nha_ids)
    if extra:
        groups.append(extra)
    built = {"module": spec["module"], "title": spec["title"], "groups": groups}
    return built, repeated


def main():
    check = "--check" in sys.argv
    failed = False
    for name, spec in SHEETS.items():
        built, repeated = build(name, spec)
        target = OUT / f"{name}.json"
        text = json.dumps(built, indent=2, ensure_ascii=False) + "\n"
        nha = sum(len(g["rows"]) for g in built["groups"] if g["id"] != PORTAL_GROUP_ID)
        own = sum(len(g["rows"]) for g in built["groups"] if g["id"] == PORTAL_GROUP_ID)
        kinds = {}
        for group in built["groups"]:
            for row in group["rows"]:
                kinds[row["type"]] = kinds.get(row["type"], 0) + 1
        shape = ", ".join(f"{v} {k.lower()}" for k, v in sorted(kinds.items()))
        if check:
            current = target.read_text() if target.exists() else ""
            state = "current" if current == text else "OUT OF DATE"
            if current != text:
                failed = True
            print(f"  {name}.json {state}: {nha} from NHA, {own} from this portal")
        else:
            target.write_text(text)
            repeats = f", {repeated} repeated id(s) taken once" if repeated else ""
            print(
                f"  {name}.json: {len(built['groups'])} group(s), "
                f"{nha} case(s) from NHA, {own} added by this portal "
                f"({shape}){repeats}"
            )
    if failed:
        print("Run: python3 scripts/build-test-matrix.py")
        sys.exit(1)


if __name__ == "__main__":
    main()
