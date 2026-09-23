---
id: shared.glossary.lims
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: LIMS, laboratory information management system, also written LMIS
summary: >
  The system a diagnostic laboratory uses to manage samples, tests
  and results.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_glossary/_hiecm.mdx
    status: reference
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
related:
  glossary: [shared.glossary.m2]
---

# LIMS, laboratory information management system, also written LMIS

## In plain words

Laboratory Information Management System, also written LMIS: the system a
diagnostic lab uses to record orders, samples and results. A laboratory
uses it to publish as the [HIP](hip.md), linking each report as a care
context in [M2](m2.md), which is most of what a lab does, and to fetch a
patient's history as the [HIU](hiu.md) on the rarer occasions it needs to.
See [Hospital, lab and pharmacy systems](/docs/hiecm/v3/concepts/hip-hiu).

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
