---
id: hiecm.callback.m2-call-back-api-for-notify-care-context-update
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: Call back API for notify care context update
summary: ABDM answers a care context update notification on the HIP's bridge.
generated: true
operation: m2_post_v3_links_context_on_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_links_context_on_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_links_context_on_notify.mdx#m2-call-back-api-for-notify-care-context-update.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
---

# Call back API for notify care context update

## In plain words

After you [notify a care context update](/docs/hiecm/v3/api/m2/endpoints/m2-abdm-hip-initiated-linking-hip/02-m2-post-hip-v3-link-context-notify), ABDM answers on your bridge at `/api/v3/links/context/on-notify`. The path is relative to the callback URL you registered, not to an ABDM host.

## Before you start

A callback URL registered for your bridge and reachable from the public internet.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIP-ID` headers. The body carries `acknowledgement`, `response` and, on failure, `error`.

## When it goes wrong

`ABDM-1006` (Bad Request, invalid request Body): fix the notify request before you send it again.
