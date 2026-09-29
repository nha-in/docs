---
name: portal-architecture
description: 'The architecture of the ABDM Developer Portal: the four building blocks, how the Catalogue compiles into docs, skills and MCP surfaces, the seven binding principles, the atom model, and what is deliberately excluded from V1. Use whenever someone asks how the portal fits together, why a design decision was made, whether something belongs in V1, where a new capability should live, or proposes a change to the structure. Also use before designing any new component so it lands in the right layer instead of beside it.'
plan_version: 2026.09.29-12
plan_source: abdm-v1-phase1-architecture-and-plan.md
plan_hash: sha256:dbbd718604d5e7d276881b9bb75b67c5d784ed75d8c84053b9bba35cfb27d484
compiled_from_plan: true
---

# Portal Architecture

## The one-paragraph version

One knowledge Catalogue of India's health gateways, scoped in phases: HIE-CM carries specifications and generated reference pages for the gateway, M1 to M4, P1 to P4 and the three use cases, Scan and Register, Record Share and Scan and Pay, UHI carries specifications and generated reference pages for its network, Physical Consultation and Ambulance Booking modules, NHCX carries specifications and pages, and atoms cover HIE-CM M1 to M4 and P1 to P3, UHI's operations and service journeys, and the shared material that belongs to no single gateway. Every gateway is open to atoms; which ones have them is a question of what the schedule reached. It is written so a first-day developer can follow it and structured so a machine can compile it. A self-hosted Docusaurus site with Scalar's open source reference component renders the human side; our own Go MCP server with hybrid retrieval serves the machine side. A build pipeline compiles the same Catalogue into agent skills, a plugin, an index and the MCP's snapshot, and re-runs whenever NHA changes something. Everything is FOSS, self-hosted, and runs without Eka.

## The four building blocks

One is the source. Three are renderings of it.

```
01 Catalogue (source of truth)
   typed atoms + HIE-CM OpenAPI, one file per module
   callbacks as OpenAPI 3.1 webhooks inside the module file
        |
        +--> 04 Docs site         -> Docusaurus + self-hosted Scalar references
        +--> 02 Docs MCP server   -> coding agents, internal support agent
        +--> 03 Skills + plugin   -> coding agent in the integrator's repo
                + generated index
```

The design is that NHA sources are watched daily and feed the Catalogue through a reviewed pull request. Today a person brings a source in by hand and CI checks the recorded hashes; see P7 below. Either way, nothing feeds the renderings directly.

The docs site's What's New tab is generated the same way, with no model and no person writing it. A facts snapshot under `catalogue/changelog/facts/` holds every operation contract, source hash, role, error list, skill and MCP tool name; `npm run changelog` diffs the working tree against it, maps each difference to one of the six entry kinds the `changelog` skill defines, and renders the entries from fixed templates into the dated pages, the index and the sidebar order. Wording, layout and navigation are never read, so they can never produce an entry. `npm run check:changelog` fails CI when the snapshot or the pages are stale.

| Block | What it is in V1 | The rule that keeps it honest |
|---|---|---|
| 01 Catalogue | NHA's HIE-CM M1 to M3 endpoints as atoms | Nothing downstream is hand-maintained. `scripts/validate-skills.mjs` fails CI on a cited atom id the Catalogue does not define, or a curl target recorded on no atom. Error codes are not checked. |
| 02 MCP | Our own Go Docs MCP server: nine read tools over one indexed snapshot of the Catalogue, hybrid keyword plus semantic retrieval | Retrieval only. Nothing executes against NHA. Every response carries the catalogue version. |
| 03 Skills | Compiled, never written. Index, per-milestone build, test and debug skills, one bundle | The compiler may reword. It may not add facts. |
| 04 Docs | Docusaurus site with self-hosted Scalar API references, structured after developer.eka.care flow pages | No status banner exists, and no atom carries a status to render. A page that needs the warning says it in its own prose, which is held by review. Do not tell anyone the site will flag a page for them. |

## The seven principles and their enforcement

A principle without an enforcement mechanism is a wish. Each of these has one.

| # | Principle | Enforced by |
|---|---|---|
| P1 | Scope is phased and declared, never implied, and what exists is declared separately from what is merely specified: HIE-CM M1 to M4, P1 to P3 and UHI carry atoms now, and PHR application services and NHCX carry specifications or pages without atoms | Mandatory `gateway` field, and that is all of it. No gateway is refused by lint. A coverage gate refusing to build on zero atoms is wanted and not implemented, so the phasing half of P1 is held by review, not by CI. Do not cite it as a gate. |
| P2 | Documentation is the knowledge base that powers everything | Skills, llms.txt, MCP resources and the support agent are build outputs. `scripts/validate-skills.mjs` fails CI on a cited atom id or curl target the Catalogue does not define. It does not check every identifier. |
| P3 | No em dashes, write like a person | A CI rule blocks U+2014. The writing guide is in the repo and in the compiler prompt. |
| P4 | Human and machine readable from one source | Typed atoms: frontmatter is the machine half, body is the human half, structured blocks are fenced with a declared schema. |
| P5 | Fool, idiot and dummy proof | Five mandatory sections per atom or CI rejects it. The first-day developer test is in the definition of done. |
| P6 | FOSS, replicable, no Eka dependency, no vendor cloud | Catalogue in a public git repo under a neutral licence, copyright NHA. Everything self-hosted from day one: Docusaurus with the MIT Scalar packages vendored, no CDN, no Scalar cloud services, telemetry off, our own Go MCP server, embeddings from a self-hosted Ollama sidecar. The handover unit is one compose file. No `eka.care` URL anywhere in the core Catalogue. Eka content lives in a separate overlay repo. |
| P7 | Update once, everything moves | Designed, not built. `scripts/check-source-freshness.mjs` runs in CI and fails on a changed raw hash, which is the detection half. The watcher, the hash store and the pull request bot do not exist yet, so nothing opens a pull request today. |

