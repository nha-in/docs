#!/usr/bin/env python3
"""Write the HIE-CM test case pages under Developer resources from NHA's sheets.

NHA publishes each milestone's functional test cases as a spreadsheet. The
sheets are stored untouched under catalogue/hiecm/openapi/.raw/, and this
turns each one into a Markdown page with one anchored section per case, so a
case id is searchable, linkable from a milestone or API page, and present in
the page's Markdown copy for agents. The pages carry `generated: true`: fix
the sheet or this script, never the page.

Each call a case names links to its endpoint page when the path is exactly
one operation in site/src/data/api-routes.json. A path several operations
share, told apart only by the request body's scope, stays plain code rather
than linking to a guess.

Usage: python3 scripts/build-test-cases.py [--check]
Needs openpyxl.
"""
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "catalogue" / "hiecm" / "openapi" / ".raw"
ROUTES = ROOT / "site" / "src" / "data" / "api-routes.json"
OUT = ROOT / "site" / "docs" / "hiecm" / "v3" / "resources"

PAGES = {
    "m1": {
        "sheet": RAW / "nha-2026-09-29-m1-tests" / "M1_ABHA_CREATION_AND_VERIFICATION_WITH_APIS_UPDATED_V1_1.xlsx",
        "title": "M1 test cases",
        "label": "M1 Identity",
        "position": 2,
        "milestone": "[M1 Identity](/docs/hiecm/v3/milestones/m1)",
        "covers": "ABHA creation by Aadhaar OTP, Aadhaar biometric, demographic authentication and driving licence or PAN, then verification, profile update, one ABHA per patient record, and sharing a profile by QR code",
        "api": "/docs/hiecm/v3/api/m1",
        "skill": "/docs/hiecm/v3/milestones/m1#build-m1-with-an-ai-coding-assistant",
        "next": "[M2 test cases](/docs/hiecm/v3/resources/m2)",
    },
}


def clean(value):
    if value is None:
        return ""
    text = str(value).replace("\r", "").replace("\u2014", ", ")
    lines = [re.sub(r"\s{2,}", " ", line).strip() for line in text.split("\n")]
    return "\n".join(line for line in lines if line)


def flat(value):
    return " ".join(clean(value).split("\n"))


def md(text):
    """Escape what CommonMark would read as markup in NHA's prose.

    A leading "1." is escaped too, or a step inside a bullet renders as a
    numbered list nested in it.
    """
    text = re.sub(r"([\\`*\[\]{}<>])", r"\\\1", text)
    return re.sub(r"^(\d+)\.", r"\1\\.", text)


def columns(header):
    found = {}
    for index, name in enumerate(header):
        key = flat(name).lower()
        if not key:
            continue
        if "test case id" in key:
            found["id"] = index
        elif "functionality" in key:
            found["functionality"] = index
        elif key.startswith("function"):
            found["note"] = index
        elif "applicable" in key:
            found["applies"] = index
        elif "mandatory" in key:
            found["marking"] = index
        elif key.startswith("test case"):
            found["test"] = index
        elif "steps" in key:
            found["steps"] = index
        elif "expected" in key:
            found["expected"] = index
        elif "suggestion" in key:
            found["tester"] = index
        elif "v3 api" in key:
            found["apis"] = index
    return found


def load_routes():
    by_path = {}
    for entry in json.loads(ROUTES.read_text()):
        if not entry.get("route", "").startswith("/docs/hiecm/"):
            continue
        bare = entry["path"].split("#")[0]
        by_path.setdefault(bare, []).append(entry)
    return by_path


def call(url, routes):
    path = urlparse(url).path.rstrip("/") or url
    matches = routes.get(path, [])
    if len(matches) == 1:
        return f"[`{matches[0]['method']} {path}`]({matches[0]['route']})"
    return f"`{path}`"


