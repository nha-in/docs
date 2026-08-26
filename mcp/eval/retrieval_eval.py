#!/usr/bin/env python3
"""Retrieval eval for the docs-mcp /api/search endpoint.

Two kinds of checks:

  Rank cases     -- a scenario query phrased the way a developer describes
                    their situation, plus the set of atom ids that genuinely
                    answer it. Scored by the rank of the first expected atom
                    in the result list (hit@1, hit@3, hit@10, MRR).

  Content probes -- a query whose TOP hit's snippet+summary must contain at
                    least one required substring (case-insensitive) and none
                    of the forbidden ones. These catch the failure mode where
                    the right atom ranks first but the surfaced text still
                    carries a refuted claim.

Usage:
    python3 mcp/eval/retrieval_eval.py <name> <base_url>
    e.g. python3 mcp/eval/retrieval_eval.py ollama-baseline http://localhost:8085

The server at <base_url> must be a running docs-mcp with an embedding index
built by the SAME embedding model it is serving with. Results are written to
mcp/eval/results/<name>.json (gitignored).
"""
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

# ---------------------------------------------------------------------------
# Rank cases. Each query is phrased the way a developer describes their
# situation, not the way the atom titles it. `expect` is the set of atom ids
# that genuinely answer; the score is the rank of the first one found.
# ---------------------------------------------------------------------------
RANK_CASES = [
    # -- original scenario set -------------------------------------------------
    ("two hospitals sharing one software mixing identities",
     {"hiecm.error.abdm-1063", "hiecm.error.abdm-1035"}),
    ("my session token stopped working after some time, get a new one without logging in again",
     {"hiecm.endpoint.m1-token-refresh"}),
    ("patient forgot where their records live, find their account from a phone number",
     {"hiecm.flow.m1-find-abha", "hiecm.endpoint.m1-find-abha-search"}),
    ("the server rejects my call saying the time on the request is wrong",
     {"shared.glossary.timestamp-header", "hiecm.error.abdm-2402"}),
    ("how do I scramble the aadhaar number before sending it over the wire",
     {"hiecm.concept.input-encryption", "hiecm.concept.encrypted-identifiers",
      "hiecm.decision.encrypt-locally", "hiecm.endpoint.m1-encrypt-value"}),
    ("person got a new phone number, change it on their health account",
     {"hiecm.flow.m1-update-mobile"}),
    ("the real answer arrives later on a different channel after my request returns immediately",
     {"hiecm.concept.asynchronous-callbacks", "hiecm.decision.callbacks-as-webhooks"}),
    ("show a scannable code at the reception desk so the clinic can pull up the patient",
     {"hiecm.endpoint.m1-profile-get-qr-code"}),
    ("which of the two identifiers should my database store, the number or the address",
     {"hiecm.concept.abha-number-and-address"}),
    ("grouping one hospital visit's reports so the patient's app can discover them",
     {"hiecm.concept.care-context", "shared.glossary.care-context",
      "hiecm.flow.m2-link-care-context"}),
    ("the permission the patient grants so an insurer can read their reports",
     {"hiecm.concept.consent-artefact", "shared.glossary.consent-artefact"}),
    ("am I the party holding the records or the party asking for them",
     {"hiecm.concept.roles"}),
    ("where do the gateway's incoming notifications land while I am testing",
     {"shared.sandbox.callback-url"}),
    ("create the health id using the person's face instead of an otp",
     {"hiecm.flow.m1-create-abha-face-auth", "hiecm.endpoint.m1-enrolment-face-auth-init"}),
    ("sign in to the gateway with my client id and secret before anything else",
     {"hiecm.endpoint.gateway-sessions", "hiecm.concept.gateway-session"}),
    # -- cases from the recorded failed agent session (timestamp truth repair) --
    ("what format should the timestamp header be",
     {"shared.glossary.timestamp-header", "hiecm.error.abdm-1016"}),
    ("the api rejected my call saying invalid timestamp",
     {"hiecm.error.abdm-1016", "shared.glossary.timestamp-header"}),
    ("where do I get the public key to encrypt the aadhaar number",
     {"hiecm.endpoint.m1-get-public-certificate", "hiecm.endpoint.m1-encrypt-value",
      "hiecm.concept.input-encryption"}),
    ("how do I encrypt values on the sandbox without the certificate",
     {"hiecm.endpoint.m1-encrypt-value"}),
    ("my request got a 404 but the body has an ABDM error code",
     {"hiecm.concept.error-codes", "hiecm.error.abdm-1016"}),
]

