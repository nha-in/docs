---
id: uhi.callback.consultation-on-status
type: callback
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send the order status
summary: The HSPA answers status with the full current order and its care
  context id, and sends an exact copy to on_status_audit.
generated: true
operation: uhi_consultation_on_status
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_on_status.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_on_status.mdx#consultation-on-status.
      Edit the page, never this file.
related:
  endpoints:
    - uhi.endpoint.consultation-status
    - uhi.endpoint.consultation-on-status-audit
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.verifying-signatures
    - uhi.concept.audit-copies
  flows:
    - uhi.flow.consultation-fulfilment
---

# Send the order status

## In plain words

The [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) answers `status` with the full current order, sent [directly](/docs/uhi/v1/getting-started/glossary#direct-call-p2p) to the [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri). It carries the order state and the care context id in `@abdm/gov.in/care_context_id`. The HSPA also sends an exact copy to the Gateway's `on_status_audit`. See [Physical Consultation](/docs/uhi/v1/services/consultation#journey-3-fulfilment).

## Before you start

As the HSPA, a `status` received and answered with an `ACK`. Sign with your own `Authorization` header and echo the `transaction_id` of the `status`.

## What happens

The order carries its current state, such as `CONFIRMED`, `APPOINTMENT_STARTED` or `COMPLETED`. The EUA updates its screen from the state it receives.

## How you know it worked

The EUA returns HTTP 200 with `ACK`. The Gateway returns HTTP 200 with `ACK` to the audit copy.

## When it goes wrong

As the EUA, check the signature against the HSPA's key from the [registry lookup](/docs/uhi/v1/concepts/registry-lookup) before you act on the state.
