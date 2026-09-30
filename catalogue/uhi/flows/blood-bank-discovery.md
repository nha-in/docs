---
id: uhi.flow.blood-bank-discovery
type: flow
gateway: uhi
milestone: n/a
version: uhi-v1
title: "Blood Bank discovery: search to on_search from every Blood Bank HSPA"
summary: One search through the Gateway reaches every registered Blood Bank
  HSPA; aggregate their on_search answers by transaction_id within 10 to 15
  seconds.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/blood-bank.mdx
    status: page
    note: Generated from site/docs/uhi/v1/services/blood-bank.mdx#journey. Edit the
      page, never this file.
related:
  endpoints:
    - uhi.endpoint.network-gateway-search
    - uhi.endpoint.network-search
  callbacks:
    - uhi.callback.network-on-search
    - uhi.callback.network-gateway-on-search
  concepts:
    - uhi.concept.blood-bank-search-variants
    - uhi.concept.blood-bank-service-identity
    - uhi.concept.blood-bank-limits
    - uhi.concept.aggregate-answers
---

# Blood Bank discovery: search to on_search from every Blood Bank HSPA

## In plain words

A patient's family searches for blood of a given group and component.

```mermaid
sequenceDiagram
    autonumber
    actor P as Patient family
    participant E as EUA (your app)
    participant G as UHI Gateway
    participant H as Blood Bank HSPAs
    P->>E: Blood group + component + location
    E->>G: POST /api/v1/uhi/search (BloodStock)
    G-->>E: HTTP 200 ACK
    loop Once per registered Blood Bank HSPA
        G->>H: POST /search
        H->>H: Query blood bank inventory
        H->>G: POST /api/v1/uhi/on_search (banks, availability, units)
        G->>E: POST /on_search to consumer_uri
        E-->>G: HTTP 200 ACK
    end
    E->>P: Blood banks with stock and contact
```

Steps 4 to 8 happen once per registered Blood Bank HSPA. Aggregate results by `transaction_id` as they arrive, and close the window after 10 to 15 seconds.

The first call in the reference is [search](/docs/uhi/v1/api/network/endpoints/uhi-blood-bank/01-uhi-network-gateway-search).

## Before you start

The EUA has a public HTTPS `consumer_uri` and signs every call. Set `nic2008:86906` and `BloodStock`. Send the blood group in `item.descriptor`, the component in `category.descriptor`, and one location mode.

## What happens

The EUA sends `POST /api/v1/uhi/search`, and the Gateway answers HTTP 200 ACK. The Gateway forwards the search to every registered Blood Bank HSPA. Each HSPA answers with its own `on_search` on your `consumer_uri`. Answer each with HTTP 200 ACK and aggregate them by `transaction_id`.

## How you know it worked

At least one `on_search` arrives with your `transaction_id`. Each blood group item carries `quantity.count` and a `fulfillment_id` that points to its availability.

## When it goes wrong

A wrong `domain` means no HSPA responds. No end signal arrives, so close the window after 10 to 15 seconds. The unavailable status arrives as `NotAvailable` or `Not Available`, so match both. Counts are indicative: show the phone number and a call to confirm.
