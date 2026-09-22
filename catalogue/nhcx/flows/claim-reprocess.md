---
id: nhcx.flow.claim-reprocess
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Ask the payer to reprocess a claim
summary: >-
  Contest a rejected claim, or recover the shortfall on a partly paid one, by sending
  the payer a reprocess task with supporting evidence.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. FAQ 22 Erroneous Claim, FAQ 23 Claim Reprocess and field comparison; FAQ 15.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Communication reasons (claimArbitration); reprocess workflow codes; reprocess Task table.
- url: https://hcxsbx.abdm.gov.in/taskhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/taskhcxservice.json
  hash: sha256:0418eca6478dece4d72c5a49a6547d50772511f7ffaf32f901f245591ba84656
  fetched: '2026-09-14'
  note: 'API specification: taskhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths /v1/task/submit and /v1/task/on_submit.'
related:
  endpoints:
  - nhcx.endpoint.task-submit
  - nhcx.endpoint.task-on-submit
  - nhcx.endpoint.communication-request
  - nhcx.endpoint.communication-on-request
  callbacks:
  - nhcx.callback.task-submit
  - nhcx.callback.task-on-submit
  - nhcx.callback.communication-request
  - nhcx.callback.error
  fhir:
  - nhcx.fhir.claim-response
  - nhcx.fhir.task
  concepts:
  - nhcx.concept.claim-cycle
  - nhcx.concept.workflow-codes
  tests:
  - nhcx.test.provider-uc-12
  - nhcx.test.payer-uc-14
  - nhcx.test.tc-cl-03
  flows:
  - nhcx.flow.claim-submit
  - nhcx.flow.claim-query-response
  - nhcx.flow.payment-notice
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.status-check
  errors:
  - nhcx.error.err-pyr-clm-007
  - nhcx.error.nhcx-1006
  - nhcx.error.payr-1001
  glossary:
  - nhcx.glossary.communication-request
  - nhcx.glossary.crc
  - nhcx.glossary.pmjay
  - nhcx.glossary.reprocess
---

# Ask the payer to reprocess a claim

## In plain words

[Reprocessing](../glossary/reprocess.md) asks the payer to look at an adjudicated claim again. You send it as a FHIR Task on `/v1/task/submit`, with evidence. The payer re-adjudicates and answers on `/v1/task/on_submit`.

There are two cases. Both use workflow `36` and Task code `reprocess`.

| | Rejected claim | Partly paid claim, the erroneous claim |
|---|---|---|
| When you may send it | As soon as the rejection arrives | Only after the payment settles, workflow `33`, and you acknowledged it, workflow `17` |
| Reason code | `claimrejected` | `partialpayment` |
| Amount | Not sent. The full claim is implied | The shortfall, never more than the claimed amount minus the approved amount |
| Supporting document | Mandatory | Mandatory |
| How often, under [PMJAY](../glossary/pmjay.md) | Once per claim | Once per claim |

A reprocess request goes to the [CRC](../glossary/crc.md). Its decision is final. No erroneous claim can follow a CRC decision.

## Before you start

- The claim was adjudicated. It was rejected, `outcome` `complete` with reason `cancelled`, or it was paid in part.
- For a partly paid claim, you received the payment notice with workflow `33` and sent your acknowledgement with workflow `17`. See [receive a payment notice](payment-notice.md).
- You have the claim number. It is the preauthorisation number your hospital generated, carried forward unchanged.
- You have the document that justifies the request.
- No reprocess or erroneous claim was raised for this claim before.

## What happens

