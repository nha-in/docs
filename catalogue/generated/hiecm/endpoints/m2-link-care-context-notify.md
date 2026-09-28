---
id: hiecm.endpoint.m2-link-care-context-notify
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Notify an update to a linked care context
summary: The HIP tells ABDM that a care context it already linked has new health
  information types.
generated: true
operation: m2_post_hip_v3_link_context_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_hip_v3_link_context_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_hip_v3_link_context_notify.mdx#m2-link-care-context-notify.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.gateway-session
---

# Notify an update to a linked care context

## In plain words

Call this when a care context you already linked gains new health information types. It keeps the patient's record current in ABDM. Send the patient's [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address), the care context references, the `hiTypes` and your [HIP](/docs/hiecm/v3/getting-started/glossary#hip) id. The answer arrives on [links context on-notify](/docs/hiecm/v3/api/m2/endpoints/m2-callbacks/03-m2-post-v3-links-context-on-notify).

## Before you start

A gateway session token and a care context that is already linked. Send the `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID` and `X-HIP-ID` headers.

## What happens

The `hip` object needs only `id`. `date` is a UTC date time. The call returns 202 Accepted.

## How you know it worked

A callback on `/api/v3/links/context/on-notify` with `acknowledgement` `status` of `SUCCESS`.

## When it goes wrong

`ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
