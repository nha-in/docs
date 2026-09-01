---
name: portal-architecture
description: 'The architecture of the ABDM Developer Portal: the four building blocks, how the Catalogue compiles into docs, skills and MCP surfaces, the seven binding principles, the atom model, and what is deliberately excluded from V1. Use whenever someone asks how the portal fits together, why a design decision was made, whether something belongs in V1, where a new capability should live, or proposes a change to the structure. Also use before designing any new component so it lands in the right layer instead of beside it.'
plan_version: 2026.08.31
plan_source: abdm-v1-phase1-architecture-and-plan.md
plan_hash: sha256:4be567f1afffd4389e5a8e8d4444b9f90a2ca17bb1393f28afb15405fe97e4fa
compiled_from_plan: true
---

# Portal Architecture

## The one-paragraph version

One knowledge Catalogue of India's health gateways, scoped in phases: HIE-CM M1 to M3 carry atoms in Phase 1, while HIE-CM M4, the PHR modules, UHI and NHCX carry specifications or pages ahead of their atoms. Every gateway is open to atoms; which ones have them is a question of what the schedule reached. It is written so a first-day developer can follow it and structured so a machine can compile it. A self-hosted Docusaurus site with Scalar's open source reference component renders the human side; our own Go MCP server with hybrid retrieval serves the machine side. A build pipeline compiles the same Catalogue into agent skills, a plugin, an index and the MCP's snapshot, and re-runs whenever NHA changes something. Everything is FOSS, self-hosted, and runs without Eka.

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

| Block | What it is in V1 | The rule that keeps it honest |
|---|---|---|
| 01 Catalogue | NHA's HIE-CM M1 to M3 endpoints as atoms | Nothing downstream is hand-maintained. `scripts/validate-skills.mjs` fails CI on a cited atom id the Catalogue does not define, or a curl target recorded on no atom. Error codes are not checked. |
| 02 MCP | Our own Go Docs MCP server: nine read tools over one indexed snapshot of the Catalogue, hybrid keyword plus semantic retrieval | Retrieval only. Nothing executes against NHA. Every response carries catalogue version and verification status. |
| 03 Skills | Compiled, never written. Index, per-milestone build, test and debug skills, one bundle | The compiler may reword. It may not add facts. |
| 04 Docs | Docusaurus site with self-hosted Scalar API references, structured after developer.eka.care flow pages | No verification banner exists. Nothing under `site/src` renders one for a `stale` or an `unverified` atom, and no atom is stale today because nothing sets that status. A page that needs the warning says it in its own prose, which is held by review. Do not tell anyone the site will flag an unverified page for them. |

## The seven principles and their enforcement

A principle without an enforcement mechanism is a wish. Each of these has one.

| # | Principle | Enforced by |
|---|---|---|
| P1 | Scope is phased and declared, never implied, and what exists is declared separately from what is verified: HIE-CM M1 to M3 carry atoms now, and M4, the PHR modules, UHI and NHCX carry specifications or pages without atoms | Mandatory `gateway` field, and that is all of it. No gateway is refused by lint. A coverage gate refusing to build on zero verified atoms is wanted and not implemented, so the phasing half of P1 is held by review, not by CI. Do not cite it as a gate. |
| P2 | Documentation is the knowledge base that powers everything | Skills, llms.txt, MCP resources and the support agent are build outputs. `scripts/validate-skills.mjs` fails CI on a cited atom id or curl target the Catalogue does not define. It does not check every identifier. |
| P3 | No em dashes, write like a person | A CI rule blocks U+2014. The writing guide is in the repo and in the compiler prompt. |
| P4 | Human and machine readable from one source | Typed atoms: frontmatter is the machine half, body is the human half, structured blocks are fenced with a declared schema. |
| P5 | Fool, idiot and dummy proof | Five mandatory sections per atom or CI rejects it. The first-day developer test is in the definition of done. |
| P6 | FOSS, replicable, no Eka dependency, no vendor cloud | Catalogue in a public git repo under a neutral licence, copyright NHA. Everything self-hosted from day one: Docusaurus with the MIT Scalar packages vendored, no CDN, no Scalar cloud services, telemetry off, our own Go MCP server, embeddings from a self-hosted Ollama sidecar. The handover unit is one compose file. No `eka.care` URL anywhere in the core Catalogue. Eka content lives in a separate overlay repo. |
| P7 | Update once, everything moves | Designed, not built. `scripts/check-source-freshness.mjs` runs in CI and fails on a changed raw hash, which is the detection half. The watcher, the hash store and the pull request bot do not exist yet, so nothing opens a pull request today. |

When someone proposes something that breaks a principle, name the principle and the enforcement, not just the objection.

## The atom model

An atom is one markdown file. Frontmatter is the machine half. The body is the human half with five mandatory sections. Structured facts inside the body live in fenced blocks with a declared schema so the compiler lifts them without parsing prose.

