# Catalogue per-gateway layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `catalogue/` has one folder per gateway (`hiecm/`, `nhcx/`, `uhi/`), plus `shared/` and `annexure/`. Each gateway folder holds everything that gateway has: its content map, its OpenAPI specs with their corrections and upstream sources, its sandbox records, and one folder per atom type with every atom file for that gateway in it, glossary included. A term stays in `shared/` only when it means the same thing on every gateway.

**Architecture:** This is a move, not a rewrite. The page is still where an atom's words are written. `scripts/build-sections.mjs` writes the atom file into `catalogue/<gateway>/<type>/<slug>.md`, not into `catalogue/generated/`. A written file is told apart from a hand-written one by `generated: true` in its frontmatter, not by the folder it sits in. One module, `scripts/lib/paths.mjs`, owns every catalogue path the Node scripts use. The Go indexer gets the same three rules. Atom ids, page URLs, operation ids and every published output stay byte-identical. The parity snapshot proves that.

**Tech Stack:** Node 24 ESM scripts (`node:test`), Go indexer (`mcp/`), Docusaurus site, GitHub Actions.

**Spec:** `plan/abdm-v1-phase1-architecture-and-plan.md` §3.2 (`p3-2-atom`) at plan version `2026.09.29-8`, which carries the target tree below. Background: `docs/superpowers/plans/2026-09-28-page-canonical-knowledge-atoms.md` (why pages are the source) and `2026-09-29-hiecm-atoms-rebuild.md` (the 227 HIE-CM atoms this moves).

## The target tree

```
catalogue/
  README.md            the map of this tree
  VERSION              the catalogue version stamp
  hiecm/
    README.md
    map/               content map: atom id to page and heading id, no prose
                       (was map.d/hiecm-*.yaml, files renamed without the prefix)
    openapi/
      v3/              hiecm-*.yaml, README.md, journeys/, errors/
      corrections/     2026-09-16-final-set.md, 2026-09-21-record-share-ingest.md
      .raw/            nha-2026-09-15-review, -16, -21-record-share, -21-review, -22, -23, -24
    verification/      sandbox records, one per call, and retired/
    titles.yaml        HIE-CM rows of the old catalogue/titles.yaml
    postman.json       was catalogue/postman.json (HIE-CM collections only)
    callbacks/ concepts/ decisions/ endpoints/ errors/ flows/ glossary/ tests/ troubleshooting/
  nhcx/
    README.md
    openapi/
      v1/              nhcx-*.yaml, README.md
      corrections/     2026-09-15-nhcx-ingest.md, 2026-09-24-nhcx-review.md, 2026-09-24-nhcx-review-exchange.md
      .raw/            nhcx-site-2026-09-14, nhcx-package-2026-09-15
    titles.yaml        NHCX rows of the old catalogue/titles.yaml
    callbacks/ concepts/ decisions/ endpoints/ errors/ fhir/ flows/ glossary/ sandbox/ tests/ troubleshooting/
  uhi/
    README.md
    openapi/
      v1/              uhi-*.yaml, README.md, journeys/
      corrections/     2026-09-28-uhi-ingest.md, 2026-09-28-uhi-sources.md
      .raw/            nha-2026-09-28-uhi
    glossary/          eua.md, hspa.md
  shared/
    openapi/           CONVENTIONS.md, extensions.md, nrces/ (PINNED, README.md),
                       .raw/nrces-ndhm.in-6.5.0.tgz
    vocabulary.yaml
    concepts/ decisions/ fhir/ glossary/ sandbox/   glossary/ keeps only terms every gateway shares
  annexure/            sources atoms cite, not atoms
  changelog/           What's New facts and entries
  registry.json        built: every atom and where its words live
  atom-routes.json     built: every atom's page route
```

Gone: `catalogue/generated/`, `catalogue/map.yaml`, `catalogue/map.d/`, `catalogue/openapi/`, `catalogue/verification/`, `catalogue/titles.yaml`, `catalogue/postman.json`, and the empty `.gitkeep` type folders under `uhi/`. A folder exists when it holds a file. Each gateway's `README.md` lists the whole shape, so an empty gateway still says what goes where.

**File moves at a glance** (Tasks 2 to 5; every move is `git mv` so history follows):

