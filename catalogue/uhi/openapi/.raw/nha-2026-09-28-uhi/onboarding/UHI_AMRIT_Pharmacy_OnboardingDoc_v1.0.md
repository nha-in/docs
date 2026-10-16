**National Health Authority**

Ayushman Bharat Digital Mission

**Unified Health Interface**

**AMRIT Pharmacy Discovery Service**

Integrator Onboarding Documentation


**Version 1.0 • August 2026**

National Health Authority - Ayushman Bharat Digital Mission

**Table of Contents**

**1. About This Document 3**

**2. Understanding UHI : Roles and Responsibilities 4**

2.1 The Three-Participant Model 4

2.2 How a Search Works End-to-End 4

2.3 What HLL Lifecare Limited (the HSPA) Builds and Operates 4

2.4 What EUAs Build 4

**3. API Integration : Discovery Flow 6**

3.1 Service Identity 6

3.2 Authentication and Signing 6

3.3 API Call Sequencing 6

**4. Sample API Payloads 8**

4.1 Search by Pharmacy Code 8

4.2 Search by State and District 9

4.3 Search by Pincode 10

4.4 Search by GPS Location 11

4.5 Search by All Custom Filters (State + District + Pincode) 11

4.6 on\_search : Sample Response 13

**5. Field Reference 15**

5.1 search : context Block (All Fields Mandatory) 15

5.2 search : message.intent Filter Fields 15

5.3 on\_search : context Fields 15

5.4 on\_search : Provider Record Fields (AMRIT Pharmacy Catalog) 16

**6. Contact and Support 17**

**7. Resources 18**

# **1. About This Document**

This document is the onboarding reference for two groups of partners integrating the AMRIT Pharmacy Discovery service (Phase 1) on the Unified Health Interface (UHI) network:

• **HLL Lifecare Limited / HSPA team:** HLL Lifecare Limited staff and their technology partners who will build and operate the AMRIT Pharmacy HSPA, the server that responds to discovery queries on the UHI network.

• **EUA developers:** Digital health startups and PHR app teams who want to let their users find AMRIT Pharmacies through UHI.

| **Parameter** | **Value** |
| --- | --- |
| Protocol | UHI |
| Domain Code | nic2025:477201 |
| Fulfillment Type | AMRIT |
| Item Descriptor Code / Name | AMRIT\_PHARMACY |
| Provider ID | \_ |
| Provider URL | \_ |
| Version | 1.0 - August 2026 |

# **2. Understanding UHI : Roles and Responsibilities**

Before diving into API details, it is important to understand the three-participant model that UHI uses. Every service on UHI involves exactly three parties: the EUA, the Gateway, and the HSPA.

## **2.1 The Three-Participant Model**

| **Participant** | **Full Name** | **Who Operates It** | **What It Does** |
| --- | --- | --- | --- |
| EUA | End-User Application | Digital health applications. e.g. PHRs like Aarogya Setu, ABHA, other private PHR applications, etc. | The citizen-facing app. Sends search queries on behalf of users and displays results returned by the HSPA. |
| Gateway | UHI Gateway | National Health Authority (NHA) | The central routing layer. Authenticates requests, routes search queries from EUAs to the correct HSPA, and relays responses back to EUAs. |
| HSPA | Health Service Provider Application | HLL Lifecare Limited (for AMRIT Pharmacy) | The data-serving layer. Receives search queries from the Gateway, queries the AMRIT Pharmacy store database, and sends back matching pharmacy records. |

**Note:** HLL Lifecare Limited is the HSPA for this service. NHA operates the UHI Gateway. Third-party EUAs are the consumer apps that will query AMRIT Pharmacy data.

## **2.2 How a Search Works End-to-End**

An AMRIT Pharmacy search involves exactly two API calls: a search (request sent by the EUA) and an on\_search (response returned by the HSPA). The exchange is asynchronous- the EUA sends the search and immediately receives a simple acknowledgement (ACK); the actual pharmacy results arrive separately via a callback URL.

## **2.3 What HLL Lifecare Limited (the HSPA) Builds and Operates**

As the HSPA, HLL Lifecare Limited's responsibilities are on the server side. HLL builds and maintains the following:

• **A publicly accessible HTTPS endpoint** that receives search requests forwarded by the UHI Gateway.

• **Business logic to query the AMRIT Pharmacy store database** based on the filters in each search request (state, district, GPS, pincode, pharmacy code).

• **An on\_search response builder** that formats matching pharmacy records as UHI-compliant provider catalog entries and sends them back to the Gateway.

