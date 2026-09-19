---
id: nhcx.fhir.preauth-cancel
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Preauthorisation cancel request and response bundles
summary: >-
  The task a hospital sends to cancel a preauthorisation it no longer needs, and
  the payer's confirmation that the case is cancelled.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.6 Cancellation Flow.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/preauth/cancel/preauth_cancel_req.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Task.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/preauth/cancel/preauth_cancel_response.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Task and ClaimResponse.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheets Bridge Error and Preauth Error Codes (PAYR-1252).
related:
  concepts:
  - nhcx.concept.reprocess-and-cancel
  flows:
  - nhcx.flow.preauth-cancel
  endpoints:
  - nhcx.endpoint.task-submit
  - nhcx.endpoint.task-on-submit
  callbacks:
  - nhcx.callback.task-on-submit
  fhir:
  - nhcx.fhir.task
  - nhcx.fhir.preauth-request
  - nhcx.fhir.collection-bundle
  - nhcx.fhir.validation
  errors:
  - nhcx.error.payr-1252
  - nhcx.error.payr-1017
  - nhcx.error.payr-1018
  tests:
  - nhcx.test.provider-uc-12
  glossary:
  - nhcx.glossary.preauthorisation
  - shared.glossary.fhir
---

# Preauthorisation cancel request and response bundles

## In plain words

A hospital cancels a [preauthorisation](../glossary/preauthorisation.md) with a `TaskBundle` on `/v1/task/submit`. The `Task` has code `cancel`, a reason, and the claim number it cancels.

The payer answers on `/v1/task/on_submit`. Its bundle holds a completed `Task` that points at a `ClaimResponse` marked `cancelled`.

## Before you start

- The preauthorisation is in state "preauthorization submitted" or "preauthorization approved". The payer cannot cancel a case in any other state.
- You know the claim number you sent in the original [preauthorisation request](preauth-request.md).
- You know why you are cancelling, so you can pick a reason code.

## What happens

### The request

| Element | Value |
|---|---|
| `Task.status` | `requested` |
| `Task.intent` | `order` |
| `Task.code` | `cancel` from `http://terminology.hl7.org/CodeSystem/financialtaskcode` |
| `Task.reasonCode` | A code from `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-reason-code`, such as `treatmentplanchanged` |
| `Task.input` | `claimNumber` and `initimationNumber`, both from `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code`, both carrying the preauthorisation number |
| `Task.requester` | Your provider Organization |
| `Task.owner` | The payer Organization |

The input code is spelled `initimationNumber`. Send it with that spelling.

```json
{
  "resourceType": "Bundle",
  "id": "<BUNDLE_ID_YOU_GENERATE>",
  "meta": {
    "lastUpdated": "<ISO_8601_TIMESTAMP_WITH_OFFSET>"
  },
  "identifier": {
    "system": "<YOUR_IDENTIFIER_SYSTEM_URL>",
    "value": "<PREAUTH_CLAIM_NUMBER>"
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
          "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Task"]
        },
        "status": "requested",
        "intent": "order",
        "code": {
          "coding": [{
              "system": "http://terminology.hl7.org/CodeSystem/financialtaskcode", "code": "cancel"
            }]
        },
        "description": "<WHY_YOU_ARE_CANCELLING>",
        "authoredOn": "<ISO_8601_TIMESTAMP_WITH_OFFSET>",
        "requester": {
          "reference": "urn:uuid:<PROVIDER_ORG_UUID>"
        },
        "owner": {
          "reference": "urn:uuid:<PAYER_ORG_UUID>"
        },
        "reasonCode": {
          "coding": [{
              "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-reason-code", "code": "treatmentplanchanged", "display": "Treatment plan changed during hospitalization."
            }]
        },
        "input": [
          {
            "type": {
              "coding": [{
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code", "code": "claimNumber"
                }]
            },
            "valueString": "<PREAUTH_CLAIM_NUMBER>"
          },
          {
            "type": {
              "coding": [{
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code", "code": "initimationNumber"
                }]
            },
            "valueString": "<PREAUTH_CLAIM_NUMBER>"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:<PROVIDER_ORG_UUID>",
      "resource": {
        "resourceType": "Organization",
        "id": "<PROVIDER_ORG_UUID>",
        "meta": {
          "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Organization"]
        },
        "identifier": [
          {
            "type": {
              "coding": [{
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "NPI", "display": "National provider identifier"
                }]
            },
            "system": "https://facility.abdm.gov.in",
            "value": "<YOUR_HFR_ID>"
          }
        ],
        "type": [
          {
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/organization-type", "code": "prov", "display": "Healthcare Provider"
              }]
          }
        ],
        "name": "<YOUR_FACILITY_NAME>"
      }
    },
    {
      "fullUrl": "urn:uuid:<PAYER_ORG_UUID>",
      "resource": {
        "resourceType": "Organization",
        "id": "<PAYER_ORG_UUID>",
        "meta": {
          "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Organization"]
        },
        "identifier": [
          {
            "type": {
              "coding": [{
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "NIIP", "display": "National Insurance Payor Identifier (Payor)"
                }]
            },
            "system": "https://facility.abdm.gov.in",
            "value": "<PAYER_ID>"
          }
        ],
        "type": [
          {
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/organization-type", "code": "pay", "display": "Payer"
              }]
          }
        ],
        "name": "<PAYER_NAME>"
      }
    }
  ]
}
```

### The response

| Resource | Key elements |
|---|---|
| `Task` | `status` `completed`; `code` `approve` from `http://hl7.org/fhir/CodeSystem/task-code`; `output[0].type` `include` from `http://terminology.hl7.org/CodeSystem/financialtaskinputtype`; `output[0].valueReference` pointing at the ClaimResponse |
| `ClaimResponse` | Your claim number; `use` `preauthorization`; `outcome` `complete`; `adjudication[0].reason.coding.code` `cancelled` |

## How you know it worked

Run the validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)):

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile https://nrces.in/ndhm/fhir/r4/StructureDefinition/TaskBundle
```

It exits with code 0 and reports no errors.

Then `/v1/task/on_submit` arrives. Its `Task` has `status` `completed`, and the referenced `ClaimResponse` carries your claim number with adjudication reason `cancelled`.

## When it goes wrong

- **[PAYR-1252](../errors/payr-1252.md): case not in an active preauthorisation state.** Only submitted or approved cases can be cancelled. The case cannot be cancelled from its current state.
- **"Invalid input, code and reason code received."** The combination of task code, reason code and inputs is not one the payer accepts. Use `cancel` with a reason from `ndhm-reason-code` and both inputs.
- **"Invalid case number received."** Send the preauthorisation number in both `claimNumber` and `initimationNumber`.
- **[PAYR-1017](../errors/payr-1017.md) or [PAYR-1018](../errors/payr-1018.md).** The task code or the task reason code is missing.
