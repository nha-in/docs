---
id: uhi.callback.network-on-search
type: callback
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send a catalog to the EUA
summary: An EUA receives each catalog here, relayed by the UHI Gateway after a
  broadcast search or sent by the HSPA after a direct search.
generated: true
operation: uhi_network_on_search
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_network_on_search.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_network_on_search.mdx#network-on-search. Edit the
      page, never this file.
related:
  endpoints:
    - uhi.endpoint.network-search
    - uhi.endpoint.network-gateway-search
  concepts:
    - uhi.concept.match-transaction-id
    - uhi.concept.timeouts
    - uhi.concept.verifying-signatures
    - uhi.concept.ack-then-answer
  flows:
    - uhi.flow.pmjay-hem-discovery
    - uhi.flow.consultation-discovery
---

# Send a catalog to the EUA

## In plain words

Every [EUA](/docs/uhi/v1/getting-started/glossary#eua) exposes this endpoint at its [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri) to receive catalogs. The [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) relays the answer to a broadcast search, signed with `X-Gateway-Authorization`. An [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) answering a direct search sends it itself, signed with `Authorization`. Reply with an `ACK` at once. Several HSPAs can answer one search, each with its own `on_search`.

## Before you start

A `consumer_uri` public over HTTPS, and the `transaction_id` and `message_id` of every search you sent, stored before you sent it.

## What happens

Match each catalog to its search on `transaction_id`, then `message_id`. Store the `provider_id` and `provider_uri` from its `context`: every direct call to that HSPA goes to that `provider_uri`. Render each catalog as it arrives, because no call marks the last one. See [Messages and callbacks](/docs/uhi/v1/concepts/messages#timeouts).

## How you know it worked

The sender receives your HTTP 200 and `ACK`, and the catalog appears against the right search on your screen.

## When it goes wrong

Catalogs that never match a search usually carry a `transaction_id` you did not store. A signature that does not verify means the catalog is not to be trusted. Check an `Authorization` header against the sender's key from the [registry lookup](/docs/uhi/v1/concepts/registry-lookup).
