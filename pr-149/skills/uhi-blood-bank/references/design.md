# Design UHI Blood Bank discovery

What the service is on the network, what a search may carry, what the service will not do, and what the screens around the calls have to do.

## Blood Bank service identity

| Field | Value |
| --- | --- |
| `context.domain` | `nic2008:86906` |
| `context.core_version` | `0.7.1` |
| `message.intent.fulfillment.type` | `BloodStock` |
| EUA sends | `POST /api/v1/uhi/search` on the Gateway |
| HSPA sends | `POST /api/v1/uhi/on_search` on the Gateway |
| Sandbox reference HSPA | `provider_id` `nha.hspa`, `provider_uri` `https://hspasbx.abdm.gov.in/api/v1/hspa/bloodbank` |

A wrong `domain` means no HSPA responds to your search.

From `uhi.concept.blood-bank-service-identity`.

## Blood Bank search modes, blood group and component codes

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

From `uhi.concept.blood-bank-search-variants`.

## Blood Bank limits to code against

| Limit | What to do |
| --- | --- |
| GPS search can return incomplete results where blood bank density is low | Offer state and district search next to GPS, and surface both in your UI |
| Stock counts update at different frequencies, some in real time and some daily | Show a disclaimer that counts are indicative. Recommend a call to the blood bank before travelling. |
| `on_search` has no end of results signal | Wait 10 to 15 seconds. Show results as they arrive rather than waiting for all of them. |
| `on_search` is not paginated | Handle large payloads without blocking the UI. Paginate or lazy load on the client. |
| No booking or reservation | Keep your UI to discovery. Show the blood bank's phone number prominently so users can call to reserve or confirm. |

From `uhi.concept.blood-bank-limits`.

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
