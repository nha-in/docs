---
id: hiecm.endpoint.p3-details-by-subscription-id
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Get a subscription by its subscription id
summary: Fetch one granted subscription by its subscription id for the logged-in person.
generated: true
operation: p3_get_subscription_requests_v3_subscription_id
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_get_subscription_requests_v3_subscription_id.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_get_subscription_requests_v3_subscription_id.mdx#p3-details-by-subscription-id.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-details-by-request-id
    - hiecm.endpoint.p3-edit-subscription
---

# Get a subscription by its subscription id

## In plain words

Returns one subscription by its subscription id: its purpose, `status`, when it was granted and the sources it covers. Use the request id call instead when you hold only a `subscriptionRequestId`.

## Before you start

The person's `X-AUTH-TOKEN` and the `subscriptionId`, from the approve call.

## How you know it worked

You receive `200` with `subscriptionId`, `status`, `dateGranted` and `includedSources`.

## When it goes wrong

`400` with `ABDM-1015` means the request was rejected. Check that the path holds a subscription id, not a subscription request id.
