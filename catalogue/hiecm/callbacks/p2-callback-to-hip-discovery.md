---
id: hiecm.callback.p2-callback-to-hip-discovery
type: callback
gateway: hiecm
milestone: P2
version: abdm-v3
title: Discovery request to the HIP
summary: ABDM asks your facility which records it holds for a person who started
  discovery from their PHR app.
generated: true
operation: m2_post_v3_hip_patient_care_context_discover
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_hip_patient_care_context_discover.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_hip_patient_care_context_discover.mdx#p2-callback-to-hip-discovery.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-discover-and-link
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p2-care-context-discover
---

# Discovery request to the HIP

## In plain words

When a person asks from their PHR app what records your facility holds, ABDM posts the request here. Match the person on `patient.verifiedIdentifiers` and their name, gender and year of birth. Then answer with the [care contexts](/docs/hiecm/v3/getting-started/glossary#care-context) you hold.

## What happens

Answer with `202`, then send the on-discover call at `/api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover`, quoting the `transactionId`.

## When it goes wrong

`400` with `ABDM-1103` means a duplicate discovery request.
