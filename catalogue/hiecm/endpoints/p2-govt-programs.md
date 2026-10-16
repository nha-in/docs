---
id: hiecm.endpoint.p2-govt-programs
type: endpoint
gateway: hiecm
milestone: P2
version: abdm-v3
title: List government programmes
summary: Fetch the list of government health programmes.
generated: true
operation: p2_get_gateway_v3_govt_programs
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_gateway_v3_govt_programs.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_gateway_v3_govt_programs.mdx#p2-govt-programs.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p2-all-providers
---

# List government programmes

## In plain words

Returns the list of government health programmes. Each entry carries the same `identifier` shape as a provider in the provider search.

## Before you start

A gateway session token and `X-CM-ID`.

## How you know it worked

You receive `200` with an array of entries, each with an `identifier` holding `id` and `name`.

## When it goes wrong

`204` with `ABDM-1001` means no programme is listed.
