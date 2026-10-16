---
id: hiecm.endpoint.m1-profile-verify-otp
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Verify the OTP for a profile change
summary: Completes the profile change the OTP was raised for.
generated: true
operation: m1_post_v3_profile_account_verify_update_mobile
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_profile_account_verify_update_mobile.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_profile_account_verify_update_mobile.mdx#m1-profile-verify-otp.
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

# Verify the OTP for a profile change

## In plain words

Completes the change the [OTP](/docs/hiecm/v3/getting-started/glossary#otp) was raised for. Send the same `scope` you used to request it, the `txnId` and the encrypted OTP, with the person's `X-token`. For a mobile change, success updates the mobile number on the [ABHA](/docs/hiecm/v3/getting-started/glossary#abha).

## How you know it worked

A 200 with `authResult` `success`.

## When it goes wrong

A 400 names the refused part, such as `Invalid Transaction Id` or `Invalid OTP Value`. A 401 with `X-token expired` means refresh the token and retry. A 422 means Aadhaar refused the request.
