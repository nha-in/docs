---
id: nhcx.flow.payer-process-a-request
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Receive, adjudicate and answer a request as a payer
summary: >-
  As an insurer or claims administrator, take a provider's request from the exchange,
  decide it, and send the sealed decision back on the paired answer path.
sources:
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use cases 7 to 15, API logic rows.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Acceptance scenario and error scenario.
- file: catalogue/openapi/.raw/nhcx-site-2026-09-14/not-on-site/External_NHCX_Payer_Service_API_Workflow_Guide.docx
  hash: sha256:1028d480d2fabe3204301f1c1b192a0077ddfa64f7f9084b01f73e004253fdd7
  fetched: '2026-09-05'
  note: NHCX Payer Service API Workflow Guide for External Integrators, not listed on hcxsbx.abdm.gov.in and not named in the NHCX document sheet, received separately. get/user-role, process/case and role table.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Communication.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Status Description.
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.coverageeligibility-on-check
  - nhcx.endpoint.insuranceplan-on-request
  - nhcx.endpoint.preauth-on-submit
  - nhcx.endpoint.claim-on-submit
  - nhcx.endpoint.task-on-submit
  - nhcx.endpoint.search-on-submit
  - nhcx.endpoint.communication-request
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.session-token
  - nhcx.endpoint.status
  - nhcx.endpoint.payer-service-get-user-role
  - nhcx.endpoint.payer-service-process-case
  callbacks:
  - nhcx.callback.coverageeligibility-check
  - nhcx.callback.insuranceplan-request
  - nhcx.callback.preauth-submit
  - nhcx.callback.claim-submit
  - nhcx.callback.task-submit
  - nhcx.callback.search-submit
  - nhcx.callback.communication-on-request
  - nhcx.callback.error
  - nhcx.callback.on-status
  flows:
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.report-a-processing-error
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.policy-link-and-delink
  concepts:
  - nhcx.concept.four-message-legs
  - nhcx.concept.message-identifiers
  - nhcx.concept.workflow-codes
  - nhcx.concept.status-lifecycle
  - nhcx.concept.queries-and-communication
  - nhcx.concept.claim-cycle
  decisions:
  - nhcx.decision.payer-implementation
  tests:
  - nhcx.test.payer-uc-07
  - nhcx.test.payer-uc-08
  - nhcx.test.payer-uc-09
  - nhcx.test.payer-uc-10
  - nhcx.test.payer-uc-11
  - nhcx.test.payer-uc-14
  - nhcx.test.payer-uc-15
  errors:
  - nhcx.error.payr-1001
  - nhcx.error.nhcx-1010
  glossary:
  - nhcx.glossary.payer
  - nhcx.glossary.adjudication
  - nhcx.glossary.tpa
---

# Receive, adjudicate and answer a request as a payer

## In plain words

As a [payer](../glossary/payer.md), you receive providers' requests from the [National Health Claims Exchange](../../shared/glossary/nhcx.md) (NHCX): eligibility checks, pre-authorisations, claims and more. Each arrives at your registered address on the request path, for example `/v1/preauth/submit`. You acknowledge it at once, decide it in your own time, and send the decision back on the paired answer path, for example `/v1/preauth/on_submit`.

The decision is sealed for the provider. If you cannot process the request at all, you send an unsealed `ProtocolResponse` instead.

## Before you start

- You are onboarded as a payer or [TPA](../glossary/tpa.md). Your registered address serves the request paths for your use cases, and `/v1/error`. See [Onboard as a participant in production](production-onboarding.md).
- Your private key matches the certificate in your participant record.
- Your policies are linked, so providers can find them. See [Link and de-link an ABHA and a policy](policy-link-and-delink.md).
- You hold a session token.
- You can validate bundles against the [NRCeS](../../shared/glossary/nrces.md) profiles.

| Request you receive | Answer you send | What the answer carries |
|---|---|---|
| `/v1/coverageeligibility/check` | `/v1/coverageeligibility/on_check` | Eligibility and plan details |
| `/v1/insuranceplan/request` | `/v1/insuranceplan/on_request` | The insurance plan details |
| `/v1/preauth/submit` | `/v1/preauth/on_submit` | The adjudicated pre-authorisation |
| `/v1/claim/submit` | `/v1/claim/on_submit` | The adjudicated claim |
| `/v1/search/submit` | `/v1/search/on_submit` | The claim responses that match the criteria |
| `/v1/task/submit` | `/v1/task/on_submit` | The answer to a reprocess or cancel task |

## What happens

```mermaid
sequenceDiagram
    participant Prov as Provider
    participant NHCX as NHCX exchange
    participant You as Your payer endpoint
    participant PS as NHCX participant service
    participant Rev as Reviewer acting for the payer
    participant PSvc as PMJAY payer service
    Prov->>NHCX: POST /v1/preauth/submit
    NHCX->>You: POST /v1/preauth/submit
    You-->>NHCX: 202 with the acceptance body, within 30 seconds
    Note over You: decrypt with your private key and validate the bundle
    opt More information needed
        You->>NHCX: POST /v1/communication/request
        NHCX->>Prov: POST /v1/communication/request
        Prov->>NHCX: POST /v1/communication/on_request
        NHCX->>You: POST /v1/communication/on_request
    end
    opt A PMJAY case held in the PMJAY payer service
        Rev->>PSvc: POST /pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role
        PSvc-->>Rev: the role that holds the case
        Rev->>PSvc: POST /pmjay/hcx/nhcxpayerservice/wrapper/process/case
    end
    Note over You: the decision is ready
    You->>PS: POST /fetch/certs with the provider code
    PS-->>You: the provider's certificate
    You->>NHCX: POST /v1/preauth/on_submit with the sealed decision
    NHCX-->>You: 202
    NHCX->>Prov: POST /v1/preauth/on_submit
    opt Delivery to the provider fails five times
        NHCX->>You: POST /v1/error
    end
```

