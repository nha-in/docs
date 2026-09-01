---
id: shared.glossary.hrp
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HRP, health repository provider
summary: >
  A system that stores health records on behalf of facilities that
  do not store their own.
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

# HRP, health repository provider

## In plain words

Health Repository Provider. NHA's M2 document uses HRP for the system
that actually holds the records, and writes it as "HRP/HIP" because the
same system usually plays both parts. If you run an [HMIS](hmis.md) or
an [LMIS](lmis.md) and you are integrating M2, HRP means you.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say why a facility might hold no records itself and still answer discovery.

## When it goes wrong

Assuming the facility named on a record is the system that holds it. A
repository provider can hold records for many facilities.
