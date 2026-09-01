---
id: shared.glossary.hiu
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HIU, Health Information User
summary: >
  The role played by a system that asks to read someone else's health
  records.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 3.docx
    status: not-yet-hashed
    note: NHA milestone pack for M3.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.roles, hiecm.concept.consent-artefact]
  glossary: [shared.glossary.hip, shared.glossary.hrp, shared.glossary.dsc]
  decisions: [shared.decision.role-model-two-axes]
---

# HIU, Health Information User

## In plain words

HIU is something a system does, not something a system is. Any system
acts as an HIU in the moment it asks to read records it did not create:
it requests consent, waits for the patient to grant it, then fetches
against the artefact. It never gets data without one, and the patient
can revoke at any time.

A doctor's console does this, and so does an insurer, a referral system
or an analytics product. So does a hospital system, an HMIS or EMR,
whenever it pulls a patient's history from elsewhere rather than serving
its own records. So does a PHR app fetching records on the patient's
behalf. The same product is a HIP when it publishes instead.

Reading is M3 work.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what HIU is without using the acronym itself.

## When it goes wrong

Building as though consent were permanent. A consent that worked yesterday can be revoked today, so handle the revoked state from the start.

