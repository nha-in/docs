---
id: nhcx.concept.insurance-plan
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The insurance plan and what a provider learns from it
summary: >-
  The insurance plan is the payer's policy published as structured data, listing
  the packages, rates, conditions and documents a hospital may claim, and the hospital
  fetches and caches it before treating.
sources:
- url: https://hcxsbx.abdm.gov.in/images/13093b5f9b88fe826123.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Insurance Plan IG.docx
  hash: sha256:e9c6c82b6d67fd8476d6d19a5961419beb04e3c0613533453ed1e16e2a569cc1
  fetched: '2026-09-14'
  note: Insurance Plan IG, row 25 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Task request tables; InsurancePlan structure tables.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. InsurancePlan section, claim condition table.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Page 16 Insurance Plan technical guidelines.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Insurance Plan Error, PAYR-1406.
verified:
  status: unverified
related:
  flows:
  - nhcx.flow.insurance-plan-request
  endpoints:
  - nhcx.endpoint.insuranceplan-request
  - nhcx.endpoint.insuranceplan-on-request
  callbacks:
  - nhcx.callback.insuranceplan-request
  - nhcx.callback.insuranceplan-on-request
  fhir:
  - nhcx.fhir.insurance-plan-bundle
  - nhcx.fhir.pmjay-insurance-plan
  errors:
  - nhcx.error.payr-1401
  - nhcx.error.payr-1402
  - nhcx.error.payr-1403
  - nhcx.error.payr-1404
  - nhcx.error.payr-1405
  - nhcx.error.payr-1406
  concepts:
  - nhcx.concept.coverage-eligibility-purposes
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.claim-cycle
  - nhcx.concept.fhir-in-nhcx
  glossary:
  - nhcx.glossary.insurance-plan
  - nhcx.glossary.hbp
  - nhcx.glossary.pmjay
  - shared.glossary.hfr
  tests:
  - nhcx.test.provider-uc-06
  - nhcx.test.payer-uc-08
---

# The insurance plan and what a provider learns from it

## In plain words

An [insurance plan](../glossary/insurance-plan.md) is the payer's policy published as data rather than as a PDF. It tells a hospital what it may treat under the policy, at what rate, under which conditions, and with which documents.

The hospital fetches it through NHCX, stores it, and uses it to fill in preauthorisations and claims. Under [PMJAY](../glossary/pmjay.md) nearly every later step depends on it.

## Before you start

You need the policy code, your [HFR](../../shared/glossary/hfr.md) facility ID, and the payer's participant code.

## What happens

### Asking for the plan

You send a FHIR `Task` to `/v1/insuranceplan/request`:

| Element | Value |
|---|---|
| `Task.status` | `requested` |
| `Task.intent` | `order` |
| `Task.code` | `poll`, system `https://nhcx.abdm.gov.in/api` |
| `Task.input` | `policyNumber` and `providerId`; at least one is required |

The plan arrives later on `/v1/insuranceplan/on_request` as a `collection` bundle of `InsurancePlan`, `Organization` and `Questionnaire` resources.

### What the plan holds

```mermaid
graph TD
  P["InsurancePlan.plan"] --> G["generalCost<br/>overall sum insured"]
  P --> SC["specificCost"]
  SC --> CAT["category<br/>speciality, such as GM"]
  CAT --> BEN["benefit<br/>package, such as SE012A"]
  BEN --> COST["cost<br/>package rate"]
  COST --> QUAL["qualifiers<br/>implant, stratification"]
  P --> EXT["extensions<br/>claim conditions, exclusions,<br/>required documents"]
```

- **Specialities and packages.** Only those your hospital is empanelled for. The plan is specific to the payer, the policy and your hospital.
- **Package rates and qualifiers.** ICU or HDU stratification and implants carry their own amounts.
- **Claim conditions.** Per package flags such as `ApprovalNotRequired`, `EnhancementAllowed`, `ImplantApplicable`, `CyclicProcedure`, `Standalone` and `Unspecified`.
- **Required documents.** At policy level and per package, for preauthorisation and for claim.
- **Questionnaires.** Standard treatment guideline forms. You return the questionnaire URL in the `QuestionnaireResponse` of your preauthorisation or claim.

### Keeping it current

- The bundle can exceed 20 MB. Store it in a queryable form, linked to the policy.
- Refresh it weekly, and at once when the payer renews or amends the policy.
- Keep versions of rates and packages, and record which version each preauthorisation and claim used.

## How you know it worked

You have understood this when you can answer both of these.

1. A package you want to add during an enhancement shows `EnhancementAllowed` as `N`. What should your system do?
2. Your weekly refresh fails for a policy while an earlier request is still running. What does the payer tell you, and how long do you wait?

## When it goes wrong

**A second request while one is running.** The PMJAY payer refuses it with [PAYR-1406](../errors/payr-1406.md). Wait 15 to 60 minutes. If no plan arrives after 60 minutes, contact support.

**Policy not allowed for your hospital.** [PAYR-1401](../errors/payr-1401.md).

**Policy or renewal unknown to the payer.** [PAYR-1402](../errors/payr-1402.md) and [PAYR-1403](../errors/payr-1403.md). Check the values in your `Task`.

**No speciality configured, or hospital not found.** [PAYR-1404](../errors/payr-1404.md) and [PAYR-1405](../errors/payr-1405.md). Check the HFR ID you sent.

**Stale rates.** A claim priced from an outdated plan version is rejected. Refresh before you price.
