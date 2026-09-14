---
id: nhcx.glossary.irdai
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: IRDAI
summary: >-
  The regulator of insurance in India, which helps set who may join the claims exchange.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Registries section.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, item 5.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. Functional Testing, HTC demo.
verified:
  status: unverified
related:
  glossary:
  - nhcx.glossary.payer
  - nhcx.glossary.tpa
  - shared.glossary.nha
---

# IRDAI

## In plain words

IRDAI is the Insurance Regulatory and Development Authority of India. With [NHA](../../shared/glossary/nha.md), it sets the procedure for enrolling participants on [NHCX](../../shared/glossary/nhcx.md). A payer or [TPA](../glossary/tpa.md) registers with its IRDAI registry ID, without leading zeros: `0123` is sent as `123`. IRDAI also takes part in the demo that ends functional testing.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which registry ID a payer registers with.

## When it goes wrong

Sending the IRDAI registry ID with its leading zeros.