When someone proposes something that breaks a principle, name the principle and the enforcement, not just the objection.

## The atom model

An atom is one markdown file. Frontmatter is the machine half. The body is the human half: five dummy-proof sections, of which each type must carry the ones it needs (a glossary term needs only In plain words, a flow all five). Structured facts inside the body live in fenced blocks with a declared schema so the compiler lifts them without parsing prose.

Atom contract v2 adds `operation` (required on endpoint and callback atoms, NHCX excepted until its source is decided), `side`, `status` with `superseded_by`, and `facts`. Search hides a deprecated atom unless asked.

HIE-CM and UHI each own one folder, `catalogue/<gateway>/`, holding everything they have: `map/` (its content map), `openapi/<version>/` with `corrections/` and `.raw/` beside it, and one folder per atom type. `nhcx/` holds NHCX's atoms, and `shared/` those that belong to no gateway. NHCX's specifications, corrections and sources, `CONVENTIONS.md` and the NRCeS package stay under `catalogue/openapi/` with NHCX's rows in `catalogue/titles.yaml` until NHCX is restructured. `annexure/`, `changelog/`, `VERSION`, `registry.json` and `atom-routes.json` are the only other top-level names. `npm run lint:atoms` fails on any other name and on any atom not at `catalogue/<gateway>/<type folder>/<id slug>.md`. An atom's words live in one place, never two. Either it is a hand-written file in its type folder, or it is a page section: the gateway's content map, `catalogue/<gateway>/map/*.yaml`, one file per batch, maps its id to a page and an explicit heading id (`{#id}` in `.md`, `{/* #id */}` in `.mdx`), its rules for agents sit in `<AgentOnly>` on that page, and `scripts/build-sections.mjs` writes its file into the same type folder, marked `generated: true`, and lists every atom in `catalogue/registry.json`. A file marked `generated: true` is never edited, and the build deletes or overwrites only files carrying that mark. An id defined in two map files fails `check:sections`. Endpoint, callback and error atoms sit on generated API pages, so their sections live in hand-written notes partials: `site/docs/_notes/<gateway>/<operationId>.mdx` renders on that operation's page and `site/docs/_notes/<gateway>/errors/<module>.mdx` on the module's error page, holding only sections with explicit ids, and `lint:content` checks them as hard errors. Content moves onto pages one class at a time; the repository is coherent if that stops at any commit. NHCX waits on the NHCX source decision. NHA's corrections go to pages, by `docs/runbook-nha-corrections.md`.

The `related` map is what turns a folder of files into a graph. The index skill is generated by walking it. The support agent cites nodes from it. Ten types exist: concept, flow, endpoint, callback, error, test, decision, glossary, fhir, sandbox.

Full schema and section rules: `atom-authoring`.

## Atom lifecycle

```
draft -> published -> checked, and from either back through an issue
```

- `draft` a stub, generated from OpenAPI or hand-created
- `published` its type's sections written, lint passes, merged. This is what every reader sees, stated as ABDM's own account, with no status label anywhere
- `issue` an integrator found the atom wrong. A GitHub issue keyed by the atom id, then the atom is corrected citing it, on its page if it has migrated, and the skills recompile

Atoms carry no verification field. Lint fails one that does. The MCP returns no status and the support agent cites atom ids only. A source change never silently edits an atom: it opens a PR naming the affected ids.

## Where new things go

Use this when someone proposes a capability and you need to place it.

| The proposal | Where it belongs |
|---|---|
| New knowledge about a gateway | An atom. Always an atom first. |
| A new way to explain existing knowledge | An atom body edit, or a skill template change. Never a new parallel document. |
| A new agent capability | A skill compiled from atoms, registered in the index. |
| A deterministic repeated operation | A script under `skills/*/scripts/`, registered in the index. |
| Something that calls NHA at runtime | Search-mode value is covered by `get` and `validate` on the Docs MCP. Execute mode is a Phase 2 concern with its own per-caller credentials. |
| Anything Eka-specific | The overlay repo. Not the core Catalogue. See `dpg-governance`. |
| Conformance evidence, ledger, gate, simulators | Phase 2. They depend on this Catalogue existing first. |

