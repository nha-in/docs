---
id: nhcx.test.tc-pa-02
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'TC-PA-02: Submit a preauthorisation query update'
summary: >-
  Check that your hospital system can answer a payer's query on a preauthorisation
  with more documents, and see the payer accept the answer.
sources:
- url: https://hcxsbx.abdm.gov.in/images/4d333fa6ce5ef99920de.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Test Cases.xlsx
  hash: sha256:0d95021974cfe81ab2e3bf66f983228a70b8fed8d7d251eb6d7eeab7354ecad2
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Test Cases, row 31 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet1, row TC-PA-02.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. sheet Scenarios, row 8.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, rows 18, 19, 24.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 32, 8.4.4 Query updation.
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
  - nhcx.flow.preauth-query-response
  concepts:
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.hmis-integration-architecture
  - nhcx.concept.workflow-codes
  - nhcx.concept.queries-and-communication
  - nhcx.concept.biometric-authentication
  sandbox:
  - nhcx.sandbox.test-participants
  glossary:
  - nhcx.glossary.pmjay
  endpoints:
  - nhcx.endpoint.preauth-submit
  callbacks:
  - nhcx.callback.preauth-on-submit
  fhir:
  - nhcx.fhir.query-update
  - nhcx.fhir.preauth-request
  - nhcx.fhir.validation
  tests:
  - nhcx.test.tc-pa-01
  - nhcx.test.provider-uc-08
  errors:
  - nhcx.error.payr-1218
  - nhcx.error.payr-1219
  - nhcx.error.payr-1234
  - nhcx.error.nhcx-1006
---

# TC-PA-02: Submit a preauthorisation query update

## In plain words

A [PMJAY](../glossary/pmjay.md) payer can send a preauthorisation back with a query. You answer by submitting the preauthorisation again with the documents asked for. It is a new preauthorisation request that keeps the old reference and uses a new correlation id.

This test case checks the payer accepts your answer for adjudication.

## Before you start

- The test case pre-condition holds: preauth should be submitted. [TC-PA-01](tc-pa-01.md) passed.
- The payer queried it: you received `/v1/preauth/on_submit` with `x-hcx-workflow_id` `24`. You read the query remarks.
- You have the documents that answer the query.
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
| API / FHIR Resource | /preauth/submit (Claim) |
| Input Parameters | Additional Documents |

1. Build the Claim bundle with `use` `preauthorization` again. Keep the claim identifier of the original preauthorisation. Add the additional documents. See [query update bundles](../fhir/query-update.md).
2. Validate the bundle against the [NRCeS](../../shared/glossary/nrces.md) profiles, as [validating a bundle](../fhir/validation.md) describes.
3. Seal it as a [JWE](../glossary/jwe.md) with the PMJAY payer's public key.
4. Set the protected headers. Use a new `x-hcx-correlation_id`. `x-hcx-workflow_id` is `19` and `x-hcx-status` is `response.complete`, the pair for the preauth query response stage. See [workflow codes](../concepts/workflow-codes.md). `x-hcx-recipient_code` is the payer's processing ID, and `x-hcx-ben-abha-id` carries the beneficiary's [ABHA](../../shared/glossary/abha.md) number.
5. Send it.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/preauth/submit' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"payload": "<JWE_COMPACT_STRING>"}'
```

6. [NHCX](../../shared/glossary/nhcx.md) answers with HTTP 202.
7. Wait for `POST /v1/preauth/on_submit` on your registered endpoint. Answer it with HTTP 202 within 30 seconds.
8. Decrypt the payload with your private key and read the payer's answer.

The path is described in full in [answer a payer query on a preauthorisation](../flows/preauth-query-response.md).

## How you know it worked

The pass criterion for TC-PA-02:

| Field | Value |
|---|---|
| Processing / validation rules | Match Preauth & treatment details |
| Expected output | Preauth Query details accepted for adjudication |
| Remarks | Sent to workflow |

What you observe:

- NHCX answers your request with HTTP 202.
- You receive `/v1/preauth/on_submit` with `x-hcx-workflow_id` `18` and `x-hcx-status` `response.partial`. The payer acknowledged your query response.
- The decision follows later on the same path.

## When it goes wrong

- **[PAYR-1218](../errors/payr-1218.md), no queried preauthorisation.** The case was not queried, or the claim identifier differs from the original.
- **[PAYR-1219](../errors/payr-1219.md), case not queried.** Wait for workflow `24` before you answer.
- **[PAYR-1234](../errors/payr-1234.md), no preauthorisation record.** Reuse the original claim identifier.
- **[NHCX-1006](../errors/nhcx-1006.md), duplicate request.** You reused the original correlation id. Use a new one.
- **The acknowledgement carries `x-hcx-status` `response.error`.** The payer could not accept the answer. Read `x-hcx-error_details` and correct the bundle.
- **The callback never arrives.** Your callback URL must use a domain name, not an IP address or port. It must run on an India-hosted server that allows the exchange's outbound addresses. See [callback URL requirements](../sandbox/callback-url-requirements.md) and [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md). Then ask where the request stands with [use case 13](provider-uc-13.md).
