---
id: uhi.endpoint.consultation-cancel
type: endpoint
gateway: uhi
milestone: n/a
version: uhi-v1
title: Cancel the order
summary: The EUA cancels an appointment for the patient with cancelledby set to
  patient and a reason code; the HSPA answers with on_cancel.
generated: true
operation: uhi_consultation_cancel
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_cancel.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_cancel.mdx#consultation-cancel. Edit
      the page, never this file.
related:
  callbacks:
    - uhi.callback.consultation-on-cancel
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.signing-headers
    - uhi.concept.consultation-reason-codes
  flows:
    - uhi.flow.consultation-post-fulfilment
---

# Cancel the order

## In plain words

The [EUA](/docs/uhi/v1/getting-started/glossary#eua) cancels an appointment for the patient, [directly](/docs/uhi/v1/getting-started/glossary#direct-call-p2p) at the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa)'s [`provider_uri`](/docs/uhi/v1/getting-started/glossary#provider-uri). It carries the `order.id` and the tag `@abdm/gov.in/cancelledby` set to `patient`. The reason code goes in `@abdm/gov.in/cancel_reason`. The HSPA replies with an `ACK`, then sends `on_cancel`. See [the reason codes](/docs/uhi/v1/services/consultation#cancellation-and-override-reason-codes).

Sign every request with a fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

## Before you start

A confirmed order, and its `order.id` and `transaction_id`.

## What happens

Send a patient reason code, P1 to P7, exactly as listed. P7, Other, needs free text from the patient.

## How you know it worked

An HTTP 200 carrying `ACK`, then an `on_cancel` at your `consumer_uri` with the order `CANCELLED`.

## When it goes wrong

The `@abdm/gov.in/cancelledby` tag is mandatory, so the right terms apply. A 401 means the signature was built over a different body, was reused, or has expired.
