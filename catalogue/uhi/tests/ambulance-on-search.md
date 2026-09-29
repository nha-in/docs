---
id: uhi.test.ambulance-on-search
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: Ambulance Booking test cases for on_search
summary: AMB-C-01 to AMB-C-05 check fulfillment ids and types, price links, the
  case type, no driver details and the transaction id.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/resources/ambulance.md
    status: page
    note: Generated from
      site/docs/uhi/v1/resources/ambulance.md#c-on-search-response. Edit the
      page, never this file.
related:
  callbacks:
    - uhi.callback.network-gateway-on-search
  flows:
    - uhi.flow.ambulance-discovery
  concepts:
    - uhi.concept.match-transaction-id
---

# Ambulance Booking test cases for on_search

## In plain words

| ID | In plain words | Passes when |
| --- | --- | --- |
| AMB-C-01 | Every ambulance has its own id and the right case type. | Every fulfillment in `on_search` has a unique `id` and the correct `type`, `EMERGENCY` or `NON_EMERGENCY`. |
| AMB-C-02 | Every price points at a real ambulance. | Every `items[].fulfillment_id` matches a fulfillment `id` in the same provider block. |
| AMB-C-03 | The answer is for the case type that was asked. | `fulfillment.type` in `on_search` equals the type sent in the `search`. |
| AMB-C-04 | No driver or vehicle details come back with the search. | No `on_search` fulfillment contains an `agent` block. |
| AMB-C-05 | The answer belongs to the search that asked for it. | `transaction_id` in `on_search` equals the one in the `search`. |
