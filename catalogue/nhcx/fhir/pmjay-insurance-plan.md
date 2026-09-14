---
id: nhcx.fhir.pmjay-insurance-plan
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The PMJAY InsurancePlan profile, packages and questionnaires
summary: >-
  How the government scheme's policy is laid out as data: specialties, packages,
  rates, claim rules, required documents and treatment-guideline questionnaires.
sources:
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/insuranceplan/insuranceplan_response.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. InsurancePlan, coverage.benefit, plan.specificCost, Questionnaire entries.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 6.5.1 and 6.6 Claim conditions.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.insurance-plan
  - nhcx.concept.pmjay-on-nhcx
  flows:
  - nhcx.flow.insurance-plan-request
  fhir:
  - nhcx.fhir.insurance-plan-bundle
  - nhcx.fhir.preauth-request
  - nhcx.fhir.claim-request
  - nhcx.fhir.query-update
  - nhcx.fhir.terminologies
  errors:
  - nhcx.error.payr-1406
  tests:
  - nhcx.test.tc-hbp-01
  glossary:
  - nhcx.glossary.pmjay
  - nhcx.glossary.hbp
  - nhcx.glossary.insurance-plan
  - shared.glossary.fhir
---

# The PMJAY InsurancePlan profile, packages and questionnaires

## In plain words

The [PMJAY](../glossary/pmjay.md) policy arrives as one [FHIR](../../shared/glossary/fhir.md) `InsurancePlan` inside an InsurancePlan bundle. It is the scheme's package list, the Health Benefit Package ([HBP](../glossary/hbp.md)), as data.

For each package it gives the rate, the rules that apply, the documents a claim needs and the treatment-guideline questions to answer. Your system reads it once per policy and uses its codes in every later request.

## Before you start

- You requested the plan. See [InsurancePlan request and response bundles](insurance-plan-bundle.md).
- Your parser can stream a large JSON document. The sample plan is about 21 MB, with 2,217 entries.

## What happens

### The resources

| Resource | Count in the sample | Holds |
|---|---|---|
| `InsurancePlan` | 1 | The policy |
| `Organization` | 1 | The payer |
| `Questionnaire` | 2,215 | 15 plan-level questionnaires and the Standard Treatment Guidelines (STG) questionnaires |

### InsurancePlan header

| Element | Sample value |
|---|---|
| `name` | `PMJAY - Universal Health Policy` |
| `type` | `07` "Universal Health Policy", system `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-insuranceplan-type` |
| `identifier` typed `NH` | The policy number |
| `identifier` typed `XV` | The plan id |
| `plan.type` | `03` "Group", system `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-plan-type` |
| `plan.generalCost[0].cost` | The family sum insured, `500000` INR |

### Coverage: specialty, then package

`InsurancePlan.coverage[]` has one entry per specialty. Its `type` coding comes from `https://nrces.in/ndhm/fhir/r4/ValueSet/ndhm-benefitcategory`, for example `SN` Neurosurgery or `MG` General Medicine. Each `coverage.benefit[]` is one package or implant:

- `id` and `type`: the package code, from `https://nrces.in/ndhm/fhir/r4/ValueSet/ndhm-productorservice`.
- `limit[]`: the package rate in `INR`, plus one limit per stratification when the package has them.
- A `Claim-Condition` extension with the package rules.
- `Claim-SupportingInfoRequirement` extensions naming the required documents, and an STG questionnaire link in `documentationUrl`.

One package benefit, cut to three rules and one document:

```json
{
  "id": "<PACKAGE_CODE>",
  "extension": [
    {
      "url": "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Claim-Condition",
      "extension": [
        {
          "url": "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Claim-Condition/ProcedureType",
          "valueString": "Surgical"
        },
        {
          "url": "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Claim-Condition/ApprovalNotRequired",
          "valueString": "N"
        },
        {
          "url": "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Claim-Condition/EnhancementAllowed",
          "valueString": "N"
        }
      ]
    },
    {
      "url": "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Claim-SupportingInfoRequirement",
      "extension": [
        {
          "url": "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Claim-SupportingInfoRequirement/<PACKAGE_CODE>/<SEQ>/<MAND_CODE>",
          "extension": [
            {
              "url": "category",
              "valueCodeableConcept": {
                "coding": [
                  {
                    "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category",
                    "code": "DIA",
                    "display": "Diagnostic report"
                  }
                ]
              }
            },
            {
              "url": "code",
              "valueCodeableConcept": {
                "coding": [
                  {
                    "system": "https://nrces.in/ndhm/fhir/r4/ValueSet/ndhm-supportinginfo-code",
                    "code": "<MAND_CODE>",
                    "display": "<DOCUMENT_NAME>"
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ],
  "type": {
    "coding": [
      {
        "system": "https://nrces.in/ndhm/fhir/r4/ValueSet/ndhm-productorservice",
        "code": "<PACKAGE_CODE>",
        "display": "<PACKAGE_NAME>"
      }
    ]
  },
  "limit": [
    {
      "value": {
        "value": "<PACKAGE_RATE_AS_A_NUMBER>",
        "unit": "INR"
      },
      "code": {
        "coding": [
          {
            "code": "<PACKAGE_CODE>"
          }
        ]
      }
    }
  ]
}
```

### Claim-Condition rules

| Rule | Values | Use it to |
|---|---|---|
| `ProcedureType` | `Surgical`, `Medical`, `Conservative` | Classify the package |
| `ApprovalNotRequired` | `Y` or `N` | Decide whether a preauthorisation is needed |
| `EnhancementAllowed` | `Y` or `N` | Decide whether an enhancement can add to it |
| `StratificationAllowed`, `MultipleStratificationAllowed`, `MaximumStratificationAllowed` | `Y`/`N`, count | Offer ward or ICU levels |
| `ImplantApplicable`, `MultipleImplantsAllowed`, `MaximumImplantsAllowed` | `Y`/`N`, count | Offer implants |
| `IsDayCare` | `Y` or `N` | Mark day-care packages |
| `QuantityAllowed` | count | Cap the item quantity |
| `CyclicProcedure`, `MaximumCyclesAllowed` | `Y`/`N`, count | Allow repeated cycles, such as dialysis, under one approval |
| `GovtReserved`, `ScheduledTATApproval` | `Y` or `N` | Apply scheme rules |

An implant benefit carries only `ParentProcedure`, naming the package it belongs to.

### Plan costs

`plan[0].specificCost[]` mirrors the coverage: one category per specialty, the same benefits in the same order, with ids prefixed `PlanBenefit/`. Each `cost[]` line has a `type` of `Procedure`, `Stratification` or `Implant`, an optional `qualifiers` code such as `STRAT006b` (HDU), and a `value` in `INR`.

### Plan-level requirements and questionnaires

`InsurancePlan.extension[]` lists documents every case needs. One is proof of identity (`POI`, `ADN`). The others point at 15 plan questionnaires with category `INF` and code `ODN`, such as Discharge Information, Admission Details and Authentication Consent.

STG questionnaires use `item[].prefix` for the question and offer `Yes` or `No`. Plan questionnaires use `item[].text`.

## How you know it worked

You have read the plan correctly when, for one package code, your system can show:

- The rate from `coverage.benefit.limit` and the matching `specificCost` cost lines.
- Whether it needs preauthorisation (`ApprovalNotRequired`) and allows enhancement (`EnhancementAllowed`).
- The list of required documents with their category and code.
- The STG questionnaire to answer, fetched from the bundle by its URL.

A preauthorisation built from these codes passes the validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)) and is not rejected for an unknown package, stratification or document code.

## When it goes wrong

- **Your parser runs out of memory.** Stream the bundle and index `coverage.benefit` by package code.
- **The same questionnaire appears many times.** Questionnaires repeat, once per benefit that links them, with identical content. Deduplicate by `id`.
- **A cost parser finds no currency.** Cost and limit values carry `unit` = `INR`, not `currency`.
- **A display string has trailing spaces or stray quotes.** Match on codes, not displays.
- **A package is shared by two specialties.** Some package codes appear under more than one specialty. Key on the specialty and package pair.
- **[PAYR-1406](../errors/payr-1406.md) when you fetch again.** A previous request for the same hospital and policy is still running. Cache the plan and wait 15 to 60 minutes before asking again.