## **2.4 What EUAs Build**

EUA developers build the citizen-facing side. Their responsibilities are:

• **A search UI** that allows users to input their location or preferences and triggers a UHI search call to the Gateway.

• **A publicly accessible HTTPS callback URL** (consumer\_uri) to receive asynchronous on\_search responses from the Gateway.

• **Display logic** that renders the pharmacy records returned in the on\_search — pharmacy name, hospital name, store address, GPS, contact number, pharmacy type, HFR ID, and store hours.

• **Graceful handling of edge cases:** empty results, large result sets, and response timeouts.

# **3. API Integration : Discovery Flow**

## **3.1 Service Identity**

All AMRIT Pharmacy API calls, both from EUAs and from the AMRIT Pharmacy HSPA, must use the following fixed identifiers. These distinguish this service from other UHI services such as physical consultation or Jan Aushadhi Kendra discovery.

| **Parameter** | **Value** | **Where Used** |
| --- | --- | --- |
| domain | nic2025:477201 | context.domain in every call |
| fulfillment.type | AMRIT | message.intent.fulfillment.type in search |
| item.descriptor.code | AMRIT\_PHARMACY | message.intent.item.descriptor.code in search |
| item.descriptor.name | AMRIT\_PHARMACY | message.intent.item.descriptor.name in search |
| Provider ID | - | Identifies the AMRIT Pharmacy HSPA on the UHI network |
| Provider URL | - | The AMRIT Pharmacy HSPA endpoint registered with NHA |
| HSPA Public Key ID | - | Used by the Gateway to verify HSPA response signatures |
| **Gateway base URL – Sandbox** | **https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/search** | Use for the Gateway in Sandbox. Append /search or /on\_search depending on the request. |
| **Gateway base URL – Production** | **https://uhigateway.abdm.gov.in/api/v1/uhi/search** | Use for the Gateway in Production. Append /search or /on\_search depending on the request. |

## **3.2 Authentication and Signing**

All UHI API calls must be cryptographically signed. This applies to both EUAs (signing their search requests) and the AMRIT Pharmacy HSPA (signing its on\_search responses). The signing mechanism is built on Ed25519 digital signatures and BLAKE-512 body hashing.

UHI has designed its own [Header Generation Toolkit](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility). You will have to run the jar file on Terminal, enter onboarding details like Subscriber ID, Public Key ID and the exact payload (in a string format) of the specific search or on\_search, into the toolkit to generate the signed header that needs to be added to the request for authorization. Find more information in the Resources section.

**Note:** Your public key has already been registered with NHA. Keep your private key secure, never share it. EUAs must generate their own key pair during onboarding and submit only the public key to NHA to receive the onboarding details.

Clone the linked GitHub repository and run Generator.java (Option 1) to generate headers. Submit only the Public Key to NHA. Watch [***this***](https://docs.google.com/videos/d/1Fy-hnPwtRtzJayJP6A5QEaCZxkv6dMGYd0dKIOvBVIQ/edit?usp=sharing) video for guidance.

## **3.3 API Call Sequencing**

The AMRIT Pharmacy discovery flow involves exactly two API calls: a search sent by the EUA, and an on\_search response sent asynchronously by the AMRIT Pharmacy HSPA via the Gateway.

| **No.** | **API** | **Interaction** | **Purpose** | **Key Payload Fields** | **Response Type** |
| --- | --- | --- | --- | --- | --- |
| 1 | search | EUA → Gateway → AMRIT HSPA | Citizen searches for an AMRIT Pharmacy | State/district, GPS+radius, pincode, or pharmacy code | HTTP 200 ACK |
| 2 | on\_search | AMRIT HSPA → Gateway → EUA | AMRIT HSPA returns matching pharmacy records | Catalog of provider records: store code, hospital name, pharmacy name, hospital type, store type, store hours, HFR ID, location, GPS, contact | HTTP 200 ACK from EUA |

**Note:** The EUA's callback URL (consumer\_uri) must be publicly accessible HTTPS endpoint to receive the on\_search. The transaction\_id in the on\_search must match the transaction\_id of the originating search, this is how the EUA links a response to the request that triggered it.

# **4. Sample API Payloads**

AMRIT Pharmacy search does not require a mandatory state filter. Each of the five search types below is independent. They can also be combined, state and district together, or state and district and pincode together, are common combinations.

| **Search Type** | **Key Fields Used** | **Use Case** |
| --- | --- | --- |
| By Pharmacy Code | category.descriptor.code = 'Pharmacy Code', category.descriptor.name = 'Pharmacy Code' | Look up a specific AMRIT Pharmacy by its assigned store code |
| By State and District | location.state.code, location.state.name, location.district.code, location.district.name | Find all AMRIT Pharmacies in a specific district |
| By Pincode | address.area\_code (6-digit pincode) | Find AMRIT Pharmacies in a specific pincode area |
| By GPS and Radius | location.gps (lat,long), location.radius.type = CONSTANT, location.radius.value, location.radius.unit = km | Find AMRIT Pharmacies within a radius of the user's GPS location |
| Combined (State + District + Pincode) | All of: location.state, location.district, address.area\_code | Maximum precision, narrow to a specific sub-area within a district |

All five supported search variants are shown below with complete, ready-to-use JSON payloads. Replace placeholder values (shown in angle brackets) with your own credentials and parameters. The context block is identical across all variants; only message.intent changes.

## **4.1 Search by Pharmacy Code**

Returns a specific AMRIT Pharmacy looked up by its assigned store code.

{

"context": {

"domain": "nic2025:477201",

"country": "IND",

"city": "std:011",

"action": "search",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-06-09T18:24:35",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

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

"start": {

"time": {

"timestamp": "2026-06-09T00:00:00"

}

},

"end": {

"time": {

"timestamp": "2026-06-09T23:59:59"

}

}

},

"item": {

"descriptor": {

"code": "AMRIT\_PHARMACY",

"name": "AMRIT\_PHARMACY"

}

}

}

}

}

