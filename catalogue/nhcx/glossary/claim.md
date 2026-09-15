---
id: nhcx.glossary.claim
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Claim
summary: >-
  A request asking the payer to pay for treatment already given.
sources:
- url: https://hcxsbx.abdm.gov.in/images/af8d243edcc2139a515d.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Usecases.pdf
  hash: sha256:8709b2907a0d5a0dbb36f5e63ed8deae269e0c75372b05d71ce7380c8a0929e7
  fetched: '2026-09-14'
  note: NHCX Usecases, row 1 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Claim Request Submission.
- url: https://hcxsbx.abdm.gov.in/images/064cf2e059987011e53a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Claim.pdf
  hash: sha256:66290de20d57d69e681946a0101518092ca43b3775bb38997c43beb17fb38076
  fetched: '2026-09-14'
  note: Claim, listed on https://hcxsbx.abdm.gov.in/#/documents, not named in the NHCX document sheet. Claim Submit request and response.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 35, Claim functional points to note.
verified:
  status: unverified
related:
  flows:
  - nhcx.flow.claim-submit
  endpoints:
  - nhcx.endpoint.claim-submit
  concepts:
  - nhcx.concept.claim-cycle
---

# Claim

## In plain words

A claim asks the payer to pay for treatment already given. After discharge your system sends a Claim bundle through [NHCX](../../shared/glossary/nhcx.md) on `/v1/claim/submit`. The payer answers with a ClaimResponse on `/v1/claim/on_submit`. Under [PMJAY](../glossary/pmjay.md), discharge details travel inside the claim, and a claim cannot be cancelled.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say how a claim differs from a preauthorisation.

## When it goes wrong

Expecting a decision in the `202`. It means the exchange accepted the request; the decision arrives on `/v1/claim/on_submit`.
