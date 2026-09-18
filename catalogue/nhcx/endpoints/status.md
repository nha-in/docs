---
id: nhcx.endpoint.status
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v1/status
summary: >-
  Ask the claims exchange where one of your own sent messages stands, without sending
  it again.
sources:
- url: https://hcxsbx.abdm.gov.in/statushcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/statushcxservice.json
  hash: sha256:93b6355a234ef56607427fcdfa32da4921124180c9df08ecd73c8af8955c2adf
  fetched: '2026-09-14'
  note: 'API specification: statushcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/status.post description.'
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: 'NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet: Status, /v1/status rows.'
- url: https://hcxsbx.abdm.gov.in/images/bc1e7d077857fc0fa071.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-NHCX USECASE Postman Collection.zip
  hash: sha256:9d15daafa813d6d57e688fe800baa5a73d2540b8d0d12c6a1315f86a424817e4
  fetched: '2026-09-14'
  note: AWS(Sandbox)-NHCX USECASE Postman Collection, row 17 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. item /v1/status.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Acceptance scenario; Error scenario.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Q3.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. items 8.
related:
  endpoints:
  - nhcx.endpoint.on-status
  - nhcx.endpoint.session-token
  callbacks:
  - nhcx.callback.status
  - nhcx.callback.on-status
  - nhcx.callback.error
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.nhcx-1006
  - nhcx.error.nhcx-1011
  - nhcx.error.nhcx-1012
  concepts:
  - nhcx.concept.jwe-envelope
  - nhcx.concept.protocol-headers
  - nhcx.concept.message-identifiers
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.four-message-legs
  - nhcx.concept.status-lifecycle
  - nhcx.concept.retries-and-expiry
  flows:
  - nhcx.flow.status-check
  decisions:
  - nhcx.decision.status-poll-or-wait
  tests:
  - nhcx.test.provider-uc-13
  - nhcx.test.payer-uc-15
  sandbox:
  - nhcx.sandbox.environments-and-base-urls
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
  - nhcx.troubleshooting.everything-returns-401
---

# POST /v1/status

## In plain words

When an answer has not come back, `/v1/status` tells you whether [NHCX](../../shared/glossary/nhcx.md) still holds your message or has passed it to the recipient. It answers where the message is, not what was decided. You can only ask about messages you sent yourself.

Ask before you resend anything. Resending creates a duplicate.

## Before you start

- A session token that has not expired. See [the session token](../concepts/session-token.md).
- The `x-hcx-api_call_id` of the message you are asking about. Store every one you send.
- The participant code of that message's recipient, and its encryption certificate.
- A handler for [`/v1/on_status`](../callbacks/on-status.md), where the recipient's answer arrives.

## What happens

Your system calls NHCX on `/v1/status`. NHCX answers synchronously with the position of the message. If the recipient already has it, NHCX forwards the question ([receiving `/v1/status`](../callbacks/status.md)) and the recipient answers on [`/v1/on_status`](on-status.md).

### 1. Seal the question

The sealed payload is an empty string. Everything travels in the [protected header](../glossary/protected-header.md):

```json
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM",
  "x-hcx-sender_code": "<YOUR_PARTICIPANT_CODE>",
  "x-hcx-recipient_code": "<RECIPIENT_OF_THE_ORIGINAL_MESSAGE>",
  "x-hcx-api_call_id": "<NEW_UUID_FOR_THIS_CALL>",
  "x-hcx-request_id": "<REQUEST_UUID>",
  "x-hcx-correlation_id": "<API_CALL_ID_OF_THE_MESSAGE_YOU_ARE_CHECKING>",
  "x-hcx-timestamp": "<CURRENT_TIMESTAMP>",
  "x-hcx-status": "request.initiated",
  "x-hcx-ben-abha-id": "<BENEFICIARY_ABHA_NUMBER>"
}
```

Set `x-hcx-correlation_id` to the `x-hcx-api_call_id` of the message you are checking. When the first message of a cycle uses its API call id as its correlation id, the two values are the same. The `x-hcx-*` values ride inside the JWE [protected header](../glossary/protected-header.md), not as HTTP headers. [The protocol headers](../concepts/protocol-headers.md) explains each one, including the timestamp format.

### 2. Send it

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/v1/status' \
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

A status call changes nothing, so you may repeat it. Give each attempt a new `x-hcx-api_call_id`. Space the attempts out rather than polling in a loop.

## How you know it worked

You receive HTTP `202 Accepted` with this body:

```json
{
  "timestamp": "<DD/MM/YYYY hh:mm:ss:sss>",
  "api_call_id": "<YOUR_API_CALL_ID>",
  "correlation_id": "<YOUR_CORRELATION_ID>",
  "result": {
    "sender_code": "<YOUR_PARTICIPANT_CODE>",
    "recipient_code": "<RECIPIENT_OF_THE_ORIGINAL_MESSAGE>",
    "entity_type": "<ENTITY_TYPE_OF_THE_MESSAGE>",
    "protocol_status": "request.dispatched"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```

- `result.protocol_status` `request.queued` means NHCX still holds the message. No callback follows. Wait, then ask again.
- `result.protocol_status` `request.dispatched` means the recipient has it. An answer arrives on [`/v1/on_status`](../callbacks/on-status.md).
- `error.code` and `error.message` are empty.

The step is done when you hold one of those two values for the message you asked about.

## When it goes wrong

- [`NHCX-1012`](../errors/nhcx-1012.md): no record for that API call id. You sent a new UUID as the correlation id instead of the checked message's `x-hcx-api_call_id`, or the original never landed.
- [`NHCX-1006`](../errors/nhcx-1006.md): you resent the original request after `request.queued`. Ask again instead of resending.
- Nothing is found for a message that failed delivery five times. NHCX deleted it and reported it on your `/v1/error`. Start a new cycle with a new correlation id.
- [`NHCX-1011`](../errors/nhcx-1011.md): `x-hcx-status` is not `request.initiated`.
- `401 Unauthorized` or [`NHCX-401`](../errors/nhcx-401.md): get a new session token and ask again.
