---
id: nhcx.test.provider-uc-03
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Provider sandbox exit use case 3: Get public key'
summary: >-
  Prove that your hospital system can fetch the public certificate of the organisation
  it is about to send a sealed message to.
sources:
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Table 1.3, Use case 3.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 3.3 Certificate Fetch; Section 2.4.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./fetch/certs.'
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Q3.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8, Integrator's Journey.
related:
  endpoints:
  - nhcx.endpoint.fetch-certs
  concepts:
  - nhcx.concept.encryption-certificate
  - nhcx.concept.jwe-envelope
  flows:
  - nhcx.flow.send-a-sealed-request
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.dummy-payer
  tests:
  - nhcx.test.provider-uc-04
  - nhcx.test.provider-uc-05
  - nhcx.test.payer-uc-05
  troubleshooting:
  - nhcx.troubleshooting.recipient-cannot-decrypt
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.payr-1001
  glossary:
  - nhcx.glossary.jwe
  - nhcx.glossary.x509-certificate
---

# Provider sandbox exit use case 3: Get public key

## In plain words

Every payload you send through [NHCX](../../shared/glossary/nhcx.md) is sealed for one recipient, as a [JWE](../glossary/jwe.md). You seal it with that recipient's public key. This case proves your system can fetch the key from the registry, given the recipient's [participant code](../glossary/participant-code.md).

It is one of the thirteen provider use cases for [sandbox exit](../glossary/sandbox-exit.md).

## Before you start

- Your provider participant exists in the sandbox registry, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 4](provider-uc-04.md).
- You know the recipient's participant code. With no payer partner, use the sandbox dummy payer, `1000003538@hcx`. See [the dummy payer](../sandbox/dummy-payer.md).

## What happens

### Run the call

1. Call [`POST /fetch/certs`](../endpoints/fetch-certs.md). `participantid` is mandatory.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"participantid": "1000003538@hcx"}'
```

2. Load the returned string as a public key. Try it as an [X.509 certificate](../glossary/x509-certificate.md) first. If that fails, parse it as a SubjectPublicKeyInfo (SPKI) key.
3. Cache the key for 24 hours, keyed by participant code.

### Demonstrate it

Sign-off needs people. Book the demos once the steps above pass in your own runs. See [the sandbox exit process](../sandbox/sandbox-exit.md).

```precondition
human: true
who: your team, with the NHA team
action: Demonstrate this use case in the internal demo, then in the Health Tech Committee (HTC) demo.
how: Email hcx.integration@nha.gov.in to request both demos.
```

## How you know it worked

The pass criterion for this case:

> Retrieve the public key of the receiver, that is to be used to encrypt the payload for the receiver. participant id must be mandatorily provided in the request.

What you observe:

- You receive HTTP 200 with a string holding a PEM X.509 certificate or an SPKI public key.
- Your system loads it as an RSA public key without error.
- A request you seal with it is opened by the recipient. [Use case 5](provider-uc-05.md) proves this: no decryption `ProtocolResponse` comes back.

## When it goes wrong

- **The call is refused or the body is empty.** `participantid` is missing or misspelt. Send the exact participant code, including its suffix.
- **The recipient cannot decrypt your message.** You sealed with a stale or wrong key. See [PAYR-1001](../errors/payr-1001.md) and [the recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md). Fetch the key again when the recipient rotates its certificate.
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
