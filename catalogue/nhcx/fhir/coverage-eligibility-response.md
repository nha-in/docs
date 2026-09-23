---
id: nhcx.fhir.coverage-eligibility-response
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: CoverageEligibilityResponse bundle
summary: >-
  The payer's answer to an eligibility check: whether the policy is in force, how
  much cover is left, and whether the treatment needs prior approval.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 7.6.
- url: https://hcxsbx.abdm.gov.in/images/13093b5f9b88fe826123.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Insurance Plan IG.docx
  hash: sha256:e9c6c82b6d67fd8476d6d19a5961419beb04e3c0613533453ed1e16e2a569cc1
  fetched: '2026-09-14'
  note: Insurance Plan IG, row 25 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Coverage Eligibility response section.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/coverageeligibility/coverageresponse_validation.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Bundle entries and CoverageEligibilityResponse.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/coverageeligibility/coverageresponse_auth-requirement.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. insurance.item.
related:
  concepts:
  - nhcx.concept.coverage-eligibility-purposes
  - nhcx.concept.fhir-in-nhcx
  flows:
  - nhcx.flow.coverage-eligibility-check
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.payer-process-a-request
  endpoints:
  - nhcx.endpoint.coverageeligibility-on-check
  callbacks:
  - nhcx.callback.coverageeligibility-on-check
  fhir:
  - nhcx.fhir.coverage-eligibility-request
  - nhcx.fhir.collection-bundle
  - nhcx.fhir.preauth-request
  - nhcx.fhir.terminologies
  errors:
  - nhcx.error.nhcx-1017
  tests:
  - nhcx.test.payer-uc-07
  glossary:
  - nhcx.glossary.coverage-eligibility
  - nhcx.glossary.preauthorisation
  - shared.glossary.fhir
---

# CoverageEligibilityResponse bundle

## In plain words

The payer answers a [coverage eligibility](../glossary/coverage-eligibility.md) request with a [FHIR](../../shared/glossary/fhir.md) collection bundle on `/v1/coverageeligibility/on_check`. Its focal resource is `CoverageEligibilityResponse`.

It tells the hospital whether the policy is in force and how much cover is used and left. It also says whether each item needs [preauthorisation](../glossary/preauthorisation.md). It can also list the documents a preauthorisation must carry.

## Before you start

- As a provider, you sent a [CoverageEligibilityRequest bundle](coverage-eligibility-request.md) and kept its `fullUrl` and your correlation id.
- You can open a sealed callback. See [receive, open and acknowledge a sealed message](../flows/receive-a-sealed-callback.md).
- As a payer, you have the request bundle in hand. See [receive, adjudicate and answer a request](../flows/payer-process-a-request.md).

## What happens

### How the payer builds the bundle

The bundle echoes the request's resources first. Each echoed resource carries the tag `SUBSETTED` (system `http://terminology.hl7.org/CodeSystem/v3-ObservationValue`). The payer then adds its own `CoverageEligibilityResponse`, `Patient`, `Coverage` and the two `Organization` resources.

Find the response by `resourceType`, not by position.

### Elements to read

| Element | Meaning |
|---|---|
| `request.reference` | The `fullUrl` of the request it answers |
| `outcome` | `complete` when the payer processed the request |
| `disposition` | Free text, for example `Policy is currently in-force` |
| `insurance[].inforce` | `true` when the policy is in force |
| `insurance[].item[].productOrService` | The item the line answers |
| `insurance[].item[].excluded` | `true` when the item is not covered on its own |
| `insurance[].item[].authorizationRequired` | `true` when the item needs preauthorisation |
| `insurance[].item[].authorizationSupporting[]` | Document codes the preauthorisation must carry, such as `MAND0409` |
| `insurance[].item[].benefit[]` | `allowedMoney` (remaining) and `usedMoney` (used) in `INR`, type from `http://terminology.hl7.org/CodeSystem/ex-benefitcategory` |