| From | To |
|---|---|
| `openapi/<gw>/<ver>/**` | `<gw>/openapi/<ver>/**` |
| `openapi/corrections/<f>` | `<gw>/openapi/corrections/<f>`, gateway per the tree |
| `openapi/.raw/<drop>` | `<gw>/openapi/.raw/<drop>`, gateway per the tree |
| `openapi/.raw/nrces-ndhm.in-6.5.0.tgz`, `openapi/nrces/`, `openapi/CONVENTIONS.md`, `openapi/extensions.md` | `shared/openapi/...` |
| `map.yaml` | `hiecm/map/glossary.yaml` (its one entry, link token, becomes `hiecm.glossary.link-token` in Task 6) |
| `map.d/hiecm-<name>.yaml` | `hiecm/map/<name>.yaml` |
| `generated/<gw>/<type>/<slug>.md` | `<gw>/<type>/<slug>.md` |
| `verification/**` | `hiecm/verification/**` (all 55 records and 10 retired are HIE-CM operation ids) |
| `titles.yaml` | `hiecm/titles.yaml` and `nhcx/titles.yaml`, split by operationId prefix |
| `postman.json` | `hiecm/postman.json` |
| `shared/fhir/fhir-document-bundles.md` | `shared/fhir/document-bundles.md` (the one hand atom whose filename is not its id slug) |
| `shared/glossary/<term>.md`, 22 HIE-CM terms | `hiecm/glossary/<term>.md`, id `hiecm.glossary.<term>` (Task 6) |
| `shared/glossary/eua.md`, `hspa.md` | `uhi/glossary/`, id `uhi.glossary.<term>` (Task 6) |

## Global Constraints

- The docs page is where atom words are written. A file with `generated: true` is never hand-edited.
- No page URL, operationId, heading id or site route changes. No atom id changes except the 24 glossary renames in Task 6, and each of those is fixed at every citation in the same commit.
- Nothing inside any `.raw/` folder is edited. Upstream files are stored untouched, including their own MANIFESTs.
- Every commit leaves every CI check green. The list is in Task 8, Step 2.
- A move changes no published output. The parity snapshot before Task 1 must equal the one after each task (Task 8 defines both).
- No em dash anywhere: code, prose, commit messages.
- A plugin whose files change bumps its version (`check:plugin-version`). `nhcx` goes 1.0.1 to 1.0.2 in Task 5. `abdm-contributors-assistant` already went to 0.4.0 with the plan (Task 0).
- `plan/` does not move in this plan beyond Task 0. `./scripts/plan-check.sh` stays green.
- Commit with explicit paths (`git add <paths>`). Never `git add -A`, never force-push.

## Review Focus

1. **A build deletes a hand-written atom.** `build:sections` today runs `rmSync(catalogue/generated)`. Co-located, the same line would wipe hand atoms. Expect the build to delete only files carrying `generated: true` that no map entry wants, and to refuse to overwrite a file without it. This is pinned in Task 4, Step 1.
2. **A half-finished move leaves two copies of one id.** `loadAtoms` silently keeps the last. Expect lint to name both files. This is pinned in Task 4, Step 1.
3. **Specs vanish without an error.** The indexer's `isSpecPath` and the site's spec walker return nothing under the new layout, and nothing fails. Expect the operation count, the site's API route count and the spec file list to be unchanged. This is pinned by the parity snapshot in Task 2, Step 9, and by the `isSpecPath` table in Task 2, Step 1.
4. **What's New invents an NHA republish.** Spec `x-abdm-sources` strings change with the move, and `republish()` reads a new string as news from NHA. Expect `npm run changelog` to write zero entries in Task 2. This is pinned in Task 2, Step 1 (`sourceKey`).
5. **A renamed glossary id survives somewhere.** An NHCX atom's `related`, an eval case or a Go test still names `shared.glossary.hip` after Task 6. Expect lint, the eval case check and a repo-wide grep to find none (Task 6, Steps 4 and 5).
6. **Something lands in the wrong folder later.** Expect lint to reject any name at `catalogue/` or `catalogue/<gw>/` outside the tree, and any atom whose path is not `catalogue/<gateway>/<type folder>/<id slug>.md`. This is pinned in Task 5, Step 1. The FHIR tests skipping silently when the NRCeS package moves is checked in Task 2, Step 8.

---

### Task 0: Plan and contributors' plugin (done with this plan)

Landed in the same commit as this document:

- `plan/abdm-v1-phase1-architecture-and-plan.md` moved to `2026.09.29-7`, with §3.2 carrying the tree above (`2026.09.29-8` adds the glossary split).
- §3.3, §3.8, §3.9, §7, §8.1 and §10 carry the new paths.
- The previous version is archived in `plan/plan-history/`.
- The four compiled skills are restamped and recompiled.
- The gantt `PLAN_VERSION` is restamped.
- The contributors' plugin skills, commands and agents name the new paths, at version 0.4.0.
- A second plan edit, `2026.09.29-8`, records the glossary split: `hiecm/glossary/` and `uhi/glossary/` in the tree, UHI's two glossary atoms in §7 and in the index. Contributors' plugin 0.4.1.
- The What's New plugin entry is regenerated.

The plugin now describes the target, so **this branch does not merge until Task 8 passes.**

### Task 1: One module owns catalogue paths

**Files:**
- Create: `scripts/lib/paths.mjs`, `scripts/lib/paths.test.mjs`
- Modify: `scripts/lint-atoms.mjs:13-19` (drop `FOLDER`, import it), `scripts/build-sections.mjs:17` (same)

