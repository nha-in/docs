---
id: uhi.test.ambulance-edge-cases
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: Ambulance Booking test cases for edge cases
summary: AMB-F-01 to AMB-F-04 check no answer, an empty provider list, a
  repeated search and an advance payment requirement.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/resources/ambulance.md
    status: page
    note: Generated from site/docs/uhi/v1/resources/ambulance.md#f-edge-cases. Edit
      the page, never this file.
related:
  concepts:
    - uhi.concept.timeouts
    - uhi.concept.render-as-results-arrive
  flows:
    - uhi.flow.ambulance-discovery
    - uhi.flow.ambulance-order
---

# Ambulance Booking test cases for edge cases

## In plain words

| ID | In plain words | Passes when |
| --- | --- | --- |
| AMB-F-01 | Nobody answers the search. | When no HSPA responds within the expected window, the EUA shows the user an appropriate message for the empty result. |
| AMB-F-02 | An HSPA answers with no ambulances. | An `on_search` with an empty `providers` array causes no crash and no display error in the EUA. |
| AMB-F-03 | The same search is sent twice. | A second `search` with the same `transaction_id` is deduplicated by the Gateway or ignored by the HSPA. |
| AMB-F-04 | The provider wants money in advance. | An `on_init` with `payment.type: PRE-ORDER` and a non-zero `minimum_Value` makes the EUA show the advance payment requirement. |