### 1. Receive and acknowledge

Acknowledge within 30 seconds, before any processing. Follow [Receive, open and acknowledge a sealed message](receive-a-sealed-callback.md).

### 2. Open and validate

Decrypt the payload with your private key. Validate the bundle against the NRCeS profiles.

If you cannot decrypt it, the payload is invalid, or a protocol error occurs, do not adjudicate. Answer with a `ProtocolResponse` as in [Report a processing failure on /v1/error](report-a-processing-error.md). A payload you cannot decrypt takes [PAYR-1001](../errors/payr-1001.md).

### 3. Adjudicate

Decide the request in your own system, with no fixed turnaround.

**Wait, when you need documents:** send `POST /v1/communication/request` to the provider, with `x-hcx-status` `request.initiated`. The payload is a TaskBundle that carries a CommunicationRequest. The provider's answer arrives on your `/v1/communication/on_request`. See [queries and communication](../concepts/queries-and-communication.md).

### 4. Seal the answer

Fetch the provider's certificate with `POST /fetch/certs`, using the request's `x-hcx-sender_code`. Cache it for 24 hours. Then build the protected header:

| Header | Rule |
|---|---|
| `x-hcx-sender_code` | Your participant code |
| `x-hcx-recipient_code` | The request's `x-hcx-sender_code` |
| `x-hcx-api_call_id` | A new UUID, different from the correlation ID |
| `x-hcx-correlation_id` | As [message identifiers](../concepts/message-identifiers.md) sets out, so the provider can match your answer |
| `x-hcx-status` | `response.complete` for a final decision. A claim answer can be `response.partial` |
| `x-hcx-workflow_id` | The payer-side stage code, for example `21` approved, `23` rejected or `24` queried. See [workflow codes](../concepts/workflow-codes.md) |

The answer's `type` is `JWEPayloadResponse` for a sealed decision. Only a request you could not process gets `ProtocolResponse`.

### 5. Send it

`POST /v1/preauth/on_submit`, or the paired path from the table, with `{"payload": "<JWE_COMPACT_STRING>"}`. NHCX answers `202` and forwards it to the provider. The provider acknowledges it to NHCX.

**Wait:** if NHCX cannot deliver your answer after five attempts, the report arrives on your `/v1/error`.

### 6. PMJAY cases in the PMJAY payer service

A PMJAY case is adjudicated role by role in the PMJAY payer service. `POST /pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role`, with `caseid` and `payerid`, returns the role that holds the case now. `POST /pmjay/hcx/nhcxpayerservice/wrapper/process/case` applies an action as that role. Call the role lookup before every claim action.

| Stage | Role | Actions | `usecase` |
|---|---|---|---|
| Pre-authorisation | `PPD-Trust` | `Approve`, `Reject`, `Query` | `PREAUTH` |
| Claim step 1 | `CEX-Trust` | `Forward` | `CLAIM` |
| Claim step 2 | `CPD-Trust` | `Pending`, `cpdApprove`, `cpdReject` | `CLAIM` |
| Claim step 3 | `Medical Audit Committee` | `Approve`, `Reject`, `iQuery` | `Medical Audit Committee` |
| Claim step 4 | `ACO-Trust` | `Approve`, `Reject`, `Pending` | `CLAIM` |
| Claim step 5 | `SHA-Trust` | `Approve`, `Reject`, `Pending` | `CLAIM` |
| Claim step 6 | `Claim Review Committee` | `Approve`, `Reject`, `Pending` | `Claim Review Committee` |

The `process/case` body carries `casenumber`, `action`, `receivercode`, `usecase`, `correlationid`, `sendercode`, `memberid` and `remarks`. Action names are case-sensitive. Give each call a unique correlation ID. See [POST /pmjay/hcx/nhcxpayerservice/wrapper/process/case](../endpoints/payer-service-process-case.md) and [Answer as your own payer system or through the PMJAY payer service](../decisions/payer-implementation.md).

## How you know it worked

NHCX answered `202` to your answer on the paired path, and no `/v1/error` arrives for it. To confirm delivery, send `POST /v1/status` about your answer. The reply on `/v1/on_status` carries `x-hcx-status` `request.dispatched`, meaning the provider's system received it.

```observation schema=exit-condition
channel: callback
path: <YOUR_ENDPOINT_URL>/v1/on_status
precondition:
  your answer on /v1/preauth/on_submit: HTTP 202 from NHCX
match:
  x-hcx-status: request.dispatched
absent:
  /v1/error report for your answer
```

## When it goes wrong

- **The same request keeps arriving.** You process inside the 30-second window, or your acknowledgement has the wrong code or body. Acknowledge first, then process.
- **You cannot decrypt the request.** The provider sealed it with an old copy of your certificate. Answer with a `ProtocolResponse` carrying [PAYR-1001](../errors/payr-1001.md), and check [Rotate your encryption certificate](rotate-certificate.md).
- **NHCX refuses your answer, saying no data exists for its correlation ID.** Your `x-hcx-correlation_id` does not match the request. See [NHCX-1010](../errors/nhcx-1010.md).
- **The provider never gets your answer.** `x-hcx-recipient_code` is not the request's sender code. Swap sender and recipient.
- **You sent a `ProtocolResponse` for a rejection.** The provider treats it as a protocol failure. Send a sealed decision with the rejected workflow code.
- **A PMJAY action is refused.** The case sits with another role, or the action name is misspelt. Call `get/user-role` first, and use the action names exactly as in the table.
