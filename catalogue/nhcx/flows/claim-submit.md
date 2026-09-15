---
id: nhcx.flow.claim-submit
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Submit a claim after discharge
summary: >-
  After the patient is discharged, send the final bill and records for the approved
  preauthorisation, then read the payer's adjudication.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: 'NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 9 Claim: request tables, 9.5.1 outcome summary; workflow code table.'
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 35, Claim functional points to note.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. FAQ 25 discharge, questions 3 and 7.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet Scenarios, row 10.
- url: https://hcxsbx.abdm.gov.in/claimhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/claimhcxservice.json
  hash: sha256:488eea449c6ee45dc324f4f7c095a862c7d50d0e238075846122b51b2bab4878
  fetched: '2026-09-14'
  note: 'API specification: claimhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths /v1/claim/submit and /v1/claim/on_submit.'
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.claim-submit
  - nhcx.endpoint.claim-on-submit
  callbacks:
  - nhcx.callback.claim-submit
  - nhcx.callback.claim-on-submit
  - nhcx.callback.error
  fhir:
  - nhcx.fhir.collection-bundle
  - nhcx.fhir.validation
  - nhcx.fhir.claim-request
  - nhcx.fhir.claim-response
  concepts:
  - nhcx.concept.claim-cycle
  - nhcx.concept.status-lifecycle
  - nhcx.concept.four-message-legs
  tests:
  - nhcx.test.provider-uc-09
  - nhcx.test.payer-uc-11
  - nhcx.test.tc-cl-01
  flows:
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.payer-process-a-request
  - nhcx.flow.biometric-face
  - nhcx.flow.biometric-fingerprint-iris
  - nhcx.flow.claim-query-response
  - nhcx.flow.claim-reprocess
  - nhcx.flow.payment-notice
  - nhcx.flow.preauth-submit
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.status-check
  errors:
  - nhcx.error.nhcx-1006
  - nhcx.error.payr-1001
  - nhcx.error.payr-1301
  - nhcx.error.payr-1302
  - nhcx.error.payr-1363
  glossary:
  - nhcx.glossary.claim
  - nhcx.glossary.payer
  - nhcx.glossary.pmjay
---

# Submit a claim after discharge

## In plain words

A [claim](../glossary/claim.md) asks the payer to pay for treatment already delivered. It uses the same Claim structure as the [preauthorisation](preauth-submit.md), with `Claim.use` set to `claim`. It carries final amounts and the full record: discharge summary, operative notes, diagnostics and the itemised bill.

For [PMJAY](../glossary/pmjay.md) there is no separate discharge submission. Discharge details travel inside the claim, with workflow `15`.

The [payer](../glossary/payer.md) may answer more than once. `x-hcx-status` `response.partial` means the claim is still open. `response.complete` closes it, and no further submissions are accepted against that claim identifier.

## Before you start

- The case holds an approved preauthorisation with a `preAuthRef`.
- No claim has been raised for the case yet.
- The amount you will claim is no more than the preauthorisation's approved amount.
- You authenticated the beneficiary at discharge by [fingerprint or iris](biometric-fingerprint-iris.md) or [face](biometric-face.md). Where that is not possible, you have the Authentication Consent Questionnaire response to attach.
- The discharge documents are ready: discharge summary, operative notes, diagnostic reports and the final itemised bill.
- Your session token, callback endpoint and the payer's certificate are in place, as in [send a sealed request](send-a-sealed-request.md).

## What happens

```mermaid
sequenceDiagram
  participant P as Provider (your system)
  participant N as NHCX
  participant Y as Payer
  P->>N: POST /v1/claim/submit (workflow 15)
  N-->>P: HTTP 202 Accepted
  N->>Y: POST /v1/claim/submit
  Y-->>N: HTTP 202 Accepted
  opt interim updates
    Y->>N: POST /v1/claim/on_submit (workflow 25, 28 or 29, response.partial)
    N->>P: POST /v1/claim/on_submit
    P-->>N: HTTP 202 Accepted
  end
  Note over Y: payer adjudicates the claim
  Y->>N: POST /v1/claim/on_submit (decision)
  N-->>Y: HTTP 202 Accepted
  N->>P: POST /v1/claim/on_submit
  P-->>N: HTTP 202 Accepted, within 30 seconds
  alt complete and approved (workflow 26)
    Note left of P: approved, wait for the payment notice
  else partial and queried (workflow 27)
    Note left of P: queried, answer the query
  else complete and cancelled
    Note left of P: rejected, consider reprocess
  end
```

