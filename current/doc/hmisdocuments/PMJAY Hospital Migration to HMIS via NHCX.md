# PMJAY Hospital Migration to HMIS via NHCX

*Source: `hmisdocuments/PMJAY Hospital Migration to HMIS via NHCX.docx` — extracted full content*

## PMJAY Hospital Migration to HMIS via NHCX

## 1. Introduction

### 1.1 Background

PMJAY has established a robust digital ecosystem for processing health insurance claims through standardized workflows and centralized systems. Currently, PMJAY empanelled hospitals submit claims using the NHA-provided TMS Provider, which acts as an intermediary platform for claim processing.

With the introduction of the National Health Claims Exchange (NHCX) under the ABDM framework, a unified, interoperable, and API-driven infrastructure has been established to facilitate seamless claim exchange between providers (hospitals), payers (insurers), and other stakeholders.

NHCX enables hospitals to directly integrate their Hospital Management Information Systems (HMIS) with the national claims exchange ecosystem, thereby eliminating the need for multiple proprietary provider systems.

### 1.2 Problem Statement

Despite the availability of a centralized system (TMS Provider), the current model presents several operational and technical challenges:

Multiple System Dependency - Hospitals often need to interact with different provider systems for various schemes and payers, leading to operational complexity.

Duplication of Effort - Data entry and claim processing workflows are repeated across systems, increasing manual effort and chances of errors.

Limited Integration Flexibility - The TMS Provider model restricts hospitals from leveraging their own HMIS capabilities for end-to-end claim lifecycle management.

Scalability Constraints - As more schemes and payers are onboarded, reliance on a single centralized provider system may lead to scalability and performance challenges.

Lack of Standardized Interoperability Across Schemes - Hospitals are unable to utilize a single interface to interact with multiple payers in a standardized manner.

### 1.3 Objective

The primary objective of this document is to define a detailed, structured, and implementation-ready process for enabling PMJAY hospitals to:

Transition from the NHA TMS Provider system to their own HMIS integrated via NHCX

Establish a secure, API-based communication channel with NHCX

Enable direct claim submission and processing through HMIS

Ensure seamless migration without disruption to existing claims under processing

### 1.4 Scope

This document outlines the end-to-end onboarding and migration process for PMJAY hospitals, covering:

Participant onboarding in NHCX using API-based workflows

Validation mechanisms including OTP-based confirmation

Technical configuration including:

Bridge URL (endpoint configuration)

Encryption certificate setup

Mapping of existing PMJAY Hospital ID with NHCX Participant ID

Go-live readiness and transition to HMIS-based claim submission

Post-migration behavior including dual processing of claims

## 2. Current vs Target Architecture

### 2.1 Current Architecture (TMS-Based)

#### Claims Submission through NHA TMS Provider

#### In the existing PMJAY ecosystem, empaneled hospitals submit insurance claims through the NHA-provided Transaction Management System (TMS Provider). This system acts as an intermediary layer between hospitals and payers, managing the end-to-end claim submission and processing workflow. Hospitals are required to log into or integrate with this centralized platform to initiate and track claims.

#### Limited Integration with Hospital HMIS

The current model offers limited or no direct integration capabilities with hospital HMIS systems. As a result:

Hospitals often need to manually enter or replicate claim data in the TMS Provider system

Existing HMIS workflows are not fully leveraged

Automation and straight-through processing are restricted

This leads to inefficiencies and increases the risk of manual errors.

#### Multiple systems for different schemes

Hospitals typically interact with multiple platforms or provider systems for different insurance schemes and payers. This results in:

Fragmented claim submission processes

Increased training and operational overhead for hospital staff

Lack of a unified interface for handling claims across schemes

### 2.2 Target Architecture (NHCX-Based)

#### Direct Integration of HMIS with NHCX via APIs

In the target state, hospitals integrate their Hospital Management Information System (HMIS) directly with the National Health Claims Exchange (NHCX) using standardized APIs. This enables:

Seamless, system-to-system communication without manual intervention

End-to-end automation of claim lifecycle processes (pre-auth, claim submission, adjudication, status updates)

Real-time exchange of claim data between hospital systems and payers

