---
id: nhcx.concept.pmjay-on-nhcx
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: PMJAY on NHCX and how it differs from the standard exchange
summary: >-
  Claims under the government health assurance scheme use the same exchange calls
  as any insurer, but the scheme adds four duties: use the insurance plan, authenticate
  the patient biometrically, send structured records, and handle queries inside
  responses.
sources:
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 1.2, 1.7, 8.1, 8.4 and 8.5 functional points.
- url: https://hcxsbx.abdm.gov.in/images/b6bd99dab49a5e928ea3.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Overview.pdf
  hash: sha256:c95469758a25cb8aca8c47757d8b18b4dedb8b4d42669663cff7343205f77fda
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Overview, row 27 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Pages 7-8, NHCX normal flow vs PMJAY flow.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Section 24 Q9; Section 22 Q11; Section 23 Q4.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8 partial approval table.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.hmis-integration-architecture
  - nhcx.concept.biometric-authentication
  - nhcx.concept.insurance-plan
  - nhcx.concept.queries-and-communication
  - nhcx.concept.fhir-in-nhcx
  - nhcx.concept.claim-cycle
  - nhcx.concept.reprocess-and-cancel
  flows:
  - nhcx.flow.pmjay-patient-to-cashless
  - nhcx.flow.pmjay-hospital-migration
  - nhcx.flow.biometric-fingerprint-iris
  - nhcx.flow.biometric-face
  decisions:
  - nhcx.decision.payer-implementation
  glossary:
  - nhcx.glossary.pmjay
  - nhcx.glossary.sha
  - nhcx.glossary.hbp
  - nhcx.glossary.tms
  - nhcx.glossary.bis
  - shared.glossary.hmis
  - shared.glossary.ayushman-card
  errors:
  - nhcx.error.payr-1256
  - nhcx.error.payr-1271
  - nhcx.error.payr-1254
  - nhcx.error.payr-1365
---

# PMJAY on NHCX and how it differs from the standard exchange

## In plain words

[PMJAY](../glossary/pmjay.md) is the government health assurance scheme. Its claims travel on NHCX like any other insurer's. A hospital system that works with private insurers on NHCX uses the same calls for PMJAY.

The scheme adds rules on top. Treatments are fixed packages at fixed rates. The patient must prove they are present with a fingerprint, iris or face scan. Clinical records go as structured data. And the payer asks its questions inside its responses.

## Before you start

Build and test the standard NHCX calls first. See [the claim cycle](./claim-cycle.md). To start PMJAY work in the sandbox, share your participant ID, client ID and registry ID with the NHCX team. The team adds your participant to the PMJAY staging environment.

## What happens

### Same calls, four added duties

| Call | Standard exchange | PMJAY |
|---|---|---|
| Insurance plan | Useful | The backbone: packages, rates, conditions, forms and documents come from it |
| Get policy, eligibility | Same | Same |
| Preauthorisation | Same | Same, after biometric authentication of the patient |
| Payer queries | Communication request | Query inside the ClaimResponse, answered with a query workflow id |
| Claim | Same | Same, with discharge details inside the claim |
| Payment notice, status | Same | Same |

### The four duties

1. **Use the [insurance plan](./insurance-plan.md).** Fetch it per hospital and policy, cache it, refresh it weekly, and build preauthorisations and claims from it.
2. **Authenticate the patient.** At registration, before preauthorisation, at every cycle of a cyclic treatment, and at discharge. See [biometric authentication](./biometric-authentication.md).
3. **Send structured records.** Supporting clinical records go as ABDM health information bundles inside the claim, not as scanned files. See [FHIR in NHCX](./fhir-in-nhcx.md).
4. **Handle queries inside responses.** See [queries and communication](./queries-and-communication.md).

### Scheme rules that change your system

- Treatment is package based. Rates come from the plan, not from your bill.
- PMJAY is fully cashless. No co-payment is allowed on any package.
- A preauthorisation cannot be raised more than one day before admission.
- There is no separate discharge workflow. Discharge details go inside the claim.
- A claim cannot be cancelled. A reprocess can be raised once per claim.
- Standard treatment guideline questionnaires from the plan must be answered in the preauthorisation and the claim.

Once PMJAY integration is complete, the production keys you receive also work for private insurers.

## How you know it worked

You have understood this when you can answer both of these.

1. A PMJAY payer needs a missing report on your preauthorisation. How does the request reach you, and how do you answer it?
2. Your system submits a PMJAY preauthorisation with no biometric token and no consent questionnaire. What happens?

## When it goes wrong

**No biometric authentication and no consent questionnaire.** The PMJAY payer refuses a new preauthorisation with [PAYR-1256](../errors/payr-1256.md) or [PAYR-1271](../errors/payr-1271.md).

**Treatment guideline questionnaire missing.** The payer refuses the preauthorisation with [PAYR-1254](../errors/payr-1254.md), and the claim with [PAYR-1365](../errors/payr-1365.md).

**Waiting for a communication request that never comes.** PMJAY queries arrive inside the `ClaimResponse`. Handle `outcome` `partial` with a queried reason.

**Rates taken from your own tariff.** Amounts above the package rate are cut back to it or refused. Price from the plan.
