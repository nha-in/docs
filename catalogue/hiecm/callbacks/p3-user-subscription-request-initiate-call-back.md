---
id: hiecm.callback.p3-user-subscription-request-initiate-call-back
type: callback
gateway: hiecm
milestone: P3
version: abdm-v3
title: Subscription request result callback
summary: ABDM posts the id of the subscription request you raised, or the error
  that stopped it.
generated: true
operation: p3_post_v3_hiu_hiecm_subscription_requests_on_init
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_post_v3_hiu_hiecm_subscription_requests_on_init.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_post_v3_hiu_hiecm_subscription_requests_on_init.mdx#p3-user-subscription-request-initiate-call-back.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p3-subscription-init
---

# Subscription request result callback

## In plain words

ABDM posts the result of your subscription request here. On success, `subscriptionRequest.id` is the id of the request now waiting for the person's decision.

## What happens

`response.requestId` is the request id of your init call. Store `subscriptionRequest.id`: the approve or deny notification quotes it.

## How you know it worked

`subscriptionRequest.id` is present. Answer with `200`.

## When it goes wrong

An `error` object means no request was created. Read the error `message`, fix the init body and send it again.
