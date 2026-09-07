---
id: shared.glossary.hiu
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HIU, Health Information User
summary: >
  The role taken by whoever asks to read health records they did not
  create.
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

Whoever asks to read records they did not create is the HIU. Asking means
requesting consent, waiting for the patient to grant it, then fetching
against the artefact. There is no data without one, and the patient can
revoke at any time.

A facility asks through a doctor's console, an [HMIS](hmis.md) or an
[EMR](emr.md), whenever it pulls a patient's history from elsewhere
rather than serving its own records. A citizen asks when their
[PHR](phr.md) app or health locker fetches records on their behalf. An
insurer, a referral service or an analytics service asks while holding
neither an [ABHA](abha.md) address nor a facility ID. An entity
publishing a record is the [HIP](hip.md) in that moment instead.

Reading is M3 work.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what HIU is without using the acronym itself.

## When it goes wrong

Building as though consent were permanent. A consent that worked yesterday can be revoked today, so handle the revoked state from the start.