```mermaid
sequenceDiagram
  participant P as Provider (your system)
  participant N as NHCX
  participant Y as Payer
  P->>N: POST /v1/task/submit (workflow 36)
  Note right of P: Task code reprocess, reason claimrejected or partialpayment
  N-->>P: HTTP 202 Accepted
  N->>Y: POST /v1/task/submit
  Y-->>N: HTTP 202 Accepted
  opt payer acknowledges the request
    Y->>N: POST /v1/communication/request (reason claimArbitration)
    N->>P: POST /v1/communication/request
    P-->>N: HTTP 202 Accepted
  end
  Note over Y: review committee re-adjudicates
  Y->>N: POST /v1/task/on_submit
  N-->>Y: HTTP 202 Accepted
  N->>P: POST /v1/task/on_submit
  P-->>N: HTTP 202 Accepted, within 30 seconds
  alt workflow 252
    Note left of P: approved, payment notices follow
  else workflow 254
    Note left of P: queried
  else workflow 253
    Note left of P: rejected, the decision stands
  end
```

1. Build a Task bundle, as in [the Task bundle](../fhir/task.md). Set `status` to `requested`, `intent` to `order`, and `code` to `reprocess`.
2. Set `reasonCode` to `claimrejected` for a rejected claim, or `partialpayment` for a partly paid one. Add the claim number as an input, and point `basedOn` at the original claim.
3. Attach the supporting document as a `valueAttachment`. For a partly paid claim, send the shortfall amount.
4. Seal and set the headers, as in [send a sealed request](send-a-sealed-request.md). Set `x-hcx-workflow_id` to `36` and `x-hcx-status` to `request.initiated`.
5. Start a new correlation. Set `x-hcx-correlation_id` to the value of this call's `x-hcx-api_call_id`.
6. Call [POST /v1/task/submit](../endpoints/task-submit.md). NHCX answers `202 Accepted`. It is not the decision.
7. The payer may confirm it received the request with a [communication request](../glossary/communication-request.md), reason `claimArbitration`. Answer its delivery with `202`, then acknowledge it on [/v1/communication/on_request](../endpoints/communication-on-request.md).
8. Receive [POST /v1/task/on_submit](../callbacks/task-on-submit.md). Answer `202 Accepted` within 30 seconds, then process.
9. Read `type`. `ProtocolResponse` means the payer could not process the request. Otherwise decrypt `payload` with your private key.
10. Find the Task, with `status` `completed`. Follow `Task.output` to the ClaimResponse in the same bundle. Read it as you read a [claim decision](claim-submit.md).

| `x-hcx-workflow_id` | Meaning | What to do |
|---|---|---|
| `252` | Reprocess approved | Wait for [payment notices](payment-notice.md), workflows `30`, `31` and `33` |
| `254` | Reprocess queried | Send the information the payer asks for, with workflow `19` |
| `253` | Reprocess rejected | The original decision stands. The case is closed |

## How you know it worked

The reprocess request is decided when all of these hold:

- You received `POST /v1/task/on_submit` whose `x-hcx-correlation_id` equals the one you sent.
- Its `payload` decrypts, and the Task in it has `status` `completed`.
- `Task.output` resolves to a ClaimResponse inside the same bundle.
- `x-hcx-workflow_id` is `252`, approved, or `253`, rejected.
- You recorded the decision against the claim. After `252`, you watch for the payment notice.

## When it goes wrong

The payer cannot find the claim. [ERR-PYR-CLM-007](../errors/err-pyr-clm-007.md) means no preauthorisation or claim record exists for the case number. Send the preauthorisation number your hospital generated as the claim number.

The request is refused as too early or repeated. An erroneous claim sent before workflow `33` arrives is out of order. A second request on the same claim exceeds the once-per-claim limit under PMJAY. Neither can be fixed by resending.

NHCX rejects the request as a duplicate. [NHCX-1006](../errors/nhcx-1006.md) means you reused a correlation id. Start a new correlation.

The callback is a `ProtocolResponse`. [PAYR-1001](../errors/payr-1001.md) means the payer could not decrypt your request. Fetch its certificate again and reseal.

No decision arrives. Reprocess has no fixed turnaround time. [Check the request's status](status-check.md) to confirm the payer holds it. An undeliverable request comes back on [/v1/error](../callbacks/error.md).
