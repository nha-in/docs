---
id: nhcx.glossary.preauthorisation
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Preauthorisation
summary: >-
  A request asking the payer to approve planned treatment before it happens.
sources:
- url: https://hcxsbx.abdm.gov.in/images/3799f26f2a0b2c9a80c5.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Preauthorization.pdf
  hash: sha256:75d5628e7dd8a8e1a55c4ab3836c0591088ba378a8cd498e8277d83911129439
  fetched: '2026-09-14'
  note: Preauthorization, listed on https://hcxsbx.abdm.gov.in/#/documents, not named in the NHCX document sheet. Preauthorization Submission request and response.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. pages 31-33, 8.4.2 to 8.4.4.
verified:
  status: unverified
related:
  flows:
  - nhcx.flow.preauth-submit
  endpoints:
  - nhcx.endpoint.preauth-submit
  decisions:
  - nhcx.decision.preauth-or-predetermination
  glossary:
  - nhcx.glossary.enhancement
  - nhcx.glossary.predetermination
---

# Preauthorisation

## In plain words

A preauthorisation asks the payer to approve planned treatment before it happens. Your system sends a Claim bundle through [NHCX](../../shared/glossary/nhcx.md) on `/v1/preauth/submit`. The payer answers with a ClaimResponse on `/v1/preauth/on_submit`: approved, rejected or queried. Enhancements and resubmissions travel on the same path.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can name the path a preauthorisation's answer arrives on.

## When it goes wrong

Resubmitting to answer a query. A query gets a query response, not a resubmission.
