---
id: hiecm.endpoint.m1-find-abha-search
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Find an ABHA for somebody who does not know theirs
summary: Lists the ABHA accounts held against an encrypted mobile number, to
  start Find ABHA.
generated: true
operation: m1_post_v3_profile_account_abha_search_find_abha_mobile_otp
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_profile_account_abha_search_find_abha_mobile_otp.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_profile_account_abha_search_find_abha_mobile_otp.mdx#m1-find-abha-search.
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
    - hiecm.flow.m1-find-abha
---

# Find an ABHA for somebody who does not know theirs

## In plain words

The first step of Find [ABHA](/docs/hiecm/v3/getting-started/glossary#abha). Send the person's encrypted mobile number with `scope` set to `["search-abha"]`. The response carries a `txnId` and the accounts held against that number. Each account shows a masked ABHA number, name, gender and the sign in methods it allows. Let the person pick an account, then send an [OTP](/docs/hiecm/v3/getting-started/glossary#otp) or start a biometric check to continue.

## Before you start

Encrypt the mobile number with the key from the public certificate call. Only the encrypted value is accepted.

## When it goes wrong

A 400 with `Invalid mobile number` means the value was refused. A 404 with `ABDM-1114` means no account holds that number.
