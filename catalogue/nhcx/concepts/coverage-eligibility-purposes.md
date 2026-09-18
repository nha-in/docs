---
id: nhcx.concept.coverage-eligibility-purposes
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The four coverage eligibility purposes
summary: >-
  A coverage eligibility request asks one of four questions, discovery, validation,
  benefits or auth-requirements, and the purpose decides what you must send and
  what comes back.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 7.3 to 7.6 Coverage Eligibility.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.3.1 to 8.3.4, page 32 functional points.
- url: https://hcxsbx.abdm.gov.in/images/13093b5f9b88fe826123.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Insurance Plan IG.docx
  hash: sha256:e9c6c82b6d67fd8476d6d19a5961419beb04e3c0613533453ed1e16e2a569cc1
  fetched: '2026-09-14'
  note: Insurance Plan IG, row 25 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. CoverageEligibility request and response tables.
related:
  flows:
  - nhcx.flow.coverage-eligibility-check
  endpoints:
  - nhcx.endpoint.coverageeligibility-check
  - nhcx.endpoint.coverageeligibility-on-check
  callbacks:
  - nhcx.callback.coverageeligibility-check
  - nhcx.callback.coverageeligibility-on-check
  decisions:
  - nhcx.decision.eligibility-purpose
  fhir:
  - nhcx.fhir.coverage-eligibility-request
  - nhcx.fhir.coverage-eligibility-response
  errors:
  - nhcx.error.payr-1032
  - nhcx.error.payr-1033
  - nhcx.error.payr-1101
  - nhcx.error.payr-1005
  - nhcx.error.payr-1006
  - nhcx.error.payr-1007
  - nhcx.error.payr-1123
  concepts:
  - nhcx.concept.insurance-plan
  - nhcx.concept.policy-linking
  - nhcx.concept.claim-cycle
  glossary:
  - nhcx.glossary.coverage-eligibility
  - shared.glossary.abha-number
  tests:
  - nhcx.test.provider-uc-05
  - nhcx.test.payer-uc-07
---

# The four coverage eligibility purposes

## In plain words

Before treatment, a hospital asks the payer about the patient's cover. That request is a [coverage eligibility](../glossary/coverage-eligibility.md) check.

The check always asks one question, set in `CoverageEligibilityRequest.purpose`. Is there a policy at all? Is it in force? What does it cover? Does this treatment need approval first? The purpose you choose decides what you must send and what you get back.

## Before you start

You need the patient's policy code, or at least their beneficiary ID. See [policy linking](./policy-linking.md). For a PMJAY patient, fetch the [insurance plan](./insurance-plan.md) first, so you know the package codes.

## What happens

| Purpose | The question | Procedure or package items | What comes back |
|---|---|---|---|
| `discovery` | Does this beneficiary have an active policy? | Not used | The active policy code |
| `validation` | Is the policy in force today? | Not used | `insurance.inforce`, used and available amounts |
| `benefits` | What cover and limits apply to these items? | Required | Benefit lines with allowed amounts, and exclusions |
| `auth-requirements` | Does this treatment need preauthorisation? | Required | `authorizationRequired`, covered amount, required documents and questionnaires |

Every purpose needs the beneficiary ID, the coverage or policy code, the payer and the provider. For a PMJAY patient the beneficiary ID is the PMJAY member ID, the [ABHA number](../../shared/glossary/abha-number.md), or both.

```mermaid
graph LR
  GP["Get policies"] -->|found| V["validation"]
  GP -->|nothing found| D["discovery"]
  D -->|policy code| V
  V --> AR["auth-requirements<br/>for the planned packages"]
  AR -->|authorizationRequired true| PA["Preauthorisation"]
  V -.-> B["benefits<br/>for cover and limits"]
```

### Reading the response

- `outcome` is `complete` when the payer processed the check.
- `disposition` is a sentence such as "Policy is currently in-force".
- `insurance[].inforce` is `true` when the policy is active.
- For each item, `excluded` says whether it is covered and `authorizationRequired` whether it needs approval first.
- `authorizationSupporting` lists the document codes the preauthorisation must carry, such as `MAND0409`.

### When to check again

Run an eligibility check whenever a new or additional treatment is planned, before you submit or enhance a preauthorisation. The choice between purposes is covered in [which eligibility purpose](../decisions/eligibility-purpose.md).

## How you know it worked

You have understood this when you can answer both of these.

1. A patient arrives and the get policies call returns nothing. Which purpose do you send first, and what do you do with its answer?
2. You plan package `MG004A` for a patient. Which purpose tells you whether you need preauthorisation, and which response fields answer it?

## When it goes wrong

**Purpose not accepted.** The PMJAY payer refuses an unknown purpose with [PAYR-1101](../errors/payr-1101.md). Its structure checks use [PAYR-1032](../errors/payr-1032.md) for "Invalid purpose received".

**Items missing for benefits or auth-requirements.** The PMJAY payer refuses the request with [PAYR-1033](../errors/payr-1033.md), no items received for the purpose.

**Not covered, no policy, expired.** A standard payer answers with [PAYR-1005](../errors/payr-1005.md), [PAYR-1006](../errors/payr-1006.md) or [PAYR-1007](../errors/payr-1007.md). These codes carry other meanings from the PMJAY payer, so read the message text. See [error code spaces](./error-code-spaces.md).

**Beneficiary not covered by this payer.** The PMJAY payer answers [PAYR-1123](../errors/payr-1123.md).
