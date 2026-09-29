---
id: uhi.flow.pmjay-hem-discovery
type: flow
gateway: uhi
milestone: n/a
version: uhi-v1
title: "PM-JAY HEM discovery: search to on_search"
summary: A signed search through the Gateway reaches the single PM-JAY HEM HSPA,
  which returns empanelled hospitals in one on_search on your callback.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/pmjay-hem.mdx
    status: page
    note: Generated from site/docs/uhi/v1/services/pmjay-hem.mdx#journey. Edit the
      page, never this file.
related:
  endpoints:
    - uhi.endpoint.network-gateway-search
  callbacks:
    - uhi.callback.network-on-search
  concepts:
    - uhi.concept.pmjay-hem-search-variants
    - uhi.concept.pmjay-hem-service-identity
    - uhi.concept.pmjay-hem-limits
  tests:
    - uhi.test.pmjay-hem-on-search
    - uhi.test.pmjay-hem-edge-cases
  glossary:
    - uhi.glossary.pm-jay-hem
---

# PM-JAY HEM discovery: search to on_search

## In plain words

A beneficiary searches for PM-JAY empanelled hospitals.

```mermaid
sequenceDiagram
    autonumber
    actor B as Beneficiary
    participant E as EUA (your app)
    participant G as UHI Gateway
    participant H as PM-JAY HEM HSPA
    B->>E: State + optional filter, or GPS
    E->>G: POST /api/v1/uhi/search
    G-->>E: HTTP 200 ACK
    G->>H: POST /search
    H->>H: Query the HEM database
    H->>G: POST /api/v1/uhi/on_search (hospital records)
    G->>E: POST /on_search to consumer_uri
    E-->>G: HTTP 200 ACK
    E->>B: Hospital list
```

The optional filter is one of district, speciality, facility name or pincode. If step 7 does not arrive within your timeout, stop waiting and offer a retry. If the catalog is empty, suggest a wider search.

The first call in the reference is [search](/docs/uhi/v1/api/network/endpoints/uhi-pmjay-hem/01-uhi-network-gateway-search).

## Before you start

The EUA has a public HTTPS `consumer_uri`, a subscriber ID, and signs every call. Set `nic2004:85112`, `PMJAYHEM` and `PMJAY` exactly. Send a state, or GPS with all three radius fields.

## What happens

The EUA sends `POST /api/v1/uhi/search`, and the Gateway answers HTTP 200 ACK. The Gateway forwards the search to the single PM-JAY HEM HSPA, which queries the HEM database. Its `on_search` reaches your `consumer_uri` through the Gateway. Answer it with HTTP 200 ACK. Expect one `on_search` per search.

## How you know it worked

An `on_search` arrives with your `transaction_id`, and each record in `catalog.providers[]` is one empanelled hospital.

## When it goes wrong

A wrong case in `PMJAYHEM` or `PMJAY` means no HSPA responds. If no `on_search` arrives within your timeout, stop waiting and offer a retry. If the catalog is empty, suggest a wider search. GPS search can miss hospitals, so offer district or pincode next to it.