**Interfaces:**
- Produces, all paths repo-relative with `/`:
  - `GATEWAYS = ['hiecm','nhcx','uhi','shared']`
  - `FOLDER` (type to folder, the map now in lint-atoms)
  - `atomPath(id: string, type: string, gateway: string): string`, returning `catalogue/${gateway}/${FOLDER[type]}/${slug}.md`, where `slug = id.split('.').slice(2).join('.')`
  - `specRoots(root: string): {gateway: string, dir: string}[]`: each existing `catalogue/<gw>/openapi`, `dir` absolute
  - `rawDirs(root: string): string[]`: each existing `catalogue/<gw>/openapi/.raw`, absolute
  - `mapFiles(root: string): string[]`: `catalogue/*/map/*.yaml`, absolute, sorted by relative path
  - `verificationDir(gateway: string): string`, returning `catalogue/${gateway}/verification`
  - `TOP_LEVEL` and `GATEWAY_LEVEL`: the allowed names from the tree

- [ ] **Step 1: Write the failing tests** in `scripts/lib/paths.test.mjs`:
  - `atomPath('shared.glossary.link-token','glossary','shared') === 'catalogue/shared/glossary/link-token.md'`
  - `atomPath('hiecm.endpoint.m2-generate-link-token','endpoint','hiecm') === 'catalogue/hiecm/endpoints/m2-generate-link-token.md'`
  - `mapFiles(tmp)` on a temp tree holding `catalogue/hiecm/map/b.yaml`, `catalogue/hiecm/map/a.yaml` and `catalogue/shared/map/x.yaml` returns them in the order `hiecm/map/a`, `hiecm/map/b`, `shared/map/x`
  - `specRoots(tmp)` lists only gateways that have an `openapi/` folder
- [ ] **Step 2:** `node --test scripts/lib/paths.test.mjs`. Expect FAIL (module not found).
- [ ] **Step 3:** Implement `paths.mjs`. Import `FOLDER` from it in lint-atoms and build-sections.
- [ ] **Step 4:** `node --test scripts/lib/paths.test.mjs && npm run -s lint:atoms && npm run -s check:sections`. Expect PASS, and `854 atoms`.
- [ ] **Step 5: Commit.** `feat(catalogue): one module owns the catalogue's paths`

### Task 2: Specs, corrections and upstream sources move into their gateway

**Files:**
- Move: every row of the moves table whose source starts with `openapi/`
- Modify (Node):
  - `scripts/specs.mjs`: `listSpecs` walks `specRoots()`. `listSpecTree` reads `<gw>/openapi/<ver>/<file>` and keeps its return shape.
  - `scripts/lib/journeys.mjs:32`, `scripts/lib/spec-errors.mjs:11,23-24`: `catalogue/<platform>/openapi/<version>/...`
  - `scripts/lib/changelog-facts.mjs:117,233-246` and `scripts/lib/changelog-rules.mjs:43-56`: see `sourceKey` below
  - `scripts/check-source-freshness.mjs:22-42`: hash every `rawDirs()`, walk specs through `listSpecTree()`
  - `scripts/ingest-nha.mjs:14-16,224,323,330,819`: RAW, OUT, LOG and the written source string under `catalogue/hiecm/openapi/`
  - `scripts/ingest-uhi.mjs:17-20,189` and `scripts/ingest-uhi.test.mjs:13,51,62`: the same under `catalogue/uhi/openapi/`
  - `scripts/redact-nha-raw.mjs:14-15,274` and its test `:13,17,55`: a drop ending `-uhi` lives in `uhi/openapi/.raw`, any other in `hiecm/openapi/.raw`
  - `scripts/rekey-verification.mjs:44`, `scripts/compile-skills.mjs:13,96`, `scripts/build-skills.mjs:29,423`: `catalogue/hiecm/openapi/v3`
  - `scripts/build-sections.mjs:77` (`specText`): walk `listSpecs()`
  - `scripts/sync-specs.mjs:36`: gateway is `slice(-4,-3)`
  - `site/docusaurus.config.ts:41-60`: delete `listSpecFiles`, import `listSpecs` from `../scripts/specs.mjs`
  - `package.json` `lint:specs`: `catalogue/*/openapi/*/*.yaml`
  - `.github/workflows/publish-postman.yml:18`: `catalogue/hiecm/openapi/**`
  - `tools/nhcx-editor/index.php:40,46`: specs root `catalogue/nhcx/openapi`. The atoms root denies `openapi/`.
- Modify (Go):
  - `mcp/cmd/indexer/main.go:46,65-85`
  - `mcp/internal/catalogue/load.go:43`
  - `mcp/internal/catalogue/operations.go:59-67`
  - tests: `mcp/cmd/indexer/main_test.go:35,82,220-230`, `mcp/internal/catalogue/operations_test.go:16,57,352,382,447,453,490`, `mcp/internal/fhir/digest_test.go:63`, `validate_test.go:259`
  - fixture: move `mcp/internal/catalogue/testdata/catalogue/openapi/hiecm/v3/hiecm-v3.yaml` to `testdata/catalogue/hiecm/openapi/v3/hiecm-v3.yaml`
