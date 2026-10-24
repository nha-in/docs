# Design UHI Jan Aushadhi

What the service is on the network, what a search may carry, what the service will not do, and what the screens around the calls have to do.

## Jan Aushadhi service identity for flows A, B and C

| Field | Flow A | Flow B | Flow C |
| --- | --- | --- | --- |
| `context.domain` | `nic2008:47721` | `nic2008:47721` | `nic2008:47721` |
| `context.core_version` | `0.7.1` | `0.7.1` | `0.7.1` |
| `intent.fulfillment.type` | `JANAUSHADHI` | `JANAUSHADHI_MEDICINE` | `JANAUSHADHI_KENDRA` |
| `intent.item.descriptor.code` | `JANAUSHADHI` | Medicine name, no spaces | `medicineId` from flow B |
| `intent.item.descriptor.name` | `JANAUSHADHI` | Medicine name | `medicineId` from flow B |

| HSPA | Value |
| --- | --- |
| Provider ID | `pmbi.hspa` |
| Sandbox URL | `https://staging-nha-pmbi.pmbi.co.in/api/store` |
| Public key ID | `pmbi.hspapid.jak`, for checking the HSPA's signatures |
| Gateway endpoint | `POST /api/v1/uhi/search` |

From `uhi.concept.jan-aushadhi-service-identity`.

## Jan Aushadhi location filters, medicine name and ownership codes

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

From `uhi.concept.jan-aushadhi-search-variants`.

## Aggregating the on_search answers to one UHI search

The [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) broadcasts
a search to every HSPA registered for the domain. Each matching HSPA replies
separately, so group them by the shared `transaction_id`.

| Service | What to expect |
| --- | --- |
| PM-JAY HEM, Jan Aushadhi, NOTTO | One HSPA, so one `on_search` per search |
| Blood Bank | Several HSPAs. Aggregate within a 10 to 15 second window |
| Physical Consultation | One catalog per HSPA with doctors, fees and `provider_uri` |
| Ambulance Booking | Only HSPAs that serve the pickup area answer. Silence means no coverage, not a network fault |

From `uhi.concept.aggregate-answers`.

## Timing out a UHI search and rendering results as they arrive

A search has no end signal. Nothing tells you the last answer has arrived.

- Set a timeout for each search, and keep it a configuration value.
- Render each `on_search` as it arrives. Do not wait for all of them.
- When the timeout passes with nothing received, stop waiting and offer a retry. Never leave the screen loading.
- An empty result is a result. Show a fallback message and suggest a wider search.

Blood Bank's window is 10 to 15 seconds. No figure is set for the other
services, so agree one at onboarding.

From `uhi.concept.render-as-results-arrive`.

## Paginating UHI search results on your side

`on_search` is not paginated. Handle a large payload without blocking the
screen, and page through it in your own UI.

From `uhi.concept.paginate-client-side`.

## What UHI app screens must do

The service pages carry each service's own rules. The rules below are checked
at sign-off or required of every app.

| Rule | Service |
| --- | --- |
| Reach the feature within 3 taps, under a health or insurance category | [PM-JAY HEM](/docs/uhi/v1/services/pmjay-hem#concepts-explored) |
| Show "Powered by UHI" with PM-JAY and [ABDM](/docs/uhi/v1/getting-started/glossary#abdm) branding | PM-JAY HEM |
| Show a fallback message on empty results | PM-JAY HEM |
| Display "Please confirm the hospital location by calling ahead, as details may change." | PM-JAY HEM |
| Show the phone number and a "call to confirm" disclaimer, because counts are indicative | [Blood Bank](/docs/uhi/v1/services/blood-bank) |
| Show the terms from `on_init` before enabling any confirm action | [Physical Consultation](/docs/uhi/v1/services/consultation), [Ambulance Booking](/docs/uhi/v1/services/ambulance) |
| Keep the 4-digit PIN in memory only, never in a database or a log | Physical Consultation |
| Show no driver or vehicle details in Phase 1 | Ambulance Booking |
| Show the transplant coordinator's phone first | [NOTTO](/docs/uhi/v1/services/notto) |
| Scope the screen to discovery. Do not build booking where the service has none | PM-JAY HEM, Blood Bank, Jan Aushadhi, NOTTO |

From `uhi.concept.screen-requirements`.
