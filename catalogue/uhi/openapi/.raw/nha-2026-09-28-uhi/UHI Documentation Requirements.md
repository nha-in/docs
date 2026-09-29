**UHI Services: Developer Guide**

Unified Health Interface (UHI), Ayushman Bharat Digital Mission

As of 22 September 2026

**Contents**

[Part 1: About UHI 3](#__RefHeading___Toc3677_4270125281)

[1.1 Getting started 3](#__RefHeading___Toc3679_4270125281)

[How UHI works 3](#__RefHeading___Toc3681_4270125281)

[What UHI offers 3](#__RefHeading___Toc3683_4270125281)

[Before you start 4](#__RefHeading___Toc3685_4270125281)

[From sandbox to production 4](#__RefHeading___Toc3687_4270125281)

[1.2 Gateway overview 4](#__RefHeading___Toc3689_4270125281)

[1.3 Quick start: find a PM-JAY hospital near you 6](#__RefHeading___Toc3691_4270125281)

[1.4 Demo videos 8](#__RefHeading___Toc3693_4270125281)

[Part 2: Services 9](#__RefHeading___Toc3695_4270125281)

[2.1 Physical Consultation 9](#__RefHeading___Toc3697_4270125281)

[1. Overview 9](#__RefHeading___Toc3699_4270125281)

[2. In short (TL;DR) 9](#__RefHeading___Toc3701_4270125281)

[3. Workflows 10](#__RefHeading___Toc3703_4270125281)

[4. Concepts explored 11](#__RefHeading___Toc3705_4270125281)

[5. User journeys 12](#__RefHeading___Toc3707_4270125281)

[2.2 PM-JAY HEM Hospital Discovery 13](#__RefHeading___Toc3709_4270125281)

[1. Overview 13](#__RefHeading___Toc3711_4270125281)

[2. In short (TL;DR) 13](#__RefHeading___Toc3713_4270125281)

[3. Workflows 14](#__RefHeading___Toc3715_4270125281)

[4. Concepts explored 14](#__RefHeading___Toc3717_4270125281)

[5. User journeys 15](#__RefHeading___Toc3719_4270125281)

[2.3 Blood Bank Discovery 15](#__RefHeading___Toc3721_4270125281)

[1. Overview 15](#__RefHeading___Toc3723_4270125281)

[2. In short (TL;DR) 16](#__RefHeading___Toc3725_4270125281)

[3. Workflows 16](#__RefHeading___Toc3727_4270125281)

[4. Concepts explored 17](#__RefHeading___Toc3729_4270125281)

[5. User journeys 17](#__RefHeading___Toc3731_4270125281)

[2.4 Ambulance Booking 18](#__RefHeading___Toc3733_4270125281)

[1. Overview 18](#__RefHeading___Toc3735_4270125281)

[2. In short (TL;DR) 18](#__RefHeading___Toc3737_4270125281)

[3. Workflows 18](#__RefHeading___Toc3739_4270125281)

[4. Concepts explored 19](#__RefHeading___Toc3741_4270125281)

[5. User journeys 20](#__RefHeading___Toc3743_4270125281)

[2.5 Jan Aushadhi 20](#__RefHeading___Toc3745_4270125281)

[1. Overview 20](#__RefHeading___Toc3747_4270125281)

[2. In short (TL;DR) 21](#__RefHeading___Toc3749_4270125281)

[3. Workflows 21](#__RefHeading___Toc3751_4270125281)

[4. Concepts explored 22](#__RefHeading___Toc3753_4270125281)

[5. User journeys 22](#__RefHeading___Toc3755_4270125281)

[2.6 NOTTO Hospital Discovery 23](#__RefHeading___Toc3757_4270125281)

[1. Overview 23](#__RefHeading___Toc3759_4270125281)

[2. In short (TL;DR) 23](#__RefHeading___Toc3761_4270125281)

[3. Workflows 23](#__RefHeading___Toc3763_4270125281)

[4. Concepts explored 25](#__RefHeading___Toc3765_4270125281)

[5. User journeys 25](#__RefHeading___Toc3767_4270125281)

[Part 3: API specifications (YAML) 26](#__RefHeading___Toc3769_4270125281)

[3.1 Physical Consultation 26](#__RefHeading___Toc3771_4270125281)

[3.2 Discovery-only services 27](#__RefHeading___Toc3773_4270125281)

[3.3 Ambulance Booking 27](#__RefHeading___Toc3775_4270125281)

[Open points 29](#__RefHeading___Toc3777_4270125281)

# Part 1: About UHI

What UHI is, how the Gateway works, and a first end-to-end call. Read this part once before any service section.

## 1.1 Getting started

The Unified Health Interface (UHI) is an open network under the Ayushman Bharat Digital Mission (ABDM). Any compliant patient app can discover, and for some services book, health services from any compliant provider platform, through one integration. NHA operates the network; six services are live on it today.

### How UHI works

Every UHI service is an asynchronous exchange between three parties. Your app sends a request, gets an immediate ACK, and receives the real answer later as a callback.

| **Participant** | **Who runs it** | **What it does** |
| --- | --- | --- |
| EUA (End User Application) | PHR and consumer apps, such as Aarogya Setu or the ABHA app | Takes the patient's query, sends search (and later booking calls), receives callbacks on its consumer\_uri, and renders results |
| UHI Gateway | National Health Authority (NHA) | Validates and signs requests, routes search to the right HSPA, and relays on\_search back to the EUA |
| HSPA (Health Service Provider Application) | The service owner, such as a hospital network, NOTTO, PMBI or an ambulance aggregator | Queries its own registry and returns a signed catalog in on\_search, plus booking callbacks where the service supports them |

### What UHI offers

| **Service** | **Your role** | **Who runs the HSPA** | **Scope today** | **context.domain** |
| --- | --- | --- | --- | --- |
| Physical Consultation | EUA or HSPA | Any registered provider platform | Discovery, booking, check-in, cancellation | nic2004:85111 |
| PM-JAY HEM Hospital Discovery | EUA | NHA | Discovery | nic2004:85112 |
| Blood Bank Discovery | EUA or HSPA | e-RaktKosh, plus any approved blood bank system | Discovery | nic2008:86906 |
| Ambulance Booking | EUA or HSPA | Any registered ambulance platform | Discovery and quote (Phase 1) | nic2008:86909 |
| Jan Aushadhi | EUA | PMBI | Kendra and medicine discovery | nic2008:47721 |
| NOTTO Hospital Discovery | EUA | NOTTO | Discovery | nic2004:86100 |

If you are building a patient-facing app, you are an **EUA**. If you run a provider system that answers searches, you are an **HSPA**. For PM-JAY HEM, Jan Aushadhi and NOTTO, the HSPA is already built; you only build the EUA side.

### Before you start

* **ABDM Milestone 2 (M2) under HIECM.** A hard prerequisite for EUAs. Apps that have not completed M2 cannot be onboarded onto any UHI service.
* **A public HTTPS callback URL.** Results never come back on the request; they arrive later on this URL (consumer\_uri for EUAs, provider\_uri for HSPAs).
* **An Ed25519 key pair.** Generated with NHA's Header Generation Toolkit. You share only the public key with NHA.
* **Async handling.** Your code must accept an ACK now and the real answer later, matched by transaction\_id.

### From sandbox to production

| **Step** | **What you do** | **What you get** |
| --- | --- | --- |
| 1 | Express intent to your NHA point of contact | Onboarding kick-off |
| 2 | Generate your key pair with the [header generator utility](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility) | Public and private key |
| 3 | Submit the [sandbox registration form](https://sandbox.abdm.gov.in/sandbox/v3/sandbox-registration) with your role, callback URL and public key | Subscriber ID and sandbox access |
| 4 | Build against the sample payloads and the Gateway spec, then run the service's test cases | Passing sandbox integration |
| 5 | Record a demo and request NHA sign-off | Written sign-off |
| 6 | Switch consumer\_id / consumer\_uri (or provider\_id / provider\_uri) to production values | Live on the production network |

The fastest way to see the network work end to end is the Quick start below: one signed search to the sandbox Gateway, one callback with PM-JAY hospitals.

## 1.2 Gateway overview

The UHI Gateway is NHA's routing layer for discovery. It authenticates each search, broadcasts it to every HSPA registered for that context.domain, and relays each on\_search back to the EUA's callback. It never sees the booking calls: from init onwards, EUA and HSPA talk directly.

**Environments**

| **Environment** | **Gateway base URL** | **Reference apps** |
| --- | --- | --- |
| Sandbox | https://uhigatewaysandbox.abdm.gov.in | Reference EUA http://uhieuasandbox.abdm.gov.in/api/v1/euaService; reference HSPA https://hspasbx.abdm.gov.in/api/v1/hspa |
| Production | https://uhigateway.abdm.gov.in | Your own production endpoints |

The spec also lists https://uhigatewaybeta.abdm.gov.in. Use it only if NHA asks you to.

**Gateway endpoints**

| **Endpoint** | **Called by** | **What it does** |
| --- | --- | --- |
| POST /api/v1/uhi/search | EUA | Broadcasts your search to all HSPAs in the domain, adding the Gateway's signature |
| POST /api/v1/uhi/on\_search | HSPA | Forwards the catalog to the originating EUA's consumer\_uri |
| POST /api/v1/uhi/on\_confirm\_audit | HSPA (Physical Consultation) | Receives an exact copy of on\_confirm |
| POST /api/v1/uhi/on\_status\_audit | HSPA (Physical Consultation) | Receives an exact copy of on\_status |
| POST /api/v1/uhi/on\_update\_audit | HSPA (Physical Consultation) | Receives an exact copy of on\_update, including the care context ID for DHIS |
| POST /api/v1/uhi/on\_cancel\_audit | HSPA (Physical Consultation) | Receives an exact copy of on\_cancel |
| POST /api/v1/networkregistry/lookup | EUA or HSPA | Returns another participant's public key and details, so you can verify its signature |


Steps 1 to 7 apply to every service. The optional block applies to Physical Consultation (all calls, with audit copies) and Ambulance Booking (only init / on\_init in Phase 1).

**Signing, in one table**

| **Header** | **Sent by** | **Contents** |
| --- | --- | --- |
| Authorization | EUA and HSPA, on every outbound call | Ed25519 signature over (created) (expires) digest, with keyId = <subscriber-id>|<pub-key-id>|ed25519 |
| Digest | EUA and HSPA | BLAKE-512=<base64 hash of the exact body> |
| X-Gateway-Authorization | Gateway, on everything it forwards | Same format, keyId starting gateway-nha |

The registry lookup takes your own signed Authorization header and a body naming the participant you want (subscriber\_id, type, domain, country, city, pub\_key\_id). Changing even one byte of the body after signing breaks the digest, which shows up as a 401.

**Conventions every call follows**

* **context block.** Every call carries domain, country (IND), city (std:011), action, core\_version (0.7.1), consumer\_id, consumer\_uri, message\_id, transaction\_id and timestamp. The domain value identifies the service.
* **transaction\_id ties the exchange together.** The HSPA echoes it (and message\_id) in on\_search. A mismatch is the most common reason an EUA never sees results.
* **Signing on every call.** EUA and HSPA sign each outbound request with Ed25519 in an Authorization header. The body hash goes in a separate Digest: BLAKE-512=<base64> header. The Gateway adds its own X-Gateway-Authorization signature. The keyId format is <subscriber-id>|<key-id>|ed25519.
* **Fresh signature per request.** Signatures carry created and expires timestamps, so a reused header fails with an expired-signature or 401 error.
* **Header Generation Toolkit.** NHA's [header\_generator\_utility](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility) generates your key pair and signs each payload, so you do not implement Ed25519 and BLAKE-512 from scratch. Share only the public key with NHA.

**Reference spec.** All calls are defined in the UHI Gateway OpenAPI spec, version 2.0.2. Part 3 of this guide splits it into one YAML per service, with the calls in the order each use case makes them.

## 1.3 Quick start: find a PM-JAY hospital near you

One GPS search to the sandbox Gateway returns PM-JAY empanelled hospitals within a radius, on your callback URL. It touches every part of the network (signing, the Gateway, an HSPA and an async callback) with the smallest possible payload. PM-JAY HEM GPS search needs no state.

**You need:** sandbox registration done (subscriber ID and public key ID from NHA), your private key, and a public HTTPS URL for callbacks.

**Step 1. Stand up a callback.** Expose POST <your consumer\_uri>/on\_search. It must reply 200 with this body immediately, then store the request for you to inspect:

|  |
| --- |
| { "message": { "ack": { "status": "ACK" } }, "error": {} } |

**Step 2. Build the search.** Use fresh UUIDs and the current UTC time. Put your own IDs in consumer\_id and consumer\_uri. The coordinates below are Hyderabad; replace them with yours.

|  |
| --- |
| {  "context": {  "domain": "nic2004:85112",  "country": "IND",  "city": "std:011",  "action": "search",  "core\_version": "0.7.1",  "consumer\_id": "<your-subscriber-id>",  "consumer\_uri": "<your-https-callback-base>",  "message\_id": "<new-uuid>",  "transaction\_id": "<same-uuid>",  "timestamp": "<now, ISO 8601 UTC>"  },  "message": {  "intent": {  "fulfillment": {  "type": "PMJAYHEM",  "start": { "time": { "timestamp": "<today>T00:00:00" } },  "end": { "time": { "timestamp": "<today>T23:59:59" } }  },  "item": { "descriptor": { "code": "PMJAY", "name": "PMJAY", "flag": false } },  "location": {  "gps": "17.3787973,78.4368433",  "radius": { "type": "CONSTANT", "value": "13.0", "unit": "km" }  }  }  }  } |

**Step 3. Sign it.** Run the Header Generation Toolkit with your subscriber ID, public key ID and the payload above as an exact string. It returns the signed header values. Send the body byte-for-byte as you signed it; reformatting it breaks the digest.

**Step 4. Send it.**

|  |
| --- |
| curl -X POST https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/search \  -H "Content-Type: application/json" \  -H 'Authorization: <signed header from the toolkit>' \  -H 'Digest: BLAKE-512=<digest from the toolkit>' \  --data-binary @search.json |

You should get 200 with "ack": { "status": "ACK" } straight away. That is only a receipt.

**Step 5. Read the callback.** Within seconds, the Gateway posts on\_search to your /on\_search endpoint. Check that context.transaction\_id matches yours, then read message.catalog.providers[]:

|  |
| --- |
| {  "id": "HOSP27G13867",  "descriptor": { "name": "General Hospital Wardha", "code": "G" },  "categories": [ { "descriptor": { "name": "Cardiology", "code": 100002 } } ],  "fulfillments": [  { "type": "Establishment Date", "start": { "time": { "timestamp": "1915" } } },  { "type": "Empaneled Date", "start": { "time": { "timestamp": "2018-09-14 16:03:16.0" } } }  ],  "location": { "gps": "15.497097,80.048688", "district": { "name": "PRAKASAM" } },  "contact": { "phone": <MOBILE_NUMBER>, "tags": { "nodalOfficerNumber": <MOBILE_NUMBER> } }  } |

This excerpt is from the Gateway spec's sample response. Sandbox data will differ.


**If it does not work**

| **Symptom** | **Likely cause** |
| --- | --- |
| 401 on step 4 | Header signed over a different body, reused or expired signature, or wrong keyId |
| 403 on step 4 | Public key not registered, or registration not yet active |
| ACK but no callback | consumer\_uri not publicly reachable over HTTPS, or your endpoint did not return 200 |
| Callback arrives but is not matched | Your code looked up the wrong transaction\_id |
| Empty providers[] | No empanelled hospital inside the radius; widen radius.value |

Once this works, the rest of the guide is variations on the same exchange: different domain and filters for the discovery services, and direct EUA–HSPA calls after on\_search for Physical Consultation and Ambulance.

## 1.4 Demo videos

Recorded walkthroughs of UHI services running in Aarogya Setu are in the [AarogyaSetu-Recordings folder](https://drive.google.com/drive/folders/1JvlWPouPNlyfLT3RmsjuUzeAVkdhlKrD?usp=drive_link). Watch the one for your service before building the EUA screens; the sign-off demo NHA asks for follows the same flow.

# Part 2: Services

Every service below uses the same five headings, in the same order:

1. **Overview:** what the service is, who runs the HSPA, and what is in and out of scope.
2. **In short (TL;DR):** the few lines to read if you read nothing else.
3. **Workflows:** service identifiers, the API calls in order, and the search filters.
4. **Concepts explored:** the ideas that trip integrators up.
5. **User journeys:** the patient-side flow as a sequence diagram, following the onboarding document.

| **Section** | **Service** | **Integrate as** | **Use cases** |
| --- | --- | --- | --- |
| 2.1 | Physical Consultation | EUA or HSPA | Discovery, Order, Fulfilment, Post-fulfilment |
| 2.2 | PM-JAY HEM Hospital Discovery | EUA | Hospital Discovery |
| 2.3 | Blood Bank Discovery | EUA or HSPA | Blood Stock Discovery |
| 2.4 | Ambulance Booking | EUA or HSPA | Discovery, Order (Phase 1) |
| 2.5 | Jan Aushadhi | EUA | Kendra Search, Medicine Search, Kendras for a Selected Medicine |
| 2.6 | NOTTO Hospital Discovery | EUA | Hospital Discovery |

## 2.1 Physical Consultation

### 1. Overview

Physical Consultation is the only fully end-to-end service on UHI. A patient finds a doctor, picks a slot, books, gets a 4-digit PIN, and checks in at the clinic with it. The service covers discovery, booking, fulfilment and post-fulfilment in one transaction.

Any EUA or HSPA that has completed ABDM M2 under HIECM can integrate. HSPAs represent one or more hospitals, clinics or individual doctors (the HSPs).

| **In scope (live)** | **Not yet available** |
| --- | --- |
| Doctor discovery by name, HPR ID, speciality, state, district, pincode, GPS or facility name | Online payment before booking (in ideation) |
| Real-time slot selection | Refunds through the UHI flow |
| Booking with terms the patient must accept |  |
| PIN-based check-in at the facility |  |
| Status tracking and cancellation |  |
| Pay on visit |  |

### 2. In short (TL;DR)

* **Two communication models.** Only discovery goes through the UHI Gateway. Everything from init onwards is direct point-to-point (P2P) between EUA and HSPA.
* **Two searches.** The first search is broadcast by the Gateway and returns doctors. The second goes P2P to the chosen HSPA's provider\_uri and returns that doctor's slots.
* **Booking is init → on\_init → confirm → on\_confirm.** The HSPA holds the slot for 15 minutes after init and sends five terms. The EUA sends all five back as AGREED.
* **on\_confirm carries a 4-digit PIN.** The patient shows it at the clinic. Keep it in memory only, never in a database or logs.
* **HSPAs send audit copies.** Every on\_confirm, on\_status, on\_update and on\_cancel also goes to the Gateway's matching \_audit endpoint.

### 3. Workflows

Call-by-call spec: UHI\_PhysicalConsultation.yaml (see 3.1).

**Service identity**

| **Field** | **Value** |
| --- | --- |
| context.domain | nic2004:85111 |
| intent.fulfillment.type | Physical (case-sensitive) |
| intent.item.descriptor.code / .name | Consultation |
| core\_version | 0.7.1 |

**API calls by stage**

| **Stage** | **Call** | **Route** | **What happens** |
| --- | --- | --- | --- |
| Discovery | search (first) | EUA → Gateway → all HSPAs | Broadcast query by doctor, speciality or location |
| Discovery | on\_search (first) | HSPA → Gateway → EUA | One catalog per HSPA with doctors, fees and provider\_uri |
| Discovery | search (second) | EUA → HSPA (P2P) | Asks for slots for the chosen doctor |
| Discovery | on\_search (second) | HSPA → EUA (P2P) | Returns that doctor's slots, each with a slot UUID |
| Booking | init / on\_init | P2P | EUA sends patient and slot. HSPA holds slot 15 minutes, returns order.id, quote and five terms |
| Booking | confirm / on\_confirm | P2P | EUA returns terms as AGREED. HSPA sets CONFIRMED and issues the PIN |
| Fulfilment | on\_update (to EUA) | HSPA → EUA | HSPA pushes APPOINTMENT\_STARTED, COMPLETED or NO\_SHOW |
| Fulfilment | on\_update (to HSPA) | EUA → HSPA | EUA may send DOCTOR\_NO\_SHOW only |
| Fulfilment | status / on\_status | P2P | Pull the full order if an expected update never arrived |
| Post-fulfilment | cancel / on\_cancel | P2P | Patient or doctor cancels with a reason code |
| Post-fulfilment | on\_message | P2P, both ways | In-app chat. EUA must implement it; optional for HSPA |

The Gateway spec also lists select / on\_select. Do not implement them for Physical Consultation: follow the flow above, from the second on\_search straight to init.

**Search filters (first search).** All are optional on top of the mandatory service identity and time window: doctor name (fulfillment.agent.name), HPR ID (fulfillment.agent.id), speciality (category.descriptor), city, pincode (address.area\_code), facility name (provider.descriptor.name), and GPS with radius. GPS needs all three radius fields (type: CONSTANT, value, unit: km). If one is missing, the filter is silently ignored.

**Endpoints you must expose**

| **Role** | **Endpoints** |
| --- | --- |
| HSPA | /search, /init, /confirm, /status, /cancel, /on\_update, /on\_message |
| EUA | /on\_search, /on\_init, /on\_confirm, /on\_status, /on\_update, /on\_cancel, /on\_message |

### 4. Concepts explored

* **Broadcast versus P2P.** The Gateway only knows about search and on\_search. From the first on\_search onwards, the EUA must store context.provider\_uri and provider\_id and call the HSPA directly. Both sides look up each other's public key via /api/v1/networkregistry/lookup before signing a P2P call.
* **Aggregating many on\_search responses.** Each matching HSPA replies separately. The EUA groups them by the shared transaction\_id.
* **The slot UUID is the link.** fulfillments[].id from on\_search goes into init as the fulfillment id. A mismatch makes the HSPA reject or silently fail to hold the slot.
* **order.id is assigned in on\_init.** Use the HSPA's order.id from on\_init in confirm and every call after, not the one you sent in init.
* **Five terms, returned unchanged.** on\_init sends Commercial, Settlement, Cancellation, Refund and Payment terms with termsState: INITIATED. The EUA shows all five, then sends them back in confirm with only termsState changed to AGREED. One INITIATED term causes rejection.
* **The PIN.** on\_confirm returns authorization.type: PIN with a 4-digit token valid until the end of the appointment day. PIN status moves from GENERATED to VERIFIED at check-in, or to HSPAOVERRIDE when staff bypass it with a reason code (O1 to O6), such as an app crash or an elderly patient who cannot open the app.
* **Who owns which state.** The HSPA sets CONFIRMED, APPOINTMENT\_STARTED, COMPLETED, NO\_SHOW and FAILED. The EUA may only set DOCTOR\_NO\_SHOW.
* **Cancellation reason codes.** Patient cancellations use P1 to P7 and doctor cancellations use D1 to D6. Codes are fixed; labels are yours. The tag @abdm/gov.in/cancelledby (patient or doctor) is mandatory so the right terms apply. P7 and D6 need free text.
* **Health records afterwards.** The HSPA must send doctor tags including @abdm/gov.in/hip\_id so the EUA can pull prescriptions later. The care context ID travels as the tag @abdm/gov.in/care\_context\_id in on\_status, on\_update and their audit copies; on\_update\_audit is the copy that counts for the Digital Health Incentive Scheme (DHIS).
* **Communication tags.** on\_confirm must carry the messaging\_support flag and a helpline or facility contact number.

**Order tags used from init onwards** (from the spec examples): @abdm/gov.in/abha\_number (patient ABHA number), @abdm/gov.in/slot\_id (chosen slot), @abdm/gov.in/cancelledby and @abdm/gov.in/cancel\_reason (on cancel / on\_cancel), @abdm/gov.in/messaging\_support and @abdm/gov.in/helpline\_number (on on\_confirm onwards), and @abdm/gov.in/care\_context\_id (on on\_status / on\_update).

### 5. User journeys

A patient searches for a doctor, picks a slot, books, and checks in at the facility with a PIN. The sequence follows the four stages in the onboarding document.


Steps 2 to 5 go through the Gateway; every later call is direct between EUA and HSPA. The HSPA also sends an exact copy of each on\_confirm, on\_status, on\_update and on\_cancel to the matching Gateway \_audit endpoint. Stage 4 happens instead of fulfilment when the appointment is cancelled.

**Appointment states**


Only the DOCTOR\_NO\_SHOW transition starts from the EUA. Every other state change comes from the HSPA.

## 2.2 PM-JAY HEM Hospital Discovery

### 1. Overview

PM-JAY Hospital Empanelment Management (HEM) discovery lets a beneficiary find hospitals currently empanelled under PM-JAY, filtered by location and speciality. Data comes live from the PM-JAY HEM system, so the list reflects empanelment status today rather than a stale copy.

This is an **EUA-only integration**. NHA runs the single PM-JAY HEM HSPA, backed by one HEM database. You build the search screen and the callback; you do not build an HSPA.

| **In scope (Phase 1, live)** | **Later phases** |
| --- | --- |
| Hospital search by state, district, speciality, facility name, pincode or GPS | Booking and referral (Phase 2) |
| Hospital name, type, specialities, empanelment date, location and contacts | Provider dashboards, CSC kiosk and voice search (Phase 2) |
| PM-JAY nodal officer number per hospital | ABHA-linked discharge summaries, multilingual voice bots (Phase 3) |

### 2. In short (TL;DR)

* **One call pair:** search (EUA → Gateway → HEM HSPA) and on\_search (HSPA → Gateway → EUA).
* **State is mandatory, except in GPS search.** Every other filter is added on top of state. GPS search sends coordinates and radius only.
* **Fixed identifiers are case-sensitive.** A wrong fulfillment.type (PMJAYHEM) or item code (PMJAY) means no HSPA responds at all.
* **No end signal and no pagination.** Set a timeout, render as results arrive, and paginate on the client.
* **Discovery only.** Do not build booking or referral into the UI yet.

### 3. Workflows

Call-by-call spec: UHI\_PMJAY\_HEM.yaml (see 3.2).

**Service identity**

| **Field** | **Value** |
| --- | --- |
| context.domain | nic2004:85112 |
| intent.fulfillment.type | PMJAYHEM |
| intent.item.descriptor.code / .name | PMJAY |
| intent.item.descriptor.flag | false |

**Search variants**

| **Search** | **Location and filter fields** | **Use it for** |
| --- | --- | --- |
| State only | location.state.name (CAPS), location.state.code (numeric) | Everything in a state |
| State + district | State, plus location.district.name (CAPS) and location.district.code | One district |
| State + speciality | State, plus category.descriptor.name and .code (e.g. Cardiology, 100002) | A clinical speciality |
| State + facility name | State, plus provider.descriptor.name | A known hospital |
| State + pincode | State, plus address.area\_code (sibling of fulfillment, not inside location) | A pincode area |
| GPS (no state) | location.gps, radius.type: CONSTANT, radius.value (e.g. 13.0), radius.unit: km | Nearby hospitals |

In the spec examples, district code, pincode and speciality code are sent as numbers, not strings.

**What comes back in each provider record:** hospital ID (for example HOSP27G13867), name, type code (G Government or P Private), specialities with codes, two fulfillment entries (Establishment Date and Empaneled Date), GPS, address, city, district, state, phone, email and contact.tags.nodalOfficerNumber.

Speciality codes come from the PM-JAY HBP specialities API (sandbox apisbeta.nha.gov.in, production apisprod.nha.gov.in), not from a static list in this guide.

### 4. Concepts explored

* **Single HSPA, single database.** Unlike Physical Consultation, there is no broadcast to many providers. Expect one on\_search per search.
* **State as the anchor.** Every variant except GPS is "state plus one more filter". Names go in capitals (ANDHRA PRADESH) with numeric codes (28). GPS search stands alone.
* **Two dates, two meanings.** Establishment Date is the year the hospital opened. Empaneled Date is when it joined PM-JAY. Show the second; it is what beneficiaries care about.
* **The nodal officer.** nodalOfficerNumber is the PM-JAY point of contact at that hospital, separate from the general phone number. Surface it; it is the main value for a beneficiary.
* **Fields not to trust as filters.** descriptor.flag (NABH accreditation) is not reliably populated. Show it as information only.
* **GPS gaps.** GPS search can miss hospitals in low-density areas. Offer district or pincode alongside it.
* **UX rules checked at sign-off.** The feature must be reachable within 3 taps, sit under a health or insurance category, show "Powered by UHI" with PM-JAY and ABDM branding, show a fallback message on empty results, and display the disclaimer "Please confirm the hospital location by calling ahead, as details may change."

### 5. User journeys

A beneficiary searches for PM-JAY empanelled hospitals. The sequence follows the seven steps in the onboarding document.


The optional filter is one of district, speciality, facility name or pincode. If step 7 does not arrive within your timeout, stop waiting and offer a retry. If the catalog is empty, suggest a wider search.

## 2.3 Blood Bank Discovery

### 1. Overview

Blood Bank Discovery tells a patient's family which blood banks near them have the right blood group and component in stock, with unit counts. One search reaches every registered Blood Bank HSPA at once, so the app does not integrate with each blood bank system separately.

Both roles are open. You can join as an EUA (the search app), as an HSPA (a blood bank system or aggregator), or both. Today the one registered HSPA is e-RaktKosh.

| **In scope** | **Not in scope** |
| --- | --- |
| Search by GPS radius or by state and district | Reserving or booking units |
| Filter by blood group and blood component | Guaranteed real-time stock at every bank |
| Unit counts and Available / NotAvailable per blood group |  |
| Blood bank address, GPS, phone and email |  |

### 2. In short (TL;DR)

* **One call pair:** search and on\_search, both through the Gateway.
* **Pick one location mode:** GPS + radius, or state + district. Blood group and component work with either.
* **Blood group goes in item, component goes in category.** Use All / -1 to search every blood group.
* **Several HSPAs may answer.** Wait 10 to 15 seconds, show results as they arrive, and do not wait for an end signal.
* **Counts are indicative.** Some banks update in real time, others daily. Always show the phone number and a "call to confirm" disclaimer.

### 3. Workflows

Call-by-call spec: UHI\_BloodBank.yaml (see 3.2).

**Service identity**

| **Field** | **Value** |
| --- | --- |
| context.domain | nic2008:86906 |
| intent.fulfillment.type | BloodStock |
| core\_version | 0.7.1 |

**Search modes**

| **Mode** | **Location fields** | **Blood filters** |
| --- | --- | --- |
| GPS + radius | location.gps, radius.type: CONSTANT, radius.value (e.g. 5), radius.unit: km | item.descriptor (blood group), category.descriptor (component) |
| State + district | location.state.name / .code (e.g. Maharashtra, 311), location.district.name / .code (e.g. Pune, 022), as in the Gateway spec | Same |

**Blood group codes** (item.descriptor.code)

| **Code** | **Group** | **Code** | **Group** |
| --- | --- | --- | --- |
| -1 | All | 16 | O-Ve |
| 11 | A+Ve | 17 | AB+Ve |
| 12 | A-Ve | 18 | AB-Ve |
| 13 | B+Ve | 22 | Oh+Ve |
| 14 | B-Ve | 23 | Oh-Ve |
| 15 | O+Ve |  |  |

**Component codes** (category.descriptor.code): 11 Whole Blood, 12 Packed Red Blood Cells, 13 Fresh Frozen Plasma, 14 Single Donor Platelet, 16 Platelet Rich Plasma, 17 Cryoprecipitate, 18 Single Donor Plasma, 19 Plasma, 20 Platelet Concentrate, 21 Cryo Poor Plasma, 23 Random Donor Platelets, 24 Platelets Additive Solutions, 28 SAGM Packed Red Blood Cells, 29 Irradiated RBC, 30 Leukoreduced RBC.

**What comes back per blood bank:** name, type in short\_desc (for example Govt. or Charitable/Vol), component in categories[], one items[] entry per blood group with quantity.count, a fulfillments[] entry of type Available or NotAvailable, and location and contact details.

The spec examples spell the unavailable status both NotAvailable and Not Available. Match both until NHA confirms one.

### 4. Concepts explored

* **Item versus category.** In this service, item is the blood group and category is the component. Other services use item for the service itself, so this is easy to get backwards.
* **Fulfillment carries availability.** Each blood group item points to a fulfillment through items[].fulfillment\_id. That fulfillment's type is Available or NotAvailable. Read the unit count and the status together.
* **"All" as a wildcard.** Blood group All with code -1 returns every group. Useful when any group will do in an emergency.
* **Many HSPAs, no end signal.** The Gateway routes to every registered Blood Bank HSPA. Aggregate by transaction\_id within a 10 to 15 second window.
* **HSPA quality bar.** A new HSPA must run its own blood bank database at a standard comparable to e-RaktKosh, with real-time or near-real-time stock. Manually maintained records are not approved for production.
* **Discovery, not reservation.** There is no hold on units. The phone number is the handoff, so place it prominently.

### 5. User journeys

A patient's family searches for blood of a given group and component. The sequence follows the seven steps in the onboarding document.


Location is either GPS + radius or state + district. Steps 4 to 8 happen once per registered Blood Bank HSPA, so aggregate results as they arrive and close the window after 10 to 15 seconds.

## 2.4 Ambulance Booking

### 1. Overview

Ambulance Booking lets a caregiver find nearby private ambulances with an arrival window and indicative price, pick one, and send the patient's details to that provider. The provider then calls back to arrange dispatch. Any compliant ambulance HSPA becomes visible in every compliant health app, without bilateral deals.

Both roles are open: EUAs (health apps) and HSPAs (ambulance service platforms). Phase 1 is live for the emergency flow.

| **Phase 1 (live)** | **Phase 2 (upcoming)** |
| --- | --- |
| search / on\_search: emergency ambulances by class (ALS, BLS or ALL) | confirm / on\_confirm: order created, driver and vehicle shared |
| init / on\_init: patient details sent, quote and terms returned | status, on\_status, on\_update: dispatch updates and live tracking |
| Provider calls the caregiver to arrange dispatch | cancel / on\_cancel |
|  | Non-emergency (scheduled) trips with a drop-off |

State-run networks such as 108, 102 and 112 are out of scope.

### 2. In short (TL;DR)

* **Four calls in Phase 1.** search and on\_search go through the Gateway. init and on\_init go directly between EUA and HSPA.
* **Emergency only for now.** Send fulfillment.type: EMERGENCY, the pickup (SOURCE) GPS and address, and ideally class ALL.
* **on\_init is a quote, not a booking.** It returns order.id, a price breakup and terms for review. Confirmation comes in Phase 2.
* **No driver or vehicle details anywhere in Phase 1.** An agent block in any Phase 1 payload fails testing.
* **Silence is not an error.** HSPAs only answer for areas they serve. No response means no coverage, not a network fault.

### 3. Workflows

Call-by-call spec: UHI\_AmbulanceBooking.yaml (see 3.3).

**Service identity**

| **Field** | **Value** |
| --- | --- |
| context.domain | nic2008:86909 |
| intent.item.descriptor.code | AMBULANCE |
| intent.fulfillment.type | EMERGENCY (NON\_EMERGENCY in Phase 2) |
| intent.category.descriptor.code | ALS, BLS or ALL |
| core\_version | 0.7.1 |

Search by ALS, BLS or ALL. In the spec's on\_search example, HSPAs also return PTA (Patient Transport Ambulance) and MVA (Mortuary Van/Ambulance) categories, so render any category code you receive.

**Phase 1 calls**

| **Call** | **Route** | **What the payload carries** |
| --- | --- | --- |
| search | EUA → Gateway → all ambulance HSPAs | Case type, class, pickup time (now, for emergencies), locations[SOURCE] GPS and address, optional tags.additional\_services (for example oxygen cylinder) |
| on\_search | HSPA → Gateway → EUA | Catalog with one fulfillment per ambulance: ID (e.g. ML-ALS-01), class, earliest and latest arrival time, tracking flag, optional deeplink; plus items with indicative, minimum and maximum price |
| init | EUA → HSPA (P2P) | Chosen provider.id, item.id and fulfillment\_id; billing name, address and phone; customer.id as the patient's ABHA address; pickup location |
| on\_init | HSPA → EUA (P2P) | order.id, total price with quote.breakup[], payment type and status, five terms with termsState: INITIATED, terms\_reference URL, echoed locations |

**Search rules by case type**

| **Case type** | **Location fields** |
| --- | --- |
| EMERGENCY | SOURCE (pickup GPS + address) mandatory; DESTINATION optional, as in the spec's second search example |
| NON\_EMERGENCY (Phase 2) | SOURCE and DESTINATION, both with GPS + address; fulfillment.end sets the latest acceptable time |

### 4. Concepts explored

* **Category → fulfillment → item.** In on\_search, categories[] is the ambulance class, each fulfillments[] entry is one ambulance with its arrival window, and each items[] entry is its price, linked back by items[].fulfillment\_id. init sends back the chosen item and fulfillment IDs exactly.
* **Arrival window, not a single ETA.** fulfillments[].start and .end are the earliest and latest expected arrival. Show both.
* **Indicative versus confirmed price.** on\_search prices are indicative (price.value, with optional estimated, minimum and maximum). on\_init gives the confirmed total and breakup.
* **Service paused flag.** catalog.descriptor.flag: true means that HSPA has paused service. Do not list its ambulances as bookable.
* **Payment flag per item.** items[].descriptor.flag: true means payment is required.
* **Patient identity by ABHA.** order.customer.id carries the patient's ABHA address (for example <ABHA_ADDRESS>).
* **Terms gate the next step.** The EUA must show the cancellation and payment terms from on\_init before enabling any confirm action.
* **The agent block restriction.** Driver name, vehicle number and driver phone appear only in Phase 2 on\_confirm. They must be absent from every Phase 1 payload and screen.
* **HSPA quality bar.** HSPAs need real-time or near-real-time fleet availability. Manually maintained records are not approved.

### 5. User journeys

A caregiver searches for an emergency ambulance, selects one, and sends the patient's details to that provider. The sequence follows the six steps in the onboarding document.


Steps 2 to 6 go through the Gateway; steps 9 and 10 are direct. Only HSPAs that serve the pickup area answer at step 5, so an empty result means no local coverage, not a network error.

## 2.5 Jan Aushadhi

### 1. Overview

Jan Aushadhi on UHI helps a citizen find a Jan Aushadhi Kendra near them, and find which Kendras stock a specific generic medicine. PMBI (Pharmaceuticals and Medical Devices Bureau of India) runs the single HSPA, backed by its Kendra and medicine database.

Three flows share one domain, nic2008:47721. They differ **only by fulfillment.type** (and what goes in item.descriptor):

| **Flow** | **fulfillment.type** | **You send** | **You get back** |
| --- | --- | --- | --- |
| A. Find a Kendra | JANAUSHADHI | Location filters or a Kendra code | Kendras with address, GPS, contact, ownership and enrolment date |
| B. Find a medicine | JANAUSHADHI\_MEDICINE | Medicine name | Matching medicines with medicineId, item code, MRP and pack unit |
| C. Find Kendras stocking that medicine | JANAUSHADHI\_KENDRA | medicineId from flow B, plus the same location filters as flow A | Kendras with the medicine's stock status and quantity |

EUAs integrate as consumers. PMBI builds and operates the HSPA.

### 2. In short (TL;DR)

* **One domain, three fulfillment types.** Get fulfillment.type wrong and PMBI returns the wrong kind of catalog, or nothing.
* **All calls are search / on\_search through the Gateway.** There is no booking or ordering.
* **No mandatory location.** Unlike PM-JAY HEM, state is not required. Each filter works alone or combined.
* **Medicine search is a two-step chain.** Flow B turns a name (for example Paracetamol) into a medicineId; flow C uses that ID to find stock nearby.
* **Stock is a flag.** In flow C, items[].descriptor.flag marks in or out of stock. A stock count in quantity.measure.value may be sent, but the spec example omits it, so do not depend on it.

### 3. Workflows

Call-by-call spec: UHI\_JanAushadhi.yaml (see 3.2).

**Service identity**

| **Field** | **Flow A** | **Flow B** | **Flow C** |
| --- | --- | --- | --- |
| context.domain | nic2008:47721 | nic2008:47721 | nic2008:47721 |
| intent.fulfillment.type | JANAUSHADHI | JANAUSHADHI\_MEDICINE | JANAUSHADHI\_KENDRA |
| intent.item.descriptor.code | JANAUSHADHI | Medicine name, no spaces | medicineId from flow B |
| intent.item.descriptor.name | JANAUSHADHI | Medicine name | medicineId from flow B |

**Location filters (flows A and C)**

| **Search** | **Fields** |
| --- | --- |
| Kendra code | category.descriptor.code and .name set to the Kendra code itself (e.g. PMBJK02129) |
| State + district | location.state.name / .code (e.g. Telangana, 36), location.district.name / .code (e.g. KHAMMAM, 509) |
| Pincode | address.area\_code (6 digits, sibling of location) |
| GPS + radius | location.gps, radius.type: CONSTANT, radius.value (e.g. 5), radius.unit: km |
| Combined | State + district + pincode together, for the narrowest result |

**What comes back**

| **Flow** | **Key fields in each providers[] record** |
| --- | --- |
| A | id = PMBJP Kendra code (e.g. PMBJK10844); descriptor.code = ownership (PP, PG, GG); descriptor.symbol = PMBI serial number; fulfillments[] of type contact with contact person and enrolment date; location, GPS, phone, email; location.radius = distance from the user when GPS was sent |
| B | id = medicineId (e.g. 77041); descriptor.name = generic name; descriptor.code = item code; items[].price.value = MRP in INR; items[].quantity.measure.unit = pack unit (e.g. 10's) |
| C | Kendra fields as in flow A, plus items[] for the medicine with descriptor.flag (stock status) |

### 4. Concepts explored

* **fulfillment.type as the switch.** The domain, Gateway and HSPA are identical across the three flows. The type alone tells PMBI whether you want Kendras, medicines or stock.
* **Chaining by medicineId.** Never send a medicine name in flow C. Take the providers[].id from flow B and put it in item.descriptor.code and .name.
* **Different meaning of providers[].** In flows A and C, a provider is a Kendra. In flow B, a provider is a medicine. Parse by flow, not by field name.
* **Contact is a fulfillment.** Kendra contact person and enrolment date sit in fulfillments[] with type: contact, not in contact. The contact block holds only phone and email.
* **Distance only when you send GPS.** In flow C, location.radius in the response gives the distance from the user to the Kendra. It appears only when the request carried GPS.
* **Sparse fields.** City, email, short\_desc and long\_desc can be empty. Do not treat empty as an error.

### 5. User journeys

**Journey 1: finding a Kendra.** A citizen searches for Jan Aushadhi Kendras. The sequence follows the six steps in the onboarding document.


**Journey 2: finding a medicine, then a Kendra that stocks it.** A citizen looks up a generic medicine by name, then searches for Kendras that stock it.


The two searches in journey 2 are separate transactions. Only medicineId carries across from step 5 to step 7. Gateway ACKs are left out of this diagram for readability.

## 2.6 NOTTO Hospital Discovery

### 1. Overview

NOTTO Hospital Discovery lets a patient or family find hospitals registered with the National Organ & Tissue Transplant Organisation for a given organ or tissue. Each result says whether the hospital is a transplant centre, a retrieval centre, a tissue bank or a cornea facility.

NOTTO runs the single HSPA (notto.hspa), backed by its national registry of authorised hospitals. EUAs integrate as consumers.

| **In scope (Phase 1)** | **Out of scope** |
| --- | --- |
| Search by organ or tissue type, nationally or within a state | Referral |
| Hospital type, registration type, capabilities, establishment year | Booking |
| Address, GPS, transplant coordinator phone, nodal officer, website | Waitlist workflows |

### 2. In short (TL;DR)

* **One call pair:** search and on\_search through the Gateway.
* **Organ or tissue type is mandatory.** Send its code from the master list below in category.descriptor.
* **Only two filter combinations work today:** organ/tissue alone (national) or organ/tissue + state. No pincode, speciality or facility-name filter.
* **GPS + radius is not testable yet.** The payload is defined, but NOTTO does not yet capture GPS precisely, so it is marked not applicable.
* **Four capability flags per hospital.** transplant\_centre, retrieval\_centre, tissue\_bank and cornea are sent as "true" / "false" strings.

### 3. Workflows

Call-by-call spec: UHI\_NOTTO.yaml (see 3.2).

**Service identity**

| **Field** | **Value** |
| --- | --- |
| context.domain | nic2004:86100 |
| intent.fulfillment.type | NOTTO\_HOSPITAL |
| intent.item.descriptor.code / .name | NOTTO |
| core\_version | 0.7.1 |
| Gateway endpoints | POST /api/v1/uhi/search, POST /api/v1/uhi/on\_search |

**Search filters**

| **Filter** | **Field** | **Status** |
| --- | --- | --- |
| Organ or tissue type | category.descriptor.code / .name | Mandatory |
| State | location.state.code (LGD code, e.g. 06) / .name (e.g. Haryana) | Optional |
| District | location.district.code / .name | Optional; needs state |
| GPS + radius | location.gps, radius (CONSTANT, value, km) | Not applicable yet |

**Organ and tissue codes**

| **Type** | **Name** | **Code** |
| --- | --- | --- |
| Organ | Liver | 2 |
| Organ | Kidney | 3 |
| Organ | Heart | 4 |
| Organ | Intestine | 7 |
| Organ | Pancreas | 8 |
| Organ | Lung | 12 |
| Tissue | Bone | 5 |
| Tissue | Heart Valve | 6 |
| Tissue | Skin | 9 |
| Tissue | Cornea | 10 |
| Tissue | Cartilage | 11 |
| Tissue | Blood Vessels | 13 |
| Tissue | Hand | 15 |
| Tissue | Amnion | 17 |

**What comes back in each provider record**

| **Block** | **Fields** |
| --- | --- |
| descriptor | name; code = hospital type (Public, Private, Trust, Autonomous, Army); short\_desc = registration type (Retrieval Centre, Transplant Centre, Tissue Bank) |
| categories[] | Organs and tissues the hospital handles, with master-list codes |
| fulfillments[] | One entry of type Establishment Year with the year in start.time.timestamp and the four capability tags |
| location | City, district and state with LGD codes, GPS, full address |
| contact | phone (transplant coordinator), email, tags.nodal\_officer\_contact, tags.website |

### 4. Concepts explored

* **Registration type versus capability flags.** short\_desc gives the hospital's primary NOTTO registration. The four fulfillment tags say everything it can do. A hospital can be a transplant centre and a tissue bank at once, so filter on the tags.
* **LGD codes for geography.** State, district and city codes follow the Local Government Directory. Validate them against the LGD master before sending.
* **State before district.** District only works with state. Enforce this in the UI.
* **Establishment year in a fulfillment.** As in PM-JAY HEM, dates about the hospital are carried as a fulfillment with a label in type.
* **Cache the master list.** Keep the organ and tissue list locally and validate category.descriptor.code against it. An unknown code returns an error.
* **The coordinator is the contact.** contact.phone is the transplant coordinator, the person a family actually needs. Show it first.

### 5. User journeys

A patient's family searches for NOTTO-registered hospitals for an organ or tissue type. The sequence follows the six steps in the onboarding document.


Leave out the state for a national search. If step 7 does not arrive within your timeout, check that consumer\_uri is publicly reachable and that transaction\_id matches.

# Part 3: API specifications (YAML)

Each service has its own OpenAPI 3.0.3 file, split from the UHI Gateway spec v2.0.2. Open a file in [Swagger Editor](https://editor.swagger.io/) (File → Import file) or any Swagger UI to browse it.

**How each file is ordered**

* **Tags are use cases**, numbered in the order a transaction runs them (for example 1. Discovery, 2. Order).
* **Calls inside a tag are numbered** in the order they happen, with direction: 1. search: EUA → UHI Gateway.
* **Repeated endpoints carry a label**, for example /search (second search). The label is not part of the URL; the real endpoint is in x-actual-endpoint.
* **Network Registry lookup** closes every file.
* **Examples are the spec's own.** Physical Consultation keeps only physical examples; where the spec has only a teleconsultation example (second search, init, confirm), the call carries a note to send Physical.

| **File** | **Service** | **Use cases** | **Calls** |
| --- | --- | --- | --- |
| UHI\_PhysicalConsultation.yaml | Physical Consultation | 4 | 22 + lookup |
| UHI\_PMJAY\_HEM.yaml | PM-JAY HEM Hospital Discovery | 1 | 4 + lookup |
| UHI\_BloodBank.yaml | Blood Bank Discovery | 1 | 4 + lookup |
| UHI\_AmbulanceBooking.yaml | Ambulance Booking | 2 | 6 + lookup |
| UHI\_JanAushadhi.yaml | Jan Aushadhi | 3 | 12 + lookup |
| UHI\_NOTTO.yaml | NOTTO Hospital Discovery | 1 | 4 + lookup |

## 3.1 Physical Consultation

| **Use case** | **#** | **Call** | **From → To** |
| --- | --- | --- | --- |
| 1. Discovery | 1 | search (first, broadcast) | EUA → UHI Gateway |
|  | 2 | search (forwarded) | UHI Gateway → HSPA |
|  | 3 | on\_search (doctor catalog) | HSPA → UHI Gateway |
|  | 4 | on\_search | UHI Gateway → EUA |
|  | 5 | search (second, for slots) | EUA → HSPA |
|  | 6 | on\_search (slots) | HSPA → EUA |
| 2. Order | 1 | init | EUA → HSPA |
|  | 2 | on\_init (order.id, quote, terms) | HSPA → EUA |
|  | 3 | confirm (terms AGREED) | EUA → HSPA |
|  | 4 | on\_confirm (CONFIRMED, PIN) | HSPA → EUA |
|  | 5 | on\_confirm\_audit | HSPA → UHI Gateway |
| 3. Fulfilment | 1 | status | EUA → HSPA |
|  | 2 | on\_status | HSPA → EUA |
|  | 3 | on\_status\_audit | HSPA → UHI Gateway |
|  | 4 | on\_update (DOCTOR\_NO\_SHOW) | EUA → HSPA |
|  | 5 | on\_update (lifecycle states) | HSPA → EUA |
|  | 6 | on\_update\_audit | HSPA → UHI Gateway |
| 4. Post-fulfilment | 1 | cancel | EUA → HSPA |
|  | 2 | on\_cancel | HSPA → EUA |
|  | 3 | on\_cancel\_audit | HSPA → UHI Gateway |
|  | 4 | on\_message | EUA → HSPA |
|  | 5 | on\_message | HSPA → EUA |

## 3.2 Discovery-only services

PM-JAY HEM, Blood Bank and NOTTO each have one use case with the same four calls. Jan Aushadhi repeats the four calls for each of its three use cases, which differ only by fulfillment.type.

| **#** | **Call** | **From → To** |
| --- | --- | --- |
| 1 | search | EUA → UHI Gateway |
| 2 | search (forwarded) | UHI Gateway → HSPA |
| 3 | on\_search | HSPA → UHI Gateway |
| 4 | on\_search | UHI Gateway → EUA |

| **File** | **Use case(s) and fulfillment.type** |
| --- | --- |
| UHI\_PMJAY\_HEM.yaml | 1. Hospital Discovery (PMJAYHEM) |
| UHI\_BloodBank.yaml | 1. Blood Stock Discovery (BloodStock) |
| UHI\_JanAushadhi.yaml | 1. Kendra Search (JANAUSHADHI), 2. Medicine Search (JANAUSHADHI\_MEDICINE), 3. Kendras for a Selected Medicine (JANAUSHADHI\_KENDRA) |
| UHI\_NOTTO.yaml | 1. Hospital Discovery (NOTTO\_HOSPITAL) |

## 3.3 Ambulance Booking

| **Use case** | **#** | **Call** | **From → To** |
| --- | --- | --- | --- |
| 1. Discovery | 1 | search (EMERGENCY, pickup) | EUA → UHI Gateway |
|  | 2 | search (forwarded) | UHI Gateway → HSPA |
|  | 3 | on\_search (ambulances, ETA, price) | HSPA → UHI Gateway |
|  | 4 | on\_search | UHI Gateway → EUA |
| 2. Order (Phase 1) | 1 | init | EUA → HSPA |
|  | 2 | on\_init (quote, terms) | HSPA → EUA |

# Open points

The Gateway spec (v2.0.2) and NHA's answers settle nine earlier questions. Ten points remain, and each needs an answer from the service owner before the guide is final.

**Still open**

| **Service** | **Open point** |
| --- | --- |
| All | No error code mapping exists yet. The spec's Error schema (type, code, path, message) points to an error\_codes.md that has not been written. |
| All except Blood Bank | No recommended on\_search timeout. Blood Bank suggests 10 to 15 seconds; Ambulance refers to an "NHA-defined SLA" without a number. |
| Physical Consultation | Two PIN override reasons share code O6 (OVERRIDE\_MISMATCH and OVERRIDE\_OTHER). |
| PM-JAY HEM | District code, pincode and speciality code are numbers in the spec examples but strings in the onboarding document. Which type should EUAs send? |
| PM-JAY HEM | Provider short\_desc is "State." in the spec example; the onboarding document calls it empanelment context and the spec tag calls it ownership. The background figure "42 lakh+ empanelled hospitals" also looks inconsistent with published scheme figures and is left out. |
| Blood Bank | Unavailable status is spelled NotAvailable and Not Available in different spec examples. |
| Ambulance Booking | on\_search returns PTA and MVA categories not listed in the onboarding document. No field reference yet for Phase 2 calls (confirm, status, cancel, on\_update). |
| Jan Aushadhi | Medicine search has no onboarding document. Case handling and partial matching of the medicine name are not specified. The flow C example sends only the in-stock flag, no stock count. |
| NOTTO | The spec's on\_search example has no registration type in short\_desc and a numeric provider ID (6086143.1), though both are documented as mandatory strings. |
| NOTTO and spec intro | Both say the Gateway signs in Proxy-Authorization, but the sample header is X-Gateway-Authorization. The NOTTO test case list also skips number 4. |

**Settled by the spec**

| **Earlier question** | **Answer** |
| --- | --- |
| Which Swagger version is current? | v2.0.2, one file covering all six services. |
| Which Jan Aushadhi HSPA ID is registered? | pmbi.hspa, with sandbox URL https://staging-nha-pmbi.pmbi.co.in/api/store. The janaushadhi-hspa IDs in the draft medicine spec are outdated. |
| Where does the Kendra code go? | In category.descriptor.code and .name directly, for example PMBJK02129. |
| Are all five Ambulance terms sent? | Yes. The spec's on\_init sends Commercial, Settlement, Cancellation, Refund and Payment, so test case AMB-D-04 should check all five. |
| PIN override status string? | HSPAOVERRIDE. |
| Is select part of Physical Consultation? | No. Follow the onboarding flow: second on\_search, then init. |
| Does PM-JAY HEM GPS search need state? | No. GPS search is sent without state. |
| Which Blood Bank state and district codes? | The ones in the spec examples (for example Maharashtra 311, Pune 022). |
| Will NOTTO responses carry LGD location codes? | Yes. |
