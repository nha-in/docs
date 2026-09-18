---
id: nhcx.glossary.rd-service
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: RD service, registered device service
summary: >-
  The Aadhaar software that runs a biometric capture.
sources:
- url: https://hcxsbx.abdm.gov.in/images/9f1e6b545a693d38a704.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Biometric Authentication Implementation Steps.docx
  hash: sha256:fac8b14bfe8d518c0e651740537b9441c501d3cf2ab0f0482a07ab9f417e43a9
  fetched: '2026-09-14'
  note: Biometric Authentication Implementation Steps, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. Fingerprint/IRIS Auth Verify.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. FAQ 10 (K-547).
related:
  concepts:
  - nhcx.concept.biometric-authentication
  flows:
  - nhcx.flow.biometric-face
  - nhcx.flow.biometric-fingerprint-iris
  glossary:
  - nhcx.glossary.pid-block
---

# RD service, registered device service

## In plain words

An RD service is the Aadhaar software that runs a biometric capture. For face authentication, the patient's phone scans the face with the Aadhaar RD Service app from the Play Store or App Store. For fingerprint and iris, your desk captures from a scanner and places the result in `fingerPrintAuthPid` or `irisAuthPid`. You meet it when you build [PMJAY](../glossary/pmjay.md) beneficiary authentication.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which modality uses the RD Service app on a phone.

## When it goes wrong

Fingerprint capture failing with `K-547`. Build the `wadh` value with `lr` set to `Y`.
