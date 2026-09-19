---
id: nhcx.glossary.enhancement
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Enhancement
summary: >-
  A request to extend an approved preauthorisation or add procedures to it.
sources:
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 32, 8.4.3 Enhancement.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, Enhancement Request Initiated.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet Scenarios, row 7.
related:
  flows:
  - nhcx.flow.preauth-enhancement
  concepts:
  - nhcx.concept.workflow-codes
  glossary:
  - nhcx.glossary.preauthorisation
---

# Enhancement

## In plain words

An enhancement asks the payer to extend an already approved preauthorisation or add procedures to it. It travels through [NHCX](../../shared/glossary/nhcx.md) on `/v1/preauth/submit` with workflow id `13`, carrying the approved treatments and the new ones. You can raise several until discharge, within the limit, but only after the previous request has closed.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what must be true before you send an enhancement.

## When it goes wrong

Sending an enhancement while the previous preauthorisation or resubmission is still open. Wait for it to close.
