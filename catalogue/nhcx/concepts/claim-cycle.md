---
id: nhcx.concept.claim-cycle
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The claim cycle from eligibility to payment
summary: >-
  A cashless claim moves through eligibility, insurance plan, preauthorisation,
  claim, payment notice and, if needed, reprocess, and each stage is its own request
  and response on the exchange.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. API Structure table.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheets Value sets, Preauth, Claim, Payment, Task, InsurancePlan.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.4 page 32 and 8.5 page 35 functional points.
- url: https://hcxsbx.abdm.gov.in/images/13093b5f9b88fe826123.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Insurance Plan IG.docx
  hash: sha256:e9c6c82b6d67fd8476d6d19a5961419beb04e3c0613533453ed1e16e2a569cc1
  fetched: '2026-09-14'
  note: Insurance Plan IG, row 25 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Task request table.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.1 and Payment Notice section.
- url: https://hcxsbx.abdm.gov.in/images/2c3fbb4e6b09f0834f69.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Implementation Guide for Adoption of FHIR in ABDM and NHCX.pdf
  hash: sha256:549377c9c26b1bd23decac3a1b9e5ebedfdc8e0fe99e53ef733859b188f51366
  fetched: '2026-09-14'
  note: Implementation Guide for Adoption of FHIR in ABDM and NHCX, row 14 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. API table rows 5-6.
related:
  concepts:
  - nhcx.concept.coverage-eligibility-purposes
  - nhcx.concept.insurance-plan
  - nhcx.concept.queries-and-communication
  - nhcx.concept.reprocess-and-cancel
  - nhcx.concept.workflow-codes
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.policy-linking
  - nhcx.concept.fhir-in-nhcx
  flows:
  - nhcx.flow.coverage-eligibility-check
  - nhcx.flow.insurance-plan-request
  - nhcx.flow.preauth-submit
  - nhcx.flow.preauth-enhancement
  - nhcx.flow.preauth-query-response
  - nhcx.flow.preauth-cancel
  - nhcx.flow.claim-submit
  - nhcx.flow.claim-query-response
  - nhcx.flow.claim-reprocess
  - nhcx.flow.payment-notice
  - nhcx.flow.status-check
  - nhcx.flow.claim-search
  glossary:
  - nhcx.glossary.coverage-eligibility
  - nhcx.glossary.preauthorisation
  - nhcx.glossary.enhancement
  - nhcx.glossary.claim
  - nhcx.glossary.payment-notice
---

# The claim cycle from eligibility to payment

## In plain words

A cashless hospital stay produces a series of exchanges between the hospital and the payer. First the hospital checks the patient's cover. Then it asks the payer to approve the treatment. After discharge it submits the claim. Finally the payer tells the hospital the money has been paid.

Each of those steps is a separate request and response on NHCX. Together they are the claim cycle.

## Before you start

Read [the four message legs](./four-message-legs.md). Every stage below follows that pattern.

## What happens

```mermaid
graph TD
  L["Policy linked to ABHA<br/>get policies"] --> E["Coverage eligibility<br/>/v1/coverageeligibility/check"]
  IP["Insurance plan<br/>/v1/insuranceplan/request"] --> PA
  E --> PA["Preauthorisation<br/>/v1/preauth/submit"]
  PA -->|queried| QP["Query answered"]
  QP --> PA
  PA -->|approved| T["Treatment"]
  T -->|more needed| EN["Enhancement<br/>/v1/preauth/submit"]
  EN --> T
  PA -->|not going ahead| CX["Cancel<br/>/v1/task/submit"]
  T --> C["Claim after discharge<br/>/v1/claim/submit"]
  C -->|queried| QC["Query answered"]
  QC --> C
  C -->|approved| PN["Payment notice<br/>payer sends /v1/paymentnotice/request"]
  PN --> ACK["Provider acknowledges"]
  C -->|rejected| RP["Reprocess<br/>/v1/task/submit"]
```

| Stage | Who starts | Request path | Bundle |
|---|---|---|---|
| [Coverage eligibility](./coverage-eligibility-purposes.md) | Provider | `/v1/coverageeligibility/check` | CoverageEligibilityRequest |
| [Insurance plan](./insurance-plan.md) | Provider | `/v1/insuranceplan/request` | Task with code `poll` |
| Preauthorisation | Provider | `/v1/preauth/submit` | Claim with use `preauthorization` |
| Enhancement | Provider | `/v1/preauth/submit` | Claim, resubmitted with added items |
| Query | Payer | See [queries](./queries-and-communication.md) | ClaimResponse or CommunicationRequest |
| Claim | Provider | `/v1/claim/submit` | Claim with use `claim` |
| Payment notice | Payer | `/v1/paymentnotice/request` | Task with PaymentNotice |
| Reprocess or cancel | Provider | `/v1/task/submit` | Task |
| Status and search | Provider or regulator | `/v1/status`, `/v1/search/submit` | Protocol headers, Task |

Every request path has an `on_` answer path, as described in [the four message legs](./four-message-legs.md). The [workflow id](./workflow-codes.md) on each message names the stage.

### Rules that shape the cycle

- Preauthorisation comes before planned treatment. Under PMJAY it cannot be raised more than one day before admission.
- An enhancement asks for more on an approved preauthorisation. It goes to the same path with workflow id `13`.
- The claim follows discharge. Under PMJAY, discharge details travel inside the claim, and a claim cannot be cancelled.
- A payment notice follows claim approval. The provider acknowledges it, which closes the cycle.
- A rejected or short-paid claim can be sent for reprocess. See [reprocess and cancel](./reprocess-and-cancel.md).

## How you know it worked

You have understood this when you can answer both of these.

1. Your patient needs a further procedure during an approved stay. Which path do you call, with which workflow id, and what bundle?
2. The payer approved the claim. What message does the payer send next, and what must your system send back?

## When it goes wrong

**Claim before preauthorisation.** A standard payer refuses it with [PAYR-1010](../errors/payr-1010.md), preauthorisation required but not obtained.

**Claiming more than was approved.** A standard payer refuses it with [PAYR-1012](../errors/payr-1012.md).

**Answering a query with a fresh request.** A query is part of the same case. Answer it with the query response workflow id. See [queries and communication](./queries-and-communication.md).

**Skipping the payment acknowledgement.** The cycle stays open on the payer's side until you acknowledge.
