---
id: hiecm.concept.m1-screens-create-abha-driving-licence
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: create-abha-driving-licence
title: What the screens of ABHA creation by driving licence must do
summary: >
  The screens of creation with a document other than Aadhaar: consent, the
  mobile, the licence details and photos, and an operator's approval.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
  - url: https://sandboxcms.abdm.gov.in/uploads/Consent_Language_ABDM_1_25c394153b.png
    status: published-2026-10-24
    note: The second declaration of the approved consent language leads to creation with a document other than Aadhaar.
related:
  concepts:
    - hiecm.concept.m1-screens-create-abha-aadhaar-otp
---

# What the screens of ABHA creation by driving licence must do

## In plain words

The person creates an ABHA with a driving licence instead of Aadhaar, and an
operator checks the document. The enrolment by document call is not in the
published M1 specification, so these screens can be built and judged, and the
calls behind them cannot be made yet.

## What happens

| Requirement | Cases |
|---|---|
| Creation offers the driving licence as a method | CRT_ABHA_401 |
| The consent screen from create-abha-aadhaar-otp, where the declaration about a document other than Aadhaar is the one that leads here | CRT_ABHA_402 |
| Take the communication mobile and verify it by OTP | CRT_ABHA_403, CRT_ABHA_404 |
| Take the licence number with the name, date of birth and gender as the document shows them | CRT_ABHA_405 |
| Upload a photo of the front and of the back of the licence | CRT_ABHA_406 |
| An operator checks the documents and approves or rejects the creation | CRT_ABHA_407 |
| Show the 14 digit number as the ABHA number, never as a Health ID | CRT_ABHA_408 |
| Show the ABHA card, or print the ABHA number and address on your own card, saved and linked to your beneficiary id | CRT_ABHA_410, CRT_ABHA_411 |

## How you know it worked

Each screen above exists and holds what its case names.
