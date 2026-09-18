---
id: nhcx.test.payer-uc-13
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Payer sandbox exit use case 13: Send payment notice'
summary: >-
  Prove that your insurance system can tell a hospital a claim was paid, through
  the claims exchange, and receive its acknowledgement.
sources:
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 6, Table 6.2, Use case 13.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet PaymentNotice.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, rows 17, 30, 31, 33.
- url: https://hcxsbx.abdm.gov.in/servicehcxpayment/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/servicehcxpayment.json
  hash: sha256:f5c9e3728efbbeaa5e0e8083334b0ae60a05930e5a1e096ca06d40abb235d658
  fetched: '2026-09-14'
  note: 'API specification: servicehcxpayment, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/paymentnotice/request.'
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
  - nhcx.flow.payment-notice
  - nhcx.flow.send-a-sealed-request
  concepts:
  - nhcx.concept.message-identifiers
  - nhcx.concept.protocol-headers
  - nhcx.concept.four-message-legs
  - nhcx.concept.workflow-codes
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
  - nhcx.endpoint.paymentnotice-request
  - nhcx.endpoint.fetch-certs
  callbacks:
  - nhcx.callback.paymentnotice-on-request
  - nhcx.callback.error
  fhir:
  - nhcx.fhir.payment-notice
  - nhcx.fhir.task
  - nhcx.fhir.validation
  tests:
  - nhcx.test.payer-uc-05
  - nhcx.test.payer-uc-11
  - nhcx.test.provider-uc-11
  glossary:
  - nhcx.glossary.payment-notice
---

# Payer sandbox exit use case 13: Send payment notice

## In plain words

When your system pays a claim, it tells the hospital with a [payment notice](../glossary/payment-notice.md) through [NHCX](../../shared/glossary/nhcx.md). The notice carries the payment date, the amount and the bank transaction reference. The hospital acknowledges it on your endpoint.

Here your system starts the exchange. It is one of the fifteen payer use cases for [sandbox exit](../glossary/sandbox-exit.md).

## Before you start

- Your payer participant exists in the sandbox registry with the payer role, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 6](payer-uc-06.md).
- Your registered endpoint URL takes HTTPS calls from the exchange. See [callback URL requirements](../sandbox/callback-url-requirements.md).
- You can decrypt with your own private key, and you hold the provider's public certificate from [use case 5](payer-uc-05.md).
- You approved a claim from a sandbox provider in [use case 11](payer-uc-11.md).

## What happens

### Send the payment notice

1. Build a Task bundle whose Task has `code` `deliver` and a PaymentNotice as input. The PaymentReconciliation carries `status`, `paymentDate`, `paymentAmount` and `paymentIdentifier`, the bank transaction reference. See [the payment notice bundle](../fhir/payment-notice.md).
2. Validate it against the [NRCeS](../../shared/glossary/nrces.md) profiles, then seal it with the provider's public key.
3. Set the protected headers. `x-hcx-recipient_code` is the provider's code and `x-hcx-status` is `request.initiated`. Use a new `x-hcx-api_call_id`. `x-hcx-workflow_id` names the payment stage: `30` initiated, `31` processed, `33` settled.
4. Send it.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/paymentnotice/request' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"payload": "<JWE_COMPACT_STRING>"}'
```

5. NHCX answers with HTTP 202.

### Receive the acknowledgement

1. Wait for `POST /v1/paymentnotice/on_request` on your registered endpoint.
2. Answer it with HTTP 202 within 30 seconds, with the acceptance body.
3. Decrypt it. It carries `x-hcx-workflow_id` `17`, the provider's acknowledgement.

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

> Send Payment notification/reconciliation objects to Providers via the HCX gateway
>
> API should be called by payer systems. Request will be prepared as per the specifications.
>
> Payload should be validated against the profiles published by NRCES.

What you observe:

- NHCX answers your `POST /v1/paymentnotice/request` with HTTP 202.
- You receive `POST /v1/paymentnotice/on_request` with `x-hcx-workflow_id` `17` and `x-hcx-status` `response.complete`.
- Its `x-hcx-correlation_id` equals your `x-hcx-api_call_id`.

## When it goes wrong

- **[NHCX-1003](../errors/nhcx-1003.md), receiver not registered.** `x-hcx-recipient_code` is not the provider's registered code.
- **The provider cannot open your answer.** You sealed it with a stale or wrong certificate. Fetch the provider's certificate again with [use case 5](payer-uc-05.md). See [the recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md).
- **The provider's answer never arrives.** Check your registered endpoint against the [callback URL requirements](../sandbox/callback-url-requirements.md). Then ask where your request stands with [use case 15](payer-uc-15.md).
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
- **[NHCX-1011](../errors/nhcx-1011.md), invalid status.** `x-hcx-status` holds a value the exchange does not accept for this message. Use `response.complete` on an answer and `request.initiated` on a request.
- **The exchange keeps redelivering the same message.** Your endpoint did not return HTTP 202 with the acceptance body within 30 seconds. The exchange retries five times, then deletes the request. See [retries and expiry](../concepts/retries-and-expiry.md).
