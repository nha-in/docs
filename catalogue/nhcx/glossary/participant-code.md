---
id: nhcx.glossary.participant-code
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Participant code
summary: >-
  The address the exchange gives your organisation when you register.
sources:
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Participant creation response.
- url: https://hcxsbx.abdm.gov.in/images/bc2efb078b98548f8e6b.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Sandbox.pdf
  hash: sha256:cbd03baf428655f0305e2f60ca331f8b76700496b070c522cafcc95001710b3a
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Sandbox, row 4 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Participant APIs, response structure.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Message Structure, NHCX Protocol Headers table.
related:
  concepts:
  - nhcx.concept.participant-code
  - nhcx.concept.participant-registry
---

# Participant code

## In plain words

A participant code is the address [NHCX](../../shared/glossary/nhcx.md) assigns to your organisation when you register. It carries a suffix after the `@` naming the instance, as in `100001@sbx` or `1000003538@hcx`. Every message names its sender and recipient by participant code, in `x-hcx-sender_code` and `x-hcx-recipient_code`. See [participant codes and how every message is addressed](../concepts/participant-code.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can name the two protocol headers that carry participant codes.

## When it goes wrong

Typing a code from an example instead of using the one returned when you registered.
