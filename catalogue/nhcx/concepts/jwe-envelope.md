---
id: nhcx.concept.jwe-envelope
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The JWE envelope that seals every payload
summary: >-
  Every use case message is a sealed encryption envelope: routing headers the exchange
  can read, wrapped around a claim bundle only the recipient can open.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__data-security-and-privacy__message-security-and-integrity.md
  hash: sha256:3768fd89932e4081c9e03a8695619bcaf70c641e28bb55a77eec090bb926eeb3
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity, text as shown on the site. Message Security and Integrity, encryption steps.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/healthclaims-exchange-protocol
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__healthclaims-exchange-protocol.md
  hash: sha256:ff4b3aa02f2aa61e2b29e50699fe16bee82c3684908bc2be0815c07b97a83371
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/healthclaims-exchange-protocol, text as shown on the site. Message Structure, Registered JOSE and Signatures.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 4, Q13.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 1.3 Key Principles; Section 2.3 HTTP Request Format.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use case 7 API logic.
verified:
  status: unverified
related:
  decisions:
  - nhcx.decision.key-encryption-algorithm
  - nhcx.decision.jwe-serialisation
  concepts:
  - nhcx.concept.protocol-headers
  - nhcx.concept.encryption-certificate
  - nhcx.concept.fhir-in-nhcx
  - nhcx.concept.error-code-spaces
  flows:
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.receive-a-sealed-callback
  errors:
  - nhcx.error.payr-1001
  - nhcx.error.payr-1517
  glossary:
  - nhcx.glossary.jwe
  - nhcx.glossary.protected-header
  - shared.glossary.fhir
  troubleshooting:
  - nhcx.troubleshooting.recipient-cannot-decrypt
---

# The JWE envelope that seals every payload

## In plain words

Every use case message on NHCX is a [JSON Web Encryption (JWE)](../glossary/jwe.md) envelope. Think of a sealed envelope with the address printed on the outside.

The outside is the [protected header](../glossary/protected-header.md). It carries who sent the message, who must receive it and where it sits in the claim. NHCX reads it to route. The inside is the [FHIR](../../shared/glossary/fhir.md) bundle, encrypted so that only the recipient can read it.

## Before you start

You need the recipient's public certificate and your own private key. See [encryption certificates](./encryption-certificate.md).

## What happens

### The five parts

A sealed message is five Base64URL parts joined by dots.

```mermaid
graph LR
  H["1. Protected header<br/>alg, enc, x-hcx-*"] --- K["2. Encrypted key<br/>content key, sealed with<br/>recipient's RSA key"]
  K --- I["3. Initialisation vector"]
  I --- C["4. Ciphertext<br/>the FHIR bundle"]
  C --- T["5. Authentication tag"]
```

1. **Protected header.** The JOSE fields `alg` and `enc`, plus the [protocol headers](./protocol-headers.md) and any domain headers.
2. **Encrypted key.** A random content key, wrapped with the recipient's RSA public key using RSA-OAEP. Which RSA-OAEP variant to set in `alg` is covered in [the key encryption algorithm](../decisions/key-encryption-algorithm.md).
3. **Initialisation vector.** Random, fresh for every message.
4. **Ciphertext.** The FHIR bundle, encrypted with AES-256-GCM, so `enc` is `A256GCM`.
5. **Authentication tag.** Proves nothing changed.

### Why there is no separate signature

AES-GCM authenticates the protected header as well as the ciphertext. If anyone changes a header or a byte of the payload, the tag no longer matches and the recipient must reject the message. So the envelope needs no second signature.

The protocol allows no unprotected headers and no multiple recipients. One envelope, one recipient.

### What goes on the wire

The request body carries the sealed string in a `payload` field:

```json
{ "payload": "<JWE_COMPACT_STRING>" }
```

How the five parts are serialised is covered in [JWE serialisation](../decisions/jwe-serialisation.md).

### What comes back

A response from a payer takes one of two forms, named by its `type`:

| `type` | When | Readable by NHCX |
|---|---|---|
| `JWEPayloadResponse` | The payer processed the request | No, sealed for you |
| `ProtocolResponse` | The payer could not open or validate the request | Yes, headers and error in the clear |

## How you know it worked

You have understood this when you can answer both of these.

1. A proxy between your system and NHCX rewrites `x-hcx-timestamp` inside the protected header. What happens when the payer tries to open the message, and why?
2. A payer cannot decrypt your request. In which of the two response forms does it tell you, and why can that form not be sealed?

## When it goes wrong

**The recipient cannot decrypt.** It reports [PAYR-1001](../errors/payr-1001.md). The usual cause is a stale or wrong certificate. Fetch it again.

**Error sent sealed.** An error reply must be a `ProtocolResponse` in the clear. A sealed reply where an error structure is expected is refused with [PAYR-1517](../errors/payr-1517.md).

**Header edited after sealing.** Any change to the protected header after encryption breaks the tag. Build the full header first, then seal.

**Plaintext bundle in the body.** Every use case request must be sealed. No FHIR content travels in the clear.
