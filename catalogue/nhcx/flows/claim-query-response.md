---
id: nhcx.flow.claim-query-response
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Answer a payer query on a claim
summary: >-
  Send the payer the documents or clarification it asked for on a claim, so that
  it can finish adjudicating.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. 9.5 ClaimResponse outcomes; 9.5.4 Queried Response; query trail mapping table.
- url: https://hcxsbx.abdm.gov.in/images/c42ad170f37c987ed173.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Workflow Status Sheets(with Codes).xlsx
  hash: sha256:f56dd156c232192296082f23b1561d0ff11fd40992e6675de41c5c991d579e6d
  fetched: '2026-09-14'
  note: Workflow Status Sheets(with Codes), row 12 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet1, Claim Request Queried and Claim Query Response Submitted.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. pages 36-37, claim query updation.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet Scenarios, row 11.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Communication.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Claim steps 2-5; Communication.
related:
  endpoints:
  - nhcx.endpoint.claim-submit
  - nhcx.endpoint.claim-on-submit
  - nhcx.endpoint.communication-request
  - nhcx.endpoint.communication-on-request
  callbacks:
  - nhcx.callback.claim-on-submit
  - nhcx.callback.claim-submit
  - nhcx.callback.communication-request
  - nhcx.callback.communication-on-request
  fhir:
  - nhcx.fhir.claim-response
  - nhcx.fhir.task
  tests:
  - nhcx.test.tc-cl-02
  - nhcx.test.provider-uc-08
  - nhcx.test.payer-uc-10
  flows:
  - nhcx.flow.claim-submit
  - nhcx.flow.preauth-query-response
  - nhcx.flow.status-check
  concepts:
  - nhcx.concept.queries-and-communication
  errors:
  - nhcx.error.nhcx-1006
  - nhcx.error.nhcx-1010
  - nhcx.error.nhcx-1011
  - nhcx.error.payr-1001
  - nhcx.error.payr-1303
  - nhcx.error.payr-1304
  glossary:
  - nhcx.glossary.claim
  - nhcx.glossary.communication-request
  - nhcx.glossary.payer
  - nhcx.glossary.pmjay
  sandbox:
  - nhcx.sandbox.dummy-payer
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
---

# Answer a payer query on a claim

## In plain words

A claim query means the [payer](../glossary/payer.md) cannot finish adjudicating your [claim](../glossary/claim.md) yet. It needs more documents or a clarification. The claim stays open, with its totals at zero, until you answer.

The query reaches you by one of two routes. Where it arrives tells you how to answer.

| The query arrives on | It looks like | You answer on |
|---|---|---|
| `/v1/claim/on_submit` | Workflow `27`. ClaimResponse `outcome` `partial`, adjudication reason `queried` | `/v1/claim/submit` with workflow `151` |
| `/v1/communication/request` | A Task with `code` `poll` carrying a [communication request](../glossary/communication-request.md) | `/v1/communication/on_request` |

After your answer, the payer sends its adjudication on `/v1/claim/on_submit`. [Payer queries and the communication cycle](../concepts/queries-and-communication.md) explains both routes.

## Before you start

- You [submitted the claim](claim-submit.md), and kept its claim identifier and bundle.
- A query has arrived by one of the two routes above, and you answered its delivery with `202` within 30 seconds.
- You have collected the documents or the clarification the query asks for.
- In the sandbox, the [dummy payer](../sandbox/dummy-payer.md) raises a query when you drive it with the action `Query`, and uses the communication route.

## What happens

```mermaid
sequenceDiagram
  participant P as Provider (your system)
  participant N as NHCX
  participant Y as Payer
  alt query as a ClaimResponse
    Y->>N: POST /v1/claim/on_submit (workflow 27)
    N->>P: POST /v1/claim/on_submit
    P-->>N: HTTP 202 Accepted, within 30 seconds
    P->>N: POST /v1/claim/submit (workflow 151)
    Note right of P: same Claim identifier, added documents, new correlation id
    N-->>P: HTTP 202 Accepted
    N->>Y: POST /v1/claim/submit
    Y-->>N: HTTP 202 Accepted
  else query as a communication request
    Y->>N: POST /v1/communication/request
    N-->>Y: HTTP 202 Accepted
    N->>P: POST /v1/communication/request
    P-->>N: HTTP 202 Accepted, within 30 seconds
    P->>N: POST /v1/communication/on_request
    Note right of P: Communication with the documents, same correlation id
    N-->>P: HTTP 202 Accepted
    N->>Y: POST /v1/communication/on_request
    Y-->>N: HTTP 202 Accepted
  end
  Note over Y: payer re-adjudicates
  Y->>N: POST /v1/claim/on_submit (decision)
  N->>P: POST /v1/claim/on_submit
  P-->>N: HTTP 202 Accepted
```

