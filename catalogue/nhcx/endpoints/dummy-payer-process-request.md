---
id: nhcx.endpoint.dummy-payer-process-request
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /process/request
summary: >-
  Make the sandbox's test insurer approve, reject or query a request you sent it,
  so you can test your handling of each answer.
sources:
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1-3, Preauth, Claim, Communication steps and CURL for Test Usecase Action API.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 4, Q14 and Q16.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheets Preauth and Claim, on_submit rows.
verified:
  status: unverified
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
  - nhcx.callback.preauth-on-submit
  - nhcx.callback.claim-on-submit
  - nhcx.callback.communication-request
---

# POST /process/request

## In plain words

The [NHCX](../../shared/glossary/nhcx.md) sandbox hosts a [dummy payer](../sandbox/dummy-payer.md), participant `1000003538@hcx`, that answers back. This test hook decides what it answers: approve, reject or query.

You call it as a provider integration testing in the sandbox, after you have sent a pre-authorisation or claim to the dummy payer. It exists only in the sandbox.

## Before you start

- A pre-authorisation or claim sent to `1000003538@hcx` on [`/v1/preauth/submit`](preauth-submit.md) or [`/v1/claim/submit`](claim-submit.md), answered 202, with its correlation id kept.
- Your callback address registered, reachable from NHCX, and answering 202 within 30 seconds.
- A session token, sent on `bearer_auth`. See [the session token](../concepts/session-token.md).

## What happens

Your system calls the dummy payer's test hook directly. There is no JWE envelope on this call.

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/process/request' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --data-raw '{
    "action": "Approve",
    "method": "Preauth",
    "correlationId": "<CORRELATION_ID_OF_YOUR_REQUEST>"
  }'
```

`action` is `Approve`, `Reject` or `Query`. `method` is `Preauth` or `Claim`.

After a `Query`, the dummy payer sends a communication request first. Answer it on [`/v1/communication/on_request`](communication-on-request.md) with the supporting documents. The final answer follows.

**Idempotency.** Trigger one answer per request. To test another outcome, send a new request with its own correlation id.

## How you know it worked

The dummy payer's answer reaches your callback address on the correlation id you named: [`/v1/preauth/on_submit`](../callbacks/preauth-on-submit.md) for `Preauth`, [`/v1/claim/on_submit`](../callbacks/claim-on-submit.md) for `Claim`. It is a sealed `ClaimResponse`, or a `ProtocolResponse` refusing the request.

After a `Query`, a [`/v1/communication/request`](../callbacks/communication-request.md) arrives first.

The step is done when your handler has answered that callback 202 within 30 seconds and recorded the outcome.

## When it goes wrong

- Nothing arrives: the correlation id belongs to a request that was not addressed to `1000003538@hcx`.
- After a `Query` the decision never comes: you did not answer the communication request on `/v1/communication/on_request`.
- A `ProtocolResponse` refuses an empty test bundle: there is no `Claim` inside. For a smoke test this refusal is the expected answer.
