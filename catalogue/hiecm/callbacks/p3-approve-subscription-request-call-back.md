---
id: hiecm.callback.p3-approve-subscription-request-call-back
type: callback
gateway: hiecm
milestone: P3
version: abdm-v3
title: Subscription approved callback
summary: ABDM tells the requesting HIU that the person approved its subscription
  request.
generated: true
operation: p3_post_v3_hiu_subscription_requests_hiu_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_post_v3_hiu_subscription_requests_hiu_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_post_v3_hiu_subscription_requests_hiu_notify.mdx#p3-approve-subscription-request-call-back.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p3-subscription-request-hiu-on-notify
    - hiecm.endpoint.p3-approve-subscription-request
---

# Subscription approved callback

## In plain words

When the person approves your subscription request, ABDM posts it here with `notification.status` set to `GRANTED`. `notification.subscription` holds what the person granted, including the subscription id.

## What happens

Acknowledge it with the subscription request on-notify call, quoting its `subscriptionRequestId`.

## How you know it worked

`notification.status` is `GRANTED` and the granted subscription carries an `id`. Store it: record notifications quote it as `subscriptionId`.
