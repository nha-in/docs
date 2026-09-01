---
id: shared.glossary.lmis
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: LMIS, laboratory management information system
summary: >
  NHA's term for laboratory software: provider side like an HMIS,
  acting as a HIP when it publishes reports and as an HIU when it
  reads a patient's history.
sources:
  - file: site/docs/_glossary/_hiecm.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.roles]
  glossary: [shared.glossary.hmis, shared.glossary.hip, shared.glossary.hiu]
---

# LMIS, laboratory management information system

## In plain words

Laboratory Management Information System, NHA's term for laboratory
software. An LMIS is a position, the provider facing side of the
HIE-CM, the same side an [HMIS](hmis.md) sits on.

It acts as a [HIP](hip.md) whenever it publishes a report, which is
most of what a lab does, and as an [HIU](hiu.md) on the rarer occasions
it reads a patient's history to interpret a result. See
[roles](../../hiecm/concepts/roles.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say that LMIS is NHA's name for laboratory software.

## When it goes wrong

Searching for one spelling and concluding the other does not exist. NHA
uses LMIS, and it integrates as a HIP the same way an HMIS does.
