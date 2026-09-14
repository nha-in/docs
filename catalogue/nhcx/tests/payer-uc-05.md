---
id: nhcx.test.payer-uc-05
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Payer sandbox exit use case 5: Get public key'
summary: >-
  Prove that your insurance system can fetch a hospital's public certificate, so
  it can seal its answers for that hospital.
sources:
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Table 1.5, Use case 5.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 3.3 Certificate Fetch; Section 2.4.
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
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.fetch-certs
  concepts:
  - nhcx.concept.encryption-certificate
  - nhcx.concept.jwe-envelope
  sandbox:
  - nhcx.sandbox.sandbox-exit
  tests:
  - nhcx.test.payer-uc-06
  - nhcx.test.payer-uc-07
  - nhcx.test.provider-uc-03
  troubleshooting:
  - nhcx.troubleshooting.recipient-cannot-decrypt
  errors:
  - nhcx.error.nhcx-401
  glossary:
  - nhcx.glossary.jwe
  - nhcx.glossary.x509-certificate
---

# Payer sandbox exit use case 5: Get public key

## In plain words

Every answer you send through [NHCX](../../shared/glossary/nhcx.md) is sealed for one hospital, as a [JWE](../glossary/jwe.md). You seal it with that hospital's public key. This case proves your system can fetch the key from the registry, given the hospital's [participant code](../glossary/participant-code.md).

It is one of the fifteen payer use cases for [sandbox exit](../glossary/sandbox-exit.md).

## Before you start

- Your payer participant exists in the sandbox registry with the payer role, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 6](payer-uc-06.md).
- You know the participant code of a provider in the sandbox, from [use case 4](payer-uc-04.md) or a request it sent you.

## What happens

### Run the call

1. Call [`POST /fetch/certs`](../endpoints/fetch-certs.md). `participantid` is mandatory.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"participantid": "<PROVIDER_PARTICIPANT_CODE>"}'
```

2. Load the returned string as a public key. Try it as an [X.509 certificate](../glossary/x509-certificate.md) first, then as a SubjectPublicKeyInfo (SPKI) key.
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
- An answer you seal with it is opened by the provider in [use case 7](payer-uc-07.md).

## When it goes wrong

- **The call is refused or the body is empty.** `participantid` is missing or misspelt.
- **The provider cannot open your answer.** The provider rotated its certificate. Fetch it again. See [the recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md).
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
