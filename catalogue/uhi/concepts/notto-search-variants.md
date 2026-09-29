---
id: uhi.concept.notto-search-variants
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: NOTTO search filters and organ and tissue codes
summary: A mandatory organ or tissue code, an optional state with LGD codes,
  district only with state, no GPS yet, and the organ and tissue master list.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/notto.mdx
    status: page
    note: Generated from site/docs/uhi/v1/services/notto.mdx#search-variants. Edit
      the page, never this file.
related:
  flows:
    - uhi.flow.notto-discovery
  endpoints:
    - uhi.endpoint.network-gateway-search
---

# NOTTO search filters and organ and tissue codes

## In plain words

| Filter | Field | Status |
| --- | --- | --- |
| Organ or tissue type | `category.descriptor.code` and `.name` | Mandatory |
| State | `location.state.code`, an LGD code such as `06`, and `.name` such as `Haryana` | Optional |
| District | `location.district.code` and `.name` | Optional. Needs state. |
| GPS and radius | `location.gps`, `radius` with `CONSTANT`, a value and `km` | Not available yet |

State, district and city codes follow the Local Government Directory (LGD).

### Organ and tissue codes

| Type | Name | Code |
| --- | --- | --- |
| Organ | Liver | `2` |
| Organ | Kidney | `3` |
| Organ | Heart | `4` |
| Organ | Intestine | `7` |
| Organ | Pancreas | `8` |
| Organ | Lung | `12` |
| Tissue | Bone | `5` |
| Tissue | Heart Valve | `6` |
| Tissue | Skin | `9` |
| Tissue | Cornea | `10` |
| Tissue | Cartilage | `11` |
| Tissue | Blood Vessels | `13` |
| Tissue | Hand | `15` |
| Tissue | Amnion | `17` |
