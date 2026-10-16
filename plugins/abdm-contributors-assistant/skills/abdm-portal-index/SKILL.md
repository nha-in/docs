---
name: abdm-portal-index
description: Router for all ABDM Developer Portal build work. Use this FIRST whenever anyone asks about building, planning, writing, reviewing, compiling, publishing or testing the ABDM Catalogue, the self-hosted docs site, the agent skills, the Docs MCP server, the update pipeline, or the portal's schedule and scope. Triggers include "write an atom", "review this page", "the catalogue", "lint failed", "compile the skills", "which milestone am I on", "what ships Friday", "is this DPG compliant", "ingest NHA swagger", "the support agent", and any mention of HIE-CM or ABDM documentation work. Route from here rather than guessing which skill applies.
plan_version: 2026.09.29-13
plan_source: abdm-v1-phase1-architecture-and-plan.md
plan_hash: sha256:47cf8dcb036e7311e2381502b17818d74223ca9e13bb9dbccaad38a28695096c
compiled_from_plan: true
---

# ABDM Portal Index

The only skill an agent needs loaded to know what else exists. Read the decision tree, load the one skill that fits, and stop. Do not load skills speculatively.

`catalogue_version` is recorded in `catalogue/VERSION`. If the version in a compiled skill differs from the one in the Catalogue, say so before answering: the person may be reading stale instructions.

**Before asserting a claim from any skill, agent or command in this plugin, check `DRIFT-AUDIT-2026-08-27.md` in the plugin root.** It names claims across this plugin found false or misleading against the repository. If the claim you are about to make appears there, say so instead of stating it as fact.

**Once per session, check the plan manifest.** Fetch `https://raw.githubusercontent.com/nha-in/docs/main/plan/manifest.json` and compare `plan_version` against the `plan_version` stamped in this skill's frontmatter. If the published version is newer, say so once and continue. If it is flagged breaking, say so before answering any planning or architecture question. If the fetch fails, continue on the installed version and say the check failed. Never block on it. Mechanism: `plan-sync`.

## Decision tree

**What are you doing?**

1. **Understanding the project** before touching anything
   - How does it fit together, what are the principles, what is out of scope: `portal-architecture`
   - What ships when, who owns what, what counts as done: `portal-planning`
   - Is this allowed under the FOSS and no-Eka-dependency rule: `dpg-governance`
   - Is the plugin working from the current plan, or the plan itself is being edited: `plan-sync`

2. **Writing or changing knowledge**
   - Finding anything in the Catalogue: it sits under its gateway, `catalogue/<gateway>/` (`hiecm`, `nhcx`, `uhi`, or `shared`), in `map/`, `openapi/` or a type folder. NHCX's specifications, corrections and sources are the exception, still under `catalogue/openapi/`
   - Creating a new atom, catalogue knowledge under `catalogue/<gateway>/<type folder>/`: `atom-authoring`, then `/atom-new`
   - Writing or editing a documentation page, under `site/docs/`: `page-authoring`
   - Editing an atom listed in a content map, `catalogue/<gateway>/map/`: it lives on its page, so `page-authoring`, then `npm run build:sections`. Never edit a file marked `generated: true`
   - Applying a correction NHA sent: `docs/runbook-nha-corrections.md`, on the page only
   - Getting the prose right, or a lint failure about style: `writing-guide`
   - Writing as ABDM rather than about it, or a draft that cites NHA: `nha-voice`
   - Deciding whether a change deserves a What's New entry, or writing one: `changelog`
   - Reviewing someone else's atom before merge: `atom-review`
   - A CI failure on the Catalogue: `catalogue-linting`
   - Pulling in NHA swagger, GitHub specs or callback definitions: `openapi-ingest`

3. **Rendering it for humans**
   - Docusaurus site, self-hosted Scalar references, local search, footer version stamp: `scalar-docs`
   - Site structure, the five tabs, the module page ladder, page placement: `docs-ux`
   - The Docs MCP server and what it is for: `scalar-docs`, then `support-agent`

4. **Compiling it for machines**
   - Turning atoms into skills, and the validator: `skill-compiler`
   - Writing a skill that loops rather than recites: `ooda-skill-authoring`
   - The designed watcher and pull request bot, neither built, and the build on merge: `update-pipeline`

5. **Proving it works**
   - The six eval tasks, the first-day developer test: `portal-proof`

6. **Answering an integrator's question** from the Catalogue: `support-agent`

## Which gateway, which phase

