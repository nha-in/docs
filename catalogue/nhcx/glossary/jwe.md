---
id: nhcx.glossary.jwe
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: JWE, JSON Web Encryption
summary: >-
  The encryption standard that seals every exchange payload so only the recipient
  can read it.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Message Structure, Protected Header and Signatures.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. FAQ 13.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Request rows of each use case sheet.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.jwe-envelope
  decisions:
  - nhcx.decision.jwe-serialisation
  - nhcx.decision.key-encryption-algorithm
  glossary:
  - nhcx.glossary.protected-header
---

# JWE, JSON Web Encryption

## In plain words

JWE stands for JSON Web Encryption, the standard (RFC 7516) that seals every [NHCX](../../shared/glossary/nhcx.md) payload so only the recipient can read it. The [protected header](../glossary/protected-header.md) stays readable, so NHCX can route the message, and is integrity protected with the ciphertext. Every use case request carries one JWE in compact form inside the `payload` field. See [the JWE envelope that seals every payload](../concepts/jwe-envelope.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which part of a JWE the exchange reads and which part it cannot.

## When it goes wrong

Sending the flattened JSON form. Send the compact string in `payload`. See [compact or flattened JWE serialisation](../decisions/jwe-serialisation.md).
