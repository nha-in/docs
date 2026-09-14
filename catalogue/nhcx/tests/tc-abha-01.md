---
id: nhcx.test.tc-abha-01
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'TC-ABHA-01: Validate PMJAY policy using ABHA'
summary: >-
  Check that your hospital system can confirm a government scheme patient's policy
  is active, using their health account number.
sources:
- url: https://hcxsbx.abdm.gov.in/images/4d333fa6ce5ef99920de.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Test Cases.xlsx
  hash: sha256:0d95021974cfe81ab2e3bf66f983228a70b8fed8d7d251eb6d7eeab7354ecad2
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Test Cases, row 31 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet1, row TC-ABHA-01.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 7.3, 7.4 and 7.6.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 19, Biometric Authentication; page 26, 8.3.1 Validation.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. sheet Scenarios, row 3.
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
  endpoints:
  - nhcx.endpoint.coverageeligibility-check
  - nhcx.endpoint.participant-get-policies
  - nhcx.endpoint.abha-biometric-auth-init
  - nhcx.endpoint.abha-biometric-auth-verify
  callbacks:
  - nhcx.callback.coverageeligibility-on-check
  fhir:
  - nhcx.fhir.coverage-eligibility-request
  - nhcx.fhir.coverage-eligibility-response
  - nhcx.fhir.validation
  decisions:
  - nhcx.decision.eligibility-purpose
  - nhcx.decision.biometric-modality
  tests:
  - nhcx.test.provider-uc-02
  - nhcx.test.provider-uc-05
  - nhcx.test.tc-hbp-01
  - nhcx.test.tc-ce-01
  errors:
  - nhcx.error.nhcx-1018
  - nhcx.error.payr-1005
  - nhcx.error.payr-1123
  - nhcx.error.payr-1006
  - nhcx.error.payr-1007
  - nhcx.error.payr-1101
  - nhcx.error.payr-1272
---

# TC-ABHA-01: Validate PMJAY policy using ABHA

## In plain words

This test case checks the first exchange of a [PMJAY](../glossary/pmjay.md) admission. Your [HMIS](../../shared/glossary/hmis.md) sends a coverage eligibility request with purpose `validation` for the patient's [ABHA](../../shared/glossary/abha.md) number. The payer answers on your callback with the patient's cover and wallet position.

It is the happy path: a linked ABHA number and an active policy.

## Before you start

- The test case pre-condition holds: valid ABHA, consent available.
- The beneficiary's ABHA number is linked to their PMJAY policy. [Use case 2](provider-uc-02.md) returns the policy.
- The beneficiary is authenticated, or has a signed exemption consent on record. See [fingerprint or iris authentication](../flows/biometric-fingerprint-iris.md) and [face authentication](../flows/biometric-face.md).

```precondition
human: true
who: the beneficiary, present at the hospital, and your front desk operator
action: Authenticate the beneficiary by fingerprint, iris or face. Keep the user token it returns.
valid_for: 30 minutes. Refresh it automatically until the transaction cycle ends.
fallback: Where biometric authentication is not feasible, record an Aadhaar exemption consent signed by the beneficiary and a hospital representative.
```

- Your provider sandbox basics pass. You hold a session token ([use case 4](provider-uc-04.md)) and the payer's certificate ([use case 3](provider-uc-03.md)). Your callback endpoint works ([use case 5](provider-uc-05.md)).
- You address the PMJAY payer by the processing ID from [use case 2](provider-uc-02.md).

## What happens

| Test case field | Value |
|---|---|
| API / FHIR Resource | CoverageEligibilityRequest (validation) |
| Input Parameters | ABHA: `91-XXXX-XXXX-XXXX`, Purpose: `validation` |

1. Build a CoverageEligibilityRequest bundle with `purpose` `validation`. Include the PMJAY member ID or ABHA number, the active Coverage, the provider and insurer Organizations, and a PractitionerRole as enterer. See [the request bundle](../fhir/coverage-eligibility-request.md).
2. Validate the bundle against the [NRCeS](../../shared/glossary/nrces.md) profiles, as [validating a bundle](../fhir/validation.md) describes.
3. Seal it as a [JWE](../glossary/jwe.md) with the PMJAY payer's public key.
4. Set the protected headers. `x-hcx-status` is `request.initiated`. Pass the biometric user token as a header parameter on the request. `x-hcx-recipient_code` is the payer's processing ID, and `x-hcx-ben-abha-id` carries the beneficiary's ABHA number.
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

The pass criterion for TC-ABHA-01:

| Field | Value |
|---|---|
| Processing / validation rules | Check ABHA linkage and active policy |
| Expected output | CoverageEligibilityResponse with active coverage |
| Remarks | Happy path |

What you observe:

- NHCX answers your request with HTTP 202, and `/v1/coverageeligibility/on_check` arrives with a sealed payload.
- The decrypted CoverageEligibilityResponse carries `outcome` `complete`.
- `insurance[*].inforce` is `true`, and `disposition` reads as in force, for example `Policy is currently in-force`.
- The response gives the wallet position: used amount, available balance and wallet liability.

## When it goes wrong

- **[NHCX-1018](../errors/nhcx-1018.md), invalid ABHA number.** The exchange rejects the number's format in the header.
- **The beneficiary is not covered.** See [PAYR-1005](../errors/payr-1005.md) and [PAYR-1123](../errors/payr-1123.md). Check the ABHA number against the linked policy.
- **The policy does not exist or has expired.** See [PAYR-1006](../errors/payr-1006.md) and [PAYR-1007](../errors/payr-1007.md).
- **[PAYR-1101](../errors/payr-1101.md), invalid purpose.** Send `validation` exactly, in lower case.
- **[PAYR-1272](../errors/payr-1272.md), invalid biometric user token.** The token expired or failed. Authenticate the beneficiary again, or use the Authentication Consent questionnaire.
- **The callback never arrives.** Your callback URL must use a domain name, not an IP address or port. It must run on an India-hosted server that allows the exchange's outbound addresses. See [callback URL requirements](../sandbox/callback-url-requirements.md) and [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md). Then ask where the request stands with [use case 13](provider-uc-13.md).
