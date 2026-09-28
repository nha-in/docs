# API references

The ABDM API Reference section provides comprehensive technical documentation for integrating with various ABDM building blocks and services. These APIs enable healthcare providers, health applications, technology partners, and other ecosystem participants to securely exchange health information and deliver ABDM-compliant digital health services.

All APIs are designed in accordance with ABDM standards and support secure, consent-based, and interoperable health data exchange across the digital health ecosystem.

## About the API documentation

The API Reference provides:

- Detailed endpoint specifications
- Request and response schemas
- Authentication and authorization requirements
- API workflows and integration patterns
- Callback and webhook specifications
- Error codes and handling guidelines
- Sample requests and responses
- Implementation and onboarding guidance

Integrators should refer to the relevant API reference sections based on the ABDM services they intend to implement.

## Core ABDM API modules

### Gateway session

Gateway APIs facilitate secure communication between ABDM participants and support authentication, session management, routing, and certificate-based interactions within the ABDM ecosystem.

**Typical use cases**

- Gateway registration and connectivity
- Session establishment
- Certificate management
- Secure participant communication

4 endpoints across 2 use cases: Bridge, Session. Each endpoint has its own page in the sidebar.

[Open the Gateway session overview](/docs/pr-54/docs/hiecm/v3/api/gateway/), or download the whole specification as [YAML](/docs/pr-54/assets/files/hiecm-gateway-ba18901bf9266735469dae90e78b7b58.yaml) or [JSON](/docs/pr-54/assets/files/hiecm-gateway-dbcc76a0fa49950348ac2b407b2363b5.json).

### M1 Identity

Milestone 1 APIs enable the creation, authentication, verification, and management of ABHA accounts.

**Key capabilities**

- ABHA creation
- ABHA authentication and login modes
- ABHA profile management
- ABHA-related services and operations

122 endpoints across 10 use cases: Create ABHA, Child ABHA, Login, Profile, ABHA Card & Profile, Find ABHA, Forgot ABHA, Benefit, Access Tokens & Encryption, ABHA Address Login. Each endpoint has its own page in the sidebar.

[Open the M1 Identity overview](/docs/pr-54/docs/hiecm/v3/api/m1/), or download the whole specification as [YAML](/docs/pr-54/assets/files/hiecm-m1-b620cf9254228642afdc4000ef5bae6f.yaml) or [JSON](/docs/pr-54/assets/files/hiecm-m1-a76ef094d8e0248b1113549f79cdce1b.json).

### M2 Health Information Provider

Milestone 2 APIs are intended for Health Information Providers (HIPs) to participate in consent-based health information exchange.

**Key capabilities**

- Health record linking
- Care context management
- Patient discovery and identification

20 endpoints across 5 use cases: Link token, HIP initiated linking, User initiated linking, Consent and data flow, Callbacks. Each endpoint has its own page in the sidebar.

[Open the M2 Health Information Provider overview](/docs/pr-54/docs/hiecm/v3/api/m2/), or download the whole specification as [YAML](/docs/pr-54/assets/files/hiecm-m2-74088703cf39a9ba3dbfc4381e054a2f.yaml) or [JSON](/docs/pr-54/assets/files/hiecm-m2-7c31c86a880e3d7fc55f4ab5e855de0a.json).

### M3 Health Information User

Milestone 3 APIs enable Health Information Users (HIUs) to request and access health information after obtaining citizen consent.

**Key capabilities**

- Consent request management
- Consent-based data access
- Health information retrieval
- Secure health data exchange

12 endpoints across 2 use cases: Consent and data flow, Callbacks. Each endpoint has its own page in the sidebar.

[Open the M3 Health Information User overview](/docs/pr-54/docs/hiecm/v3/api/m3/), or download the whole specification as [YAML](/docs/pr-54/assets/files/hiecm-m3-709b5f84b6dfb0c30b64ee9c2a8b0608.yaml) or [JSON](/docs/pr-54/assets/files/hiecm-m3-278ad865729bdba9c369cde0590ef1bd.json).

### M4 Registry Integration

Milestone 4 APIs support interaction with ABDM healthcare registries.

**Key components**

- Health Professional Registry (HPR)
- Health Facility Registry (HFR)
- Registry search and verification
- Healthcare professional onboarding
- Healthcare facility registration and management

87 endpoints across 4 use cases: HPID, HPR, HFR, HRP bridge services. Each endpoint has its own page in the sidebar.

[Open the M4 Registry Integration overview](/docs/pr-54/docs/hiecm/v3/api/m4/), or download the whole specification as [YAML](/docs/pr-54/assets/files/hiecm-m4-9ebbd05030e0f03c0be9c43eb38c782a.yaml) or [JSON](/docs/pr-54/assets/files/hiecm-m4-c0138371d8558d0db46449a5d3b70aae.json).

### P1 Registration and login

