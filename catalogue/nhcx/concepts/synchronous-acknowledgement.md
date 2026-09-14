---
id: nhcx.concept.synchronous-acknowledgement
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The 202 acknowledgement and the 30 second rule
summary: >-
  Every delivery on the exchange is answered at once with a short accepted reply,
  within 30 seconds, and the real answer follows later as a separate message.
sources:
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Pages 1-2.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 4, Q12 and Q14.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Message Flow and Error Handling.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.four-message-legs
  - nhcx.concept.retries-and-expiry
  - nhcx.concept.status-lifecycle
  - nhcx.concept.jwe-envelope
  flows:
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.payer-process-a-request
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
  - nhcx.troubleshooting.callback-url-rejected
  sandbox:
  - nhcx.sandbox.callback-url-requirements
  errors:
  - nhcx.error.nhcx-1001
  - nhcx.error.nhcx-1015
  - nhcx.error.nhcx-1017
---

# The 202 acknowledgement and the 30 second rule

## In plain words

On NHCX, whoever receives a message answers it at once with HTTP 202 Accepted. The 202 says "I have it". It does not say "I have done it".

This applies in both directions. NHCX answers your call with 202. Your system answers NHCX with 202 when NHCX delivers a message to you, and it must do so within 30 seconds.

## Before you start

Read [the four message legs](./four-message-legs.md). Your endpoint must be reachable from NHCX. See [the callback URL requirements](../sandbox/callback-url-requirements.md).

## What happens

### Two acknowledgements

| When | Who sends the 202 | What it means |
|---|---|---|
| You call NHCX | NHCX | Your envelope passed validation and is queued for delivery |
| NHCX delivers a message to your endpoint | Your system | You received it and will process it |

If NHCX finds a problem with your envelope, it answers with an error instead of 202.

### Your acknowledgement body

When NHCX delivers a message to you, return HTTP 202 with this body:

```json
{
  "timestamp": "DD/MM/YYYY hh:mm:ss:sss",
  "api_call_id": "UUID",
  "correlation_id": "UUID",
  "result": {
    "sender_code": "PYRXX@hcx",
    "recipient_code": "INXXXXX@hcx",
    "entity_type": "coverageeligibility/preauth/claim/task/payment/insuranceplan",
    "protocol_status": "request.queued/request.dispatched/request.error"
  },
  "error": { "code": "", "message": "" }
}
```

`entity_type` takes one of `coverageeligibility`, `preauth`, `claim`, `task`, `payment` or `insuranceplan`. `protocol_status` takes one of `request.queued`, `request.dispatched` or `request.error`. The `error` fields stay empty when you accept.

### Acknowledge first, work later

```mermaid
graph LR
  D["Delivery arrives"] --> C["Check it is a well formed envelope"]
  C --> A["Return 202 with the body<br/>within 30 seconds"]
  A --> Q["Queue it"]
  Q --> W["Decrypt, validate, process"]
  W --> R["Send your answer later<br/>on the on_ path"]
```

Decrypting, validating FHIR and adjudicating can take longer than 30 seconds. So accept first, then do the work from a queue. If the work fails, send your answer as a `ProtocolResponse` with `x-hcx-status` set to `response.error`.

## How you know it worked

You have understood this when you can answer both of these.

1. Your callback handler decrypts and stores the bundle before it replies, and sometimes that takes 40 seconds. What does NHCX conclude, and what will it do next?
2. NHCX returns 202 to your claim submission. Which of the four legs does that close?

## When it goes wrong

**Replying late.** If NHCX gets no 202 within 30 seconds, it treats the delivery as failed and retries. See [retries and expiry](./retries-and-expiry.md).

**Replying with the wrong body or status.** A reply that does not follow the acceptance format counts as an error, and NHCX retries the same request. [NHCX-1015](../errors/nhcx-1015.md) and [NHCX-1017](../errors/nhcx-1017.md) report an invalid response from the receiver.

**Endpoint unreachable.** NHCX reports [NHCX-1001](../errors/nhcx-1001.md) to the sender. See [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md).
