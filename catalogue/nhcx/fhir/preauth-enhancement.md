---
id: nhcx.fhir.preauth-enhancement
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Preauthorisation enhancement request and response bundles
summary: >-
  How a hospital asks the payer to raise an approved preauthorisation by adding
  a package, and how the payer's answer lists each package.
sources:
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/preauth/enhancement/enhancement_req.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Claim.item, Claim.procedure.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/preauth/enhancement/enhancement_resp.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. ClaimResponse.item, total.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 6.6 Claim conditions.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Q2 sandbox base URLs.
related:
  concepts:
  - nhcx.concept.claim-cycle
  flows:
  - nhcx.flow.preauth-enhancement
  endpoints:
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.preauth-on-submit
  fhir:
  - nhcx.fhir.preauth-request
  - nhcx.fhir.preauth-response
  - nhcx.fhir.pmjay-insurance-plan
  - nhcx.fhir.validation
  errors:
  - nhcx.error.payr-1025
  - nhcx.error.payr-1026
  - nhcx.error.payr-1027
  - nhcx.error.payr-1028
  glossary:
  - nhcx.glossary.enhancement
  - nhcx.glossary.preauthorisation
  - shared.glossary.fhir
---

# Preauthorisation enhancement request and response bundles

## In plain words

An [enhancement](../glossary/enhancement.md) asks the payer to extend a [preauthorisation](../glossary/preauthorisation.md) it already decided. You need one when the patient needs a second package or a higher level of care.

You resend the same `Claim`, with the same claim number, on `/v1/preauth/submit`. Keep every earlier item and add the new one. The payer answers on `/v1/preauth/on_submit` with one adjudicated line per item.

## Before you start

- The original preauthorisation has a decision. See [the preauthorisation response](preauth-response.md).
- The new package allows enhancement. In the PMJAY InsurancePlan, its `Claim-Condition` flag `EnhancementAllowed` is `Y`. See [the PMJAY InsurancePlan](pmjay-insurance-plan.md).
- You have the documents the new package requires.

## What happens

### The request

Start from the [preauthorisation bundle](preauth-request.md) and change these elements:

- Keep `Claim.identifier` and `use: preauthorization`.
- Keep each earlier `item` with its original `sequence`.
- Add the new item with the next `sequence`, its own `Procedure` entry, and a `procedureSequence` pointing at it.
- Add `supportingInfo` entries for the new package's documents.
- Set `total` to the sum of all item `net` values.

The changed parts of the `Claim`:

```json
{
  "procedure": [{
      "sequence": 1, "procedureReference": {
        "reference": "urn:uuid:<PROCEDURE_1_UUID>"
      }
    }, {
      "sequence": 2, "procedureReference": {
        "reference": "urn:uuid:<PROCEDURE_2_UUID>"
      }
    }],
  "item": [
    {
      "sequence": 1,
      "careTeamSequence": [1],
      "diagnosisSequence": [1],
      "procedureSequence": [1],
      "informationSequence": [1],
      "category": {
        "coding": [{
            "system": "<SPECIALTY_SYSTEM_FROM_INSURANCE_PLAN>", "code": "<SPECIALTY_CODE_FROM_INSURANCE_PLAN>"
          }]
      },
      "productOrService": {
        "coding": [{
            "system": "<PACKAGE_SYSTEM_FROM_INSURANCE_PLAN>", "code": "<APPROVED_PACKAGE_CODE>", "display": "<PACKAGE_NAME>"
          }]
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
    },
    {
      "sequence": 2,
      "careTeamSequence": [1],
      "diagnosisSequence": [1],
      "procedureSequence": [2],
      "informationSequence": [1],
      "category": {
        "coding": [{
            "system": "<SPECIALTY_SYSTEM_FROM_INSURANCE_PLAN>", "code": "<SPECIALTY_CODE_FROM_INSURANCE_PLAN>"
          }]
      },
      "productOrService": {
        "coding": [{
            "system": "<PACKAGE_SYSTEM_FROM_INSURANCE_PLAN>", "code": "<ADDITIONAL_PACKAGE_CODE>", "display": "<PACKAGE_NAME>"
          }]
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
    "value": "<SUM_OF_BOTH_ITEM_NET_VALUES>"
  }
}
```

Add a second `Procedure` entry with `id` `<PROCEDURE_2_UUID>`, shaped like the first.

### The response

A `ClaimResponse` with one `item` per `itemSequence`, each with its own `eligible` amount and `status`. The `benefit` total and the `PMJAY-T` `eligible` total cover all approved items.

## How you know it worked

Run the validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)):

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClaimBundle
```

It exits with code 0 and reports no errors.

Then `/v1/preauth/on_submit` arrives with a `ClaimResponse` for the same claim number. It has an `item` for the new `itemSequence`, with `status` `Approved` when the payer accepts it.

## When it goes wrong

- **[PAYR-1027](../errors/payr-1027.md) or [PAYR-1028](../errors/payr-1028.md).** An item id or sequence is invalid. Keep the original sequences and number the new item after them.
- **[PAYR-1025](../errors/payr-1025.md) or [PAYR-1026](../errors/payr-1026.md).** A procedure sequence is invalid, or `Claim.procedure` points at a Procedure missing from the bundle.
- **The payer rejects the new item.** Check `EnhancementAllowed` for the package in the InsurancePlan before you send.
- **The response lists the new item first.** Match lines on `itemSequence`, not on position.
