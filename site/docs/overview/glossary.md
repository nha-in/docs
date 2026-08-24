---
title: Glossary
sidebar_label: Glossary
sidebar_position: 4
description: Plain definitions of the ABDM terms and acronyms used across this portal.
verification: unverified
source: "ABDM__Proposed_Simplified_Milestone_1.md, ABDM__Proposed_Simplified_Milestone_2.md, ABDM__Proposed_Simplified_Milestone_3.md, ABDM__Proposed_Simplified_Milestone_4_(NHPR).md, ABDM__NewDocumant_PHR_app.md, ABDM__M1_ABHA_Collection.postman_collection.md, Data Dictionary__Sandboxdb_data_dictionary_v1.0.md"
---

# Glossary

ABDM documents use a lot of three and four letter names, and several of them look alike. This page defines the terms and acronyms the rest of this portal links to. Entries are in alphabetical order, and each one has its own anchor, so a link like `/docs/overview/glossary#hip` lands on the right definition.

:::note[Documented, not verified]
This page follows NHA's published documents for milestones 1 to 4 and the sandbox data dictionary. Nothing here has been run against the ABDM sandbox from this repository, so treat these definitions as documented, not verified.
:::

## Terms

### ABDM

Ayushman Bharat Digital Mission. It is India's national programme for digital health, run by the [NHA](#nha). ABDM sets the identifiers, the registries and the exchange rules that let a health record move from the system that created it to the person it belongs to. Everything on this site sits inside ABDM.

### ABHA

