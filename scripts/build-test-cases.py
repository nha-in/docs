#!/usr/bin/env python3
"""Write the HIE-CM test case pages under Developer resources from NHA's sheets.

NHA publishes each milestone's functional test cases as a spreadsheet. The
sheets are stored untouched under catalogue/hiecm/openapi/.raw/, and this
turns each one into a page with one table per group of cases, the way the
sheet lays them out. A case id is an anchor on its row, so it is searchable,
linkable from a milestone or API page, and present in the page's Markdown copy
for agents. Steps sit behind a Steps toggle in the row, so the table stays
scannable. The pages carry `generated: true`: fix
the sheet or this script, never the page.

The sheets do not share one layout. The header row is found by its column
names wherever it sits; a page can draw on several sheets and several tabs,
each tab its own section; a group starts at a row with no case id, or at a
case row whose Function cell names one; and a row with content but no id
continues the case above it. The PHR sheet carries no case ids, so its cases
are named by the tab's milestone and the sheet's row number, such as P1 1.1.

Each call a case names links to its endpoint page when the path is exactly
one operation in site/src/data/api-routes.json. A path several operations
share, told apart only by the request body's scope, stays plain code rather
than linking to a guess. Where a sheet has both an old API column and a V3
one, the V3 column is read.

Usage: python3 scripts/build-test-cases.py [--check]
Needs openpyxl.
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "catalogue" / "hiecm" / "openapi" / ".raw"
ROUTES = ROOT / "site" / "src" / "data" / "api-routes.json"
OUT = ROOT / "site" / "docs" / "hiecm" / "v3" / "resources" / "test-cases"

PAGES = {
    "m1": {
        "sources": [{"sheet": RAW / "nha-2026-09-29-m1-tests" / "M1_ABHA_CREATION_AND_VERIFICATION_WITH_APIS_UPDATED_V1_1.xlsx"}],
        "title": "M1 test cases",
        "label": "M1 Identity",
        "position": 2,
        "milestone": "[M1 Identity](/docs/hiecm/v3/milestones/m1)",
        "covers": "ABHA creation by Aadhaar OTP, Aadhaar biometric, demographic authentication and driving licence or PAN, then verification, profile update, one ABHA per patient record, and sharing a profile by QR code",
        "skill": "[M1 Identity skill](/docs/hiecm/v3/milestones/m1#build-m1-with-an-ai-coding-assistant)",
        "next": "[M2 test cases](/docs/hiecm/v3/resources/test-cases/m2)",
    },
    "m2": {
        "sources": [{"sheet": RAW / "nha-2026-10-01-m2-tests" / "M2_BUILDING_HIP_WITH_APIS_UPDATED_AUG_22.xlsx"}],
        "title": "M2 test cases",
        "label": "M2 Health Information Provider",
        "position": 3,
        "milestone": "[M2 Health Information Provider](/docs/hiecm/v3/milestones/m2)",
        "covers": "creating health records, linking care contexts to an ABHA address whether your facility or the patient starts it, and sharing records when a consent arrives",
        "skill": "[M2 skill](/docs/hiecm/v3/milestones/m2#build-m2-with-an-ai-coding-assistant)",
        "next": "[M3 test cases](/docs/hiecm/v3/resources/test-cases/m3)",
    },
    "m3": {
        "sources": [{"sheet": RAW / "nha-2026-10-01-m3-tests" / "M3_BUILDING_HIU_APIS_UPDATED_AUG_22.xlsx"}],
        "title": "M3 test cases",
        "label": "M3 Health Information User",
        "position": 4,
        "milestone": "[M3 Health Information User](/docs/hiecm/v3/milestones/m3)",
        "covers": "raising a consent request, receiving the patient's decision, and fetching and showing the records the consent covers",
        "skill": "[M3 skill](/docs/hiecm/v3/milestones/m3#build-m3-with-an-ai-coding-assistant)",
        "next": "[M4 test cases](/docs/hiecm/v3/resources/test-cases/m4)",
    },
    "m4": {
        "sources": [
            {"sheet": RAW / "nha-2026-10-01-m4-tests" / "HFR_M4_MAR_16_2024.xlsx", "tabs": "all", "section": "HFR {tab}"},
            {"sheet": RAW / "nha-2026-10-01-m4-tests" / "HPR_TEST_CASES_FINAL.xlsx", "section": "HPR"},
        ],
        "title": "M4 test cases",
        "label": "M4 Registry Integration",
        "position": 5,
        "milestone": "[M4 Registry Integration](/docs/hiecm/v3/milestones/m4)",
        "covers": "searching, registering and updating a facility in the Health Facility Registry (HFR) and linking it to your software, then creating and updating a professional's profile in the Healthcare Professionals Registry (HPR)",
        "skill": "[M4 skill](/docs/hiecm/v3/milestones/m4#build-m4-with-an-ai-coding-assistant)",
        "next": "[PHR application test cases](/docs/hiecm/v3/resources/test-cases/phr)",
    },
    "phr": {
        "sources": [{
            "sheet": RAW / "nha-2026-10-01-phr-tests" / "PHR_MOBILE_APP_TEST_CASES.xlsx",
            "tabs": "all",
            # The sheet numbers rows but gives them no ids. Each tab is one PHR
            # milestone, so a case is named by that milestone and its row.
            "prefix": {
                "ABHA address creation": "P1",
                "PHR App Functionality": "P2",
                "Building HIU Service for PHR": "P3",
                "Locker": "P4",
            },
        }],
        "title": "PHR application test cases",
        "label": "PHR application",
        "position": 6,
        "milestone": "[PHR application](/docs/hiecm/v3/milestones/p1)",
        "covers": "registering and logging in with an ABHA address, linking and sharing health records, consents and subscriptions, and the health locker",
        "skill": "[Build with AI](/docs/hiecm/v3/getting-started/build-with-ai) tools",
        "next": "[Go live](/docs/hiecm/v3/getting-started/going-live)",
    },
}

PHR_SECTIONS = {
    "P1": "[P1 Registration and login](/docs/hiecm/v3/milestones/p1)",
    "P2": "[P2 Consents Management](/docs/hiecm/v3/milestones/p2)",
    "P3": "[P3 Subscription](/docs/hiecm/v3/milestones/p3)",
    "P4": "[P4 Locker](/docs/hiecm/v3/milestones/p4)",
}


def clean(value):
    if value is None:
        return ""
    text = str(value).replace("\r", "").replace("—", ", ")
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
        elif re.fullmatch(r"s\.\s*no", key):
            found["number"] = index
        elif "functionality" in key or key.startswith("test title"):
            found["functionality"] = index
        elif key == "feature":
            found["feature"] = index
        elif key.startswith("function"):
            found["function"] = index
        elif "applicable" in key:
            found["applies"] = index
        elif "mandatory" in key:
            found["marking"] = index
        elif key.startswith("actual name of data field"):
            found["field"] = index
        elif key.startswith("test case") or key.startswith("test scenario"):
            found["test"] = index
        elif "steps" in key:
            found["steps"] = index
        elif "expected" in key:
            found["expected"] = index
        elif "suggestion" in key:
            found["tester"] = index
        elif "v3 api" in key:
            # A V3 column wins over an older one beside it.
            found["apis"] = index
        elif key == "apis":
            found.setdefault("apis", index)
    return found


def load_routes():
    by_path = {}
    for entry in json.loads(ROUTES.read_text()):
        if not entry.get("route", "").startswith("/docs/hiecm/"):
            continue
        bare = entry["path"].split("#")[0]
        by_path.setdefault(bare, []).append(entry)
    return by_path


def urls(text):
    return re.findall(r"https?://[^\s,]+", text)


def call(url, routes, base=""):
    """An API as code, linked when its path is exactly one operation.

    `base` is a prefix most cases on the page share; it is stated once above
    the tables and left off each path, so the APIs column stays narrow. A
    Swagger page link names its operation in the fragment, so that is shown.
    """
    parsed = urlparse(url)
    if parsed.fragment.startswith("/"):
        return f"`{parsed.fragment.rstrip('/').split('/')[-1]}`"
    path = parsed.path.rstrip("/") or url
    shown = path[len(base):] if base and path.startswith(base + "/") else path
    matches = routes.get(path, [])
    if len(matches) == 1:
        return f"[`{matches[0]['method']} {shown}`]({matches[0]['route']})"
    return f"`{shown}`"


def every_case(sections):
    return [c for s in sections for g in s["groups"] for c in g["cases"]]


def shared_base(sections):
    """The first three path segments most of the page's APIs share.

    Paths outside it, such as a PHR share call on an M1 page, stay in full.
    """
    heads = [
        "/" + "/".join(parts[:3])
        for c in every_case(sections) for u in c["apis"]
        if not urlparse(u).fragment
        and len(parts := urlparse(u).path.strip("/").split("/")) > 3
    ]
    if not heads:
        return ""
    head, count = Counter(heads).most_common(1)[0]
    return head if count * 5 >= len(heads) * 4 else ""


def marking_of(text):
    word = flat(text)
    return {"yes": "Mandatory", "no": "Optional"}.get(word.lower(), word)


def lost_zero(number, last):
    """Put back the zero a spreadsheet drops from a row number.

    A cell typed 2.10 is stored as the number 2.1, so after 2.9 a row reading
    2.1 is 2.10, and after 2.19 one reading 2.2 is 2.20.
    """
    parts, before = number.split("."), last.split(".")
    if len(parts) == 2 and len(before) == 2 and parts[0] == before[0]:
        if before[1] == str(int(parts[1]) * 10 - 1):
            return f"{parts[0]}.{int(parts[1]) * 10}"
    return number


def extract(path, tab=None, prefix=""):
    book = openpyxl.load_workbook(path, data_only=True)
    sheet = book[tab] if tab else book.worksheets[0]
    # A value merged down one column, such as one API list or one marking
    # over several cases, belongs to every row it spans, not only the first.
    filled = set()
    for span in list(sheet.merged_cells.ranges):
        if span.min_col == span.max_col and span.max_row > span.min_row:
            value = sheet.cell(span.min_row, span.min_col).value
            sheet.unmerge_cells(str(span))
            for r in range(span.min_row, span.max_row + 1):
                sheet.cell(r, span.min_col).value = value
                if r > span.min_row:
                    filled.add((r, span.min_col - 1))
    rows = [(n, [clean(c) for c in row]) for n, row in enumerate(sheet.iter_rows(values_only=True), 1)]
    rows = [(n, row) for n, row in rows if any(row)]
    header = next(
        i for i, (_, row) in enumerate(rows)
        if any(c.lower().startswith(("test case id", "test title")) for c in row)
    )
    column = columns(rows[header][1])
    # Except a case's own id or number: merged down, it marks one case that
    # runs over several rows, so the rows below it continue that case.
    for n, row in rows:
        for key in ("id", "number"):
            if (n, column.get(key)) in filled:
                row[column[key]] = ""
    rows = [row for _, row in rows]

    session = ""
    for row in rows[:header]:
        if any(c == "Session API" for c in row):
            session = next((c for c in row if c.startswith("http")), "")

    groups, current, previous, last = [], None, None, ""

    def start(label, applies=""):
        nonlocal current
        # Two headings in a row: the second names the cases that follow.
        if current is not None and not current["cases"]:
            groups.remove(current)
        current = {"label": label, "applies": applies, "cases": []}
        groups.append(current)

    for row in rows[header + 1:]:
        def cell(key):
            index = column.get(key)
            return row[index] if index is not None and index < len(row) else ""

        content = any(cell(k) for k in ("test", "steps", "expected"))
        if "id" in column:
            identifier = re.sub(r"\s+", "", cell("id"))
        else:
            # No id column: a numbered row with content is a case, and a
            # numbered row with only a title is a heading.
            number = cell("number")
            identifier = ""
            if content and re.fullmatch(r"\d+(\.\d+)*", number):
                number = lost_zero(number, last)
                last = number
                identifier = f"{prefix} {number}"

        if not identifier:
            if content and previous is not None:
                # A row with no id under a case adds to that case.
                previous["test"] = "\n".join(filter(None, [previous["test"], cell("functionality"), cell("test")]))
                for key in ("steps", "expected", "tester"):
                    previous[key] = "\n".join(filter(None, [previous[key], cell(key)]))
                previous["apis"] = list(dict.fromkeys(previous["apis"] + urls(cell("apis"))))
                continue
            text = [flat(c) for c in row if c]
            if text:
                number = text[0] if len(text) > 1 and len(text[0]) <= 5 else ""
                name = text[1] if number else text[0]
                # What follows the name is who the group applies to, its
                # marking, or both, such as "PHR app Mandatory".
                applies = " ".join(text[2:] if number else text[1:])
                # Three M1 sections share one label, so the sheet's section
                # number is what tells them apart.
                start(f"{number}. {name}" if number else name, applies)
            continue

        if cell("function") and (current is None or flat(cell("function")) != current["label"]):
            start(flat(cell("function")), flat(cell("applies")))
        if current is None:
            start("Test cases")
        previous = {
            "id": identifier,
            "title": flat(cell("functionality")) or flat(cell("feature")) or identifier,
            "field": flat(cell("field")),
            "marking": marking_of(cell("marking")),
            "test": cell("test"),
            "steps": cell("steps"),
            "expected": cell("expected"),
            "tester": cell("tester"),
            "apis": list(dict.fromkeys(urls(cell("apis")))),
        }
        current["cases"].append(previous)
    return session, [g for g in groups if g["cases"]]


def sections_of(spec):
    """Every section of a page: one per tab, or one for a single-tab sheet."""
    sections, session = [], ""
    for source in spec["sources"]:
        names = openpyxl.load_workbook(source["sheet"], read_only=True).sheetnames
        for tab in names if source.get("tabs") == "all" else [None]:
            name = tab.strip() if tab else ""
            prefix = source.get("prefix", {}).get(name, "")
            found, groups = extract(source["sheet"], tab, prefix)
            session = session or found
            title = f"{prefix} {name}" if prefix else source.get("section", "").format(tab=name)
            sections.append({"title": title, "prefix": prefix, "groups": groups})
    return session, sections


def anchors_for(sections):
    seen, anchors = {}, {}
    for case in every_case(sections):
        anchor = re.sub(r"[^a-z0-9_]+", "-", case["id"].lower()).strip("-")
        seen[anchor] = seen.get(anchor, 0) + 1
        if seen[anchor] > 1:
            anchor = f"{anchor}-{seen[anchor]}"
        case["anchor"] = anchor
        anchors.setdefault(case["id"], anchor)
    return anchors


def lines(text):
    return [md(line.strip(" /")) for line in text.split("\n") if line.strip(" /")]


def cell(text):
    """A table cell: one line per line of the sheet, pipes escaped."""
    return "<br/>".join(lines(text)).replace("|", "\\|")


def marking(text, anchors):
    """Shorten the sheet's either-of marking and link the two cases it names."""
    either = re.match(r"Either of the test cases (\S+) or (\S+) is mandatory for Gov\w* Optional for Private", text)
    if not either:
        return cell(text or "Not marked")
    a, b = (f"[{i}](#{anchors.get(i, i.lower())})" for i in either.groups())
    return f"Government: {a} or {b} is mandatory.<br/>Private: optional."


