# M1 Identity: Create and verify ABHA

Milestone 1 focuses on the creation and management of [ABHA](/docs/pr-83/docs/hiecm/v3/getting-started/glossary#abha), the unique health identifier under [ABDM](/docs/pr-83/docs/hiecm/v3/getting-started/glossary#abdm). This milestone enables the creation of ABHA, authentication of users, and retrieval or updating of ABHA profile information through ABDM-compliant workflows. ABHA is a 14-digit unique health identifier issued to an individual upon successful completion of the prescribed verification process. ABHA serves as a foundational component for several ABDM services and workflows. Organizations implementing these services may be required to support ABHA creation and management capabilities, as applicable to their use case.

## In short

Milestone 1 focuses on ABHA creation, authentication, and profile management functionalities within the ABDM ecosystem. No health information exchange or health record sharing is performed as part of this milestone.

- ABDM gateway interactions require successful session establishment and the receipt of a valid access token before invoking protected APIs.
- The framework uses distinct gateway and user access tokens, each serving a specific authentication purpose and requiring usage in accordance with the applicable API specifications.
- Applications should use token validity and expiry parameters returned in API responses and implement appropriate token refresh mechanisms to ensure uninterrupted service continuity.
- Sensitive information, including Aadhaar numbers, mobile numbers, [OTPs](/docs/pr-83/docs/hiecm/v3/getting-started/glossary#otp), and passwords, must be transmitted using RSA encryption in accordance with ABDM security and data protection requirements.

## Capabilities enabled under Milestone 1 (M1)

| Capability                                                                 | What it enables                                                                                                                                                                  |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Session and tokens                                                         | Establish gateway sessions, manage access and refresh tokens, and retrieve public key certificates required for secure ABDM interactions.                                        |
| ABHA creation                                                              | Support creation of ABHA and associated identifiers in accordance with ABDM onboarding and verification workflows.                                                               |
| ABHA login                                                                 | Authenticate an ABHA holder using approved identifiers and authentication mechanisms, including mobile number, Aadhaar number, ABHA number, or ABHA address, as applicable.      |
| Profile management                                                         | Retrieve and manage ABHA profile information, display ABHA credentials and QR codes, update eligible profile attributes, and support re-verification workflows where applicable. |
| [Scan and Register](/docs/pr-83/docs/hiecm/v3/use-cases/scan-and-register) | Support patient registration through QR-based workflows and generate service or queue identifiers in accordance with organization-specific processes.                            |

## Use cases

| Use case                                                                   | What it does                                                                                                                                                                                              |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Scan and Register](/docs/pr-83/docs/hiecm/v3/use-cases/scan-and-register) | A patient scans the QR code at your counter and shares their ABHA profile. Registration needs no typing, every record from the visit links to the right ABHA address, and the patient gets a queue token. |

All use cases, and the milestone each belongs to: [Use cases](/docs/pr-83/docs/hiecm/v3/use-cases).

## Building blocks you use

- The [ABHA registry](/docs/pr-83/docs/hiecm/v3/registries), which holds the ABHA number, address and profile.
- The [HIE-CM](/docs/pr-83/docs/hiecm/v3/getting-started/glossary#hie-cm) gateway, which issues your session token. See [The ABDM gateway](/docs/pr-83/docs/hiecm/v3/concepts/gateway).

## Build M1 with an AI coding assistant

The M1 skill gives an AI coding assistant this milestone as one file: every M1 call, its error codes and its test cases. Install it, or open it in your assistant in one click.

M1 agent skill

Every M1 call, one per use case, with its error codes in one file: 125 operations, 17 codes.

[SKILL.md](/docs/pr-83/skills/abdm-m1/SKILL.md "The router. Use the command below to take the references with it.")

- ScaffoldThe loop that builds the module flow by flow against the sandbox, ending on an observed result rather than on a call returning 200.
- DesignWhat the journey around the calls has to do, and what a screen is forbidden to claim.
- Integrate124 operations, with their hosts and headers.
- Debug17 error codes, each with what to do about it.
- TestThe test pyramid, from offline pins up to a live payer on the sandbox.

`mkdir -p .claude/skills/abdm-m1/references && curl -fsSL https://nha-in.github.io/docs/pr-83/skills/abdm-m1/SKILL.md -o .claude/skills/abdm-m1/SKILL.md && for f in scaffold design integrate debug test; do curl -fsSL https://nha-in.github.io/docs/pr-83/skills/abdm-m1/references/$f.md -o .claude/skills/abdm-m1/references/$f.md; done`

[Open in Claude](claude://code/new?q=Install%20the%20ABDM%20M1%20agent%20skill%20into%20this%20project%2C%20then%20help%20me%20use%20it.%0A%0ARun%20this%3A%0Amkdir%20-p%20.claude%2Fskills%2Fabdm-m1%2Freferences%20%26%26%20curl%20-fsSL%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-83%2Fskills%2Fabdm-m1%2FSKILL.md%20-o%20.claude%2Fskills%2Fabdm-m1%2FSKILL.md%20%26%26%20for%20f%20in%20scaffold%20design%20integrate%20debug%20test%3B%20do%20curl%20-fsSL%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-83%2Fskills%2Fabdm-m1%2Freferences%2F%24f.md%20-o%20.claude%2Fskills%2Fabdm-m1%2Freferences%2F%24f.md%3B%20done%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

Drops the skill into this project. Claude loads it when a task matches.

How to use it

1. Run the command above in the repository you are integrating.
2. Ask your agent for the job in your own words. "Add ABHA creation by Aadhaar OTP to this codebase", "why am I getting 404". The skill loads when the task matches it.
3. Check what it writes against these pages. The skill carries the facts, not the sandbox: nothing in it has been run against ABDM.
4. Open in Claude needs that app installed. It fills the composer and waits: nothing runs until you read it and press Enter.

## ABHA creation

### ABHA creation by an Aadhaar OTP

The individual provides their Aadhaar number. The ABHA service sends a one time password ([OTP](/docs/pr-83/docs/hiecm/v3/getting-started/glossary#otp)) to the mobile number registered against that Aadhaar. Upon successful verification, the individual selects an ABHA address, and the ABHA number is issued.

Every step answers in its own response, so nothing here waits on a callback. The enrolment call is the one with a lasting effect: it creates the account.

Notes for AI agents

**Before you start.** A gateway access token, the Aadhaar number encrypted with the M1 certificate, the person present to read the OTP, and their consent to create an ABHA.

**What happens.** Request the OTP with scope `abha-enrol` and keep the `txnId`. Enrol with `enrol/byAadhaar`, sending the encrypted OTP, the communication mobile and the consent block. Optionally verify the communication mobile. Fetch suggestions with the `TRANSACTION_ID` header, and claim the chosen address with `preferred` set to 1.

**How you know it worked.** The enrolment response carries `ABHAProfile` with an `ABHANumber`, and the address step returns the chosen address as `preferredAbhaAddress`. An account left with only its default address is a half finished job the person will not recognise later.

**When it goes wrong.** The OTP goes only to the mobile registered against the Aadhaar, which may not be the phone in the room: see [the OTP never arrives](/docs/pr-83/docs/hiecm/v3/troubleshooting/otp-never-arrives). Enrolment for an Aadhaar that already has an ABHA returns that account with `isNew` false, so read `isNew` before telling the person anything was created. Every call failing the same way is a session or header problem: see [everything returns 401](/docs/pr-83/docs/hiecm/v3/troubleshooting/everything-returns-401).

### ABHA creation by face authentication

Individuals who are unable to use OTP-based authentication, including cases where the mobile number linked to Aadhaar is unavailable or inaccessible, may use face authentication as an alternative verification mechanism, subject to ABDM and UIDAI guidelines. Face authentication is performed through authorized Aadhaar Registered Device (RD) services using approved authentication workflows.

ABDM documentation references biometric-based ABHA creation workflows, including face authentication and other supported biometric modalities where applicable. Organizations should implement authentication methods in accordance with the officially published specifications and follow them before proceeding with production deployment.

The middle of this journey happens on the person's phone, not in your system. Show that you are waiting for them rather than a spinner.

Notes for AI agents

**Before you start.** Everything the Aadhaar OTP journey needs, the ABHA app on the person's phone, and a screen that can show a QR code.

**What happens.** Call `enrol/auth/init` for a `txnId` and show it as a QR code. Poll `capturePID` every 5 to 10 seconds: its status moves through PENDING, VERIFIED, FAILED and COMPLETE. On COMPLETE, call `enrol/byAadhaar` with the face auth method and the same `txnId`, then claim an address as in the OTP journey.

**How you know it worked.** `capturePID` reports COMPLETE and `enrol/byAadhaar` returns an `ABHAProfile` with an `ABHANumber`. The capture being accepted is the event, not the app saying the scan succeeded.

**When it goes wrong.** The person has no ABHA app: installing it is part of the journey, not an error. The capture reports FAILED: capture again rather than resubmitting. Nothing pushes the result to you, so keep polling or continue once the person confirms.

### ABHA creation by fingerprint or iris

Aadhaar Biometric-Based ABHA Creation enables users to create an Ayushman Bharat Health Account (ABHA) by securely verifying their identity using biometric authentication through an Aadhaar Registered Device (RD). The RD Service captures the user's biometric data and generates an encrypted, digitally signed PID block, which is submitted along with the Aadhaar details for verification. Upon successful authentication and user consent, the user's profile is validated and a unique ABHA number is generated, enabling secure onboarding into the ABDM digital health ecosystem.

The Registered Device (RD) List and information can be found on the following link: [uidai.gov.in](https://uidai.gov.in/en/ecosystem/authentication-devices-documents/biometric-devices.html).

The calls, in order, are on the [M1 API reference](/docs/pr-83/docs/hiecm/v3/api/m1) under ABHA creation, fingerprint and ABHA creation, iris.

### ABHA creation by demographic authentication

This onboarding pathway is intended for eligible government programme integrations in accordance with ABDM guidelines. Unlike OTP-based or biometric authentication workflows, demographic authentication relies on validation of Aadhaar demographic information, including name, date of birth, and gender, through the prescribed verification process.

The `enrol/byAadhaar` API is invoked with the appropriate authentication method and encrypted demographic details as specified in the implementation guidelines. Implementers should account for the response structure defined for this workflow, including user token handling and ABHA address generation behaviour. A system-generated ABHA address may be assigned during account creation, and organizations may provide users with the option to configure a more user-friendly ABHA address where permitted. Any demographic verification failures should be handled in accordance with the error codes and response specifications published by ABDM.

Notes for AI agents

**Before you start.** Approval for this route, the gateway access token, the M1 certificate, the `Benefit-Name` header value, and the person's name exactly as Aadhaar holds it, with date of birth and gender. A near miss on any of them is a refusal, not a warning.

**What happens.** One call creates the account: `enrol/byAadhaar` with `authMethods` set to `demo_auth` and a `demo_auth` block carrying the encrypted `aadhaarNumber`, `name`, `dateOfBirth`, `gender`, `stateCode` and `districtCode`. If an ABHA already exists for the Aadhaar, the call returns it rather than creating a second.

**How you know it worked.** The response carries the ABHA number and a user token, and the profile read with that token returns the same account. The response has two shapes: the token is either `tokens.token` or a top level `token` beside `healthIdNumber`. Parse both.

**When it goes wrong.** Parsing only `tokens.token` reads nothing from the other shape. The account arrives with a default address nobody can remember, so offer a readable one from the address suggestions.

### Create a child ABHA

ABDM supports guardian-based management of ABHA accounts for eligible children in accordance with applicable policies and implementation guidelines. This functionality is currently made available only to select government integrators, subject to approval by the National Health Authority (NHA). The workflow includes creation of a child ABHA linked to a verified parent or guardian account, updating child profile information, and retrieval of child accounts associated with the parent or guardian.

Notes for AI agents

**Before you start.** Approval for this route, the parent or guardian logged in so you hold their `X-token`, and the child's name, date of birth and gender.

**What happens.** Create with `enrol/byAadhaar`, `authMethods` set to `child`, and a `child` block carrying `name`, `dayOfBirth`, `monthOfBirth`, `yearOfBirth`, `gender` and `parentConsent`, sent with the parent's `X-token` and the `Benefit-Name` header. Correct a child's details through `PATCH /abha/api/v3/profile/account`; a child ABHA without KYC can be updated once. List the children with `/abha/api/v3/enrollment/profile/children`.

**How you know it worked.** The create response carries the child's `ABHANumber`, and listing the parent's children returns that child. The listing is the proof that the account hangs off the right parent.

**When it goes wrong.** The parent's account has reached its limit of child accounts, and the next create is refused. The parent's token has expired, which reads as an authorisation failure rather than a validation one.

## ABHA login via mobile number

ABHA login using a registered mobile number enables individuals to securely access their ABHA-linked profile and services through a mobile OTP-based authentication process. Since a single mobile number may be associated with multiple ABHA accounts, the user may be required to select the appropriate ABHA account after successful verification. Upon completion of the authentication process, authorized access is granted to the individual's ABHA profile and associated services in accordance with ABDM guidelines.

Notes for AI agents

**Before you start.** A gateway access token, the mobile number encrypted with the M1 certificate, and the person present to read the OTP.

**What happens.** Request the OTP with scope `abha-login` and `mobile-verify` and `loginHint` set to `mobile`. Verify it: the response carries a short lived token and `accounts`. Always call `/abha/api/v3/profile/login/verify/user` with the chosen `ABHANumber`, the same `txnId` and that token in the `T-token` header, even when `accounts` holds one entry. It returns the `X-token` profile calls need.

**How you know it worked.** A profile read with the `X-token` returns the account the person expected. With several accounts on one mobile, the account read back is the check, not the presence of a token.

**When it goes wrong.** Several accounts are normal on a shared family phone, so show a chooser. A profile call refused with `ABDM-1094`, X-token expired, on a new token usually means the token from login verify was sent instead of the one from verify user. Never send the gateway session token in `X-token`.

## Find ABHA from mobile number

This workflow enables discovery of an existing ABHA using a registered mobile number when an individual does not readily know their ABHA details. Upon successful verification of the mobile number, the system may return limited, non-sensitive information such as the individual's name, gender, and masked ABHA number, allowing confirmation of whether an ABHA has already been created.

Access to complete profile information and sensitive account details requires successful authentication through approved mechanisms such as OTP, biometric authentication, or face authentication. All identifiers and personal information must be encrypted and processed within the integrating system in accordance with ABDM security, privacy, and data protection requirements. See [encryption](/docs/pr-83/docs/hiecm/v3/concepts/encryption) for how to do it locally.

Notes for AI agents

**Before you start.** A gateway access token, the mobile number the person remembers, encrypted with the M1 certificate, and the person present to read the OTP.

**What happens.** Search with scope `search-abha`. The response carries a `txnId` and the accounts on that mobile, each with an `index`, a masked ABHA number, name and gender. Show those and let the person pick. Request the OTP with `loginHint` set to `index`, the encrypted index as `loginId` and the same `txnId`, then verify it.

**How you know it worked.** Verification succeeds and returns the account the person recognised from the masked details.

**When it goes wrong.** The search finds nothing: the number may hold no ABHA, or the ABHA may sit in the other environment. The person does not recognise any account: stop, because continuing would disclose somebody else's. Never skip the OTP because the search already returned an account: search alone is a lookup of somebody's identity.

## ABHA Profile Management

This functionality enables retrieval and management of an individual's ABHA profile following successful authentication. Authorized users can access profile information, view their ABHA card, and retrieve the associated Quick Response (QR) code, which serves as a digital representation of the ABHA identifier for use across ABDM-enabled healthcare services.

The workflow also supports profile updates in accordance with applicable ABDM guidelines, ensuring that health identity information remains accurate and up to date while complying with prescribed security, privacy, and authentication requirements.

Changing the mobile number is two calls with an OTP to the new number between them: `POST /abha/api/v3/profile/account/request/otp` with scope `abha-profile` and `mobile-verify`, then `POST /abha/api/v3/profile/account/verify` with the same scope and the OTP. Both carry the person's `X-token`.

Notes for AI agents

**Before you start.** The person logged in, so you hold their `X-token`, the new mobile number encrypted with the M1 certificate, and the person holding the new phone.

**What happens.** Request the OTP with scope `abha-profile` and `mobile-verify`, `loginHint` set to `mobile` and the encrypted new number as `loginId`. Verify with the same scope, the `txnId` and the encrypted OTP.

**How you know it worked.** Verify answers with `authResult` success, and a profile read afterwards shows the new number.

**When it goes wrong.** The OTP goes to the new number, not the old one, so a person who cannot receive it there cannot change it. A scope on the verify call that differs from the request is refused: send the same array on both.

## Next

- Register a patient who scanned your counter QR code: [Scan and Register](/docs/pr-83/docs/hiecm/v3/use-cases/scan-and-register).
- The calls, base URLs and error shapes: [M1 API reference](/docs/pr-83/docs/hiecm/v3/api/m1).
- Certification runs once, for the whole integration: [Go live](/docs/pr-83/docs/hiecm/v3/getting-started/going-live).
- The next milestone: [M2 Health Information Provider](/docs/pr-83/docs/hiecm/v3/milestones/m2).

```mermaid
sequenceDiagram
    autonumber
    actor P as Person
    participant S as Your system
    participant A as ABHA service
    Note over S: Holds the gateway access token and the<br/>public key from GET /abha/api/v3/profile/public/certificate
    P->>S: Aadhaar number and consent
    S->>A: POST /abha/api/v3/enrollment/request/otp<br/>scope [abha-enrol], loginHint aadhaar,<br/>loginId (encrypted Aadhaar), otpSystem aadhaar
    A-->>S: txnId
    A-)P: OTP by SMS to the Aadhaar linked mobile
    P->>S: OTP, and the mobile number for ABHA communication
    S->>A: POST /abha/api/v3/enrollment/enrol/byAadhaar<br/>authData.authMethods [otp], otp {txnId,<br/>otpValue (encrypted), mobile}, consent
    A-->>S: ABHAProfile (ABHANumber, name, dob, gender, photo),<br/>tokens.token, isNew
    Note over S,A: Optional: verify the communication mobile
    S->>A: POST /abha/api/v3/enrollment/request/otp<br/>scope [abha-enrol, mobile-verify], loginHint mobile,<br/>loginId (encrypted mobile), txnId
    A-->>S: txnId
    A-)P: OTP by SMS to the communication mobile
    P->>S: Mobile OTP
    S->>A: POST /abha/api/v3/enrollment/auth/byAbdm<br/>scope [abha-enrol, mobile-verify],<br/>authData.authMethods [otp], otp {txnId,<br/>otpValue (encrypted)}
    A-->>S: authResult success, accounts [ABHANumber]
    S->>A: GET /abha/api/v3/enrollment/enrol/suggestion<br/>header TRANSACTION_ID txnId
    A-->>S: abhaAddressList
    P->>S: Picks or types an ABHA address
    S->>A: POST /abha/api/v3/enrollment/enrol/abha-address<br/>txnId, abhaAddress, preferred 1
    A-->>S: healthIdNumber, preferredAbhaAddress
```

```mermaid
sequenceDiagram
    autonumber
    actor P as Person (ABHA app)
    participant S as Your system
    participant A as ABHA service
    S->>A: POST /abha/api/v3/enrollment/enrol/auth/init<br/>scope [abha-enrol]
    A-->>S: txnId
    S->>P: QR code carrying the txnId
    P->>P: Scans the QR code in the ABHA app<br/>Face authentication through the Aadhaar RD service
    S->>A: POST /abha/api/v3/enrollment/enrol/capturePID<br/>txnId, scope [abha-enrol]
    A-->>S: status of the face authentication
    S->>A: POST /abha/api/v3/enrollment/enrol/byAadhaar<br/>authData.authMethods [face], face {txnId,<br/>aadhaar (encrypted), mobile}, consent
    A-->>S: ABHAProfile (ABHANumber, name, dob, gender, photo),<br/>tokens.token, isNew
    Note over S,A: Optional: verify the communication mobile
    S->>A: POST /abha/api/v3/enrollment/request/otp<br/>scope [abha-enrol, mobile-verify], loginHint mobile,<br/>loginId (encrypted mobile), txnId
    A-)P: OTP by SMS to the communication mobile
    P->>S: Mobile OTP
    S->>A: POST /abha/api/v3/enrollment/auth/byAbdm<br/>scope [abha-enrol, mobile-verify],<br/>authData.authMethods [otp], otp {txnId,<br/>otpValue (encrypted)}
    A-->>S: authResult success
    S->>A: GET /abha/api/v3/enrollment/enrol/suggestion<br/>header TRANSACTION_ID txnId
    A-->>S: abhaAddressList
    S->>A: POST /abha/api/v3/enrollment/enrol/abha-address<br/>txnId, abhaAddress, preferred 1
    A-->>S: healthIdNumber, preferredAbhaAddress
```

```mermaid
sequenceDiagram
    autonumber
    actor P as Person
    participant S as Your system
    participant A as ABHA service
    Note over S: Holds the gateway access token and the<br/>public key from GET /abha/api/v3/profile/public/certificate
    P->>S: Aadhaar number, name as per Aadhaar, date of birth,<br/>gender, consent
    S->>S: Encrypts the Aadhaar number with the public key
    S->>A: POST /abha/api/v3/enrollment/enrol/byAadhaar<br/>authData.authMethods [demo_auth],<br/>demo_auth {aadhaarNumber (encrypted), name, dateOfBirth,<br/>gender, stateCode, districtCode, and optionally<br/>mobile, pinCode, address}, consent
    A-->>S: New ABHA: ABHAProfile (ABHANumber,<br/>phrAddress issued by default), tokens.token, isNew.<br/>Existing ABHA: top level token, healthIdNumber, jwtResponse
    S->>A: GET /abha/api/v3/profile/account<br/>header X-token tokens.token
    A-->>S: ABHANumber, preferredAbhaAddress, profile fields
```

```mermaid
sequenceDiagram
    autonumber
    actor P as Person
    participant S as Your system
    participant A as ABHA service
    P->>S: Mobile number
    S->>A: POST /abha/api/v3/profile/login/request/otp<br/>scope [abha-login, mobile-verify], loginHint mobile,<br/>loginId (encrypted mobile), otpSystem abdm
    A-->>S: txnId
    A-)P: OTP by SMS
    P->>S: OTP
    S->>A: POST /abha/api/v3/profile/login/verify<br/>scope [abha-login, mobile-verify],<br/>authData.authMethods [otp], otp {txnId,<br/>otpValue (encrypted)}
    A-->>S: authResult success, token (T-token),<br/>accounts [ABHANumber, name, preferredAbhaAddress]
    P->>S: Picks the account to use
    S->>A: POST /abha/api/v3/profile/login/verify/user<br/>header T-token, ABHANumber, txnId
    A-->>S: token (X-token), expiresIn, refreshToken,<br/>refreshExpiresIn
```

```mermaid
sequenceDiagram
    autonumber
    actor P as Person
    participant S as Your system
    participant A as ABHA service
    P->>S: Mobile number
    S->>S: Encrypts the mobile number with the public key
    S->>A: POST /abha/api/v3/profile/account/abha/search<br/>scope [search-abha], mobile (encrypted)
    A-->>S: txnId, ABHA list (masked ABHA number, name, gender)
    P->>S: Confirms the account to prove
    S->>A: POST /abha/api/v3/profile/login/request/otp<br/>scope [abha-login, search-abha, mobile-verify],<br/>loginHint index, loginId (encrypted index),<br/>otpSystem abdm, txnId
    A-->>S: txnId
    A-)P: OTP by SMS to the registered mobile
    P->>S: OTP
    S->>A: POST /abha/api/v3/profile/login/verify<br/>scope [abha-login, mobile-verify],<br/>authData.authMethods [otp], otp {txnId,<br/>otpValue (encrypted)}
    A-->>S: authResult success, token (X-token), accounts
```

```mermaid
sequenceDiagram
    autonumber
    participant S as Your system
    participant A as ABHA service
    Note over S: Holds the X-token from a login or enrolment response
    S->>A: GET /abha/api/v3/profile/account<br/>header X-token
    A-->>S: ABHANumber, preferredAbhaAddress, name, dob, gender,<br/>mobile, kycVerified
    S->>A: GET /abha/api/v3/profile/account/abha-card<br/>header X-token
    A-->>S: ABHA card image
    S->>A: GET /abha/api/v3/profile/account/qrCode<br/>header X-token
    A-->>S: QR code image
```