## **4.2 Search by State and District**

Returns all enrolled AMRIT Pharmacies in a specific district. Add location.district fields alongside location.state.

{

"context": {

"domain": "nic2025:477201",

"country": "IND",

"city": "std:011",

"action": "search",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-06-09T18:24:35",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

},

"message": {

"intent": {

"fulfillment": {

"type": "AMRIT",

"start": {

"time": {

"timestamp": "2026-06-09T00:00:00"

}

},

"end": {

"time": {

"timestamp": "2026-06-09T23:59:59"

}

}

},

"item": {

"descriptor": {

"code": "AMRIT\_PHARMACY",

"name": "AMRIT\_PHARMACY"

}

},

"location": {

"district": {

"code": "466",

"name": "Ahmednagar"

},

"state": {

"code": "27",

"name": "Maharashtra"

}

}

}

}

}

## **4.3 Search by Pincode**

Returns AMRIT Pharmacies within a specific pincode area. Use address.area\_code with a 6-digit pincode.

{

"context": {

"domain": "nic2025:477201",

"country": "IND",

"city": "std:011",

"action": "search",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-06-09T18:24:35",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

},

"message": {

"intent": {

"fulfillment": {

"type": "AMRIT",

"start": {

"time": {

"timestamp": "2026-06-09T00:00:00"

}

},

"end": {

"time": {

"timestamp": "2026-06-09T23:59:59"

}

}

},

"item": {

"descriptor": {

"code": "AMRIT\_PHARMACY",

"name": "AMRIT\_PHARMACY"

}

},

"address": {

"area\_code": "413736"

}

}

}

}

## **4.4 Search by GPS Location**

Returns AMRIT Pharmacies within a radius of the user's GPS coordinates. Set gps, radius.type, radius.value, and radius.unit inside location.

{

"context": {

"domain": "nic2025:477201",

"country": "IND",

"city": "std:011",

"action": "search",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-06-09T18:24:35",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

},

"message": {

"intent": {

"fulfillment": {

"type": "AMRIT",

"start": {

"time": {

"timestamp": "2026-06-09T00:00:00"

}

},

"end": {

"time": {

"timestamp": "2026-06-09T23:59:59"

}

}

},

"item": {

"descriptor": {

"code": "AMRIT\_PHARMACY",

"name": "AMRIT\_PHARMACY"

}

},

"location": {

"gps": "19.7126974,74.4833288",

"radius": {

"type": "CONSTANT",

"value": "5",

"unit": "km"

}

}

}

}

}

## **4.5 Search by All Custom Filters (State + District + Pincode)**

Maximum precision search. Combines state, district, and pincode to narrow results to a specific sub-area.

