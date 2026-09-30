---
id: uhi.callback.network-gateway-on-search
type: callback
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send a catalog through the Gateway
summary: An HSPA sends its catalog to the UHI Gateway in answer to a forwarded
  search; the Gateway relays it to the EUA's consumer_uri as on_search.
generated: true
operation: uhi_network_gateway_on_search
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_network_gateway_on_search.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_network_gateway_on_search.mdx#network-gateway-on-search.
      Edit the page, never this file.
related:
  endpoints:
    - uhi.endpoint.network-gateway-search
    - uhi.endpoint.network-search
  callbacks:
    - uhi.callback.network-on-search
  concepts:
    - uhi.concept.gateway-routes
    - uhi.concept.match-transaction-id
    - uhi.concept.signing-headers
  flows:
    - uhi.flow.pmjay-hem-discovery
---

# Send a catalog through the Gateway

## In plain words

An [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) sends its catalog here in answer to a search the [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) forwarded to it. The Gateway replies with an `ACK` and relays the catalog to the [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri) as `on_search`. Echo the `transaction_id` and `message_id` of the search you received, and put your `provider_id` and `provider_uri` in the `context`.

Sign every request with a fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

## Before you start

A search from the Gateway, received on your `/search` endpoint and answered with an `ACK`. Set `action` to `on_search` and copy `consumer_id` and `consumer_uri` from the search's `context`.

## What happens

The Gateway relays your catalog to the EUA with its own `X-Gateway-Authorization` header. The EUA stores your `provider_uri` and `provider_id`, and sends any later direct call to that `provider_uri`.

## How you know it worked

An HTTP 200 carrying `ACK` from the Gateway.

## When it goes wrong

A 401 means the signature was built over a different body, was reused, or has expired: sign again for this exact body. A catalog the EUA never shows usually carries a `transaction_id` or `message_id` that differs from the search. See [Messages and callbacks](/docs/uhi/v1/concepts/messages).
