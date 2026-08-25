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

## 2026-08-24

### Read the HIE-CM modules

Three modules on the [HIE-CM](/docs/abdm/v3/glossary#hie-cm) gateway:

- [M1](/docs/abdm/v3/api/m1), [ABHA](/docs/abdm/v3/glossary#abha) identity
- [M2](/docs/abdm/v3/api/m2), care context linking and
  [HIP](/docs/abdm/v3/glossary#hip) data sharing
- [M3](/docs/abdm/v3/api/m3), consent and [HIU](/docs/abdm/v3/glossary#hiu) data
  fetch

Start at [Overview](/docs/abdm/v3).

These pages follow [NHA](/docs/abdm/v3/glossary#nha)'s sandbox document pack.
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
because an [ABDM](/docs/abdm/v3/glossary#abdm) callback is an HTTPS POST to a URL
you registered.

| Interactive reference | Scope |
|---|---|
| [/reference/hiecm-gateway](/reference/hiecm-gateway) | Session token, used by all modules |
| [/reference/hiecm-m1](/reference/hiecm-m1) | M1, ABHA identity |
| [/reference/hiecm-m2](/reference/hiecm-m2) | M2, care context linking and HIP data sharing |
| [/reference/hiecm-m3](/reference/hiecm-m3) | M3, consent and HIU data fetch |
| [/reference/hiecm-m4](/reference/hiecm-m4) | M4, [HPR](/docs/abdm/v3/glossary#hpr) and [HFR](/docs/abdm/v3/glossary#hfr) registration |

### Find your way around M4, UHI and NHCX

No endpoint is documented yet for [M4](/docs/abdm/v3/api/m4), for the
[UHI](/docs/abdm/v3/glossary#uhi) gateway at [/docs/uhi/v1](/docs/uhi/v1), or for
[NHCX](/docs/nhcx/v1). Those pages tell you what NHA publishes and where to read
it.

## How this page gets written

When NHA republishes a source a page here was written from, an entry is added
with the date, the source that changed, and the pages affected.

## 2026-08-24, the M1 agent skill

The M1 documentation is now published as an agent skill: one file carrying
every endpoint, the required headers, the two token rule and the encryption
rule. Download it, or install it with one command, from
[M1 APIs](/docs/abdm/v3/api/m1/apis). It is generated from these pages on
every build, so a page that changes changes the skill.
