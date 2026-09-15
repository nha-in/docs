---
id: nhcx.glossary.x509-certificate
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: X.509 certificate
summary: >-
  The standard file that carries your public encryption key.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ec361a6c3e90e766d227.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Steps to generate encryption Certificate.pdf
  hash: sha256:94605e935f05ebb49e24dee50787cb4f3f1c401983a9616a5aaabdbc302f664b
  fetched: '2026-09-14'
  note: Steps to generate encryption Certificate, row 20 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-3, Steps 1 to 4.
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use case 3, Get public Key.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.encryption-certificate
  flows:
  - nhcx.flow.generate-and-register-certificate
  - nhcx.flow.rotate-certificate
  endpoints:
  - nhcx.endpoint.fetch-certs
---

# X.509 certificate

## In plain words

An X.509 certificate is the standard file that carries a public key and the identity it belongs to. On [NHCX](../../shared/glossary/nhcx.md) your encryption certificate is an X.509 certificate over a 2048-bit RSA key, registered Base64 encoded. Senders fetch it with `/fetch/certs` and seal payloads to you with the key inside. See [your encryption certificate and the recipient's](../concepts/encryption-certificate.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which key a sender uses to seal a message to you.

## When it goes wrong

Letting the registered certificate expire. One made with the published OpenSSL steps is valid for 365 days. See [rotate your encryption certificate](../flows/rotate-certificate.md).
