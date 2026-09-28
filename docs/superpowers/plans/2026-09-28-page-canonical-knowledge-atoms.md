# Page-Canonical Knowledge Implementation Plan (atoms revision, 2026-09-28)

> Revision note: this version folds in the atom-structure recommendations from the 2026-09-28 reviews, cut to what removes drift. Changes are marked **[rev]**: a self-link lint for `related` (4e), plain-markdown generated bodies (4f), a deadline and abort rule, defaults for the owner decisions, a rehearsal of a real correction (6b), and a per-case retrieval check for class PRs once the retrieval plan's eval exists. Atom contract v2 (operation join, per-type sections, facts, side, status) and error records live only in the retrieval plan, `2026-09-28-docs-mcp-retrieval-layer.md` (its Tasks 11 and 12), so no work is planned twice. Task numbers are kept from earlier revisions; gaps are intentional.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every fact the portal publishes is written once, on a docs page. An atom is no longer a file anyone writes: it is a stable id in the atom registry, `catalogue/map.yaml`, pointing at the page section that holds its words.

**End state, in one sentence:** facts live only on pages; `catalogue/map.yaml` maps each atom id to `page#heading-id`; every atom file the MCP server, the skill compiler and the linter read is generated from the page, and no hand-written atom file holds prose.

**Architecture:** A page section is addressed by an explicit Docusaurus heading id, `### Link token {#link-token}` in a `.md` page and `### Link token {/* #link-token */}` in an `.mdx` page (MDX parses a bare `{#id}` as an expression and the build fails), which survives any rewording of the heading and is already a citable URL. Content only agents need sits in `<AgentOnly>` on the same page, as Mintlify's `<Visibility for="agents">` and Fern's `<llms-only>` do: hidden from readers by default and left out of site search, but present in the built HTML, so the page's `.md` copy, llms-full.txt and every generated atom carry it. A small "Show notes for AI agents" link in the site footer, or `?agent-notes=1` on any URL, reveals them for anyone who wants to check. NHA is not asked to review them; CI keeps them from stating anything the page and the specs do not. `scripts/build-sections.mjs` reads the map and the pages and writes atom-shaped files into `catalogue/generated/`, which every existing consumer (the Go indexer, `build-skills.mjs`, `validate-skills.mjs`, `lint-atoms.mjs`) already walks, so no consumer changes. Content migrates one class at a time; a class is never in two places.

**Tech Stack:** Docusaurus 3 (`markdown.format: 'detect'`), Node ESM scripts with `node:test`, YAML, Go (`mcp/`, unchanged in Phase 1), GitHub Actions.

**Spec:** the council-reviewed design in "Target design" below. The owner asked for no decision record.

## As built (2026-09-28, branch `feat/page-canonical-atoms`)

Phase 0 and Phase 1 are committed, except Task 6 Step 6's in-browser toggle check and Task 6b, which needs the person the runbook names. Every gate in the Global Constraints passes. Where the build differed from this plan:

- **Task 0.1.** The plan's prompt text took the core prompt to 787 words against the 720-word budget test in `loop_test.go`, and main sat at exactly 720. Both rules are restated in the old paragraph's 43 words.
- **Task 0.2.** 10 of 65 records match no operation in the HIE-CM specifications and are in `catalogue/verification/retired/`, including the two 2xx records for `certs` and `.well-known/openid-configuration`, which the specifications do not define. 55 rekeyed: 4 succeeded, 51 failed, not 6 and 59. The NHCX skill routers stamp the record count, so they were restamped and the nhcx plugin moved to 1.0.1. `verify-atoms.mjs` shares `loadOps` and `rekey` with the rekey script.
- **Task 0.3.** `/docs/` is gitignored, so the runbook is force-added, as the plans are.
- **Task 1.** The postman and API sample tests read gitignored build outputs, so CI runs `build-api-reference` and `build-postman` before `test:scripts`.
- **Task 2.** The `htmlToMarkdown` test uses the test file's `page()` helper; a bare `<article>` is never read.
- **Task 4e.** Eight NHCX endpoint atoms list themselves. The self-link rule skips `gateway: nhcx` until owner decision 1, so `lint:atoms` stays green without editing merged-in files.
- **Task 4f.** The plan's `plainMarkdown` flagged `{"a": 1}` inside a code fence, failing its own test. It now skips fenced lines and inline code, and `renderAtom` calls it directly.
- **Task 6.** `{#link-token}` broke the `.mdx` build; the page uses `{/* #link-token */}` and `sectionsById` reads both forms. `lint:content`'s glossary grid rule failed on the note, so a shown note spans the whole grid row and the rule skips `<AgentOnly>`. The migration report's one missing literal was a site link, dropped with a stated reason. The compiled integrator skills came out byte-identical, so that plugin kept its version; the contributor plugin moved to 0.3.1.
- **Task 6b, dry run only.** Run on 2026-09-28 by the plan's implementer, not the named owner, so the human rehearsal is still open. The correction "valid for six months from generation" was applied by the runbook and reverted: the heading id and the agent note survived, the generated atom took the new wording, and `build:sections`, `check:sections` and `lint:content` passed. It found three things a successor would trip on, all fixed: the missing-id message told an `.mdx` editor to write `{#id}`, which breaks the build; a missing id also produced a false "has no map entry" line; and the runbook never said to commit what `build:sections` regenerates.
- **Plan and plugin.** `plan/` moved to 2026.09.28-2, marked breaking because done criterion 1 changed, with the four compiled skills recompiled. The contributor plugin's authoring, review, linting, verification and status guidance now describe migrated atoms, agent notes and operation-keyed sandbox records.

## Global Constraints

- Never write an em dash anywhere: pages, generated files, scripts, commit messages.
- Generated files are never hand-edited: everything already listed in `CLAUDE.md`, plus `catalogue/generated/**` and `catalogue/registry.json` from Task 4.
- Every atom id that exists today keeps resolving at every commit. Evals (84 case files), installed skills, MCP `get_atom`/`related_atoms` and `validate:skills` cite them. A migrated id resolves through its generated file.
- One source per atom: an id is either a hand-written file or a `map.yaml` entry, never both. CI fails otherwise.
- `<AgentOnly>` is JSX, so a page gains one only if it is `.mdx`. Heading ids and map entries work on `.md` pages and need no conversion. Converting a page to `.mdx` breaks on literal `<` and `{` in prose; a conversion is its own commit, followed by `npm run build` with no errors before any content moves.
- An `<AgentOnly>` note may narrow or restate what the page and the specs say. It never introduces an API literal (anything in backticks) that appears in neither. CI enforces this.
- Agent notes are hidden by CSS, never by leaving them out of the HTML, because `scripts/emit-page-markdown.mjs` builds llms-full.txt and each page's `.md` copy from the built HTML. They are excluded from site search, and shown only when `<html data-agent-notes="shown">` is set by the toggle or `?agent-notes=1`.
- NHA does not review agent notes. That makes the CI rule below their only guard besides the person editing the page, so it is never relaxed.
- Every commit passes: `npm run lint:atoms lint:content validate:skills check:routes check:specs check:plugins`, `npm run test:scripts`, `npm run check:sections` (from Task 4), `./scripts/plan-check.sh`, `cd mcp && go test ./...`.
- `plan/`, `CLAUDE.md` and the contributor plugin's skills are updated in the same PR as the change that makes them wrong, not in a final phase.
- **[rev]** No `related` list names its own atom. `lint:atoms` already fails an id no atom defines; Task 4e adds the self-link rule for hand-written atoms and map entries.
- **[rev]** A generated atom body carries plain markdown: no JSX, no import line, no relative anchor. `build-sections` rewrites `[x](#id)` to an absolute URL and fails on any `<Tag` other than `<AgentOnly>` (Task 4f).
- **[rev]** Once Task R1 of the retrieval plan (its fixed eval) is merged, every class PR also runs that eval before and after on the same case set, with at least one case per migrated atom added before the before-run. The gate is per case: no case expecting a migrated atom may fall in rank. It is a local run with both result files pasted in the PR, not a CI job. Until then, the keyword ranking test (Task 6) and `report:migration` are the gate.
- **[rev]** Work on NHCX hand-written atoms waits for owner decision 1: if NHCX stays ported from its package, the next port overwrites any edit made here.

## Review Focus

1. **A hidden agent note must still reach agents, and must not surface in site search.** Pinned by Task 2's `htmlToMarkdown` test and Task 6's search and toggle checks.
2. **Rewording a heading must not move its section or break its atom.** Pinned by Task 3's "rewording a heading keeps its id" test.
3. **Renaming or deleting a heading id that the map uses must fail CI and name the atom.** Pinned by Task 4's missing-heading-id test.
4. **An atom written in two places must fail CI.** Pinned by Task 4's one-source test.
5. **An agent note that adds a fact no page or spec states must fail CI.** Pinned by Task 4's agent-literal test.
6. **[rev] No atom lists itself as related, on a page or in a file.** Pinned by Task 4e's tests.
7. **[rev] Page markup must not leak into what the bot reads and quotes.** Pinned by Task 4f's plain-markdown tests.

---

## Target design

### The pieces

| Piece | What it is | Who edits it |
|---|---|---|
| Page section with `{#heading-id}` | The only copy of the words, visible to readers | People, including whoever applies NHA's corrections |
| `<AgentOnly>` on the page | Rules, exit conditions and failure modes for agents. Hidden from readers and search by default; shown by a small footer link or `?agent-notes=1` | People editing the page; not reviewed by NHA |
| `catalogue/map.yaml` | The atom registry: id, type, title, summary, page, heading id, public URL, related ids. No prose | People, only when an atom is added, moved or retired |
| `catalogue/generated/**` | Atom-shaped files built from map plus page, read by every existing consumer | Only `build-sections.mjs` |
| `catalogue/registry.json` | Every atom id, hand-written or migrated, with its source and URL. No prose | Only `build-sections.mjs` |

### How a generated atom is built

`## In plain words` is the section's visible text. The other four sections come from labelled paragraphs inside `<AgentOnly>`: `**Before you start.**`, `**What happens.**`, `**How you know it worked.**`, `**When it goes wrong.**`. A section with no content is left out, not filled with placeholder text: the indexer makes one retrieval chunk per `##` section, and hundreds of identical filler chunks would compete in search. `lint-atoms` accepts the missing sections on files marked `generated: true`. An agent paragraph without one of the four labels fails CI. Each generated atom's citation link comes from its `url` in the map, which `build-atom-routes.mjs` reads before any other rule.

### Where each class ends up

