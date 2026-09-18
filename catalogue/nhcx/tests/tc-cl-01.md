---
id: nhcx.test.tc-cl-01
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'TC-CL-01: Submit the claim after discharge'
summary: >-
  Check that your hospital system can submit the final claim after a government
  scheme patient leaves, and see the payer accept it for adjudication.
sources:
- url: https://hcxsbx.abdm.gov.in/images/4d333fa6ce5ef99920de.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Test Cases.xlsx
  hash: sha256:0d95021974cfe81ab2e3bf66f983228a70b8fed8d7d251eb6d7eeab7354ecad2
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Test Cases, row 31 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet1, row TC-CL-01.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, rows 15, 21, 25, 26, 28, 29.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 9 claims workflow, PMJAY exception and Stage 2.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 11-12, section 25 Q3 and Q7; pages 4-6, Q14 and Q21.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. sheet Scenarios, row 10.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 19, Biometric Authentication; page 35, Claim.
related:
  flows:
  - nhcx.flow.pmjay-patient-to-cashless
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.claim-submit
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
  - nhcx.glossary.claim
  endpoints:
  - nhcx.endpoint.claim-submit
  callbacks:
  - nhcx.callback.claim-on-submit
  fhir:
  - nhcx.fhir.claim-request
  - nhcx.fhir.claim-response
  - nhcx.fhir.validation
  decisions:
  - nhcx.decision.biometric-modality
  tests:
  - nhcx.test.tc-pa-01
  - nhcx.test.tc-cl-02
  - nhcx.test.provider-uc-09
  errors:
  - nhcx.error.payr-1302
  - nhcx.error.payr-1301
  - nhcx.error.payr-1012
  - nhcx.error.payr-1357
  - nhcx.error.payr-1363
  - nhcx.error.payr-1366
  - nhcx.error.payr-1095
---

# TC-CL-01: Submit the claim after discharge

## In plain words

Under [PMJAY](../glossary/pmjay.md), discharge and claim are one submission. After the patient leaves, your [HMIS](../../shared/glossary/hmis.md) submits a Claim bundle with `use` `claim` through [NHCX](../../shared/glossary/nhcx.md). It carries the final amount, within the approved amount, and the discharge documents.

This test case checks the payer accepts the claim for adjudication.

## Before you start

- The test case pre-condition holds: preauth approved. You received `/v1/preauth/on_submit` with `x-hcx-workflow_id` `21`, and you hold its `preAuthRef`.
- No claim has been raised for this case yet.
- You have the documents the plan requires at claim, from [TC-HBP-01](tc-hbp-01.md).
- The beneficiary authenticated at discharge.

```precondition
human: true
who: the beneficiary, present at discharge, and your front desk operator
action: Authenticate the beneficiary by fingerprint, iris or face at discharge. Keep the user token it returns.
fallback: Send the Authentication Consent questionnaire response in the claim instead, when biometric authentication fails.
```

- Your provider sandbox basics pass. You hold a session token ([use case 4](provider-uc-04.md)) and the payer's certificate ([use case 3](provider-uc-03.md)). Your callback endpoint works ([use case 5](provider-uc-05.md)).
- You address the PMJAY payer by the processing ID from [use case 2](provider-uc-02.md).

## What happens

| Test case field | Value |
|---|---|
| API / FHIR Resource | /claim/submit (Claim) |
| Input Parameters | ApprovedAmount: `23000`, Docs attached |

1. Build a Claim bundle with `use` `claim`. See [the claim request bundle](../fhir/claim-request.md). Reuse the preauthorisation's claim identifier, or reference its `preAuthRef`. Keep the claimed amount within the approved `23000`. Put the discharge details in `supportingInfo` with category `DIS`, and attach the documents.
2. Validate the bundle against the [NRCeS](../../shared/glossary/nrces.md) profiles, as [validating a bundle](../fhir/validation.md) describes.
3. Seal it as a [JWE](../glossary/jwe.md) with the PMJAY payer's public key.
4. Set the protected headers. `x-hcx-workflow_id` is `15` and `x-hcx-status` is `request.initiated`. Pass the discharge user token as a header parameter on the request. `x-hcx-recipient_code` is the payer's processing ID, and `x-hcx-ben-abha-id` carries the beneficiary's [ABHA](../../shared/glossary/abha.md) number.
5. Send it.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/claim/submit' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"payload": "<JWE_COMPACT_STRING>"}'
```

6. NHCX answers with HTTP 202.
7. Wait for `POST /v1/claim/on_submit` on your registered endpoint. Answer it with HTTP 202 within 30 seconds.
8. Decrypt the payload with your private key and read the payer's answer.

The path is described in full in [submit a claim after discharge](../flows/claim-submit.md).

## How you know it worked

The pass criterion for TC-CL-01:

| Field | Value |
|---|---|
| Processing / validation rules | Match preauth & treatment details |
| Expected output | Claim accepted for adjudication |
| Remarks | Sent to workflow |

What you observe:

- NHCX answers your request with HTTP 202.
- You receive `/v1/claim/on_submit` with `x-hcx-workflow_id` `25` and `x-hcx-status` `response.partial`. Workflow `25` means the payer received the claim.
- Further `response.partial` updates may follow, such as `28` in process and `29` forwarded.
- The decision arrives with `response.complete`, for example `26` approved.

## When it goes wrong

- **[PAYR-1302](../errors/payr-1302.md), no approved preauthorisation.** Wait for workflow `21` before you claim.
- **[PAYR-1301](../errors/payr-1301.md), claim already raised.** A case takes one claim.
- **[PAYR-1012](../errors/payr-1012.md), claim above the approved amount.** Keep the claim within `23000`.
- **Discharge data is wrong.** See [PAYR-1357](../errors/payr-1357.md) and [PAYR-1095](../errors/payr-1095.md). Admission must not fall after discharge.
- **The discharge authentication is missing or invalid.** See [PAYR-1363](../errors/payr-1363.md) and [PAYR-1366](../errors/payr-1366.md). Authenticate again, or send the Authentication Consent questionnaire response.
- **The callback never arrives.** Your callback URL must use a domain name, not an IP address or port. It must run on an India-hosted server that allows the exchange's outbound addresses. See [callback URL requirements](../sandbox/callback-url-requirements.md) and [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md). Then ask where the request stands with [use case 13](provider-uc-13.md).
