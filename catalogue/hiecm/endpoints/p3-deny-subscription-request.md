---
id: hiecm.endpoint.p3-deny-subscription-request
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Deny a subscription request
summary: Let the person refuse a subscription request from their PHR app.
generated: true
operation: p3_post_subscription_requests_v3_request_id_deny
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_post_subscription_requests_v3_request_id_deny.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_post_subscription_requests_v3_request_id_deny.mdx#p3-deny-subscription-request.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-get-all-subscription-requests-for-an-abha-address
  callbacks:
    - hiecm.callback.p3-deny-subscription-call-back
---

# Deny a subscription request

## In plain words

Lets the person refuse a subscription request from their [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app. Send the person's reason in `reason`. The requesting [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) is told the request was denied.

## Before you start

The person's `X-AUTH-TOKEN` and the `subscriptionRequestId`, from the list of subscription requests.

## How you know it worked

You receive `202` with `message`. The requesting HIU is notified with `DENIED`.

## When it goes wrong

`400` with `ABDM-1066` means the token is invalid: log the person in again.
