---
id: nhcx.flow.pmjay-patient-to-cashless
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Take a PMJAY patient from registration to cashless treatment
summary: >-
  Take a PMJAY patient from registration to an approved preauthorisation: find the
  payer and policy, fetch the plan, check eligibility, authenticate, then submit.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Chapter I and II; 5.5 payer search; 5.6 identifier cascade; admission layers table.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet Scenarios, rows 1 to 6.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, item 7.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. FAQ 27 question 4.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1.
related:
  endpoints:
  - nhcx.endpoint.get-session
  - nhcx.endpoint.fetch-participants-list
  - nhcx.endpoint.participant-get-policies
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.insuranceplan-request
  - nhcx.endpoint.insuranceplan-on-request
  - nhcx.endpoint.coverageeligibility-check
  - nhcx.endpoint.coverageeligibility-on-check
  - nhcx.endpoint.abha-biometric-auth-init
  - nhcx.endpoint.abha-biometric-auth-verify
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.preauth-on-submit
  callbacks:
  - nhcx.callback.insuranceplan-on-request
  - nhcx.callback.coverageeligibility-on-check
  - nhcx.callback.preauth-on-submit
  concepts:
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.hmis-integration-architecture
  - nhcx.concept.policy-linking
  - nhcx.concept.biometric-authentication
  - nhcx.concept.claim-cycle
  - nhcx.concept.session-token
  flows:
  - nhcx.flow.pmjay-hospital-migration
  - nhcx.flow.claim-submit
  - nhcx.flow.biometric-face
  - nhcx.flow.biometric-fingerprint-iris
  - nhcx.flow.coverage-eligibility-check
  - nhcx.flow.insurance-plan-request
  - nhcx.flow.preauth-query-response
  - nhcx.flow.preauth-submit
  tests:
  - nhcx.test.tc-abha-01
  - nhcx.test.tc-hbp-01
  - nhcx.test.tc-ce-01
  - nhcx.test.tc-pa-01
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.payr-1004
  - nhcx.error.payr-1256
  - nhcx.error.payr-1401
  - nhcx.error.payr-1405
  glossary:
  - nhcx.glossary.pmjay
  - nhcx.glossary.tpa
  - shared.glossary.abha-number
  - shared.glossary.hfr
  - shared.glossary.hmis
  - shared.glossary.nhcx
  troubleshooting:
  - nhcx.troubleshooting.everything-returns-401
---

# Take a PMJAY patient from registration to cashless treatment

## In plain words

A [PMJAY](../glossary/pmjay.md) patient does not become cashless because they hold a card. Your hospital must first find the payer, confirm the linked policy, and learn the plan's rules. Only then can you check eligibility and ask for preauthorisation.

Two things must both be true. In your [HMIS](../../shared/glossary/hmis.md), the admission is converted from cash to insurance, with the scheme, payer, identifier and policy number attached. For the [NHCX](../../shared/glossary/nhcx.md) exchange, you have resolved the payer's code, the policy and the member ID.

The order is fixed: find the payer, find the policy, resolve the codes, fetch the plan, check eligibility, authenticate, submit the preauthorisation. [PMJAY on NHCX](../concepts/pmjay-on-nhcx.md) explains how PMJAY differs from the standard exchange.

## Before you start

- Your hospital is migrated to HMIS through NHCX and mapped to its PMJAY hospital ID. See [migrate a PMJAY hospital](pmjay-hospital-migration.md).
- You hold your client credentials and can get a [session token](../concepts/session-token.md) from [/get/session](../endpoints/get-session.md).
- Your callback endpoint is registered and answers within 30 seconds.
- The patient is present, with their [ABHA number](../../shared/glossary/abha-number.md), member ID or registered mobile number.
- Your HMIS supports all three biometric methods: fingerprint, iris and face.

## What happens

