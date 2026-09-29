---
id: hiecm.endpoint.p3-approve-subscription-request
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Approve a subscription request
summary: Let the person approve a subscription request from their PHR app, and
  set what it covers.
generated: true
operation: p3_post_subscription_requests_v3_request_id_approve
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p3_post_subscription_requests_v3_request_id_approve.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p3_post_subscription_requests_v3_request_id_approve.mdx#p3-approve-subscription-request.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-get-all-subscription-requests-for-an-abha-address
    - hiecm.endpoint.p3-edit-subscription
  callbacks:
    - hiecm.callback.p3-approve-subscription-request-call-back
---

# Approve a subscription request

## In plain words

Lets the person approve a subscription request from their [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app. The body sets what the subscription covers: which facilities, [HI types](/docs/hiecm/v3/getting-started/glossary#hi-type), purposes, categories and dates. Set `isApplicableForAllHIPs` or list facilities in `includedSources`. `excludedSources` carves out exceptions.

## Before you start

The person's `X-AUTH-TOKEN` and the `subscriptionRequestId`, from the list of subscription requests.

## How you know it worked

You receive `202` with `subscriptionId`. Keep it: editing, enabling and disabling the subscription take it. The requesting HIU is notified with `GRANTED`.

## When it goes wrong

`400` returns an `error` with a code and message. Correct the body from the error `message`.
