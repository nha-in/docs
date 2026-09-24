---
id: nhcx.endpoint.preauth-on-submit
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v1/preauth/on_submit
summary: >-
  Send an insurer's decision on a pre-approval request back to the hospital through
  the claims exchange.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: 'NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet: Preauth, /v1/preauth/on_submit rows.'
- url: https://hcxsbx.abdm.gov.in/preauthhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/preauthhcxservice.json
  hash: sha256:2e8c594c51d9640ae4a576be34a5d190614918d1e7697d6718bc91c31fa66948
  fetched: '2026-09-14'
  note: 'API specification: preauthhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/preauth/on_submit.post.'
- url: https://hcxsbx.abdm.gov.in/images/bc1e7d077857fc0fa071.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-NHCX USECASE Postman Collection.zip
  hash: sha256:9d15daafa813d6d57e688fe800baa5a73d2540b8d0d12c6a1315f86a424817e4
  fetched: '2026-09-14'
  note: AWS(Sandbox)-NHCX USECASE Postman Collection, row 17 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. item /v1/preauth/on_submit.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1 Acceptance and Error scenario; page 2.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, workflow ids 20, 21, 22, 23, 24 and 241.
- url: https://hcxsbx.abdm.gov.in/images/3799f26f2a0b2c9a80c5.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Preauthorization.pdf
  hash: sha256:75d5628e7dd8a8e1a55c4ab3836c0591088ba378a8cd498e8277d83911129439
  fetched: '2026-09-14'
  note: Preauthorization, listed on https://hcxsbx.abdm.gov.in/#/documents, not named in the NHCX document sheet. page 2, items 5 and 6.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.2 Preauth Lifecycle; 8.5 Response ClaimResponse Bundle.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 4, Q14.
related:
  endpoints:
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.communication-request
  - nhcx.endpoint.session-token
  - nhcx.endpoint.fetch-certs
  callbacks:
  - nhcx.callback.preauth-submit
  - nhcx.callback.preauth-on-submit
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
  - nhcx.flow.preauth-submit
  - nhcx.flow.preauth-enhancement
  - nhcx.flow.preauth-query-response
  fhir:
  - nhcx.fhir.preauth-response
  - nhcx.fhir.preauth-enhancement
  tests:
  - nhcx.test.payer-uc-09
  troubleshooting:
  - nhcx.troubleshooting.duplicate-or-mismatched-correlation
  - nhcx.troubleshooting.everything-returns-401
---

# POST /v1/preauth/on_submit

## In plain words

This carries the payer's decision on a pre-authorisation: approved, partly approved, queried or rejected. As a payer, you send a sealed ClaimResponse bundle to [NHCX](../../shared/glossary/nhcx.md), which delivers it to the provider. An approval carries the `preAuthRef` the hospital needs for its claim.

You call it after you have received a [`/v1/preauth/submit`](preauth-submit.md). You may call it more than once for one request, for example an acknowledgement first and the decision later.

## Before you start

- A session token that has not expired. See [the session token](../concepts/session-token.md).
- The `/v1/preauth/submit` you are answering, received on [your registered address](../callbacks/preauth-submit.md), decrypted, and acknowledged with 202 within 30 seconds.
- That request's `x-hcx-correlation_id` and `x-hcx-sender_code`, stored. You echo the first and address the answer to the second.
- The encryption certificate of the provider, fetched with [`/fetch/certs`](fetch-certs.md).
- A ClaimResponse bundle in [FHIR](../../shared/glossary/fhir.md), built as in [the preauthorisation response bundle](../fhir/preauth-response.md), with `preAuthRef` on an approval and `processNote` explaining any reduction.
- A handler for [`/v1/error`](../callbacks/error.md), where NHCX reports an answer it could not deliver.

## What happens

Your system, as the payer or a TPA acting for it, answers a request it received ([receiving the request](../callbacks/preauth-submit.md)) by calling NHCX on `/v1/preauth/on_submit`. NHCX answers 202 at once and delivers the same path to the registered address of the provider ([receiving `/v1/preauth/on_submit`](../callbacks/preauth-on-submit.md)).

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
  "x-hcx-workflow_id": "21",
  "x-hcx-timestamp": "<CURRENT_TIMESTAMP>",
  "x-hcx-status": "response.complete",
  "x-hcx-ben-abha-id": "<BENEFICIARY_ABHA_NUMBER>"
}
```

`x-hcx-workflow_id` names the outcome: `20` received, `21` approved, `23` rejected, `24` queried. For an enhancement, `22` approved and `241` queried. [Workflow codes](../concepts/workflow-codes.md) gives the status that goes with each. The `x-hcx-*` values ride inside the JWE [protected header](../glossary/protected-header.md), not as HTTP headers. [The protocol headers](../concepts/protocol-headers.md) explains each one, including the timestamp format.

### 2. Send it

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/v1/preauth/on_submit' \
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
    "entity_type": "preauth",
    "protocol_status": "request.dispatched"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```

- `correlation_id` matches the request you answered, and `api_call_id` matches the value you sealed.
- `result.entity_type` is `preauth`.
- `error.code` and `error.message` are empty.

NHCX then delivers your answer to the provider. The recipient must answer each delivery with 202 and the acknowledgement body within 30 seconds. Otherwise NHCX retries up to five times, then deletes the request and reports it on the sender's [`/v1/error`](../callbacks/error.md). The step is done when you hold the 202 and no report for this correlation id arrives on your `/v1/error`.

## When it goes wrong

- [`NHCX-1010`](../errors/nhcx-1010.md): NHCX holds no request with that correlation id. You minted a new one instead of echoing it, or the request was deleted after failed deliveries.
- [`NHCX-1011`](../errors/nhcx-1011.md): `x-hcx-status` is not `response.complete`, `response.partial` or `response.error`.
- [`PAYR-1517`](../errors/payr-1517.md): a refusal arrived as a `JWEPayload`. Protocol refusals travel as `ProtocolResponse`.
- `401 Unauthorized`, or [`NHCX-401`](../errors/nhcx-401.md): get a new session token and send again.
- A report arrives on your [`/v1/error`](../callbacks/error.md): the requester's address did not acknowledge five deliveries. The request is dead on that correlation id.
