---
id: hiecm.endpoint.m1-profile-get-account
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Read the signed in person's ABHA profile
summary: Returns the full ABHA profile of the person whose X-token you send.
generated: true
operation: m1_get_v3_profile_account
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_get_v3_profile_account.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_get_v3_profile_account.mdx#m1-profile-get-account.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.900900
    - hiecm.error.abdm-2401
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  flows:
    - hiecm.flow.m1-update-mobile
---

# Read the signed in person's ABHA profile

## In plain words

Returns the full [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) profile of the person whose `X-token` you send. It covers name, date of birth, gender, mobile, address with state and district codes, [KYC](/docs/hiecm/v3/getting-started/glossary#kyc) status and preferred ABHA address. It needs the person's token, not only yours, because it reads one person's account.

## Before you start

The person's `X-token` from login or enrolment, sent as `Bearer <token>`.

## When it goes wrong

A 400 with `Invalid X-token` means the token is missing, wrong or expired: refresh it or sign in again. A 404 with `ABDM-1030` means the `REQUEST-ID` was refused: send a fresh one.
