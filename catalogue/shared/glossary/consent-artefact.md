---
id: shared.glossary.consent-artefact
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: Consent artefact
summary: >
  The record of a patient's permission for one requester to read a
  defined set of their records for a defined period.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 3.docx
    status: not-yet-hashed
    note: NHA milestone pack for M3.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.consent-artefact]
---

# Consent artefact

## In plain words

When a patient grants a consent request, the consent manager creates
consent artefacts and gives their identifiers to the requester. The
artefact names who may read what, for which date range, and until when.

One artefact is created per provider. A request covering three hospitals
grants three artefacts, and the requester fetches each one separately.
Code written for a single artefact breaks the first time a patient has
records in two places.

Fetching data means presenting an artefact identifier. No artefact, no
data.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what Consent artefact is without using the acronym itself.

## When it goes wrong

Artefacts expire and can be revoked. Treat an expired or revoked artefact as a normal state, not as an error in your integration.

