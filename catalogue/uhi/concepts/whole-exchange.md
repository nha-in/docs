---
id: uhi.concept.whole-exchange
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: The whole UHI exchange, from search to direct booking
summary: Search and on_search pass through the UHI Gateway; from init onwards
  the EUA and HSPA call each other directly, with audit copies for Physical
  Consultation.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/routes.mdx
    status: page
    note: Generated from site/docs/uhi/v1/concepts/routes.mdx#the-whole-exchange.
      Edit the page, never this file.
related:
  concepts:
    - uhi.concept.gateway-routes
    - uhi.concept.direct-calls
    - uhi.concept.audit-copies
  endpoints:
    - uhi.endpoint.network-gateway-search
---

# The whole UHI exchange, from search to direct booking

## In plain words

Steps 1 to 7 apply to every service. The optional block applies to Physical Consultation, with audit copies, and to Ambulance Booking, for `init` and `on_init` only.

```mermaid
sequenceDiagram
    autonumber
    participant EUA as EUA
    participant GW as UHI Gateway
    participant HSPA as HSPA
    participant REG as Network registry
    EUA->>GW: POST /api/v1/uhi/search (Authorization)
    GW-->>EUA: HTTP 200 ACK (receipt only)
    GW->>HSPA: POST /search (X-Gateway-Authorization)
    HSPA-->>GW: HTTP 200 ACK
    HSPA->>GW: POST /api/v1/uhi/on_search (catalog)
    GW->>EUA: POST /on_search to consumer_uri
    EUA-->>GW: HTTP 200 ACK
    opt Services with booking, after on_search
        EUA->>REG: POST /api/v1/networkregistry/lookup
        REG-->>EUA: HSPA public key
        EUA->>HSPA: init onwards, direct to provider_uri
        HSPA->>EUA: on_init onwards, direct to consumer_uri
        HSPA->>GW: Audit copies (on_confirm, on_status, on_update, on_cancel)
    end
```
