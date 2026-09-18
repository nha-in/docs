---
id: nhcx.concept.reprocess-and-cancel
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Reprocess, cancel and the task resource
summary: >-
  After a decision, a hospital sends a task request to dispute a rejection, claim
  a shortfall or cancel a preauthorisation, and the payer answers with a task that
  points at a new decision.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sections 22 and 23 Erroneous and Reprocess.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Preauth cancel and reprocess Task tables.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.4.5 Cancellation; 8.5 functional points.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Value sets, Task codes and input types.
related:
  flows:
  - nhcx.flow.claim-reprocess
  - nhcx.flow.preauth-cancel
  endpoints:
  - nhcx.endpoint.task-submit
  - nhcx.endpoint.task-on-submit
  callbacks:
  - nhcx.callback.task-submit
  - nhcx.callback.task-on-submit
  fhir:
  - nhcx.fhir.task
  - nhcx.fhir.preauth-cancel
  glossary:
  - nhcx.glossary.reprocess
  - nhcx.glossary.crc
  errors:
  - nhcx.error.payr-1017
  - nhcx.error.payr-1018
  - nhcx.error.payr-1252
  - nhcx.error.payr-1253
  - nhcx.error.payr-1257
  - nhcx.error.payr-1258
  concepts:
  - nhcx.concept.claim-cycle
  - nhcx.concept.workflow-codes
  - nhcx.concept.grievance-redressal
  tests:
  - nhcx.test.provider-uc-12
  - nhcx.test.payer-uc-14
---

# Reprocess, cancel and the task resource

## In plain words

Sometimes a hospital needs to act on a decision already made. The claim was rejected and the hospital disagrees. The claim was paid, but less than it should have been. Or the planned treatment is not going ahead, so the preauthorisation should be cancelled.

All three are requests to the payer to do something, so they travel as a FHIR `Task` on `/v1/task/submit`. The payer answers on `/v1/task/on_submit`.

## Before you start

You need the earlier decision: the claim or preauthorisation number and the payer's response. Read [the claim cycle](./claim-cycle.md).

## What happens

### The three requests

| Request | When | `Task.code` | Reason | Workflow id |
|---|---|---|---|---|
| [Reprocess](../glossary/reprocess.md) | A claim was fully rejected | `reprocess` | Why the rejection is disputed | `36` |
| Erroneous claim | A claim was paid, but short | `reprocess` | `partialpayment` | `36` |
| Cancel | A preauthorisation should not proceed | `cancel` | Why, for example `treatmentplanchanged` | `PC01` |

`Task.code` comes from `http://terminology.hl7.org/CodeSystem/financialtaskcode`, which also holds `release` and `nullify`. Reason codes come from `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-reason-code`.

### What the task carries

- `Task.status` `requested` and `Task.intent` `order`.
- An input `claimNumber` with the case number, and for a preauthorisation an input `initimationNumber`, spelt that way.
- A supporting document. It is mandatory for a reprocess and for an erroneous claim.
- For an erroneous claim only, the amount: never more than the gap between claimed and paid.

### The answer

```mermaid
graph LR
  T["Provider Task<br/>/v1/task/submit"] --> P["Payer re-adjudicates"]
  P --> TR["Payer Task, status completed<br/>/v1/task/on_submit"]
  TR -->|output valueReference| CR["ClaimResponse<br/>the new decision"]
```

The answer is a `Task` with `status` `completed`. Its `output` points at a `ClaimResponse`, which you read exactly like any other decision.

### Rules under PMJAY

- A reprocess or erroneous claim can be raised once per claim.
- Reprocess needs no payment notice and can follow the rejection at once.
- An erroneous claim waits for payment settled, workflow id `33`, and your acknowledgement of it.
- The [Claim Review Committee (CRC)](../glossary/crc.md) decides reprocess cases, and its decision is final. No erroneous claim can follow a CRC decision.
- A preauthorisation can be cancelled only while it is submitted or approved. A claim cannot be cancelled.

## How you know it worked

You have understood this when you can answer both of these.

1. A claim for 10,000 was paid at 6,000. Which request do you raise, with which reason, and what is the largest amount you may ask for?
2. The answer to your reprocess arrives on `/v1/task/on_submit`. Where in the bundle is the new decision?

## When it goes wrong

**Wrong combination of code, reason and input.** The PMJAY payer refuses the task with "Invalid input, code and reason code received". Its structure checks use [PAYR-1017](../errors/payr-1017.md) for "No task code received" and [PAYR-1018](../errors/payr-1018.md) for "No task reason code received".

**Missing case number.** The payer refuses a task without a valid `claimNumber` or `initimationNumber`.

**Cancelling too late.** The PMJAY payer refuses to cancel a case that is not active ([PAYR-1252](../errors/payr-1252.md)), already cancelled ([PAYR-1253](../errors/payr-1253.md)), or in payment ([PAYR-1257](../errors/payr-1257.md), [PAYR-1258](../errors/payr-1258.md)).

**Raising an erroneous claim before settlement.** Wait for workflow id `33`, acknowledge it, then raise it.
