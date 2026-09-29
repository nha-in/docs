---
id: uhi.concept.gateway-routes
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Calls routed through the UHI Gateway
summary: Discovery is the only stage the UHI Gateway routes, broadcasting a
  search to every HSPA in the domain and relaying each on_search to the EUA.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/routes.mdx
    status: page
    note: Generated from site/docs/uhi/v1/concepts/routes.mdx#through-the-gateway.
      Edit the page, never this file.
related:
  endpoints:
    - uhi.endpoint.network-gateway-search
  callbacks:
    - uhi.callback.network-gateway-on-search
  concepts:
    - uhi.concept.gateway-role
    - uhi.concept.direct-calls
---

# Calls routed through the UHI Gateway

## In plain words

Discovery is the only stage the Gateway routes.

1. The EUA signs a `search` and sends it to `POST /api/v1/uhi/search`.
2. The Gateway checks the signature and replies with an `ACK`.
3. The Gateway adds its own `X-Gateway-Authorization` signature and sends the search to every HSPA registered for the `context.domain`.
4. Each HSPA sends its catalog to `POST /api/v1/uhi/on_search`.
5. The Gateway relays each `on_search` to the EUA's `consumer_uri`.

Several HSPAs can answer one search. See [Messages and callbacks](/docs/uhi/v1/concepts/messages#timeouts) for how long to wait.

## What happens

An EUA sends `search` to `POST /api/v1/uhi/search` and receives every `on_search` on its `consumer_uri`. An HSPA answers a forwarded `search` with an `ACK`, then sends its catalog to `POST /api/v1/uhi/on_search`, never to the EUA.

## When it goes wrong

An HSPA that checks `Authorization` on a forwarded search finds the Gateway's `X-Gateway-Authorization` instead. Check the header the route carries.
