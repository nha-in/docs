---
id: nhcx.fhir.task
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Task bundle for reprocess and CRC
summary: >-
  The task a hospital sends to dispute a rejected or underpaid claim, which routes
  the case to the claim review committee, and the task that carries the payer's
  final decision back.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sections 22 Erroneous Claim and 23 Claim Reprocess.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 10.4 and 10.5.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Reprocess; sheet Value sets, Task Codes.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Bridge Error.
related:
  concepts:
  - nhcx.concept.reprocess-and-cancel
  - nhcx.concept.claim-cycle
  flows:
  - nhcx.flow.claim-reprocess
  endpoints:
  - nhcx.endpoint.task-submit
  - nhcx.endpoint.task-on-submit
  callbacks:
  - nhcx.callback.task-on-submit
  fhir:
  - nhcx.fhir.claim-response
  - nhcx.fhir.preauth-cancel
  - nhcx.fhir.payment-notice
  - nhcx.fhir.collection-bundle
  - nhcx.fhir.validation
  errors:
  - nhcx.error.payr-1017
  - nhcx.error.payr-1018
  - nhcx.error.payr-1332
  tests:
  - nhcx.test.tc-cl-03
  - nhcx.test.provider-uc-12
  - nhcx.test.payer-uc-14
  glossary:
  - nhcx.glossary.reprocess
  - nhcx.glossary.crc
  - nhcx.glossary.pmjay
  - shared.glossary.fhir
---

# Task bundle for reprocess and CRC

## In plain words

A hospital that disputes a claim decision asks for [reprocessing](../glossary/reprocess.md) with a `TaskBundle` on `/v1/task/submit`. The `Task` has code `reprocess`, a reason, the claim number and a supporting document.

Under [PMJAY](../glossary/pmjay.md), a reprocess request goes to the Claim Review Committee ([CRC](../glossary/crc.md)). Its decision is final. The payer returns it on `/v1/task/on_submit` as a completed `Task` pointing at a `ClaimResponse`.

## Before you start

- You received a claim decision you dispute. See [the claim response](claim-response.md).
- You know which case you have:

| | Reprocess | Erroneous claim |
|---|---|---|
| When | The claim was fully rejected | The claim was paid, but less than payable |
| Earliest | As soon as the rejection arrives | After the payment cleared notice |
| `reasonCode` | `claimrejected` | `partialpayment` |
| Amount | None sent; the full claim is implied | The shortfall, never more than claimed minus approved |
| Supporting document | Mandatory | Mandatory |
| Times per claim under PMJAY | Once | Once |

- You hold a document that justifies the request.
- You have not already received a CRC decision on this claim. No erroneous claim can follow a CRC decision.

## What happens

### Task codes on `/v1/task/submit`

`Task.code` comes from `http://terminology.hl7.org/CodeSystem/financialtaskcode`. Use `reprocess` for a reprocess request. The same path carries `cancel` (see [preauthorisation cancel](preauth-cancel.md)), `release` and `nullify`.

### The request

| Element | Value |
|---|---|
| `Task.status` | `requested` |
| `Task.intent` | `order` |
| `Task.code` | `reprocess` |
| `Task.reasonCode` | `claimrejected` or `partialpayment`, from `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-reason-code` |
| `Task.input` | `claimNumber` and `intimationNumber` carrying the original claim number, and a `document` input with the supporting file as `valueAttachment`, all from `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code` |
| `Task.requester`, `Task.owner` | Your Organization and the payer's |

The request carries the original claim number. It does not create a new case number.

```json
{
  "resourceType": "Bundle",
  "id": "<BUNDLE_ID_YOU_GENERATE>",
  "meta": {
    "lastUpdated": "<ISO_8601_TIMESTAMP_WITH_OFFSET>"
  },
  "identifier": {
    "system": "<YOUR_IDENTIFIER_SYSTEM_URL>",
    "value": "<CLAIM_NUMBER>"
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
              "code": "reprocess",
              "display": "Reprocess"
            }
          ]
        },
        "description": "<WHY_YOU_DISPUTE_THE_DECISION>",
        "authoredOn": "<ISO_8601_TIMESTAMP_WITH_OFFSET>",
        "requester": {
          "reference": "urn:uuid:<PROVIDER_ORG_UUID>"
        },
        "owner": {
          "reference": "urn:uuid:<PAYER_ORG_UUID>"
        },
        "reasonCode": {
          "coding": [
            {
              "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-reason-code",
              "code": "claimrejected"
            }
          ]
        },
        "input": [
          {
            "type": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code",
                  "code": "claimNumber"
                }
              ]
            },
            "valueString": "<CLAIM_NUMBER>"
          },
          {
            "type": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code",
                  "code": "intimationNumber"
                }
              ]
            },
            "valueString": "<CLAIM_NUMBER>"
          },
          {
            "type": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code",
                  "code": "document"
                }
              ]
            },
            "valueAttachment": {
              "contentType": "application/pdf",
              "title": "<DOCUMENT_NAME>",
              "data": "<BASE64_OF_THE_FILE>"
            }
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
          "profile": [
            "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Organization"
          ]
        },
        "identifier": [
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "NPI",
                  "display": "National provider identifier"
                }
              ]
            },
            "system": "https://facility.abdm.gov.in",
            "value": "<YOUR_HFR_ID>"
          }
        ],
        "type": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/organization-type",
                "code": "prov",
                "display": "Healthcare Provider"
              }
            ]
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
          "profile": [
            "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Organization"
          ]
        },
        "identifier": [
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "NIIP",
                  "display": "National Insurance Payor Identifier (Payor)"
                }
              ]
            },
            "system": "https://facility.abdm.gov.in",
            "value": "<PAYER_ID>"
          }
        ],
        "type": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/organization-type",
                "code": "pay",
                "display": "Payer"
              }
            ]
          }
        ],
        "name": "<PAYER_NAME>"
      }
    }
  ]
}
```

### The response

The payer's bundle holds a `Task` with `status` `completed`. `Task.output[0].valueReference` points at a `ClaimResponse` in the same bundle. Read that `ClaimResponse` exactly as you read a [claim response](claim-response.md): approved, partially approved, queried or rejected.

## How you know it worked

Run the validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)):

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile https://nrces.in/ndhm/fhir/r4/StructureDefinition/TaskBundle
```

It exits with code 0 and reports no errors.

Then `/v1/task/on_submit` arrives with a completed `Task`. Its output resolves to a `ClaimResponse` carrying your claim number and the committee's decision.

## When it goes wrong

- **"Invalid input, code and reason code received."** The task code, reason code and inputs are not an accepted combination. Pair `reprocess` with `claimrejected` for a rejection, or with `partialpayment` for an erroneous claim.
- **"Invalid case number received."** Send the original claim number in `claimNumber` and `intimationNumber`.
- **[PAYR-1017](../errors/payr-1017.md) or [PAYR-1018](../errors/payr-1018.md).** The task code or the reason code is missing.
- **[PAYR-1332](../errors/payr-1332.md): invalid CRC request.** Check that the claim was rejected or partially paid, and that no request was already raised for it. Each claim allows one request under PMJAY.
- **An erroneous claim is refused.** Raise it only after the payment cleared notice, and keep the amount within the shortfall.
