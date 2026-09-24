---
id: nhcx.test.tc-pa-01
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'TC-PA-01: Submit a preauthorisation'
summary: >-
  Check that your hospital system can submit a preauthorisation for a government
  scheme patient and see the payer take it into its workflow.
sources:
- url: https://hcxsbx.abdm.gov.in/images/4d333fa6ce5ef99920de.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Test Cases.xlsx
  hash: sha256:0d95021974cfe81ab2e3bf66f983228a70b8fed8d7d251eb6d7eeab7354ecad2
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Test Cases, row 31 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet1, row TC-PA-01.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. sheet Scenarios, row 6.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, rows 12, 20, 21, 23, 24.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 6, Table 6.2; page 19, Biometric Authentication.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 4-6, Q14 and Q21.
related:
  flows:
  - nhcx.flow.pmjay-patient-to-cashless
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.preauth-submit
  - nhcx.flow.biometric-fingerprint-iris
  - nhcx.flow.biometric-face
  concepts:
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.hmis-integration-architecture
  - nhcx.concept.workflow-codes
  - nhcx.concept.claim-cycle
  - nhcx.concept.biometric-authentication
  sandbox:
  - nhcx.sandbox.test-participants
  glossary:
  - nhcx.glossary.pmjay
  - nhcx.glossary.preauthorisation
  endpoints:
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.abha-biometric-auth-verify
  callbacks:
  - nhcx.callback.preauth-on-submit
  fhir:
  - nhcx.fhir.preauth-request
  - nhcx.fhir.preauth-response
  - nhcx.fhir.validation
  decisions:
  - nhcx.decision.biometric-modality
  tests:
  - nhcx.test.tc-ce-01
  - nhcx.test.tc-pa-02
  - nhcx.test.tc-cl-01
  - nhcx.test.provider-uc-07
  errors:
  - nhcx.error.payr-1201
  - nhcx.error.payr-1235
  - nhcx.error.payr-1254
  - nhcx.error.payr-1256
  - nhcx.error.payr-1272
  - nhcx.error.payr-1216
---

# TC-PA-01: Submit a preauthorisation

## In plain words

A [preauthorisation](../glossary/preauthorisation.md) asks the payer to approve treatment before it happens. Under [PMJAY](../glossary/pmjay.md) it is a Claim bundle with `use` `preauthorization`, sent through [NHCX](../../shared/glossary/nhcx.md). This test case submits one with a diagnosis, treatment plan, supporting documents and doctor details.

It passes when the payer acknowledges the case into its workflow.

## Before you start

- The test case pre-condition holds: eligibility successful. [TC-CE-01](tc-ce-01.md) passed for the package.
- The preauthorisation amount is no more than the balance remaining on the wallet.
- You have the treating doctor's [HPR](../../shared/glossary/hpr.md) ID.
- The beneficiary authenticated biometrically for this preauthorisation. It is mandatory before a PMJAY preauthorisation.

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
| API / FHIR Resource | /v1/preauth/submit (Claim) |
| Input Parameters | Diagnosis: `I10`, Treatment Plan, Support Documents. Doctor Details |

1. Build a Claim bundle with `use` `preauthorization`. See [the preauthorisation request bundle](../fhir/preauth-request.md). Set the diagnosis to `I10`. Add every billable item of the treatment plan and a claim identifier. Add the supporting documents as diagnostic report (`DIA`) and clinical document (`CD`). Name the practitioner by HPR ID.
2. Validate the bundle against the [NRCeS](../../shared/glossary/nrces.md) profiles, as [validating a bundle](../fhir/validation.md) describes.
3. Seal it as a [JWE](../glossary/jwe.md) with the PMJAY payer's public key.
4. Set the protected headers. `x-hcx-workflow_id` is `12` and `x-hcx-status` is `request.initiated`. Use a new `x-hcx-correlation_id`. Pass the biometric user token as a header parameter on the request. `x-hcx-recipient_code` is the payer's processing ID, and `x-hcx-ben-abha-id` carries the beneficiary's [ABHA](../../shared/glossary/abha.md) number.
5. Send it.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/preauth/submit' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"payload": "<JWE_COMPACT_STRING>"}'
```

6. NHCX answers with HTTP 202.
7. Wait for `POST /v1/preauth/on_submit` on your registered endpoint. Answer it with HTTP 202 within 30 seconds.
8. Decrypt the payload with your private key and read the payer's answer.

The path is described in full in [submit a preauthorisation](../flows/preauth-submit.md).

## How you know it worked

The pass criterion for TC-PA-01:

| Field | Value |
|---|---|
| Processing / validation rules | Validate clinical & financial rules |
| Expected output | Preauth ID generated, status=PENDING |
| Remarks | Sent to workflow |

What you observe:

- NHCX answers your request with HTTP 202.
- You receive `/v1/preauth/on_submit` with `x-hcx-workflow_id` `20` and `x-hcx-status` `response.partial`. Workflow `20` means the payer received and acknowledged the preauthorisation.
- Your system shows the case as pending until the decision arrives.
- The decision arrives later on the same path: `21` approved, `23` rejected or `24` queried.

## When it goes wrong

- **[PAYR-1201](../errors/payr-1201.md), invalid claimed amount.** The amount exceeds what the wallet allows. Keep it within the balance from [TC-ABHA-01](tc-abha-01.md).
- **[PAYR-1235](../errors/payr-1235.md), insufficient wallet balance.** The wallet cannot pay the preauthorisation.
- **A required questionnaire response is missing.** See [PAYR-1254](../errors/payr-1254.md) and [PAYR-1256](../errors/payr-1256.md). Answer what [TC-CE-01](tc-ce-01.md) listed.
- **[PAYR-1272](../errors/payr-1272.md), invalid biometric user token.** Authenticate the beneficiary again.
- **[PAYR-1216](../errors/payr-1216.md), a case is already in progress.** The beneficiary has an open preauthorisation.
- **The callback never arrives.** Your callback URL must use a domain name, not an IP address or port. It must run on an India-hosted server that allows the exchange's outbound addresses. See [callback URL requirements](../sandbox/callback-url-requirements.md) and [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md). Then ask where the request stands with [use case 13](provider-uc-13.md).
