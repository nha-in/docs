---
id: hiecm.concept.m1-screens-read-abha-qr
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: read-abha-qr
title: What reading an ABHA QR code must do
summary: Scanning a person's ABHA QR code fills the registration form, with nothing typed.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
related:
  concepts:
    - hiecm.concept.m1-screens-login-abha-number
---

# What reading an ABHA QR code must do

## In plain words

The QR code on an ABHA card carries the profile. Your system reads it on its
own device and fills the registration form from it.

## What happens

| Requirement | Cases |
|---|---|
| Scan the ABHA QR code and fill name, date of birth, gender, mobile and the other details it carries into the registration form | VRFY_ABHA_501 |
| Nobody types what the QR code carried, and the read only rule in login-abha-number holds on the filled form | VRFY_ABHA_501 |

## How you know it worked

A scan of the tester's card fills the form with the card's details.
