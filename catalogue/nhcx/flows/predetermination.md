---
id: nhcx.flow.predetermination
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Request a predetermination
summary: >-
  Before a planned admission, ask the payer what it would approve for a proposed
  treatment, as an estimate that commits nobody.
sources:
- url: https://hcxsbx.abdm.gov.in/images/af8d243edcc2139a515d.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Usecases.pdf
  hash: sha256:8709b2907a0d5a0dbb36f5e63ed8deae269e0c75372b05d71ce7380c8a0929e7
  fetched: '2026-09-14'
  note: NHCX Usecases, row 1 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, Predetermination Request Submission.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. API list table.
- url: https://hcxsbx.abdm.gov.in/images/2c3fbb4e6b09f0834f69.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Implementation Guide for Adoption of FHIR in ABDM and NHCX.pdf
  hash: sha256:549377c9c26b1bd23decac3a1b9e5ebedfdc8e0fe99e53ef733859b188f51366
  fetched: '2026-09-14'
  note: Implementation Guide for Adoption of FHIR in ABDM and NHCX, row 14 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. API list table, rows 5 and 6.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, dummy payer use case list.
related:
  endpoints:
  - nhcx.endpoint.predetermination-submit
  - nhcx.endpoint.predetermination-on-submit
  callbacks:
  - nhcx.callback.predetermination-submit
  - nhcx.callback.predetermination-on-submit
  - nhcx.callback.error
  fhir:
  - nhcx.fhir.claim-request
  - nhcx.fhir.claim-response
  - nhcx.fhir.collection-bundle
  concepts:
  - nhcx.concept.claim-cycle
  - nhcx.concept.four-message-legs
  flows:
  - nhcx.flow.preauth-submit
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.status-check
  decisions:
  - nhcx.decision.preauth-or-predetermination
  errors:
  - nhcx.error.nhcx-1003
  - nhcx.error.nhcx-1006
  - nhcx.error.payr-1001
  glossary:
  - nhcx.glossary.predetermination
  sandbox:
  - nhcx.sandbox.dummy-payer
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
---

# Request a predetermination

## In plain words

A [predetermination](../glossary/predetermination.md) asks the payer what it would approve for a treatment you are planning. You send it before the patient is admitted. The payer answers with an estimate, judged against the policy and the beneficiary's history.

The estimate commits nobody. Nothing is reserved against the policy. When the patient is admitted, you still send a [preauthorisation](preauth-submit.md).

The request is a Claim bundle with `Claim.use` set to `predetermination`, on `/v1/predetermination/submit`. The answer is a ClaimResponse on `/v1/predetermination/on_submit`. [Preauthorisation or predetermination](../decisions/preauth-or-predetermination.md) compares the two.

## Before you start

- The payer answers predetermination requests. Confirm this with the payer before you build the exchange.
- You have the planned treatment: diagnosis, packages and the estimated amounts.
- Your session token, callback endpoint and the payer's certificate are in place, as in [send a sealed request](send-a-sealed-request.md).
- The sandbox [dummy payer](../sandbox/dummy-payer.md) does not answer predetermination. Test against a payer that does.

## What happens

```mermaid
sequenceDiagram
  participant P as Provider (your system)
  participant N as NHCX
  participant Y as Payer
  P->>N: POST /v1/predetermination/submit
  Note right of P: Claim.use predetermination, x-hcx-status request.initiated
  N-->>P: HTTP 202 Accepted
  N->>Y: POST /v1/predetermination/submit
  Y-->>N: HTTP 202 Accepted
  Note over Y: payer estimates against the policy and past history
  Y->>N: POST /v1/predetermination/on_submit
  N-->>Y: HTTP 202 Accepted
  N->>P: POST /v1/predetermination/on_submit
  P-->>N: HTTP 202 Accepted, within 30 seconds
  Note left of P: store the estimate, not an approval
```

1. Build a Claim bundle shaped like the preauthorisation bundle, as in [the claim request bundle](../fhir/claim-request.md). Set `Claim.use` to `predetermination`.
2. Give the Claim your own predetermination reference as its identifier. Add the planned items, diagnoses and amounts.
3. Seal and set the headers, as in [send a sealed request](send-a-sealed-request.md). Set `x-hcx-status` to `request.initiated`. No workflow code is published for predetermination.
4. Start a new correlation. Set `x-hcx-correlation_id` to the value of this call's `x-hcx-api_call_id`.
5. Call [POST /v1/predetermination/submit](../endpoints/predetermination-submit.md). NHCX answers `202 Accepted`. It is not the estimate.
6. Receive [POST /v1/predetermination/on_submit](../callbacks/predetermination-on-submit.md). Answer `202 Accepted` within 30 seconds, then process.
7. Read `type`. `ProtocolResponse` means the payer could not process the request. Otherwise decrypt `payload` with your private key.
8. Read the [ClaimResponse](../fhir/claim-response.md). Its `use` is `predetermination`. The estimated benefit is in `ClaimResponse.total`, category `benefit`.

## How you know it worked

The estimate is in when all of these hold:

- You received `POST /v1/predetermination/on_submit` whose `x-hcx-correlation_id` equals the one you sent.
- Its `type` is not `ProtocolResponse`, and `payload` decrypts with your private key.
- The ClaimResponse has `use` `predetermination` and a `total` with category `benefit`.
- You stored the amount against the planned case, labelled as an estimate.

## When it goes wrong

The 202 arrives and no estimate follows. The payer may not answer predetermination. Confirm support with the payer, then [check the request's status](status-check.md). See [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md).

NHCX rejects the call. [NHCX-1003](../errors/nhcx-1003.md) means the recipient code is not registered. [NHCX-1006](../errors/nhcx-1006.md) means the correlation id was used before.

The callback is a `ProtocolResponse`. [PAYR-1001](../errors/payr-1001.md) means the payer could not decrypt your request. Fetch its certificate again and reseal.

The estimate treated as an approval. A predetermination reserves nothing. Send a preauthorisation at admission, with workflow `12`.
