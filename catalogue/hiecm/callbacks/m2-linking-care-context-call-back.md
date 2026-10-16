---
id: hiecm.callback.m2-linking-care-context-call-back
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: Linking care context Call back API
summary: ABDM answers a care context link request on the HIP's bridge with the outcome.
generated: true
operation: m2_post_v3_link_on_carecontext
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_link_on_carecontext.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_link_on_carecontext.mdx#m2-linking-care-context-call-back.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
---

# Linking care context Call back API

## In plain words

After you [link care contexts](/docs/hiecm/v3/api/m2/endpoints/m2-abdm-hip-initiated-linking-hip/01-m2-post-hip-v3-link-carecontext), ABDM answers on your bridge at `/api/v3/link/on_carecontext`. The path is relative to the callback URL you registered. This callback, not the 202 on your link call, says whether the records linked.

## Before you start

A callback URL registered for your bridge and reachable from the public internet.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIP-ID` headers. The body carries `abhaAddress`, `status`, `response` and, on failure, `error`.

## When it goes wrong

`ABDM-1038` (ABHA address and Link token mismatch): generate a token for this address. `ABDM-1037` (Counter and Care context count mismatch): fix `count`. `ABDM-1024` (Dependent service unavailable): try again later.
