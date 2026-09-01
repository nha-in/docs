---
id: shared.glossary.lims
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: LIMS, laboratory information management system
summary: >
  The system a diagnostic laboratory uses to manage samples, tests
  and results.
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

# LIMS, laboratory information management system

## In plain words

Laboratory Information Management System: the system a diagnostic lab
uses to record orders, samples and results. In ABDM a LIMS acts as a
[HIP](hip.md) when it publishes, linking each report as a care context
in [M2](m2.md), which is most of what a lab does. It acts as an
[HIU](hiu.md) on the rarer occasions it reads a patient's history.
See [Hospital, lab and pharmacy systems](/docs/hiecm/v3/concepts/hip-
hiu).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what a LIMS links as a care context.

## When it goes wrong

Linking the patient once rather than each report. A LIMS links each
report as its own care context, which is how a specific result is found
later.
