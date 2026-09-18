---
id: nhcx.decision.payer-implementation
type: decision
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Answer as your own payer system or through the PMJAY payer service
summary: >-
  An insurer answers requests from its own system, while a government scheme case
  is decided role by role in the scheme's system.
sources:
- file: catalogue/openapi/.raw/nhcx-site-2026-09-14/not-on-site/External_NHCX_Payer_Service_API_Workflow_Guide.docx
  hash: sha256:1028d480d2fabe3204301f1c1b192a0077ddfa64f7f9084b01f73e004253fdd7
  fetched: '2026-09-05'
  note: NHCX Payer Service API Workflow Guide for External Integrators, not listed on hcxsbx.abdm.gov.in and not named in the NHCX document sheet, received separately. Whole document.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use cases 7 to 14 Validations and API logic.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 4 Existing PMJAY workflow.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Pages 1-3.
related:
  concepts:
  - nhcx.concept.participant-roles
  - nhcx.concept.pmjay-on-nhcx
  flows:
  - nhcx.flow.payer-process-a-request
  endpoints:
  - nhcx.endpoint.payer-service-get-user-role
  - nhcx.endpoint.payer-service-process-case
  - nhcx.endpoint.dummy-payer-process-request
  sandbox:
  - nhcx.sandbox.dummy-payer
  troubleshooting:
  - nhcx.troubleshooting.callback-url-rejected
  - nhcx.troubleshooting.duplicate-or-mismatched-correlation
  glossary:
  - nhcx.glossary.adjudication
  - nhcx.glossary.pmjay
  - nhcx.glossary.tms
  - nhcx.glossary.sha
  - nhcx.glossary.tpa
  - nhcx.glossary.payer
---

# Answer as your own payer system or through the PMJAY payer service

## In plain words

A request addressed to a payer needs an adjudicated answer on its `on_` callback. That answer comes from one of two places. Your own payer system decides it and answers over [NHCX](../../shared/glossary/nhcx.md). For a [PMJAY](../glossary/pmjay.md) case, named roles in the [SHA](../glossary/sha.md)'s [TMS](../glossary/tms.md) decide it, and integrators act on the case through the PMJAY payer service.

If you are an insurer or a [TPA](../glossary/tpa.md), answer from your own payer system. Use the PMJAY payer service only for PMJAY cases.

## Before you start

- You are registered as a payer (`10002`) or TPA (`10003`), with a certificate and a callback endpoint. See [participant roles](../concepts/participant-roles.md).
- You know who processes each policy. A policy under a TPA names the insurer as `payerid` and the TPA as `processingid`.
- You have read [receive, adjudicate and answer a request as a payer](../flows/payer-process-a-request.md).

## What happens

| | Your own payer system | PMJAY payer service |
|---|---|---|
| Who decides | Your adjudication | The role holding the case in the SHA's TMS |
| What you build | A receiver for every request path, sealing, every `on_` call, and `/v1/error` | Two calls: [`get/user-role`](../endpoints/payer-service-get-user-role.md), then [`wrapper/process/case`](../endpoints/payer-service-process-case.md) |
| How the answer leaves | You send `/v1/preauth/on_submit`, `/v1/claim/on_submit` and the other `on_` calls, sealed to the provider | A role's action moves the case, and the verdict returns to the provider over NHCX |
| Preauthorisation roles | Yours | `PPD-Trust`: `Approve`, `Reject`, `Query` |
| Claim roles | Yours | `CEX-Trust`, `CPD-Trust`, Medical Audit Committee, `ACO-Trust`, `SHA-Trust`, Claim Review Committee, in that order |

The default is your own payer system for any insurer or TPA. It is the only way requests addressed to your participant code are answered. The payer sandbox exit checks it one callback at a time. The PMJAY payer service exists because a PMJAY case is decided in the scheme's own system, by role, on that system's schedule.

If you answer from your own system, each answer passes four checks:

1. The payload validates against the [NRCeS](../../shared/glossary/nrces.md) profiles.
2. The api call id of your answer differs from its correlation id.
3. The correlation id is the api call id of the request you are answering.
4. The receiver code is the sender code of that request.

If you act through the payer service, read the role before every action. Send the action name exactly as that role takes it: `cpdApprove`, `cpdReject` and `iQuery` are case sensitive.

## How you know it worked

Own payer system: every request addressed to your code reaches your endpoint, and each gets its `on_` call. The provider receives it with the correlation id it expects.

PMJAY payer service: `get/user-role` names a role for the case. An action from that role's list is accepted, and the provider receives `/v1/preauth/on_submit` or `/v1/claim/on_submit`.

## When it goes wrong

Nothing built for one branch serves the other. Choose by who owns the decision, not by effort.

- An action fails on the payer service: read the role again with `get/user-role`. The service moves cases on its own schedule, so the role you read earlier may have changed.
- A provider's request never reaches your own system: check that the provider addressed your processing code and that your endpoint is reachable. See [your callback URL is rejected or never called](../troubleshooting/callback-url-rejected.md).
- Your answer is refused or lands on the wrong case: check the four answer rules above. See [responses arrive against the wrong request](../troubleshooting/duplicate-or-mismatched-correlation.md).

Provider teams testing in the sandbox use the [dummy payer](../sandbox/dummy-payer.md) instead. [`POST /process/request`](../endpoints/dummy-payer-process-request.md) triggers an approve, reject or query answer for a preauthorisation or claim.
