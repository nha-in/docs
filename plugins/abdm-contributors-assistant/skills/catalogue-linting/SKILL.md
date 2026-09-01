---
name: catalogue-linting
description: Every mechanised check that runs against the ABDM Catalogue in CI, organised by the npm script a contributor actually runs, with the verbatim failure message and the fix. Covers atom schema and sections, the em dash block, the site content paradigm, agent readiness of the OpenAPI specs, table layout, source hash freshness, compiled skill validation, the plan stamp, and Spectral. Use whenever CI is red on the Catalogue, a build fails, someone asks why their atom was rejected, or when adding or changing a lint rule.
---

# Catalogue Lint

Lint is the enforcement layer for the principles. Every rule here exists because a principle would otherwise be a wish. When a rule blocks you, the fix is the content, never the rule.

A failure reaches a contributor as a red job name in CI, or a non-zero exit locally. Both point at one npm script. This document is organised by that script: what it covers, what it fails on, the message verbatim, and the fix. Every message below was read out of the script that emits it, not guessed from what the rule is supposed to do.

## `npm run lint:atoms` (`scripts/lint-atoms.mjs`)

Checks every atom's frontmatter and body: mandatory fields, id format, gateway and type enums, the five mandatory sections in order, the em dash, dead relative links, and dangling `related.*` ids.

| Fails on | Message (verbatim, `<...>` is a template slot) | Fix |
|---|---|---|
| A mandatory field is missing | `missing mandatory field: <field>`. Fields checked: `id`, `type`, `gateway`, `milestone`, `version`, `title`, `summary`, `sources`, `verified`, `related`. | Add the field. See `atom-authoring` for the full schema. |
| Frontmatter block cannot be found or parsed | `no frontmatter block`, or `frontmatter is not valid YAML: <error>` (from the shared loader, `scripts/lib/atoms.mjs`) | Fix the YAML. |
| `type` is not one of the ten | `type must be one of concept, flow, endpoint, callback, error, test, decision, glossary, fhir, sandbox` | Pick one. If it fits none, it is probably two atoms. |
| `gateway` is not one of the four | `gateway must be one of hiecm, uhi, nhcx, shared` | Fix the value. All four gateways are accepted. Shared atoms use `milestone: n/a`. |
| `id` is not lowercase `gateway.type.slug` | `id "<id>" is not gateway.type.slug in lowercase` | Rename to match. |
| `id`'s gateway segment disagrees with frontmatter | `id says gateway "<g>" but frontmatter says "<gateway>"` | Make them agree. |
| `id`'s type segment disagrees with frontmatter | `id says type "<t>" but frontmatter says "<type>"` | Make them agree. |
| File is not under the folder its type requires | `type <type> must live in a <folder>/ folder` | Move the file. |
| A `shared` atom does not set `milestone: n/a` | `shared atoms take milestone: n/a` | Set it. |
| `sources` is missing or empty | `sources must list at least one entry` | Add at least one source. If it is our own analysis, say so and mark `docs-only`. |
| A `sources` entry has neither `url` nor `file` | `sources[<i>] needs a url or a file` | Add one. |
| A `sources` entry has neither `status` nor `hash` | `sources[<i>] needs a status or a hash` | Add one. Ingestion records a hash; if hand-added, run `/source-check`. |
| `verified.status` is not one of the four | `verified.status must be one of draft, unverified, verified, stale` | Fix. If unsure, `unverified` is always safe. |
| `verified.status` is `verified` but `against`, `on`, or `by` is missing | `verified.status is verified, so verified.<field> is required. Never claim verification you did not observe.` | Either record the observed response or set `unverified`. |
| One of the five mandatory sections is missing | `missing mandatory section: ## <heading>`. Headings, in order: `In plain words`, `Before you start`, `What happens`, `How you know it worked`, `When it goes wrong`. | Add it. Glossary atoms may write "Nothing" under a heading, but the heading stays. |
| The five sections are present but out of order | `sections are out of order at "## <heading>"` | Reorder. |
| An em dash (U+2014) appears anywhere in the file | `em dash found. Use a full stop, a comma or a colon.` | Replace it. No exceptions, including code comments and commit messages. |
| A relative markdown link points at a file that does not exist | `link points at "<path>", which does not exist` | Fix the link or create the target. Never leave a dangling link. |
| A `related.<kind>` entry names an id no atom defines | `related.<kind> points at "<id>", which no atom defines` | Create the atom or remove the link. |

