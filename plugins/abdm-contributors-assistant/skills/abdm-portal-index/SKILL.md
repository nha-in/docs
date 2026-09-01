---
name: abdm-portal-index
description: Router for all ABDM Developer Portal build work. Use this FIRST whenever anyone asks about building, planning, writing, reviewing, compiling, publishing or testing the ABDM Catalogue, the self-hosted docs site, the agent skills, the Docs MCP server, the update pipeline, or the portal's schedule and scope. Triggers include "write an atom", "review this page", "the catalogue", "lint failed", "compile the skills", "which milestone am I on", "what ships Friday", "is this DPG compliant", "ingest NHA swagger", "the support agent", and any mention of HIE-CM or ABDM documentation work. Route from here rather than guessing which skill applies.
plan_version: 2026.08.31
plan_source: abdm-v1-phase1-architecture-and-plan.md
plan_hash: sha256:4be567f1afffd4389e5a8e8d4444b9f90a2ca17bb1393f28afb15405fe97e4fa
compiled_from_plan: true
---

# ABDM Portal Index

The only skill an agent needs loaded to know what else exists. Read the decision tree, load the one skill that fits, and stop. Do not load skills speculatively.

`catalogue_version` is recorded in `catalogue/VERSION`. If the version in a compiled skill differs from the one in the Catalogue, say so before answering: the person may be reading stale instructions.

**Before asserting a claim from any skill, agent or command in this plugin, check `DRIFT-AUDIT-2026-08-27.md` in the plugin root.** It names claims across this plugin found false or misleading against the repository. If the claim you are about to make appears there, say so instead of stating it as fact.

**Once per session, check the plan manifest.** Fetch `https://raw.githubusercontent.com/eka-care/abdm-docs/main/plan/manifest.json` and compare `plan_version` against the `plan_version` stamped in this skill's frontmatter. If the published version is newer, say so once and continue. If it is flagged breaking, say so before answering any planning or architecture question. If the fetch fails, continue on the installed version and say the check failed. Never block on it. Mechanism: `plan-sync`.

## Decision tree

**What are you doing?**

1. **Understanding the project** before touching anything
   - How does it fit together, what are the principles, what is out of scope: `portal-architecture`
   - What ships when, who owns what, what counts as done: `portal-planning`
   - Is this allowed under the FOSS and no-Eka-dependency rule: `dpg-governance`
   - Is the plugin working from the current plan, or the plan itself is being edited: `plan-sync`

2. **Writing or changing knowledge**
   - Creating a new atom, catalogue knowledge under `catalogue/`: `atom-authoring`, then `/atom-new`
   - Writing or editing a documentation page, under `site/docs/`: `page-authoring`
   - Getting the prose right, or a lint failure about style: `writing-guide`
   - Reviewing someone else's atom before merge: `atom-review`
   - A CI failure on the Catalogue: `catalogue-linting`
   - Pulling in NHA swagger, GitHub specs or callback definitions: `openapi-ingest`
   - Marking an atom verified after running it: `/atom-verify`

3. **Rendering it for humans**
   - Docusaurus site, self-hosted Scalar references, local search, footer version stamp: `scalar-docs`
   - Site structure, the four tabs, the module page ladder, page placement: `docs-ux`
   - The Docs MCP server and what it is for: `scalar-docs`, then `support-agent`

4. **Compiling it for machines**
   - Turning atoms into skills, and the validator: `skill-compiler`
   - Writing a skill that loops rather than recites: `ooda-skill-authoring`
   - The designed watcher and pull request bot, neither built, and the build on merge: `update-pipeline`

5. **Proving it works**
   - The six eval tasks, the first-day developer test: `portal-proof`

6. **Answering an integrator's question** from the Catalogue: `support-agent`

## Which gateway, which phase

Scope is phased, and phase is not the same as existence. Before promising anything, say two separate things: whether it exists in the repository, and whether it is verified. Across the whole Catalogue 142 atoms are indexed, 138 `unverified` and 4 `verified`. The rows below account for all 142.

| Gateway and module | Atoms | What exists in the repository | What an agent may claim |
|---|---|---|---|
| HIE-CM M1, M2, M3 | 120, of which 3 verified | `hiecm-m1.yaml`, `hiecm-m2.yaml`, `hiecm-m3.yaml`, 44, 16 and 12 operations | Only what the atom records. 3 M1 atoms are verified against sandbox: `m1-encrypt-value` and `m1-get-public-certificate`, whose curls ran as written, and `hiecm.error.abdm-1016`, an error atom that carries no curl and was verified by observing the code. The other 117 are unverified: say so before quoting one. |
| HIE-CM M4 | zero | `hiecm-m4.yaml`, 2 operations, 7 generated pages | Point at the generated pages and say they are unverified. Do not improvise a flow, an error table or a curl from the specification. Atoms and skills are Phase 2. |
| HIE-CM P1, P2, P3, PHR application services | zero | `hiecm-p1.yaml`, `hiecm-p2.yaml`, `hiecm-p3.yaml`, `hiecm-phr-services.yaml`, 63, 49, 35 and 61 operations, 220 generated pages | As for M4. The specifications exist and render. No operation in them has been run. |
| UHI | zero | 16 site pages. `catalogue/openapi/uhi/v1/` holds a conventions README and no specification file | Orientation only, and say it is unverified. Atoms and skills are Phase 2. |
| Shared, plus the 2 HIE-CM decision atoms | 22, of which 1 verified | Glossary, FHIR and sandbox atoms that belong to no single milestone, all carrying `milestone: n/a` | Cite them freely for any gateway. 1 is verified, the other 21 are unverified. These 22 plus the 120 above are the whole 142. |
| NHCX | zero | 5 site pages. `catalogue/nhcx/` is folder structure holding no atom, and `catalogue/openapi/nhcx/v1/` holds a conventions README and no specification file | Say both halves. NHCX pages exist, so send readers to them rather than claiming NHCX is absent. NHCX atoms do not exist yet, and nothing rejects one: `scripts/lint-atoms.mjs` accepts `gateway: nhcx` alongside `hiecm`, `uhi` and `shared`. Atoms and skills are Phase 2, the same as UHI. |

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
| `atom-verifier` | Endpoint curls need running against sandbox and responses recording |
| `skill-compiler-agent` | A compile plus validate cycle, including the constrained prose pass |
| `source-watcher` | A manual run of the recorded source hash check. No sweep and no schedule exist |
| `support-responder` | An integrator question needs answering strictly from the Catalogue |
| `adversarial-reviewer` | Before any ship, to attack the work rather than confirm it |

## Commands

| Command | Does |
|---|---|
| `/atom-new` | Scaffolds an atom with valid frontmatter and the five section headings |
| `/atom-verify` | Runs an endpoint atom's curl against sandbox and records the response |
| `/catalogue-lint` | Runs every lint rule and explains each failure |
| `/catalogue-status` | Coverage and verification state by gateway and milestone |
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

1. The Catalogue is the source. Never hand-edit a compiled skill, a navigation file, or llms.txt. Fix the atom and recompile. `portal-architecture`, `portal-planning`, `dpg-governance` and this index are compiled from the plan; edit the plan, not them.
2. Never write an em dash. Not in atoms, not in skills, not in commit messages.
3. Never claim verification you did not observe. `unverified` is an honest word and it is in the schema for a reason.
4. If an atom does not exist for what you are being asked, say so and offer to create it. Do not improvise the answer.