{

"context": {

"domain": "nic2025:477201",

"country": "IND",

"city": "std:011",

"action": "search",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-06-09T18:24:35",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

},

"message": {

"intent": {

"fulfillment": {

"type": "AMRIT",

"start": {

"time": {

"timestamp": "2026-06-09T00:00:00"

}

},

"end": {

"time": {

"timestamp": "2026-06-09T23:59:59"

}

}

},

"item": {

"descriptor": {

"code": "AMRIT\_PHARMACY",

"name": "AMRIT\_PHARMACY"

}

},

"location": {

"district": {

"code": "466",

"name": "Ahmednagar"

},

"state": {

"code": "27",

"name": "Maharashtra"

}

},

"address": {

"area\_code": "413736"

}

}

}

}

## **4.6 on\_search : Sample Response**

The AMRIT Pharmacy HSPA sends this to the EUA's consumer\_uri via the Gateway. Each provider record in the catalog represents one AMRIT Pharmacy store. Note the AMRIT-specific fields: pharmacyName in short\_desc, pharmacy type (AMRIT | AMRIT\_OPTICALS | HLL\_PNS | AMRIT\_DEENDAYAL), store opening/closing times, and the HFR ID tag.

{

"context": {

"domain": "nic2025:477201",

"country": "IND",

"city": "std:011",

"action": "on\_search",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"provider\_id": "amrit-hspa",

"provider\_uri": "https://amritpharmacy.gov.in/api/v1/admin/store/",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-06-09T18:24:35",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

},

"message": {

"catalog": {

"descriptor": {

"name": "AMRIT PHARMACY SERVICE",

"images": "<AMRIT PHARMACY HSPA logo image URL>",

"short\_desc": "Short description of AMRIT PHARMACY HSPA",

"long\_desc": "Long description if available"

},

"providers": [

{

"id": "AMRITST01460",

"descriptor": {

"name": "ESIS NAGPUR",

"code": "",

"symbol": "",

"short\_desc": "AMRIT – ESIS NAGPUR",

"long\_desc": ""

},

"fulfillments": [

{

"id": "0",

"type": "AMRIT",

"agent": {

"name": "<Contact Person Name>"

},

"start": {

"time": {

"timestamp": "<storeOpeningTime>"

}

},

"end": {

"time": {

"timestamp": "<storeClosingTime>"

}

},

"tags": {

"@abdm/gov.in/hfr\_id": "<hfrId>"

}

}

],

"location": {

"id": "1",

"descriptor": {

"name": "ESIS NAGPUR"

},

"city": {

"name": "",

"code": ""

},

"district": {

"name": "NAGPUR",

"code": "466"

},

"state": {

"name": "Maharashtra",

"code": "27"

},

"country": {

"name": "INDIA",

"code": "+91"

},

"gps": "19.7126974,74.4833288",

"address": "AMRIT PHARMACY, ESIS HOSPITAL, SOMWARI ROAD, OPP. NURSES HOSTEL,

KRIDA CHOWK, SOMWARIPETH, NAGPUR, MAHARASHTRA - 440009",

"radius": {

"type": "CONSTANT",

"value": "12",

"unit": "km"

}

},

"contact": {

"phone": "<pharmacyContactNumber>",

"email": "<pharmacyContactEmail>"

}

}

]

}

}

}

# **5. Field Reference**

## **5.1 search : context Block (All Fields Mandatory)**

The context block is identical for all search variants. Only the message.intent section changes between search types.

| **Field** | **Type** | **Value / Description** |
| --- | --- | --- |
| domain | string | nic2025:477201, fixed value for AMRIT Pharmacy |
| country | string | IND, fixed value |
| city | string | STD code, e.g. std:011 |
| action | string | search, fixed value |
| core\_version | string | 0.7.1, current UHI core version |
| consumer\_id | string | Your registered EUA identifier (or amrit-hspa for HLL) |
| consumer\_uri | string | Your HTTPS callback URL to receive on\_search responses |
| message\_id | UUID | Unique per call, never reuse across calls |
| transaction\_id | UUID | Unique per search session; must match in the on\_search response |
| timestamp | ISO 8601 | Request timestamp, e.g. 2026-06-09T18:24:35 |

## **5.2 search : message.intent Filter Fields**

