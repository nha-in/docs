**National Health Authority**

Ayushman Bharat Digital Mission

**Unified Health Interface**

**PM-JAY HEM Service**

Integrator Onboarding Documentation


**Version 1.1 • March 2026**

Table of Contents

[1. About This Document 3](#_Toc224645891)

[2. Background 3](#_Toc224645892)

[2.1 The Problem 3](#_Toc224645893)

[2.2 What UHI Enables 3](#_Toc224645894)

[3. User Story 4](#_Toc224645895)

[4. PM-JAY HEM on UHI – Service Scope 5](#_Toc224645896)

[4.1 Integration Roadmap 5](#_Toc224645897)

[4.2 Patient-Facing Capabilities (Phase 1) 5](#_Toc224645898)

[5. Why Integrate 6](#_Toc224645899)

[6. API Integration – Discovery Flow 6](#_Toc224645900)

[6.1 Service Identity 6](#_Toc224645901)

[6.2 Authentication & Signing 7](#_Toc224645902)

[6.3 API Call Sequencing 7](#_Toc224645903)

[Step-by-step sequence 8](#_Toc224645904)

[6.4 Search Filter Types 9](#_Toc224645905)

[6.5 search – Full Field Reference 10](#_Toc224645906)

[context (all fields mandatory) 10](#_Toc224645907)

[message.intent (filter fields) 10](#_Toc224645908)

[6.6 on\_search – Response Field Reference 11](#_Toc224645909)

[context fields 11](#_Toc224645910)

[message.catalog – provider record fields 11](#_Toc224645911)

[7. Sample API Payloads 13](#_Toc224645912)

[7.1 Search by State (Mandatory – base for all searches) 13](#_Toc224645913)

[7.2 Search by State + District 14](#_Toc224645914)

[7.3 Search by State + Speciality 14](#_Toc224645915)

[7.4 Search by State + Facility Name 15](#_Toc224645916)

[7.5 Search by State + Pincode 15](#_Toc224645917)

[7.6 Search by State + GPS (Proximity) 16](#_Toc224645918)

[7.7 on\_search – Sample Response 16](#_Toc224645919)

[8. Known Limitations (Phase 1) 17](#_Toc224645920)

[9. Onboarding Steps 18](#_Toc224645921)

[10. Technical Pre-requisites 18](#_Toc224645922)

[For EUA Integrators 18](#_Toc224645923)

[11. Reference Resources 19](#_Toc224645924)

[12. Integration Test Cases 20](#_Toc224645925)

[Category A – context Validation 20](#_Toc224645926)

[Category B – Search Filter Validation 20](#_Toc224645927)

[Category C – on\_search Response Validation 21](#_Toc224645928)

[Category D – UX & Best Practice Compliance 22](#_Toc224645929)

[Category E – Edge Cases 23](#_Toc224645930)

[13. Contact & Support 23](#_Toc224645931)

# 1. About This Document

This document is the onboarding reference for organisations integrating PM-JAY Hospital Empanelment Management (HEM) services on the Unified Health Interface (UHI) network. It is designed to be useful for both functional teams understanding the service and technical teams building the integration.

|  |  |
| --- | --- |
| **Audience** | EUA developers and digital health startups / consumer app teams |
| **Current Scope** | Phase 1 – Hospital Discovery (search / on\_search only) |
| **Protocol** | UHI |
| **Domain Code** | nic2004:85112 (PM-JAY HEM) |
| **Service Owner** | National Health Authority (NHA), Ayushman Bharat Digital Mission |
| **Version** | 1.1 – March 2026 |

# 2. Background

## 2.1 The Problem

India’s PM-JAY scheme covers 42 lakh+ empanelled hospitals and has authorised 9 crore+ hospital admissions, disbursing ₹1.24 lakh crore. Despite this scale, beneficiaries routinely face real barriers:

|  |  |
| --- | --- |
| **For Patients**  • No single trusted platform for PM-JAY hospital discovery  • Outdated empanelment data on consumer apps  • No real-time visibility of active PM-JAY hospitals  • App-hopping with inconsistent information | **For Hospitals**  • Smaller empanelled hospitals lack digital discoverability  • Staff burdened with repeated PM-JAY eligibility queries  • No standardised digital pathway from discovery to admission  • PM-JAY empanelment not surfaced across health apps |

## 2.2 What UHI Enables

The Unified Health Interface (UHI) is an open, interoperable network that connects any UHI-enabled consumer app (EUA) with any registered healthcare provider platform (HSPA), regardless of which platform either party uses. For PM-JAY HEM, this means:

* Any citizen on any UHI-enabled app can discover PM-JAY empanelled hospitals
* Hospital data is sourced directly from PM-JAY HEM – real-time and government-validated
* Every empanelled hospital, including smaller ones, gets equal discoverability
* Standardised API protocol ensures consistent data regardless of app platform

# 3. User Story

The following story illustrates the real-world problem PM-JAY HEM on UHI solves, and what changes for a beneficiary once an EUA integrates the service.

|  |
| --- |
| **Before UHI – Without PM-JAY HEM Integration**  Priya is a PM-JAY beneficiary in Visakhapatnam. Her father has been advised to have a cardiac procedure. She opens the health app on her phone and searches for nearby PM-JAY empanelled hospitals that offer cardiology. The app shows a list, but there is no indication of which hospitals are currently active under PM-JAY. She shortlists three hospitals and calls each one. The first tells her their PM-JAY empanelment lapsed six months ago. The second confirms empanelment but says the cardiology department is not covered under PM-JAY packages. The third is empanelled and relevant, but the app had listed the wrong phone number.  Priya has spent two hours making calls based on outdated app data. She still does not know which hospital to go to, or whether her father’s procedure is covered.  **Pain points:** Outdated empanelment data • No procedure-level visibility • No trusted single source • Manual, time-consuming verification |

|  |
| --- |
| **After UHI – With PM-JAY HEM Integration**  Priya opens the same health app. She taps “Find PM-JAY Hospital” and selects her state and district. She adds Cardiology as a filter. The app returns a list of hospitals currently empanelled under PM-JAY in her district that offer cardiology – data sourced in real-time from the PM-JAY HEM system.  Each listing shows the hospital name, address, GPS location, PM-JAY empanelment date, phone number, and nodal officer contact. Priya selects a hospital two kilometres away, notes the nodal officer’s number for PM-JAY-specific queries, and saves the address.  The entire process takes under two minutes. No calls, no guesswork.  **What changed:** Real-time empanelment status • Speciality-level filtering • Accurate contact details • Government-validated data via UHI |

|  |
| --- |
| **What This Means for Your App (EUA)**  **User need your app solves:** Help PM-JAY beneficiaries find the right empanelled hospital quickly and with confidence  **Trigger in the app:** A search action: “Find PM-JAY Hospital” with state, district, speciality, or GPS filters  **API calls involved:** search (EUA → Gateway → PM-JAY HEM HSPA) and on\_search (HSPA → Gateway → EUA)  **Data you receive:** Hospital name, type, empanelment date, specialities, GPS location, address, phone, nodal officer number  **What you display to the user:** A filtered, real-time list of PM-JAY empanelled hospitals relevant to the patient’s need  **What you do not handle yet:** Booking, referral, or admission – these are Phase 2 capabilities |

# 4. PM-JAY HEM on UHI – Service Scope

## 4.1 Integration Roadmap

The PM-JAY HEM integration on UHI is planned in three phases. Onboarding is currently open for Phase 1 only.

|  |  |  |
| --- | --- | --- |
| **Phase 1: Foundation (Current)**  • Hospital discovery and search  • Filter by state, district, pincode, GPS, speciality, and facility name  • Real-time empanelment status  • Basic hospital info and contact details | **Phase 2: Operations (Upcoming)**  • Booking and referral workflows  • Provider-facing dashboards  • CSC kiosk and voice search  • Basic analytics and reporting | **Phase 3: Advanced (Roadmap)**  • Complete patient journey mapping  • ABHA-linked discharge summaries  • Voice bots and multilingual UX  • Advanced fraud detection |

|  |
| --- |
| **Note:** Only Phase 1 (Hospital Discovery) is available for integration at this time. Phases 2 and 3 timelines will be communicated separately when they are ready to roll out. |

## 4.2 Patient-Facing Capabilities (Phase 1)

Once integrated, EUAs will be able to offer PM-JAY beneficiaries the following:

|  |  |
| --- | --- |
| **Hospital Discovery**  • Search PM-JAY empanelled hospitals via any UHI-enabled app  • Filter by location, speciality, district, GPS, or pincode  • View hospital name, type, contact details, and GPS location  • See establishment year and PM-JAY empanelment date  • Real-time empanelment status – no outdated listings | **Speciality & Procedures**  • Browse hospital specialities (Cardiology, General Medicine, etc.)  • Patient-friendly list of covered procedures and packages  • Eligibility information for PM-JAY beneficiaries  • Nodal officer contact for PM-JAY-related queries |

# 5. Why Integrate

PM-JAY HEM on UHI is an EUA-side integration. The value is delivered to digital health startups and consumer app teams who want to surface PM-JAY hospital discovery to their users.

|  |  |
| --- | --- |
| **For Digital Health Startups / EUAs**  • Access a government-backed, validated PM-JAY beneficiary base  • Acquire users via trusted PM-JAY hospital data at no data-sourcing cost  • Built-in scheme credibility: real-time empanelment status and eligibility information  • Accelerate growth on India’s open digital health network  • Differentiate your app with PM-JAY hospital discovery – a high-demand, high-trust use case | **For PM-JAY Beneficiaries (via your app)**  • Discover PM-JAY empanelled hospitals in real-time from any UHI-enabled app  • No more app-hopping – one search across the full PM-JAY empanelled network  • Filter hospitals by location, speciality, or proximity to make informed decisions  • Access nodal officer contact details for PM-JAY queries directly from the listing  • Standardised, up-to-date information across all participating platforms |

# 6. API Integration – Discovery Flow

## 6.1 Service Identity

All PM-JAY HEM API calls must use the following fixed identifiers. These distinguish PM-JAY HEM from other UHI services such as teleconsultation or ambulance.

| **Parameter** | **Value** | **Where Used** |
| --- | --- | --- |
| domain | nic2004:85112 | context.domain in every call |
| fulfillment.type | PMJAYHEM | message.intent.fulfillment.type in search |
| item.descriptor.code | PMJAY | message.intent.item.descriptor.code in search |
| item.descriptor.name | PMJAY | message.intent.item.descriptor.name in search |
| item.descriptor.flag | false | message.intent.item.descriptor.flag in search |

|  |
| --- |
| **Important:** These values are case-sensitive and must be set exactly as shown. Incorrect values will result in no HSPA responding to your search. |

## 6.2 Authentication & Signing

All UHI API calls must be signed. The signing mechanism uses Ed25519 digital signatures and BLAKE-512 body hashing.

| **Component** | **Detail** |
| --- | --- |
| Hashing algorithm | BLAKE-512 (for computing the digest of the request body) |
| Signing algorithm | Ed25519 digital signature scheme |
| EUA Authorization header | Authorization: {"headers":"(created) (expires) digest", "algorithm":"ed25519", "keyId":"<eua-id>|<key-id>|ed25519", "created":"<epoch>", "expires":"<epoch>", "signature":"<base64-sig>"} |
| Gateway header (inbound) | X-Gateway-Authorization header in same format, keyId prefixed with gateway-nha |
| Key generation utility | https://github.com/NHA-ABDM/UHI/tree/main/header\_generator\_utility |
| Signing reference doc | https://github.com/NHA-ABDM/UHI/blob/main/docs/Signing%20UHI%20APIs\_Final%20(1).docx |

|  |
| --- |
| **Tip:** Use the NHA key generation utility (Generator.java, Option 1) to generate your Ed25519 key pair. Share only the public key with NHA during onboarding. |

## 6.3 API Call Sequencing

The PM-JAY HEM discovery flow involves two API calls: a search sent by the EUA, and an on\_search response received asynchronously from the PM-JAY HEM HSPA via the Gateway. There is one HSPA and one associated HEM database for this service.

| **No.** | **API** | **Interaction** | **Purpose** | **Payload / Parameters** | **Status Triggered** | **Category** |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | search | EUA → Gateway → PM-JAY HEM HSPA | Patient searches for PM-JAY empanelled hospitals | State (mandatory); optional: district, GPS+radius, pincode, speciality, facility name | ACK, NACK | Acknowledgement |
| 2 | on\_search | PM-JAY HEM HSPA → Gateway → EUA | HSPA responds with list of matching empanelled hospitals | Catalog of provider records: hospital ID, name, type, specialities, empanelment date, location, contact | ACK, NACK | Acknowledgement |

### Step-by-step sequence

| **Step** | **Actor** | **Action** | **Detail** |
| --- | --- | --- | --- |
| **1** | **EUA** | **POST /search → Gateway** | EUA constructs the search intent (state mandatory; district, GPS, pincode, speciality, or facility name optional) and sends to the UHI Gateway. |
| **2** | **Gateway** | **ACK → EUA** | Gateway immediately returns HTTP 200 ACK. This confirms receipt only – the search result arrives separately and asynchronously. |
| **3** | **Gateway** | **POST /search → PM-JAY HEM HSPA** | Gateway forwards the search request to the PM-JAY HEM HSPA. There is a single HSPA for this service. |
| **4** | **PM-JAY HEM HSPA** | **Queries HEM database** | The HSPA queries the PM-JAY HEM database for hospitals matching the search intent. There is one database associated with this HSPA. |
| **5** | **PM-JAY HEM HSPA** | **POST /on\_search → Gateway** | HSPA sends the on\_search response to the Gateway with matching hospital provider records. |
| **6** | **Gateway** | **POST /on\_search → EUA** | Gateway relays the on\_search response to the EUA’s consumer\_uri (callback URL). |
| **7** | **EUA** | **ACK → Gateway** | EUA acknowledges receipt of the on\_search. EUA renders the hospital list to the patient. |

|  |
| --- |
| **Note:** The search-on\_search exchange is asynchronous. The EUA’s callback URL (consumer\_uri) must be publicly accessible over HTTPS to receive the on\_search. The transaction\_id in the on\_search matches the transaction\_id of the originating search. |

## 6.4 Search Filter Types

State is the only mandatory filter in every search request. The remaining five filter types are optional and can be combined with the state filter. The table below summarises all six supported search variants.

| **Search Type** | **Mandatory Fields** | **Optional Additional Fields** | **Use Case** |
| --- | --- | --- | --- |
| State only | state.name, state.code | – | Broad search across all hospitals in a state |
| State + District | state.name, state.code | district.name, district.code | Narrow to a specific district |
| State + Speciality | state.name, state.code | category.descriptor.name, category.descriptor.code | Filter by clinical speciality |
| State + Facility Name | state.name, state.code | provider.descriptor.name | Search by hospital name |
| State + Pincode | state.name, state.code | address.area\_code | Search within a pincode area |
| State + GPS | state.name, state.code | location.gps, radius.type, radius.value, radius.unit | Location-based proximity search |

|  |
| --- |
| **Note:** GPS-based search may return incomplete results in areas with low hospital density. It is recommended to support district or pincode as a fallback search mode alongside GPS. |

##

## 6.5 search – Full Field Reference

### context (all fields mandatory)

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| domain | string | nic2004:85112 – fixed value for PM-JAY HEM |
| country | string | IND – fixed value |
| city | string | STD code, e.g. std:011 |
| action | string | search – fixed value |
| core\_version | string | 0.7.1 – current UHI core version |
| consumer\_id | string | Your registered EUA identifier |
| consumer\_uri | string | Your HTTPS callback URL to receive on\_search responses |
| message\_id | UUID | Unique per call – do not reuse across calls |
| transaction\_id | UUID | Unique per search session; must match in on\_search response |
| timestamp | ISO 8601 | Request timestamp |

### message.intent (filter fields)

| **Field Path** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| fulfillment.type | string | Yes | PMJAYHEM – fixed value |
| fulfillment.start.time.timestamp | datetime | Yes | Start of search time window |
| fulfillment.end.time.timestamp | datetime | Yes | End of search time window |
| item.descriptor.code | string | Yes | PMJAY – fixed value |
| item.descriptor.name | string | Yes | PMJAY – fixed value |
| item.descriptor.flag | boolean | Yes | false – fixed value |
| location.state.name | string | Yes | State name in CAPS, e.g. ANDHRA PRADESH |
| location.state.code | string | Yes | Numeric state code, e.g. 28 |
| location.district.name | string | No | District name in CAPS |
| location.district.code | integer | No | Numeric district code |
| location.gps | string | No | Comma-separated lat,long e.g. 17.378,78.436 |
| location.radius.type | string | No | CONSTANT – when using GPS search |
| location.radius.value | float | No | Radius in km, e.g. 13.0 |
| location.radius.unit | string | No | km |
| address.area\_code | integer | No | 6-digit pincode |
| category.descriptor.name | string | No | Speciality name, e.g. Cardiology |
| category.descriptor.code | integer | No | Speciality code, e.g. 100002 |
| provider.descriptor.name | string | No | Hospital / facility name |

##

## 6.6 on\_search – Response Field Reference

### context fields

| **Field** | **Description** |
| --- | --- |
| domain | nic2004:85112 – mirrors the search request |
| action | on\_search – fixed value |
| consumer\_uri | EUA callback URL – this is the endpoint that receives the response |
| provider\_id | Identifier of the responding HSPA |
| transaction\_id | Must match the transaction\_id from the originating search request |

### message.catalog – provider record fields

| **Field Path** | **Type** | **Description** |
| --- | --- | --- |
| catalog.providers[].id | string | Unique PM-JAY HEM hospital ID, e.g. HOSP27G13867 |
| catalog.providers[].descriptor.name | string | Hospital name |
| catalog.providers[].descriptor.code | string | Hospital type: G = Government, P = Private |
| catalog.providers[].descriptor.flag | boolean | NABH accreditation flag – may not be consistently populated |
| catalog.providers[].descriptor.short\_desc | string | State-level empanelment context |
| catalog.providers[].descriptor.long\_desc | string | Empanelment status description |
| catalog.providers[].categories[].descriptor.name | string | Speciality name, e.g. Cardiology |
| catalog.providers[].categories[].descriptor.code | integer | Speciality code, e.g. 100002 |
| catalog.providers[].fulfillments[] (type: Establishment Date) | string | Year hospital was established |
| catalog.providers[].fulfillments[] (type: Empaneled Date) | string | Date of PM-JAY empanelment |
| catalog.providers[].location.gps | string | Decimal lat,long of the hospital |
| catalog.providers[].location.address | string | Street address |
| catalog.providers[].location.city.name | string | City name |
| catalog.providers[].location.district.name | string | District name |
| catalog.providers[].location.district.code | string | District code |
| catalog.providers[].location.state.name | string | State name |
| catalog.providers[].location.state.code | integer | State code |
| catalog.providers[].contact.phone | string | Hospital phone number |
| catalog.providers[].contact.email | string | Hospital email |
| catalog.providers[].contact.tags.nodalOfficerNumber | string | Nodal officer contact number (PM-JAY point of contact) |

# 7. Sample API Payloads

All six supported search variants are shown below with complete, ready-to-use JSON payloads. Replace placeholder values (shown in angle brackets) with your own credentials and parameters.

|  |
| --- |
| **Note:** The context block is identical across all six search types. Only the message.intent section differs. Review Section 6.5 for the full field reference. |

## 7.1 Search by State (Mandatory – base for all searches)

The simplest search. Returns all PM-JAY empanelled hospitals in the specified state.

|  |
| --- |
| **context:**  **domain:** 'nic2004:85112' # Fixed for PM-JAY HEM  **country:** IND  **city:** 'std:011'  **action:** search  **core\_version:** 0.7.1  **consumer\_id:** <your-eua-id>  **consumer\_uri:** <your-https-callback-url>  **message\_id:** dfa04e10-63ec-11ed-9f98-49dd5c7c4d8a # Unique UUID per call  **timestamp:** '2022-11-14T07:20:54.005277Z'  **transaction\_id:** dfa04e10-63ec-11ed-9f98-49dd5c7c4d8a # Links on\_search back to this search  **message:**  **intent:**  **fulfillment:**  **type:** 'PMJAYHEM' # Must be exactly this value  **start.time.timestamp:** '2022-07-22T13:21:41'  **end.time.timestamp:** '2022-07-22T23:59:59'  **item.descriptor:**  **code:** 'PMJAY'  **name:** 'PMJAY'  **flag:** false  **location:**  **state.name:** 'ANDHRA PRADESH' # Mandatory – all caps  **state.code:** '28' # Numeric state code |

## 7.2 Search by State + District

Narrows the result to hospitals within a specific district. Add district fields inside location.

|  |
| --- |
| # context block same as 6.1 above  **message:**  **intent:**  **fulfillment:**  **type:** 'PMJAYHEM'  **start.time.timestamp:** '2022-07-22T13:21:41'  **end.time.timestamp:** '2022-07-22T23:59:59'  **item.descriptor:**  **code:** 'PMJAY'  **name:** 'PMJAY'  **flag:** false  **location:**  **state.name:** 'ANDHRA PRADESH'  **state.code:** '28'  **district.name:** 'ANAKAPALLI' # Added: district name in caps  **district.code:** 744 # Added: numeric district code |

## 7.3 Search by State + Speciality

Filters hospitals that offer a specific clinical speciality. Add a category block inside intent.

|  |
| --- |
| # context block same as 6.1 above  **message:**  **intent:**  **fulfillment:**  **type:** 'PMJAYHEM'  **start.time.timestamp:** '2022-07-22T13:21:41'  **end.time.timestamp:** '2022-07-22T23:59:59'  **category:** # Added: speciality filter  **descriptor.name:** Cardiology # Speciality name  **descriptor.code:** 100002 # Speciality code  **item.descriptor:**  **code:** 'PMJAY'  **name:** 'PMJAY'  **flag:** false  **location:**  **state.name:** 'ANDHRA PRADESH'  **state.code:** '28'  **district.name:** 'ANAKAPALLI'  **district.code:** 744 |

## 7.4 Search by State + Facility Name

Find a specific hospital by name. Add a provider block inside intent with the hospital’s name.

|  |
| --- |
| # context block same as 6.1 above  **message:**  **intent:**  **provider:** # Added: facility name filter  **descriptor.name:** General Hospital # Hospital or facility name  **fulfillment:**  **type:** 'PMJAYHEM'  **start.time.timestamp:** '2022-07-22T13:21:41'  **end.time.timestamp:** '2022-07-22T23:59:59'  **item.descriptor:**  **code:** 'PMJAY'  **name:** 'PMJAY'  **flag:** false  **location:**  **state.name:** 'ANDHRA PRADESH'  **state.code:** '28' |

## 7.5 Search by State + Pincode

Restricts results to a specific pincode area. Add an address block inside intent (note: address is a sibling of fulfillment, not inside location).

|  |
| --- |
| # context block same as 6.1 above  **message:**  **intent:**  **fulfillment:**  **type:** 'PMJAYHEM'  **start.time.timestamp:** '2022-07-22T13:21:41'  **end.time.timestamp:** '2022-07-22T23:59:59'  **item.descriptor:**  **code:** 'PMJAY'  **name:** 'PMJAY'  **flag:** false  **location:**  **state.name:** 'ANDHRA PRADESH'  **state.code:** '28'  **address:** # Added: pincode filter (sibling of fulfillment)  **area\_code:** 523303 # 6-digit pincode |

## 7.6 Search by State + GPS (Proximity)

Returns hospitals within a radius of the user’s GPS coordinates. Set gps, radius.type, radius.value, and radius.unit inside location.

|  |
| --- |
| # context block same as 6.1 above  **message:**  **intent:**  **fulfillment:**  **type:** 'PMJAYHEM'  **start.time.timestamp:** '2022-07-22T13:21:41'  **end.time.timestamp:** '2022-07-22T23:59:59'  **item.descriptor:**  **code:** 'PMJAY'  **name:** 'PMJAY'  **flag:** false  **location:**  **state.name:** 'ANDHRA PRADESH'  **state.code:** '28'  **gps:** 17.3787973,78.4368433 # Added: lat,long of user location  **radius.type:** CONSTANT # Fixed value when using GPS  **radius.value:** 13.0 # Search radius in km  **radius.unit:** km |

## 7.7 on\_search – Sample Response

The HSPA sends this to the EUA’s consumer\_uri. Each provider record in the catalog represents one PM-JAY empanelled hospital.

|  |
| --- |
| **context:**  **domain:** 'nic2004:85112'  **action:** on\_search  **consumer\_id:** eua-nha  **consumer\_uri:** <eua-callback-url>  **provider\_id:** hspa-nha  **provider\_uri:** https://hspasbx.abdm.gov.in/api/v1/hspa  **transaction\_id:** dfa04e10-63ec-... # Matches the original search transaction\_id  **message\_id:** <response-message-id>  **message:**  **catalog:**  **descriptor.name:** PMJAY HSPA  **descriptor.short\_desc:** Pradhan Mantri Jan Arogya Yojana - Hospital Engagement Module  **providers:**  **- id:** 'HOSP27G13867' # PM-JAY HEM hospital identifier  **descriptor.name:** General Hospital Wardha  **descriptor.code:** G # G = Government, P = Private  **descriptor.flag:** false # NABH accreditation – may be unpopulated  **categories:**  **- descriptor.name:** Cardiology  **descriptor.code:** 100002  **- descriptor.name:** General Medicine  **descriptor.code:** 100005  **fulfillments:**  **- type:** 'Establishment Date'  **start.time.timestamp:** '1915'  **- type:** 'Empaneled Date'  **start.time.timestamp:** '2018-09-14 16:03:16.0'  **location:**  **gps:** '15.497097,80.048688'  **address:** '37-1-382-6'  **city.name:** ONGOLE  **district.name:** PRAKASAM  **district.code:** '517'  **state.name:** Andhra Pradesh  **state.code:** 28  **country.name:** INDIA  **contact:**  **phone:** <MOBILE_NUMBER>  **email:** <EMAIL>  **tags.nodalOfficerNumber:** <MOBILE_NUMBER> # PM-JAY nodal officer |

# 8. Known Limitations (Phase 1)

Account for the following in your application design when building Phase 1 integrations.

| **Limitation** | **Recommended Approach** |
| --- | --- |
| GPS search may return incomplete results in low hospital density areas | Always support district or pincode as fallback search modes alongside GPS |
| descriptor.flag (NABH) may not be consistently populated across all records | Do not use as a hard filter; treat as informational if present |
| on\_search responses arrive asynchronously, with no defined end signal | Implement a timeout window; aggregate and display results as they arrive |
| No pagination on on\_search responses | Handle large payloads gracefully; implement client-side pagination for display |
| No booking or referral workflow available in Phase 1 | Scope your UI to discovery only; booking will be enabled in Phase 2 |
| Covered procedures list may not reflect real-time package changes | Display a disclaimer and link to the official PM-JAY portal for authoritative package info |

# 9. Onboarding Steps

Follow these steps in order to get onboarded onto PM-JAY HEM on UHI.

|  |  |
| --- | --- |
| **1** | **Express Intent**  Reply to the NHA onboarding communication or contact your NHA point of contact to initiate the onboarding process for PM-JAY HEM. |
| **2** | **Fill the Onboarding Form**  Complete the UHI onboarding form with your organisation details, integration type (EUA or HSPA), Sandbox Callback URL (HTTPS), and Public Key. |
| **3** | **Generate Your Key Pair**  Clone the NHA GitHub repo and run Generator.java (Option 1) to generate your Ed25519 key pair. Submit only the public key to NHA. Repository: github.com/NHA-ABDM/UHI/tree/main/header\_generator\_utility |
| **4** | **Access Sandbox & API Docs**  NHA will provide sandbox access. Review the API documentation at abdm.gov.in/uhi/resources/onboarding-documentation and test using the UHI Postman Collection. |
| **5** | **Production Go-Live**  Once NHA sign-off is received on sandbox testing, your integration will be promoted to the production UHI network. |

# 10. Technical Pre-requisites

PM-JAY HEM on UHI is an EUA-only integration. The PM-JAY HEM HSPA is operated by NHA; there are no third-party HSPA integrations for this service.

## For EUA Integrators

* ABDM-compliant application with at least **Milestone 2 (M2) of HIECM** completed – this is the primary prerequisite
* A publicly accessible HTTPS callback URL (consumer\_uri) to receive asynchronous on\_search responses from the PM-JAY HEM HSPA
* Implementation of UHI request signing (Ed25519 digital signature + BLAKE-512 body hashing)
* Ability to handle an asynchronous on\_search response – do not block on a synchronous reply to the search call
* UHI Postman Collection for sandbox testing (available on request from NHA)

|  |
| --- |
| **Note:** ABDM M2 milestone completion with HIECM is a hard prerequisite. Applications that have not completed M2 cannot be onboarded onto UHI services including PM-JAY HEM. |

# 11. Reference Resources

| **Resource** | **Link / Details** |
| --- | --- |
| Key Generation Utility (GitHub) | [github.com/NHA-ABDM/UHI/tree/main/header\_generator\_utility](http://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility) |
| Gateway API Specification (YAML) | <https://uhigatewaysandbox.abdm.gov.in/swagger-docs/v2.0.1/Gateway.yaml> |
| API Collection (Swagger) | <https://uhigatewaysandbox.abdm.gov.in/swagger-ui/index.html?urls.primaryName=v2.0.1> |
| UHI Reference Application | <https://drive.google.com/file/d/1sAs8lIqPu-uMxd6-eM9AOJ2MiWhvikZH/view?usp=sharing> |
| PM-JAY Official Portal | pmjay.gov.in – for authoritative package and eligibility information |

**cURL Requests for Speciality List (Production and Sandbox)**

**Sandbox:**

**curl --location 'https://apisbeta.nha.gov.in/pmjay/payer/hbp/get/scheme/specialities' \**

**--header 'Accept: application/json' \**

**--header 'source: internal' \**

**--header 'Content-Type: application/json' \**

**--header 'pid: 33222' \**

**--data '{**

**"schemecode": "PMJAY",**

**"hosptype": "H" }'**

**Production –**

**curl --location 'https://apisprod.nha.gov.in/pmjay/payer/hbp/get/scheme/specialities' \**

**--header 'Accept: application/json' \**

**--header 'source: internal' \**

**--header 'Content-Type: application/json' \**

**--header 'pid: 33222' \**

**--data '{**

**"schemecode": "PMJAY",**

**"hosptype": "H" }'**

# 12. Integration Test Cases

The following test cases cover the complete PM-JAY HEM discovery integration. Run these against the UHI Sandbox before requesting production go-live sign-off from NHA. Test cases are grouped by category: context validation, search filter variants, on\_search response correctness, UX and best practice compliance, and resilience.

**Note:** All test cases below are positive (happy path) unless explicitly noted. Categories D and E include functional and resilience checks in addition to API tests.

## Category A – context Validation

Verifies that the mandatory context block is correctly formed and that the Gateway-EUA handshake behaves as expected.

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass Criteria** |
| --- | --- | --- | --- | --- |
| TC-A01 | Valid context – all mandatory fields present | Send a search with all context fields correctly populated | Gateway returns HTTP 200 ACK | ACK received with no error in response |
| TC-A02 | transaction\_id in on\_search matches originating search | Send a valid search; inspect the on\_search received at consumer\_uri | context.transaction\_id in on\_search equals that of the originating search | IDs match exactly |
| TC-A03 | on\_search domain mirrors search domain | Inspect context.domain in the on\_search response | Value is nic2004:85112 | Field present and value correct |

## Category B – Search Filter Validation

Verifies each of the six supported search filter variants. Each test builds on the mandatory state filter and adds one optional filter type.

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass Criteria** |
| --- | --- | --- | --- | --- |
| TC-B01 | Search by State only | Send search with location.state.name and location.state.code | on\_search received with hospital records from the specified state | Provider records returned; all in the correct state |
| TC-B02 | Search by State + District | Add location.district.name and location.district.code to a state search | on\_search returns hospitals narrowed to the specified district | All returned hospitals are in the specified district |
| TC-B03 | Search by State + Speciality | Add category.descriptor.name and category.descriptor.code to a state search | Hospitals returned have the specified speciality in their categories[] | Each provider record contains the matching speciality |
| TC-B04 | Search by State + Facility Name | Add provider.descriptor.name with a known hospital name | Matching hospital(s) returned in on\_search | Results include hospitals whose name matches the input |
| TC-B05 | Search by State + Pincode | Add address.area\_code with a valid 6-digit pincode | Hospitals in that pincode area returned | Results geographically consistent with the pincode |
| TC-B06 | Search by State + GPS + Radius | Add location.gps, radius.type: CONSTANT, radius.value, and radius.unit: km | Hospitals within the specified radius returned | Hospital GPS coordinates fall within the declared radius |

## Category C – on\_search Response Validation

Verifies the correctness and completeness of provider records returned in the on\_search response.

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass Criteria** |
| --- | --- | --- | --- | --- |
| TC-C01 | on\_search received at consumer\_uri | Send a valid search; monitor the callback URL | on\_search payload arrives at consumer\_uri | Payload received within timeout window |
| TC-C02 | Provider ID present and non-null | Inspect catalog.providers[].id in on\_search | Each provider record has a non-null ID (e.g. HOSP27G13867) | All provider IDs are non-null strings |
| TC-C03 | Mandatory provider fields present | Inspect each provider record for core fields | id, descriptor.name, location.gps, and contact.phone are all present | No mandatory field is null or empty |
| TC-C04 | Empanelment date present | Inspect fulfillments[] for a record with type: Empaneled Date | Each provider has an Empaneled Date entry with a non-null timestamp | start.time.timestamp is a non-null string |
| TC-C05 | Establishment date present | Inspect fulfillments[] for a record with type: Establishment Date | Each provider has an Establishment Date entry with a non-null timestamp | start.time.timestamp is a non-null string |
| TC-C06 | GPS coordinates parseable | Inspect location.gps on each provider record | Value is a comma-separated lat,long string | Parseable as two valid decimal numbers |
| TC-C07 | Nodal officer number present | Inspect contact.tags.nodalOfficerNumber on each provider | Field is populated on each provider record | Non-null, numeric string |
| TC-C08 | Speciality categories returned | Inspect categories[] on provider records | Each provider has at least one category with descriptor.name and descriptor.code | Both name and code present; code is a valid integer |
| TC-C09 | Hospital type code present | Inspect descriptor.code on each provider | Code is present (e.g. G for Government, P for Private) | Non-null, single-character string |

## Category D – UX & Best Practice Compliance

Functional and visual checks derived from the PM-JAY HEM Search Best Practices document. These are verified through manual walkthroughs and UI inspection rather than API calls.

| **TC ID** | **Test Case** | **Verification Method** | **Expected Result** | **Pass Criteria** |
| --- | --- | --- | --- | --- |
| TC-D01 | Service reachable within 2-3 taps from home screen | Manual walkthrough on test device | PM-JAY Hospital Search accessible within 3 taps | Feature found in 3 taps or fewer |
| TC-D02 | Correct service label used | UI inspection of the feature entry point | Label matches a recommended option (e.g. PMJAY Hospital Search, Find PMJAY Hospitals) | Label clearly communicates PM-JAY empanelment |
| TC-D03 | Powered by UHI with PMJAY and ABDM branding visible | Screenshot review of the search screen | UHI, PMJAY, and ABDM branding appear in the footer of the search screen | All three present and unobtrusive |
| TC-D04 | GPS-based search works on device | Test search using device GPS location | Results returned based on current GPS coordinates | Results geographically consistent with device location |
| TC-D05 | Manual location input works | Test search using manually entered state, district, or pincode | Results returned correctly for the entered location | Results match the entered location parameters |
| TC-D06 | Fallback message shown when no results found | Search with valid parameters that yield no hospitals | User sees a helpful message suggesting next steps (e.g. expand radius, try a nearby district) | No blank screen; clear guidance displayed |
| TC-D07 | Disclaimer shown after search results | Inspect result screen after a successful search | Please confirm the hospital location by calling ahead, as details may change. is visible on screen | Disclaimer present on results screen |
| TC-D08 | Service placed under healthcare or hospital or insurance category | Navigation audit of the app | PM-JAY Hospital Search appears under a health-related module | Not placed under wellness, offers, or lifestyle |

## Category E – Edge Cases

Verifies application behaviour under conditions such as large result sets, empty responses, and delayed HSPA replies.

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass Criteria** |
| --- | --- | --- | --- | --- |
| TC-E01 | Large result set handling | Send a State-only search for a high-density state (e.g. Andhra Pradesh, Maharashtra) | App renders the full hospital list without crash or timeout | List displayed; scroll and filter function correctly across all records |
| TC-E02 | Empty catalog in on\_search | Send a valid search for a state + district combination that yields no matching hospitals | on\_search received with an empty providers[] array | App displays a fallback message; no crash or unhandled state |
| TC-E03 | No on\_search received within timeout window | Send a valid search; simulate delayed or absent HSPA response | App does not remain in an indefinite loading state | Timeout message shown after configured window; user can retry |

# 13. Contact & Support

For onboarding queries, technical support, or to express interest in integration, reach out to your NHA point of contact or reply to the onboarding communication you received from NHA.

|  |  |
| --- | --- |
| **Organisation** | National Health Authority (NHA), Ayushman Bharat Digital Mission |
| **POC** | <NAME> (<EMAIL>),  <NAME> (<EMAIL>) |
| **Service** | Unified Health Interface – PM-JAY HEM |
