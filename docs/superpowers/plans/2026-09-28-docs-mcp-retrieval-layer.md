# Docs MCP Retrieval Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change how the Docs MCP server, the site search box and the Ask AI bot retrieve from the catalogue, so a thinner page-sourced atom is still found by an integrator's own words, operations are found by intent, and coding agents meet six tools instead of thirteen.

**Architecture:** One snapshot, one retrieval path, as today. The indexer gains breadcrumb-prefixed chunks, flat operation chunks beside the atoms, and generated per-atom questions and context; FTS stops emptying on one unknown token; the server exposes six read-only tools and keeps eleven old names as deprecated aliases for one release; lint and the loader understand atom contract v2 (`operation`, per-type sections, `facts`, `side`, `status`); error atoms become records; a weekly job finds upstream changes; the server is discoverable. Every task is gated by `mcp/eval/retrieval_eval.py` before and after, on an Ollama-embedded index, so no task is merged on a title test alone.

**Tech Stack:** Go (`mcp/`), SQLite FTS5, Ollama `nomic-embed-text` for the eval, Amazon Bedrock for Task 13 only, Node ESM scripts with `node:test`, GitHub Actions.

**Spec:** the retrieval findings of the 2026-09-28 reviews. This plan is independent of `2026-09-28-page-canonical-knowledge-atoms.md` (the atoms plan): it neither blocks nor waits for it, except where a task says so. Every task is a standalone PR on today's catalogue, measured per case by the gate below, and the plan can stop after any task. Task R1 comes first because every other task, and the atoms plan's class PRs, use its gate.

**Order:** R1, 8, 7, 9, 10, 15, 11. Tasks 12, 13 and 14 are deferred: each says what must be true before it starts.

## As built (2026-09-29, branch `feat/docs-mcp-retrieval`, stacked on `feat/page-canonical-atoms`)

R1, 8, 9, 10, 15 and 11 are committed; Task 7 was measured and not shipped; 12, 13 and 14 stay deferred as written. Ollama 0.34 with `nomic-embed-text` ran the gate locally. Two baseline runs on the same code gave identical ranks for all 109 cases, so a fall the gate reports is real. Where the build differed:

- **R1.** A probe that already fails on main ("what format should the timestamp header be") is reported, not gated; the gate fails only on a probe that newly fails. `seed_cases.py` merges a query two cases ask, because `compare.py` joins on the query. `gate.sh` refuses to start when :8085 already serves. 79 cases seeded plus 30 hand-written (28 existed, not 31): 109. Baseline mrr 0.503.
- **Task 8.** The OR-any-token fallback failed the gate: 12 cases fell (mrr 0.465), as plain-words questions gained keyword matches on "call" and "my" that crowded the vector leg's answers out. Leave-one-out still dropped 10. Shipped: when the all-token match finds too few, retry on identifier-shaped tokens only (letters with digits, `_` or `/`, hyphenated capitals, camelCase), any of them. 0 falls, mrr 0.505.
- **Task 7. Not shipped.** Breadcrumbs failed the gate in both forms tried: gateway > type > title > section dropped 12 cases (mrr 0.487), and without the type still 12 (0.486). Kept in `git stash` for a re-test on Bedrock embeddings. Also found: the vector leg's snippet is the chunk's first 200 characters, so any breadcrumb would reach readers.
- **Task 9.** Operation chunks share `chunks` (with a `kind` column) but not `atoms_fts`: bm25 weighs terms per table, so shared rows would move every atom query; operations get `operations_fts`. `OperationDocPath` moved to the index package. On an exact fusion tie an atom goes before an operation. `/api/search` stays atoms only; the gate holds exactly.
- **Task 10.** `search` with `kind: operation` uses Task 9's intent search (a module or no query lists). The chat's `search` defaults to `detailed`: the chat guard lets an answer state only what a tool returned, and `concise` drops snippets. `internal/eval` scores `search` or `search_docs`, so old runs still score. Agent task 2 was not run: it drives the installed plugin's MCP endpoint, not this branch. The plan moved to 2026.09.28-3 (done criterion 6: nine tools became six).
- **Task 15.** `/.well-known/mcp.json` uses the relative `/mcp`, so a self-hosted copy points at its own server; a test fails if it names a tool the server does not register. The host does not negotiate on `Accept: text/markdown`, so the README points at the `.md` URL instead. The registry entry waits for `docs.abdm.gov.in`.
- **Task 11.** Contract v2 lives in `scripts/lib/contract.mjs`, a pure function lint-atoms calls, so its rules have tests. Facts are not required on error atoms: no case in the plan needs it and every error atom is NHCX. Search filters go through `index.Filter`, which the old entry points wrap. The 68 endpoint and callback atoms are all NHCX and no NHCX specification exists here, so their `operation` fill waits on owner decision 1. The plan moved to 2026.09.28-4 (principle P5 and done criterion 1).

## Global Constraints

- Never write an em dash anywhere: code, generated files, docs, commit messages.
- Every task runs the gate (Task R1) before and after, on the same case set. The gate is per case: no case may fall in rank, and the content probes may not fail. `mrr` and `hit_at_N` are reported, not gated. It is a local run with both result files pasted in the PR, not a CI job. Ollama embeddings are not production's Bedrock embeddings, so a pass is evidence, not proof.
- Every task ends with `cd mcp && go test ./...`, `npm run -s test:scripts lint:atoms check:sections`, and `./scripts/plan-check.sh` green.
- One retrieval path. The site search box, `search` and Ask AI read the same snapshot. Before Task 10 the owner decides whether the site search box calls `/api/search` (recommended: one path, one exclusion rule) or keeps the build-time local index.
- A tool response stays under the client caps: a `concise` search result at `limit: 10` is under 4,000 characters; no tool returns more than 25,000 tokens; larger results paginate.
- Old tool names keep resolving for one release. The chat loop uses only the new names.
- Generated files (`catalogue/generated/**`, goldens) are never hand-edited.
- `plan/`, `mcp/README.md`, `CLAUDE.md` and the contributor plugin's skills are updated in the same PR as the change that makes them wrong, and every plugin whose files change bumps its version.

## Review Focus

1. **An exact identifier plus one stray word must still return the exact hit first.** Pinned by Task 8's unknown-token test.
2. **An intent with no atom behind it must still find the operation.** Pinned by Task 9's intent test.
3. **A deprecated alias must behave exactly like the tool it aliases, including errors.** Pinned by Task 10's alias test and the regenerated goldens.
4. **A deprecated atom must never be cited to a reader unless asked for.** Pinned by Task 11's hidden-by-default test.
5. **Enrichment must never add a fact the atom does not state.** Pinned by Task 13's size-bound test and the hand read of ten files; a question the atom cannot answer is a prompt bug.

---

### Atom contract v2

The review found the atom is a good retrieval unit whose weaknesses all sit on one axis: prose is hand-written where it could be derived, and the machine-readable half stops at the frontmatter. Task 11 makes the indexer and lint understand this contract. Nothing here changes an atom id.

