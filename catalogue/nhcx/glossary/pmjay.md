---
id: nhcx.glossary.pmjay
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: PMJAY
summary: >-
  The government health assurance scheme that runs on the claims exchange with extra
  scheme rules.
sources:
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 9, section 3 PMJAY Overview; page 5-6 requirements table.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. InsurancePlan Response, Key Characteristics.
related:
  concepts:
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.hmis-integration-architecture
---

# PMJAY

## In plain words

PMJAY is the Pradhan Mantri Jan Arogya Yojana, the government health assurance scheme. It covers up to Rs 5 lakh per family per year for secondary and tertiary hospitalisation. It runs on the same [NHCX](../../shared/glossary/nhcx.md) framework as private insurance, with extra onboarding and scheme rules. You meet it when your hospital treats scheme beneficiaries: biometric authentication, hospital-specific insurance plans and structured clinical documents become mandatory. See [PMJAY on NHCX](../concepts/pmjay-on-nhcx.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can name two things PMJAY integration adds to plain NHCX.

## When it goes wrong

Treating PMJAY as a separate network. The calls are the same; the scheme rules differ.
