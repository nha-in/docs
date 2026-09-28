---
name: changelog
description: What earns an entry in the ABDM Developer Portal's What's New tab, what never does, and the shape of an entry. Entries are generated from a diff of the catalogue's facts, not written by hand. Covers the six qualifying kinds, the act-on-it test, the benchmarks the rule is drawn from, how the generator maps a catalogue change to an entry, the two frontmatter declarations a person still makes, and the check:changelog CI gate. Use whenever reviewing a generated entry, deciding whether a change deserves logging at all, recording a correction or a new procedure, when check:changelog fails, or when someone proposes logging a redesign, a navigation change or a rewording.
---

# Changelog

The What's New tab is not a build log. It is the page an integrator opens to
find out whether anything they already built is now wrong, and whether anything
they could not build before is now possible.

**The test, applied to every proposed entry: does the reader have to act on it?**

If the honest answer is no, it does not get an entry. A changelog that logs
everything buries the one line that mattered.

## What earns an entry

Six kinds, and nothing else.

| Kind | The reader's reason to care |
|---|---|
| New coverage | A module, role or gateway they can now build against |
| A correction | A documented fact was wrong, so what they built on it may be wrong |
| A source republished | A specification changed, so a documented behaviour changed |
| An operation renamed, added or withdrawn | Their calls have to change |
| A new artefact they can consume | An OpenAPI file, an agent skill, an MCP server, the Markdown routes |
| A procedure documented for the first time | The sandbox exit process, the security audit |

Corrections are the highest value kind and the easiest to skip, because nobody
enjoys writing them. Write them anyway, and say what the wrong fact was. A
reader who built against it has to know what to go back and check.

## What never earns an entry

Page layout, navigation, wording, colour, ordering, a page split, a page
renamed, a new diagram of a flow already documented, a voice or tone pass.

These are real work and they are invisible to the changelog. Every one of the
entries below was published on this portal and every one was removed:

| Removed entry | Why it failed the test |
|---|---|
| Each milestone has its own page | Naming and navigation |
| Methods are colour coded | Visual |
| Install tools opens in place | Interface behaviour |
| The landing page asks what you are building | Interface behaviour |
| Get started is now a launchpad, not an introduction | Reorganisation |
| The API reference speaks as the API | A voice pass |
| The M3 consent journey, drawn in three parts | New diagrams of a module already documented |

Two of those logged the same homepage redesign twice, on two dates, under two
titles. That is the failure mode: with no inclusion rule, the changelog fills
with whatever was worked on, and the same work gets logged as many times as it
is touched.

## Where the rule comes from

Three platforms, one line, and none of them is ours.

| Benchmark | What it logs | Docs site changes |
|---|---|---|
| Stripe | API and `stripejs` only, tagged by affected product and by whether it breaks you | None at all |
| Claude platform | Model releases, new APIs, breaking changes, pricing, deprecations, SDK releases | Only the platform moving host. Never a redesign |
| Cloudflare | Features, limits, deprecations, security patches, client releases | None, and this is the site `docs-ux` already benchmarks against |

The Claude release notes are the most explicit: a documentation change appears
only when it is paired with an API change. A standalone entry for improved
wording does not exist there.

**Our situation differs in one way only.** Their product is the API and the docs
describe it. Our product is the documentation and it describes someone else's
API. So new coverage counts for us where it would not for them: a module that
now has a reference is a capability the reader gained. That is the single
translation. It does not reopen the door to layout and wording.

## The shape of an entry

One `###` heading per change, inside the date's `ReleaseGroup`. The heading is
the change stated as a fact, not a category label.

- **Say what changed, not that something changed.** "Seven PHR operations renamed", not "Reference updates".
- **Link the page the reader goes to next.** An entry with no link makes them search.
- **For a correction, name the wrong fact.** The reader has to recognise their own code in it.
- **Two or three sentences.** The page carries the detail; the entry carries the reason to open it.
- **NHA voice applies here as everywhere.** An entry reports what the platform now does, not what a document said or how the work was done. See `nha-voice`.

The templates in `scripts/lib/changelog-render.mjs` encode all of this. Nobody
writes an entry by hand any more; the rules above are what you check a
generated entry against, and what you change the template to satisfy.

## How entries are generated

```
entries = rules(facts(now) - facts(last published))
```

No model is involved. Three modules under `scripts/lib/`:

