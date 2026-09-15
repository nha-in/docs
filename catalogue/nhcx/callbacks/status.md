---
id: nhcx.callback.status
type: callback
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Receiving POST /v1/status
summary: >-
  Why the claims exchange answers status questions itself, so your system never
  needs to handle one, and what to do if one reaches you.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Status, /v1/status.
- url: https://hcxsbx.abdm.gov.in/statushcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/statushcxservice.json
  hash: sha256:93b6355a234ef56607427fcdfa32da4921124180c9df08ecd73c8af8955c2adf
  fetched: '2026-09-14'
  note: 'API specification: statushcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/status description.'
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. API Structure, Status Check rows.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Acceptance and Error scenario.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Q14.
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.status
  - nhcx.endpoint.on-status
  callbacks:
  - nhcx.callback.on-status
  flows:
  - nhcx.flow.status-check
  tests:
  - nhcx.test.provider-uc-13
  - nhcx.test.payer-uc-15
  errors:
  - nhcx.error.nhcx-1012
  concepts:
  - nhcx.concept.status-lifecycle
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.protocol-headers
  - nhcx.concept.message-identifiers
  decisions:
  - nhcx.decision.status-poll-or-wait
  glossary:
  - shared.glossary.nhcx
  - nhcx.glossary.jwe
  - nhcx.glossary.payer
  - nhcx.glossary.provider
  - nhcx.glossary.api-call-id
---

# Receiving POST /v1/status

## In plain words

`/v1/status` is the question a sender asks [NHCX](../../shared/glossary/nhcx.md) about one of its own messages. NHCX answers it from its own records. It does not forward the question to a [payer](../glossary/payer.md) or a [provider](../glossary/provider.md). The answer goes back to the sender on [`/v1/on_status`](on-status.md). In normal operation, no participant receives `/v1/status`.

## Before you start

**Who receives it:** NHCX, which implements `/v1/status` for providers and payers alike. **Who sends it:** any participant asking about a message it sent.

- Your registered `endpoint_url` stays as it is for every other path. You need no business logic for `/v1/status`.
- To ask about your own messages, see [`/v1/status`](../endpoints/status.md) and [receiving `/v1/on_status`](on-status.md).
- Every path under your `endpoint_url` answers a delivery within 30 seconds. See [the 202 acknowledgement](../concepts/synchronous-acknowledgement.md).

## What happens

```mermaid
sequenceDiagram
    participant S as Sender system
    participant N as NHCX gateway
    S->>N: POST /v1/status
    N-->>S: 202 Accepted
    Note over N: Looks up the message in its own records
    N->>S: POST /v1/on_status
    S-->>N: 202 Accepted with receipt
```

### What a status request carries

A status request is sealed as a [JWE](../glossary/jwe.md) like any other message. Its payload is an empty string. Its protected header names the message in question:

```json
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM",
  "x-hcx-sender_code": "<SENDER_PARTICIPANT_CODE>",
  "x-hcx-recipient_code": "<RECIPIENT_PARTICIPANT_CODE>",
  "x-hcx-api_call_id": "<API_CALL_ID_SET_BY_THE_SENDER>",
  "x-hcx-correlation_id": "<API_CALL_ID_OF_THE_MESSAGE_IN_QUESTION>",
  "x-hcx-timestamp": "<TIME_THE_SENDER_SEALED_IT>",
  "x-hcx-status": "request.initiated",
  "x-hcx-ben-abha-id": "<BENEFICIARY_ABHA_NUMBER>"
}
```

`x-hcx-correlation_id` holds the `x-hcx-api_call_id` of the message the sender asks about. Everything else follows [the x-hcx protocol headers](../concepts/protocol-headers.md).

### If one reaches your endpoint

Answer it like any other delivery: HTTP 202 with the receipt, within 30 seconds. Take no further action. NHCX, not you, reports the status on `/v1/on_status`.

Answer the delivery first, before you decrypt or act on it. Return HTTP status `202 Accepted` with this receipt:

```json
{
  "timestamp": "<CURRENT_TIME_AS_DD/MM/YYYY hh:mm:ss:sss>",
  "api_call_id": "<X_HCX_API_CALL_ID_FROM_THIS_DELIVERY>",
  "correlation_id": "<X_HCX_CORRELATION_ID_FROM_THIS_DELIVERY>",
  "result": {
    "sender_code": "<X_HCX_SENDER_CODE_FROM_THIS_DELIVERY>",
    "recipient_code": "<YOUR_PARTICIPANT_CODE>",
    "entity_type": "<ENTITY_TYPE>",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```

- `api_call_id` and `correlation_id` repeat the values in this delivery.
- `result.sender_code` is the sender's code. `result.recipient_code` is yours.
- An `entity_type` value for this exchange is not yet published. The published values are `coverageeligibility`, `preauth`, `claim`, `task`, `payment` and `insuranceplan`.
- `result.protocol_status` is one of `request.queued`, `request.dispatched` or `request.error`.
- `error.code` and `error.message` stay empty when you accept the message.
- `timestamp` takes the form `DD/MM/YYYY hh:mm:ss:sss`.

## How you know it worked

- You have nothing to build for this path.
- Your own `/v1/status` calls are answered on `/v1/on_status`, with `x-hcx-status` `request.queued`, `request.dispatched` or `request.stopped`.
- If your endpoint ever logs a delivery at `/v1/status`, it returned 202 with the receipt within 30 seconds.

## When it goes wrong

- **It never arrives.** That is expected. NHCX answers status requests itself.
- **You are waiting for a status answer.** It comes on `/v1/on_status`. See [receiving `/v1/on_status`](on-status.md).
- **Your status call is refused with [NHCX-1012](../errors/nhcx-1012.md).** NHCX holds no message with that API call id. Put the `x-hcx-api_call_id` of your original message in `x-hcx-correlation_id`.
- **Your server answers `/v1/status` with a 404.** Route the path to a handler that returns the receipt. NHCX then stops sending it again.
