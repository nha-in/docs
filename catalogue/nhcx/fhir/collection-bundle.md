---
id: nhcx.fhir.collection-bundle
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The NHCX collection bundle and its required elements
summary: >-
  Every claims message you send is one bundle of type collection, holding the main
  business resource and every resource it points to.
sources:
- url: https://hcxsbx.abdm.gov.in/images/2c3fbb4e6b09f0834f69.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Implementation Guide for Adoption of FHIR in ABDM and NHCX.pdf
  hash: sha256:549377c9c26b1bd23decac3a1b9e5ebedfdc8e0fe99e53ef733859b188f51366
  fetched: '2026-09-14'
  note: Implementation Guide for Adoption of FHIR in ABDM and NHCX, row 14 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 9-10, 12, 19 and 21.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 1.3 Key Principles.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheets Reprocess, Search, Communication, Insurance Plan.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications.md
  hash: sha256:56234dd8a55fe4eb9dd852779b22b522b04760c9bec5c263d5e9bc3ac2c6f167
  fetched: '2026-09-14'
  note: Site page /domain-specifications, text as shown on the site. Domain Data Specifications section.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications/domain-data-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications__domain-data-specifications.md
  hash: sha256:d5db7e162b098b4c9555367bd64d60ba7734ceee21eee7144a49cefa4f634fd8
  fetched: '2026-09-14'
  note: Site page /domain-specifications/domain-data-specifications, text as shown on the site. Key Design Considerations.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. section 7 reference documents.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Bridge Error.
related:
  concepts:
  - nhcx.concept.fhir-in-nhcx
  - nhcx.concept.jwe-envelope
  - nhcx.concept.error-code-spaces
  fhir:
  - nhcx.fhir.validation
  - nhcx.fhir.terminologies
  - nhcx.fhir.coverage-eligibility-request
  - nhcx.fhir.preauth-request
  - nhcx.fhir.claim-request
  - nhcx.fhir.task
  - nhcx.fhir.insurance-plan-bundle
  - shared.fhir.hl7-validator-recipe
  errors:
  - nhcx.error.payr-1008
  - nhcx.error.payr-1004
  - nhcx.error.payr-1029
  - nhcx.error.payr-1031
  - nhcx.error.payr-1040
  - nhcx.error.payr-1009
  - nhcx.error.payr-1010
  glossary:
  - shared.glossary.fhir
  - shared.glossary.nrces
  - shared.glossary.nhcx
  - nhcx.glossary.jwe
  troubleshooting:
  - nhcx.troubleshooting.bundle-rejected
---

# The NHCX collection bundle and its required elements

## In plain words

Every [NHCX](../../shared/glossary/nhcx.md) use case carries its business content as one [FHIR](../../shared/glossary/fhir.md) R4 (4.0.1) `Bundle`. The bundle type is always `collection`.

A collection bundle groups the resources one workflow step needs. That means the claim or request, the patient, the provider, the payer, the policy and the documents. It is not a clinical document, so it has no `Composition` at its root.

You build the bundle, seal it inside the [JWE](../glossary/jwe.md) payload of the call, and send it. [NRCeS](../../shared/glossary/nrces.md) publishes the profiles at https://nrces.in/ndhm/fhir/r4/hcx-profile.html.

## Before you start

- You know which use case you are building. The table in the next section maps each use case to its bundle profile.
- You can seal a JSON payload. See [the JWE envelope](../concepts/jwe-envelope.md).
- The HL7 validator runs on your machine. See [validating a bundle](validation.md).
- You have read [FHIR in NHCX](../concepts/fhir-in-nhcx.md) for how bundles fit the claim cycle.

## What happens

### The six bundle profiles

