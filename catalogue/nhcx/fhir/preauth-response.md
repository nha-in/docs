---
id: nhcx.fhir.preauth-response
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Preauthorisation response bundle, a ClaimResponse
summary: >-
  The payer's decision on a preauthorisation: approved, partly approved, queried
  or rejected, with the amounts it will cover.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 8.5-8.5.4.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/preauth/preauthresponse_with_query.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. ClaimResponse.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/preauth/Query/preauth_response_queryUpdate_App.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. ClaimResponse.
related:
  concepts:
  - nhcx.concept.claim-cycle
  - nhcx.concept.queries-and-communication
  - nhcx.concept.fhir-in-nhcx
  flows:
  - nhcx.flow.preauth-submit
  - nhcx.flow.preauth-query-response
  - nhcx.flow.payer-process-a-request
  endpoints:
  - nhcx.endpoint.preauth-on-submit
  callbacks:
  - nhcx.callback.preauth-on-submit
  fhir:
  - nhcx.fhir.preauth-request
  - nhcx.fhir.query-update
  - nhcx.fhir.claim-response
  - nhcx.fhir.collection-bundle
  errors:
  - nhcx.error.nhcx-1015
  - nhcx.error.nhcx-1017
  tests:
  - nhcx.test.payer-uc-09
  glossary:
  - nhcx.glossary.preauthorisation
  - nhcx.glossary.adjudication
  - shared.glossary.fhir
---

# Preauthorisation response bundle, a ClaimResponse

## In plain words

The payer answers a [preauthorisation](../glossary/preauthorisation.md) with a [FHIR](../../shared/glossary/fhir.md) `ClaimResponseBundle` on `/v1/preauth/on_submit`. The focal resource is a `ClaimResponse` with `use` set to `preauthorization`.

It carries one of four decisions: approved, partially approved, queried or rejected. Read two fields together to know which one you have.

## Before you start

- As a provider, you sent a [preauthorisation request](preauth-request.md) and stored your claim number, item sequences and correlation id.
- You can open a sealed callback. See [receive, open and acknowledge a sealed message](../flows/receive-a-sealed-callback.md).
- As a payer, you have adjudicated the request. See [receive, adjudicate and answer a request](../flows/payer-process-a-request.md).

## What happens

### Resources in the bundle

`ClaimResponse`, the payer's `Patient` and `Coverage`, and the payer and provider `Organization` resources. Payer-built resources carry the `SUBSETTED` tag.

### Reading the decision

| Decision | `outcome` | `adjudication[0].reason.coding.code` | Next step |
|---|---|---|---|
| Approved | `complete` | `approved` | Treat the patient. Keep `preAuthRef` when present. |
| Partially approved | `partial` | `approved` | Read `processNote` for the reduction. |
| Queried | `partial` | `queried` | Answer with a [query update](query-update.md). |
| Rejected | `complete` | `cancelled` | The request is closed. |

### Other elements

| Element | Meaning |
|---|---|
| `identifier` | Your claim number, typed `CLN` |
| `disposition` | The decision in free text |
| `item[].itemSequence` | The `Claim.item.sequence` the line answers |
| `item[].adjudication[]` | Categories `eligible` (amount), `reason` (query history), `eligpercent`, `eligquant`, `status` (`Approved` or `Queried`) |
| `total[]` | `benefit` total, and an `eligible` total with id `PMJAY-T` |
| `processNote[]` | Explanation of a reduction, linked from `item.noteNumber` |

The `reason` adjudication carries a pipe-separated history. Each part reads `USER~date and time~type~comment~trust`. Parse it as plain text.

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
          "coding": [{
              "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code", "code": "CLN", "display": "Claim number"
            }]
        },
        "system": "<CLAIM_NUMBER_SYSTEM_URL>",
        "value": "<CLAIM_NUMBER_FROM_THE_REQUEST>"
      }
    ],
    "status": "active",
    "type": {
      "coding": [{
          "system": "http://snomed.info/sct", "code": "737481003", "display": "Inpatient care management (procedure)"
        }]
    },
    "use": "preauthorization",
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
    "payeeType": {
      "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/payeetype", "code": "provider", "display": "Provider"
        }]
    },
    "item": [
      {
        "itemSequence": 1,
        "adjudication": [
          {
            "category": {
              "coding": [{
                  "system": "https://hl7.org/fhir/R4/valueset-adjudication.html", "code": "eligible", "display": "Eligible Amount"
                }]
            },
            "amount": {
              "value": "<APPROVED_AMOUNT_AS_A_NUMBER>"
            }
          },
          {
            "category": {
              "coding": [{
                  "system": "https://hl7.org/fhir/R4/valueset-adjudication.html", "code": "status", "display": "Item adjudication status"
                }]
            },
            "reason": {
              "coding": [{
                  "code": "Approved", "display": "Approved"
                }]
            }
          }
        ]
      }
    ],
    "adjudication": [
      {
        "category": {
          "coding": [{
              "code": "status", "display": "Status"
            }]
        },
        "reason": {
          "coding": [{
              "code": "approved", "display": "Approved"
            }]
        }
      }
    ],
    "total": [
      {
        "category": {
          "coding": [{
              "system": "https://hl7.org/fhir/R4/valueset-adjudication.html", "code": "benefit", "display": "Benefit Amount"
            }]
        },
        "amount": {
          "value": "<APPROVED_AMOUNT_AS_A_NUMBER>"
        }
      }
    ]
  }
}
```

## How you know it worked

As a provider:

- `/v1/preauth/on_submit` arrives with a `ClaimResponse` whose `identifier` value equals your claim number.
- `outcome` and `adjudication[0].reason.coding.code` map to one row of the decision table.

As a payer, run the validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)):

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClaimResponseBundle
```

It exits with code 0 and reports no errors.

## When it goes wrong

- **You treated `outcome: complete` as approval.** A rejection is also `complete`. Always read `adjudication[0].reason.coding.code` as well.
- **Amounts land on the wrong item.** Items can arrive in any order. Match `item.itemSequence` to your `Claim.item.sequence`.
- **The requestor Organization is not yours.** The payer may identify your facility by its own id. Match the response on claim number and correlation id instead.
- **Your parser expects a currency.** Adjudication amounts carry `value` only. Treat them as INR.
- **A payer's validator run fails on `ClaimResponse.type`.** Base FHIR R4 requires `type`. Include it.
- **[NHCX-1015](../errors/nhcx-1015.md): invalid response received from receiver.** The exchange rejected the payer's response. The payer corrects and resends it.