## Gateway scope and phasing in V1

Scope is phased. What this skill counts is what exists: a file in the repository and a page that renders from it.

What exists: `catalogue/hiecm/openapi/v3/` holds twelve specifications carrying 337 operations, 34 of them webhooks: the gateway plus M1, M2, M3, M4, P1, P2, P3, P4, and the use cases Scan and Register, Record Share and Scan and Pay. Subscriptions have no specification of their own: their calls sit in P3. `catalogue/uhi/openapi/v1/` holds three, network, Physical Consultation and Ambulance Booking, carrying 5, 18 and 2 operations, generated by `scripts/ingest-uhi.mjs` from NHA's UHI set of 28 September 2026 and ordered by twelve journeys. `catalogue/openapi/nhcx/v1/` holds fourteen, carrying 79 operations, 19 of them webhooks. The reference is ordered by the journey files under `catalogue/hiecm/openapi/v3/journeys/`, and each module's error page lists the codes its specification's response examples return. The site renders 459 HIE-CM pages, 405 of them under `api/` and 392 of those generated, alongside 58 generated UHI reference pages, UHI's orientation pages, and NHCX's pages.

What the Catalogue holds: `npm run lint:atoms` prints the count and the split by type, and that is the only figure worth quoting. No atom carries a status. HIE-CM carries 269 atoms: 20 design rules in `catalogue/hiecm/concepts/`, 22 glossary terms in `catalogue/hiecm/glossary/` (link token written from its page, the rest hand-written), and 227 page-sourced atoms rebuilt on 29 September 2026 after the 16 September reset deleted them, covering concepts, flows, troubleshooting, endpoints, callbacks and error codes for M1 to M4 and P1 to P3. 29 were not rebuilt because NHA's final set has no such call or code. UHI carries 111: its glossary terms EUA and HSPA, and 109 page sections mapped in `catalogue/uhi/map/`, a notes partial per operation and concepts, flows, decisions, tests, sandbox, troubleshooting and glossary on the UHI pages. No UHI error atom exists, because no UHI code list is published.

**NHCX, pages and hand-written atoms.** NHCX has site pages under `site/docs/nhcx/` and atoms under `catalogue/nhcx/`: hand-written files, most citing NHA's NHCX site of 14 September 2026, not yet moved onto pages; `npm run lint:atoms` counts them. `catalogue/openapi/nhcx/v1/` holds fourteen NHCX specifications, and `CONTRIBUTING.md` documents the NHCX provider and payer roles. They move onto pages class by class, as HIE-CM did, once the NHCX source is decided. Until then an NHCX atom is edited in its file. Do not tell anyone NHCX is absent: its pages and atoms ship.

Out of Phase 1 is not an empty page. UHI and NHCX have orientation pages built from NHA's own documents: what it is, whether the reader needs it, where NHA documents it. Every HIE-CM module, UHI's three modules and NHCX go further, because each has a specification file, so its reference pages are generated and every operation appears, and M1 to M4, P1 to P3 and UHI carry atoms on those pages. What NHCX, P4 and the three use cases lack is an atom on a page, which is where the plain words and the agent rules live. The landing page, the index skill and the frontmatter all carry the phase.

One gateway written out beats three gateways half-written. Generated reference pages are cheap, because they fall out of a specification file, which is why every HIE-CM module renders. Atoms are expensive, because each one is written by hand. The HIE-CM writing came down with the 16 September reset and was rebuilt on 29 September against the final set. A confident wrong page is harmful; a generated page that states only what the specification carries is honest. Repeat that whenever someone suggests slipping UHI into Phase 1 "since the pages already render".

## Explicitly not in V1

Naming these prevents scope creep by accretion.

- A skill for UHI. Its specifications, journeys, generated pages and atoms are already in the repository; only the skill is Phase 2. PHR application services was on this list and its specification was retired in the 16 September 2026 reset; the phase of atoms for P4 and the three use cases, Scan and Register, Record Share and Scan and Pay, is not decided. HIE-CM M4 and the PHR modules have come off this list: they carry compiled skills built from their journeys and specifications, and M4 and P1 to P3 carry atoms again since the 29 September 2026 rebuild
- NHCX atoms and NHCX skills, in V1 only. Nothing rejects them: the gateway lints clean and Phase 2 may add them. NHCX site pages are not on this list: they exist and they ship
- The conformance harness, ledger, gate and simulators
- Execute-mode MCP exposed publicly
- Any Eka-specific overlay content in the core Catalogue
- Multi-agent orchestration. The index routes, a single agent executes.
- Generated SDKs

If someone wants one of these, the answer is not no, it is Phase 2, because each depends on a Catalogue that does not exist yet. NHCX is no longer an exception to that: its atoms and skills are Phase 2 like the rest, and its site pages already exist and are not going anywhere.

## Related

- Schedule, ownership and done: `portal-planning`
- The licence and dependency constraint: `dpg-governance`
- Writing atoms: `atom-authoring`
- Compiling them: `skill-compiler`
