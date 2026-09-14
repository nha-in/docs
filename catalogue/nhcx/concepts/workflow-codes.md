---
id: nhcx.concept.workflow-codes
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Workflow codes and the stage each one names
summary: >-
  The workflow id header names the business stage a message belongs to, such as
  a new preauthorisation or a payment settled, and pairs with the status header
  to say exactly what the message is.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Section 22 Q5 and Section 23 Q5.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.protocol-headers
  - nhcx.concept.status-lifecycle
  - nhcx.concept.claim-cycle
  - nhcx.concept.reprocess-and-cancel
  - nhcx.concept.queries-and-communication
  - nhcx.concept.message-identifiers
  glossary:
  - nhcx.glossary.workflow-id
  - nhcx.glossary.preauthorisation
  - nhcx.glossary.enhancement
  errors:
  - nhcx.error.payr-1321
  - nhcx.error.payr-1003
  flows:
  - nhcx.flow.preauth-submit
  - nhcx.flow.claim-submit
  - nhcx.flow.payment-notice
---

# Workflow codes and the stage each one names

## In plain words

The [workflow id](../glossary/workflow-id.md) says which stage of a case a message belongs to. `12` is a new preauthorisation. `15` is a claim. `33` is a payment settled.

It travels in `x-hcx-workflow_id`, next to `x-hcx-status`. The pair tells the receiver exactly what the message is, without opening the bundle.

## Before you start

Read [the protocol headers](./protocol-headers.md) and [the claim cycle](./claim-cycle.md).

## What happens

### The codes a provider sends

| Code | Stage | `x-hcx-status` |
|---|---|---|
| `10` | Patient registered | `request.initiated` |
| `11` | Patient admitted | `request.initiated` |
| `12` | Preauthorisation request initiated | `request.initiated` |
| `121` | Preauthorisation resubmission | `request.initiated` |
| `13` | Enhancement request initiated | `request.initiated` |
| `19` | Preauthorisation query response submitted | `response.complete` |
| `131` | Enhancement query response submitted | `response.complete` |
| `14` | Discharge submitted | `request.initiated` |
| `15` | Claim request initiated | `request.initiated` |
| `151` | Claim query response submitted | `response.complete` |
| `17` | Payment notice received | `response.complete` |
| `36` | Claim arbitration intimation (reprocess or erroneous claim) | `request.initiated` |
| `PC01` | Preauthorisation cancellation | `request.initiated` |

### The codes a payer sends

| Code | Stage | `x-hcx-status` |
|---|---|---|
| `20` | Preauthorisation acknowledged | `response.partial` |
| `21` | Preauthorisation approved | `response.complete` |
| `22` | Enhancement approved | `response.complete` |
| `23` | Preauthorisation rejected | `response.complete` |
| `24` | Preauthorisation queried | `request.initiated` |
| `241` | Enhancement queried | `request.initiated` |
| `25` | Claim documents acknowledged | `response.partial` |
| `26` | Claim approved | `response.complete` |
| `27` | Claim queried | `request.initiated` |
| `28` | Claim in process | `response.partial` |
| `29` | Claim forwarded | `response.partial` |
| `252`, `253`, `254` | Reprocess approved, rejected, queried | `response.complete`, `response.complete`, `request.initiated` |
| `30` | Payment notice initiated | `request.initiated` |
| `31` | Payment processed | `request.initiated` |
| `33` | Payment settled | `request.initiated` |
| `PC02` | Preauthorisation cancellation accomplished | `response.complete` |

### Other families

`R` codes cover reimbursement claims, for example `R15` for a reimbursement claim submitted. `G11` to `G13` cover grievances, `RP1` to `RP3` return payments, `N01` to `N04` notifications and `DC01` to `DC02` discharge corrections.

### One code, several stages

Some codes appear more than once and the status tells them apart. Code `20` with `response.partial` is an acknowledgement that succeeded. The same code with `response.error` is an acknowledgement that failed, and you handle it as a protocol error.

### Rule

Keep workflow ids in configuration, not in code. A payer may ask for a corrected code, and a configuration change needs no release.

## How you know it worked

You have understood this when you can answer both of these.

1. A payer's message arrives with `x-hcx-workflow_id` `24`. What happened to your preauthorisation, and which code does your answer carry?
2. Code `20` arrives with `response.error`. Is the preauthorisation rejected? How do you treat it?

## When it goes wrong

**Invalid workflow id.** The PMJAY payer refuses a claim with an unknown workflow id with [PAYR-1321](../errors/payr-1321.md). Its structure checks use [PAYR-1003](../errors/payr-1003.md) for "Invalid workflow requested".

**Query answered as a resubmission.** Answer a query with the query response code (`19` or `151`). A resubmission code (`121`) replaces the earlier request instead.

**Acknowledgement failures read as rejections.** An "Ack Failed" code with `response.error` is a delivery or protocol problem, not a business decision.
