---
id: hiecm.concept.m1-screens-login-abha-address
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: login-abha-address
title: What the screens of login with an ABHA address must do
summary: >
  The login methods come from the address search, never from a fixed list,
  and the profile fills the same read only registration form as an ABHA
  number login.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
  - file: docs/superpowers/plans/2026-10-24-test-run-findings.md
    status: decided-2026-10-24
    note: Finding I6.
related:
  concepts:
    - hiecm.concept.m1-screens-login-abha-number
---

# What the screens of login with an ABHA address must do

## In plain words

An ABHA address does not carry every login method. The search for the address
says which ones it offers, and the screen shows those and no others.

## What happens

| Requirement | Cases |
|---|---|
| Search the address first. Offer exactly the methods the search response lists in `authMethods`, and nothing your system decided in advance | VRFY_ABHA_102, VRFY_ABHA_202 |
| A method the search does not list is not shown, even when your screen has a route for it | VRFY_ABHA_102 |
| The fetched profile fills the registration form under the read only rule in login-abha-number, and is saved and linked to your beneficiary id | VRFY_ABHA_102, VRFY_ABHA_202 |
| The Yes or No offer to update the mobile is shown when your record's mobile differs. No published call updates the mobile with an ABHA address login's token, so never show the update as done unless an update call returned success | VRFY_ABHA_102, VRFY_ABHA_202 |
| The OTP, wrong OTP and resend rules are under Screen requirements in create-abha-aadhaar-otp | VRFY_ABHA_102, VRFY_ABHA_202 |

## How you know it worked

The methods on screen match `authMethods` from the search for the address
the tester entered, and the form fills read only from the profile.

## When it goes wrong

- Methods typed into the screen fail VRFY_ABHA_102 the first time an address
  offers fewer of them.
