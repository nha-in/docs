---
id: nhcx.glossary.pid-block
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: PID block
summary: >-
  The captured biometric data passed to the verify call.
sources:
- url: https://hcxsbx.abdm.gov.in/images/9f1e6b545a693d38a704.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Biometric Authentication Implementation Steps.docx
  hash: sha256:fac8b14bfe8d518c0e651740537b9441c501d3cf2ab0f0482a07ab9f417e43a9
  fetched: '2026-09-14'
  note: Biometric Authentication Implementation Steps, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. Fingerprint/IRIS Auth Verify; Face Auth Capture PID and Aadhar Verify.
related:
  concepts:
  - nhcx.concept.biometric-authentication
  endpoints:
  - nhcx.endpoint.abha-biometric-auth-verify
  - nhcx.endpoint.abha-biometric-capture-pid
  glossary:
  - nhcx.glossary.rd-service
---

# PID block

## In plain words

A PID block is the captured biometric data that your system passes to the verify call in [PMJAY](../glossary/pmjay.md) beneficiary authentication. Fingerprint and iris verification carry it in `fingerPrintAuthPid` or `irisAuthPid`, with the `txnId` from `auth/init`. For face authentication your system never holds it: you poll `capture/pid` until it reports `COMPLETE`, then call `v2/auth/verify`.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which call tells you a face capture has finished.

## When it goes wrong

Calling `v2/auth/verify` while `capture/pid` still reports `PENDING`. Poll until it reports `COMPLETE`.
