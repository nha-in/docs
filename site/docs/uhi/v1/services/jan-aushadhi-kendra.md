---
title: Jan Aushadhi Kendra discovery
sidebar_label: Jan Aushadhi Kendra
sidebar_position: 5
description: Find Jan Aushadhi Kendras over UHI by Kendra code, state and district, pincode or GPS radius.
verification: unverified
source: UHI__UHI_JanAushadhiKendra_OnboardingDoc_v1.0.md
---

# Jan Aushadhi Kendra discovery

Jan Aushadhi Kendras are the government generic medicine stores run under the Pradhan Mantri Bhartiya Janaushadhi Pariyojana. After this page you will know the five ways to search for one and every field that comes back.

## Who does what

Three parties. Shared roles, signing and onboarding are on [UHI services](/docs/uhi/v1).

| Party | Who runs it | What it does here |
| --- | --- | --- |
| [EUA](/docs/abdm/v3/glossary#eua) | You, or any [PHR](/docs/abdm/v3/glossary#phr) app | Sends the `search`. Receives the `on_search` on your callback URL. Renders the Kendra list. |
| [UHI](/docs/abdm/v3/glossary#uhi) Gateway | [NHA](/docs/abdm/v3/glossary#nha) | Validates and routes the `search`. Relays the `on_search` back to you. |
| [HSPA](/docs/abdm/v3/glossary#hspa) | PMBI, the Pharmaceuticals and Medical Devices Bureau of India | Queries the PMBI Kendra database. Builds the `on_search` catalog. |

You do not build a [HSPA](/docs/abdm/v3/glossary#hspa) unless you are PMBI or their technology partner.

## Message flow

Two calls, asynchronous, discovery only. There is no booking and no ordering. The HTTP 200 from the Gateway is a receipt, not the result.

| Step | Who acts | What happens |
| --- | --- | --- |
| 1 | Your system | The user taps "Find Jan Aushadhi Kendra". You build a `search` with your filters and POST it to the Gateway. |
| 2 | Gateway | Returns HTTP 200 ACK to you straight away. Forwards the `search` to the PMBI HSPA. |
| 3 | PMBI HSPA | Queries the Kendra database against your filters. |
| 4 | PMBI HSPA | POSTs an `on_search` to the Gateway with a catalog of matching Kendras. |
| 5 | Gateway | POSTs the `on_search` to your `consumer_uri`. |
| 6 | Your system | ACKs the `on_search` and renders the list. |

Match the `on_search` to its request by `context.transaction_id`, which the HSPA copies from your `search`. Your `consumer_uri` must be a publicly reachable HTTPS endpoint.

## Service identity

Fixed for this service. These values route your `search` to PMBI rather than to a teleconsultation or ambulance provider.

| Parameter | Value | Where it goes |
| --- | --- | --- |
| `domain` | `nic2008:47721` | `context.domain` in every call |
| `fulfillment.type` | `JANAUSHADHI` | `message.intent.fulfillment.type` |
| `item.descriptor.code` | `JANAUSHADHI` | `message.intent.item.descriptor.code` |
| `item.descriptor.name` | `JANAUSHADHI` | `message.intent.item.descriptor.name` |
| Provider ID | `pmbi.hspa` | Identifies the PMBI HSPA on the network |
| Provider URL | `https://nha-pmbi.pmbi.co.in/api/store` | The PMBI HSPA endpoint registered with NHA |
| HSPA public key ID | `pmbi.hspapid.jak` | The Gateway uses it to verify PMBI's response signature |
| Gateway base URL, sandbox | `https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/search` | Append `/search` or `/on_search` to the base path |
| Gateway base URL, production | `https://uhigateway.abdm.gov.in/api/v1/uhi/search` | Append `/search` or `/on_search` to the base path |

## Search filters

There is no mandatory location filter. All five filter shapes below are independent, and they combine.

| Search type | Fields used | Use case |
| --- | --- | --- |
| By Kendra code | `category.descriptor.code`, `category.descriptor.name` | Look up one Kendra by its PMBJP code |
| By state and district | `location.state.code`, `location.state.name`, `location.district.code`, `location.district.name` | All Kendras in a district |
| By pincode | `address.area_code` | Kendras in a 6 digit pincode area |
| By GPS and radius | `location.gps`, `location.radius.type`, `location.radius.value`, `location.radius.unit` | Kendras near the user |
| Combined | state, district and `address.area_code` together | Narrow to a sub area of a district |

Note that `address` sits beside `location` inside `message.intent`, not inside it.

## Sample payloads

The `context` block is the same in all five variants. Only `message.intent` changes. Fill in your own `consumer_id`, `consumer_uri`, `message_id`, `transaction_id` and `timestamp`.

### Search by Kendra code

```json
{
  "context": {
    "domain": "nic2008:47721",
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
          "code": "PMBJK02129",
          "name": "PMBJK02129"
        }
      },
      "fulfillment": {
        "type": "JANAUSHADHI",
        "start": { "time": { "timestamp": "2026-06-19T00:00:00" } },
        "end": { "time": { "timestamp": "2026-06-19T23:59:59" } }
      },
      "item": {
        "descriptor": { "code": "JANAUSHADHI", "name": "JANAUSHADHI" }
      }
    }
  }
}
```

NHA's documents do not agree about what goes in `category.descriptor`. See [Open questions](#open-questions) below before you build this one.

### Search by state and district

Replace the `category` block with a `location` block.

```json
{
  "message": {
    "intent": {
      "fulfillment": {
        "type": "JANAUSHADHI",
        "start": { "time": { "timestamp": "2026-06-09T00:00:00" } },
        "end": { "time": { "timestamp": "2026-06-09T23:59:59" } }
      },
      "item": {
        "descriptor": { "code": "JANAUSHADHI", "name": "JANAUSHADHI" }
      },
      "location": {
        "district": { "code": "509", "name": "KHAMMAM" },
        "state": { "code": "36", "name": "Telangana" }
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
        "type": "JANAUSHADHI",
        "start": { "time": { "timestamp": "2026-06-19T00:00:00" } },
        "end": { "time": { "timestamp": "2026-06-19T23:59:59" } }
      },
      "item": {
        "descriptor": { "code": "JANAUSHADHI", "name": "JANAUSHADHI" }
      },
      "address": { "area_code": "500028" }
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
        "type": "JANAUSHADHI",
        "start": { "time": { "timestamp": "2026-06-09T00:00:00" } },
        "end": { "time": { "timestamp": "2026-06-09T23:59:59" } }
      },
      "item": {
        "descriptor": { "code": "JANAUSHADHI", "name": "JANAUSHADHI" }
      },
      "location": {
        "gps": "17.39916197665472, 78.43400530708318",
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
        "type": "JANAUSHADHI",
        "start": { "time": { "timestamp": "2026-06-19T00:00:00" } },
        "end": { "time": { "timestamp": "2026-06-19T23:59:59" } }
      },
      "item": {
        "descriptor": { "code": "JANAUSHADHI", "name": "JANAUSHADHI" }
      },
      "location": {
        "district": { "code": "507", "name": "HYDERABAD" },
        "state": { "code": "36", "name": "Telangana" }
      },
      "address": { "area_code": "500028" }
    }
  }
}
```

### on_search response

PMBI sends this to your `consumer_uri` through the Gateway. Each entry in `catalog.providers` is one enrolled Kendra. Shortened here to one record.

```json
{
  "context": {
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "pmbi.hspa",
    "provider_uri": "https://staging-nha-pmbi.pmbi.co.in/api/store",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "JAN AUSHADHI KENDRA HSPA",
        "images": "https://janaushadhi.gov.in/img/bhartiya_janaushadhi_priyojna_2.svg",
        "short_desc": "",
        "long_desc": ""
      },
      "providers": [
        {
          "id": "PMBJK10844",
          "descriptor": {
            "name": "Jan Aushadhi Kendra",
            "code": "PP",
            "symbol": "1",
            "short_desc": "",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "contact",
              "agent": { "name": "Sunita Zanwar" },
              "start": { "time": { "timestamp": "2023-06-30T00:00:00" } }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": { "name": "Jan Aushadhi Kendra" },
            "city": { "name": "", "code": "" },
            "district": { "name": "PUNE", "code": "490" },
            "state": { "name": "Maharashtra", "code": "27" },
            "country": { "name": "INDIA", "code": "+91" },
            "gps": "18.51996721338908,73.86697649999999",
            "address": "Shop No.2, CTS No.350, Sai Appartment, Near KEM Hospital Rasta Peth, Pune, Pune, Maharashtra, India - 411011",
            "radius": { "type": "CONSTANT", "value": "1.19", "unit": "km" }
          },
          "contact": {
            "phone": "9309534959",
            "email": "janaushadhikem@gmail.com"
          }
        }
      ]
    }
  }
}
```

## Field reference

### search: context

All fields are mandatory. The block is identical across every variant.

| Field | Type | Value |
| --- | --- | --- |
| `domain` | string | `nic2008:47721`, fixed |
| `country` | string | `IND`, fixed |
| `city` | string | STD code, for example `std:011` |
| `action` | string | `search`, fixed |
| `core_version` | string | `0.7.1` |
| `consumer_id` | string | Your registered EUA identifier |
| `consumer_uri` | string | Your HTTPS callback URL |
| `message_id` | UUID | Fresh per call. Never reuse. |
| `transaction_id` | UUID | Fresh per search session. The `on_search` copies it. |
| `timestamp` | ISO 8601 | Request time, for example `2026-06-09T18:24:35` |

### search: message.intent

| Field path | Type | Mandatory | Description |
| --- | --- | --- | --- |
| `fulfillment.type` | string | Yes | `JANAUSHADHI`, fixed |
| `fulfillment.start.time.timestamp` | datetime | Yes | Start of the search window |
| `fulfillment.end.time.timestamp` | datetime | Yes | End of the search window |
| `item.descriptor.code` | string | Yes | `JANAUSHADHI`, fixed |
| `item.descriptor.name` | string | Yes | `JANAUSHADHI`, fixed |
| `category.descriptor.code` | string | Conditional | Set when searching by Kendra code |
| `category.descriptor.name` | string | Conditional | Set when searching by Kendra code |
| `location.state.name` | string | No | State name, for example `Maharashtra` |
| `location.state.code` | string | No | Numeric state code, for example `27` |
| `location.district.name` | string | No | District name, for example `Ahmednagar` |
| `location.district.code` | string | No | Numeric district code, for example `466` |
| `location.gps` | string | No | `lat,long`, for example `19.7126974,74.4833288` |
| `location.radius.type` | string | No | `CONSTANT`. Required with a GPS search. |
| `location.radius.value` | string or float | No | Radius in km, for example `5` |
| `location.radius.unit` | string | No | `km` |
| `address.area_code` | string | No | 6 digit pincode, for example `413736` |

### on_search: provider records

| Field path | Type | Description |
| --- | --- | --- |
| `catalog.providers[].id` | string | PMBJP Kendra code, for example `PMBJK01460` |
| `catalog.providers[].descriptor.name` | string | Kendra name |
| `catalog.providers[].descriptor.code` | string | Ownership type. NHA lists `PP` private-private, `PG` private-government and `GG` government-government, then adds "etc.", so treat the list as incomplete. |
| `catalog.providers[].descriptor.symbol` | string | Serial number assigned by PMBI |
| `catalog.providers[].descriptor.short_desc` | string | May be empty |
| `catalog.providers[].descriptor.long_desc` | string | May be empty |
| `catalog.providers[].fulfillments[].type` | string | `contact`. This block carries the contact person. |
| `catalog.providers[].fulfillments[].agent.name` | string | Contact person at the Kendra |
| `catalog.providers[].fulfillments[].start.time.timestamp` | datetime | PMBJP enrolment date |
| `catalog.providers[].location.gps` | string | `lat,long` of the Kendra |
| `catalog.providers[].location.address` | string | Full street address |
| `catalog.providers[].location.city.name` | string | May be empty |
| `catalog.providers[].location.city.code` | string | May be empty |
| `catalog.providers[].location.district.name` | string | District name |
| `catalog.providers[].location.district.code` | string | District code |
| `catalog.providers[].location.state.name` | string | State name |
| `catalog.providers[].location.state.code` | string | State code |
| `catalog.providers[].location.radius` | object | A distance with a unit, for example `1.19 km`. NHA's field reference does not list this field. It appears in the sample response only, so what it is measured from is not stated. |
| `catalog.providers[].location.country.name` | string | `INDIA`, fixed |
| `catalog.providers[].location.country.code` | string | `+91`, fixed |
| `catalog.providers[].contact.phone` | string | Kendra phone number |
| `catalog.providers[].contact.email` | string | May be empty |

## Open questions

Two things in NHA's documents contradict each other. Neither has been run against sandbox, so which one the HSPA accepts is unknown.

| Question | What the documents say |
| --- | --- |
| What goes in `category.descriptor` for a Kendra code search | The v1.0 onboarding sample puts the Kendra code itself there, `PMBJK02129`. The field reference in the same document, and the earlier search v0.3 sample, put the literal string `Jan Aushadhi Kendra Code` there. |
| The HSPA identity in `on_search` | Section 3.1 and the sample response give `provider_id` as `pmbi.hspa` at `https://nha-pmbi.pmbi.co.in/api/store`. The field reference table in section 5.3 gives `janaushadhi-hspa` at `https://janaushadhi.gov.in:8443/api/v1/admin/kendra/`. |

Treat the `on_search` `provider_id` as informational and route on `transaction_id` instead. Raise the `category.descriptor` question with your NHA contact before you ship a Kendra code search.

## Next

- Searching for a medicine, then for the Kendras that stock it: [Jan Aushadhi medicine search](/docs/uhi/v1/services/jan-aushadhi-medicine-search)
- Shared UHI protocol, signing and onboarding: [UHI services](/docs/uhi/v1)