def row(case, routes, anchors, base, with_apis):
    what = f"**{md(case['title'])}**"
    if case["field"]:
        what += f"<br/>Field: {md(case['field'])}"
    if case["test"]:
        what += "<br/>" + cell(case["test"])
    if case["steps"]:
        what += f"<details><summary>Steps</summary>{cell(case['steps'])}</details>"
    passes = cell(case["expected"]) or "Not stated."
    if case["tester"]:
        passes += f"<br/>*For the tester:* {cell(case['tester'])}"
    # Link, not a literal <a>: only Link registers the id with the build's
    # broken anchor check, so a link to a case that is gone fails the build.
    ident = f'<Link id="{case["anchor"]}" to="#{case["anchor"]}">{case["id"]}</Link>'
    cells = [f"{ident}<br/>{marking(case['marking'], anchors)}", what, passes]
    if with_apis:
        cells.append("<br/>".join(call(u, routes, base) for u in case["apis"]) or "None. Checked on your screens or records.")
    return "| " + " | ".join(cells) + " |"


def table(group, routes, anchors, base, with_apis, level):
    out = [f"{'#' * level} {md(group['label'])}", ""]
    if group["applies"] in ("Mandatory", "Optional"):
        out += [f"Marking: {group['applies']}.", ""]
    elif group["applies"]:
        out += [f"Applies to: {md(group['applies'])}.", ""]
    head = ["Case and marking", "What is tested", "Pass when"] + (["APIs"] if with_apis else [])
    # The wrapper's class top-aligns the rows; see .test-cases in mdx.css.
    out += ['<div className="test-cases">', "", "| " + " | ".join(head) + " |", "|" + " --- |" * len(head)]
    out += [row(case, routes, anchors, base, with_apis) for case in group["cases"]]
    return out + ["", "</div>", ""]


