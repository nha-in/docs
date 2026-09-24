---
id: nhcx.test.provider-uc-08
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Provider sandbox exit use case 8: Respond to communication request received
  from payer for additional documents'
summary: >-
  Prove that your hospital system can receive a payer's request for more documents
  and send the documents back through the claims exchange.
sources:
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 4, Table 4.2, Use case 8.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, Preauth steps 2-5 and Communication.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Communication (additional docs).
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 6, Query flow and Table 6.2.
- url: https://hcxsbx.abdm.gov.in/communicationhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/communicationhcxservice.json
  hash: sha256:0ad58a98851158057d38d42a8327349548644c1b2f1a33b4f94acb4c1840a8a4
  fetched: '2026-09-14'
  note: 'API specification: communicationhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/communication/on_request.'
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, Error scenario and Protocol Response.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 4, Q14.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8, Integrator's Journey.
related:
  concepts:
  - nhcx.concept.jwe-envelope
  - nhcx.concept.protocol-headers
  - nhcx.concept.four-message-legs
  - nhcx.concept.queries-and-communication
  - nhcx.concept.message-identifiers
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.dummy-payer
  - nhcx.sandbox.callback-url-requirements
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
  - nhcx.troubleshooting.recipient-cannot-decrypt
  - nhcx.troubleshooting.bundle-rejected
  flows:
  - nhcx.flow.preauth-query-response
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.send-a-sealed-request
  endpoints:
  - nhcx.endpoint.communication-on-request
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.dummy-payer-process-request
  callbacks:
  - nhcx.callback.communication-request
  - nhcx.callback.preauth-on-submit
  fhir:
  - nhcx.fhir.task
  - nhcx.fhir.validation
  tests:
  - nhcx.test.provider-uc-07
  - nhcx.test.payer-uc-10
  errors:
  - nhcx.error.nhcx-1010
  - nhcx.error.nhcx-1011
  - nhcx.error.nhcx-1003
  - nhcx.error.payr-1039
  - nhcx.error.payr-1520
  glossary:
  - nhcx.glossary.communication-request
---

# Provider sandbox exit use case 8: Respond to communication request received from payer for additional documents

## In plain words

A payer can pause a preauthorisation or a claim and ask your hospital for more documents. The request arrives on your endpoint as a [communication request](../glossary/communication-request.md), through [NHCX](../../shared/glossary/nhcx.md). This case proves your system receives it and sends the documents back.

Here the payer starts the exchange. Your system answers it.

## Before you start

- Your provider participant exists in the sandbox registry, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 4](provider-uc-04.md).
- You hold the recipient's public certificate from [use case 3](provider-uc-03.md), and your own private key.
- Your registered endpoint URL takes HTTPS calls from the exchange. See [callback URL requirements](../sandbox/callback-url-requirements.md).
- The recipient is the sandbox dummy payer, participant code `1000003538@hcx`, unless a payer partner answers for you. See [the dummy payer](../sandbox/dummy-payer.md).
- You can submit a preauthorisation, as in [use case 7](provider-uc-07.md).
- You have the documents to send, ready to attach.

## What happens

### Get a query from the dummy payer

1. Submit a preauthorisation to `1000003538@hcx`, as in [use case 7](provider-uc-07.md).
2. Call the dummy payer's `/process/request` with `action` `Query`, `method` `Preauth` and your correlation id. See [dummy payer, act on a request](../endpoints/dummy-payer-process-request.md).

### Receive the communication request

1. Wait for `POST /v1/communication/request` on your registered endpoint.
2. Answer it with HTTP 202 within 30 seconds, with the acceptance body from [receive a sealed callback](../flows/receive-a-sealed-callback.md).
3. Decrypt the payload. The Task bundle carries a CommunicationRequest naming what the payer wants.

### Send the documents

1. Build a Task bundle with a Communication as its input. Put each document in the Communication's `payload.contentAttachment`. Validate it against the [NRCeS](../../shared/glossary/nrces.md) profiles.
2. Seal it with the payer's public key.
3. Set the protected headers. Use a new `x-hcx-api_call_id`. Set `x-hcx-correlation_id` to the `x-hcx-api_call_id` of the communication request. Set `x-hcx-recipient_code` to its `x-hcx-sender_code`, and `x-hcx-status` to `response.complete`.
4. Send it to [`/v1/communication/on_request`](../endpoints/communication-on-request.md).

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/communication/on_request' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"type": "JWEPayload", "payload": "<JWE_COMPACT_STRING>"}'
```

5. NHCX answers with HTTP 202.
6. Wait for the final decision on `POST /v1/preauth/on_submit`, and answer it with HTTP 202 within 30 seconds.

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

> Respond to the communication Request via NHCX. This API will be called by payers to seek more details of the case submitted by providers for Preauthorization or for Claims.
>
> Encrypted payload of TaskBundle should have Comunication as input.
>
> Payload should be validated against the profiles published by NRCES.

What you observe:

- You receive `POST /v1/communication/request` and answer it with HTTP 202 within 30 seconds.
- NHCX answers your `POST /v1/communication/on_request` with HTTP 202.
- No `/v1/error` report arrives for your answer.
- The final decision arrives on `POST /v1/preauth/on_submit` for the same case.

## When it goes wrong

- **The communication request never arrives.** Check your registered endpoint against the [callback URL requirements](../sandbox/callback-url-requirements.md). With the dummy payer, confirm you sent `action` `Query`.
- **The payer refuses the documents.** A Communication needs its payload and identifier. See [PAYR-1039](../errors/payr-1039.md) and [PAYR-1520](../errors/payr-1520.md).
- **A [PMJAY](../glossary/pmjay.md) payer never sends one.** PMJAY payers raise queries on the preauthorisation or claim callback, with a workflow id. See [TC-PA-02](tc-pa-02.md).
- **[NHCX-1010](../errors/nhcx-1010.md), no data for the correlation id.** Your message's `x-hcx-correlation_id` is not the `x-hcx-api_call_id` of the request you answer.
- **[NHCX-1011](../errors/nhcx-1011.md), invalid status.** `x-hcx-status` holds a value the exchange does not accept for this message. Use `response.complete` on an answer and `request.initiated` on a request.
- **[NHCX-1003](../errors/nhcx-1003.md), receiver not registered.** `x-hcx-recipient_code` is wrong. Copy it from the `x-hcx-sender_code` of the request you answer.
- **A `/v1/error` report arrives at your endpoint.** The recipient refused your message after the exchange accepted it. Read the details as [receiving /v1/error](../callbacks/error.md) describes.
- **The exchange keeps redelivering the same message.** Your endpoint did not return HTTP 202 with the acceptance body within 30 seconds. The exchange retries five times, then deletes the request. See [retries and expiry](../concepts/retries-and-expiry.md).
