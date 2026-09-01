---
id: shared.glossary.hip
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HIP, Health Information Provider
summary: >
  The role played by a system that holds health records and shares
  them when a consented request arrives.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 2.docx
    status: not-yet-hashed
    note: >
      NHA milestone pack for M2, which carries the care context model and
      the error code table.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.roles]
  glossary: [shared.glossary.hiu, shared.glossary.hrp, shared.glossary.dsc]
  decisions: [shared.decision.role-model-two-axes]
---

# HIP, Health Information Provider

## In plain words

HIP is something a system does, not something a system is. Any system
acts as a HIP in the moment it publishes a record: it links care
contexts to a patient's ABHA address, answers discovery requests, and
hands over encrypted FHIR bundles when a request backed by consent
arrives.

A hospital system does this, whether it is called an HMIS, an HIMS, an
HMS, an EMR or an EHR. So does a lab system, an LIMS or LMIS, and a
pharmacy system. So does a PHR app, at the moment a patient uploads a
record into it. The role is per interaction, and the same product is an
HIU when it reads instead.

Publishing is M2 work.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what HIP is without using the acronym itself.

## When it goes wrong

A single product is often both a HIP and an HIU. The roles are per interaction, not per company.

