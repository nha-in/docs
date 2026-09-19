---
id: nhcx.decision.key-encryption-algorithm
type: decision
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: RSA-OAEP or RSA-OAEP-256 for the content key
summary: >-
  Seal what you send with the stronger key wrapping value, and open messages sealed
  with either value.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Protected Header rows, all use case sheets.
- url: https://hcxsbx.abdm.gov.in/images/2b7fde4358fd0a4b2086.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Code Snippets references for payload preparation.pdf
  hash: sha256:cea0cfbf5897e9642eaf9a515a941b0a1de39474ea39444c9e05abe21cd9ec73
  fetched: '2026-09-14'
  note: NHCX Code Snippets references for payload preparation, row 13 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Section 3 constants.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__data-security-and-privacy__message-security-and-integrity.md
  hash: sha256:3768fd89932e4081c9e03a8695619bcaf70c641e28bb55a77eec090bb926eeb3
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity, text as shown on the site. Message Encryption and Decryption steps.
- url: https://hcxsbx.abdm.gov.in/images/ec361a6c3e90e766d227.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Steps to generate encryption Certificate.pdf
  hash: sha256:94605e935f05ebb49e24dee50787cb4f3f1c401983a9616a5aaabdbc302f664b
  fetched: '2026-09-14'
  note: Steps to generate encryption Certificate, row 20 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Step 1.
related:
  concepts:
  - nhcx.concept.jwe-envelope
  - nhcx.concept.encryption-certificate
  decisions:
  - nhcx.decision.jwe-serialisation
  flows:
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.generate-and-register-certificate
  endpoints:
  - nhcx.endpoint.fetch-certs
  errors:
  - nhcx.error.payr-1001
  troubleshooting:
  - nhcx.troubleshooting.recipient-cannot-decrypt
  glossary:
  - nhcx.glossary.jwe
  - nhcx.glossary.protected-header
  - nhcx.glossary.x509-certificate
---

# RSA-OAEP or RSA-OAEP-256 for the content key

## In plain words

Every payload you send through [NHCX](../../shared/glossary/nhcx.md) is sealed as a [JWE](../glossary/jwe.md). A random content key encrypts the payload, and that key is wrapped with the recipient's RSA public key. The `alg` value in the [protected header](../glossary/protected-header.md) names how the key is wrapped. Two values are published: `RSA-OAEP`, which uses SHA-1, and `RSA-OAEP-256`, which uses SHA-256.

Send `RSA-OAEP-256`. Accept both values when you decrypt.

## Before you start

- You have a 2048-bit RSA key pair and an [X.509 certificate](../glossary/x509-certificate.md) registered for it. See [generate an encryption certificate and register it](../flows/generate-and-register-certificate.md).
- You can fetch a recipient's certificate with [`POST /fetch/certs`](../endpoints/fetch-certs.md).
- You have read [the JWE envelope that seals every payload](../concepts/jwe-envelope.md).

## What happens

| | `RSA-OAEP-256` | `RSA-OAEP` |
|---|---|---|
| Digest used to wrap the content key | SHA-256 | SHA-1 |
| Content encryption, `enc` | `A256GCM` | `A256GCM` |
| Key pair | Your 2048-bit RSA pair | The same pair |
| Your system | Sends it on every message | Accepts it when decrypting |

The default is `RSA-OAEP-256` on everything you send. It is the mandatory `alg` on every use case request and response. The reference Java code sets `KEY_MANAGEMENT_ALGORITHM = JWEAlgorithm.RSA_OAEP_256` with `EncryptionMethod.A256GCM`. Your outgoing protected header carries `"alg":"RSA-OAEP-256"` and `"enc":"A256GCM"` alongside the x-hcx protocol headers.

Accepting both on receipt costs nothing. A recipient reads `alg` from the protected header of each message and chooses the key management mode from it. A decrypter that allows both values opens either, with the same private key.

## How you know it worked

- Base64url-decode the first segment of a JWE you sent. It shows `alg` `RSA-OAEP-256` and `enc` `A256GCM`.
- Seal a test payload to your own certificate twice, once with each `alg`. Your decrypter opens both.
- The recipient's answer arrives on your callback as a sealed payload, not as a `ProtocolResponse` carrying `PAYR-1001`.

## When it goes wrong

Switching the sending side is a one-line change to the algorithm constant. Switching the receiving side means adding the other value to your decrypter's allowed list. Neither touches your certificate or your registry entry, so both are safe after go-live.

- A recipient answers `PAYR-1001` and you sent `RSA-OAEP`: change to `RSA-OAEP-256` first, then work through [the recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md). See [PAYR-1001](../errors/payr-1001.md).
- Your decrypter rejects an incoming message on `alg`: you allowed only one value. Allow both.
