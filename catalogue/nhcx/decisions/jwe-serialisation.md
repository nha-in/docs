---
id: nhcx.decision.jwe-serialisation
type: decision
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Compact or flattened JWE serialisation
summary: >-
  Send the sealed payload as one compact string inside the payload field, and parse
  either written form when you receive one.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 4, Q13.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 2.3 to 2.5.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__data-security-and-privacy__message-security-and-integrity.md
  hash: sha256:3768fd89932e4081c9e03a8695619bcaf70c641e28bb55a77eec090bb926eeb3
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity, text as shown on the site. Message Encryption, final representation.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Response rows, all use case sheets.
- url: https://hcxsbx.abdm.gov.in/images/2b7fde4358fd0a4b2086.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Code Snippets references for payload preparation.pdf
  hash: sha256:cea0cfbf5897e9642eaf9a515a941b0a1de39474ea39444c9e05abe21cd9ec73
  fetched: '2026-09-14'
  note: NHCX Code Snippets references for payload preparation, row 13 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sections 3 and 4.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.jwe-envelope
  decisions:
  - nhcx.decision.key-encryption-algorithm
  flows:
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.receive-a-sealed-callback
  errors:
  - nhcx.error.payr-1001
  troubleshooting:
  - nhcx.troubleshooting.recipient-cannot-decrypt
  glossary:
  - nhcx.glossary.jwe
  - nhcx.glossary.protected-header
---

# Compact or flattened JWE serialisation

## In plain words

A [JWE](../glossary/jwe.md) can be written two ways. Compact serialisation is one string of five Base64url parts joined by dots. Flattened JSON serialisation is an object with one member per part.

Send compact, inside the `payload` field of the request body. Parse either form when you receive.

## Before you start

- You seal payloads with `alg` `RSA-OAEP-256` and `enc` `A256GCM`. See [RSA-OAEP or RSA-OAEP-256 for the content key](../decisions/key-encryption-algorithm.md).
- You have read [the JWE envelope that seals every payload](../concepts/jwe-envelope.md).

## What happens

| | Compact | Flattened JSON |
|---|---|---|
| Shape | `<protected>.<encrypted_key>.<iv>.<ciphertext>.<tag>`, one string | An object with `protected`, `encrypted_key`, `aad`, `iv`, `ciphertext` and `tag` |
| Where it travels | Inside the `payload` field of the body | As the body itself |
| Nimbus JOSE | `jweObject.serialize()` returns it | Built from the parts |
| Your system | Sends it on every request and callback | Parses it if one arrives |

The default is compact. Every outgoing request to NHCX uses JWE Compact Serialization. The request body is exactly:

```json
{"payload": "<JWE_COMPACT_STRING>"}
```

Sealed answers arrive with a `type` member beside `payload`, for example `{"type": "JWEPayload", "payload": "<JWE_COMPACT_STRING>"}`. A recipient that cannot process your message answers with `"type": "ProtocolResponse"` and clear-text headers instead. Read `type` first. `ProtocolResponse` is clear text; any other value means `payload` holds a sealed string.

The five compact parts carry the same five values as the flattened members `protected`, `encrypted_key`, `iv`, `ciphertext` and `tag`. Split the compact string on its dots and pass the parts to one decrypt routine. The published decrypt sample takes exactly those five named parts, so it serves both forms.

## How you know it worked

- The body you send is one JSON object with one key, `payload`, whose value contains exactly four dots.
- Your receiver opens a sealed callback by splitting that string into five parts.
- Your receiver handles a `ProtocolResponse` without trying to decrypt it.

## When it goes wrong

Switching from flattened to compact changes one call: use your library's compact serializer and wrap the result in `payload`. Keys, headers and certificates stay the same, so you can switch after go-live.

- Your callback handler tries to decrypt every body: a `ProtocolResponse` breaks it and you lose the error it carries. Branch on `type` first. See [receive, open and acknowledge a sealed message](../flows/receive-a-sealed-callback.md).
- The recipient answers `PAYR-1001`: check the serialisation along with the other causes in [the recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md). See [PAYR-1001](../errors/payr-1001.md).