Personal Health Record (PHR) APIs support applications that provide citizens with access to and control over their health information. P1 supports onboarding and authentication of users within ABDM-enabled PHR applications.

42 endpoints across 4 use cases: PHR certificate and session token, Create ABHA number, Aadhaar OTP, Create ABHA address, PHR login. Each endpoint has its own page in the sidebar.

[Open the P1 Registration and login overview](/docs/pr-54/docs/hiecm/v3/api/p1/), or download the whole specification as [YAML](/docs/pr-54/assets/files/hiecm-p1-443cfdcacc68db1a7d1a9b891d901118.yaml) or [JSON](/docs/pr-54/assets/files/hiecm-p1-475edb87165916402cace6252e3273e8.json).

### P2 Consents Management

P2 supports management of citizen health accounts and digital health interactions.

**Key capabilities**

- Profile management
- Health record linking
- Consent management
- Patient information sharing
- Account administration

46 endpoints across 5 use cases: PHR profile, Link ABHA number, Quick OPD Registration, User initiated linking, Consent manager. Each endpoint has its own page in the sidebar.

[Open the P2 Consents Management overview](/docs/pr-54/docs/hiecm/v3/api/p2/), or download the whole specification as [YAML](/docs/pr-54/assets/files/hiecm-p2-b23da9a11f9d6c5a122265f96d1cc41c.yaml) or [JSON](/docs/pr-54/assets/files/hiecm-p2-59c0897d4d812579600ffdd952461ec3.json).

### P3 Subscription

Subscription APIs enable healthcare applications and ecosystem participants to manage ABDM notification and subscription workflows.

**Key capabilities**

- Subscription management
- Event notifications
- Consent-related updates
- Status alerts and communication workflows

14 endpoints across 2 use cases: Subscription request and notifications, HIU side, Subscription approval and management, PHR side. Each endpoint has its own page in the sidebar.

[Open the P3 Subscription overview](/docs/pr-54/docs/hiecm/v3/api/p3/), or download the whole specification as [YAML](/docs/pr-54/assets/files/hiecm-p3-d279ccd6f04d13d13e82636fc1282982.yaml) or [JSON](/docs/pr-54/assets/files/hiecm-p3-ef7d61169fa1460b4cedce84f206b34e.json).

### P4 Locker

Health Locker APIs enable secure storage and management of digital health documents in ABDM-compliant locker systems.

**Key capabilities**

- Document storage
- Document retrieval
- Health record management
- Secure document access

5 endpoints across 1 use case: Locker. Each endpoint has its own page in the sidebar.

[Open the P4 Locker overview](/docs/pr-54/docs/hiecm/v3/api/p4/), or download the whole specification as [YAML](/docs/pr-54/assets/files/hiecm-p4-2c1fb3e6f7fc12726eba81e9117c5152.yaml) or [JSON](/docs/pr-54/assets/files/hiecm-p4-d7a953b65a214bea23045b013725b6d6.json).

### Scan and Register

Scan and Register APIs support digital registration and patient onboarding experiences at healthcare facilities.

**Key capabilities**

- QR code-based patient identification
- Digital registration workflows
- Patient data sharing with consent
- Faster healthcare facility onboarding experiences

2 endpoints across 1 use case: Scan and register. Each endpoint has its own page in the sidebar.

[Open the Scan and Register overview](/docs/pr-54/docs/hiecm/v3/api/scan-and-register/), or download the whole specification as [YAML](/docs/pr-54/assets/files/hiecm-scan-and-register-26d8b739947a414d2afef0ba752fac38.yaml) or [JSON](/docs/pr-54/assets/files/hiecm-scan-and-register-afc462f5a2aad06e3cd9115264f0dd66.json).

### Patient scan and record share

11 endpoints across 1 use case: Record share. Each endpoint has its own page in the sidebar.

[Open the Patient scan and record share overview](/docs/pr-54/docs/hiecm/v3/api/record-share/), or download the whole specification as [YAML](/docs/pr-54/assets/files/hiecm-record-share-ea5f42757da87ef7b3fa32ec7382a628.yaml) or [JSON](/docs/pr-54/assets/files/hiecm-record-share-814a76e104f55b25391a32c0e9ab4b7d.json).

### Scan and Pay

18 endpoints across 2 use cases: Scan and pay, Scan and pay details and version update. Each endpoint has its own page in the sidebar.

[Open the Scan and Pay overview](/docs/pr-54/docs/hiecm/v3/api/scan-and-pay/), or download the whole specification as [YAML](/docs/pr-54/assets/files/hiecm-scan-and-pay-c65686a53a18e522fbe23f8fc02c3258.yaml) or [JSON](/docs/pr-54/assets/files/hiecm-scan-and-pay-6c4f141709347838a3f818d17985be84.json).

This API Reference section serves as the central repository for all ABDM integration specifications, helping ecosystem participants build secure, interoperable, and standards-compliant digital health solutions.
