---
id: uhi.callback.consultation-on-confirm
type: callback
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send the confirmed order and PIN
summary: The HSPA answers confirm with the order CONFIRMED and a 4-digit PIN for
  check-in, and sends an exact copy to on_confirm_audit.
generated: true
operation: uhi_consultation_on_confirm
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_on_confirm.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_on_confirm.mdx#consultation-on-confirm.
      Edit the page, never this file.
related:
  endpoints:
    - uhi.endpoint.consultation-confirm
    - uhi.endpoint.consultation-on-confirm-audit
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.verifying-signatures
    - uhi.concept.audit-copies
  flows:
    - uhi.flow.consultation-order
---

# Send the confirmed order and PIN

## In plain words

The [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) answers `confirm` with this call, sent [directly](/docs/uhi/v1/getting-started/glossary#direct-call-p2p) to the [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri). The order is `CONFIRMED`, or `FAILED`. A confirmed order carries a 4-digit PIN, valid to the end of the appointment day, which the patient shows at check-in. The HSPA also sends an exact copy to the Gateway's `on_confirm_audit`. See [Physical Consultation](/docs/uhi/v1/services/consultation).

## Before you start

As the HSPA, a `confirm` received with all five terms `AGREED`, and answered with an `ACK`. Sign with your own `Authorization` header.

## What happens

The PIN goes in `authorization`, with type `PIN` and status `GENERATED`. It moves to `VERIFIED` at check-in, or to `HSPAOVERRIDE` when staff bypass it with an override reason code. Tag `@abdm/gov.in/messaging_support` and a helpline or facility number in `@abdm/gov.in/helpline_number`. The EUA keeps the PIN in memory only, never in a database or a log.

## How you know it worked

The EUA returns HTTP 200 with `ACK` and shows the PIN. The Gateway returns HTTP 200 with `ACK` to the audit copy.

## When it goes wrong

As the EUA, check the signature against the HSPA's key from the [registry lookup](/docs/uhi/v1/concepts/registry-lookup) before you show the PIN.