### The query arrives as a ClaimResponse

1. Receive [POST /v1/claim/on_submit](../callbacks/claim-on-submit.md) with workflow `27`. Answer `202` within 30 seconds, then decrypt.
2. Read what the payer asked. For [PMJAY](../glossary/pmjay.md), `ClaimResponse.item[].adjudication[].reason.coding.display` carries a trail of entries in the form `USER~datetime~type~comment~actor`, separated by `|`, where `actor` is whoever wrote the entry: `PPD-Trust` on a preauthorisation, `CPD-Trust` on a claim, or the hospital's name. Treat it as display text and never parse a timestamp from it. The comment is the question.
3. Add the requested documents to `supportingInfo` in the same Claim. Keep `Claim.identifier` and `use` `claim`.
4. Set `x-hcx-workflow_id` to `151`, Claim Query Response Submitted. Set `x-hcx-status` to `request.initiated`.
5. Start a new correlation: set `x-hcx-correlation_id` to the value of this call's `x-hcx-api_call_id`. The claim identifier ties the answer to the case.
6. Call [POST /v1/claim/submit](../endpoints/claim-submit.md). NHCX answers `202 Accepted`.

### The query arrives as a communication request

1. Receive [POST /v1/communication/request](../callbacks/communication-request.md). Answer `202` within 30 seconds, then decrypt.
2. Read `Task.reasonCode` and the communication resource. They say what the payer needs.
3. Build the answer as a Task bundle whose Task carries a `Communication`. Put the documents in `Communication.payload` as `contentAttachment`. See [the Task bundle](../fhir/task.md).
4. Set `x-hcx-status` to `response.complete`. Set `x-hcx-correlation_id` to the correlation id of the communication request. Use a fresh `x-hcx-api_call_id`.
5. Address it to the sender of the communication request. Call [POST /v1/communication/on_request](../endpoints/communication-on-request.md). NHCX answers `202 Accepted`.

### Either route: wait for the adjudication

The payer re-adjudicates and answers on `/v1/claim/on_submit`. Read it as in [submit a claim](claim-submit.md), using `outcome` and the adjudication reason together.

## How you know it worked

The query is resolved when all of these hold:

- NHCX accepted your answer with `202`: on `/v1/claim/submit` with workflow `151`, or on `/v1/communication/on_request`.
- You then received `POST /v1/claim/on_submit` for this case, and its `payload` decrypts.
- The ClaimResponse has `outcome` `complete` with adjudication reason `approved` or `cancelled`, or `outcome` `partial` with reason `approved`.

`outcome` `partial` with reason `queried` means the payer asks again. Repeat this flow.

## When it goes wrong

The payer finds no queried claim. [PAYR-1304](../errors/payr-1304.md) means no queried claim exists for the case number. [PAYR-1303](../errors/payr-1303.md) means no active claim exists for it. Check that you kept the original claim identifier.

NHCX rejects your query update as a duplicate. [NHCX-1006](../errors/nhcx-1006.md) means you reused an earlier correlation id on `/v1/claim/submit`. Start a new correlation.

NHCX rejects your communication answer. [NHCX-1010](../errors/nhcx-1010.md) means no request exists with the correlation id you set. Copy it from the communication request exactly. [NHCX-1011](../errors/nhcx-1011.md) means the `x-hcx-status` value is not valid.

The payer cannot open your answer. A `ProtocolResponse` with [PAYR-1001](../errors/payr-1001.md) means it could not decrypt. Fetch its certificate again and reseal.

No adjudication follows your answer. [Check the status](status-check.md) of your answer's correlation id. See [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md).
