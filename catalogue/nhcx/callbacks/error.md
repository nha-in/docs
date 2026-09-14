---
id: nhcx.callback.error
type: callback
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Receiving POST /v1/error
summary: >-
  What your system receives when the claims exchange gives up delivering a request
  you sent, and what to do with the report.
sources:
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. items 2 and 8.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Error Handling.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Q14 and Q21 (Not getting call back).
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.status
  - nhcx.endpoint.participant-update
  callbacks:
  - nhcx.callback.on-status
  flows:
  - nhcx.flow.report-a-processing-error
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.status-check
  - nhcx.flow.receive-a-sealed-callback
  errors:
  - nhcx.error.nhcx-1001
  - nhcx.error.nhcx-1006
  - nhcx.error.nhcx-1014
  - nhcx.error.nhcx-1015
  concepts:
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.retries-and-expiry
  - nhcx.concept.jwe-envelope
  - nhcx.concept.protocol-headers
  - nhcx.concept.message-identifiers
  - nhcx.concept.participant-registry
  - nhcx.concept.encryption-certificate
  - nhcx.concept.four-message-legs
  - nhcx.concept.error-code-spaces
  - nhcx.concept.status-lifecycle
  troubleshooting:
  - nhcx.troubleshooting.callback-url-rejected
  - nhcx.troubleshooting.duplicate-or-mismatched-correlation
  - nhcx.troubleshooting.accepted-then-no-callback
  sandbox:
  - nhcx.sandbox.callback-url-requirements
  - nhcx.sandbox.support-contacts
  decisions:
  - nhcx.decision.key-encryption-algorithm
  glossary:
  - shared.glossary.nhcx
  - nhcx.glossary.jwe
  - nhcx.glossary.correlation-id
  - nhcx.glossary.api-call-id
  - nhcx.glossary.protected-header
  - nhcx.glossary.participant-code
  - nhcx.glossary.payer
  - nhcx.glossary.provider
  - shared.glossary.abha
---

# Receiving POST /v1/error

## In plain words

When [NHCX](../../shared/glossary/nhcx.md) cannot deliver a request you sent, it tells you on `POST /v1/error`. Every participant receives it: [providers](../glossary/provider.md) and [payers](../glossary/payer.md) alike. It arrives after NHCX has tried 5 times and given up. Without it, a dead request looks the same as a case still under review. Acknowledge the report within 30 seconds, then mark the case undelivered.

## Before you start

**Who receives it:** every participant, as the sender of the failed request. **Who sends it:** NHCX.

- Your participant record in the [participant registry](../concepts/participant-registry.md) holds an `endpoint_url`. [NHCX](../../shared/glossary/nhcx.md) posts to that address with `/v1/error` appended.
- You set `endpoint_url` when you register, in [sandbox onboarding](../flows/sandbox-onboarding.md). You change it with [`/participant/update`](../endpoints/participant-update.md).
- The URL uses a domain name over HTTPS. It has no IP address and no port number.
- The server behind it is in India. Your firewall accepts calls from the NHCX egress addresses in [callback URL rules](../sandbox/callback-url-requirements.md).
- Your handler answers within 30 seconds and does slow work afterwards. See [the 202 acknowledgement](../concepts/synchronous-acknowledgement.md).
- Your handler for this path accepts a plain JSON body. It does not expect a sealed payload.
- You store the `x-hcx-correlation_id` of every request you send, so a report can find its case.

## What happens

```mermaid
sequenceDiagram
    participant Y as Your system
    participant N as NHCX gateway
    participant R as Recipient system
    Y->>N: POST a request (sealed)
    N-->>Y: 202 Accepted
    loop Up to 5 attempts
        N->>R: POST the same request
        R-->>N: No valid receipt within 30 seconds
    end
    Note over N: Deletes the request and retires its correlation id
    N->>Y: POST /v1/error (reject details)
    Y-->>N: 202 Accepted with receipt, within 30 seconds
```

### Why it arrives

- A recipient must return 202 with the receipt for every delivery. A rejection, a late answer or a receipt in another shape counts as a failure.
- NHCX tries the same request 5 times. Then it deletes the request identified by the correlation id.
- The reject details come back to you, the sender, on `/v1/error`.
- The gateway validates protocol headers too, and can report a header failure to you asynchronously.

### What arrives

[NHCX](../../shared/glossary/nhcx.md) sends `POST <YOUR_ENDPOINT_URL>/v1/error`. The body is a protocol response in plain JSON, not a sealed payload:

