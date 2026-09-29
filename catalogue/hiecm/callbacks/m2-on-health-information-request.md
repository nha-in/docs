---
id: hiecm.callback.m2-on-health-information-request
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: A request for the records a consent covers
summary: ABDM posts an HIU's data request to the HIP, with the consent artefact
  id, date range, push URL and key material.
generated: true
operation: m2_post_v3_hip_health_information_request
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_hip_health_information_request.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_hip_health_information_request.mdx#m2-on-health-information-request.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# A request for the records a consent covers

## In plain words

When an [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) asks for data under a consent, ABDM posts the request to your [HIP](/docs/hiecm/v3/getting-started/glossary#hip) bridge at `/api/v3/hip/health-information/request`. It carries the consent artefact id, the date range, the `dataPushUrl` and the requester's `keyMaterial`. Acknowledge it through [health information on-request](/docs/hiecm/v3/api/m2/endpoints/m2-consent-management-data-flow-hip/02-m2-post-data-flow-v3-health-information-hip-on-request). Then push the encrypted records to `dataPushUrl`.

## Before you start

A callback URL registered for your bridge, and the consent artefacts you received on `/api/v3/consent/request/hip/notify`.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIP-ID` headers, and expects 200 OK. `transactionId` is the context for the data you send.

## When it goes wrong

Never send data for a consent artefact that has expired or been revoked. Share only records inside the requested `dateRange`.
