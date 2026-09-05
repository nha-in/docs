---
id: shared.glossary.emr
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: EMR, the clinical system a provider runs, also written EHR
summary: >
  The system a hospital or clinic records consultations, prescriptions
  and results in. It acts as a HIP, linking care contexts in M2.
sources:
  - file: site/docs/_glossary/_hiecm.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.roles]
  glossary:
    [
      shared.glossary.hip,
      shared.glossary.hie-cm,
      shared.glossary.phr,
      shared.glossary.m2,
    ]
---

# EMR, the clinical system a provider runs, also written EHR

## In plain words

Electronic Medical Record and Electronic Health Record: the clinical
system a hospital or a clinic records consultations, prescriptions and
results in. The distinction drawn is that an EMR holds one provider's
record of what happened in their own building, and an EHR follows the
patient across providers. Vendors use the two words for the same product,
so read which one a document means from what it describes rather than
from the letters.

In ABDM it acts as a [HIP](hip.md), linking care contexts in
[M2](m2.md). ABDM does not build an EHR as a database: the records stay
with the HIP that created them, and the [HIE-CM](hie-cm.md) plus consent
is what lets another provider assemble the picture. The patient's own
view of it is a [PHR](phr.md) app.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say where a patient's records
physically sit in ABDM, which is not in one central store.

## When it goes wrong

Looking for the call that returns a patient's whole health record. There
is no such call. You ask for consent, and you fetch from each holder the
consent covers.