## `npm run lint:content` (`scripts/lint-content.mjs`)

Checks `site/docs` against the content paradigm in `CONTRIBUTING.md`: per-page-type word budgets, sentence length, paragraph length, the frontmatter description, and the em dash. Counted over prose only, code fences, tables, headings and JSX are stripped first. A page whose frontmatter carries `generated: true` reports every finding as a warning instead of an error, since a broken rule there is a bug in the generator or the specification, not something a contributor typed.

| Fails on | Message (verbatim) | Level | Fix |
|---|---|---|---|
| Frontmatter is not valid YAML | `<page>: frontmatter is not valid YAML: <error>` | error | Fix the YAML. |
| No `description` in frontmatter | `<page>: no description in frontmatter` | warning | Add one. |
| `description` over 160 characters | `<page>: description is <N> characters, over 160` | error (warning if generated) | Shorten it. |
| Prose word count exceeds the page type's budget (module overview 600, concept 900, how-to 700, endpoint 400, reference has none) | `<page>: <N> prose words in a <type> page, budget <budget>`, with ` (split this page)` appended once the count passes 1.3x budget | reported, does not fail the build | Split the page. This is a warning even far over budget, because the fix is a page split with redirects, not an edit. |
| Page is over 300 prose words with no `## In short` heading | `<page>: <N> prose words and no "## In short" block (required above 300)` | warning | Add the block. |
| First heading is literally "Introduction" or "Overview" | `<page>: first section is "<heading>"; open with the answer instead` | error (warning if generated) | Rename or restructure to open with the answer. |
| A sentence is over 35 words | `<page>: <N> word sentence: "<first 60 chars>..."` | error (warning if generated) | Shorten it. |
| A sentence is 26-35 words | same message | warning | Shorten it if convenient. |
| A paragraph runs more than 5 sentences | `<page>: <N> sentence paragraph: "<first 60 chars>..."` | warning | Split the paragraph. |
| An em dash appears in the body | `<page>: contains an em dash` | error (warning if generated) | Replace it. |

## `npm run lint:agent` (`scripts/lint-agent-readiness.mjs`)

Checks that the OpenAPI specs are usable by an MCP tool generator and a retrieval index, not only a human reading the rendered page.

| Fails on | Message (verbatim) | Level | Fix |
|---|---|---|---|
| Spec `info` is missing `x-abdm-gateway` or `x-abdm-module` | `<spec>: info is missing <key>` | error | Add the key. |
| Spec has no `x-abdm-sources` | `<spec>: no x-abdm-sources, so a retrieved chunk cannot say where it came from` | error | Add at least one source. |
| An operation has no `operationId` | `<spec>: <METHOD> <path>: no operationId, so no tool can be generated` | error | Add one. Endpoint atom stubs are generated from operation ids. |
| `operationId` is not a legal MCP tool name (`^[a-zA-Z0-9_-]{1,64}$`) | `...: operationId "<id>" is not a legal MCP tool name` | error | Fix the id. |
| `operationId` is reused across operations | `...: operationId "<id>" is already used by <other operation>` | error | Ids must be unique across the module. |
| An operation has no `summary` | `...: no summary, which is what a tool generator shows the model` | error | Add one. |
| An operation has no `description` | `...: no description, so this chunk retrieves against its path alone` | error | Add one. |
| `description` is under 40 characters | `...: description is under 40 characters` | warning | Write more. |
| An operation has no `tags` | `...: no tag, so it has no within-module facet` | warning | Add one. |
| A path operation has no `x-abdm-atom` | `...: no x-abdm-atom, so the chunk cannot join to its atom` | warning | Add it. |
| An operation has no `responses` at all | `...: no responses at all` | error | Document at least one response. |

