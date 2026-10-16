---
id: uhi.endpoint.ambulance-init
type: endpoint
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send the patient's details for a quote
summary: The EUA sends the chosen ambulance, billing details, the patient's ABHA
  address and the pickup location directly to the HSPA, which answers with
  on_init.
generated: true
operation: uhi_ambulance_init
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_ambulance_init.mdx
    status: page
    note: Generated from site/docs/_notes/uhi/uhi_ambulance_init.mdx#ambulance-init.
      Edit the page, never this file.
related:
  callbacks:
    - uhi.callback.ambulance-on-init
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.signing-headers
    - uhi.concept.registry-lookup
  flows:
    - uhi.flow.ambulance-order
---

# Send the patient's details for a quote

## In plain words

The [EUA](/docs/uhi/v1/getting-started/glossary#eua) sends this [directly](/docs/uhi/v1/getting-started/glossary#direct-call-p2p) to the chosen ambulance [HSPA](/docs/uhi/v1/getting-started/glossary#hspa), at the `provider_uri` from its `on_search`. It carries the chosen provider, item and fulfillment ids, the billing details, the patient's ABHA address in `order.customer.id` and the pickup location. The HSPA replies with an `ACK`, then sends a quote and terms as `on_init`. It is not a booking. See [Ambulance Booking](/docs/uhi/v1/services/ambulance).

Sign every request with a fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

## Before you start

An `on_search` from the chosen HSPA, with its `provider_id` and `provider_uri` stored. Keep the same `transaction_id` as the search. Fetch the HSPA's key with the [registry lookup](/docs/uhi/v1/concepts/registry-lookup), so you can check its `on_init`.

## What happens

Send the item id and fulfillment id exactly as `on_search` gave them. The order's fulfillment id matches the item's `fulfillment_id`, and its type is `EMERGENCY`. The pickup goes in the order's locations as `SOURCE`; a `DESTINATION` is optional.

## How you know it worked

An HTTP 200 carrying `ACK`, then an `on_init` at your `consumer_uri` with the same `transaction_id`.

## When it goes wrong

A 401 means the signature was built over a different body, was reused, or has expired: sign again for this exact body. Never send an `agent` block: driver and vehicle details must appear in no payload.