| Class | Count | Destination | Blocked on |
|---|---|---|---|
| Shared glossary | 48 | `site/docs/_glossary/_hiecm.mdx`, `_shared.mdx` | nothing |
| HIE-CM concepts | 20 | HIE-CM concept and milestone pages | nothing |
| Shared FHIR, sandbox, concepts, decisions | 14 + 3 + 4 + 2 | FHIR concept pages, getting-started pages | nothing |
| NHCX concepts, flows, glossary, FHIR, sandbox | 30 + 26 + 29 + 16 + 8 | `site/docs/nhcx/v1/**` | the NHCX decision |
| NHCX errors (about 150,000 words) | 310 | One section per code on a per-module error guide, with its own `lint:content` page type and exact-code lookup | the NHCX decision |
| NHCX endpoints and callbacks | 48 + 20 | A notes partial per operation, rendered on its generated API page | the NHCX decision |
| NHCX tests, troubleshooting, decisions | 36 + 6 + 7 | Certification pages, troubleshooting pages, "Choices you make" sections | the NHCX decision |
| Agent methods (deployment interview, codebase survey, refuse-to-guess rules) | about 5 | `skills-src/`, as agent instructions | nothing |

### Decisions only the owner can make, before handover

1. **NHCX source.** NHCX pages are ported from the NHCX package (`generated: true`). Either (a) this repository's NHCX pages become the source and the port stops, or (b) heading ids and `<AgentOnly>` notes are written into the NHCX package upstream. Controls 536 of 634 atoms. No NHCX class migrates until this is decided. **[rev] Default if unanswered at handover:** (a) is not assumed; NHCX stays ported from the package, and classes 5 to 8 do not run under this plan.
2. **Who applies NHA's corrections, and for how many hours a week.** Written into the runbook, Task 0.3. **[rev]** No default: the owner names a person before handover.

### [rev] Deadline and abort

OWNER TO FILL BEFORE HANDOVER: a date and a named owner for this plan.

If class 3 has not merged by that date, no further class migrates. The registry stays hybrid permanently under the Stopping rule below: migrated atoms are edited on their pages, the rest in their `catalogue/` files, and `catalogue/registry.json` says which is which. The runbook states the date, the owner and this rule.

### Stopping rule

At any commit, whatever has migrated stays migrated and whatever has not keeps its hand-written file. The registry covers both, so the repository is coherent if work stops at any point. The runbook says so.

### Proving no harm without credentials

The Ask AI eval needs AWS Bedrock credentials and the agent eval needs ABDM sandbox credentials. Until they exist, every migration PR runs `scripts/migration-report.mjs` (Task 5): every API literal in an atom's old hand-written body must appear in its generated file, or be dropped with a stated reason. Run the real evals once the credentials exist.

---

## Phase 0: Clean base

### Task 0.1: The Ask AI prompt stops describing a verification status

**Files:**
- Modify: `mcp/internal/chat/loop.go` (the `HONESTY ABOUT WHAT YOU FOUND` paragraph of `systemPromptTemplate`)
- Modify: `catalogue/nhcx/README.md` (frontmatter description line)
- Test: `mcp/internal/chat/tooling_prompt_test.go`

- [x] **Step 1: Write the failing test**

Append to `mcp/internal/chat/tooling_prompt_test.go` (add `"strings"` to its imports if absent):

```go
func TestSystemPromptNamesNoVerificationStatus(t *testing.T) {
	for _, banned := range []string{"verified atom", "not verified"} {
		if strings.Contains(systemPromptTemplate, banned) {
			t.Errorf("system prompt still mentions %q; atoms carry no verification status since 2026-09-19", banned)
		}
	}
}

func TestSystemPromptSaysAgentNotesAreForTheAssistant(t *testing.T) {
	if !strings.Contains(systemPromptTemplate, "Notes for AI agents") {
		t.Error("system prompt must tell the assistant that notes for AI agents are instructions to it, not text to repeat to the reader")
	}
}
```

- [x] **Step 2: Run it and see it fail**

Run: `cd mcp && go test ./internal/chat -run 'TestSystemPromptNamesNoVerificationStatus|TestSystemPromptSaysAgentNotesAreForTheAssistant' -v`
Expected: both FAIL, the first naming "verified atom".

- [x] **Step 3: Replace the paragraph**

In `systemPromptTemplate`, replace the two sentences beginning "A verified atom's content is stated plainly." with:

```text
A few operations have a sandbox record. When a tool result includes one for the call you are describing, and its status is 2xx, say the call was observed succeeding in the sandbox on that date. A record with any other status is a failed attempt: never present it as evidence that the call works. Without a record, state what the specification and the docs say, without claiming it was run.
```

In the same template, directly after that paragraph, add:

```text
Some results carry Notes for AI agents: rules written for you, hidden from readers of the page. Use the facts in them and follow them, but do not repeat their instructions to the reader as if they were documentation.
```

In `catalogue/nhcx/README.md`, change "frontmatter (`id`, `type`, `gateway: nhcx`, verification status)" to "frontmatter (`id`, `type`, `gateway: nhcx`, sources)".

- [x] **Step 4: Run the package tests**

