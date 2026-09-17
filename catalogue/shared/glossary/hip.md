---
id: shared.glossary.hip
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HIP, Health Information Provider
summary: >
  The role an entity takes when it publishes a record and hands it over
  when a consented request arrives.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 2.docx
    status: not-yet-hashed
    note: >
      NHA milestone pack for M2, which carries the care context model and
      the error code table.
related:
  concepts: [hiecm.concept.roles]
  glossary: [shared.glossary.hiu, shared.glossary.hrp, shared.glossary.dsc]
  decisions: [shared.decision.role-model-two-axes]
---

# HIP, Health Information Provider

## In plain words

Whoever holds a record and publishes it is the HIP. That is a facility
publishing through its [HMIS](hmis.md), or a citizen pushing a record
from their [PHR](phr.md) app. The HIP links care contexts to a patient's
[ABHA](abha.md) address, answers discovery requests, and hands over
encrypted FHIR bundles when a request backed by consent arrives.

A facility publishes through whatever software it runs, whether that is
called an HMIS, an HIMS, an HMS, an [EMR](emr.md) or an EHR, a
[LIMS](lims.md) in a laboratory or a [PMS](pms.md) in a pharmacy. The
role is per interaction, and the same entity is the [HIU](hiu.md) when
it fetches instead.

Publishing is M2 work.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what HIP is without using the acronym itself.

## When it goes wrong

Reading the role onto the product. One entity takes both roles through
the same software, so the roles are per interaction, not per product and
not per company.

