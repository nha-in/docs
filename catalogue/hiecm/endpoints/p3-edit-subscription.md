---
id: hiecm.endpoint.p3-edit-subscription
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Edit a subscription
summary: Let the person change what an existing subscription covers, such as its
  date range.
generated: true
operation: p3_put_subscription_requests_v3_patients_subscription_id
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_put_subscription_requests_v3_patients_subscription_id.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_put_subscription_requests_v3_patients_subscription_id.mdx#p3-edit-subscription.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-approve-subscription-request
    - hiecm.endpoint.p3-details-by-subscription-id
---

# Edit a subscription

## In plain words

Lets the person change an existing subscription, for example its date range. Send the HIU's id in `hiuId` and the whole new scope in `subscriptionEditAndApprovalRequest`.

## Before you start

The person's `X-AUTH-TOKEN` and the `subscriptionId` from the approve call or the subscription details. Every source carries a `status`.

## How you know it worked

You receive `202` with `subscriptionId`.

## When it goes wrong

`400` with `ABDM-1066` means the token is invalid: log the person in again.
