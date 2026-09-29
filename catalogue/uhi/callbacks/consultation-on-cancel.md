---
id: uhi.callback.consultation-on-cancel
type: callback
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send the cancelled order
summary: The HSPA sends the cancelled order to the EUA, after a patient's cancel
  or when the doctor cancels, and copies it to on_cancel_audit.
generated: true
operation: uhi_consultation_on_cancel
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_on_cancel.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_on_cancel.mdx#consultation-on-cancel.
      Edit the page, never this file.
related:
  endpoints:
    - uhi.endpoint.consultation-cancel
    - uhi.endpoint.consultation-on-cancel-audit
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.verifying-signatures
    - uhi.concept.audit-copies
    - uhi.concept.consultation-reason-codes
  flows:
    - uhi.flow.consultation-post-fulfilment
---

# Send the cancelled order

## In plain words

The [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) sends the cancelled order to the [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri). It answers a patient's `cancel`, or tells the EUA the doctor has cancelled. The tag `@abdm/gov.in/cancelledby` reads `patient` or `doctor`, and `@abdm/gov.in/cancel_reason` carries the reason code. The HSPA also sends an exact copy to the Gateway's `on_cancel_audit`. See [the reason codes](/docs/uhi/v1/services/consultation#cancellation-and-override-reason-codes).

## Before you start

As the HSPA, a confirmed order. Sign with your own `Authorization` header and keep the order's `transaction_id`.

## What happens

The order state is `CANCELLED`. When the doctor cancels, send a doctor reason code, D1 to D6, exactly as listed. D6, Other, needs free text from the HSPA.

## How you know it worked

The EUA returns HTTP 200 with `ACK` and shows the appointment as cancelled. The Gateway returns HTTP 200 with `ACK` to the audit copy.

## When it goes wrong

As the EUA, check the signature against the HSPA's key from the [registry lookup](/docs/uhi/v1/concepts/registry-lookup) before you release the appointment.
