---
id: hiecm.callback.p3-subscription-hiu-notify
type: callback
gateway: hiecm
milestone: P3
version: abdm-v3
title: New record notification callback
summary: Under a granted subscription, ABDM tells the HIU each time a care
  context is linked or updated for the person.
generated: true
operation: p3_post_v3_hiu_subscription_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_post_v3_hiu_subscription_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_post_v3_hiu_subscription_notify.mdx#p3-subscription-hiu-notify.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p3-subscribe-and-auto-approve
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p3-subscription-hiu-on-notify
    - hiecm.endpoint.p3-subscription-init
---

# New record notification callback

## In plain words

Once a subscription is granted, ABDM posts here each time a care context is linked or updated for the person. `event.category` is `LINK` or `DATA`. `event.content` names the person, the facility and the care contexts, with their HI type.

## What happens

`subscriptionId` in `event` says which subscription the event belongs to. Acknowledge each event with the care context on-notify call, quoting the event's `id` as `eventId`.

## How you know it worked

Answer with `200`, then send the on-notify call for the event.
