---
id: hiecm.concept.m1-screens-create-abha-demo-auth
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: create-abha-demo-auth
title: What the screens of ABHA creation by demographic authentication must do
summary: >
  For government entities: the demographic details are checked against
  Aadhaar, the matched fields are filled and read only, and the card carries
  the fields the case lists.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
related:
  concepts:
    - hiecm.concept.m1-screens-create-abha-aadhaar-otp
  flows:
    - hiecm.flow.m1-create-abha-demographic-auth
---

# What the screens of ABHA creation by demographic authentication must do

## In plain words

A government entity can create an ABHA with no OTP, by matching a person's
name, date of birth and gender against their Aadhaar record.

## What happens

| Requirement | Cases |
|---|---|
| Creation offers "Create ABHA using Demographics" | CRT_ABHA_301 |
| The consent screen and the Aadhaar field follow create-abha-aadhaar-otp | CRT_ABHA_302, CRT_ABHA_303, CRT_ABHA_304 |
| Take name, date of birth, gender, Aadhaar number and mobile, and authenticate them against Aadhaar | CRT_ABHA_305 |
| After authentication, name, date of birth and gender are filled and read only. Address, email, mobile, state, district and the photo stay editable, and the person can complete the profile and go on | CRT_ABHA_305, CRT_ABHA_306 |
| Show the 14 digit ABHA number and the ABHA address created | CRT_ABHA_307 |
| The card from the API carries the ABHA number, the QR code, date of birth, gender and the ABHA address, the photo optional. A system that prints its own card prints the ABHA number and address, saved and linked to your beneficiary id | CRT_ABHA_308, CRT_ABHA_309 |

## How you know it worked

The profile completes with the three Aadhaar fields read only, and the card
or your own card carries the fields above.
