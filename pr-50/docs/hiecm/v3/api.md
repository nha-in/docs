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

[Read the whole specification](/docs/pr-50/reference/hiecm-gateway)

### M1 Identity

Milestone 1 APIs enable the creation, authentication, verification, and management of ABHA accounts.

**Key capabilities**

- ABHA creation
- ABHA authentication and login modes
- ABHA profile management
- ABHA-related services and operations

122 endpoints across 10 use cases: Create ABHA, Child ABHA, Login, Profile, ABHA Card & Profile, Find ABHA, Forgot ABHA, Benefit, Access Tokens & Encryption, ABHA Address Login. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-50/reference/hiecm-m1)

### M2 Health Information Provider

Milestone 2 APIs are intended for Health Information Providers (HIPs) to participate in consent-based health information exchange.

**Key capabilities**

- Health record linking
- Care context management
- Patient discovery and identification

20 endpoints across 5 use cases: Link token, HIP initiated linking, User initiated linking, Consent and data flow, Callbacks. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-50/reference/hiecm-m2)

### M3 Health Information User

Milestone 3 APIs enable Health Information Users (HIUs) to request and access health information after obtaining citizen consent.

**Key capabilities**

- Consent request management
- Consent-based data access
- Health information retrieval
- Secure health data exchange

12 endpoints across 2 use cases: Consent and data flow, Callbacks. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-50/reference/hiecm-m3)

### M4 Registry Integration

Milestone 4 APIs support interaction with ABDM healthcare registries.

**Key components**

- Health Professional Registry (HPR)
- Health Facility Registry (HFR)
- Registry search and verification
- Healthcare professional onboarding
- Healthcare facility registration and management

87 endpoints across 4 use cases: HPID, HPR, HFR, HRP bridge services. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-50/reference/hiecm-m4)

### P1 Registration and login

Personal Health Record (PHR) APIs support applications that provide citizens with access to and control over their health information. P1 supports onboarding and authentication of users within ABDM-enabled PHR applications.

42 endpoints across 4 use cases: PHR certificate and session token, Create ABHA number, Aadhaar OTP, Create ABHA address, PHR login. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-50/reference/hiecm-p1)

### P2 Consents Management

P2 supports management of citizen health accounts and digital health interactions.

**Key capabilities**

- Profile management
- Health record linking
- Consent management
- Patient information sharing
- Account administration

46 endpoints across 5 use cases: PHR profile, Link ABHA number, Quick OPD Registration, User initiated linking, Consent manager. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-50/reference/hiecm-p2)

### P3 Subscription

Subscription APIs enable healthcare applications and ecosystem participants to manage ABDM notification and subscription workflows.

**Key capabilities**

- Subscription management
- Event notifications
- Consent-related updates
- Status alerts and communication workflows

14 endpoints across 2 use cases: Subscription request and notifications, HIU side, Subscription approval and management, PHR side. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-50/reference/hiecm-p3)

### P4 Locker

Health Locker APIs enable secure storage and management of digital health documents in ABDM-compliant locker systems.

**Key capabilities**

- Document storage
- Document retrieval
- Health record management
- Secure document access

5 endpoints across 1 use case: Locker. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-50/reference/hiecm-p4)

### Scan and Register

Scan and Register APIs support digital registration and patient onboarding experiences at healthcare facilities.

**Key capabilities**

- QR code-based patient identification
- Digital registration workflows
- Patient data sharing with consent
- Faster healthcare facility onboarding experiences

2 endpoints across 1 use case: Scan and register. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-50/reference/hiecm-scan-and-register)

### Patient scan and record share

11 endpoints across 1 use case: Record share. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-50/reference/hiecm-record-share)

### Scan and Pay

18 endpoints across 2 use cases: Scan and pay, Scan and pay details and version update. Each endpoint has its own page in the sidebar.

[Read the whole specification](/docs/pr-50/reference/hiecm-scan-and-pay)

This API Reference section serves as the central repository for all ABDM integration specifications, helping ecosystem participants build secure, interoperable, and standards-compliant digital health solutions.
