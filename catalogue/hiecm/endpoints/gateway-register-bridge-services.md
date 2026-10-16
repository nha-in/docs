---
id: hiecm.endpoint.gateway-register-bridge-services
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Register or update bridge services for an HIU
summary: Registers or updates HIU service entries for a facility against your bridge.
generated: true
operation: m4_post_v1_bridges_mutiplehrpaddupdateservices
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m4_post_v1_bridges_mutiplehrpaddupdateservices.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m4_post_v1_bridges_mutiplehrpaddupdateservices.mdx#gateway-register-bridge-services.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Register or update bridge services for an HIU

## In plain words

Registers your facility as a service on your [bridge](/docs/hiecm/v3/getting-started/glossary#bridge), or updates it. For a [Health Information User (HIU)](/docs/hiecm/v3/getting-started/glossary#hiu), set `type` to `HIU` in each `HRP` entry. Send the facility's `facilityId` and `facilityName`, and one `HRP` entry per service with its `bridgeId`, `hipName`, `type` and `active`.

## Before you start

A facility id that starts with `IN`, and your bridge id. The call goes to the registry server `https://apihspsbx.abdm.gov.in/v4/int`, not to the gateway.

## How you know it worked

A 200. Then the gateway's list call shows the service under your bridge with the type you registered.

## When it goes wrong

A 404 means the facility or the path was not found: check `facilityId` and the path spelling `MutipleHRPAddUpdateServices`.
