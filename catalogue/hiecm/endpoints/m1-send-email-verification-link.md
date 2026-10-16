---
id: hiecm.endpoint.m1-send-email-verification-link
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Send email verification link
summary: Emails a verification link to the address on a signed in person's ABHA.
generated: true
operation: p1_post_v3_profile_account_request_emailverificationlink
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p1_post_v3_profile_account_request_emailverificationlink.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p1_post_v3_profile_account_request_emailverificationlink.mdx#m1-send-email-verification-link.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Send email verification link

## In plain words

Sends a verification link to an email address on the signed in person's [ABHA](/docs/hiecm/v3/getting-started/glossary#abha). The person verifies the address by opening the link. Send `scope` as `["abha-profile","email-link-verify"]`, `loginHint` as `email`, the encrypted address in `loginId`, and `otpSystem` as `abdm`. The response body is not yet published.

## Before you start

The person's `X-token`, sent as `Bearer <token>`, and the email address encrypted with the public certificate key.

## How you know it worked

The profile call shows the email as verified after the person opens the link.
