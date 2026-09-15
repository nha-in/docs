---
id: nhcx.concept.grievance-redressal
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Grievance redressal on the exchange
summary: >-
  Any participant can raise a grievance against another under the exchange operator's
  published policy, with named contacts, time limits, reopening and escalation,
  and grievance messages carry their own workflow ids.
sources:
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications/healthcare-operation-policy/guidelines-for-grienvance-redressal
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications__healthcare-operation-policy__guidelines-for-grienvance-redressal.md
  hash: sha256:c223f711b5158dbc2c3d10870c3a9610c4af32681306f53593babb64ee382230
  fetched: '2026-09-14'
  note: Site page /domain-specifications/healthcare-operation-policy/guidelines-for-grienvance-redressal, text as shown on the site. Key Policy Design Guidelines.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, G11 to G13 rows.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Communication reason code table; POST /communication/on_request row.
- url: https://hcxsbx.abdm.gov.in/#/introduction-NHCX/guidlines-for-participant-onboarding
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/introduction-NHCX__guidlines-for-participant-onboarding.md
  hash: sha256:58aaa762f2a04565e2060658b0eda95e3cac4cbb0819b6d865f04cf53066680d
  fetched: '2026-09-14'
  note: Site page /introduction-NHCX/guidlines-for-participant-onboarding, text as shown on the site. Deboarding scenarios, last paragraph.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Section 23 Claim Reprocess, Q15.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. Integrator's Journey, FHIR Bundle Validation.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.access-control
  - nhcx.concept.reprocess-and-cancel
  - nhcx.concept.queries-and-communication
  - nhcx.concept.audit-and-non-repudiation
  - nhcx.concept.workflow-codes
  sandbox:
  - nhcx.sandbox.support-contacts
  glossary:
  - nhcx.glossary.irdai
  - nhcx.glossary.crc
---

# Grievance redressal on the exchange

## In plain words

Disputes happen between hospitals, payers, TPAs and patients. A payer ignores a case for weeks. A hospital bills a patient wrongly. A participant is removed from the exchange and disagrees.

Each NHCX operator publishes a grievance policy that says how such disputes are raised, tracked and resolved, and how they escalate. The policy follows the insurance regulator's grievance guidelines, extended to disputes between any two participants.

## Before you start

Record a nodal contact for grievances, digital and physical, when your participant is onboarded. Other participants read it from the registry.

## What happens

### What the policy must provide

| Guarantee | What it means for you |
|---|---|
| Digital grievances | You raise, route and track a grievance online |
| A stated scope | The policy lists which grievances it covers and where others go |
| Nodal bodies | Every participant, and the operator, publishes a contact in the registry |
| Types, priorities and time limits | Published per grievance type, including those set by regulation |
| A versioned policy | You sign it at onboarding, and you are told of every change |
| Due diligence | Grievances are investigated and reviewed before a reply |
| Reopening | You can reopen a grievance you are not satisfied with |
| Escalation | You can escalate to the operator, on faster time limits |
| Status updates | You are kept informed while it is open |

### Grievance messages on the wire

```mermaid
graph LR
  G11["G11 grievance intimation<br/>request.initiated"] --> G12["G12 acknowledgement<br/>response.complete"]
  G11 --> G13["G13 intimation failure<br/>response.error"]
```

Workflow ids `G11`, `G12` and `G13` identify grievance intimation, acknowledgement and failure. The path a participant uses to raise a `G11` grievance is not yet published.

A PMJAY payer also tells a hospital about a grievance that needs its action through a communication request with `Task.reasonCode` `grievance`. Acknowledge it like any communication request. See [queries and communication](./queries-and-communication.md).

### A grievance is not a claim dispute

To dispute a claim decision, raise a reprocess or erroneous claim through the task path. Under PMJAY those go to the [Claim Review Committee](../glossary/crc.md). See [reprocess and cancel](./reprocess-and-cancel.md).

### Appealing removal

A participant removed from the exchange against its will can appeal through the grievance process.

For help with an integration, write to hcx.integration@nha.gov.in.

## How you know it worked

You have understood this when you can answer both of these.

1. A payer has not answered your hospital's preauthorisation within the policy's time limit. Is that a reprocess, a query, or a grievance? What guarantees does the policy give you?
2. Your participant was blocked for repeated rate limit breaches. What route does the policy give you to challenge it?

## When it goes wrong

**Using a grievance to dispute a claim decision.** A rejected or short-paid claim goes through reprocess on the task path, not through grievance.

**No nodal contact in the registry.** Other participants cannot reach you, and grievances against you escalate to the operator.

**Ignoring a grievance communication.** Acknowledge a communication request with reason `grievance` like any other, within 30 seconds, and act on it.
