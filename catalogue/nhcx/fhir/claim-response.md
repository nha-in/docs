---
id: nhcx.fhir.claim-response
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Claim response bundle
summary: >-
  The payer's decision on a claim: approved, partly approved, queried or rejected,
  with the approved amount and any deductions.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 9.5.1-9.5.6.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/claim/claim_queryUpdate_response.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. ClaimResponse.item.adjudication, total.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/claim/claimresponse_withQuery.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. ClaimResponse.outcome, adjudication.
related:
  concepts:
  - nhcx.concept.claim-cycle
  - nhcx.concept.reprocess-and-cancel
  flows:
  - nhcx.flow.claim-submit
  - nhcx.flow.claim-query-response
  - nhcx.flow.claim-reprocess
  - nhcx.flow.payer-process-a-request
  endpoints:
  - nhcx.endpoint.claim-on-submit
  callbacks:
  - nhcx.callback.claim-on-submit
  fhir:
  - nhcx.fhir.claim-request
  - nhcx.fhir.query-update
  - nhcx.fhir.task
  - nhcx.fhir.payment-notice
  - nhcx.fhir.preauth-response
  tests:
  - nhcx.test.payer-uc-11
  glossary:
  - nhcx.glossary.claim
  - nhcx.glossary.adjudication
  - shared.glossary.fhir
---

# Claim response bundle

## In plain words

The payer answers a [claim](../glossary/claim.md) with a `ClaimResponseBundle` on `/v1/claim/on_submit`. The focal resource is a `ClaimResponse` with `use` set to `claim`.

It has the same shape as a preauthorisation response. It adds the claimed amount and any deductions, and an approval leads on to payment.

## Before you start

- As a provider, you sent a [claim request](claim-request.md) and stored the claim number and item sequences.
- You can open a sealed callback. See [receive, open and acknowledge a sealed message](../flows/receive-a-sealed-callback.md).
- You know how to read a [preauthorisation response](preauth-response.md). The fields are the same.

## What happens

### Reading the decision

| `outcome` | `adjudication[0].reason.coding.code` | `benefit` total | What to do |
|---|---|---|---|
| `complete` | `approved` | above 0 | Full approval. Wait for the [payment notice](payment-notice.md). |
| `partial` | `approved` | above 0 | Partial approval. Read `processNote` for the reduction. |
| `partial` | `queried` | 0 | Send a [query update](query-update.md). |
| `complete` | `cancelled` | 0 or carried | Rejected. Decide whether to raise a [reprocess task](task.md). |

`outcome: complete` closes the claim, whether approved or rejected. `outcome: partial` means the claim is still open.

### Amounts

| Element | Meaning |
|---|---|
| `item[].adjudication[]` category `eligible` | Amount eligible for the item |
| `item[].adjudication[]` category `deductible` | A deduction, with its reason in `reason`, for example `DEDUCT/01` |
| `total[]` category `benefit` | Amount approved for payment |
| `total[]` category `submitted` | Amount claimed |
| `total[]` with id `PMJAY-T`, category `eligible` | Total eligible amount |

### Minimal response resource

A payer's bundle carries this entry plus the `Patient`, `Coverage` and `Organization` entries it references.

```json
{
  "fullUrl": "urn:uuid:<CLAIMRESPONSE_UUID>",
  "resource": {
    "resourceType": "ClaimResponse",
    "id": "<CLAIMRESPONSE_UUID>",
    "identifier": [
      {
        "type": {
          "coding": [
            {
              "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code",
              "code": "CLN",
              "display": "Claim number"
            }
          ]
        },
        "system": "<CLAIM_NUMBER_SYSTEM_URL>",
        "value": "<CLAIM_NUMBER_FROM_THE_REQUEST>"
      }
    ],
    "status": "active",
    "type": {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "737481003",
          "display": "Inpatient care management (procedure)"
        }
      ]
    },
    "use": "claim",
    "patient": {
      "reference": "<PATIENT_ENTRY_FULLURL>"
    },
    "created": "<ISO_8601_TIMESTAMP_WITH_OFFSET>",
    "insurer": {
      "reference": "<PAYER_ORG_ENTRY_FULLURL>"
    },
    "requestor": {
      "reference": "<PROVIDER_ORG_ENTRY_FULLURL>"
    },
    "outcome": "complete",
    "disposition": "<DECISION_TEXT>",
    "item": [
      {
        "itemSequence": 1,
        "adjudication": [
          {
            "category": {
              "coding": [
                {
                  "system": "https://hl7.org/fhir/R4/valueset-adjudication.html",
                  "code": "eligible",
                  "display": "Eligible Amount"
                }
              ]
            },
            "amount": {
              "value": "<ELIGIBLE_AMOUNT_AS_A_NUMBER>"
            }
          },
          {
            "category": {
              "coding": [
                {
                  "code": "deductible",
                  "display": "Deductible"
                }
              ]
            },
            "reason": {
              "coding": [
                {
                  "code": "<DEDUCTION_REASON_CODE>",
                  "display": "<DEDUCTION_REASON>"
                }
              ]
            },
            "amount": {
              "value": "<DEDUCTED_AMOUNT_AS_A_NUMBER>"
            }
          },
          {
            "category": {
              "coding": [
                {
                  "system": "https://hl7.org/fhir/R4/valueset-adjudication.html",
                  "code": "status",
                  "display": "Item adjudication status"
                }
              ]
            },
            "reason": {
              "coding": [
                {
                  "code": "Approved",
                  "display": "Approved"
                }
              ]
            }
          }
        ]
      }
    ],
    "adjudication": [
      {
        "category": {
          "coding": [
            {
              "code": "status",
              "display": "Status"
            }
          ]
        },
        "reason": {
          "coding": [
            {
              "code": "approved",
              "display": "Approved"
            }
          ]
        }
      }
    ],
    "total": [
      {
        "category": {
          "coding": [
            {
              "system": "https://hl7.org/fhir/R4/valueset-adjudication.html",
              "code": "benefit",
              "display": "Benefit Amount"
            }
          ]
        },
        "amount": {
          "value": "<APPROVED_AMOUNT_AS_A_NUMBER>"
        }
      },
      {
        "category": {
          "coding": [
            {
              "system": "https://hl7.org/fhir/R4/valueset-adjudication.html",
              "code": "submitted",
              "display": "Submitted Amount"
            }
          ]
        },
        "amount": {
          "value": "<CLAIMED_AMOUNT_AS_A_NUMBER>"
        }
      }
    ]
  }
}
```

## How you know it worked

As a provider:

- `/v1/claim/on_submit` arrives with a `ClaimResponse` whose `identifier` value equals your claim number.
- `outcome`, the adjudication reason code and the `benefit` total map to one row of the decision table.

As a payer, run the validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)):

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClaimResponseBundle
```

It exits with code 0 and reports no errors.

## When it goes wrong

- **You recorded a rejection as an approval.** Both are `outcome: complete`. The reason code `cancelled` marks a rejection.
- **You keyed the claim on the identifier system.** The reference payer uses the same identifier system for claims and preauthorisations. Match on the identifier value and your correlation id.
- **The approved amount is lower than you claimed.** Read the `deductible` adjudication and its reason. Raise a [reprocess task](task.md) only if you dispute it.
- **Your parser expects a currency on amounts.** Adjudication amounts carry `value` only. Treat them as INR.
