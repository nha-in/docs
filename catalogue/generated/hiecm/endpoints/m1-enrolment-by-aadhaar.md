---
id: hiecm.endpoint.m1-enrolment-by-aadhaar
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Create an ABHA from a verified Aadhaar OTP
summary: Verifies the Aadhaar OTP and creates the ABHA number, or returns the
  one already linked to that Aadhaar.
generated: true
operation: m1_post_v3_enrollment_enrol_byaadhaar_otp
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_enrollment_enrol_byaadhaar_otp.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_enrollment_enrol_byaadhaar_otp.mdx#m1-enrolment-by-aadhaar.
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
    - hiecm.flow.m1-create-abha-aadhaar-otp
    - hiecm.flow.m1-create-abha-face-auth
---

# Create an ABHA from a verified Aadhaar OTP

## In plain words

Verifies the Aadhaar [OTP](/docs/hiecm/v3/getting-started/glossary#otp) and creates the [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number). Send the `txnId` from the OTP request, the encrypted OTP, the mobile number to link, and the consent block recording that the person agreed.

If an ABHA already exists for that Aadhaar, the call returns it instead of creating a second one, and `isNew` is false. The response carries the profile and the person's `X-token` in `tokens.token`.

## Before you start

The `txnId` from the Aadhaar OTP request. Send `consent` with `code` `abha-enrollment` and `version` `1.4`. Send `BENEFIT_NAME` only when the person enrols through a benefit programme.

## What happens

When `mobile` is not the mobile linked with Aadhaar, verify it next with the enrolment OTP call and `mobile-verify`.

## How you know it worked

A 200 with `ABHAProfile` and `tokens`, and `isNew` true for a new account.

## When it goes wrong

A 400 names the refused field, such as `Invalid Transaction Id` or `Invalid Mobile Number`. A 422 means Aadhaar or a business rule refused the request, for example a wrong OTP. A 401 with `ABDM-1021` means your integration lacks the privilege, often an unapproved `BENEFIT_NAME`.
