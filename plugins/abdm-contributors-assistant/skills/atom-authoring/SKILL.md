---
name: atom-authoring
description: 'How to write one atom for the ABDM Catalogue: the mandatory frontmatter schema, the ten atom types, the dummy-proof body sections each type requires, structured fenced blocks, and the related graph. Use whenever creating or editing a unit of Catalogue knowledge, whether it is a concept, flow, endpoint, callback, error, test, decision, glossary, FHIR or sandbox page. Also use when someone asks how to document an NHA endpoint, what fields a page needs, how to link pages together, or why an atom failed schema lint.'
---

# Atom Authoring

An atom is one markdown file, hand-written here or built from a page section (see "Migrated atoms are edited on their page" below). The frontmatter is the machine half. The body is the human half. Both come from the same file, which is the only reason the docs and the skills cannot drift.

## Before you write anything

Answer these four. If you cannot, you are not ready to write the atom.

1. **What type is it?** One of: concept, flow, endpoint, callback, error, test, decision, glossary, fhir, sandbox. If it feels like two types, it is two atoms.
2. **What is the source?** A URL and a hash. Never write an atom without a source. If the only source is a person's memory, mark it `docs-only`.
3. **What does the reader already have?** That becomes "Before you start" and it must link to the atoms that get them there.
4. **How will the reader know it worked?** If you cannot state an observable outcome, the atom is not finished and probably should not be merged.

## The frontmatter schema

Every field below is mandatory unless marked optional. Lint rejects anything missing.

```yaml
id: hiecm.flow.m2-link-care-context
type: flow
gateway: hiecm
milestone: M2
version: abdm-v3
title: Link a care context to a patient's ABHA
summary: >
  Tell ABDM that this patient had a visit at your facility so their records
  can be found later.
sources:
  - url: https://sandbox.abdm.gov.in/swagger/ndhm-hip.yaml
    fetched: 2026-08-24
    hash: sha256:...
related:
  endpoints: [hiecm.endpoint.links-link-add-contexts]
  callbacks: [hiecm.callback.on-add-contexts]
  errors: [hiecm.error.abdm-1035, hiecm.error.abdm-1037]
  tests: [hiecm.test.m2-tc-03]
  concepts: [hiecm.concept.care-context]
skills:
  - hiecm-m2-build
  - hiecm-m2-test
```

Field rules that catch people out:

- `id` is `gateway.type.slug`, lowercase, stable, and never reused. Renaming an id is a breaking change and needs a redirect.
- `gateway` is one of `hiecm`, `uhi`, `nhcx`, `shared`. Shared atoms have no milestone; use `n/a`. All four lint clean. `uhi` carries no atoms yet because Phase 1's time went to HIE-CM, not because anything rejects it. Write one when you have the time to prove it.
- `version` is the NHA spec version this is true for, not the Catalogue version. The Catalogue version is stamped by the build.
- `summary` is one sentence a new developer understands with no acronyms. It is what the index and the search result show. Write it last, after the body, when you know what the atom actually says.
- There is no `verified` field. Lint fails an atom that carries one. The Catalogue is published as ABDM's statement of how ABDM works; sandbox checks are internal, run by `npm run verify:atoms`, and their evidence lives under `catalogue/verification/`, never in the atom.
- `related` ids must all resolve. Lint fails on a dangling id.
- `skills` declares which compiled skills consume this atom. The compiler reads it. An atom with no `skills` entry renders in the docs but never reaches an agent, which is sometimes correct (glossary, decision) and sometimes a mistake.

Three optional fields exist, and each is read by a script. Lint checks their
shape when present and never requires them.

| Field | Shape | What reads it, and what it does |
|---|---|---|
| `audience` | `contributor` | `mcp/cmd/indexer` drops the atom before it writes the snapshot. For an atom about how this catalogue is built rather than how ABDM works, so it cannot be returned to an integrator asking about ABDM. Absent means integrator. |
| `order` | whole number from 1 | `scripts/build-skills.mjs` places the atom within its compiled design section. Absent sorts after the ordered atoms, by id, so adding a rule appends rather than reshuffling. |
| `router` | non-empty string | `scripts/build-skills.mjs` renders it as one line in the compiled skill's always-loaded router, where the design section is loaded on demand. For a rule a reader must meet before deciding whether to open that section. |

Write `router` only where the rule changes what somebody does before reading
further. The router is the part of a skill that is always in context, and
every line added to it costs every reader.

`fix.deterministic` and `depth` are not read by `scripts/lint-atoms.mjs`,
`scripts/compile-skills.mjs`, or any other script in this repository: writing
them on an atom has no effect. Do not add them until a script actually reads
them.

## The five body sections

The five headings always appear in this order, and each type must carry the ones it needs. A section a type does not need is left out rather than filled with boilerplate: identical paragraphs across hundreds of atoms compete in search. The compiler checks presence. A reviewer checks honesty.

| Type | Sections it must carry |
|---|---|
| glossary, concept, decision, sandbox, fhir | In plain words |
| error | In plain words, When it goes wrong |
| troubleshooting | In plain words, What happens, When it goes wrong |
| flow, endpoint, callback, test | all five |

### 1. In plain words

What this is, for someone who has never heard of ABDM. No acronym without a glossary link on first use. If the first sentence needs a second sentence to explain a word in it, rewrite the first sentence.

### 2. Before you start

What must already be true. Credentials, registrations, a previous step, a facility that is onboarded. Every item links to the atom that gets the reader there. A bare list of nouns is a failure; each line should be checkable.

### 3. What happens