Run: `cd mcp && go test ./internal/chat/...`
Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add mcp/internal/chat/loop.go mcp/internal/chat/tooling_prompt_test.go catalogue/nhcx/README.md
git commit -m "chat: the prompt stops describing a verification status atoms no longer carry"
```

### Task 0.2: Rekey the 65 sandbox records to operation ids

All 65 records are HIE-CM, store `request` as a curl string, and carry an HTTP `status`; only 6 are 2xx. Several records hit the same operation, so file names must stay unique.

**Files:**
- Create: `scripts/rekey-verification.mjs`
- Test: `scripts/rekey-verification.test.mjs`
- Modify: `catalogue/verification/*.json` (renamed and rewritten)
- Modify: `scripts/verify-atoms.mjs` (writes the new shape)

**Interfaces:**
- Produces: `catalogue/verification/<operationId>.<on>.<n>.json`, fields `operation`, `outcome` (`"succeeded"` for 2xx, otherwise `"failed"`), `on`, `against`, `request`, `status`, `body`.
- Produces: `parseCurl(curl) -> {method, url}`, `rekey(record, ops) -> record`, `fileNames(records) -> string[]`.

- [x] **Step 1: Write the failing tests**

```js
// scripts/rekey-verification.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {parseCurl, rekey, fileNames} from './rekey-verification.mjs';

const ops = [
  {operationId: 'gateway_get_bridge_service_by_id', method: 'get', path: '/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}'},
  {operationId: 'm1_post_profile_verify', method: 'post', path: '/abha/api/v3/profile/login/verify'},
];
const curl = "curl -X GET 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}' \\\n  -H 'Authorization: Bearer <scrubbed>'";

test('the method and URL come out of the stored curl string', () => {
  assert.deepEqual(parseCurl(curl), {method: 'GET', url: 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}'});
});

test('a record is keyed to its operation and labelled by outcome', () => {
  const out = rekey({atom: 'hiecm.endpoint.x', on: '2026-09-17', request: curl, status: 200, body: ''}, ops);
  assert.equal(out.operation, 'gateway_get_bridge_service_by_id');
  assert.equal(out.outcome, 'succeeded');
  assert.equal(out.atom, undefined);
  assert.equal(rekey({atom: 'x', on: 'd', request: curl, status: 415, body: ''}, ops).outcome, 'failed');
});

test('two records for one operation get two file names, never one', () => {
  const recs = [{operation: 'm1_post_profile_verify', on: '2026-09-17'}, {operation: 'm1_post_profile_verify', on: '2026-09-17'}];
  assert.deepEqual(fileNames(recs), ['m1_post_profile_verify.2026-09-17.1.json', 'm1_post_profile_verify.2026-09-17.2.json']);
});

test('a request that matches no operation is reported, not guessed', () => {
  const bad = "curl -X GET 'https://dev.abdm.gov.in/nowhere'";
  assert.throws(() => rekey({atom: 'x', on: 'd', request: bad, status: 404}, ops), /no operation matches GET \/nowhere/);
});
```

- [x] **Step 2: Run them and see them fail**

Run: `node --test scripts/rekey-verification.test.mjs`
Expected: FAIL, module not found.

- [x] **Step 3: Implement**

```js
// scripts/rekey-verification.mjs
// Rekeys sandbox records from atom ids, which get deleted, to operation ids,
// which come from the specification. A record is labelled by what happened:
// only a 2xx is evidence that a call works.
//   node scripts/rekey-verification.mjs
import {readdirSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';

export function parseCurl(curl) {
  const m = curl.match(/-X\s+([A-Z]+)\s+'(https?:\/\/[^']+)'/);
  if (!m) throw new Error(`cannot read a method and URL from: ${curl.slice(0, 80)}`);
  return {method: m[1], url: m[2]};
}

// A spec path with {params} becomes a pattern; a recorded URL may carry either
// the literal {param} or a real value in that position.
const pattern = (path) => new RegExp('^' + path.split(/\{[^}]+\}/).map((s) => s.replace(/[.*+?^$()|[\]\\]/g, '\\$&')).join('[^/]+') + '$');

export function rekey(rec, ops) {
  const {method, url} = parseCurl(rec.request);
  const pathname = decodeURI(new URL(url).pathname);
  const hit = ops.find((o) => o.method === method.toLowerCase() && (o.path === pathname || pattern(o.path).test(pathname)));
  if (!hit) throw new Error(`no operation matches ${method} ${pathname}`);
  const {atom, ...rest} = rec;
  return {operation: hit.operationId, outcome: String(rec.status).startsWith('2') ? 'succeeded' : 'failed', ...rest};
}

export function fileNames(recs) {
  const count = new Map();
  return recs.map((r) => {
    const key = `${r.operation}.${r.on}`;
    count.set(key, (count.get(key) ?? 0) + 1);
    return `${key}.${count.get(key)}.json`;
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(fileURLToPath(import.meta.url), '..', '..');
  const specDir = join(root, 'catalogue', 'openapi', 'hiecm', 'v3');
  const ops = readdirSync(specDir).filter((f) => f.endsWith('.yaml')).flatMap((f) => {
    const spec = parse(readFileSync(join(specDir, f), 'utf8'));
    return Object.entries(spec.paths ?? {}).flatMap(([p, item]) =>
      Object.entries(item).filter(([, o]) => o?.operationId).map(([m, o]) => ({operationId: o.operationId, method: m, path: p.split('#')[0]})));
  });
  const dir = join(root, 'catalogue', 'verification');
  const files = readdirSync(dir).filter((x) => x.endsWith('.json')).sort();
  const recs = files.map((f) => rekey(JSON.parse(readFileSync(join(dir, f), 'utf8')), ops));
  const names = fileNames(recs);
  for (const f of files) rmSync(join(dir, f));
  recs.forEach((r, i) => writeFileSync(join(dir, names[i]), `${JSON.stringify(r, null, 2)}\n`));
  console.log(`rekeyed ${recs.length}: ${recs.filter((r) => r.outcome === 'succeeded').length} succeeded, ${recs.filter((r) => r.outcome === 'failed').length} failed`);
}
```

- [x] **Step 4: Run the tests, then the script**

Run: `node --test scripts/rekey-verification.test.mjs && node scripts/rekey-verification.mjs && ls catalogue/verification | wc -l`
Expected: 4 passing; "rekeyed 65: 6 succeeded, 59 failed"; 65 files. If the script throws "no operation matches", that operation is gone from the spec: move the original record into `catalogue/verification/retired/` by hand, re-run, and name it in the commit message.

- [x] **Step 5: Make `verify-atoms.mjs` write the same shape**

In `scripts/verify-atoms.mjs`, where a result is written, write `{operation, outcome, on, against, request, status, body}` with `outcome` set as in `rekey`, to a file name from `fileNames` computed against the existing files in `catalogue/verification/`. Run `node scripts/verify-atoms.mjs --help` and confirm it starts.

- [x] **Step 6: Commit**

```bash
git add scripts/rekey-verification.mjs scripts/rekey-verification.test.mjs scripts/verify-atoms.mjs catalogue/verification
git commit -m "verification: sandbox records are keyed to operations and say whether the call succeeded"
```

### Task 0.3: The runbook for NHA's corrections

**Files:**
- Create: `docs/runbook-nha-corrections.md`
- Modify: `CLAUDE.md` (one line pointing at it)

- [x] **Step 1: Write the runbook**

````markdown
# NHA sent a correction

NHA's corrections arrive as Word documents or review ledgers. They are applied
to the docs pages, and only to the pages: every other surface is built from them.

**Who applies them:** OWNER TO FILL BEFORE HANDOVER (role, name, hours a week).

**Migration deadline:** OWNER TO FILL BEFORE HANDOVER (date, owner). If class 3 of the migration has not merged by then, no further class migrates and both kinds of atom stay as they are.

## Steps

1. For each correction, find the page and the section. Search the site, or run
   `grep -rn "<phrase from the correction>" site/docs`.
2. Edit the visible text of that section on the page.
3. If the section has an `<AgentOnly>` block in the page file, read it. These
   notes are hidden on the site and NHA does not review them, so you are the
   only person who will. If the correction makes any sentence in a note untrue,
   fix that sentence too. To see the notes on the site, use "Show notes for AI
   agents" at the very bottom of any page, or add `?agent-notes=1` to the URL.
4. Never rename a heading id (the `{#...}` after a heading). Reword the heading
   text freely.
5. Run:

   ```bash
   npm run build:sections && npm run check:sections && npm run lint:content
   ```

6. Open a pull request. CI names anything the edit broke and how to fix it.

## If a check fails

- "heading id ... is missing": you removed or renamed a `{#...}`. Put it back,
  or move the atom in `catalogue/map.yaml` to the section that now holds its words.
- "agent note introduces `...`": a note states an API detail the page and the
  specifications do not. Put it on the page, or take it out of the note.

## Where things stand

Content moves onto pages one class at a time. Whatever has moved is edited on
the page; whatever has not still lives in its `catalogue/` file.
`catalogue/registry.json` lists every atom and where its words are. If migration
stops, both kinds keep working.
````

- [x] **Step 2: Point CLAUDE.md at it**

Add to `CLAUDE.md`, after the paragraph about the plugin:

```markdown
NHA corrections are applied to docs pages only. Follow `docs/runbook-nha-corrections.md`.
```

- [x] **Step 3: Commit**

```bash
git add docs/runbook-nha-corrections.md CLAUDE.md
git commit -m "docs: the runbook for applying NHA's corrections, written before the machinery"
```

---

## Phase 1: Agent notes, section ids and the registry, proven on one atom

### Task 1: Run script tests in CI

**Files:**
- Modify: `package.json`, `.github/workflows/ci.yml`

- [x] **Step 1: Add the script**

In `package.json` `scripts`:

```json
"test:scripts": "node --test scripts/*.test.mjs scripts/lib/*.test.mjs"
```

- [x] **Step 2: Run it**

Run: `npm run -s test:scripts`
Expected: every existing test file passes (`api-samples`, `changelog`, `emit-page-markdown`, `postman`, `lib/titles`) plus `rekey-verification`.

- [x] **Step 3: Add it to CI**

In `.github/workflows/ci.yml`, in the job that runs `npm run lint:atoms`, add after that step:

```yaml
      - run: npm run test:scripts
```

- [x] **Step 4: Commit**

```bash
git add package.json .github/workflows/ci.yml
git commit -m "ci: the scripts' own tests run on every pull request"
```

### Task 2: `<AgentOnly>`

**Files:**
- Create: `site/src/components/mdx/AgentOnly.tsx`
- Create: `site/src/components/docs/AgentNotesToggle.tsx`
- Modify: `site/src/components/mdx/index.ts`, `site/src/theme/MDXComponents.tsx`, `site/src/theme/Footer/index.tsx`, `site/src/css/custom.css`, `site/docusaurus.config.ts` (search plugin options)
- Test: `scripts/emit-page-markdown.test.mjs` (append)

**Interfaces:**
- Produces: `<AgentOnly>` renders `<aside class="agent-only" data-agent-only><p class="agent-only__label">Notes for AI agents</p>...</aside>`, always in the HTML, hidden by CSS unless `<html data-agent-notes="shown">`.
- Produces: `AgentNotesToggle`, a small muted link under the site footer, "Show notes for AI agents" / "Hide notes for AI agents". It sets or clears `data-agent-notes="shown"` on `<html>` and remembers the choice in `localStorage` under `agent-notes`. `?agent-notes=1` on any URL turns the notes on as well.

- [x] **Step 1: Write the failing test**

Append to `scripts/emit-page-markdown.test.mjs`:

```js
test('agent-only notes reach the markdown although readers do not see them', () => {
  const html = '<article><h3>Link token</h3><p>Valid for six months.</p><aside class="agent-only" data-agent-only><p class="agent-only__label">Notes for AI agents</p><p>Validate the token before every link.</p></aside></article>';
  const md = htmlToMarkdown(html, '');
  assert.match(md, /Notes for AI agents/);
  assert.match(md, /Validate the token before every link\./);
});
```

- [x] **Step 2: Run it**

Run: `node --test scripts/emit-page-markdown.test.mjs`
Expected: PASS if `htmlToMarkdown` already keeps `<aside>` content. If it FAILS, find where `htmlToMarkdown` in `scripts/emit-page-markdown.mjs` drops elements, keep `aside` and its children as normal blocks, and re-run until it passes.

- [x] **Step 3: Write the note component**

```tsx
// site/src/components/mdx/AgentOnly.tsx
import type {ReactNode} from 'react';

/**
 * Content written for AI agents: rules, exit conditions, failure modes, as
 * Mintlify's <Visibility for="agents"> and Fern's <llms-only> carry it.
 * Always rendered into the HTML, because emit-page-markdown builds each
 * page's .md copy and llms-full.txt from the HTML; hidden by CSS until the
 * reader turns notes on from the footer link or with ?agent-notes=1.
 */
export default function AgentOnly({children}: {children: ReactNode}): ReactNode {
  return (
    <aside className="agent-only" data-agent-only>
      <p className="agent-only__label">Notes for AI agents</p>
      {children}
    </aside>
  );
}
```

In `site/src/components/mdx/index.ts` add:

```ts
export {default as AgentOnly} from './AgentOnly';
```

In `site/src/theme/MDXComponents.tsx`, add `AgentOnly,` to the import list from `@site/src/components/mdx` and to the exported components object, next to `Expandable`.

- [x] **Step 4: Write the footer toggle**

```tsx
// site/src/components/docs/AgentNotesToggle.tsx
import React, {useEffect, useState} from 'react';

const KEY = 'agent-notes';

function apply(shown: boolean): void {
  if (shown) document.documentElement.dataset.agentNotes = 'shown';
  else delete document.documentElement.dataset.agentNotes;
}

/**
 * A quiet link under the footer that shows or hides the notes written for AI
 * agents. Kept out of the page chrome on purpose: readers do not need it, and
 * NHA is not asked to review the notes. ?agent-notes=1 turns them on too, so
 * a link can be shared with anyone who wants to check what agents are told.
 */
export default function AgentNotesToggle(): React.ReactNode {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let on = false;
    try { on = localStorage.getItem(KEY) === 'shown'; } catch {}
    if (new URLSearchParams(window.location.search).get('agent-notes') === '1') on = true;
    setShown(on);
    apply(on);
  }, []);
  const flip = () => {
    const next = !shown;
    setShown(next);
    apply(next);
    try { localStorage.setItem(KEY, next ? 'shown' : 'hidden'); } catch {}
  };
  return (
    <div className="agent-notes-toggle">
      <button type="button" onClick={flip} aria-pressed={shown}>
        {shown ? 'Hide notes for AI agents' : 'Show notes for AI agents'}
      </button>
    </div>
  );
}
```

In `site/src/theme/Footer/index.tsx`, import it and render it under the footer:

```tsx
import AgentNotesToggle from '@site/src/components/docs/AgentNotesToggle';
```

and replace `return <Footer />;` with:

```tsx
  return (
    <>
      <Footer />
      <AgentNotesToggle />
    </>
  );
```

- [x] **Step 5: Hide by default, keep out of search**

Append to `site/src/css/custom.css`:

```css
html:not([data-agent-notes='shown']) .agent-only {
  display: none;
}
.agent-only {
  border: 1px dashed var(--ifm-color-emphasis-400);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  margin: 1rem 0;
  font-size: 0.9em;
}
.agent-only__label {
  font-weight: 600;
  color: var(--ifm-color-emphasis-700);
  margin-bottom: 0.25rem;
}
.agent-notes-toggle {
  text-align: center;
  padding: 0.25rem 0 0.75rem;
}
.agent-notes-toggle button {
  background: none;
  border: 0;
  padding: 0;
  font-size: 0.75rem;
  color: var(--ifm-color-emphasis-500);
  text-decoration: underline;
  cursor: pointer;
}
```

In `site/docusaurus.config.ts`, add to the `@easyops-cn/docusaurus-search-local` options object (beside `searchResultLimits: 10`):

```ts
        ignoreCssSelectors: ['.agent-only'],
