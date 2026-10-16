---
id: hiecm.endpoint.m2-generate-link-token
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Generate Link Token
summary: Ask for a link token for one patient; it arrives on your bridge and is
  valid for six months.
generated: true
operation: m2_post_v3_token_generate_token
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_token_generate_token.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_token_generate_token.mdx#m2-generate-link-token.
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

# Generate Link Token

## In plain words

Ask for a [link token](/docs/hiecm/v3/getting-started/glossary#link-token) for one patient before you link their care contexts. The call returns 202 Accepted, and the token arrives on your bridge at [on-generate-token](/docs/hiecm/v3/api/m2/endpoints/m2-callbacks/01-m2-post-v3-hip-token-on-generate-token). A link token is valid for six months, so store it and reuse it until it expires.

Send `abhaAddress`, `name`, `gender` and `yearOfBirth` as you hold them for the patient. Add `abhaNumber` when the patient has one linked to the address.

## Before you start

A gateway session token and your HIP id. Send the `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID` and `X-HIP-ID` headers.

## What happens

`gender` takes `M`, `F`, `O`, `D`, `T` or `U`. `yearOfBirth` is four digits. If you send both `abhaNumber` and `abhaAddress` here, send both again on the link call.

## How you know it worked

A `linkToken` arrives on `/api/v3/hip/token/on-generate-token`, carrying your `REQUEST-ID` as `requestId`.

## When it goes wrong

`ABDM-1035` (Invalid HIP ID): check `X-HIP-ID`. `ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
