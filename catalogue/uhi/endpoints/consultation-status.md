---
id: uhi.endpoint.consultation-status
type: endpoint
gateway: uhi
milestone: n/a
version: uhi-v1
title: Request the order status
summary: The EUA asks the HSPA for the full current order, only when an expected
  on_update never arrives; the HSPA answers with on_status.
generated: true
operation: uhi_consultation_status
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_status.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_status.mdx#consultation-status. Edit
      the page, never this file.
related:
  callbacks:
    - uhi.callback.consultation-on-status
    - uhi.callback.consultation-on-update-to-eua
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.signing-headers
  flows:
    - uhi.flow.consultation-fulfilment
---

# Request the order status

## In plain words

The [EUA](/docs/uhi/v1/getting-started/glossary#eua) asks the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) for the full current order, [directly](/docs/uhi/v1/getting-started/glossary#direct-call-p2p) at its [`provider_uri`](/docs/uhi/v1/getting-started/glossary#provider-uri). Call it only when an expected `on_update` never arrives: the HSPA pushes every state change without being asked. The body names the order by the `order.id` from `on_init`. The HSPA replies with an `ACK`, then sends `on_status`.

Sign every request with a fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

## Before you start

A confirmed order, and its `order.id` and `transaction_id`.

## How you know it worked

An HTTP 200 carrying `ACK`, then an `on_status` at your `consumer_uri` carrying the order and its current state.

## When it goes wrong

A 401 means the signature was built over a different body, was reused, or has expired. Do not poll `status` on a timer in place of handling `on_update`.
