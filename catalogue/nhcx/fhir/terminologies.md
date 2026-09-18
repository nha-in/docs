---
id: nhcx.fhir.terminologies
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Code systems and value sets used in NHCX bundles
summary: >-
  The code systems every claims bundle draws on, where each one is used, and how
  strictly each binding applies.
sources:
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications/domain-data-specifications/terminologies
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications__domain-data-specifications__terminologies.md
  hash: sha256:1cdf48ceb570f19500e672dfb1140271aca01274a1d8c3e83cad336d5a5b082d
  fetched: '2026-09-14'
  note: Site page /domain-specifications/domain-data-specifications/terminologies, text as shown on the site. Guidlines and proposed binding table.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Appendix A.2, A.3; Sections 10.4, 11.5-11.6; Quick Reference.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/preauth/preauth_request.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. coding systems throughout.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/coverageeligibility/coverageresponse_validation.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. meta.tag, Coverage.class.
related:
  fhir:
  - nhcx.fhir.collection-bundle
  - nhcx.fhir.validation
  - nhcx.fhir.pmjay-insurance-plan
  - nhcx.fhir.preauth-request
  - nhcx.fhir.claim-request
  concepts:
  - nhcx.concept.fhir-in-nhcx
  errors:
  - nhcx.error.payr-1020
  - nhcx.error.payr-1021
  - nhcx.error.payr-1010
  glossary:
  - shared.glossary.snomed-ct
  - shared.glossary.fhir
  - shared.glossary.nrces
  - nhcx.glossary.pmjay
---

# Code systems and value sets used in NHCX bundles

## In plain words

A code system is a published list of codes, such as diagnoses or document types. Claims bundles use international systems like [SNOMED CT](../../shared/glossary/snomed-ct.md), LOINC and ICD-10, and Indian systems published by [NRCeS](../../shared/glossary/nrces.md).

Payers match codes by exact system URL and code. A code under the wrong system URL fails, even when the code itself is right.

## Before you start

- You know which bundle you are building. See [the collection bundle](collection-bundle.md).
- For PMJAY package, specialty, stratification and document codes, you have the payer's insurance plan. See [the PMJAY InsurancePlan](pmjay-insurance-plan.md).

## What happens

### Clinical terminologies

| Terminology | System URL | Used for |
|---|---|---|
| SNOMED CT | `http://snomed.info/sct` | Procedures, clinical findings, `Claim.type` (`737481003` Inpatient care management) |
| LOINC | `http://loinc.org` | Laboratory and clinical observations |
| ICD-10 | `http://hl7.org/fhir/sid/icd-10` | `Claim.diagnosis` |

In India, SNOMED CT is free to use. ICD codes classify diseases. Laboratories use LOINC.

### NRCeS code systems

| System URL | Carries | Example codes |
|---|---|---|
| `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code` | Identifier types | `PMJAY`, `ABHA`, `HPID`, `HPIN`, `CLN` (claim number), `UTR` |
| `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category` | `Claim.supportingInfo.category` | `INV`, `DIA`, `DIS`, `ONS`, `OTH`, `NMI`, `INF`, `POI`, `DOB` |
| `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-code` | `Claim.supportingInfo.code` | `DTH`, `DTM`, `LAMA`, `DAMA`, `ADDD`, `DSDE`, `PSP`, `EDT`, `CQD`, `BCF`, `DCB` |
| `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-reason-code` | `Task.reasonCode` | `treatmentplanchanged`, `claimrejected`, `partialpayment` |
| `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code` | `Task.input.type` | `policyNumber`, `providerId`, `claimNumber`, `initimationNumber` |
| `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-output-type` | `Task.output.type` | `status`, `include` |
| `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-output-value` | `Task.output.value` | `paymentack` |
| `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-codes` | `Task.code` for payment notices | `deliver` |

### HL7 code systems

| System URL | Used for |
|---|---|
| `http://terminology.hl7.org/CodeSystem/v2-0203` | Identifier types `NPI` (facility HFR ID), `NIIP` (payer), `NH` (policy), `XV` (plan), `JHN`, `SNO`, `MR` |
| `http://terminology.hl7.org/CodeSystem/financialtaskcode` | `Task.code` `poll`, `cancel`, `reprocess`, `status` |
| `http://terminology.hl7.org/CodeSystem/processpriority` | `priority` `normal` |
| `http://terminology.hl7.org/CodeSystem/organization-type` | `prov`, `pay` |
| `http://terminology.hl7.org/CodeSystem/paymentstatus` | `paid` |
| `http://terminology.hl7.org/CodeSystem/v3-ObservationValue` | The `SUBSETTED` tag on payer-built resources |

### PMJAY master codes

PMJAY specialty, package, stratification and mandatory-document codes come from the payer's InsurancePlan. Examples are `MG` (General Medicine), `MG004A` (a package), `STRAT006b` (HDU, a high dependency unit) and `MAND0409` (a document). Copy each coding, system and code, exactly as the InsurancePlan gives it.

### Binding strength

A binding says how strictly an element must use its value set:

- `required`: use a code from the value set.
- `preferred` or `extensible`: draw from the value set unless the domain has agreed otherwise.
- `example`: the domain must agree and define the value set.

Proposed bindings for NHCX elements:

| Element | Terminology | Binding |
|---|---|---|
| `CoverageEligibilityRequest.insurer` | Insurance company owners | Preferred |
| `Claim.procedure.type` | Procedure type | Example |
| `Claim.procedure.procedureCode` | Procedure code | Example |
| `ClaimResponse.item.adjudication.reason` | Denial codes | Preferred |
| `Claim.item.modifier` | Procedure modifiers | Example |
| `Claim.item.category` | Service categories | Example |
| `Claim.item.productOrService` | Service codes | Preferred |
| `PractitionerRole.speciality` | Medical speciality type | Preferred |
| `Claim.careTeam.role` | Health service provider role | Example |

## How you know it worked

Run the validator recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)) online, without `-tx n/a`, so codes are checked:

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile <BUNDLE_PROFILE_CANONICAL_URL>
```

It exits with code 0 and reports no binding errors.

You have understood the codes when you can answer:

1. Which system carries the facility's HFR ID type code `NPI`?
2. Where do you take a package code from before you put it in `Claim.item.productOrService`?

## When it goes wrong

- **A SNOMED code under the wrong URL.** Use `http://snomed.info/sct` exactly. Variants such as `https://snomed.info/sct` or `http://snomed.info/sct0` do not match.
- **An NRCeS URL spelled another way.** Use `https://nrces.in/ndhm/fhir/r4/CodeSystem/<name>`. A `www.` host or a `CodeSystem-<name>` page URL is a web page, not the system.
- **[PAYR-1020](../errors/payr-1020.md) or [PAYR-1021](../errors/payr-1021.md).** A `supportingInfo` category or code is invalid. Take it from the InsurancePlan requirement or the tables above.
- **[PAYR-1010](../errors/payr-1010.md).** An identifier carries no `type`. Add the type coding from `ndhm-identifier-type-code` or `v2-0203`.
- **A PMJAY code typed by hand.** Codes have trailing spaces and case rules. Copy them from the InsurancePlan bundle.
