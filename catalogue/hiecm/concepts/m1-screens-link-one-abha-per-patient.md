---
id: hiecm.concept.m1-screens-link-one-abha-per-patient
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: link-one-abha-per-patient
title: One ABHA number is linked to one patient id
summary: >
  Before a patient id is created, your records are checked for the ABHA
  number, so one ABHA number is never tagged to two patient ids.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
related:
  concepts:
    - hiecm.concept.m1-avoiding-duplicate-abha
---

# One ABHA number is linked to one patient id

## In plain words

No ABDM call decides this. It is a check on your own records, run every time
an ABHA reaches registration, by creation or by verification.

## What happens

| Requirement | Cases |
|---|---|
| Before creating a patient id, look up the ABHA number in your records | TAGGING_UNIQUEPATIENTID_UNIQUEABHANUMBER |
| Not found: tag the ABHA number to the new patient id | TAGGING_UNIQUEPATIENTID_UNIQUEABHANUMBER |
| Found: open the existing patient id and create no new one | TAGGING_UNIQUEPATIENTID_UNIQUEABHANUMBER |

## How you know it worked

Registering the same ABHA number twice, once by creation and once by a login,
leaves one patient id carrying it.
