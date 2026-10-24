---
id: hiecm.concept.m1-screens-login-aadhaar-otp
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: login-aadhaar-otp
title: What the screens of login with Aadhaar OTP must do
summary: >
  The Aadhaar is checked on the screen, the OTP screen names the masked mobile
  from the response, an Aadhaar with no ABHA leads to creation, and one with an
  ABHA shows the profile and the card.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
  - file: docs/superpowers/plans/2026-10-24-test-run-findings.md
    status: decided-2026-10-24
    note: Finding I11.
related:
  concepts:
    - hiecm.concept.m1-screens-create-abha-aadhaar-otp
---

# What the screens of login with Aadhaar OTP must do

## In plain words

Logging in with an Aadhaar number answers two questions at once: does this
person hold an ABHA, and if so, which. Both answers have a screen.

## What happens

| Requirement | Cases |
|---|---|
| The Aadhaar field follows the rule in create-abha-aadhaar-otp: 12 digits, a refusal on the screen, no call, the number masked once entered | VRFY_ABHA_401 |
| Where this route asks for consent, it shows the published consent screen from create-abha-aadhaar-otp | VRFY_ABHA_401 |
| The OTP screen says where the OTP went, as the case's steps write it: "OTP sent to Aadhaar linked mobile number ending with ******XXXX", with the last digits the `request/otp` response carries. A screen that names no mobile fails the case | VRFY_ABHA_403, VRFY_ABHA_404 |
| A wrong OTP stops progress and shows ABDM's message, under the OTP rules in create-abha-aadhaar-otp | VRFY_ABHA_402 |
| No ABHA on the Aadhaar shows a clear message, such as "NO ABHA user registered with this Aadhaar Number", and offers to create one. Creation carries on from what this screen already holds and never asks for the Aadhaar again | VRFY_ABHA_403 |
| An ABHA on the Aadhaar shows the profile, lets the person download the card, and offers to register and link it to your beneficiary id | VRFY_ABHA_404 |
| Resend follows the shared rule in create-abha-aadhaar-otp, including the message on the third attempt | VRFY_ABHA_405 |

## How you know it worked

The masked mobile on the OTP screen matches the response's `message`, and
both outcomes, ABHA and no ABHA, end on a screen that offers the next step.

## When it goes wrong

- An OTP screen with no masked mobile fails VRFY_ABHA_404.
- "No ABHA" as a dead end, with no offer to create, fails VRFY_ABHA_403.
