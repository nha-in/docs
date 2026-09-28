---
id: uhi.test.ambulance-search-filters
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: Ambulance Booking test cases for search filters
summary: AMB-B-01 to AMB-B-06 check emergency and non-emergency searches, pickup
  and drop-off, ambulance class and additional services.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/resources/ambulance.md
    status: page
    note: Generated from site/docs/uhi/v1/resources/ambulance.md#b-search-filters.
      Edit the page, never this file.
related:
  flows:
    - uhi.flow.ambulance-discovery
  concepts:
    - uhi.concept.ambulance-service-identity
  endpoints:
    - uhi.endpoint.network-gateway-search
  glossary:
    - uhi.glossary.fulfillment-type
---

# Ambulance Booking test cases for search filters

## In plain words

| ID | In plain words | Passes when |
| --- | --- | --- |
| AMB-B-01 | An emergency search with only a pickup location gets answers. | An `EMERGENCY` search with `SOURCE` and no `DESTINATION` gets an `on_search` catalog of type `EMERGENCY`. |
| AMB-B-02 | A non-emergency search with pickup and drop-off gets answers. Applies once non-emergency search is part of the service. | A `NON_EMERGENCY` search with `SOURCE` and `DESTINATION` gets an `on_search` catalog of type `NON_EMERGENCY`. |
| AMB-B-03 | A non-emergency search without a drop-off is refused. Applies once non-emergency search is part of the service. | A `NON_EMERGENCY` search with `SOURCE` only gets a NACK from the Gateway or the HSPA for the missing `DESTINATION`. |
| AMB-B-04 | Asking for one class returns only that class. | A search with category code `ALS` gets an `on_search` catalog holding only `ALS` fulfillments. |
| AMB-B-05 | Asking for all classes returns every class. | A search with no category code, or `ALL`, gets an `on_search` catalog holding every available fulfillment type. |
| AMB-B-06 | Requested extra services show up in the answer. | A search with the `additional_services` tag gets fulfillments that include or acknowledge `additional_services`. |
