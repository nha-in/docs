---
id: uhi.endpoint.network-search
type: endpoint
gateway: uhi
milestone: n/a
version: uhi-v1
title: Search an HSPA
summary: An HSPA receives each search here, first from the UHI Gateway and, for
  Physical Consultation slots, directly from the EUA.
generated: true
operation: uhi_network_search
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_network_search.mdx
    status: page
    note: Generated from site/docs/_notes/uhi/uhi_network_search.mdx#network-search.
      Edit the page, never this file.
related:
  callbacks:
    - uhi.callback.network-on-search
    - uhi.callback.network-gateway-on-search
  concepts:
    - uhi.concept.gateway-routes
    - uhi.concept.direct-calls
    - uhi.concept.verifying-signatures
    - uhi.concept.ack-then-answer
  flows:
    - uhi.flow.pmjay-hem-discovery
    - uhi.flow.consultation-discovery
---

# Search an HSPA

## In plain words

Every [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) exposes this endpoint to receive searches. The first search of an exchange comes from the [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway), signed with `X-Gateway-Authorization`. In Physical Consultation, a second search for the chosen doctor's slots comes [directly](/docs/uhi/v1/getting-started/glossary#direct-call-p2p) from the [EUA](/docs/uhi/v1/getting-started/glossary#eua), signed with `Authorization`. Reply with an `ACK` at once, then answer with `on_search`.

## Before you start

Your HSPA registered on the network for your service's `domain`, with `/search` public over HTTPS. See [Routes](/docs/uhi/v1/concepts/routes).

## What happens

Check the signature before you act: the Gateway's key for `X-Gateway-Authorization`, or the EUA's key from the [registry lookup](/docs/uhi/v1/concepts/registry-lookup) for `Authorization`. Answer a Gateway search at the Gateway's `on_search` endpoint. Answer a direct search at the EUA's `consumer_uri`.

## How you know it worked

The caller receives your HTTP 200 and `ACK`. Your `on_search` then carries the same `transaction_id` and `message_id` as the search.

## When it goes wrong

A signature that does not verify means the search is not to be trusted. When you reject a call, send all four fields of the error object. See [Errors](/docs/uhi/v1/concepts/errors). A `transaction_id` that differs from the search's is the most common reason an EUA never sees your catalog.
