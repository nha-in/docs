---
id: uhi.callback.consultation-on-init
type: callback
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send the order with its quote and terms
summary: The HSPA answers init with the order.id, the quote and five terms
  marked INITIATED, which the patient reads before the EUA confirms.
generated: true
operation: uhi_consultation_on_init
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_on_init.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_on_init.mdx#consultation-on-init.
      Edit the page, never this file.
related:
  endpoints:
    - uhi.endpoint.consultation-init
    - uhi.endpoint.consultation-confirm
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.verifying-signatures
    - uhi.concept.consultation-terms
  flows:
    - uhi.flow.consultation-order
---

# Send the order with its quote and terms

## In plain words

The [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) answers `init` with this call, sent [directly](/docs/uhi/v1/getting-started/glossary#direct-call-p2p) to the [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri). It assigns the `order.id` and carries the quote and five terms: Commercial, Settlement, Cancellation, Refund and Payment. The patient reads the terms before the EUA sends `confirm`. The slot stays held for 15 minutes after `init`. See [Physical Consultation](/docs/uhi/v1/services/consultation#terms-content).

## Before you start

As the HSPA, an `init` received and answered with an `ACK`, and the slot held. Sign with your own `Authorization` header and echo the `transaction_id` of the `init`.

## What happens

Send every term with `termsState` set to `INITIATED`. Payment is on the visit, so an unpaid order carries `NOT_PAID`. The EUA shows all five terms, then returns them in `confirm` with the same `order.id`.

## How you know it worked

The EUA returns HTTP 200 with `ACK` and shows the quote and all five terms.

## When it goes wrong

As the EUA, check the signature against the HSPA's key from the [registry lookup](/docs/uhi/v1/concepts/registry-lookup) before you show anything. An `on_init` that never arrives leaves the order without an `order.id`, so do not send `confirm`.
