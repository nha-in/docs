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
---

# HIP, Health Information Provider

## In plain words

A hospital system, a lab system or a pharmacy system acts as a HIP when
it creates records and makes them findable. The HIP links care contexts
to a patient's ABHA address, answers discovery requests, and hands over
encrypted FHIR bundles when a request backed by consent arrives.

This is the M2 role.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what HIP is without using the acronym itself.

## When it goes wrong

A single product is often both a HIP and an HIU. The roles are per interaction, not per company.

