---
id: hiecm.endpoint.m1-register-hrp-services
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Register or update HIP and HIU services for a facility
summary: Registers or updates the HIP and HIU services a facility offers through
  your bridge.
generated: true
operation: m4_post_v1_bridges_mutiplehrpaddupdateservices
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m4_post_v1_bridges_mutiplehrpaddupdateservices.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m4_post_v1_bridges_mutiplehrpaddupdateservices.mdx#m1-register-hrp-services.
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

# Register or update HIP and HIU services for a facility

## In plain words

Tells [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) which services a facility offers through your [bridge](/docs/hiecm/v3/getting-started/glossary#bridge). One call can add or update several: send one `HRP` entry per service, with `type` set to `HIP` or `HIU` and `active` set to true. Register the bridge callback URL first, so ABDM can reach the services once they are registered.

## Before you start

The facility's `facilityId` and `facilityName`, and your `bridgeId`.

## What happens

Every `HRP` entry needs `bridgeId`, `hipName`, `type` and `active`. Send `active` as false to switch a service off without removing it.

## How you know it worked

A 200, and the gateway's service lookup returns the facility with `isHip` or `isHiu` set as you registered it.
