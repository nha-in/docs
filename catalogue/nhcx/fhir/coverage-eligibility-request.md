---
id: nhcx.fhir.coverage-eligibility-request
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: CoverageEligibilityRequest bundle
summary: >-
  The bundle a hospital sends to ask a payer whether a patient's policy is in force,
  what it covers, and whether a treatment needs prior approval.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 7.5.
- url: https://hcxsbx.abdm.gov.in/images/13093b5f9b88fe826123.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Insurance Plan IG.docx
  hash: sha256:e9c6c82b6d67fd8476d6d19a5961419beb04e3c0613533453ed1e16e2a569cc1
  fetched: '2026-09-14'
  note: Insurance Plan IG, row 25 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Coverage Eligibility request section.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/coverageeligibility/coveragerequest_validation.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. CoverageEligibilityRequest, Patient, Organization, Coverage.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/coverageeligibility/coveragerequest_auth-requirement.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. CoverageEligibilityRequest.item.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Bridge Error.
related:
  concepts:
  - nhcx.concept.coverage-eligibility-purposes
  - nhcx.concept.policy-linking
  - nhcx.concept.fhir-in-nhcx
  decisions:
  - nhcx.decision.eligibility-purpose
  flows:
  - nhcx.flow.coverage-eligibility-check
  endpoints:
  - nhcx.endpoint.coverageeligibility-check
  fhir:
  - nhcx.fhir.collection-bundle
  - nhcx.fhir.coverage-eligibility-response
  - nhcx.fhir.insurance-plan-bundle
  - nhcx.fhir.validation
  errors:
  - nhcx.error.payr-1032
  - nhcx.error.payr-1033
  - nhcx.error.payr-1009
  - nhcx.error.payr-1010
  - nhcx.error.payr-1090
  - nhcx.error.payr-1091
  tests:
  - nhcx.test.provider-uc-05
  - nhcx.test.tc-ce-01
  glossary:
  - nhcx.glossary.coverage-eligibility
  - shared.glossary.hfr
  - shared.glossary.abha
  - nhcx.glossary.pmjay
  - shared.glossary.fhir
---

# CoverageEligibilityRequest bundle

## In plain words

A [coverage eligibility](../glossary/coverage-eligibility.md) request asks a payer about one patient's policy before treatment. It is a [FHIR](../../shared/glossary/fhir.md) collection bundle whose focal resource is `CoverageEligibilityRequest`.

The `purpose` element says what you are asking:

- `validation`: is the policy in force?
- `benefits`: what does it cover?
- `auth-requirements`: does this treatment need preauthorisation?
- `discovery`: does a policy exist?

You send it on `/v1/coverageeligibility/check`.

## Before you start

- The patient's policy is linked to their [ABHA](../../shared/glossary/abha.md). See [policy linking](../concepts/policy-linking.md).
- You have fetched the payer's insurance plan, so you hold the package code you are asking about. See [InsurancePlan bundles](insurance-plan-bundle.md).
- You know your facility's [HFR](../../shared/glossary/hfr.md) ID. It must match the registry id recorded for you on NHCX.
- You have chosen a purpose. See [which purpose to send](../decisions/eligibility-purpose.md).
- You have the patient's [PMJAY](../glossary/pmjay.md) beneficiary id and ABHA number.

## What happens

### Resources in the bundle

| Resource | Role | Key elements |
|---|---|---|
| `CoverageEligibilityRequest` | The question | `status` `active`, `purpose`, `patient`, `created`, `provider`, `insurer`, `insurance.coverage`, `item` |
| `Patient` | The beneficiary | Identifiers typed `PMJAY` and `ABHA` from `ndhm-identifier-type-code` |
| `Organization` (provider) | Your facility | Identifier typed `NPI` carrying your HFR ID, system `https://facility.abdm.gov.in`; type `prov` |
| `Organization` (payer) | The insurer | Identifier typed `NIIP`; type `pay` |
| `Coverage` | The policy | Identifier typed `NH` carrying the policy number; `beneficiary`, `payor` |
| `Practitioner` | Who entered the request | Identifier on `https://hpr.abdm.gov.in` |

Every resource declares `https://nrces.in/ndhm/fhir/r4/StructureDefinition/<ResourceType>` in `meta.profile`.

### Code systems

