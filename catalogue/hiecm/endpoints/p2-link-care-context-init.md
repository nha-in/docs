---
id: hiecm.endpoint.p2-link-care-context-init
type: endpoint
gateway: hiecm
milestone: P2
version: abdm-v3
title: Start linking the care contexts the person chose
summary: Start linking the records the person chose after discovery; the
  facility replies with how the person will confirm.
generated: true
operation: p2_post_user_initiated_linking_v3_link_care_context_init
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_user_initiated_linking_v3_link_care_context_init.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_user_initiated_linking_v3_link_care_context_init.mdx#p2-link-care-context-init.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-discover-and-link
  concepts:
    - hiecm.concept.gateway-session
  callbacks:
    - hiecm.callback.p2-response-on-health-record-link
  endpoints:
    - hiecm.endpoint.p2-care-context-discover
    - hiecm.endpoint.p2-link-care-context-confirm
---

# Start linking the care contexts the person chose

## In plain words

Once the person has chosen which records to link, this call starts linking them. Send the `transactionId` from discovery and, for each patient reference, the care contexts chosen. The facility answers on your on-init callback with how the person will confirm.

## Before you start

The `transactionId` and care contexts from the on-discover callback. Offer the person only care contexts that are not linked already.

## What happens

You receive `202`. The answer arrives at `/api/v3/hiu/patient/care-context/on-init`.

## How you know it worked

The on-init callback carries a `referenceNumber` in `link`, and `communicationMedium` says whether the code went to `MOBILE` or `EMAIL`.

## When it goes wrong

`400` with `ABDM-1104` means a duplicate init request. Wait for the callback instead of sending the request again.