## `npm run lint:tables` (`scripts/lint-tables.mjs`)

Renders the built site in a real headless browser at two viewports and fails on any table cell whose content overflows its cell, or any word split across lines that would have fitted on one. It runs against `site/build`, what actually ships, not the dev server.

It needs a build first: `npx playwright install --with-deps chromium && npm run build && npm run lint:tables`. Running `npm run lint:tables` alone against a repo with no `site/build` fails on a missing directory; that is expected, not a lint finding.

| Fails on | Message (verbatim) | Fix |
|---|---|---|
| Playwright is not installed | `playwright is not installed. Run: npm i -D playwright && npx playwright install chromium` | Run the command. |
| Cell content overflows its cell | `overflow by <N>px  <route>  "<cell text>"` | Do not pin the column to a constant width; let it size to content. |
| A word is split across lines when it would have fit on one | `word split       <route>  "<word>"` | Do not let a column shrink below its longest word. |

## `npm run lint:sources` (`scripts/check-source-freshness.mjs`)

Hashes everything under `catalogue/openapi/.raw/` and compares against every recorded source reference (a spec's `x-abdm-sources`, an atom's `sources`). Only `MISMATCH` fails the build.

| Finding | Message (verbatim) | Blocking? |
|---|---|---|
| A recorded hash disagrees with the file's current hash | `MISMATCH catalogue/openapi/.raw/<file> recorded sha256:<12 hex>... current sha256:<12 hex>... by <consumer>` | Yes |
| A recorded file exists nowhere under `.raw/` | `MISSING <file> <"not under .raw/" or "in the repo but not under .raw/"> (recorded by <N> consumer(s): <list>)` | No, some sources (websites, packs never stored) are legitimately absent |
| A source is recorded with a `status` instead of a `hash` | `UNHASHED <N> source reference(s) carry a status instead of a hash (coverage debt)` | No, counted only |
| Any mismatch was found | `FAIL a raw source changed under the catalogue; re-derive the consumers listed above or update their recorded hashes` | This is what sets the exit code |

The fix for a mismatch: re-derive the atoms or specs that recorded the old hash, or update their recorded hash if the change was reviewed and accepted as a correction. No script watches for this on its own; `/source-check` runs it.

## `npm run validate:skills` (`scripts/validate-skills.mjs`)

Runs after `compile:skills` and validates the compiled output in `plugins/abdm/skills/` against the Catalogue it was built from: frontmatter, atom citations, curl targets, and OODA loop structure.

| Fails on | Message (verbatim) | Fix |
|---|---|---|
| No frontmatter block | `<skill>: no frontmatter block` | Fix the compiler output. See `skill-compiler`. |
| Frontmatter is not valid YAML | `<skill>: frontmatter is not valid YAML: <error>` | Fix the compiler output. |
| Frontmatter `name` does not match the directory | `<skill>: frontmatter name "<name>" does not match directory` | Fix the compiler output. |
| No `description` in frontmatter | `<skill>: missing description` | Fix the compiler output. |
| An em dash appears anywhere in the skill file | `<skill>: em dash found` | Fix the source atom or the compiler's prose pass. |
| A skill-specific required section is missing (today: `hiecm-m1-build` needs `## Flows`, `hiecm-m1-debug` needs `## Errors`) | `<skill>: missing required section: <heading>` | Fix the compiler output or the source atoms. |
| The skill cites an atom id (backtick-quoted `hiecm.*.*`) the Catalogue does not define | `<skill>: cites atom "<id>", which the Catalogue does not define` | The prose pass invented an id, or the atom was deleted. Do not add a fake atom to make this pass. Regenerate from real Catalogue content. |
| The skill prints a curl target no atom recorded | `<skill>: curl target "<url>" is not recorded on any atom` | Same as above: fix the source, do not paper over it. |
| No loop states a limit (`Loop limit: N passes per ...`) | `<skill>: no loop limit stated` | Add one so an agent following it can terminate. |
| A `### ` block has no matching `Exit condition` | `<skill>: <N> loop(s) but only <M> exit condition(s)` | Name what arrives and within how long. |

