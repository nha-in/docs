---
id: nhcx.glossary.crc
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: CRC
summary: >-
  The committee that decides appeals against rejected claims in the government health
  scheme.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Erroneous claim FAQ 15.
- file: catalogue/openapi/.raw/nhcx-site-2026-09-14/not-on-site/External_NHCX_Payer_Service_API_Workflow_Guide.docx
  hash: sha256:1028d480d2fabe3204301f1c1b192a0077ddfa64f7f9084b01f73e004253fdd7
  fetched: '2026-09-05'
  note: NHCX Payer Service API Workflow Guide for External Integrators, not listed on hcxsbx.abdm.gov.in and not named in the NHCX document sheet, received separately. CLAIM Step 6 and role table.
verified:
  status: unverified
related:
  glossary:
  - nhcx.glossary.reprocess
  - nhcx.glossary.pmjay
  endpoints:
  - nhcx.endpoint.payer-service-process-case
---

# CRC

## In plain words

CRC stands for Claim Review Committee, the body that decides [PMJAY](../glossary/pmjay.md) reprocess appeals. Its decision is final: no erroneous claim can be raised against it. In the PMJAY payer service it is the last role in the claim chain, acting with `Approve`, `Reject` or `Pending`.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what can follow a CRC decision.

## When it goes wrong

Raising an erroneous claim for the balance after a CRC partial approval. It is not accepted.
