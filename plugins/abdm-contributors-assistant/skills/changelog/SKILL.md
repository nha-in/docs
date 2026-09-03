---
name: changelog
description: What earns an entry in the ABDM Developer Portal's What's New tab, what never does, and the shape of an entry. Covers the six qualifying kinds, the act-on-it test that decides borderline cases, the benchmarks the rule is drawn from, and how the index page and its date groups are kept in step. Use whenever writing a What's New entry, reviewing one, deciding whether a change deserves logging at all, or when someone proposes logging a redesign, a navigation change or a rewording.
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
| Milestones spell CARE, and each one has its own page | Naming and navigation |
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

## Keeping the index in step

`site/docs/whats-new/index.mdx` lists every entry, grouped by date, newest
first. Three things move together and CI does not check any of them:

1. The `### ` heading in the dated file.
2. The bullet and anchor link in the index. The anchor is the heading slugged, so renaming a heading breaks the link.
3. The `label` on the `ReleaseGroup`, which counts the entries in that group.

A renamed heading is the usual break. The build catches it: `onBrokenAnchors`
is enabled, so a stale anchor fails the build rather than shipping a dead link.

Dated files carry `sidebar_position`, newest as 1. Adding a date renumbers every
file below it.

## Common mistakes

| Mistake | Do instead |
|---|---|
| Logging the work you did today because you did it | Apply the act-on-it test first. Most days produce no entry |
| An entry for a page split or a rename | Nothing. The URL is what matters, and a redirect is not news |
| Logging a redesign once per page it touched | One entry per change, or none |
| A correction written as an improvement | Name the wrong fact and what it is now |
| Category headings such as Improvements or Fixes | State the change. The reader scans headings, not labels |
| Writing the entry and not the index bullet | Both, plus the group label, in the same commit |

## Related

- Where the tab sits and what else it holds: `docs-ux`
- The mechanism that feeds it when a source changes: `update-pipeline`
- Voice, which governs entries as much as pages: `nha-voice`
- Prose rules underneath: `writing-guide`
