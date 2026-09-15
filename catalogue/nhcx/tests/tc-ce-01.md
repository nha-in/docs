---
id: nhcx.test.tc-ce-01
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'TC-CE-01: Coverage eligibility with auth requirements'
summary: >-
  Check that your hospital system can confirm a chosen package is covered and affordable,
  before it asks for preauthorisation.
sources:
- url: https://hcxsbx.abdm.gov.in/images/4d333fa6ce5ef99920de.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Test Cases.xlsx
  hash: sha256:0d95021974cfe81ab2e3bf66f983228a70b8fed8d7d251eb6d7eeab7354ecad2
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Test Cases, row 31 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet1, row TC-CE-01.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 7.3, 7.4 and 7.6.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. sheet Scenarios, row 5.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 19, Biometric Authentication.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 4-6, Q14 and Q21.
verified:
  status: unverified
related:
  flows:
  - nhcx.flow.pmjay-patient-to-cashless
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.coverage-eligibility-check
  - nhcx.flow.biometric-fingerprint-iris
  - nhcx.flow.biometric-face
  concepts:
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.hmis-integration-architecture
  - nhcx.concept.workflow-codes
  - nhcx.concept.coverage-eligibility-purposes
  - nhcx.concept.biometric-authentication
  sandbox:
  - nhcx.sandbox.test-participants
  glossary:
  - nhcx.glossary.pmjay
  - nhcx.glossary.coverage-eligibility
  endpoints:
  - nhcx.endpoint.coverageeligibility-check
  callbacks:
  - nhcx.callback.coverageeligibility-on-check
  fhir:
  - nhcx.fhir.coverage-eligibility-request
  - nhcx.fhir.coverage-eligibility-response
  - nhcx.fhir.validation
  decisions:
  - nhcx.decision.eligibility-purpose
  tests:
  - nhcx.test.tc-abha-01
  - nhcx.test.tc-hbp-01
  - nhcx.test.tc-pa-01
  errors:
  - nhcx.error.payr-1032
  - nhcx.error.payr-1033
  - nhcx.error.payr-1008
  - nhcx.error.payr-1111
  - nhcx.error.payr-1114
  - nhcx.error.payr-1272
---

# TC-CE-01: Coverage eligibility with auth requirements

## In plain words

Before a [PMJAY](../glossary/pmjay.md) preauthorisation, your [HMIS](../../shared/glossary/hmis.md) asks the payer about the exact package it plans to treat. The coverage eligibility purpose `auth-requirements` returns whether the package is covered at your hospital. It also lists the questionnaires and documents the preauthorisation needs.

This test case checks a package the wallet can afford.

## Before you start

- The test case pre-condition holds: wallet available. [TC-ABHA-01](tc-abha-01.md) returned an available balance.
- You chose the package from the plan in [TC-HBP-01](tc-hbp-01.md).
- You hold a valid biometric user token for the beneficiary.

```precondition
human: true
who: the beneficiary, present at the hospital, and your front desk operator
action: If the user token has expired, authenticate the beneficiary again by fingerprint, iris or face.
```

- Your provider sandbox basics pass. You hold a session token ([use case 4](provider-uc-04.md)) and the payer's certificate ([use case 3](provider-uc-03.md)). Your callback endpoint works ([use case 5](provider-uc-05.md)).
- You address the PMJAY payer by the processing ID from [use case 2](provider-uc-02.md).

## What happens

| Test case field | Value |
|---|---|
| API / FHIR Resource | CoverageEligibilityRequest (auth-requirements) |
| Input Parameters | Amount: `25000`, Package: `HBP-123` |

1. Build a CoverageEligibilityRequest bundle with `purpose` `auth-requirements`. Add the package as an item: this purpose requires items. See [the request bundle](../fhir/coverage-eligibility-request.md).
2. Validate the bundle against the [NRCeS](../../shared/glossary/nrces.md) profiles, as [validating a bundle](../fhir/validation.md) describes.
3. Seal it as a [JWE](../glossary/jwe.md) with the PMJAY payer's public key.
4. Set the protected headers. `x-hcx-status` is `request.initiated`. Pass the biometric user token as a header parameter on the request. `x-hcx-recipient_code` is the payer's processing ID, and `x-hcx-ben-abha-id` carries the beneficiary's [ABHA](../../shared/glossary/abha.md) number.
5. Send it.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/coverageeligibility/check' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"payload": "<JWE_COMPACT_STRING>"}'
```

6. [NHCX](../../shared/glossary/nhcx.md) answers with HTTP 202.
7. Wait for `POST /v1/coverageeligibility/on_check` on your registered endpoint. Answer it with HTTP 202 within 30 seconds.
8. Decrypt the payload with your private key and read the CoverageEligibilityResponse.

## How you know it worked

The pass criterion for TC-CE-01:

| Field | Value |
|---|---|
| Processing / validation rules | Check wallet balance and speciality rules |
| Expected output | Eligible, balance sufficient |
| Remarks | Preauth allowed |

What you observe:

- The decrypted CoverageEligibilityResponse carries `outcome` `complete`, and `insurance[*].inforce` is `true`.
- The item for `HBP-123` is not marked `excluded`.
- `authorizationRequired` and `authorizationSupporting` list what the preauthorisation needs.
- The available balance from [TC-ABHA-01](tc-abha-01.md) is at least `25000`, and no insufficient coverage error comes back.

## When it goes wrong

- **[PAYR-1033](../errors/payr-1033.md), no items for the purpose.** `auth-requirements` needs the package as an item.
- **[PAYR-1032](../errors/payr-1032.md), invalid purpose.** Send `auth-requirements` exactly.
- **[PAYR-1008](../errors/payr-1008.md), coverage amount insufficient.** The wallet cannot pay the amount. The case fails the test.
- **A rule or speciality failure.** See [PAYR-1111](../errors/payr-1111.md) and [PAYR-1114](../errors/payr-1114.md). Use the speciality code the plan gives for the package.
- **[PAYR-1272](../errors/payr-1272.md), invalid biometric user token.** Authenticate the beneficiary again.
- **The callback never arrives.** Your callback URL must use a domain name, not an IP address or port. It must run on an India-hosted server that allows the exchange's outbound addresses. See [callback URL requirements](../sandbox/callback-url-requirements.md) and [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md). Then ask where the request stands with [use case 13](provider-uc-13.md).