- Rewrite: the path strings inside `catalogue/` outside every `.raw/`, using `rewrite-paths.mjs` (Step 5)

**Interfaces:**
- Consumes: `specRoots`, `rawDirs` (Task 1)
- Produces:
  - `sourceKey(file: string): string` in `scripts/lib/changelog-facts.mjs`. It returns the part after the last `/.raw/`, or `file` unchanged.
  - `isSpecPath(rel string) bool` in Go: exactly 4 segments, `segs[1] == "openapi"`, no segment starting with `.`, suffix `.yaml`
  - `specGateway(path string) string` in Go: the segment before the last `openapi` segment

- [ ] **Step 1: Write the failing tests.**
  - `scripts/changelog.test.mjs`, a source that only moved folders is not a republish: `republish()` gets a previous module citing `catalogue/openapi/.raw/nha-2026-09-16/a.yaml` (hash `h`) and a next module citing `catalogue/hiecm/openapi/.raw/nha-2026-09-16/a.yaml` (hash `h`). Expect `null`. Export `republish` if it is not exported.
  - `main_test.go` `TestIsSpecPath` rows:
    - `hiecm/openapi/v3/hiecm-m1.yaml` true
    - `openapi/hiecm/v3/hiecm-m1.yaml` false
    - `hiecm/openapi/v3/journeys/m1.yaml` false
    - `hiecm/openapi/v3/errors/m1.yaml` false
    - `hiecm/map/m1.yaml` false
    - `hiecm/openapi/.raw/x/y.yaml` false
    - `shared/openapi/nrces/PINNED` false
  - `main_test.go:82` writes `hiecm/openapi/CONVENTIONS.md` and still expects it skipped.
  - `operations_test.go:447-453` opens `../../../catalogue/hiecm/openapi/v3/hiecm-m1.yaml` and asserts `op.Gateway == "hiecm"`.
- [ ] **Step 2:** `node --test scripts/changelog.test.mjs; (cd mcp && go test ./cmd/indexer ./internal/catalogue)`. Expect FAIL on the new rows.
- [ ] **Step 3: Implement.** Do the Node and Go changes in the Files list:
  - `sourceKey` is applied where facts are built (`changelog-facts.mjs:117`) and to both sides inside `republish()`.
  - `load.go` skips a `.md` when any path segment is `openapi`.
  - The indexer's `-nrces` default is `../catalogue/shared/openapi/.raw/nrces-ndhm.in-6.5.0.tgz`.
- [ ] **Step 4: Move the files** with `git mv`, following the moves table. Remove `catalogue/openapi/.raw/.gitkeep`, then confirm `catalogue/openapi` is gone.
- [ ] **Step 5: Rewrite the path strings.** Use a one-off `$SCRATCH/rewrite-paths.mjs`, not committed. It walks a list of roots, skips `node_modules`, `.git`, `plan/plan-history`, `scripts/fixtures` and any path containing `/.raw/`, and in every `.md`, `.mdx`, `.yaml`, `.json`, `.ts`, `.tsx`, `.mjs`, `.go`, `.php` and `.py` file applies these replacements in order:
  - `catalogue/openapi/.raw/<drop>` becomes `catalogue/<gw>/openapi/.raw/<drop>`. Use the drop-to-gateway table from the tree; the nrces tgz goes to `shared`.
  - `catalogue/openapi/corrections/<file>` becomes `catalogue/<gw>/openapi/corrections/<file>`, using the corrections table.
  - `catalogue/openapi/(hiecm|nhcx|uhi)/` becomes `catalogue/$1/openapi/`.
  - `catalogue/openapi/(nrces/|CONVENTIONS.md|extensions.md)` becomes `catalogue/shared/openapi/$1`.

  Run it on `catalogue/` only in this task, and print the per-file count. Fix `shared/openapi/extensions.md`'s link to `../../../CONTRIBUTING.md`.
- [ ] **Step 6:** `npm run -s build:specs && npm run -s check:specs`. Expect PASS. The spec diff is only `x-abdm-sources` path strings: `git diff --stat -- catalogue/*/openapi/*/*.yaml` shows only those lines.
- [ ] **Step 7:** `npm run -s changelog`. Expect `0 entries`. The facts files may re-key; the entries files must not change. If an entry is written, stop: `sourceKey` is not applied on one side.
- [ ] **Step 8:** `(cd mcp && go vet ./... && go test ./... -v 2>&1 | grep -E '^--- SKIP' | grep -iE 'nrces|digest|validate')`. Expect no FHIR skip lines, which shows the NRCeS package was found at its new path.
- [ ] **Step 9:** Take the parity snapshot (Task 8, Step 1) into `$SCRATCH/parity-task2` and diff it against `$SCRATCH/parity-base`. Expect no difference.
- [ ] **Step 10:** Run the CI check list (Task 8, Step 2). Expect all PASS.
- [ ] **Step 11: Commit.** `refactor(catalogue): each gateway holds its own specs, corrections and upstream sources`

### Task 3: Content maps move into their gateway

