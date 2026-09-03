---
title: AMRIT Pharmacy discovery
sidebar_label: AMRIT Pharmacy
sidebar_position: 7
description: Find AMRIT Pharmacy stores over UHI by store code, state and district, pincode or GPS radius.
verification: unverified
source: UHI__UHI_AMRIT_Pharmacy_OnboardingDoc_v1.0.md
---

# AMRIT Pharmacy discovery

AMRIT Pharmacies are the discounted medicine stores run inside government hospitals by HLL Lifecare Limited. After this page you will know the five ways to search for one and every field that comes back.

## Who does what

Three parties. Shared roles, signing and onboarding are on [UHI services](/docs/uhi/v1).

| Party | Who runs it | What it does here |
| --- | --- | --- |
| [EUA](/docs/uhi/v1/getting-started/glossary#eua) | You, or any [PHR](/docs/uhi/v1/getting-started/glossary#phr) app | Sends the `search`. Receives the `on_search`. Renders the store list. |
| [UHI](/docs/uhi/v1/getting-started/glossary#uhi) Gateway | [NHA](/docs/uhi/v1/getting-started/glossary#nha) | Validates and routes the `search`. Relays the `on_search` back to you. |
| [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) | HLL Lifecare Limited | Queries the AMRIT store database. Builds the `on_search` catalog. |

You do not build a [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) unless you are HLL or their technology partner.

## Message flow

Two calls, asynchronous, discovery only. There is no ordering and no reservation. The HTTP 200 from the Gateway is a receipt. The store data arrives afterwards on your callback URL.

| Step | Who acts | What happens |
| --- | --- | --- |
| 1 | Your system | You build a `search` with your filters and POST it to the Gateway. |
| 2 | Gateway | Returns HTTP 200 ACK immediately. Forwards the `search` to the AMRIT HSPA. |
| 3 | AMRIT HSPA | Queries the store database against your filters. |
| 4 | AMRIT HSPA | POSTs an `on_search` to the Gateway with a catalog of matching stores. |
| 5 | Gateway | POSTs the `on_search` to your `consumer_uri`. |
| 6 | Your system | ACKs the `on_search` and renders the list. |

Match a response to its request by `context.transaction_id`. Your `consumer_uri` must be a publicly reachable HTTPS endpoint.

## Service identity

| Parameter | Value | Where it goes |
| --- | --- | --- |
| `domain` | `nic2025:477201` | `context.domain` in every call |
| `fulfillment.type` | `AMRIT` | `message.intent.fulfillment.type` |
| `item.descriptor.code` | `AMRIT_PHARMACY` | `message.intent.item.descriptor.code` |
| `item.descriptor.name` | `AMRIT_PHARMACY` | `message.intent.item.descriptor.name` |
| Provider ID | Not yet published | Identifies the AMRIT HSPA on the network |
| Provider URL | Not yet published | The AMRIT HSPA endpoint registered with NHA |
| HSPA public key ID | Not yet published | The Gateway uses it to verify AMRIT's response signature |
| Gateway base URL, sandbox | `https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/search` | Append `/search` or `/on_search` to the base path |
| Gateway base URL, production | `https://uhigateway.abdm.gov.in/api/v1/uhi/search` | Append `/search` or `/on_search` to the base path |

The last three are issued at onboarding. See [Confirm at onboarding](#confirm-at-onboarding). Ask your contact for the registered values before you go to sandbox.

## Search filters

No mandatory location filter. All five filter shapes are independent and they combine.

| Search type | Fields used | Use case |
| --- | --- | --- |
| By pharmacy code | `category.descriptor.code`, `category.descriptor.name` | Look up one store by its assigned code |
| By state and district | `location.state.code`, `location.state.name`, `location.district.code`, `location.district.name` | All AMRIT stores in a district |
| By pincode | `address.area_code` | Stores in a 6 digit pincode area |
| By GPS and radius | `location.gps`, `location.radius.type`, `location.radius.value`, `location.radius.unit` | Stores near the user |
| Combined | state, district and `address.area_code` together | Narrow to a sub area of a district |

`address` sits beside `location` inside `message.intent`, not inside it.

## Sample payloads

The `context` block is identical across all five variants. Only `message.intent` changes.

### Search by pharmacy code

```json
{
  "context": {
    "domain": "nic2025:477201",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "<YOUR_EUA_ID_FROM_NHA_ONBOARDING>",
    "consumer_uri": "<YOUR_HTTPS_CALLBACK_URL>",
    "message_id": "<FRESH_UUID_PER_CALL>",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "<FRESH_UUID_PER_SEARCH_SESSION>"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "Pharmacy Code",
          "name": "Pharmacy Code"
        }
      },
      "fulfillment": {
        "type": "AMRIT",
        "start": { "time": { "timestamp": "2026-06-09T00:00:00" } },
        "end": { "time": { "timestamp": "2026-06-09T23:59:59" } }
      },
      "item": {
        "descriptor": { "code": "AMRIT_PHARMACY", "name": "AMRIT_PHARMACY" }
      }
    }
  }
}
```

Two values are in circulation for `category.descriptor`: the literal string `Pharmacy Code`, and the pharmacy code value itself. Those are two different things. See [Confirm at onboarding](#confirm-at-onboarding).

### Search by state and district

```json
{
  "message": {
    "intent": {
      "fulfillment": {
        "type": "AMRIT",
        "start": { "time": { "timestamp": "2026-06-09T00:00:00" } },
        "end": { "time": { "timestamp": "2026-06-09T23:59:59" } }
      },
      "item": {
        "descriptor": { "code": "AMRIT_PHARMACY", "name": "AMRIT_PHARMACY" }
      },
      "location": {
        "district": { "code": "466", "name": "Ahmednagar" },
        "state": { "code": "27", "name": "Maharashtra" }
      }
    }
  }
}
```

### Search by pincode

```json
{
  "message": {
    "intent": {
      "fulfillment": {
        "type": "AMRIT",
        "start": { "time": { "timestamp": "2026-06-09T00:00:00" } },
        "end": { "time": { "timestamp": "2026-06-09T23:59:59" } }
      },
      "item": {
        "descriptor": { "code": "AMRIT_PHARMACY", "name": "AMRIT_PHARMACY" }
      },
      "address": { "area_code": "413736" }
    }
  }
}
```

### Search by GPS and radius

```json
{
  "message": {
    "intent": {
      "fulfillment": {
        "type": "AMRIT",
        "start": { "time": { "timestamp": "2026-06-09T00:00:00" } },
        "end": { "time": { "timestamp": "2026-06-09T23:59:59" } }
      },
      "item": {
        "descriptor": { "code": "AMRIT_PHARMACY", "name": "AMRIT_PHARMACY" }
      },
      "location": {
        "gps": "19.7126974,74.4833288",
        "radius": { "type": "CONSTANT", "value": "5", "unit": "km" }
      }
    }
  }
}
```

### Combined filters

```json
{
  "message": {
    "intent": {
      "fulfillment": {
        "type": "AMRIT",
        "start": { "time": { "timestamp": "2026-06-09T00:00:00" } },
        "end": { "time": { "timestamp": "2026-06-09T23:59:59" } }
      },
      "item": {
        "descriptor": { "code": "AMRIT_PHARMACY", "name": "AMRIT_PHARMACY" }
      },
      "location": {
        "district": { "code": "466", "name": "Ahmednagar" },
        "state": { "code": "27", "name": "Maharashtra" }
      },
      "address": { "area_code": "413736" }
    }
  }
}
```

### on_search response

Each `providers[]` entry is one AMRIT store. Three things here do not appear in other UHI services: the pharmacy type on the fulfillment, the store opening and closing times, and the [HFR](/docs/uhi/v1/getting-started/glossary#hfr) ID tag.

```json
{
  "context": {
    "domain": "nic2025:477201",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "amrit-hspa",
    "provider_uri": "https://amritpharmacy.gov.in/api/v1/admin/store/",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "AMRIT PHARMACY SERVICE",
        "images": "<AMRIT_PHARMACY_HSPA_LOGO_URL>",
        "short_desc": "<HSPA_SHORT_DESCRIPTION_SET_BY_HLL>",
        "long_desc": "<HSPA_LONG_DESCRIPTION_SET_BY_HLL>"
      },
      "providers": [
        {
          "id": "AMRITST01460",
          "descriptor": {
            "name": "ESIS NAGPUR",
            "code": "",
            "symbol": "",
            "short_desc": "AMRIT - ESIS NAGPUR",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "AMRIT",
              "agent": { "name": "<CONTACT_PERSON_NAME>" },
              "start": { "time": { "timestamp": "<STORE_OPENING_TIME>" } },
              "end": { "time": { "timestamp": "<STORE_CLOSING_TIME>" } },
              "tags": { "@abdm/gov.in/hfr_id": "<HFR_ID>" }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": { "name": "ESIS NAGPUR" },
            "city": { "name": "", "code": "" },
            "district": { "name": "NAGPUR", "code": "466" },
            "state": { "name": "Maharashtra", "code": "27" },
            "country": { "name": "INDIA", "code": "+91" },
            "gps": "19.7126974,74.4833288",
            "address": "AMRIT PHARMACY, ESIS HOSPITAL, SOMWARI ROAD, OPP. NURSES HOSTEL, KRIDA CHOWK, SOMWARIPETH, NAGPUR, MAHARASHTRA - 440009",
            "radius": { "type": "CONSTANT", "value": "12", "unit": "km" }
          },
          "contact": {
            "phone": "<PHARMACY_CONTACT_NUMBER>",
            "email": "<PHARMACY_CONTACT_EMAIL>"
          }
        }
      ]
    }
  }
}
```

The angle bracket values above are placeholders. No filled example is published for the store hours, the contact block or the HFR ID, and no timestamp format for opening and closing times. The two `catalog.descriptor` description fields hold descriptive prose in placeholders rather than real values, so they appear here that way too. The sample also carries a `location.radius` block that the field reference does not list.

## Field reference

### search: context

All fields are mandatory and identical across every variant.

| Field | Type | Value |
| --- | --- | --- |
| `domain` | string | `nic2025:477201`, fixed |
| `country` | string | `IND`, fixed |
| `city` | string | STD code, for example `std:011` |
| `action` | string | `search`, fixed |
| `core_version` | string | `0.7.1` |
| `consumer_id` | string | Your registered EUA identifier |
| `consumer_uri` | string | Your HTTPS callback URL |
| `message_id` | UUID | Fresh per call. Never reuse. |
| `transaction_id` | UUID | Fresh per search session. The `on_search` copies it. |
| `timestamp` | ISO 8601 | Request time |

### search: message.intent

| Field path | Type | Mandatory | Description |
| --- | --- | --- | --- |
| `fulfillment.type` | string | Yes | `AMRIT`, fixed |
| `fulfillment.start.time.timestamp` | datetime | Yes | Start of the search window |
| `fulfillment.end.time.timestamp` | datetime | Yes | End of the search window |
| `item.descriptor.code` | string | Yes | `AMRIT_PHARMACY`, fixed |
| `item.descriptor.name` | string | Yes | `AMRIT_PHARMACY`, fixed |
| `category.descriptor.code` | string | Conditional | Set when searching by pharmacy code |
| `category.descriptor.name` | string | Conditional | Set when searching by pharmacy code |
| `location.state.name` | string | No | State name, for example `Maharashtra` |
| `location.state.code` | string | No | Numeric state code, for example `27` |
| `location.district.name` | string | No | District name, for example `Ahmednagar` |
| `location.district.code` | string | No | Numeric district code, for example `466` |
| `location.gps` | string | No | `lat,long`, for example `19.7126974,74.4833288` |
| `location.radius.type` | string | No | `CONSTANT`. Required with a GPS search. |
| `location.radius.value` | string or float | No | Radius in km |
| `location.radius.unit` | string | No | `km` |
| `address.area_code` | string | No | 6 digit pincode |

### on_search: provider records

| Field path | Type | Description |
| --- | --- | --- |
| `catalog.providers[].id` | string | AMRIT store code, for example `AMRITST01460` |
| `catalog.providers[].descriptor.name` | string | Name of the hospital that hosts the store |
| `catalog.providers[].descriptor.code` | string | Empty. Reserved for future use. |
| `catalog.providers[].descriptor.symbol` | string | Empty. Reserved for future use. |
| `catalog.providers[].descriptor.short_desc` | string | Pharmacy label, for example `AMRIT - ESIS NAGPUR` |
| `catalog.providers[].descriptor.long_desc` | string | May be empty |
| `catalog.providers[].fulfillments[].type` | string | Pharmacy type. One of `AMRIT`, `AMRIT_OPTICALS`, `HLL_PNS`, `AMRIT_DEENDAYAL`. |
| `catalog.providers[].fulfillments[].agent.name` | string | Contact person at the store |
| `catalog.providers[].fulfillments[].start.time.timestamp` | datetime | Store opening time |
| `catalog.providers[].fulfillments[].end.time.timestamp` | datetime | Store closing time |
| `catalog.providers[].fulfillments[].tags["@abdm/gov.in/hfr_id"]` | string | Health Facility Registry identifier for the store |
| `catalog.providers[].location.gps` | string | `lat,long` of the store |
| `catalog.providers[].location.address` | string | Full street address |
| `catalog.providers[].location.city.name` | string | May be empty |
| `catalog.providers[].location.city.code` | string | May be empty |
| `catalog.providers[].location.district.name` | string | District name |
| `catalog.providers[].location.district.code` | string | District code |
| `catalog.providers[].location.state.name` | string | State name |
| `catalog.providers[].location.state.code` | string | State code |
| `catalog.providers[].location.country.name` | string | `INDIA`, fixed |
| `catalog.providers[].location.country.code` | string | `+91`, fixed |
| `catalog.providers[].contact.phone` | string | Store phone number |
| `catalog.providers[].contact.email` | string | May be empty |

Note that `fulfillments[].type` carries the pharmacy type here. In Jan Aushadhi Kendra discovery the same field carries the literal value `contact`. Do not reuse a parser across the two services without checking this field.

## Confirm at onboarding

Three values are issued when you onboard. Build the flow and hold these until you have them.

- **Your registered provider ID, provider URL and HSPA public key ID.** Responses carry `amrit-hspa` at `https://amritpharmacy.gov.in/api/v1/admin/store/`. The public key ID is issued to you directly.
- **What goes in `category.descriptor` for a pharmacy code search.** Both the literal string `Pharmacy Code` and the pharmacy code value are in circulation. Confirm which the HSPA accepts.
- **The format of store opening and closing times.** No format is published, so read the values back from your first live response rather than parsing to a fixed pattern.

## Next

- The other pharmacy discovery service on UHI: [Jan Aushadhi Kendra discovery](/docs/uhi/v1/concepts/services/jan-aushadhi-kendra)
- Shared UHI protocol, signing and onboarding: [UHI services](/docs/uhi/v1)
