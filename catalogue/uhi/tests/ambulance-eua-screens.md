---
id: uhi.test.ambulance-eua-screens
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: Ambulance Booking test cases for EUA screens
summary: AMB-E-01 to AMB-E-05 check that the EUA shows the operator, arrival
  window, price and terms, and never driver or vehicle details.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/resources/ambulance.md
    status: page
    note: Generated from site/docs/uhi/v1/resources/ambulance.md#e-eua-screens. Edit
      the page, never this file.
related:
  concepts:
    - uhi.concept.screen-requirements
  flows:
    - uhi.flow.ambulance-discovery
    - uhi.flow.ambulance-order
  tests:
    - uhi.test.every-service-checks
---

# Ambulance Booking test cases for EUA screens

## In plain words

| ID | In plain words | Passes when |
| --- | --- | --- |
| AMB-E-01 | The user sees who runs each ambulance. | The HSPA name and logo from `catalog.descriptor` appear in the search results whenever the response carries them. |
| AMB-E-02 | The user sees when each ambulance should arrive. | Each ambulance shows its arrival window from `fulfillment.start` and `fulfillment.end`. |
| AMB-E-03 | The user sees a price before choosing. | Each listing shows `item.price.value` before the user selects an option. |
| AMB-E-04 | The user reads the terms before going further. | The full `on_init` terms, cancellation and payment, are on screen, and the confirm action is enabled only after review. |
| AMB-E-05 | The user never sees driver or vehicle details. | No search, listing or `init` review screen shows driver or vehicle details. |
