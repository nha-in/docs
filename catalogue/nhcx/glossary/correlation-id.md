---
id: nhcx.glossary.correlation-id
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Correlation id
summary: >-
  The identifier that ties every message of one request and its answers together.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Message Structure, x-hcx-correlation_id row.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 3, FAQ 4.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, item 8.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Preauth, x-hcx-correlation_id row.
related:
  concepts:
  - nhcx.concept.message-identifiers
  glossary:
  - nhcx.glossary.api-call-id
  troubleshooting:
  - nhcx.troubleshooting.duplicate-or-mismatched-correlation
  errors:
  - nhcx.error.nhcx-1006
---

# Correlation id

## In plain words

The correlation id, sent in `x-hcx-correlation_id`, is a random 36-character identifier that ties every message of one request cycle on [NHCX](../../shared/glossary/nhcx.md) together. The request that opens the cycle sets it, equal to that request's api call id. Every answer and callback in the cycle carries it unchanged. After an error it becomes inactive, and a fresh request needs a new one.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what value a payer puts in the correlation id of its answer.

## When it goes wrong

Retrying a failed request with its old correlation id. It is refused as a duplicate, [NHCX-1006](../errors/nhcx-1006.md). See [responses arrive against the wrong request](../troubleshooting/duplicate-or-mismatched-correlation.md).
