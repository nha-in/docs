---
id: hiecm.endpoint.m1-profile-update-account
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Update fields on an ABHA profile
summary: Changes the name, date of birth and gender on a child ABHA, or the
  photo on any signed in account.
generated: true
operation: m1_patch_v3_profile_account_child_child_abha
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_patch_v3_profile_account_child_child_abha.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_patch_v3_profile_account_child_child_abha.mdx#m1-profile-update-account.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.900900
    - hiecm.error.abdm-1013
    - hiecm.error.abdm-2401
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Update fields on an ABHA profile

## In plain words

Changes the details on a child [ABHA](/docs/hiecm/v3/getting-started/glossary#abha): name, date of birth and gender, sent with the child's `abhaNumber`. A child ABHA without [KYC](/docs/hiecm/v3/getting-started/glossary#kyc) can be updated only once. The same path with `profilePhoto` updates the photo on any signed in account.

A mobile number is not changed here. It goes through the profile OTP calls, so the new number is verified first.

## Before you start

The `X-token` from the child ABHA creation response, and your approved `BENEFIT_NAME`.

## When it goes wrong

A 422 with `ABDM-1160` means a child ABHA without KYC was already updated once. A 400 with `Please provide a valid field to update` means the body named nothing the call can change. A 401 with `ABDM-1021` means your integration lacks the privilege. A 404 with `ABDM-1114` means no such account.
