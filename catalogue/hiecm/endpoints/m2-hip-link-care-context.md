---
id: hiecm.endpoint.m2-hip-link-care-context
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Link care contexts to an ABHA address
summary: The HIP links one or more care contexts to a patient's ABHA address,
  using the patient's link token.
generated: true
operation: m2_post_hip_v3_link_carecontext
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_hip_v3_link_carecontext.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_hip_v3_link_carecontext.mdx#m2-hip-link-care-context.
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

# Link care contexts to an ABHA address

## In plain words

Link one or more [care contexts](/docs/hiecm/v3/getting-started/glossary#care-context) to a patient's [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address). One call covers one or many: put them in the `careContexts` array and set `count` to how many there are. Send the patient's [link token](/docs/hiecm/v3/getting-started/glossary#link-token) in the `X-LINK-TOKEN` header. The call returns 202 Accepted, and the outcome arrives on [on_carecontext](/docs/hiecm/v3/api/m2/endpoints/m2-callbacks/02-m2-post-v3-link-on-carecontext).

## Before you start

A gateway session token and a valid link token for this patient. Send the `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID`, `X-HIP-ID` and `X-LINK-TOKEN` headers.

## What happens

`hiTypes` on each patient entry is one value, such as `OPConsultation`, not an array. If the token was generated with both `abhaNumber` and `abhaAddress`, send both here too.

## How you know it worked

A callback on `/api/v3/link/on_carecontext` with `status` of `Successfully Linked care context`. The 202 on this call is not the outcome.

## When it goes wrong

`ABDM-1006` (Bad Request, invalid request Body): check the body against the schema. `ABDM-1037`: `count` does not match the care contexts sent. `ABDM-1038`: the ABHA address does not match the link token. `ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
