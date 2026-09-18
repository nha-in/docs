---
id: nhcx.glossary.payment-notice
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Payment notice
summary: >-
  The payer's message that it is paying or has paid a claim.
sources:
- url: https://hcxsbx.abdm.gov.in/images/af8d243edcc2139a515d.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Usecases.pdf
  hash: sha256:8709b2907a0d5a0dbb36f5e63ed8deae269e0c75372b05d71ce7380c8a0929e7
  fetched: '2026-09-14'
  note: NHCX Usecases, row 1 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Payment Notice.
- url: https://hcxsbx.abdm.gov.in/images/b7260763ce8270b6baac.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Payment.pdf
  hash: sha256:6d372cdeec0abaea66b4d267c5ee6137a01830c577360dba7699e0244e49615f
  fetched: '2026-09-14'
  note: Payment, listed on https://hcxsbx.abdm.gov.in/#/documents, not named in the NHCX document sheet. Payment Notice request and response.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Erroneous claim FAQ 4 and 6.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, Payment Notice Recived.
related:
  flows:
  - nhcx.flow.payment-notice
  endpoints:
  - nhcx.endpoint.paymentnotice-request
---

# Payment notice

## In plain words

A payment notice is the payer's message about paying a claim, with bank reference numbers. The payer sends it through [NHCX](../../shared/glossary/nhcx.md) on `/v1/paymentnotice/request`, and your system acknowledges it. Workflow `30` marks payment initiated, `33` marks payment cleared, and your acknowledgement carries `17`.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which workflow id means the money has cleared.

## When it goes wrong

Raising an erroneous claim before workflow `33` arrives. Wait for payment to clear, and acknowledge it first.