```

- [x] **Step 6: Run tests and commit**

```bash
npm run -s test:scripts
git add site/src/components/mdx/AgentOnly.tsx site/src/components/docs/AgentNotesToggle.tsx site/src/components/mdx/index.ts site/src/theme/MDXComponents.tsx site/src/theme/Footer/index.tsx site/src/css/custom.css site/docusaurus.config.ts scripts/emit-page-markdown.test.mjs scripts/emit-page-markdown.mjs
git commit -m "docs: notes for AI agents ride in the page, hidden until a footer link shows them"
```

The first real use, and the visual, search and toggle checks, happen in Task 6.

### Task 3: Read a page section by its heading id

**Files:**
- Create: `scripts/lib/sections.mjs`
- Test: `scripts/lib/sections.test.mjs`

**Interfaces:**
- Produces: `sectionsById(raw: string) -> Map<string, Section>`, `Section = {id, heading, level, line, text, agent: {before, happens, worked, wrong}, unlabelled: string[]}`. Only headings with an explicit `{#id}` are returned. A section runs to the next heading of the same or higher level, or to the first sub-heading that carries its own `{#id}`, whichever comes first, so no text belongs to two sections. `line` is 1-based. `agent` holds the labelled paragraphs of every `<AgentOnly>` in the section; a paragraph without one of the four labels goes into `unlabelled`, and Task 4 fails on it rather than guessing where it belongs.
- Produces: `literals(text: string) -> string[]`, the backticked spans in a text.

- [x] **Step 1: Write the failing tests**

```js
// scripts/lib/sections.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {sectionsById, literals} from './sections.mjs';

const page = [
  '{/* partial */}', '',
  '### Link token {#link-token}', '',
  'The token that authorises linking. Valid for six months.', '',
  '<AgentOnly>',
  '**How you know it worked.** You can say how long a `linkToken` lasts.', '',
  'Validate it before every link.',
  '</AgentOnly>', '',
  '### M1 {#m1}', 'Milestone 1.', '',
  '### No id', 'Ignored.', '',
  '```mdx', '### Fenced {#fenced}', '```',
].join('\n');

test('a section is found by its explicit id, with visible and agent text apart', () => {
  const s = sectionsById(page).get('link-token');
  assert.equal(s.heading, 'Link token');
  assert.match(s.text, /Valid for six months\./);
  assert.doesNotMatch(s.text, /Validate it/);
  assert.equal(s.agent.worked, 'You can say how long a `linkToken` lasts.');
});

test('agent text without a label is reported, never filed under a guessed heading', () => {
  const s = sectionsById(page).get('link-token');
  assert.equal(s.agent.wrong, '');
  assert.deepEqual(s.unlabelled, ['Validate it before every link.']);
});

test('a section stops at a sub-heading with its own id, so no text belongs to two sections', () => {
  const nested = '## Consent {#consent}\nParent text.\n\n### Artefacts {#artefacts}\nChild text.\n\n### Plain sub-heading\nMore parent text.\n';
  const secs = sectionsById(nested);
  assert.doesNotMatch(secs.get('consent').text, /Child text/);
  assert.match(secs.get('artefacts').text, /Child text/);
  assert.doesNotMatch(secs.get('artefacts').text, /More parent text/);
});

test('a section stops at the next heading of the same level', () => {
  assert.doesNotMatch(sectionsById(page).get('link-token').text, /Milestone 1/);
});

test('rewording a heading keeps its id', () => {
  const s = sectionsById(page.replace('### Link token {#link-token}', '### The link token {#link-token}')).get('link-token');
  assert.equal(s.heading, 'The link token');
});

test('headings without an explicit id, and headings inside code fences, are not sections', () => {
  assert.deepEqual([...sectionsById(page).keys()], ['link-token', 'm1']);
});

