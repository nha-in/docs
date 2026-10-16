---
id: hiecm.callback.p2-callback-for-health-record-confirmation
type: callback
gateway: hiecm
milestone: P2
version: abdm-v3
title: Link confirm request to the HIP
summary: ABDM passes your facility the code the person entered, to confirm the link.
generated: true
operation: m2_post_v3_hip_link_care_context_confirm
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_hip_link_care_context_confirm.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_hip_link_care_context_confirm.mdx#p2-callback-for-health-record-confirmation.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-discover-and-link
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p2-link-care-context-confirm
---

# Link confirm request to the HIP

## In plain words

When the person enters the code you sent, ABDM posts it here as `confirmation.token`, with `confirmation.linkRefNumber`. Check the code, link the care contexts, then answer with the link on-confirm call.

## What happens

Answer at `/api/hiecm/user-initiated-linking/v3/link/care-context/on-confirm`.

## When it goes wrong

`400` with `ABDM-1105` means a duplicate confirm request.
