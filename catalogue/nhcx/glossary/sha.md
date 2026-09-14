---
id: nhcx.glossary.sha
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: SHA, State Health Agency
summary: >-
  The state body that runs the government health scheme and reviews its claims.
sources:
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 10, 4.2 Claims Payment Process.
- file: catalogue/openapi/.raw/nhcx-site-2026-09-14/not-on-site/External_NHCX_Payer_Service_API_Workflow_Guide.docx
  hash: sha256:1028d480d2fabe3204301f1c1b192a0077ddfa64f7f9084b01f73e004253fdd7
  fetched: '2026-09-05'
  note: NHCX Payer Service API Workflow Guide for External Integrators, not listed on hcxsbx.abdm.gov.in and not named in the NHCX document sheet, received separately. CLAIM Step 5 and role table; get/user-role.
verified:
  status: unverified
related:
  glossary:
  - nhcx.glossary.pmjay
  - nhcx.glossary.tms
  endpoints:
  - nhcx.endpoint.payer-service-get-user-role
---

# SHA, State Health Agency

## In plain words

SHA stands for State Health Agency, the state body that runs [PMJAY](../glossary/pmjay.md) in its state. It is also called the State Health Authority. It reviews claims before the bank pays the hospital. In the PMJAY payer service, `SHA-Trust` is the fifth role in the claim chain.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say where the SHA sits in the order of PMJAY claim roles.

## When it goes wrong

Expecting the SHA to act on a claim before the earlier roles have. Read the current role with `get/user-role`.
