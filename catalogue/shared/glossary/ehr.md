---
id: shared.glossary.ehr
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: EHR, electronic health record
summary: >
  The record that follows the patient across providers, as against an
  EMR, which is one provider's own. In ABDM the EHR is the network.
sources:
  - file: site/docs/_glossary/_hiecm.mdx
    status: not-yet-hashed
    note: >
      The published glossary defines EMR and leaves its near twin
      undefined, which is the pair readers actually confuse.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.roles]
  glossary: [shared.glossary.emr, shared.glossary.phr, shared.glossary.hie-cm]
---

# EHR, electronic health record

## In plain words

Electronic Health Record. The distinction people draw is that an
[EMR](emr.md) is one provider's record of what happened in their own
building, while an EHR is the record that follows the patient across
providers. In practice vendors use the two words for the same product,
so read which one a document means from what it describes rather than
from the letters.

ABDM does not build an EHR as a database. It builds the exchange that
makes one: the records stay with the [HIP](hip.md) that created them,
and the [HIE-CM](hie-cm.md) plus consent is what lets another provider
assemble the picture. The patient's own view of it is a
[PHR](phr.md) app.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say where the records physically
sit in ABDM, which is not in one central store.

## When it goes wrong

Looking for the ABDM endpoint that returns a patient's whole health
record. There is no such call. You ask for consent, and you fetch from
each holder the consent covers.
