---
id: nhcx.endpoint.payer-service-get-user-role
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role
summary: >-
  Find out which desk in the government scheme's case system currently holds a case,
  and so which actions it can take next.
sources:
- file: catalogue/openapi/.raw/nhcx-site-2026-09-14/not-on-site/External_NHCX_Payer_Service_API_Workflow_Guide.docx
  hash: sha256:1028d480d2fabe3204301f1c1b192a0077ddfa64f7f9084b01f73e004253fdd7
  fetched: '2026-09-05'
  note: NHCX Payer Service API Workflow Guide for External Integrators, not listed on hcxsbx.abdm.gov.in and not named in the NHCX document sheet, received separately. Get User Role API (Mandatory for Claims); role table.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 9-10, sections 3 and 4.2.
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
  errors:
  - nhcx.error.payr-1238
---

# POST /pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role

## In plain words

[PMJAY](../glossary/pmjay.md) cases are not decided over [NHCX](../../shared/glossary/nhcx.md). The PMJAY payer service holds each PMJAY case in the [State Health Agency](../glossary/sha.md)'s [Transaction Management System](../glossary/tms.md). A case moves when the role that holds it acts on it. This call tells you which role holds a case now. Only that role's actions are accepted next.

You call it as an integrator working a PMJAY case through the PMJAY payer service. In the sandbox, it moves a case your hospital system submitted. It is specific to that service. Other payers do not expose it. Call it before every [act on a case](payer-service-process-case.md) call, and whenever a case has gone quiet.

## Before you start

- A session token, sent on `bearer_auth`. See [the session token](../concepts/session-token.md).
- The scheme's case ID for the case, not your hospital's claim number. It appears in the payer's acknowledgement and status answers once a request is accepted.
- The PMJAY payer's code, written without `@hcx`.

## What happens

Your system calls the PMJAY payer service directly, on the sandbox host. There is no JWE envelope and no callback.

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role' \
  --header 'accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --data-raw '{
    "caseid": "<PMJAY_CASE_ID>",
    "payerid": "<PMJAY_PAYER_CODE>"
  }'
```

The role in the answer is one of these:

| Step | Role | Actions | `usecase` |
|---|---|---|---|
| Pre-authorisation | `PPD-Trust` | `Approve`, `Reject`, `Query` | `PREAUTH` |
| Claim 1 | `CEX-Trust` | `Forward` | `CLAIM` |
| Claim 2 | `CPD-Trust` | `cpdApprove`, `cpdReject`, `Pending` | `CLAIM` |
| Claim 3 | `Medical Audit Committee` | `Approve`, `Reject`, `iQuery` | `Medical Audit Committee` |
| Claim 4 | `ACO-Trust` | `Approve`, `Reject`, `Pending` | `CLAIM` |
| Claim 5 | `SHA-Trust` | `Approve`, `Reject`, `Pending` | `CLAIM` |
| Claim 6 | `Claim Review Committee` | `Approve`, `Reject`, `Pending` | `Claim Review Committee` |

**Retrying.** The call only reads, so repeat it freely. Read the role again before every action and after it.

## How you know it worked

You receive a JSON body naming the role that holds the case:

```json
{
  "currentuserrole": "PPD-Trust",
  "errormessage": null
}
```

- `currentuserrole` is set and `errormessage` is empty.
- Once the case is decided, the answer carries no role.

The step is done when you hold the current role. Act on the case only with that role's actions.

## When it goes wrong

- The answer reads `No Data found with the caseid <id>. Please use the current active case id.`: you sent your hospital's claim number. Send the scheme's case ID.
- `PPD-Trust` comes back while you ask about a claim: the case has not left the pre-authorisation queue yet.
- A later request for the same beneficiary is refused with [`PAYR-1238`](../errors/payr-1238.md). The refusal names the active case; use that case ID here.
