---
id: nhcx.fhir.insurance-plan-bundle
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: InsurancePlan request and response bundles
summary: >-
  The small task a hospital sends to fetch a payer's digital policy, and the large
  bundle of packages, rates and document rules that comes back.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 6.4 and 6.5.
- url: https://hcxsbx.abdm.gov.in/images/13093b5f9b88fe826123.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Insurance Plan IG.docx
  hash: sha256:e9c6c82b6d67fd8476d6d19a5961419beb04e3c0613533453ed1e16e2a569cc1
  fetched: '2026-09-14'
  note: Insurance Plan IG, row 25 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Request section; Approach 1 and Approach 2.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/insuranceplan/insuranceplan_request.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Task.code, Task.input.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/insuranceplan/insuranceplan_response.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. whole file; InsurancePlan.coverage.benefit.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Insurance Plan.
related:
  concepts:
  - nhcx.concept.insurance-plan
  - nhcx.concept.fhir-in-nhcx
  flows:
  - nhcx.flow.insurance-plan-request
  endpoints:
  - nhcx.endpoint.insuranceplan-request
  - nhcx.endpoint.insuranceplan-on-request
  callbacks:
  - nhcx.callback.insuranceplan-on-request
  fhir:
  - nhcx.fhir.pmjay-insurance-plan
  - nhcx.fhir.collection-bundle
  - nhcx.fhir.coverage-eligibility-request
  - nhcx.fhir.validation
  sandbox:
  - nhcx.sandbox.dummy-payer
  errors:
  - nhcx.error.payr-1406
  - nhcx.error.payr-1401
  - nhcx.error.payr-1402
  - nhcx.error.payr-1405
  tests:
  - nhcx.test.provider-uc-06
  - nhcx.test.payer-uc-08
  - nhcx.test.tc-hbp-01
  glossary:
  - nhcx.glossary.insurance-plan
  - shared.glossary.hfr
  - shared.glossary.fhir
---

# InsurancePlan request and response bundles

## In plain words

An [insurance plan](../glossary/insurance-plan.md) is a payer's policy published as data. The hospital asks for it with a one-entry `Task` bundle on `/v1/insuranceplan/request`. The payer answers on `/v1/insuranceplan/on_request` with an InsurancePlan bundle.

The answer lists the covered packages, their rates, the claim conditions, the documents each claim needs and the questionnaires to fill in. Fetch it before you check eligibility or raise a preauthorisation, so your requests use the payer's own codes.

## Before you start

- You know the policy number and the provider id the payer knows you by. The provider id is your [HFR](../../shared/glossary/hfr.md) ID in the published guide. With the [dummy payer](../sandbox/dummy-payer.md), use provider id `32722` and policy number `100217`.
- Your callback endpoint accepts large payloads. The sample PMJAY response is about 21 MB.
- You can seal and open payloads. See [send a sealed request](../flows/send-a-sealed-request.md).

## What happens

### The request: a Task with code `poll`

| Element | Value |
|---|---|
| `Task.status` | `requested` |
| `Task.intent` | `order` |
| `Task.code` | `poll` from `http://terminology.hl7.org/CodeSystem/financialtaskcode` |
| `Task.input[].type` | `policyNumber` and `providerId` from `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code` |
| `Task.input[].valueString` | The policy number in one input, the provider id in the other |

Send both inputs, one of each type. Both are required.

```json
{
  "resourceType": "Bundle",
  "id": "<BUNDLE_ID_YOU_GENERATE>",
  "meta": {
    "lastUpdated": "<ISO_8601_TIMESTAMP_WITH_OFFSET>"
  },
  "identifier": {
    "system": "<YOUR_IDENTIFIER_SYSTEM_URL>",
    "value": "<YOUR_REQUEST_NUMBER>"
  },
  "type": "collection",
  "timestamp": "<ISO_8601_TIMESTAMP_WITH_OFFSET>",
  "entry": [
    {
      "fullUrl": "urn:uuid:<TASK_UUID>",
      "resource": {
        "resourceType": "Task",
        "id": "<TASK_UUID>",
        "meta": {
          "profile": [
            "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Task"
          ]
        },
        "status": "requested",
        "intent": "order",
        "code": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/financialtaskcode",
              "code": "poll",
              "display": "Poll"
            }
          ]
        },
        "input": [
          {
            "type": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code",
                  "code": "policyNumber",
                  "display": "PolicyNumber"
                }
              ]
            },
            "valueString": "<POLICY_NUMBER>"
          },
          {
            "type": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code",
                  "code": "providerId",
                  "display": "Provider ID"
                }
              ]
            },
            "valueString": "<PROVIDER_ID_KNOWN_TO_THE_PAYER>"
          }
        ]
      }
    }
  ]
}
```

### The response: an InsurancePlan bundle

The decrypted payload is a `collection` bundle with these entries:

| Resource | What it carries |
|---|---|
| `InsurancePlan` | The policy: identifiers, period, coverage groups, benefits, rates and claim rules |
| `Organization` | The payer, referenced from `ownedBy` and `administeredBy` |
| `Questionnaire` | Document and treatment-guideline questionnaires, one entry per questionnaire |

A plan structures its benefits in one of two ways:

- `plan.specificCost.category.benefit.cost.qualifiers`: specialty, package, package cost, then implant and stratification qualifiers.
- `coverage.benefit.limit`: coverage type, benefit, limit.

The PMJAY plan uses both, aligned one to one. See [the PMJAY InsurancePlan](pmjay-insurance-plan.md) for every element.

## How you know it worked

Run the validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)) on your request bundle:

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile https://nrces.in/ndhm/fhir/r4/StructureDefinition/TaskBundle
```

It exits with code 0 and reports no errors.

Then `/v1/insuranceplan/on_request` arrives at your endpoint. The decrypted bundle holds one `InsurancePlan` whose `NH` identifier equals the policy number you asked for. Your package codes appear in `InsurancePlan.coverage[].benefit[].id`.

## When it goes wrong

- **[PAYR-1406](../errors/payr-1406.md): an existing request for this hospital and policy is in progress.** Wait 15 to 60 minutes for the first response. Do not resend with a new correlation id. After 60 minutes with no response, contact support.
- **[PAYR-1401](../errors/payr-1401.md): policy not allowed for the hospital.** Your facility is not enrolled for that policy. Contact support.
- **[PAYR-1402](../errors/payr-1402.md): policy not associated with any payer.** Check the policy number you sent.
- **[PAYR-1405](../errors/payr-1405.md): no enrolled hospital found for the HFR id or sender id.** Check the provider id input and your sender code.
- **The callback times out or is cut off.** The response is large. Accept the body, acknowledge with 202 within 30 seconds, and parse after you acknowledge.
