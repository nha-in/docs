---
id: uhi.endpoint.consultation-confirm
type: endpoint
gateway: uhi
milestone: n/a
version: uhi-v1
title: Confirm the order
summary: The EUA returns the order.id from on_init and all five terms marked
  AGREED; the HSPA answers with on_confirm and the PIN.
generated: true
operation: uhi_consultation_confirm
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_confirm.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_confirm.mdx#consultation-confirm.
      Edit the page, never this file.
related:
  callbacks:
    - uhi.callback.consultation-on-confirm
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.signing-headers
    - uhi.concept.consultation-terms
  flows:
    - uhi.flow.consultation-order
---

# Confirm the order

## In plain words

Once the patient agrees to the terms, the [EUA](/docs/uhi/v1/getting-started/glossary#eua) sends this [directly](/docs/uhi/v1/getting-started/glossary#direct-call-p2p) to the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa)'s [`provider_uri`](/docs/uhi/v1/getting-started/glossary#provider-uri). It carries the `order.id` from `on_init` and all five terms, each with `termsState` changed to `AGREED`. The HSPA replies with an `ACK`, then sends `on_confirm` with the confirmed order and the PIN. See [Physical Consultation](/docs/uhi/v1/services/consultation).

Sign every request with a fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

## Before you start

An `on_init` for this order, its five terms shown to the patient, and the patient's agreement. The slot is held for 15 minutes after `init`, so send `confirm` inside that window.

## What happens

Return the five terms unchanged except for `termsState`. Keep the same `transaction_id` and use the HSPA's `order.id`, never one you made yourself.

## How you know it worked

An HTTP 200 carrying `ACK`, then an `on_confirm` at your `consumer_uri` with the order `CONFIRMED` and a 4-digit PIN.

## When it goes wrong

One term still `INITIATED` causes rejection. A 401 means the signature was built over a different body, was reused, or has expired.
