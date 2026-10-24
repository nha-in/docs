---
id: hiecm.concept.m1-screens-find-abha-biometric
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: find-abha-biometric
title: What the screens of finding an ABHA by mobile with fingerprint or iris must do
summary: The profile list, then a biometric verification for the chosen profile, then link or register.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
related:
  concepts:
    - hiecm.concept.m1-screens-find-abha-mobile
---

# What the screens of finding an ABHA by mobile with fingerprint or iris must do

## In plain words

The same search as finding an ABHA by mobile, verified with a biometric
device instead of an OTP.

## What happens

| Requirement | Cases |
|---|---|
| An invalid mobile shows "Please enter a valid mobile number." and goes no further | VRFY_ABHA_601 |
| A mobile with no ABHA shows the not found message from find-abha-mobile and offers to create an ABHA | VRFY_ABHA_602 |
| List every ABHA on the mobile, verify the chosen one by biometric, then show its profile | VRFY_ABHA_603 |
| Already linked in your records: show "This ABHA profile is already linked to HMIS Beneficiary ID." Not linked: let the person register and link it | VRFY_ABHA_603 |
| Offer the ABHA card download where the ABHA is KYC verified | VRFY_ABHA_603 |

## How you know it worked

The chosen profile opens after the biometric, and ends either linked or
registered.
