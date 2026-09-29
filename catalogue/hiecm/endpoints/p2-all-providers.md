---
id: hiecm.endpoint.p2-all-providers
type: endpoint
gateway: hiecm
milestone: P2
version: abdm-v3
title: Search providers by name
summary: Search the facilities registered on ABDM by name, state and district
  before asking one of them for records.
generated: true
operation: p2_get_gateway_v3_providers
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_gateway_v3_providers.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_gateway_v3_providers.mdx#p2-all-providers.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p2-provider-by-provider-id
    - hiecm.endpoint.p2-care-context-discover
---

# Search providers by name

## In plain words

Use this call to let a person find a facility by name before asking it for records. Narrow the search with `stateCode` and `districtCode`, where `-1` means all. When nothing matches, the answer is `204` with `ABDM-1001`, not an empty list.

## Before you start

A gateway session token and `X-CM-ID`, the consent manager suffix, for example `sbx`.

## How you know it worked

You receive `200` with an array of providers. Each has an `identifier` holding `id` and `name`. Only entries with `isHIP` set to true hold records you can discover. That `id` is the HIP id discovery takes in `hip`.

## When it goes wrong

`204` with `ABDM-1001` means no provider matched. Widen the name or set both codes to `-1`.