The `related` map is what turns a folder of files into a graph. The index skill is generated by walking it. The support agent cites nodes from it. Ten types exist: concept, flow, endpoint, callback, error, test, decision, glossary, fhir, sandbox.

Full schema and section rules: `atom-authoring`.

## Atom lifecycle

```
draft -> unverified -> verified -> stale -> unverified or back to verified
```

- `draft` a stub, generated from OpenAPI or hand-created
- `unverified` five sections written, lint passes, not yet run against anything
- `verified` run against sandbox, response recorded in the atom, a reviewer stamped it
- `stale` the watcher saw the source hash change

Stale is designed to render a banner on the site and make the compiled skill warn the agent. Neither is built, and nor is the watcher that would set `stale` in the first place, so no atom is stale today. Unverified renders no label either: no component under `site/src` reads the status, so the pages that say `unverified` say it in hand-written prose. The support agent does carry the status when citing, because the MCP tools return it. A source change never silently edits a verified atom.

## Where new things go

Use this when someone proposes a capability and you need to place it.

| The proposal | Where it belongs |
|---|---|
| New knowledge about a gateway | An atom. Always an atom first. |
| A new way to explain existing knowledge | An atom body edit, or a skill template change. Never a new parallel document. |
| A new agent capability | A skill compiled from atoms, registered in the index. |
| A deterministic repeated operation | A script under `skills/*/scripts/`, registered in the index. |
| Something that calls NHA at runtime | Search-mode value is covered by `get_operation` and `validate_request` on the Docs MCP. Execute mode is a Phase 2 concern with its own per-caller credentials. |
| Anything Eka-specific | The overlay repo. Not the core Catalogue. See `dpg-governance`. |
| Conformance evidence, ledger, gate, simulators | Phase 2. They depend on this Catalogue existing first. |

## Gateway scope and phasing in V1

Scope is phased, and phase is not the only axis. Keep two claims apart at all times. **Exists** means a file is in the repository and a page renders from it. **Verified** means the call was made against the sandbox and the response recorded in an atom. A specification existing is not evidence that any operation in it works.

What exists: `catalogue/openapi/hiecm/v3/` holds nine specifications carrying 289 operations, the gateway plus M1, M2, M3, M4, P1, P2, P3 and PHR application services. The site renders 348 HIE-CM pages, 302 of them generated, alongside 16 UHI pages and 5 NHCX pages.

What is verified: 142 atoms are indexed, 138 `unverified` and 4 `verified`. Every atom is HIE-CM or shared: 122 HIE-CM, of which 120 sit on M1 to M3 and 2 are decision atoms carrying `n/a`, plus 20 shared atoms, which lint requires to carry `n/a`. There are no M4 atoms, no PHR module atoms, no UHI atoms and no NHCX atoms.

**NHCX, pages today and atoms open.** NHCX has site pages and no atoms, and the gap is a schedule rather than a rule. Atoms: there are none, because Phase 1's time went to HIE-CM M1 to M3. `scripts/lint-atoms.mjs` accepts `gateway: nhcx` alongside `hiecm`, `uhi` and `shared`, so an NHCX atom lints clean the day somebody writes one. Pages: `site/docs/nhcx/` renders 5 pages covering what NHCX is, who is on it, its registries and its glossary, `catalogue/nhcx/` and `catalogue/openapi/nhcx/v1/` exist as folder structure holding no atom and no specification, and `CONTRIBUTING.md` documents the NHCX provider and payer roles. Nothing enforces that second half, because those are ordinary hand-written site pages. So, in both directions: do not tell anyone NHCX is absent from the repository, because its pages ship, and do not tell anyone NHCX atoms are forbidden, because they are merely unwritten.

Out of Phase 1 is not an empty page. UHI and NHCX have orientation pages built from NHA's own documents: what it is, whether the reader needs it, where NHA documents it. M4 and the PHR modules go further, because they have specification files, so their reference pages are generated and every operation appears. What none of them has is an atom, which is where the plain words, the worked example and the recorded sandbox response live. The landing page, the index skill and the frontmatter all carry the phase.

One gateway at three milestones, fully proven, beats three gateways half-written. Generated reference pages are cheap, because they fall out of a specification file, which is why M4 and the PHR modules render at all. Atoms are expensive, because each one is written and then proven, which is why they stop at M1 to M3. A confident wrong page is harmful; a generated page that says it is unverified is honest. What is never acceptable is something shaped like a proven reference that has not been run. Repeat that whenever someone suggests slipping UHI or the PHR modules into Phase 1 "since the pages already render".

## Explicitly not in V1

Naming these prevents scope creep by accretion.

- Atoms and skills for HIE-CM M4, for the PHR modules P1 to P3 and PHR application services, and for UHI. Their specifications and generated reference pages are already in the repository; only the atoms and skills are Phase 2
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
