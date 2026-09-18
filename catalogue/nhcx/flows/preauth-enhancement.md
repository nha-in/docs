---
id: nhcx.flow.preauth-enhancement
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Request a preauthorisation enhancement
summary: >-
  Ask the payer to raise an approved preauthorisation when the patient needs more
  treatment than was approved, such as a move to intensive care.
sources:
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 32, 8.4.3 Enhancement.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, Enhancement rows.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet Scenarios, rows 4, 5 and 7.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. InsurancePlan claim condition table.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Preauth, x-hcx-use_case row.
- url: https://hcxsbx.abdm.gov.in/preauthhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/preauthhcxservice.json
  hash: sha256:2e8c594c51d9640ae4a576be34a5d190614918d1e7697d6718bc91c31fa66948
  fetched: '2026-09-14'
  note: 'API specification: preauthhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths /v1/preauth/submit and /v1/preauth/on_submit.'
related:
  endpoints:
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.preauth-on-submit
  callbacks:
  - nhcx.callback.preauth-submit
  - nhcx.callback.preauth-on-submit
  - nhcx.callback.error
  fhir:
  - nhcx.fhir.preauth-request
  - nhcx.fhir.preauth-response
  - nhcx.fhir.preauth-enhancement
  concepts:
  - nhcx.concept.claim-cycle
  - nhcx.concept.message-identifiers
  flows:
  - nhcx.flow.preauth-submit
  - nhcx.flow.claim-submit
  - nhcx.flow.coverage-eligibility-check
  - nhcx.flow.insurance-plan-request
  - nhcx.flow.preauth-query-response
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.status-check
  errors:
  - nhcx.error.nhcx-1006
  - nhcx.error.payr-1212
  - nhcx.error.payr-1213
  - nhcx.error.payr-1235
  glossary:
  - nhcx.glossary.enhancement
  - nhcx.glossary.payer
---

# Request a preauthorisation enhancement

## In plain words

An [enhancement](../glossary/enhancement.md) asks the payer to raise an approved preauthorisation. You send it when the patient needs more than was approved. A transfer from the ward to intensive care is the common case.

It travels on the same path as the first [preauthorisation](preauth-submit.md), `/v1/preauth/submit`, with workflow `13`. It is a new request: new correlation id, same claim identifier. The Claim lists the approved items plus the new ones.

The [payer](../glossary/payer.md) answers on `/v1/preauth/on_submit`. Workflow `22` approves the enhancement, `231` denies it and `241` queries it.

## Before you start

- The case holds an approved preauthorisation: you received workflow `21` and stored its `preAuthRef`.
- No adjudication is running on the case. A pending query or an earlier enhancement must finish first.
- Each package you plan to add allows enhancement. Check its `EnhancementAllowed` claim condition in the cached [insurance plan](insurance-plan-request.md).
- You ran a [coverage eligibility check](coverage-eligibility-check.md) with `benefits`, and with `auth-requirements` for the new packages, and collected the documents it named.
- You still have the claim identifier and the bundle you sent for the approved preauthorisation.

## What happens

```mermaid
sequenceDiagram
  participant P as Provider (your system)
  participant N as NHCX
  participant Y as Payer
  P->>N: POST /v1/preauth/submit (workflow 13)
  Note right of P: same Claim identifier, new correlation id, added items
  N-->>P: HTTP 202 Accepted
  N->>Y: POST /v1/preauth/submit
  Y-->>N: HTTP 202 Accepted
  Note over Y: payer adjudicates the added treatment
  Y->>N: POST /v1/preauth/on_submit
  N-->>Y: HTTP 202 Accepted
  N->>P: POST /v1/preauth/on_submit
  P-->>N: HTTP 202 Accepted, within 30 seconds
  alt workflow 22
    Note left of P: enhancement approved
  else workflow 241
    Note left of P: enhancement queried, answer with workflow 131
  else workflow 231
    Note left of P: enhancement denied
  end
```

1. Start from the bundle of the approved preauthorisation. Keep `Claim.identifier` and keep `use` `preauthorization`.
2. Add the new items, such as an intensive care stratification, with their procedures and documents in `supportingInfo`. Update `Claim.total`. See [the enhancement bundles](../fhir/preauth-enhancement.md).
3. Seal and set the headers, as in [send a sealed request](send-a-sealed-request.md). Set `x-hcx-workflow_id` to `13` and `x-hcx-status` to `request.initiated`. `x-hcx-use_case` `Enhancement` is optional.
4. Start a new correlation. Set `x-hcx-correlation_id` to the value of this call's `x-hcx-api_call_id`. The claim identifier, not the correlation id, ties the enhancement to the case.
5. Call [POST /v1/preauth/submit](../endpoints/preauth-submit.md). NHCX answers `202 Accepted`. It is not the decision.
6. Receive [POST /v1/preauth/on_submit](../callbacks/preauth-on-submit.md). Answer `202 Accepted` within 30 seconds, then process.
7. Read `type`. `ProtocolResponse` means the payer could not process the request. Otherwise decrypt `payload` with your private key.
8. Read `x-hcx-workflow_id`:

| `x-hcx-workflow_id` | Meaning | What to do |
|---|---|---|
| `22` | Enhancement approved | Store the new approved `benefit` amount against the case |
| `241` | Enhancement queried | [Answer the query](preauth-query-response.md) with workflow `131` |
| `231` | Enhancement denied | Read `disposition` and the adjudication for the reason |

## How you know it worked

The enhancement is approved when all of these hold:

- You received `POST /v1/preauth/on_submit` whose `x-hcx-correlation_id` equals the correlation id of your enhancement request.
- Its `type` is not `ProtocolResponse`, and `payload` decrypts with your private key.
- `x-hcx-workflow_id` is `22`, and the ClaimResponse carries the approved `benefit` for the added items.
- You updated the approved amount stored against the case.

A callback with workflow `231` also ends this flow, as a denial.

## When it goes wrong

The payer finds no approved preauthorisation. [PAYR-1212](../errors/payr-1212.md) means no approved record exists for the case number. Check that you kept the original claim identifier. If the case was never approved, submit a new [preauthorisation](preauth-submit.md).

The payer finds work in progress. [PAYR-1213](../errors/payr-1213.md) means adjudication is still running on the case. Wait for the current decision, then send the enhancement.

NHCX rejects the request as a duplicate. [NHCX-1006](../errors/nhcx-1006.md) means you reused the correlation id of the original preauthorisation. Start a new correlation for every enhancement.

The wallet cannot cover the increase. [PAYR-1235](../errors/payr-1235.md) means the balance is too low. Run a `validation` eligibility check to see the balance.

The 202 arrives and no decision follows. [Check the request's status](status-check.md). An undeliverable request comes back on [/v1/error](../callbacks/error.md).
