---
id: hiecm.callback.m2-on-generate-token-result
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: The link token you asked for, or why it was refused
summary: The link token arrives here; store it against the patient, because it
  is valid for six months.
generated: true
operation: m2_post_v3_hip_token_on_generate_token
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_hip_token_on_generate_token.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_hip_token_on_generate_token.mdx#m2-on-generate-token-result.
      Edit the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m2-generate-link-token
  flows:
    - hiecm.flow.m2-link-care-context
  concepts:
    - hiecm.concept.asynchronous-callbacks
  errors:
    - hiecm.error.abdm-9999
---

# The link token you asked for, or why it was refused

## In plain words

A [link token](/docs/hiecm/v3/getting-started/glossary#link-token) is valid for six months. Store it against the patient before you answer the callback. Use it in the `X-LINK-TOKEN` header when you [link care contexts](/docs/hiecm/v3/api/m2/endpoints/m2-abdm-hip-initiated-linking-hip/01-m2-post-hip-v3-link-carecontext). Match the callback to your request by `response.requestId`, which echoes the `REQUEST-ID` you sent.

## Before you start

Store the `REQUEST-ID` of the generate token call before you send it, so a fast callback still finds a match.

## How you know it worked

A callback carrying `linkToken` and a `requestId` equal to your stored `REQUEST-ID`. Answer it with 200 OK.

## When it goes wrong

A token received but not stored means generating another. Check the stored token is still valid before each link call. An `error` object is the answer, not a delivery fault: read the code before you call again.
