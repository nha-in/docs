---
id: hiecm.concept.m1-screens-find-abha-benefit
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
functionality: find-abha-benefit
title: What the screen of benefits linked to an ABHA must show
summary: For government entities, the benefit programmes linked to an ABHA number, as the call returns them.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx
    status: nha-2026-10-22
    note: Each requirement cites the case whose Expected Result, Steps or tester note it comes from.
related:
  concepts:
    - hiecm.concept.m1-screens-login-abha-number
---

# What the screen of benefits linked to an ABHA must show

## In plain words

A government entity can list the benefit programmes an ABHA number is
enrolled in.

## What happens

| Requirement | Cases |
|---|---|
| Given a valid ABHA number, show the list of benefit programmes the call returns for it | VRFY_ABHA_701 |

## How you know it worked

The list on screen matches the programmes in the response.