1. **`changelog-facts.mjs`** extracts from one checkout every fact a reader can act on and nothing else. Per module: each operation's contract (method, normalised path, primary server, security scheme names, parameters with headers lower-cased and path parameters positional, required body fields, body property names, encrypted fields, response codes), the upstream `.raw` files it was generated from with their sha256 (`x-abdm-sources`), its roles (`x-abdm-roles`), and its error code list (`catalogue/openapi/<gw>/<v>/errors/<module>.yaml`). For the site: the skills under `skills-src/` and `plugins/nhcx/skills/`, plugin versions, the Docs MCP tool names from `mcp/internal/server/mcp.go`, and the two frontmatter declarations below. Summaries, descriptions, titles, labels, journeys, layout and navigation are never read, so they can never produce an entry.
2. **`changelog-rules.mjs`** diffs the working tree against the committed snapshot under `catalogue/changelog/facts/` (one JSON per module plus `_site.json`) and maps each difference to a kind. A new module, role or error list is new coverage. An operation contract change is a source republished when the module's upstream hash changed or a new `.raw` set is cited, otherwise a correction: the specs are generated by `scripts/ingest-nha.mjs` and `scripts/ingest-uhi.mjs` from `.raw` plus a fixed edit list, so those are the only two causes. An operation added, withdrawn, moved between modules (same method and path) or at a new address (same operationId, new path) is an operation change. A skill, plugin or MCP tool appearing is an artefact. Differences aggregate to one entry per kind per module, and identical corrections across two or more modules of one gateway fold into one gateway-level entry.
3. **`changelog-render.mjs`** renders entries from fixed templates into `catalogue/changelog/entries/<date>.json`, the durable record, and from there into `site/docs/whats-new/<date>.mdx` pages carrying `generated: true`, the index (`index.mdx`; the hand-written "What gets an entry" section lives in `_rules.mdx`) and the sidebar order. The five hand-written pages from 15 to 23 September stay as they are.

The heading, the index bullet, the anchor, the count on the date's group and
the sidebar order are all produced by step 3. `onBrokenAnchors: 'throw'` is set
in `site/docusaurus.config.ts`, so a stale index anchor fails the build.

## The two declarations a person makes

The generator cannot see prose. Two facts live only there, and a page's
frontmatter declares them:

| Declaration | When | What it produces |
|---|---|---|
| `page_type: procedure` | A procedure is documented for the first time: the sandbox exit process, the security audit | A "procedure documented for the first time" entry linking the page |
| `corrections:` with `was` and `now` | A wrong fact in prose is fixed | A correction entry naming the wrong fact and what it is now |

A prose fix without a `corrections:` line is invisible to the changelog, and
the reader who built on the wrong fact is never told.

## Commands

| Command | What it does |
|---|---|
| `npm run changelog` | Diff, append entries dated today in Asia/Kolkata to `catalogue/changelog/entries/`, move the snapshot, render the pages |
| `npm run check:changelog` | The CI job. Fails when the snapshot or the pages are stale, with "run npm run changelog" |
| `npm run test:changelog` | Golden tests replaying three real snapshots of the repository, asserting what appears and what must not |

The site's `prestart` and `prebuild` render the pages from the entries, so a
checkout that has the entries has the pages.

## What a person still does

- Writes the `corrections:` or `page_type: procedure` frontmatter when the change lived only in prose.
- Reviews the generated entries in the pull request against the rules above. A wrong entry is a wrong template or a wrong rule, and is fixed there.
- Edits `catalogue/changelog/entries/<date>.json` to drop an entry a revert made moot, or to merge two the aggregation kept apart. Then re-renders.

## Reviewing a republish

When a source republished entry appears and you want to see the whole
specification diff rather than the contract facts alone, pb33f's viewer handles
OpenAPI 3.1 and webhooks:

```sh
npx @pb33f/openapi-changes console old.yaml new.yaml
```

It is an optional interactive viewer for a person, not a dependency of anything.
It reports wording changes and cannot normalise path templates, which is why it
is not the engine. GitHub auto release notes, label-based tools, git-cliff,
conventional-changelog and oasdiff were also evaluated and rejected: the first
four list pull request or commit titles, and oasdiff has no OpenAPI 3.1 webhook
rules.

## Common mistakes

| Mistake | Do instead |
|---|---|
| Logging the work you did today because you did it | Nothing. The generator reads no wording, layout or navigation, so most days produce no entry |
| Fixing a wrong fact in prose without a `corrections:` line | Add `corrections:` with `was` and `now` to the page's frontmatter in the same commit |
| A new procedure page without `page_type: procedure` | Declare it, or the page never reaches the changelog |
| Editing a generated page by hand | Edit the entry JSON under `catalogue/changelog/entries/`, or the template, then re-render. The page is overwritten on the next build |
| Committing a catalogue change and not running `npm run changelog` | `check:changelog` fails the pull request. Run it and commit the snapshot, the entries and the pages together |
| A correction entry that reads as an improvement | Name the wrong fact in `was`. The template renders what you declare |
| Hand-writing an entry to explain a redesign | Nothing. If it cannot come out of the facts diff or a declaration, it is not news |

## Related

- Where the tab sits and what else it holds: `docs-ux`
- The mechanism that feeds it when a source changes: `update-pipeline`
- Voice, which governs entries as much as pages: `nha-voice`
- Prose rules underneath: `writing-guide`