```json
{
  "type": "ProtocolResponse",
  "x-hcx-sender_code": "<SENDER_CODE>",
  "x-hcx-recipient_code": "<YOUR_PARTICIPANT_CODE>",
  "x-hcx-api_call_id": "<API_CALL_ID_SET_BY_THE_SENDER>",
  "x-hcx-correlation_id": "<CORRELATION_ID_OF_YOUR_FAILED_REQUEST>",
  "x-hcx-workflow_id": "<WORKFLOW_ID>",
  "x-hcx-timestamp": "<TIME_THE_SENDER_SENT_IT>",
  "x-hcx-debug_flag": "Error",
  "x-hcx-status": "response.error",
  "x-hcx-redirect_to": "",
  "x-hcx-error_details": {
    "code": "<ERROR_CODE>",
    "message": "<ERROR_MESSAGE>",
    "trace": "<TRACE>"
  },
  "x-hcx-debug_details": {
    "code": "",
    "message": "",
    "trace": ""
  },
  "x-hcx-domain-header": {
    "use_case_name": "<USE_CASE_NAME>",
    "amt_processed": "<AMOUNT_PROCESSED>"
  },
  "x-hcx-entity-type": "<ENTITY_TYPE>",
  "x-hcx-ben-abha-id": "<BENEFICIARY_ABHA_NUMBER>"
}
```

- `x-hcx-correlation_id` names your failed request.
- `x-hcx-error_details.code` names the failure. Codes that start `NHCX-` come from the gateway; see [error code spaces](../concepts/error-code-spaces.md).
- [NHCX-1001](../errors/nhcx-1001.md) means the receiver system is not reachable.
- `x-hcx-entity-type` names the exchange: `coverageeligibility`, `payment`, `insuranceplan`, `task`, `claim` or `preauth`.

Store the body whole before you parse it. Do not refuse a body because it has fields you do not expect.

### What you send back

Answer the report first, before you act on it. Return HTTP status `202 Accepted` with this receipt:

```json
{
  "timestamp": "<CURRENT_TIME_AS_DD/MM/YYYY hh:mm:ss:sss>",
  "api_call_id": "<X_HCX_API_CALL_ID_FROM_THIS_DELIVERY>",
  "correlation_id": "<X_HCX_CORRELATION_ID_FROM_THIS_DELIVERY>",
  "result": {
    "sender_code": "<X_HCX_SENDER_CODE_FROM_THIS_DELIVERY>",
    "recipient_code": "<YOUR_PARTICIPANT_CODE>",
    "entity_type": "<X_HCX_ENTITY_TYPE_FROM_THE_REPORT>",
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
- `result.entity_type` repeats `x-hcx-entity-type` from the report.
- `result.protocol_status` is one of `request.queued`, `request.dispatched` or `request.error`.
- `error.code` and `error.message` stay empty when you accept the message.
- `timestamp` takes the form `DD/MM/YYYY hh:mm:ss:sss`.

### Repeat reports

NHCX expects your 202 and receipt within 30 seconds, as for every delivery. If the same report arrives twice, store it once and return the same receipt.

### What you do next

- Mark the case named by the correlation id as undelivered, so nobody waits for a decision that will not come.
- Fix the cause. For an unreachable recipient, wait until it is reachable, or contact [NHCX support](../sandbox/support-contacts.md).
- Send a fresh request with a new correlation id. The old one is inactive; reusing it is refused as [NHCX-1006](../errors/nhcx-1006.md).

## How you know it worked

- NHCX receives your HTTP 202 and receipt within 30 seconds of the report.
- The case named by `x-hcx-correlation_id` shows as undelivered in your system, with the error code stored.
- Your resubmission, under a new correlation id, gets a 202 from NHCX and later its answer on your callback.

## When it goes wrong

- **It never arrives.** The most common cause is that you do not host `/v1/error` at all, so failures pass unseen. Host it before any other asynchronous path. Then check the registration. The `endpoint_url` uses a domain name with no IP address or port. The server is in India, and your firewall accepts the addresses in [callback URL rules](../sandbox/callback-url-requirements.md). NHCX names a failure to deliver a protocol response to you as [NHCX-1014](../errors/nhcx-1014.md): unable to send protocol response to sender. If a case goes quiet with no report, ask with [`/v1/status`](../endpoints/status.md). `request.stopped` means the request is dead.
- **Your handler refuses the report.** It parsed the body against a fixed schema and returned an error. Store the body whole, return 202 with the receipt, and parse afterwards.
- **Your retry is refused as a duplicate.** You resent the request on its retired correlation id. That is [NHCX-1006](../errors/nhcx-1006.md). Send it again under a new correlation id.
- **The same recipient keeps failing.** Its endpoint is down or rejects deliveries. [NHCX-1001](../errors/nhcx-1001.md) and [NHCX-1015](../errors/nhcx-1015.md) name these conditions. Contact the recipient, or [NHCX support](../sandbox/support-contacts.md).
