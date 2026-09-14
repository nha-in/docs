---
id: nhcx.sandbox.sandbox-exit
type: sandbox
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The sandbox exit process and sign-off
summary: >-
  The use cases you must show working, the bundle review, the two demonstrations
  and the sign-off that let you move from testing to live claims.
sources:
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use cases 1-13.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use cases 1-15 and response validations.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications.md
  hash: sha256:56234dd8a55fe4eb9dd852779b22b522b04760c9bec5c263d5e9bc3ac2c6f167
  fetched: '2026-09-14'
  note: Site page /domain-specifications, text as shown on the site. NHCX Sandbox Process, Step 3.
- url: https://hcxsbx.abdm.gov.in/#/introduction-NHCX/guidlines-for-participant-onboarding
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/introduction-NHCX__guidlines-for-participant-onboarding.md
  hash: sha256:58aaa762f2a04565e2060658b0eda95e3cac4cbb0819b6d865f04cf53066680d
  fetched: '2026-09-14'
  note: Site page /introduction-NHCX/guidlines-for-participant-onboarding, text as shown on the site. Step 3 Sandbox certification.
verified:
  status: unverified
related:
  sandbox:
  - nhcx.sandbox.going-live
  - nhcx.sandbox.dummy-payer
  - nhcx.sandbox.support-contacts
  - nhcx.sandbox.test-participants
  fhir:
  - nhcx.fhir.validation
  concepts:
  - nhcx.concept.message-identifiers
  - nhcx.concept.four-message-legs
  tests:
  - nhcx.test.provider-uc-01
  - nhcx.test.provider-uc-05
  - nhcx.test.provider-uc-07
  - nhcx.test.provider-uc-09
  - nhcx.test.provider-uc-13
  - nhcx.test.payer-uc-01
  - nhcx.test.payer-uc-07
  - nhcx.test.payer-uc-15
  glossary:
  - nhcx.glossary.sandbox-exit
  - shared.glossary.nrces
  - nhcx.glossary.irdai
  - shared.glossary.nha
---

# The sandbox exit process and sign-off

## In plain words

[Sandbox exit](../glossary/sandbox-exit.md) is how you prove your system works before it handles live claims. You run a fixed set of use cases for your role, send sample bundles for review, and show your system in two demonstrations.

When all of that passes, [NHA](../../shared/glossary/nha.md) confirms your sandbox integration by email. That confirmation opens the way to production.

## Before you start

- You are a registered sandbox participant. See [what you need before you register](prerequisites.md).
- Your callback URL receives deliveries. See [callback URL rules](callback-url-requirements.md).
- You can run the provider use cases against the [dummy payer](dummy-payer.md).

## What happens

### 1. Run every use case for your role

| # | Provider use case | You call | You receive |
|---|---|---|---|
| 1 | Get participant list | `/fetch/participants/list` | |
| 2 | Get policy | `/participant/get/policies` | |
| 3 | Get public key | `/fetch/certs` | |
| 4 | Get the auth token | `/get/session` | |
| 5 | Coverage eligibility | `/v1/coverageeligibility/check` | `/v1/coverageeligibility/on_check` |
| 6 | Insurance plan | `/v1/insuranceplan/request` | `/v1/insuranceplan/on_request` |
| 7 | Preauthorisation | `/v1/preauth/submit` | `/v1/preauth/on_submit` |
| 8 | Answer a communication request | `/v1/communication/on_request` | `/v1/communication/request` |
| 9 | Claim | `/v1/claim/submit` | `/v1/claim/on_submit` |
| 10 | Claim search | `/v1/search/submit` | `/v1/search/on_submit` |
| 11 | Acknowledge a payment notice | `/v1/paymentnotice/on_request` | `/v1/paymentnotice/request` |
| 12 | Reprocess or cancel | `/v1/task/submit` | `/v1/task/on_submit` |
| 13 | Status | `/v1/status` | `/v1/on_status` |

A payer runs 15 use cases. Six are registry and utility calls: link, fetch and de-link ABHA policies, the participant list, the public key and the auth token. Six answer requests: eligibility, insurance plan, preauthorisation, claim, search and task. The last three raise a communication request, send a payment notice and check status.

### 2. Meet the checks on every response

- Validate each payload against the NRCeS profiles.
- Use different values for `x-hcx-api_call_id` and `x-hcx-correlation_id`.
- Set the response's correlation id to the API call id of the request you answer.
- Address the response to the sender of the request.
- Send an encrypted payload when you processed the request. Send a `ProtocolResponse` when you could not, for example when the payload was invalid or would not decrypt.

### 3. Send bundles for review

Email sample FHIR bundles to `hcx.integration@nha.gov.in`. The NRCeS team validates them.

### 4. Demonstrate

1. **Internal demo.** The NHA team checks your use cases.
2. **HTC demo.** A demonstration to the Health Tech Committee, run by the NRCeS, IRDAI, TCS and NHA teams.

Request each demo by email to `hcx.integration@nha.gov.in`. Additional security testing, such as STQC or CERT-IN review, can be required.

### 5. Receive sign-off

After the demos and the bundle review pass, NHA sends a communication confirming your successful integration on the NHCX sandbox.

## How you know it worked

You hold the email from NHA confirming successful integration on the NHCX sandbox. Keep it: production access is set up after it.

## When it goes wrong

- **You are waiting for a demo date or for bundle review results.** Demos are scheduled after your email request, and the reviews have no fixed turnaround time. Keep testing the remaining use cases meanwhile. Follow up on the same email thread, not with a new request.
- **The bundle review sends back findings.** Fix each one, run the validator again, and resend. See [validating a bundle](../fhir/validation.md).
- **A use case fails in the demo.** Rerun it against the [dummy payer](dummy-payer.md) until the callback arrives and passes the response checks, then ask for a new slot.
- **A response is rejected for its ids.** The response's correlation id must equal the request's API call id, and its API call id must be new.