1. Start from the preauthorisation bundle. Change `Claim.use` to `claim`. Keep `Claim.identifier`, and reference the approved `preAuthRef`.
2. Replace the estimates with final amounts. Keep the diagnoses and procedures unless the treatment changed. Add the discharge documents to `supportingInfo`. See [the claim request bundle](../fhir/claim-request.md).
3. For PMJAY, record the discharge in `supportingInfo` with category `DIS`. Its code is `DTH`, `DTM`, `LAMA` or `DAMA`, and its value is `Before Surgery` or `After Surgery`.
4. Seal and set the headers, as in [send a sealed request](send-a-sealed-request.md). Set `x-hcx-workflow_id` to `15` and `x-hcx-status` to `request.initiated`. Send `x-hcx-ben-abha-id`.
5. Start a new correlation. Set `x-hcx-correlation_id` to the value of this call's `x-hcx-api_call_id`. Store it against the case.
6. Call [POST /v1/claim/submit](../endpoints/claim-submit.md). NHCX answers `202 Accepted`. It is not the adjudication.
7. Wait. Interim callbacks may arrive on `/v1/claim/on_submit` with `x-hcx-status` `response.partial`: workflow `25` received, `28` in process, `29` forwarded. Answer each with `202` and keep waiting.
8. Receive the decision on [POST /v1/claim/on_submit](../callbacks/claim-on-submit.md). Answer `202 Accepted` within 30 seconds, then process.
9. Read `type`. `ProtocolResponse` means the payer could not process the claim. Otherwise decrypt `payload` and read the [ClaimResponse](../fhir/claim-response.md).
10. Read `ClaimResponse.outcome` and `adjudication[0].reason` together. Both an approval and a rejection carry `outcome` `complete`.

| `outcome` | Adjudication reason | Meaning | What to do |
|---|---|---|---|
| `complete` | `approved` | Approved, workflow `26` | Wait for the [payment notice](payment-notice.md) |
| `partial` | `approved` | Partly approved at a reduced amount | Read `processNote` for the reduction. Wait for payment |
| `partial` | `queried` | Queried, workflow `27`, totals `0` | [Answer the query](claim-query-response.md) |
| `complete` | `cancelled` | Rejected. The claim is closed | Decide whether to [ask for reprocessing](claim-reprocess.md) |

## How you know it worked

The claim is adjudicated when all of these hold:

- You received `POST /v1/claim/on_submit` whose `x-hcx-correlation_id` equals the one you sent.
- Its `type` is not `ProtocolResponse`, and `payload` decrypts with your private key.
- The ClaimResponse has `use` `claim`, `outcome` `complete`, adjudication reason `approved`, and a `benefit` total above zero.
- `x-hcx-workflow_id` is `26` and `x-hcx-status` is `response.complete`.
- You stored the approved amount against the case, ready to reconcile the payment notice.

A rejection, `complete` with reason `cancelled`, also ends this flow. A query hands over to the query flow.

## When it goes wrong

The payer finds no approved preauthorisation. [PAYR-1302](../errors/payr-1302.md) means no approved record exists for the case number. Check that the claim carries the preauthorisation's claim identifier.

A claim already exists. [PAYR-1301](../errors/payr-1301.md) means the case number already has a claim. To add documents to a queried claim, [answer the query](claim-query-response.md) instead.

Authentication is missing at discharge. [PAYR-1363](../errors/payr-1363.md) means you sent neither biometric authentication nor the consent questionnaire response.

The 202 arrives and no decision follows. Interim `response.partial` callbacks mean the payer is still working. For long waits, [check the request's status](status-check.md). An undeliverable request comes back on [/v1/error](../callbacks/error.md).

NHCX or the payer rejects the envelope. [NHCX-1006](../errors/nhcx-1006.md) means the correlation id was used before. A `ProtocolResponse` with [PAYR-1001](../errors/payr-1001.md) means the payer could not decrypt your request.
