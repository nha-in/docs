---
title: Ambulance booking
sidebar_label: Ambulance booking
sidebar_position: 4
description: Find an ambulance nearby and get a quote from the provider, using the two call pairs live in this service today.
verification: unverified
source: UHI__UHI_AmbulanceBooking_Onboarding_v1.1-July2026.md
---

# Ambulance booking

Ambulance booking on [UHI](/docs/uhi/v1/getting-started/glossary#uhi) lets a patient or a caregiver find ambulances near them across every registered provider, see arrival windows and indicative charges, and start a booking with the one they pick. After this page you will know the four calls that are live today, their fields, and what [NHA](/docs/uhi/v1/getting-started/glossary#nha) tests your app for.

Read [UHI services](/docs/uhi/v1) first, for the `context` block, the acknowledgement model, signing and the two transports.

## What is live, and what is not

NHA is releasing this service in two phases.

| NHA's phase | Calls | Status |
| --- | --- | --- |
| First | `search`, `on_search`, `init`, `on_init` | Current |
| Second | `confirm`, `on_confirm`, `status`, `on_status`, `cancel`, `on_cancel`, `on_update` | Upcoming |

Today the flow ends at a quote. The patient discovers ambulances, picks one, sends their details with `init`, and receives a quote with terms in `on_init`. There is no `confirm`. NHA describes the outcome as the patient requesting a callback from the provider they chose.

Two limits follow from that.

- **The `agent` block must not appear in any current-phase payload.** Driver name, vehicle number and driver phone are post-confirmation data. NHA tests for their absence in `on_search` and `on_init`, and tests that your EUA shows no driver or vehicle UI at any point before confirmation.
- **Live tracking and dispatch updates are not available.** They arrive with NHA's second phase.

## Out of scope right now

- The `NON_EMERGENCY` flow. NHA's document describes it and prints sample payloads for it, marked as future scope. Build `EMERGENCY` first.
- Booking confirmation and order creation from the EUA.
- State-operated ambulance networks. 108, 102 and 112 services are not on UHI today.
- Patient transport ambulances. An HSPA may return a `PTA` category in its catalog. NHA's document says to ignore it.

## Service identity

| Field | Value |
| --- | --- |
| `context.domain` | `nic2008:86909` |
| `context.core_version` | `0.7.1` |
| `message.intent.item.descriptor.code` | `AMBULANCE` |
| `message.intent.fulfillment.type` | `EMERGENCY` or `NON_EMERGENCY` |

## Who is involved

| Role | What it does here |
| --- | --- |
| [EUA](/docs/uhi/v1/getting-started/glossary#eua) | The patient or caregiver app. Sends the search, shows options, sends `init`, shows the quote and terms |
| [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) | The ambulance operator's platform. Answers searches with live availability, answers `init` with a quote |
| [Gateway](/docs/uhi/v1/getting-started/glossary#gateway) | NHA's routing layer. Broadcasts the search. Not involved from `init` onwards |

## The four calls

| # | Call | Direction | What happens |
| --- | --- | --- | --- |
| 1 | `search` | EUA to gateway to HSPAs | The patient searches by case type, ambulance class and pickup location |
| 2 | `on_search` | HSPA to gateway to EUA | Each HSPA with availability returns a catalog with arrival windows and indicative pricing |
| 3 | `init` | EUA to HSPA, direct | The EUA sends patient details, billing and the chosen fulfilment |
| 4 | `on_init` | HSPA to EUA, direct | The HSPA returns a quote, payment terms and a cancellation policy |

Every one returns an acknowledgement synchronously. The real answer arrives later at the callback URL.

Silence is not an error. An HSPA answers only for areas it covers, so no response from a given HSPA tells you nothing about network health.

## Search filters

| Case type | Ambulance class codes | Location fields required |
| --- | --- | --- |
| `EMERGENCY` | `ALS`, `BLS`, `ALL` | `SOURCE` only: pickup GPS and address |
| `NON_EMERGENCY` | `ALS`, `BLS`, `ALL` | `SOURCE` and `DESTINATION`, both GPS and address |

`ALS` is advanced life support, `BLS` is basic life support. NHA's guidance for an emergency search is to set the class to `ALL` so nothing available is filtered out.

## search

`context` is the standard UHI block. The service-specific parts live in `message.intent`.

| Field | Type | Required | What it is |
| --- | --- | --- | --- |
| `category.descriptor.code` | string | Optional | Ambulance class: `ALS`, `BLS`, or `ALL` for every class |
| `fulfillment.type` | string | Mandatory | `EMERGENCY` or `NON_EMERGENCY` |
| `fulfillment.start.time.timestamp` | ISO 8601 | Mandatory | Requested pickup time. Use the current time for an emergency |
| `fulfillment.end.time.timestamp` | ISO 8601 | Optional | End of the acceptable window. Used for non-emergency only |
| `fulfillment.tags.additional_services` | string | Optional | Comma-separated extras, for example an oxygen cylinder |
| `locations[SOURCE].gps` | string | Mandatory | Pickup coordinates as `latitude,longitude` |
| `locations[SOURCE].address` | string | Mandatory | Pickup address text |
| `locations[DESTINATION].gps` | string | Conditional | Drop-off coordinates. Non-emergency only |
| `locations[DESTINATION].address` | string | Conditional | Drop-off address. Non-emergency only |
| `item.descriptor.code` | string | Mandatory | `AMBULANCE` |

### Sample, emergency

From NHA's document, with your identifiers substituted.

```json
{
  "context": {
    "domain": "nic2008:86909",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "<YOUR_EUA_ID_FROM_NHA_ONBOARDING>",
    "consumer_uri": "<YOUR_HTTPS_CALLBACK_URL>",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-03-23T15:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": { "code": "ALS", "name": "ALS" }
      },
      "fulfillment": {
        "type": "EMERGENCY",
        "start": { "time": { "timestamp": "2026-01-05T15:24:35" } },
        "end": { "time": { "timestamp": "2026-01-05T23:59:59" } },
        "tags": { "additional_services": "oxygen cylinder, etc" }
      },
      "locations": [
        {
          "descriptor": { "code": "SOURCE", "name": "SOURCE" },
          "gps": "12.423423,77.325647",
          "address": "SHIVAJI MARG, PUNE"
        }
      ],
      "item": {
        "descriptor": { "code": "AMBULANCE", "name": "AMBULANCE" }
      }
    }
  }
}
```

## on_search

| Field | Type | Required | What it is |
| --- | --- | --- | --- |
| `context.provider_id` | string | Mandatory | HSPA identifier. You need this for `init` |
| `context.provider_uri` | string | Mandatory | HSPA callback URL. You need this for `init` |
| `context.transaction_id` | string | Mandatory | Matches your search |
| `catalog.descriptor.name` | string | Mandatory | HSPA name |
| `catalog.descriptor.images` | string | Optional | HSPA logo. NHA prefers base64 |
| `catalog.descriptor.flag` | boolean | Mandatory | `false` means the service is active, `true` means paused |
| `providers[].id` | string | Mandatory | Provider identifier |
| `providers[].categories[].code` | string | Mandatory | Ambulance class: `ALS` or `BLS` |
| `providers[].fulfillments[].id` | string | Mandatory | Fulfilment ID, for example `ML-ALS-01` |
| `providers[].fulfillments[].type` | string | Mandatory | Case type. Must match the search |
| `providers[].fulfillments[].tracking` | boolean | Mandatory | Whether live tracking is supported for this option |
| `providers[].fulfillments[].start.time.timestamp` | ISO 8601 | Mandatory | Earliest estimated arrival |
| `providers[].fulfillments[].end.time.timestamp` | ISO 8601 | Mandatory | Latest estimated arrival |
| `providers[].fulfillments[].tags.additional_services` | string | Optional | Extras available on this option |
| `providers[].fulfillments[].tags.deeplink_url` | string | Optional | Deep link into the HSPA app |
| `providers[].items[].id` | string | Mandatory | Item identifier |
| `providers[].items[].descriptor.flag` | boolean | Mandatory | `true` means payment is required |
| `providers[].items[].price.value` | string | Mandatory | Base indicative price in INR |
| `providers[].items[].price.estimated_Value` | string | Optional | Estimated total charge |
| `providers[].items[].price.minimum_Value` | string | Optional | Minimum or advance charge |
| `providers[].items[].price.maximum_Value` | string | Optional | Maximum expected charge |
| `providers[].items[].fulfillment_id` | string | Mandatory | Links this price to a fulfilment |

### How the pieces link

Each fulfilment ID appears twice: once where the fulfilment is declared, and once as `items[].fulfillment_id`. The item also carries `category_id`. The chain is category, then fulfilment, then item, joined through the item object. Walk it to show "ALS ambulance, arriving 12:30 to 12:35, around 500 rupees".

### Sample, trimmed

```json
{
  "context": {
    "domain": "nic2008:86909",
    "action": "on_search",
    "core_version": "0.7.1",
    "consumer_id": "<YOUR_EUA_ID_FROM_NHA_ONBOARDING>",
    "consumer_uri": "<YOUR_HTTPS_CALLBACK_URL>",
    "provider_id": "<HSPA_ID_FROM_THIS_RESPONSE>",
    "provider_uri": "<HSPA_CALLBACK_URL_FROM_THIS_RESPONSE>",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "Medulance HSPA",
        "flag": false,
        "short_desc": "Medulance: Ambulance Provider HSPA"
      },
      "providers": [
        {
          "id": "1",
          "descriptor": { "name": "Medulance", "flag": false },
          "categories": [
            { "id": "1", "descriptor": { "name": "Advanced Life Support (ALS)", "code": "ALS", "flag": false } },
            { "id": "2", "descriptor": { "name": "Basic Life Support (BLS)", "code": "BLS", "flag": false } }
          ],
          "fulfillments": [
            {
              "id": "ML-ALS-01",
              "type": "EMERGENCY",
              "tracking": true,
              "start": { "time": { "timestamp": "2026-01-05T12:30:00" } },
              "end": { "time": { "timestamp": "2026-01-05T12:35:00" } },
              "tags": {
                "additional_services": "oxygen cylinder, etc",
                "deeplink_url": "https://deeplinkurl.com"
              }
            }
          ],
          "items": [
            {
              "id": "1",
              "descriptor": { "name": "Charges", "flag": true },
              "price": {
                "currency": "INR",
                "value": "500",
                "estimated_Value": "500",
                "minimum_Value": "200",
                "maximum_Value": "1500"
              },
              "category_id": "1",
              "fulfillment_id": "ML-ALS-01"
            }
          ]
        }
      ]
    }
  }
}
```

## init

Direct to the HSPA, at the `provider_uri` you took from `on_search`.

| Field | Type | Required | What it is |
| --- | --- | --- | --- |
| `context.provider_id` | string | Mandatory | Carried from `on_search` |
| `context.provider_uri` | string | Mandatory | Carried from `on_search` |
| `order.provider.id` | string | Mandatory | The provider the user picked |
| `order.item.id` | string | Mandatory | The item the user picked |
| `order.item.fulfillment_id` | string | Mandatory | The fulfilment the user picked |
| `order.fulfillment.id` | string | Mandatory | Matches `item.fulfillment_id` |
| `order.fulfillment.type` | string | Mandatory | `EMERGENCY` or `NON_EMERGENCY` |
| `order.fulfillment.tracking` | boolean | Mandatory | Carried from `on_search` |
| `order.fulfillment.tags.additional_services` | string | Optional | Extras the patient asked for |
| `order.fulfillment.tags.deeplink_url` | string | Optional | Carried from `on_search` if present |
| `order.billing.name` | string | Mandatory | Patient or responsible person |
| `order.billing.address` | object | Mandatory | Pickup address: `locality`, `state`, `country`, `area_code` |
| `order.billing.phone` | string | Mandatory | Contact number |
| `order.customer.id` | string | Mandatory | Patient [ABHA](/docs/uhi/v1/getting-started/glossary#abha) address, for example `91XXXXXXXXXX@sbx` |
| `order.customer.person.dob` | string | Optional | `YYYY-MM-DD` |
| `order.customer.person.gender` | string | Optional | `M`, `F` or `O` |
| `order.locations[SOURCE]` | object | Mandatory | Pickup GPS and address |
| `order.locations[DESTINATION]` | object | Conditional | Required for non-emergency, optional for emergency |

## on_init

The HSPA answers with the order ID, a quote and the terms.

| Field | Type | Required | What it is |
| --- | --- | --- | --- |
| `order.id` | string | Mandatory | The HSPA's order ID. Carry it into every call in NHA's second phase |
| `order.fulfillment.tags.terms_reference` | string (URL) | Mandatory | Link to the HSPA's versioned terms document |
| `order.quote.price.value` | string | Mandatory | Total confirmed price in INR |
| `order.quote.breakup[].title` | string | Mandatory | Line item name, for example `Ambulance Base Charge` |
| `order.quote.breakup[].price.value` | string | Mandatory | Line item amount |
| `order.payment.type` | string | Mandatory | `ON-ORDER` at booking, or `PRE-ORDER` in advance |
| `order.payment.status` | string | Mandatory | For example `NOT_PAID` |
| `order.terms[].type` | string | Mandatory | `Commercial`, `Settlement`, `Cancellation`, `Refund` or `Payment` |
| `order.terms[].termsState` | string | Mandatory | `INITIATED`, awaiting EUA review |
| `order.locations[SOURCE]` | object | Mandatory | Echoed from `init` |
| `order.locations[DESTINATION]` | object | Conditional | Echoed from `init` for non-emergency |

NHA's sample carries three terms in the current phase: `Commercial`, `Cancellation` and `Payment`, each at `INITIATED`.

```json
{
  "quote": {
    "price": { "currency": "INR", "value": "500.0" },
    "breakup": [
      { "title": "Ambulance Base Charge", "price": { "currency": "INR", "value": "400.0" } },
      { "title": "Consumable Charges", "price": { "currency": "INR", "value": "100.0" } }
    ]
  },
  "payment": { "type": "ON-ORDER", "status": "NOT_PAID" }
}
```

Most of `on_init` exists for NHA's second phase. NHA's guidance is that you may receive these fields now without showing all of them to the user yet.

## What your EUA has to show

These are NHA's own test cases, not our suggestions.

| ID | Requirement |
| --- | --- |
| `AMB-E-01` | Show the HSPA name and logo from `catalog.descriptor` in the listing, whenever they arrive in the response |
| `AMB-E-02` | Show the estimated arrival window from `fulfillment.start` and `fulfillment.end` for each option |
| `AMB-E-03` | Show the indicative price from `item.price.value` before the user selects |
| `AMB-E-04` | Show the full `on_init` cancellation and payment terms before enabling any confirm action |
| `AMB-E-05` | Show no driver or vehicle detail anywhere before confirmation |

## Edge cases to handle

| Case | What your system does |
| --- | --- |
| No HSPA answers within your window | Show the user a clear empty result. Do not present it as a failure |
| An HSPA returns an empty `providers` array | Handle it without a crash or a display error |
| A duplicate `search` with the same `transaction_id` | Expect the gateway or the HSPA to deduplicate |
| `on_init` with `payment.type: PRE-ORDER` and a non-zero `minimum_Value` | Show the advance payment requirement to the user |

## Prerequisites

For an EUA:

- [ABDM](/docs/uhi/v1/getting-started/glossary#abdm) [M2](/docs/hiecm/v3/api/m2) with [HIE-CM](/docs/uhi/v1/getting-started/glossary#hie-cm) completed. This is the hard prerequisite for production access.
- A publicly reachable HTTPS `consumer_uri` for `on_search` and `on_init`.
- Ed25519 signing with BLAKE-512 body hashing.
- Asynchronous handling. Do not block on a synchronous reply to `search` or `init`.
- `EMERGENCY` support at minimum. `NON_EMERGENCY` is recommended, not required.

For an HSPA:

- A publicly reachable HTTPS callback URL for `search` from the gateway and `init` from EUAs.
- Ed25519 signing on every outbound response.
- Real-time or near real-time availability data. NHA states that integrations relying only on manually maintained records will not be approved for production.
- An `on_init` that carries a confirmed quote, payment terms and a cancellation policy.
- No `agent` block in any current-phase payload.

## What is missing here

- The calls in NHA's second phase have no field reference yet in NHA's document.
- NHA lists a Postman collection for this service as a reference resource without a public link. Ask your onboarding contact.
- Error codes for this service are not enumerated in the source document.

## Next

- [UHI services](/docs/uhi/v1) for the shared protocol
- [Physical consultation](/docs/uhi/v1/concepts/services/physical-consultation), the service with the full lifecycle
- [Blood bank](/docs/uhi/v1/concepts/services/blood-bank)
- [Support](/docs/support)