| **Field Path** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| fulfillment.type | string | Yes | AMRIT, fixed value |
| fulfillment.start.time.timestamp | datetime | Yes | Start of search time window, e.g. 2026-06-09T00:00:00 |
| fulfillment.end.time.timestamp | datetime | Yes | End of search time window, e.g. 2026-06-09T23:59:59 |
| item.descriptor.code | string | Yes | AMRIT\_PHARMACY, fixed value |
| item.descriptor.name | string | Yes | AMRIT\_PHARMACY, fixed value |
| category.descriptor.code | string | Conditional | Pharmacy Code value — used when searching by pharmacy code |
| category.descriptor.name | string | Conditional | Pharmacy Code value — used when searching by pharmacy code |
| location.state.name | string | No | State name, e.g. Maharashtra |
| location.state.code | string | No | Numeric state code, e.g. 27 |
| location.district.name | string | No | District name, e.g. Ahmednagar |
| location.district.code | string | No | Numeric district code, e.g. 466 |
| location.gps | string | No | Comma-separated lat,long e.g. 19.7126974,74.4833288 |
| location.radius.type | string | No | CONSTANT, required when using GPS search |
| location.radius.value | string/float | No | Radius in km, e.g. 5 |
| location.radius.unit | string | No | km |
| address.area\_code | string | No | 6-digit pincode, e.g. 413736 |

## **5.3 on\_search : context Fields**

| **Field** | **Description** |
| --- | --- |
| domain | nic2025:477201, mirrors the search request |
| action | on\_search, fixed value |
| consumer\_uri | EUA callback URL — this is the endpoint that receives the response |
| provider\_id | amrit-hspa, identifier of the responding HSPA |
| provider\_uri | https://amritpharmacy.gov.in/api/v1/admin/store/ — AMRIT Pharmacy HSPA endpoint |
| transaction\_id | Must match the transaction\_id from the originating search request |

## **5.4 on\_search : Provider Record Fields (AMRIT Pharmacy Catalog)**

The on\_search catalog from the AMRIT Pharmacy HSPA includes several fields specific to AMRIT that are not present in other UHI services (e.g. pharmacy type, store hours, HFR ID).

| **Field Path** | **Type** | **Description** |
| --- | --- | --- |
| catalog.providers[].id | string | Unique AMRIT store code, e.g. AMRITST01460 |
| catalog.providers[].descriptor.name | string | Hospital name that hosts the AMRIT Pharmacy, e.g. ESIS NAGPUR |
| catalog.providers[].descriptor.code | string | Currently empty — reserved for future use |
| catalog.providers[].descriptor.symbol | string | Currently empty — reserved for future use |
| catalog.providers[].descriptor.short\_desc | string | Pharmacy name (AMRIT store label), e.g. AMRIT – ESIS NAGPUR |
| catalog.providers[].descriptor.long\_desc | string | Long description (may be empty) |
| catalog.providers[].fulfillments[].type | string | Pharmacy type — one of: AMRIT | AMRIT\_OPTICALS | HLL\_PNS | AMRIT\_DEENDAYAL |
| catalog.providers[].fulfillments[].agent.name | string | Contact person name for the pharmacy |
| catalog.providers[].fulfillments[].start.time.timestamp | datetime | Store opening time |
| catalog.providers[].fulfillments[].end.time.timestamp | datetime | Store closing time |
| catalog.providers[].fulfillments[].<ABHA_ADDRESS>/gov.in/hfr\_id | string | Health Facility Registry (HFR) identifier for the store |
| catalog.providers[].location.gps | string | Decimal lat,long of the pharmacy, e.g. 19.7126974,74.4833288 |
| catalog.providers[].location.address | string | Full street address of the AMRIT Pharmacy store |
| catalog.providers[].location.city.name | string | City name (may be empty in some records) |
| catalog.providers[].location.city.code | string | City code (may be empty in some records) |
| catalog.providers[].location.district.name | string | District name |
| catalog.providers[].location.district.code | string | District code |
| catalog.providers[].location.state.name | string | State name |
| catalog.providers[].location.state.code | string | State code |
| catalog.providers[].location.country.name | string | INDIA, fixed value |
| catalog.providers[].location.country.code | string | +91, fixed value |
| catalog.providers[].contact.phone | string | Pharmacy contact phone number |
| catalog.providers[].contact.email | string | Pharmacy email address (may be empty) |

# **6. Contact and Support**

For onboarding queries, technical support, or to express interest in integration, reach out to your NHA point of contact or reply to the onboarding communication you received from NHA.

|  |  |
| --- | --- |
| Organisation | National Health Authority (NHA), Ayushman Bharat Digital Mission |
| Service | Unified Health Interface – AMRIT Pharmacy Discovery |
| NHA Points of Contact | <EMAIL> (primary) <EMAIL> <EMAIL> |

# **7. Resources**

1. Header Generation Toolkit

2. Swagger Specifications Link

3. UHI Developer Documentation
