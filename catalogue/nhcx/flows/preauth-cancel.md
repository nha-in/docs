---
id: nhcx.flow.preauth-cancel
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Cancel a preauthorisation
summary: >-
  Withdraw a preauthorisation you no longer need, for example after the treatment
  plan changes, before any claim is raised against it.
sources:
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. pages 32-33, 8.4.5 Cancellation.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Preauth cancel Task table; workflow code table.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, Preauthorization Cancellation rows.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet Scenarios, row 9.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/preauth/cancel/preauth_cancel_response.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. ClaimResponse resource.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. PAYR-1237 and PAYR-1238 rows.
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.task-submit
  - nhcx.endpoint.task-on-submit
  callbacks:
  - nhcx.callback.task-submit
  - nhcx.callback.task-on-submit
  - nhcx.callback.error
  fhir:
  - nhcx.fhir.preauth-cancel
  - nhcx.fhir.task
  concepts:
  - nhcx.concept.reprocess-and-cancel
  - nhcx.concept.workflow-codes
  tests:
  - nhcx.test.provider-uc-12
  - nhcx.test.payer-uc-14
  flows:
  - nhcx.flow.preauth-submit
  - nhcx.flow.claim-submit
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.status-check
  errors:
  - nhcx.error.err-pyr-clm-007
  - nhcx.error.nhcx-1006
  - nhcx.error.payr-1001
  glossary:
  - nhcx.glossary.payer
---

# Cancel a preauthorisation

## In plain words

Cancelling withdraws a preauthorisation you no longer need. The patient may have changed treatment, or left before the procedure. Until the claim is raised, you can cancel.

An open preauthorisation blocks a new one for the same beneficiary, at your hospital and at any other. Cancelling releases it.

You cancel with a FHIR Task, not a Claim, on `/v1/task/submit`. The workflow code is `PC01`. The [payer](../glossary/payer.md) confirms on `/v1/task/on_submit` with a completed Task that points to a ClaimResponse whose adjudication reason is `cancelled`.

## Before you start

- The preauthorisation exists and no claim has been raised against it.
- You have its claim identifier, the case number the payer knows it by.
- You know why you are cancelling. `treatmentplanchanged` is the published reason code for a changed treatment plan.
- Your session token, callback endpoint and the payer's certificate are in place, as in [send a sealed request](send-a-sealed-request.md).

## What happens

```mermaid
sequenceDiagram
  participant P as Provider (your system)
  participant N as NHCX
  participant Y as Payer
  P->>N: POST /v1/task/submit (workflow PC01)
  Note right of P: Task code cancel, input claim number
  N-->>P: HTTP 202 Accepted
  N->>Y: POST /v1/task/submit
  Y-->>N: HTTP 202 Accepted
  Note over Y: payer cancels the case
  Y->>N: POST /v1/task/on_submit (workflow PC02)
  N-->>Y: HTTP 202 Accepted
  N->>P: POST /v1/task/on_submit
  P-->>N: HTTP 202 Accepted, within 30 seconds
  Note left of P: Task completed, ClaimResponse reason cancelled
```

1. Build a Task bundle, as in [the preauthorisation cancel bundles](../fhir/preauth-cancel.md). Set Task `status` to `requested`, `intent` to `order`, and `code` to `cancel` from the financial task code system.
2. Set `reasonCode`, for example `treatmentplanchanged`. Add the inputs for the claim number and the intimation number. Both carry the preauthorisation's claim identifier. Set `requester` to your organisation and `owner` to the payer.
3. Seal and set the headers, as in [send a sealed request](send-a-sealed-request.md). Set `x-hcx-workflow_id` to `PC01`, Preauthorization Cancellation, and `x-hcx-status` to `request.initiated`.
4. Start a new correlation. Set `x-hcx-correlation_id` to the value of this call's `x-hcx-api_call_id`.
5. Call [POST /v1/task/submit](../endpoints/task-submit.md). NHCX answers `202 Accepted`. It is not the confirmation.
6. Receive [POST /v1/task/on_submit](../callbacks/task-on-submit.md). Answer `202 Accepted` within 30 seconds, then process.
7. Read `type`. `ProtocolResponse` means the payer could not process the request. Otherwise decrypt `payload` with your private key.
8. Find the Task. Its `status` is `completed`. Follow its `output` reference to the ClaimResponse in the same bundle.
9. Confirm the ClaimResponse `outcome` is `complete` and its adjudication reason is `cancelled`. Workflow `PC02`, Preauthorization Cancellation Accomplished, names this answer.

## How you know it worked

The preauthorisation is cancelled when all of these hold:

- You received `POST /v1/task/on_submit` whose `x-hcx-correlation_id` equals the one you sent.
- Its `payload` decrypts, and the Task in it has `status` `completed`.
- The ClaimResponse the Task points to has `outcome` `complete` and adjudication reason `cancelled`.
- You marked the case cancelled, and stopped any claim work on it.

## When it goes wrong

The payer cannot find the case. [ERR-PYR-CLM-007](../errors/err-pyr-clm-007.md) means no preauthorisation or claim record exists for the case number. Check the claim number in the Task inputs against the identifier you used on the preauthorisation.

A claim was already raised. Cancelling is allowed only until the claim is raised. Continue with the [claim](claim-submit.md) instead.

NHCX rejects the request as a duplicate. [NHCX-1006](../errors/nhcx-1006.md) means you reused a correlation id. Start a new correlation for the cancellation.

The callback is a `ProtocolResponse`. [PAYR-1001](../errors/payr-1001.md) means the payer could not decrypt your request. Fetch its certificate again and reseal.

The 202 arrives and no confirmation follows. [Check the request's status](status-check.md). An undeliverable request comes back on [/v1/error](../callbacks/error.md).
