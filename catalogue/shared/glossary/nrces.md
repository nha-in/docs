---
id: shared.glossary.nrces
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: NRCeS, National Resource Centre for EHR Standards
summary: >
  The body that publishes the Indian FHIR profiles every ABDM health
  record must validate against.
sources:
  - url: https://nrces.in/ndhm/fhir/r4/
    status: docs-only
    note: >
      The NRCeS ABDM Implementation Guide 6.5.0, pinned in the repository at
      catalogue/openapi/.raw/nrces-ndhm.in-6.5.0.tgz.
related:
  concepts: []
---

# NRCeS, National Resource Centre for EHR Standards

## In plain words

NRCeS publishes the FHIR R4 profiles ABDM requires, at
https://nrces.in/ndhm/fhir/r4/index.html. When ABDM says a bundle is
invalid, the NRCeS profile is the specification it was measured against.

There is a validator, and running it before you send is much cheaper than
reading a rejection.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what NRCeS is without using the acronym itself.

## When it goes wrong

Assuming a bundle is fine because your FHIR library accepted it. Validate against the NRCeS profile specifically.

