---
id: hiecm.endpoint.p1-switch-profile-verify
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Switch Profile Verify
summary: Completes a switch to another ABHA address and returns its session.
generated: true
operation: p2_post_v3_phr_app_login_profile_verify_switch_profile_user
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_verify_switch_profile_user.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_verify_switch_profile_user.mdx#p1-switch-profile-verify.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Switch Profile Verify

## In plain words

Completes a switch to another [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address). Send the `abhaAddress` the person chose and the `txnId` from the switch profile request, with that response's `token` in the `T-token` header. The response carries the session for the chosen address.

## How you know it worked

The response carries a `token` and a `refreshToken` for the chosen address. Replace the stored tokens with them.

## When it goes wrong

`ABDM-9999` with `User not found.` means no such address. `Invalid Transaction Id` means the `txnId` is wrong or has expired.
