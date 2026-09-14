---
id: nhcx.fhir.preauth-request
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Preauthorisation request bundle, a Claim with use preauthorization
summary: >-
  The bundle a hospital sends to ask a payer to approve a planned treatment before
  it happens, with the package, the diagnosis and the required documents.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.4.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/preauth/preauth_request.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. whole bundle.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications/domain-data-specifications/domain-data-models/e-objects
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications__domain-data-specifications__domain-data-models__e-objects.md
  hash: sha256:1d5d7553c709c4d237d623bc77259999f84c1b114ab51b25112cbed075352c5b
  fetched: '2026-09-14'
  note: Site page /domain-specifications/domain-data-specifications/domain-data-models/e-objects, text as shown on the site. Claim Request.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Bridge Error.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.claim-cycle
  - nhcx.concept.fhir-in-nhcx
  - nhcx.concept.insurance-plan
  flows:
  - nhcx.flow.preauth-submit
  endpoints:
  - nhcx.endpoint.preauth-submit
  fhir:
  - nhcx.fhir.collection-bundle
  - nhcx.fhir.preauth-response
  - nhcx.fhir.preauth-enhancement
  - nhcx.fhir.pmjay-insurance-plan
  - nhcx.fhir.claim-request
  - nhcx.fhir.terminologies
  - nhcx.fhir.validation
  decisions:
  - nhcx.decision.preauth-or-predetermination
  errors:
  - nhcx.error.payr-1011
  - nhcx.error.payr-1012
  - nhcx.error.payr-1079
  - nhcx.error.payr-1083
  - nhcx.error.payr-1019
  - nhcx.error.payr-1020
  - nhcx.error.payr-1021
  - nhcx.error.payr-1036
  - nhcx.error.payr-1086
  - nhcx.error.payr-1513
  tests:
  - nhcx.test.provider-uc-07
  - nhcx.test.tc-pa-01
  glossary:
  - nhcx.glossary.preauthorisation
  - nhcx.glossary.claim
  - shared.glossary.fhir
  - shared.glossary.snomed-ct
  - shared.glossary.hpr
---

# Preauthorisation request bundle, a Claim with use preauthorization

## In plain words

A [preauthorisation](../glossary/preauthorisation.md) asks the payer to approve a treatment before the hospital delivers it. It is a [FHIR](../../shared/glossary/fhir.md) `ClaimBundle` whose focal resource is a `Claim` with `use` set to `preauthorization`.

The same `Claim` shape later carries the final claim with `use` set to `claim`. You send the preauthorisation on `/v1/preauth/submit`.

## Before you start

- You have the payer's insurance plan. It gives you the specialty, package and stratification codes, and the documents each package needs. See [the PMJAY InsurancePlan](pmjay-insurance-plan.md).
- An eligibility check with purpose `auth-requirements` told you the package needs approval. See [the eligibility response](coverage-eligibility-response.md).
- You hold the treating doctor's [HPR](../../shared/glossary/hpr.md) id.
- Each required document is ready as a PDF or image to encode in base64, or as an ABDM health record to reference.

## What happens

### Resources in the bundle

| Resource | Role |
|---|---|
| `Claim` (`use` = `preauthorization`) | The request: items, diagnosis, procedure, documents, total |
| `Patient` | Identifiers typed `PMJAY` and `ABHA` |
| `Organization` (provider, payer) | `NPI` carrying your HFR ID; `NIIP` for the payer |
| `Coverage` | The policy, identifier typed `NH` |
| `Practitioner` | The care team member, identifier typed `HPIN` on `https://hpr.abdm.gov.in` |
| `Procedure` | One per item, referenced from `Claim.procedure` |
| ABDM record Compositions and their resources | Clinical documents referenced from `Claim.supportingInfo` |

### Claim elements

| Element | What goes in it |
|---|---|
| `identifier` | Your claim number, typed `CLN` from `ndhm-identifier-type-code` |
| `type` | SNOMED CT `737481003` "Inpatient care management (procedure)" |
| `use` | `preauthorization` |
| `priority` | `normal` from `processpriority` |
| `careTeam` | At least one entry, pointing at the Practitioner |
| `diagnosis` | ICD-10 code as a `diagnosisCodeableConcept` |
| `procedure` | One entry per Procedure resource |
| `insurance` | `focal: true`, pointing at the Coverage |
| `item` | Specialty in `category`, package in `productOrService`, dates, quantity, price, and the `procedureSequence` and `informationSequence` it uses |
| `supportingInfo` | One entry per required document, with `sequence`, `category`, `code` and a value |
| `total` | The sum of item `net` values |

