---
id: nhcx.endpoint.dummy-payer-paymentnotice-init
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /paymentNotice/init
summary: >-
  Make the sandbox's test insurer send your hospital a payment notice on demand,
  so you can test receiving and acknowledging it.
sources:
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2-3, Payment Notice and CURL for Payment Notice Trigger API.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 4, Q14 and Q16.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. sheet Scenarios, row 13.
related:
  endpoints:
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.claim-submit
  - nhcx.endpoint.communication-on-request
  - nhcx.endpoint.paymentnotice-on-request
  - nhcx.endpoint.session-token
  sandbox:
  - nhcx.sandbox.dummy-payer
  - nhcx.sandbox.test-participants
  flows:
  - nhcx.flow.preauth-submit
  - nhcx.flow.claim-submit
  - nhcx.flow.payment-notice
  callbacks:
  - nhcx.callback.paymentnotice-request
---

# POST /paymentNotice/init

## In plain words

A payment notice normally follows a settled claim, which is slow to reach in a test. This test hook makes the [NHCX](../../shared/glossary/nhcx.md) sandbox's [dummy payer](../sandbox/dummy-payer.md), `1000003538@hcx`, send one to you now.

You call it as a provider integration testing its payment notice handling in the sandbox. It exists only in the sandbox.

## Before you start

- A handler for [`/v1/paymentnotice/request`](../callbacks/paymentnotice-request.md) on your registered callback address, answering 202 within 30 seconds.
- Your own participant code.
- A session token, sent on `bearer_auth`. See [the session token](../concepts/session-token.md).

## What happens

Your system calls the dummy payer's test hook directly.

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/paymentNotice/init' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --data-raw '{
    "providerId": "<YOUR_PARTICIPANT_CODE>",
    "claimNumber": ""
  }'
```

Note the camel case in `paymentNotice`. Send `claimNumber` as an empty string.

**Idempotency.** Each call triggers a notice. Call it again only when you want another one.

## How you know it worked

A payment notice from `1000003538@hcx` arrives on your [`/v1/paymentnotice/request`](../callbacks/paymentnotice-request.md).

The step is done when your handler has answered it 202 within 30 seconds and you have sent the acknowledgement on [`/v1/paymentnotice/on_request`](paymentnotice-on-request.md).

## When it goes wrong

- Nothing arrives: `providerId` is not your participant code, or your callback address is unreachable.
- The notice arrives but the test is incomplete: you did not send the acknowledgement on `/v1/paymentnotice/on_request`.
