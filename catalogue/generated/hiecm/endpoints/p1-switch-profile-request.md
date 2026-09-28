---
id: hiecm.endpoint.p1-switch-profile-request
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Switch Profile Request
summary: Lists the other ABHA addresses a signed in person can switch to.
generated: true
operation: p2_get_v3_phr_app_login_profile_switch_profile
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_v3_phr_app_login_profile_switch_profile.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_v3_phr_app_login_profile_switch_profile.mdx#p1-switch-profile-request.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Switch Profile Request

## In plain words

A person who signs in with a mobile or [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number) can hold several [ABHA addresses](/docs/hiecm/v3/getting-started/glossary#abha-address), some verified against their identity and some not. This call lists the addresses they can switch to in `users`, each with its `kycStatus`. Send the user token in `X-token`.

## How you know it worked

The response carries a `txnId`, the `users` list, and `tokens` with a short lived `token`: `expiresIn` is `300` and `refreshToken` is `null`. Use both in the switch profile verify call.