def extract(path):
    sheet = openpyxl.load_workbook(path, data_only=True).worksheets[0]
    rows = [[clean(cell) for cell in row] for row in sheet.iter_rows(values_only=True)]
    header = next(i for i, row in enumerate(rows) if any("Test Case ID" in c for c in row))
    column = columns(rows[header])

    session = ""
    for row in rows[:header]:
        if any(c == "Session API" for c in row):
            session = next((c for c in row if c.startswith("http")), "")

    groups, current, seen = [], None, {}
    for row in rows[header + 1:]:
        def cell(key):
            index = column.get(key)
            return row[index] if index is not None and index < len(row) else ""

        identifier = re.sub(r"\s+", "", cell("id"))
        if not identifier:
            # A group heading: a short number, a name, and who it applies to.
            if len(row) > 1 and row[0] and row[1] and len(row[0]) <= 5:
                applies = " ".join(flat(c) for c in row[2:4] if c)
                # Three sections share one label, so the section number the
                # sheet carries is what tells them apart.
                current = {"label": f"{row[0]}. {flat(row[1])}", "applies": applies, "cases": []}
                groups.append(current)
            continue
        if current is None:
            current = {"label": "Test cases", "applies": "", "cases": []}
            groups.append(current)
        anchor = identifier.lower()
        seen[anchor] = seen.get(anchor, 0) + 1
        if seen[anchor] > 1:
            anchor = f"{anchor}-{seen[anchor]}"
        current["cases"].append({
            "id": identifier,
            "anchor": anchor,
            "title": flat(cell("functionality")) or identifier,
            "marking": flat(cell("marking")),
            "note": cell("note"),
            "test": cell("test"),
            "steps": cell("steps"),
            "expected": cell("expected"),
            "tester": cell("tester"),
            "apis": list(dict.fromkeys(re.findall(r"https?://[^\s,]+", cell("apis")))),
        })
    return session, [g for g in groups if g["cases"]]


def field(label, text):
    """One labelled bullet; a cell with several lines becomes a nested list."""
    if not text:
        return []
    lines = [line.strip(" /") for line in text.split("\n")]
    lines = [line for line in lines if line]
    if len(lines) == 1:
        return [f"- **{label}:** {md(lines[0])}"]
    return [f"- **{label}:**"] + [f"  - {md(line)}" for line in lines]


def render(spec, session, groups, routes):
    total = sum(len(g["cases"]) for g in groups)
    out = [
        "---",
        f"title: {spec['title']}",
        f"sidebar_label: {spec['label']}",
        f"sidebar_position: {spec['position']}",
        f"description: The {spec['label']} functional test cases, each with its id, marking, steps, expected result and the calls it exercises.",
        "page_type: reference",
        "toc_max_heading_level: 2",
        "generated: true",
        "---",
        "",
        "<!-- Generated by scripts/build-test-cases.py from NHA's sheet. Edit the sheet or the script, never this page. -->",
        "",
        f"# {spec['title']}",
        "",
        f"The {total} cases {spec['milestone']} is tested against. They cover {spec['covers']}.",
        "Each case keeps the id the functional testing report uses.",
        "",
        f"Every call a case names has its full request in the [{spec['label']} API reference]({spec['api']}).",
    ]
    if session:
        out.append(f"Every call needs a gateway session first: {call(session, routes)}.")
    out += [
        f"An AI coding assistant can walk these cases against your own system with the [{spec['label']} skill]({spec['skill']}).",
        "",
    ]
    for group in groups:
        out += [f"## {md(group['label'])}", ""]
        if group["applies"]:
            out += [f"Applies to: {md(group['applies'])}.", ""]
        for case in group["cases"]:
            out += [f"### {case['id']}: {md(case['title'])} {{#{case['anchor']}}}", ""]
            out += field("Marking", case["marking"] or "Not marked")
            out += field("Note", case["note"])
            out += field("Test", case["test"])
            out += field("Steps", case["steps"])
            out += field("Expected result", case["expected"])
            out += field("For the tester", case["tester"])
            if case["apis"]:
                out.append("- **Calls:** " + ", ".join(call(u, routes) for u in case["apis"]))
            else:
                out.append("- **Calls:** none. This case is checked on your screens or in your records.")
            out.append("")
    out += [
        "## Next steps",
        "",
        "- Certification runs once, for the whole integration: [Go live](/docs/hiecm/v3/getting-started/going-live).",
        f"- The build these cases check: {spec['milestone']}.",
        f"- The next module's cases: {spec['next']}.",
        "",
    ]
    return "\n".join(out)


def main():
    check = "--check" in sys.argv
    routes = load_routes()
    stale = False
    for name, spec in PAGES.items():
        session, groups = extract(spec["sheet"])
        text = render(spec, session, groups, routes)
        target = OUT / f"{name}.md"
        cases = sum(len(g["cases"]) for g in groups)
        if check:
            current = target.read_text() if target.exists() else ""
            if current != text:
                stale = True
            print(f"  {target.relative_to(ROOT)}: {'current' if current == text else 'OUT OF DATE'}")
        else:
            target.write_text(text)
            print(f"  {target.relative_to(ROOT)}: {len(groups)} group(s), {cases} case(s)")
    if stale:
        print("Run: python3 scripts/build-test-cases.py")
        sys.exit(1)


if __name__ == "__main__":
    main()