def render(spec, session, sections, routes):
    cases = every_case(sections)
    anchors = anchors_for(sections)
    base = shared_base(sections)
    with_apis = any(c["apis"] for c in cases)
    nested = any(s["title"] for s in sections)
    out = [
        "---",
        f"title: {spec['title']}",
        f"sidebar_label: {spec['label']}",
        f"sidebar_position: {spec['position']}",
        f"description: The {len(cases)} {spec['label']} functional test cases, each with its id, marking, steps and expected result{', and the APIs it calls' if with_apis else ''}.",
        "page_type: reference",
        f"toc_max_heading_level: {3 if nested else 2}",
        "generated: true",
        "---",
        "",
        "import Link from '@docusaurus/Link';",
        "",
        "{/* Generated by scripts/build-test-cases.py from NHA's sheets. Edit the sheet or the script, never this page. */}",
        "",
        f"# {spec['title']}",
        "",
        f"The {len(cases)} cases {spec['milestone']} is tested against. They cover {spec['covers']}.",
    ]
    if with_apis:
        out.append("Each row keeps the case id the functional testing report uses, and links every API the case calls.")
    else:
        out.append("The sheet numbers its rows but gives them no ids, so each case here is named by its PHR milestone and row, such as `P1 1.1`. Quote that name when you report a result.")
    out += [
        "[How to read a case](/docs/hiecm/v3/resources/test-cases#how-to-read-a-case) explains the columns and markings.",
        "",
    ]
    if session:
        out += [f"Every call needs a gateway session first: {call(session, routes)}.", ""]
    if base:
        out += [f"API paths in the tables below start with `{base}` unless shown in full. The prefix is left off each row to keep the table readable.", ""]
    out += [
        f"An AI coding assistant can walk these cases against your own system with the {spec['skill']}.",
        "",
    ]
    for section in sections:
        level = 2
        if section["title"]:
            out += [f"## {md(section['title'])}", ""]
            if section["prefix"] in PHR_SECTIONS:
                out += [f"The cases for {PHR_SECTIONS[section['prefix']]}.", ""]
            level = 3
        for group in section["groups"]:
            out += table(group, routes, anchors, base, with_apis, level)
    out += [
        "## Next steps",
        "",
        "- Certification runs once, for the whole integration: [Go live](/docs/hiecm/v3/getting-started/going-live).",
        f"- The build these cases check: {spec['milestone']}.",
        f"- Next: {spec['next']}.",
        "",
    ]
    return "\n".join(out)


def main():
    check = "--check" in sys.argv
    routes = load_routes()
    stale = False
    for name, spec in PAGES.items():
        session, sections = sections_of(spec)
        text = render(spec, session, sections, routes)
        target = OUT / f"{name}.mdx"
        cases = len(every_case(sections))
        groups = sum(len(s["groups"]) for s in sections)
        if check:
            current = target.read_text() if target.exists() else ""
            if current != text:
                stale = True
            print(f"  {target.relative_to(ROOT)}: {'current' if current == text else 'OUT OF DATE'}")
        else:
            target.write_text(text)
            print(f"  {target.relative_to(ROOT)}: {groups} group(s), {cases} case(s)")
    if stale:
        print("Run: python3 scripts/build-test-cases.py")
        sys.exit(1)


if __name__ == "__main__":
    main()