```mermaid
sequenceDiagram
  participant Pt as Patient
  participant H as HMIS (your system)
  participant N as NHCX
  participant Y as Payer
  Pt->>H: registers, gives ABHA number, member ID or mobile
  H->>N: POST /fetch/participants/list (role PAYER)
  N-->>H: payer list
  H->>N: POST /participant/get/policies
  N-->>H: linked policies with payerid and processingid
  H->>N: POST /fetch/certs
  N-->>H: recipient certificate
  H->>N: POST /v1/insuranceplan/request
  N-->>H: HTTP 202 Accepted
  N->>Y: POST /v1/insuranceplan/request
  Y->>N: POST /v1/insuranceplan/on_request
  N->>H: POST /v1/insuranceplan/on_request
  H->>N: POST /v1/coverageeligibility/check (validation, then auth-requirements)
  N-->>H: HTTP 202 Accepted
  N->>Y: POST /v1/coverageeligibility/check
  Y->>N: POST /v1/coverageeligibility/on_check
  N->>H: POST /v1/coverageeligibility/on_check
  Pt->>H: biometric capture
  H->>N: POST /hcx/abha/biometric/auth/init, then auth/verify
  N-->>H: authentication result
  H->>N: POST /v1/preauth/submit (workflow 12)
  N-->>H: HTTP 202 Accepted
  N->>Y: POST /v1/preauth/submit
  Y->>N: POST /v1/preauth/on_submit
  N->>H: POST /v1/preauth/on_submit (approval, query or rejection)
  H-->>Pt: cashless treatment confirmed
```

Every exchange call is acknowledged with `202 Accepted`. Its answer arrives later on your callback, which you acknowledge with `202` within 30 seconds.

1. Register the patient. In your HMIS, convert the admission from cash to insurance, with the scheme, payer, identifier type and value, and policy number.
2. Find the payer. Call [POST /fetch/participants/list](../endpoints/fetch-participants-list.md) with role `PAYER`, and let the user pick one.
3. Find the linked policies. Call [POST /participant/get/policies](../endpoints/participant-get-policies.md). Try the ABHA number first, then the member ID, then the mobile number.
4. If no policy comes back, send a [coverage eligibility check](coverage-eligibility-check.md) with purpose `discovery` to get the active policy code.
5. Resolve three values: the policy number, the member ID and the recipient code. Use the `processingid` from the policy lookup as `x-hcx-recipient_code`, not the `payerid`.
6. If you cannot resolve a recipient code, stop. Do not send eligibility or preauthorisation until the policy lookup succeeds.
7. Fetch the recipient's certificate with [POST /fetch/certs](../endpoints/fetch-certs.md).
8. [Request the insurance plan](insurance-plan-request.md) and cache it. It holds the packages, rates, conditions and document rules.
9. [Check coverage eligibility](coverage-eligibility-check.md). Use `validation` after registration for the wallet balance. Use `benefits` before the preauthorisation, and `auth-requirements` once the packages are chosen.
10. Authenticate the beneficiary by [fingerprint or iris](biometric-fingerprint-iris.md) or [face](biometric-face.md). Where that is not possible, complete the Authentication Consent Questionnaire.
11. [Submit the preauthorisation](preauth-submit.md) with workflow `12`, for no more than the balance left.

## How you know it worked

The patient is cashless when all of these hold:

- The admission in your HMIS is marked insurance, with the scheme, payer, member ID and policy number.
- You stored the recipient code, from the policy lookup's `processingid`, against the admission.
- The insurance plan and the eligibility responses are stored against the admission.
- You received `POST /v1/preauth/on_submit` with `x-hcx-workflow_id` `21`, and stored its `preAuthRef`.

A preauthorisation query, workflow `24`, hands over to [answer a payer query](preauth-query-response.md). A rejection, workflow `23`, ends the cashless path for this admission.

## When it goes wrong

The policy lookup returns nothing. Try the next identifier in the order ABHA number, member ID, mobile number. Then use eligibility with purpose `discovery`. See [linking an ABHA to a policy](../concepts/policy-linking.md).

The request goes to the wrong participant. The `payerid` names the insurer. The `processingid` names who adjudicates, the [TPA](../glossary/tpa.md) where there is one. Address every request to the `processingid`.

The payer refuses the policy or your hospital. [PAYR-1401](../errors/payr-1401.md) means the policy is not allowed for your hospital. [PAYR-1405](../errors/payr-1405.md) means the payer has no enrolled hospital for your [HFR](../../shared/glossary/hfr.md) ID. [PAYR-1004](../errors/payr-1004.md) from a payer on the published standard means your hospital is not registered for this policy.

Authentication is missing. [PAYR-1256](../errors/payr-1256.md) means the preauthorisation carried neither biometric authentication nor the consent questionnaire response.

Every call returns 401. [NHCX-401](../errors/nhcx-401.md) means your session token is missing or expired. Get a new one and retry. See [every NHCX call returns 401](../troubleshooting/everything-returns-401.md).
