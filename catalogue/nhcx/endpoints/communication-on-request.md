---
id: nhcx.endpoint.communication-on-request
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v1/communication/on_request
summary: >-
  Answer an insurer's message about a case, for example with the documents it asked
  for, through the claims exchange.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: 'NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet: Communication (additional docs), /v1/communication/on_request rows.'
- url: https://hcxsbx.abdm.gov.in/communicationhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/communicationhcxservice.json
  hash: sha256:0ad58a98851158057d38d42a8327349548644c1b2f1a33b4f94acb4c1840a8a4
  fetched: '2026-09-14'
  note: 'API specification: communicationhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/communication/on_request.post.'
- url: https://hcxsbx.abdm.gov.in/images/bc1e7d077857fc0fa071.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-NHCX USECASE Postman Collection.zip
  hash: sha256:9d15daafa813d6d57e688fe800baa5a73d2540b8d0d12c6a1315f86a424817e4
  fetched: '2026-09-14'
  note: AWS(Sandbox)-NHCX USECASE Postman Collection, row 17 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. item /v1/communication/on_request.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1 Acceptance and Error scenario; page 2.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1 Preauth step 5; page 2 Communication steps 3 and 4.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 4, Q14.
related:
  endpoints:
  - nhcx.endpoint.communication-request
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.claim-submit
  - nhcx.endpoint.dummy-payer-process-request
  - nhcx.endpoint.session-token
  - nhcx.endpoint.fetch-certs
  callbacks:
  - nhcx.callback.communication-request
  - nhcx.callback.communication-on-request
  - nhcx.callback.preauth-on-submit
  - nhcx.callback.claim-on-submit
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
  - nhcx.concept.queries-and-communication
  flows:
  - nhcx.flow.preauth-query-response
  - nhcx.flow.claim-query-response
  tests:
  - nhcx.test.provider-uc-08
  sandbox:
  - nhcx.sandbox.dummy-payer
  troubleshooting:
  - nhcx.troubleshooting.duplicate-or-mismatched-correlation
  - nhcx.troubleshooting.everything-returns-401
---

# POST /v1/communication/on_request

## In plain words

When a payer sends you a communication request, you answer it here. Your system, as the provider, sends a sealed Task bundle with a Communication to [NHCX](../../shared/glossary/nhcx.md), carrying the documents or information the payer asked for. NHCX delivers it to the payer.

After a query, the payer's final decision arrives later on `/v1/preauth/on_submit` or `/v1/claim/on_submit`.

## Before you start

- A session token that has not expired. See [the session token](../concepts/session-token.md).
- The `/v1/communication/request` you are answering, received on [your registered address](../callbacks/communication-request.md), decrypted, and acknowledged with 202 within 30 seconds.
- That request's `x-hcx-correlation_id` and `x-hcx-sender_code`, stored. You echo the first and address the answer to the second.
- The encryption certificate of the payer, fetched with [`/fetch/certs`](fetch-certs.md).
- A Task bundle in [FHIR](../../shared/glossary/fhir.md) with a Communication whose `payload.contentAttachment` carries what the payer asked for.
- A handler for [`/v1/error`](../callbacks/error.md), where NHCX reports an answer it could not deliver.

## What happens

Your system, as the provider, answers a request it received ([receiving the request](../callbacks/communication-request.md)) by calling NHCX on `/v1/communication/on_request`. NHCX answers 202 at once and delivers the same path to the registered address of the payer ([receiving `/v1/communication/on_request`](../callbacks/communication-on-request.md)).

### 1. Seal the answer

Swap the sender and recipient codes of the request. Echo its correlation id. Put these values in the [JWE](../glossary/jwe.md) [protected header](../glossary/protected-header.md):

