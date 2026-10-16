---
id: hiecm.endpoint.p2-care-context-discover
type: endpoint
gateway: hiecm
milestone: P2
version: abdm-v3
title: Ask a facility what records it holds
summary: Ask one facility whether it holds records for the logged-in person; the
  answer arrives on a callback.
generated: true
operation: p2_post_user_initiated_linking_v3_patient_care_context_discover
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_user_initiated_linking_v3_patient_care_context_discover.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_user_initiated_linking_v3_patient_care_context_discover.mdx#p2-care-context-discover.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-discover-and-link
  concepts:
    - hiecm.concept.gateway-session
  callbacks:
    - hiecm.callback.p2-callback-on-health-record-discover
  endpoints:
    - hiecm.endpoint.p2-link-care-context-init
---

# Ask a facility what records it holds

## In plain words

[Discovery](/docs/hiecm/v3/getting-started/glossary#discovery) asks one [Health Information Provider (HIP)](/docs/hiecm/v3/getting-started/glossary#hip) whether it holds records for this person. Name the facility in `hip.id` and identify the person in `unverifiedIdentifiers`. The facility answers on your on-discover callback, not on this response.

## Before you start

The person's `X-AUTH-TOKEN` from their PHR login, your `X-HIU-ID`, and the facility's HIP id from the provider search.

## What happens

You receive `202`. The care contexts the facility finds arrive at `/api/v3/hiu/patient/care-context/on-discover`, with a `transactionId` that the link init call needs.

## How you know it worked

The on-discover callback carries a `patient` array with at least one `careContexts` entry.

## When it goes wrong

`400` with `ABDM-1103` means a duplicate discovery request. Wait for the callback instead of sending the request again.
