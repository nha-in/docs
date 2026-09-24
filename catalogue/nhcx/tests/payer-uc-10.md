---
id: nhcx.test.payer-uc-10
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Payer sandbox exit use case 10: Raise communication request'
summary: >-
  Prove that your insurance system can ask a hospital for more documents during
  a claim cycle, and receive the documents back.
sources:
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 4, Table 4.2, Use case 10.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Communication (additional docs).
- url: https://hcxsbx.abdm.gov.in/communicationhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/communicationhcxservice.json
  hash: sha256:0ad58a98851158057d38d42a8327349548644c1b2f1a33b4f94acb4c1840a8a4
  fetched: '2026-09-14'
  note: 'API specification: communicationhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/communication/request.'
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Error scenario.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 4, Q14; page 2, Q3.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8, Integrator's Journey.
related:
  flows:
  - nhcx.flow.payer-process-a-request
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.preauth-query-response
  - nhcx.flow.claim-query-response
  concepts:
  - nhcx.concept.message-identifiers
  - nhcx.concept.protocol-headers
  - nhcx.concept.four-message-legs
  - nhcx.concept.queries-and-communication
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.callback-url-requirements
  troubleshooting:
  - nhcx.troubleshooting.duplicate-or-mismatched-correlation
  - nhcx.troubleshooting.recipient-cannot-decrypt
  errors:
  - nhcx.error.nhcx-1010
  - nhcx.error.nhcx-1003
  - nhcx.error.nhcx-1011
  - nhcx.error.nhcx-401
  endpoints:
  - nhcx.endpoint.communication-request
  - nhcx.endpoint.fetch-certs
  callbacks:
  - nhcx.callback.communication-on-request
  - nhcx.callback.error
  fhir:
  - nhcx.fhir.task
  - nhcx.fhir.validation
  tests:
  - nhcx.test.payer-uc-05
  - nhcx.test.payer-uc-15
  - nhcx.test.provider-uc-08
  glossary:
  - nhcx.glossary.communication-request
---

# Payer sandbox exit use case 10: Raise communication request

## In plain words

During a claim cycle your system may need more documents from the hospital before it decides. This case proves your system sends a [communication request](../glossary/communication-request.md) through [NHCX](../../shared/glossary/nhcx.md). The hospital's documents come back later on your endpoint.

Here your system starts the exchange. It is one of the fifteen payer use cases for [sandbox exit](../glossary/sandbox-exit.md).

## Before you start

- Your payer participant exists in the sandbox registry with the payer role, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 6](payer-uc-06.md).
- Your registered endpoint URL takes HTTPS calls from the exchange. See [callback URL requirements](../sandbox/callback-url-requirements.md).
- You can decrypt with your own private key, and you hold the provider's public certificate from [use case 5](payer-uc-05.md).
- A preauthorisation or claim from a sandbox provider is with you for adjudication. You need a provider partner, or a provider participant of your own, to send it.

## What happens

### Send the communication request

1. Build a Task bundle with a CommunicationRequest as a bundle component. Name the documents you need. Validate it against the [NRCeS](../../shared/glossary/nrces.md) profiles ([validating a bundle](../fhir/validation.md)).
2. Seal it as a [JWE](../glossary/jwe.md) with the provider's public key.
3. Set the protected headers. `x-hcx-sender_code` is your participant code and `x-hcx-recipient_code` is the provider's. `x-hcx-status` is `request.initiated`. Use a new `x-hcx-api_call_id`.
4. Send it.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/communication/request' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"payload": "<JWE_COMPACT_STRING>"}'
```

5. NHCX answers with HTTP 202.

### Receive the documents

1. Wait for `POST /v1/communication/on_request` on your registered endpoint.
2. Answer it with HTTP 202 within 30 seconds, with the acceptance body.
3. Decrypt it. The Task bundle carries a Communication with the documents attached.

### Demonstrate it

Sign-off needs people. Book the demos once the steps above pass in your own runs. See [the sandbox exit process](../sandbox/sandbox-exit.md).

```precondition
human: true
who: your team, with the NHA team
action: Demonstrate this use case in the internal demo, then in the Health Tech Committee (HTC) demo.
how: Email hcx.integration@nha.gov.in to request both demos.
also: Send the FHIR bundles you used to hcx.integration@nha.gov.in for validation by the NRCeS team.
```

## How you know it worked

The pass criterion for this case:

> Raise a communication request to Provider via HCX in a claim cycle for any additional documents required from provider.
>
> API should be called by payer systems to get the additional documents from the privider. Payload will be prepared as TaskBundle having CommunicationRequest as bundle component.
>
> Payload should be validated against the profiles published by NRCES.

What you observe:

- NHCX answers your `POST /v1/communication/request` with HTTP 202.
- You receive `POST /v1/communication/on_request`, whose `x-hcx-correlation_id` equals your `x-hcx-api_call_id`.
- The decrypted Task bundle carries a Communication with the documents you asked for.

## When it goes wrong

- **[NHCX-1003](../errors/nhcx-1003.md), receiver not registered.** `x-hcx-recipient_code` is not a registered provider code.
- **The provider cannot open your answer.** You sealed it with a stale or wrong certificate. Fetch the provider's certificate again with [use case 5](payer-uc-05.md). See [the recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md).
- **The provider's answer never arrives.** Check your registered endpoint against the [callback URL requirements](../sandbox/callback-url-requirements.md). Then ask where your request stands with [use case 15](payer-uc-15.md).
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
- **The exchange keeps redelivering the same message.** Your endpoint did not return HTTP 202 with the acceptance body within 30 seconds. The exchange retries five times, then deletes the request. See [retries and expiry](../concepts/retries-and-expiry.md).
