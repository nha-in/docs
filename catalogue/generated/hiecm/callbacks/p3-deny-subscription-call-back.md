---
id: hiecm.callback.p3-deny-subscription-call-back
type: callback
gateway: hiecm
milestone: P3
version: abdm-v3
title: Subscription denied callback
summary: ABDM tells the requesting HIU that the person denied its subscription request.
generated: true
operation: p3_post_v3_hiu_subscription_requests_hiu_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_post_v3_hiu_subscription_requests_hiu_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_post_v3_hiu_subscription_requests_hiu_notify.mdx#p3-deny-subscription-call-back.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p3-subscription-request-hiu-on-notify
    - hiecm.endpoint.p3-deny-subscription-request
---

# Subscription denied callback

## In plain words

When the person denies your subscription request, ABDM posts it here with `notification.status` set to `DENIED`. `notification.reason` carries the person's reason.

## What happens

Acknowledge it with the subscription request on-notify call, quoting its `subscriptionRequestId`.

## How you know it worked

`notification.status` is `DENIED`. Expect no record notifications for this request.
