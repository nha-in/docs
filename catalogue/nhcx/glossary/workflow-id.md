---
id: nhcx.glossary.workflow-id
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Workflow id
summary: >-
  The code that names which business stage a message belongs to.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Message Structure, x-hcx-workflow_id row.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 2.1 JWE Protected Header table.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.workflow-codes
  - nhcx.concept.protocol-headers
---

# Workflow id

## In plain words

The workflow id, sent in `x-hcx-workflow_id`, names the business stage a message belongs to. For example, `12` is a new preauthorisation and `15` is a claim. Some ids cover several stages, told apart by `x-hcx-status`. Send it on every message to [NHCX](../../shared/glossary/nhcx.md): [PMJAY](../glossary/pmjay.md) requires it. See [workflow codes and the stage each one names](../concepts/workflow-codes.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what tells apart two messages that share a workflow id.

## When it goes wrong

Leaving it out because the header is optional for some payers. PMJAY submissions need it on every message.
