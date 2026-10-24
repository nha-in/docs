---
id: hiecm.concept.m1-screens-create-abha-face-auth
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: create-abha-face-auth
title: What the screens of ABHA creation by face authentication must do
summary: >
  Consent and a valid Aadhaar come before the face authentication QR code, the
  screen waits for the status, shows a PID error as returned, and always
  verifies the communication mobile by OTP.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
related:
  concepts:
    - hiecm.concept.m1-screens-create-abha-aadhaar-otp
  flows:
    - hiecm.flow.m1-create-abha-face-auth
---

# What the screens of ABHA creation by face authentication must do

## In plain words

Your screen shows a QR code. The person scans it with the ABHA app, logged
out, and captures their face in the ABHA Face RD app on their own phone. Your
screen waits for the result, then carries on to the communication mobile.

## What happens

| Requirement | Cases |
|---|---|
| Creation offers face authentication as a method for Aadhaar based creation | CRT_ABHA_101_FA |
| An invalid Aadhaar number is refused on the screen with "Aadhaar Number is not valid", and no QR code is generated | CRT_ABHA_102_FA |
| The consent screen from create-abha-aadhaar-otp, with its language choice, comes before the QR code. No QR code until consent is in | CRT_ABHA_103_FA, CRT_ABHA_104_FA |
| Show the QR code clearly on your screen, with the instruction to scan it with the scanner on the ABHA app's logged out landing page | CRT_ABHA_105_FA |
| Wait for the face authentication status, polling `capturePID`, and move to the communication mobile only on success | CRT_ABHA_108_FA |
| A failed face authentication stops the journey and shows the PID error code and message the API returned. The person can retry, or a new QR code is generated | CRT_ABHA_109_FA |
| The communication mobile is always verified by OTP in this route, whether or not it is the Aadhaar linked one. The OTP and resend rules are in create-abha-aadhaar-otp | CRT_ABHA_110_FA, CRT_ABHA_111_FA, CRT_ABHA_112_FA |
| The address step, the profile, the card and a returning patient follow create-abha-aadhaar-otp, and the profile and card show the communication mobile verified here | CRT_ABHA_113_FA, CRT_ABHA_114_FA, CRT_ABHA_115_FA, CRT_ABHA_116_FA, CRT_ABHA_117_FA |
| Scanning the QR code and installing the ABHA Face RD app happen in the ABHA app on the patient's phone, and are judged on the case text there. Your product's part is the QR code and the instruction beside it | CRT_ABHA_106_FA, CRT_ABHA_107_FA |

## How you know it worked

The QR code appears only after consent and a valid Aadhaar, and the created
profile shows the mobile verified after face authentication.
