---
id: hiecm.endpoint.m1-enrolment-verify-abdm-otp
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Verify an OTP that ABDM sent, during enrolment
summary: Confirms the mobile number or email address given during enrolment and
  links it to the new ABHA.
generated: true
operation: m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_091285
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_091285.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_091285.mdx#m1-enrolment-verify-abdm-otp.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  flows:
    - hiecm.flow.m1-create-abha-aadhaar-otp
---

# Verify an OTP that ABDM sent, during enrolment

## In plain words

Confirms the mobile number or email address the person gave during enrolment, and links it to the new [ABHA](/docs/hiecm/v3/getting-started/glossary#abha). The [OTP](/docs/hiecm/v3/getting-started/glossary#otp) came from [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm), not from Aadhaar, which is why this call is separate from the create call. Send the same `scope` you used to request it, the `txnId` and the encrypted OTP.

## How you know it worked

A 200 with `authResult` `success`. A 200 can also carry `authResult` `failed` with an expired OTP message, so read `authResult` and not the status alone.

## When it goes wrong

A 400 names the refused part: `Invalid Transaction Id`, `Invalid Scope`, `Invalid Auth Method` or `Invalid OTP value`. For an expired OTP, request a new one and verify again.
