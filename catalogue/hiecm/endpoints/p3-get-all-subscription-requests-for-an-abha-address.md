---
id: hiecm.endpoint.p3-get-all-subscription-requests-for-an-abha-address
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: List the subscription requests of an ABHA address
summary: List the logged-in person's subscription requests, a page at a time.
generated: true
operation: p3_get_subscription_requests_v3_requests
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_get_subscription_requests_v3_requests.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_get_subscription_requests_v3_requests.mdx#p3-get-all-subscription-requests-for-an-abha-address.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-approve-subscription-request
    - hiecm.endpoint.p3-deny-subscription-request
    - hiecm.endpoint.p3-details-by-request-id
---

# List the subscription requests of an ABHA address

## In plain words

Lists the logged-in person's subscription requests, a page at a time. `limit`, `offset` and `status` are all required, and `status=ALL` returns every state.

## Before you start

The person's `X-AUTH-TOKEN`.

## How you know it worked

You receive `200` with `size`, `limit`, `offset` and the page in `requests`. Each request has a `requestId` for the approve and deny calls.

## When it goes wrong

`400` with `ABDM-1066` means the token is invalid: log the person in again.
