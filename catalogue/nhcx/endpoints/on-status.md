---
id: nhcx.endpoint.on-status
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v1/on_status
summary: >-
  Tell a participant who asked about one of its messages that the message has reached
  you.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: 'NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet: Status, /v1/on_status rows.'
- url: https://hcxsbx.abdm.gov.in/images/bc1e7d077857fc0fa071.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-NHCX USECASE Postman Collection.zip
  hash: sha256:9d15daafa813d6d57e688fe800baa5a73d2540b8d0d12c6a1315f86a424817e4
  fetched: '2026-09-14'
  note: AWS(Sandbox)-NHCX USECASE Postman Collection, row 17 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. item /v1/on_status.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1 Acceptance and Error scenario; page 2.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 4, Q14.
related:
  endpoints:
  - nhcx.endpoint.status
  - nhcx.endpoint.session-token
  callbacks:
  - nhcx.callback.status
  - nhcx.callback.on-status
  - nhcx.callback.error
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.nhcx-1010
  - nhcx.error.nhcx-1011
  - nhcx.error.nhcx-1012
  - nhcx.error.payr-1517
  concepts:
  - nhcx.concept.jwe-envelope
  - nhcx.concept.protocol-headers
  - nhcx.concept.message-identifiers
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.four-message-legs
  - nhcx.concept.retries-and-expiry
  - nhcx.concept.status-lifecycle
  flows:
  - nhcx.flow.status-check
  tests:
  - nhcx.test.payer-uc-15
  troubleshooting:
  - nhcx.troubleshooting.duplicate-or-mismatched-correlation
  - nhcx.troubleshooting.everything-returns-401
---

# POST /v1/on_status

## In plain words

A participant that sent you a message can ask [NHCX](../../shared/glossary/nhcx.md) where it stands with [`/v1/status`](status.md). When the message has reached you, NHCX forwards the question to you. You answer on `/v1/on_status`, and NHCX delivers the answer to the participant that asked.

The answer reports delivery, not a decision. The sealed payload is an empty string.

## Before you start

- A session token that has not expired. See [the session token](../concepts/session-token.md).
- The `/v1/status` you are answering, received on [your registered address](../callbacks/status.md), decrypted, and acknowledged with 202 within 30 seconds.
- That request's `x-hcx-correlation_id` and `x-hcx-sender_code`, stored. You echo the first and address the answer to the second.
- The encryption certificate of the participant that asked, fetched with [`/fetch/certs`](fetch-certs.md).
- Nothing to build. The sealed payload is an empty string.
- A handler for [`/v1/error`](../callbacks/error.md), where NHCX reports an answer it could not deliver.

## What happens

Your system, as the recipient of the original message, answers a request it received ([receiving the request](../callbacks/status.md)) by calling NHCX on `/v1/on_status`. NHCX answers 202 at once and delivers the same path to the registered address of the participant that asked ([receiving `/v1/on_status`](../callbacks/on-status.md)).

### 1. Seal the answer

Swap the sender and recipient codes of the request. Echo its correlation id. Put these values in the [JWE](../glossary/jwe.md) [protected header](../glossary/protected-header.md):

```json
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM",
  "x-hcx-sender_code": "<YOUR_PARTICIPANT_CODE>",
  "x-hcx-recipient_code": "<REQUESTER_PARTICIPANT_CODE_FROM_THE_REQUEST>",
  "x-hcx-api_call_id": "<NEW_UUID_FOR_THIS_CALL>",
  "x-hcx-request_id": "<REQUEST_UUID>",
  "x-hcx-correlation_id": "<CORRELATION_ID_OF_THE_STATUS_REQUEST>",
  "x-hcx-timestamp": "<CURRENT_TIMESTAMP>",
  "x-hcx-status": "request.dispatched",
  "x-hcx-ben-abha-id": "<BENEFICIARY_ABHA_NUMBER>"
}
```

Send `request.dispatched`: the message the participant asked about has reached you. The correlation id is that of the status request, not of the original message. The `x-hcx-*` values ride inside the JWE [protected header](../glossary/protected-header.md), not as HTTP headers. [The protocol headers](../concepts/protocol-headers.md) explains each one, including the timestamp format.

### 2. Send it

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/v1/on_status' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --data-raw '{
    "type": "JWEPayload",
    "payload": "<JWE_COMPACT_STRING>"
  }'
```

Send the token on both `bearer_auth` and `Authorization`, with the same value and the word `Bearer` in front. `<JWE_COMPACT_STRING>` is your sealed message: five base64url parts joined by dots. See [the JWE envelope](../concepts/jwe-envelope.md).

### 3. Refusing a request

To refuse the request at protocol level instead, send `"type": "ProtocolResponse"` on this path with `x-hcx-status` `response.error` and `x-hcx-error_details` holding `code`, `message` and `trace`. Keep clinical and business reasons inside the sealed payload. Only protocol errors go in the header.

### 4. Retrying

**Idempotency.** Echo the `x-hcx-correlation_id` of the request you are answering. A correlation id NHCX does not hold, or one it has already deleted, is refused with [`NHCX-1010`](../errors/nhcx-1010.md). Generate a new `x-hcx-api_call_id` for every call. `/v1/status` looks a message up by that value ([`NHCX-1012`](../errors/nhcx-1012.md) when it cannot), so never reuse one.

## How you know it worked

You receive HTTP `202 Accepted` with the acknowledgement body: `timestamp`, `api_call_id`, `correlation_id`, `result` and an empty `error`.

- `correlation_id` matches the status request you answered.
- `error.code` and `error.message` are empty.

NHCX then delivers your answer to the participant that asked. The recipient must answer each delivery with 202 and the acknowledgement body within 30 seconds. Otherwise NHCX retries up to five times, then deletes the request and reports it on the sender's [`/v1/error`](../callbacks/error.md). The step is done when you hold the 202 and no report for this correlation id arrives on your `/v1/error`.

## When it goes wrong

- [`NHCX-1010`](../errors/nhcx-1010.md): NHCX holds no request with that correlation id. You minted a new one instead of echoing it, or the request was deleted after failed deliveries.
- [`NHCX-1011`](../errors/nhcx-1011.md): `x-hcx-status` is not `response.complete`, `response.partial` or `response.error`.
- [`PAYR-1517`](../errors/payr-1517.md): a refusal arrived as a `JWEPayload`. Protocol refusals travel as `ProtocolResponse`.
- `401 Unauthorized`, or [`NHCX-401`](../errors/nhcx-401.md): get a new session token and send again.
- A report arrives on your [`/v1/error`](../callbacks/error.md): the requester's address did not acknowledge five deliveries. The request is dead on that correlation id.
