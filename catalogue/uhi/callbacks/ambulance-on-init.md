---
id: uhi.callback.ambulance-on-init
type: callback
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send the quote and terms
summary: The ambulance HSPA answers init with the order.id, the confirmed price
  and breakup, payment details and five terms. It is a quote, not a booking.
generated: true
operation: uhi_ambulance_on_init
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_ambulance_on_init.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_ambulance_on_init.mdx#ambulance-on-init. Edit the
      page, never this file.
related:
  endpoints:
    - uhi.endpoint.ambulance-init
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.verifying-signatures
  flows:
    - uhi.flow.ambulance-order
---

# Send the quote and terms

## In plain words

The ambulance [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) answers `init` with this call, sent [directly](/docs/uhi/v1/getting-started/glossary#direct-call-p2p) to the [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri). It carries the `order.id`, the confirmed price with its breakup, the payment type and status, and five terms. The terms are Commercial, Settlement, Cancellation, Refund and Payment. This is a quote, not a booking: the provider then calls the caregiver to arrange dispatch. See [Ambulance Booking](/docs/uhi/v1/services/ambulance).

## Before you start

As the HSPA, an `init` received and answered with an `ACK`. Sign with your own `Authorization` header and echo the `transaction_id` and `message_id` of the `init`.

## What happens

Send each term with `termsState` set to `INITIATED`, and put the URL of your versioned terms in `terms_reference`. Echo the pickup location, and the drop-off when `init` sent one. The EUA shows the cancellation and payment terms before it enables any confirm action.

## How you know it worked

The EUA returns HTTP 200 with `ACK`, and shows the quote with all five terms.

## When it goes wrong

A quote with fewer than five terms fails testing. So does any `agent` block carrying driver or vehicle details. As the EUA, check the signature against the HSPA's key from the [registry lookup](/docs/uhi/v1/concepts/registry-lookup) before you show the quote.
