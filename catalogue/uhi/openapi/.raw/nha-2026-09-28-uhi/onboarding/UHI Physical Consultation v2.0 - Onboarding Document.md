**National Health Authority**

Ayushman Bharat Digital Mission

**Unified Health Interface**

**Physical Consultation Service**

Integrator Onboarding Documentation


**Version 2.0 • June 2026**

National Health Authority - Ayushman Bharat Digital Mission

[**1. About This Document 5**](#_heading=)

[**2. Background 6**](#_heading=)

[2.1. User Story 6](#_heading=h.c9rd9kkry9e)

[2.2 What UHI Enables 6](#_heading=)

[**3. Eligibility & Prerequisites 8**](#_heading=)

[**4. Integration - Onboarding, Production and Beyond 9**](#_heading=)

[4.1 Sandbox Onboarding 9](#_heading=)

[4.2 Production Go-Live 9](#_heading=h.g7xwebfjp8wt)

[4.3 Integration Phases 10](#_heading=h.xjybgjrkfru9)

[**5. Understanding Physical Consultation Service on UHI 11**](#_heading=)

[5.1 Actor Definitions 11](#_heading=)

[5.2 Service Workflow and API Sequence Diagram 12](#_heading=h.pbx60nbrfkj)

[**6. Technical Integration - Getting Started 15**](#_heading=)

[6.1 Environment Details 15](#_heading=)

[6.2 Service Identity 15](#_heading=)

[6.3 Authentication & Signing 15](#_heading=)

[6.3 Shared Schemas & Common Fields 16](#_heading=h.enm8cvmzyswq)

[6.5 API Endpoints Checklist 18](#_heading=h.43hjvn5u4hmn)

[6.5.1 HSPA Endpoint Exposure Checklist 18](#_heading=h.f03942roi1h8)

[6.5.2. EUA Endpoint Exposure Checklist 19](#_heading=h.jsctpar2l54a)

[6.5.3 UHI Gateway Endpoint Reference 19](#_heading=h.y301zqxsozyx)

[**7. Technical Integration - In Detail 21**](#_heading=h.jc5sczh552zf)

[**7.1 Stage 1: Discovery 22**](#_heading=h.r31bmlovnn0o)

[7.1.1 POST /search - First Search (EUA → UHI Gateway → HSPA) 22](#_heading=h.4ultyj21veem)

[7.1.2 POST /on\_search - First on\_search (Gateway → EUA Callback) 24](#_heading=h.dqkbg336uj2n)

[7.1.3 POST /search - Second Search (EUA → HSPA, Direct P2P) 26](#_heading=h.dgfwsupxfpiy)

[7.1.4 POST /search - Second on\_search (HSPA → EUA, Direct P2P) 27](#_heading=h.hthcz2k6u4mr)

[**7.2 Stage 2: Booking 29**](#_heading=h.cjx3w2o5t92g)

[7.2.1 POST /init (EUA → HSPA, Direct P2P) 29](#_heading=h.681dpzh4z1ty)

[7.2.2 POST /on\_init (HSPA → EUA, Direct P2P Callback) 32](#_heading=h.q5bmhjkevrbz)

[7.2.3 POST /confirm (EUA → HSPA, Direct P2P) 34](#_heading=h.urgq059t8ob4)

[7.2.4 POST /on\_confirm (HSPA → EUA, Direct P2P Callback) 36](#_heading=h.idlzm17nq9sw)

[**7.3 Stage 3: Fulfilment 39**](#_heading=h.mj541vpzr4ok)

[7.3.1 POST /status (EUA → HSPA, Direct P2P) 39](#_heading=h.2va91ge2wp89)

[7.3.2 POST /on\_status (HSPA → EUA, Direct P2P Callback) 39](#_heading=h.49opr1rddc4z)

[7.3.3 POST /on\_update - HSPA Side (EUA → HSPA, Direct P2P) 41](#_heading=h.a7xxymcsn8lu)

[7.3.4 POST /on\_update - EUA Side (HSPA → EUA, Direct P2P) 42](#_heading=h.kezy5u39z0iu)

[**7.4 Stage 4: Post-Fulfilment 43**](#_heading=h.669w15qwc9no)

[7.4.1 POST /cancel (EUA → HSPA, Direct P2P) 43](#_heading=h.bnxfy2exaepr)

[7.4.2 POST /on\_cancel (HSPA → EUA, Direct P2P Callback) 44](#_heading=h.n4q55ma4gj0m)

[7.4.3 POST /on\_message - HSPA Side (EUA → HSPA, Direct P2P) 45](#_heading=h.xv53bv2fkdjq)

[7.4.4 POST /on\_message - EUA Side (HSPA → EUA, Direct P2P) 46](#_heading=h.85oqikrfwt5)

[**7.5 Support & Network Endpoints 48**](#_heading=h.9a9of2gnbrd1)

[7.5.1 POST /api/v1/uhi/search (EUA → Gateway - Gateway-Hosted Search) 48](#_heading=h.m7zcp3edegay)

[7.5.2 POST /api/v1/uhi/on\_search (HSPA → Gateway) 48](#_heading=h.qxjpqxuloqqt)

[7.5.3 Audit Endpoints 48](#_heading=h.srmgkzz46rmo)

[7.5.4 POST /api/v1/networkregistry/lookup 49](#_heading=h.ez73gb49tkdf)

[**7.6 Complete Order Payload Field Reference 50**](#_heading=h.w873v4tj68s5)

[**8. Cancellation & Override Reason Reference 54**](#_heading=h.wf58i796ygnn)

[8.1 Patient-initiated cancellations 54](#_heading=h.x3sn6rzh4y15)

[8.2 Doctor / facility-initiated cancellations 54](#_heading=h.vui4qg1fym2k)

[8.3 HSPA PIN override scenarios 55](#_heading=h.6iiihqd87h1o)

[**9. Terms & Conditions 57**](#_heading=h.dvqln2yc8bg7)

[**10. Contact & Support 59**](#_heading=)

[*Appendix A : Consolidated Onboarding Checklist 60*](#_heading=)

[*Appendix B : Reference Links & External Documentation 61*](#_heading=)

**Glossary of Terms**

| **Abbreviation / Term** | **Full Form / Definition** |
| --- | --- |
| **UHI** | **Unified Health Interface – open interoperable network for digital health services in India** |
| ACK | Acknowledgement, confirmation of receipt returned synchronously by the Gateway |
| **EUA** | **End User Application, consumer-facing app built by integrating companies** |
| Gateway | UHI Gateway, NHA-operated routing layer for discovery (search/on\_search) |
| HIECM | Health Information Exchange and Consent Manager – ABDM compliance framework |
| HPR | Health Professional Registry, national registry of healthcare professionals |
| **HSPA** | **Health Service Provider Application, provider-side platform managing doctors and bookings** |
| HSP | Health Service Provider, the actual clinic, hospital, or doctor |
| M2 | Milestone 2 of HIECM compliance,mandatory prerequisite for UHI onboarding |
| NACK | Negative Acknowledgement, rejection response from Gateway or HSPA |
| P2P | Point-to-Point, direct API communication between EUA and HSPA without Gateway routing |
| PIN | 4-digit numeric token generated by HSPA upon appointment confirmation for physical check-in |
| consumer\_id | Unique identifier of the registered EUA on the UHI network |
| consumer\_uri | HTTPS callback URL of the EUA where async responses are received |
| provider\_id | Unique identifier of the HSPA on the UHI network |
| provider\_uri | Base URL of the HSPA used for P2P booking API calls |
| transaction\_id | UUID that links a search request to its corresponding on\_search response(s), this id remains a constant throughout the lifecycle of a booking. |
| termsState | State of a terms object: INITIATED (sent by HSPA) → AGREED (accepted by EUA in confirm) |

# 1. About This Document

This document is the onboarding reference for organisations integrating the ***Physical Consultation Service*** on *Unified Health Interface (UHI)*. Physical Consultation service is a full end-to-end service spanning doctor discovery, appointment booking, fulfilment, and post-fulfilment lifecycle management.

This document is designed for technical teams, Tech Leads, Product Managers, and Backend Engineers, at private digital health solution companies building both the Health Service Provider Applications (HSPAs) and End User Applications (EUAs) on the UHI network.

| **Parameter** | **Value** |
| --- | --- |
| Audience | EUAs & HSPAs - Developers, Tech Leads, and Product Managers at Digital Health Solution Companies |
| Protocol | UHI (Unified Health Interface) |
| Domain Code | nic2004:85111 (Physical Consultation) |
| Service Owner | National Health Authority (NHA), Ayushman Bharat Digital Mission |
| Service Type | Physical Consultation (Payment on Visit)  Discovery + Booking + Fulfilment + Post-Fulfilment (end-to-end) |
| Version | 2.0, July 2026 |

# 2. Background

## 2.1. User Story

| **Before UHI (Without Physical Consultation Integration)** | **After UHI (With Physical Consultation Integration)** |
| --- | --- |
| *Aayush lives in Delhi and needs to book a physical appointment with a Cardiologist. He uses one of the health apps, and still ends up calling three clinics. One has no available slots, another doesn't confirm the appointment until the next day, and the third has a different fee than shown on the app. After 45 minutes, he has a tentative booking with no confirmation. He receives no reminder and shows up to find the doctor unavailable that day.* | *Aayush now opens the same health app, integrated with UHI. He searches for a Cardiologist in his area. The app broadcasts a search over UHI, and registered HSPAs respond with available doctors, specialities, slot timings, and fees. Aayush selects a slot with Dr. Mehta at a nearby clinic for the next morning. The app initiates a booking directly with the clinic's HSPA. He reviews terms, confirms the appointment, and receives a 4-digit PIN he will use to start the consultation at the clinic. On the day, the clinic verifies his PIN and the consultation is marked as started. He receives a notification when the consultation is marked complete and uploads his prescription in his health locker.* |
| * **No real-time slot visibility for public facilities** * **Non-standardised booking flow** * **Too many applications** * **Redundant onboarding processes** * **Lack of trusted verification process** | **Real time slot visibility for public facilities**  **Standardised booking flow**  **Platform independency**  **Open and Interoperable Gateway**  **Verified Doctors and Facilities** |

## 2.2 What UHI Enables

The Unified Health Interface (UHI) is an **open, interoperable network** connecting any UHI-enabled consumer application (EUA) with any registered health service provider platform (HSPA), regardless of which platform either party uses, through service-specific standardized protocols.

For the Physical Consultation Service, this means:

* *Any citizen on any UHI-enabled app can discover doctors and clinics offering physical consultations.*
* *Discovery uses UHI APIs- open, standardised, and broadcast across all registered HSPAs.*
* *Booking and post-fulfilment are handled through direct Point-to-Point (P2P) communication between the EUA and the specific HSPA, ensuring speed and flexibility without central API bottlenecks.*
* *Every healthcare provider, including smaller clinics, gains digital discoverability and standardised booking workflows.*

# 3. Eligibility & Prerequisites

The Physical Consultation Service integration is open to applications - End User Applications (EUAs) and Health Service Provider Applications (HSPAs), who are at least M2 enabled. Eligible applications could be:

* Digital health startups and consumer health app companies
* Health-tech platforms offering doctor discovery and appointment management
* Enterprise platforms integrating digital health services for employees or customers
* Government health portals seeking to offer UHI-based consultation booking

**Note:** ABDM M2 milestone completion with HIECM is a hard prerequisite. Applications that have not completed M2 cannot be onboarded onto UHI services including the Physical Consultation Service.

# 4. Integration - Onboarding, Production and Beyond

Follow the steps below in order. The onboarding process is divided into two sub-phases: Sandbox Onboarding (Steps 1 to 4) and Production Go-Live (Steps 5 & 6).

## 4.1 Sandbox Onboarding

| **Step** | **Title** | **Description** | **Links** | **Expected Output** |
| --- | --- | --- | --- | --- |
| 1 | Fill the Onboarding Form | Complete the UHI onboarding form with your application details, integration role (EUA/HSPA), Sandbox Callback URL, and Public Key. | [Onboarding Form](https://sandbox.abdm.gov.in/sandbox/v3/sandbox-registration) | Completed onboarding form submitted to NHA |
| 2 | Public Key & Header Generation | Clone the linked GitHub repository and run Generator.java (Option 1) to generate headers. Submit only the Public Key to NHA. Watch [this](https://docs.google.com/videos/d/1Fy-hnPwtRtzJayJP6A5QEaCZxkv6dMGYd0dKIOvBVIQ/edit?usp=sharing) video for guidance. | [Github Repository](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility) | Ed25519 key pair generated; public key shared with NHA |
| 3 | Access Sandbox & API Docs | NHA will provide sandbox access credentials via email. Review the API documentation, Swagger spec, and Postman Collection. Set up your sandbox environment. | [Swagger Spec](https://uhigatewaysandbox.abdm.gov.in/swagger-ui/index.html?urls.primaryName=v2.0.2#/) | Sandbox access confirmed; API docs reviewed |
| 4 | Build & Test Integration | Implement the full integration: discovery -> booking -> fulfilment -> post-fulfilment. Run all test cases to complete Integration on Sandbox. | 1. [EUA Test Cases](https://docs.google.com/spreadsheets/d/1z8djpVnv6KOBGIvJf8gezRcixPpij2mw/edit?gid=1501232847#gid=1501232847)  2. [HSPA Test](https://docs.google.com/spreadsheets/d/1pGYWHDGjVWKY55tKmWwRLaCV0EyR5SuB/edit?gid=1062972814#gid=1062972814)  [Cases](https://docs.google.com/spreadsheets/d/1pGYWHDGjVWKY55tKmWwRLaCV0EyR5SuB/edit?gid=1062972814#gid=1062972814) | All test cases Categories passed; sandbox validation complete |

##

## 4.2 Production Go-Live

| **Step** | **Title** | **Description** | **Responsible Party** | **Expected Output** |
| --- | --- | --- | --- | --- |
| 6 | NHA Sign-Off on Sandbox | Complete a Demo Video to NHA. NHA reviews and provides sign-off based on test case clearance along with a broader alignment on best practices. | NHA + EUA/HSPA | NHA sign-off received in writing |
| 7 | Production Deployment | NHA promotes the integration to the production UHI network. EUA & HSPA updates its consumer\_id, consumer\_uri, provider\_id, and provider\_uri to production endpoints. | NHA + EUA/HSPA | EUA/HSPA live on production UHI network; real transactions enabled |

##

## 4.3 Integration Phases

The Physical Consultation Service on UHI is live and currently open for onboarding applications to complete Phase 1 capability set covering the full patient journey as given below:

| **Phase** | **Status** | **Capabilities** | **Details** |
| --- | --- | --- | --- |
| Phase 1: Full Consultation Lifecycle | Live | Doctor Discovery | Search for doctors across registered HSPAs **by name, state, district, pincode, GPS proximity, or speciality.** View doctor profile, qualifications, languages, experience, and fee. |
| Slot Selection | View real-time available appointment slots returned by the HSPA. Select a preferred slot from the EUA interface. |
| Appointment Booking | Initiate and confirm a physical consultation booking directly with the provider's HSPA. Review and agree to terms (commercial, cancellation, payment) before confirmation. |
| PIN-based Check-in | Receive a 4-digit PIN upon confirmation. Present PIN at the clinic/facility for verification before the consultation begins. |
| Status Tracking | Track appointment state in real-time: CONFIRMED, APPOINTMENT\_STARTED, COMPLETED, CANCELLED, NO\_SHOW, DOCTOR\_NO\_SHOW. |
| Cancellation | Cancel appointments subject to HSPA cancellation terms. Currently the refund option is not part of the flow. |
| Payment | Currently supports **only Pay-on-Visit** flow as the online payment feature on UHI is still under development. |
| Phase 2: Advanced Capabilities | In Ideation | Digital payment/reconciliation on UHI | Capability to make online payments through different mechanisms before the booking is confirmed and implement ways to refund. |

# 5. Understanding Physical Consultation Service on UHI

**Important:** Critical Architectural Point: This service uses two distinct communication models.

* **Discovery uses UHI APIs routed via the Gateway.**
* **Booking, Fulfilment & Post-Fulfilment are entirely direct Point-to-Point (P2P) between EUA and HSPA, there is no central UHI API for these stages.**
* **EUAs & HSPAs must implement P2P endpoints to participate in the booking lifecycle.**

## 5.1 Actor Definitions

| **Actor** | **Full Name** | **Role in Physical Consultation Service** |
| --- | --- | --- |
| **EUA** | **End User Application** | **Patient-facing application** (mobile app, web app)  Handles patient-facing search, booking, and status display. |
| **HSPA** | **Health Service Provider Application** | **Provider-side platform** that manages doctor profiles, slot availability, booking confirmation, and appointment lifecycle.  Each HSPA represents one or more healthcare providers. |
| **HSP** | **Health Service Provider** | The actual **hospital, clinic, or individual doctor.**  The HSPA serves as the digital interface to the HSP. |
| **Gateway** | **UHI Gateway** | The NHA-run central **routing layer** for UHI discovery (search / on\_search). Not involved in the P2P booking flow. |
| **NHA** | **National Health Authority** | **Service owner and network operator**.  Governs onboarding, compliance, and the UHI protocol specifications. |

## 5.2 Service Workflow and API Sequence Diagram


Fig 1 : Stages of UHI Physical Consultation Service for Providers and Patients



Fig 3: API Sequence Diagram for UHI Physical Consultation Service

# 6. Technical Integration - Getting Started

## 6.1 Environment Details (UHI Gateway and Reference EUA & HSPA)

| **Parameter** | **Sandbox** |
| --- | --- |
| Gateway Base URI  (UHI Sandbox) | https://uhigatewaysandbox.abdm.gov.in |
| Consumer URI  (UHI EUA Sandbox) | http://uhieuasandbox.abdm.gov.in/api/v1/euaService |
| Provider URI  (UHI EUA Sandbox) | https://hspasbx.abdm.gov.in/api/v1/hspa |

## 6.2 Service Identity

All Physical Consultation API calls must use the following fixed identifiers. These distinguish Physical Consultation from other UHI services such as HEM or teleconsultation.

| **Parameter** | **Value** | **Where Used** |
| --- | --- | --- |
| domain | nic2004:85111 | context.domain in every API call |
| fulfillment.type | Physical | message.intent.fulfillment.type in search calls |
| item.descriptor.code | Consultation | message.intent.item.descriptor.code |
| item.descriptor.name | Consultation | message.intent.item.descriptor.name |
| core\_version | 0.7.1 | context.core\_version |

## 6.3 Authentication & Signing

All UHI API calls must be signed. The signing mechanism used is Ed25519 digital signatures and BLAKE-512 body hashing. **Kindly implement the Key Generation Utility shared in** [**this**](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility) **link to authenticate and sign all the requests. Read more** [**here**](https://uhigatewaysandbox.abdm.gov.in/swagger-ui/index.html?urls.primaryName=v2.0.2#/)**.**

| **Component** | **Detail** |
| --- | --- |
| Hashing Algorithm | BLAKE-512 (for computing the digest of the request body) |
| Signing Algorithm | Ed25519 digital signature scheme |
| Authorization Header Format | Authorization: {"headers":"(created) (expires) digest","algorithm":"ed25519","keyId":"<eua-id>|<key-id>|ed25519","created":"<epoch>","expires":"<epoch>","signature":"<base64-sig>"} |
| Gateway Header (inbound) | X-Gateway-Authorization header in same format, keyId prefixed with gateway-nha |

## 6.3 Shared Schemas & Common Fields

The following fields appear in the context block of every UHI API call.

**Context Object (All APIs)**

| **Field** | **Type** | **Mandatory** | **Description / Permissible Values** | **Example** |
| --- | --- | --- | --- | --- |
| domain | string | Yes | nic2004:85111 for Physical Consultation | nic2004:85111 |
| country | string | Yes | Country code per ISO 3166-1. Always IND for India | IND |
| city | string | Yes | STD code prefixed with std: - e.g. std:011 for Delhi | std:011 |
| action | string | Yes | UHI API action name. Must match the endpoint being called. Enum: search, on\_search, init, on\_init, confirm, on\_confirm, status, on\_status, cancel, on\_cancel, on\_update, on\_message, etc. | search |
| core\_version | string | Yes | UHI core API specification version. Currently 0.7.1 | 0.7.1 |
| consumer\_id | string (URI) | Yes | Unique ID of the EUA - typically its fully qualified domain name | eua-nha |
| consumer\_uri | string (URI) | Yes | HTTPS callback URL of the EUA where async responses are delivered. Must share the same domain as consumer\_id | https://uhieuasandbox.abdm.gov.in/api/v1/euaService |
| provider\_id | string (URI) | Conditional | Unique ID of the HSPA. Required in all P2P calls (init onwards); not required in search | hspa-nha |
| provider\_uri | string (URI) | Conditional | Base URL of the HSPA. Required in all P2P calls. Obtained from on\_search response context | https://hspasbx.abdm.gov.in/api/v1 |
| transaction\_id | string (UUID) | Yes | Persists across all API calls in a single transaction. | e9a19230-f951-11ec-b135-53aea776f66b |
| message\_id | string (UUID) | Yes | Unique per request/callback cycle. Differs from transaction\_id. A new UUID for each call | e9a19230-f951-11ec-b135-53aea776f66b |
| timestamp | string (ISO 8601) | Yes | Time of request generation. RFC 3339 format | 2022-07-05T15:24:35Z |
| key | string | No | Sender's encryption public key | - |
| ttl | string (ISO 8601) | No | Duration after timestamp for which the message is valid | PT30S |

**Transaction\_id must remain identical across all API calls within one booking lifecycle.**

**Standard Response (ACK)**

**All UHI endpoints return HTTP 200 ACK immediately on receipt.**

**This is not a business response, it is a transport acknowledgement only. The actual business data arrives asynchronously at the callback URL. For eg: /on\_search request will have the data for the /search request.**

| **Standard ACK Response** |
| --- |
| { |
| "message": { |
| "ack": { |
| "status": "ACK" |
| } |
| }, |
| "error": {} |
| } |

**Error Object**

| **Field** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| type | string | Yes | Error category |
| code | string | Yes | UHI-specific error code |
| path | string | No | JSON path to the field causing the error |
| message | string | No | Human-readable error description |

## 6.5 API Endpoints Checklist

### 6.5.1 HSPA Endpoint Exposure Checklist

The HSPA (Health Service Provider Application) must develop and expose all of the following HTTPS endpoints to participate in the UHI network. These are called by the EUA directly (P2P) except for /search, whose first call is broadcast by the UHI Gateway.

| **Endpoint** | **When Called** | **Action Required** | **Who Calls It** |
| --- | --- | --- | --- |
| **/search**  **(first)** | After every search (Phase 1: Discovery) | Receive search intent; query doctor catalog; return results via /on\_search callback | UHI Gateway (1st broadcast, with X-Gateway-Authorization header) |
| **/search**  **(second)** | After Doctor Selection  (Phase 1: Discovery) | Receive search intent; query doctor availability (Time slots); return results via /on\_search callback | EUA directly (2nd - P2P, with Authorization header) |
| **/init** | After EUA initiates booking (Phase 2: Booking) | Respond with Terms & Conditions via /on\_init; store order\_id | EUA (direct P2P) |
| **/confirm** | After patient agrees to T&C (Phase 2: Booking) | Confirm appointment; respond with 4-digit PIN via /on\_confirm | EUA (direct P2P) |
| **/status** | EUA requesting order status (Phase 3: Fulfilment) | Request for current order status. Only for when on\_update is not received from HSPA as per the expected flow. | EUA (direct P2P) |
| **/cancel** | After EUA triggers cancellation (Phase 4: Post-Fulfilment) | Process cancellation; respond via /on\_cancel | EUA (direct P2P) |
| **/on\_update** | Proactively or when appointment state changes | Receive and process state update from EUA; update appointment state; notify patient | EUA (direct P2P) - both HSPA and EUA consume this endpoint |
| **/on\_message** | When a chat message is sent from EUA | Receive message from EUA chatbox; relay to provider side | EUA (direct P2P) - both HSPA and EUA consume this endpoint  **Mandatory for EUA to implement it.** |

###

### 6.5.2. EUA Endpoint Exposure Checklist

The EUA (End User Application) must develop and expose all of the following HTTPS endpoints. These are called by the HSPA directly (P2P, with Authorization header) except for /on\_search, whose first delivery comes via the UHI Gateway.

| **Endpoint** | **When Called** | **Action Required** | **Who Calls It** |
| --- | --- | --- | --- |
| **/on\_search (first)** | After every search (Phase 1: Discovery) | Aggregate catalog; display results to patient; store provider\_url | UHI Gateway (1st – with X-Gateway-Authorization header) → |
| **/on\_search (second)** | After Doctor Selection (Phase 1: Discovery) | Return Time Slots for selected Doctor on the provider\_url | HSPA directly (2nd – with Authorization header) |
| **/on\_init** | After HSPA processes init (Phase 2: Booking) | Present T&C to patient; store order\_id | HSPA (direct P2P) |
| **/on\_confirm** | After HSPA confirms booking (Phase 2: Booking) | Display PIN (Physical) or video link (Online); store order | HSPA (direct P2P) |
| **/on\_status** | After status query (Phase 3: Fulfilment) | Update local order state shown to patient | HSPA (direct P2P) |
| **/on\_update** | Proactively when appointment state changes | Update appointment state; notify patient | HSPA (direct P2P) - both HSPA and EUA consume this endpoint |
| **/on\_cancel** | After EUA cancels or HSPA-initiated cancel (Phase 4) | Mark appointment cancelled; | HSPA (direct P2P) |
| **/on\_message** | When HSPA sends a chat message | Receive message on chatbox from provider side | HSPA (direct P2P) - both HSPA and EUA consume this endpoint.  **For HSPA, this endpoint is optional but they are requested to set the Tags in on\_confirm for informing EUA the available communication modes.** |

### 6.5.3 UHI Gateway Endpoint Reference

The UHI Gateway is developed and operated exclusively by NHA. EUAs and HSPAs do not build these endpoints - they call into them or receive calls from them. All Gateway-originated calls carry the X-Gateway-Authorization header signed with the Gateway's Ed25519 private key.

| **Endpoint** | **Who Hits It** | **Who Develops / Exposes It** | **What Happens** |
| --- | --- | --- | --- |
| **POST /api/v1/uhi/search** | EUA | UHI Gateway | EUA sends a search request to the Gateway. Gateway broadcasts it to all registered HSPAs in the domain, appending the X-Gateway-Authorization header to each forwarded request. |
| **POST /api/v1/uhi/on\_search** | HSPA | UHI Gateway | HSPA sends its /on\_search response (catalog) to the Gateway. Gateway forwards it asynchronously to the originating EUA's callback URL (consumer\_uri). |
| **POST /api/v1/uhi/on\_confirm\_audit** | HSPA | UHI Gateway | HSPA sends an exact copy of its /on\_confirm response to the Gateway for audit logging and compliance traceability. |
| **POST /api/v1/uhi/on\_update\_audit** | HSPA | UHI Gateway | HSPA sends an exact copy of its /on\_update response to the Gateway for audit logging. Care Context ID must be shared on this link for availing DHIS. |
| **POST /api/v1/uhi/on\_cancel\_audit** | HSPA | UHI Gateway | HSPA sends an exact copy of its /on\_cancel response to the Gateway for audit logging. |
| **POST /api/v1/uhi/on\_status\_audit** | HSPA | UHI Gateway | HSPA sends an exact copy of its /on\_status response to the Gateway for audit logging. |
| **POST /api/v1/networkregistry/lookup** | HSPA / EUA | UHI Network Registry | Any participant calls this to look up another subscriber's public key and details before generating or verifying Authorization headers. Used before every signed P2P call. |

*Key point: EUAs call /api/v1/uhi/search to initiate discovery. HSPAs call the /on\_search and audit endpoints to route responses and fulfil compliance requirements. Registry lookup is used by both parties before every signed P2P call.*

#

# 7. Technical Integration - In Detail

This section provides a comprehensive, stage-wise reference for every API endpoint in the UHI Physical Consultation Service. All field definitions are sourced from the UHI Gateway Swagger specification (v2.0.2) and are scoped exclusively to the Physical Consultation domain (nic2004:85111).

**Stage-wise API Summary**

| **Stage** | **API Endpoint** | **Communication Model** | **What Happens** |
| --- | --- | --- | --- |
| Stage 1: Discovery | POST /search (First) | Broadcast via Gateway | EUA sends search to all registered HSPAs via Gateway |
| POST /on\_search (First) | Gateway → EUA callback | HSPA returns doctor catalog via Gateway to EUA |
| POST /search (Second) | Direct P2P (EUA→HSPA) | EUA requests slot availability for selected doctor |
| POST /on\_search (Second) | Direct P2P (HSPA→EUA) | HSPA returns available time slots to EUA |
| Stage 2: Booking | POST /init | Direct P2P (EUA→HSPA) | EUA initiates booking with patient and slot details |
| POST /on\_init | Direct P2P (HSPA→EUA) | HSPA sends T&C and holds slot temporarily |
| POST /confirm | Direct P2P (EUA→HSPA) | EUA confirms booking with all terms AGREED |
| POST /on\_confirm | Direct P2P (HSPA→EUA) | HSPA confirms booking and returns 4-digit PIN |
| Stage 3: Fulfilment  **+**  Stage 4: Post-Fulfilment | POST /status | Direct P2P (EUA→HSPA) | EUA polls current appointment status |
| POST /on\_status | Direct P2P (HSPA→EUA) | HSPA returns a full order state. |
| POST /on\_update (HSPA) | Direct P2P (EUA→HSPA) | EUA could send a DOCTOR\_NO\_SHOW state to HSPA |
| POST /on\_update (EUA) | Direct P2P (HSPA→EUA) | HSPA pushes appointment lifecycle state updates to EUA |
| POST /cancel | Direct P2P (EUA→HSPA) | EUA uses this request to send a cancellation request to the HSPA. |
| POST /on\_cancel | Direct P2P  (HSPA→EUA) | HSPA uses it to send an acknowledgement of cancellation request from EUA  OR  HSPA would use this request to cancel the appointment from their end. |
| POST /on\_message (HSPA) | Direct P2P (EUA→HSPA) | EUA sends in-app chat message or media to HSPA |
| POST /on\_message (EUA) | Direct P2P (HSPA→EUA) | HSPA sends in-app chat message or media to EUA |
| Support | POST /api/v1/networkregistry/lookup | Any → Gateway | Look up subscriber public key in UHI registry |
| Audit | POST /on\_cancel\_audit(HSPA) | HSPA→Gateway | HSPA sends a copy of /on\_cancel request to the Gateway for Audit |
| POST /on\_confirm\_audit(HSPA) | HSPA→Gateway | HSPA sends a copy of /on\_confirm request to the Gateway for Audit |
| POST /on\_status\_audit | HSPA→Gateway | HSPA sends a copy of /on\_status request to the Gateway for Audit |
| POST /on\_update\_audit | HSPA→Gateway | HSPA sends a copy of /on\_update request to the Gateway for Audit |

## 7.1 Stage 1: Discovery

### 7.1.1 POST /search - First Search (EUA → UHI Gateway → HSPA)

Broadcasts a search request to all registered HSPAs on the UHI network. The EUA sends this call to the Gateway-hosted endpoint; the Gateway authenticates the request, validates the domain, and routes it to all registered HSPAs that match the domain. The HSPA receives this call and must respond asynchronously via the /on\_search callback to the EUA's consumer\_uri.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | EUA (initiates via Gateway) |
| Communication Model | Broadcast via UHI Gateway |
| Stage | Discovery |

**Request Payload - message.intent Fields**

| **Field Path** | **Type** | **Required** | **Description / Permissible Values** |
| --- | --- | --- | --- |
| message.intent.fulfillment.type | string | Yes | Physical for in-person consultation. Case-sensitive. |
| message.intent.fulfillment.agent.name | string | No | Doctor name for name-based search filter. |
| message.intent.fulfillment.agent.id | string | No | Doctor HPR address (e.g. <HPR_ADDRESS>@hpr.ndhm) for HPR-based search. |
| message.intent.fulfillment.start.time.timestamp | datetime | Yes | Search time window start. ISO 8601 format. |
| message.intent.fulfillment.end.time.timestamp | datetime | Yes | Search time window end. ISO 8601 format. |
| message.intent.item.descriptor.code | string | Yes | Always Consultation for the Physical Consultation domain. |
| message.intent.item.descriptor.name | string | Yes | Always Consultation for the Physical Consultation domain. |
| message.intent.category.descriptor.code | string | No | Speciality code e.g. CARDIOLOGY for speciality-based search. |
| message.intent.category.descriptor.name | string | No | Speciality name e.g. Cardiology. |
| message.intent.location.gps | string | Conditional | Latitude,Longitude for GPS proximity search (e.g. 28.635308,77.224960). |
| message.intent.location.radius.type | string | Conditional (GPS) | Always CONSTANT when using GPS radius search. |
| message.intent.location.radius.value | float/string | Conditional (GPS) | Radius in km (e.g. "10"). |
| message.intent.location.radius.unit | string | Conditional (GPS) | Always km. |
| message.intent.location.city.name | string | No | City name for city-based search e.g. Delhi. |
| message.intent.location.city.code | string | No | City STD code e.g. 011. |
| message.intent.address.area\_code | string | No | 6-digit pincode for pincode-based search e.g. 110001. |
| message.intent.provider.descriptor.name | string | No | Facility/hospital name for facility-based search filter. |
| message.intent.provider.id | string | No | Provider/hospital ID for second search targeting a specific provider. |

**Sample Request - Search by State and District (Physical Consultation)**

{

"context": {

"action": "search",

"city": "std:011",

"consumer\_id": "eua-nha",

"consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"core\_version": "0.7.1",

"country": "IND",

"domain": "nic2004:85111",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-06-18T06:52:13.969464Z",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

},

"message": {

"intent": {

"fulfillment": {

"end": {

"time": {

"timestamp": "2026-06-18T23:59:59"

}

},

"start": {

"time": {

"timestamp": "2026-06-18T10:37:32"

}

},

"type": "Physical"

},

"item": {

"descriptor": {

"code": "Consultation",

"name": "Consultation"

}

},

"location": {

"state": {

"name": "MAHARASHTRA",

"code": "27"

},

"district": {

"name": "PUNE",

"code": "490"

}

}

}

}

}

***⚠ Search can be carried out with parameters like GPS, State, District, Doctor Name, HPR ID, Pincode, Facility Name etc. Kindly refer to the*** [***Swagger***](https://uhigatewaysandbox.abdm.gov.in/swagger-ui/index.html?urls.primaryName=v2.0.2#/HSPA%20-%20Provider%20Platform/post_search) ***for more search parameter combinations.***

***⚠ GPS search requires all three radius fields: radius.type (CONSTANT), radius.value (numeric string), and radius.unit (km). Omitting any one causes the GPS filter to be silently ignored.***

***⚠ The transaction\_id in /search must match the transaction\_id in the corresponding /on\_search response. Mismatch prevents response correlation.***

### 7.1.2 POST /on\_search - First on\_search (Gateway → EUA Callback)

Delivers the catalog of matching doctors and available slots from each responding HSPA to the EUA's registered callback URL (consumer\_uri). Each HSPA that matches the search criteria sends an independent on\_search response. The EUA must aggregate multiple responses using the shared transaction\_id and present a unified result to the patient.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | HSPA (sends to Gateway), Gateway (forwards to EUA) |
| Communication Model | HSPA → UHI Gateway → EUA consumer\_uri |
| Stage | Discovery |

**Response Catalog Fields**

| **Field Path** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| context.provider\_uri | string (URL) | Yes | Base URL of the HSPA. Must be stored by EUA for all subsequent P2P calls (init onwards). |
| message.catalog.descriptor.name | string | Yes | HSPA/catalog name (e.g. "Ref HSPA"). |
| message.catalog.providers[].id | string | Yes | Unique provider/hospital ID within this HSPA. |
| message.catalog.providers[].descriptor.name | string | Yes | Hospital or clinic name. |
| message.catalog.providers[].descriptor.short\_desc | string | No | Short description of the healthcare provider. |
| message.catalog.providers[].categories[].id | string | Yes | Speciality category ID. |
| message.catalog.providers[].categories[].descriptor.name | string | Yes | Speciality name e.g. Cardiology. |
| message.catalog.providers[].categories[].descriptor.code | string | Yes | Speciality code e.g. CARDIOLOGY. |
| message.catalog.providers[].fulfillments[].id | string | Yes | Slot UUID. Use this as fulfillment\_id in /init. |
| message.catalog.providers[].fulfillments[].type | string | Yes | Physical (fixed for this service). |
| message.catalog.providers[].fulfillments[].agent.id | string | Yes | Doctor HPR ID (e.g. <HPR_ADDRESS>@hpr.ndhm). |
| message.catalog.providers[].fulfillments[].agent.name | string | Yes | Doctor full registered name. |
| message.catalog.providers[].fulfillments[].agent.gender | string | No | M or F. |
| message.catalog.providers[].fulfillments[].agent.tags | object | No | Key-value metadata: @abdm/gov.in/experience, @abdm/gov.in/languages, @abdm/gov.in/education, @abdm/gov.in/hpr\_id, @abdm/gov.in/hfr\_id, @abdm/gov.in/hip\_id. |
| message.catalog.providers[].fulfillments[].start.time.timestamp | datetime | Yes | Slot start time. ISO 8601. |
| message.catalog.providers[].fulfillments[].end.time.timestamp | datetime | Yes | Slot end time. ISO 8601. |
| message.catalog.providers[].items[].id | string | Yes | Item ID. Use this as order.item.id in /init. |
| message.catalog.providers[].items[].price.value | string | Yes | Consultation fee in INR as a decimal string. |
| message.catalog.providers[].items[].fulfillment\_id | string | Yes | Links the item to its fulfillment slot UUID. |
| message.catalog.providers[].location.gps | string | No | Provider GPS coordinates: lat,long. |
| message.catalog.providers[].location.address | string | No | Provider street address. |
| message.catalog.providers[].location.city.name | string | No | City name. |

**Sample Response - on\_search (Physical Consultation, First Search)**

{

"context": {

"domain": "nic2004:85111",

"action": "on\_search",

"consumer\_id": "eua-nha",

"provider\_id": "hspa-nha",

"provider\_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",

"transaction\_id": "a1b2c3d4-f951-11ec-b135-53aea776f66b",

"message\_id": "b2c3d4e5-f951-11ec-b135-53aea776f66b"

},

"message": {

"catalog": {

"descriptor": { "name": "ABDM Reference HSPA" },

"providers": [{

"id": "1",

"descriptor": { "name": "Safdarjung Medical Centre" },

"categories": [

{ "id": "201", "parent\_category\_id": "101", "descriptor": { "name": "Cardiology", "code": "CARDIOLOGY" } },

{ "id": "101", "descriptor": { "name": "Allopathy", "code": "ALLOPATHY" } }

],

"fulfillments": [{

"id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef",

"type": "Physical",

"agent": {

"id": "<HPR_ADDRESS>@hpr.ndhm",

**"name": "Dr. <NAME>",**

**"gender": "F",**

"tags": {

"@abdm/gov.in/experience": "8.0",

"@abdm/gov.in/languages": "Hindi, English",

"@abdm/gov.in/education": "MBBS, MD Cardiology",

"@abdm/gov.in/hpr\_id": "<HPR_ID>"

}

},

"start": { "time": { "timestamp": "2026-04-16T10:00:00" } },

"end": { "time": { "timestamp": "2026-04-16T10:20:00" } }

}],

"items": [{

"id": "0",

"descriptor": { "name": "Consultation", "code": "CONSULTATION" },

"price": { "currency": "INR", "value": "500.0" },

"fulfillment\_id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef"

}],

"location": {

"gps": "28.635308,77.224960",

"address": "<ADDRESS>",

"city": { "name": "Delhi", "code": "011" }

}

}]

}

}

}

***⚠ The EUA will receive multiple /on\_search responses - one per responding HSPA. Results must be aggregated using the shared transaction\_id. The EUA must capture the context.provider\_uri from each response; this URI is the base URL for all subsequent P2P calls.***

### 7.1.3 POST /search - Second Search (EUA → HSPA, Direct P2P)

After the patient selects a preferred doctor from the first search results, the EUA sends a second direct P2P search to the selected HSPA's provider\_uri. This call targets a specific provider and requests available appointment slots for the chosen doctor within a defined time window.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | EUA (sends directly to HSPA provider\_uri) |
| Communication Model | Direct P2P (no Gateway involvement) |
| Stage | Discovery |

**Key Differences from First Search**

The second search payload includes context.provider\_id and context.provider\_uri (obtained from the first on\_search response context). The message.intent.provider block must contain the provider id, and the fulfillments and items blocks from the first on\_search are echoed back to identify the doctor and category.

**Sample Request - Second Search (Physical Consultation)**

{

"context": {

"domain": "nic2004:85111",

"country": "IND",

"city": "std:011",

"action": "search",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"provider\_id": "hspa-nha",

"provider\_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",

"message\_id": "c3d4e5f6-32af-11ef-bcbe-590b07ce8c90",

"timestamp": "2026-04-15T09:05:00Z",

"transaction\_id": "a1b2c3d4-f951-11ec-b135-53aea776f66b"

},

"message": {

"intent": {

"provider": {

"id": "1",

"categories": [

{ "id": "201", "parent\_category\_id": "101",

"descriptor": { "name": "Cardiology", "code": "CARDIOLOGY" } }

],

"fulfillments": [{

"type": "Physical",

"agent": { "id": "<HPR_ADDRESS>@hpr.ndhm" },

"start": { "time": { "timestamp": "2026-04-16T00:00:00" } },

"end": { "time": { "timestamp": "2026-04-16T23:59:59" } }

}],

"items": [{ "id": "0",

"descriptor": { "name": "Consultation", "code": "CONSULTATION" },

"price": { "currency": "INR", "value": "500.0" },

"fulfillment\_id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef"

}]

},

"fulfillment": {

"type": "Physical",

"agent": { "id": "<HPR_ADDRESS>@hpr.ndhm" },

"start": { "time": { "timestamp": "2026-04-16T00:00:00" } },

"end": { "time": { "timestamp": "2026-04-16T23:59:59" } }

},

"item": {

"descriptor": { "code": "Consultation", "name": "Consultation" }

}

}

}

}

### 7.1.4 POST /search - Second on\_search (HSPA → EUA, Direct P2P)

The HSPA responds to the second search via a P2P callback to the EUA's consumer\_uri. The response contains the specific available time slots for the selected doctor on the requested date, formatted identically to the first on\_search catalog but scoped to the single doctor.

**Sample Response - on\_search (Search by Doctor & Specialty)**

{

"context": {

"domain": "nic2004:85111",

"country": "IND",

"city": "std:011",

"action": "on\_search",

"timestamp": "2022-07-05T15:24:35",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"provider\_id": "hspa-nha",

"provider\_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

},

"message": {

"catalog": {

"descriptor": {

"name": "Ref HSPA",

"images": "HSPA IMAGE",

"short\_desc": "Reference HSPA Test hospital",

"long\_desc": "Expert institution providing patient treatment with specialized health science and auxiliary healthcare staff and extraordinary medical equipments."

},

"providers": [

{

"id": "1",

"descriptor": {

"name": "Test Hospital",

"short\_desc": "Expertise in every field with renowned staff.",

"long\_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."

},

"categories": [

{

"id": "0",

"parent\_category\_id": "101",

"descriptor": {

"name": "Cardiology",

"code": "CARDIOLOGY"

}

},

{

"id": "101",

"descriptor": {

"name": "Allopathy",

"code": "ALLOPATHY"

}

}

],

"fulfillments": [

{

"id": "0",

"type": "Physical",

"agent": {

"id": "<HPR_ADDRESS>@hpr.ndhm",

"name": "<NAME>",

"gender": "M",

"tags": {

"@abdm/gov.in/experience": "10.0",

"@abdm/gov.in/languages": "Hindi, English",

"@abdm/gov.in/education": "MBBS, BDS",

"@abdm/gov.in/hpr\_id": "<HPR_ID>",

"@abdm/gov.in/hfr\_id": "<HPR_ID>",

"@abdm/gov.in/hip\_id": "IN2910000074"

}

},

"start": {

"time": {

"timestamp": "2023-01-03T12:30:00"

}

},

"end": {

"time": {

"timestamp": "2023-01-03T12:45:00"

}

}

}

],

"items": [

{

"id": "0",

"descriptor": {

"name": "Consultation"

},

"price": {

"currency": "INR",

"value": "300.0"

},

"category\_id": "0",

"fulfillment\_id": "0"

}

],

"location": {

"id": "1",

"descriptor": {

"name": "Test Hospital",

"short\_desc": "Expertise in every field with renowned staff.",

"long\_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."

},

"city": {

"name": "Delhi",

"code": "011"

},

"district": {

"name": "INDIA",

"code": "+91"

},

"gps": "18.5246036,73.792927",

"address": "3rd, 7th & 9th Floor, Tower-L, Jeevan Bharati Building, Connaught Place, New Delhi, Delhi 110001"

}

}

]

}

}

}

***⚠ Kindly ensure that all the tags along with HIP ID are sent to EUA, as it is crucial for pulling and displaying the Prescription or other Health Records generated during the Physical Consultation.***

## 7.2 Stage 2: Booking

### 7.2.1 POST /init (EUA → HSPA, Direct P2P)

Initiates the booking order. The EUA sends the patient's billing details, selected slot (fulfillment), and payment intent directly to the HSPA's provider\_uri. The HSPA temporarily holds the selected slot and responds asynchronously via /on\_init with the full terms and conditions that the patient must accept before the booking can be confirmed.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | EUA (sends directly to HSPA) |
| Communication Model | Direct P2P (EUA → HSPA) |
| Stage | Booking |

**Request Payload - message.order Fields**

| **Field Path** | **Type** | **Required** | **Description / Permissible Values** |
| --- | --- | --- | --- |
| order.provider.id | string | Yes | Provider ID from the on\_search catalog response. |
| order.item.id | string | Yes | Item ID from the on\_search catalog response. |
| order.item.descriptor.code | string | Yes | Always Consultation (or CONSULTATION) for this service. |
| order.item.descriptor.name | string | Yes | Always Consultation for this service. |
| order.item.price.currency | string | No | ISO 4217 currency code. e.g. INR. |
| order.item.price.value | string | No | Consultation fee as a decimal string. e.g. "500.0". |
| order.item.fulfillment\_id | string | Yes | UUID of the fulfillment slot from on\_search. Links item to slot. |
| order.fulfillment.id | string | Yes | UUID of the selected fulfillment/slot from on\_search. |
| order.fulfillment.type | string | Yes | Physical (fixed for Physical Consultation). |
| order.fulfillment.agent.id | string | Yes | Doctor HPR ID (e.g. <HPR_ADDRESS>@hpr.ndhm). |
| order.fulfillment.agent.name | string | Yes | Doctor full registered name. |
| order.fulfillment.start.time.timestamp | datetime | Yes | Appointment slot start time. ISO 8601. |
| order.fulfillment.end.time.timestamp | datetime | Yes | Appointment slot end time. ISO 8601. |
| order.fulfillment.tags | object | Conditional | Slot metadata. @abdm/gov.in/slot\_id is mandatory. Contains the slot UUID. |
| order.billing.name | string | Yes | Patient billing name. |
| order.billing.address | object | Yes | Patient full address object. Must include: door, name, locality, city, state, country, area\_code. |
| order.billing.phone | string | Yes | Patient contact number (10 digits). |
| order.billing.email | string | No | Patient email address. |
| order.customer.id | string | Yes | Patient ABHA ID (e.g. <ABHA_ADDRESS>). |
| order.customer.person.gender | string | No | M or F. |
| order.customer.person.dob | string | No | Date of birth in YYYY-MM-DD format. |
| order.customer.person.dayOfBirth | integer | No | Day of birth (numeric). |
| order.customer.person.monthOfBirth | integer | No | Month of birth (numeric). |
| order.customer.person.yearOfBirth | integer | No | Year of birth (numeric). |
| order.payment.type | string | Yes | Payment timing. Enum: ON-ORDER (pay after - Pay on Visit), PRE-FULFILLMENT (pay before), ON-FULFILLMENT. |
| order.payment.params.redirect\_url | string | No | Redirect URL for payment callback. |

**Sample Request - /init (Physical Consultation)**

{

"context": {

"domain": "nic2004:85111",

"country": "IND",

"city": "std:011",

"action": "init",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"provider\_id": "hspa-nha",

"provider\_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",

"transaction\_id": "a1b2c3d4-f951-11ec-b135-53aea776f66b",

"message\_id": "d4e5f6a7-32af-11ef-bcbe-590b07ce8c90",

"timestamp": "2026-04-15T09:10:00Z"

},

"message": {

"order": {

"provider": { "id": "1" },

"item": {

"id": "0",

"descriptor": { "name": "Consultation", "code": "CONSULTATION" },

"price": { "currency": "INR", "value": "500.0" },

"fulfillment\_id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef"

},

"fulfillment": {

"id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef",

"type": "Physical",

"agent": { "id": "<HPR_ADDRESS>@hpr.ndhm", "name": "Dr. <NAME>" },

"start": { "time": { "timestamp": "2026-04-16T10:00:00" } },

"end": { "time": { "timestamp": "2026-04-16T10:20:00" } }

},

"billing": {

"name": "<NAME>",

"address": {

"door": "B-204",

"name": "<NAME>",

"locality": "<ADDRESS>",

"city": "Delhi",

"state": "Delhi",

"country": "INDIA",

"area\_code": "110085"

},

"phone": "<MOBILE_NUMBER>",

"email": "<EMAIL>"

},

**"customer": {**

**"id": "<ABHA_ADDRESS>",**

**"person": { "gender": "M", "dob": "<DOB>",**

**"dayOfBirth": "<DOB>", "monthOfBirth": "<DOB>", "yearOfBirth": "<DOB>" }**

**},**

"payment": {

"type": "ON-ORDER",

"params": { "redirect\_url": "https://uhieuasandbox.abdm.gov.in/on\_paymentStatus" }

}

}

}

}

***⚠ The fulfillment.id in /init must exactly match the slot UUID received in the /on\_search response. Any mismatch will cause the HSPA to reject or silently fail to hold the slot.***

***⚠ The HSPA typically holds the slot for a limited window (e.g. 15 minutes) after receiving /init. If /confirm is not received within this window, the slot is released and /init must be re-initiated.***

### 7.2.2 POST /on\_init (HSPA → EUA, Direct P2P Callback)

The HSPA responds to /init by temporarily holding the selected slot for 15 minutes and sending the complete Terms and Conditions (T&C) that the patient must accept before the booking can proceed to confirmation. The EUA must present all five term types to the patient in a clear and accessible manner before calling /confirm.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | HSPA (sends directly to EUA consumer\_uri) |
| Communication Model | Direct P2P (HSPA → EUA) |
| Stage | Booking |

**Key Additions in on\_init vs init**

| **Field** | **Added By** | **Description** |
| --- | --- | --- |
| **order.id** | **HSPA** | **HSPA-assigned unique order ID. Must be generated at the time of on\_init and sent in every request afterwards.**  We recommend an Alphanumeric string.  For eg: AHS12345=> HS abbreviated for your HSPA name |
| order.terms[] | HSPA | Array of 5 term types with termsState: INITIATED. EUA must change each to AGREED in /confirm. |
| order.quote | HSPA | Itemised price breakdown including Consultation, SGST, CGST, and Registration. |
| order.payment.type | HSPA | Payment model (ON-ORDER = Pay on Visit, FREE, PRE-ORDER). |
| order.payment.status | HSPA | Initial payment status (NOT\_PAID, FREE). |

**Terms Object Structure**

| **Field** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| terms[].type | string | Yes | Term category. Enum: Commercial, Settlement, Cancellation, Payment. |
| terms[].descriptor.name | string | Yes | Term title. |
| terms[].descriptor.short\_desc | string | No | Brief description of the term. |
| terms[].descriptor.long\_desc | string | No | Full term text. Must be displayed to the patient. |
| terms[].reasonRequired | boolean | Yes | If true, the patient must provide a reason when this term is actioned (e.g. on cancellation). |
| terms[].timePeriod | datetime | Yes | Validity period for the term. Copy unchanged to /confirm. |
| terms[].reason | string | Conditional | Required in /confirm only if reasonRequired is true. |
| terms[].termsState | string | Yes | INITIATED (set by HSPA in on\_init). EUA must change to AGREED in /confirm. |

**Sample Response - /on\_init (Physical Consultation)**

{

"context": {

"domain": "nic2004:85111",

"action": "on\_init",

"consumer\_id": "eua-nha",

"provider\_id": "hspa-nha",

"provider\_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",

"transaction\_id": "a1b2c3d4-f951-11ec-b135-53aea776f66b",

"message\_id": "e5f6a7b8-32af-11ef-bcbe-590b07ce8c90"

},

"message": {

"order": {

"id": "0415-234567-8901",

"provider": { "id": "1" },

"item": {

"id": "0",

"descriptor": { "name": "Consultation", "code": "CONSULTATION" },

"price": { "currency": "INR", "value": "500.0" },

"fulfillment\_id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef"

},

"fulfillment": {

"id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef",

"type": "Physical",

"agent": { "id": "<HPR_ADDRESS>@hpr.ndhm", "name": "Dr. <NAME>" },

"start": { "time": { "timestamp": "2026-04-16T10:00:00" } },

"end": { "time": { "timestamp": "2026-04-16T10:20:00" } },

"tags": { "@abdm/gov.in/slot\_id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef" }

},

**"terms": [**

**{ "type": "Commercial", "descriptor": { "name": "Commercial Terms",**

**"short\_desc": "Commercial terms for this consultation.",**

**"long\_desc": "Full commercial terms text..." },**

**"reasonRequired": false, "timePeriod": "2026-12-31T23:59:59",**

**"reason": "", "termsState": "INITIATED" },**

**{ "type": "Settlement", "descriptor": { "name": "Settlement Terms",**

**"short\_desc": "Settlement terms between EUA and HSPA.",**

**"long\_desc": "Full settlement terms text..." },**

**"reasonRequired": false, "timePeriod": "2026-12-31T23:59:59",**

**"reason": "", "termsState": "INITIATED" },**

**{ "type": "Cancellation", "descriptor": { "name": "Cancellation Policy",**

**"short\_desc": "Full refund if cancelled 48 hrs prior.",**

**"long\_desc": "Full cancellation terms text..." },**

**"reasonRequired": true, "timePeriod": "2026-12-31T23:59:59",**

**"reason": "", "termsState": "INITIATED" },**

**{ "type": "Refund", "descriptor": { "name": "Refund Policy",**

**"short\_desc": "Full refund if doctor does not show.",**

**"long\_desc": "Full refund terms text..." },**

**"reasonRequired": false, "timePeriod": "2026-12-31T23:59:59",**

**"reason": "", "termsState": "INITIATED" },**

**{ "type": "Payment", "descriptor": { "name": "Payment Terms",**

**"short\_desc": "Pay at clinic on day of visit.",**

**"long\_desc": "Full payment terms text..." },**

**"reasonRequired": false, "timePeriod": "2026-12-31T23:59:59",**

**"reason": "", "termsState": "INITIATED" }**

],

"quote": {

"price": { "currency": "INR", "value": "500.0" },

"breakup": [

{ "title": "Consultation", "price": { "currency": "INR", "value": "500.0" } },

{ "title": "SGST @ 5%", "price": { "currency": "INR", "value": "0" } },

{ "title": "CGST @ 5%", "price": { "currency": "INR", "value": "0" } },

{ "title": "Registration", "price": { "currency": "INR", "value": "0" } }

]

},

"payment": { "type": "ON-ORDER", "status": "NOT\_PAID" }

}

}

}

***⚠ The EUA must store all term objects exactly as received and resend them in /confirm with termsState changed to AGREED on every term. Do not modify any other field in the terms array.***

### 7.2.3 POST /confirm (EUA → HSPA, Direct P2P)

Confirms the booking by signalling that the patient (via the EUA) has agreed to all terms sent in /on\_init. All five term types must be present with termsState set to AGREED. On receipt of a valid /confirm, the HSPA finalises the booking and generates the 4-digit PIN for on-site Physical Consultation check-in.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | EUA (sends directly to HSPA) |
| Communication Model | Direct P2P (EUA → HSPA) |
| Stage | Booking |

**Critical Requirement: Terms Array in /confirm**

| **Field** | **Type** | **Required Value** | **Description** |
| --- | --- | --- | --- |
| terms[].type | string | As received in on\_init | Commercial, Settlement, Cancellation, Payment. |
| terms[].termsState | string | AGREED | EUA must set AGREED for every term. Any INITIATED term causes HSPA rejection. |
| terms[].reasonRequired | boolean | As received in on\_init | If true, the reason field must also be populated. |
| terms[].reason | string | Conditional | Required only if reasonRequired is true. Otherwise send an empty string. |
| terms[].timePeriod | datetime | As received in on\_init | Copy from on\_init response unchanged. |

**Sample Request - /confirm (Physical Consultation, all terms AGREED)**

{

"context": {

"domain": "nic2004:85111",

"country": "IND",

"city": "std:011",

"action": "confirm",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"provider\_id": "hspa-nha",

"provider\_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",

"transaction\_id": "a1b2c3d4-f951-11ec-b135-53aea776f66b",

"message\_id": "f6a7b8c9-3213-11ef-8788-59590da7b6ce",

"timestamp": "2026-04-15T09:15:00Z"

},

"message": {

"order": {

"id": "0415-234567-8901",

"provider": { "id": "1" },

"item": {

"id": "0",

"descriptor": { "name": "Consultation", "code": "CONSULTATION" },

"price": { "currency": "INR", "value": "500.0" },

"fulfillment\_id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef"

},

"fulfillment": {

"id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef",

"type": "Physical",

"agent": { "id": "<HPR_ADDRESS>@hpr.ndhm", "name": "Dr. <NAME>" },

"start": { "time": { "timestamp": "2026-04-16T10:00:00" } },

"end": { "time": { "timestamp": "2026-04-16T10:20:00" } }

},

"billing": {

"name": "<NAME>",

"address": { "locality": "<ADDRESS>", "state": "Delhi",

"country": "INDIA", "area\_code": "110085" },

"phone": "<MOBILE_NUMBER>", "email": "<EMAIL>"

},

"customer": { "id": "<ABHA_ADDRESS>",

"person": { "gender": "M", "dob": "<DOB>",

"dayOfBirth": "<DOB>", "monthOfBirth": "<DOB>", "yearOfBirth": "<DOB>" } },

"payment": { "type": "ON-ORDER", "status": "NOT\_PAID",

"params": { "amount": "500.0", "redirect\_url": "" } },

"quote": { "price": { "currency": "INR", "value": "500.0" },

"breakup": [

{ "title": "Consultation", "price": { "currency": "INR", "value": "500.0" } },

{ "title": "SGST @ 5%", "price": { "currency": "INR", "value": "0" } },

{ "title": "CGST @ 5%", "price": { "currency": "INR", "value": "0" } },

{ "title": "Registration", "price": { "currency": "INR", "value": "0" } }

] },

**"terms": [**

**{ "type": "Commercial", "descriptor": { "name": "Commercial Terms",**

**"short\_desc": "...", "long\_desc": "..." },**

**"reasonRequired": false, "timePeriod": "2026-12-31T23:59:59",**

**"reason": "", "termsState": "AGREED" },**

**{ "type": "Settlement", "descriptor": { "name": "Settlement Terms",**

**"short\_desc": "...", "long\_desc": "..." },**

**"reasonRequired": false, "timePeriod": "2026-12-31T23:59:59",**

**"reason": "", "termsState": "AGREED" },**

**{ "type": "Cancellation", "descriptor": { "name": "Cancellation Policy",**

**"short\_desc": "...", "long\_desc": "..." },**

**"reasonRequired": true, "timePeriod": "2026-12-31T23:59:59",**

**"reason": "Patient agreed to cancellation policy", "termsState": "AGREED" },**

**{ "type": "Refund", "descriptor": { "name": "Refund Policy",**

**"short\_desc": "...", "long\_desc": "..." },**

**"reasonRequired": false, "timePeriod": "2026-12-31T23:59:59",**

**"reason": "", "termsState": "AGREED" },**

**{ "type": "Payment", "descriptor": { "name": "Payment Terms",**

**"short\_desc": "...", "long\_desc": "..." },**

**"reasonRequired": false, "timePeriod": "2026-12-31T23:59:59",**

**"reason": "", "termsState": "AGREED" }**

]

}

}

}

***⚠ The order.id in /confirm must match the order.id returned by the HSPA in /on\_init. Do not use the order.id from the /init request if the HSPA assigned a new one.***

### 7.2.4 POST /on\_confirm (HSPA → EUA, Direct P2P Callback)

The HSPA confirms that the booking is finalised (order.state = CONFIRMED) and - for Physical Consultation only - generates a 4-digit PIN returned in the authorization object. The EUA must securely display this PIN to the patient. The patient will present this PIN at the clinic for on-site verification before the consultation begins.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | HSPA (sends directly to EUA consumer\_uri) |
| Communication Model | Direct P2P (HSPA → EUA) |
| Stage | Booking |
| **Audit Requirement** | **HSPA must also send an exact copy of this payload to /api/v1/uhi/on\_confirm\_audit at the Gateway.** |

**Key Fields in on\_confirm**

| **Field** | **Type** | **Conditional** | **Description** |
| --- | --- | --- | --- |
| order.state | string | Yes | CONFIRMED - booking is locked. FAILED - if payment or system error. |
| order.id | string | Yes | **HSPA-assigned order ID from on\_init or on\_confirm.**  **For Eg - AHS12345 (HS short for HSPA name)** |
| order.authorization.type | string | Physical only | Always PIN for Physical Consultation. |
| order.authorization.token | string | Physical only | 4-digit numeric PIN for patient check-in. |
| order.authorization.valid\_from | datetime | Physical only | PIN validity start datetime. |
| order.authorization.valid\_to | datetime | Physical only | PIN validity end datetime (typically end of appointment day). |
| order.authorization.status | string | Physical only | GENERATED on first receipt. Changes to VERIFIED after doctor verifies; HSPA\_OVERRIDE if skipped. |
| <ABHA_ADDRESS>/gov.in/slot\_id | string | Yes | Confirmed slot UUID. |

**Sample Response - /on\_confirm (Physical Consultation, CONFIRMED with PIN)**

{

"context": {

"domain": "nic2004:85111",

"country": "IND",

"city": "std:011",

"action": "on\_confirm",

"timestamp": "2026-06-18T06:52:13.969464Z",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "https: //uhieuasandbox.abdm.gov.in/api/v1/euaService",

"provider\_id": "hspa-nha",

"provider\_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",

"transaction\_id": "f1a1a6b2-ece2-46a0-8229-9e8b5610afcc",

"message\_id": "f1a1a6b2-ece2-46a0-8229-9e8b5610afcc"

},

"message": {

"order": {

"id": "3714-330853-9384",

"provider": {

"id": "1",

"descriptor": {

"name": "Test Hospital",

"flag": false,

"short\_desc": "Expertise in every field with renowned staff.",

"long\_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."

},

"categories": [

{

"id": "201",

"parent\_category\_id": "101",

"descriptor": {

"name": "Cardiology",

"code": "CARDIOLOGY",

"flag": false

}

},

{

"id": "101",

"parent\_category\_id": "",

"descriptor": {

"name": "Allopathy",

"code": "ALLOPATHY",

"flag": false

}

}

],

"location": {

"id": "1",

"descriptor": {

"name": "Test Hospital",

"flag": false,

"short\_desc": "Expertise in every field with renowned staff.",

"long\_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."

},

"city": {

"name": "Delhi",

"code": "011"

},

"country": {

"name": "INDIA",

"code": "+91"

},

"gps": "18.5246036,73.792927",

"address": "3rd, 7th & 9th Floor, Tower-L, Jeevan Bharati Building, Connaught Place, New Delhi, Delhi 110001"

}

},

"state": "CONFIRMED",

"item": {

"id": "0",

"descriptor": {

"name": "Consultation",

"code": "CONSULTATION",

"flag": false

},

"price": {

"currency": "INR",

"value": "0.0"

},

"fulfillment\_id": "79db6b5b-afe4-4297-b9b1-5148ed45372c"

},

"fulfillment": {

"id": "79db6b5b-afe4-4297-b9b1-5148ed45372c",

"type": "Physical",

"tracking": false,

"agent": {

"id": "<HPR_ADDRESS>@hpr.ndhm",

"name": "<NAME>",

"image": "8+pftJAweP4Qf516iSSsjzm76sAvHuaXBAFLgjjOfwpDnJwaoQDIP8A9bpU6SOhyCfwqvtJOeKepJzgnH6UAU93cc0gcnj+tNJXPfNOJx+FAAWPTI6UFj1x+VJkY+7n6U0MOfl5oAmDEEds0pIcbehHIb0qNW78gU4jcvGOOlADNuTzwR/n/P8A9enxs0bAhtpB4IP+f/1GgfOcbsEcZFKEOQuMjvj/AD9PypAb+iTz32p2loVllV5QHSIMzbQctgLk9Aa9K0vwBBrD3EsWpmFFnkjWJ4n3AKxHILg9u9eeeBZIbfxlYyzMVjxOhI7FoXA/U4/GvZTr58M+C11R40aa8kMkanO3fJuk5IHQDcffGMjOa468E5aI6adRqO5HJ8LdN8ooZS4zjLGXPT1WQe35Vjn4faYtxPpys8UKpGUcQTnYXLDPL4wCAefx9ao+Hvilqtz4qjtNTED29zMsIWFdoibdg",

"gender": "M",

"tags": {

"@abdm/gov.in/experience": "5.0",

"@abdm/gov.in/languages": "Eng, Hin",

"@abdm/gov.in/education": "MBBS",

"@abdm/gov.in/hpr\_id": "<HPR_ID>"

}

},

"start": {

"time": {

"timestamp": "2026-06-18T16:00:00"

}

},

"end": {

"time": {

"timestamp": "2026-06-18T16:30:00"

}

},

"tags": {

"@abdm/gov.in/slot\_id": "79db6b5b-afe4-4297-b9b1-5148ed45372c",

"@abdm/gov.in/messaging\_support": "true",

"@abdm/gov.in/deep\_link": "",

"@abdm/gov.in/helpline\_number": "",

"@abdm/gov.in/chatbot\_link": ""

}

},

"billing": {

"name": "<NAME>",

"address": {

"door": "",

"name": "<NAME>",

"locality": "<ADDRESS>",

"city": "Pune",

"state": "Maharashtra",

"country": "INDIA",

"area\_code": "411058"

},

"phone": "<MOBILE_NUMBER>",

"email": ""

},

"quote": {

"price": {

"currency": "INR",

"value": "0.0"

},

"breakup": [

{

"title": "Consultation",

"price": {

"currency": "INR",

"value": "0.0"

}

},

{

"title": "CGST @ 5%",

"price": {

"currency": "INR",

"value": "0.0"

}

},

{

"title": "SGST @ 5%",

"price": {

"currency": "INR",

"value": "0.0"

}

},

{

"title": "Registration",

"price": {

"currency": "INR",

"value": "0"

}

}

]

},

"customer": {

"person": {

"dob": "<DOB>",

"gender": "M",

"dayOfBirth": "<DOB>",

"monthOfBirth": "<DOB>",

"yearOfBirth": "<DOB>"

},

"id": "<ABHA_ADDRESS>"

},

"payment": {

"uri": "",

"type": "ON-ORDER",

"status": "FREE",

"params": {

"transaction\_id": "",

"amount": "0.0",

"mode": "",

"vpa": "",

"redirect\_url": ""

}

},

"terms": [

{

"type": "Commercial",

"descriptor": {

"name": "Commercial terms and conditions",

"flag": false,

"short\_desc": "Short description of commercial terms",

"long\_desc": "Long description of commercial terms"

},

"reasonRequired": false,

"timePeriod": "2026-06-18T16:00:00",

"reason": "",

"termsState": "AGREED"

},

{

"type": "Settlement",

"descriptor": {

"name": "Settlement terms and conditions",

"flag": false,

"short\_desc": "Short description of Settlement terms",

"long\_desc": "Long description of Settlement terms"

},

"reasonRequired": false,

"timePeriod": "2026-06-18T16:00:00",

"reason": "",

"termsState": "AGREED"

},

{

"type": "Cancellation",

"descriptor": {

"name": "Cancellation terms and conditions",

"flag": false,

"short\_desc": "Short description of Cancellation terms",

"long\_desc": "Cancellation: Full refund if cancelled 48 hrs before consultation time. \\n Rescheduling: No charges for rescheduling 48 hrs prior to consultation time"

},

"reasonRequired": false,

"timePeriod": "2026-06-18T16:00:00",

"reason": "",

"termsState": "AGREED"

},

{

"type": "Refund",

"descriptor": {

"name": "Refund terms and conditions",

"flag": false,

"short\_desc": "Short description of Refund terms",

"long\_desc": "No Show: If doctor does not show up - full refund. No refund if patient does not turn up for appointment"

},

"reasonRequired": false,

"timePeriod": "2026-06-18T16:00:00",

"reason": "",

"termsState": "AGREED"

},

{

"type": "Payment",

"descriptor": {

"name": "Payment terms and conditions",

"flag": false,

"short\_desc": "Short description of Payment terms",

"long\_desc": "Long description of Payment terms"

},

"reasonRequired": false,

"timePeriod": "2026-06-18T16:00:00",

"reason": "",

"termsState": "AGREED"

}

],

"authorization": {

"type": "PIN",

"token": "3774",

"valid\_from": "2026-06-18T00:00:00",

"valid\_to": "2026-06-18T23:59:00",

"status": "GENERATED"

}

}

}

}

***⚠ For Physical Consultation, the PIN is security-sensitive. Store it only in memory or secure session storage on the EUA. Do not persist the PIN to a database or application logs. The PIN expires at the valid\_to time - typically the end of the appointment day.***

***⚠ Kindly ensure that you are sharing the Tags for communication channels as well. Mandatorily send ‘messaging\_support’ flag and Helpline number(also, a Facility contact number) in on\_confirm.***

## 7.3 Stage 3: Fulfilment

### 7.3.1 POST /status (EUA → HSPA, Direct P2P)

Requests the current status of a confirmed order by order ID. The EUA sends this to the HSPA directly. The HSPA responds asynchronously via /on\_status with the complete order object including the current state, payment status, and authorization status. This is a pull mechanism and should be used for verification or reconciliation, not as a continuous polling loop.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | EUA (sends directly to HSPA) |
| Communication Model | Direct P2P (EUA → HSPA) |
| Stage | Fulfilment |

**Request Payload - message.order Fields**

| **Field Path** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| order.id | string | Yes | Order ID whose status is being queried. Obtained from on\_init or on\_confirm.  **HSPA-assigned unique order ID. Must be generated at the time of on\_init and sent in every request afterwards.**  We recommend an Alphanumeric string.  For eg: AHS12345=> HS abbreviated for your HSPA name |

**Sample Request - /status**

{

"context": {

"domain": "nic2004:85111",

"action": "status",

"consumer\_id": "eua-nha",

"provider\_id": "hspa-nha",

"provider\_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",

"transaction\_id": "a1b2c3d4-f951-11ec-b135-53aea776f66b",

"message\_id": "b8c9d0e1-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-04-16T09:55:00Z"

},

"message": {

"order": { "id": "0415-234567-8901" }

}

}

### 7.3.2 POST /on\_status (HSPA → EUA, Direct P2P Callback)

The HSPA returns the current order state, payment status, and authorization/PIN status in response to a /status request, or proactively when triggered by an internal lifecycle event. The EUA should replace its stored order state with the full order object received in /on\_status.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | HSPA (sends directly to EUA consumer\_uri) |
| Communication Model | Direct P2P (HSPA → EUA) |
| Stage | Fulfilment |
| Audit Requirement | HSPA must also send an exact copy of this payload to /api/v1/uhi/on\_status\_audit at the Gateway. |

**Order State Values**

| **State** | **Set By** | **Description** |
| --- | --- | --- |
| CONFIRMED | HSPA (on\_confirm) | Appointment booked and confirmed. 4-digit PIN generated for Physical Consultation. |
| APPOINTMENT\_STARTED | HSPA (on\_update) | The doctor begins consultation |
| COMPLETED | HSPA (on\_update) | Consultation completed and marked by the doctor. |
| CANCELLED | HSPA or EUA (on\_update) | Appointment cancelled by either patient or doctor per cancellation terms. |
| NO\_SHOW | HSPA (on\_update) | The patient did not appear for the appointment. |
| DOCTOR\_NO\_SHOW | EUA (on\_update to HSPA) | The doctor did not appear. This is the only state the EUA is permitted to set. |
| FAILED | HSPA (on\_confirm) | Payment or system failure during confirmation. |

**Sample Response - /on\_status (Physical Consultation, CONFIRMED state)**

{

"context": {

"domain": "nic2004:85111",

"action": "on\_status",

"consumer\_id": "eua-nha",

"provider\_id": "hspa-nha",

"transaction\_id": "a1b2c3d4-f951-11ec-b135-53aea776f66b",

"message\_id": "c9d0e1f2-f951-11ec-b135-53aea776f66b"

},

"message": {

"order": {

"id": "0415-234567-8901",

"state": "CONFIRMED",

"item": { "id": "0", "descriptor": { "code": "Consultation", "name": "Consultation" } },

"fulfillment": {

"id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef",

"type": "Physical",

"agent": { "id": "<HPR_ADDRESS>@hpr.ndhm", "name": "Dr. <NAME>", "gender": "F",

"tags": { "@abdm/gov.in/education": "MBBS, MD Cardiology",

"@abdm/gov.in/experience": "8.0", "@abdm/gov.in/hpr\_id": "<HPR_ID>" } },

"start": { "time": { "timestamp": "2026-04-16T10:00:00" } },

"end": { "time": { "timestamp": "2026-04-16T10:20:00" } }

},

"payment": { "type": "ON-ORDER", "status": "NOT\_PAID",

"params": { "amount": "500.0" } },

"authorization": {

"type": "PIN", "token": "7342",

"valid\_from": "2026-04-16T00:00:00",

"valid\_to": "2026-04-16T23:59:00",

"status": "GENERATED"

}

}

}

}

### 7.3.3 POST /on\_update - HSPA Side (EUA → HSPA, Direct P2P)

The EUA calls the HSPA's /on\_update endpoint to update the order state to DOCTOR\_NO\_SHOW. This is the only order state that an EUA is permitted to push to the HSPA. All other appointment lifecycle states (APPOINTMENT\_STARTED, COMPLETED, CANCELLED, NO\_SHOW) are exclusively HSPA-initiated.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | EUA (sends directly to HSPA when doctor does not appear) |
| Communication Model | Direct P2P (EUA → HSPA) |
| Stage | Fulfilment |
| Permitted EUA State | DOCTOR\_NO\_SHOW only |

**Sample Request - /on\_update (HSPA Side - DOCTOR\_NO\_SHOW)**

{

"context": {

"domain": "nic2004:85111",

"action": "on\_update",

"consumer\_id": "eua-nha",

"provider\_id": "hspa-nha",

"provider\_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",

"transaction\_id": "a1b2c3d4-f951-11ec-b135-53aea776f66b",

"message\_id": "d0e1f2a3-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-04-16T10:35:00Z"

},

"message": {

"order": {

"id": "0415-234567-8901",

"state": "DOCTOR\_NO\_SHOW",

"item": { "id": "0", "descriptor": { "code": "Consultation", "name": "Consultation" } },

"fulfillment": {

"id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef",

"type": "Physical",

"agent": { "id": "<HPR_ADDRESS>@hpr.ndhm", "name": "Dr. <NAME>" },

"start": { "time": { "timestamp": "2026-04-16T10:00:00" } },

"end": { "time": { "timestamp": "2026-04-16T10:20:00" } }

},

"authorization": {

"type": "PIN", "token": "7342",

"valid\_from": "2026-04-16T00:00:00",

"valid\_to": "2026-04-16T23:59:00",

"status": "GENERATED"

}

}

}

}

### 7.3.4 POST /on\_update - EUA Side (HSPA → EUA, Direct P2P)

The HSPA pushes appointment lifecycle updates proactively to the EUA's /on\_update endpoint. This is the primary mechanism for real-time status updates during and after the consultation. The EUA must update its local order state accordingly and notify the patient based on the new state received.

**Order State Values**

| **State** | **Set By** | **Description** |
| --- | --- | --- |
| CONFIRMED | HSPA (on\_confirm) | Appointment booked and confirmed. 4-digit PIN generated for Physical Consultation. |
| APPOINTMENT\_STARTED | HSPA (on\_update) | The doctor begins consultation |
| COMPLETED | HSPA (on\_update) | Consultation completed and marked by the doctor. |
| CANCELLED | HSPA or EUA (on\_update) | Appointment cancelled by either patient or doctor per cancellation terms. |
| NO\_SHOW | HSPA (on\_update) | The patient did not appear for the appointment. |
| DOCTOR\_NO\_SHOW | EUA (on\_update to HSPA) | The doctor did not appear. This is the only state the EUA is permitted to set. |
| FAILED | HSPA (on\_confirm) | Payment or system failure during confirmation. |

**Pin State Values**

* **GENERATED —> When PIN is generated after confirmation of appointment**
* **VERIFIED —> PIN is verified by Provider before start of consultation**
* **HSPA\_OVERRIDE —> PIN is not verified but due to emergency HSPA overrides it and stated the consultation**

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | HSPA (sends proactively to EUA consumer\_uri when state changes) |
| Communication Model | Direct P2P (HSPA → EUA) |
| Stage | Fulfilment |

**Sample Response - /on\_update (EUA Side - APPOINTMENT\_STARTED, Physical Consultation)**

{

"context": {

"domain": "nic2004:85111",

"action": "on\_update",

"consumer\_id": "eua-nha",

"provider\_id": "hspa-nha",

"transaction\_id": "a1b2c3d4-f951-11ec-b135-53aea776f66b",

"message\_id": "e1f2a3b4-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-04-16T10:05:00Z"

},

"message": {

"order": {

"id": "0415-234567-8901",

"state": "APPOINTMENT\_STARTED",

"item": { "id": "0", "descriptor": { "code": "Consultation", "name": "Consultation" } },

"fulfillment": {

"id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef",

"type": "Physical",

"agent": { "id": "<HPR_ADDRESS>@hpr.ndhm", "name": "Dr. <NAME>", "gender": "F",

"tags": { "@abdm/gov.in/education": "MBBS, MD Cardiology",

"@abdm/gov.in/experience": "8.0", "@abdm/gov.in/hpr\_id": "<HPR_ID>" } },

"start": { "time": { "timestamp": "2026-04-16T10:00:00" } },

"end": { "time": { "timestamp": "2026-04-16T10:20:00" } }

},

"payment": { "type": "ON-ORDER", "status": "NOT\_PAID",

"params": { "amount": "500.0" } },

"authorization": {

"type": "PIN", "token": "7342",

"valid\_from": "2026-04-16T00:00:00",

"valid\_to": "2026-04-16T23:59:00",

"status": "VERIFIED"

}

}

}

}

## 7.4 Stage 4: Post-Fulfilment

### 7.4.1 POST /cancel (EUA → HSPA, Direct P2P)

Sends a cancellation request from the EUA (on behalf of the patient) to the HSPA. The HSPA processes the cancellation in accordance with the previously agreed cancellation terms and responds via /on\_cancel. The ‘@abdm/gov.in/cancelledby’ tag is mandatory and determines whether the patient's or doctor's cancellation terms apply.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | EUA (sends directly to HSPA on patient-initiated cancellation) |
| Communication Model | Direct P2P (EUA → HSPA) |
| Stage | Post-Fulfilment |

**Request Payload - message.order Fields**

| **Field Path** | **Type** | **Required** | **Description / Permissible Values** |
| --- | --- | --- | --- |
| order.id | string | Yes | Order ID to cancel. Same Order ID created and shared from on\_init or on\_confirm |
| order.state | string | Yes | Always CANCELLED. |
| <ABHA_ADDRESS>/gov.in/cancelledby | string | Yes | Who cancelled. Enum: patient, doctor. |

**Sample Request - /cancel (Patient Cancelling, Physical Consultation)**

{

"context": {

"domain": "nic2004:85111",

"action": "cancel",

"consumer\_id": "eua-nha",

"provider\_id": "hspa-nha",

"provider\_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",

"transaction\_id": "a1b2c3d4-f951-11ec-b135-53aea776f66b",

"message\_id": "f2a3b4c5-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-04-15T20:00:00Z"

},

"message": {

"order": {

"id": "0415-234567-8901",

"state": "CANCELLED",

"fulfillment": {

"tags": { "@abdm/gov.in/cancelledby": "patient" }

}

}

}

}

***⚠ The @abdm/gov.in/cancelledby tag is mandatory. Without it, the HSPA cannot determine whether patient or doctor cancellation terms apply,***

### 7.4.2 POST /on\_cancel (HSPA → EUA, Direct P2P Callback)

The HSPA acknowledges the cancellation and returns the full order object with order.state = CANCELLED and updated payment status. The EUA's /on\_cancel endpoint must handle both EUA-initiated and HSPA-initiated cancellations (e.g. when a doctor cancels). Use the @abdm/gov.in/cancelledby tag to determine the cancellation source.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | HSPA (sends to EUA consumer\_uri on cancellation acknowledgement or HSPA-initiated cancel) |
| Communication Model | Direct P2P (HSPA → EUA) |
| Stage | Post-Fulfilment |
| Audit Requirement | HSPA must also send an exact copy to /api/v1/uhi/on\_cancel\_audit at the Gateway. |

**Sample Response - /on\_cancel (Patient Cancellation, Physical Consultation)**

{

"context": {

"domain": "nic2004:85111",

"action": "on\_cancel",

"consumer\_id": "eua-nha",

"provider\_id": "hspa-nha",

"transaction\_id": "a1b2c3d4-f951-11ec-b135-53aea776f66b",

"message\_id": "a3b4c5d6-f951-11ec-b135-53aea776f66b"

},

"message": {

"order": {

"id": "0415-234567-8901",

"state": "CANCELLED",

"item": { "id": "0", "descriptor": { "code": "Consultation", "name": "Consultation" } },

"fulfillment": {

"id": "slot-uuid-a1b2c3d4-abcd-1234-efgh-567890abcdef",

"type": "Physical",

"agent": { "id": "<HPR_ADDRESS>@hpr.ndhm", "name": "Dr. <NAME>" },

"start": { "time": { "timestamp": "2026-04-16T10:00:00" } },

"end": { "time": { "timestamp": "2026-04-16T10:20:00" } },

"tags": { "@abdm/gov.in/cancelledby": "patient" }

},

"payment": { "type": "ON-ORDER", "status": "NOT\_PAID",

"params": { "amount": "500.0" } },

"authorization": {

"type": "PIN", "token": "7342",

"valid\_from": "2026-04-16T00:00:00",

"valid\_to": "2026-04-16T23:59:00",

"status": "GENERATED"

},

"provider": { "id": "1" }

}

}

}

### 7.4.3 POST /on\_message - HSPA Side (EUA → HSPA, Direct P2P) <Optional>

Enables interoperable in-app messaging between the patient (via EUA) and the healthcare provider (via HSPA). The EUA sends a text or media message - such as a pre-consultation query or prescription file - to the HSPA's /on\_message endpoint. Both parties consume the same /on\_message API endpoint structure.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | EUA (sends directly to HSPA) |
| Communication Model | Direct P2P (EUA → HSPA) |
| Stage | Post-Fulfilment |

**Request Payload - message.intent.chat Fields**

| **Field Path** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| message.intent.chat.sender.person.id | string | Yes | ABHA ID of the message sender (patient). |
| message.intent.chat.sender.person.name | string | Yes | Full name of the sender. |
| message.intent.chat.sender.person.gender | string | No | M or F. |
| message.intent.chat.receiver.person.id | string | Yes | HPR ID of the receiver (doctor). |
| message.intent.chat.receiver.person.name | string | Yes | Full name of the receiver. |
| message.intent.chat.content.content\_id | string | Yes | Unique UUID for this message. |
| message.intent.chat.content.content\_value | string | Yes | Base64-encoded message content (text or binary file). |
| message.intent.chat.content.content\_type | string | Yes | Enum: text (text message), media (file/image/PDF). |
| message.intent.chat.content.content\_mimeType | string | Conditional | MIME type of the file when content\_type is media. e.g. pdf/application, image/jpeg. |
| message.intent.chat.content.content\_fileName | string | Conditional | File name when content\_type is media. |
| message.intent.chat.content.hiType | string | Conditional | Health Information type. e.g. prescription, labReport. |
| message.intent.chat.time.timestamp | datetime | Yes | Timestamp of the message. ISO 8601. |

**Sample Request - /on\_message (EUA to HSPA, text message)**

{

"context": {

"domain": "nic2004:85111",

"action": "on\_message",

"consumer\_id": "eua-nha",

"provider\_id": "hspa-nha",

"provider\_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",

"transaction\_id": "a1b2c3d4-f951-11ec-b135-53aea776f66b",

"message\_id": "b4c5d6e7-42e0-11ed-b5d7-51ae9d37b46f",

"timestamp": "2026-04-16T09:45:00Z"

},

"message": {

"intent": {

"chat": {

"sender": {

"person": { "id": "<ABHA_ADDRESS>", "name": "<NAME>", "gender": "M" }

},

"receiver": {

"person": { "id": "<HPR_ADDRESS>@hpr.ndhm", "name": "Dr. <NAME>", "gender": "F" }

},

"content": {

"content\_id": "b4c5d6e7-42e0-11ed-b5d7-51ae9d37b46f",

"content\_value": "SGVsbG8gRG9jdG9yLCBJIGhhdmUgYSBxdWVzdGlvbi4=",

"content\_type": "text"

},

"time": { "timestamp": "2026-04-16T09:45:00" }

}

}

}

}

### 7.4.4 POST /on\_message - EUA Side (HSPA → EUA, Direct P2P) <Mandatory>

The HSPA sends a text or media message to the EUA's /on\_message endpoint. This may include post-consultation instructions, a digital prescription, or a follow-up message from the doctor. The payload structure is identical to the HSPA-side /on\_message; the direction is reversed.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | HSPA (sends directly to EUA consumer\_uri) |
| Communication Model | Direct P2P (HSPA → EUA) |
| Stage | Post-Fulfilment |

**Sample - /on\_message (HSPA to EUA)**

{

"context": {

"domain": "nic2004:85111",

"country": "IND",

"city": "std:011",

"action": "on\_message",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"timestamp": "2022-07-05T15:24:35.481906Z",

"provider\_id": "hspa-nha",

"provider\_uri": "http://hspasbx.abdm.gov.in/api/v1",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

},

"message": {

"intent": {

"chat": {

"sender": {

"person": {

"name": "<NAME>",

"gender": "M",

"image": "image hashed base64",

"id": "<ABHA_ADDRESS>"

}

},

"receiver": {

"person": {

"name": "<NAME>",

"gender": "M",

"image": "image",

"id": "<HPR_ADDRESS>@hpr.ndhm"

}

},

"content": {

"content\_id": "e616e100-42e0-11ed-b5d7-51ae9d37b46f",

"content\_value": "Base64 Encoded text",

"content\_type": "text"

},

"time": {

"timestamp": "2022-10-03T11:32:01"

}

}

}

}

}

##

## 7.5 UHI Gateway Endpoints

### 7.5.1 POST /api/v1/uhi/search (EUA → Gateway - Gateway-Hosted Search)

This is the primary Gateway-hosted endpoint that EUAs call to initiate a broadcast search. The Gateway validates the EUA's Authorization header, authenticates the subscriber, and broadcasts the search request to all registered HSPAs for the specified domain. The payload structure is identical to the HSPA-hosted /search endpoint described in Section 7.1.1.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | EUA (sends to Gateway-hosted URL) |
| Communication Model | EUA → UHI Gateway (Gateway then broadcasts to HSPAs) |
| Sandbox URL | POST https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/search |

***⚠ The payload structure for /api/v1/uhi/search is identical to /search (Section 7.1.1). The only difference is the endpoint URL - this is the Gateway-hosted URL, whereas /search is the HSPA-hosted URL.***

### 7.5.2 POST /api/v1/uhi/on\_search (HSPA → Gateway)

HSPAs call this Gateway-hosted endpoint to deliver their /on\_search catalog responses. The Gateway validates the HSPA's signature, then forwards the response to the originating EUA's consumer\_uri. EUAs do not call this endpoint directly and do not need to implement it. The payload structure is identical to the EUA-side /on\_search described in Section 7.1.2.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | HSPA (sends catalog responses to Gateway) |
| Communication Model | HSPA → UHI Gateway → EUA consumer\_uri |
| Sandbox URL | POST https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/on\_search |

### 7.5.3 Audit Endpoints

The following endpoints are audit and logging hooks hosted by the UHI Gateway. HSPAs must send exact copies of the specified lifecycle event payloads to these endpoints for compliance, audit trail, and debugging purposes. EUAs do not call these endpoints directly.

| **Endpoint** | **Called By** | **Purpose** |
| --- | --- | --- |
| POST /api/v1/uhi/on\_confirm\_audit | HSPA | HSPA sends an exact copy of every /on\_confirm payload to the Gateway for audit logging. |
| POST /api/v1/uhi/on\_update\_audi | HSPA | HSPA sends an exact copy of every /on\_update payload to the Gateway for audit logging. |
| POST /api/v1/uhi/on\_cancel\_audit | HSPA | HSPA sends an exact copy of every /on\_cancel payload to the Gateway for audit logging. |
| POST /api/v1/uhi/on\_status\_audit | HSPA | HSPA sends an exact copy of every /on\_status payload to the Gateway for audit logging. |

### 7.5.4 POST /api/v1/networkregistry/lookup

Allows any network participant (EUA, HSPA, or Gateway) to look up the registered public key and subscriber details of another participant by subscriber\_id. This is used internally by the Gateway to verify Authorization headers on every incoming API call, and can also be called directly by EUAs or HSPAs to verify the identity of a counterparty before processing a request.

**Call Direction**

| **Parameter** | **Detail** |
| --- | --- |
| Who Calls This Endpoint | EUA or HSPA (to verify counterparty identity) |
| Communication Model | Direct call to Gateway |
| Sandbox URL | POST https://uhigatewaysandbox.abdm.gov.in/api/v1/networkregistry/lookup |

**Request Payload Fields**

| **Field** | **Type** | **Required** | **Description / Permissible Values** |
| --- | --- | --- | --- |
| subscriber\_id | string | Yes | Registered domain name of the subscriber (e.g. nha.eua). |
| type | string | Yes | Subscriber type. Enum: EUA, HSPA, gateway. |
| domain | string | Yes | UHI service domain code. e.g. nic2004:85111 for Physical Consultation. |
| country | string | Yes | ISO 3166-1 country code. Always IND. |
| city | string | Yes | STD code of the city e.g. std:08752. |
| pub\_key\_id | string | Yes | Unique identifier for the subscriber's public key (e.g. nha.eua.k1). |

**Sample Request - /api/v1/networkregistry/lookup**

{

"subscriber\_id": "nha.eua",

"type": "EUA",

"domain": "nic2004:85111",

"country": "IND",

"city": "std:08752",

"pub\_key\_id": "nha.eua.k1"

}

## 7.6 Complete Order Payload Field Reference

This section provides a single consolidated table of all order fields used across init, on\_init, confirm, on\_confirm, status, on\_status, cancel, on\_cancel, and on\_update. Use this as the master reference when building or validating payloads.

| **Field Path** | **Type** | **Mandatory** | **Permissible Values / Description** | **Example** |
| --- | --- | --- | --- | --- |
| **order.id** | **string** | **No (search/init); Yes (confirm+)** | **Unique order identifier. Assigned by HSPA in on\_confirm** | **AHS12345 (HS short for HSPA name)** |
| order.state | string | Conditional | Current state of the order. Enum: CONFIRMED, APPOINTMENT\_STARTED, COMPLETED, CANCELLED, NO\_SHOW, DOCTOR\_NO\_SHOW, FAILED | CONFIRMED |
| order.provider.id | string | Yes | Provider ID matching HSPA catalog entry | 1 |
| order.item.id | string | Yes | Item ID from on\_search catalog | 0 |
| order.item.descriptor.code | string | Yes | Service descriptor code. Always Consultation for consultation services | Consultation |
| order.item.descriptor.name | string | Yes | Human-readable item name. Always Consultation | Consultation |
| order.item.price.currency | string | No | ISO 4217 currency code | INR |
| order.item.price.value | string | No | Consultation fee as a decimal string | 400.0 |
| order.item.fulfillment\_id | string | Yes | Links item to its fulfillment slot UUID | b265...d48c |
| order.fulfillment.id | string | Yes | UUID of the fulfillment/slot | b265...d48c |
| order.fulfillment.type | string | Yes | Physical for in-person; Online for teleconsultation | Physical |
| order.fulfillment.agent.id | string | Yes | Doctor's HPR ID in format <HPR_ADDRESS>@hpr.ndhm | <HPR_ADDRESS>@hpr.ndhm |
| order.fulfillment.agent.name | string | Yes | Doctor's full registered name | <NAME> |
| order.fulfillment.agent.gender | string | No | M or F | M |
| order.fulfillment.agent.tags | object | No | Key-value metadata for agent. Keys: @abdm/gov.in/education, @abdm/gov.in/experience, @abdm/gov.in/languages, @abdm/gov.in/hpr\_id, @abdm/gov.in/hfr\_id, @abdm/gov.in/hip\_id | See examples |
| order.fulfillment.start.time.timestamp | datetime | Yes | Appointment slot start time (ISO 8601) | 2025-01-24T09:40:00 |
| order.fulfillment.end.time.timestamp | datetime | Yes | Appointment slot end time (ISO 8601) | 2025-01-24T10:00:00 |
| order.fulfillment.tags | object | Conditional | Slot metadata. @abdm/gov.in/slot\_id is mandatory. @abdm/gov.in/teleconsultation/uri required for Online type | See examples |
| order.billing.name | string | Yes | Patient's billing name | <NAME> |
| order.billing.address | object | Yes | Patient's full address object including locality, state, country, area\_code | See examples |
| order.billing.phone | string | Yes | Patient's contact number (10 digits) | <MOBILE_NUMBER> |
| order.billing.email | string | No | Patient's email address | - |
| order.customer.id | string | Yes | Patient's ABHA ID | <ABHA_ADDRESS> |
| order.customer.person.gender | string | No | M or F | M |
| order.customer.person.dob | string | No | Date of birth in YYYY-MM-DD format | 2000-02-11 |
| order.payment.type | string | Yes | Payment timing. Enum: ON-ORDER (pay after), PRE-FULFILLMENT (pay before), ON-FULFILLMENT | ON-ORDER |
| order.payment.status | string | Yes | Payment status. Enum: PAID, NOT-PAID, FREE, PENDING, FAILED | FREE |
| order.payment.params.amount | string | Conditional | Payment amount as string. Required if not FREE | 400.0 |
| order.payment.params.redirect\_url | string | No | URL for payment redirect callback | https://... |
| order.quote.price.value | string | Conditional | Total order price | 400.0 |
| order.quote.breakup | array | No | Array of price line items (Consultation, CGST, SGST, Registration) | See examples |
| order.terms | array | Conditional | Terms array sent by HSPA in on\_init, accepted by EUA in confirm. Types: Commercial, Settlement, Cancellation, Payment | See examples |
| order.terms[].termsState | string | Yes (in confirm) | State of each term. Enum: INITIATED (HSPA sets), AGREED (EUA must set in confirm) | AGREED |
| order.authorization.type | string | Conditional (Physical only) | Authorization method. Always PIN for Physical Consultation | PIN |
| order.authorization.token | string | Conditional (Physical only) | 4-digit numeric PIN for patient check-in at facility | 3578 |
| order.authorization.valid\_from | datetime | Conditional (Physical only) | PIN validity start time | 2025-01-24T00:00:00 |
| order.authorization.valid\_to | datetime | Conditional (Physical only) | PIN validity end time | 2025-01-24T23:59:00 |
| order.authorization.status | string | Conditional (Physical only) | PIN status. Enum: GENERATED, VERIFIED, NOT\_VERIFIED, HSPA\_OVERRIDE | GENERATED |

# 8. Cancellation & Override Reason Reference

Note: Please note that the cancellation ‘Reason Codes’ have to be followed as is, EUA or HSPA can define the ‘Labels’ as they prefer.

## 8.1 Patient-initiated cancellations

| **👤 Patient-Initiated Cancellation (EUA → HSPA via POST /cancel)**  Initiated by the patient through the EUA.  **The @abdm/gov.in/cancelledby tag must be set to 'patient' in the /cancel payload sent to the HSPA.** |
| --- |

| **#** | **Reason Code** | **Label** | **Description** |
| --- | --- | --- | --- |
| P1 | **PATIENT\_PERSONAL\_EMERGENCY** | *Personal / Family Emergency* | Patient or an immediate family member has had an unexpected emergency, unable to show up. |
| P2 | **PATIENT\_HEALTH\_IMPROVED** | *Condition Resolved / No Longer Required* | Patient's medical condition has resolved or improved and the consultation is no longer needed. |
| P3 | **PATIENT\_UNABLE\_TO\_VISIT\_PHYSICALLY** | *Scheduling Conflict / Other Commitment / Physically unable to visit* | Patient has an unavoidable conflict or any inability to visit the facility. |
| P4 | **DOCTOR\_ASKED\_TO\_CANCEL** | *Doctor Requested Cancellation* | Patient was asked by the Doctor to cancel the booking. |
| P5 | **PATIENT\_BOOKED\_IN\_ERROR** | *Booked by Mistake / Wrong Appointment* | Patient booked the wrong doctor, wrong speciality, wrong date/time, etc. |
| P6 | **PATIENT\_SEEKING\_ALTERNATIVE** | *Seeking Alternative Doctor / Provider* | Patient has decided to consult a different doctor, no longer requiring this appointment. |
| P7 | **PATIENT\_OTHER** | *Other* | Any other reason not covered above. **The EUA must capture a mandatory free-text entry of the reason in this case.** |

## 8.2 Doctor / facility-initiated cancellations

| **🏥 Doctor-Initiated Cancellation (HSPA → EUA via POST /on\_cancel)**  Initiated by the HSPA on behalf of the doctor or facility.  **The @abdm/gov.in/cancelledby tag must be set to 'doctor' in the /on\_cancel payload.** |
| --- |

| **#** | **Reason Code/** | **Label** | **Description** |
| --- | --- | --- | --- |
| D1 | **DOCTOR\_PERSONAL\_EMERGENCY** | *Doctor Personal Emergency* | Doctor has an unplanned personal or medical emergency, leave |
| D2 | **DOCTOR\_UNAVAILABLE** | *Doctor Unavailable / Patient medical emergency* | Doctor is unavailable due to unexpected surgery, time-sensitive appointment, patient medical emergency, or high patient footfall. |
| D3 | **DOCTOR\_SCHEDULE\_CHANGE** | *Schedule / Slot Change* | Clinic or provider has changed the doctor's scheduled session timings |
| D4 | **FACILITY\_CLOSURE** | *Facility / Clinic Closure* | The healthcare facility is temporarily closed due to a holiday, infra failure, etc. |
| D5 | **TECHNICAL\_SYSTEM\_ISSUE** | *Technical / System Issue* | The HSPA platform has experienced technical failure, downtime, etc. |
| D6 | **DOCTOR\_OTHER** | *Other (Doctor-Initiated)* | Any other reason not covered above. **The HSPA must provide a mandatory free-text explanation.** |

## 8.3 HSPA PIN override scenarios

| **🔓 HSPA Override Reasons (Triggered at Facility : PIN Verification Bypassed)**  Used by clinic/HSPA staff when a confirmed appointment cannot proceed through normal PIN-based check-in. |
| --- |

| **#** | **Reason Code** | **Label** | **Scenario / When to Use** |
| --- | --- | --- | --- |
| O1 | **OVERRIDE\_EMERGENCY\_CONSULTATION** | *Medical Emergency at Facility* | Patients arrive in acute distress or an emergency. |
| O2 | **OVERRIDE\_PIN\_TECH\_FAILURE** | *PIN Verification Technical Failure* | The patient's EUA app cannot display the PIN due to a technical failure (app crash, network outage, device battery dead). The patient is physically present and identity has been verified by alternate means (ABHA card, Aadhar, clinic records). |
| O3 | **OVERRIDE\_PIN\_DELIVERY\_FAILURE** | *PIN Not Received by Patient* | The patient did not receive the 4-digit PIN in the on\_confirm response due to a delivery failure in the EUA (notification blocked, SMS failed, on\_confirm delay). The patient is physically present with a booking reference. |
| O4 | **OVERRIDE\_VULNERABLE\_PATIENT** | *Vulnerable / Elderly / Differently-Abled Patient* | The patient is elderly, differently-abled, or from a low-digital-literacy cohort and is unable to operate the EUA to retrieve the PIN. |
| O5 | **OVERRIDE\_EUA\_OUTAGE** | *EUA Platform Outage / System Down* | The EUA platform itself is down or unreachable, and the patient cannot access any UHI-related PIN or booking confirmation. |
| O6 | **OVERRIDE\_MISMATCH** | *Pin mismatch* | HSPA unable to validate a PIN shown by the EUA i.e. shared by the Patient, despite 3 attempts. |
| O6 | **OVERRIDE\_OTHER** | *Other* | Any other reason not covered above. **The HSPA must provide a mandatory free-text explanation.** |

# 9. Terms & Conditions

The /on\_init API response must include a terms[] array with five term types. Each term carries the text the patient reads before confirming. The sample clauses below are starting points. Replace placeholders in [brackets] with your actual values.

A few pointers to keep in mind:

* Keep the language plain and patient-friendly throughout.
* You're welcome to add more detail to any clause, but everything currently present must be retained as-is in substance.
* Content highlighted in **red** is mandatory and must be included, only the exact phrasing is left to your discretion as the integrator.
* Any value shown in [brackets] is a placeholder. Replace it with the actual value relevant to your business or that specific booking.

***T&C Example for Reference:***

**Commercial Terms**

**UHI is solely a technology gateway that relays requests between Patient-facing applications and Provider-facing Applications nor does it control or supervise any healthcare provider or assume any liability for the availability, quality, safety, timeliness, or outcome of services rendered by the healthcare provider. Further, it does not collect, hold, or route any payment from you at any stage.**

Any payment obligation, billing arrangement, refund, cancellation charge, pricing dispute, or financial claim shall be solely between the patient and the healthcare service provider/facility. UHI and Aarogya Setu shall have no liability in relation to such matters.

The consultation is with <Dr. John Doe, MBBS, MD (General Medicine) (HPR ID: HPR-1234567890) at Ref HSPA Clinic>.

In case the particular doctor is unavailable due to an emergency, the facility could offer a substitution or reschedule to you.

<25 June 2026, 10:00 AM - 10:15 AM (15 min).>

Please expect a waiting time of up to an additional 30 minutes from your booked slot as a standard buffer.

In the rare event of a doctor's emergency causing a delay beyond this, you may choose to continue waiting, accept a substitute doctor, or reschedule your appointment.

**Cancellation Terms**

Any rescheduling, cancellation, refund, or compensation arising from cancellation, delay, non-availability of the doctor, or non-provision of services shall be governed by the policies/terms and conditions of the healthcare service provider/facility. UHI and Aarogya Setu shall not be liable for such events.

Recommend cancelling the booking 4 hours before the appointment start time.

The Facility shall endeavour to notify the patient at least 2 hours in advance before appointment start time with a reason.

**Payment Terms**

Payment is at the facility on the day of visit.

Patients will pay at the Facility with the available modes of Payments.

The consultation fee displayed is provided by the healthcare facility. UHI and Aarogya Setu do not determine, collect, process, verify, hold, settle, or refund any payment related to the appointment.

<Total payable: Rs. 500 (GST included). >

This is the final amount and it will not change at the desk.

Any change in the amount charged by the healthcare facility shall be the sole responsibility of the facility. UHI and Aarogya Setu shall not be liable for any such change or related payment disputes.

# 10. Contact & Support

For onboarding queries, technical support, or to express interest in integration, reach out to your NHA point of contact or reply to the onboarding communication you received from NHA.

| **Level** | **Issue Type** | **Contact** |
| --- | --- | --- |
| L1 : Technical Integration | API errors, signing issues, sandbox access, endpoint configuration | 1. <NAME> - <EMAIL> 2. <NAME> - <EMAIL> 3. <NAME> - <EMAIL> |
| L2 : Onboarding & Compliance | Onboarding form, milestone verification, compliance queries |

# Appendix A : Consolidated Onboarding Checklist

Use this checklist to track your integration readiness before requesting NHA sign-off for production go-live.

| **#** | **Checklist Item** | **Status** |
| --- | --- | --- |
| 1 | ABDM M2 milestone with HIECM completed | ☐ |
| 2 | Ed25519 key pair generated using NHA Header Generation utility; public key submitted to NHA | ☐ |
| 3 | Sandbox Onboarding Form completed | ☐ |
| 4 | Sandbox access received and environment configured | ☐ |
| 5 | HTTPS consumer\_uri (callback URL) live and accessible | ☐ |
| 6 | P2P EUA endpoints (/on\_init, /on\_confirm, /on\_status, /on\_update) exposed and tested | ☐ |
| 7 | UHI request signing implemented (Ed25519 + BLAKE-512) | ☐ |
| 8 | Discovery flow tested: search → on\_search for all filter types (doctor name, GPS, city, pincode) | ☐ |
| 9 | Booking flow tested: init → on\_init → confirm → on\_confirm (P2P) | ☐ |
| 10 | PIN received in on\_confirm and displayed to user correctly | ☐ |
| 11 | Status flow tested: status → on\_status | ☐ |
| 12 | Appointment state updates tested: on\_update for APPOINTMENT\_STARTED, COMPLETED, CANCELLED | ☐ |
| 13 | DOCTOR\_NO\_SHOW state update from EUA tested | ☐ |
| 14 | Edge cases tested: empty on\_search, slot unavailable, cancellation terms handling, etc. | ☐ |
| 15 | Terms displayed to user before confirm; only confirmed with AGREED state | ☐ |
| 16 | Caching policy implemented (TTL compliance; parallel live search; max 48 hrs) | ☐ |
| 17 | All Test cases passed in sandbox (To be updated) | ☐ |
| 18 | NHA sign-off requested with sandbox test evidence | ☐ |
| 19 | Production consumer\_uri and P2P endpoints updated for go-live | ☐ |
| 20 | Integration promoted to production UHI network | ☐ |

# Appendix B : Reference Links & External Documentation

| **Open House** | |
| --- | --- |
| **UHI Consultation Open House - Deck** | <https://docs.google.com/presentation/d/1OxJl549Uj0PXUYnBBRio1GFdCXV3kbCou2RF7RVUSVU/edit?slide=id.g33aca05ab0f_2_245#slide=id.g33aca05ab0f_2_245> |
| **UHI Consultation Open House - Recording** | <https://drive.google.com/file/d/1UUlzc0BBCE8XpE4du_XqwAHFDy2PqBtY/view?usp=drive_link> |
| **Weekly Integration Support Calls** | |
| **Recording #1 -**  **1. Header Generation** | <https://drive.google.com/file/d/1ry-99Z-JHdSsQSlTLLOT-1no20xSKJyS/view?usp=drive_link> |
| **Recording #2 -**  **1. Walkthrough - /search, /on\_search**  **2. Troubleshooting** | <https://drive.google.com/file/d/1ybzdV613Q0GKyIzp_miVYeboUfGpkaeH/view?usp=sharing>  <https://drive.google.com/file/d/1VpvnBhyT4HLpfrqM_313dUZIJW7m23Ve/view?usp=drive_link> |
| **Recording #3 -**  **1. Walkthrough - remaining (except /on\_update)**  **2. Troubleshooting** | <https://drive.google.com/file/d/11j8epogj6SM7ue4xF6YWMKfvtBChVrgN/view?usp=sharing> |
| **Recording #4 -**  **1.Walkthrough - /on\_update, onboarding documentation** | <https://docs.google.com/videos/d/1EgPge5Wd0YtUPaw2OEDsRPvKQQeD3tB5yUJ1cGnckI8/edit?usp=sharing> |
| **Technical Resources** | |
| **Header Generation Utility** | <https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility> |
| **Swagger Spec** | <https://uhigatewaysandbox.abdm.gov.in/swagger-ui/index.html?urls.primaryName=v2.0.2#/> |
| **Specialities List** | <https://docs.google.com/spreadsheets/d/1rZjccmEqNO_C67Ejj6HIZa0BtCn6sw6Axmu77jf69wE/edit?gid=1404579389#gid=1404579389> |
| **EUA apk (updated)** | <https://drive.google.com/file/d/1mx8C4GMBq4bq2wBYZ-Yb8FlwRGW869ev/view?usp=drive_link> |
| **HSPA apk (updated)** | <https://drive.google.com/file/d/1KX8s1PYD5lnNdz1QIGFrYg626_CNwWnn/view?usp=drive_link> |
| **Ext Header Generation Utility** | <https://github.com/NHA-ABDM/UHI/tree/main/src/gateway/Discovery/src/main/java/in/gov/abdm/uhi/discovery> |
| **Reading Material** | |
| **Onboarding Documentation v1.0** | <https://docs.google.com/document/d/14cG_6vSNJGFDb_jIyogCNhEZbSVVI-D4/edit> |
| **UHI Pilot Kick off** | <https://abdm.gov.in/strapicms/uploads/UHI_Physical_Consultation_Pilot_Kickoff_2efb557cde.pdf> |
| **Integrator Universe Doc** | <https://abdm.gov.in/strapicms/uploads/API_Payloads_1751a50d03.pdf> |
| **UHI API Integrator Guide** | <https://drive.google.com/file/d/1XCDPjKNDrPWklp8GsEL9jSIJXs3wmpDl/view> |
| **Functional SOP** | <https://abdm.gov.in/strapicms/uploads/Functional_SOP_6391437214.pdf> |
| **User Journeys** | <https://abdm.gov.in/strapicms/uploads/User_Story_967618ef1d.pdf> |
| **API Sequence Doc** | <https://abdm.gov.in/strapicms/uploads/API_Sequencing_aa260b889e.pdf> |
| **Sandbox Integration Form** | <https://sandbox.abdm.gov.in/sandbox/v3/sandbox-registration> |
| **Physical Consultation Endpoints** | <https://docs.google.com/document/d/1eks9eCU9hfooY46pwNLo9tr38ROu2Kiv/edit?usp=drive_link&ouid=109639221039786746241&rtpof=true&sd=true> |
| **API Documentation** | <https://docs.google.com/document/d/1eks9eCU9hfooY46pwNLo9tr38ROu2Kiv/edit?usp=drive_link&ouid=109639221039786746241&rtpof=true&sd=true> |
| **Technical Resources** | |
|  |  |
