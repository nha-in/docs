---
id: uhi.concept.blood-bank-search-variants
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Blood Bank search modes, blood group and component codes
summary: GPS and radius or state and district, with the blood group in item and
  the component in category, and the code lists for both.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/blood-bank.mdx
    status: page
    note: Generated from site/docs/uhi/v1/services/blood-bank.mdx#search-variants.
      Edit the page, never this file.
related:
  flows:
    - uhi.flow.blood-bank-discovery
  endpoints:
    - uhi.endpoint.network-gateway-search
---

# Blood Bank search modes, blood group and component codes

## In plain words

| Mode | Location fields | Blood filters |
| --- | --- | --- |
| GPS and radius | `location.gps`, `radius.type: CONSTANT`, `radius.value` such as `5`, `radius.unit: km` | `item.descriptor` for the blood group, `category.descriptor` for the component |
| State and district | `location.state.name` and `.code`, for example Maharashtra, `311`. `location.district.name` and `.code`, for example Pune, `022`. | The same |

Always send a blood group and a component. Use `All` with code `-1` when any blood group will do.

### Blood group codes

Send these in `item.descriptor.code`, with the name in `item.descriptor.name`.

| Code | Group | Code | Group |
| --- | --- | --- | --- |
| `-1` | All | `16` | O-Ve |
| `11` | A+Ve | `17` | AB+Ve |
| `12` | A-Ve | `18` | AB-Ve |
| `13` | B+Ve | `22` | Oh+Ve |
| `14` | B-Ve | `23` | Oh-Ve |
| `15` | O+Ve | | |

### Component codes

Send these in `category.descriptor.code`, with the name in `category.descriptor.name`.

| Code | Component | Code | Component |
| --- | --- | --- | --- |
| `11` | Whole Blood | `20` | Platelet Concentrate |
| `12` | Packed Red Blood Cells | `21` | Cryo Poor Plasma |
| `13` | Fresh Frozen Plasma | `23` | Random Donor Platelets |
| `14` | Single Donor Platelet | `24` | Platelets Additive Solutions |
| `16` | Platelet Rich Plasma | `28` | SAGM Packed Red Blood Cells |
| `17` | Cryoprecipitate | `29` | Irradiated RBC |
| `18` | Single Donor Plasma | `30` | Leukoreduced RBC |
| `19` | Plasma | | |
