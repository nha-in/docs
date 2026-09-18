---
id: nhcx.endpoint.paymentnotice-request
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v1/paymentnotice/request
summary: >-
  Tell a hospital, through the claims exchange, that payment for an approved claim
  has been started, processed or settled.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: 'NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet: PaymentNotice, /v1/paymentnotice/request rows.'
- url: https://hcxsbx.abdm.gov.in/servicehcxpayment/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/servicehcxpayment.json
  hash: sha256:f5c9e3728efbbeaa5e0e8083334b0ae60a05930e5a1e096ca06d40abb235d658
  fetched: '2026-09-14'
  note: 'API specification: servicehcxpayment, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/paymentnotice/request.post.'
- url: https://hcxsbx.abdm.gov.in/images/bc1e7d077857fc0fa071.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-NHCX USECASE Postman Collection.zip
  hash: sha256:9d15daafa813d6d57e688fe800baa5a73d2540b8d0d12c6a1315f86a424817e4
  fetched: '2026-09-14'
  note: AWS(Sandbox)-NHCX USECASE Postman Collection, row 17 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. item /v1/paymentnotice/request.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Acceptance scenario.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, workflow ids 30, 31 and 33.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 11.4 API and workflow codes; Implementation notes.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2 Q3; page 4 Q12 and Q14.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. items 6 and 8.
related:
  endpoints:
  - nhcx.endpoint.paymentnotice-on-request
  - nhcx.endpoint.claim-on-submit
  - nhcx.endpoint.dummy-payer-paymentnotice-init
  - nhcx.endpoint.session-token
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.status
  callbacks:
  - nhcx.callback.paymentnotice-request
  - nhcx.callback.paymentnotice-on-request
  - nhcx.callback.error
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.nhcx-1003
  - nhcx.error.nhcx-1006
  - nhcx.error.nhcx-1011
  - nhcx.error.nhcx-1012
  concepts:
  - nhcx.concept.jwe-envelope
  - nhcx.concept.protocol-headers
  - nhcx.concept.message-identifiers
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.four-message-legs
  - nhcx.concept.claim-cycle
  - nhcx.concept.workflow-codes
  flows:
  - nhcx.flow.payment-notice
  fhir:
  - nhcx.fhir.payment-notice
  tests:
  - nhcx.test.payer-uc-13
  sandbox:
  - nhcx.sandbox.dummy-payer
---

# POST /v1/paymentnotice/request

## In plain words

A payment notice tells the hospital whether the money for an approved claim has moved. As a payer, you send a sealed Task bundle to [NHCX](../../shared/glossary/nhcx.md) with a PaymentNotice and a PaymentReconciliation. They carry the amount, the deductions and the bank reference, including the UTR once settled. The provider acknowledges on `/v1/paymentnotice/on_request`.

Send one notice at each stage of the transfer.

## Before you start

- A session token that has not expired. See [the session token](../concepts/session-token.md) and [how to get one](session-token.md).
- Your own [participant code](../glossary/participant-code.md), with your callback address registered, reachable from NHCX and answering 202 within 30 seconds. See [callback URL rules](../sandbox/callback-url-requirements.md).
- The provider's participant code: the sender code of the claim or pre-authorisation this message concerns.
- The recipient's encryption certificate, fetched with [`/fetch/certs`](fetch-certs.md). You seal the message with its public key.
- A Task bundle in [FHIR](../../shared/glossary/fhir.md) with `code` `deliver`, a PaymentNotice and a PaymentReconciliation carrying status, payment date, amount and payment identifier. See [the PaymentNotice bundle](../fhir/payment-notice.md).
- A handler for [`/v1/error`](../callbacks/error.md), so a request NHCX cannot deliver does not look like one still under review.
- A claim you approved on [`/v1/claim/on_submit`](claim-on-submit.md) with `response.complete`.
- A handler for [`/v1/paymentnotice/on_request`](../callbacks/paymentnotice-on-request.md).

## What happens

