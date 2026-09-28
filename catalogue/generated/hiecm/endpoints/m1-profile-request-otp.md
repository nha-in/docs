---
id: hiecm.endpoint.m1-profile-request-otp
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Send an OTP to change something on the profile
summary: Raises the OTP for a profile change by a signed in person, such as a
  new mobile number or re-KYC.
generated: true
operation: m1_post_v3_profile_account_request_otp_update_mobile
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_profile_account_request_otp_update_mobile.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_profile_account_request_otp_update_mobile.mdx#m1-profile-request-otp.
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

# Send an OTP to change something on the profile

## In plain words

Raises the [OTP](/docs/hiecm/v3/getting-started/glossary#otp) for a change a signed in person makes to their [ABHA](/docs/hiecm/v3/getting-started/glossary#abha). `scope` names the change:

- `["abha-profile", "mobile-verify"]` changes the mobile number. `loginId` is the new number, encrypted, and the OTP goes to it.
- `["abha-profile", "re-kyc"]` repeats Aadhaar [KYC](/docs/hiecm/v3/getting-started/glossary#kyc). The OTP goes to the mobile linked with Aadhaar.

Send the person's `X-token`. The response carries the `txnId` for the verify call.

## Before you start

The person's `X-token`, sent as `Bearer <token>`. Encrypt `loginId` with the public certificate key.

## When it goes wrong

A 400 names the refused part: `Invalid Scope`, `Invalid LoginId`, `Invalid Login Hint` or `Invalid X-token`. A 400 also comes back when the new mobile number is already verified on the account.
