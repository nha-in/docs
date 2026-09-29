---
id: hiecm.endpoint.p2-link-care-context-confirm
type: endpoint
gateway: hiecm
milestone: P2
version: abdm-v3
title: Confirm the link with the code the person received
summary: Finish user initiated linking by sending the code the person received.
generated: true
operation: p2_post_user_initiated_linking_v3_link_care_context_confirm
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_user_initiated_linking_v3_link_care_context_confirm.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_user_initiated_linking_v3_link_care_context_confirm.mdx#p2-link-care-context-confirm.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-discover-and-link
  concepts:
    - hiecm.concept.gateway-session
  callbacks:
    - hiecm.callback.p2-response-on-health-record-on-confirm
  endpoints:
    - hiecm.endpoint.p2-link-care-context-init
---

# Confirm the link with the code the person received

## In plain words

The last call in user initiated linking. Send the code the person received as `token`, with the `linkRefNumber` from the on-init callback. The code proves the person is who the facility thinks they are. The outcome arrives on your on-confirm callback.

## Before you start

The `referenceNumber` from the on-init callback's `link`, sent here as `linkRefNumber`, and the code the person typed. Send `token` as a number, not a string.

## What happens

You receive `202`. The outcome arrives at `/api/v3/hiu/patient/care-context/on-confirm`.

## How you know it worked

The on-confirm callback lists the linked care contexts in `careContexts`.

## When it goes wrong

`400` with `ABDM-1105` means a duplicate confirm request. Wait for the callback instead of sending the request again.
