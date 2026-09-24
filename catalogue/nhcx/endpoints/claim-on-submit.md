---
id: nhcx.endpoint.claim-on-submit
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v1/claim/on_submit
summary: >-
  Send an insurer's decision on a hospital's claim back to that hospital through
  the claims exchange.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: 'NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet: Claim, /v1/claim/on_submit rows.'
- url: https://hcxsbx.abdm.gov.in/claimhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/claimhcxservice.json
  hash: sha256:488eea449c6ee45dc324f4f7c095a862c7d50d0e238075846122b51b2bab4878
  fetched: '2026-09-14'
  note: 'API specification: claimhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/claim/on_submit.post.'
- url: https://hcxsbx.abdm.gov.in/images/bc1e7d077857fc0fa071.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-NHCX USECASE Postman Collection.zip
  hash: sha256:9d15daafa813d6d57e688fe800baa5a73d2540b8d0d12c6a1315f86a424817e4
  fetched: '2026-09-14'
  note: AWS(Sandbox)-NHCX USECASE Postman Collection, row 17 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. item /v1/claim/on_submit.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1 Acceptance and Error scenario; page 2.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, workflow ids 25, 26, 27, 28 and 29.
- url: https://hcxsbx.abdm.gov.in/images/064cf2e059987011e53a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Claim.pdf
  hash: sha256:66290de20d57d69e681946a0101518092ca43b3775bb38997c43beb17fb38076
  fetched: '2026-09-14'
  note: Claim, listed on https://hcxsbx.abdm.gov.in/#/documents, not named in the NHCX document sheet. page 2, items 4 to 6.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Message Structure, Status Description.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 4, Q14.
related:
  endpoints:
  - nhcx.endpoint.claim-submit
  - nhcx.endpoint.paymentnotice-request
  - nhcx.endpoint.session-token
  - nhcx.endpoint.fetch-certs
  callbacks:
  - nhcx.callback.claim-submit
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
  - nhcx.concept.claim-cycle
  - nhcx.concept.workflow-codes
  flows:
  - nhcx.flow.claim-submit
  - nhcx.flow.claim-query-response
  fhir:
  - nhcx.fhir.claim-response
  tests:
  - nhcx.test.payer-uc-11
  troubleshooting:
  - nhcx.troubleshooting.duplicate-or-mismatched-correlation
  - nhcx.troubleshooting.everything-returns-401
---

# POST /v1/claim/on_submit

## In plain words

This carries the payer's decision on a claim, often in stages. As a payer, you send a sealed ClaimResponse bundle to [NHCX](../../shared/glossary/nhcx.md), which delivers it to the provider. Interim answers keep the claim open. A final answer closes it.

You call it after you have received a [`/v1/claim/submit`](claim-submit.md). An approved claim is followed by [payment notices](paymentnotice-request.md).

## Before you start

- A session token that has not expired. See [the session token](../concepts/session-token.md).
- The `/v1/claim/submit` you are answering, received on [your registered address](../callbacks/claim-submit.md), decrypted, and acknowledged with 202 within 30 seconds.
- That request's `x-hcx-correlation_id` and `x-hcx-sender_code`, stored. You echo the first and address the answer to the second.
- The encryption certificate of the provider, fetched with [`/fetch/certs`](fetch-certs.md).
- A ClaimResponse bundle in [FHIR](../../shared/glossary/fhir.md), built as in [the claim response bundle](../fhir/claim-response.md).
- A handler for [`/v1/error`](../callbacks/error.md), where NHCX reports an answer it could not deliver.

## What happens

Your system, as the payer or a TPA acting for it, answers a request it received ([receiving the request](../callbacks/claim-submit.md)) by calling NHCX on `/v1/claim/on_submit`. NHCX answers 202 at once and delivers the same path to the registered address of the provider ([receiving `/v1/claim/on_submit`](../callbacks/claim-on-submit.md)).

### 1. Seal the answer

Swap the sender and recipient codes of the request. Echo its correlation id. Put these values in the [JWE](../glossary/jwe.md) [protected header](../glossary/protected-header.md):

```json
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM",
  "x-hcx-sender_code": "<YOUR_PARTICIPANT_CODE>",
  "x-hcx-recipient_code": "<PROVIDER_PARTICIPANT_CODE_FROM_THE_REQUEST>",
  "x-hcx-api_call_id": "<NEW_UUID_FOR_THIS_CALL>",
  "x-hcx-request_id": "<REQUEST_UUID>",
  "x-hcx-correlation_id": "<CORRELATION_ID_OF_THE_REQUEST>",
  "x-hcx-workflow_id": "26",
  "x-hcx-timestamp": "<CURRENT_TIMESTAMP>",
  "x-hcx-status": "response.complete",
  "x-hcx-ben-abha-id": "<BENEFICIARY_ABHA_NUMBER>"
}
```

Interim answers carry `response.partial`: `25` received, `28` in process, `29` forwarded. `27` raises a query. `26` approves with `response.complete`. After a `response.complete`, send nothing more on that claim. The `x-hcx-*` values ride inside the JWE [protected header](../glossary/protected-header.md), not as HTTP headers. [The protocol headers](../concepts/protocol-headers.md) explains each one, including the timestamp format.

### 2. Send it

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/v1/claim/on_submit' \
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
    "recipient_code": "<PROVIDER_PARTICIPANT_CODE_FROM_THE_REQUEST>",
    "entity_type": "claim",
    "protocol_status": "request.dispatched"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```

- `correlation_id` matches the request you answered, and `api_call_id` matches the value you sealed.
- `result.entity_type` is `claim`.
- `error.code` and `error.message` are empty.

NHCX then delivers your answer to the provider. The recipient must answer each delivery with 202 and the acknowledgement body within 30 seconds. Otherwise NHCX retries up to five times, then deletes the request and reports it on the sender's [`/v1/error`](../callbacks/error.md). The step is done when you hold the 202 and no report for this correlation id arrives on your `/v1/error`.

## When it goes wrong

- [`NHCX-1010`](../errors/nhcx-1010.md): NHCX holds no request with that correlation id. You minted a new one instead of echoing it, or the request was deleted after failed deliveries.
- [`NHCX-1011`](../errors/nhcx-1011.md): `x-hcx-status` is not `response.complete`, `response.partial` or `response.error`.
- [`PAYR-1517`](../errors/payr-1517.md): a refusal arrived as a `JWEPayload`. Protocol refusals travel as `ProtocolResponse`.
- `401 Unauthorized`, or [`NHCX-401`](../errors/nhcx-401.md): get a new session token and send again.
- A report arrives on your [`/v1/error`](../callbacks/error.md): the requester's address did not acknowledge five deliveries. The request is dead on that correlation id.
