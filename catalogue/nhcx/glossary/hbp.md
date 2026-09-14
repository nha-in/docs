---
id: nhcx.glossary.hbp
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: HBP, Health Benefit Package
summary: >-
  The list of treatment packages a government scheme beneficiary can be treated
  under.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. FAQ 24 Unspecified Procedure, questions 1 and 7.
- url: https://hcxsbx.abdm.gov.in/images/4d333fa6ce5ef99920de.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Test Cases.xlsx
  hash: sha256:0d95021974cfe81ab2e3bf66f983228a70b8fed8d7d251eb6d7eeab7354ecad2
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Test Cases, row 31 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Test case TC-HBP-01.
verified:
  status: unverified
related:
  glossary:
  - nhcx.glossary.pmjay
  - nhcx.glossary.insurance-plan
---

# HBP, Health Benefit Package

## In plain words

HBP is the package list of a [PMJAY](../glossary/pmjay.md) policy: the packages a beneficiary can be treated under. Each package has a code, a rate and claim conditions, delivered in the [insurance plan](../glossary/insurance-plan.md). A procedure outside the package list is an unspecified procedure, coded with its specialty prefix and `215`, such as `SG215`.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say where your system reads a patient's HBP packages from.

## When it goes wrong

Booking a procedure outside the package list as a normal package. Use the unspecified procedure code for its specialty.