There is no separate check that a gateway has some minimum count of verified atoms. Nothing in this repository emits such a message and nothing refuses to build on verified coverage. That gate is wanted and not implemented, so P1's phasing is held by review today, not by CI. Do not cite it as a build gate.

## `./scripts/plan-check.sh`

Hashes `plan/abdm-v1-phase1-architecture-and-plan.md` and compares it against `plan/manifest.json`, checks every compiled skill's `plan_version` and `plan_hash` stamp against that manifest, checks the gantt generator's `PLAN_VERSION`, and confirms every `plan#<id>` cited in the plugin resolves to an anchor in the plan. The plan lives in this repository, so it needs no network.

| Fails on | Message (verbatim) | Fix |
|---|---|---|
| The manifest reaches over the network cannot be fetched | `Could not reach the published plan: <error>` followed by `This check needs the network. It fails rather than passing quietly.` | Retry with network access. |
| A compiled skill in `manifest.compiled_skills` has no `plan_version` stamp | `<skill> is listed in manifest.compiled_skills but carries no plan_version stamp. Recompile it from the plan and restamp.` | Recompile and stamp it. |
| A compiled skill's stamp does not match the published plan version | `<skill> is stamped plan_version <have>, the published plan is <want>. Recompile it from the plan and restamp.` | Recompile and restamp. |
| A `plan#<id>` citation in the plugin names an id the plan has no anchor for | `plan#<id> is cited in the plugin but the plan defines no section with that id.` | Fix the citation or add the anchor. |

## `npm run lint:specs` (Spectral, config in `.spectral.yaml`)

This one is not a script you can read messages out of. It runs Spectral over `catalogue/openapi/*/*/*.yaml` with `--fail-severity=error`, so only `error`-severity violations fail CI. The ruleset, verbatim from `.spectral.yaml`:

```yaml
extends:
  - spectral:oas
rules:
  operation-operationId: error
  oas3-schema: error
```

That is the built-in `spectral:oas` ruleset (Spectral's own rule names, not ours, see Spectral's documentation for what each one checks), with `operation-operationId` and `oas3-schema` explicitly raised to `error` so those two block the build even if `spectral:oas` ships them at a lower severity by default. Do not invent Spectral rule names beyond these two, and do not describe Spectral's output as if it came from one of the scripts above, it is a different tool with its own message format.

Fix: correct the ingested spec file and record the correction in `sources` alongside the original. Never silently edit an NHA file without recording that it was changed.

## When a rule seems wrong

Two legitimate responses and one illegitimate one.

Legitimate: the rule has a false positive, so fix the rule and add a test case for the atom that tripped it. Or the atom is genuinely an exception, so add an explicit, reviewed, commented exemption with an expiry.

Illegitimate: weakening the rule to get a build green. In particular, never add an invented atom id to the Catalogue just to satisfy a "cites atom that does not exist" failure in `validate:skills`. That rule failing means the system worked.

## Local run

Run the script for the job that is red. There is no single npm script that runs every check above, each is its own script and its own CI job (see `.github/workflows/ci.yml`). The `/catalogue-lint` command runs them all in sequence, as a prompt, not by adding a new script.

```
npm run lint:atoms
npm run lint:content
npm run lint:agent
npm run lint:sources
npm run validate:skills
./scripts/plan-check.sh
npm run lint:specs
npx playwright install --with-deps chromium && npm run build && npm run lint:tables
```

## Related

- What the atom should contain: `atom-authoring`
- Human review after lint passes: `atom-review`
- The compiler and its validator: `skill-compiler`
