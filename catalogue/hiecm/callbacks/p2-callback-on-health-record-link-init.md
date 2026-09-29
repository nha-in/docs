---
id: hiecm.callback.p2-callback-on-health-record-link-init
type: callback
gateway: hiecm
milestone: P2
version: abdm-v3
title: Link init request to the HIP
summary: ABDM tells your facility which care contexts the person chose to link.
generated: true
operation: m2_post_v3_hip_link_care_context_init
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_hip_link_care_context_init.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_hip_link_care_context_init.mdx#p2-callback-on-health-record-link-init.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-discover-and-link
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p2-link-care-context-init
---

# Link init request to the HIP

## In plain words

When the person chooses records to link, ABDM posts the chosen care contexts here with their `abhaAddress`. Send the person a code, then answer with the link on-init call.

## What happens

Answer at `/api/hiecm/user-initiated-linking/v3/link/care-context/on-init`, quoting the `transactionId`.

## When it goes wrong

`400` with `ABDM-1104` means a duplicate init request.