test('literals are the backticked spans', () => {
  assert.deepEqual(literals('Send `linkToken` to `/v3/link` now.'), ['linkToken', '/v3/link']);
});
```

- [x] **Step 2: Run them and see them fail**

Run: `node --test scripts/lib/sections.test.mjs`
Expected: FAIL, module not found.

- [x] **Step 3: Implement**

```js
// scripts/lib/sections.mjs
// A page section is addressed by its explicit heading id, `## Heading {#id}`.
// The id survives any rewording of the heading, so an atom that points at it
// never breaks when the words change. Text inside <AgentOnly> is kept apart:
// labelled paragraphs fill an atom's agent sections.
const HEADING_RE = /^(#{2,4})\s+(.+?)\s*(?:\{#([a-z0-9][a-z0-9-]*)\})?\s*$/;
const FENCE_RE = /^\s*(```|~~~)/;
const LABELS = {
  'Before you start': 'before',
  'What happens': 'happens',
  'How you know it worked': 'worked',
  'When it goes wrong': 'wrong',
};

export const literals = (text) => [...text.matchAll(/`([^`\n]+)`/g)].map((m) => m[1]);

function agentParts(body) {
  const parts = {before: '', happens: '', worked: '', wrong: ''};
  const unlabelled = [];
  for (const block of body.matchAll(/<AgentOnly>([\s\S]*?)<\/AgentOnly>/g)) {
    for (const para of block[1].trim().split(/\n\s*\n/)) {
      const m = para.match(/^\*\*(Before you start|What happens|How you know it worked|When it goes wrong)\.\*\*\s*([\s\S]*)$/);
      if (!m) { unlabelled.push(para.trim()); continue; }
      const key = LABELS[m[1]];
      parts[key] = parts[key] ? `${parts[key]}\n\n${m[2].trim()}` : m[2].trim();
    }
  }
  return {parts, unlabelled};
}

export function sectionsById(raw) {
  const lines = raw.split('\n');
  const heads = [];
  let fenced = false;
  let start = 0;
  if (lines[0] === '---') start = lines.indexOf('---', 1) + 1;
  for (let i = start; i < lines.length; i++) {
    if (FENCE_RE.test(lines[i])) { fenced = !fenced; continue; }
    if (fenced) continue;
    const h = lines[i].match(HEADING_RE);
    if (h) heads.push({line: i, level: h[1].length, heading: h[2], id: h[3] ?? null});
  }
  const out = new Map();
  heads.forEach((h, k) => {
    if (!h.id) return;
    // Stop at the next heading of the same or higher level, or at the first
    // sub-heading that is an addressable section of its own.
    const next = heads.slice(k + 1).find((n) => n.level <= h.level || n.id);
    const body = lines.slice(h.line + 1, next ? next.line : lines.length).join('\n');
    const {parts, unlabelled} = agentParts(body);
    out.set(h.id, {
      id: h.id, heading: h.heading, level: h.level, line: h.line + 1,
      text: body.replace(/<AgentOnly>[\s\S]*?<\/AgentOnly>/g, '').trim(),
      agent: parts, unlabelled,
    });
  });
  return out;
}
```

- [x] **Step 4: Run the tests**

Run: `node --test scripts/lib/sections.test.mjs`
Expected: 7 passing.

- [x] **Step 5: Commit**

```bash
git add scripts/lib/sections.mjs scripts/lib/sections.test.mjs
git commit -m "sections: a page section is read by its heading id, agent notes kept apart"
```

### Task 4: The registry and the generated atoms

**Files:**
- Create: `catalogue/map.yaml`
- Create: `scripts/build-sections.mjs`
- Test: `scripts/build-sections.test.mjs`
- Create (generated): `catalogue/generated/**`, `catalogue/registry.json`
- Modify: `package.json` (`build:sections`, `check:sections`), `.github/workflows/ci.yml`, `CLAUDE.md`

**Interfaces:**
- Consumes: `sectionsById`, `literals` from Task 3; `loadAtoms()` from `scripts/lib/atoms.mjs` (returns `{atoms: Map<id, {file, fm, body, raw}>, problems}`; it walks every folder under `catalogue/` except `openapi` and `annexure`, as the Go loader does except `.raw` and `annexure`, so both read `catalogue/generated/` with no change).
- Produces: a `map.yaml` entry:

```yaml
shared.glossary.link-token:
  type: glossary
  gateway: shared
  milestone: n/a
  title: Link token, the token that authorises linking
  summary: The token that authorises your system to link a care context to a patient's ABHA address.
  page: site/docs/_glossary/_hiecm.mdx
  heading: link-token
  url: /docs/hiecm/v3/getting-started/glossary#link-token
  related: {}
```

- Produces: `renderAtom(id, entry, section) -> string`, `generatedPath(id, entry) -> string` (`catalogue/generated/<gateway>/<folder>/<slug>.md`), `problems({map, pages, handIds, specText}) -> string[]`, `registry({map, hand}) -> object[]`.

- [x] **Step 1: Write the failing tests**

```js
// scripts/build-sections.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {renderAtom, generatedPath, problems, registry} from './build-sections.mjs';

const entry = {type: 'glossary', gateway: 'shared', milestone: 'n/a', title: 'Link token, the token that authorises linking', summary: 'Authorises linking.', page: 'g.mdx', heading: 'link-token', url: '/docs/g#link-token', related: {}};
const page = '### Link token {#link-token}\n\nValid for six months.\n\n<AgentOnly>\n**When it goes wrong.** Validate it before every link.\n</AgentOnly>\n';

test('a generated atom carries the page text and only the sections that have content', () => {
  const md = renderAtom('shared.glossary.link-token', entry, {text: 'Valid for six months.', agent: {before: '', happens: '', worked: '', wrong: 'Validate it before every link.'}});
  assert.match(md, /^---\nid: shared\.glossary\.link-token\n/);
  assert.match(md, /generated: true/);
  assert.match(md, /## In plain words\n\nValid for six months\./);
  assert.match(md, /## When it goes wrong\n\nValidate it before every link\./);
  for (const h of ['Before you start', 'What happens', 'How you know it worked']) assert.doesNotMatch(md, new RegExp(`## ${h}`));
  assert.doesNotMatch(md, /Nothing beyond/);
});

test('agent text without a label fails, naming the atom and the fix', () => {
  const unlabelled = page.replace('**When it goes wrong.** ', '');
  const p = problems({map: {'shared.glossary.link-token': entry}, pages: {'g.mdx': unlabelled}, handIds: new Set(), specText: ''});
  assert.ok(p.some((x) => x.includes('has agent text without a label')));
});

test('the generated file sits in the folder lint-atoms expects for its type', () => {
  assert.equal(generatedPath('shared.glossary.link-token', entry), 'catalogue/generated/shared/glossary/link-token.md');
});

test('a clean map has no problems', () => {
  assert.deepEqual(problems({map: {'shared.glossary.link-token': entry}, pages: {'g.mdx': page}, handIds: new Set(), specText: ''}), []);
});

test('a heading id the map needs, gone from the page, fails and names the atom', () => {
  const p = problems({map: {'shared.glossary.link-token': entry}, pages: {'g.mdx': page.replace(' {#link-token}', '')}, handIds: new Set(), specText: ''});
  assert.deepEqual(p, ['shared.glossary.link-token: heading id "link-token" is missing from g.mdx. Put {#link-token} back on the heading that holds its words, or point the atom at the section that now does']);
});

test('an atom written in two places fails', () => {
  const p = problems({map: {'shared.glossary.link-token': entry}, pages: {'g.mdx': page}, handIds: new Set(['shared.glossary.link-token']), specText: ''});
  assert.ok(p.some((x) => x.includes('is both a hand-written file and a map entry')));
});

test('an agent note that introduces a literal no page or spec states fails', () => {
  const bad = page.replace('Validate it before every link.', 'Send `X-LINK-SECRET` on every link.');
  // stays labelled: the replacement keeps the "**When it goes wrong.**" prefix
  const p = problems({map: {'shared.glossary.link-token': entry}, pages: {'g.mdx': bad}, handIds: new Set(), specText: 'REQUEST-ID'});
  assert.ok(p.some((x) => x.includes('agent note introduces `X-LINK-SECRET`')));
});

test('the registry lists page-sourced and hand-written atoms, with no prose', () => {
  const r = registry({map: {'shared.glossary.link-token': entry}, hand: [{id: 'nhcx.error.payr-1107', type: 'error', gateway: 'nhcx', file: 'catalogue/nhcx/errors/payr-1107.md'}]});
  assert.deepEqual(r.map((e) => [e.id, e.source]), [['nhcx.error.payr-1107', 'file'], ['shared.glossary.link-token', 'page']]);
  assert.equal(JSON.stringify(r).includes('six months'), false);
});
```

- [x] **Step 2: Run them and see them fail**

Run: `node --test scripts/build-sections.test.mjs`
Expected: FAIL, module not found.

- [x] **Step 3: Implement**

```js
// scripts/build-sections.mjs
// catalogue/map.yaml is the atom registry: each atom id and the page section
// that holds its words. This script builds, from the map and the pages, the
// atom-shaped files every consumer already reads (catalogue/generated/), and
// catalogue/registry.json, the list of every atom and where its words live.
//   npm run build:sections
//   npm run check:sections      CI: fails on any problem or stale output
import {readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, statSync} from 'node:fs';
import {join, dirname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse, stringify} from 'yaml';
import {loadAtoms} from './lib/atoms.mjs';
import {sectionsById, literals} from './lib/sections.mjs';

// The folder per type that scripts/lint-atoms.mjs requires.
const FOLDER = {concept: 'concepts', flow: 'flows', endpoint: 'endpoints', callback: 'callbacks', error: 'errors', test: 'tests', decision: 'decisions', glossary: 'glossary', fhir: 'fhir', sandbox: 'sandbox', troubleshooting: 'troubleshooting'};
const SECTIONS = [['In plain words', (s) => s.text], ['Before you start', (s) => s.agent.before], ['What happens', (s) => s.agent.happens], ['How you know it worked', (s) => s.agent.worked], ['When it goes wrong', (s) => s.agent.wrong]];

export const generatedPath = (id, e) => `catalogue/generated/${e.gateway}/${FOLDER[e.type]}/${id.split('.')[2]}.md`;

export function renderAtom(id, e, s) {
  const fm = {
    id, type: e.type, gateway: e.gateway, milestone: e.milestone, version: 'abdm-v3',
    title: e.title, summary: e.summary, generated: true,
    sources: [{url: `https://github.com/nha-in/docs/blob/main/${e.page}`, status: 'page', note: `Generated from ${e.page}#${e.heading}. Edit the page, never this file.`}],
    related: e.related ?? {},
  };
  // A section with nothing in it is left out: the indexer makes one chunk per
  // "## " section, and identical filler chunks would crowd search results.
  const body = SECTIONS.map(([h, get]) => [h, (get(s) ?? '').trim()]).filter(([, t]) => t).map(([h, t]) => `## ${h}\n\n${t}`).join('\n\n');
  return `---\n${stringify(fm).trimEnd()}\n---\n\n# ${e.title}\n\n${body}\n`;
}

export function problems({map, pages, handIds, specText}) {
  const out = [];
  for (const [id, e] of Object.entries(map)) {
    if (handIds.has(id)) out.push(`${id} is both a hand-written file and a map entry. Delete the hand-written file once its words are on the page`);
    if (!FOLDER[e.type]) out.push(`${id}: type "${e.type}" is not an atom type`);
    const raw = pages[e.page];
    if (raw === undefined) { out.push(`${id}: page ${e.page} does not exist`); continue; }
    const s = sectionsById(raw).get(e.heading);
    if (!s) { out.push(`${id}: heading id "${e.heading}" is missing from ${e.page}. Put {#${e.heading}} back on the heading that holds its words, or point the atom at the section that now does`); continue; }
    for (const para of s.unlabelled) out.push(`${id}: ${e.page}#${e.heading} has agent text without a label: "${para.slice(0, 60)}". Start the paragraph with **Before you start.**, **What happens.**, **How you know it worked.** or **When it goes wrong.**`);
    const visible = raw.replace(/<AgentOnly>[\s\S]*?<\/AgentOnly>/g, '');
    for (const lit of literals(Object.values(s.agent).join('\n'))) {
      if (!visible.includes(lit) && !specText.includes(lit)) out.push(`${id}: agent note introduces \`${lit}\`, which neither ${e.page} nor any specification states. Put it on the page, or take it out of the note`);
    }
  }
  return out;
}

export function registry({map, hand}) {
  const fromPages = Object.entries(map).map(([id, e]) => ({id, type: e.type, gateway: e.gateway, source: 'page', page: e.page, heading: e.heading, url: e.url}));
  const fromFiles = hand.map((a) => ({id: a.id, type: a.type, gateway: a.gateway, source: 'file', file: a.file}));
  return [...fromPages, ...fromFiles].sort((a, b) => a.id.localeCompare(b.id));
}

function walkFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? walkFiles(p) : [p]; });
}

function specText(root) {
  return walkFiles(join(root, 'catalogue', 'openapi')).filter((f) => f.endsWith('.yaml') && !f.includes('/.raw/')).map((f) => readFileSync(f, 'utf8')).join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(fileURLToPath(import.meta.url), '..', '..');
  const map = parse(readFileSync(join(root, 'catalogue', 'map.yaml'), 'utf8')) ?? {};
  const pages = Object.fromEntries([...new Set(Object.values(map).map((e) => e.page))].filter((p) => existsSync(join(root, p))).map((p) => [p, readFileSync(join(root, p), 'utf8')]));
  const {atoms} = loadAtoms();
  const hand = [...atoms.values()].filter((a) => !a.file.includes('/catalogue/generated/')).map((a) => ({id: a.fm.id, type: a.fm.type, gateway: a.fm.gateway, file: relative(root, a.file)}));
  const found = problems({map, pages, handIds: new Set(hand.map((a) => a.id)), specText: specText(root)});
  const want = new Map(Object.entries(map).filter(([, e]) => pages[e.page] && sectionsById(pages[e.page]).get(e.heading)).map(([id, e]) => [generatedPath(id, e), renderAtom(id, e, sectionsById(pages[e.page]).get(e.heading))]));
  const reg = `${JSON.stringify(registry({map, hand}), null, 2)}\n`;
  const genDir = join(root, 'catalogue', 'generated');
  if (process.argv.includes('--check')) {
    for (const [p, body] of want) if (!existsSync(join(root, p)) || readFileSync(join(root, p), 'utf8') !== body) found.push(`${p} is stale; run npm run build:sections`);
    for (const f of walkFiles(genDir)) if (!want.has(relative(root, f))) found.push(`${relative(root, f)} has no map entry; run npm run build:sections`);
    const regPath = join(root, 'catalogue', 'registry.json');
    if (!existsSync(regPath) || readFileSync(regPath, 'utf8') !== reg) found.push('catalogue/registry.json is stale; run npm run build:sections');
    for (const p of found) console.error(p);
    process.exit(found.length ? 1 : 0);
  }
  if (found.length) { for (const p of found) console.error(p); process.exit(1); }
  rmSync(genDir, {recursive: true, force: true});
  for (const [p, body] of want) { mkdirSync(dirname(join(root, p)), {recursive: true}); writeFileSync(join(root, p), body); }
  writeFileSync(join(root, 'catalogue', 'registry.json'), reg);
  console.log(`sections: ${want.size} atoms from pages, ${hand.length} hand-written`);
}
```

- [x] **Step 4: Run the tests**

Run: `node --test scripts/build-sections.test.mjs`
Expected: 8 passing. If one fails only on the exact wording of a message, change the message in the script to match the test: the tests are the words CI shows a successor.

- [x] **Step 4b: Let `lint-atoms` accept a generated atom's missing sections**

In `scripts/lint-atoms.mjs`, the check headed `// The five sections, present and in order.` fails any atom missing one of the five sections. Wrap it so a file marked `generated: true` only needs `## In plain words`, since the generator writes the others in order or not at all:

```js
  // The five sections, present and in order. A generated atom leaves out
  // any section its page has nothing for, and build-sections.mjs writes the
  // rest in order, so it needs only the first.
  if (fm.generated === true) {
    if (found[0] === -1) fail(file, 'missing mandatory section: ## In plain words');
  } else {
    // (the existing presence and order checks, unchanged)
  }
```

Move the two existing checks, the `SECTIONS.forEach` presence check and the order loop that follows it, inside the `else` block unchanged. Run `npm run -s lint:atoms` and confirm it still passes on every hand-written atom.

- [x] **Step 4c: Give generated atoms their citation links**

The Ask AI bot links each cited atom to `doc_url`, which the indexer reads from `catalogue/atom-routes.json`, which `scripts/build-atom-routes.mjs` derives from pages' `covers:` keys. A migrated atom is in no `covers:` list, so without this step its citation falls back to a site search for its title. Add a rule that runs before all the others.

At the top of `scripts/build-atom-routes.mjs`, beside the other imports:

```js
import {parse as parseYaml} from 'yaml';
```

After the `// ---------- Rule 0: a page claims the atom ----------` block (after `claimed` is filled), add:

```js
// ---------- Rule -1: the atom registry names the section ----------
// An atom whose words live on a page is listed in catalogue/map.yaml with the
// published URL of its section, so its route is known exactly and wins.
const mapPath = join(root, "catalogue", "map.yaml");
const registryMap = existsSync(mapPath) ? (parseYaml(readFileSync(mapPath, "utf8")) ?? {}) : {};
```

In the per-atom loop, replace:

```js
  const claim = claimed.get(id);
```

with:

```js
  const reg = registryMap[id];
  if (reg?.url) {
    const [r, a] = String(reg.url).split("#");
    route = r; anchor = a ?? null;
    rule = "named by catalogue/map.yaml"; confidence = "derived";
  }
  const claim = route ? null : claimed.get(id);
```

Run `node scripts/build-atom-routes.mjs && npm run -s check:routes` and confirm both pass; with an empty map nothing changes yet. Task 6 checks the link for the first migrated atom.

- [x] **Step 5: Create an empty map, build, add scripts**

```bash
printf '# The atom registry: each atom id and the page section that holds its words.\n# An atom listed here has no hand-written file; its file in catalogue/generated/\n# is built from the page by scripts/build-sections.mjs.\n' > catalogue/map.yaml
```

In `package.json` `scripts` add:

```json
"build:sections": "node scripts/build-sections.mjs",
"check:sections": "node scripts/build-sections.mjs --check"
```

Run: `npm run -s build:sections && npm run -s check:sections`
Expected: "sections: 0 atoms from pages, N hand-written" where N is the count `npm run lint:atoms` reports; the check exits 0; `catalogue/registry.json` lists every atom with `"source": "file"`.

- [x] **Step 6: CI, generated-file list, commit**

In `.github/workflows/ci.yml`, after `- run: npm run test:scripts`, add:

```yaml
      - run: npm run check:sections
```

In `CLAUDE.md`, add `catalogue/generated/` and `catalogue/registry.json` to the "Generated files are never hand-edited" list.

```bash
git add catalogue/map.yaml catalogue/registry.json scripts/build-sections.mjs scripts/build-sections.test.mjs scripts/lint-atoms.mjs scripts/build-atom-routes.mjs catalogue/atom-routes.json package.json .github/workflows/ci.yml CLAUDE.md
git commit -m "registry: atom ids map to page sections, and their files and links are built from the pages"
```

### Task 4d: A plugin that changes must change its version

Integrators install the compiled skills as plugins. `claude plugin update` compares version numbers only, so a plugin whose files change under an unchanged version never reaches anyone who installed it. That already happened: the contributor plugin sat at `0.3.0` with 21 files different from the repository. Every migration PR rebuilds the skills, so this gate comes before the first one.

**Files:**
- Create: `scripts/check-plugin-version.mjs`
- Test: `scripts/check-plugin-version.test.mjs`
- Modify: `package.json` (`check:plugin-version`), `.github/workflows/ci.yml`

**Interfaces:**
- Produces: `versionProblems({changed: string[], plugins: {dir, before, after}[]}) -> string[]`. A plugin needs a bump when any changed file sits under `plugins/<dir>/` and its version in `plugins/<dir>/.claude-plugin/plugin.json` is the same before and after.

- [x] **Step 1: Write the failing tests**

```js
// scripts/check-plugin-version.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {versionProblems} from './check-plugin-version.mjs';

test('a plugin whose files changed under the same version fails, naming the fix', () => {
  const p = versionProblems({changed: ['plugins/abdm-integrators-assistant/skills/abdm-m1/SKILL.md'], plugins: [{dir: 'abdm-integrators-assistant', before: '0.4.0', after: '0.4.0'}]});
  assert.deepEqual(p, ['plugins/abdm-integrators-assistant changed but its version is still 0.4.0. Bump "version" in plugins/abdm-integrators-assistant/.claude-plugin/plugin.json, then run npm run build:plugins']);
});

test('a bumped version passes', () => {
  assert.deepEqual(versionProblems({changed: ['plugins/abdm-integrators-assistant/skills/abdm-m1/SKILL.md'], plugins: [{dir: 'abdm-integrators-assistant', before: '0.4.0', after: '0.4.1'}]}), []);
});

test('a plugin with no changed files needs no bump', () => {
  assert.deepEqual(versionProblems({changed: ['site/docs/x.mdx'], plugins: [{dir: 'nhcx', before: '1.0.0', after: '1.0.0'}]}), []);
});
```

- [x] **Step 2: Run them and see them fail**

Run: `node --test scripts/check-plugin-version.test.mjs`
Expected: FAIL, module not found.

- [x] **Step 3: Implement**

```js
// scripts/check-plugin-version.mjs
// A plugin whose files change must change its version, or nobody who
// installed it ever receives the change: `claude plugin update` compares
// version numbers only.
//   npm run check:plugin-version            compares against origin/main
//   BASE_REF=origin/x npm run check:plugin-version
import {readdirSync, readFileSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

export function versionProblems({changed, plugins}) {
  return plugins
    .filter(({dir, before, after}) => before === after && changed.some((f) => f.startsWith(`plugins/${dir}/`)))
    .map(({dir, after}) => `plugins/${dir} changed but its version is still ${after}. Bump "version" in plugins/${dir}/.claude-plugin/plugin.json, then run npm run build:plugins`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(fileURLToPath(import.meta.url), '..', '..');
  const base = process.env.BASE_REF ?? 'origin/main';
  const git = (...a) => execFileSync('git', a, {cwd: root, encoding: 'utf8'});
  const changed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);
  const plugins = readdirSync(join(root, 'plugins')).filter((d) => existsSync(join(root, 'plugins', d, '.claude-plugin', 'plugin.json'))).map((dir) => {
    const rel = `plugins/${dir}/.claude-plugin/plugin.json`;
    const after = JSON.parse(readFileSync(join(root, rel), 'utf8')).version;
    let before = null;
    try { before = JSON.parse(git('show', `${base}:${rel}`)).version; } catch {}
    return {dir, before, after};
  });
  const problems = versionProblems({changed, plugins});
  for (const p of problems) console.error(p);
  process.exit(problems.length ? 1 : 0);
}
```

- [x] **Step 4: Run the tests, add the script and CI step**

In `package.json` `scripts` add:

```json
"check:plugin-version": "node scripts/check-plugin-version.mjs"
```

In `.github/workflows/ci.yml`, in the job that runs `npm run check:plugins`, set that job's checkout to fetch history (`with: fetch-depth: 0` on its `actions/checkout` step) and add after `npm run check:plugins`:

```yaml
      - run: npm run check:plugin-version
        if: github.event_name == 'pull_request'
        env:
          BASE_REF: origin/${{ github.base_ref }}
```

Run: `node --test scripts/check-plugin-version.test.mjs && npm run -s check:plugin-version`
Expected: 3 passing; the check exits 0 on a branch that has not touched `plugins/`.

- [x] **Step 5: Commit**

```bash
git add scripts/check-plugin-version.mjs scripts/check-plugin-version.test.mjs package.json .github/workflows/ci.yml
git commit -m "ci: a plugin whose files change must change its version, or installs never update"
```

### [rev] Task 4e: An atom may not list itself as related

`lint-atoms` already fails a `related` id that no atom defines. It does not fail an atom that lists itself, and `abha-biometric-auth-init` does. A migrated atom's `related` comes from its map entry, so `build-sections` checks the same two rules there. No edges are derived: linking atoms that cite the same source would tie 339 atoms to one spreadsheet.

**Files:**
- Modify: `scripts/lint-atoms.mjs`, `scripts/build-sections.mjs`
- Test: `scripts/build-sections.test.mjs` (append)

**Interfaces:**
- `problems({map, pages, handIds, specText})` also fails a map entry whose `related` names its own id, or an id that is neither a hand-written atom nor a map entry.

- [x] **Step 1: Write the failing tests**

```js
// append to scripts/build-sections.test.mjs
test('a map entry that lists itself as related fails', () => {
  const self = {...entry, related: {concepts: ['shared.glossary.link-token']}};
  const p = problems({map: {'shared.glossary.link-token': self}, pages: {'g.mdx': page}, handIds: new Set(), specText: ''});
  assert.ok(p.some((x) => x.includes('lists itself as related')));
});

test('a map entry whose related names an unknown id fails', () => {
  const dangling = {...entry, related: {concepts: ['shared.glossary.nowhere']}};
  const p = problems({map: {'shared.glossary.link-token': dangling}, pages: {'g.mdx': page}, handIds: new Set(), specText: ''});
  assert.ok(p.some((x) => x.includes('related names shared.glossary.nowhere, which no atom defines')));
});
```

- [x] **Step 2: Run them and see them fail**

Run: `node --test scripts/build-sections.test.mjs`
Expected: the two new tests FAIL.

- [x] **Step 3: Implement**

In `problems()` in `scripts/build-sections.mjs`, inside the loop over map entries and before the page lookup, add:

```js
    const known = new Set([...handIds, ...Object.keys(map)]);
    for (const ids of Object.values(e.related ?? {})) {
      for (const ref of ids ?? []) {
        if (ref === id) out.push(`${id} lists itself as related. Remove it from its related list in catalogue/map.yaml`);
        else if (!known.has(ref)) out.push(`${id}: related names ${ref}, which no atom defines. Fix the id or remove it from catalogue/map.yaml`);
      }
    }
```

In `scripts/lint-atoms.mjs`, in the existing loop over `fm.related` that fails an id no atom defines, add before that check:

```js
      if (ref === id) fail(file, `related.${kind} lists the atom itself; remove "${ref}"`);
```

- [x] **Step 4: Run, fix what it finds, commit**

Run: `node --test scripts/build-sections.test.mjs && npm run -s lint:atoms`
Expected: the tests pass. `lint:atoms` names each atom that lists itself; remove the self-reference in each file named (hand-written HIE-CM and shared atoms only; an NHCX atom waits for owner decision 1, so add it to the exception note in the commit message instead) and re-run until only NHCX atoms remain.

```bash
git add scripts/lint-atoms.mjs scripts/build-sections.mjs scripts/build-sections.test.mjs catalogue/hiecm catalogue/shared
git commit -m "atoms: no atom lists itself as related, on a page or in a file"
```


### [rev] Task 4f: A generated atom carries plain markdown, not page markup

A section's visible text is taken from an `.mdx` page. `[HIP](#hip)`, `<Expandable>`, imports and admonition syntax would reach the index and the bot would quote them. The old atoms used clean markdown.

**Files:**
- Modify: `scripts/lib/sections.mjs`, `scripts/build-sections.mjs`
- Test: `scripts/lib/sections.test.mjs` (append), `scripts/build-sections.test.mjs` (append)

**Interfaces:**
- Produces: `plainMarkdown(text: string, sectionUrl: string) -> {text, problems: string[]}` in `scripts/lib/sections.mjs`. Rewrites `[x](#id)` to `[x](<page path of sectionUrl>#id)`; strips lines that are `import ...` or `export ...`; converts `:::note` / `:::tip` / `:::warning` blocks to their inner text; reports a problem for any remaining `<Tag` other than `<AgentOnly>` and for `{...}` JSX expressions outside code fences.
- `renderAtom` (Task 4) calls `plainMarkdown(s.text, e.url)` and `problems()` includes its problems.

- [x] **Step 1: Write the failing tests**

```js
// append to scripts/lib/sections.test.mjs
import {plainMarkdown} from './sections.mjs';

test('[rev] relative anchors become absolute page links', () => {
  const {text} = plainMarkdown('Links to [HIP](#hip) and [care contexts](#care-context).', '/docs/hiecm/v3/getting-started/glossary#link-token');
  assert.equal(text, 'Links to [HIP](/docs/hiecm/v3/getting-started/glossary#hip) and [care contexts](/docs/hiecm/v3/getting-started/glossary#care-context).');
});

test('[rev] imports go, admonitions unwrap, other JSX is a problem', () => {
  const {text, problems} = plainMarkdown("import X from './x';\n\n:::note\nKeep this.\n:::\n\n<Expandable title=\"t\">inner</Expandable>\n\nValue is {props.v}.", '/docs/p#s');
  assert.doesNotMatch(text, /import X/);
  assert.match(text, /Keep this\./);
  assert.doesNotMatch(text, /:::/);
  assert.ok(problems.some((p) => p.includes('<Expandable')));
  assert.ok(problems.some((p) => p.includes('{props.v}')));
});

test('[rev] code fences are left alone', () => {
  const {text, problems} = plainMarkdown('```json\n{"a": 1}\n```', '/docs/p#s');
  assert.equal(text, '```json\n{"a": 1}\n```');
  assert.deepEqual(problems, []);
});
```

```js
// append to scripts/build-sections.test.mjs
test('[rev] a section with JSX fails the build naming the atom and the tag', () => {
  const jsx = page.replace('Valid for six months.', 'Valid for <Expandable>six</Expandable> months.');
  const p = problems({map: {'shared.glossary.link-token': entry}, pages: {'g.mdx': jsx}, handIds: new Set(), specText: ''});
  assert.ok(p.some((x) => x.includes('shared.glossary.link-token') && x.includes('<Expandable')));
});
```

- [x] **Step 2: Run them and see them fail**

Run: `node --test scripts/lib/sections.test.mjs scripts/build-sections.test.mjs`
Expected: the four new tests FAIL, `plainMarkdown` not exported.

- [x] **Step 3: Implement `plainMarkdown` and wire it into `renderAtom` and `problems`**

Add to `scripts/lib/sections.mjs`:

```js
// A mapped section's text becomes what the bot reads and quotes, so it must be
// plain markdown: anchors made absolute, MDX-only syntax removed or reported.
export function plainMarkdown(text, sectionUrl) {
  const page = String(sectionUrl).split('#')[0];
  const problems = [];
  const out = text
    .split('\n').filter((l) => !/^\s*(import|export)\s/.test(l)).join('\n')
    .replace(/\]\(#([^)]+)\)/g, `](${page}#$1)`)
    .replace(/^:::(note|tip|info|warning|danger|caution)[^\n]*\n([\s\S]*?)\n:::\s*$/gm, '$2');
  for (const m of out.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) if (m[1] !== 'AgentOnly') problems.push(`<${m[1]}>`);
  for (const m of out.matchAll(/(?<!`)\{[^}\n]*\}(?!`)/g)) if (!/^\{#/.test(m[0])) problems.push(m[0]);
  return {text: out.trim(), problems};
}
```

In `scripts/build-sections.mjs`, import `plainMarkdown` beside `sectionsById`. In `SECTIONS`, replace `(s) => s.text` with `(s) => s.plain ?? s.text`; in the CLI, before each `renderAtom` call, set `section.plain = plainMarkdown(section.text, e.url).text`. In `problems()`, after the unlabelled check, add:

```js
    for (const tag of plainMarkdown(s.text, e.url).problems) out.push(`${id}: ${e.page}#${e.heading} carries page markup the bot would quote: ${tag}. Move it out of the mapped section or replace it with plain markdown`);
```

The problem message is `${id}: ${page}#${heading} carries page markup the bot would quote: ${tag}. Move it out of the mapped section or replace it with plain markdown`.

- [x] **Step 4: Run all script tests, commit**

Run: `npm run -s test:scripts`
Expected: PASS.

```bash
git add scripts/lib/sections.mjs scripts/lib/sections.test.mjs scripts/build-sections.mjs scripts/build-sections.test.mjs
git commit -m "sections: a generated atom carries plain markdown with absolute links, never page markup"
```

### Task 5: The migration report

**Files:**
- Create: `scripts/migration-report.mjs`
- Test: `scripts/migration-report.test.mjs`
- Modify: `package.json` (`report:migration`)

**Interfaces:**
- Produces: `apiLiterals(text) -> Set<string>`: backticked spans, error codes like `ABDM-1062` or `PAYR-1107`, and URL paths starting with `/`.
- Produces: `compare(oldBody, newBody, dropped: Map<string, string>) -> {wordsBefore, wordsAfter, missing: string[]}`; `missing` excludes literals listed in `dropped`.
- CLI: `npm run report:migration -- <atom-id> ... [--drop "<literal>=<reason>"]...`. For each id it reads the old body from `git show HEAD:<file>` (the file named in `catalogue/registry.json` at `HEAD`) and the new body from the id's generated file, prints a markdown table, and exits 1 if anything is missing. Run it before committing the migration, while `HEAD` still holds the hand-written file.

- [x] **Step 1: Write the failing tests**

```js
// scripts/migration-report.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {apiLiterals, compare} from './migration-report.mjs';

test('api literals are backticked spans, error codes and paths', () => {
  assert.deepEqual([...apiLiterals('Send `linkToken` to /v3/link. ABDM-1062 means expired.')].sort(), ['/v3/link', 'ABDM-1062', 'linkToken']);
});

test('a literal the new text lost is reported, unless dropped with a reason', () => {
  assert.deepEqual(compare('Use `linkToken` on /v3/link.', 'Use `linkToken`.', new Map()).missing, ['/v3/link']);
  assert.deepEqual(compare('Use `linkToken` on /v3/link.', 'Use `linkToken`.', new Map([['/v3/link', 'path retired by NHA']])).missing, []);
});

test('word counts are reported before and after', () => {
  const r = compare('one two three', 'one two', new Map());
  assert.equal(r.wordsBefore, 3);
  assert.equal(r.wordsAfter, 2);
});
```

- [x] **Step 2: Run them and see them fail**

Run: `node --test scripts/migration-report.test.mjs`
Expected: FAIL, module not found.

- [x] **Step 3: Implement**

```js
// scripts/migration-report.mjs
// Run in every migration PR, before committing: proves each atom's API details
// reached its page, and prints the table the PR description carries.
//   npm run report:migration -- shared.glossary.link-token [--drop "/v3/x=reason"]
import {readFileSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

export function apiLiterals(text) {
  const out = new Set();
  for (const m of text.matchAll(/`([^`\n]+)`/g)) out.add(m[1]);
  for (const m of text.matchAll(/\b[A-Z]{2,6}-\d{3,5}\b/g)) out.add(m[0]);
  for (const m of text.replace(/`[^`\n]+`/g, '').matchAll(/(?<![\w.])\/[a-z0-9][a-z0-9/_{}.-]*[a-z0-9}]/gi)) out.add(m[0]);
  return out;
}

const words = (t) => t.split(/\s+/).filter(Boolean).length;
const body = (md) => md.replace(/^---\n[\s\S]*?\n---\n/, '');

export function compare(oldBody, newBody, dropped) {
  const after = apiLiterals(newBody);
  const missing = [...apiLiterals(oldBody)].filter((l) => !after.has(l) && !newBody.includes(l) && !dropped.has(l)).sort();
  return {wordsBefore: words(oldBody), wordsAfter: words(newBody), missing};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(fileURLToPath(import.meta.url), '..', '..');
  const args = process.argv.slice(2);
  const dropped = new Map();
  const ids = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--drop') { const [l, ...r] = args[++i].split('='); dropped.set(l, r.join('=')); } else ids.push(args[i]);
  }
  const before = JSON.parse(execFileSync('git', ['show', 'HEAD:catalogue/registry.json'], {cwd: root, encoding: 'utf8'}));
  const now = JSON.parse(readFileSync(join(root, 'catalogue', 'registry.json'), 'utf8'));
  console.log('| Atom | Now on | Words before | Words after | Missing literals |\n|---|---|---|---|---|');
  let failed = false;
  for (const id of ids) {
    const was = before.find((e) => e.id === id && e.source === 'file');
    const is = now.find((e) => e.id === id && e.source === 'page');
    if (!was || !is) { console.log(`| ${id} | not migrated in this change | | | |`); failed = true; continue; }
    const oldBody = body(execFileSync('git', ['show', `HEAD:${was.file}`], {cwd: root, encoding: 'utf8'}));
    const genFile = join(root, 'catalogue', 'generated', id.split('.')[0], was.file.split('/').at(-2), `${id.split('.')[2]}.md`);
    const newBody = existsSync(genFile) ? body(readFileSync(genFile, 'utf8')) : '';
    const r = compare(oldBody, newBody, dropped);
    if (r.missing.length) failed = true;
    console.log(`| ${id} | ${is.page}#${is.heading} | ${r.wordsBefore} | ${r.wordsAfter} | ${r.missing.map((m) => `\`${m}\``).join(', ') || 'none'} |`);
  }
  for (const [l, why] of dropped) console.log(`\nDropped \`${l}\`: ${why}`);
  process.exit(failed ? 1 : 0);
}
```

- [x] **Step 4: Run the tests, add the script, commit**

In `package.json` `scripts` add:

```json
"report:migration": "node scripts/migration-report.mjs"
```

Run: `node --test scripts/migration-report.test.mjs`
Expected: 3 passing.

```bash
git add scripts/migration-report.mjs scripts/migration-report.test.mjs package.json
git commit -m "migration: every PR proves each atom's API details reached its page"
```

### Task 6: Migrate `shared.glossary.link-token`, end to end

The atom's page section is `### Link token` in `site/docs/_glossary/_hiecm.mdx` (line 64 on 2026-09-28), rendered at `/docs/hiecm/v3/getting-started/glossary#link-token`. The atom adds one thing the page lacks: validate a stored token before use and generate a new one through demographic authentication when it has expired.

**Files:**
- Modify: `site/docs/_glossary/_hiecm.mdx`
- Modify: `catalogue/map.yaml`
- Delete: `catalogue/shared/glossary/link-token.md`
- Modify: any atom or skill source that links to `link-token.md` by relative path
- Regenerate: `catalogue/generated/**`, `catalogue/registry.json`, compiled skills

- [x] **Step 0: Record today's ranking, before touching anything**

Create `mcp/internal/index/catalogue_smoke_test.go`:

```go
package index

import (
	"context"
	"os"
	"testing"
)

// Runs against an index built from the real catalogue, keyword only, so it
// needs no embedding credentials. It is the ranking check a migration must
// pass: the atom a reader asks for is still the one search puts first.
func TestRealCatalogueRanksLinkToken(t *testing.T) {
	db := os.Getenv("CATALOGUE_DB")
	if db == "" {
		t.Skip("set CATALOGUE_DB to an index built with: go run ./cmd/indexer -catalogue ../catalogue -out <path> -embed-provider none")
	}
	r, err := Open(db)
	if err != nil {
		t.Fatal(err)
	}
	defer r.Close()
	hits, err := r.Search(context.Background(), "link token", "", "", 5, nil)
	if err != nil {
		t.Fatal(err)
	}
	for i, h := range hits {
		t.Logf("%d. %s  %s#%s", i+1, h.ID, h.DocURL, h.DocAnchor)
	}
	if len(hits) == 0 || hits[0].ID != "shared.glossary.link-token" {
		t.Fatalf("shared.glossary.link-token is not the top hit for \"link token\"")
	}
}
```

Build the index and run it:

```bash
cd mcp && go run ./cmd/indexer -catalogue ../catalogue -out "$TMPDIR/cat-before.db" -embed-provider none && CATALOGUE_DB="$TMPDIR/cat-before.db" go test ./internal/index -run TestRealCatalogueRanksLinkToken -v
```

Expected: PASS, with the top five logged. Save the log in the PR description as the "before" ranking. If it fails today, note the actual top hit: after migration the atom must rank no worse than it does now.

- [x] **Step 1: Give the heading an id and add the agent note**

In `site/docs/_glossary/_hiecm.mdx`, replace the `### Link token` entry with:

```mdx
### Link token {#link-token}

The token that authorises a [Health Information Provider](#hip) to link [care contexts](#care-context) to a patient's [ABHA Address](#abha-address). It is generated through the link token API and is valid for six months.

<AgentOnly>
**How you know it worked.** You can say how long a link token lasts and what to do when it has expired.

**When it goes wrong.** A stored link token is used without checking that it is still valid. Validate it before every link. If it has expired, generate a new one through demographic authentication, then link.
</AgentOnly>
```

- [x] **Step 2: Add the map entry**

Append to `catalogue/map.yaml`:

```yaml
shared.glossary.link-token:
  type: glossary
  gateway: shared
  milestone: n/a
  title: Link token, the token that authorises linking
  summary: The token that authorises your system to link a care context to a patient's ABHA address.
  page: site/docs/_glossary/_hiecm.mdx
  heading: link-token
  url: /docs/hiecm/v3/getting-started/glossary#link-token
  related:
    concepts: []
```

- [x] **Step 3: Build, and prove nothing was lost, while the old file is still in HEAD**

```bash
git rm --cached -q catalogue/shared/glossary/link-token.md && rm catalogue/shared/glossary/link-token.md
npm run -s build:sections && npm run -s report:migration -- shared.glossary.link-token
```

Expected: "sections: 1 atoms from pages"; the report prints one row with `Missing literals: none` and exits 0. Paste the table into the PR description.

- [x] **Step 4: Repoint relative links to the deleted file**

```bash
grep -rln "link-token.md" catalogue skills-src
```

In each file listed (excluding `catalogue/generated/`), replace the relative link with `/docs/hiecm/v3/getting-started/glossary#link-token`. Re-run `npm run -s build:sections`.

- [x] **Step 5: Run every gate**

```bash
npm run -s check:sections && npm run -s lint:atoms && node scripts/build-skills.mjs && npm run -s validate:skills && npm run -s check:plugins && npm run -s lint:content && npm run -s test:scripts && ./scripts/plan-check.sh && (cd mcp && go test ./...)
cat catalogue/generated/shared/glossary/link-token.md
```

Expected: all pass. The generated file's "In plain words" is the glossary text, "How you know it worked" and "When it goes wrong" are the two notes from Step 1, and `validate:skills` still resolves `shared.glossary.link-token`, now from its generated file.

- [x] **Step 5b: Prove the bot still finds, reads and links the atom**

Create `mcp/internal/catalogue/generated_test.go`:

```go
package catalogue

import (
	"path/filepath"
	"strings"
	"testing"
)

// Every atom built from a page must parse in the Go loader and chunk into
// real sections only: no empty body, no placeholder text competing in search.
func TestGeneratedAtomsParseAndChunkCleanly(t *testing.T) {
	atoms, err := LoadAtoms("../../../catalogue")
	if err != nil {
		t.Fatal(err)
	}
	found := 0
	for _, a := range atoms {
		if !strings.Contains("/"+filepath.ToSlash(a.SourcePath), "/generated/") {
			continue
		}
		found++
		if strings.TrimSpace(a.Body) == "" {
			t.Errorf("%s: empty body", a.ID)
		}
		for _, c := range ChunkAtom(a) {
			if strings.TrimSpace(strings.TrimPrefix(c.Text, a.Title)) == "" {
				t.Errorf("%s: empty chunk under %q", a.ID, c.Heading)
			}
		}
	}
	if found == 0 {
		t.Skip("no generated atoms yet")
	}
}
```

Then run, in order:

```bash
(cd mcp && go test ./internal/catalogue -run TestGeneratedAtomsParseAndChunkCleanly -v)
node scripts/build-atom-routes.mjs
node -e 'const r=require("./catalogue/atom-routes.json").routes.find(x=>x.atom==="shared.glossary.link-token"); if(r.link!=="/docs/hiecm/v3/getting-started/glossary#link-token"){console.error("link is",r.link);process.exit(1)} console.log("link ok:",r.link, "rule:", r.rule)'
cd mcp && go run ./cmd/indexer -catalogue ../catalogue -out "$TMPDIR/cat-after.db" -embed-provider none && CATALOGUE_DB="$TMPDIR/cat-after.db" go test ./internal/index -run TestRealCatalogueRanksLinkToken -v; cd ..
```

Expected: the parse test passes; the link check prints `link ok: /docs/hiecm/v3/getting-started/glossary#link-token rule: named by catalogue/map.yaml`; the ranking test passes, with `shared.glossary.link-token` first and its logged link ending `#link-token`. Paste the "after" ranking under the "before" one in the PR description.

Finally, the compiled skills changed in Step 5, so bump the integrators plugin: raise the patch number of `"version"` in `plugins/abdm-integrators-assistant/.claude-plugin/plugin.json`, run `npm run build:plugins`, and confirm `npm run -s check:plugin-version` and `npm run -s check:plugins` pass.

- [x] **[rev] Step 5d: Teach the contributor plugin the new rule**

Append to `plugins/abdm-contributors-assistant/skills/atom-authoring/SKILL.md`:

```markdown
## Migrated atoms are edited on their page

An atom listed in `catalogue/map.yaml` has no hand-written file. Its words are
the page section named by its `page` and `heading`, and its rules for agents are
the `<AgentOnly>` notes in that section. Edit the page, then run
`npm run build:sections`. Never edit `catalogue/generated/`. Only an atom that is
not in the map yet is edited as a file under `catalogue/`.
```

Bump the patch number of `"version"` in `plugins/abdm-contributors-assistant/.claude-plugin/plugin.json`, run `npm run build:plugins`, and confirm `npm run -s check:plugin-version` passes.

- [ ] **Step 6: Check the page, the toggle, search and the export** (built-output half done: the `.md` copy carries the note, the search index does not. The in-browser toggle check is open.)

Start the preview (`preview_start` with name `ui-worktree`), open `/docs/hiecm/v3/getting-started/glossary#link-token`, and confirm:
- the entry reads exactly as before, with no note visible;
- "Show notes for AI agents" sits in small type below the footer; clicking it shows the note under the entry, and the label changes to "Hide notes for AI agents";
- reloading keeps the choice; clicking again hides the note;
- in a fresh private window, `/docs/hiecm/v3/getting-started/glossary?agent-notes=1#link-token` shows the note.

Then run `npm run build`, serve it (`preview_start` with name `built-site`), and confirm: the built page's `.md` copy contains "Validate it before every link", and searching the site for "Validate it before every link" returns no result.

- [x] **Step 7: Commit**

```bash
git add -A site/docs/_glossary catalogue skills-src plugins site/static/skills plugin.json .codex-plugin .agents mcp/internal/index/catalogue_smoke_test.go mcp/internal/catalogue/generated_test.go
git commit -m "glossary: link token is the first atom whose words live only on its page"
```

Phase 1 is complete when this commit and Task 6b are green.

### [rev] Task 6b: Rehearse a real correction on the migrated page

The person named in the runbook, not the author of this plan, applies one NHA correction to the migrated link-token entry, following `docs/runbook-nha-corrections.md` and nothing else. Use a pending NHA correction if one touches the glossary; otherwise use this one: "The link token is valid for six months from generation."

- [ ] **Step 1: Apply the correction by the runbook**

Edit the visible text of `### Link token {#link-token}` in `site/docs/_glossary/_hiecm.mdx`, then run the runbook's commands:

```bash
npm run build:sections && npm run check:sections && npm run lint:content
```

- [ ] **Step 2: Confirm what must survive**

```bash
grep -n "### Link token {#link-token}" site/docs/_glossary/_hiecm.mdx
grep -n "Validate it before every link" site/docs/_glossary/_hiecm.mdx
grep -n "six months from generation" catalogue/generated/shared/glossary/link-token.md
```

Expected: the heading keeps its `{#link-token}`; the agent note is still there; the generated atom carries the new wording; every check passed in Step 1. Anything the runbook did not make clear is fixed in the runbook in the same PR.

- [ ] **Step 3: Commit**

```bash
git add site/docs/_glossary/_hiecm.mdx catalogue/generated catalogue/registry.json docs/runbook-nha-corrections.md
git commit -m "glossary: a correction applied by the runbook reaches the generated atom"
```

---

## After Phase 1: one class per PR

Each class below is its own plan, written when the class before it lands. Every class PR follows the same checklist:

1. Give every destination heading an explicit id: `{#id}` in `.md`, `{/* #id */}` in `.mdx`. Convert a page to `.mdx` only if it gains an `<AgentOnly>`, in its own commit, with `npm run build` passing before content moves.
2. Move each atom's words onto its page section; agent-only rules go in `<AgentOnly>` with the four labels.
3. Add the class's entries to `catalogue/map.yaml`; delete the class's hand-written files in the same PR.
4. Run `npm run report:migration -- <every id in the class>` before committing and paste the table in the PR. A dropped literal needs a stated reason.
5. Update `plan/`, the contributor plugin's skills and `CLAUDE.md` if the change makes any of them wrong. `plan-check` must pass.
6. Run every gate, including a rebuild of the skills, `build-atom-routes.mjs`, and the Go parse test.
7. Build a keyword-only index before and after, and extend `TestRealCatalogueRanksLinkToken` with one query per migrated atom (its title's first phrase). Each must rank no worse than before; paste both rankings in the PR. **[rev]** Once the retrieval plan's Task R1 is merged, also add at least one eval case per migrated atom and run the per-case check (Global Constraints).
8. **[rev]** `npm run lint:atoms` and `npm run check:sections` must pass; no atom lists itself as related (Task 4e).
9. Bump the version of every plugin whose files changed, then `npm run build:plugins`. `check:plugin-version` fails the PR otherwise.

| Order | Class | Blocked on |
|---|---|---|
| 1 | The rest of the shared glossary (47) | nothing |
| 2 | HIE-CM concepts (20) | nothing |
| 3 | Shared FHIR, sandbox, concepts, decisions (23) | nothing |
| 4 | Agent methods into `skills-src/` (about 5) | nothing |
| 5 | NHCX concepts, flows, glossary, FHIR, sandbox (109) | the NHCX decision |
| 6 | NHCX errors (310): **[rev]** one section per code; adds a `lint:content` page type for error guides and an exact-code lookup in the indexer | the NHCX decision |
| 7 | NHCX endpoints and callbacks (68): **[rev]** the skeleton (title, path, params, responses, error codes) is generated from the spec by `build-api-reference.mjs`; only the notes partial is authored | the NHCX decision |
| 8 | NHCX tests, troubleshooting, decisions (49) | the NHCX decision |

When the last class lands, `catalogue/` holds no hand-written atom file, `registry.json` shows every entry as `"source": "page"`, and `lint:atoms` checks only generated files.

**[rev] Where a human still writes.** A new prose claim on a page, an `<AgentOnly>` note, a map entry, and approving a diff. Contract v2, error records and tool consolidation are in the retrieval plan.
