---
id: uhi.callback.consultation-on-update-to-hspa
type: callback
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send an order update to the HSPA
summary: The EUA tells the HSPA the doctor did not appear. DOCTOR_NO_SHOW is the
  only state the EUA sets.
generated: true
operation: uhi_consultation_on_update_to_hspa
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_on_update_to_hspa.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_on_update_to_hspa.mdx#consultation-on-update-to-hspa.
      Edit the page, never this file.
related:
  callbacks:
    - uhi.callback.consultation-on-update-to-eua
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.signing-headers
  flows:
    - uhi.flow.consultation-fulfilment
---

# Send an order update to the HSPA

## In plain words

The [EUA](/docs/uhi/v1/getting-started/glossary#eua) tells the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) that the doctor did not appear, [directly](/docs/uhi/v1/getting-started/glossary#direct-call-p2p) at its [`provider_uri`](/docs/uhi/v1/getting-started/glossary#provider-uri). The body carries the `order.id` from `on_init` and the state `DOCTOR_NO_SHOW`, the only state the EUA sets. Every other state change comes from the HSPA, and a cancellation goes through `cancel`. See [Physical Consultation](/docs/uhi/v1/services/consultation#journey-3-fulfilment).

Sign every request with a fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

## Before you start

A confirmed order, and its `order.id` and `transaction_id`.

## How you know it worked

An HTTP 200 carrying `ACK` from the HSPA.

## When it goes wrong

Send no state here other than `DOCTOR_NO_SHOW`: every other state belongs to the HSPA. A 401 means the signature was built over a different body, was reused, or has expired.
