---
id: nhcx.endpoint.payer-service-process-case
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /pmjay/hcx/nhcxpayerservice/wrapper/process/case
summary: >-
  Approve, reject, query or forward a government scheme case as the desk that currently
  holds it, so the decision flows back to the hospital.
sources:
- file: catalogue/openapi/.raw/nhcx-site-2026-09-14/not-on-site/External_NHCX_Payer_Service_API_Workflow_Guide.docx
  hash: sha256:1028d480d2fabe3204301f1c1b192a0077ddfa64f7f9084b01f73e004253fdd7
  fetched: '2026-09-05'
  note: NHCX Payer Service API Workflow Guide for External Integrators, not listed on hcxsbx.abdm.gov.in and not named in the NHCX document sheet, received separately. Common Processing Endpoint; Example CURLs PREAUTH and CLAIM Steps 1-6; Important Notes.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 9-10, sections 3 and 4.2.
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.payer-service-get-user-role
  - nhcx.endpoint.payer-service-process-case
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.claim-submit
  - nhcx.endpoint.session-token
  callbacks:
  - nhcx.callback.preauth-on-submit
  - nhcx.callback.claim-on-submit
  concepts:
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.claim-cycle
  flows:
  - nhcx.flow.payer-process-a-request
  - nhcx.flow.pmjay-patient-to-cashless
  decisions:
  - nhcx.decision.payer-implementation
  glossary:
  - nhcx.glossary.sha
  - nhcx.glossary.tms
  - nhcx.glossary.pmjay
---

# POST /pmjay/hcx/nhcxpayerservice/wrapper/process/case

## In plain words

[PMJAY](../glossary/pmjay.md) cases are not decided over [NHCX](../../shared/glossary/nhcx.md). The PMJAY payer service holds each PMJAY case in the [State Health Agency](../glossary/sha.md)'s [Transaction Management System](../glossary/tms.md). A case moves when the role that holds it acts on it. This call takes that action: approve, reject, query, forward or hold, as the role that holds the case.

You call it as an integrator working a PMJAY case through the PMJAY payer service. In the sandbox, it moves a case your hospital system submitted. It is specific to that service. Other payers do not expose it.

## Before you start

- A session token, sent on `bearer_auth`. See [the session token](../concepts/session-token.md).
- The current role for the case, read immediately before this call with [the role lookup](payer-service-get-user-role.md).
- The scheme's case ID, the beneficiary's member ID, the payer code and your provider participant code. Write both codes without `@hcx`.

## What happens

Your system calls the PMJAY payer service directly. The action call and the role lookup sit on different hosts. Use each exactly as shown.

```bash
curl --location --request POST 'https://apisbeta.nha.gov.in/pmjay/hcx/nhcxpayerservice/wrapper/process/case' \
  --header 'Accept: application/json' \
  --header 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "casenumber": "<PMJAY_CASE_ID>",
    "action": "Approve",
    "receivercode": "<PMJAY_PAYER_CODE>",
    "usecase": "PREAUTH",
    "correlationid": "<NEW_UUID_FOR_THIS_CALL>",
    "sendercode": "<YOUR_PROVIDER_CODE>",
    "memberid": "<BENEFICIARY_MEMBER_ID>",
    "remarks": "<FREE_TEXT_REMARK>"
  }'
```

Spell `action` and `usecase` exactly as the holding role takes them. Both are case-sensitive:

| Step | Role | Actions | `usecase` |
|---|---|---|---|
| Pre-authorisation | `PPD-Trust` | `Approve`, `Reject`, `Query` | `PREAUTH` |
| Claim 1 | `CEX-Trust` | `Forward` | `CLAIM` |
| Claim 2 | `CPD-Trust` | `cpdApprove`, `cpdReject`, `Pending` | `CLAIM` |
| Claim 3 | `Medical Audit Committee` | `Approve`, `Reject`, `iQuery` | `Medical Audit Committee` |
| Claim 4 | `ACO-Trust` | `Approve`, `Reject`, `Pending` | `CLAIM` |
| Claim 5 | `SHA-Trust` | `Approve`, `Reject`, `Pending` | `CLAIM` |
| Claim 6 | `Claim Review Committee` | `Approve`, `Reject`, `Pending` | `Claim Review Committee` |

**Idempotency.** Use a new UUID in `correlationid` on every call. It is not the correlation id of the NHCX request. Read the role again before a repeat: if it has moved, the earlier call took effect.

## How you know it worked

The call answers synchronously, for example:

```json
{
  "status": "success",
  "message": "Case processed"
}
```

The step is done when the scheme's verdict reaches the provider over NHCX: a `ClaimResponse` on [`/v1/preauth/on_submit`](../callbacks/preauth-on-submit.md) or [`/v1/claim/on_submit`](../callbacks/claim-on-submit.md), on the original request's correlation id. For a claim, repeat the lookup and the action for each role until the lookup returns no role.

## When it goes wrong

- `Approve` sent to `CPD-Trust`: that role takes `cpdApprove` and `cpdReject`.
- `usecase` `CLAIM` sent at a committee: each committee takes its full name, with spaces.
- The action is refused for the role: the case has moved. Read the role again.
- `Event Meta Log not found for correlationId`: NHCX has not finished delivering the request. Retry shortly.
- `Case not found for caseId`: the case is still being filed. Retry shortly.