Copy the specialty, package, stratification and document codings exactly as the payer's InsurancePlan gives them. Put a stratification, such as a ward or ICU level, in `item.modifier`.

A document goes in `supportingInfo` in one of two ways. Send a `valueAttachment` with base64 `data`, a `contentType` such as `application/pdf`, and a `title`. Or send a `valueReference` to a Composition in the bundle.

### Minimal bundle

```json
{
  "resourceType": "Bundle",
  "id": "<BUNDLE_ID_YOU_GENERATE>",
  "meta": {
    "lastUpdated": "<ISO_8601_TIMESTAMP_WITH_OFFSET>"
  },
  "identifier": {
    "system": "<YOUR_IDENTIFIER_SYSTEM_URL>",
    "value": "<YOUR_CLAIM_NUMBER>"
  },
  "type": "collection",
  "timestamp": "<ISO_8601_TIMESTAMP_WITH_OFFSET>",
  "entry": [
    {
      "fullUrl": "urn:uuid:<CLAIM_UUID>",
      "resource": {
        "resourceType": "Claim",
        "id": "<CLAIM_UUID>",
        "meta": {
          "profile": [
            "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Claim"
          ]
        },
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
            "system": "<YOUR_CLAIM_NUMBER_SYSTEM_URL>",
            "value": "<YOUR_CLAIM_NUMBER>"
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
        "use": "preauthorization",
        "patient": {
          "reference": "urn:uuid:<PATIENT_UUID>"
        },
        "created": "<ISO_8601_TIMESTAMP_WITH_OFFSET>",
        "insurer": {
          "reference": "urn:uuid:<PAYER_ORG_UUID>"
        },
        "provider": {
          "reference": "urn:uuid:<PROVIDER_ORG_UUID>"
        },
        "priority": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/processpriority",
              "code": "normal"
            }
          ]
        },
        "careTeam": [
          {
            "sequence": 1,
            "provider": {
              "reference": "urn:uuid:<PRACTITIONER_UUID>"
            }
          }
        ],
        "supportingInfo": [
          {
            "sequence": 1,
            "category": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category",
                  "code": "<CATEGORY_FROM_INSURANCE_PLAN_REQUIREMENT>"
                }
              ]
            },
            "code": {
              "coding": [
                {
                  "system": "<DOCUMENT_CODE_SYSTEM_FROM_INSURANCE_PLAN>",
                  "code": "<MAND_CODE_FROM_INSURANCE_PLAN>"
                }
              ]
            },
            "valueAttachment": {
              "contentType": "application/pdf",
              "title": "<DOCUMENT_NAME>",
              "data": "<BASE64_OF_THE_FILE>"
            }
          }
        ],
        "diagnosis": [
          {
            "sequence": 1,
            "diagnosisCodeableConcept": {
              "coding": [
                {
                  "system": "http://hl7.org/fhir/sid/icd-10",
                  "code": "<ICD10_CODE>",
                  "display": "<DIAGNOSIS_NAME>"
                }
              ]
            }
          }
        ],
        "procedure": [
          {
            "sequence": 1,
            "procedureReference": {
              "reference": "urn:uuid:<PROCEDURE_1_UUID>"
            }
          }
        ],
        "insurance": [
          {
            "sequence": 1,
            "focal": true,
            "coverage": {
              "reference": "urn:uuid:<COVERAGE_UUID>"
            }
          }
        ],
        "item": [
          {
            "sequence": 1,
            "careTeamSequence": [
              1
            ],
            "diagnosisSequence": [
              1
            ],
            "procedureSequence": [
              1
            ],
            "informationSequence": [
              1
            ],
            "category": {
              "coding": [
                {
                  "system": "<SPECIALTY_SYSTEM_FROM_INSURANCE_PLAN>",
                  "code": "<SPECIALTY_CODE_FROM_INSURANCE_PLAN>"
                }
              ]
            },
            "productOrService": {
              "coding": [
                {
                  "system": "<PACKAGE_SYSTEM_FROM_INSURANCE_PLAN>",
                  "code": "<PACKAGE_CODE_FROM_INSURANCE_PLAN>",
                  "display": "<PACKAGE_NAME>"
                }
              ]
            },
            "servicedPeriod": {
              "start": "<ADMISSION_DATE>",
              "end": "<EXPECTED_DISCHARGE_DATE>"
            },
            "quantity": {
              "value": 1
            },
            "unitPrice": {
              "value": "<PACKAGE_RATE_AS_A_NUMBER>"
            },
            "net": {
              "value": "<PACKAGE_RATE_AS_A_NUMBER>"
            }
          }
        ],
        "total": {
          "value": "<SUM_OF_ITEM_NET_AS_A_NUMBER>"
        }
      }
    },
    {
      "fullUrl": "urn:uuid:<PATIENT_UUID>",
      "resource": {
        "resourceType": "Patient",
        "id": "<PATIENT_UUID>",
        "meta": {
          "profile": [
            "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient"
          ]
        },
        "identifier": [
          {
            "type": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code",
                  "code": "PMJAY"
                }
              ]
            },
            "system": "https://bis.pmjay.gov.in",
            "value": "<PMJAY_BENEFICIARY_ID>"
          },
          {
            "type": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code",
                  "code": "ABHA"
                }
              ]
            },
            "system": "https://bis.pmjay.gov.in",
            "value": "<ABHA_NUMBER_AS_XX-XXXX-XXXX-XXXX>"
          }
        ],
        "name": [
          {
            "text": "<PATIENT_NAME>"
          }
        ],
        "gender": "<male|female|other|unknown>",
        "birthDate": "<YYYY-MM-DD>"
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
    },
    {
      "fullUrl": "urn:uuid:<COVERAGE_UUID>",
      "resource": {
        "resourceType": "Coverage",
        "id": "<COVERAGE_UUID>",
        "meta": {
          "profile": [
            "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Coverage"
          ]
        },
        "identifier": [
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "NH",
                  "display": "National Health Plan Identifier"
                }
              ]
            },
            "system": "<PAYER_POLICY_SYSTEM_URL>",
            "value": "<POLICY_NUMBER>"
          }
        ],
        "status": "active",
        "beneficiary": {
          "reference": "urn:uuid:<PATIENT_UUID>"
        },
        "payor": [
          {
            "reference": "urn:uuid:<PAYER_ORG_UUID>"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:<PRACTITIONER_UUID>",
      "resource": {
        "resourceType": "Practitioner",
        "id": "<PRACTITIONER_UUID>",
        "meta": {
          "profile": [
            "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Practitioner"
          ]
        },
        "identifier": [
          {
            "type": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code",
                  "code": "HPIN"
                }
              ]
            },
            "system": "https://hpr.abdm.gov.in",
            "value": "<TREATING_DOCTOR_HPR_ID>"
          }
        ],
        "name": [
          {
            "text": "<TREATING_DOCTOR_NAME>"
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:<PROCEDURE_1_UUID>",
      "resource": {
        "resourceType": "Procedure",
        "id": "<PROCEDURE_1_UUID>",
        "meta": {
          "profile": [
            "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Procedure"
          ]
        },
        "identifier": [
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "SNO",
                  "display": "Serial Number"
                }
              ]
            },
            "system": "<YOUR_IDENTIFIER_SYSTEM_URL>",
            "value": "1"
          }
        ],
        "status": "preparation",
        "code": {
          "coding": [
            {
              "system": "<PACKAGE_SYSTEM_FROM_INSURANCE_PLAN>",
              "code": "<PACKAGE_CODE_FROM_INSURANCE_PLAN>",
              "display": "<PACKAGE_NAME>"
            }
          ]
        },
        "subject": {
          "reference": "urn:uuid:<PATIENT_UUID>"
        }
      }
    }
  ]
}
```