**Files:**
- Move: `catalogue/map.yaml` to `catalogue/hiecm/map/glossary.yaml` (link token is a HIE-CM term; its id changes in Task 6, and until then `shared.glossary.link-token` in a HIE-CM map file is allowed because `build-sections` places a file by the entry's `gateway`, not by the map file's folder); `catalogue/map.d/hiecm-<name>.yaml` to `catalogue/hiecm/map/<name>.yaml`
- Modify:
  - `scripts/lib/map.mjs:10-11`: read `mapFiles(root)`
  - `scripts/lib/map.test.mjs:11,18-21,30-31,36-37,42-43`: fixtures and expected messages use `catalogue/hiecm/map/*.yaml`
  - `scripts/build-sections.mjs:43-44` message
  - `scripts/build-atom-routes.mjs:227,403,441`: rule text becomes `named by catalogue/<gateway>/map/`

**Interfaces:** Consumes `mapFiles` (Task 1). `loadMap(root)` keeps its signature and return shape.

- [ ] **Step 1:** Update `map.test.mjs` so it builds the new tree and expects an id defined in two files to name both `catalogue/hiecm/map/a.yaml` and `catalogue/hiecm/map/glossary.yaml`. Run `node --test scripts/lib/map.test.mjs`. Expect FAIL.
- [ ] **Step 2:** Implement, then `git mv` the files.
- [ ] **Step 3:** `node --test scripts/lib/map.test.mjs && npm run -s check:sections && npm run -s build:routes`. Expect PASS. `git diff catalogue/atom-routes.json` shows only the rule text.
- [ ] **Step 4:** Run the parity snapshot and the CI check list. Expect no difference and all PASS.
- [ ] **Step 5: Commit.** `refactor(catalogue): each gateway holds its own content map`

### Task 4: Written atom files join their gateway's type folders

**Files:**
- Move: `catalogue/generated/<gw>/<type>/*.md` to `catalogue/<gw>/<type>/`; `shared/fhir/fhir-document-bundles.md` to `shared/fhir/document-bundles.md`
- Modify:
  - `scripts/build-sections.mjs:20,85,89-103`
  - `scripts/build-sections.test.mjs:26`
  - `scripts/lib/atoms.mjs`: `loadAtoms(dir = catalogueDir)`, and report duplicate ids
  - `scripts/lint-atoms.mjs`: fail on duplicates
  - `scripts/migration-report.mjs:44`: use `atomPath`
  - `mcp/internal/catalogue/atom.go:63-82`: parse `generated bool`
  - `mcp/internal/catalogue/generated_test.go:18`: select by `Generated`, and fail rather than skip when none are found

**Interfaces:**
- Consumes: `atomPath` (Task 1)
- Produces:
  - `generatedPath(id, entry)` in build-sections now returns `atomPath(id, entry.type, entry.gateway)`.
  - `writePlan(want: Map<string,string>, onDisk: Map<string,{generated: boolean}>): {write: string[], remove: string[], problems: string[]}` in build-sections. It is pure, and its keys are repo-relative paths.
  - `loadAtoms()` returns `{atoms, duplicates}`, where `duplicates` is a `string[]` of `"<id>: <fileA>, <fileB>"`.

- [ ] **Step 1: Write the failing tests.**
  - `build-sections.test.mjs`:
    - `generatedPath('shared.glossary.link-token', {type:'glossary', gateway:'shared'}) === 'catalogue/shared/glossary/link-token.md'`
    - `writePlan`, when a wanted path exists on disk with `generated:false`: `problems` has `<path> is hand-written; build:sections will not overwrite it`, and the path is not in `write`
    - `writePlan`, when an on-disk `generated:true` file is not wanted: it is in `remove`
    - `writePlan`, when an on-disk `generated:false` file is not wanted: it is in neither `remove` nor `problems`
  - `scripts/lib/atoms.test.mjs`: a temp catalogue with two files carrying the same `id` gives `duplicates.length === 1`, naming both files.
- [ ] **Step 2:** `node --test scripts/build-sections.test.mjs scripts/lib/atoms.test.mjs`. Expect FAIL.
- [ ] **Step 3: Implement.**
  - Hand atoms are those without `fm.generated === true`.
  - `--check` reports stale wanted files, plus `generated: true` files that no map entry wants.
  - Build mode applies `writePlan`. It never calls `rmSync` on a directory, and exits 1 on any problem before writing.
- [ ] **Step 4: Move the files.** `git mv` each generated file to `atomPath(...)`, then `git mv` the fhir file. Confirm `catalogue/generated` is gone.
- [ ] **Step 5:** `npm run -s build:sections && git status --short catalogue`. Expect only `registry.json` modified, with `file` fields only. No atom file changes, because the build wrote identical bytes.
- [ ] **Step 6:** `npm run -s lint:atoms && npm run -s check:sections && (cd mcp && go test ./internal/catalogue -run Generated -v)`. Expect PASS, `854 atoms`, and the generated test running, not skipped.
- [ ] **Step 7:** Run the parity snapshot and the CI check list. Expect no difference and all PASS.
- [ ] **Step 8: Commit.** `refactor(catalogue): written atom files sit in their gateway's type folders`

