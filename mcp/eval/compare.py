#!/usr/bin/env python3
"""Per-case gate: no case may fall in rank between two retrieval_eval runs."""
import json, sys

def compare(before, after, ids):
    old = {r["query"]: r["rank"] for r in before["rows"]}
    falls, table = [], []
    for r in after["rows"]:
        if ids and not ids & set(r["expect"]):
            continue
        if r["query"] not in old:
            continue
        o, n = old[r["query"]], r["rank"]
        worse = (o is not None and n is None) or (o is not None and n is not None and n > o)
        table.append(f"{'FALL' if worse else 'ok  '}  {o} -> {n}  {r['query'][:70]}")
        if worse:
            falls.append(f"{r['query']}: {o} -> {'not found' if n is None else n}")
    return falls, table

def new_probe_failures(before, after):
    """Probes that fail now but did not before. A probe that already failed is
    reported, not gated: a task is judged on what it broke."""
    was_ok = {p["query"]: p.get("passed") for p in before.get("probes", [])}
    return [p["query"] for p in after.get("probes", []) if not p.get("passed") and was_ok.get(p["query"], True)]

if __name__ == "__main__":
    b, a = (json.load(open(p)) for p in sys.argv[1:3])
    falls, table = compare(b, a, set(sys.argv[3:]))
    print("\n".join(table))
    for k in ("mrr", "hit_at_1", "hit_at_3", "hit_at_10"):
        print(f"{k}: {b['summary'].get(k)} -> {a['summary'].get(k)} (reported, not gated)")
    failed_probes = new_probe_failures(b, a)
    for q in failed_probes:
        print(f"probe failed: {q}")
    for p in a.get("probes", []):
        if not p.get("passed") and p["query"] not in failed_probes:
            print(f"probe still failing, as before: {p['query']}")
    sys.exit(1 if falls or failed_probes else 0)
