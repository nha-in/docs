---
id: hiecm.endpoint.m2-get-all-link-records
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: GET All Link records
summary: Lists every care context already linked to an ABHA address.
generated: true
operation: p2_get_hip_v3_link_patient_links
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_hip_v3_link_patient_links.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_hip_v3_link_patient_links.mdx#m2-get-all-link-records.
      Edit the page, never this file.
related: {}
---

# GET All Link records

## In plain words

A [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app calls this to list every care context linked to the patient's [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address), grouped by the [HIP](/docs/hiecm/v3/getting-started/glossary#hip) that linked it. It is a read, so the answer comes back on the call, not on a callback.

## Before you start

A gateway session token and the patient's `X-AUTH-TOKEN`. Send the `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID` headers.

## When it goes wrong

`ABDM-1065` (Invalid X Auth token): the patient's token is missing or expired.