### Task 5: Sandbox records, titles and Postman ids move; lint holds the shape

**Files:**
- Move: `catalogue/verification/` to `catalogue/hiecm/verification/`; `catalogue/postman.json` to `catalogue/hiecm/postman.json`. Split `catalogue/titles.yaml` by operationId prefix into `hiecm/titles.yaml` and `nhcx/titles.yaml`. Delete the `.gitkeep` type folders under `catalogue/uhi/`.
- Modify:
  - `scripts/verify-atoms.mjs:31` (`verificationDir(fm.gateway)`)
  - `scripts/rekey-verification.mjs:55-59` (`verificationDir('hiecm')`)
  - `scripts/stamp-nhcx-skills.mjs:36-51,76-77`: atoms from `loadAtoms()` filtered to `gateway === 'nhcx'`; records from `verificationDir('nhcx')`, where a missing folder counts 0; template path
  - `scripts/build-api-reference.mjs:60`: merge every `catalogue/*/titles.yaml`
  - `scripts/build-postman.mjs:25`, `scripts/publish-postman.mjs:24-25,68,72`: `catalogue/hiecm/postman.json`
  - `.github/workflows/publish-postman.yml:19`
  - `scripts/lint-atoms.mjs`: add the layout rule
  - `plugins/nhcx/.claude-plugin/plugin.json`: version 1.0.2
- Regenerate: `npm run stamp:nhcx` (7 NHCX SKILL.md), `npm run build:plugins`

**Interfaces:** Consumes `verificationDir`, `TOP_LEVEL`, `GATEWAY_LEVEL`, `FOLDER` and `atomPath` (Task 1). Produces `layoutProblems(root): string[]` in `scripts/lib/paths.mjs`.

- [ ] **Step 1: Write the failing tests** in `paths.test.mjs`, `layoutProblems` on a temp tree:
  - `catalogue/generated/` present: one problem naming it
  - `catalogue/hiecm/stuff/` present: one problem naming it
  - a clean tree built from the target tree: `[]`

  Then in lint-atoms: an atom at `catalogue/nhcx/concepts/x.md` with `gateway: hiecm` fails with `expected at catalogue/hiecm/concepts/x.md`.
- [ ] **Step 2:** `node --test scripts/lib/paths.test.mjs`. Expect FAIL.
- [ ] **Step 3: Implement.**
  - `layoutProblems` allows `TOP_LEVEL` at `catalogue/`. At `catalogue/<gw>/` it allows `GATEWAY_LEVEL` plus the `FOLDER` values.
  - lint-atoms fails on any `layoutProblems`, and on any atom whose repo-relative path is not `atomPath(fm.id, fm.type, fm.gateway)`.
  - Then make the other script changes and `git mv` the files.
- [ ] **Step 4:** `npm run -s lint:atoms && npm run -s stamp:nhcx && npm run -s check:nhcx-stamp && npm run -s build:plugins && npm run -s check:plugin-version`. Expect PASS. `854 atoms`, and no layout problem.
- [ ] **Step 5:** Run the parity snapshot and the CI check list. Expect no difference and all PASS. `npm run changelog` writes only the `nhcx` plugin 1.0.2 entry.
- [ ] **Step 6: Commit.** `refactor(catalogue): records, titles and Postman ids live with their gateway, and lint holds the shape`

### Task 6: Gateway-specific glossary terms move to their gateway

A term stays `shared.glossary.*` only when it means the same thing on every gateway. The site already draws the line: `site/docs/_glossary/_shared.mdx` is imported by the HIE-CM and UHI glossary pages, `_hiecm.mdx` only by HIE-CM's, `_uhi.mdx` only by UHI's. Terms on no partial are placed by what they mean.

| Moves to | Ids (slug unchanged, prefix and `gateway` change) |
|---|---|
| `hiecm` (19 on `_hiecm.mdx`) | bridge, consent-manager, discovery, ecdh, emr, hi-type, hip, hiu, hmis, hrp, ims, lims, link-token, m1, m2, m3, m4, pms, purpose-of-use |
| `hiecm` (on no partial) | auth-modes (ABHA auth modes a HIE-CM call asks for), key-material (the HIP and HIU ECDH pairs), x-cm-id (the consent manager header) |
| `uhi` (on `_uhi.mdx`) | eua, hspa |
| stays `shared` | abdm, abha, abha-address, abha-number, fhir, gateway, hfr, hie-cm, hpid, hpr, kyc, nha, nhcx, otp, phr, sandbox, txn-id, uhi (on `_shared.mdx`); ayushman-card, dsc, nrces, snomed-ct, and request-id and timestamp-header (NHCX sends both headers too) |

