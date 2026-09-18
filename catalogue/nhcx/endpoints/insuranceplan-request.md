---
id: nhcx.endpoint.insuranceplan-request
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v1/insuranceplan/request
summary: >-
  Ask an insurer, through the claims exchange, for the machine-readable terms of
  a policy at your hospital: packages, rates and required documents.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: 'NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet: Insurance Plan, /v1/insuranceplan/request rows.'
- url: https://hcxsbx.abdm.gov.in/insuranceplanhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/insuranceplanhcxservice.json
  hash: sha256:03665c6e6a5c8d86e3d621ab577dd683cf13c155d5b9529f5be6ca70fef13dee
  fetched: '2026-09-14'
  note: 'API specification: insuranceplanhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/insuranceplan/request.post.'
- url: https://hcxsbx.abdm.gov.in/images/bc1e7d077857fc0fa071.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-NHCX USECASE Postman Collection.zip
  hash: sha256:9d15daafa813d6d57e688fe800baa5a73d2540b8d0d12c6a1315f86a424817e4
  fetched: '2026-09-14'
  note: AWS(Sandbox)-NHCX USECASE Postman Collection, row 17 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. item /v1/insuranceplan/request.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Acceptance scenario.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Insurance Plan.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 6.1 Recommended Integration Points; 6.3 Business Conditions.
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
related:
  endpoints:
  - nhcx.endpoint.insuranceplan-on-request
  - nhcx.endpoint.participant-get-policies
  - nhcx.endpoint.session-token
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.status
  callbacks:
  - nhcx.callback.insuranceplan-request
  - nhcx.callback.insuranceplan-on-request
  - nhcx.callback.error
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.nhcx-1003
  - nhcx.error.nhcx-1006
  - nhcx.error.nhcx-1011
  - nhcx.error.nhcx-1012
  - nhcx.error.payr-1001
  - nhcx.error.payr-1406
  concepts:
  - nhcx.concept.jwe-envelope
  - nhcx.concept.protocol-headers
  - nhcx.concept.message-identifiers
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.four-message-legs
  - nhcx.concept.insurance-plan
  flows:
  - nhcx.flow.insurance-plan-request
  fhir:
  - nhcx.fhir.insurance-plan-bundle
  - nhcx.fhir.pmjay-insurance-plan
  tests:
  - nhcx.test.provider-uc-06
  - nhcx.test.tc-hbp-01
  sandbox:
  - nhcx.sandbox.dummy-payer
  - nhcx.sandbox.environments-and-base-urls
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
  - nhcx.troubleshooting.everything-returns-401
---

# POST /v1/insuranceplan/request

## In plain words

A hospital asks the insurer for the policy's terms as data, not as a PDF. The answer, an InsurancePlan, lists the specialities, packages, rates, claim conditions and mandatory documents that apply at your hospital. Your system, as the provider, sends the request to [NHCX](../../shared/glossary/nhcx.md) sealed for the payer. The plan arrives later on your `/v1/insuranceplan/on_request`.

Call it before cost estimation and before any pre-authorisation for that payer and policy.

## Before you start

- A session token that has not expired. See [the session token](../concepts/session-token.md) and [how to get one](session-token.md).
- Your own [participant code](../glossary/participant-code.md), with your callback address registered, reachable from NHCX and answering 202 within 30 seconds. See [callback URL rules](../sandbox/callback-url-requirements.md).
- The payer's participant code. Take it from `processingID` in the [`/participant/get/policies`](participant-get-policies.md) response, not from `PayerID`.
- The recipient's encryption certificate, fetched with [`/fetch/certs`](fetch-certs.md). You seal the message with its public key.
- A Task bundle in [FHIR](../../shared/glossary/fhir.md) with `code` `poll` and at least one input: the policy number, your provider id, or both. See [the InsurancePlan request bundle](../fhir/insurance-plan-bundle.md).
- A handler for [`/v1/error`](../callbacks/error.md), so a request NHCX cannot deliver does not look like one still under review.
- A handler for [`/v1/insuranceplan/on_request`](../callbacks/insuranceplan-on-request.md).
- In the sandbox you can address the [dummy payer](../sandbox/dummy-payer.md), participant `1000003538@hcx`, which answers without a real insurer. With the dummy payer, use provider id `32722` inside the bundle and policy number `100217`.

## What happens

Your system, as the provider, calls NHCX on `/v1/insuranceplan/request`. NHCX checks the envelope, answers 202 at once, and forwards the same path to the payer's registered address ([receiving `/v1/insuranceplan/request`](../callbacks/insuranceplan-request.md)). The payer answers later on [`/v1/insuranceplan/on_request`](../callbacks/insuranceplan-on-request.md), which NHCX delivers to you.

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
  "x-hcx-timestamp": "<CURRENT_TIMESTAMP>",
  "x-hcx-status": "request.initiated",
  "x-hcx-ben-abha-id": "<BENEFICIARY_ABHA_NUMBER>"
}
```

The `x-hcx-*` values ride inside the JWE [protected header](../glossary/protected-header.md), not as HTTP headers. [The protocol headers](../concepts/protocol-headers.md) explains each one, including the timestamp format. `x-hcx-workflow_id` is optional on this call.

### 2. Send it

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/v1/insuranceplan/request' \
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
    "entity_type": "insuranceplan",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```

- `correlation_id` and `api_call_id` match the values you sealed.
- `result.entity_type` is `insuranceplan`.
- `result.protocol_status` is `request.queued` or `request.dispatched`.
- `error.code` and `error.message` are empty.

The 202 is a receipt, not a decision. NHCX never returns a decision synchronously. The step is done when [`/v1/insuranceplan/on_request`](../callbacks/insuranceplan-on-request.md) reaches your callback address with the same `x-hcx-correlation_id`, and your handler has answered it 202 within 30 seconds. An empty plan is a valid answer when no coverage matches the policy and hospital.

## When it goes wrong

- [`PAYR-1406`](../errors/payr-1406.md): an earlier request with the same payer is still in progress. Wait 15 to 60 minutes for it to finish, then send again.
- `401 Unauthorized`, or [`NHCX-401`](../errors/nhcx-401.md): the session token expired or lacks the `Bearer ` prefix. Get a new token and send again. See [every call returns 401](../troubleshooting/everything-returns-401.md).
- [`NHCX-1003`](../errors/nhcx-1003.md): the recipient code is not registered. A provider used `PayerID` instead of `processingID`.
- [`NHCX-1006`](../errors/nhcx-1006.md): the correlation id was used before. Start the cycle with a new one.
- [`NHCX-1011`](../errors/nhcx-1011.md): `x-hcx-status` is not `request.initiated`.
- You got 202 and nothing more arrives. The recipient may have failed to decrypt ([`PAYR-1001`](../errors/payr-1001.md)) or your callback is unreachable. See [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md).
