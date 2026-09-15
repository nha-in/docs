---
id: nhcx.glossary.communication-request
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Communication request
summary: >-
  The payer asking the hospital for more information while a request is under review.
sources:
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use case 10, Raise communication request.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 6, Query flow row; page 32-33, 8.4.4 Query updation.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.queries-and-communication
  endpoints:
  - nhcx.endpoint.communication-request
  - nhcx.endpoint.communication-on-request
---

# Communication request

## In plain words

A communication request is the payer asking the provider for more information, such as additional documents, while a preauthorisation or claim is with the payer. The payer sends it through [NHCX](../../shared/glossary/nhcx.md) on `/v1/communication/request`, and your system replies with the documents on `/v1/communication/on_request`. Under [PMJAY](../glossary/pmjay.md), queries arrive in the preauthorisation or claim response instead, and you answer with the query response workflow id.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which path carries your reply.

## When it goes wrong

Waiting for a communication request on a PMJAY case. PMJAY queries arrive in the response itself.