The HMIS becomes the primary system of interaction, eliminating the need to rely on external provider portals.

#### Participant ID as Digital Identity

In the NHCX ecosystem, each hospital is assigned a Participant ID, which acts as its unique digital identity across all claim transactions.

Key characteristics:

Used for routing requests and responses within NHCX

Replaces dependency on scheme-specific identifiers

Ensures consistent identification across multiple payers

#### Secure and Encrypted Communication via Certificates

All communication between HMIS and NHCX is secured using public key encryption mechanisms, ensuring: Data confidentiality, Integrity of claim information, Protection against unauthorized access.

## 3. Onboarding Process

### 3.1 Participant Creation(Step 1)

Participant Creation is the first and most critical step in onboarding a hospital into the NHCX ecosystem. This step establishes a unique digital identity (Participant ID) for the hospital, which is subsequently used for:

Claim submission and routing

Communication with payers

Identification across all NHCX transactions

3.1.1 API specifications

API Endpoint:
POST /pmjay/hcx/participanthcxservice/v2/participant/create

Invoked By:
Hospital / System Integrator (via HMIS or integration layer)

Processed By:
NHCX

### Request Payload

{

"registrytype": "10001",

"registryid": "HFR123456",

"role": ["10001"],

"endpoint_url": "",

"mobilenumber": "9876543210",

"email": "hospital@example.com"

}

### Field Description

| Field | Description | Mandatory | Remarks |
|---|---|---|---|
| registrytype | Source registry identifier | Yes | 10001 for HFR |
| registryid | Unique hospital ID in registry | Yes | Must exist in HFR |
| role | Role of participant | Yes | 10001 = Provider |
| mobilenumber | Registered mobile number | Yes | Must match HFR record |
| email | Official email ID | Yes | Used for communication |
| endpoint_url | Callback URL | No | Configured in later step |

3.1.2 Validation Rules (Critical for Success)

#### A. Registry Validation

Must be a valid enum:

10001 → HFR

10002 → NIN

10003 → ROHINI

10004 → PAYER

For PMJAY hospitals: HFR (10001) is mandatory

#### B. Role Validation

Must be: 10001 → PROVIDER

Any other role will result in API rejection

#### C. Mobile Number Validation (Most Critical Check)

The mobile number provided must:

- Exist in NHCX system

- Match exactly with HFR registered mobile number

#### D. Duplicate Participant Check

If participant already exists for given registry ID , API may reject or return existing participant.

3.1.3 Response Payload (Detailed Sample)

After successful validation, /participate/create API will respond with the following details.

{

"participantid": "abc123@hcx",

"facilityname": "ABC Hospital",

"facilitycontact": "9876543210",

"facilityemail": "hospital@example.com",

"transactionid": "txn123456",

"error": {

"code": null,

"message": null,

"trace": null

}

}

| Field | Description |
|---|---|
| participantid | Unique identity assigned by NHCX |
| facilityname | Hospital name |
| facilitycontact | Registered mobile |
| facilityemail | Registered email |
| transactionid | Required for OTP validation |
| error | Null if successful |

Following is the behavior of the system.

- Participant is created in PENDING state

- OTP (passcode) is sent to registered mobile

- Transaction ID is generated

- System awaits confirmation

3.1.4 Failure scenarios and handling

| Scenario | Cause | Action |
|---|---|---|
| Invalid registry | Wrong enum | Correct input |
| Mobile mismatch | HFR mismatch | Update mobile |
| OTP not received | Network issue | Retry |
| Transaction lost | Session issue | Re-initiate |

### 3.2 Participant Confirmation (Step 2)

This step is responsible for activating the participant identity created in Step 1. Without successful confirmation, the Participant remains in a PENDING state and cannot be used for any further configuration or transactions.

3.2.1 API specifications

API Endpoint:
POST /pmjay/hcx/participanthcxservice/validate

Invoked By:
Hospital / SI

Processed By:
NHCX

Request Parameters

| Parameter | Description | Mandatory |
|---|---|---|
| transactionId | Received from Step 1 | Yes |
| passcode | OTP sent to registered mobile | Yes |