Scope is phased, and phase is not the same as existence. Before promising anything, say two separate things: whether it exists in the repository, and what its source is. Across the whole Catalogue, `npm run lint:atoms` prints the count and the split by type, and that command is the only figure worth quoting, because this one moves with every merge. No atom carries a status. The HIE-CM atoms came down in the 16 September 2026 reset and 227 of the 256 were rebuilt on 29 September 2026 as page sections and notes partials, beside the 20 design rules in `catalogue/hiecm/concepts/` and HIE-CM's 22 glossary terms in `catalogue/hiecm/glossary/`. Endpoint, callback and error atoms sit in `site/docs/_notes/hiecm/` partials rendered on the generated API pages; the 29 not rebuilt are calls and codes the final set does not have. The twelve HIE-CM specifications under `catalogue/hiecm/openapi/v3/` carry 337 operations, 34 of them webhooks. Eleven are generated by `scripts/ingest-nha.mjs` from NHA's sets of 16, 22 and 24 September 2026, and Record Share comes from NHA's document of 21 September. Subscriptions have no specification of their own: their calls sit in P3. The reference is ordered by the journey files under `catalogue/hiecm/openapi/v3/journeys/`, each module's error page lists the codes its specification's response examples return, and each module skill compiles from its journeys and its specification. Note the shape of it: every HIE-CM module renders and compiles, and M1 to M4 and P1 to P3 carry atoms.

| Gateway and module | Atoms | What exists in the repository | What an agent may claim |
|---|---|---|---|
| HIE-CM gateway, M1, M2, M3 | 74, 57 and 20: the 20 design rules in `concepts/`, and page sections and notes partials | `hiecm-gateway.yaml`, `hiecm-m1.yaml`, `hiecm-m2.yaml`, `hiecm-m3.yaml`, 4, 121, 20 and 12 operations, 14 of the M2 and M3 ones webhooks. `abdm-gateway` and `abdm-m1` to `abdm-m3` compile | Point at the generated pages and the compiled skills, and cite the atoms for what they say. The design rules in each skill's `references/design.md` were observed at a working front desk, and each atom names the date. |
| HIE-CM M4 | 11 | `hiecm-m4.yaml`, 87 operations, 87 generated pages, and `abdm-m4` compiles | As for M1 to M3. |
| HIE-CM P1, P2, P3, P4 | 29, 18, 36 and none | `hiecm-p1.yaml` to `hiecm-p4.yaml`, 11, 35, 14 and 5 operations, 7 of them webhooks, 110 generated endpoint and errors pages, and `abdm-p1` to `abdm-p4` compile | As for M1 to M3. |
| HIE-CM use cases: Scan and Register, Record Share, Scan and Pay | zero | `hiecm-scan-and-register.yaml`, `hiecm-record-share.yaml` and `hiecm-scan-and-pay.yaml`, 2, 8 and 18 operations, 13 of them webhooks, 34 generated endpoint and errors pages, and `abdm-scan-and-register`, `abdm-record-share` and `abdm-scan-and-pay` compile | As for M1 to M3. Do not improvise a flow, an error table or a curl beyond what the specification and the journey file carry. |
| UHI | 111: EUA and HSPA by hand, and 109 page sections | `uhi-network.yaml`, `uhi-consultation.yaml` and `uhi-ambulance.yaml`, 5, 18 and 2 operations, generated by `scripts/ingest-uhi.mjs` from NHA's UHI set of 28 September 2026 and ordered by twelve journeys under `catalogue/uhi/openapi/v1/journeys/`. 58 generated reference pages beside the orientation pages. The 109 page atoms are mapped in `catalogue/uhi/map/`: a notes partial per operation, and concepts, flows, decisions, tests, sandbox, troubleshooting and glossary on the UHI pages. No UHI error atom: no code list is published. Six skills compile, one per service, into their own plugin, `plugins/uhi-integrators-assistant/` | Point at the generated pages, cite the atoms, and send integrators to the UHI plugin. |
| Shared | count with `npm run lint:atoms` | Glossary, FHIR, sandbox, concept and decision atoms that belong to no single gateway, all carrying `milestone: n/a`. A glossary term one gateway owns sits in that gateway's `glossary/` as `<gateway>.glossary.<term>`, so HIP, consent manager and link token are `hiecm.glossary.*` | Cite them freely for any gateway. |
| NHCX | hand-written, count with `npm run lint:atoms` | Pages under `site/docs/nhcx/`. Hand-written atoms under `catalogue/nhcx/`, not yet moved onto pages. `catalogue/openapi/nhcx/v1/` holds fourteen specifications, 79 operations, 19 of them webhooks | Send readers to the pages and cite the atoms. An NHCX atom is edited in its file until NHCX moves onto pages. Compiled NHCX skills are Phase 2. |

