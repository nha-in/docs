---
id: nhcx.flow.insurance-plan-request
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Request a patient's insurance plan
summary: >-
  Ask the payer for the policy's rules as they apply at your hospital: the packages
  you may treat, their rates, their conditions and the documents each one needs.
sources:
- url: https://hcxsbx.abdm.gov.in/images/13093b5f9b88fe826123.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Insurance Plan IG.docx
  hash: sha256:e9c6c82b6d67fd8476d6d19a5961419beb04e3c0613533453ed1e16e2a569cc1
  fetched: '2026-09-14'
  note: Insurance Plan IG, row 25 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Core APIs, InsurancePlan Task tables; plan structure Approach 1.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: 'NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. InsurancePlan section: key characteristics, claim condition table, error scenarios.'
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet Scenarios, row 2.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. PAYR-1406 row.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Insurance Plan.
- url: https://hcxsbx.abdm.gov.in/insuranceplanhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/insuranceplanhcxservice.json
  hash: sha256:03665c6e6a5c8d86e3d621ab577dd683cf13c155d5b9529f5be6ca70fef13dee
  fetched: '2026-09-14'
  note: 'API specification: insuranceplanhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths /v1/insuranceplan/request and /on_request.'
related:
  endpoints:
  - nhcx.endpoint.insuranceplan-request
  - nhcx.endpoint.insuranceplan-on-request
  callbacks:
  - nhcx.callback.insuranceplan-request
  - nhcx.callback.insuranceplan-on-request
  - nhcx.callback.error
  fhir:
  - nhcx.fhir.task
  - nhcx.fhir.validation
  - nhcx.fhir.insurance-plan-bundle
  - nhcx.fhir.pmjay-insurance-plan
  concepts:
  - nhcx.concept.four-message-legs
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.message-identifiers
  - nhcx.concept.insurance-plan
  - nhcx.concept.session-token
  tests:
  - nhcx.test.provider-uc-06
  - nhcx.test.payer-uc-08
  - nhcx.test.tc-hbp-01
  flows:
  - nhcx.flow.pmjay-patient-to-cashless
  - nhcx.flow.preauth-submit
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.status-check
  errors:
  - nhcx.error.payr-1001
  - nhcx.error.payr-1401
  - nhcx.error.payr-1402
  - nhcx.error.payr-1405
  - nhcx.error.payr-1406
  glossary:
  - nhcx.glossary.insurance-plan
  - nhcx.glossary.payer
  - nhcx.glossary.pmjay
  - shared.glossary.hfr
  - shared.glossary.nhcx
  sandbox:
  - nhcx.sandbox.callback-url-requirements
  - nhcx.sandbox.dummy-payer
  - nhcx.sandbox.support-contacts
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
---

# Request a patient's insurance plan

## In plain words

The [insurance plan](../glossary/insurance-plan.md) is the patient's policy in machine-readable form, as it applies at your hospital. It lists the specialties and packages your hospital is empanelled for, the package rates, the claim conditions, and the documents each treatment needs.

You ask the [payer](../glossary/payer.md) for it through the [NHCX](../../shared/glossary/nhcx.md) exchange, with a Task. The plan arrives later, on your callback. Fetch it before any preauthorisation or claim for a payer and policy, then cache it.

The plan is filtered to your hospital. It shows only what the payer's agreement with your hospital covers. [The insurance plan](../concepts/insurance-plan.md) explains the model.

## Before you start

- Your hospital is an active participant, holds a valid [session token](../concepts/session-token.md), and has a registered callback endpoint that answers within 30 seconds.
- You have the policy number and the payer's `processingid` from the [policy lookup](../endpoints/participant-get-policies.md). The `processingid` goes in `x-hcx-recipient_code`.
- You have your hospital's [HFR](../../shared/glossary/hfr.md) ID.
- You hold the recipient's encryption certificate, fetched with [/fetch/certs](../endpoints/fetch-certs.md).
- No other plan request for this hospital and policy is still open.
- In the sandbox, use the [dummy payer](../sandbox/dummy-payer.md) with the test provider id and policy number it names.

## What happens

