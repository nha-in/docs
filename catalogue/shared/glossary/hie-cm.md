---
id: shared.glossary.hie-cm
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HIE-CM, Health Information Exchange and Consent Manager
summary: >
  The ABDM gateway that routes health information requests and holds
  the consent that authorises them.
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

# HIE-CM, Health Information Exchange and Consent Manager

## In plain words

HIE-CM is the exchange in the middle. Providers register care contexts
with it, requesters ask it for consent, and it routes the resulting data
requests between them.

It is deliberately data blind. It handles identifiers and metadata about
records, never the clinical content itself.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what HIE-CM is without using the acronym itself.

## When it goes wrong

Assuming HIE-CM stores records. It does not. If you need the record you fetch it from the provider that holds it, under a consent artefact.