# ---------------------------------------------------------------------------
# Content probes. For each query, the TOP hit's snippet+summary (lowercased)
# must contain at least one of `require_any` and none of `forbid`.
# ---------------------------------------------------------------------------
CONTENT_CASES = [
    ("what format should the timestamp header be",
     ["utc", ".339z", "z suffix"],
     ["+05:30 offset, for example"]),  # the refuted claim's phrasing
    ("the api rejected my call saying invalid timestamp",
     ["utc"],
     []),
]


def search(base: str, query: str) -> list:
    url = f"{base}/api/search?q={urllib.parse.quote(query)}"
    with urllib.request.urlopen(url, timeout=60) as res:
        return json.load(res)["hits"]


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(f"usage: {sys.argv[0]} <name> <base_url>")
    name, base = sys.argv[1], sys.argv[2].rstrip("/")

    # -- rank cases --
    rows = []
    print("rank cases:")
    for query, expect in RANK_CASES:
        hits = search(base, query)
        ids = [h["id"] for h in hits]
        rank = next((i + 1 for i, hid in enumerate(ids) if hid in expect), None)
        rows.append({"query": query, "expect": sorted(expect), "rank": rank, "top": ids[:5]})
        shown = rank if rank is not None else "-"
        print(f"  rank {shown:>2}  {query[:70]}")

    # -- content probes --
    probes = []
    print("content probes:")
    for query, require_any, forbid in CONTENT_CASES:
        hits = search(base, query)
        if not hits:
            probes.append({"query": query, "top": None, "passed": False,
                           "reason": "no hits"})
            print(f"  FAIL     {query[:60]}  (no hits)")
            continue
        top = hits[0]
        text = f"{top.get('snippet', '')} {top.get('summary', '')}".lower()
        missing = not any(s.lower() in text for s in require_any)
        present = [s for s in forbid if s.lower() in text]
        passed = not missing and not present
        reason = []
        if missing:
            reason.append(f"none of required {require_any} in top hit")
        if present:
            reason.append(f"forbidden {present} in top hit")
        probes.append({"query": query, "top": top["id"], "passed": passed,
                       "reason": "; ".join(reason) or "ok"})
        status = "pass" if passed else "FAIL"
        print(f"  {status:<8} {query[:60]}  (top: {top['id']})")
        if not passed:
            print(f"           {'; '.join(reason)}")

    # -- summary --
    n = len(rows)
    ranks = [r["rank"] for r in rows]
    summary = {
        "name": name,
        "hit_at_1": sum(1 for r in ranks if r == 1),
        "hit_at_3": sum(1 for r in ranks if r is not None and r <= 3),
        "hit_at_10": sum(1 for r in ranks if r is not None and r <= 10),
        "mrr": round(sum(1 / r for r in ranks if r is not None) / n, 3),
        "content_pass": sum(1 for p in probes if p["passed"]),
        "content_total": len(probes),
        "n": n,
    }
    out_dir = Path(__file__).parent / "results"
    out_dir.mkdir(exist_ok=True)
    out = out_dir / f"{name}.json"
    out.write_text(json.dumps({"summary": summary, "rows": rows, "probes": probes}, indent=1))
    print(json.dumps(summary))


if __name__ == "__main__":
    main()