```mermaid
sequenceDiagram
  participant P as Provider (your system)
  participant N as NHCX
  participant Y as Payer
  P->>N: POST /v1/insuranceplan/request
  Note right of P: sealed Task bundle, Task.code poll, x-hcx-status request.initiated
  N-->>P: HTTP 202 Accepted
  N->>Y: POST /v1/insuranceplan/request
  Y-->>N: HTTP 202 Accepted
  Note over Y: payer builds the plan for this policy and hospital
  Y->>N: POST /v1/insuranceplan/on_request
  N-->>Y: HTTP 202 Accepted
  N->>P: POST /v1/insuranceplan/on_request
  P-->>N: HTTP 202 Accepted, within 30 seconds
  Note left of P: decrypt, then cache the plan
```

1. Build a Task bundle, as in [the insurance plan bundles](../fhir/insurance-plan-bundle.md). Set Task `status` to `requested`, `intent` to `order` and `code` to `poll`.
2. Add two Task inputs: the policy number, and your HFR ID as the provider id. Send both, so the payer returns the view contracted for your hospital.
3. Seal the bundle and set the headers, as in [send a sealed request](send-a-sealed-request.md). Set `x-hcx-status` to `request.initiated`. Set `x-hcx-correlation_id` to the value of this call's `x-hcx-api_call_id`.
4. Call [POST /v1/insuranceplan/request](../endpoints/insuranceplan-request.md). NHCX answers `202 Accepted` and forwards the request.
5. Wait. Do not send a second plan request for the same hospital and policy until this one completes.
6. Receive [POST /v1/insuranceplan/on_request](../callbacks/insuranceplan-on-request.md). Answer `202 Accepted` within 30 seconds, then process.
7. Read the body's `type`. `ProtocolResponse` carries `x-hcx-error_details`. Any other type carries the sealed plan in `payload`. Decrypt it with your private key.
8. Find the `InsurancePlan` resource in the decrypted bundle, with its `Organization` and `Questionnaire` resources.
9. Cache the plan with the date you fetched it. Fetch it again once every 15 days, and after a policy update or a change of treatment.

For [PMJAY](../glossary/pmjay.md), read the plan like this. [The PMJAY InsurancePlan profile](../fhir/pmjay-insurance-plan.md) has the full mapping.

| Plan element | What it holds |
|---|---|
| `plan.specificCost.category` | A specialty, such as General Medicine |
| `plan.specificCost.benefit` | A package, such as `SE012A`, Corneal Grafting |
| `specificCost.benefit.cost` | The package rate |
| `cost.qualifiers` | Extra cost types: `Implant`, and `Stratification` for the bed category |
| `claimCondition` extension | Package rules, such as `EnhancementAllowed`, `ApprovalNotRequired` and `IsDayCare` |
| `claimSupportingInfoRequirement` extension | Documents the payer requires during claim processing |

## How you know it worked

The request is finished when all of these hold:

- You received `POST /v1/insuranceplan/on_request` whose `x-hcx-correlation_id` equals the one you sent.
- Its `type` is not `ProtocolResponse`, and `payload` decrypts with your private key.
- The bundle holds an `InsurancePlan` resource listing benefits for the specialties your hospital is empanelled for.
- You answered the callback with `202` within 30 seconds.
- The plan sits in your cache with its fetch date, ready for eligibility and preauthorisation.

## When it goes wrong

The payer answers [PAYR-1406](../errors/payr-1406.md). An earlier plan request is still in progress with the payer. Wait 15 to 60 minutes, then ask again with a new correlation id.

The 202 arrives and the callback never does. [Check the request's status](status-check.md) and your [callback URL](../sandbox/callback-url-requirements.md). An undeliverable request comes back on [/v1/error](../callbacks/error.md). See [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md).

The payer refuses the policy or your hospital. [PAYR-1401](../errors/payr-1401.md) means the policy is not allowed for your hospital. [PAYR-1402](../errors/payr-1402.md) means no payer holds the policy. [PAYR-1405](../errors/payr-1405.md) means the payer has no enrolled hospital for your HFR ID or sender code. Each message asks you to contact [technical support](../sandbox/support-contacts.md).

The plan arrives empty. No coverage matches this policy and hospital. Check the policy number and the HFR ID you sent.

The callback is a `ProtocolResponse` with [PAYR-1001](../errors/payr-1001.md). The payer could not decrypt your request. Fetch its certificate again and reseal.
