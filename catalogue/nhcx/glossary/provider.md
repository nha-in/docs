---
id: nhcx.glossary.provider
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Provider
summary: >-
  The hospital, clinic or other facility that treats the patient and is paid for
  it.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. FAQ 6, 7 and 11.
related:
  concepts:
  - nhcx.concept.participant-roles
  flows:
  - nhcx.flow.sandbox-onboarding
  glossary:
  - nhcx.glossary.payer
  - nhcx.glossary.participant-code
  - shared.glossary.hfr
---

# Provider

## In plain words

A provider is the hospital, clinic or other facility that treats the patient and is paid for it. On [NHCX](../../shared/glossary/nhcx.md) it registers with the role `PROVIDER` (`10001`), using its [HFR](../../shared/glossary/hfr.md) ID as the registry ID. One entity can hold several participant codes, one per HFR ID. You are the provider when your system sends eligibility checks, preauthorisations and claims.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which registry ID a provider registers with.

## When it goes wrong

Registering several facilities under one participant code. Each HFR ID gets its own.
