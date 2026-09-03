---
title: PM-JAY HEM hospital discovery
sidebar_label: PM-JAY HEM
sidebar_position: 2
description: Find PM-JAY empanelled hospitals over UHI by state, district, speciality, facility name, pincode or GPS.
verification: unverified
source: UHI__UHI_PMJAY_HEM_Onboarding_v1.4.md
---

# PM-JAY HEM hospital discovery

PM-JAY is India's national health insurance scheme, and HEM is the Hospital Empanelment Management system that knows which hospitals are empanelled right now. After this page you will know the six ways to search HEM over UHI, and every field that comes back.

## Who does what

This is an [EUA](/docs/uhi/v1/getting-started/glossary#eua) side integration. [NHA](/docs/uhi/v1/getting-started/glossary#nha) runs the single [HSPA](/docs/uhi/v1/getting-started/glossary#hspa). No third party builds one for this service.

| Party | Who runs it | What it does here |
| --- | --- | --- |
| EUA | You, or any [PHR](/docs/uhi/v1/getting-started/glossary#phr) app | Sends the `search`. Receives the `on_search`. Renders the hospital list. |
| [UHI](/docs/uhi/v1/getting-started/glossary#uhi) Gateway | NHA | Validates and routes the `search`. Relays the `on_search` back to you. |
| PM-JAY HEM HSPA | NHA | Queries the HEM database. Builds the `on_search` catalog. |

Signing, onboarding and Gateway base URLs are shared across UHI. See [UHI services](/docs/uhi/v1).

## Before you onboard

Your application must have completed [HIE-CM](/docs/uhi/v1/getting-started/glossary#hie-cm) Milestone 2 as an [ABDM](/docs/uhi/v1/getting-started/glossary#abdm) compliant application. The network's document states that applications without M2 cannot be onboarded onto UHI services, PM-JAY HEM included. If you have not done that, start at [M2](/docs/hiecm/v3/api/m2).

You also need:

- A publicly reachable HTTPS callback URL for `on_search` responses.
- UHI request signing in place, Ed25519 signatures over a BLAKE-512 body hash.
- Code that treats `search` as fire and forget. Do not block waiting for a synchronous reply.

## Message flow

Two calls, discovery only. Booking and referral are a later phase. The HTTP 200 from the Gateway confirms receipt, nothing more.

| Step | Who acts | What happens |
| --- | --- | --- |
| 1 | Your system | POST `/search` to the Gateway with state, plus any optional filters. |
| 2 | Gateway | Returns HTTP 200 ACK immediately. |
| 3 | Gateway | POSTs the `search` to the PM-JAY HEM HSPA. |
| 4 | PM-JAY HEM HSPA | Queries the HEM database. |
| 5 | PM-JAY HEM HSPA | POSTs `on_search` to the Gateway with matching hospital records. |
| 6 | Gateway | POSTs the `on_search` to your `consumer_uri`. |
| 7 | Your system | ACKs the `on_search` and renders the hospital list. |

Both calls can return NACK as well as ACK. Match a response to its request by `context.transaction_id`.

## Service identity

These values are case sensitive. If any of them is wrong, no HSPA answers your search and you get nothing back.

| Parameter | Value | Where it goes |
| --- | --- | --- |
| `domain` | `nic2004:85112` | `context.domain` in every call |
| `fulfillment.type` | `PMJAYHEM` | `message.intent.fulfillment.type` |
| `item.descriptor.code` | `PMJAY` | `message.intent.item.descriptor.code` |
| `item.descriptor.name` | `PMJAY` | `message.intent.item.descriptor.name` |
| `item.descriptor.flag` | `false` | `message.intent.item.descriptor.flag` |

## Search filters

State is mandatory in every search. The other five filters are optional and stack on top of it.

| Search type | Mandatory | Optional fields added | Use case |
| --- | --- | --- | --- |
| State only | `state.name`, `state.code` | none | Every empanelled hospital in a state |
| State and district | `state.name`, `state.code` | `district.name`, `district.code` | Narrow to one district |
| State and speciality | `state.name`, `state.code` | `category.descriptor.name`, `category.descriptor.code` | Filter by clinical speciality |
| State and facility name | `state.name`, `state.code` | `provider.descriptor.name` | Find a hospital by name |
| State and pincode | `state.name`, `state.code` | `address.area_code` | Search a pincode area |
| State and GPS | `state.name`, `state.code` | `location.gps`, `radius.type`, `radius.value`, `radius.unit` | Proximity search |

State and district names go in capitals, for example `ANDHRA PRADESH`. Note that `address` is a sibling of `fulfillment` inside `message.intent`, not a child of `location`.

To get the speciality codes for `category.descriptor.code`, call the PM-JAY speciality list endpoint.

```bash
# Sandbox
curl --location 'https://apisbeta.nha.gov.in/pmjay/payer/hbp/get/scheme/specialities' \
  --header 'Accept: application/json' \
  --header 'source: internal' \
  --header 'Content-Type: application/json' \
  --header 'pid: 33222' \
  --data '{"schemecode": "PMJAY", "hosptype": "H"}'
```

Swap the host for `https://apisprod.nha.gov.in` in production. The rest of the call is the same.

## Sample payloads

These samples use an abbreviated field listing with dotted paths rather than literal JSON request bodies. Build your JSON from the field reference underneath, where the nesting is explicit.

The `context` block is identical across all six variants. Only `message.intent` changes.

### context

```yaml
context:
  domain: 'nic2004:85112'          # Fixed for PM-JAY HEM
  country: IND
  city: 'std:011'
  action: search
  core_version: 0.7.1
  consumer_id: <YOUR_EUA_ID_FROM_NHA_ONBOARDING>
  consumer_uri: <YOUR_HTTPS_CALLBACK_URL>
  message_id: dfa04e10-63ec-11ed-9f98-49dd5c7c4d8a   # Fresh UUID per call
  timestamp: '2022-11-14T07:20:54.005277Z'
  transaction_id: dfa04e10-63ec-11ed-9f98-49dd5c7c4d8a   # Links on_search back to this search
```

### Search by state

The base case. Every other variant adds to this one.

```yaml
message:
  intent:
    fulfillment:
      type: 'PMJAYHEM'
      start.time.timestamp: '2022-07-22T13:21:41'
      end.time.timestamp: '2022-07-22T23:59:59'
    item.descriptor:
      code: 'PMJAY'
      name: 'PMJAY'
      flag: false
    location:
      state.name: 'ANDHRA PRADESH'
      state.code: '28'
```

### Search by state and district

```yaml
message:
  intent:
    fulfillment:
      type: 'PMJAYHEM'
      start.time.timestamp: '2022-07-22T13:21:41'
      end.time.timestamp: '2022-07-22T23:59:59'
    item.descriptor:
      code: 'PMJAY'
      name: 'PMJAY'
      flag: false
    location:
      state.name: 'ANDHRA PRADESH'
      state.code: '28'
      district.name: 'ANAKAPALLI'
      district.code: 744
```

### Search by state and speciality

Add a `category` block inside `intent`.

```yaml
message:
  intent:
    fulfillment:
      type: 'PMJAYHEM'
      start.time.timestamp: '2022-07-22T13:21:41'
      end.time.timestamp: '2022-07-22T23:59:59'
    category:
      descriptor.name: Cardiology
      descriptor.code: 100002
    item.descriptor:
      code: 'PMJAY'
      name: 'PMJAY'
      flag: false
    location:
      state.name: 'ANDHRA PRADESH'
      state.code: '28'
      district.name: 'ANAKAPALLI'
      district.code: 744
```

### Search by state and facility name

Add a `provider` block inside `intent`.

```yaml
message:
  intent:
    provider:
      descriptor.name: General Hospital
    fulfillment:
      type: 'PMJAYHEM'
      start.time.timestamp: '2022-07-22T13:21:41'
      end.time.timestamp: '2022-07-22T23:59:59'
    item.descriptor:
      code: 'PMJAY'
      name: 'PMJAY'
      flag: false
    location:
      state.name: 'ANDHRA PRADESH'
      state.code: '28'
```

### Search by state and pincode

`address` sits beside `fulfillment`, not inside `location`.

```yaml
message:
  intent:
    fulfillment:
      type: 'PMJAYHEM'
      start.time.timestamp: '2022-07-22T13:21:41'
      end.time.timestamp: '2022-07-22T23:59:59'
    item.descriptor:
      code: 'PMJAY'
      name: 'PMJAY'
      flag: false
    location:
      state.name: 'ANDHRA PRADESH'
      state.code: '28'
    address:
      area_code: 523303
```

### Search by state and GPS

```yaml
message:
  intent:
    fulfillment:
      type: 'PMJAYHEM'
      start.time.timestamp: '2022-07-22T13:21:41'
      end.time.timestamp: '2022-07-22T23:59:59'
    item.descriptor:
      code: 'PMJAY'
      name: 'PMJAY'
      flag: false
    location:
      state.name: 'ANDHRA PRADESH'
      state.code: '28'
      gps: 17.3787973,78.4368433
      radius.type: CONSTANT
      radius.value: 13.0
      radius.unit: km
```

### on_search response

One `providers[]` entry per empanelled hospital. Note that the establishment date and the empanelment date both arrive as `fulfillments[]` entries, told apart by their `type`.

```yaml
context:
  domain: 'nic2004:85112'
  action: on_search
  consumer_id: eua-nha
  consumer_uri: <YOUR_HTTPS_CALLBACK_URL>
  provider_id: hspa-nha
  provider_uri: https://hspasbx.abdm.gov.in/api/v1/hspa
  transaction_id: dfa04e10-63ec-11ed-9f98-49dd5c7c4d8a   # Matches the originating search
  message_id: <RESPONSE_MESSAGE_ID>
message:
  catalog:
    descriptor.name: PMJAY HSPA
    descriptor.short_desc: Pradhan Mantri Jan Arogya Yojana - Hospital Engagement Module
    providers:
      - id: 'HOSP27G13867'
        descriptor.name: General Hospital Wardha
        descriptor.code: G                # G government, P private
        descriptor.flag: false            # NABH accreditation, may be unpopulated
        categories:
          - descriptor.name: Cardiology
            descriptor.code: 100002
          - descriptor.name: General Medicine
            descriptor.code: 100005
        fulfillments:
          - type: 'Establishment Date'
            start.time.timestamp: '1915'
          - type: 'Empaneled Date'
            start.time.timestamp: '2018-09-14 16:03:16.0'
        location:
          gps: '15.497097,80.048688'
          address: '37-1-382-6'
          city.name: ONGOLE
          district.name: PRAKASAM
          district.code: '517'
          state.name: Andhra Pradesh
          state.code: 28
          country.name: INDIA
        contact:
          phone: 9966753790
          email: test@gmail.com
          tags.nodalOfficerNumber: 9966753790
```

## Field reference

### search: context

All fields are mandatory.

| Field | Type | Value |
| --- | --- | --- |
| `domain` | string | `nic2004:85112`, fixed |
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
| `fulfillment.type` | string | Yes | `PMJAYHEM`, fixed |
| `fulfillment.start.time.timestamp` | datetime | Yes | Start of the search window |
| `fulfillment.end.time.timestamp` | datetime | Yes | End of the search window |
| `item.descriptor.code` | string | Yes | `PMJAY`, fixed |
| `item.descriptor.name` | string | Yes | `PMJAY`, fixed |
| `item.descriptor.flag` | boolean | Yes | `false`, fixed |
| `location.state.name` | string | Yes | State name in capitals, for example `ANDHRA PRADESH` |
| `location.state.code` | string | Yes | Numeric state code, for example `28` |
| `location.district.name` | string | No | District name in capitals |
| `location.district.code` | integer | No | Numeric district code |
| `location.gps` | string | No | `lat,long`, for example `17.378,78.436` |
| `location.radius.type` | string | No | `CONSTANT`. Required with a GPS search. |
| `location.radius.value` | float | No | Radius in km, for example `13.0` |
| `location.radius.unit` | string | No | `km` |
| `address.area_code` | integer | No | 6 digit pincode |
| `category.descriptor.name` | string | No | Speciality name, for example `Cardiology` |
| `category.descriptor.code` | integer | No | Speciality code, for example `100002` |
| `provider.descriptor.name` | string | No | Hospital or facility name |

### on_search: provider records

| Field path | Type | Description |
| --- | --- | --- |
| `catalog.providers[].id` | string | PM-JAY HEM hospital ID, for example `HOSP27G13867` |
| `catalog.providers[].descriptor.name` | string | Hospital name |
| `catalog.providers[].descriptor.code` | string | `G` government, `P` private |
| `catalog.providers[].descriptor.flag` | boolean | NABH accreditation. May be unpopulated. |
| `catalog.providers[].descriptor.short_desc` | string | State level empanelment context |
| `catalog.providers[].descriptor.long_desc` | string | Empanelment status description |
| `catalog.providers[].categories[].descriptor.name` | string | Speciality name |
| `catalog.providers[].categories[].descriptor.code` | integer | Speciality code |
| `catalog.providers[].fulfillments[]` with `type: Establishment Date` | string | Year the hospital was established |
| `catalog.providers[].fulfillments[]` with `type: Empaneled Date` | string | Date of PM-JAY empanelment |
| `catalog.providers[].location.gps` | string | `lat,long` of the hospital |
| `catalog.providers[].location.address` | string | Street address |
| `catalog.providers[].location.city.name` | string | City name |
| `catalog.providers[].location.district.name` | string | District name |
| `catalog.providers[].location.district.code` | string | District code |
| `catalog.providers[].location.state.name` | string | State name |
| `catalog.providers[].location.state.code` | integer | State code |
| `catalog.providers[].contact.phone` | string | Hospital phone number |
| `catalog.providers[].contact.email` | string | Hospital email |
| `catalog.providers[].contact.tags.nodalOfficerNumber` | string | Nodal officer number for PM-JAY questions |

## Known limitations

These apply to the current phase.

| Limitation | What to do |
| --- | --- |
| GPS search can return incomplete results where hospital density is low | Offer district or pincode search as a fallback next to GPS |
| `descriptor.flag`, the NABH accreditation flag, is not consistently populated | Do not filter on it. Show it when present, otherwise say nothing. |
| `on_search` responses arrive asynchronously with no end of results signal | Set a timeout window. Show results as they arrive. |
| No pagination on `on_search` | Handle large payloads without blocking the UI. Paginate on the client for display. |
| No booking or referral | Scope your UI to discovery |
| The covered procedure list can lag real package changes | Show a disclaimer and link to pmjay.gov.in for the authoritative package list |

## Testing before go-live

There are 29 test cases across five categories, to be run against the UHI sandbox before you request production sign off.

| Category | What it checks |
| --- | --- |
| A, context validation | All mandatory `context` fields present. `transaction_id` in `on_search` matches the originating `search`. `domain` mirrors correctly. |
| B, search filters | One test per supported filter variant, checking that results honour the filter. |
| C, on_search response | Provider ID present and non null. Core fields present. Empanelment and establishment dates present. GPS parseable. Nodal officer number present. Specialities returned. |
| D, user experience | The feature is reachable in three taps or fewer. UHI, PM-JAY and ABDM branding on the search screen. A fallback message when there are no results. A disclaimer on the results screen asking the user to call ahead. |
| E, edge cases | A large result set from a high density state renders. An empty `providers[]` array shows a fallback and does not crash. A missing `on_search` times out and offers a retry rather than spinning forever. |

Ask for the full test case sheet and the UHI Postman collection when you onboard.

## Phase scope

The plan has three phases, and only the first, discovery, is open for onboarding. Booking and referral workflows, provider dashboards and CSC kiosk search are named as the second phase. [ABHA](/docs/uhi/v1/getting-started/glossary#abha) linked discharge summaries and multilingual voice are named as the third. Dates for either are not yet published.

## Next

- Shared UHI protocol, signing and onboarding: [UHI services](/docs/uhi/v1)
- The M2 prerequisite: [HIE-CM M2](/docs/hiecm/v3/api/m2)
