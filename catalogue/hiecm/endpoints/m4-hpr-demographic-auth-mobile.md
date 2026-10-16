---
id: hiecm.endpoint.m4-hpr-demographic-auth-mobile
type: endpoint
gateway: hiecm
milestone: M4
version: abdm-v3
title: Check whether the mobile number is the one on the Aadhaar record
summary: Tells you whether the professional's mobile number matches their
  Aadhaar record, which decides whether it needs its own OTP.
generated: true
operation: m4_post_v2_registration_aadhaar_demographicauthviamobile
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m4_post_v2_registration_aadhaar_demographicauthviamobile.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m4_post_v2_registration_aadhaar_demographicauthviamobile.mdx#m4-hpr-demographic-auth-mobile.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.m4-create-hpid
  concepts:
    - hiecm.concept.gateway-session
---

# Check whether the mobile number is the one on the Aadhaar record

## In plain words

Checks the mobile number a healthcare professional gave against their Aadhaar record, inside the Aadhaar transaction `txnId`. The answer decides whether the number needs its own one time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) before the [HPID](/docs/hiecm/v3/getting-started/glossary#hpid) is created. The response field is `verified`.

## Before you start

The `txnId` of the Aadhaar transaction from the earlier steps, and the professional's `mobileNumber`.

## How you know it worked

The response carries `verified`. `true` means the number matches the Aadhaar record, and the mobile OTP steps are skipped. `false` means generate and verify a mobile OTP with the generate and verify mobile OTP calls before you create the HPID.
