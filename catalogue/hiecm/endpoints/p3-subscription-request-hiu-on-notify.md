---
id: hiecm.endpoint.p3-subscription-request-hiu-on-notify
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Acknowledge a subscription decision
summary: Tell ABDM you received the approve or deny notification for your
  subscription request.
generated: true
operation: p3_post_subscription_requests_v3_hiu_on_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_post_subscription_requests_v3_hiu_on_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_post_subscription_requests_v3_hiu_on_notify.mdx#p3-subscription-request-hiu-on-notify.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  callbacks:
    - hiecm.callback.p3-approve-subscription-request-call-back
    - hiecm.callback.p3-deny-subscription-call-back
---

# Acknowledge a subscription decision

## In plain words

Your answer to a subscription request notification. After ABDM tells you the person approved or denied your request, send this call so ABDM knows you received it.

## What happens

Send `status`, for example `OK`, and the notification's `subscriptionRequestId`, both in `acknowledgement`. Set `response.requestId` to the `REQUEST-ID` of the notification.

## How you know it worked

You receive `202`.

## When it goes wrong

`400` with `ABDM-1015` means the acknowledgement was rejected. Check the ids against the notification.
