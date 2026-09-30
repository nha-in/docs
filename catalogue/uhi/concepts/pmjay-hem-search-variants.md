---
id: uhi.concept.pmjay-hem-search-variants
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: PM-JAY HEM search variants and speciality codes
summary: State alone or state plus one filter, or GPS with no state; numeric
  codes as numbers, and speciality codes from the PM-JAY speciality list API.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/pmjay-hem.mdx
    status: page
    note: Generated from site/docs/uhi/v1/services/pmjay-hem.mdx#search-variants.
      Edit the page, never this file.
related:
  flows:
    - uhi.flow.pmjay-hem-discovery
  endpoints:
    - uhi.endpoint.network-gateway-search
  tests:
    - uhi.test.pmjay-hem-search-filters
---

# PM-JAY HEM search variants and speciality codes

## In plain words

| Search | Location and filter fields | Use it for |
| --- | --- | --- |
| State only | `location.state.name` in capitals, `location.state.code` numeric | Every empanelled hospital in a state |
| State and district | State, plus `location.district.name` in capitals and `location.district.code` | One district |
| State and speciality | State, plus `category.descriptor.name` and `.code`, for example Cardiology, `100002` | A clinical speciality |
| State and facility name | State, plus `provider.descriptor.name` | A known hospital |
| State and pincode | State, plus `address.area_code`, a sibling of `fulfillment` and not inside `location` | A pincode area |
| GPS, no state | `location.gps`, `radius.type: CONSTANT`, `radius.value` such as `13.0`, `radius.unit: km` | Nearby hospitals |

Send district code, pincode and speciality code as numbers, not strings. State names go in capitals with a numeric code, for example `ANDHRA PRADESH` and `28`.

### Speciality codes

Take speciality codes from the PM-JAY speciality list API, not from a static list. Sandbox uses `apisbeta.nha.gov.in` and production uses `apisprod.nha.gov.in`. The rest of the call is the same.

```bash
curl --location 'https://apisbeta.nha.gov.in/pmjay/payer/hbp/get/scheme/specialities' \
  --header 'Accept: application/json' \
  --header 'source: internal' \
  --header 'Content-Type: application/json' \
  --header 'pid: 33222' \
  --data '{"schemecode": "PMJAY", "hosptype": "H"}'
```
