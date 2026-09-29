---
id: hiecm.endpoint.p3-subscription-init
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Request a subscription to a person's records
summary: Ask for a subscription that tells your system when a person's records
  change, without polling.
generated: true
operation: p3_post_subscription_requests_v3_init
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_post_subscription_requests_v3_init.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_post_subscription_requests_v3_init.mdx#p3-subscription-init.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p3-subscribe-and-auto-approve
  concepts:
    - hiecm.concept.gateway-session
  callbacks:
    - hiecm.callback.p3-user-subscription-request-initiate-call-back
    - hiecm.callback.p3-approve-subscription-request-call-back
    - hiecm.callback.p3-deny-subscription-call-back
    - hiecm.callback.p3-subscription-hiu-notify
---

# Request a subscription to a person's records

## In plain words

A subscription lets a [Health Information User (HIU)](/docs/hiecm/v3/getting-started/glossary#hiu), such as a health locker, hear about a person's new records without polling. This call requests one. The person approves or denies it separately, from their [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app.

## Before you start

The person's agreement, taken before the request is sent.

## What happens

You receive `202`. The request id arrives at `/api/v3/hiu/hiecm/subscription-requests/on-init`. The person's decision arrives later at `/api/v3/hiu/subscription-requests/hiu/notify`.

## How you know it worked

The on-init callback carries an `id` in `subscriptionRequest`. Once the person approves, each new or updated care context arrives at `/api/v3/hiu/subscription/notify`.

## When it goes wrong

The on-init callback carries an `error` instead of `subscriptionRequest`. Fix the request from the error `message` before sending it again.