## How you know it worked

Run the validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)):

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClaimBundle
```

It exits with code 0 and reports no errors.

After you send the bundle, `/v1/preauth/on_submit` arrives with a `ClaimResponse` whose identifier carries your claim number. See [the preauthorisation response](preauth-response.md).

## When it goes wrong

- **[PAYR-1011](../errors/payr-1011.md) or [PAYR-1012](../errors/payr-1012.md).** The Claim identifier or its `type` is missing. Add the `CLN` identifier.
- **[PAYR-1079](../errors/payr-1079.md) or [PAYR-1083](../errors/payr-1083.md).** No care team, or no HPR id on the Practitioner. Add `careTeam` and a Practitioner identifier typed `HPIN`.
- **[PAYR-1019](../errors/payr-1019.md), [PAYR-1020](../errors/payr-1020.md) or [PAYR-1021](../errors/payr-1021.md).** A `supportingInfo` sequence, category or code is invalid. Copy the category and code from the InsurancePlan requirement.
- **[PAYR-1036](../errors/payr-1036.md), or "Invalid Base64 value received in attachment".** The attachment is not base64, or `contentType` or `title` is empty. Allowed content types are `application/pdf`, `application/jpg`, `application/jpeg`, `application/png` and `application/fhir+json`.
- **[PAYR-1086](../errors/payr-1086.md): no procedure resource found for url.** `Claim.procedure` points at a Procedure that is not in the bundle.
- **[PAYR-1513](../errors/payr-1513.md): invalid diagnosis.** Send the diagnosis as `diagnosisCodeableConcept`, not as a reference.
