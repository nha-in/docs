---
id: hiecm.endpoint.gateway-get-bridge-service-by-id
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Find a bridge service by its service id
summary: Returns one service registered on your bridge, looked up by its service id.
generated: true
operation: gateway_get_gateway_v3_bridge_service_serviceid_service_id
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/gateway_get_gateway_v3_bridge_service_serviceid_service_id.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/gateway_get_gateway_v3_bridge_service_serviceid_service_id.mdx#gateway-get-bridge-service-by-id.
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

# Find a bridge service by its service id

## In plain words

Returns one service registered on your [bridge](/docs/hiecm/v3/getting-started/glossary#bridge), looked up by the service id in the path. The response names the service, the bridge it belongs to, whether it is active, and which roles it holds through `isHip`, `isHiu`, `isHealthLocker` and `isPhr`. Use it to check that a service holds the role a journey needs, for example `isHip` before you link records.

## Before you start

The service id as registered. Send the access token as `Authorization: Bearer <gateway token>`, with `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID`.

## How you know it worked

A 200 whose `serviceId` matches the id you asked for, with `active` true and the role flag you need set to true.

## When it goes wrong

A 204 with `ABDM-1001` means no service is registered under that id. A 401 with `900901` means the access token is missing or expired.
