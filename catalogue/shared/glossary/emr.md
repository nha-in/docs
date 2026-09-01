---
id: shared.glossary.emr
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: EMR, electronic medical record system
summary: >
  The clinical system a hospital or clinic uses to record
  consultations, prescriptions and results.
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

# EMR, electronic medical record system

## In plain words

Electronic Medical Record system: the clinical system a hospital or a
clinic uses to record consultations, prescriptions and results. In ABDM
an EMR acts as a [HIP](hip.md) when it publishes, so it links care
contexts in [M2](m2.md), and as an [HIU](hiu.md) when it pulls a
patient's history from elsewhere, which is [M3](m3.md). Most need both.
See [roles](../../hiecm/concepts/roles.md) and [Hospital, lab and
pharmacy systems](/docs/hiecm/v3/concepts/hip-hiu).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which direction an EMR is acting in for a given call, and which milestone that direction needs.

## When it goes wrong

Waiting for a record to be requested before linking it. Nothing an EMR
holds is discoverable until its care context is linked.
