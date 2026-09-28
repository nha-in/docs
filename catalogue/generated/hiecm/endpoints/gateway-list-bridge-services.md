---
id: hiecm.endpoint.gateway-list-bridge-services
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: List the services registered on your bridge
summary: Returns your bridge, its callback URL and every service registered under it.
generated: true
operation: gateway_get_gateway_v3_bridge_services
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/gateway_get_gateway_v3_bridge_services.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/gateway_get_gateway_v3_bridge_services.mdx#gateway-list-bridge-services.
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

# List the services registered on your bridge

## In plain words

Returns your [bridge](/docs/hiecm/v3/getting-started/glossary#bridge) and every service registered under it. The bridge record carries the callback `url` [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) sends to, and whether the bridge is `active` or `blocklisted`. Each service lists its `types`, such as `HIP` or `HIU`, and whether it is active. Call it to confirm your setup before you test a journey.

## Before you start

Hold an access token from the session call and send it as `Authorization: Bearer <gateway token>`, with `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID`.

## How you know it worked

A 200 whose `bridge` object holds the `url` you registered, with `active` true, and a `services` list naming every service you expect.

## When it goes wrong

A 204 with `ABDM-1001` means nothing is registered against the bridge yet. A 401 with `900901` means the access token is missing or expired: create a new session and retry.