Ayushman Bharat Health Account. ABHA comes in two forms that people often confuse: the 14 digit [ABHA number](#abha-number) and the readable [ABHA address](#abha-address). When a document says "the patient's ABHA", work out which of the two it means before you write code against it.

### ABHA address

A readable name on the [HIE-CM](#hie-cm), such as `name@abdm`. A person uses it to reach their health records and to share them with a provider. Every ABHA number is issued a default address made from the number itself, `14digit@sbx` in [sandbox](#sandbox) and `14digit@abdm` in production. A person can also create an ABHA address without holding an ABHA number, using mobile number, name, age and gender.

### ABHA number

A 14 digit identifier issued to a person only after a [KYC](#kyc) check passes. It is the identity anchor of ABDM: one person, one number. NHA's M1 document notes that an ABHA number carries a check digit and validates under the Luhn algorithm. See [M1](#m1) for how one is created.

### Bridge

The set of callback endpoints your system exposes to NHA's [gateway](#gateway). NHA stores one bridge URL for each registered participant and posts callbacks underneath it. NHA's M3 document gives `POST {hiuBridgeUrl}/v0.5/consents/hiu/notify` for an [HIU](#hiu) and `POST {hipBridgeUrl}/v0.5/health-information/hip/request` for a [HIP](#hip). Registering your bridge URL is part of sandbox onboarding.

### Care context

A group of a patient's health records, defined by your system. It carries two fields and nothing else: a reference number, which is your own internal identifier, and a display name a person can read. The display name must not carry clinical detail such as a diagnosis or a test result, because it is shown before consent. NHA recommends one care context per outpatient visit and one per inpatient admission.

### Consent artefact

The record of a consent the patient granted. It names the patient, the requesting [HIU](#hiu), the [HI types](#hi-type) covered, the [purpose of use](#purpose-of-use), the date range of records allowed and an expiry. An HIU quotes the consent artefact id when it asks for data. The [HIP](#hip) checks that id, and its date range, before it sends anything.

### Consent manager

The component that holds consent on the patient's behalf. In ABDM that component is the [HIE-CM](#hie-cm). It receives consent requests, shows them to the patient, records the grant or the denial, and tells both the requester and the record holder what the patient decided.

### Discovery

The step where a patient's [PHR](#phr) app asks a facility whether it holds records for that patient. The [HIE-CM](#hie-cm) forwards the request to the [HIP](#hip) with verified identifiers (ABHA address, mobile number, name, gender, year of birth) and any unverified identifier the patient typed, such as a hospital patient ID. Your system matches those against your own patients and replies with a list of [care contexts](#care-context). The reply must contain no clinical detail.

### ECDH

Elliptic Curve Diffie-Hellman key exchange. ABDM uses it so that only the [HIU](#hiu) that holds a valid consent can read the records a [HIP](#hip) sends. Both sides generate a short lived key pair and a random 32 byte nonce, exchange the public halves, and derive the same session key. NHA's M2 document specifies Curve25519 for the exchange and AES-GCM for the encryption itself.

### EMR

Electronic Medical Record system. The clinical system a hospital or a clinic uses to record consultations, prescriptions and results. In ABDM an EMR is one of the information management systems that acts as a [HIP](#hip), so it links care contexts in [M2](#m2). See [Hospital, lab and pharmacy systems](/docs/overview/roles/his).

### EUA

End User Application. In [UHI](#uhi), the EUA is the consumer facing side: the app a patient or a caregiver uses to search for a service and book it. It sends a signed request to the UHI gateway and receives responses at its own callback URL. See [UHI](/docs/api/uhi).

### FHIR

Fast Healthcare Interoperability Resources. It is the HL7 standard ABDM uses to carry health records. ABDM uses FHIR R4 with the profiles published by NRCES at [nrces.in/ndhm/fhir/r4](https://nrces.in/ndhm/fhir/r4/index.html). Every record you share travels as a FHIR bundle of type `document` whose first entry is a Composition.

### Gateway

NHA's routing layer. Your system does not call another participant directly. You call the gateway, the gateway forwards your request to the other side, and the reply arrives at your [bridge](#bridge) as a separate inbound call. You get a session token first: NHA's M1 Postman collection posts to `https://apissbx.abdm.gov.in/api/hiecm/gateway/v3/sessions` with your client id and client secret. NHA's own documents disagree on the sandbox host for that path. The M4 document gives the same path on `https://dev.abdm.gov.in`, and the M2 document gives `https://dev.abdm.gov.in` as the sandbox base URL. We have not run either against the sandbox, so check both before you hard code one. See [Choose your gateway](/docs/api).

### HFR

Health Facility Registry. It is the national directory of health facilities across modern and traditional systems of medicine, public and private, including hospitals, clinics, diagnostic laboratories, imaging centres and pharmacies. A facility enrols once and receives a facility ID that identifies it everywhere in ABDM. See [registries](/docs/overview/building-blocks/registries).

### HI type

Health Information type. It names the kind of record being asked for or shared, and it appears in consent requests and in data requests. NHA's M3 document lists seven values: `Prescription`, `DiagnosticReport`, `OPConsultation`, `DischargeSummary`, `ImmunizationRecord`, `HealthDocumentRecord` and `WellnessRecord`. The M2 error message for an invalid HI type also lists `Invoice`.

### HIE-CM

Health Information Exchange and Consent Manager. It is NHA's component that routes exchange requests and manages patient consent. NHA describes it as data blind: it holds identifiers and metadata about [care contexts](#care-context), never the content of a record. See [HIE-CM gateway](/docs/overview/building-blocks/hie-cm).

### HIP

Health Information Provider. This is the role for a system that creates health records and shares them, such as a hospital, laboratory or pharmacy system. A HIP links [care contexts](#care-context) to a patient's [ABHA address](#abha-address), answers [discovery](#discovery), and sends encrypted records when a valid [consent artefact](#consent-artefact) exists. [M2](#m2) is the HIP milestone.

### HIU

Health Information User. This is the role for a system that reads someone else's records: a doctor's console, an insurer, a referral tool, an analytics product. An HIU raises a consent request, waits for the patient's decision, and fetches data only under a granted [consent artefact](#consent-artefact). [M3](#m3) is the HIU milestone.

### HMIS

Hospital Management Information System. NHA's documents use HMIS for the software a hospital runs day to day. An HMIS normally integrates as a [HIP](#hip). NHA's M2 document states that implementing every [HI type](#hi-type) is mandatory for an HMIS.

### HPID

Healthcare Professional ID. It is a 14 digit number issued to a healthcare professional or a facility manager after Aadhaar authentication, and it is the professional's digital identity across ABDM. An HPID is created on the [HPR](#hpr). See [M4](#m4).

### HPR

Healthcare Professionals Registry. It is the national registry of doctors, nurses, pharmacists and other healthcare professionals. Registering a professional there issues an [HPID](#hpid). NHA's M4 document also uses the HPR token when onboarding a facility to the [HFR](#hfr).

### HRP

Health Repository Provider. NHA's M2 document uses HRP for the system that actually holds the records, and writes it as "HRP/HIP" because the same system usually plays both parts. If you run an [HMIS](#hmis) or an [LMIS](#lmis) and you are integrating M2, HRP means you.

### HSPA

Health Service Provider Application. In [UHI](#uhi), the HSPA is the provider side system that receives requests and responds to them: an ambulance operator's dispatch platform, a blood bank management system, a pharmacy's stock system. It is the counterpart of the [EUA](#eua).

### KYC

Know Your Customer. It is the identity check that must pass before an [ABHA number](#abha-number) is issued. In ABDM the check runs against Aadhaar, by one of four methods: an [OTP](#otp) to the Aadhaar linked mobile number, face authentication, fingerprint or iris capture on a registered device, or a demographic match. Re-KYC repeats the check on an ABHA number that already exists.

### LIMS

Laboratory Information Management System. The system a diagnostic lab uses to record orders, samples and results. In ABDM a LIMS acts as a [HIP](#hip) and links each report as a care context in [M2](#m2). See [Hospital, lab and pharmacy systems](/docs/overview/roles/his).

### Link token

The token that authorises your system to link a [care context](#care-context) to a patient's [ABHA address](#abha-address). Your system obtains it when the patient registers and stores it against that patient. NHA's M2 document gives it a validity of six months and says to validate it before use. If you do not hold a valid one, regenerate it through demographic authentication before you link.

### LMIS

Laboratory Management Information System. NHA's documents use LMIS for laboratory software. An LMIS integrates as a [HIP](#hip), the same way an [HMIS](#hmis) does.

### M1

Milestone 1, ABHA identity. It covers creating an [ABHA number](#abha-number), logging a person in, reading and updating their profile, downloading the ABHA card, and the [gateway](#gateway) session and token calls that everything else depends on. NHA's M1 document marks most of these APIs mandatory for both private and government integrators. Aadhaar demographic authentication is the exception: NHA marks it mandatory for government integrators and not required for private ones. M1 is Phase 1 on this site. See [M1](/docs/api/hie-cm/m1).

### M2

Milestone 2, sharing records as a [HIP](#hip). It covers turning your records into [FHIR](#fhir) bundles, grouping them into [care contexts](#care-context), linking those to a patient's [ABHA address](#abha-address), answering [discovery](#discovery), and encrypting and pushing data when consent allows. It is Phase 1 on this site. See [M2](/docs/api/hie-cm/m2).

### M3

Milestone 3, consent and reading records as an [HIU](#hiu). It covers raising a consent request, tracking its status, handling the grant or denial callback, fetching the [consent artefact](#consent-artefact), requesting health information and decrypting what arrives. It is Phase 1 on this site. See [M3](/docs/api/hie-cm/m3).

### M4

Milestone 4, the registries. It covers creating an [HPID](#hpid) on the [HPR](#hpr) and onboarding a facility to the [HFR](#hfr). NHA's document also calls this NHPR. It is Phase 2 on this site. See [M4](/docs/api/hie-cm/m4).

### NHA

National Health Authority. It is the government body that runs ABDM, publishes the specifications this portal is written from, and operates both the [sandbox](#sandbox) and the production gateways.

### NHCX

National Health Claims Exchange. It is ABDM's network for insurance claims between providers and payers, with its own sandbox and its own document set at [hcxsbx.abdm.gov.in](https://hcxsbx.abdm.gov.in). NHCX is out of scope for V1 of this portal. See [NHCX](/docs/api/nhcx).

### OTP

One Time Password. A short code sent to a mobile number or an email address to prove the person holds it. ABDM uses OTPs at many points: Aadhaar [KYC](#kyc), mobile number verification during ABHA creation, and login. An OTP is always paired with a transaction id from the call that requested it.

### PHR

Personal Health Record. A PHR is a patient facing application: the person logs in with their [ABHA address](#abha-address), discovers records held by facilities they visited, links them, and reads them. PHR apps subscribe to a patient's ABHA address and are notified when a new [care context](#care-context) is linked. See [PHR applications](/docs/overview/roles/phr).

### Purpose of use

The reason an [HIU](#hiu) gives for asking for records. It travels in the consent request and the patient sees it. The codes are a subset of HL7's v3 PurposeOfUse value set: `CAREMGT` (care management), `BTG` (break the glass), `PUBHLTH` (public health), `HPAYMT` (healthcare payment), `DSRCH` (disease specific healthcare research) and `PATRQT` (self requested).

### Sandbox

NHA's test environment, and where every integration starts. You register on the sandbox portal, declare your role and the milestones you plan to complete, and receive a client id and client secret. Sandbox hosts differ from production: ABHA calls go to `abhasbx.abdm.gov.in` in sandbox and `abha.abdm.gov.in` in production. Everything in sandbox is test data. See [Get started](/docs/overview/get-started).

### UHI

Unified Health Interface. It is an open protocol network for health services that are not record exchange: physical consultation booking, ambulance booking, blood bank discovery, Jan Aushadhi and pharmacy search. It has two roles, [EUA](#eua) on the consumer side and [HSPA](#hspa) on the provider side, and every call is signed with Ed25519. UHI is Phase 2 on this site. See [UHI](/docs/api/uhi).
