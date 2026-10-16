# UHI integrators plugin (2026-09-29)

**Why.** UHI has a specification, twelve journeys, pages and 109 atoms, and no agent skill. An integrator building an EUA or an HSPA gets nothing to load into a coding agent. Each gateway keeps its own integrators plugin, so UHI gets one beside `abdm-integrators-assistant` (HIE-CM) and `nhcx`.

**Goal.** `plugins/uhi-integrators-assistant`, built the way the HIE-CM plugin is: one compiled skill per service, each a router plus references loaded on demand, two agents that plan above the skills, and three commands that open the work from the terminal. Every fact comes from the UHI atoms, the specifications and the journeys. Nothing in a skill is hand-edited.

**Base.** Branch `feat/uhi-plugin`, stacked on `feat/uhi-atoms`, with main merged.

## Skills, one per service

| Skill | Journeys | Roles it builds |
|---|---|---|
| `uhi-consultation` | `uhi-consultation-discovery`, `-order`, `-fulfilment`, `-post-fulfilment` | EUA or HSPA |
| `uhi-ambulance` | `uhi-ambulance-discovery`, `-order` | EUA or HSPA |
| `uhi-pmjay-hem` | `uhi-pmjay-hem` | EUA |
| `uhi-blood-bank` | `uhi-blood-bank` | EUA or HSPA |
| `uhi-jan-aushadhi` | `uhi-jan-aushadhi-kendra-search`, `-medicine-search`, `-medicine-stock` | EUA |
| `uhi-notto` | `uhi-notto` | EUA |

Each installs and runs alone, so each repeats what it needs of signing, the registry lookup and the context block rather than depending on another skill.

A folder, as HIE-CM's are:

- `SKILL.md`, the router: what the service lets you build, the folder map, **Before anything else** from atom summaries (the role decision, the service identity, signing, matching callbacks), the practices from `shared.concept.integration-practices`, and where the detail is.
- `references/scaffold.md`: the codebase survey from `shared.concept.survey-an-existing-codebase`, then each journey as an OODA loop with a curl per step and an exit condition, compiled to `skills-src/uhi-<service>-build`.
- `references/design.md`: the service's concept atoms (identity, search variants, limits, terms, reason codes) and the screen rules from Build it well.
- `references/integrate.md`: hosts, endpoints, headers, one request in full, the operation atoms, and the signing, context block and registry lookup atoms.
- `references/debug.md`: a loop per symptom from the troubleshooting atoms and each flow's "When it goes wrong", compiled to `skills-src/uhi-<service>-debug`. UHI publishes no error codes, so the loop works from the HTTP status, the `ACK`, the error object and a missing callback.
- `references/test.md`: the service's test atoms, the checks every service is held to, and the go-live steps.

Every skill declares `requires` and `produces`, as HIE-CM's do. External inputs: `uhi-subscriber-id`, `signing-key-pair`, `callback-url`, `hiecm-m2-complete` (an EUA completes M2 on HIE-CM before any UHI onboarding), `abdm-docs-mcp`.

## Agents and commands

- `uhi-integration-agent`: takes a goal ("add PM-JAY hospital search to our app", "make our clinic bookable on UHI"), picks the role and the service skills, sequences them by `requires` and `produces`, and holds each step to its exit condition.
- `uhi-call-debugger`: takes one failing call or one missing callback to a named fix, verified by the original step succeeding.
- `/uhi-preflight [service]`: what must be true before the first call: subscriber id, key pair, reachable `consumer_uri`, clock, fresh ids.
- `/uhi-prove-signing`: signs one search and proves the header before a flow is built on it.
- `/uhi-decode-response`: turns an HTTP status, an `ACK` or `NACK`, an error object or a silence into its most likely cause and the next check.

Agents and commands are hand-written, as HIE-CM's are, and carry no endpoint facts of their own: every fact comes from a skill they name.

## Where it is registered

`.claude-plugin/marketplace.json`, `scripts/build-plugin-manifests.mjs` (Codex and Agent Plugins manifests), the plugin version check, `validate-skills.mjs` (UHI loops and routers), CI's `claude plugin validate`, `site/static/skills/uhi-*` with `uhi-index.json` and an install prompt, `site/src/data/skills.json` with `gateway: uhi`, the UHI Build with AI page, the plan (a UHI skill leaves Phase 2) and the contributor plugin.

## Tasks

- [x] **P1. Generator.** UHI loops in `compile-skills.mjs`; `scripts/lib/uhi-skills.mjs` assembles the six folders; `build-skills.mjs` emits them to the plugin and the site; `validate-skills.mjs` checks them. Tests first.
- [x] **P2. Plugin shell.** Manifest, MCP config, README, two agents, three commands.
- [x] **P3. Registration.** Marketplace, cross-client manifests, version check, CI.
- [x] **P4. Site.** UHI skills on the Build with AI page, install prompt and index.
- [x] **P5. Plan and contributor plugin.** A UHI skill is built; the plan says where.

## As built

- Six skills, each a router and five references, compiled by `scripts/lib/uhi-skills.mjs` and folded in by `build-skills.mjs`. Every journey's exit condition is its flow atom's "How you know it worked"; a missing one fails the build.
- **Left out on purpose.** The HIE-CM practices (`shared.concept.integration-practices`) and codebase survey (`shared.concept.survey-an-existing-codebase`): both are written for HIE-CM, with its certificates, `REQUEST-ID`, `TIMESTAMP` and ABHA columns. The scaffold opens with UHI's four registration steps instead.
- **Checks.** `validate-skills` runs the loop rules on `uhi-*-build` (`## Journeys`) and `uhi-*-debug` (`## Symptoms`), and checks every UHI folder cites only atoms that exist and links only inside itself. `check-build-assets` reads `uhi-index.json` and `agent-setup/uhi.md`. CI validates the plugin and diffs its skills against a fresh compile.
- **Site.** The UHI Build with AI page installs the plugin and each skill; `SkillInstall` describes a UHI skill's sections in UHI terms rather than NHCX's.
