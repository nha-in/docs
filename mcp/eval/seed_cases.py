#!/usr/bin/env python3
# mcp/eval/seed_cases.py: single-turn Ask AI cases that name the atoms that answer them.
import json, pathlib
root = pathlib.Path(__file__).resolve().parents[2]
# compare.py joins runs on the query text, so a query asked by two cases is one
# case here, expecting any atom either names.
by_query = {}
for f in sorted((root / "evals/askai/cases").rglob("*.json")):
    c = json.loads(f.read_text())
    if len(c.get("turns") or []) == 1 and c.get("expected_sources"):
        by_query.setdefault(c["turns"][0]["text"], set()).update(c["expected_sources"])
out = [{"query": q, "expect": sorted(e)} for q, e in by_query.items()]
(pathlib.Path(__file__).parent / "cases_seeded.json").write_text(json.dumps(out, indent=1) + "\n")
print(f"seeded {len(out)} cases")
