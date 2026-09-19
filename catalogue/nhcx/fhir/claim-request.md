---
id: nhcx.fhir.claim-request
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Claim request bundle
summary: >-
  The bundle a hospital sends after discharge to claim payment, with the final amounts,
  the discharge details and the documents the policy requires.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 9.4.1-9.4.8 and Appendix A.2.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. section 25 LM100 and Discharge Types.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/claim/claim_Request.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Claim.supportingInfo, Claim.type.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Claim Error Codes, discharge and death date rules.
- url: https://hcxsbx.abdm.gov.in/images/064cf2e059987011e53a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Claim.pdf
  hash: sha256:66290de20d57d69e681946a0101518092ca43b3775bb38997c43beb17fb38076
  fetched: '2026-09-14'
  note: Claim, listed on https://hcxsbx.abdm.gov.in/#/documents, not named in the NHCX document sheet. page 1, Claim Submit Request.
related:
  concepts:
  - nhcx.concept.claim-cycle
  - nhcx.concept.fhir-in-nhcx
  - nhcx.concept.pmjay-on-nhcx
  flows:
  - nhcx.flow.claim-submit
  endpoints:
  - nhcx.endpoint.claim-submit
  fhir:
  - nhcx.fhir.preauth-request
  - nhcx.fhir.claim-response
  - nhcx.fhir.collection-bundle
  - nhcx.fhir.terminologies
  - nhcx.fhir.validation
  errors:
  - nhcx.error.payr-1095
  - nhcx.error.payr-1096
  - nhcx.error.payr-1099
  - nhcx.error.payr-1502
  - nhcx.error.payr-1362
  - nhcx.error.payr-1043
  - nhcx.error.payr-1044
  tests:
  - nhcx.test.provider-uc-09
  - nhcx.test.tc-cl-01
  glossary:
  - nhcx.glossary.claim
  - nhcx.glossary.pmjay
  - shared.glossary.fhir
---

# Claim request bundle

## In plain words

A [claim](../glossary/claim.md) asks the payer to pay for treatment already given. It uses the same `Claim` resource as a preauthorisation, with `use` set to `claim`, inside a `ClaimBundle`. You send it on `/v1/claim/submit` after discharge.

Compared with the preauthorisation, the claim carries final amounts, discharge details, and the documents the policy asks for at claim time.

## Before you start

- For a package that needs approval, the preauthorisation was approved. See [the preauthorisation response](preauth-response.md).
- The patient is discharged, and you know the discharge type and stage.
- You have the claim-stage documents the InsurancePlan lists for the package.
- You can build a [preauthorisation bundle](preauth-request.md). The claim bundle has the same resources.

## What happens

### What changes from the preauthorisation

- `Claim.use` is `claim`.
- `item` carries the final dates, quantity and amounts. `total` is their sum.
- `supportingInfo` carries the claim-stage documents and the discharge details below.

### Discharge details in `supportingInfo`

| Category | Code | Value | Carries |
|---|---|---|---|
| `DIS` | `DTH`, `DTM`, `LAMA` or `DAMA` | `Before Surgery` or `After Surgery` | Discharge type and stage |
| `ONS` | `ADDD` | Date or string | Admission date |
| `ONS` | `DSDE` | Date or string | Discharge date |
| `ONS` | `PSP` | Date or string | Surgery date |
| `ONS` | `DTM` | Date or string | Date of death, required when the discharge type is `DTM` |
| `OTH` | `EDT` | Date or string | Registration date |

Categories come from `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category`. Codes come from `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-code`.

`DTH` is a discharge to home. `DTM` is a discharge to the mortuary. `LAMA` is leaving against medical advice. `DAMA` is a discharge against medical advice.

### LAMA and DAMA under PMJAY

For a LAMA or DAMA discharge before surgery, claim the procedure code `LM100` as the item. Set its quantity to the number of days admitted. `LM100` is claim-only: never send it on a preauthorisation.

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
        "use": "claim",
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
          },
          {
            "sequence": 2,
            "category": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category",
                  "code": "DIS"
                }
              ]
            },
            "code": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-code",
                  "code": "DTH"
                }
              ]
            },
            "valueString": "After Surgery"
          },
          {
            "sequence": 3,
            "category": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category",
                  "code": "ONS"
                }
              ]
            },
            "code": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-code",
                  "code": "ADDD"
                }
              ]
            },
            "valueString": "<ADMISSION_DATE_TIME>"
          },
          {
            "sequence": 4,
            "category": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category",
                  "code": "ONS"
                }
              ]
            },
            "code": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-code",
                  "code": "DSDE"
                }
              ]
            },
            "valueString": "<DISCHARGE_DATE_TIME>"
          },
          {
            "sequence": 5,
            "category": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category",
                  "code": "OTH"
                }
              ]
            },
            "code": {
              "coding": [
                {
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-code",
                  "code": "EDT"
                }
              ]
            },
            "valueString": "<REGISTRATION_DATE_TIME>"
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

After you send the bundle, `/v1/claim/on_submit` arrives with a `ClaimResponse` for your claim number. See [the claim response](claim-response.md).

## When it goes wrong

- **[PAYR-1095](../errors/payr-1095.md): invalid discharge information.** Add a `supportingInfo` entry with category `DIS` and a code from `DTH`, `DTM`, `LAMA` or `DAMA`.
- **[PAYR-1096](../errors/payr-1096.md): invalid death date.** A `DTM` discharge needs an `ONS` entry with code `DTM` carrying the date of death.
- **[PAYR-1099](../errors/payr-1099.md) or [PAYR-1502](../errors/payr-1502.md): wrong value type for a date entry.** Send the discharge or admission date as a timing (date or period) or a string.
- **[PAYR-1362](../errors/payr-1362.md): no `LM100` procedure for a LAMA or DAMA case.** Send `LM100` as the only item for a LAMA or DAMA discharge before surgery.
- **[PAYR-1043](../errors/payr-1043.md) or [PAYR-1044](../errors/payr-1044.md).** A date or date-time does not follow the FHIR format. Use `YYYY-MM-DD` or an ISO-8601 date-time with offset.
