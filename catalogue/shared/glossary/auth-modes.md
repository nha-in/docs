---
id: shared.glossary.auth-modes
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: Auth modes, the four ways a patient proves who they are
summary: >
  MOBILE_OTP, AADHAAR_OTP, DEMOGRAPHICS and DIRECT. Which are available
  is a property of the patient, so you ask before you choose.
sources:
  - url: https://sandbox.abdm.gov.in/sandbox/v3/faq
    status: docs-only
    note: >
      NHA's sandbox FAQ, question on the different fetch modes available,
      which enumerates all four and describes each.
verified:
  status: unverified
  against: docs-only
related:
  glossary: [shared.glossary.abha-address, shared.glossary.hip]
  concepts: [hiecm.concept.input-encryption]
---

# Auth modes, the four ways a patient proves who they are

## In plain words

Before records can be linked to a patient, the patient has to be
authenticated. ABDM offers four ways, and which of them are on for a
given patient is not something you get to decide. You ask ABDM which
modes that person supports, then pick from what comes back.

## Before you start

Nothing, though the sequence makes more sense if you know that linking
runs through the consent manager rather than directly against the
patient.

## What happens

NHA's four modes:

| Mode | What it means |
|---|---|
| `MOBILE_OTP` | Authentication starts with the user's registered mobile number |
| `AADHAAR_OTP` | Authentication starts with the mobile registered against Aadhaar |
| `DEMOGRAPHICS` | The provider sends the user's details exactly as registered with the ABHA number system |
| `DIRECT` | A direct means of authentication with the user |

The two OTP modes look alike and are not. `MOBILE_OTP` uses the number
the person registered with ABDM. `AADHAAR_OTP` uses whichever number is
attached to their Aadhaar, which is often a different number and is
sometimes no number at all.

`DEMOGRAPHICS` is the strictest of the four. The word NHA uses is
"exactly": the details you send have to match the ABHA record rather than
merely resemble it, so a name spelled differently or a date of birth in
another format fails.

You discover which modes apply by asking, through the fetch modes call,
and the answer arrives on your callback like every other asynchronous
reply in M2 and M3.

## How you know it worked

You never hardcode a mode. Your flow asks which are supported, offers the
user only those, and copes with a patient for whom the mode you would
have preferred is unavailable.

## When it goes wrong

Assuming Aadhaar OTP is always available. A person whose Aadhaar carries
no mobile number cannot receive one, which is why the other modes exist.

Treating `DEMOGRAPHICS` as fuzzy matching. It is not, and a near miss
reads as a failed authentication rather than as a data quality warning.
