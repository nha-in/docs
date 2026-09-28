---
id: hiecm.endpoint.p1-get-user-profile
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Get User Profile
summary: Returns the profile of the person signed in, identified by their user token.
generated: true
operation: p2_get_v3_phr_app_login_profile
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_v3_phr_app_login_profile.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_v3_phr_app_login_profile.mdx#p1-get-user-profile.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Get User Profile

## In plain words

Returns the profile of the person signed in to a [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app, identified by the user token in `X-token` and `X-AUTH-TOKEN`. Use it to show the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address), the name, the masked mobile number, the linked [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number) and the `kycStatus`.

## How you know it worked

The response carries `abhaAddress`, `fullName`, `mobile`, `abhaNumber`, `authMethods`, `status` and `kycStatus`.

## When it goes wrong

A `401` with `900902` and `Missing Credentials` means a token header is missing.
