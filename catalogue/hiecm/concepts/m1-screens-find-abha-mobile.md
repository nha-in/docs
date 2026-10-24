---
id: hiecm.concept.m1-screens-find-abha-mobile
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: find-abha-mobile
title: What the screens of finding an ABHA by mobile must do
summary: >
  The mobile is checked on the screen, every ABHA on it is listed before any
  OTP, the OTP goes only to the chosen profile, and an ABHA already linked in
  your records opens a comparison screen.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
  - file: docs/superpowers/plans/2026-10-24-test-run-findings.md
    status: decided-2026-10-24
    note: Findings I5 and I8.
related:
  concepts:
    - hiecm.concept.m1-screens-login-abha-number
    - hiecm.concept.m1-avoiding-duplicate-abha
---

# What the screens of finding an ABHA by mobile must do

## In plain words

One mobile can hold several ABHAs. The search lists them for free, before
any OTP, so the person picks theirs first and the OTP goes to that one.

## What happens

| Requirement | Cases |
|---|---|
| The mobile field takes ten digits and nothing else. Anything else shows "Please enter a valid mobile number." and no search is sent | VRFY_ABHA_301 |
| Search first and list every ABHA on the mobile, each with enough to tell them apart: the masked ABHA number, the ABHA address and the name, as the search returns them | VRFY_ABHA_302 |
| No OTP is sent before a profile is chosen. Send OTP appears only after the choice, and the OTP request carries the chosen profile's `index` and the search's `txnId` | VRFY_ABHA_302, VRFY_ABHA_304 |
| The chosen profile stays chosen until the OTP verifies | VRFY_ABHA_304 |
| A mobile with no ABHA shows "ABHA details not found. We did not find any ABHA number linked to this mobile number. Please use an ABHA-linked mobile number.", offers to create an ABHA, and opens no OTP screen | VRFY_ABHA_303 |
| After the OTP verifies, open the chosen profile only, never another ABHA on the same mobile | VRFY_ABHA_305 |
| The profile fills the registration form under the read only rule in login-abha-number, and the ABHA number and address are linked to your beneficiary id | VRFY_ABHA_306 |
| A wrong OTP opens nothing and shows ABDM's message, under the OTP rules in create-abha-aadhaar-otp | VRFY_ABHA_307 |
| When the chosen ABHA is already linked in your records, show "This ABHA profile is already linked to HMIS Beneficiary ID." and a comparison screen: the details from the ABHA beside the details your record holds. No second registration is created | VRFY_ABHA_308 |

## How you know it worked

The list appears before any OTP, the OTP reaches only the chosen profile, and
running the same person twice opens the comparison screen the second time.

## When it goes wrong

- An OTP sent on the mobile before the list fails VRFY_ABHA_302 and 304.
- A second patient row for an already linked ABHA fails VRFY_ABHA_308.
