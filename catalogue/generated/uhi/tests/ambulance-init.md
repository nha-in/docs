---
id: uhi.test.ambulance-init
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: Ambulance Booking test cases for init and on_init
summary: AMB-D-01 to AMB-D-07 check the order id, the itemised quote, all five
  terms, locations and an ABHA address as customer id.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/resources/ambulance.md
    status: page
    note: Generated from site/docs/uhi/v1/resources/ambulance.md#d-init-and-on-init.
      Edit the page, never this file.
related:
  endpoints:
    - uhi.endpoint.ambulance-init
  callbacks:
    - uhi.callback.ambulance-on-init
  flows:
    - uhi.flow.ambulance-order
  glossary:
    - uhi.glossary.direct-call-p2p
---

# Ambulance Booking test cases for init and on_init

## In plain words

| ID | In plain words | Passes when |
| --- | --- | --- |
| AMB-D-01 | The EUA can start an order for an ambulance the HSPA listed. | An `init` naming an `item.id` and `fulfillment_id` from the prior `on_search` gets an ACK, then an `on_init`. |
| AMB-D-02 | The quote carries an order id. | `on_init` contains a non-empty, unique `order.id`. |
| AMB-D-03 | The quote is itemised. | `on_init` has a `quote.breakup` with at least one entry that has a title and a price. |
| AMB-D-04 | All five terms come back for review. | `on_init` carries Commercial, Settlement, Cancellation, Refund and Payment terms, each with `termsState: INITIATED`. |
| AMB-D-05 | No driver or vehicle details come back with the quote. | `on_init` holds no driver name, vehicle number or agent phone. |
| AMB-D-06 | The quote keeps the locations the EUA sent. | The locations in `on_init` match the `SOURCE` and `DESTINATION` sent in `init`. |
| AMB-D-07 | The HSPA accepts the patient identified by ABHA address. | An `init` with `customer.id` as an ABHA address is accepted and processed, and `on_init` is returned. |
