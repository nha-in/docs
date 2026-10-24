---
id: hiecm.concept.m1-screens-login-abha-number
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: login-abha-number
title: What the screens of login with an ABHA number must do
summary: >
  Both ABHA number login routes are built, the profile fills a registration
  form whose name, date of birth and gender are read only, and a changed mobile
  can be pushed to the ABHA profile.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
  - file: docs/superpowers/plans/2026-10-24-test-run-findings.md
    status: decided-2026-10-24
    note: Findings I1, I2 and I7.
related:
  concepts:
    - hiecm.concept.m1-screens-create-abha-aadhaar-otp
    - hiecm.concept.m1-deployment-interview
---

# What the screens of login with an ABHA number must do

## In plain words

An ABHA number can be verified two ways, by an OTP to the Aadhaar linked
mobile and by an OTP to the mobile linked to the ABHA. Both are mandatory for
every entity type, so both are built. The profile they return fills your
registration form, and the fields that came from Aadhaar cannot be changed on
your screen.

## What happens

| Requirement | Cases |
|---|---|
| Build both routes: ABHA number with Aadhaar OTP, and ABHA number with the ABHA linked mobile OTP. The deployment interview never switches either off, because a journey a mandatory case needs is not optional | VRFY_ABHA_101, VRFY_ABHA_201 |
| After the OTP verifies, fetch the profile and fill your registration form from it: name, date of birth, gender, mobile, photo, address, state, district, ABHA number and ABHA address. Nobody types what the profile holds | VRFY_ABHA_101, VRFY_ABHA_201 |
| On any form filled from an ABHA, name, date of birth and gender are read only. Address, email, mobile, state, district and city stay editable. This holds for every M1 route that fills the form | VRFY_ABHA_101, VRFY_ABHA_201, VRFY_ABHA_102, VRFY_ABHA_202, VRFY_ABHA_306 |
| Save what was fetched and link the ABHA number and ABHA address to your own beneficiary id | VRFY_ABHA_101, VRFY_ABHA_201 |
| When the mobile in your record differs from the one on the ABHA profile, offer a Yes or No choice to update the ABHA profile's mobile. Yes runs the update mobile calls with this login's `X-token` | VRFY_ABHA_101, VRFY_ABHA_201 |
| A wrong OTP keeps the transaction and the right one then succeeds, and resend follows the shared rule: both are under Screen requirements in create-abha-aadhaar-otp | VRFY_ABHA_101, VRFY_ABHA_201 |
| A non-KYC ABHA address cannot download a card. Say so on the screen rather than offering a download that fails | VRFY_ABHA_101, VRFY_ABHA_201 |

## How you know it worked

Both routes reach a filled registration form, the three Aadhaar fields cannot
be edited, and the saved patient carries the ABHA number and address.

## When it goes wrong

- Only one route built: the other case has no screen to run on.
- Name, gender or date of birth editable after the fill fails VRFY_ABHA_101.
