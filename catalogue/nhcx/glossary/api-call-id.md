---
id: nhcx.glossary.api-call-id
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: API call id
summary: >-
  The identifier your system generates afresh for every single call.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 3, FAQ 4.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Message Structure, NHCX Protocol Headers table.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Status, x-hcx-correlation_id row.
related:
  concepts:
  - nhcx.concept.message-identifiers
  glossary:
  - nhcx.glossary.correlation-id
---

# API call id

## In plain words

The api call id, sent in `x-hcx-api_call_id`, is a random 36-character identifier that your system generates for every single call to [NHCX](../../shared/glossary/nhcx.md). It is new on every attempt, including retries. On an answer it differs from the correlation id. A status check uses the api call id of the request being checked.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which of the api call id and the correlation id changes on a retry.

## When it goes wrong

Copying an api call id from an example instead of generating a fresh one for every call.