**Files:**
- Move: 22 files `catalogue/shared/glossary/<slug>.md` to `catalogue/hiecm/glossary/`, 2 to `catalogue/uhi/glossary/`. `link-token` has no hand file; its map entry in `catalogue/hiecm/map/glossary.yaml` changes id and `gateway`, and `build:sections` writes `catalogue/hiecm/glossary/link-token.md`.
- Rewrite: every citation of the 24 old ids, by a one-off `$SCRATCH/rename-glossary.mjs`. It holds the table above as `{old: new}` and replaces `shared\.glossary\.(<slug>)(?![\w-])` in every text file under `catalogue/` (not `.raw/`), `evals/`, `mcp/eval/`, `scripts/*.test.mjs`, `mcp/internal/**/*_test.go` that read the real catalogue (`../../../catalogue`), `site/`, `skills-src/` and `plugins/` (not generated skill folders). It leaves alone Go tests that define the atom themselves, `plan/plan-history/`, `docs/superpowers/plans/` and `scripts/fixtures/`.
- Modify: each moved atom's frontmatter `id` and `gateway`, by the same script.

**Interfaces:** Consumes `atomPath` and the layout lint (Tasks 1, 5). Produces no code.

- [ ] **Step 1:** Take the parity snapshot into `$SCRATCH/parity-pre-glossary`, and run `mcp/eval/gate.sh pre-glossary` to record retrieval before the rename.
- [ ] **Step 2:** Run the script, then `git mv` the 24 files. Print the per-file replacement count; the NHCX atoms' `related` lists account for most of it.
- [ ] **Step 3:** `npm run -s build:sections && npm run -s build:routes`. Expect `catalogue/hiecm/glossary/link-token.md` written, the old generated file removed, and route changes only for the 24 renamed ids. List any renamed id whose route changed, with why, in the commit message.
- [ ] **Step 4:** `npm run -s lint:atoms && npm run -s check:sections && (cd mcp && go test ./... && go run ./cmd/askai-eval check -cases ../evals/askai/cases)`. Expect PASS and `854 atoms`, with glossary split `shared 24, hiecm 22, uhi 2, nhcx 29` in `node -e` over `loadAtoms()`.
- [ ] **Step 5:** Search for leftovers:

  ```bash
  git grep -nE 'shared\.glossary\.(bridge|consent-manager|discovery|ecdh|emr|hi-type|hip|hiu|hmis|hrp|ims|lims|link-token|m1|m2|m3|m4|pms|purpose-of-use|auth-modes|key-material|x-cm-id|eua|hspa)([^a-z0-9-]|$)' -- ':!plan/plan-history' ':!docs/superpowers/plans' ':!scripts/fixtures' ':!**/.raw/**'
  ```

  Expect only Go tests that define their own atoms.
- [ ] **Step 6:** Take the parity snapshot, apply the rename map to `$SCRATCH/parity-pre-glossary/{registry,routes}.txt` with `sed`, and diff. Expect no difference beyond the Step 3 route list. Then `mcp/eval/gate.sh glossary` and `python3 mcp/eval/compare.py <pre-glossary run> <glossary run>`. A case whose expected source was renamed compares by new id. Expect no rank falls. A fall means a gateway filter now hides a term from a question scoped to another gateway: stop and report it rather than move the term back.
- [ ] **Step 7:** Run the CI check list. Expect all PASS.
- [ ] **Step 8: Commit.** `refactor(catalogue): HIE-CM and UHI glossary terms live with their gateway; shared keeps what every gateway shares`

### Task 7: Everything that describes the tree says the new tree

**Files:**
- Rewrite: `catalogue/README.md`, as the target tree above plus the indexer rules at their new paths. Create `catalogue/hiecm/README.md`, `catalogue/nhcx/README.md` (replacing the existing one) and `catalogue/uhi/README.md` (replacing the existing one); each gives the gateway's shape in 10 lines or fewer.
- Modify:
  - `CLAUDE.md:28-29`: generated outputs become "atom files carrying `generated: true`, and `catalogue/registry.json`"
  - `README.md:18-19,94,96,120`, `CONTRIBUTING.md:13,72`, `.spectral.yaml:3,12`, `docs/runbook-nha-corrections.md:32,39,46-47`
  - `site/README.md`, `site/docs/{hiecm/v3,uhi/v1,nhcx/v1}/api/README.md`
  - `mcp/README.md`, `mcp/support-agent-playbook.md:338,347`
  - `site/src/components/docs/quickstart-values.ts:47`, `quickstart-values.test.mjs:4`, `Quickstart.tsx:31`
  - `scripts/verify-nhcx.sh:23`
  - `tools/nhcx-editor/README.md`, `evals/askai/cases/**` `notes` fields
  - the `source:` frontmatter of the hand-written site pages listed in the site inventory, including `hiecm/v3/troubleshooting/index.md`, which becomes `catalogue/hiecm/troubleshooting`
