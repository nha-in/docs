---
id: nhcx.glossary.reprocess
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Reprocess
summary: >-
  A request asking the payer to reconsider a claim it rejected or paid only in part.
sources:
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet Scenarios, rows 12 and 14.
- url: https://hcxsbx.abdm.gov.in/images/af8d243edcc2139a515d.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Usecases.pdf
  hash: sha256:8709b2907a0d5a0dbb36f5e63ed8deae269e0c75372b05d71ce7380c8a0929e7
  fetched: '2026-09-14'
  note: NHCX Usecases, row 1 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Reprocess Request.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Erroneous claim FAQs, comparison table, 11 and 15.
related:
  flows:
  - nhcx.flow.claim-reprocess
  endpoints:
  - nhcx.endpoint.task-submit
  concepts:
  - nhcx.concept.reprocess-and-cancel
  glossary:
  - nhcx.glossary.crc
---

# Reprocess

## In plain words

A reprocess asks the payer to reconsider a claim it rejected or paid only in part. Your system sends a `Task` bundle with `Task.code` `reprocess` through [NHCX](../../shared/glossary/nhcx.md) on `/v1/task/submit`, with a supporting document, and the answer arrives on `/v1/task/on_submit`. Under [PMJAY](../glossary/pmjay.md), a reprocess can be raised once per claim and goes to the [CRC](../glossary/crc.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which path carries a reprocess and its answer.

## When it goes wrong

Raising a reprocess without a supporting document. The document is mandatory.
