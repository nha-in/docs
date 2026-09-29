---
id: hiecm.endpoint.m1-enrolment-claim-abha-address
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Claim a chosen ABHA address
summary: Attaches the ABHA address the person chose to the ABHA number created earlier.
generated: true
operation: m1_post_v3_enrollment_enrol_abha_address_create_abha_aadhaar_otp
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_enrollment_enrol_abha_address_create_abha_aadhaar_otp.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_enrollment_enrol_abha_address_create_abha_aadhaar_otp.mdx#m1-enrolment-claim-abha-address.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-1170
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  flows:
    - hiecm.flow.m1-create-abha-aadhaar-otp
    - hiecm.flow.m1-create-abha-face-auth
---

# Claim a chosen ABHA address

## In plain words

Attaches the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) the person chose to the ABHA number created earlier in the same enrolment. Send the enrolment `txnId`, the `abhaAddress`, and `preferred` set to `1` to make it the address shown by default. It is the last call of the create journey.

## How you know it worked

A 200 that echoes the `abhaAddress` and `preferred` you sent.

## When it goes wrong

A 400 with `Invalid Preferred Flag` or `Invalid Transaction Id` names the refused field. A 401 with `900901` means the access token is missing or expired.
