---
id: nhcx.test.tc-cl-03
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'TC-CL-03: Submit a CRC task after rejection or partial payment'
summary: >-
  Check that your hospital system can raise a review request after a government
  scheme claim is rejected or only partly paid.
sources:
- url: https://hcxsbx.abdm.gov.in/images/4d333fa6ce5ef99920de.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Test Cases.xlsx
  hash: sha256:0d95021974cfe81ab2e3bf66f983228a70b8fed8d7d251eb6d7eeab7354ecad2
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Test Cases, row 31 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet1, row TC-CL-03.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 6-9, sections 22 and 23; pages 4-6, Q14 and Q21.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. sheet Scenarios, rows 12 and 14.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 10.4 and 10.5.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, rows 36, 252, 253, 254.
related:
  flows:
  - nhcx.flow.pmjay-patient-to-cashless
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.claim-reprocess
  concepts:
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.hmis-integration-architecture
  - nhcx.concept.workflow-codes
  - nhcx.concept.reprocess-and-cancel
  sandbox:
  - nhcx.sandbox.test-participants
  glossary:
  - nhcx.glossary.pmjay
  - nhcx.glossary.crc
  - nhcx.glossary.reprocess
  endpoints:
  - nhcx.endpoint.task-submit
  callbacks:
  - nhcx.callback.task-on-submit
  fhir:
  - nhcx.fhir.task
  - nhcx.fhir.claim-response
  - nhcx.fhir.validation
  tests:
  - nhcx.test.tc-cl-01
  - nhcx.test.provider-uc-12
  errors:
  - nhcx.error.payr-1332
  - nhcx.error.payr-1518
  - nhcx.error.payr-1519
---

# TC-CL-03: Submit a CRC task after rejection or partial payment

## In plain words

When a [PMJAY](../glossary/pmjay.md) claim is rejected, your hospital can ask for it to be reprocessed. The Claim Review Committee ([CRC](../glossary/crc.md)) decides, and its decision is final. When a claim is paid in part, your hospital can raise an erroneous claim for the shortfall instead.

Both go as a Task bundle on `/v1/task/submit`. This test case checks your system raises one.

## Before you start

- The test case pre-condition holds: claim should be rejected or partially paid.
- For a rejection: the claim decision arrived on `/v1/claim/on_submit` as rejected.
- For a partial payment: the payment notice with workflow `33`, payment cleared, arrived. You verified it and acknowledged it with workflow `17`.
- No reprocess or erroneous claim was raised for this claim before. PMJAY allows one of each, and none after a CRC decision.
- You have a supporting document that justifies the request.
- Your provider sandbox basics pass. You hold a session token ([use case 4](provider-uc-04.md)) and the payer's certificate ([use case 3](provider-uc-03.md)). Your callback endpoint works ([use case 5](provider-uc-05.md)).
- You address the PMJAY payer by the processing ID from [use case 2](provider-uc-02.md).

## What happens

| Test case field | Value |
|---|---|
| API / FHIR Resource | /v1/task/submit (Task) |
| Input Parameters | Not published for TC-CL-03 |

Use these values for the request:

| Case | `Task.code` | `reasonCode` | Amount |
|---|---|---|---|
| Claim rejected | `reprocess` | `claimrejected` | Not sent |
| Claim partially paid | `reprocess` | `partialpayment` | The shortfall, no more |

1. Build a Task bundle. The Task `code` is `reprocess`, system `http://terminology.hl7.org/CodeSystem/financialtaskcode`. Its `status` is `requested` and its `intent` is `order`. Set `reasonCode` from the table. Add the claim number as an input: the preauthorisation number your system generated. Attach the supporting document as `valueAttachment`. See [the task bundle](../fhir/task.md).
2. Validate the bundle against the [NRCeS](../../shared/glossary/nrces.md) profiles, as [validating a bundle](../fhir/validation.md) describes.
3. Seal it as a [JWE](../glossary/jwe.md) with the PMJAY payer's public key.
4. Set the protected headers. `x-hcx-workflow_id` is `36` and `x-hcx-status` is `request.initiated`. `x-hcx-recipient_code` is the payer's processing ID, and `x-hcx-ben-abha-id` carries the beneficiary's [ABHA](../../shared/glossary/abha.md) number.
5. Send it.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/task/submit' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"payload": "<JWE_COMPACT_STRING>"}'
```

6. [NHCX](../../shared/glossary/nhcx.md) answers with HTTP 202.
7. Wait for `POST /v1/task/on_submit` on your registered endpoint. Answer it with HTTP 202 within 30 seconds.
8. Decrypt the payload with your private key and read the Task bundle.
9. Resolve the ClaimResponse that `Task.output[0].valueReference` points to, and read it as any adjudication.

The path is described in full in [ask the payer to reprocess a claim](../flows/claim-reprocess.md).

## How you know it worked

No expected output or remarks are published for TC-CL-03. Its one published rule:

| Field | Value |
|---|---|
| Processing / validation rules | Match claim and Treatment details |
| Expected output | Not published |
| Remarks | Not published |

What you observe:

- NHCX answers your `POST /v1/task/submit` with HTTP 202.
- You receive `POST /v1/task/on_submit` with a sealed Task bundle. The Task `status` is `completed`.
- The Task output references a ClaimResponse for the original claim number.
- For a reprocess, `x-hcx-workflow_id` `252` means approved, `253` rejected and `254` queried.

## When it goes wrong

- **[PAYR-1332](../errors/payr-1332.md), invalid CRC request.** Check the claim number, reason code and that the claim is in the right state.
- **The payer finds no task input.** See [PAYR-1518](../errors/payr-1518.md) and [PAYR-1519](../errors/payr-1519.md). Every input needs a type and a value.
- **An erroneous claim is refused before payment clears.** Wait for workflow `33`, acknowledge it, then raise the request.
- **A second request for the same claim is refused.** PMJAY allows one reprocess and one erroneous claim per claim.
- **The callback never arrives.** Your callback URL must use a domain name, not an IP address or port. It must run on an India-hosted server that allows the exchange's outbound addresses. See [callback URL requirements](../sandbox/callback-url-requirements.md) and [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md). Then ask where the request stands with [use case 13](provider-uc-13.md).
