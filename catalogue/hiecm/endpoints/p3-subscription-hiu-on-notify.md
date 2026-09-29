---
id: hiecm.endpoint.p3-subscription-hiu-on-notify
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Acknowledge a new record notification
summary: Tell ABDM you received a new record notification under a subscription.
generated: true
operation: p3_post_subscription_requests_v3_hiu_care_context_on_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_post_subscription_requests_v3_hiu_care_context_on_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_post_subscription_requests_v3_hiu_care_context_on_notify.mdx#p3-subscription-hiu-on-notify.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  callbacks:
    - hiecm.callback.p3-subscription-hiu-notify
---

# Acknowledge a new record notification

## In plain words

Your answer to a new record notification. After ABDM tells you a care context was linked or updated under a subscription, send this call, quoting the event's id in `acknowledgement.eventId`.

## What happens

Send `status`, for example `OK`, and `eventId` set to the event's `id`, both in `acknowledgement`. Set `response.requestId` to the `REQUEST-ID` of the notification.

## How you know it worked

You receive `202`.

## When it goes wrong

`400` with `ABDM-1015` means the acknowledgement was rejected. Check `acknowledgement.eventId` against the notification.
