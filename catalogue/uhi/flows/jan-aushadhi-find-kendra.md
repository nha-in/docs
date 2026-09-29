---
id: uhi.flow.jan-aushadhi-find-kendra
type: flow
gateway: uhi
milestone: n/a
version: uhi-v1
title: "Jan Aushadhi: find a Kendra"
summary: A search of type JANAUSHADHI through the Gateway reaches the PMBI HSPA,
  which returns Kendras by location or Kendra code in one on_search.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/jan-aushadhi.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/services/jan-aushadhi.mdx#journey-1-find-a-kendra. Edit
      the page, never this file.
related:
  endpoints:
    - uhi.endpoint.network-gateway-search
  callbacks:
    - uhi.callback.network-on-search
  concepts:
    - uhi.concept.jan-aushadhi-search-variants
    - uhi.concept.jan-aushadhi-service-identity
  glossary:
    - uhi.glossary.pmbi
---

# Jan Aushadhi: find a Kendra

## In plain words

A citizen searches for Jan Aushadhi Kendras.

```mermaid
sequenceDiagram
    autonumber
    actor C as Citizen
    participant E as EUA (your app)
    participant G as UHI Gateway
    participant P as PMBI HSPA
    C->>E: Location filter or Kendra code
    E->>G: POST /api/v1/uhi/search (JANAUSHADHI)
    G-->>E: HTTP 200 ACK
    G->>P: POST /search
    P->>P: Query the Kendra database
    P->>G: POST /api/v1/uhi/on_search (Kendra records)
    G->>E: POST /on_search to consumer_uri
    E-->>G: HTTP 200 ACK
    E->>C: Kendra list
```

The first call in the reference is [search](/docs/uhi/v1/api/network/endpoints/uhi-jan-aushadhi-kendra-search/01-uhi-network-gateway-search).

## Before you start

The EUA has a public HTTPS `consumer_uri` and signs every call. Set `nic2008:47721`, and `JANAUSHADHI` as both the fulfillment type and the item code and name. Every location filter is optional.

## What happens

The EUA sends `POST /api/v1/uhi/search` with a location filter, or with a Kendra code in `category.descriptor.code` and `.name`. The Gateway answers HTTP 200 ACK and forwards it to `pmbi.hspa`. Its `on_search` reaches your `consumer_uri` through the Gateway.

## How you know it worked

An `on_search` arrives with your `transaction_id`. Each `providers[]` record is one Kendra, and its `id` is the Kendra code.

## When it goes wrong

A wrong `fulfillment.type` returns the wrong kind of catalog, or nothing. Empty city, email, `short_desc` or `long_desc` are not errors. Display an unrecognised ownership code as sent. Check the HSPA's signature with key ID `pmbi.hspapid.jak`.
