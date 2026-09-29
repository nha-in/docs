---
id: uhi.test.pmjay-hem-search-filters
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: PM-JAY HEM test cases for search filters
summary: TC-B01 to TC-B06 check search by state, district, speciality, hospital
  name, pincode, and GPS with a radius and no state.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/resources/pmjay-hem.md
    status: page
    note: Generated from site/docs/uhi/v1/resources/pmjay-hem.md#b-search-filters.
      Edit the page, never this file.
related:
  concepts:
    - uhi.concept.pmjay-hem-search-variants
  flows:
    - uhi.flow.pmjay-hem-discovery
  endpoints:
    - uhi.endpoint.network-gateway-search
---

# PM-JAY HEM test cases for search filters

## In plain words

| ID | What it checks | Passes when |
| --- | --- | --- |
| TC-B01 | Searching a state returns hospitals in that state. | A `search` with `location.state.name` and `location.state.code` returns provider records, all in the specified state. |
| TC-B02 | Adding a district narrows the results to that district. | A state `search` with `location.district.name` and `location.district.code` returns only hospitals in the specified district. |
| TC-B03 | Adding a speciality returns hospitals that offer it. | A state `search` with `category.descriptor.name` and `category.descriptor.code` returns providers whose `categories[]` each contain the matching speciality. |
| TC-B04 | Searching by hospital name finds that hospital. | A state `search` with `provider.descriptor.name` set to a known hospital returns hospitals whose name matches the input. |
| TC-B05 | Adding a pincode returns hospitals in that area. | A state `search` with a valid 6 digit `address.area_code` returns results geographically consistent with the pincode. |
| TC-B06 | Searching near a location returns hospitals within the chosen distance. | A `search` with `location.gps`, `radius.type: CONSTANT`, `radius.value` and `radius.unit: km`, and no state, returns hospitals whose GPS coordinates fall within the declared radius. |