```json
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM",
  "x-hcx-sender_code": "<YOUR_PARTICIPANT_CODE>",
  "x-hcx-recipient_code": "<PAYER_PARTICIPANT_CODE_FROM_THE_REQUEST>",
  "x-hcx-api_call_id": "<NEW_UUID_FOR_THIS_CALL>",
  "x-hcx-request_id": "<REQUEST_UUID>",
  "x-hcx-correlation_id": "<CORRELATION_ID_OF_THE_REQUEST>",
  "x-hcx-timestamp": "<CURRENT_TIMESTAMP>",
  "x-hcx-status": "response.complete",
  "x-hcx-ben-abha-id": "<BENEFICIARY_ABHA_NUMBER>"
}
```

Send `response.complete`. The `x-hcx-*` values ride inside the JWE [protected header](../glossary/protected-header.md), not as HTTP headers. [The protocol headers](../concepts/protocol-headers.md) explains each one, including the timestamp format.

### 2. Send it

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/v1/communication/on_request' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --data-raw '{
    "type": "JWEPayload",
    "payload": "<JWE_COMPACT_STRING>"
  }'
```

Send the token on `bearer_auth`, with the word `Bearer` in front. `<JWE_COMPACT_STRING>` is your sealed message: five base64url parts joined by dots. See [the JWE envelope](../concepts/jwe-envelope.md).

### 3. Refusing a request

To refuse the request at protocol level instead, send `"type": "ProtocolResponse"` on this path with `x-hcx-status` `response.error` and `x-hcx-error_details` holding `code`, `message` and `trace`. Keep clinical and business reasons inside the sealed payload. Only protocol errors go in the header.

### 4. Retrying

**Idempotency.** Echo the `x-hcx-correlation_id` of the request you are answering. A correlation id NHCX does not hold, or one it has already deleted, is refused with [`NHCX-1010`](../errors/nhcx-1010.md). Generate a new `x-hcx-api_call_id` for every call. `/v1/status` looks a message up by that value ([`NHCX-1012`](../errors/nhcx-1012.md) when it cannot), so never reuse one.

## How you know it worked

You receive HTTP `202 Accepted` with this body:

```json
{
  "timestamp": "<DD/MM/YYYY hh:mm:ss:sss>",
  "api_call_id": "<YOUR_API_CALL_ID>",
  "correlation_id": "<YOUR_CORRELATION_ID>",
  "result": {
    "sender_code": "<YOUR_PARTICIPANT_CODE>",
    "recipient_code": "<PAYER_PARTICIPANT_CODE_FROM_THE_REQUEST>",
    "entity_type": "task",
    "protocol_status": "request.dispatched"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```

- `correlation_id` matches the request you answered, and `api_call_id` matches the value you sealed.
- `result.entity_type` is `task`.
- `error.code` and `error.message` are empty.

NHCX then delivers your answer to the payer. The recipient must answer each delivery with 202 and the acknowledgement body within 30 seconds. Otherwise NHCX retries up to five times, then deletes the request and reports it on the sender's [`/v1/error`](../callbacks/error.md). The step is done when you hold the 202 and no report for this correlation id arrives on your `/v1/error`. The payer's decision then arrives on [`/v1/preauth/on_submit`](../callbacks/preauth-on-submit.md) or [`/v1/claim/on_submit`](../callbacks/claim-on-submit.md).

## When it goes wrong

- [`NHCX-1010`](../errors/nhcx-1010.md): NHCX holds no request with that correlation id. You minted a new one instead of echoing it, or the request was deleted after failed deliveries.
- [`NHCX-1011`](../errors/nhcx-1011.md): `x-hcx-status` is not `response.complete`, `response.partial` or `response.error`.
- [`PAYR-1517`](../errors/payr-1517.md): a refusal arrived as a `JWEPayload`. Protocol refusals travel as `ProtocolResponse`.
- `401 Unauthorized`, or [`NHCX-401`](../errors/nhcx-401.md): get a new session token and send again.
- A report arrives on your [`/v1/error`](../callbacks/error.md): the requester's address did not acknowledge five deliveries. The request is dead on that correlation id.
