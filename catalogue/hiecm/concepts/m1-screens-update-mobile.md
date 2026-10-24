---
id: hiecm.concept.m1-screens-update-mobile
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: update-mobile
title: What the screen that updates an ABHA's mobile must do
summary: The new mobile is verified by OTP, and the screen shows the update only after the verify call succeeds.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
related:
  concepts:
    - hiecm.concept.m1-screens-login-abha-number
---

# What the screen that updates an ABHA's mobile must do

## In plain words

Changing the mobile on an ABHA is a profile call that needs a logged in user
token. The new number is proved by an OTP before it replaces the old one.

## What happens

| Requirement | Cases |
|---|---|
| Take the new mobile, send the OTP to it, and verify it, with the `X-token` of an ABHA number login | PROF_ABHA_601 |
| Show the mobile as updated only after the verify call returns success, then read the profile again so the screen shows the mobile the ABHA now holds | PROF_ABHA_601 |
| The OTP, wrong OTP and resend rules are under Screen requirements in create-abha-aadhaar-otp | PROF_ABHA_601 |

## How you know it worked

The profile fetched after the update carries the new mobile.