The sequence, naming who calls whom. Flows get a mermaid sequence diagram. Endpoints get a working curl with every placeholder named in the form `<YOUR_CLIENT_ID>` so it is obvious what to substitute. Never abbreviate a header away.

### 4. How you know it worked

The exact response, callback or state change to look for. Not "success". Write it as an observation:

> You receive a callback at `/on-add-contexts` with `status: SUCCESS` within 60 seconds. The `requestId` matches the one you sent.

This section is not decoration. It becomes the exit condition of every compiled skill's OODA loop. A vague section 4 produces a skill that never knows when to stop.

### 5. When it goes wrong

The three to five most common failures. Each links to an error atom that names the fix. Order by frequency, not by severity. If you know of a failure with no error atom yet, create the error atom rather than describing the fix inline.

## Structured blocks inside the body

No lint script enforces a declared schema on fenced blocks. `scripts/lint-atoms.mjs`, `scripts/lint-content.mjs` and `scripts/lint-agent-readiness.mjs` do not check for `schema=` annotations, and `scripts/compile-skills.mjs` assembles a compiled skill from the body's `##` sections as prose, not by lifting fenced blocks. If you want the compiler to pick out a fact reliably, put it in section 4, "How you know it worked," in the plain-observation style shown there. A fenced block is still fine for a curl example or a payload, but nothing parses it structurally today.

## Type-specific rules

Read the file for the type you are writing: `references/atom-types.md`.

## Common mistakes

| Mistake | Why it fails | Do instead |
|---|---|---|
| Two flows in one atom | The graph cannot link to half a file | Split, link with `related` |
| Section 4 says "you get a 200" | 200 means the request was accepted, not that the work happened | Name the callback and its payload |
| Curl with `-H "Authorization: Bearer TOKEN"` | The reader does not know where TOKEN came from | `<ACCESS_TOKEN_FROM_SESSIONS_CALL>` and link the atom |
| `verified:` in the frontmatter | The field no longer exists and lint fails on it | Drop it. Evidence lives in `catalogue/verification/` |
| Fix described inline in section 5 | Skills compile error atoms separately | Create the error atom, link it |
| Em dash anywhere | CI blocks U+2014 | Full stop, comma or colon |

## How the indexer reads your atom

The Docs MCP indexer walks the catalogue and parses every `.md` outside
`openapi/` as an atom, with one exception: a file named `README.md`, wherever
in the tree it sits, not only at the catalogue root. A file that fails to parse fails the whole build,
loudly, naming the file. Atom bodies are chunked per `##` heading and
embedded for semantic search. `catalogue/README.md` restates the frontmatter
field list and the five section names for a reader browsing the catalogue
directly, without this skill installed; it does not add rules beyond what
this skill states. Read this skill for the rules, and `catalogue/README.md`
if you only have the repository open.

## Migrated atoms are edited on their page

An atom listed in `catalogue/map.yaml` or a fragment in `catalogue/map.d/` has no hand-written file. Its words are
the page section named by its `page` and `heading`, and its rules for agents are
the `<AgentOnly>` notes in that section. Edit the page, then run
`npm run build:sections`. Never edit `catalogue/generated/`. Only an atom that is
not in the map yet is edited as a file under `catalogue/`.

How a section becomes an atom:

- The heading carries an explicit id that never changes when the words do: `### Link token {#link-token}` in a `.md` page, `### Link token {/* #link-token */}` in an `.mdx` page. MDX reads a bare `{#id}` as an expression and the site build fails.
- The section's visible text is `In plain words`. It must be plain markdown: no JSX other than `<AgentOnly>`, no `{expression}`. Relative anchors like `[HIP](#hip)` become absolute links on their own.
- Every paragraph inside `<AgentOnly>` starts with one of four labels, `**Before you start.**`, `**What happens.**`, `**How you know it worked.**` or `**When it goes wrong.**`, and becomes that section of the atom. A section with no paragraph is left out, never filled with placeholder text.
- An agent note may narrow or restate the page and the specifications. It never adds an API literal, anything in backticks, that neither states. NHA does not review the notes, so CI is their only guard.
- The map entry holds `type`, `gateway`, `milestone`, `title`, `summary`, `page`, `heading`, `url` and `related`, and no prose. No `related` list names its own atom.
- `<AgentOnly>` is JSX, so a page gains one only if it is `.mdx`. Convert a page in its own commit, and build the site before any content moves.
- Endpoint, callback and error atoms have no hand-written page, because API pages are generated. Their sections live in hand-written notes partials: `site/docs/_notes/<gateway>/<operationId>.mdx`, rendered on that operation's generated API page, and `site/docs/_notes/<gateway>/errors/<module>.mdx`, rendered after the module's error table on `/docs/<gateway>/<version>/api/<module>/errors`. A partial has no frontmatter and holds only sections with explicit heading ids, one per atom, nothing else. Endpoint and callback map entries also carry `operation` (contract v2).
- A batch of new map entries goes in one fragment of its own, `catalogue/map.d/<gateway>-<batch>.yaml`, so batches do not conflict in `map.yaml`. An id defined in two map files fails `check:sections`.

Moving a class of atoms onto pages follows the checklist in the page-canonical plan: heading ids first, words onto the page, map entries added and files deleted in the same PR, `npm run report:migration -- <ids>` pasted into the PR, and the retrieval gate run before and after with at least one question per migrated atom (`portal-proof`). NHCX atoms do not move until the NHCX source is decided.

## Related

- The prose rules: `writing-guide`
- Reviewing before merge: `atom-review`
- Fixing lint failures: `catalogue-linting`
- Where atoms come from: `openapi-ingest`
- Scaffold a new one: `/atom-new`
