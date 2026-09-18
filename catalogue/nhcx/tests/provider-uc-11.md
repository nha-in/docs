---
id: nhcx.test.provider-uc-11
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Provider sandbox exit use case 11: Acknowledge payment notice'
summary: >-
  Prove that your hospital system can receive a payer's payment notice and acknowledge
  it through the claims exchange.
sources:
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 5-6, Tables 5.3 and 6.1, Use case 11.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 2-3, Payment Notice and trigger API.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet PaymentNotice.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, row Payment Notice Recived.
- url: https://hcxsbx.abdm.gov.in/servicehcxpayment/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/servicehcxpayment.json
  hash: sha256:f5c9e3728efbbeaa5e0e8083334b0ae60a05930e5a1e096ca06d40abb235d658
  fetched: '2026-09-14'
  note: 'API specification: servicehcxpayment, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/paymentnotice/on_request.'
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Q2; page 4, Q14.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, Error scenario and Protocol Response.
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
  - nhcx.concept.workflow-codes
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.dummy-payer
  - nhcx.sandbox.callback-url-requirements
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
  - nhcx.troubleshooting.recipient-cannot-decrypt
  - nhcx.troubleshooting.bundle-rejected
  flows:
  - nhcx.flow.payment-notice
  - nhcx.flow.receive-a-sealed-callback
  endpoints:
  - nhcx.endpoint.paymentnotice-on-request
  - nhcx.endpoint.dummy-payer-paymentnotice-init
  callbacks:
  - nhcx.callback.paymentnotice-request
  fhir:
  - nhcx.fhir.payment-notice
  - nhcx.fhir.task
  - nhcx.fhir.validation
  tests:
  - nhcx.test.provider-uc-09
  - nhcx.test.payer-uc-13
  errors:
  - nhcx.error.nhcx-1010
  - nhcx.error.nhcx-1011
  - nhcx.error.nhcx-1003
  glossary:
  - nhcx.glossary.payment-notice
---

# Provider sandbox exit use case 11: Acknowledge payment notice

## In plain words

When a payer pays a claim, it sends your hospital a [payment notice](../glossary/payment-notice.md) through [NHCX](../../shared/glossary/nhcx.md). The notice carries the payment date, the amount and the bank transaction reference. This case proves your system receives it and sends an acknowledgement back.

Here the payer starts the exchange. Your system answers it.

## Before you start

- Your provider participant exists in the sandbox registry, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 4](provider-uc-04.md).
- You hold the recipient's public certificate from [use case 3](provider-uc-03.md), and your own private key.
- Your registered endpoint URL takes HTTPS calls from the exchange. See [callback URL requirements](../sandbox/callback-url-requirements.md).
- The recipient is the sandbox dummy payer, participant code `1000003538@hcx`, unless a payer partner answers for you. See [the dummy payer](../sandbox/dummy-payer.md).
- You have the claim number of a claim you submitted in [use case 9](provider-uc-09.md).

## What happens

### Get a payment notice from the dummy payer

1. Call the dummy payer's payment notice trigger with your participant code and the claim number. See [dummy payer, send a payment notice](../endpoints/dummy-payer-paymentnotice-init.md).

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/paymentNotice/init' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"providerId": "<YOUR_PARTICIPANT_CODE>", "claimNumber": "<CLAIM_NUMBER_FROM_USE_CASE_9>"}'
```

### Receive the notice

1. Wait for `POST /v1/paymentnotice/request` on your registered endpoint.
2. Answer it with HTTP 202 within 30 seconds, with the acceptance body.
3. Decrypt the payload. Store the payment date, amount and `paymentIdentifier` from the PaymentReconciliation.

### Send the acknowledgement

1. Build a Task bundle whose Task acknowledges the notice. See [the payment notice bundle](../fhir/payment-notice.md). Validate it against the [NRCeS](../../shared/glossary/nrces.md) profiles.
2. Seal it with the payer's public key.
3. Set the protected headers. Use a new `x-hcx-api_call_id`. Set `x-hcx-correlation_id` to the `x-hcx-api_call_id` of the notice. Set `x-hcx-recipient_code` to its `x-hcx-sender_code`. Set `x-hcx-workflow_id` to `17` and `x-hcx-status` to `response.complete`.
4. Send it to [`/v1/paymentnotice/on_request`](../endpoints/paymentnotice-on-request.md).

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/paymentnotice/on_request' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"type": "JWEPayload", "payload": "<JWE_COMPACT_STRING>"}'
```

5. NHCX answers with HTTP 202.

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

> Acknowledge the payment notification sent by the Payer.
>
> Encrypted payload of TaskBundle with Task Resource
>
> Payload should be validated against the profiles published by NRCES.

What you observe:

- You receive `POST /v1/paymentnotice/request` and answer it with HTTP 202 within 30 seconds.
- Your system shows the payment date, amount and bank transaction reference for the claim.
- NHCX answers your `POST /v1/paymentnotice/on_request` with HTTP 202.
- No `/v1/error` report arrives for your acknowledgement.

## When it goes wrong

- **The notice never arrives.** Check your registered endpoint against the [callback URL requirements](../sandbox/callback-url-requirements.md). With the dummy payer, send a claim number you submitted.
- **Your acknowledgement goes nowhere.** Build the URL as `https://apisbx.abdm.gov.in/hcx/v1/paymentnotice/on_request`, with a slash after `.in`.
- **[NHCX-1010](../errors/nhcx-1010.md), no data for the correlation id.** Your message's `x-hcx-correlation_id` is not the `x-hcx-api_call_id` of the request you answer.
- **[NHCX-1011](../errors/nhcx-1011.md), invalid status.** `x-hcx-status` holds a value the exchange does not accept for this message. Use `response.complete` on an answer and `request.initiated` on a request.
- **[NHCX-1003](../errors/nhcx-1003.md), receiver not registered.** `x-hcx-recipient_code` is wrong. Copy it from the `x-hcx-sender_code` of the request you answer.
- **A `/v1/error` report arrives at your endpoint.** The recipient refused your message after the exchange accepted it. Read the details as [receiving /v1/error](../callbacks/error.md) describes.
- **The exchange keeps redelivering the same message.** Your endpoint did not return HTTP 202 with the acceptance body within 30 seconds. The exchange retries five times, then deletes the request. See [retries and expiry](../concepts/retries-and-expiry.md).
