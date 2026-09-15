---
id: nhcx.endpoint.preauth-submit
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v1/preauth/submit
summary: >-
  Ask an insurer, through the claims exchange, to approve a treatment before it
  happens, and get a receipt while the decision follows later.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: 'NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet: Preauth, /v1/preauth/submit rows.'
- url: https://hcxsbx.abdm.gov.in/preauthhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/preauthhcxservice.json
  hash: sha256:2e8c594c51d9640ae4a576be34a5d190614918d1e7697d6718bc91c31fa66948
  fetched: '2026-09-14'
  note: 'API specification: preauthhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/preauth/submit.post.'
- url: https://hcxsbx.abdm.gov.in/images/bc1e7d077857fc0fa071.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-NHCX USECASE Postman Collection.zip
  hash: sha256:9d15daafa813d6d57e688fe800baa5a73d2540b8d0d12c6a1315f86a424817e4
  fetched: '2026-09-14'
  note: AWS(Sandbox)-NHCX USECASE Postman Collection, row 17 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. item /v1/preauth/submit.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Acceptance scenario.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, workflow ids 12, 13 and 131.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2 Q3; page 4 Q12 and Q14.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. items 6, 7 and 8.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 5 table 5.1; page 6 API Flows.
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.preauth-on-submit
  - nhcx.endpoint.coverageeligibility-check
  - nhcx.endpoint.participant-get-policies
  - nhcx.endpoint.dummy-payer-process-request
  - nhcx.endpoint.abha-biometric-auth-verify
  - nhcx.endpoint.session-token
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.status
  callbacks:
  - nhcx.callback.preauth-submit
  - nhcx.callback.preauth-on-submit
  - nhcx.callback.communication-request
  - nhcx.callback.error
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.nhcx-1003
  - nhcx.error.nhcx-1006
  - nhcx.error.nhcx-1011
  - nhcx.error.nhcx-1012
  - nhcx.error.payr-1001
  - nhcx.error.payr-1256
  - nhcx.error.payr-1238
  concepts:
  - nhcx.concept.jwe-envelope
  - nhcx.concept.protocol-headers
  - nhcx.concept.message-identifiers
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.four-message-legs
  - nhcx.concept.claim-cycle
  - nhcx.concept.workflow-codes
  - nhcx.concept.biometric-authentication
  flows:
  - nhcx.flow.preauth-submit
  - nhcx.flow.preauth-enhancement
  - nhcx.flow.preauth-query-response
  fhir:
  - nhcx.fhir.preauth-request
  - nhcx.fhir.preauth-enhancement
  - nhcx.fhir.query-update
  tests:
  - nhcx.test.provider-uc-07
  - nhcx.test.tc-pa-01
  - nhcx.test.tc-pa-02
  decisions:
  - nhcx.decision.preauth-or-predetermination
  sandbox:
  - nhcx.sandbox.dummy-payer
  - nhcx.sandbox.environments-and-base-urls
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
  - nhcx.troubleshooting.everything-returns-401
---

# POST /v1/preauth/submit

## In plain words

Pre-authorisation is the hospital's request for the insurer's approval of a specific treatment before it is given. Your system, as the provider, sends a Claim bundle with `use` `preauthorization` to [NHCX](../../shared/glossary/nhcx.md), sealed for the payer. NHCX gives you a receipt at once. The decision arrives later on your `/v1/preauth/on_submit`.

The same path carries a new request, a resubmission, an enhancement and your answer to a payer's query. `x-hcx-workflow_id` and `x-hcx-use_case` tell the payer which one it is.

## Before you start