- `priority`: `http://terminology.hl7.org/CodeSystem/processpriority`, code `normal`.
- `facility.identifier.system`: `https://nhcx.pmjay.gov.in`, value your HFR ID.
- Identifier types: `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code` (`PMJAY`, `ABHA`, `HPIN`) and `http://terminology.hl7.org/CodeSystem/v2-0203` (`NPI`, `NIIP`, `NH`).
- `item.productOrService`: copy the package coding exactly as the payer's InsurancePlan gives it in `coverage.benefit.type`.

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
    "value": "<YOUR_CASE_NUMBER>"
  },
  "type": "collection",
  "timestamp": "<ISO_8601_TIMESTAMP_WITH_OFFSET>",
  "entry": [
    {
      "fullUrl": "urn:uuid:<CER_UUID>",
      "resource": {
        "resourceType": "CoverageEligibilityRequest",
        "id": "<CER_UUID>",
        "meta": {
          "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/CoverageEligibilityRequest"]
        },
        "identifier": [{
            "system": "<YOUR_IDENTIFIER_SYSTEM_URL>", "value": "<YOUR_REQUEST_NUMBER>"
          }],
        "status": "active",
        "priority": {
          "coding": [{
              "system": "http://terminology.hl7.org/CodeSystem/processpriority", "code": "normal", "display": "Normal"
            }]
        },
        "purpose": ["validation"],
        "patient": {
          "reference": "urn:uuid:<PATIENT_UUID>"
        },
        "servicedDate": "<YYYY-MM-DD>",
        "created": "<ISO_8601_TIMESTAMP_WITH_OFFSET>",
        "enterer": {
          "reference": "urn:uuid:<PRACTITIONER_UUID>"
        },
        "provider": {
          "reference": "urn:uuid:<PROVIDER_ORG_UUID>"
        },
        "insurer": {
          "reference": "urn:uuid:<PAYER_ORG_UUID>"
        },
        "facility": {
          "identifier": {
            "system": "https://nhcx.pmjay.gov.in",
            "value": "<YOUR_HFR_ID>"
          }
        },
        "insurance": [{
            "focal": true, "coverage": {
              "reference": "urn:uuid:<COVERAGE_UUID>"
            }
          }],
        "item": [
          {
            "productOrService": {
              "coding": [{
                  "system": "<PACKAGE_SYSTEM_FROM_INSURANCE_PLAN>", "code": "<PACKAGE_CODE_FROM_INSURANCE_PLAN>", "display": "<PACKAGE_NAME>"
                }]
            }
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:<PATIENT_UUID>",
      "resource": {
        "resourceType": "Patient",
        "id": "<PATIENT_UUID>",
        "meta": {
          "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient"]
        },
        "identifier": [
          {
            "type": {
              "coding": [{
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code", "code": "PMJAY"
                }]
            },
            "system": "https://bis.pmjay.gov.in",
            "value": "<PMJAY_BENEFICIARY_ID>"
          },
          {
            "type": {
              "coding": [{
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code", "code": "ABHA"
                }]
            },
            "system": "https://bis.pmjay.gov.in",
            "value": "<ABHA_NUMBER_AS_XX-XXXX-XXXX-XXXX>"
          }
        ],
        "name": [{
            "text": "<PATIENT_NAME>"
          }],
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
    },
    {
      "fullUrl": "urn:uuid:<COVERAGE_UUID>",
      "resource": {
        "resourceType": "Coverage",
        "id": "<COVERAGE_UUID>",
        "meta": {
          "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Coverage"]
        },
        "identifier": [
          {
            "type": {
              "coding": [{
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "NH", "display": "National Health Plan Identifier"
                }]
            },
            "system": "<PAYER_POLICY_SYSTEM_URL>",
            "value": "<POLICY_NUMBER>"
          }
        ],
        "status": "active",
        "beneficiary": {
          "reference": "urn:uuid:<PATIENT_UUID>"
        },
        "payor": [{
            "reference": "urn:uuid:<PAYER_ORG_UUID>"
          }]
      }
    },
    {
      "fullUrl": "urn:uuid:<PRACTITIONER_UUID>",
      "resource": {
        "resourceType": "Practitioner",
        "id": "<PRACTITIONER_UUID>",
        "meta": {
          "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Practitioner"]
        },
        "identifier": [
          {
            "type": {
              "coding": [{
                  "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code", "code": "HPIN"
                }]
            },
            "system": "https://hpr.abdm.gov.in",
            "value": "<TREATING_DOCTOR_HPR_ID>"
          }
        ],
        "name": [{
            "text": "<TREATING_DOCTOR_NAME>"
          }]
      }
    }
  ]
}
```

Change `purpose` to `benefits`, `auth-requirements` or `discovery` for the other questions. Send at least one `item`.

## How you know it worked

Run the HL7 validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)) against the bundle you built, with the bundle profile named on the command line:

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile https://nrces.in/ndhm/fhir/r4/StructureDefinition/CoverageEligibilityRequestBundle
```

The validator exits with code 0 and reports no errors.

After you send the bundle, `/v1/coverageeligibility/on_check` arrives at your registered endpoint. It carries a `CoverageEligibilityResponse` whose `request.reference` points at your request. See [the response bundle](coverage-eligibility-response.md).

## When it goes wrong

- **[PAYR-1033](../errors/payr-1033.md): no items received.** Items are mandatory for the purpose you sent. Add the package you are asking about.
- **[PAYR-1032](../errors/payr-1032.md): invalid purpose.** Use one of `validation`, `benefits`, `auth-requirements`, `discovery`.
- **[PAYR-1009](../errors/payr-1009.md) or [PAYR-1010](../errors/payr-1010.md).** The Patient identifier or its `type` is missing.
- **"HFR Id in the request does not match with the associated registry id in NHCX."** The `NPI` identifier on your provider Organization must equal the registry id you registered with.
- **[PAYR-1090](../errors/payr-1090.md) or [PAYR-1091](../errors/payr-1091.md).** The Coverage identifier or its `type` is missing.
