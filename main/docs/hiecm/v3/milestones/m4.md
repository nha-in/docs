# Milestone 4 (M4): Register Healthcare Professionals and Facilities

Milestone 4 is the Registries milestone, commonly referred to as NHPR (National Healthcare Professionals and Facilities Registry). It establishes the identity of healthcare professionals and the details of healthcare facilities within the ABDM ecosystem.

The Healthcare Professionals Registry (HPR) is a comprehensive repository of registered and verified healthcare professionals. It includes doctors from various Systems of Medicine, including Modern Medicine, Dentistry, Ayurveda, Unani, Siddha, Sowa-Rigpa and Homeopathy, as well as Nurses and Pharmacists delivering healthcare services across India. A healthcare professional registers on the Healthcare Professionals Registry (HPR) and is issued a unique [HPID](/docs/main/docs/hiecm/v3/getting-started/glossary#hpid).

Health Facility Registry (HFR) is a comprehensive repository of health facilities across the country, covering both modern and traditional systems of medicine. It includes public and private health facilities such as hospitals, clinics, diagnostic laboratories, imaging centres, pharmacies, and other healthcare establishments. A healthcare facility is onboarded to the Health Facility Registry (HFR) and is issued a unique Facility ID.

Neither [HPR](/docs/main/docs/hiecm/v3/getting-started/glossary#hpr) nor [HFR](/docs/main/docs/hiecm/v3/getting-started/glossary#hfr) is responsible for moving health records. Instead, these registries establish who the healthcare professional is and what the healthcare facility is, providing a verified identity and facility layer for subsequent ABDM transactions and health-record flows.

## Relationship with M2 and M3

M2 and M3 require a Facility ID in the production environment. Milestone 4 provides the registry layer through which this Facility ID can be obtained. There are two primary routes for facility onboarding:

- **NHPR Portal:** Facilities can be registered directly through the NHPR portal.
- **M4 APIs:** Products can integrate with the M4 APIs to register.

## HPR and HFR dependency

The HP-ID registration comes first for the API-based facility onboarding flow. Facility onboarding requires an HPR token, which is associated with a healthcare professional having a valid HPID.

Key identifiers include:

- **HPID:** 14-digit identifier issued to a registered healthcare professional.
- **Facility ID:** 12-character identifier beginning with `IN`, issued to a registered healthcare facility.

## M4 scope and capabilities

| Capability             | Key output                                                                                                                                                                                              | Target user                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| HPID creation          | A 14 digit HPID, issued after Aadhaar authentication                                                                                                                                                    | Doctors, nurses, pharmacists, and facility managers                                                     |
| Register professional  | A complete HPR profile, including qualifications, council registration, and current work details                                                                                                        | Healthcare professionals after HP-ID creation                                                           |
| Facility onboarding    | A 12 character unique Facility ID for registration in the HFR                                                                                                                                           | Hospitals, clinics, laboratories, imaging centres, pharmacies, blood banks, and other health facilities |
| Bridge linkage         | A link between a Facility ID and one or more bridges, each identified as a [HIP](/docs/main/docs/hiecm/v3/getting-started/glossary#hip) or [HIU](/docs/main/docs/hiecm/v3/getting-started/glossary#hiu) | A facility whose software is going live                                                                 |
| Search and master data | Facility search and nearby search                                                                                                                                                                       | Anyone building either of the above                                                                     |

## Intended users

- **Facilities going live.** A facility must be registered in the HFR and have a bridge linked to it to share health information as a HIP or retrieve it as an HIU. For facilities that have implemented [M2 (Attach)](/docs/main/docs/hiecm/v3/milestones/m2) or [M3 (Retrieve)](/docs/main/docs/hiecm/v3/milestones/m3), M4 is the next step towards production readiness.
- **Professionals registering.** An HPR ID provides a verified professional identity within ABDM. Currently, registration is available for three categories: doctors, nurses and pharmacists.
- **Software acting for others.** An [HMIS](/docs/main/docs/hiecm/v3/getting-started/glossary#hmis) or practice management product can drive these calls for its own customers.

## How HPR and HFR work together

HPR and HFR represent two connected parts of the healthcare ecosystem. HPR enables healthcare professionals to register and maintain their professional identity and profile, while HFR enables hospitals, clinics, laboratories, pharmacies, and other healthcare facilities to register and maintain their facility information.

Once a facility is registered in the HFR, healthcare professionals can link their professional profile to that facility as their place of work. Similarly, an HPR-registered professional can declare the HFR facility where they currently work. This creates a connection between who provides healthcare and where healthcare is provided, allowing professionals and facilities to be linked within the ABDM ecosystem.

## Build M4 with an AI coding assistant

The M4 skill gives an AI coding assistant this milestone as one file: every M4 call with its fields and identifiers. Install it, or open it in your assistant in one click.

M4 agent skill

Every M4 call in one file: 100 operations.

[SKILL.md](/docs/main/skills/abdm-m4/SKILL.md "The router. Use the command below to take the references with it.")

- ScaffoldBuilds the module flow by flow against the sandbox.
- Integrate104 operations, with their hosts and headers.
- DebugNo error code is recorded yet.

`mkdir -p .claude/skills/abdm-m4/references && curl -fsSL https://nha-in.github.io/docs/main/skills/abdm-m4/SKILL.md -o .claude/skills/abdm-m4/SKILL.md && for f in scaffold integrate debug; do curl -fsSL https://nha-in.github.io/docs/main/skills/abdm-m4/references/$f.md -o .claude/skills/abdm-m4/references/$f.md; done`

[Open in Claude](claude://code/new?q=Install%20the%20ABDM%20M4%20agent%20skill%20into%20this%20project%2C%20then%20help%20me%20use%20it.%0A%0ARun%20this%3A%0Amkdir%20-p%20.claude%2Fskills%2Fabdm-m4%2Freferences%20%26%26%20curl%20-fsSL%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fmain%2Fskills%2Fabdm-m4%2FSKILL.md%20-o%20.claude%2Fskills%2Fabdm-m4%2FSKILL.md%20%26%26%20for%20f%20in%20scaffold%20integrate%20debug%3B%20do%20curl%20-fsSL%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fmain%2Fskills%2Fabdm-m4%2Freferences%2F%24f.md%20-o%20.claude%2Fskills%2Fabdm-m4%2Freferences%2F%24f.md%3B%20done%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

Drops the skill into this project. Claude loads it when a task matches.

How to use it

1. Run the command above in the repository you are integrating.
2. Ask your agent for the job in your own words. "Onboard this facility to the HFR and link its HIP bridge". The skill loads when the task matches it.
3. Check what it writes against these pages. The skill carries the facts, not the sandbox: nothing in it has been run against ABDM.
4. Open in Claude needs that app installed. It fills the composer and waits: nothing runs until you read it and press Enter.

## Certification

M4 does not have a separate certification process. A single exit process covers the complete integration and is conducted once all the required milestones for your role are working end to end.

The [Going live](/docs/main/docs/hiecm/v3/getting-started/going-live) process outlines the four steps involved and the requirements for each step. The cases used for certification are covered under the M4 testing use cases, in [Developer resources](/docs/main/docs/hiecm/v3/resources).

## The journey, step by step

Milestone 4 (M4) of [ABDM](/docs/main/docs/hiecm/v3/getting-started/glossary#abdm) covers the following key journeys:

- **HP-ID Creation and Role Selection.** A healthcare professional completes Aadhaar authentication and creates an HP-ID ([HPID](/docs/main/docs/hiecm/v3/getting-started/glossary#hpid)). The professional then selects the required role: [HPR](/docs/main/docs/hiecm/v3/getting-started/glossary#hpr), [HFR](/docs/main/docs/hiecm/v3/getting-started/glossary#hfr), or Both.
- **HPR Registration.** If HPR is selected, the professional completes the required details, including personal details, qualification details, registration details and work details.
- **HFR Registration.** If HFR is selected, the professional completes the Health Facility Registry (HFR) registration form with the required facility details.
- **HPR + HFR Registration.** If Both is selected, the professional completes the HFR registration followed by the HPR registration.
- **Facility Software Integration.** A registered facility can link its Bridge to the Facility ID, enabling it to publish health records as a [HIP](/docs/main/docs/hiecm/v3/getting-started/glossary#hip) and retrieve records as an [HIU](/docs/main/docs/hiecm/v3/getting-started/glossary#hiu) through its software.

| Journey      | Sequence                                                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HPR Journey  | Aadhaar Authentication → Role Selection → HP-ID Creation → HPR Registration                                                                                 |
| HFR Journey  | Aadhaar Authentication → Role Selection → HP-ID Creation → HFR Registration → Facility Software Integration as HIP/HIU, where applicable                    |
| Both Journey | Aadhaar Authentication → Role Selection → HP-ID Creation → HFR Registration → HPR Registration → Facility Software Integration as HIP/HIU, where applicable |

## Journey 1: creating an HPID for a professional

### Aadhaar authentication

```mermaid
sequenceDiagram
    autonumber
    actor P as Professional
    participant S as Your system
    participant H as HPR service
    Note over S: Base URL https://apihspsbx.abdm.gov.in/v4/int,<br/>with Authorization Bearer from POST /api/hiecm/gateway/v3/sessions
    S->>H: POST /aadhaar/generateLink<br/>scopes, source
    H-->>S: txnId, redirect URL (valid five minutes)
    S->>P: Redirect to the hosted Aadhaar page
    P->>H: Enters the Aadhaar number, verifies the Aadhaar OTP
    loop Until authenticated or the URL expires
        S->>H: POST /aadhaar/isAuthenticated<br/>txnId
        H-->>S: true or false
    end
    S->>H: POST /v2/registration/aadhaar/verifyOTP<br/>txnId
    H-->>S: name, gender, birthdate, photo,<br/>mobileNumber (masked), pincode
    S->>H: POST /v1/registration/aadhaar/checkHpIdAccountExist<br/>txnId
    H-->>S: hprIdNumber and token if an HP-ID exists, else none
```

The professional authenticates using Aadhaar. The integrating system does not handle the Aadhaar number or [OTP](/docs/main/docs/hiecm/v3/getting-started/glossary#otp). Instead, it handles the transaction ID and redirects the user to the URL returned by the HPR service.

The URL is valid for five minutes. If it expires before authentication is completed, call Generate Aadhaar Link again to obtain a new authentication URL. After authentication the professional selects the role to register for: HPR, HFR, or both.

### Login using Mobile number and OTP or credentials

```mermaid
sequenceDiagram
    autonumber
    participant S as Your system
    participant H as HPR service
    alt An HP-ID exists for this Aadhaar
        S->>H: POST /api/v1/auth/authPassword, or<br/>POST /api/v2/auth/loginViaMobileSendOTP
        H-->>S: Token, the professional is logged in
    else No HP-ID yet
        S->>H: POST /v2/registration/aadhaar/demographicAuthViaMobile<br/>txnId, mobileNumber (encrypted with the key<br/>from GET /api/v1/auth/cert)
        H-->>S: verified true or false
        opt verified is false
            S->>H: POST /v1/registration/aadhaar/generateMobileOTP<br/>mobile, txnId
            H-->>S: txnId, OTP sent
            S->>H: POST /v1/registration/aadhaar/verifyMobileOTP<br/>otp, txnId
            H-->>S: Mobile number verified
        end
        S->>H: POST /v1/registration/aadhaar/hpid/suggestion<br/>txnId
        H-->>S: Suggested HP-IDs
        S->>H: POST /v2/registration/aadhaar/createHprIdWithPreVerified<br/>txnId, idType hpr_id, domainName, email,<br/>name, password
        H-->>S: HP-ID created, hprToken
        S->>H: POST /profile/updateRole<br/>hprId, category and sub-category:<br/>the role, HPR, HFR or Both
        H-->>S: Role recorded. HPR continues in Journey 2,<br/>HFR in Journey 3, Both does HFR then HPR
    end
```

If an HP-ID already exists, the professional is already registered. The system should authenticate the professional and proceed directly to login, skipping the HP-ID creation journey.

A returning professional can also log in without Aadhaar authentication using either a Mobile OTP, or a Password. Both login mechanisms are covered under the M4 Operations and Fields: see [HPR authentication](/docs/main/docs/hiecm/v3/api/m4/endpoints/m4-authentication/01-m4-post-v1-auth-authpassword) in the M4 API reference.

If no HP-ID exists, the mobile number must be verified before creating the HP-ID.

1. Fetch the public certificate from `/v4/int/api/v1/auth/cert`.
2. Encrypt the mobile number using `RSA/ECB/PKCS1Padding`.
3. Send the encrypted value in the API request.

Create HPID returns a `token`. The register professional call carries an `hprToken` in its payload.

## Journey 2: registering a professional on HPR

```mermaid
sequenceDiagram
    autonumber
    participant S as Your system
    participant H as HPR service
    Note over S: Holds the HPR token from Journey 1
    S->>H: GET /apis/v1/masters/medical-councils, courses,<br/>colleges, universites, states, district, languages
    H-->>S: Code lists
    S->>H: POST /apis/v1/doctors/register-professional-new<br/>hprToken, practitioner {healthProfessionalType,<br/>officialMobile, officialEmail, personal,<br/>qualification,
    H-->>S: hprId, referenceNumber, status
    S->>H: POST /apis/v1/doctors/fetch-documents-list<br/>hprid
    H-->>S: documentList {profileDetails, qualificationDetails,<br/>registrationDetails}
    S->>H: POST /apis/v1/uploads/upload-document<br/>hpr_token, document [document_id, document_type,<br/>fileType, data]
    H-->>S: degreeCertificate, registrationCertificate,<br/>proofOfWorkCertificate {status, msg}
    S->>H: POST /apis/v1/doctors/fetch-professional-info<br/>practitioner {id}
    H-->>S: practitioners [identifier, registrations,<br/>qualifications, hpr_id]
```

The HP-ID is an identity, not a professional profile. The professional profile is created through the registration process, which captures details such as qualifications, council registration, and current work information. Professional registration requires the HPR Token returned from Journey 1.

The following documents are mandatory for upload: the qualification degree certificate, and the registration certificate. A proof of work certificate is mandatory for professionals working in government, or in both government and private settings.

The registration API requires codes rather than names. Therefore, the application must first fetch the relevant master data through the respective master APIs and use the corresponding codes during registration. Master data includes council, course, college, university, state, district and language.

## Journey 3: onboarding a facility to the HFR

```mermaid
sequenceDiagram
    autonumber
    actor M as Facility manager (HP-ID)
    participant S as Your system
    participant H as HFR service
    M->>S: Logs in with HPR credentials
    Note over S: Holds the HPR token, sent as x-hprid-auth
    S->>H: POST /search/address/filter/deduplicate<br/>name, address, district, subDistrict, village,<br/>geolocation
    H-->>S: Matching facilities, if any
    Note over S,H: Stop here if the facility is already registered
    S->>H: POST /v1.5/facility/basic-information<br/>header x-hprid-auth,<br/>facilityInformation {facilityName,<br/>facilityAddressDetails (LGD codes),
    H-->>S: trackingId (the Facility ID,<br/>masked until submission), status
    S->>H: POST /v1.5/facility/additional-information<br/>trackingId, linkedProgramIds {nin, abpmjayId,<br/>rohiniId, echsId, cghsId},<br/>generalInformation {hasPharmacy, hasBloodBank,
    H-->>S: trackingId, status
    S->>H: POST /v1.5/facility/detailed-information<br/>trackingId, specialities [systemOfMedicineCode,<br/>specialities],<br/>medicalInfrastructure (bed and ventilator counts)
    H-->>S: trackingId, status
    S->>H: POST /v1.5/facility/submit-facility<br/>headers x-hprid-auth, x-hprid-auth-verifier,<br/>trackingId, sourceOfInformation, facilitySuperUser
    H-->>S: Facility submitted for verification,<br/>Facility ID visible once approved
```

Onboarding consists of one search, three updates, and a final submission, with each update adding another layer of facility details. If you stop before submission, the facility remains in Draft status and is not visible on ABDM.

The first update captures the basic facility information and creates a Facility ID. The Facility ID is retained throughout the onboarding flow, but remains masked until the facility is fully submitted. Once submission is complete, the Facility ID becomes visible. The API returns it as `trackingId`, and that is the value every later update carries.

### What each update carries

| Call                       | Information captured                                                                                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Basic facility information | Facility name, ownership, system of medicine, facility type and subtype, address with LGD codes, contact details, board and building photographs, and operating hours                                         |
| Additional information     | Availability of services and units such as a pharmacy, blood bank, dialysis centre, cath lab, diagnostic laboratory, or imaging centre, along with scheme identifiers such as ABPMJAY, ROHINI, ECHS, and CGHS |
| Detailed information       | Specialities by system of medicine, bed and ventilator counts, and applicable sections for pharmacy, blood bank, diagnostic laboratory, and imaging services, based on the facility type                      |
| Submit facility            | Captures the tracking ID and optional source of information, and moves the facility application out of Draft status                                                                                           |

The mandatory fields under detailed information vary based on the facility type, service type, and system of medicine selected during registration. Diagnostic laboratories, imaging centres, blood banks and pharmacies do not require medical infrastructure counts, such as bed or ventilator counts.

### OTP based facility verification

```mermaid
sequenceDiagram
    autonumber
    participant S as Your system
    participant H as HFR service
    S->>H: POST /v1.5/facility/sendOtpToContact<br/>facilityId
    H-->>S: transactionId,<br/>OTP sent to the facility contact number
    S->>H: POST /v1.5/facility/validateOtp<br/>facilityId, sourceId, otp, source, transactionId
    H-->>S: Validation result
```

A shorter verification flow is available for government programmes. An OTP is sent to the contact number registered against the Facility ID, which is then validated to complete verification.

## Journey 4: linking bridges to a facility

### Facility-Bridge linkage

```mermaid
sequenceDiagram
    autonumber
    participant S as Your system
    participant H as HFR service
    Note over S: Facility ID, 12 characters beginning with IN,<br/>bridgeId from your sandbox registration
    S->>H: POST /v1/bridges/MutipleHRPAddUpdateServices<br/>facilityId, facilityName, HRP [{bridgeId,<br/>hipName (15 characters or fewer,<br/>unique per facility), type HIP or HIU, active true}]
    H-->>S: Linkage result per bridge
    Note over S,H: One call carries every bridge for the facility. Repeat it to add a bridge or set active false.
```

A Facility ID alone does not enable health record exchange. The facility must be linked to a bridge, with each linkage designated as either a HIP or an HIU.

- A single facility can be linked to multiple bridges.
- A single bridge can be linked to multiple facilities. See [one bridge, many facilities](/docs/main/docs/hiecm/v3/concepts/how-it-fits#one-bridge-many-facilities).
- The HIP/HIU role is defined for each facility-Bridge linkage.
- Integration-level configurations are set once, while facility-specific configurations are maintained separately for each linked facility.

The HIP name is the name displayed to patients in their [ABHA](/docs/main/docs/hiecm/v3/getting-started/glossary#abha) or [PHR](/docs/main/docs/hiecm/v3/getting-started/glossary#phr) app when they search for a hospital. The following rules apply to the HIP name:

- Maximum 15 characters
- No special characters
- Must be unique for every Bridge linked to the same facility

For example, the HIP name can be derived by combining the hospital name and Bridge name, while ensuring that the above naming rules are met.

A facility with a Facility ID and a linked HIP bridge can perform [M2](/docs/main/docs/hiecm/v3/api/m2) activities, including linking care contexts and sharing health records. A facility with a linked HIU bridge can perform [M3](/docs/main/docs/hiecm/v3/api/m3) activities, including requesting patient consent and fetching health records. M4 covers the registration of the facility and the healthcare professionals working at the facility.

Next: [M4 API reference](/docs/main/docs/hiecm/v3/api/m4).

## Next

- The base URLs and the operation list: [M4 API reference](/docs/main/docs/hiecm/v3/api/m4).
- The patient side of all four: [P1 Identity and profile](/docs/main/docs/hiecm/v3/milestones/p1).
- Take your integration to production: [Go live](/docs/main/docs/hiecm/v3/getting-started/going-live).
