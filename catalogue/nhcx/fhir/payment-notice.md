---
id: nhcx.fhir.payment-notice
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: PaymentNotice bundle and its acknowledgement
summary: >-
  The bundle a payer sends to tell a hospital a claim has been paid, with the amount
  and bank reference, and the short task the hospital sends back to acknowledge
  it.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 11.2, 11.5, 11.6 and implementation notes.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/paymentNotice/payment_notice.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Task, PaymentNotice, PaymentReconciliation.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/paymentNotice/paymentNotice_ack.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Task.output.
related:
  concepts:
  - nhcx.concept.claim-cycle
  flows:
  - nhcx.flow.payment-notice
  endpoints:
  - nhcx.endpoint.paymentnotice-request
  - nhcx.endpoint.paymentnotice-on-request
  callbacks:
  - nhcx.callback.paymentnotice-request
  fhir:
  - nhcx.fhir.claim-response
  - nhcx.fhir.task
  - nhcx.fhir.collection-bundle
  - nhcx.fhir.validation
  sandbox:
  - nhcx.sandbox.dummy-payer
  tests:
  - nhcx.test.provider-uc-11
  - nhcx.test.payer-uc-13
  glossary:
  - nhcx.glossary.payment-notice
  - shared.glossary.fhir
---

# PaymentNotice bundle and its acknowledgement

## In plain words

A [payment notice](../glossary/payment-notice.md) tells the hospital that the payer has paid an approved claim. The payer sends a `TaskBundle` on `/v1/paymentnotice/request`. It holds a `Task`, a `PaymentNotice` and a `PaymentReconciliation` with the bank reference and deductions.

The hospital acknowledges with its own small `TaskBundle` on `/v1/paymentnotice/on_request`. The payment cycle closes when the payer receives that acknowledgement.

## Before you start

- The claim is approved. See [the claim response](claim-response.md).
- Your callback endpoint accepts `/v1/paymentnotice/request`.
- In the sandbox, you can trigger a notice from the [dummy payer](../sandbox/dummy-payer.md).

## What happens

### The notice the payer sends

| Resource | Key elements |
|---|---|
| `Task` | `status` `requested`; `intent` `order`; `code` `deliver` from `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-codes`; `input[0].type` `status` from `http://terminology.hl7.org/CodeSystem/financialtaskinputtype`, with `valueReference` to the PaymentNotice |
| `PaymentNotice` | `identifier` typed `CLN` carrying the claim number; `status` `active`; `payment` pointing at the PaymentReconciliation; `recipient` pointing at your Organization; `amount` in `INR`; `paymentStatus` `paid` from `http://terminology.hl7.org/CodeSystem/paymentstatus` |
| `PaymentReconciliation` | `paymentDate`; `paymentAmount` in `INR`; `paymentIdentifier` typed `UTR` carrying the bank's Unique Transaction Reference; `detail[]` lines typed `TDS` (tax deducted at source) and `Payment` |
| `Organization` | The payer and your facility |

The net payment plus the `TDS` line equals the approved claim amount. Store the UTR from `PaymentReconciliation.paymentIdentifier.value` for audit.

### The acknowledgement you send

| Element | Value |
|---|---|
| `Task.status` | `completed` |
| `Task.code` | `status` from `http://terminology.hl7.org/CodeSystem/financialtaskcode` |
| `Task.output[0]` | type `status` from `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-output-type`; value `paymentack` from `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-output-value` |
| `Task.output[1]` | type `claimNumber`, value the claim number |

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
        "status": "completed",
        "intent": "order",
        "code": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/financialtaskcode",
              "code": "status"
            }
          ]
        },
        "description": "<FREE_TEXT_CONFIRMATION>",
        "authoredOn": "<ISO_8601_TIMESTAMP_WITH_OFFSET>",
        "requester": {
          "reference": "urn:uuid:<PROVIDER_ORG_UUID>"
        },
        "owner": {
          "reference": "urn:uuid:<PAYER_ORG_UUID>"
        },
        "output": [
          {
            "type": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-output-type",
                  "code": "status"
                }
              ]
            },
            "valueCodeableConcept": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-output-value",
                  "code": "paymentack",
                  "display": "Payment is acknowledged"
                }
              ]
            }
          },
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

## How you know it worked

Run the validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)) on your acknowledgement:

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile https://nrces.in/ndhm/fhir/r4/StructureDefinition/TaskBundle
```

It exits with code 0 and reports no errors.

You know the cycle worked when you have stored the UTR and the net amount from the notice. The exchange also accepted your `/v1/paymentnotice/on_request` call with 202.

## When it goes wrong

- **Your parser cannot find the PaymentNotice by id.** The payer's resources can arrive without an `id`. Resolve references by entry `fullUrl`.
- **Detail amounts have no currency.** `detail[].amount` carries `value` only. Treat it as INR.
- **You based logic on `Task.description`.** It is free text and can carry typos. Use `Task.code`, `paymentStatus` and the amounts.
- **The payer never marks the payment closed.** You did not send the acknowledgement, or it failed validation. Send the `paymentack` Task for the claim number.
