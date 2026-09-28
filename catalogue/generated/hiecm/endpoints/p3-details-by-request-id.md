---
id: hiecm.endpoint.p3-details-by-request-id
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Get a subscription request by its request id
summary: Fetch one subscription request by its request id for the logged-in person.
generated: true
operation: p3_get_subscription_requests_v3_request_request_id
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_get_subscription_requests_v3_request_request_id.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_get_subscription_requests_v3_request_request_id.mdx#p3-details-by-request-id.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-get-all-subscription-requests-for-an-abha-address
    - hiecm.endpoint.p3-details-by-subscription-id
---

# Get a subscription request by its request id

## In plain words

Returns one subscription request by its request id, with its `status` and the `subscriptionId` it belongs to. Show it to the person before they approve or deny it.

## Before you start

The person's `X-AUTH-TOKEN` and the `subscriptionRequestId`.

## How you know it worked

You receive `200` with `status` and `details`, which holds the purpose, the HIU and the facilities asked for.

## When it goes wrong

`400` with `ABDM-1066` means the token is invalid: log the person in again.