## Skills

| Skill | Kind | Load it when |
|---|---|---|
| `portal-architecture` | orient | Someone asks how the pieces connect or why a decision was made |
| `portal-planning` | orient | Scheduling, scope, ownership, definition of done |
| `dpg-governance` | orient | Anything touching licence, dependencies, or Eka-specific content |
| `atom-authoring` | build | Writing a new unit of catalogue knowledge |
| `page-authoring` | build | Writing or editing a documentation page under `site/docs` |
| `writing-guide` | build | Prose quality, style lint failures |
| `atom-review` | test | Reviewing before merge |
| `catalogue-linting` | debug | CI is red on the Catalogue |
| `openapi-ingest` | build | Bringing an NHA source in |
| `scalar-docs` | build | The docs site itself |
| `docs-ux` | build | Where a page goes, the tabs, the module ladder, site chrome |
| `nha-voice` | build | Any prose, anywhere. Outranks the writing guide |
| `changelog` | build | What earns a What's New entry, and what never does |
| `skill-compiler` | build | The atoms to skills pipeline |
| `ooda-skill-authoring` | build | Authoring or fixing a compiled skill's loop |
| `update-pipeline` | build | CI and publishers, plus the watcher and PR bot as design only |
| `support-agent` | debug | Answering an integrator question from the Catalogue |
| `portal-proof` | test | Evals and the first-day test |
| `plan-sync` | orient | The plan changed, or a version mismatch needs explaining |
| `gantt-sync` | build | The shared gantt in Google Sheets needs updating, rebuilding or sharing |

## Agents

Dispatch these for work that is long, repetitive, or better done with a fresh context.

| Agent | Dispatch when |
|---|---|
| `atom-author` | A batch of atoms of the same type needs drafting from a source |
| `skill-compiler-agent` | A compile plus validate cycle, including the constrained prose pass |
| `source-watcher` | A manual run of the recorded source hash check. No sweep and no schedule exist |
| `support-responder` | An integrator question needs answering strictly from the Catalogue |
| `adversarial-reviewer` | Before any ship, to attack the work rather than confirm it |

## Commands

| Command | Does |
|---|---|
| `/atom-new` | Scaffolds an atom with valid frontmatter and the five section headings |
| `/catalogue-lint` | Runs every lint rule and explains each failure |
| `/catalogue-status` | Coverage by gateway and milestone, and which atoms have evidence recorded |
| `/skills-compile` | Compiles, validates and reports which atoms fed which skill |
| `/docs-publish` | Generates navigation, previews, and publishes the Scalar site |
| `/source-check` | Checks the recorded source hashes for drift and reports it. Nothing opens a pull request today |
| `/eval-run` | Runs the six eval tasks and records the score |
| `/firstday-test` | Sets up and scores the first-day developer test |
| `/standup` | What moved, what is blocked, what ships at the next checkpoint |
| `/plan-check` | Compares installed plan version against the published manifest |
| `/gantt-update` | Proposes the shared gantt's status changes from landed work and applies them once approved |

## Tools

This plugin registers no tools. Four were designed and none is implemented: `fhir-validate` to wrap the NRCeS validator over a bundle, `callback-tunnel` for a public URL receiving sandbox callbacks, `request-id` for a fresh REQUEST-ID and TIMESTAMP pair, and `error-decode` to print the matching error atom for a response. None of the four is defined in this repository, in `.mcp.json`, in `scripts/`, or in any `.claude/` config. Do not tell anyone to call one. Do the work by hand, or say the tool does not exist.

The repository's actual scripts are under `scripts/` and reachable as npm targets. `catalogue-linting` lists them with what each one fails on.

## Rules that apply no matter which skill you load

1. The Catalogue is the source. Never hand-edit a compiled skill, a navigation file, llms.txt, an atom file marked `generated: true` or `catalogue/registry.json`. Fix the atom, or the page a migrated atom lives on, and recompile. `portal-architecture`, `portal-planning`, `dpg-governance` and this index are compiled from the plan; edit the plan, not them.
2. Never write an em dash. Not in atoms, not in skills, not in commit messages.
3. Never claim a call was checked when it was not. Atoms carry no status, so the honest move is to state what the specification says and stop there.
4. If an atom does not exist for what you are being asked, say so and offer to create it. Do not improvise the answer.