| Change | What it is | Why |
|---|---|---|
| `operation: <operationId>` on every endpoint and callback atom | The join to the spec. `lint:atoms` fails if it does not resolve in `catalogue/openapi/`. | Today the atom and the operation are joined only by the title string. `get_atom` and `get_operation` cannot hand off, and the indexer cannot enrich an endpoint atom with its contract. |
| Sections required per type, not one template for eleven types | glossary: In plain words. concept, decision, sandbox, fhir: In plain words, When it goes wrong optional. flow, endpoint, callback, test: all five. error: In plain words, When it goes wrong, plus the `facts` block below. troubleshooting: In plain words, What happens, When it goes wrong. | 310 error atoms carry the same "Before you start" paragraph. Identical chunks compete in search. The atoms plan's Task 4 already makes the sections optional for generated atoms; this makes the rule explicit and per type. |
| `facts:` block, a list of `{key, value, source}` | Values the bot should quote exactly: `link_token_validity: 6 months`, `http_status: 202`, `retryable: false`. `source` is the index into `sources`. | The literal check catches backticks and nothing else. A durations, a status or a flag lives only in prose today. Task 11 cross-checks `http_status` and `returning_operation` facts against the spec. |
| `side: provider | payer | hip | hiu | both` on NHCX and HIE-CM atoms; `milestone` stays HIE-CM only | A search filter that means something for NHCX, where `milestone: n/a` sits on 536 atoms. | The filters are HIE-CM shaped. |
| `status: current | deprecated | draft` and optional `superseded_by: <id>` | Lifecycle. Default `current`. `search_docs` excludes `deprecated` unless asked. | No way to retire an atom without deleting its id, which the evals cite. |
| `related` stays hand-written | No derived edges: linking atoms that cite the same source would tie 339 atoms to one spreadsheet. The atoms plan's Task 4e fails self-links; `lint-atoms` already fails dangling ids. | `abha-biometric-auth-init` lists itself today. |
| Retrieval enrichment generated, never authored | `catalogue/generated/enrich/<id>.yaml`: `questions` (3 to 8 the atom answers), `context` (50 to 100 tokens situating the atom, Anthropic's contextual retrieval), regenerated only when the atom's content hash changes. The indexer prepends `context` to every chunk and indexes `questions` as an extra chunk. | Summary is the only searcher hook today. |

A migrating class adds `operation`, `side`, `status` and `facts` to its map entries as it moves. Hand-written atoms that have not migrated gain the fields through Task 11 without moving. NHCX atoms gain them only after the atoms plan's owner decision 1, because the next port from the NHCX package overwrites NHCX hand-written files.


### The gate, run before and after every task

Task R1 builds it. Each task then runs, from the repo root:

```bash
mcp/eval/gate.sh before-<task>      # before the change
mcp/eval/gate.sh after-<task>       # after the change
python3 mcp/eval/compare.py mcp/eval/results/before-<task>.json mcp/eval/results/after-<task>.json
```

`compare.py` exits 1 if any case falls in rank or any content probe fails, and prints a per-case table plus the reported metrics. Paste its output in the PR.

---

## Tasks

Task numbers 7 to 15 are kept from the earlier combined plan so references still resolve; R1 is new. Each task is gated per case by Task R1's gate, and Task 10 also by agent eval task 2, which needs no credentials.

### Task R1: A gate that can fail, and cases that cover what changes

`mcp/eval/retrieval_eval.py` works, but the earlier plans called it wrongly: its summary keys are `hit_at_1`, `hit_at_3`, `hit_at_10` and `mrr`, its per-case results are under `rows` (`query`, `expect`, `rank`), and a server started inside `( ... &)` cannot be stopped with `kill %1`. It has 31 hand-written cases and none expects `shared.glossary.link-token`.

**Files:**
- Create: `mcp/eval/gate.sh`, `mcp/eval/compare.py`, `mcp/eval/test_compare.py`, `mcp/eval/seed_cases.py`
- Create (generated): `mcp/eval/cases_seeded.json`
- Modify: `mcp/eval/retrieval_eval.py` (two link-token cases; load seeded cases)

**Interfaces:**
- `compare.py BEFORE AFTER [ATOM_ID ...]`: joins `rows` on `query`; a case falls when its rank gets worse or it goes from found to not found; with atom ids given, only cases whose `expect` includes one of them are gated (the atoms plan uses this); exits 1 on any fall or failed probe.
- `seed_cases.py`: writes `cases_seeded.json`, a list of `{query, expect}` from every `evals/askai/cases/**/*.json` with exactly one turn and a non-empty `expected_sources`.

- [x] **Step 1: Write the failing test**

```python
# mcp/eval/test_compare.py
import unittest
from compare import compare

def run(rows): return {"summary": {}, "rows": rows, "probes": []}

class Compare(unittest.TestCase):
    def test_a_case_that_falls_fails(self):
        b = run([{"query": "q", "expect": ["a"], "rank": 1}])
        a = run([{"query": "q", "expect": ["a"], "rank": 3}])
        self.assertEqual(compare(b, a, set())[0], ["q: 1 -> 3"])

    def test_a_case_that_disappears_fails(self):
        b = run([{"query": "q", "expect": ["a"], "rank": 2}])
        a = run([{"query": "q", "expect": ["a"], "rank": None}])
        self.assertEqual(compare(b, a, set())[0], ["q: 2 -> not found"])

    def test_only_cases_for_named_atoms_are_gated(self):
        b = run([{"query": "q", "expect": ["a"], "rank": 1}, {"query": "r", "expect": ["b"], "rank": 1}])
        a = run([{"query": "q", "expect": ["a"], "rank": 1}, {"query": "r", "expect": ["b"], "rank": 4}])
        self.assertEqual(compare(b, a, {"a"})[0], [])

if __name__ == "__main__":
    unittest.main()
```

- [x] **Step 2: Run it and see it fail**

Run: `cd mcp/eval && python3 -m unittest test_compare -v`
Expected: FAIL, no module named `compare`.

- [x] **Step 3: Write `compare.py`**

```python
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

if __name__ == "__main__":
    b, a = (json.load(open(p)) for p in sys.argv[1:3])
    falls, table = compare(b, a, set(sys.argv[3:]))
    print("\n".join(table))
    for k in ("mrr", "hit_at_1", "hit_at_3", "hit_at_10"):
        print(f"{k}: {b['summary'].get(k)} -> {a['summary'].get(k)} (reported, not gated)")
    failed_probes = [p["query"] for p in a.get("probes", []) if not p.get("passed")]
    for q in failed_probes:
        print(f"probe failed: {q}")
    sys.exit(1 if falls or failed_probes else 0)
```

- [x] **Step 4: Write `gate.sh`**

```bash
#!/usr/bin/env bash
# Builds an Ollama-embedded index of the catalogue, serves it, runs the eval,
# stops the server. Usage: mcp/eval/gate.sh <result-name>
set -euo pipefail
name="$1"; root="$(cd "$(dirname "$0")/../.." && pwd)"; tmp="${TMPDIR:-/tmp}"
export EMBED_PROVIDER=ollama OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"
cd "$root/mcp"
go build -o "$tmp/abdm-indexer" ./cmd/indexer
go build -o "$tmp/abdm-docs-mcp" ./cmd/docs-mcp
"$tmp/abdm-indexer" -catalogue ../catalogue -out "$tmp/$name.db"
"$tmp/abdm-docs-mcp" -db "$tmp/$name.db" -addr :8085 & server=$!
trap 'kill $server 2>/dev/null || true' EXIT
for _ in $(seq 1 60); do curl -fsS "http://localhost:8085/api/search?q=ping" >/dev/null 2>&1 && break; sleep 1; done
python3 eval/retrieval_eval.py "$name" http://localhost:8085
```

Run: `chmod +x mcp/eval/gate.sh && ollama pull nomic-embed-text && mcp/eval/gate.sh smoke`
Expected: `mcp/eval/results/smoke.json` written; no process left on :8085 (`lsof -i :8085` prints nothing).

- [x] **Step 5: Seed cases from the Ask AI eval, add link-token cases**

```python
#!/usr/bin/env python3
# mcp/eval/seed_cases.py: single-turn Ask AI cases that name the atoms that answer them.
import json, pathlib
root = pathlib.Path(__file__).resolve().parents[2]
out = []
for f in sorted((root / "evals/askai/cases").rglob("*.json")):
    c = json.loads(f.read_text())
    if len(c.get("turns") or []) == 1 and c.get("expected_sources"):
        out.append({"query": c["turns"][0]["text"], "expect": sorted(c["expected_sources"])})
(pathlib.Path(__file__).parent / "cases_seeded.json").write_text(json.dumps(out, indent=1) + "\n")
print(f"seeded {len(out)} cases")
```

In `retrieval_eval.py`, add to `RANK_CASES`:

```python
    ("how long can I keep using the token that lets me link a patient's records",
     {"shared.glossary.link-token"}),
    ("linking care contexts fails because my stored link token has expired",
     {"shared.glossary.link-token"}),
```

and directly after the `RANK_CASES` list:

```python
_seeded = Path(__file__).parent / "cases_seeded.json"
if _seeded.exists():
    RANK_CASES += [(c["query"], set(c["expect"])) for c in json.loads(_seeded.read_text())]
```

(add `import json` and `from pathlib import Path` at the top if absent).

Run: `python3 mcp/eval/seed_cases.py && cd mcp/eval && python3 -m unittest test_compare -v && cd ../.. && mcp/eval/gate.sh baseline`
Expected: "seeded N cases"; 3 tests pass; `baseline.json` has `summary.n` equal to 33 plus N.

- [x] **Step 6: Commit**

```bash
git add mcp/eval/gate.sh mcp/eval/compare.py mcp/eval/test_compare.py mcp/eval/seed_cases.py mcp/eval/cases_seeded.json mcp/eval/retrieval_eval.py
git commit -m "eval: a per-case gate that can fail, and cases seeded from the Ask AI eval"
```

### Task 7: Chunk breadcrumbs

**Files:**
- Modify: `mcp/internal/catalogue/chunk.go`
- Test: `mcp/internal/catalogue/chunk_test.go`

**Interfaces:**
- `ChunkAtom(a Atom) []Chunk` keeps its signature. Every chunk's `Text` now starts with `<gateway> > <type> > <title>` and, for a section chunk, `> <heading>`, on the first line, then the text. The summary chunk is `<breadcrumb>\n<summary>`.

- [ ] **Step 1: Write the failing test**

```go
func TestChunksCarryABreadcrumb(t *testing.T) {
	a := Atom{ID: "nhcx.error.payr-1107", Gateway: "nhcx", Type: "error", Title: "PAYR-1107: policy not found", Summary: "The payer found no policy.", Body: "# t\n\n## In plain words\n\nNo policy.\n\n## When it goes wrong\n\nCheck the id."}
	c := ChunkAtom(a)
	if got, want := strings.SplitN(c[0].Text, "\n", 2)[0], "nhcx > error > PAYR-1107: policy not found"; got != want {
		t.Fatalf("summary chunk first line %q, want %q", got, want)
	}
	if got, want := strings.SplitN(c[2].Text, "\n", 2)[0], "nhcx > error > PAYR-1107: policy not found > When it goes wrong"; got != want {
		t.Fatalf("section chunk first line %q, want %q", got, want)
	}
}
```

- [ ] **Step 2: Run it and see it fail**

Run: `cd mcp && go test ./internal/catalogue -run TestChunksCarryABreadcrumb`
Expected: FAIL on the first line.

- [ ] **Step 3: Change the prefix in `ChunkAtom`**

Replace the `a.Title` / `a.Title + ": " + heading` prefix with the breadcrumb. Update any existing chunk test that asserts the old prefix.

- [ ] **Step 4: Rebuild the eval index, run the eval, commit**

Run: `cd mcp && go test ./internal/catalogue && (the gate with name breadcrumbs)`
Expected: PASS; `compare.py` exits 0.

```bash
git add mcp/internal/catalogue/chunk.go mcp/internal/catalogue/chunk_test.go
git commit -m "index: every chunk starts with its gateway, type, title and section"
```

### Task 8: A keyword query with one unknown token still returns keyword hits

`ftsQuote` wraps every token in quotes and joins them, so one typo or one extra word zeroes the FTS half and the search becomes vector-only. Exact identifiers are what keyword search is for on API docs.

**Files:**
- Modify: `mcp/internal/index/search.go`
- Test: `mcp/internal/index/search_test.go`

**Interfaces:**
- `ftsSearch` keeps its signature. It first runs the query as today (all tokens required). If that returns fewer than `limit` rows, it runs the tokens joined with `OR`, appends the rows not already present, and stops. Vocabulary expansion (`vocabulary.go`) applies to both.

- [x] **Step 1: Write the failing test**

Using the existing test fixture writer in `search_test.go`, index two atoms, one whose body contains `ABDM-1062` and one that does not, then:

```go
func TestKeywordSearchSurvivesOneUnknownToken(t *testing.T) {
	hits, err := r.ftsSearch("ABDM-1062 zzqx", "", "", "", 10)
	if err != nil { t.Fatal(err) }
	if len(hits) == 0 || hits[0].ID != "hiecm.error.abdm-1062" {
		t.Fatalf("an unknown extra token emptied the keyword results: %+v", hits)
	}
}
```

- [x] **Step 2: Run it and see it fail**

Run: `cd mcp && go test ./internal/index -run TestKeywordSearchSurvivesOneUnknownToken`
Expected: FAIL, zero hits.

- [x] **Step 3: Add the OR fallback in `ftsSearch`**

In `mcp/internal/index/search.go`, move the SQL query and scan loop of `ftsSearch` unchanged into `func (r *Reader) ftsRun(match, atomType, milestone, gateway string, limit int) ([]SearchHit, error)`, then make `ftsSearch` end with:

```go
	hits, err := r.ftsRun(match, atomType, milestone, gateway, limit)
	if err != nil || len(hits) >= limit || len(strings.Fields(query)) < 2 {
		return hits, err
	}
	// Every token required found too few: one unknown word must narrow the
	// keyword results, not empty them. AND rows keep their places first.
	orMatch := strings.Join(strings.Fields(ftsQuote(query)), " OR ")
	if exp := ftsQuery(query, r.vocab); exp != ftsQuote(query) {
		orMatch = "(" + orMatch + ") OR " + exp
	}
	more, err := r.ftsRun(orMatch, atomType, milestone, gateway, limit)
	if err != nil {
		return nil, err
	}
	seen := make(map[string]bool, len(hits))
	for _, h := range hits {
		seen[h.ID] = true
	}
	for _, h := range more {
		if len(hits) >= limit {
			break
		}
		if !seen[h.ID] {
			hits = append(hits, h)
			seen[h.ID] = true
		}
	}
	return hits, nil
```

- [x] **Step 4: Run the package tests and the eval, commit**

Run: `cd mcp && go test ./internal/index && (the gate with name fts-fallback)`
Expected: PASS; `compare.py` exits 0. AND rows come first by construction, so `hit_at_1` should hold; if it drops, check a case where the OR pass filled a slot the AND pass left empty.

```bash
git add mcp/internal/index/search.go mcp/internal/index/search_test.go
git commit -m "search: an unknown token narrows keyword results instead of emptying them"
```

### Task 9: Operations are searchable by intent

Specs feed the exact-lookup tools only. An intent-phrased question about an endpoint finds it only if an endpoint atom exists and uses the same words. Index every operation as its own chunk.

**Files:**
- Modify: `mcp/internal/catalogue/operations.go`, `mcp/internal/index/writer.go`, `mcp/internal/index/schema.go`, `mcp/internal/index/search.go`, `mcp/internal/server/tools.go`
- Test: `mcp/internal/catalogue/operations_test.go`, `mcp/internal/index/search_test.go`, `mcp/internal/server/golden_test.go` (regenerate)

**Interfaces:**
- Produces: `ChunkOperation(op Operation) Chunk` in `operations.go`. `Text` is `<gateway> > operation > <METHOD> <path>\n<summary or description>\nparameters: <names>\nresponses: <codes>\nerrors: <error codes named in the responses>`. No example payloads, no nested schemas (arXiv 2411.19804: raw schema JSON is noise for embeddings; flattened field names are signal).
- `SearchHit` gains `Kind string` (`atom` or `operation`) and, for an operation, `ID` is the `operationId`, `DocURL` is the reference page.
- `search_docs` gains an optional `kind` input (`atom`, `operation`, default both) and the description says operations are now searchable here. `list_operations` and `get_operation` are unchanged.

- [x] **Step 1: Write the failing tests**

```go
// operations_test.go
func TestChunkOperationIsFlatAndNamesErrors(t *testing.T) {
	op := Operation{Gateway: "hiecm", OperationID: "m1_post_profile_verify", Method: "POST", Path: "/abha/api/v3/profile/login/verify", Summary: "Verify the OTP", Params: []string{"txnId", "otp"}, ResponseCodes: []string{"200", "401"}, ErrorCodes: []string{"ABDM-1062"}}
	c := ChunkOperation(op)
	for _, want := range []string{"hiecm > operation > POST /abha/api/v3/profile/login/verify", "Verify the OTP", "parameters: txnId, otp", "responses: 200, 401", "errors: ABDM-1062"} {
		if !strings.Contains(c.Text, want) { t.Errorf("missing %q in %q", want, c.Text) }
	}
	if strings.Contains(c.Text, "{") { t.Errorf("chunk carries schema JSON: %q", c.Text) }
}
```

```go
// search_test.go
func TestSearchFindsAnOperationByIntent(t *testing.T) {
	// fixture: one operation with summary "Verify the OTP", no atom mentioning OTP
	hits, err := r.SearchIn(ctx, "verify otp", "", "", "", 5, fakeEmbedder)
	if err != nil { t.Fatal(err) }
	if len(hits) == 0 || hits[0].Kind != "operation" || hits[0].ID != "m1_post_profile_verify" {
		t.Fatalf("operation not found by intent: %+v", hits)
	}
}
```

- [x] **Step 2: Run them and see them fail**

Run: `cd mcp && go test ./internal/catalogue ./internal/index -run 'TestChunkOperation|TestSearchFindsAnOperation'`
Expected: FAIL.

- [x] **Step 3: Implement**

Add the fields to `Operation` that the loader does not yet populate (`Params`, `ResponseCodes`, `ErrorCodes`, from the parsed spec). In `writer.go`, write operation chunks into the same `chunks` and FTS tables with `kind = 'operation'`; the schema gains a `kind` column. `SearchIn` fills `Kind` and applies the `kind` filter. `search_docs` passes it through and its description changes to: "Hybrid search over the catalogue atoms and the API operations. Use `kind: operation` when you want the contract for an intent; `get_operation` returns the full contract by id."

- [x] **Step 4: Regenerate goldens, run everything, run the eval, commit**

Run: `cd mcp && go test ./internal/server -run TestGolden -update && go test ./... && (the gate with name operations-indexed)`
Expected: PASS; review the golden diff; `compare.py` exits 0, and the five cases from the recorded failed agent session (timestamp and encryption) improve or hold.

```bash
git add mcp
git commit -m "search: API operations are searchable by intent, as flat chunks beside the atoms"
```

### Task 10: Thirteen tools become six, old names kept as aliases for one release

**Why.** Anthropic's tool guidance puts a single-purpose server at 3 to 8 tools; tool choice degrades past 10, and Cursor caps a developer at about 40 across every server they run. Today the MCP server registers 13: four overlapping list tools (`list_atoms`, `list_operations`, `list_fhir_profiles`, `catalogue_info`), four getters for one idea (`get_atom`, `get_operation`, `get_fhir_profile`, `get_fhir_example`), and two validators. The chat loop already hides most of this behind a composite `search_docs`. This task gives both surfaces the same six names, delegating to the existing `Tools` methods so no result payload changes.

**Starts:** after Task R1 (the gate). Works with or without Task 9: before Task 9, `search` with `kind: operation` delegates to `ListOperations`; after Task 9 it can read operation chunks from the index instead, which Task 9 wires.

**Decisions taken here:**
- **No name prefix.** MCP clients already namespace by server (`mcp__abdm-docs__search` in Claude Code, the server label in Cursor and VS Code), so `abdm_search` would read `abdm-docs abdm_search`.
- **No `outputSchema`.** go-sdk v1.7.0 supports it, but a declared schema binds every result to it, and today's results are free-form maps that grew field by field. Revisit when results are typed structs. Every tool gets `ReadOnlyHint: true`.
- **Aliases for one release.** 17 tools are registered during that release (6 new plus 11 aliases), over the 10 guideline, because installed skills and agent prompts name the old tools. The next release removes the aliases.

**Files:**
- Create: `mcp/internal/server/tools_six.go`
- Modify: `mcp/internal/server/tools.go` (Tools gains the FHIR digest cache; `ValidateFHIR`; `Defs`; `ChatToolsFor`; `lookupIn.Kind`), `mcp/internal/server/mcp.go` (register six, mark eleven as aliases, move the FHIR validation into `Tools`), `mcp/internal/route/route.go`, `mcp/internal/chat/loop.go` (`collectSources`, `systemPromptTemplate`, `lookFirst`)
- Modify (docs, same PR): `mcp/README.md`, `plan/abdm-v1-phase1-architecture-and-plan.md` (the tool table), `plugins/abdm-contributors-assistant/skills/support-agent/SKILL.md`, `.../scalar-docs/SKILL.md`, `.../openapi-ingest/SKILL.md`, `skills-src/fhir-audit/SKILL.md`, `skills-src/fhir-generate/SKILL.md`
- Test: `mcp/internal/server/mcp_test.go` (append), `mcp/internal/server/tools_six_test.go` (create), `mcp/internal/route/route_test.go`, `mcp/internal/chat/loop_test.go`, `mcp/internal/server/testdata/golden/*` (regenerate)

**Interfaces:**

| Tool | Replaces | Input | Returns |
|---|---|---|---|
| `search` | `search_docs`, `list_atoms`, `list_operations`, `list_fhir_profiles` | `query` (optional), `kind`: `atom` (default), `operation`, `fhir_profile`; `type`, `milestone` (atoms); `module` (operations); `limit` (default 10, cap 25); `response_format`: `concise` (default) or `detailed` | atoms: `hits` (concise: `id`, `type`, `title`, `doc_url`, `summary` cut to 160 characters; detailed: today's `search_docs` hit); empty `query` lists atoms by `type`/`milestone`; `operation`: today's `list_operations` result; `fhir_profile`: today's `list_fhir_profiles` result |
| `get` | `get_atom`, `get_operation`, `get_fhir_profile`, `get_fhir_example` | `id` | the matching tool's result; the id's shape picks the kind: `<gateway>.<type>.<slug>` with gateway `hiecm`, `nhcx`, `uhi` or `shared` is an atom; `fhir:<profile>` a FHIR profile; `fhir-example:<hiType>` a FHIR example; anything else an operationId |
| `related` | `related_atoms` | `id` | unchanged |
| `decode_error` | itself | unchanged | unchanged |
| `validate` | `validate_request`, `validate_fhir` | `kind`: `request` or `fhir`; `operation_id` and `body` for `request`; `bundle_json` and optional `record_type` for `fhir` | the matching tool's result |
| `catalogue_info` | itself | none | unchanged |

- An unknown id or kind is an `isError` result that names the fix: `"<what was not found>. Use search to find valid ids, then get with an id from its results."`
- A `concise` `search` result at `limit: 10` stays under 4,000 characters.
- Each alias keeps its current input schema and handler; only its description changes, to `Deprecated alias for \`<new>\`; removed in the next release. ` followed by its old description.
- The chat surface: `search` (the composite `Lookup`, gaining `kind: operation`), `get`, `related`, `decode_error`, `catalogue_info`, and `validate` with `kind: request` when a page is attached. No alias reaches the chat.

- [x] **Step 1: Write the failing tests**

Create `mcp/internal/server/tools_six_test.go`:

```go
package server

import "testing"

func TestIDKindPicksTheToolFromTheIDShape(t *testing.T) {
	for id, want := range map[string]string{
		"hiecm.error.abdm-1062":       "atom",
		"shared.glossary.link-token":  "atom",
		"nhcx.endpoint.claim-submit":  "atom",
		"m1_post_profile_verify":      "operation",
		"fhir:OPConsultRecord":        "fhir_profile",
		"fhir-example:OPConsultation": "fhir_example",
	} {
		if got := idKind(id); got != want {
			t.Errorf("idKind(%q) = %q, want %q", id, got, want)
		}
	}
}

func TestConciseTrimsAHitToFiveFields(t *testing.T) {
	long := make([]byte, 400)
	for i := range long {
		long[i] = 'x'
	}
	out := concise(map[string]any{"hits": []map[string]any{{"id": "a", "type": "error", "title": "T", "doc_url": "/d", "summary": string(long), "snippet": "s", "related": []string{"b"}}}})
	h := out["hits"].([]map[string]any)[0]
	if len(h) != 5 {
		t.Fatalf("concise hit has %d fields, want 5: %v", len(h), h)
	}
	if n := len(h["summary"].(string)); n > 160 {
		t.Errorf("summary is %d characters, want at most 160", n)
	}
}
```

Append to `mcp/internal/server/mcp_test.go`:

```go
func TestSixToolsAndTheirAliases(t *testing.T) {
	sess := connect(t, false, nil)
	res, err := sess.ListTools(context.Background(), nil)
	if err != nil {
		t.Fatal(err)
	}
	byName := map[string]*mcp.Tool{}
	for _, tl := range res.Tools {
		byName[tl.Name] = tl
	}
	for _, n := range []string{"search", "get", "related", "decode_error", "validate", "catalogue_info"} {
		tl, ok := byName[n]
		if !ok {
			t.Errorf("missing tool %s", n)
			continue
		}
		if strings.HasPrefix(tl.Description, "Deprecated") {
			t.Errorf("%s is a new tool but reads as deprecated", n)
		}
		if tl.Annotations == nil || !tl.Annotations.ReadOnlyHint {
			t.Errorf("%s is not marked read-only", n)
		}
	}
	for old, repl := range map[string]string{
		"search_docs": "search", "list_atoms": "search", "list_operations": "search", "list_fhir_profiles": "search",
		"get_atom": "get", "get_operation": "get", "get_fhir_profile": "get", "get_fhir_example": "get",
		"related_atoms": "related", "validate_request": "validate", "validate_fhir": "validate",
	} {
		tl, ok := byName[old]
		if !ok {
			t.Errorf("alias %s is gone; it must stay for one release", old)
			continue
		}
		if want := "Deprecated alias for `" + repl + "`;"; !strings.HasPrefix(tl.Description, want) {
			t.Errorf("%s description does not start with %q", old, want)
		}
	}
	if len(res.Tools) != 17 {
		t.Errorf("registered %d tools, want 17 (6 new, 11 aliases) for this release", len(res.Tools))
	}
}

func TestGetReturnsWhatTheOldToolReturned(t *testing.T) {
	sess := connect(t, false, nil)
	a := callText(t, sess, "get", map[string]any{"id": "hiecm.error.abdm-1035"})
	b := callText(t, sess, "get_atom", map[string]any{"id": "hiecm.error.abdm-1035"})
	if a != b {
		t.Errorf("get and get_atom differ:\n%s\n---\n%s", a, b)
	}
}

func TestGetAnUnknownIDNamesTheFix(t *testing.T) {
	sess := connect(t, false, nil)
	res, err := sess.CallTool(context.Background(), &mcp.CallToolParams{Name: "get", Arguments: map[string]any{"id": "hiecm.error.nope-9999"}})
	if err != nil {
		t.Fatal(err)
	}
	if !res.IsError {
		t.Fatal("an unknown id must be an isError result")
	}
	if txt := res.Content[0].(*mcp.TextContent).Text; !strings.Contains(txt, "Use search to find valid ids") {
		t.Errorf("error does not name the fix: %q", txt)
	}
}

func TestConciseSearchStaysUnderTheBudget(t *testing.T) {
	sess := connect(t, false, nil)
	txt := callText(t, sess, "search", map[string]any{"query": "ABDM", "limit": 10})
	if len(txt) >= 4000 {
		t.Errorf("concise search is %d characters, want under 4000", len(txt))
	}
	if !strings.Contains(txt, "hiecm.error.abdm-1035") {
		t.Errorf("concise search lost the hit: %s", txt)
	}
}

func TestSearchWithNoQueryLists(t *testing.T) {
	sess := connect(t, false, nil)
	if txt := callText(t, sess, "search", map[string]any{"type": "error"}); !strings.Contains(txt, "hiecm.error.abdm-1035") {
		t.Errorf("an empty query with a type filter must list atoms: %s", txt)
	}
}
```

In `mcp/internal/route/route_test.go`, change every expected tool list to the new names: `search_docs` becomes `search`; `get_operation` becomes `get`; a path-shaped operation ref now adds nothing (the model calls `search` with `kind: operation`), so drop `list_operations` from those expectations; `validate_request` becomes `validate`.

Append to `mcp/internal/chat/loop_test.go`:

```go
func TestSourcesComeFromTheNewToolNames(t *testing.T) {
	var got []Source
	collectSources(&got, "get", map[string]any{"id": "hiecm.error.abdm-1035", "title": "T", "doc_url": "/d"})
	collectSources(&got, "get", map[string]any{"id": "m1_post_profile_verify", "title": "Op"})
	if len(got) != 1 || got[0].ID != "hiecm.error.abdm-1035" {
		t.Fatalf("get must cite atoms and only atoms: %+v", got)
	}
}
```

- [x] **Step 2: Run them and see them fail**

Run: `cd mcp && go test ./internal/server ./internal/route ./internal/chat`
Expected: FAIL: `idKind` and `concise` undefined; the new tool names missing; route expectations differ; `collectSources` ignores `get`.

- [x] **Step 3: Write `tools_six.go`**

```go
package server

// The six tools. Each delegates to the Tools method the old tool used, so a
// consolidated call returns exactly what the old one did.

import (
	"context"
	"fmt"
	"regexp"
	"strings"
)

type searchSixIn struct {
	Query          string `json:"query,omitempty" jsonschema:"what you are looking for, in your words; leave empty with filters to list"`
	Kind           string `json:"kind,omitempty" jsonschema:"atom (default), operation or fhir_profile"`
	Type           string `json:"type,omitempty" jsonschema:"atom type filter, one of: concept, flow, endpoint, callback, error, test, glossary, decision, fhir, sandbox, troubleshooting"`
	Milestone      string `json:"milestone,omitempty" jsonschema:"atom milestone filter, M1 to M4"`
	Module         string `json:"module,omitempty" jsonschema:"operation module filter, one of gateway, m1, m2, m3, m4, p1, p2, p3, p4, scan-and-register, scan-and-pay, record-share"`
	Limit          int    `json:"limit,omitempty" jsonschema:"max results, default 10, cap 25"`
	ResponseFormat string `json:"response_format,omitempty" jsonschema:"concise (default): id, type, title, url, short summary; detailed: adds snippet and related ids"`
}

type getSixIn struct {
	ID string `json:"id" jsonschema:"an atom id (hiecm.error.abdm-1035), an operationId (m1_post_profile_verify), fhir:<profile> (fhir:OPConsultRecord) or fhir-example:<hiType> (fhir-example:OPConsultation)"`
}

type validateSixIn struct {
	Kind        string `json:"kind" jsonschema:"request or fhir"`
	OperationID string `json:"operation_id,omitempty" jsonschema:"kind request: the operationId"`
	Body        string `json:"body,omitempty" jsonschema:"kind request: the candidate request body as raw JSON"`
	BundleJSON  string `json:"bundle_json,omitempty" jsonschema:"kind fhir: the FHIR document bundle as a JSON string"`
	RecordType  string `json:"record_type,omitempty" jsonschema:"kind fhir: optional expected ABDM hiType, for example OPConsultation"`
}

var atomIDRe = regexp.MustCompile(`^(hiecm|nhcx|uhi|shared)\.[a-z]+\.[a-z0-9-]+$`)

// idKind reads which store an id belongs to from its shape alone.
func idKind(id string) string {
	switch {
	case strings.HasPrefix(id, "fhir-example:"):
		return "fhir_example"
	case strings.HasPrefix(id, "fhir:"):
		return "fhir_profile"
	case atomIDRe.MatchString(id):
		return "atom"
	default:
		return "operation"
	}
}

// concise keeps five fields per hit so ten hits stay under 4,000 characters.
func concise(out map[string]any) map[string]any {
	hits, _ := out["hits"].([]map[string]any)
	slim := make([]map[string]any, 0, len(hits))
	for _, h := range hits {
		s, _ := h["summary"].(string)
		if len(s) > 160 {
			s = s[:157] + "..."
		}
		slim = append(slim, map[string]any{"id": h["id"], "type": h["type"], "title": h["title"], "doc_url": h["doc_url"], "summary": s})
	}
	out["hits"] = slim
	return out
}

func (t *Tools) Search(ctx context.Context, in searchSixIn) (map[string]any, error) {
	switch in.Kind {
	case "", "atom":
		if strings.TrimSpace(in.Query) == "" {
			refs, err := t.r.ListAtoms(in.Type, in.Milestone)
			if err != nil {
				return nil, err
			}
			return t.versioned(map[string]any{"atoms": atomRefsJSON(refs)}), nil
		}
		out, err := t.SearchDocs(ctx, searchIn{Query: in.Query, Type: in.Type, Milestone: in.Milestone, Limit: in.Limit})
		if err != nil || in.ResponseFormat == "detailed" {
			return out, err
		}
		return concise(out), nil
	case "operation":
		return t.ListOperations(ctx, listOpsIn{Module: in.Module, Q: in.Query})
	case "fhir_profile":
		return t.ListFHIRProfiles(ctx, emptyFhirIn{})
	default:
		return nil, fmt.Errorf("kind %q is not one of atom, operation, fhir_profile", in.Kind)
	}
}

func (t *Tools) Get(ctx context.Context, in getSixIn) (map[string]any, error) {
	switch idKind(in.ID) {
	case "atom":
		return t.GetAtom(ctx, getAtomIn{ID: in.ID})
	case "fhir_profile":
		return t.GetFHIRProfile(ctx, getFhirProfileIn{Profile: strings.TrimPrefix(in.ID, "fhir:")})
	case "fhir_example":
		return t.GetFHIRExample(ctx, getFhirExampleIn{RecordType: strings.TrimPrefix(in.ID, "fhir-example:")})
	default:
		return t.GetOperation(ctx, getOpIn{OperationID: in.ID})
	}
}

func (t *Tools) Validate(ctx context.Context, in validateSixIn) (map[string]any, error) {
	switch in.Kind {
	case "request":
		return t.ValidateRequest(ctx, validateIn{OperationID: in.OperationID, Body: in.Body})
	case "fhir":
		return t.ValidateFHIR(ctx, validateFhirIn{BundleJSON: in.BundleJSON, RecordType: in.RecordType})
	default:
		return nil, fmt.Errorf("kind %q is not one of request, fhir", in.Kind)
	}
}

// deprecated is the description an old tool name carries for its last release.
func deprecated(repl, desc string) string {
	return "Deprecated alias for `" + repl + "`; removed in the next release. " + desc
}
```

`atomRefsJSON` is used by the `list_atoms` handler in `mcp.go`; if it is declared inside `NewMCPServer`, move it to package level first. `versioned` is already a `Tools` method (`ChatToolsFor` uses it).

- [x] **Step 4: Move FHIR validation onto `Tools`**

In `mcp.go`, cut the `digestsOnce`/`digestsCache`/`digestsErr` variables, `loadAllDigests`, the `validateFhirIn` type and the body of the `validate_fhir` handler. In `tools.go`, add to the `Tools` struct:

```go
	digestsOnce  sync.Once
	digestsCache map[string]*fhir.ProfileDigest
	digestsErr   error
```

and add the type and two methods:

```go
type validateFhirIn struct {
	BundleJSON string `json:"bundle_json" jsonschema:"the FHIR document bundle to check, as a JSON string"`
	RecordType string `json:"record_type,omitempty" jsonschema:"optional expected ABDM hiType, for example OPConsultation"`
}

func (t *Tools) digests() (map[string]*fhir.ProfileDigest, error) {
	t.digestsOnce.Do(func() {
		summaries, err := t.r.ListFHIRProfiles()
		if err != nil {
			t.digestsErr = err
			return
		}
		m := make(map[string]*fhir.ProfileDigest, len(summaries))
		for _, sm := range summaries {
			d, err := t.r.GetFHIRProfile(sm.ProfileName)
			if err != nil {
				t.digestsErr = err
				return
			}
			m[sm.ProfileName] = d
		}
		t.digestsCache = m
	})
	return t.digestsCache, t.digestsErr
}

// ValidateFHIR is the old validate_fhir handler body: loadAllDigests(r)
// becomes t.digests(), versioned(...) becomes t.versioned(...), and it
// returns the map it used to pass to jsonResult.
func (t *Tools) ValidateFHIR(ctx context.Context, in validateFhirIn) (map[string]any, error) {
	if len(in.BundleJSON) > 2<<20 {
		return t.versioned(map[string]any{"error": "bundle exceeds the 2 MiB limit"}), nil
	}
	digests, err := t.digests()
	if err != nil {
		return nil, err
	}
	findings := fhir.Validate([]byte(in.BundleJSON), in.RecordType, digests)
	// then the old handler's remaining lines, unchanged, ending in
	// `return <the map>, nil` instead of `return jsonResult(<the map>)`
}
```

The `validate_fhir` alias handler becomes:

```go
	}, func(ctx context.Context, req *mcp.CallToolRequest, in validateFhirIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.ValidateFHIR(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})
```

- [x] **Step 5: Register the six and mark the eleven**

In `NewMCPServer` in `mcp.go`, before the existing registrations:

```go
	readOnly := &mcp.ToolAnnotations{ReadOnlyHint: true}

	mcp.AddTool(s, &mcp.Tool{Name: "search", Annotations: readOnly, InputSchema: mustSchemaFor[searchSixIn](),
		Description: "Find catalogue atoms, API operations or FHIR profiles. Use kind: atom (default) for concepts, errors, flows and glossary terms; kind: operation for an endpoint by what it does or its path; kind: fhir_profile to list profiles. Leave query empty with type or milestone to list atoms. Returns ids to pass to get; response_format concise (default) keeps each hit to id, type, title, url and a short summary.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in searchSixIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.Search(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})
	mcp.AddTool(s, &mcp.Tool{Name: "get", Annotations: readOnly, InputSchema: mustSchemaFor[getSixIn](),
		Description: "Read one item in full by id. The id's shape picks the kind: an atom id (hiecm.error.abdm-1035), an operationId (m1_post_profile_verify), fhir:<profile> or fhir-example:<hiType>. Use search first when you do not have an id.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getSixIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.Get(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})
	mcp.AddTool(s, &mcp.Tool{Name: "related", Annotations: readOnly, Description: relatedAtomsDescription},
		func(ctx context.Context, req *mcp.CallToolRequest, in getAtomIn) (*mcp.CallToolResult, any, error) {
			out, err := tools.RelatedAtoms(ctx, in)
			if err != nil {
				return notFoundOrErr(err)
			}
			return jsonResult(out)
		})
	mcp.AddTool(s, &mcp.Tool{Name: "validate", Annotations: readOnly, InputSchema: mustSchemaFor[validateSixIn](),
		Description: "Check a candidate before you send it. kind: request checks a request body against its operation's schema; kind: fhir checks a FHIR document bundle against the pinned NRCES profiles and ABDM rules. Findings name locations and fixes.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in validateSixIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.Validate(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})
```

Then, on the existing registrations: add `Annotations: readOnly` to `decode_error` and `catalogue_info` (their names stay), and wrap the `Description` of the eleven old tools with `deprecated(...)` using the Interfaces table's replacement, for example `Description: deprecated("search", searchDocsDescription)` and `Description: deprecated("get", getAtomDescription)`. Change the `NewMCPServer` doc comment to "wires six tools and, for one release, eleven deprecated aliases".

In `notFoundOrErr`, change the message suffix to `". Use search to find valid ids, then get with an id from its results."`, and return an `isError` result rather than a Go error for the `kind` errors, by adding before the `NotFoundError` check:

```go
	if strings.HasPrefix(err.Error(), "kind ") {
		return &mcp.CallToolResult{IsError: true, Content: []mcp.Content{&mcp.TextContent{Text: err.Error()}}}, nil, nil
	}
```

- [x] **Step 6: The chat surface and the router**

In `tools.go`, `lookupIn` gains:

```go
	Kind string `json:"kind,omitempty" jsonschema:"atom (default) or operation: use operation to find an endpoint by what it does or its path"`
```

Replace the entries in `Defs()` with the five chat-visible new tools, `search`, `get`, `related`, `decode_error` and `catalogue_info`, each unmarshalling its input type (`searchSixIn`, `getSixIn`, `getAtomIn`, `decodeIn`, `emptyIn`) and calling `t.Search`, `t.Get`, `t.RelatedAtoms`, `t.DecodeError`, `t.CatalogueInfo` exactly as the old entries called theirs. Update the `Defs` doc comment to list the five.

In `ChatToolsFor`, rename the two special cases. `"search_docs"` becomes `"search"`, and its `Call` gains, before `t.Lookup`:

```go
					if in.Kind == "operation" {
						return t.ListOperations(ctx, listOpsIn{Q: in.Query})
					}
```

`"validate_request"` becomes `"validate"`, keeping its `validateIn` schema and `t.ValidateRequest` call (the chat validates requests only). Update `chatSearchDescription` to add: "Use kind: operation to find an endpoint by what it does or its path."

In `mcp/internal/route/route.go`, replace the tool assembly with:

```go
	r.Tools = []string{"search"}
	if len(r.ErrorCodes) > 0 || (r.Shape == Diagnose && r.OperationRef == "") {
		r.Tools = append(r.Tools, "decode_error")
	}
	// A path-shaped ref is found with search, kind operation; an exact
	// operationId is read with get.
	if r.OperationRef != "" && !strings.HasPrefix(r.OperationRef, "/") {
		r.Tools = append(r.Tools, "get")
	}
	if in.HasAttachment {
		r.Tools = append(r.Tools, "validate")
	}
```

In `mcp/internal/chat/loop.go`, add `var atomIDRe = regexp.MustCompile(`^(hiecm|nhcx|uhi|shared)\.[a-z]+\.[a-z0-9-]+$`)` (package `chat` cannot import `server`), and make `collectSources`:

```go
	switch name {
	case "get":
		if id, _ := result["id"].(string); atomIDRe.MatchString(id) {
			addSource(sources, sourceFromFields(result))
		}
	case "search":
		// the old "search_docs" case body, unchanged
	}
```

In `systemPromptTemplate`, replace the two bullets under `WHERE THINGS LIVE` with:

```text
- Atoms are the written knowledge: concepts, flows, endpoint guides, callbacks, error explanations, tests, glossary entries, decisions, FHIR mappings, sandbox notes and troubleshooting guides. search finds them.
- Operations are the raw API surface parsed from NHA's specification files, across the modules gateway, m1, m2, m3, m4, p1, p2, p3, p4, scan-and-register, scan-and-pay and record-share. search with kind operation finds them by what they do or by path; get with an operationId reads one in full.
```

Change the start of `lookFirst` to: `Before answering, use your tools: search for a term, a concept or an error, search with kind operation for an endpoint, decode_error for a code.` and keep the rest. Then run `grep -n "search_docs\|get_atom\|list_operations\|get_operation\|related_atoms\|validate_request" internal/chat/*.go` and rename every remaining occurrence outside tests.

- [x] **Step 7: Run the tests, regenerate goldens, review the diff**

Run: `cd mcp && go build ./... && go test ./internal/server ./internal/route ./internal/chat && go test ./internal/server -run TestGolden -update && go test ./...`
Expected: PASS. In the golden diff, check: only tool names, descriptions and annotations changed; no result payload of an old tool changed.

- [ ] **Step 8: Run the gate and agent task 2**

```bash
mcp/eval/gate.sh before-six-tools   # on main, before this branch
mcp/eval/gate.sh after-six-tools    # on this branch
python3 mcp/eval/compare.py mcp/eval/results/before-six-tools.json mcp/eval/results/after-six-tools.json
node scripts/eval-agent.mjs --model haiku --task 2
```

Expected: `compare.py` exits 0 (the eval calls `/api/search`, which this task does not change, so a fall means something else moved); agent task 2 passes, or fails the same way it does on `main` (it has been flaky on Haiku, so run `main` once for comparison). Paste both outputs in the PR.

- [x] **Step 9: Docs and skills in the same PR**

- `mcp/README.md` and the tool table in `plan/abdm-v1-phase1-architecture-and-plan.md`: replace the thirteen rows with the six from the Interfaces table and add "The eleven old names are deprecated aliases for one release." Run `./scripts/plan-check.sh`; if it names skills compiled from the plan, rebuild them as it says.
- `plugins/abdm-contributors-assistant/skills/support-agent/SKILL.md`, `scalar-docs/SKILL.md`, `openapi-ingest/SKILL.md`: replace each old tool name with its new one per the table.
- `skills-src/fhir-audit/SKILL.md` and `skills-src/fhir-generate/SKILL.md`: `validate_fhir` becomes `validate` with `kind: fhir`; `get_fhir_profile` and `get_fhir_example` become `get` with a `fhir:` or `fhir-example:` id. Then run `node scripts/build-skills.mjs`.
- `plugins/nhcx/skills/**` also name old tools, but they are ported from the NHCX package; the aliases keep them working this release. Raise the rename with the package's owner so it lands before the aliases go.
- Bump the patch version of `plugins/abdm-contributors-assistant` and `plugins/abdm-integrators-assistant`, run `npm run build:plugins`, and confirm `npm run -s check:plugin-version check:plugins` pass.

- [x] **Step 10: Commit**

```bash
git add mcp plan plugins skills-src site/static/skills
git commit -m "mcp: six tools, read-only; the eleven old names are deprecated aliases for one release"
```

### Task 11: The indexer and lint understand atom contract v2

**Starts:** after Task 10. The lint and loader changes apply to all atoms now, but with `operation`, `side`, `status` and `facts` optional on NHCX atoms until the atoms plan's owner decision 1; Step 3's fill of the 68 endpoint and callback atoms (all NHCX) runs only after that decision says this repository is the source.

**Files:**
- Modify: `scripts/lint-atoms.mjs`, `mcp/internal/catalogue/atom.go`, `mcp/internal/catalogue/load.go`, `mcp/internal/index/writer.go`, `mcp/internal/index/search.go`
- Test: `scripts/lint-atoms.test.mjs` (create if absent), `mcp/internal/catalogue/atom_test.go`, `mcp/internal/index/search_test.go`

**Interfaces:**
- `lint:atoms` enforces sections per type (contract v2 table), `operation` resolving to an operationId in `catalogue/openapi/<gateway>/` for endpoint and callback atoms, `side` in the allowed set, `status` in the allowed set, and every `facts[].source` an index into `sources`. A hand-written atom missing `operation` fails; run `scripts/derive-operation.mjs` (Step 3) once to fill them from titles.
- `Atom` gains `Operation, Side, Status string` and `Facts []Fact{Key, Value string; Source int}`. `SearchIn` gains a `side` filter and excludes `status: deprecated` unless `includeDeprecated` is set. `get` returns `facts` and `operation`. `related_atoms`/`related` includes the operation's other atoms.
- `catalogue_info` reports `facts` count and `deprecated` count.

- [x] **Step 1: Write the failing tests**

```js
// scripts/lint-atoms.test.mjs
test('an endpoint atom needs an operation that resolves', () => { /* assert fail message names the atom and "operation" */ });
test('an error atom needs only In plain words and When it goes wrong', () => { /* no failure for a two-section error atom */ });
test('a fact source must index into sources', () => { /* source: 5 with two sources fails */ });
```

```go
// atom_test.go
func TestFrontmatterCarriesContractV2Fields(t *testing.T) { /* parse an atom with operation, side, status, facts; assert each */ }
// search_test.go
func TestDeprecatedAtomsAreHiddenByDefault(t *testing.T) { /* status: deprecated atom absent unless includeDeprecated */ }
func TestSideFilter(t *testing.T) { /* side: payer excludes provider atoms */ }
```

- [x] **Step 2: Run them and see them fail**

- [ ] **Step 3: Implement, then fill `operation` on the 68 endpoint and callback atoms**

`scripts/derive-operation.mjs`: for each endpoint or callback atom without `operation`, match `METHOD /path` from the title against the gateway's spec (reuse `rekey-verification.mjs` `pattern`), write `operation:` into the frontmatter, and list the ones that match nothing. Fix those by hand.

- [x] **Step 4: Run every gate, run the eval, commit**

Run: `npm run -s lint:atoms test:scripts && (cd mcp && go test ./...) && (the gate with name contract-v2)`
Expected: PASS; `compare.py` exits 0.

```bash
git add scripts mcp catalogue
git commit -m "atoms: contract v2, operation join, per-type sections, facts, side and status"
```

### Task 12: Error atoms become records

**Deferred.** Starts only after the atoms plan's owner decision 1 says this repository is the NHCX source; all 310 files are NHCX and the next port would overwrite them. If the decision is to keep porting, do this in the NHCX package upstream instead.

310 atoms, 153,000 words, the same "Before you start" paragraph 310 times. Under contract v2 an error is `In plain words`, `When it goes wrong` and a `facts` block. This is a content change on hand-written files, done by script with a human reading the diff, and it happens before class 6 so that class migrates records, not essays.

**Files:**
- Create: `scripts/compact-errors.mjs`
- Test: `scripts/compact-errors.test.mjs`
- Modify: `catalogue/nhcx/errors/*.md`, `catalogue/hiecm/errors/*.md` (if any)

**Interfaces:**
- Produces: `compactError(md: string, spec: {code, message, httpStatus, operationId}) -> string`: keeps frontmatter, adds `facts` (`code`, `message`, `http_status`, `returning_operation`, `retryable` when the body states it), keeps `## In plain words` and `## When it goes wrong` verbatim, drops the other three sections, and appends any sentence from a dropped section that contains an API literal or an error code to `## When it goes wrong` so `report:migration`-style literal checks pass. Returns the input unchanged if the atom is not `type: error`.
- Produces: `literalsKept(before, after) -> string[]` reusing `apiLiterals` from Task 5; must be empty.

- [ ] **Step 1: Write the failing tests**

```js
test('a boilerplate section goes, a literal-bearing sentence from it stays', () => { /* assert dropped "Before you start" heading, kept sentence with `/v1/claim/on_submit` under When it goes wrong */ });
test('facts are filled from the spec row', () => { /* assert facts contain http_status and returning_operation */ });
test('no api literal is lost', () => { assert.deepEqual(literalsKept(before, after), []); });
```

- [ ] **Step 2: Run them and see them fail**

- [ ] **Step 3: Implement, run over the error folders, read the diff of ten atoms by hand**

Run: `node scripts/compact-errors.mjs && git diff --stat catalogue/*/errors | tail -1 && npm run -s lint:atoms`
Expected: about 310 files changed; word count of `catalogue/nhcx/errors` falls by roughly half; lint passes.

- [ ] **Step 4: Run the eval, commit**

Expected: eval `by_gateway.nhcx` holds or improves (the eight NHCX cases were written the way an integrator describes the problem, and fewer identical chunks compete). Bump the nhcx plugin version.

```bash
git add scripts/compact-errors.mjs scripts/compact-errors.test.mjs catalogue plugins
git commit -m "errors: records with facts and two sections, not essays with five"
```

### Task 13: Retrieval enrichment, generated on content change

**Deferred.** Starts only when Bedrock credentials exist, and ships with: a CI check that fails when an atom's content hash differs from the hash in its enrichment file (stale enrichment is a new drift source), and a human read of the generated text for every atom before it is indexed.

**Files:**
- Create: `scripts/enrich-atoms.mjs`, `scripts/lib/enrich.mjs`
- Create (generated): `catalogue/generated/enrich/<id>.yaml`
- Test: `scripts/lib/enrich.test.mjs`
- Modify: `mcp/internal/catalogue/load.go`, `mcp/internal/catalogue/chunk.go`, `.github/workflows/` (a scheduled job, not on every PR), `CLAUDE.md`

**Interfaces:**
- Produces: `needsEnrichment(atom, existing: {hash} | null) -> boolean` (sha256 of frontmatter summary plus body differs).
- Produces: `enrichmentPrompt(atom) -> string` and `parseEnrichment(text) -> {questions: string[], context: string}` with `3 <= questions.length <= 8` and `context` between 40 and 120 words, else rejected.
- The job calls Bedrock (same credential chain as the chat) with prompt caching on the atom, writes `{id, hash, model, questions, context}` per atom, and opens a PR. It never runs on a PR and never fails one.
- The loader reads `enrich/<id>.yaml` when present. `ChunkAtom` prepends `context` after the breadcrumb on every chunk and emits one extra chunk `Heading: "questions"` with the questions joined by newlines. Absent enrichment changes nothing.

- [ ] **Step 1: Write the failing tests**

```js
test('an unchanged atom is not re-enriched', () => { /* same hash -> false */ });
test('an enrichment outside the size bounds is rejected', () => { /* 2 questions -> throws; 200-word context -> throws */ });
```

```go
func TestEnrichmentContextPrecedesEveryChunk(t *testing.T) { /* atom with Enrichment set: every chunk's second line is the context; one chunk has Heading "questions" */ }
```

- [ ] **Step 2: Run them and see them fail**

- [ ] **Step 3: Implement; run the job by hand once over the HIE-CM atoms only**

Expected: about 90 yaml files under `catalogue/generated/enrich/`. Read ten. A question that could not be answered from the atom is a prompt bug: fix the prompt, not the file.

- [ ] **Step 4: Eval with and without, commit**

Run the eval twice: once with the enrich files present, once with them removed (`git stash`). Keep the task only if `mrr` improves; Anthropic reports a 35% to 49% failure reduction from this technique, so a flat result means the prompt or the parse is wrong.

```bash
git add scripts catalogue/generated/enrich mcp .github CLAUDE.md
git commit -m "index: generated questions and context ride with every atom, regenerated only when it changes"
```

### Task 14: The source watcher opens the correction PR

**Deferred.** A new scheduled pipeline; starts after the atoms plan's runbook (its Task 0.3) has been used for at least one real NHA correction, so the PR format answers what that person actually needed.

Every source carries a URL, a file, a sha256 and a fetch date. The runbook (atoms plan Task 0.3) has a human find the section for each correction. This job finds it for them.

**Files:**
- Create: `scripts/watch-sources.mjs`, `.github/workflows/watch-sources.yml` (weekly)
- Test: `scripts/watch-sources.test.mjs`

**Interfaces:**
- Produces: `changedSources(atoms) -> {url, file, oldHash, newHash, citingAtoms: string[]}[]` after refetching every distinct `sources[].url` that is fetchable (skip `file`-only sources) and hashing the body.
- Produces: `prBody(changes) -> string`: one section per changed source, the citing atoms as links to their pages (from `registry.json` url or `atom-routes.json`), the diff of the fetched text if the source is text, and for a PDF or docx the page count delta.
- The job refetches, updates `.raw/`, bumps `fetched` and `hash` in the citing atoms' frontmatter (hand-written) or map entries, and opens one PR titled `sources: <n> upstream documents changed`. It changes no prose. A human applies the correction on the page per the runbook; the PR is the list of where to look.

- [ ] **Step 1: Write the failing tests**

```js
test('a source whose hash changed lists every atom citing it', () => { /* two atoms cite the same file; one changed hash -> both listed */ });
test('the PR body links each citing atom to its page', () => { /* assert url present */ });
```

- [ ] **Step 2: Run them and see them fail**

- [ ] **Step 3: Implement; run once with `--dry-run` and read the output**

- [ ] **Step 4: Add the workflow, update the runbook, commit**

The runbook step 1 becomes: "Open the latest `sources:` PR. Each changed document lists the pages that cite it."

```bash
git add scripts/watch-sources.mjs scripts/watch-sources.test.mjs .github/workflows/watch-sources.yml docs/runbook-nha-corrections.md
git commit -m "sources: a weekly job finds what NHA changed and lists the pages that cite it"
```

### Task 15: Discovery

**Files:**
- Create: `site/static/.well-known/mcp.json`
- Modify: `mcp/README.md`, `deploy/nha/` (a registry entry file, submitted by hand)

- [x] **Step 1: Write `.well-known/mcp.json`** naming the `/mcp` endpoint, transport `streamable-http`, no auth, and the six tool names.
- [x] **Step 2: Add the `Accept: text/markdown` note** to `mcp/README.md` if the site already serves per-page `.md` copies (it does, via `emit-page-markdown`), so agents that read pages directly know the route.
- [ ] **Step 3: Submit the registry entry** at registry.modelcontextprotocol.io once NHA's domain is live; record the submission in `deploy/nha/README.md`.

```bash
git add site/static/.well-known/mcp.json mcp/README.md deploy/nha/README.md
git commit -m "mcp: discoverable at .well-known/mcp.json"
```

---

