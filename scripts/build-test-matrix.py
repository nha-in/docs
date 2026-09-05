#!/usr/bin/env python3
"""Build the M1 and M2 test matrices from NHA's own test sheets.

NHA publishes its certification test cases as spreadsheets, recorded under
catalogue/openapi/.raw/nha-2026-09-04. Until now the matrices under
site/src/data/test-matrix carried mostly hand written cases with invented
ids, which is the one thing a test matrix must not do: a developer preparing
for certification needs the id NHA will ask about, not one this portal made
up. This reads the sheets and writes the ids NHA uses.

Cases this portal added that are not in NHA's sheets are kept, in their own
group, each marked as not being an NHA test case.

The sheets are inconsistent in ways worth knowing about, all handled below:
ids appear in mixed case (Health_RECORD_CREATION), with a trailing space
(VRFY_ABHA ), with an internal space (SHARE _PATIENT_PROFILE), and five of
them carry no number at all (HIP_INIT_GRANT_CONSENT_).

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
        "file": "ABHA-Creation-and-Verification-with-APIs-V1.1.xlsx",
        "module": "M1",
        "title": "ABHA identity, registration and login",
    },
    "m2": {
        "file": "M2-Building-HIP-with-APIs-Updated-Aug-22.xlsx",
        "module": "M2",
        "title": "Care context linking and data sharing",
    },
}

PORTAL_GROUP_ID = "portal-additional-checks"
PORTAL_GROUP_LABEL = "Further checks this portal suggests"
PORTAL_PREFIX = "Not an NHA test case."


def clean(value):
    if value is None:
        return ""
    text = str(value).replace("\r", " ")
    text = re.sub(r"\s*\n\s*", " ", text)
    return re.sub(r"\s{2,}", " ", text).strip()


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
        elif "v3 api" in key:
            found["apis"] = index
    return found


def extract(path):
    sheet = openpyxl.load_workbook(path, data_only=True).worksheets[0]
    rows = [[clean(cell) for cell in row] for row in sheet.iter_rows(values_only=True)]
    header = next(
        index for index, row in enumerate(rows) if any("Test Case ID" in cell for cell in row)
    )
    column = columns(rows[header])
    groups, current = [], None

    for row in rows[header + 1:]:
        def cell(key):
            index = column.get(key)
            return row[index] if index is not None and index < len(row) else ""

        identifier = re.sub(r"\s+", "", cell("id"))
        if not identifier:
            # A group heading: a short number in the first column, a name in
            # the second, and no test id of its own.
            if len(row) > 1 and row[0] and row[1] and len(row[0]) <= 5:
                current = {"id": "", "label": row[1], "rows": []}
                groups.append(current)
            continue
        if len(identifier) > 60 or "_" not in identifier:
            continue
        if current is None:
            current = {"id": "", "label": "Test cases", "rows": []}
            groups.append(current)

        detail = []
        if cell("function"):
            detail.append(f"Function: {cell('function')}.")
        if cell("applies"):
            detail.append(f"Applies to: {cell('applies')}.")
        marking = cell("type")
        if marking and marking not in ("Mandatory", "Optional"):
            detail.append(f"NHA marks this: {marking}.")
        if cell("case"):
            detail.append(f"Test: {cell('case')}")
        if cell("steps"):
            detail.append(f"Steps: {cell('steps')}")
        urls = list(dict.fromkeys(re.findall(r"https?://[^\s,]+", cell("apis"))))
        if urls:
            detail.append("NHA names these APIs: " + ", ".join(urls) + ".")

        current["rows"].append({
            "id": identifier,
            "type": "Mandatory" if marking.lower().startswith("mandatory") else "Optional",
            "functionality": cell("functionality") or cell("case")[:80] or identifier,
            "expected": cell("expected") or cell("case") or "",
            "api": None,
            "webhook": None,
            "detail": " ".join(detail).strip(),
        })

    groups = [group for group in groups if group["rows"]]
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
        if group.get("id") == PORTAL_GROUP_ID:
            kept.extend(group["rows"])
            continue
        for row in group["rows"]:
            if row["id"] in nha_ids:
                continue
            detail = row.get("detail") or ""
            if not detail.startswith(PORTAL_PREFIX):
                context = f" It sat under {group['label']!r}." if group.get("label") else ""
                detail = f"{PORTAL_PREFIX}{context} {detail}".strip()
            kept.append({**row, "detail": detail})
    if not kept:
        return None
    return {"id": PORTAL_GROUP_ID, "label": PORTAL_GROUP_LABEL, "rows": kept}


def build(name, spec):
    groups = extract(RAW / spec["file"])
    nha_ids = {row["id"] for group in groups for row in group["rows"]}
    extra = carried_over(OUT / f"{name}.json", nha_ids)
    if extra:
        groups.append(extra)
    return {"module": spec["module"], "title": spec["title"], "groups": groups}


def main():
    check = "--check" in sys.argv
    failed = False
    for name, spec in SHEETS.items():
        built = build(name, spec)
        target = OUT / f"{name}.json"
        text = json.dumps(built, indent=2, ensure_ascii=False) + "\n"
        nha = sum(len(g["rows"]) for g in built["groups"] if g["id"] != PORTAL_GROUP_ID)
        own = sum(len(g["rows"]) for g in built["groups"] if g["id"] == PORTAL_GROUP_ID)
        if check:
            current = target.read_text() if target.exists() else ""
            state = "current" if current == text else "OUT OF DATE"
            if current != text:
                failed = True
            print(f"  {name}.json {state}: {nha} from NHA, {own} from this portal")
        else:
            target.write_text(text)
            print(
                f"  {name}.json: {len(built['groups'])} group(s), "
                f"{nha} case(s) from NHA's sheet, {own} added by this portal"
            )
    if failed:
        print("Run: python3 scripts/build-test-matrix.py")
        sys.exit(1)


if __name__ == "__main__":
    main()
