---
id: hiecm.endpoint.p3-consent-enable-auto-approve
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Enable an auto approval policy
summary: Turn a disabled auto approval policy back on.
generated: true
operation: p2_post_consent_v3_auto_approve_auto_approval_id_enable
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_consent_v3_auto_approve_auto_approval_id_enable.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_consent_v3_auto_approve_auto_approval_id_enable.mdx#p3-consent-enable-auto-approve.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-consent-auto-approve
    - hiecm.endpoint.p3-consent-disable-auto-approve
---

# Enable an auto approval policy

## In plain words

Turns a disabled auto approval policy back on from the person's PHR app. Consent requests from that HIU are then approved automatically again. The path parameter is named `consentId`, but it takes the auto approval id.

## Before you start

The person's `X-AUTH-TOKEN` and the auto approval id of the policy.

## How you know it worked

You receive `202` with `message`. A `202` can carry an `error` with `ABDM-1001` instead: read the body, not only the status.

## When it goes wrong

`400` with `ABDM-1065` means the `X-AUTH-TOKEN` is invalid: log the person in again. `404` with `ABDM-1001` means no policy has that id.
