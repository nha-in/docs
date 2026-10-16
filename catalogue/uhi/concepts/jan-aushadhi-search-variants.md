---
id: uhi.concept.jan-aushadhi-search-variants
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Jan Aushadhi location filters, medicine name and ownership codes
summary: Kendra code, state and district, pincode or GPS for flows A and C, a
  medicine name for flow B, and the Kendra ownership codes.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/jan-aushadhi.mdx
    status: page
    note: Generated from site/docs/uhi/v1/services/jan-aushadhi.mdx#search-variants.
      Edit the page, never this file.
related:
  flows:
    - uhi.flow.jan-aushadhi-find-kendra
    - uhi.flow.jan-aushadhi-find-medicine
  endpoints:
    - uhi.endpoint.network-gateway-search
---

# Jan Aushadhi location filters, medicine name and ownership codes

## In plain words

### Location filters, flows A and C

| Search | Fields |
| --- | --- |
| Kendra code | `category.descriptor.code` and `.name`, both set to the Kendra code itself, for example `PMBJK02129` |
| State and district | `location.state.name` and `.code`, for example Telangana, `36`. `location.district.name` and `.code`, for example KHAMMAM, `509`. |
| Pincode | `address.area_code`, 6 digits, a sibling of `location` |
| GPS and radius | `location.gps`, `radius.type: CONSTANT`, `radius.value` such as `5`, `radius.unit: km` |
| Combined | State, district and pincode together, for the narrowest result |

### Medicine name, flow B

Put the medicine name in `item.descriptor.name`, and the same name without spaces in `item.descriptor.code`. For example, `Paracetamol` in both.

### Kendra ownership codes

A Kendra's `descriptor.code` in flows A and C is its ownership type.

| Code | Ownership |
| --- | --- |
| `PP` | Private-Private |
| `PG` | Private-Government |
| `GG` | Government-Government |

The list is not closed. Display an unrecognised code as sent.
