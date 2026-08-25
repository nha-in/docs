---
title: What's new
sidebar_label: What's new
sidebar_position: 0
description: Dated changes to these pages, newest first.
verification: unverified
source: repository README.md and catalogue/openapi/CONVENTIONS.md
---

# What's new

Dated changes to these pages, newest first. Each entry links to what you can now
read or do.

## 2026-08-25

### M2 and M3 have real API references

NHA supplied an OpenAPI file for each of M1, M2 and M3, plus Postman
collections for all three. They are ingested, and the reference pages are
built from them rather than from prose.

The catalogue went from 35 documented operations to 69, and from 10 declared
callbacks to 12, five of which now carry a real payload.

- [M1 API reference](/reference/hiecm-m1), 44 operations, up from 32
- [M2 API reference](/reference/hiecm-m2), 10 operations, up from none
- [M3 API reference](/reference/hiecm-m3), 6 operations and 6 callbacks, up from none
- [Gateway reference](/reference/hiecm-gateway), 7 operations. NHA repeats
  this group in all three files, so it is described once

### What the new sources do not give you

NHA's three specifications describe **no callbacks at all**. What they model
as paths is the outbound half, the calls you make, including the `on-init`
and `on-notify` responses you send. What the gateway posts to your registered
URL is absent from every one of them.

For M3 that gap is filled from NHA's collection, which does carry the
payloads. For M2 only the data notification is available, so the remaining
M2 callbacks name a path and stop.

### Corrections against NHA's files

Five, all recorded in `catalogue/openapi/corrections/` rather than applied
silently: 52 em dashes rewritten, 8 references to components NHA never
defined, 26 UUID format assertions NHA's own examples contradict, 2 `hiType`
examples that disagreed with NHA's schema, and 1 example dropped for
violating the schema it illustrates.

Nothing in this release has been run against the ABDM sandbox. Every page and
every atom says `unverified`.

## 2026-08-24

### Read the HIE-CM modules

Three modules on the [HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm) gateway:

- [M1](/docs/hiecm/v3/api/m1), [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) identity
- [M2](/docs/hiecm/v3/api/m2), care context linking and
  [HIP](/docs/hiecm/v3/getting-started/glossary#hip) data sharing
- [M3](/docs/hiecm/v3/api/m3), consent and [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) data
  fetch

Start at [Overview](/docs/hiecm/v3).

These pages follow [NHA](/docs/hiecm/v3/getting-started/glossary#nha)'s sandbox document pack.
Nothing in them has been run against the ABDM sandbox, so every page carries
`verification: unverified`. Where NHA's document pasted a request or response as
a screenshot, the text did not survive conversion, and the page says so instead
of guessing at a payload.

### Try the session token call

The session token call is the first call every module needs, and the one
operation with a working interactive reference. Send a request from
[/reference/hiecm-gateway](/reference/hiecm-gateway). The four module references
exist but carry no operations yet.

A callback appears on the module that owns it, as an OpenAPI 3.1 `webhook`,
because an [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) callback is an HTTPS POST to a URL
you registered.

| Interactive reference | Scope |
|---|---|
| [/reference/hiecm-gateway](/reference/hiecm-gateway) | Session token, used by all modules |
| [/reference/hiecm-m1](/reference/hiecm-m1) | M1, ABHA identity |
| [/reference/hiecm-m2](/reference/hiecm-m2) | M2, care context linking and HIP data sharing |
| [/reference/hiecm-m3](/reference/hiecm-m3) | M3, consent and HIU data fetch |
| [/reference/hiecm-m4](/reference/hiecm-m4) | M4, [HPR](/docs/hiecm/v3/getting-started/glossary#hpr) and [HFR](/docs/hiecm/v3/getting-started/glossary#hfr) registration |

### Find your way around M4, UHI and NHCX

No endpoint is documented yet for [M4](/docs/hiecm/v3/api/m4), for the
[UHI](/docs/hiecm/v3/getting-started/glossary#uhi) gateway at [/docs/uhi/v1](/docs/uhi/v1), or for
[NHCX](/docs/nhcx/v1). Those pages tell you what NHA publishes and where to read
it.

## How this page gets written

When NHA republishes a source a page here was written from, an entry is added
with the date, the source that changed, and the pages affected.

## 2026-08-24, the M1 agent skill

The M1 documentation is now published as an agent skill: one file carrying
every endpoint, the required headers, the two token rule and the encryption
rule. Download it, or install it with one command, from
[M1 APIs](/docs/hiecm/v3/api/m1/apis). It is generated from these pages on
every build, so a page that changes changes the skill.
