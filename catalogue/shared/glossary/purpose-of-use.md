---
id: shared.glossary.purpose-of-use
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: Purpose of use, why records are being requested
summary: >
  The stated reason a consent request gives for wanting records.
sources:
  - file: site/docs/_glossary/_hiecm.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  concepts: []
---

# Purpose of use, why records are being requested

## In plain words

The reason an [HIU](hiu.md) gives for asking for records; it travels in
the consent request and the patient sees it. The codes are a subset of
HL7's v3 PurposeOfUse value set: `CAREMGT` (care management), `BTG`
(break the glass), `PUBHLTH` (public health), `HPAYMT` (healthcare
payment), `DSRCH` (disease specific healthcare research) and `PATRQT`
(self requested).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what purpose your system sends and why a patient would accept it.

## When it goes wrong

Choosing a purpose because it is likely to be approved. The patient sees
it, and a purpose that does not match what you do is the reason consents
get denied.
