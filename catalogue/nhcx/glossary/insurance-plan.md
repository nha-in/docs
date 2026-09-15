---
id: nhcx.glossary.insurance-plan
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Insurance plan
summary: >-
  The payer's policy in machine-readable form, with its packages, rates and rules.
sources:
- url: https://hcxsbx.abdm.gov.in/images/13093b5f9b88fe826123.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Insurance Plan IG.docx
  hash: sha256:e9c6c82b6d67fd8476d6d19a5961419beb04e3c0613533453ed1e16e2a569cc1
  fetched: '2026-09-14'
  note: Insurance Plan IG, row 25 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Core APIs, InsurancePlan Task table.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. InsurancePlan Response, Key Characteristics.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 13, 6.1 High-Level NHCX Process Flow.
verified:
  status: unverified
related:
  flows:
  - nhcx.flow.insurance-plan-request
  endpoints:
  - nhcx.endpoint.insuranceplan-request
  concepts:
  - nhcx.concept.insurance-plan
  errors:
  - nhcx.error.payr-1406
---

# Insurance plan

## In plain words

An insurance plan is the payer's policy in machine-readable form: covered specialties, packages, package rates, conditions and document rules. Your system asks for it with a `Task` on `/v1/insuranceplan/request` and receives an InsurancePlan bundle on `/v1/insuranceplan/on_request`. For [PMJAY](../glossary/pmjay.md) the plan is specific to your hospital and drives what your preauthorisations and claims must carry.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what your system reads from the plan before a preauthorisation.

## When it goes wrong

Fetching the plan on every transaction. Cache it and refresh it on a schedule. A second request for the same hospital and policy while one is running is refused with [PAYR-1406](../errors/payr-1406.md).
