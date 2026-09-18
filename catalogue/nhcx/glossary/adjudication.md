---
id: nhcx.glossary.adjudication
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Adjudication
summary: >-
  The payer's decision on whether a request is payable and how much.
sources:
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 9-10, section 3 PMJAY Overview and 4.1 Claims Adjudication Process.
- url: https://hcxsbx.abdm.gov.in/images/af8d243edcc2139a515d.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Usecases.pdf
  hash: sha256:8709b2907a0d5a0dbb36f5e63ed8deae269e0c75372b05d71ce7380c8a0929e7
  fetched: '2026-09-14'
  note: NHCX Usecases, row 1 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, HCX Key Use cases table.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Acceptance scenario.
related:
  glossary:
  - nhcx.glossary.payer
  - nhcx.glossary.tms
  decisions:
  - nhcx.decision.payer-implementation
---

# Adjudication

## In plain words

Adjudication is the payer's decision on a request: whether it is admissible under the policy and, if so, how much is payable. The payer adjudicates your preauthorisation or claim and returns the result in a ClaimResponse on the `on_submit` callback. [NHCX](../../shared/glossary/nhcx.md) carries the request and the result; the decision is the payer's. Under [PMJAY](../glossary/pmjay.md), named roles in [TMS](../glossary/tms.md) adjudicate.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say where an adjudication result reaches your system.

## When it goes wrong

Waiting on the `202` for a decision. It only means the exchange accepted the request.
