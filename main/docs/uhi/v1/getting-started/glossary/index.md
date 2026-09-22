# Glossary

Every term the UHI documentation links to. Each row keeps its own anchor, so a link like `#eua` lands on the right row. HIE-CM's own vocabulary, the roles and the consent objects, is in the [HIE-CM glossary](/docs/main/docs/hiecm/v3/getting-started/glossary).

## Across ABDM

These terms mean the same thing on every ABDM gateway.

### ABDM

The Ayushman Bharat Digital Mission (ABDM) is a Government of India initiative that aims to develop an integrated, citizen-centric digital health ecosystem. It establishes common standards and core digital building blocks to enable secure and interoperable exchange of health information among participating stakeholders.

### ABHA

Ayushman Bharat Health Account (ABHA) is the account used by an individual to participate in India’s digital health ecosystem. It includes an [ABHA Number](#abha-number) for unique identification and may be linked to an [ABHA Address](#abha-address) for consent-based access and sharing of digital health records.

### ABHA address

An ABHA Address is a unique, self-declared username that enables an individual to link, access and share health records digitally with appropriate consent.

### ABHA number

An ABHA Number is a unique 14-digit number that identifies an individual as a participant in India’s digital health ecosystem. It provides a trusted identity that may be used across participating healthcare providers and payers. Creation and use of an ABHA Number are voluntary.

### FHIR

Fast Healthcare Interoperability Resources (FHIR) is a standard developed by Health Level Seven International (HL7) for the electronic exchange of healthcare information. ABDM adopts applicable FHIR R4 profiles published by the National Resource Centre for EHR Standards (NRCeS) to support interoperable health-data exchange.

### Gateway

The ABDM Gateway enables secure routing and exchange of information among participating systems in the ABDM ecosystem. Integrators communicate through approved ABDM interfaces and implement the callback endpoints and authentication mechanisms specified in the applicable technical documentation.

### Health Tech Committee

The Health Technology Committee (HTC) reviews eligible integrations as part of the ABDM sandbox exit and production onboarding process. The review is undertaken after completion of the applicable functional, security and documentation requirements prescribed by [NHA](#nha). See [Go live](/docs/main/docs/hiecm/v3/getting-started/going-live).

### HFR

The Health Facility Registry (HFR) is a comprehensive repository of public and private health facilities in India across different systems of medicine. Registered facilities receive a unique Facility ID and may access applicable digital services within the ABDM ecosystem. See [registries](/docs/main/docs/hiecm/v3/registries).

### HIE-CM

The Health Information Exchange and Consent Manager (HIE-CM) is a gateway under ABDM that manages consent relating to an individual’s personal health data and supports the secure, consent-based exchange of interoperable health information among ecosystem participants. See [The ABDM gateway](/docs/main/docs/hiecm/v3/concepts/gateway).

### HPID

Healthcare Professional ID (HPID) refers to the unique identifier assigned to an eligible healthcare professional upon successful registration and verification in the [Healthcare Professionals Registry](#hpr). See [M4](/docs/main/docs/hiecm/v3/getting-started/glossary#m4).

### HPR

The Healthcare Professionals Registry (HPR) is the national registry of doctors, nurses and pharmacists. Registering a professional on the HPR results in the issuance of an [HPID](#hpid). The HPR Token can also be used to onboard a facility to the [HFR](#hfr).

### KYC

Know Your Customer: the identity check that must pass before an [ABHA number](#abha-number) is issued. The check runs against Aadhaar: by [OTP](#otp), by biometric authentication (face, fingerprint or iris), or, for government entities only, by demographic authentication.

### NHA

The National Health Authority (NHA), under the Ministry of Health and Family Welfare, Government of India, is responsible for the implementation of ABDM and PMJAY and the management of its foundational digital health building blocks, policies and standards.

### NHCX

The National Health Claims Exchange (NHCX) is a digital gateway under ABDM that supports standardised and interoperable exchange of health-insurance claims information among payers, providers and other authorised participants. See [NHCX](/docs/main/docs/nhcx/v1).

### OTP

One Time Password: a short code sent to a mobile number or an email address to prove the person holds it. An ABHA OTP is valid for 10 minutes, and it is always verified together with the [txnId](#txnid) of the call that requested it.

### PHR

A Personal Health Record (PHR) application enables an individual to discover, link, view and manage personal health records and to provide or withdraw consent for sharing those records through the ABDM ecosystem. See [PHR applications](/docs/main/docs/hiecm/v3/concepts/participants/phr).

### Safe to Host certificate

The security documentation a [WASA](#wasa) supports. It is issued after the assessment by a CERT-In-empanelled auditor, and it is required for production onboarding under ABDM.

### Sandbox

The ABDM Sandbox is a controlled test environment that enables health-technology companies and other eligible entities to integrate their software with ABDM building blocks, test applicable use cases and demonstrate compliance before seeking production access.

### txnId

Transaction id. Most flows take two or three calls, and the first one returns a `txnId` that the calls after it send back, so ABDM knows which attempt they belong to. It is short lived and single purpose. It is not a session and it is not a token: holding a `txnId` does not authenticate you, and it stops working once the flow it belongs to finishes or expires.

### UHI

The Unified Health Interface (UHI) is an open network for digital health-service discovery and delivery. It enables participating applications and providers to interact through standard protocols for services such as appointment discovery and booking and other supported digital health use cases. See [UHI](/docs/main/docs/uhi/v1).

### WASA

Web Application Security Assessment (WASA) is a security assessment performed by a CERT-In-empanelled auditor on the relevant application environment. The assessment supports issuance of the required security documentation for production onboarding under ABDM. See [Security audit](/docs/main/docs/hiecm/v3/getting-started/security-audit).

## On UHI

These terms belong to UHI: the two applications on either side of a booking.

### EUA

End User Application: in [UHI](#uhi), the consumer facing side, the app a patient or a caregiver uses to search for a service and book it. It sends a signed request to the UHI gateway and receives responses at its own callback URL. See [UHI](/docs/main/docs/uhi/v1).

### HSPA

Health Service Provider Application: in [UHI](#uhi), the provider side system that receives requests and responds to them, such as an ambulance operator's dispatch platform, a blood bank management system or a pharmacy's stock system. It is the counterpart of the [EUA](#eua).
