---
id: shared.glossary.hmis
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HMIS, hospital management information system
summary: >
  NHA's term for the software a hospital runs day to day, which
  normally integrates as a HIP.
sources:
  - file: site/docs/_glossary/_hiecm.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  concepts: []
---

# HMIS, hospital management information system

## In plain words

Hospital Management Information System, NHA's term for the software a
hospital runs day to day. NHA's M2 document states that implementing
every [HI type](hi-type.md) is mandatory for an HMIS.

An HMIS is a position: it is the provider facing side of the HIE-CM, as
against a [PHR app](phr.md) on the citizen side. It acts as a
[HIP](hip.md) when it publishes a record and as an [HIU](hiu.md) when it
fetches one, so most of them need M2 and M3 rather than one or the
other. See [roles](../../hiecm/concepts/roles.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which ABDM role an HMIS plays and how many HI types it has to support.

## When it goes wrong

Implementing only the HI types you already produce. NHA's M2 document
makes every HI type mandatory for an HMIS.
