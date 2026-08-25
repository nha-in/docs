---
title: Blood bank discovery
sidebar_label: Blood bank
sidebar_position: 3
description: Search live blood stock by group and component across registered blood banks, using one call pair.
verification: unverified
source: UHI__UHI_BloodBank_Onboarding_v1.0.md
---

# Blood bank discovery

Blood bank discovery is the smallest service on [UHI](/docs/uhi/v1/getting-started/glossary#uhi): one call pair. Your app sends a search with a blood group, a component and a location, and gets back blood banks with unit counts, addresses and phone numbers.

Read [UHI services](/docs/uhi/v1) first, for the `context` block, the acknowledgement model, signing and the two transports.

## Scope

Discovery only: `search` and `on_search`. There is no booking or reservation. Put the blood bank's phone number somewhere the user cannot miss it, because calling is how a unit gets held.

## Service identity

| Field | Value | Note |
| --- | --- | --- |
| `context.domain` | `nic2008:86906` | Fixed. A wrong value means no HSPA answers your search |
| `context.core_version` | `0.7.1` | Must match exactly |
| `context.action` | `search` or `on_search` | Set by the sender |
| `message.intent.fulfillment.type` | `BloodStock` | Fixed for every blood bank search |

## Who is involved

Both roles are open here. An organisation can onboard as either or both.

| Role | What it does |
| --- | --- |
| [EUA](/docs/uhi/v1/getting-started/glossary#eua) | A patient or clinician facing app. Sends searches, receives results at its callback URL |
| [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) | A blood bank management system or aggregator. Answers searches from its own inventory database |

At the time of the document there was one registered blood bank HSPA on the network: e-RaktKosh, the centralised blood bank management system.

[NHA](/docs/uhi/v1/getting-started/glossary#nha) sets a bar for the HSPA role. Your blood bank database has to be maintained independently and cover stock at a scope and quality comparable to e-RaktKosh. Integrations built on manually maintained or infrequently updated records will not be approved for production.

## The flow

| Step | Who | What happens |
| --- | --- | --- |
| 1 | Your EUA | Posts `search` to the gateway with blood group, component and location |
| 2 | [Gateway](/docs/uhi/v1/getting-started/glossary#gateway) | Returns HTTP 200 with an acknowledgement. This confirms receipt only |
| 3 | Gateway | Routes the search to every registered blood bank HSPA |
| 4 | HSPA | Queries its inventory database |
| 5 | HSPA | Posts `on_search` to the gateway with availability and unit counts |
| 6 | Gateway | Forwards `on_search` to your `consumer_uri` |
| 7 | Your EUA | Returns HTTP 200 and aggregates results as they arrive |

There is no end signal. Responses land one at a time and nothing tells you the last one has arrived. NHA recommends a timeout window of 10 to 15 seconds, and displaying results as they come in.

## Two search modes

Blood group and component filters work with either mode.

| Mode | Mandatory | Optional | Behaviour |
| --- | --- | --- | --- |
| GPS and radius | `location.gps`, `location.radius` | Blood group, component | Returns matching blood banks within the radius. Group and component default to `All` if omitted |
| State and district | `location.state` (name and code), `location.district` (name and code) | Blood group, component | Returns matching blood banks in that district |

Support both. GPS returns incomplete results where blood bank density is low, and state and district is the only option when GPS is unavailable.

## search

`context` is the standard UHI block, with `domain` fixed to `nic2008:86906` and `action` set to `search`. Set `city` to `std:011` as the default. The filters live in `message.intent`.

| Field | Value | What it is |
| --- | --- | --- |
| `item.descriptor.name` | Blood group name or `All` | The group being searched, for example `O+Ve` |
| `item.descriptor.code` | Blood group code or `-1` | Numeric code from the master list below. `-1` means all groups |
| `category.descriptor.name` | Component name | For example `WholeBlood`, `PlateletConcentrate` |
| `category.descriptor.code` | Component code | Numeric code from the master list below |
| `fulfillment.type` | `BloodStock` | Fixed |
| `fulfillment.start.time.timestamp` | ISO 8601 | Start of the availability window |
| `fulfillment.end.time.timestamp` | ISO 8601 | End of the availability window |
| `location.gps` | `latitude,longitude` | Search origin, for GPS mode |
| `location.radius.type` | `CONSTANT` | Fixed, for GPS mode |
| `location.radius.value` | Numeric string | Radius in km, for example `10.0` |
| `location.radius.unit` | `km` | Fixed |
| `location.state.name` | State name in capitals | For example `DELHI` |
| `location.state.code` | Numeric state code | For example `7` |
| `location.district.name` | District name in capitals | For example `SOUTH` |
| `location.district.code` | Numeric district code | For example `83` |

### Sample, GPS with a specific group and component

NHA's document prints these payloads in YAML. They are shown here as the JSON that goes on the wire. The fields and values are unchanged.

```json
{
  "context": {
    "domain": "nic2008:86906",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "<YOUR_EUA_ID_FROM_NHA_ONBOARDING>",
    "consumer_uri": "<YOUR_HTTPS_CALLBACK_URL>",
    "message_id": "5cc46ce0-cd96-11ef-957f-718cff4e4e0a",
    "timestamp": "2025-01-08T07:58:36.421576Z",
    "transaction_id": "5cc46ce0-cd96-11ef-957f-718cff4e4e0a"
  },
  "message": {
    "intent": {
      "item": {
        "descriptor": { "name": "O+Ve", "code": "15" }
      },
      "category": {
        "descriptor": { "name": "WholeBlood", "code": "11" }
      },
      "fulfillment": {
        "type": "BloodStock",
        "start": { "time": { "timestamp": "2025-01-08T13:28:36" } },
        "end": { "time": { "timestamp": "2025-01-08T23:59:59" } }
      },
      "location": {
        "gps": "17.3788008,78.4368212",
        "radius": { "type": "CONSTANT", "value": "10.0", "unit": "km" }
      }
    }
  }
}
```

To search every blood group at once, set `item.descriptor.name` to `All` and `item.descriptor.code` to `-1`.

### Sample, state and district

Replace the `location` block. Everything else is the same.

```json
{
  "location": {
    "state": { "name": "DELHI", "code": "7" },
    "district": { "name": "SOUTH", "code": "83" }
  }
}
```

## on_search

| Field | Type | What it is |
| --- | --- | --- |
| `context.action` | string | `on_search` |
| `context.provider_id` | string | The responding HSPA |
| `context.provider_uri` | string | The HSPA's callback URL |
| `context.transaction_id` | string | Echoed from your search. Use it to correlate |
| `catalog.descriptor.name` | string | HSPA or data source name, for example `e-RaktKosh` |
| `providers[].id` | string | Unique ID for this blood bank record |
| `providers[].descriptor.name` | string | Blood bank name |
| `providers[].descriptor.short_desc` | string | Blood bank type, for example `Govt.`, `Charitable/Vol` |
| `providers[].categories[].descriptor.name` | string | Blood component name |
| `providers[].categories[].descriptor.code` | string | Blood component code |
| `providers[].fulfillments[].type` | string | `Available` or `NotAvailable` |
| `providers[].items[].descriptor.name` | string | Blood group name |
| `providers[].items[].descriptor.code` | string | Blood group code |
| `providers[].items[].quantity.count` | integer | Units available for this group |
| `providers[].items[].fulfillment_id` | string | Points at the fulfilment record that says `Available` or `NotAvailable` |
| `providers[].location.gps` | string | Blood bank coordinates |
| `providers[].location.address` | string | Full address |
| `providers[].location.city.name` | string | City |
| `providers[].location.state.name` | string | State |
| `providers[].location.district.name` | string | District |
| `providers[].contact.phone` | string | Blood bank phone number |
| `providers[].contact.email` | string | Blood bank email |

### The part that trips people up

Availability is not a field on the item. Each provider declares a small set of `fulfillments`, one meaning `Available` and one meaning `NotAvailable`. Each blood group item points at one of them through `fulfillment_id`. A group with a unit count of 16 can still be unavailable. Resolve the link before you show a number to a user.

### Sample response

```json
{
  "context": {
    "domain": "nic2008:86906",
    "action": "on_search",
    "consumer_id": "<YOUR_EUA_ID_FROM_NHA_ONBOARDING>",
    "consumer_uri": "<YOUR_HTTPS_CALLBACK_URL>",
    "provider_id": "nha.hspa",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/bloodbank",
    "transaction_id": "c51c2800-cd96-11ef-957f-718cff4e4e0a",
    "message_id": "c51c2800-cd96-11ef-957f-718cff4e4e0a"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "e-RaktKosh",
        "short_desc": "e-RaktKosh: A Centralized Blood Bank Management System"
      },
      "providers": [
        {
          "id": "0",
          "descriptor": {
            "name": "Janseva Blood Centre",
            "short_desc": "Charitable/Vol"
          },
          "categories": [
            { "id": "0", "descriptor": { "name": "WholeBlood", "code": "11" } }
          ],
          "fulfillments": [
            { "id": "0", "type": "NotAvailable" },
            { "id": "1", "type": "Available" }
          ],
          "items": [
            {
              "id": "0",
              "descriptor": { "name": "O+Ve", "code": "15" },
              "quantity": { "count": 2 },
              "category_id": "0",
              "fulfillment_id": "1"
            },
            {
              "id": "1",
              "descriptor": { "name": "AB+Ve", "code": "17" },
              "quantity": { "count": 16 },
              "category_id": "0",
              "fulfillment_id": "0"
            }
          ],
          "location": {
            "gps": "18.5246036,73.792927",
            "address": "Paud Road, Pune, Maharashtra",
            "city": { "name": "Pune" },
            "state": { "name": "Maharashtra", "code": "27" },
            "district": { "name": "Pune", "code": "521" }
          },
          "contact": {
            "phone": "8987628900",
            "email": "contact@jansevabc.org"
          }
        }
      ]
    }
  }
}
```

In that response `O+Ve` points at fulfilment `1`, which is `Available`. `AB+Ve` has a count of 16 but points at fulfilment `0`, which is `NotAvailable`.

## Blood group master list

Use these in `item.descriptor.code`.

| Code | Group |
| --- | --- |
| `-1` | All |
| `11` | A+Ve |
| `12` | A-Ve |
| `13` | B+Ve |
| `14` | B-Ve |
| `15` | O+Ve |
| `16` | O-Ve |
| `17` | AB+Ve |
| `18` | AB-Ve |
| `22` | Oh+Ve |
| `23` | Oh-Ve |

## Blood component master list

Use these in `category.descriptor.code`.

| Code | Component |
| --- | --- |
| `11` | Whole Blood |
| `12` | Packed Red Blood Cells |
| `13` | Fresh Frozen Plasma |
| `14` | Single Donor Platelet |
| `16` | Platelet Rich Plasma |
| `17` | Cryoprecipitate |
| `18` | Single Donor Plasma |
| `19` | Plasma |
| `20` | Platelet Concentrate |
| `21` | Cryo Poor Plasma |
| `23` | Random Donor Platelets |
| `24` | Platelets Additive Solutions |
| `28` | SAGM Packed Red Blood Cells |
| `29` | Irradiated RBC |
| `30` | Leukoreduced RBC |

## Known limitations

| Limitation | What to do about it |
| --- | --- |
| GPS search returns incomplete results where blood bank density is low | Offer state and district as a visible alternative, not a hidden fallback |
| Update frequency varies by blood bank. Some update in real time, others daily | Show a disclaimer that counts are indicative and may have changed. Tell users to call before travelling |
| Responses arrive asynchronously with no end signal | Use a 10 to 15 second timeout and render results as they arrive |
| No pagination on `on_search` | Expect large payloads. Paginate or lazy load on the client |
| No booking or reservation | Show the blood bank phone number prominently |

## Prerequisites

For an EUA:

- [ABDM](/docs/uhi/v1/getting-started/glossary#abdm) [M2](/docs/hiecm/v3/api/m2) with [HIE-CM](/docs/uhi/v1/getting-started/glossary#hie-cm) completed. NHA states this as a hard prerequisite for any UHI service.
- A publicly reachable HTTPS `consumer_uri`.
- Ed25519 signing with BLAKE-512 body hashing.
- Asynchronous handling. Do not block on a synchronous reply to `search`.

For an HSPA:

- An independently maintained blood bank database with real-time or near real-time inventory, comparable in scope and quality to e-RaktKosh.
- A publicly reachable HTTPS `provider_uri` to receive searches from the gateway.
- Ed25519 signing on every outbound response.
- Sandbox integration and written NHA sign-off before production.

## What is missing here

- No call in this service has been run against the sandbox. Nothing here is verified.
- NHA's document gives no error code list for this service.
- NHA's document gives no response time SLA for HSPAs beyond "an acceptable latency window".
- State and district code lists are not in the source document. NHA's samples give Delhi as `7` and South district as `83`. Ask your onboarding contact for the full list.

## Next

- [UHI services](/docs/uhi/v1) for the shared protocol
- [Ambulance booking](/docs/uhi/v1/concepts/services/ambulance-booking)
- [Physical consultation](/docs/uhi/v1/concepts/services/physical-consultation)
- [Support](/docs/support)
