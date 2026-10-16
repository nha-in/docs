---
id: hiecm.callback.m2-link-token-generation-call-back
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: Link token generation – Call Back API
summary: ABDM answers a link token request on the HIP's bridge, with the token
  or an error.
generated: true
operation: m2_post_v3_hip_token_on_generate_token
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_hip_token_on_generate_token.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_hip_token_on_generate_token.mdx#m2-link-token-generation-call-back.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
---

# Link token generation – Call Back API

## In plain words

After you [ask for a link token](/docs/hiecm/v3/api/m2/endpoints/m2-abdm-link-token-hip/01-m2-post-v3-token-generate-token), ABDM answers on your bridge at `/api/v3/hip/token/on-generate-token`. The path is relative to the callback URL you registered. On success the body carries the `linkToken` for the patient's [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address). On failure it carries an `error`.

## Before you start

A callback URL registered for your bridge and reachable from the public internet.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIP-ID` headers. The body carries `abhaAddress`, `response` and either `linkToken` or `error`.

## When it goes wrong

`ABDM-1027`: blocked, try again after 24 hours. `ABDM-1051` (Invalid ABHA Number or ABHA Address): check the details you sent. `ABDM-1024` (Dependent service unavailable): try again later.