## /validate?transactionId=txn123456&passcode=567890

3.2.2 Validation Rules

#### A. Transaction ID Validation

Must exist in system

Must correspond to a valid participant creation request

#### B. OTP (Passcode) Validation

Must match transactionId

OTP is:

- Unique per transaction

- Time-bound (system-defined validity)

If the validation is successful, participant status transition from PENDING -> ACTIVE and Hospitals/SI can update the bridge and certificate details using update API.

### 3.3 Participant Update (Step 3)

This step configures the technical integration layer required for communication between:

NHCX ↔ HMIS

It includes:

Bridge URL (endpoint)

Encryption certificate

3.3.1 API specifications

API Endpoint:
POST /pmjay/hcx/participanthcxservice/participant/update

Invoked By:
Hospital / SI

Processed By:
NHCX

Request Payload

{

"participantcode": "abc123@hcx",

"encryptioncert": "MIIC...base64encodedcertificate...",

"endpointurl": "https://hospital.com/hcx/api"

}

| Field | Description | Mandatory | Remarks |
|---|---|---|---|
| participantcode | Participant ID from Step 1 | Yes | Must be ACTIVE |
| encryptioncert | Public key (Base64 encoded) | Yes | Used for encryption |
| endpointurl | HMIS API base URL | Yes | Must be HTTPS |

3.3.2 Validation rules

• Participant must be active
• Certificate must be public key and base64 encoded format
• Endpoint must be HTTPS enabled, publicly accessible and reachable from NHCX environment.

After successful validation, participant status will be updated as “CONFIG_PENDING” and an OTP will be send along with the transaction ID.

Response Payload

{

"participant_code": "abc123@hcx",

"status": "PENDING",

"transactionid": "txn789456"

}

### 3.4 Update Confirmation (Step 4)

3.4.1 API specifications

API Endpoint:
POST /pmjay/hcx/participanthcxservice/participant/update

Invoked By:
Hospital / SI

Processed By:
NHCX

| Parameter | Description | Mandatory |
|---|---|---|
| transactionId | From update response | Yes |
| passcode | OTP received | Yes |

API: /update/validate?transactionId=&passcode=

OTP validation required (valid for 24 hours).

Upon successful confirmation, participant status becomes ACTIVE with following system behaviour.

- Endpoint URL is activated

- Encryption certificate is registered

- NHCX can:

Send requests to HMIS

Receive responses from HMIS

### 3.5 NHA Mapping (Step 5)

Raise ticket with hospital ID and participant ID. Mapping done manually by NHA. Step 5 involves the manual mapping of the existing PMJAY Hospital ID (HEM/HOSP ID used in TMS) with the newly created NHCX Participant ID.

This activity is performed exclusively by the NHA NHCX Operations Team and serves as the final cutover mechanism for transitioning claim submission from:

TMS Provider → HMIS via NHCX

Unlike previous steps, this is not API-driven and requires manual verification, coordination, and controlled execution.

3.5.1 Submission of required details

| Field | Description | Validation Requirement |
|---|---|---|
| PMJAY Hospital ID (HEM ID) | Existing TMS identifier | Must be active |
| Participant ID | NHCX ID created | Must be ACTIVE & CONFIGURED |
| Hospital Name | For verification | Must match records |
| Registered Mobile | Cross-check with HFR | Must match |
| Endpoint URL | HMIS endpoint | Should be live |
| Confirmation Status | Step 4 completed | Mandatory |

These details are must to ensure the dual processing mechanism of the claims with no disruption.

| Claim Type | Processing System |
|---|---|
| Preauthorization/Claims submitted before mapping | NHA TMS Provider |
| Preauthorization/Claims submitted after mapping | HMIS |

### 3.6 Go-Live (Step 6)

Mapping acts as the actual go-live trigger.

After mapping:

HMIS starts sending:

Claim requests

Status updates

TMS stops sending new claims and receives only existing case statuses.

New claims routed via HMIS, old claims continue in TMS.

## 4. Deployment & Operations

### 4.1 Checklist

- Participant created and validated

- Endpoint accessible

- Certificate configured

- APIs tested

- Mapping completed

- Pilot successful
