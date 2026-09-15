---
id: nhcx.concept.queries-and-communication
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Payer queries and the communication cycle
summary: >-
  A payer asks a hospital for more information in one of two ways, a query inside
  its response or a separate communication request, and each needs a different answer.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1 query and query response rows.
- url: https://hcxsbx.abdm.gov.in/images/b6bd99dab49a5e928ea3.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Overview.pdf
  hash: sha256:c95469758a25cb8aca8c47757d8b18b4dedb8b4d42669663cff7343205f77fda
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Overview, row 27 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Pages 7-8 Query flow.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.4.2 Resubmission.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Communication use case reason code tables.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Communication.
verified:
  status: unverified
related:
  flows:
  - nhcx.flow.preauth-query-response
  - nhcx.flow.claim-query-response
  endpoints:
  - nhcx.endpoint.communication-request
  - nhcx.endpoint.communication-on-request
  callbacks:
  - nhcx.callback.communication-request
  - nhcx.callback.communication-on-request
  concepts:
  - nhcx.concept.claim-cycle
  - nhcx.concept.workflow-codes
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.message-identifiers
  glossary:
  - nhcx.glossary.communication-request
  errors:
  - nhcx.error.payr-1019
  - nhcx.error.payr-1218
  - nhcx.error.payr-1219
  - nhcx.error.payr-1303
  - nhcx.error.payr-1304
  fhir:
  - nhcx.fhir.query-update
  tests:
  - nhcx.test.provider-uc-08
  - nhcx.test.payer-uc-10
---

# Payer queries and the communication cycle

## In plain words

Payers often need more before they decide. A missing report, an unclear diagnosis, a bill that does not add up.

There are two ways a payer asks. It can answer your preauthorisation or claim with a query instead of a decision. Or it can send a separate [communication request](../glossary/communication-request.md). Your system must recognise both and answer each the right way.

## Before you start

Read [the claim cycle](./claim-cycle.md) and [workflow codes](./workflow-codes.md).

## What happens

```mermaid
graph TD
  subgraph "Channel 1: query inside the response"
    R1["Provider: preauth or claim"] --> Q1["Payer: ClaimResponse<br/>outcome partial, queried<br/>workflow 24 or 27"]
    Q1 --> A1["Provider: same bundle, updated<br/>workflow 19 or 151"]
    A1 --> D1["Payer: decision"]
  end
  subgraph "Channel 2: communication request"
    Q2["Payer: /v1/communication/request<br/>Task with CommunicationRequest"] --> A2["Provider: /v1/communication/on_request<br/>Task with Communication"]
  end
```

### Channel 1: a query inside the response

The payer answers your preauthorisation or claim with a `ClaimResponse` whose `outcome` is `partial` and whose adjudication reason is `queried`. The workflow id says which stage: `24` for a preauthorisation, `241` for an enhancement, `27` for a claim.

You answer by sending the same kind of bundle again, updated with what was asked, to the same path. Use the query response workflow id: `19` for a preauthorisation, `131` for an enhancement, `151` for a claim. Do not use a resubmission code. A resubmission replaces all earlier instances of the request.

Under PMJAY, this is how every query on a preauthorisation or claim arrives. The PMJAY payer does not use the communication request for queries.

### Channel 2: a communication request

The payer calls `/v1/communication/request` with a `Task` bundle that carries a `CommunicationRequest`. Your system answers on `/v1/communication/on_request` with a `Task` bundle whose input is a `Communication`, carrying the documents or information asked for. The request and your answer share one correlation id.

A standard payer uses this channel to ask for additional documents during a claim cycle. The PMJAY payer uses it for other notices, named in `Task.reasonCode`: `tatquery`, `grievance`, `walletupdate`, `policychange`, `additionalinfo` and `claimArbitration`.

## How you know it worked

You have understood this when you can answer both of these.

1. A PMJAY `ClaimResponse` arrives with workflow id `27`. Which path do you answer on, with which workflow id, and with what bundle?
2. A communication request arrives from a standard payer during a claim. Which path carries your answer, and what must stay the same as in the request?

## When it goes wrong

**Answering too late.** A standard payer closes the query with [PAYR-1019](../errors/payr-1019.md), information not received in time.

**Answering a case that is not queried.** The PMJAY payer refuses a query update with [PAYR-1219](../errors/payr-1219.md), case not queried, or [PAYR-1218](../errors/payr-1218.md) for a preauthorisation. For a claim the codes are [PAYR-1304](../errors/payr-1304.md) and [PAYR-1303](../errors/payr-1303.md).

**Using the resubmission code for a query answer.** Workflow id `121` replaces the preauthorisation instead of answering the query. Use `19`.

**Treating a communication request as a decision.** A communication request never approves or rejects. The decision still arrives on the preauthorisation or claim path.
