---
id: hiecm.endpoint.p3-get-all-links-records
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Get all linked records
summary: List every care context linked to the logged-in person's ABHA address,
  grouped by facility.
generated: true
operation: p2_get_hip_v3_link_patient_links
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_hip_v3_link_patient_links.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_hip_v3_link_patient_links.mdx#p3-get-all-links-records.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  callbacks:
    - hiecm.callback.p2-response-on-health-record-on-confirm
---

# Get all linked records

## In plain words

Lists every [care context](/docs/hiecm/v3/getting-started/glossary#care-context) linked to the logged-in person's [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address), grouped by facility. Send `limit=-1` to get all the links in one response.

## Before you start

The person's `X-AUTH-TOKEN` and `X-CM-ID`.

## How you know it worked

You receive `200` with `links` under `Patient`, one entry per facility and record.

## When it goes wrong

`404` with `ABDM-1001` means nothing is linked yet. `400` with `ABDM-1065` means the `X-AUTH-TOKEN` is invalid.
