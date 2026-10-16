---
id: hiecm.endpoint.m1-enrolment-request-otp
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Send an OTP to begin or continue an enrolment
summary: Starts an Aadhaar OTP enrolment, or sends the OTP that verifies a
  mobile or email after it.
generated: true
operation: m1_post_v3_enrollment_request_otp_aadhaar_otp
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_enrollment_request_otp_aadhaar_otp.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_enrollment_request_otp_aadhaar_otp.mdx#m1-enrolment-request-otp.
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

# Send an OTP to begin or continue an enrolment

## In plain words

The first call of Aadhaar [OTP](/docs/hiecm/v3/getting-started/glossary#otp) enrolment, and the call you use again to verify a mobile number or email address afterwards. What it does depends on `scope`, `loginHint` and `otpSystem`.

- **Starting an enrolment.** `scope` is `["abha-enrol"]`, `loginHint` is `aadhaar`, `loginId` is the encrypted Aadhaar number and `otpSystem` is `aadhaar`. The OTP goes to the mobile number linked with Aadhaar.
- **Verifying a mobile or email after the ABHA is created.** `scope` adds `mobile-verify` or `email-verify`, `loginHint` is `mobile` or `email`, and `otpSystem` is `abdm`. Send the `txnId` from the create call.

`loginId` is always encrypted, never the raw value.

## Before you start

Encrypt `loginId` with the key and `encryptionAlgorithm` from the public certificate call.

## How you know it worked

A 200 with a `txnId` and a message saying where the OTP went.

## When it goes wrong

A 400 names the refused field: `Invalid Scope`, `Invalid LoginId` or `Invalid Login Hint`. On `Invalid LoginId`, check the encryption before the value itself.
