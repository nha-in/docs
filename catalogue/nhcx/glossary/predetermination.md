---
id: nhcx.glossary.predetermination
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Predetermination
summary: >-
  A request asking the payer to judge a planned claim in advance against the policy.
sources:
- url: https://hcxsbx.abdm.gov.in/images/af8d243edcc2139a515d.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Usecases.pdf
  hash: sha256:8709b2907a0d5a0dbb36f5e63ed8deae269e0c75372b05d71ce7380c8a0929e7
  fetched: '2026-09-14'
  note: NHCX Usecases, row 1 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, Predetermination Request Submission.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. API list table.
verified:
  status: unverified
related:
  flows:
  - nhcx.flow.predetermination
  endpoints:
  - nhcx.endpoint.predetermination-submit
  decisions:
  - nhcx.decision.preauth-or-predetermination
  glossary:
  - nhcx.glossary.preauthorisation
---

# Predetermination

## In plain words

A predetermination asks the payer to adjudicate a planned claim in advance, against the policy and the beneficiary's past history. Your system sends a Claim bundle through [NHCX](../../shared/glossary/nhcx.md) on `/v1/predetermination/submit`, and the payer answers on `/v1/predetermination/on_submit`. The Claim's `use` marks it as a predetermination rather than a preauthorisation or a claim.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say how a predetermination differs from a preauthorisation.

## When it goes wrong

Sending a predetermination where a preauthorisation is required. See [preauthorisation or predetermination](../decisions/preauth-or-predetermination.md).
