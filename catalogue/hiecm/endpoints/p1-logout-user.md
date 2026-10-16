---
id: hiecm.endpoint.p1-logout-user
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Logout User
summary: Ends the session of the person signed in.
generated: true
operation: p2_get_v3_phr_app_login_profile_request_logout
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_v3_phr_app_login_profile_request_logout.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_v3_phr_app_login_profile_request_logout.mdx#p1-logout-user.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Logout User

## In plain words

Ends the session of the person signed in to a [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app, identified by the user token in `X-token`. The call takes no body. Discard the stored tokens afterwards.

## How you know it worked

`message` is `You have been logged out`.

## When it goes wrong

A `401` with `900902` and `Missing Credentials` means the token header is missing.