| Profile | Canonical URL | Focal resource | Carried on |
|---|---|---|---|
| ClaimBundle | `https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClaimBundle` | `Claim` | `/v1/preauth/submit`, `/v1/predetermination/submit`, `/v1/claim/submit` |
| ClaimResponseBundle | `https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClaimResponseBundle` | `ClaimResponse` | the matching `on_submit` paths |
| CoverageEligibilityRequestBundle | `https://nrces.in/ndhm/fhir/r4/StructureDefinition/CoverageEligibilityRequestBundle` | `CoverageEligibilityRequest` | `/v1/coverageeligibility/check` |
| CoverageEligibilityResponseBundle | `https://nrces.in/ndhm/fhir/r4/StructureDefinition/CoverageEligibilityResponseBundle` | `CoverageEligibilityResponse` | `/v1/coverageeligibility/on_check` |
| TaskBundle | `https://nrces.in/ndhm/fhir/r4/StructureDefinition/TaskBundle` | `Task` | `/v1/insuranceplan/request`, `/v1/communication/*`, `/v1/paymentnotice/*`, `/v1/task/*`, `/v1/search/*` |
| InsurancePlanBundle | `https://nrces.in/ndhm/fhir/r4/StructureDefinition/InsurancePlanBundle` | `InsurancePlan` | `/v1/insuranceplan/on_request` |

### Bundle-level elements

| Element | What you put in it |
|---|---|
| `resourceType` | `Bundle` |
| `id` | A logical id you generate for this bundle |
| `meta.lastUpdated` | An ISO-8601 instant with offset, for example `2020-08-15T17:02:53.495+05:30` |
| `identifier` | `system` and `value` of your business number for the case, such as the claim number |
| `type` | `collection` |
| `timestamp` | When you assembled the bundle |
| `entry[]` | One entry per resource, each with `fullUrl` and `resource` |

### Entry rules

- Put the focal resource first when you build a request.
- Give every entry a `fullUrl`, either `urn:uuid:<UUID>` or an absolute URL.
- Every `reference` inside the bundle must equal the `fullUrl` of an entry in the same bundle.
- Declare the NRCeS profile on every resource you build: `meta.profile` = `https://nrces.in/ndhm/fhir/r4/StructureDefinition/<ResourceType>`.
- Give every identifier a `type` coding. The payer rejects a Patient, Claim, Organization, Coverage, Procedure or Practitioner identifier without one.
- Attach clinical records as ABDM health-record Compositions inside the same bundle, referenced from `Claim.supportingInfo`. Attach files as base64 in `valueAttachment`.
- Mandatory elements have cardinality `1..1` or `1..*`. A Must Support element is optional to send, and a receiver must be able to process it.

### Minimal skeleton

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
    "<FOCAL_RESOURCE_ENTRY>",
    "<ONE_ENTRY_PER_RESOURCE_IT_REFERENCES>"
  ]
}
```

One entry, showing the `fullUrl` and the profile declaration:

```json
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
}
```

The atom for each use case lists the resources its bundle carries.

## How you know it worked

Run the HL7 validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)) against the bundle you built, with the bundle profile named on the command line:

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile <BUNDLE_PROFILE_CANONICAL_URL>
```

You know the bundle is right when:

- The validator exits with code 0 and reports no errors.
- Every `reference` in the bundle resolves to an entry `fullUrl`.
- After you send it, the callback for your use case arrives as a sealed FHIR bundle, not as a `ProtocolResponse` carrying a bundle error.

## When it goes wrong

- **[PAYR-1008](../errors/payr-1008.md): "Invalid FHIR bundle received."** The receiver could not parse the payload as FHIR. Run the validator and fix what it reports. On the payer error sheet the same code means insufficient coverage, so read the message text as well as the code. See [error code spaces](../concepts/error-code-spaces.md).
- **[PAYR-1004](../errors/payr-1004.md): "Received FHIR bundle is malformed."** The message carries error details. Fix them, then validate again.
- **[PAYR-1040](../errors/payr-1040.md) or [PAYR-1031](../errors/payr-1031.md).** A reference points at a `fullUrl` that is not in the bundle, or an entry URL is invalid. Add the missing entry or correct the reference.
- **[PAYR-1009](../errors/payr-1009.md) or [PAYR-1010](../errors/payr-1010.md).** The Patient has no identifier, or the identifier has no `type`.
- **[PAYR-1029](../errors/payr-1029.md): invalid bundle id.** Set `Bundle.id` to a valid FHIR id.
- **You sent a `document` bundle with a root `Composition`.** Claims messages use `collection`. Move the clinical Composition inside the bundle and reference it from `Claim.supportingInfo`.

See also [the payer rejects your FHIR bundle](../troubleshooting/bundle-rejected.md).
