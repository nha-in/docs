---
id: nhcx.decision.preauth-or-predetermination
type: decision
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Preauthorisation or predetermination
summary: >-
  Ask the payer to approve planned treatment with a preauthorisation, and use a
  predetermination only as an optional preview.
sources:
- url: https://hcxsbx.abdm.gov.in/images/af8d243edcc2139a515d.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Usecases.pdf
  hash: sha256:8709b2907a0d5a0dbb36f5e63ed8deae269e0c75372b05d71ce7380c8a0929e7
  fetched: '2026-09-14'
  note: NHCX Usecases, row 1 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use case table, Preauth and Predetermination rows.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. API Structure table.
- url: https://hcxsbx.abdm.gov.in/images/2c3fbb4e6b09f0834f69.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Implementation Guide for Adoption of FHIR in ABDM and NHCX.pdf
  hash: sha256:549377c9c26b1bd23decac3a1b9e5ebedfdc8e0fe99e53ef733859b188f51366
  fetched: '2026-09-14'
  note: Implementation Guide for Adoption of FHIR in ABDM and NHCX, row 14 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. API table rows 5-6.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1 use case list.
- url: https://hcxsbx.abdm.gov.in/images/b6bd99dab49a5e928ea3.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Overview.pdf
  hash: sha256:c95469758a25cb8aca8c47757d8b18b4dedb8b4d42669663cff7343205f77fda
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Overview, row 27 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Page 8 flow table.
related:
  concepts:
  - nhcx.concept.claim-cycle
  flows:
  - nhcx.flow.preauth-submit
  - nhcx.flow.predetermination
  - nhcx.flow.preauth-query-response
  endpoints:
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.predetermination-submit
  fhir:
  - nhcx.fhir.preauth-request
  errors:
  - nhcx.error.payr-1010
  decisions:
  - nhcx.decision.eligibility-purpose
  glossary:
  - nhcx.glossary.preauthorisation
  - nhcx.glossary.predetermination
---

# Preauthorisation or predetermination

## In plain words

Before planned treatment, a provider can ask a payer about it over [NHCX](../../shared/glossary/nhcx.md) in two ways. A [preauthorisation](../glossary/preauthorisation.md) asks the payer to approve the treatment. A [predetermination](../glossary/predetermination.md) asks the payer to adjudicate the planned claim in advance, against the policy and the beneficiary's past history.

Send a preauthorisation. Send a predetermination only to a payer that answers them, when you want that preview first.

## Before you start

- You have run coverage eligibility with `auth-requirements`. See [which coverage eligibility purpose to send](../decisions/eligibility-purpose.md).
- You have read [the claim cycle from eligibility to payment](../concepts/claim-cycle.md).

## What happens

| | Preauthorisation | Predetermination |
|---|---|---|
| Request | [`POST /v1/preauth/submit`](../endpoints/preauth-submit.md) | [`POST /v1/predetermination/submit`](../endpoints/predetermination-submit.md) |
| Answer arrives on | `/v1/preauth/on_submit` | `/v1/predetermination/on_submit` |
| Payload | Claim bundle whose `use` marks a preauthorisation | Claim bundle whose `use` marks a predetermination |
| Payer's answer | A ClaimResponse approving, rejecting or querying the request | A ClaimResponse with auto adjudication details against the policy and past history |
| Sandbox dummy payer | Answers it | Not among its use cases |
| [PMJAY](../glossary/pmjay.md) | Part of the flow, after biometric authentication | Not part of the flow |

The default is preauthorisation. It is the request a payer approves before treatment. It is in the PMJAY flow, and the sandbox dummy payer answers it, so you can test it end to end. Use predetermination when a payer offers it and you want an adjudication preview before you commit to a preauthorisation.

## How you know it worked

- The payer answers your preauthorisation on `/v1/preauth/on_submit` with a ClaimResponse.
- Where you use predetermination, the payer answers on `/v1/predetermination/on_submit`, and you still send the preauthorisation afterwards.

## When it goes wrong

The two share the Claim bundle, so switching is a change of path and `use`. Start the new request with a new correlation id; nothing carries over between the two cycles.

- A predetermination gets no answer: confirm that the payer handles predeterminations. Then see [the request was accepted with 202 and no callback arrives](../troubleshooting/accepted-then-no-callback.md).
- The preauthorisation comes back queried: send a query response, not a resubmission. See [answer a payer query on a preauthorisation](../flows/preauth-query-response.md).
- The claim is refused with `PAYR-1010`, preauthorisation required but not obtained. See [PAYR-1010](../errors/payr-1010.md).
