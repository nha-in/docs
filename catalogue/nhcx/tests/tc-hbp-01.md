---
id: nhcx.test.tc-hbp-01
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'TC-HBP-01: Fetch admissible HBP package'
summary: >-
  Check that your hospital system can fetch the benefit packages the state scheme
  allows at your hospital, with their rules and document needs.
sources:
- url: https://hcxsbx.abdm.gov.in/images/4d333fa6ce5ef99920de.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Test Cases.xlsx
  hash: sha256:0d95021974cfe81ab2e3bf66f983228a70b8fed8d7d251eb6d7eeab7354ecad2
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Test Cases, row 31 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet1, row TC-HBP-01.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 6.4 and 6.5.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. sheet Scenarios, row 2.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 4-6, Q14 and Q21.
related:
  flows:
  - nhcx.flow.pmjay-patient-to-cashless
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.insurance-plan-request
  concepts:
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.hmis-integration-architecture
  - nhcx.concept.workflow-codes
  - nhcx.concept.insurance-plan
  sandbox:
  - nhcx.sandbox.test-participants
  glossary:
  - nhcx.glossary.pmjay
  - nhcx.glossary.hbp
  - nhcx.glossary.sha
  endpoints:
  - nhcx.endpoint.insuranceplan-request
  callbacks:
  - nhcx.callback.insuranceplan-on-request
  fhir:
  - nhcx.fhir.insurance-plan-bundle
  - nhcx.fhir.pmjay-insurance-plan
  - nhcx.fhir.task
  - nhcx.fhir.validation
  tests:
  - nhcx.test.tc-abha-01
  - nhcx.test.tc-ce-01
  - nhcx.test.provider-uc-06
  errors:
  - nhcx.error.payr-1401
  - nhcx.error.payr-1402
  - nhcx.error.payr-1404
  - nhcx.error.payr-1405
  - nhcx.error.payr-1406
---

# TC-HBP-01: Fetch admissible HBP package

## In plain words

[HBP](../glossary/hbp.md) packages are the treatments a [PMJAY](../glossary/pmjay.md) policy pays for, and each state sets its own. This test case fetches the insurance plan for your hospital through [NHCX](../../shared/glossary/nhcx.md). It checks that the state's packages come back, with their conditions and document requirements.

## Before you start

- The test case pre-condition holds: policy validated. [TC-ABHA-01](tc-abha-01.md) passed.
- Your hospital is on the payer's network for that state. The payer checks this before it answers.
- You have the policy code and your hospital's [HFR](../../shared/glossary/hfr.md) ID. The request needs both.
- Your provider sandbox basics pass. You hold a session token ([use case 4](provider-uc-04.md)) and the payer's certificate ([use case 3](provider-uc-03.md)). Your callback endpoint works ([use case 5](provider-uc-05.md)).
- You address the PMJAY payer by the processing ID from [use case 2](provider-uc-02.md).

## What happens

| Test case field | Value |
|---|---|
| API / FHIR Resource | InsurancePlan |
| Input Parameters | PlanId: `PMJAY-TS-001`, Provider Id: `HOSP123`, PayerID: `SHA-HARYANA` |

1. Build a Task bundle whose Task has `code` `poll`, `status` `requested` and `intent` `order`. Add the inputs `policyNumber` and `providerId`, where `providerId` is your HFR ID. See [insurance plan bundles](../fhir/insurance-plan-bundle.md).
2. Validate the bundle against the [NRCeS](../../shared/glossary/nrces.md) profiles, as [validating a bundle](../fhir/validation.md) describes.
3. Seal it as a [JWE](../glossary/jwe.md) with the PMJAY payer's public key.
4. Set the protected headers. `x-hcx-status` is `request.initiated`. `x-hcx-recipient_code` is the payer's processing ID, and `x-hcx-ben-abha-id` carries the beneficiary's [ABHA](../../shared/glossary/abha.md) number.
5. Send it.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/insuranceplan/request' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"payload": "<JWE_COMPACT_STRING>"}'
```

6. NHCX answers with HTTP 202.
7. Wait for `POST /v1/insuranceplan/on_request` on your registered endpoint. Answer it with HTTP 202 within 30 seconds.
8. Decrypt the payload with your private key and read the insurance plan bundle.
9. Cache the plan. Fetch it again after 15 days, or when the policy changes.

## How you know it worked

The pass criterion for TC-HBP-01:

| Field | Value |
|---|---|
| Processing / validation rules | Validate provide against state network hospitals |
| Expected output | InsurancePlan with all HBP packages along with inclusions and exclusions,claim conditions, document requirements |
| Remarks | State-specific HBP applied |

What you observe:

- The decrypted payload is a Bundle of type `collection` with InsurancePlan, Organization and Questionnaire entries.
- Packages appear under `specificCost`: `category` is the speciality and `benefit` is the package, with its cost.
- The plan carries the `claim-exclusion`, `claimCondition` and `claimSupportingInfoRequirement` extensions.
- The packages are those of the payer's state. See [the PMJAY insurance plan](../fhir/pmjay-insurance-plan.md).

## When it goes wrong

- **[PAYR-1401](../errors/payr-1401.md), policy not allowed for the hospital.** The hospital is not on the state network for that policy.
- **[PAYR-1402](../errors/payr-1402.md), policy not associated with a payer.** Check the policy code.
- **[PAYR-1404](../errors/payr-1404.md), no treatment under any speciality.** No packages are configured for your hospital on that policy.
- **[PAYR-1405](../errors/payr-1405.md), no enrolled hospital.** The HFR ID or sender code is not enrolled with the payer.
- **[PAYR-1406](../errors/payr-1406.md), a request is already in progress.** Wait for the first answer before you ask again.
- **The callback never arrives.** Your callback URL must use a domain name, not an IP address or port. It must run on an India-hosted server that allows the exchange's outbound addresses. See [callback URL requirements](../sandbox/callback-url-requirements.md) and [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md). Then ask where the request stands with [use case 13](provider-uc-13.md).
