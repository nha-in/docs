---
id: hiecm.concept.m1-screens-scan-and-share
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: scan-and-share
title: Registering a patient from a profile shared at the counter
summary: >
  A shared profile registers a new patient with no click and no typing, a
  returning patient is matched on five fields, and a second scan follows the
  queue rules.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
  - file: docs/superpowers/plans/2026-10-24-test-run-findings.md
    status: decided-2026-10-24
    note: Finding I10, and the registration rule for SHARE_PATIENT_PROFILE_701 and 702 agreed on 24 October 2026.
related:
  concepts:
    - hiecm.concept.scan-and-register-qr
    - hiecm.concept.m1-screens-link-one-abha-per-patient
---

# Registering a patient from a profile shared at the counter

## In plain words

The patient scans the counter QR code in their PHR app and agrees to share.
The profile reaches your bridge on `/api/v3/hip/patient/share`, and your
answer on `on-share` carries their token. Everything your registration needs
is in that profile, so nobody at the counter types anything.

## What happens

| Requirement | Cases |
|---|---|
| A new patient is registered from the shared profile automatically, with no click and no data entry, and gets a token in the `on-share` answer | SHARE_PATIENT_PROFILE_701 |
| The token is the one the patient's app shows; the case expects a token valid for 60 minutes | SHARE_PATIENT_PROFILE_701 |
| Match a returning patient on name, mobile, gender, ABHA number and ABHA address against your records | SHARE_PATIENT_PROFILE_702 |
| A certain match registers automatically under the existing beneficiary id, and the visit's care context is created under it | SHARE_PATIENT_PROFILE_702 |
| An uncertain match may take one confirmation from the operator, a single choice on the screen. Never any typing | SHARE_PATIENT_PROFILE_702 |
| No match: a new beneficiary id is created, as for a new patient | SHARE_PATIENT_PROFILE_702 |
| The same person sharing a different ABHA address of theirs updates the ABHA address on the existing beneficiary id. No new id | SHARE_PATIENT_PROFILE_702 |
| The same QR code, the same ABHA address and an active queue entry: no new queue entry. Only a new token number may be issued under your queue rules, and the existing queue association stays as it was | SHARE_PATIENT_PROFILE_702 |
| The QR code of a different counter or queue: a new queue entry for that queue, with the same patient details and a new token number for it | SHARE_PATIENT_PROFILE_702 |

## How you know it worked

A first scan leaves one new patient and a token, with no screen touched at
the counter. A second scan by the same person leaves the same single patient
row, and the queue entries the rules above name.

## When it goes wrong

- An operator who has to confirm every new registration fails the no click
  rule on SHARE_PATIENT_PROFILE_701.
- A second beneficiary id for a returning patient fails
  SHARE_PATIENT_PROFILE_702.