The payer's `Coverage` carries the plan in `class` with type `XV` and the policy in an identifier typed `NH`.

### Minimal response resource

A payer's bundle carries this entry plus the echoed request entries and the `Patient`, `Coverage` and `Organization` entries it references.

```json
{
  "fullUrl": "urn:uuid:<CERESP_UUID>",
  "resource": {
    "resourceType": "CoverageEligibilityResponse",
    "id": "<CERESP_UUID>",
    "meta": {
      "profile": [
        "http://hl7.org/fhir/StructureDefinition/CoverageEligibilityResponse"
      ]
    },
    "identifier": [
      {
        "system": "<PAYER_IDENTIFIER_SYSTEM_URL>",
        "value": "<RESPONSE_NUMBER>"
      }
    ],
    "status": "active",
    "purpose": [
      "validation"
    ],
    "patient": {
      "reference": "<PATIENT_ENTRY_FULLURL>"
    },
    "created": "<ISO_8601_TIMESTAMP_WITH_OFFSET>",
    "requestor": {
      "reference": "<PROVIDER_ORG_ENTRY_FULLURL>"
    },
    "request": {
      "reference": "<FULLURL_OF_THE_ECHOED_REQUEST_ENTRY>"
    },
    "outcome": "complete",
    "disposition": "Policy is currently in-force",
    "insurer": {
      "reference": "<PAYER_ORG_ENTRY_FULLURL>"
    },
    "insurance": [
      {
        "coverage": {
          "reference": "<COVERAGE_ENTRY_FULLURL>"
        },
        "inforce": true,
        "item": [
          {
            "productOrService": {
              "coding": [
                {
                  "system": "<PACKAGE_SYSTEM>",
                  "code": "<PACKAGE_CODE>",
                  "display": "<PACKAGE_NAME>"
                }
              ]
            },
            "excluded": false,
            "benefit": [
              {
                "type": {
                  "coding": [
                    {
                      "system": "http://terminology.hl7.org/CodeSystem/ex-benefitcategory",
                      "code": "30",
                      "display": "Health Benefit Plan Coverage"
                    }
                  ]
                },
                "allowedMoney": {
                  "value": "<REMAINING_SUM_INSURED_AS_A_NUMBER>",
                  "currency": "INR"
                },
                "usedMoney": {
                  "value": "<USED_SUM_INSURED_AS_A_NUMBER>",
                  "currency": "INR"
                }
              }
            ],
            "authorizationRequired": true
          }
        ]
      }
    ]
  }
}
```

## How you know it worked

As a provider, you know the check worked when:

- `/v1/coverageeligibility/on_check` arrives with a `CoverageEligibilityResponse` whose `request.reference` equals your request's `fullUrl`.
- `outcome` is `complete` and `insurance[].inforce` is `true`.
- For an `auth-requirements` check, each item states `authorizationRequired`.

As a payer, run the validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)) on your bundle:

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile https://nrces.in/ndhm/fhir/r4/StructureDefinition/CoverageEligibilityResponseBundle
```

It exits with code 0 and reports no errors.

## When it goes wrong

- **You cannot match the response to your request.** Match on `request.reference` and the correlation id in the protected header. Do not match on `Bundle.identifier.system`: the reference payer writes it as `https://payer.pmajy.nha.gov.in`. Do not match on the echoed request `id` either: it can differ from the id you sent.
- **A code lookup fails.** The reference payer sends some SNOMED codes under `http://snomed.info/sct0`. Compare the code value and treat the system loosely when you only display the line.
- **An item shows `excluded: true`.** The package is not covered without approval. Read `authorizationRequired` and raise a preauthorisation.
- **[NHCX-1015](../errors/nhcx-1015.md) or [NHCX-1017](../errors/nhcx-1017.md): invalid response received from receiver.** The payer's response failed the exchange's checks. The payer fixes and resends it.
