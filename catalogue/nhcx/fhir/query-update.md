---
id: nhcx.fhir.query-update
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Query update bundles for preauthorisation and claim
summary: >-
  How to recognise a payer's query on a preauthorisation or claim, and how to resend
  the same claim with the documents and answers the payer asked for.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 8.5.3 and 9.5.4.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/preauth/Query/preauth_queryUpdate_req.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Claim.supportingInfo, QuestionnaireResponse.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/claim/claim_queryUpdate_req.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Claim.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheets Preauth and Claim Error Codes (PAYR-1504, PAYR-1505).
related:
  concepts:
  - nhcx.concept.queries-and-communication
  - nhcx.concept.claim-cycle
  flows:
  - nhcx.flow.preauth-query-response
  - nhcx.flow.claim-query-response
  fhir:
  - nhcx.fhir.preauth-response
  - nhcx.fhir.claim-response
  - nhcx.fhir.preauth-request
  - nhcx.fhir.claim-request
  - nhcx.fhir.pmjay-insurance-plan
  sandbox:
  - nhcx.sandbox.dummy-payer
  errors:
  - nhcx.error.payr-1504
  - nhcx.error.payr-1505
  - nhcx.error.payr-1084
  - nhcx.error.payr-1085
  - nhcx.error.payr-1047
  tests:
  - nhcx.test.tc-pa-02
  - nhcx.test.tc-cl-02
  - nhcx.test.provider-uc-08
  glossary:
  - nhcx.glossary.preauthorisation
  - nhcx.glossary.claim
  - shared.glossary.fhir
---

# Query update bundles for preauthorisation and claim

## In plain words

A payer that cannot decide a [preauthorisation](../glossary/preauthorisation.md) or [claim](../glossary/claim.md) raises a query. It answers with a `ClaimResponse` that is still open and asks for more information.

You answer by resending the same `Claim`, with the same claim number, carrying the extra documents and answers in `supportingInfo`. The payer then sends a fresh decision.

## Before you start

- You received a [preauthorisation response](preauth-response.md) or [claim response](claim-response.md) marked as queried.
- You hold the original request bundle, or can rebuild it with the same claim number and items.
- You have the documents the query asks for.
- For the transport, follow [answer a query on a preauthorisation](../flows/preauth-query-response.md) or [answer a query on a claim](../flows/claim-query-response.md).

## What happens

### Recognising a query

| Element | Value on a queried response |
|---|---|
| `ClaimResponse.outcome` | `partial` |
| `ClaimResponse.adjudication[0].reason.coding.code` | `queried` |
| `item[].adjudication[]` with category `status` | reason `Queried` |
| `item[].adjudication[]` with category `reason` | the query history in `reason.coding[0].display` |
| `total[]` | `0` while the query is open |

The history is pipe-separated. Each part reads `USER~date and time~type~comment~trust`. The latest part is the payer's current question.

### Building the update

Start from your original request bundle and change these parts:

- Keep `Claim.identifier`, `use` and every `item`.
- Add the requested documents to `supportingInfo`, as attachments or as references to ABDM record Compositions in the bundle.
- Put case-level remarks in a `supportingInfo` entry with category `NMI` and code `CQD`, as a `valueString`.
- Put a policy or case questionnaire answer in an entry with category `INF` and code `ODN`. Its `valueReference` points at a `QuestionnaireResponse` in the bundle.
- Put a Standard Treatment Guidelines answer in an entry with category `STG`, referencing its `QuestionnaireResponse`.

The added `supportingInfo` entries:

```json
{
  "supportingInfo": [
    {
      "sequence": 1,
      "category": {
        "coding": [{
            "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category", "code": "<CATEGORY_FROM_INSURANCE_PLAN_REQUIREMENT>"
          }]
      },
      "code": {
        "coding": [{
            "system": "<DOCUMENT_CODE_SYSTEM_FROM_INSURANCE_PLAN>", "code": "<MAND_CODE_THE_QUERY_ASKS_FOR>"
          }]
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
        "coding": [{
            "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category", "code": "NMI"
          }]
      },
      "code": {
        "coding": [{
            "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-code", "code": "CQD"
          }]
      },
      "valueString": "<YOUR_REMARKS_ANSWERING_THE_QUERY>"
    },
    {
      "sequence": 3,
      "category": {
        "coding": [{
            "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category", "code": "INF"
          }]
      },
      "code": {
        "coding": [{
            "system": "https://nrces.in/ndhm/fhir/r4/ValueSet/ndhm-supportinginfo-code", "code": "ODN", "display": "Other document"
          }]
      },
      "valueReference": {
        "reference": "urn:uuid:<QUESTIONNAIRE_RESPONSE_UUID>"
      }
    }
  ]
}
```

The `QuestionnaireResponse` entry they reference:

```json
{
  "fullUrl": "urn:uuid:<QUESTIONNAIRE_RESPONSE_UUID>",
  "resource": {
    "resourceType": "QuestionnaireResponse",
    "id": "<QUESTIONNAIRE_RESPONSE_UUID>",
    "meta": {
      "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/QuestionnaireResponse"]
    },
    "questionnaire": "<QUESTIONNAIRE_URL_FROM_INSURANCE_PLAN>",
    "status": "completed",
    "item": [
      {
        "linkId": "<LINK_ID_FROM_THE_QUESTIONNAIRE>",
        "answer": [{
            "valueString": "<YOUR_ANSWER>"
          }]
      }
    ]
  }
}
```

Take the `questionnaire` URL and each `linkId` from the payer's InsurancePlan. See [the PMJAY InsurancePlan](pmjay-insurance-plan.md).

## How you know it worked

Run the validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)):

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClaimBundle
```

It exits with code 0 and reports no errors.

The payer's next response for the same claim number no longer has reason `queried`. Its `outcome` and reason code map to approved, partially approved or rejected.

## When it goes wrong

- **[PAYR-1504](../errors/payr-1504.md): wrong value type for `NMI` and `CQD`.** Send the remarks as a `valueString`.
- **[PAYR-1505](../errors/payr-1505.md): wrong category or code for a questionnaire response.** Use `INF` with `ODN` for a policy or case questionnaire, and `STG` for a treatment-guideline questionnaire.
- **[PAYR-1084](../errors/payr-1084.md) or [PAYR-1085](../errors/payr-1085.md).** The referenced `QuestionnaireResponse` is missing from the bundle, or the reference points at another resource type.
- **[PAYR-1047](../errors/payr-1047.md): invalid reference in supporting info.** A `valueReference` does not resolve to a resource in the bundle.
- **You sent a new claim number.** The payer treats it as a new case. Reuse the original claim number.