- [ ] **Step 1:** Run `$SCRATCH/rewrite-paths.mjs` on those files, plus these extra replacements:
  - `catalogue/map.yaml` becomes `catalogue/<gateway>/map/`
  - `catalogue/map.d/` becomes `catalogue/<gateway>/map/`
  - `catalogue/generated/` becomes `catalogue/<gateway>/<type>/`
  - `catalogue/verification/` becomes `catalogue/hiecm/verification/`
  - `catalogue/titles.yaml` becomes `catalogue/<gateway>/titles.yaml`
  - `catalogue/postman.json` becomes `catalogue/hiecm/postman.json`

  Hand-fix any sentence that no longer reads.
- [ ] **Step 2:** Check for leftovers:

  ```bash
  grep -rnE 'catalogue/(openapi|generated|map\.d|map\.yaml|verification|titles\.yaml|postman\.json)' --exclude-dir={node_modules,.git,plan-history,fixtures,.raw} . | grep -v docs/superpowers/plans
  ```

  Expect no output.
- [ ] **Step 3:** `npm run -s lint:content && grep -rnP '\x{2014}' catalogue/*/README.md catalogue/README.md CLAUDE.md`. Expect PASS and no output.
- [ ] **Step 4: Commit.** `docs(catalogue): every description of the catalogue names the per-gateway tree`

### Task 8: Parity gate and the whole-branch check

- [ ] **Step 1: Take the parity snapshot.** Run it once on the untouched base before Task 1, into `$SCRATCH/parity-base`, and after each task as above. `$SCRATCH` is the session scratchpad. It records:

  ```bash
  out=$SCRATCH/parity-$LABEL; mkdir -p $out
  npm run -s lint:atoms | tail -3 > $out/atoms.txt
  (cd mcp && go run ./cmd/indexer -catalogue ../catalogue -out $out/c.db >/dev/null) && \
    sqlite3 $out/c.db "select 'atoms',count(*) from atoms; select 'ops',count(*) from operations; select 'chunks',count(*) from chunks;" > $out/index.txt && rm $out/c.db
  node scripts/sync-specs.mjs >/dev/null && node scripts/build-api-reference.mjs >/dev/null && node scripts/build-postman.mjs >/dev/null
  (cd site && find static/specs docs/*/v*/api src/data -type f -exec shasum {} + | sort -k2) > $out/site.txt
  jq -r '.routes[] | "\(.atom) \(.route)"' catalogue/atom-routes.json | sort > $out/routes.txt
  jq -r '[.. | .id? // empty] | .[]' catalogue/registry.json | sort > $out/registry.txt
  git diff --stat -- plugins/abdm-integrators-assistant/skills site/static/skills > $out/skills.txt
  ```

  Parity holds when `diff -r $SCRATCH/parity-base $SCRATCH/parity-$LABEL` prints nothing. Two exceptions: the `site.txt` rows for files that embed the catalogue path they came from, which you list by name in the task's commit message, and `skills.txt`, which must be empty.
- [ ] **Step 2: Run the CI check list.** Each must pass:

  ```bash
  npm run lint:specs && npm run check:specs && npm run lint:journeys && npm run lint:atoms \
  && node scripts/build-api-reference.mjs && node scripts/build-postman.mjs && npm run test:scripts \
  && npm run check:sections && npm run lint:questions && npm run lint:sources && npm run lint:annexure \
  && npm run check:plugins && npm run check:plugin-version && npm run validate:skills \
  && npm run check:nhcx-stamp && npm run check:skills-version \
  && git diff --exit-code -- plugins/abdm-integrators-assistant/skills site/static/skills \
  && npm run lint:agent && npm run lint:content && npm run build && npm run lint:tables \
  && npm run test:postman && npm run test:changelog && npm run check:changelog && npm run check:routes \
  && npm run check:icons && (cd mcp && go vet ./... && go test ./... && go run ./cmd/askai-eval check -cases ../evals/askai/cases) \
  && ./scripts/plan-check.sh
  ```
- [ ] **Step 3: Run the retrieval gate.** Run `mcp/eval/gate.sh catalogue-layout` with Ollama on :8085, then `python3 mcp/eval/compare.py` against the last gate run. Expect zero rank changes, because the index content is identical.
- [ ] **Step 4: Dispatch the `adversarial-reviewer` agent** on the branch diff. Brief it on the Review Focus list, and have it try to put an atom in a wrong folder, a stray folder at each level, and a duplicate id, and confirm lint catches each.
- [ ] **Step 5:** Push, open the PR against `main`, and paste the parity diffs (empty) and the gate output into its description. The merge is the owner's call.

## Not in this plan

- **An alias for the 24 renamed glossary ids.** `get` on an old id returns not found after Task 6. Add an alias table to the indexer only if an outside caller is found to depend on one.
- **NHCX atoms moving onto pages.** The 536 NHCX atom files stay hand-written until the page-canonical migration reaches NHCX (plan §3.2). They already sit at their target paths.
- **The 29 HIE-CM atoms not rebuilt** (see `2026-09-29-hiecm-atoms-rebuild.md`).
- **`catalogue/generated/enrich/`** from the retrieval plan. It was never built. If it ever is, its home is decided then, and `layoutProblems` makes that a deliberate change.
