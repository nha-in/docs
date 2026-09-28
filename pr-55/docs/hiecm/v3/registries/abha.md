# ABHA Registry

## ABHA (Ayushman Bharat Health Account): Identity Framework and Digital Health Access under ABDM

The Ayushman Bharat Health Account (ABHA) is a unique health identifier issued under the Ayushman Bharat Digital Mission (ABDM). It serves as the foundational digital identity for individuals within the ABDM ecosystem and enables secure identification, authentication, and exchange of health records.

ABHA facilitates access to digital health services while ensuring interoperability across healthcare providers, health information systems, and personal health applications.

## Components of ABHA

An ABHA account consists of two key identifiers:

### 1. ABHA Number

The ABHA Number is a unique 14-digit identifier assigned to an individual after successful identity verification.

**Key Characteristics**

- Unique to each individual.
- Acts as the primary health identity within ABDM.
- Used for patient identification across healthcare systems.
- Issued after completion of the KYC verification process.
- Always associated with at least one ABHA Address.

### 2. ABHA Address

The ABHA Address is a unique and user-friendly identifier in the format: `user@abdm`

**Key Characteristics**

- Facilitates secure routing of health information and consent requests.
- Can be shared with healthcare providers for record linking and data exchange.
- A default ABHA Address is generated along with every ABHA Number.
- Users may subsequently create a personalized ABHA Address.

## Identity Verification Mechanisms

ABHA creation and authentication are performed through ABDM-approved verification methods.

### Verification Modes

**Aadhaar OTP Authentication**

The individual verifies identity using an OTP sent to the Aadhaar-linked mobile number.

**Face Authentication**

Identity verification is completed using face authentication through approved Aadhaar RD Service Application.

**Biometric Authentication**

Verification using fingerprint or iris through registered biometric devices.

**Demographic Authentication**

Identity validation based on demographic details such as name, date of birth, and gender, as per applicable demo authentication workflows.

## Child ABHA

A Child ABHA enables digital health record creation for children who may not possess an Aadhaar number.

**Key Features**

- Created with consent of a parent or legal guardian.
- Enables continuity of health records from birth.
- Available only through approved government programmes and authorized government entities.
- Not available for private-sector implementation.

## ABHA Address Guidelines

ABHA Addresses must comply with defined validation standards.

**Permitted Characters**

- Alphabetic characters (A-Z)
- Numeric characters (0-9)
- Dot (.)

**Validation Rules**

- Cannot begin with a numeric character.
- Cannot begin or end with a dot (.).
- Must conform to ABDM validation requirements at the time of creation.
- Mobile numbers cannot be used directly as ABHA Addresses.

Organizations should rely on ABDM validation services to verify address eligibility.

## Information Associated with an ABHA

An ABHA profile may contain the following information:

| Field Category      | Description                                    |
| ------------------- | ---------------------------------------------- |
| Personal Details    | Name, gender, date of birth                    |
| Contact Information | Mobile number and verified email (if provided) |
| ABHA Details        | ABHA Number and ABHA Address                   |
| Profile Information | Profile photograph (if available)              |
| Digital Assets      | ABHA Card and associated QR Code               |

## Role of ABHA Across ABDM Milestones

### Milestone 1 (M1) - ABHA Management

M1 focuses on:

- ABHA creation
- Identity verification
- Login and authentication
- Profile management
- Session management

**Supported Login Options**

- Mobile Number
- Aadhaar Number
- ABHA Number
- ABHA Address

### Milestone 2 (M2) - Care Context Linking

M2 enables healthcare providers to link care contexts with an individual's ABHA Address, facilitating discovery and record association.

### Milestone 3 (M3) - Consent Management

M3 enables consent-based health information exchange by using the ABHA Address as the identifier for raising and managing consent requests.

## Importance of ABHA in ABDM

ABHA is the foundational identity layer of the ABDM ecosystem. It enables:

- Unique patient identification.
- Secure authentication.
- Health record discovery and linking.
- Consent-based health information exchange.
- Interoperable digital health services across India.

Every ABDM health information exchange workflow begins with a valid ABHA identity, making it a critical component of the national digital health ecosystem.
