---
id: hiecm.endpoint.p3-get-all-subscription-request
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: List consent and subscription requests together
summary: List the logged-in person's consent requests and subscription requests
  in one call, each paged on its own.
generated: true
operation: p4_get_subscription_requests_v3_patients_requests
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p4_get_subscription_requests_v3_patients_requests.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p4_get_subscription_requests_v3_patients_requests.mdx#p3-get-all-subscription-request.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# List consent and subscription requests together

## In plain words

Lists the logged-in person's consent requests and subscription requests together, each paged on its own. `consentLimit` and `consentOffset` page the consents. `subscriptionLimit` and `subscriptionOffset` page the subscriptions. `status` filters both.

## Before you start

The person's `X-AUTH-TOKEN`.

## How you know it worked

You receive `200` with a `consents` page and a `subscriptions` page.

## When it goes wrong

`400` with `ABDM-1066` means the token is invalid: log the person in again.
