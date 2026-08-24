---
title: What's new
sidebar_label: What's new
sidebar_position: 0
description: Dated changes to this portal, newest first.
verification: unverified
source: repository README.md and catalogue/openapi/CONVENTIONS.md
---

# What's new

Every change to this portal is listed here, newest first. Each entry says what
changed and links to it. There is one entry today, because this is the first
release. The last section on this page says who writes the entries that follow.

## 2026-08-24

### First release of the portal

Three things landed together: the site scaffold, the API specifications, and
the first pass of documentation pages.

**Portal scaffold.** The site is a Docusaurus build in `site/`, rendering from
a single catalogue in `catalogue/`. The catalogue is the source. Pages and
specifications are edited there, and the site is a rendering of them. The
Scalar reference bundle is vendored into the repository at build time, so
nothing on the page loads from a content delivery network.

**Five OpenAPI files.** One per module, plus one for the session token call
that every module needs. Each file is self contained, so no reference reaches
across files. The rule the module files follow is that a callback belongs to
the module that owns it and is written as an OpenAPI 3.1 `webhook`, because an
[ABDM](/docs/overview/glossary#abdm) callback is an HTTPS POST to a URL you
registered.

One operation is written so far: the session token call in
`hiecm-gateway.yaml`. The four module files carry their servers, headers,
security scheme and tags, and their `paths` block is empty on purpose.
Operations go in once NHA's swagger has been fetched and stored, rather than
being reconstructed from a Postman collection into a contract with no response
schemas. Each file has an interactive reference route already, so expect the
four module routes to read as near empty today.

| Specification | Scope | Interactive reference |
|---|---|---|
| `hiecm-gateway.yaml` | Session token, used by all modules | [/reference/hiecm-gateway](/reference/hiecm-gateway) |
| `hiecm-m1.yaml` | M1, [ABHA](/docs/overview/glossary#abha) identity | [/reference/hiecm-m1](/reference/hiecm-m1) |
| `hiecm-m2.yaml` | M2, care context linking and [HIP](/docs/overview/glossary#hip) data sharing | [/reference/hiecm-m2](/reference/hiecm-m2) |
| `hiecm-m3.yaml` | M3, consent and [HIU](/docs/overview/glossary#hiu) data fetch | [/reference/hiecm-m3](/reference/hiecm-m3) |
| `hiecm-m4.yaml` | M4, [HPR](/docs/overview/glossary#hpr) and [HFR](/docs/overview/glossary#hfr) registration | [/reference/hiecm-m4](/reference/hiecm-m4) |

M4 is Phase 2, so nothing is planned for its file in this release.

**First pass of documentation pages.** Written from
[NHA](/docs/overview/glossary#nha)'s sandbox document pack. They cover the
[HIE-CM](/docs/overview/glossary#hie-cm) gateway modules
[M1](/docs/api/hie-cm/m1), [M2](/docs/api/hie-cm/m2) and
[M3](/docs/api/hie-cm/m3) for Phase 1, plus Phase 2 placeholders for
[M4](/docs/api/hie-cm/m4) and for the
[UHI](/docs/overview/glossary#uhi) gateway at [/docs/api/uhi](/docs/api/uhi).
Start at [Overview](/docs/overview) or at [Choose your gateway](/docs/api).

These pages follow NHA's documents. Nothing in them has been run against the
ABDM sandbox from this repository, so every
page carries `verification: unverified`. Where NHA's document pasted a request
or response as a screenshot, the text did not survive conversion, and the page
says so instead of guessing at a payload.

## How this page gets written

The update pipeline fetches NHA's published sources, hashes them, and compares
each hash against the one stored with the catalogue. When a source moves, the
atoms built from it are marked stale and an entry is added here with the date,
the source that changed, and the pages affected. That pipeline has not run yet.
Until it does, this page holds the single entry above.
