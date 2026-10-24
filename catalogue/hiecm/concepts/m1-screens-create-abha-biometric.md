---
id: hiecm.concept.m1-screens-create-abha-biometric
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: create-abha-biometric
title: What the screens of ABHA creation by fingerprint or iris must do
summary: The Aadhaar OTP creation screens with a biometric capture in place of the OTP.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
related:
  concepts:
    - hiecm.concept.m1-screens-create-abha-aadhaar-otp
---

# What the screens of ABHA creation by fingerprint or iris must do

## In plain words

The same journey as creation by Aadhaar OTP. A registered fingerprint or iris
device on your desk authenticates the person instead of an OTP.

## What happens

| Requirement | Cases |
|---|---|
| Creation offers Aadhaar biometric as a method | CRT_ABHA_201 |
| The Aadhaar field and the consent screen follow create-abha-aadhaar-otp | CRT_ABHA_204, CRT_ABHA_202, CRT_ABHA_203 |
| Capture the fingerprint or iris on the device and verify. A failed scan shows the API's error and the person scans again | CRT_ABHA_205 |
| The communication mobile, the address step, the profile and the card follow create-abha-aadhaar-otp | CRT_ABHA_206, CRT_ABHA_207, CRT_ABHA_208, CRT_ABHA_209, CRT_ABHA_210, CRT_ABHA_211 |

## How you know it worked

A scan on the device creates the ABHA and the journey reaches the same
address step, profile and card as the OTP route.
