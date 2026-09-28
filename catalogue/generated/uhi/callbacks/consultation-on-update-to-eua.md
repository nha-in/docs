---
id: uhi.callback.consultation-on-update-to-eua
type: callback
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send an order update to the EUA
summary: The HSPA pushes each appointment state change, APPOINTMENT_STARTED,
  COMPLETED or NO_SHOW, to the EUA and copies it to on_update_audit.
generated: true
operation: uhi_consultation_on_update_to_eua
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_on_update_to_eua.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_on_update_to_eua.mdx#consultation-on-update-to-eua.
      Edit the page, never this file.
related:
  endpoints:
    - uhi.endpoint.consultation-status
    - uhi.endpoint.consultation-on-update-audit
  callbacks:
    - uhi.callback.consultation-on-update-to-hspa
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.verifying-signatures
    - uhi.concept.audit-copies
  flows:
    - uhi.flow.consultation-fulfilment
---

# Send an order update to the EUA

## In plain words

The [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) pushes each change in the appointment's state to the [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri), without being asked. It sends `APPOINTMENT_STARTED`, `COMPLETED` or `NO_SHOW`. The HSPA also sends an exact copy to the Gateway's `on_update_audit`. See [Physical Consultation](/docs/uhi/v1/services/consultation#journey-3-fulfilment).

## Before you start

As the HSPA, a confirmed order. Sign with your own `Authorization` header and keep the order's `transaction_id`.

## What happens

Carry the care context id in `@abdm/gov.in/care_context_id`. Its audit copy is the one that counts for the Digital Health Incentive Scheme. A cancellation does not travel here: it goes through `cancel` and `on_cancel`.

## How you know it worked

The EUA returns HTTP 200 with `ACK` and shows the new state. The Gateway returns HTTP 200 with `ACK` to the audit copy.

## When it goes wrong

An EUA that expects an update and receives none calls `status`. As the EUA, check the signature against the HSPA's key from the [registry lookup](/docs/uhi/v1/concepts/registry-lookup).
