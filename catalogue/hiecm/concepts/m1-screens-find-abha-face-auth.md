---
id: hiecm.concept.m1-screens-find-abha-face-auth
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: find-abha-face-auth
title: What the screens of finding an ABHA by mobile with face authentication must do
summary: The profile list comes before any QR code, the QR code is for the chosen profile, and only that profile opens.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
related:
  concepts:
    - hiecm.concept.m1-screens-find-abha-mobile
    - hiecm.concept.m1-screens-create-abha-face-auth
---

# What the screens of finding an ABHA by mobile with face authentication must do

## In plain words

The same search as finding an ABHA by mobile, with face authentication in
place of the OTP.

## What happens

| Requirement | Cases |
|---|---|
| The mobile check and the list follow find-abha-mobile, and an invalid mobile starts neither a search nor a QR code | VRFY_ABHA_301_FA, VRFY_ABHA_302_FA |
| No face authentication QR code before a profile is chosen | VRFY_ABHA_302_FA |
| A mobile with no ABHA shows the not found message from find-abha-mobile, offers creation, and generates no QR code | VRFY_ABHA_303_FA |
| Choosing a profile generates the QR code for that profile, and the choice holds until authentication completes | VRFY_ABHA_304_FA |
| After success, open the chosen profile only | VRFY_ABHA_307_FA, VRFY_ABHA_308_FA |
| A failure shows the PID error from the API, fills nothing, and allows a retry or a new QR code | VRFY_ABHA_309_FA |
| The scan and the ABHA Face RD install for a chosen profile happen in the ABHA app on the patient's phone, judged on the case text there; your screen shows the QR code for the chosen profile | VRFY_ABHA_305_FA, VRFY_ABHA_306_FA |

## How you know it worked

The QR code follows the choice of profile, and the profile that opens is the
one chosen.
