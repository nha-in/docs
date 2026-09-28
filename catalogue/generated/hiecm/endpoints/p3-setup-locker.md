---
id: hiecm.endpoint.p3-setup-locker
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Set up a health locker
summary: Set up a health locker for the logged-in person.
generated: true
operation: p4_post_subscription_requests_v3_setup_locker
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p4_post_subscription_requests_v3_setup_locker.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p4_post_subscription_requests_v3_setup_locker.mdx#p3-setup-locker.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-consent-disable-auto-approve
    - hiecm.endpoint.p3-consent-enable-auto-approve
---

# Set up a health locker

## In plain words

Sets up a health locker for the logged-in person. Name the locker in the `X-LOCKER-ID` header. The response carries a `consentAutoApprovalId`: keep it, because the auto approval disable and enable calls take an auto approval id.

## Before you start

The person's `X-AUTH-TOKEN` and the locker id.

## How you know it worked

You receive `200` with `consentAutoApprovalId`.

## When it goes wrong

`400` with `ABDM-1066` means the token is invalid: log the person in again.
