---
id: hiecm.endpoint.m1-enrolment-address-suggestions
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get suggested ABHA addresses for a new account
summary: Returns available ABHA addresses built from the new account holder's details.
generated: true
operation: m1_get_v3_enrollment_enrol_suggestion_create_abha_aadhaar_otp
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_get_v3_enrollment_enrol_suggestion_create_abha_aadhaar_otp.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_get_v3_enrollment_enrol_suggestion_create_abha_aadhaar_otp.mdx#m1-enrolment-address-suggestions.
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
    - hiecm.flow.m1-create-abha-face-auth
---

# Get suggested ABHA addresses for a new account

## In plain words

After the [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number) is created, this returns available [ABHA addresses](/docs/hiecm/v3/getting-started/glossary#abha-address) built from the person's details. Offer them as choices, and let the person type their own instead. Send the enrolment `txnId` in the `TRANSACTION_ID` header. The suggestions come back in `abhaAddressList`.

## What happens

The next call claims the address the person chooses.

## When it goes wrong

`ABDM-1017` or `Invalid Transaction Id` means the `txnId` is wrong or stale. Send the latest `txnId` from this enrolment.
