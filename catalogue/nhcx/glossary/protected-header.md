---
id: nhcx.glossary.protected-header
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Protected header
summary: >-
  The readable first part of a sealed message, holding the routing information.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Message Structure, Protected Header and Signatures.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__data-security-and-privacy__message-security-and-integrity.md
  hash: sha256:3768fd89932e4081c9e03a8695619bcaf70c641e28bb55a77eec090bb926eeb3
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity, text as shown on the site. Message security, JWE encryption steps.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. FAQ 13.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.protocol-headers
  - nhcx.concept.jwe-envelope
  glossary:
  - nhcx.glossary.jwe
---

# Protected header

## In plain words

The protected header is the first part of a [JWE](../glossary/jwe.md): a JSON object holding `alg`, `enc` and the `x-hcx-` protocol headers, Base64url encoded. [NHCX](../../shared/glossary/nhcx.md) reads it to route and audit the message without opening the payload. It is integrity protected together with the ciphertext, so any change to it makes decryption fail. See [the x-hcx protocol headers](../concepts/protocol-headers.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can list three `x-hcx-` headers every message carries.

## When it goes wrong

Putting the protocol headers in the HTTP headers. They belong inside the protected header.
