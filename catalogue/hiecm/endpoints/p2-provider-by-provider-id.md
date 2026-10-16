---
id: hiecm.endpoint.p2-provider-by-provider-id
type: endpoint
gateway: hiecm
milestone: P2
version: abdm-v3
title: Get a provider by its id
summary: Fetch the details of one facility when you already hold its id.
generated: true
operation: p2_get_gateway_v3_providers_provider_id
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_gateway_v3_providers_provider_id.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_gateway_v3_providers_provider_id.mdx#p2-provider-by-provider-id.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p2-all-providers
---

# Get a provider by its id

## In plain words

Fetch one facility's details when you already hold its id, for example from a provider search. The id goes in the path as `hip-id`.

## Before you start

A gateway session token, `X-CM-ID`, and the provider's `id` from the provider search.

## How you know it worked

You receive `200` with `identifier`, `facilityType` and `isHIP` for that one provider.

## When it goes wrong

`204` with `ABDM-1001` means no provider has that id.