Your system, as the payer, calls NHCX on `/v1/paymentnotice/request`. NHCX checks the envelope, answers 202 at once, and forwards the same path to the provider's registered address ([receiving `/v1/paymentnotice/request`](../callbacks/paymentnotice-request.md)). The provider answers later on [`/v1/paymentnotice/on_request`](../callbacks/paymentnotice-on-request.md), which NHCX delivers to you.

### 1. Seal the message

Put these values in the [JWE](../glossary/jwe.md) [protected header](../glossary/protected-header.md) and encrypt the bundle with the recipient's public key.

```json
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM",
  "x-hcx-sender_code": "<YOUR_PARTICIPANT_CODE>",
  "x-hcx-recipient_code": "<PROVIDER_PARTICIPANT_CODE>",
  "x-hcx-api_call_id": "<NEW_UUID_FOR_THIS_CALL>",
  "x-hcx-request_id": "<REQUEST_UUID>",
  "x-hcx-correlation_id": "<CORRELATION_UUID>",
  "x-hcx-workflow_id": "30",
  "x-hcx-timestamp": "<CURRENT_TIMESTAMP>",
  "x-hcx-status": "request.initiated",
  "x-hcx-ben-abha-id": "<BENEFICIARY_ABHA_NUMBER>"
}
```

The `x-hcx-*` values ride inside the JWE [protected header](../glossary/protected-header.md), not as HTTP headers. [The protocol headers](../concepts/protocol-headers.md) explains each one, including the timestamp format. `x-hcx-workflow_id` is the stage: `30` payment initiated, `31` processed, `33` settled. The UTR goes in the `33` notice.

### 2. Send it

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/v1/paymentnotice/request' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --data-raw '{
    "payload": "<JWE_COMPACT_STRING>"
  }'
```

Send the token on both `bearer_auth` and `Authorization`, with the same value and the word `Bearer` in front. `<JWE_COMPACT_STRING>` is your sealed message: five base64url parts joined by dots. See [the JWE envelope](../concepts/jwe-envelope.md).

### 3. Retrying

**Idempotency.** NHCX keys every conversation on `x-hcx-correlation_id`. An initiating request that reuses a correlation id NHCX already holds is refused with [`NHCX-1006`](../errors/nhcx-1006.md). So a blind retry is not safe. If your call timed out, ask [`/v1/status`](status.md) before you resend. `/v1/status` finds a message by its `x-hcx-api_call_id` ([`NHCX-1012`](../errors/nhcx-1012.md) when it cannot), so generate a new one for every call, a retry included. After a request fails for good, NHCX makes its correlation id inactive. Start a new cycle with a new correlation id.

## How you know it worked

You receive HTTP `202 Accepted` with this body:

```json
{
  "timestamp": "<DD/MM/YYYY hh:mm:ss:sss>",
  "api_call_id": "<YOUR_API_CALL_ID>",
  "correlation_id": "<YOUR_CORRELATION_ID>",
  "result": {
    "sender_code": "<YOUR_PARTICIPANT_CODE>",
    "recipient_code": "<PROVIDER_PARTICIPANT_CODE>",
    "entity_type": "payment",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```

- `correlation_id` and `api_call_id` match the values you sealed.
- `result.entity_type` is `payment`.
- `result.protocol_status` is `request.queued` or `request.dispatched`.
- `error.code` and `error.message` are empty.

The 202 is a receipt, not a decision. NHCX never returns a decision synchronously. The step is done when [`/v1/paymentnotice/on_request`](../callbacks/paymentnotice-on-request.md) reaches your callback address with the same `x-hcx-correlation_id`, and your handler has answered it 202 within 30 seconds.

## When it goes wrong

- `401 Unauthorized`, or [`NHCX-401`](../errors/nhcx-401.md): get a new session token and send again.
- [`NHCX-1003`](../errors/nhcx-1003.md): the provider code is not registered in NHCX.
- [`NHCX-1006`](../errors/nhcx-1006.md): the correlation id was used before. Open the cycle with a new one.
- [`NHCX-1011`](../errors/nhcx-1011.md): `x-hcx-status` is not `request.initiated`.
- You got 202 and nothing more arrives. The provider's address may be unreachable. Check your [`/v1/error`](../callbacks/error.md) and ask [`/v1/status`](status.md).
