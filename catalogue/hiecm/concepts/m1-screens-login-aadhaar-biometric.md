---
id: hiecm.concept.m1-screens-login-aadhaar-biometric
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: login-aadhaar-biometric
title: What the screens of login with Aadhaar by fingerprint or iris must do
summary: Login with Aadhaar OTP, with a biometric capture in place of the OTP.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
related:
  concepts:
    - hiecm.concept.m1-screens-login-aadhaar-otp
---

# What the screens of login with Aadhaar by fingerprint or iris must do

## In plain words

The same two outcomes as login with Aadhaar OTP, reached by a biometric scan.

## What happens

| Requirement | Cases |
|---|---|
| The Aadhaar field follows create-abha-aadhaar-otp | VRFY_ABHA_801 |
| A failed scan shows the API's error, and a good one lets the person through | VRFY_ABHA_802 |
| No ABHA on the Aadhaar and an ABHA on it end on the screens login-aadhaar-otp names | VRFY_ABHA_803, VRFY_ABHA_804 |

## How you know it worked

Both outcomes end on a screen that offers the next step.