- A session token that has not expired. See [the session token](../concepts/session-token.md) and [how to get one](session-token.md).
- Your own [participant code](../glossary/participant-code.md), with your callback address registered, reachable from NHCX and answering 202 within 30 seconds. See [callback URL rules](../sandbox/callback-url-requirements.md).
- The payer's participant code. Take it from `processingID` in the [`/participant/get/policies`](participant-get-policies.md) response, not from `PayerID`.
- The recipient's encryption certificate, fetched with [`/fetch/certs`](fetch-certs.md). You seal the message with its public key.
- A Claim bundle in [FHIR](../../shared/glossary/fhir.md) with `use` `preauthorization`, built as in [the preauthorisation request bundle](../fhir/preauth-request.md). Attach every document the eligibility answer or insurance plan asked for.
- A handler for [`/v1/error`](../callbacks/error.md), so a request NHCX cannot deliver does not look like one still under review.
- For a [PMJAY](../glossary/pmjay.md) case: a beneficiary token from [biometric authentication](abha-biometric-auth-verify.md), or the Authentication Consent questionnaire response.
- A handler for [`/v1/preauth/on_submit`](../callbacks/preauth-on-submit.md) and for [`/v1/communication/request`](../callbacks/communication-request.md), where payer queries can arrive.
- In the sandbox you can address the [dummy payer](../sandbox/dummy-payer.md), participant `1000003538@hcx`, which answers without a real insurer.

## What happens

Your system, as the provider, calls NHCX on `/v1/preauth/submit`. NHCX checks the envelope, answers 202 at once, and forwards the same path to the payer's registered address ([receiving `/v1/preauth/submit`](../callbacks/preauth-submit.md)). The payer answers later on [`/v1/preauth/on_submit`](../callbacks/preauth-on-submit.md), which NHCX delivers to you.

### 1. Seal the message

Put these values in the [JWE](../glossary/jwe.md) [protected header](../glossary/protected-header.md) and encrypt the bundle with the recipient's public key.

```json
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM",
  "x-hcx-sender_code": "<YOUR_PARTICIPANT_CODE>",
  "x-hcx-recipient_code": "<PAYER_PARTICIPANT_CODE>",
  "x-hcx-api_call_id": "<NEW_UUID_FOR_THIS_CALL>",
  "x-hcx-request_id": "<REQUEST_UUID>",
  "x-hcx-correlation_id": "<CORRELATION_UUID>",
  "x-hcx-workflow_id": "12",
  "x-hcx-use_case": "New",
  "x-hcx-timestamp": "<CURRENT_TIMESTAMP>",
  "x-hcx-status": "request.initiated",
  "x-hcx-ben-abha-id": "<BENEFICIARY_ABHA_NUMBER>"
}
```

The `x-hcx-*` values ride inside the JWE [protected header](../glossary/protected-header.md), not as HTTP headers. [The protocol headers](../concepts/protocol-headers.md) explains each one, including the timestamp format. Workflow `12` with use case `New` opens a new pre-authorisation. An enhancement is workflow `13` with use case `Enhancement`, and its query answer is `131`. Take the code for any other step from [workflow codes](../concepts/workflow-codes.md). Always send both headers, even though the envelope marks them optional.

### 2. Send it

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/v1/preauth/submit' \
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
    "recipient_code": "<PAYER_PARTICIPANT_CODE>",
    "entity_type": "preauth",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```

- `correlation_id` and `api_call_id` match the values you sealed.
- `result.entity_type` is `preauth`.
- `result.protocol_status` is `request.queued` or `request.dispatched`.
- `error.code` and `error.message` are empty.

The 202 is a receipt, not a decision. NHCX never returns a decision synchronously. The step is done when [`/v1/preauth/on_submit`](../callbacks/preauth-on-submit.md) reaches your callback address with the same `x-hcx-correlation_id`, and your handler has answered it 202 within 30 seconds. The payer may send an acknowledgement first and the decision later, each on the same correlation id.

## When it goes wrong

- [`PAYR-1256`](../errors/payr-1256.md): a new [PMJAY](../glossary/pmjay.md) pre-authorisation carries neither biometric authentication nor the consent questionnaire response.
- [`PAYR-1238`](../errors/payr-1238.md): the beneficiary already has an active pre-authorisation at this hospital. Cancel it or raise its claim first.
- `401 Unauthorized`, or [`NHCX-401`](../errors/nhcx-401.md): the session token expired or lacks the `Bearer ` prefix. Get a new token and send again. See [every call returns 401](../troubleshooting/everything-returns-401.md).
- [`NHCX-1003`](../errors/nhcx-1003.md): the recipient code is not registered. A provider used `PayerID` instead of `processingID`.
- [`NHCX-1006`](../errors/nhcx-1006.md): the correlation id was used before. Start the cycle with a new one.
- [`NHCX-1011`](../errors/nhcx-1011.md): `x-hcx-status` is not `request.initiated`.
