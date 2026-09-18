---
id: nhcx.glossary.coverage-eligibility
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Coverage eligibility
summary: >-
  The check a hospital runs to confirm a patient's policy and what it covers.
sources:
- url: https://hcxsbx.abdm.gov.in/images/cfcbe62e8378d4f48ee6.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Coverage Eligibility.pdf
  hash: sha256:69dd680ddac44231a97276a1d735e45777d8e43b5563b7248fd367a838d9744f
  fetched: '2026-09-14'
  note: Coverage Eligibility, listed on https://hcxsbx.abdm.gov.in/#/documents, not named in the NHCX document sheet. Coverage Eligibility Check request and response.
- url: https://hcxsbx.abdm.gov.in/images/13093b5f9b88fe826123.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Insurance Plan IG.docx
  hash: sha256:e9c6c82b6d67fd8476d6d19a5961419beb04e3c0613533453ed1e16e2a569cc1
  fetched: '2026-09-14'
  note: Insurance Plan IG, row 25 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Core APIs, CoverageEligibility purposes list.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sheet Scenarios, rows 3 to 5.
related:
  flows:
  - nhcx.flow.coverage-eligibility-check
  endpoints:
  - nhcx.endpoint.coverageeligibility-check
  concepts:
  - nhcx.concept.coverage-eligibility-purposes
  decisions:
  - nhcx.decision.eligibility-purpose
---

# Coverage eligibility

## In plain words

Coverage eligibility is the check a provider runs to confirm a patient's policy and what it covers. Your system sends a `CoverageEligibilityRequest` through [NHCX](../../shared/glossary/nhcx.md) on `/v1/coverageeligibility/check`, with a `purpose` of `discovery`, `validation`, `benefits` or `auth-requirements`. The payer answers on `/v1/coverageeligibility/on_check`. You run it at registration and again before each preauthorisation.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which purpose to send before a preauthorisation.

## When it goes wrong

Skipping the `auth-requirements` check and learning the required documents from a query instead. See [which coverage eligibility purpose to send](../decisions/eligibility-purpose.md).
