---
id: nhcx.flow.payment-notice
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Receive a payment notice and acknowledge it
summary: >-
  Receive the payer's notice that a claim is being paid or has been paid, record
  the bank reference, and send the acknowledgement back.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: 'NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Payment Notice chapter: workflow table, Task deliver, PaymentReconciliation fields.'
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: 'NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Code tables: Payment Type Code and Task output values.'
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, Payment Notice rows.
- url: https://hcxsbx.abdm.gov.in/images/140dbb309d5825459a7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Sample FHIR bundles.zip
  member: FHIR_bundles_PMJAY_ext/paymentNotice/paymentNotice_ack.txt
  hash: sha256:8c7b24e3022733aaf7e8f517e12c11c0e8eddd6293844a2c4f3e9700fb720dca
  fetched: '2026-09-14'
  note: Sample FHIR bundles, row 29 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Task resource.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet Scenarios, row 13.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Payment Notice; Payment Notice Trigger API.
related:
  endpoints:
  - nhcx.endpoint.paymentnotice-request
  - nhcx.endpoint.paymentnotice-on-request
  - nhcx.endpoint.dummy-payer-paymentnotice-init
  callbacks:
  - nhcx.callback.paymentnotice-request
  - nhcx.callback.paymentnotice-on-request
  fhir:
  - nhcx.fhir.payment-notice
  - nhcx.fhir.task
  concepts:
  - nhcx.concept.claim-cycle
  - nhcx.concept.message-identifiers
  - nhcx.concept.synchronous-acknowledgement
  tests:
  - nhcx.test.provider-uc-11
  - nhcx.test.payer-uc-13
  flows:
  - nhcx.flow.claim-submit
  - nhcx.flow.claim-reprocess
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.rotate-certificate
  errors:
  - nhcx.error.nhcx-1010
  - nhcx.error.nhcx-1011
  - nhcx.error.payr-1002
  glossary:
  - nhcx.glossary.payer
  - nhcx.glossary.payment-notice
  sandbox:
  - nhcx.sandbox.callback-url-requirements
  - nhcx.sandbox.dummy-payer
  troubleshooting:
  - nhcx.troubleshooting.callback-url-rejected
---

# Receive a payment notice and acknowledge it

## In plain words

A [payment notice](../glossary/payment-notice.md) tells your hospital that the payer is paying an approved claim. It carries the amount, the tax deducted at source, the payment date and the bank's Unique Transaction Reference. The claim decision says what will be paid. The notice says what was paid.

This flow runs the other way from the others. The [payer](../glossary/payer.md) starts it, and your system answers. It arrives some time after the claim approval, not straight away.

| Workflow | Stage |
|---|---|
| `30` | Payment initiated |
| `31` | Payment processed |
| `33` | Payment settled. The Unique Transaction Reference is available |
| `17` | Your acknowledgement of a notice |

Acknowledge each notice. The claim is financially closed when you have received workflow `33`, stored its Unique Transaction Reference, and acknowledged it.

## Before you start

- A claim for the case was approved: `outcome` `complete`, reason `approved`, workflow `26`. See [submit a claim](claim-submit.md).
- Your callback endpoint is registered, answers within 30 seconds, and receives `/v1/paymentnotice/request`.
- Your current encryption certificate is registered, so the payer can seal the notice for you.
- You can match a notice to a claim by its claim number.
- In the sandbox, trigger a notice from the [dummy payer](../sandbox/dummy-payer.md) with [POST /paymentNotice/init](../endpoints/dummy-payer-paymentnotice-init.md), giving your participant code and the claim number.

## What happens

```mermaid
sequenceDiagram
  participant Y as Payer
  participant N as NHCX
  participant P as Provider (your system)
  loop for each notice, workflow 30, 31 and 33
    Y->>N: POST /v1/paymentnotice/request
    Note left of Y: x-hcx-status request.initiated
    N-->>Y: HTTP 202 Accepted
    N->>P: POST /v1/paymentnotice/request
    P-->>N: HTTP 202 Accepted, within 30 seconds
    Note right of P: decrypt, record the amount and the bank reference
    P->>N: POST /v1/paymentnotice/on_request (workflow 17)
    Note right of P: Task output paymentack, same correlation id
    N-->>P: HTTP 202 Accepted
    N->>Y: POST /v1/paymentnotice/on_request
    Y-->>N: HTTP 202 Accepted
  end
```

1. Receive [POST /v1/paymentnotice/request](../callbacks/paymentnotice-request.md). Answer `202 Accepted` within 30 seconds, then process.
2. Read `x-hcx-workflow_id`: `30`, `31` or `33`. Decrypt `payload` with your private key.
3. Read the [PaymentNotice bundle](../fhir/payment-notice.md). A Task with `code` `deliver` points to the `PaymentNotice`. The notice points to the `PaymentReconciliation`.
4. Take the claim number from `PaymentNotice.identifier` and the net amount from `PaymentNotice.amount`.
5. From `PaymentReconciliation`, take `paymentDate` and the Unique Transaction Reference in `paymentIdentifier.value`. In `detail`, the entry of type `TDS` is the tax deducted, and the entry of type `Payment` is the net amount.
6. Check that the net amount plus the tax deducted equals the approved claim amount. Store the Unique Transaction Reference against the claim.
7. Build the acknowledgement: a Task with `status` `completed` and `code` `status`. Set `output[0]` to `paymentack`, Payment is acknowledged, and `output[1]` to the claim number.
8. Seal it for the payer. Set `x-hcx-workflow_id` to `17` and `x-hcx-status` to `response.complete`.
9. Set `x-hcx-correlation_id` to the notice's correlation id. Use a fresh `x-hcx-api_call_id`. Address it to the payer that sent the notice.
10. Call [POST /v1/paymentnotice/on_request](../endpoints/paymentnotice-on-request.md). NHCX answers `202 Accepted` and delivers it to the payer.

## How you know it worked

The payment is closed when all of these hold:

- You received `POST /v1/paymentnotice/request` with `x-hcx-workflow_id` `33`, and its `payload` decrypted.
- You stored `PaymentReconciliation.paymentIdentifier.value` against the claim.
- The net amount plus the tax deducted equals the approved amount.
- NHCX answered `202` to your `POST /v1/paymentnotice/on_request` for that notice, with workflow `17` and output `paymentack`.
- You acknowledged the earlier notices, `30` and `31`, the same way.

## When it goes wrong

No notice arrives. The notice follows the claim approval after a delay, not straight away. If none comes, check your endpoint against the [callback URL rules](../sandbox/callback-url-requirements.md). See [your callback URL is rejected or never called](../troubleshooting/callback-url-rejected.md).

You cannot decrypt the notice. The payer sealed it with the certificate registered for you. A payer on the published standard reports [PAYR-1002](../errors/payr-1002.md) when it cannot encrypt for you. [Update your certificate](rotate-certificate.md) and ask the payer to resend.

NHCX rejects your acknowledgement. [NHCX-1010](../errors/nhcx-1010.md) means no request exists with the correlation id you set. Copy it from the notice exactly. [NHCX-1011](../errors/nhcx-1011.md) means the `x-hcx-status` value is not valid.

The amounts do not reconcile. Keep the notice, acknowledge it, and raise the shortfall with an [erroneous claim](claim-reprocess.md) after workflow `33`.
