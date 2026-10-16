**National Health Authority**

Ayushman Bharat Digital Mission

**Unified Health Interface**

**Jan Aushadhi Kendra Discovery Service**

Integrator Onboarding Documentation


**Version 1.0 • June 2026**

National Health Authority - Ayushman Bharat Digital Mission

# Table of Contents

**Table of Contents 2**

**1. About This Document 3**

**2. Understanding UHI : Roles and Responsibilities 4**

2.1 The Three-Participant Model 4

2.2 How a Search Works End-to-End 4

2.3 What PMBI (the HSPA) Builds and Operates 5

2.4 What EUAs Build 5

**3. API Integration : Discovery Flow 6**

3.1 Service Identity 6

3.2 Authentication and Signing 6

3.3 API Call Sequencing 7

**4. Sample API Payloads 8**

4.1 Search by Jan Aushadhi Kendra Code 8

4.2 Search by State and District 9

4.3 Search by Pincode 10

4.4 Search by GPS Location 11

4.5 Search by All Custom Filters (State + District + Pincode) 12

4.6 on\_search : Sample Response 13

**5. Field Reference 17**

5.1 search : context Block (All Fields Mandatory) 17

5.2 search : message.intent Filter Fields 17

5.3 on\_search : context Fields 18

[5.4 on\_search : Provider Record Fields (Kendra Catalog) 18](#_b10c9wgxykcj)

**6. Contact and Support 20**

[**7. Resources 21**](#_qd17n8vjma1k)

# 1. About This Document

This document is the onboarding reference for two groups of partners integrating the **Jan Aushadhi Kendra Discovery service (Phase 1)** on the Unified Health Interface (UHI) network:

* PMBI / HSPA team: Pharmaceuticals and Medical Devices Bureau of India (PMBI) staff and their technology partners who will build and operate the Jan Aushadhi Kendra HSPA, the server that responds to discovery queries on the UHI network.
* **EUA developers:** Digital health startups and PHR app teams who want to let their users find Jan Aushadhi Kendras through UHI.

| **Parameter** | **Value** |
| --- | --- |
| Protocol | UHI |
| Domain Code | nic2008:47721 (Jan Aushadhi Kendra) |
| Fulfillment Type | JANAUSHADHI |
| Provider ID | pmbi.hspa |
| Provider URL | https://nha-pmbi.pmbi.co.in/api/store |
| Version | 1.0 - June 2026 |

# 2. Understanding UHI : Roles and Responsibilities

Before diving into API details, it is important to understand the three-participant model that UHI uses. Every service on UHI involves exactly three parties: the EUA, the Gateway, and the HSPA.

## 2.1 The Three-Participant Model

| **Participant** | **Full Name** | **Who Operates It** | **What It Does** |
| --- | --- | --- | --- |
| EUA | End-User Application | Digital health applications for eg- PHRs like Aarogya Setu, ABHA, other private PHR applications, etc. | The citizen-facing app. Sends search queries on behalf of users and displays results returned by the HSPA. |
| Gateway | UHI Gateway | National Health Authority (NHA) | The central routing layer. Authenticates requests, routes search queries from EUAs to the correct HSPA, and relays responses back to EUAs. |
| HSPA | Health Service Provider Application | PMBI (for Jan Aushadhi Kendra) | The data-serving layer. Receives search queries from the Gateway, queries the PMBI Kendra database, and sends back matching Kendra records. |

| **Important:** PMBI is the HSPA for this service. NHA operates the UHI Gateway. Third-party EUAs are the consumer apps that will query PMBI's data. |
| --- |

## 2.2 How a Search Works End-to-End

A Jan Aushadhi Kendra search involves exactly two API calls: a search (request sent by the EUA) and an on\_search (response returned by the HSPA). The exchange is asynchronous, the EUA sends the search and immediately receives a simple acknowledgement (ACK); the actual Kendra results arrive separately via a callback URL.

| **Step** | **Who Acts** | **What Happens** |
| --- | --- | --- |
| 1 | EUA | The user taps 'Find Jan Aushadhi Kendra'. EUA constructs a search request (with state, district, GPS, or pincode as filters) and sends it to the UHI Gateway. |
| 2 | Gateway | Gateway validates and signs the request, then returns HTTP 200 ACK to the EUA immediately. This is only a receipt, results come later.  Gateway forwards the search request to the PMBI HSPA. |
| 3 | PMBI HSPA | HSPA queries the PMBI Jan Aushadhi Kendra database for Kendras matching the search filters. |
| 4 | PMBI HSPA | HSPA sends an on\_search response to the Gateway containing a catalog of matching Kendra records. |
| 5 | Gateway | Gateway relays the on\_search to the EUA's registered callback URL (consumer\_uri). |
| 6 | EUA | EUA acknowledges receipt of the on\_search. EUA renders the Kendra list to the user. |

## 2.3 What PMBI (the HSPA) Builds and Operates

As the HSPA, PMBI's responsibilities are on the server side. PMBI builds and maintains the following:

* **A publicly accessible HTTPS endpoint** that receives search requests forwarded by the UHI Gateway.
* **Business logic to query the PMBI Jan Aushadhi Kendra database** based on the filters in each search request (state, district, GPS, pincode, Kendra code).
* **An on\_search response builder** that formats matching Kendra records as UHI-compliant provider catalog entries and sends them back to the Gateway.

## 2.4 What EUAs Build

EUA developers build the citizen-facing side. Their responsibilities are:

* **A search UI** that allows users to input their location or preferences and triggers a UHI search call to the Gateway.
* **A publicly accessible HTTPS callback URL** (consumer\_uri) to receive asynchronous on\_search responses from the Gateway.
* **Display logic** that renders the Kendra records returned in the on\_search — Kendra name, address, GPS, contact number, ownership type, and enrolment date.
* **Graceful handling of edge cases:** empty results, large result sets, and response timeouts.

# 3. API Integration : Discovery Flow

## 3.1 Service Identity

All Jan Aushadhi Kendra API calls, both from EUAs and from the PMBI HSPA, must use the following fixed identifiers. These distinguish this service from other UHI services such as physical consultation or PM-JAY hospital discovery.

| **Parameter** | **Value** | **Where Used** |
| --- | --- | --- |
| domain | nic2008:47721 | context.domain in every call |
| fulfillment.type | JANAUSHADHI | message.intent.fulfillment.type in search |
| item.descriptor.code | JANAUSHADHI | message.intent.item.descriptor.code in search |
| item.descriptor.name | JANAUSHADHI | message.intent.item.descriptor.name in search |
| Provider ID | pmbi.hspa | Identifies the PMBI HSPA on the UHI network |
| Provider URL | https://nha-pmbi.pmbi.co.in/api/store | The PMBI HSPA endpoint registered with NHA |
| HSPA Public Key ID | pmbi.hspapid.jak | Used by the Gateway to verify HSPA response signatures |
| Gateway base URL - Sandbox | https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/search | Use this URL for the Gateway in Sandbox. Append /search or /on\_search depending on the request. |
| Gateway base URL - Production | https://uhigateway.abdm.gov.in/api/v1/uhi/search | Use this URL for the Gateway in Production. Append /search or /on\_search depending on the request. |

## 3.2 Authentication and Signing

All UHI API calls must be cryptographically signed. This applies to both EUAs (signing their search requests) and the PMBI HSPA (signing its on\_search responses). The signing mechanism is built on Ed25519 digital signatures and BLAKE-512 body hashing.

UHI has designed its own [**Header Generation Toolkit**](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility)**.** You will have to run the jar file on Terminal, enter onboarding details like Subscriber ID, Public Key ID and the exact payload (in a string format) of the specific search or on\_search, into the toolkit to generate the signed header that needs to be added to the request for authorization. Find more information [**here**](https://uhigatewaysandbox.abdm.gov.in/swagger-ui/index.html?urls.primaryName=v2.0.1)**.**

| **Note:** Your public key has already been registered with NHA. Keep your private key secure, never share it. EUAs must generate their own key pair during onboarding and submit only the public key to NHA to receive the onboarding details.. |
| --- |

## 3.3 API Call Sequencing

The Jan Aushadhi Kendra discovery flow involves exactly two API calls: a search sent by the EUA, and an on\_search response sent asynchronously by the PMBI HSPA via the Gateway.

| **No.** | **API** | **Interaction** | **Purpose** | **Key Payload Fields** | **Response Type** |
| --- | --- | --- | --- | --- | --- |
| 1 | search | EUA → Gateway → PMBI HSPA | Citizen searches for a Jan Aushadhi Kendra | State/district, GPS+radius, pincode, or Kendra code (all optional except domain and fulfillment.type) | HTTP 200 ACK (receipt only) |
| 2 | on\_search | PMBI HSPA → Gateway → EUA | PMBI HSPA returns matching Kendra records | Catalog of provider records: Kendra ID, name, ownership, enrolment date, location, GPS, contact | HTTP 200 ACK from EUA |

| **Note:** The EUA's callback URL (consumer\_uri) must be publicly accessible. HTTPS endpoint to receive the on\_search. **The transaction\_id in the on\_search must match the transaction\_id of the originating search, this is how the EUA links a response to the request that triggered it.** |
| --- |

# 4. Sample API Payloads

Unlike PM-JAY HEM, Jan Aushadhi Kendra search does not require a mandatory state filter. Each of the five search types below is independent. They can also be combined. State and district together, or state and district and pincode together, are common combinations.

| **Search Type** | **Key Fields Used** | **Use Case** |
| --- | --- | --- |
| By Kendra Code | category.descriptor.code = 'Jan Aushadhi Kendra Code', category.descriptor.name = 'Jan Aushadhi Kendra Code' | Look up a specific Kendra by its PMBJP-assigned code |
| By State and District | location.state.code, location.state.name, location.district.code, location.district.name | Find all Kendras in a specific district |
| By Pincode | address.area\_code (6-digit pincode) | Find Kendras in a specific pincode area |
| By GPS and Radius | location.gps (lat,long), location.radius.type = CONSTANT, location.radius.value, location.radius.unit = km | Find Kendras within a radius of the user's GPS location |
| Combined (State + District + Pincode) | All of: location.state, location.district, address.area\_code | Maximum precision, narrow to a specific sub-area within a district |

All five supported search variants are shown below with complete, ready-to-use JSON payloads. Replace placeholder values (shown in angle brackets) with your own credentials and parameters. The context block is identical across all variants; only message.intent changes.

## 4.1 Search by Jan Aushadhi Kendra Code

Returns a specific Kendra looked up by its PMBJP-assigned Kendra code.

| {  "context": {  "domain": "nic2008:47721",  "country": "IND",  "city": "std:011",  "action": "search",  "core\_version": "0.7.1",  "consumer\_id": "nha.eua",  "consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",  "message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",  "timestamp": "2026-06-09T18:24:35",  "transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"  },  "message": {  "intent": {  "category": {  "descriptor": {  "code": "PMBJK02129",  "name": "PMBJK02129"  }  },  "fulfillment": {  "type": "JANAUSHADHI",  "start": {  "time": {  "timestamp": "2026-06-19T00:00:00"  }  },  "end": {  "time": {  "timestamp": "2026-06-19T23:59:59"  }  }  },  "item": {  "descriptor": {  "code": "JANAUSHADHI",  "name": "JANAUSHADHI"  }  }  }  }  } |
| --- |

## 4.2 Search by State and District

Returns all enrolled Kendras in a specific district. Add location.district fields alongside location.state.

| {  "context": {  "domain": "nic2008:47721",  "country": "IND",  "city": "std:011",  "action": "search",  "core\_version": "0.7.1",  "consumer\_id": "nha.eua",  "consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",  "message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",  "timestamp": "2026-06-09T18:24:35",  "transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"  },  "message": {  "intent": {  "fulfillment": {  "type": "JANAUSHADHI",  "start": {  "time": {  "timestamp": "2026-06-09T00:00:00"  }  },  "end": {  "time": {  "timestamp": "2026-06-09T23:59:59"  }  }  },  "item": {  "descriptor": {  "code": "JANAUSHADHI",  "name": "JANAUSHADHI"  }  },  "location": {  "district": {  "code": "509",  "name": "KHAMMAM"  },  "state": {  "code": "36",  "name": "Telangana"  }  }  }  }  } |
| --- |

## 4.3 Search by Pincode

Returns Kendras within a specific pincode area. Use address.area\_code with a 6-digit pincode.

| {  "context": {  "domain": "nic2008:47721",  "country": "IND",  "city": "std:011",  "action": "search",  "core\_version": "0.7.1",  "consumer\_id": "nha.eua",  "consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",  "message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",  "timestamp": "2026-06-09T18:24:35",  "transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"  },  "message": {  "intent": {  "fulfillment": {  "type": "JANAUSHADHI",  "start": {  "time": {  "timestamp": "2026-06-19T00:00:00"  }  },  "end": {  "time": {  "timestamp": "2026-06-19T23:59:59"  }  }  },  "item": {  "descriptor": {  "code": "JANAUSHADHI",  "name": "JANAUSHADHI"  }  },  "address": {  "area\_code": "500028"  }  }  }  } |
| --- |

## 4.4 Search by GPS Location

Returns Kendras within a radius of the user's GPS coordinates. Set gps, radius.type, radius.value, and radius.unit inside location.

| /{  "context": {  "domain": "nic2008:47721",  "country": "IND",  "city": "std:011",  "action": "search",  "core\_version": "0.7.1",  "consumer\_id": "nha.eua",  "consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",  "message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",  "timestamp": "2026-06-09T18:24:35",  "transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"  },  "message": {  "intent": {  "fulfillment": {  "type": "JANAUSHADHI",  "start": {  "time": {  "timestamp": "2026-06-09T00:00:00"  }  },  "end": {  "time": {  "timestamp": "2026-06-09T23:59:59"  }  }  },  "item": {  "descriptor": {  "code": "JANAUSHADHI",  "name": "JANAUSHADHI"  }  },  "location": {  "gps": "17.39916197665472, 78.43400530708318",  "radius": {  "type": "CONSTANT",  "value": "5",  "unit": "km"  }  }  }  }  } |
| --- |

## 4.5 Search by All Custom Filters (State + District + Pincode)

Maximum precision search. Combines state, district, and pincode to narrow results to a specific sub-area.

| {  "context": {  "domain": "nic2008:47721",  "country": "IND",  "city": "std:011",  "action": "search",  "core\_version": "0.7.1",  "consumer\_id": "nha.eua",  "consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",  "message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",  "timestamp": "2026-06-19T18:24:35",  "transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"  },  "message": {  "intent": {  "fulfillment": {  "type": "JANAUSHADHI",  "start": {  "time": {  "timestamp": "2026-06-19T00:00:00"  }  },  "end": {  "time": {  "timestamp": "2026-06-19T23:59:59"  }  }  },  "item": {  "descriptor": {  "code": "JANAUSHADHI",  "name": "JANAUSHADHI"  }  },  "location": {  "district": {  "code": "507",  "name": "HYDERABAD"  },  "state": {  "code": "36",  "name": "Telangana"  }  },  "address": {  "area\_code": "500028"  }  }  }  } |
| --- |

## 4.6 on\_search : Sample Response

The PMBI HSPA sends this to the EUA's consumer\_uri via the Gateway. Each provider record in the catalog represents one enrolled Jan Aushadhi Kendra.

| {  "context": {  "domain": "nic2008:47721",  "country": "IND",  "city": "std:011",  "action": "on\_search",  "core\_version": "0.7.1",  "consumer\_id": "nha.eua",  "consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",  "provider\_id": "pmbi.hspa",  "provider\_uri": "https://staging-nha-pmbi.pmbi.co.in/api/store",  "message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",  "timestamp": "2026-06-09T18:24:35",  "transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"  },  "message": {  "catalog": {  "descriptor": {  "name": "JAN AUSHADHI KENDRA HSPA",  "images": "https://janaushadhi.gov.in/img/bhartiya\_janaushadhi\_priyojna\_2.svg",  "short\_desc": "",  "long\_desc": ""  },  "providers": [  {  "id": "PMBJK10844",  "descriptor": {  "name": "Jan Aushadhi Kendra",  "code": "PP",  "symbol": "1",  "short\_desc": "",  "long\_desc": ""  },  "fulfillments": [  {  "id": "0",  "type": "contact",  "agent": {  "name": "<NAME>"  },  "start": {  "time": {  "timestamp": "2023-06-30T00:00:00"  }  }  }  ],  "location": {  "id": "1",  "descriptor": {  "name": "Jan Aushadhi Kendra"  },  "city": {  "name": "",  "code": ""  },  "district": {  "name": "PUNE",  "code": "490"  },  "state": {  "name": "Maharashtra",  "code": "27"  },  "country": {  "name": "INDIA",  "code": "+91"  },  "gps": "18.51996721338908,73.86697649999999",  "address": "<ADDRESS>",  "radius": {  "type": "CONSTANT",  "value": "1.19",  "unit": "km"  }  },  "contact": {  "phone": "<MOBILE_NUMBER>",  "email": "<EMAIL>"  }  },  {  "id": "PMBJK08762",  "descriptor": {  "name": "Jan Aushadhi Kendra",  "code": "PP",  "symbol": "2",  "short\_desc": "",  "long\_desc": ""  },  "fulfillments": [  {  "id": "0",  "type": "contact",  "agent": {  "name": "<NAME>"  },  "start": {  "time": {  "timestamp": "2021-07-29T00:00:00"  }  }  }  ],  "location": {  "id": "1",  "descriptor": {  "name": "Jan Aushadhi Kendra"  },  "city": {  "name": "",  "code": ""  },  "district": {  "name": "PUNE",  "code": "490"  },  "state": {  "name": "Maharashtra",  "code": "27"  },  "country": {  "name": "INDIA",  "code": "+91"  },  "gps": "18.51787100000001,73.86446748220898",  "address": "<ADDRESS>",  "radius": {  "type": "CONSTANT",  "value": "1.54",  "unit": "km"  }  },  "contact": {  "phone": "<MOBILE_NUMBER>",  "email": "<EMAIL>"  }  }  ]  }  }  } |
| --- |

# 5. Field Reference

## 5.1 search : context Block (All Fields Mandatory)

The context block is identical for all search variants. Only the message.intent section changes between search types.

| **Field** | **Type** | **Value / Description** |
| --- | --- | --- |
| domain | string | nic2008:47721, fixed value for Jan Aushadhi Kendra |
| country | string | IND, fixed value |
| city | string | STD code, e.g. std:011 |
| action | string | search, fixed value |
| core\_version | string | 0.7.1, current UHI core version |
| consumer\_id | string | Your registered EUA identifier (or pmbi.hspa for PMBI) |
| consumer\_uri | string | Your HTTPS callback URL to receive on\_search responses |
| message\_id | UUID | Unique per call, never reuse across calls |
| transaction\_id | UUID | Unique per search session; must match in the on\_search response |
| timestamp | ISO 8601 | Request timestamp, e.g. 2026-06-09T18:24:35 |

## 5.2 search : message.intent Filter Fields

| **Field Path** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| fulfillment.type | string | Yes | JANAUSHADHI, fixed value |
| fulfillment.start.time.timestamp | datetime | Yes | Start of search time window, e.g. 2026-06-09T00:00:00 |
| fulfillment.end.time.timestamp | datetime | Yes | End of search time window, e.g. 2026-06-09T23:59:59 |
| item.descriptor.code | string | Yes | JANAUSHADHI, fixed value |
| item.descriptor.name | string | Yes | JANAUSHADHI, fixed value |
| category.descriptor.code | string | Conditional | Jan Aushadhi Kendra Code, used when searching by Kendra code |
| category.descriptor.name | string | Conditional | Jan Aushadhi Kendra Code, used when searching by Kendra code |
| location.state.name | string | No | State name, e.g. Maharashtra |
| location.state.code | string | No | Numeric state code, e.g. 27 |
| location.district.name | string | No | District name, e.g. Ahmednagar |
| location.district.code | string | No | Numeric district code, e.g. 466 |
| location.gps | string | No | Comma-separated lat,long e.g. 19.7126974,74.4833288 |
| location.radius.type | string | No | CONSTANT, required when using GPS search |
| location.radius.value | string/float | No | Radius in km, e.g. 5 |
| location.radius.unit | string | No | km |
| address.area\_code | string | No | 6-digit pincode, e.g. 413736 |

## 5.3 on\_search : context Fields

| **Field** | **Description** |
| --- | --- |
| domain | nic2008:47721 , mirrors the search request |
| action | On\_search, fixed value |
| consumer\_uri | EUA callback URL, this is the endpoint that receives the response |
| provider\_id | Janaushadhi-hspa, identifier of the responding HSPA |
| provider\_uri | <https://janaushadhi.gov.in:8443/api/v1/admin/kendra/>,  PMBI HSPA endpoint |
| transaction\_id | Must match the transaction\_id from the originating search request |

## 5.4 on\_search : Provider Record Fields (Kendra Catalog)

| **Field Path** | **Type** | **Description** |
| --- | --- | --- |
| catalog.providers[].id | string | Unique PMBJP Kendra code, e.g. PMBJK01460 |
| catalog.providers[].descriptor.name | string | Kendra name |
| catalog.providers[].descriptor.code | string | Ownership type: PP (Private-Private), PG (Private-Government), GG (Government-Government), etc. |
| catalog.providers[].descriptor.symbol | string | Serial number assigned by PMBI |
| catalog.providers[].descriptor.short\_desc | string | Short description (may be empty) |
| catalog.providers[].descriptor.long\_desc | string | Long description (may be empty) |
| catalog.providers[].fulfillments[].type | string | Contact, indicates this fulfillment block contains contact person details |
| catalog.providers[].fulfillments[].agent.name | string | Contact person name for the Kendra |
| catalog.providers[].fulfillments[].start.time.timestamp | datetime | PMBJP Kendra enrolment date,  e.g. 2022-06-09T10:00:00 |
| catalog.providers[].location.gps | string | Decimal lat,long of the Kendra,  e.g. 19.7126974,74.4833288 |
| catalog.providers[].location.address | string | Full street address of the Kendra |
| catalog.providers[].location.city.name | string | City name (may be empty in some records) |
| catalog.providers[].location.city.code | string | City code (may be empty in some records) |
| catalog.providers[].location.district.name | string | District name |
| catalog.providers[].location.district.code | string | District code |
| catalog.providers[].location.state.name | string | State name |
| catalog.providers[].location.state.code | string | State code |
| catalog.providers[].location.country.name | string | INDIA, fixed value |
| catalog.providers[].location.country.code | string | +91, fixed value |
| catalog.providers[].contact.phone | string | Kendra contact phone number |
| catalog.providers[].contact.email | string | Kendra email address (may be empty) |

# 6. Contact and Support

For onboarding queries, technical support, or to express interest in integration, reach out to your NHA point of contact or reply to the onboarding communication you received from NHA.

|  |  |
| --- | --- |
| Organisation | National Health Authority (NHA), Ayushman Bharat Digital Mission |
| Service | Unified Health Interface - Jan Aushadhi Kendra Discovery |
| NHA Points of Contact | <EMAIL> (primary) |
| <EMAIL> |
| <EMAIL> |

#

# 7. Resources

1. [Header Generation Toolkit](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility)
2. [Swagger Specifications Link](https://uhigatewaysandbox.abdm.gov.in/swagger-ui/index.html?urls.primaryName=v2.0.2#/)
