---
id: shared.glossary.hmis
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HMIS, HIS or HIMS, the software a hospital runs
summary: >
  The day to day software of a hospital, under any of its three names. A
  hospital uses it both to publish its own records and to fetch a
  patient's history from elsewhere.
sources:
  - url: https://github.com/eka-care/abdm-docs/blob/main/site/docs/_glossary/_hiecm.mdx
    status: reference
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  glossary: [shared.glossary.hi-type, shared.glossary.ims, shared.glossary.m4]
---

# HMIS, HIS or HIMS, the software a hospital runs

## In plain words

The software a hospital runs day to day: registration, visits, orders,
results and billing. It goes by three names. HMIS is Hospital Management
Information System, HIS is Hospital Information System, and HIMS is
Hospital Information Management System. One system, three names, one
integration.

A facility uses it to publish records as the [HIP](hip.md) and to fetch
them as the [HIU](hiu.md), so the ABDM work is M2 and M3 rather than one
or the other. It must implement every [HI type](hi-type.md).

`HIS-` is also the prefix on every error code the [HPR](hpr.md) and the
[HFR](hfr.md) return. Those are [M4](m4.md) registry errors and have
nothing to do with hospital software.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which ABDM role a hospital plays
when it publishes a record, and which when it reads one.

## When it goes wrong

Implementing only the HI types you already produce. Every HI type is
mandatory for a hospital system.
