# NHCX PMJAY Integration Handbook

*Source: `hmisdocuments/NHCX PMJAY Integration Handbook.docx` — extracted full content*

NHCX Integration Handbook

National Health Claims Exchange

Provider Integration Reference

Version V 1.0  |  Based on NRCes FHIR R4  |  ABDM / NHA

## Table of Contents

## Executive Summary

This handbook explains how a hospital provider application uses NHCX to convert an insured patient into an operationally cashless patient, verify policy and benefits, submit pre-authorization, respond to payer queries, and finally progress toward claim settlement.

For a business audience, the most important point is that NHCX is not only a claims transport protocol. In this implementation it is part of a broader hospital process that begins when the team identifies the correct payer, confirms linked policies for the patient, fetches package and documentation rules, and only then starts eligibility and preauth transactions.

It also solves a long-standing operational problem: policy terms that historically arrived as PDF documents or payer circulars can now be consumed as structured digital InsurancePlan data. That reduces manual interpretation risk around benefits, package conditions, financial limits, and document requirements before the hospital commits to a cashless journey.

### Why This Handbook Matters

- It connects hospital operations to NHCX transaction flow end to end.

- It explains the hidden preparation steps before a patient can truly be handled as cashless.

- It shows the business conditions, system dependencies, and FHIR structures together in one document.

- It separates content for product, operations, and engineering readers so each team can use the same reference differently.

### Business Outcome Summary

| Objective | What the Platform Must Do |
|---|---|
| Identify payer | Search NHCX participant-service payers and select the payer tied to the patient's scheme |
| Confirm policy linkage | Fetch linked policies using ABHA, Member ID, or mobile number |
| Prepare cashless admission | Store payer ID, member ID, policy/product information, and admission insurance context |
| Validate benefit rules | Fetch InsurancePlan and plan benefits to know package rates and required documents |
| Obtain approval | Submit preauth and process approval, query, partial approval, or rejection |
| Continue claims lifecycle | Support enhancement, cancellation, claim submission, status checks, and payer callbacks |

### Reader Navigation

| Audience | Start Here | Focus |
|---|---|---|
| Product / Business | Chapter I | Patient journey, payer discovery, cashless flow, approval journey |
| Operations / Claims Desk | Chapter II | Admission workflow, policy lookup, callback handling, daily runbook |
| Engineering / Integration | Chapter III | JWE, FHIR bundles, endpoint contracts, response parsing, document packaging |

### Executive View of the Complete Flow

Figure 1 — Executive Overview Flow

### End-to-End Workflow Lifecycle

Figure 1.1 — NHCX End-to-End Workflow Lifecycle

## Chapter I — Product Audience

This chapter is for product managers, business analysts, hospital leadership, and implementation owners who need to understand what the solution does, why it does it, and which business dependencies exist before a patient becomes a cashless case.

### Product View: What Changes for the Hospital

- The payer is no longer just a master-data field; it must be a valid NHCX participant.

- The policy is no longer only a local admission field; it must be confirmed through participant-service policy discovery.

- The preauth is not only a form submission; it is a standards-based FHIR claim bundle with mandatory clinical evidence.

- The approval journey is asynchronous; payer decisions return later through callbacks.

### Product Swimlane: OPD-to-IPD Conversion

Figure 2 — OPD to IPD Conversion Swimlane

## Chapter II — Operations Audience

This chapter is for claims teams, admission staff, billing operations, TPA desk users, and support teams who need to know what must happen in sequence, what to do when data is missing, and where workflow failures usually occur.

### Operations View: Day-to-Day Questions Answered

| Question | Answer |
|---|---|
| How do we identify the correct payer? | Search NHCX payers through the participant-service-backed payer list |
| How do we confirm the patient is linked to a scheme/policy? | Call get/policies and cache the normalized policies |
| What makes a case eligible for cashless processing? | Valid payer, valid policy/member linkage, plan/package visibility, required documents, and successful preauth flow |
| Why does preauth fail before reaching the payer? | Missing payer resolution, missing member/product mapping, missing documents, or protocol errors |

Figure 3 — Cashless Admission Swimlane

## Chapter III — Engineering Audience

This chapter is for backend engineers, integration engineers, FHIR developers, QA engineers, and architects who need the protocol and implementation details.

### Engineering View: System Layers

- Internal hospital APIs under /api/v1/nhcx

- NHCX participant-service discovery APIs for payer and policy resolution

- NHCX transaction APIs for InsurancePlan, eligibility, preauth, claim, task, and status

- Callback handlers that decrypt JWE and parse FHIR responses

- Local persistence for cached policies, admissions, claims, and lifecycle events

### Engineering Swimlane: PreAuth Lifecycle

Figure 4 — PreAuth Lifecycle Swimlane

## Section 1: Overview & Architecture

### 1.1 What is NHCX?

NHCX (National Health Claims Exchange) is India's standardized health claims exchange platform under ABDM. It enables providers and payers to exchange pre-authorization requests, claims, eligibility checks, and insurance plan details using HL7 FHIR R4 resources encrypted with JWE (JSON Web Encryption).

NHCX acts as a neutral, standards-based routing layer between providers and payers, ensuring that all healthcare financial transactions are interoperable, auditable, and secure. The platform is governed by the National Health Authority (NHA) and conforms to the NRCes FHIR R4 profile specifications.

### 1.2  Communication Model

Figure 5 — NHCX Communication Model

The provider system builds a FHIR payload, encrypts it as JWE, submits it to the NHCX gateway, and later receives an encrypted callback after payer processing. The gateway validates metadata, routes the request to the selected payer, and returns the asynchronous callback to the registered provider endpoint.

ℹ  Note: All communication is asynchronous. The provider must always implement callback endpoints to receive payer responses, as the NHCX gateway never returns a synchronous FHIR decision.

### End-to-End Workflow Lifecycle

Figure 12 — NHCX End-to-End Workflow Lifecycle

### 1.3  Key Principles

| Principle | Detail |
|---|---|
| Encryption | All payloads are JWE-encrypted (RSA-OAEP-256 + A256GCM). No FHIR content is transmitted in plaintext. |
| Timestamps | All timestamps must be in IST timezone (+05:30). UTC or other zones will cause validation failures. |
| References | Intra-bundle references use urn:uuid: format for all resource cross-references within the same bundle. |
| Profiles | All resources must declare NRCes R4 profiles in the meta.profile element. |
| Callbacks | The provider's callback endpoint must respond with HTTP 202 within 30 seconds of receiving a callback. |
| Workflow ID | Every submission requires x-hcx-workflow_id in the JWE header. This identifies the type of transaction. |
| Correlation | x-hcx-correlation_id links request–response pairs across the entire lifecycle of a claim or preauth. |

## Section 2: Protocol Layer — JWE Encryption

### 2.1  JWE Protected Header

Every outgoing request to NHCX carries a JWE Compact Serialization payload. The protected header contains both standard JWE fields and NHCX-specific x-hcx-* metadata fields.

#### Sample JWE Header

{

"alg": "RSA-OAEP-256",

"enc": "A256GCM",

"x-hcx-sender_code": "1000004446@hcx",

"x-hcx-recipient_code": "1518@hcx",

"x-hcx-api_call_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",

"x-hcx-request_id": "f0e1d2c3-b4a5-6978-0fed-cba987654321",

"x-hcx-correlation_id": "11223344-5566-7788-99aa-bbccddeeff00",

"x-hcx-workflow_id": "12",

"x-hcx-timestamp": "2026-03-19T11:46:34+05:30",

"x-hcx-status": "request.initiated",

"x-hcx-ben-abha-id": "91711234567890"

}

#### JWE Header Field Reference

| Field | Required | Description |
|---|---|---|
| alg | Yes | Key encryption algorithm: RSA-OAEP-256 |
| enc | Yes | Content encryption algorithm: A256GCM |
| x-hcx-sender_code | Yes | Provider's NHCX participant code (e.g., 1000004446@hcx) |
| x-hcx-recipient_code | Yes | Target payer's NHCX participant code (e.g., 1518@hcx) |
| x-hcx-api_call_id | Yes | Unique UUID for this specific API call — must be unique per request |
| x-hcx-request_id | Yes | Unique UUID for the request payload |
| x-hcx-correlation_id | Yes | UUID linking request-response pairs — must remain the same across the full lifecycle |
| x-hcx-workflow_id | Yes | Workflow code identifying the transaction type (see Section 4) |
| x-hcx-timestamp | Yes | IST timestamp (+05:30) of the request |
| x-hcx-status | Yes | Set to 'request.initiated' for all outgoing provider requests |
| x-hcx-ben-abha-id | Optional | Beneficiary's ABHA number — no hyphens allowed |

### 2.2  JWE Compact Serialization Format

The JWE Compact Serialization produces a 5-part dot-separated string. Each part is Base64URL-encoded:

BASE64URL(header) . BASE64URL(encryptedKey) . BASE64URL(iv) . BASE64URL(ciphertext) . BASE64URL(authTag)

The plaintext (before encryption) is the JSON-serialized FHIR Bundle.

### 2.3  HTTP Request Format

POST /preauth/submit HTTP/1.1

Host: apisbx.abdm.gov.in/pmjay/sbxhcx

Content-Type: application/json

bearer_auth: Bearer <access_token>

{ "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLC...5-part-JWE-string..." }

### 2.4  Encryption Steps (Outgoing Request)

- Fetch recipient certificate: POST /fetch/certs with { "participantid": "1518@hcx" }

- Import public key: Try X.509 first; fall back to SPKI format (keys < 400 bytes are typically SPKI)

- Build protected header: Include all x-hcx-* fields with correct workflow ID and timestamps

- Encrypt FHIR JSON: Produce JWE Compact Serialization string using RSA-OAEP-256 + A256GCM

- POST to NHCX: Send { "payload": "<JWE string>" } with Bearer token in header

### 2.5  Decryption Steps (Incoming Callback)

- Receive callback at registered endpoint (e.g., /v1/preauth/on_submit)

- Extract JWE string from the 'payload' field of the request body

- Validate format: Must be a 5-part dot-separated string

- Decrypt using provider's PKCS8 private key (certs/private_key.pem)

- Parse protected header: Extract x-hcx-correlation_id, x-hcx-status, x-hcx-workflow_id, etc.

- Parse plaintext: Deserialize JSON into a FHIR Bundle resource

⚠  Important: The provider's callback endpoint must acknowledge receipt with HTTP 202 within 30 seconds. Failure to do so will cause the NHCX gateway to retry delivery.

## Section 3: Authentication & Gateway

### 3.1  Token Request

All NHCX API calls require a Bearer token obtained from the NHCX authentication endpoint using client credentials.

POST /get/session

Host: apisbx.abdm.gov.in

Content-Type: application/x-www-form-urlencoded

client_id=<NHCX_CLIENT_ID>&client_secret=<NHCX_CLIENT_SECRET>&grant_type=client_credentials

#### Token Response

{ "access_token": "eyJhbGciOiJSUzI1NiIs...", "expires_in": 1200, "token_type": "Bearer" }

ℹ  Note: Tokens expire after 1200 seconds (20 minutes). Implement automatic token refresh in your integration to avoid 401 errors during long sessions.

### 3.2  Gateway Base URLs

| Environment | Base URL |
|---|---|
| Sandbox | https://apisbx.abdm.gov.in/pmjay/sbxhcx |
| Production | https://apis.abdm.gov.in/pmjay/hcx |

### 3.3  Certificate Fetch

Before encrypting any payload for a payer, the provider must fetch the payer's public certificate. Certificates should be cached for 24 hours to avoid unnecessary round trips.

POST /fetch/certs

Host: apisbx.abdm.gov.in/pmjay/sbxhcx

bearer_auth: Bearer <token>

Content-Type: application/json

{ "participantid": "1518@hcx" }

The response contains a PEM-encoded X.509 certificate or SPKI public key. The implementation should attempt X.509 import first, with SPKI as a fallback for shorter keys (typically < 400 bytes).

## Section 4: Workflow Codes Reference

### 4.1  Provider-Side Workflow Codes

These codes are sent in the x-hcx-workflow_id header when the provider initiates an action. Each workflow code represents a distinct transaction type in the NHCX lifecycle.

| Code | Constant | Description | Use Case |
|---|---|---|---|
| 10 | PATIENT_REGISTERED | Patient registered in system | Registration |
| 11 | PATIENT_ADMITTED | Patient admitted to hospital | Admission |
| 12 | PREAUTH_REQUEST_INITIATED | New preauth submission | New PreAuth |
| 121 | PREAUTH_REQUEST_RESUBMITTED | Resubmission after query/rejection | Resubmit |
| PC01 | PREAUTH_CANCEL_INITIATED | Cancel an existing preauth | PreAuth Cancel |
| 19 | PREAUTH_QUERY_RESPONSE_SUBMITTED | Response to payer's query on preauth | Query Response |
| 13 | ENHANCEMENT_REQUEST_INITIATED | Enhancement (additional amount) request | Enhancement |
| 131 | ENHANCEMENT_QUERY_RESPONSE_SUBMITTED | Response to enhancement query | Enhancement Query |
| 14 | DISCHARGE_SUBMITTED | Discharge summary submitted | Discharge |
| 141 | DISCHARGE_QUERY_RESPONSE_SUBMITTED | Response to discharge query | Discharge Query |
| 15 | CLAIM_REQUEST_INITIATED | Final claim submission | Claim Submit |
| 151 | CLAIM_QUERY_RESPONSE_SUBMITTED | Response to claim query | Claim Query |
| 17 | PAYMENT_RECEIVED | Payment received acknowledgment | Payment |
| 36 | CLAIM_ARBITRATION_REQUEST_SUBMITTED | Reprocess/Erroneous request | Reprocess |

### 4.2  Payer-Side Response Codes

These codes arrive in the response callback's x-hcx-workflow_id header. The provider system must handle each of these response workflow codes in its callback processor.

| Code | Constant | Description |
|---|---|---|
| 20 | PREAUTH_REQUEST_RECEIVED | Payer has received and acknowledged the preauth request |
| 21 | PREAUTH_REQUEST_APPROVED | Preauth fully approved — proceed with treatment |
| 22 | ENHANCEMENT_REQUEST_APPROVED | Enhancement request approved by payer |
| 23 | PREAUTH_REQUEST_REJECTED | Preauth rejected — review error/processNote for reason |
| 24 | PREAUTH_REQUEST_QUERIED | Payer needs more information — respond using workflow 19 |
| 241 | ENHANCEMENT_REQUEST_QUERIED | Enhancement request queried by payer |
| 25 | CLAIM_REQUEST_RECEIVED | Final claim received by payer |
| 26 | CLAIM_REQUEST_APPROVED | Final claim approved |
| 27 | CLAIM_REQUEST_QUERIED | Final claim queried — payer needs additional documents |
| 28 | CLAIM_REQUEST_IN_PROCESS | Final claim is being processed by payer |
| 29 | CLAIM_FORWARDED | Claim forwarded to another processing entity |
| 251 | REPROCESS_REQUEST_RECEIVED | Reprocess request received |
| 252 | REPROCESS_REQUEST_APPROVED | Reprocess request approved |
| 253 | REPROCESS_REQUEST_REJECTED | Reprocess request rejected |
| 254 | REPROCESS_REQUEST_QUERIED | Reprocess request queried |
| 261 | DISCHARGE_REQUEST_APPROVED | Discharge summary approved |
| 262 | DISCHARGE_REQUEST_REJECTED | Discharge summary rejected |
| 263 | DISCHARGE_REQUEST_QUERIED | Discharge summary queried |
| 30 | PAYMENT_INITIATED | Payment initiated by payer |
| 31 | PAYMENT_PROCESSED | Payment has been processed |
| 33 | PAYMENT_SETTLED | Payment has been fully settled |

ℹ  Note: This list will be expanded with additional workflow IDs as new scenarios are defined by NHA/NRCes. Always refer to the latest specification for the most current codes.

## Section 5: Patient-to-Cashless Conversion Context

### 5.1  Why This Step Exists

The NHCX transaction flow does not start at preauth. In this application, a patient becomes a practical 'cashless' patient only after the hospital has completed a series of prerequisite steps. Without these steps, the system cannot safely build the InsurancePlan request, CoverageEligibility request, or PreAuth Claim bundle.

#### Prerequisites Before PreAuth Submission

- Identify the payer the admission belongs to

- Confirm the patient has a linked policy with that payer

- Extract the payer identifier used by NHCX (x-hcx-recipient_code)

- Extract the member ID and policy/product code that must go into FHIR resources

- Fetch plan benefits and mandatory document rules before preauth submission

### 5.2  What 'Cashless Patient' Means

Operationally, the patient becomes cashless in two related but distinct layers. Both must be true for NHCX submission to succeed:

| Layer | Meaning |
|---|---|
| Admission / UI Layer | The patient is admitted or converted from CASH to INSURANCE, with an insurance scheme, payer, identifier type/value, and policy number attached to the admission record. |
| NHCX Transaction Layer | The system has resolved a valid payer code, policy/product, and member ID so that downstream NHCX APIs can be called with correct parameters. |

⚠  Important: The UI may show the patient as insurance/cashless, but NHCX submission will still fail if payer discovery and policy lookup have not completed successfully. Both layers must be satisfied.

### 5.3  Real Processing Sequence

Figure 6 — Patient-to-Cashless Sequence

The operational order is fixed: payer search → payer selection → policy discovery → policy cache normalization → effective payer resolution → InsurancePlan and benefit retrieval → optional eligibility verification → preauth submission.

### 5.4  Internal Application APIs

ℹ  Note: These are the provider application's own backend endpoints under /api/v1, not NHCX callback endpoints. They are used by the frontend to prepare the patient for cashless/NHCX processing. These APIs listed below only for UNDERSTANDING purpose.

| Purpose | Frontend Call | Backend Route | Notes |
|---|---|---|---|
| Discover payers | GET /api/v1/nhcx/payers | GET /nhcx/payers | Returns searchable payer list from participant service |
| Fetch linked policies | POST /api/v1/nhcx/policies | POST /nhcx/policies | Finds policies for a patient using ABHA/member/mobile |
| Fetch InsurancePlan | POST /api/v1/nhcx/fetch-insurance-plan | POST /nhcx/fetch-insurance-plan | Pulls payer plan details after payer/policy selection |
| Fetch plan benefits | GET /api/v1/nhcx/plan-benefits | GET /nhcx/plan-benefits | Reads benefit packages from InsurancePlan master data |

### 5.5  Payer Discovery API

#### 5.5.1  Internal Endpoint

GET /api/v1/nhcx/payers?name=pmjay&schemeType=GOVT

#### 5.5.2  Upstream NHCX Participant Service Call

POST https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/participants/list

Content-Type: application/json

bearer_auth: Bearer <token>

X-CM-ID: sbx

{ "role": "PAYER", "fromdate": "01/04/2021", "todate": "20/03/2026", "entitytype": "Gov" }

#### 5.5.3  Search Logic

- Obtain an NHCX access token

- Call POST /fetch/participants/list with role, date range, and entity type

- Normalize the response from participantdetails, participants, or raw array form

- Filter by payer name if a text search string was provided

- Classify scheme type as GOVT or PRIVATE based on entitytype

### 5.6 Policy Discovery API (get/policies)

#### 5.6.1 Internal Endpoint

POST /api/v1/nhcx/policies

{ "patientId": "pat_001", "admissionId": "adm_001", "forceRefresh": false }

#### 5.6.2 Supported Identifier Types

| Identifier Type | Meaning |
|---|---|
| AbhaNumber | ABHA number without hyphens (highest priority) |
| MemberId | Member/policy ID captured on admission |
| MobileNo | Patient's registered mobile number |

#### 5.6.3 Identifier Cascade

If the caller provides identifierType and identifierValue explicitly, those are tried first. Otherwise the backend builds an ordered candidate list and tries each until one returns a policy:

- ABHA number from the patient record — highest priority

- MemberId from the latest IPD admission where idType = MEMBER_ID

- MobileNo from the patient phone number — lowest priority

#### 5.6.4 Policy Cache Behavior

| Behavior | Implementation Detail |
|---|---|
| Cache key | patientId |
| Cache persistence | Permanent — no TTL expiry for successful policy cache entries |
| Bypass cache | Set forceRefresh: true in the request to force a fresh lookup |
| Stored fields | identifier type/value, normalized policies, raw response, count, fetchedAt |

### 5.7 How Payer and Policy Data Feed PreAuth

This is the most important context for PreAuth and Enhancement submissions. The backend resolves three key values from cached policy data in the following order:

Resolve policyNumber

- From the admission record first

- Then from the frontend-supplied productName

- Then from the first cached policy product

Resolve memberId

- From the frontend if supplied

- Then from the cached policy

- Then from patient insurance fields

Resolve payerId

- Match the cached policy where either product or member matches

- Extract payerId from the matched policy

⚠  Important: If no payer ID can be derived from the policy bundle, the backend must raise an exception: 'Unable to resolve payerId from policy bundle. Please fetch eligibility/policies before pre-auth submission.'

### 5.8 Field Relationship Reference

| Field | Where It Comes From | Why It Matters |
|---|---|---|
| payerId | Policy cache / participant service | Actual payer participant code used for NHCX routing and x-hcx-recipient_code header |
| memberId | Policy lookup | Used as the beneficiary/member reference in eligibility and claim flows |
| productId | Policy lookup | Product identifier from the payer side — used for product-level matching. Use this to get coverage related details |
| productName | Policy lookup | Used in this application as the practical policy/coverage code for plan lookup |
| policyNumber | Policy lookup | Business field used to track the selected policy across the admission lifecycle |

ℹ  Note: In this repository, productName is frequently used as the effective policy code for InsurancePlan and benefit lookup when a formal policyNumber is not available.

### 5.9 End-to-End Business Narrative

If explaining this system to a new implementation team, the simplest summary is:

- The patient is not immediately 'cashless' just because they have insurance.

- First, the hospital must discover which payer to deal with.

- Then it must verify that the patient is linked to that payer through the participant-service policy API.

- Only after payer ID, member ID, and product/policy code are known can the NHCX claim-side APIs start.

- Then the system fetches plan rules and benefits.

- Then it can perform eligibility and preauth submission.

That is why payers/list and get/policies are foundational APIs in the overall cashless workflow, even though they are not themselves NHCX claim callbacks.

## Section 6: Use Case 1 — InsurancePlan

### 6.1 Business Context

The Insurance Plan API in NHCX represents the digital backbone of policy interpretation, transforming traditionally static and document-heavy insurance policies into a structured, machine-readable, and context-aware artifact. It is one of the most critical APIs for implementors, as it provides a comprehensive and authoritative view of policy coverage, conditions, and operational rules required for treatment authorization and claims processing.

At its core, the Insurance Plan encapsulates the entire policy construct in digital form, enabling systems to programmatically access and interpret all relevant aspects of coverage without relying on manual document review. This includes:

- Coverage Details — Complete definition of what is covered under the policy, including eligible specialties, treatment categories, and package mappings.

- Policy-Level Conditions — High-level rules governing claim admissibility such as waiting periods, exclusions, co-payment clauses, and eligibility constraints.

- Mandatory Requirements — Specific documentation and compliance requirements (e.g., under PMJAY: Proof of Identity and Proof of Address).

- Benefit-Level Conditions — Granular rules applicable to individual benefits or packages, including conditional eligibility and package-specific constraints.

- Financial Limits & Package Rates — Defined ceilings, sub-limits, and standardized package rates applicable for treatments.

- Standard Treatment Guidelines — Clinical pathways or treatment protocols that must be adhered to for admissibility.

#### Key Characteristics of the InsurancePlan Response

- Provider-Specific — The plan is generated based on the network agreement (MoU) between the payer and the hospital. Only empanelled specialties and services applicable to that provider are included.

- Policy-Specific — The response is tailored to a specific policy number, reflecting all applicable conditions and limits for that beneficiary.

- Contextually Filtered — Even if a policy covers a wide range of specialties, the API restricts the view to those relevant to the requesting provider per the MoU.

- Payer-Provider Exclusive View — Acts as a mutually agreed, real-time contract view between payer and provider for a given transaction context.

#### Recommended Integration Points

- At the time of patient registration or admission

- Before treatment planning and cost estimation

- In conjunction with Coverage & Eligibility checks

ℹ  Note: Providers are strongly encouraged to integrate the InsurancePlan API deeply into their workflows. This minimises rework, reduces rejection rates, and ensures faster approvals by surfacing benefit rules and document requirements before preauth submission.

### 6.2  Process Flow

Figure 7 — InsurancePlan Request Flow

### 6.3 Business Conditions

| Condition | Requirement |
|---|---|
| When to call | Before any preauth or claim submission for a specific payer and policy combination |
| Participant codes | Both sender (provider) and recipient (payer) must be registered on NHCX |
| Plan caching | Plans can be cached but should be refreshed periodically or when treatment changes |
| Trust validation | Provider must verify payer's certificate before encryption |
| Callback handling | Provider must return HTTP 202 within 30 seconds of callback receipt |
| Error scenarios | Payer may return an empty plan or error message if no matching coverage is found for the policy-provider combination |

### 6.4 Request — FHIR Task Bundle

The InsurancePlan request uses a FHIR Task resource wrapped in a Bundle to indicate the provider is requesting plan details from the payer. The Task code is 'poll', signifying a fetch/discovery operation.

#### InsurancePlan Request — Task Core Elements

| FHIR Element | Cardinality | Sample Value | Description |
|---|---|---|---|
| Task.resourceType | 1..1 | Task | Wrapper resource for InsurancePlan discovery request |
| Task.status | 1..1 | requested | Indicates the request has been initiated |
| Task.intent | 1..1 | order | Action being requested from payer |
| Task.code.coding.system | 1..1 | https://nhcx.abdm.gov.in/api | NHCX API namespace for task code |
| Task.code.coding.code | 1..1 | poll | Retrieve/fetch InsurancePlan (not create or update) |
| Task.input[0].type.coding.code | 1..1 | policyNumber | Type of input parameter — policy number |
| Task.input[0].valueString | 0..1 | POL987654321 | Insurance policy number for plan lookup |
| Task.input[1].type.coding.code | 0..1 | providerId | Type of input parameter — provider identifier |
| Task.input[1].valueString | 0..1 | HFR123456 | Hospital's HFR (Health Facility Registry) ID |

ℹ  Note: At least one Task.input is mandatory. Either policyNumber or providerId must be provided. Both may be supplied for more precise plan retrieval.

### 6.5 Response — InsurancePlan FHIR Bundle

The response is delivered asynchronously through /insuranceplan/on_request. After decryption, the provider receives a FHIR InsurancePlanBundle of type 'collection'. The bundle may contain the following entry resources:

| Resource | Description |
|---|---|
| InsurancePlan | Digital policy structure containing all benefit definitions, costs, and conditions |
| Organization | Insurance company and/or provider details |
| Questionnaire | Questionnaire for document requirements — STGs, Past History, Family History, etc. |

#### 6.5.1 Response Type 1: plan → specificCost → category → benefit → cost → qualifiers

The specificCost element enables insurers to represent complex benefit definitions including package costs and additional cost elements. In PMJAY, the mapping is:

| InsurancePlan Element | PMJAY Concept |
|---|---|
| specificCost.category | Speciality (e.g., General Medicine, Ophthalmology) |
| specificCost.benefit | Package (e.g., Corneal Grafting, SE012A) |
| specificCost.benefit.cost | Package Cost |
| cost.qualifiers (type: Implant) | Implant cost qualifier — allowed only if package-approved |
| cost.qualifiers (type: Stratification) | ICU/HDU stratification — as per policy code master |

#### InsurancePlan.plan — Fully Flattened Element Table

| Element Path | Cardinality | Data Type | Description / Binding |
|---|---|---|---|
| InsurancePlan.plan | 0..* | BackboneElement | Cost sharing details for the plan offered to a consumer |
| InsurancePlan.plan.id | 0..1 | string | Unique ID for inter-element referencing |
| InsurancePlan.plan.extension:claim-exclusion | 0..* | Extension | Coverage exclusions: pre-existing diseases, waiting periods, non-covered procedures |
| InsurancePlan.plan.extension:claimCondition | 0..* | Extension | Conditions that must be satisfied to claim benefits |
| InsurancePlan.plan.extension:claimSupportingInfoRequirement | 0..* | Extension | Mandatory documents required during claim processing |
| InsurancePlan.plan.identifier | 0..* | Identifier | Business identifier for the insurance product |
| InsurancePlan.plan.type | 1..1 | CodeableConcept | Type of insurance plan |
| InsurancePlan.plan.type.coding.system | 1..1 | uri | Terminology system identifier |
| InsurancePlan.plan.type.coding.code | 1..1 | code | Code representing the plan type |
| InsurancePlan.plan.type.coding.display | 1..1 | string | Human-readable plan type label |
| InsurancePlan.plan.network | 0..* | Reference(Organization) | Provider network offering coverage |
| InsurancePlan.plan.generalCost | 0..* | BackboneElement | Overall sum insured / general cost details (PMJAY overall sum insured) |
| InsurancePlan.plan.specificCost | 0..* | BackboneElement | Specific cost definitions per benefit category |
| InsurancePlan.plan.specificCost.category | 1..1 | CodeableConcept | High-level benefit category (e.g., GM = General Medicine) |
| InsurancePlan.plan.specificCost.category.coding.code | 1..1 | code | Benefit category code |
| InsurancePlan.plan.specificCost.category.coding.display | 1..1 | string | Benefit category name (e.g., General Medicine) |
| InsurancePlan.plan.specificCost.benefit | 0..* | BackboneElement | List of benefits under the category |
| InsurancePlan.plan.specificCost.benefit.type | 1..1 | CodeableConcept | Specific product or service (package) |
| InsurancePlan.plan.specificCost.benefit.type.coding.code | 1..1 | code | Package/service code (e.g., BM001, SE012A) |
| InsurancePlan.plan.specificCost.benefit.type.coding.display | 1..1 | string | Package/service name |
| InsurancePlan.plan.specificCost.benefit.cost | 0..* | BackboneElement | Cost definitions for the benefit |
| InsurancePlan.plan.specificCost.benefit.cost.type | 1..1 | CodeableConcept | Type of cost (package, implant, copay, etc.) |
| InsurancePlan.plan.specificCost.benefit.cost.qualifiers | 0..* | CodeableConcept | Additional qualifiers or constraints (Stratification/Implant/Investigation) |
| InsurancePlan.plan.specificCost.benefit.cost.value | 0..1 | Quantity | Actual monetary or unit value — additional amount paid over and above procedure cost |

### 6.6 Claim conditions

| Claim Condition | Code in Insurance Plan | Description |
|---|---|---|
| reserved_for_govt_yn | GovtReserved<br> | Whether the benefit is reserved only for government facilities or not, if any private facility uses this benefit, it will get rejected. |
| auto_approve_yn | ApprovalNotRequired | Whether the benefit is eligible for auto approval at preauth level or not. |
| enhancement_applicable_yn | EnhancementAllowed | Whether the benefit is eligible for enhancement or not, if it is non enhanceable then the benefit should not be allowed to be added at provider side during enhancement. |
| schedular_tat_approval | ScheduledTATApproval | If the payer has not responded on a perticular case with only this benefit for a specified time period (varies with policy), system will aprove the case |
| quantity_allowed | QuantityAllowed | Maximum quantity of the benefit allowed in one transaction cycle including preauth & claim. |
| daycare_yn | IsDayCare | Is the benefit a day care procedure or not |
| implant_applicable_yn | ImplantApplicable | Whether implant is applicable for the benefit or not. |
| strat_applicable_yn | StratificationAllowed | Whether stratification is applicable for the benefit or not. |
| multiple_implants_allowed_yn | MultipleImplantsAllowed | Whether more than one implant is applicable for the benefit or not, if it’s no then more than one implant shouldn’t be allowed |
| multiple_strats_allowed_yn | MultipleStratificationAllowed | Whether more than one stratification is applicable for the benefit or not, if it is no then more than one stratification shouldn’t be allowed |
| max_implants_allowed | MaximumImplantsAllowed | Maximum quantity of the implants allowed for the benefit in one transaction cycle including the |
| max_strats_allowed | MaximumStratificationAllowed | Maximum quantity of the startification allowed for the benefit in one transaction cycle |
| rules_yn | NA | Whether the rules are applicable for the benefit |
| LamaDamaProcedure | LamaDamaProcedure | Whether the procedure is specific to only LAMA/DAMA discharge type or not. It will be either Y or N. |
| dischargeStageForLamaDamaProc | DischargeStagesLamaDamaProcedure | Stages at which the procedure should be added, e.g. "Before Surgery, During Surgery" |
| cyclic_proc_yn | CyclicProcedure | Whether the benefit is a cyclic procedure or not, i.e., it can be repeated multiple times with one approval e.g., dialysis |
| no_of_cycles | MaximumCyclesAllowed | Maximum number of cycles allowed for the cyclic benefit after one approval |
| los | NA | Maximum length of stay allowed for the benefit |
| Procedure_type | Procedure Type | What is the type of the procedure? Surgical/Medical/Conservative |
| ip_op_flag | NA | Whether the benefit comes under in-patient or out-patient |
| incentive_applicable | NA | Whether incentive to hospital is applicable for the benefit or not |
| gst_applicable | NA | Whether GST is applicable for the benefit or not |
| gst_percentage | NA | GST % applicable for the given benefit |
| Standalone | Standalone | Whether the procedure is a standalone procedure or not, if Y then it cannot be clubbed with any other procedure. |
| ParentProcedure | ParentProcedure | If there is any parent procedure, then it's mandatory to add any one of them from the list. E.g. “P1, P2, P3” |
| Unspecified | Unspecified | Y/N, In case of package is not listed in the policy, this procedure can be selected, name & cost is free entry field by the provider system. |

## Section 7: Use Case 2 — Coverage Eligibility

### 7.1 Business Context

The Coverage Eligibility API allows a provider to validate a patient's insurance coverage and retrieve benefit details before initiating a preauthorization request. This is a critical pre-check that helps providers confirm policy in-force status, available benefits, and authorization requirements for specific procedures.

By shifting eligibility validation to a preauthorization pre-check, NHCX aims to enable a more predictable, transparent, and efficient claims lifecycle, significantly improving both provider experience and patient outcomes.

### 7.2 Process Flow

Figure 8 — Coverage Eligibility Flow

### 7.3 Business Conditions

| Condition | Requirement |
|---|---|
| Patient Identity | Must include PMJAY Member ID and/or ABHA Number |
| Coverage Reference | Must reference the patient's active policy/coverage record |
| Purpose Selection | Choose ‘discovery’, 'validation', 'benefits', or 'auth-requirements' based on business need |
| Items (for auth-requirements) | When purpose is 'auth-requirements', include the specific procedures being queried |
| Provider & Insurer | Both organisations must be included in the bundle as Organisation entries |
| Enterer | The user performing the check should be identified via PractitionerRole reference |

### 7.4 Usage Guidelines

| Purpose | Scenario |
|---|---|
| Discovery | Fallback approach that if policy details are not available through /get/policies, HMIS should first call coverageEligibility /check with purpose discovery to fetch the active policy_code, and then use the received policy_code in coverageEligibility/check with purpose validation. |
| Validation | coverageEligibility/check with purpose validation retrieves wallet details such as the used amount, available balance (allowed amount), and the wallet liability applicable to the scheme. |
| Auth-Requirement | coverageEligibility/check with the AUTH_REQUIREMENT purpose verifies whether a selected treatment or service is covered for a member at a specific hospital. It returns the covered amount, required STG questionnaires, and supporting documents needed for pre-auth submission, helping reduce the chances of rejection. |

### 7.5 Request — CoverageEligibilityRequest FHIR Bundle

#### Bundle-Level Elements

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| Bundle.resourceType | 1..1 | string | Bundle |
| Bundle.id | 0..1 | id | a2bb0c37-1f63-47e8-a096-be2b550c913a |
| Bundle.meta.lastUpdated | 0..1 | instant | 2025-11-28T17:52:16+05:30 |
| Bundle.type | 1..1 | code | collection |
| Bundle.timestamp | 0..1 | instant | 2025-11-28T17:52:16+05:30 |
| Bundle.entry[*].resource.resourceType | 1..1 | string | CoverageEligibilityRequest, Patient, Organization, Coverage, PractitionerRole |

#### CoverageEligibilityRequest — Core Fields

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityRequest.resourceType | 1..1 | string | CoverageEligibilityRequest |
| CoverageEligibilityRequest.status | 1..1 | code | active |
| CoverageEligibilityRequest.priority.coding.code | 0..1 | code | normal |
| CoverageEligibilityRequest.purpose[*] | 1..* | code | validation OR auth-requirements OR benefits |
| CoverageEligibilityRequest.patient.reference | 1..1 | Reference(Patient) | Patient/PMJAY/HP/S/G or absolute URL |
| CoverageEligibilityRequest.servicedDate | 0..1 | date | 2025-11-28 |
| CoverageEligibilityRequest.created | 0..1 | dateTime | 2025-11-28T17:52:16+05:30 |
| CoverageEligibilityRequest.provider.reference | 0..1 | Reference(Organization) | Organization/ApolloHospitalTest or absolute URL |
| CoverageEligibilityRequest.insurer.reference | 0..1 | Reference(Organization) | Organization/SHAHP or absolute payer URL |
| CoverageEligibilityRequest.insurance[*].focal | 0..1 | boolean | true |
| CoverageEligibilityRequest.insurance[*].coverage.reference | 1..1 | Reference(Coverage) | Coverage/PMJAY/HP/S/G or absolute coverage URL |

#### Item Elements (for auth-requirements purpose)

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityRequest.item[*].category.coding.code | 0..1 | code | MG (General Medicine) |
| CoverageEligibilityRequest.item[*].productOrService.coding.code | 0..1 | code | MG003B, MG004A, IN047A |
| CoverageEligibilityRequest.item[*].productOrService.coding.display | 0..1 | string | Procedure or investigation name |
| CoverageEligibilityRequest.item[*].modifier.coding.code | 0..1 | code | Stratification Code |
| CoverageEligibilityRequest.item[*].quantity.value | 0..1 | numeric | Quantity |

### 7.6 Response — CoverageEligibilityResponse FHIR Bundle

#### CoverageEligibilityResponse — Core Fields

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityResponse.resourceType | 1..1 | string | CoverageEligibilityResponse |
| CoverageEligibilityResponse.status | 1..1 | code | active |
| CoverageEligibilityResponse.purpose[*] | 1..* | code | validation OR benefits |
| CoverageEligibilityResponse.patient.reference | 1..1 | Reference(Patient) | Payer patient URL |
| CoverageEligibilityResponse.created | 0..1 | dateTime | 2025-11-28T17:52:28+05:30 |
| CoverageEligibilityResponse.outcome | 1..1 | code | complete |
| CoverageEligibilityResponse.disposition | 0..1 | string | Policy is currently in-force |
| CoverageEligibilityResponse.insurer.reference | 0..1 | Reference(Organization) | Payer organisation URL |
| CoverageEligibilityResponse.insurance[*].coverage.reference | 1..1 | Reference(Coverage) | Active coverage reference |
| CoverageEligibilityResponse.insurance[*].inforce | 0..1 | boolean | true — confirms policy is active |

#### Response Item — Benefit Elements

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| insurance[*].item[*].category.coding.code | 0..1 | code | 100005 |
| insurance[*].item[*].category.coding.display | 0..1 | string | General Medicine |
| insurance[*].item[*].productOrService.coding.code | 0..1 | code | 100478 / 100063 / 100012 |
| insurance[*].item[*].excluded | 0..1 | boolean | false (covered) or true (excluded) |
| insurance[*].item[*].benefit[*].type.coding.code | 0..1 | code | Procedure / Investigation / Stratification |
| insurance[*].item[*].benefit[*].allowedMoney.value | 0..1 | decimal | 0 or 3300 (HDU stratification) |
| insurance[*].item[*].benefit[*].allowedMoney.currency | 0..1 | code | INR |
| insurance[*].item[*].authorizationRequired | 0..1 | boolean | true — preauth is required for this procedure |
| insurance[*].item[*].authorizationSupporting[*].coding.code | 0..1 | code | MAND0409, MAND0104, MAND0062 |
| insurance[*].item[*].authorizationSupporting[*].coding.display | 0..1 | string | Any investigations done, Detailed ICPs |

## Section 8: Use Case 3 — Preauthorization Lifecycle

### 8.1 Business Context

Pre-authorisation (PreAuth) is the formal request from a provider to a payer seeking approval to deliver a specific medical treatment or procedure to a covered beneficiary. Under NHCX, this is a fully digitised, standards-based process using FHIR R4 Claim bundles with Claim.use set to 'preauthorization'. The payer responds asynchronously through a callback with one of four outcomes: approved, partially approved, queried, or rejected.

PreAuth is the critical gating step before treatment begins. An approved preauth reference number is required for final claim submission and serves as the payer's binding commitment to reimburse the approved amount. Without a valid preauth, the final claim cannot proceed through NHCX.

### 8.2  Preauth Lifecycle Overview

The PreAuth lifecycle spans five operational phases: submission, gateway routing, payer adjudication, provider response handling, and — where applicable — cancellation. Each phase is driven by a workflow identifier carried in the JWE protected header.

| Phase | Workflow ID | Description |
|---|---|---|
| New submission | 12 | Provider submits the initial PreAuth Claim bundle via POST /preauth/submit. |
| Resubmission | 121 | Provider resubmits with additional documents or corrections after a query response. |
| Cancellation request | 122 | Provider cancels an active preauth via POST /task/submit with a Task resource. |
| Approved callback | 21 | Payer sends full approval — preAuthRef issued for use at final claim. |
| Queried callback | 24 | Payer requests additional documents or clinical clarification. |
| Rejected callback | 23 | Payer denies the preauth — claim is closed. |
| Query response | 19 | Provider responds to a payer query with supplementary information. |

Figure 9 — PreAuth Lifecycle Swimlane

### 8.3 Business Conditions

| Condition | Requirement |
|---|---|
| Patient Identity | PMJAY Member ID and ABHA number must be present in the Patient resource |
| Provider Verification | Provider must be an active NHCX participant with a valid NPI facility code |
| Clinical Evidence | Diagnosis (ICD-10), Procedure (NRCes code), Care Team, and Supporting Info must all be present |
| Supporting Documents | Mandatory documents as per InsurancePlan/eligibility response must be attached |
| Coverage Reference | Active Coverage resource with valid policy identifier must be included |
| Workflow Code | Use workflow ID 12 for new submissions, 121 for resubmissions |

### 8.4 Request — Preauth Claim Bundle

#### Claim Resource — Header Elements

| FHIR Element | Description | Sample Value |
|---|---|---|
| Claim.resourceType | Resource type identifier | Claim |
| Claim.id | Logical UUID for this Claim resource | 979f2826-1a18-4857-8c4a-182cfc4deb1f |
| Claim.status | Current status of the claim | active |
| Claim.type.coding.system | Coding system for claim type | http://snomed.info/sct |
| Claim.type.coding.code | SNOMED code for inpatient care | 737481003 |
| Claim.type.coding.display | Human-readable claim type | Inpatient care management |
| Claim.use | Indicates this is a pre-authorisation request | preauthorization |
| Claim.patient.reference | Reference to the Patient resource | urn:uuid:400f5443-bb92-4c8c-a7ee-61a3215ad614 |
| Claim.created | Date/time the claim was created | 2026-03-19T11:46:34+05:30 |
| Claim.billablePeriod.start | Start of the billable (admission) period | 2026-03-10T21:21:17+05:30 |
| Claim.billablePeriod.end | End of the billable (discharge) period | 2026-03-19T11:46:34+05:30 |
| Claim.provider.reference | Reference to the providing Organisation | urn:uuid:5de82a74-bfb1-4192-a17c-fb5458c8a3b4 |
| Claim.insurer.reference | Reference to the insurer Organisation | urn:uuid:49f712ea-e54d-4a56-9610-d773df4dde2c |
| Claim.priority.coding.code | Processing priority | normal |
| Claim.insurance[0].sequence | Sequence number of insurance entry | 1 |
| Claim.insurance[0].focal | Indicates primary/focal insurance | true |
| Claim.insurance[0].coverage.reference | Reference to Coverage resource | urn:uuid:05b739c7-c343-48da-a6cc-9d2d7d72c2e4 |
| Claim.total.value | Total claimed monetary amount | 13700 |
| Claim.total.currency | Currency of the total amount | INR |

#### Diagnosis Elements

| FHIR Element | Description | Sample Value |
|---|---|---|
| Claim.diagnosis[0].sequence | Sequence number for first diagnosis | 1 |
| Claim.diagnosis[0].diagnosisCodeableConcept.coding.system | ICD-10 coding system URI | http://hl7.org/fhir/sid/icd-10 |
| Claim.diagnosis[0].diagnosisCodeableConcept.coding.code | ICD-10 code for primary diagnosis | H18.6 |
| Claim.diagnosis[0].diagnosisCodeableConcept.coding.display | Display name for primary diagnosis | Keratoconus |
| Claim.diagnosis[0].type.coding.code | Diagnosis type code | admitting |
| Claim.diagnosis[0].type.coding.display | Diagnosis type display | Admitting Diagnosis |
| Claim.diagnosis[0].onAdmission.coding.code | Whether diagnosis was present on admission | y |
| Claim.diagnosis[1].sequence | Sequence number for second diagnosis | 2 |
| Claim.diagnosis[1].diagnosisCodeableConcept.coding.code | ICD-10 code for secondary diagnosis | H17.8 |
| Claim.diagnosis[1].diagnosisCodeableConcept.coding.display | Secondary diagnosis display name | Other corneal scars and opacities |
| Claim.diagnosis[1].type.coding.code | Diagnosis type — clinical | clinical |

#### Procedure & Item Elements

| FHIR Element | Description | Sample Value |
|---|---|---|
| Claim.procedure[0].sequence | Sequence number for the procedure entry | 1 |
| Claim.procedure[0].procedureReference.reference | UUID reference to the Procedure resource | urn:uuid:709ef58c-cea0-4891-aeca-0e09d9c8de02 |
| Claim.procedure[0].procedureReference.display | Human-readable procedure name | Corneal Grafting |
| Claim.procedure[0].date | Date/time the procedure was performed | 2026-03-12T05:30:00+05:30 |
| Claim.item[0].sequence | Sequence number for the claim line item | 1 |
| Claim.item[0].careTeamSequence | References to care team members involved | [1, 2] |
| Claim.item[0].diagnosisSequence | References to diagnoses linked to this item | [1] |
| Claim.item[0].procedureSequence | References to procedures linked to this item | [1] |
| Claim.item[0].category.coding.system | Coding system for benefit category | https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-benefit-category |
| Claim.item[0].category.coding.code | PMJAY benefit category code | SE |
| Claim.item[0].category.coding.display | Benefit category display name | Ophthalmology |
| Claim.item[0].productOrService.coding.system | Coding system for procedure code | https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-procedure-code |
| Claim.item[0].productOrService.coding.code | PMJAY procedure code | SE012A |
| Claim.item[0].productOrService.coding.display | Procedure display name | Corneal Grafting |
| Claim.item[0].servicedPeriod.start | Service start date | 2026-03-10T21:21:17+05:30 |
| Claim.item[0].quantity.value | Quantity of service units | 1 |
| Claim.item[0].unitPrice.value | Unit price of the service | 13700 |
| Claim.item[0].unitPrice.currency | Currency for unit price | INR |
| Claim.item[0].net.value | Net amount for this line item | 13700 |
| Claim.item[0].informationSequence | References to supporting info entries | [1, 2, 3, 4, 5] |

#### Care Team Elements

| FHIR Element | Description | Sample Value |
|---|---|---|
| Claim.careTeam[0].sequence | Sequence number for primary care team member | 1 |
| Claim.careTeam[0].provider.reference | Reference to primary Practitioner resource | urn:uuid:64661d5c-3b29-4214-9825-35cb225c2303 |
| Claim.careTeam[0].provider.display | Display name of primary provider | Dr. Amit Sharma |
| Claim.careTeam[0].role.coding.code | Role code — primary | primary |
| Claim.careTeam[0].qualification.coding.code | Qualification code | ophthalmology |
| Claim.careTeam[0].qualification.coding.display | Qualification display | Ophthalmology |
| Claim.careTeam[1].sequence | Sequence number for assisting care team member | 2 |
| Claim.careTeam[1].provider.display | Display name of assisting provider | Dr. Priya Menon |
| Claim.careTeam[1].role.coding.code | Role code — assisting | assist |
| Claim.careTeam[1].qualification.coding.code | Qualification code | anaesthesia |
| Claim.careTeam[1].qualification.coding.display | Qualification display | Anaesthesia |

#### Supporting Information Elements

| FHIR Element | Description | Sample Value |
|---|---|---|
| Claim.supportingInfo[0].sequence | Sequence — admission-discharge dates entry | 1 |
| Claim.supportingInfo[0].code.coding.code | Code for admission-discharge dates | ADDD |
| Claim.supportingInfo[0].category.coding.code | Category code | ONS |
| Claim.supportingInfo[0].valueString | Admission date value | 2026-03-10T21:21:17+05:30 |
| Claim.supportingInfo[1].sequence | Sequence — encounter date-time entry | 2 |
| Claim.supportingInfo[1].code.coding.code | Code for encounter date-time | EDT |
| Claim.supportingInfo[1].valueString | Encounter date-time value | 2026-03-10T21:21:17+05:30 |
| Claim.supportingInfo[2].sequence | Sequence — general findings entry | 3 |
| Claim.supportingInfo[2].code.coding.code | Code for general findings | 100008 |
| Claim.supportingInfo[2].category.coding.code | Category code — investigation | INV |
| Claim.supportingInfo[2].valueReference.reference | Reference to lab findings bundle | urn:uuid:doc-bundle-lab-001 |
| Claim.supportingInfo[3].sequence | Sequence — visual acuity report | 4 |
| Claim.supportingInfo[3].code.coding.code | Code for visual acuity report | 100009 |
| Claim.supportingInfo[3].category.coding.code | Category code — attachment | ATT |
| Claim.supportingInfo[4].sequence | Sequence — discharge summary | 5 |
| Claim.supportingInfo[4].code.coding.code | Code for discharge summary | DIS |
| Claim.supportingInfo[4].category.coding.code | Category code — hospital discharge summary | HDS |
| Claim.supportingInfo[4].valueReference.reference | Reference to discharge summary bundle | urn:uuid:doc-bundle-discharge-001 |

ℹ  Note: Supporting Document Bundles (lab findings, visual acuity, discharge summary) are added as additional entries in the same collection bundle or as separate referenced bundles.

### 8.5 Response — ClaimResponse Bundle

The payer responds via a callback to POST /v1/preauth/on_submit. The provider must handle four distinct response outcomes, each identified by the ClaimResponse.outcome field and the x-hcx-workflow_id header.

#### Response Outcome Summary

| Outcome | Workflow ID | ClaimResponse.outcome | What It Means |
|---|---|---|---|
| Approved | 21 | complete | Full preauth granted at submitted amount. Proceed with treatment. |
| Partially Approved | — | partial | Approved at a lower amount (e.g., capped at package rate). Check processNote for reason. |
| Queried | 24 | partial / queried | Payer needs additional information. Respond using workflow 19. |
| Rejected | 23 | complete + cancelled adjudication | Preauth denied. Review adjudication reason and error codes. |

#### 8.5.1 Approved Response (Workflow 21)

| FHIR Element | Description | Sample Value |
|---|---|---|
| ClaimResponse.id | Unique identifier for this ClaimResponse | cr-001 |
| ClaimResponse.identifier[0].value | Pre-auth response number assigned by payer | PA-HP-2026-78901 |
| ClaimResponse.status | Lifecycle status | active |
| ClaimResponse.use | Response for a preauthorization request | preauthorization |
| ClaimResponse.outcome | Fully adjudicated outcome | complete |
| ClaimResponse.disposition | Human-readable approval description | Preauth APPROVED — Corneal Grafting procedure authorized |
| ClaimResponse.preAuthRef | Pre-auth reference number for use at service time | PREAUTH-HP-2026-78901 |
| ClaimResponse.item[0].adjudication[0].category.coding.code | Submitted amount | submitted |
| ClaimResponse.item[0].adjudication[0].amount.value | Total submitted amount (INR) | 13700 |
| ClaimResponse.item[0].adjudication[1].category.coding.code | Eligible amount | eligible |
| ClaimResponse.item[0].adjudication[1].amount.value | Eligible amount under scheme | 13700 |
| ClaimResponse.item[0].adjudication[2].category.coding.code | Co-payment | copay |
| ClaimResponse.item[0].adjudication[2].amount.value | Co-payment — zero = fully covered | 0 |
| ClaimResponse.item[0].adjudication[3].category.coding.code | Approved/benefit amount | benefit |
| ClaimResponse.item[0].adjudication[3].amount.value | Final approved amount payable | 13700 |
| ClaimResponse.total[0].category.coding.code | Total submitted | submitted |
| ClaimResponse.total[0].amount.value | Grand total submitted | 13700 |
| ClaimResponse.total[1].category.coding.code | Total approved | benefit |
| ClaimResponse.total[1].amount.value | Grand total approved | 13700 |
| ClaimResponse.total[1].category.coding.code | Tax Deduction | tax |
| ClaimResponse.total[1].amount.value | Tax Deducted | 100 |
| ClaimResponse.total[1].category.coding.code | Total eligible amount | eligible |
| ClaimResponse.total[1].amount.value | Total eligible amount | 13700 |
| ClaimResponse.total[1].category.coding.code | Hospital Incentive | incentive |
| ClaimResponse.total[1].amount.value | Hospital Incentive | 137 |
| ClaimResponse.total[1].category.coding.code | Patient Liable Amt | copayment |
| ClaimResponse.total[1].amount.value | Patient Liable Amt | 700 |

#### 8.5.2  Partially Approved Response

| FHIR Element | Description | Sample Value |
|---|---|---|
| ClaimResponse.outcome | Partial — not all items fully approved | partial |
| ClaimResponse.disposition | Explanation of partial approval | Preauth PARTIALLY APPROVED — Amount reduced per package rate |
| ClaimResponse.preAuthRef | Pre-auth reference for reduced amount | PREAUTH-HP-2026-78902 |
| ClaimResponse.item[0].adjudication[0].amount.value | Submitted amount (original) | 25000 |
| ClaimResponse.item[0].adjudication[1].amount.value | Eligible — capped at PMJAY package rate | 13700 |
| ClaimResponse.item[0].adjudication[2].amount.value | Co-payment — zero = fully cashless for patient | 0 |
| ClaimResponse.item[0].adjudication[3].amount.value | Approved benefit amount | 13700 |
| ClaimResponse.item[0].noteNumber[0] | References processNote explaining reduction | 1 |
| ClaimResponse.total[0].amount.value | Grand total submitted | 25000 |
| ClaimResponse.total[1].amount.value | Grand total approved (reduced to package rate) | 13700 |
| ClaimResponse.processNote[0].number | Note number linked to item | 1 |
| ClaimResponse.processNote[0].type | Note type | display |
| ClaimResponse.processNote[0].text | Reduction explanation | Amount reduced to package rate of INR 13,700 per PMJAY guidelines for SE012A (Corneal Grafting) |

#### 8.5.3 Queried Response (Workflow 24)

| FHIR Element | Description | Sample Value |
|---|---|---|
| ClaimResponse.outcome | Overall outcome — partial while item is queried | partial |
| ClaimResponse.adjudication[0].reason.coding.code | Claim-level adjudication result | queried |
| ClaimResponse.item[0].adjudication[0].category.coding.code | Eligible amount (partial — under review) | eligible |
| ClaimResponse.item[0].adjudication[0].amount.value | Eligible amount computed (may be partial) | 2700.00 |
| ClaimResponse.item[0].adjudication[1].category.coding.code | Audit trail / reason for query | reason |
| ClaimResponse.item[0].adjudication[1].reason.coding.display | Pipe-delimited query trail: USER~datetime~type~comment~trust | USER1000099~02/26/2026, 08:47~other~testing query~PPD-Trust |
| ClaimResponse.item[0].adjudication[2].category.coding.code | Eligible percentage — 0 while queried | eligpercent |
| ClaimResponse.item[0].adjudication[2].value | Eligible percentage value | 0 |
| ClaimResponse.item[0].adjudication[4].reason.coding.code | Item-level adjudication status | Queried |
| ClaimResponse.total[0].amount.value | Total benefit — 0 as claim is still queried | 0 |
| ClaimResponse.total[1].amount.value | Total eligible — 0 as claim is still queried | 0.00 |

ℹ  Note: In real-world PMJAY responses, the adjudication 'reason' field carries a pipe-delimited audit trail (USER~datetime~type~comment~trust) rather than a structured text field. This is a PMJAY-specific pattern embedded in the display value.

#### 8.5.4 Rejected Response (Workflow 23)

| FHIR Element | Description | Sample Value |
|---|---|---|
| ClaimResponse.outcome | Fully processed to a rejected/cancelled terminal state | complete |
| ClaimResponse.adjudication[0].reason.coding.code | Claim adjudication result | cancelled |
| ClaimResponse.adjudication[0].reason.coding.display | Status display | Cancelled |
| ClaimResponse.disposition | Human-readable rejection reason | Rejected preauth for claim VB26AA2600001 |
| ClaimResponse.total[0].category.coding.code | Benefit amount category | benefit |
| ClaimResponse.total[0].amount.value | Benefit amount — carried over but voided | 2700.00 |

ℹ  Note: When a preauth is rejected, ClaimResponse.outcome is 'complete' (the claim was fully processed) but the adjudication reason is 'cancelled'. This is different from a queried response where outcome may be 'partial'.

### 8.6 Cancellation Flow

A PreAuth cancellation is initiated by the provider using a FHIR Task resource submitted via POST /task/submit with workflow code 122. The Task must include a structured reasonCode explaining why the cancellation is being requested.

#### Cancellation Request — Task Elements

| FHIR Element | Description | Sample Value |
|---|---|---|
| Task.resourceType | Resource type identifier | Task |
| Task.status | Status of the cancellation request — 'requested' means pending payer action | requested |
| Task.intent | Task intent — directive to perform an action | order |
| Task.code.coding.system | HL7 financial task code system | http://terminology.hl7.org/CodeSystem/financialtaskcode |
| Task.code.coding.code | Task action — explicit cancellation code | cancel |
| Task.description | Free-text description of the cancellation | Please cancel the preauth for claim VB26AA2600001 |
| Task.reasonCode.coding.system | NDHM reason code system | https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-reason-code |
| Task.reasonCode.coding.code | Structured reason for cancellation | treatmentplanchanged |
| Task.reasonCode.coding.display | Reason display | Treatment plan changed during hospitalization. |
| Task.input[0].type.coding.code | Input type — claim number being cancelled | claimNumber |
| Task.input[0].valueString | Claim number value | VB26AA2600001 |
| Task.input[1].type.coding.code | Input type — intimation number | intimationNumber |
| Task.input[1].valueString | Intimation number value | VB26AA2600001 |
| Task.requester.reference | Organisation initiating the cancellation (provider) | Organization/prov |
| Task.owner.reference | Organisation responsible for processing (payer) | Organization/pay |

## Section 9: Use Case 4 — Claims Lifecycle

### 9.1 Business Context

The claims workflow is the most critical phase in the NHCX healthcare transaction lifecycle, where financial settlement is initiated and completed based on treatment delivered and supporting evidence. Everything that precedes it eligibility checks, preauth approval, discharge submission — exists to set the conditions under which a claim can be adjudicated cleanly. A well-prepared claim closes within days. A poorly prepared one cycles through queries, partial responses, and resubmissions for weeks.

NHCX structures this as a state-driven, multi-stage process rather than a single submission-response transaction. This design reflects the operational reality of hospital billing: discharge decisions, document collection, and final billing rarely happen simultaneously, and payers need to interact with providers incrementally before reaching a final adjudication decision.

Stage 1- Discharge-linked claim initiation Pre-discharge provisional submission

Before a patient leaves the ward, the hospital assembles a provisional claim. This is not a formality — it is the first moment the payer can scrutinise whether the treatment delivered matches what was pre-authorised.

#### What the provisional claim contains

- Treatment procedures performed and applicable benefit packages

- Final or estimated bill amounts at the point of discharge

- Supporting clinical and billing documents available at that stage

#### What the payer does with it

- Performs early document validation before the patient leaves

- Checks admissibility and compliance against the approved preauth reference

- Returns an initial response — approval, query, or rejection — before discharge is finalised

Aligning discharge with payer validation before the patient leaves is the single most effective way to prevent disputes at the final claim stage. Corrections are far cheaper before discharge than after.

NHCX workflow: This stage uses the Discharge Submitted workflow identifier. The payer responds with Discharge Approved or a corresponding rejection or query status.

#### PMJAY exception — merged discharge and claim flow

In PMJAY, there is no separate discharge workflow. Hospitals submit directly using the Claim Submitted workflow identifier — discharge and claim initiation are merged into a single flow. This simplifies operations but increases the importance of accurate and complete claim submission upfront, since there is no intermediate provisional checkpoint.

Stage 2- Final claim submission Post-discharge complete submission for adjudication

The provisional submission handles validation. The final submission handles settlement.

After discharge, the provider assembles the complete claim package and submits it as the formal claim for adjudication, the document set from which the payer will calculate the approved amount, apply deductions, and issue the final financial decision.

#### What the final claim must contain

- All finalised bills and itemised line items

- Complete supporting documents: discharge summary, clinical notes, diagnostics, operative records

- Any additional clarifications or documents that were flagged during the provisional review

- The preauth reference number linking back to the approved preauthorisation

The transition from provisional to final is structurally significant. A provisional response can be partial or queried and the claim remains open. A final response — marked response.complete — closes the claim permanently. Once issued, no further provider submissions or payer responses are permitted against that claim identifier.

Stage 3- NHCX workflow state model  Workflow identifiers and protocol statuses

NHCX tracks the claim lifecycle through workflow identifiers carried in the JWE protected header (x-hcx-workflow_id). These identifiers are not just routing labels — they determine what the gateway accepts, what the payer is permitted to respond with, and what state transitions are valid.

#### a. Provider-initiated workflow states

| Workflow identifier | Description |
|---|---|
| Discharge Submitted | Hospital submits provisional claim before or at the point of patient discharge. Triggers early payer scrutiny and validation against the preauth. |
| Claim Submitted | Final claim submitted for formal adjudication after discharge. Also used in PMJAY as the single combined discharge-and-claim submission. |
| Claim Resubmitted | Provider resubmits the claim after addressing a query, deficiency notice, or partial rejection from the payer. |

#### b. Payer response workflow states

| Workflow identifier | Description |
|---|---|
| Discharge Approved | Payer accepts the provisional discharge submission. Provider may proceed to final claim submission. |
| Discharge Rejected | Provisional submission rejected. Provider must correct identified issues before submitting the final claim. |
| Claim Approved | Full claim adjudication complete. Total submitted amount approved for settlement. |
| Claim Partially Approved | Payer approves a subset of line items or a reduced amount. Non-admissible components excluded with itemised reasons. |
| Claim Rejected | Claim rejected in full. Structured reason codes provided. Provider may evaluate whether a corrected resubmission is appropriate. |
| Claim Queried | Payer requires additional documents or clinical clarification before issuing a decision. Claim remains open pending provider response. |

Stage 4- Multi-stage payer responses  Iterative adjudication model

One of NHCX's most operationally significant design choices is allowing payers to respond multiple times before closing a claim. This is modelled through two distinct response types: partial and complete.

#### a. Partial responses — response.partial

Partial responses represent the payer's working state during adjudication. A payer can issue multiple partial responses against a single claim, each carrying content:

- Interim decisions such as approvals on specific line items

- Remarks on admissibility or compliance for specific procedures

#### b. Final responses — response.complete

The complete response is the closure signal for the entire claim lifecycle. When the payer issues response.complete:

- Claim adjudication is fully concluded

- The financial decision such as approved, partially approved, or rejected with specific amounts is determined and fixed

- No further provider submissions or payer responses are permitted against this claim identifier

- The final response triggers the downstream payment advice and settlement workflow

Implementation note: Providers must check response.outcome on every callback. outcome=complete with an approved adjudication triggers settlement processing. outcome=partial means the claim is still live , continue monitoring for further callbacks on the same correlation ID.

Stage 5- Adjudication and settlement  Payer evaluation criteria and financial closure

Adjudication is the payer's structured evaluation of the claim against four operational dimensions:

| Evaluation dimension | What the payer assesses |
|---|---|
| Policy coverage and benefit limits | Whether the treatment, procedures, and packages claimed fall within the beneficiary's approved scheme entitlements and remaining limits. |
| Clinical appropriateness | Whether the treatment delivered is clinically appropriate for the diagnosed condition, procedure codes used, and length of stay. |
| Document completeness and authenticity | Whether all required supporting documents are present, legible, complete, and consistent with the clinical and billing records. |
| Package rates and financial rules | Whether the submitted amounts conform to the approved package rates, NHCX pricing rules, and any scheme-specific financial regulations. |

#### Adjudication outcomes

| Outcome | ClaimResponse.outcome | Description |
|---|---|---|
| Full approval | complete (approved) | All line items and amounts accepted. Settlement proceeds for the full submitted amount. |
| Partial approval | partial (approved) | A subset of line items or a reduced amount approved. Non-admissible components excluded with itemised adjudication remarks and reason codes. |
| Rejection | complete (rejected) | Claim rejected in full. Detailed reason codes identify whether a corrected resubmission is appropriate and what it must contain. |
| Queried | partial (queried) | Payer cannot decide without additional information. Claim remains open. Provider must respond with required documents or clarifications. |

#### Settlement sequence

Settlement is executed only after a response.complete with an approved or partially approved outcome is received. The payment lifecycle then proceeds through three NHCX workflow callbacks:

| Workflow | Status | Provider action |
|---|---|---|
| wf 30 | Payment initiated | Payer has initiated the bank transfer. Record the payment advice in the claim ledger. |
| wf 31 | Payment processed | Banking system confirms the transfer is processing. Update claim status. |
| wf 33 | Payment settled | Transfer complete. UTR number available in PaymentReconciliation.paymentIdentifier.value. Mark claim as SETTLED. Persist UTR for audit. |

End-to-end closure: A claim is considered fully closed only when wf 33 (Payment Settled) is received and the UTR number is persisted. response.complete from the payer closes the adjudication phase; wf 33 closes the financial phase.

### 9.2 Claims Lifecycle Overview

Figure 10 — Claim Lifecycle Swimlane

### 9.3 Business Conditions

| Condition | Requirement |
|---|---|
| Patient Identity | PMJAY Member ID and ABHA number must be present in the Patient resource |
| Provider Verification | Provider must be an active NHCX participant with a valid NPI facility code |
| Clinical Evidence | Diagnosis (ICD-10), Procedure (NRCes code), Care Team, and Supporting Info must all be present |
| Supporting Documents | Mandatory documents as per InsurancePlan/eligibility response must be attached |
| Coverage Reference | Active Coverage resource with valid policy identifier must be included |
| Workflow Code | As appropriate |

### 9.4 Request — Claim Bundle

### 9.4.1 Unified FHIR design - one resource, two stages

NHCX follows a unified FHIR design where both preauthorisation and final claim are represented using the same FHIR Claim resource. Preauthorisation and claim are not separate entities — they are two stages of the same financial lifecycle, differentiated by a single field.

| Dimension | Preauthorisation | Claim |
|---|---|---|
| Stage | Prospective — before treatment | Retrospective — after treatment |
| Purpose | Seek payer approval to proceed | Seek payer reimbursement for treatment delivered |
| Data state | Proposed or estimated | Finalised and actual |
| Documents | Preliminary clinical reports | Complete evidentiary set including discharge summary |
| Payer outcome | Approved / queried / rejected | Settled (full / partial) / queried / rejected |
| Claim.use | preauthorization | claim |

### 9.4.2 Key differentiator — Claim.use

The only structural difference between a preauthorisation and a claim is the Claim.use field. This single field drives all payer-side processing logic. All other FHIR elements — patient, coverage, provider, diagnosis, procedure, supportingInfo, item, total — are identical across both workflows.

| Claim.use value | Payer interpretation | Processing behaviour |
|---|---|---|
| preauthorization | Approval request — treatment not yet delivered | Eligibility checks, coverage validation, approval decision |
| claim | Settlement request — treatment completed | Detailed adjudication, document scrutiny, financial settlement |

Design principle: Implementors build one reusable FHIR payload structure and switch between preauth and claim by changing only Claim.use. All other build logic is shared.

### 9.4.3 Data continuity across the lifecycle

NHCX strongly encourages continuity between preauthorisation and claim. The preauth payload should serve as the base for claim submission:

- Reuse the same Claim.identifier or reference the preAuthRef from the approved preauth ClaimResponse

- Reuse diagnosis and procedure entries — update only if treatment deviated from the approved preauth plan

- Replace estimated amounts with finalised bill amounts

- Add the complete document set: discharge summary, operative notes, diagnostics, final itemised billing

This reduces duplication and materially improves adjudication efficiency — the payer can cross-reference the claim against the already-validated preauth record.

### 9.4.4 Claim resource — header elements

| FHIR element | Description | Sample value |
|---|---|---|
| Claim.resourceType | Root resource type identifier | Claim |
| Claim.id | Logical UUID for this Claim resource | 979f2826-1a18-4857-8c4a-182cfc4deb1f |
| Claim.status | Current lifecycle status of the claim | active |
| Claim.type.coding.system | Coding system for claim type | http://snomed.info/sct |
| Claim.type.coding.code | SNOMED code for inpatient care | 737481003 |
| Claim.type.coding.display | Human-readable claim type label | Inpatient care management |
| Claim.use | Identifies this as a final claim (not preauth) | claim |
| Claim.patient.reference | Reference to the Patient resource in the bundle | urn:uuid:400f5443-bb92-4c8c-a7ee-61a3215ad614 |
| Claim.created | Date and time the claim was created | 2026-03-19T11:46:34+05:30 |
| Claim.billablePeriod.start | Billable period start — patient admission date | 2026-03-10T21:21:17+05:30 |
| Claim.billablePeriod.end | Billable period end — patient discharge date | 2026-03-19T11:46:34+05:30 |
| Claim.provider.reference | Reference to the providing Organisation in the bundle | urn:uuid:5de82a74-bfb1-4192-a17c-fb5458c8a3b4 |
| Claim.insurer.reference | Reference to the insurer / payer Organisation | urn:uuid:49f712ea-e54d-4a56-9610-d773df4dde2c |
| Claim.priority.coding.code | Processing priority for this claim | normal |
| Claim.insurance[0].sequence | Sequence number of the primary insurance entry | 1 |
| Claim.insurance[0].focal | Marks this as the primary / focal insurance record | true |
| Claim.insurance[0].coverage.reference | Reference to the Coverage resource in the bundle | urn:uuid:05b739c7-c343-48da-a6cc-9d2d7d72c2e4 |
| Claim.total.value | Total claimed monetary amount | 13700 |
| Claim.total.currency | Currency code for the total amount | INR |

### 9.4.5 Diagnosis elements

| FHIR element | Description | Sample value |
|---|---|---|
| Claim.diagnosis[0].sequence | Sequence number for the primary diagnosis entry | 1 |
| Claim.diagnosis[0].diagnosisCodeableConcept.coding.system | ICD-10 coding system URI | http://hl7.org/fhir/sid/icd-10 |
| Claim.diagnosis[0].diagnosisCodeableConcept.coding.code | ICD-10 code for the primary (admitting) diagnosis | H18.6 |
| Claim.diagnosis[0].diagnosisCodeableConcept.coding.display | Human-readable primary diagnosis name | Keratoconus |
| Claim.diagnosis[0].type.coding.code | Diagnosis type — admitting diagnosis | admitting |
| Claim.diagnosis[0].type.coding.display | Diagnosis type display label | Admitting Diagnosis |
| Claim.diagnosis[0].onAdmission.coding.code | Present on admission indicator | y |
| Claim.diagnosis[1].sequence | Sequence number for the secondary diagnosis entry | 2 |
| Claim.diagnosis[1].diagnosisCodeableConcept.coding.code | ICD-10 code for the secondary / comorbid diagnosis | H17.8 |
| Claim.diagnosis[1].diagnosisCodeableConcept.coding.display | Human-readable secondary diagnosis name | Other corneal scars and opacities |
| Claim.diagnosis[1].type.coding.code | Diagnosis type — clinical (comorbidity) | clinical |

### 9.4.6 Procedure and item elements

| FHIR element | Description | Sample value |
|---|---|---|
| Claim.procedure[0].sequence | Sequence number for the procedure entry | 1 |
| Claim.procedure[0].procedureReference.reference | UUID reference to the FHIR Procedure resource | urn:uuid:709ef58c-cea0-4891-aeca-0e09d9c8de02 |
| Claim.procedure[0].procedureReference.display | Human-readable procedure name | Corneal Grafting |
| Claim.procedure[0].date | Date and time the procedure was performed | 2026-03-12T05:30:00+05:30 |
| Claim.item[0].sequence | Sequence number for the claim line item | 1 |
| Claim.item[0].careTeamSequence | References to care team members involved in this item | [1, 2] |
| Claim.item[0].diagnosisSequence | References to diagnoses linked to this item | [1] |
| Claim.item[0].procedureSequence | References to procedures linked to this item | [1] |
| Claim.item[0].category.coding.system | Coding system for the PMJAY benefit category | https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-benefit-category |
| Claim.item[0].category.coding.code | PMJAY benefit category code | SE |
| Claim.item[0].category.coding.display | Benefit category display name | Ophthalmology |
| Claim.item[0].productOrService.coding.system | Coding system for the PMJAY procedure code | https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-procedure-code |
| Claim.item[0].productOrService.coding.code | PMJAY procedure code | SE012A |
| Claim.item[0].productOrService.coding.display | Procedure display name | Corneal Grafting |
| Claim.item[0].servicedPeriod.start | Service start date for this line item | 2026-03-10T21:21:17+05:30 |
| Claim.item[0].quantity.value | Number of service units | 1 |
| Claim.item[0].unitPrice.value | Unit price of the service in INR | 13700 |
| Claim.item[0].unitPrice.currency | Currency code for the unit price | INR |
| Claim.item[0].net.value | Net amount for this line item (quantity × unit price) | 13700 |
| Claim.item[0].informationSequence | References to supportingInfo entries linked to this item | [1, 2, 3, 4, 5] |

### 9.4.7 Care team elements

| FHIR element | Description | Sample value |
|---|---|---|
| Claim.careTeam[0].sequence | Sequence number for the primary care team member | 1 |
| Claim.careTeam[0].provider.reference | Reference to the primary Practitioner resource in the bundle | urn:uuid:64661d5c-3b29-4214-9825-35cb225c2303 |
| Claim.careTeam[0].provider.display | Display name of the primary treating provider | Dr. Amit Sharma |
| Claim.careTeam[0].role.coding.code | Role code — primary treating provider | primary |
| Claim.careTeam[0].qualification.coding.code | Medical qualification code | ophthalmology |
| Claim.careTeam[0].qualification.coding.display | Qualification display name | Ophthalmology |
| Claim.careTeam[1].sequence | Sequence number for the assisting care team member | 2 |
| Claim.careTeam[1].provider.display | Display name of the assisting provider | Dr. Priya Menon |
| Claim.careTeam[1].role.coding.code | Role code — assisting / supporting provider | assist |
| Claim.careTeam[1].qualification.coding.code | Medical qualification code | anaesthesia |
| Claim.careTeam[1].qualification.coding.display | Qualification display name | Anaesthesia |

### 9.4.8 Supporting information elements

| FHIR element | Description | Sample value |
|---|---|---|
| Claim.supportingInfo[0].sequence | Sequence — admission-discharge dates entry | 1 |
| Claim.supportingInfo[0].code.coding.code | Code for admission-discharge dates | ADDD |
| Claim.supportingInfo[0].category.coding.code | Category code — onset dates | ONS |
| Claim.supportingInfo[0].valueString | Admission date value | 2026-03-10T21:21:17+05:30 |
| Claim.supportingInfo[1].sequence | Sequence — encounter date-time entry | 2 |
| Claim.supportingInfo[1].code.coding.code | Code for encounter date-time | EDT |
| Claim.supportingInfo[1].valueString | Encounter date-time value | 2026-03-10T21:21:17+05:30 |
| Claim.supportingInfo[2].sequence | Sequence — general clinical findings (lab report) | 3 |
| Claim.supportingInfo[2].code.coding.code | Code for general findings document | 100008 |
| Claim.supportingInfo[2].category.coding.code | Category code — investigation report | INV |
| Claim.supportingInfo[2].valueReference.reference | Reference to the lab findings bundle entry | urn:uuid:doc-bundle-lab-001 |
| Claim.supportingInfo[3].sequence | Sequence — visual acuity report | 4 |
| Claim.supportingInfo[3].code.coding.code | Code for visual acuity report (mandatory for SE012A) | 100009 |
| Claim.supportingInfo[3].category.coding.code | Category code — attachment | ATT |
| Claim.supportingInfo[4].sequence | Sequence — discharge summary | 5 |
| Claim.supportingInfo[4].code.coding.code | Code for discharge summary | DIS |
| Claim.supportingInfo[4].category.coding.code | Category code — hospital discharge summary | HDS |
| Claim.supportingInfo[4].valueReference.reference | Reference to the discharge summary bundle entry | urn:uuid:doc-bundle-discharge-001 |

Supporting document bundles: Lab findings, visual acuity reports, and the discharge summary are added as additional entries in the same collection Bundle, or as separate referenced bundles. Each supportingInfo.valueReference points to the corresponding bundle entry UUID.

.

### 9.5 Response — ClaimResponse Bundle

The payer sends the adjudication response as a callback to POST /v1/claim/on_submit. Four distinct outcomes are possible, each identified by ClaimResponse.outcome combined with the adjudication reason code. Reading both fields together is essential — outcome alone is not sufficient to determine the payer's decision.

### 9.5.1 Response outcome summary

| Outcome | outcome | Reason code | What it means and what to do |
|---|---|---|---|
| Approved | complete | approved | Full claim approved at submitted amount. Await payment advice callbacks wf 30 → 31 → 33. |
| Partially approved | partial | approved | Approved at a reduced amount (e.g., capped at PMJAY package rate). Read processNote for reduction reason. Await settlement for the approved amount. |
| Queried | partial | queried | Payer requires additional documents or clarification. Claim remains open. Collect required items and resubmit using workflow 19. |
| Rejected | complete | cancelled | Claim denied in full. The claim is closed — no further responses will be issued. Review reason codes. Evaluate reprocess request (wf 18). |

Key rule: outcome=complete applies to BOTH approved and rejected states. Always check outcome AND adjudication reason together. outcome=partial means the claim is still live and awaiting further action.

9.5.2 Approved Response

The payer has approved the full submitted amount. All adjudication amounts — submitted, eligible, and benefit — carry the same value. Copay is zero, confirming fully cashless coverage for the beneficiary.

| FHIR element | Description | Sample value |
|---|---|---|
| ClaimResponse.id | Unique identifier for this ClaimResponse | cr-001 |
| ClaimResponse.identifier[0].value | Claim response reference number assigned by the payer | PA-HP-2026-78901 |
| ClaimResponse.status | Lifecycle status of the ClaimResponse | active |
| ClaimResponse.use | Mirrors Claim.use — identifies this as a claim response | claim |
| ClaimResponse.outcome | Adjudication fully completed | complete |
| ClaimResponse.disposition | Human-readable approval description from payer | Claim APPROVED — Corneal Grafting procedure authorized |
| ClaimResponse.preAuthRef | Pre-auth reference number assigned for this claim | PREAUTH-HP-2026-78901 |
| ClaimResponse.item[0].adjudication[0].category.coding.code | Adjudication category — submitted amount | submitted |
| ClaimResponse.item[0].adjudication[0].amount.value | Total submitted amount in INR | 13700 |
| ClaimResponse.item[0].adjudication[1].category.coding.code | Adjudication category — eligible amount | eligible |
| ClaimResponse.item[0].adjudication[1].amount.value | Eligible amount under the PMJAY scheme | 13700 |
| ClaimResponse.item[0].adjudication[2].category.coding.code | Adjudication category — co-payment | copay |
| ClaimResponse.item[0].adjudication[2].amount.value | Co-payment — zero indicates fully cashless for beneficiary | 0 |
| ClaimResponse.item[0].adjudication[3].category.coding.code | Adjudication category — approved benefit amount | benefit |
| ClaimResponse.item[0].adjudication[3].amount.value | Final approved amount payable to the provider | 13700 |
| ClaimResponse.total[0].category.coding.code | Grand total category — submitted | submitted |
| ClaimResponse.total[0].amount.value | Grand total submitted across all items | 13700 |
| ClaimResponse.total[1].category.coding.code | Grand total category — approved benefit | benefit |
| ClaimResponse.total[1].amount.value | Grand total approved for settlement | 13700 |
| ClaimResponse.total[1].category.coding.code | Tax Deduction | tax |
| ClaimResponse.total[1].amount.value | Tax Deducted | 100 |
| ClaimResponse.total[1].category.coding.code | Total eligible amount | eligible |
| ClaimResponse.total[1].amount.value | Total eligible amount | 13700 |
| ClaimResponse.total[1].category.coding.code | Hospital Incentive | incentive |
| ClaimResponse.total[1].amount.value | Hospital Incentive | 137 |
| ClaimResponse.total[1].category.coding.code | Patient Liable Amt | copayment |
| ClaimResponse.total[1].amount.value | Patient Liable Amt | 700 |

9.5.3 Partially Approved Response

The payer has approved a reduced amount. In this example the submitted amount of INR 25,000 is capped at the PMJAY package rate of INR 13,700 for procedure SE012A. The reduction reason is carried in a processNote linked to the item via noteNumber.

| FHIR element | Description | Sample value |
|---|---|---|
| ClaimResponse.outcome | Partial — items approved at amounts below submitted | partial |
| ClaimResponse.disposition | Human-readable partial approval explanation | Claim PARTIALLY APPROVED — Amount reduced per package rate |
| ClaimResponse.preAuthRef | Pre-auth reference for the reduced approval | PREAUTH-HP-2026-78902 |
| ClaimResponse.item[0].adjudication[0].amount.value | Original submitted amount in INR | 25000 |
| ClaimResponse.item[0].adjudication[1].amount.value | Eligible amount — capped at PMJAY package rate | 13700 |
| ClaimResponse.item[0].adjudication[2].amount.value | Co-payment — zero means fully cashless for patient | 0 |
| ClaimResponse.item[0].adjudication[3].amount.value | Approved benefit amount after package rate cap | 13700 |
| ClaimResponse.item[0].noteNumber[0] | Links this item to the processNote for the reduction | 1 |
| ClaimResponse.total[0].amount.value | Grand total submitted | 25000 |
| ClaimResponse.total[1].amount.value | Grand total approved — reduced to package rate | 13700 |
| ClaimResponse.processNote[0].number | Note number — referenced from item.noteNumber | 1 |
| ClaimResponse.processNote[0].type | Note type | display |
| ClaimResponse.processNote[0].text | Reduction explanation from payer | Amount reduced to package rate of INR 13,700 per PMJAY guidelines for SE012A (Corneal Grafting) |

9.5.4 Queried Response

The payer cannot adjudicate without additional information. The claim remains open. All financial totals are set to zero while the query is active. The PMJAY-specific audit trail in the adjudication reason field records the query history as a pipe-delimited string.

| FHIR element | Description | Sample value |
|---|---|---|
| ClaimResponse.outcome | Partial — claim is open and awaiting provider response | partial |
| ClaimResponse.adjudication[0].reason.coding.code | Claim-level adjudication status code | queried |
| ClaimResponse.item[0].adjudication[0].category.coding.code | Item adjudication — eligible amount (may be partial) | eligible |
| ClaimResponse.item[0].adjudication[0].amount.value | Eligible amount computed — may carry a partial value | 2700.00 |
| ClaimResponse.item[0].adjudication[1].category.coding.code | PMJAY audit trail field — pipe-delimited query history | reason |
| ClaimResponse.item[0].adjudication[1].reason.coding.display | Audit trail value: USER~date~type~comment~trust | USER1000099~02/26/2026, 08:47~other~testing query~CPD-Trust |
| ClaimResponse.item[0].adjudication[2].category.coding.code | Eligible percentage — zero while claim is queried | eligpercent |
| ClaimResponse.item[0].adjudication[2].value | Eligible percentage value | 0 |
| ClaimResponse.item[0].adjudication[4].reason.coding.code | Item-level adjudication status | Queried |
| ClaimResponse.total[0].amount.value | Total benefit — set to zero while claim is under query | 0 |
| ClaimResponse.total[1].amount.value | Total eligible — set to zero while claim is under query | 0.00 |

PMJAY audit trail pattern: The adjudication reason field in PMJAY queried responses carries a pipe-delimited string in the format USER~datetime~type~comment~trust rather than a structured code. Multiple query entries are separated by | (pipe). Parse this as a plain string — do not attempt FHIR coding lookup on it.

9.5.5 Rejected Response

The claim has been rejected in full. outcome=complete signals the claim lifecycle is fully processed and permanently closed. The adjudication reason code 'cancelled' distinguishes rejection from a full approval — both carry outcome=complete.

| FHIR element | Description | Sample value |
|---|---|---|
| ClaimResponse.outcome | Fully processed to a terminal state — closed | complete |
| ClaimResponse.adjudication[0].reason.coding.code | Adjudication result — cancelled identifies rejection vs approval | cancelled |
| ClaimResponse.adjudication[0].reason.coding.display | Human-readable adjudication status | Rejected |
| ClaimResponse.disposition | Human-readable rejection reason from payer | Rejected Claim for claim VB26AA2600001 |
| ClaimResponse.total[0].category.coding.code | Benefit amount total category | benefit |
| ClaimResponse.total[0].amount.value | Benefit amount — carried in payload but voided by rejection status | 2700.00 |

Rejected vs approved — same outcome field: Both approved and rejected ClaimResponses carry outcome=complete. The differentiator is adjudication[0].reason.coding.code: 'approved' for acceptance, 'cancelled' for rejection. Always check BOTH fields. Never treat outcome=complete as approval without also verifying the reason code.

### 9.5.6  Claim Response parser decision table

Use the following logic to classify every incoming ClaimResponse callback:

| outcome | Reason code | Totals — benefit | Action |
|---|---|---|---|
| complete | approved | > 0 | Full approval. Trigger settlement tracking. Await payment advice wf 30 → 31 → 33. |
| partial | approved | > 0 | Partial approval. Record reduced benefit. Read processNote for reduction reason. Await settlement. |
| partial | queried | = 0 | Claim queried. Parse audit trail from adjudication reason display. Collect required docs and resubmit via workflow 19. |
| complete | cancelled | 0 or carried | Claim rejected. Parse rejection reason. Decide whether to raise reprocess request (wf 18) or close the claim. |

## Section 10: Use Case 5 — Reprocess Lifecycle

### 10.1 Business Context

Reprocessing (or appeal) of claims is a critical post-adjudication capability in the NHCX ecosystem. It ensures that claims which are partially approved or rejected during initial adjudication can be reviewed, corrected, and fairly reassessed based on additional information or justification.

This mechanism is aligned with regulatory expectations defined by the National Health Authority (NHA) and the Insurance Regulatory and Development Authority of India, which mandate a structured and transparent dispute resolution process between providers and payers.

1.⁠ ⁠Business Need for Reprocessing

In real-world claim processing:

- Claims are often not fully approved in the first pass

- Decisions may result in:

- Partial approvals (reduced payable amounts)

- Full rejections

These outcomes may occur due to:

- Missing or insufficient documentation

- Policy interpretation differences

- Clinical validation gaps

- Package or pricing discrepancies

Without a formal reprocessing mechanism:

- Providers have no structured way to contest decisions

- Valid claims may remain underpaid or denied

- Disputes move outside the system, reducing transparency

Reprocessing addresses this by enabling a controlled, system-driven appeal workflow.

2.⁠ ⁠Purpose of the Appeal Mechanism

The reprocessing flow enables providers to:

- Request re-evaluation of adjudicated claims

- Submit additional documents or clarifications

- Highlight justification for reconsideration

- Ensure fair settlement outcomes

It transforms claim adjudication into a reviewable and iterative process, rather than a one-time decision.

3.⁠ ⁠NHCX Design Approach

NHCX implements reprocessing using a FHIR-based standardized interaction model, ensuring interoperability across all participants.

3.1 Use of FHIR Task Resource

- Reprocessing requests are created using the FHIR Task resource

- The Task represents an action request for claim reconsideration

3.2 Task Classification

- Task includes a category or intent indicating:

- Reprocessing

- Appeal

3.3 Key Input Parameters

The Task request typically carries:

- Claim identifier (link to original claim)

- Policy or coverage details

- Reason for appeal (structured or narrative)

- Additional supporting documents

- Any revised or supplementary information

This ensures the payer receives complete context for reassessment.

4.⁠ ⁠End-to-End Workflow

Step 1: Identification of Dispute

- Provider reviews adjudication outcome

- Identifies discrepancies (partial approval or rejection)

Step 2: Appeal Submission

- Provider raises a Task (reprocessing request) via NHCX

- Includes justification and supporting evidence

Step 3: Payer Intake

- Payer receives the Task

- Validates:

- Request completeness

- Eligibility for reprocessing

Step 4: Re-adjudication

- Payer reopens the claim for evaluation

- Considers:

- Original claim details

- Newly submitted documents

- Appeal justification

Step 5: Final Decision

- Payer issues a final adjudication response, which may be:

- Fully approved

- Partially approved (revised)

- Rejected

5.⁠ ⁠Nature of Response and Finality

- The reprocessing response is considered final within the workflow context

- It represents the conclusive outcome of the dispute resolution process

- No further standard reprocessing cycles are expected unless explicitly allowed by scheme rules

This ensures:

- Closure of claims

- Clear audit trail

- Reduced ambiguity

6.⁠ ⁠Key Characteristics of the NHCX Reprocessing Flow

- Standardized

- Implemented using FHIR Task, ensuring uniformity

- Traceable

- Always linked to the original claim and prior adjudication

- Transparent

- Includes reasons, documents, and structured communication

- Interoperable

- Works across different payer and provider systems

- Regulatory-Compliant

- Aligns with NHA and IRDAI dispute resolution requirements

7.⁠ ⁠Implementation Guidance

For Providers

- Raise appeals only when - there is valid justification, additional supporting evidence is available. It ensures correct claim reference linkage and complete documentation submission

For Payers

- Enable structured re-adjudication workflows provide clear and reasoned responses, Updated adjudication details, Maintain SLA adherence for appeal resolution.

### 10.2 Reprocess Lifecycle Overview

Figure 11 — Reprocess Lifecycle Swimlane

### 10.3 Business Conditions

| Condition | Requirement |
|---|---|
| Patient Identity | PMJAY Member ID and ABHA number must be present in the Patient resource |
| Provider Verification | Provider must be an active NHCX participant with a valid NPI facility code |
| Claim Referece attributes | claimNumber, PolicyNumber |
| Supporting Documents | Evidences of reconsideration |
| Workflow Code | As appropriate |

### 10.4 Request — Task Bundle

| FHIR Element | Description | Sample Value |
|---|---|---|
| Task.resourceType | Resource type identifier | Task |
| Task.id | Logical UUID for this Task resource | a9f8295b-a0cf-410d-9ed5-1370523e57bd |
| Task.meta.profile[0] | NDHM FHIR profile the Task conforms to | https://nrces.in/ndhm/fhir/r4/StructureDefinition/Task |
| Task.status | Task lifecycle status — requested means awaiting payer action | requested |
| Task.intent | Task intent — order indicates a directive to perform an action | order |
| Task.code.coding.system | Coding system for the task action code | http://terminology.hl7.org/CodeSystem/financialtaskcode |
| Task.code.coding.code | Task action code — reprocess, cancel, release, or nullify as per use case | reprocess |
| Task.code.coding.display | Human-readable label for the task code | Reprocess |
| Task.description | Free-text description of why reprocess is being requested | Requesting reprocess of claim VB26AA2600001 due to rejection |
| Task.authoredOn | Date and time the reprocess request was created by the provider | 2026-03-21T10:00:00+05:30 |
| Task.requester.reference | URL reference to the Organisation initiating the reprocess (provider) | urn:uuid:org-provider-001 |
| Task.requester.display | Display name of the requesting organisation | Apollo Hospital, Hyderabad |
| Task.owner.reference | URL reference to the Organisation responsible for processing (payer) | urn:uuid:org-payer-001 |
| Task.owner.display | Display name of the owning organisation (payer) | SHA HP |
| Task.reasonCode.coding.system | Coding system for the reprocess reason code | https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-reason-code |
| Task.reasonCode.coding.code | Structured reason code explaining why reprocess is needed | rejectiondisputed |
| Task.reasonCode.coding.display | Human-readable reprocess reason | Rejection is disputed — additional evidence provided |
| Task.basedOn[0].reference | Reference to the original Claim or ClaimResponse this task is based on | Claim/VB26AA2600001 |
| Task.basedOn[0].display | Display label for the referenced claim | Original claim VB26AA2600001 |
| Task.for.reference | Reference to the Patient this task is for | Patient/PMJAY-HP-123456 |
| Task.for.display | Display name of the patient | Rajesh Kumar |

| FHIR Element | Description | Sample Value |
|---|---|---|
| Task.input[0].type.coding.system | Coding system for the Task input type | https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code |
| Task.input[0].type.coding.code | Input type code — identifies the claim being reprocessed | claimNumber |
| Task.input[0].type.coding.display | Human-readable label for the input type | Claim Number |
| Task.input[0].valueString | The actual claim number value to be reprocessed | VB26AA2600001 |
| Task.input[1].type.coding.system | Coding system for the second Task input type | https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code |
| Task.input[1].type.coding.code | Input type — intimation number (note: real payload uses initimationNumber) | intimationNumber |
| Task.input[1].type.coding.display | Human-readable label | Intimation Number |
| Task.input[1].valueString | Intimation number value — often same as claim number | VB26AA2600001 |
| Task.input[2].type.coding.code | Optional: reason detail or supporting doc reference type | supportingDocument |
| Task.input[2].valueString | Optional: additional document reference or free-text evidence | Discharge summary updated — see bundle ref doc-bundle-discharge-002 |

| Workflow Code | Constant | Description |
|---|---|---|
| 18 | REPROCESS_REQUEST_SUBMITTED | Provider submits reprocess request via /v1/task/submit |
| 251 | REPROCESS_REQUEST_RECEIVED | Payer acknowledges receipt of the reprocess request |
| 252 | REPROCESS_REQUEST_APPROVED | Reprocess approved — payer will re-adjudicate and pay |
| 253 | REPROCESS_REQUEST_REJECTED | Reprocess rejected — payer upholds original decision |
| 254 | REPROCESS_REQUEST_QUERIED | Payer needs more information before deciding on reprocess |
| 30 | PAYMENT_INITIATED | Payment initiated by payer after reprocess approval |
| 31 | PAYMENT_PROCESSED | Payment has been processed by payer |
| 33 | PAYMENT_SETTLED | Payment fully settled — UTR number available in payload |

### 10.5 Response — Task resource – Outcome as ClaimResponse Bundle

When the payer responds to a /v1/task/submit reprocess request, the callback arrives at /v1/task/on_submit as a Task bundle, not a standalone ClaimResponse bundle. The structure mirrors the request bundle in reverse:

The outer wrapper is a Bundle (collection) containing a Task resource with Task.status set to completed. Inside Task.output, the payer includes a valueReference pointing to a ClaimResponse resource and that ClaimResponse is structurally identical to a normal claim adjudication response.

This means your callback parser for /claim/on_submit and /task/on_submit can share the same ClaimResponse processing logic. The only difference is how you reach it:

- In a normal claim callback → ClaimResponse is a direct Bundle.entry resource

- In a reprocess task callback → ClaimResponse is nested inside Task.output[].valueReference

The ClaimResponse.outcome field drives the decision exactly as it does in regular adjudication:

Implementation note: When parsing the callback, extract the ClaimResponse from Task.output[0].valueReference.reference, resolve that reference within the bundle entries, then pass it through your standard adjudication parser. The preAuthRef (for preauth reprocess) or the approved/benefit amounts (for claim reprocess) will be present in the same fields as always ClaimResponse.total, ClaimResponse.item[].adjudication[], and ClaimResponse.processNote[] for any reduction or query explanation.

#### Response Outcome Summary

| Outcome | Workflow ID | ClaimResponse.outcome | What It Means |
|---|---|---|---|
| Approved | 252 | complete | Full Claim approved at submitted amount.. |
| Partially Approved | - | partial | Approved at a lower amount (e.g., capped at package rate). Check processNote for reason. |
| Queried | 254 | partial / queried | Payer needs additional information. Respond using workflow 19. |
| Rejected | 253 | complete + cancelled adjudication | Claim denied. Review adjudication reason and error codes. |

Refer workflow IDs as per the scenarios.

#### 10.5.1 Approved Response

| FHIR Element | Description | Sample Value |
|---|---|---|
| ClaimResponse.id | Unique identifier for this ClaimResponse | cr-001 |
| ClaimResponse.identifier[0].value | Claim response number assigned by payer | PA-HP-2026-78901 |
| ClaimResponse.status | Lifecycle status | active |
| ClaimResponse.use | Response for a preauthorization request | claim |
| ClaimResponse.outcome | Fully adjudicated outcome | complete |
| ClaimResponse.disposition | Human-readable approval description | Calim APPROVED — Corneal Grafting procedure authorized |
| ClaimResponse.preAuthRef | Pre-auth reference number for use at service time | PREAUTH-HP-2026-78901 |
| ClaimResponse.item[0].adjudication[0].category.coding.code | Submitted amount | submitted |
| ClaimResponse.item[0].adjudication[0].amount.value | Total submitted amount (INR) | 13700 |
| ClaimResponse.item[0].adjudication[1].category.coding.code | Eligible amount | eligible |
| ClaimResponse.item[0].adjudication[1].amount.value | Eligible amount under scheme | 13700 |
| ClaimResponse.item[0].adjudication[2].category.coding.code | Co-payment | copay |
| ClaimResponse.item[0].adjudication[2].amount.value | Co-payment — zero = fully covered | 0 |
| ClaimResponse.item[0].adjudication[3].category.coding.code | Approved/benefit amount | benefit |
| ClaimResponse.item[0].adjudication[3].amount.value | Final approved amount payable | 13700 |
| ClaimResponse.total[0].category.coding.code | Total submitted | submitted |
| ClaimResponse.total[0].amount.value | Grand total submitted | 13700 |
| ClaimResponse.total[1].category.coding.code | Total approved | benefit |
| ClaimResponse.total[1].amount.value | Grand total approved | 13000 |
| ClaimResponse.total[1].category.coding.code | Tax Deduction | tax |
| ClaimResponse.total[1].amount.value | Tax Deducted | 100 |
| ClaimResponse.total[1].category.coding.code | Total eligible amount | eligible |
| ClaimResponse.total[1].amount.value | Total eligible amount | 13700 |
| ClaimResponse.total[1].category.coding.code | Hospital Incentive | incentive |
| ClaimResponse.total[1].amount.value | Hospital Incentive | 137 |
| ClaimResponse.total[1].category.coding.code | Patient Liable Amt | copayment |
| ClaimResponse.total[1].amount.value | Patient Liable Amt | 700 |

#### 10.5.2 Partially Approved Response

| FHIR Element | Description | Sample Value |
|---|---|---|
| ClaimResponse.outcome | Partial — not all items fully approved | partial |
| ClaimResponse.disposition | Explanation of partial approval | Calim PARTIALLY APPROVED — Amount reduced per package rate |
| ClaimResponse.preAuthRef | Pre-auth reference for reduced amount | PREAUTH-HP-2026-78902 |
| ClaimResponse.item[0].adjudication[0].amount.value | Submitted amount (original) | 25000 |
| ClaimResponse.item[0].adjudication[1].amount.value | Eligible — capped at PMJAY package rate | 13700 |
| ClaimResponse.item[0].adjudication[2].amount.value | Co-payment — zero = fully cashless for patient | 0 |
| ClaimResponse.item[0].adjudication[3].amount.value | Approved benefit amount | 13700 |
| ClaimResponse.item[0].noteNumber[0] | References processNote explaining reduction | 1 |
| ClaimResponse.total[0].amount.value | Grand total submitted | 25000 |
| ClaimResponse.total[1].amount.value | Grand total approved (reduced to package rate) | 13700 |
| ClaimResponse.processNote[0].number | Note number linked to item | 1 |
| ClaimResponse.processNote[0].type | Note type | display |
| ClaimResponse.processNote[0].text | Reduction explanation | Amount reduced to package rate of INR 13,700 per PMJAY guidelines for SE012A (Corneal Grafting) |

#### 10.5.3  Queried Response

| FHIR Element | Description | Sample Value |
|---|---|---|
| ClaimResponse.outcome | Overall outcome — partial while item is queried | partial |
| ClaimResponse.adjudication[0].reason.coding.code | Claim-level adjudication result | queried |
| ClaimResponse.item[0].adjudication[0].category.coding.code | Eligible amount (partial — under review) | eligible |
| ClaimResponse.item[0].adjudication[0].amount.value | Eligible amount computed (may be partial) | 2700.00 |
| ClaimResponse.item[0].adjudication[1].category.coding.code | Audit trail / reason for query | reason |
| ClaimResponse.item[0].adjudication[1].reason.coding.display | Pipe-delimited query trail: USER~datetime~type~comment~trust | USER1000099~02/26/2026, 08:47~other~testing query~CPD-Trust |
| ClaimResponse.item[0].adjudication[2].category.coding.code | Eligible percentage — 0 while queried | eligpercent |
| ClaimResponse.item[0].adjudication[2].value | Eligible percentage value | 0 |
| ClaimResponse.item[0].adjudication[4].reason.coding.code | Item-level adjudication status | Queried |
| ClaimResponse.total[0].amount.value | Total benefit — 0 as claim is still queried | 0 |
| ClaimResponse.total[1].amount.value | Total eligible — 0 as claim is still queried | 0.00 |

ℹ Note: In real-world PMJAY responses, the adjudication 'reason' field carries a pipe-delimited audit trail (USER~datetime~type~comment~trust) rather than a structured text field. This is a PMJAY-specific pattern embedded in the display value.

#### 10.5.4 Rejected Response

| FHIR Element | Description | Sample Value |
|---|---|---|
| ClaimResponse.outcome | Fully processed to a rejected/cancelled terminal state | complete |
| ClaimResponse.adjudication[0].reason.coding.code | Claim adjudication result | cancelled |
| ClaimResponse.adjudication[0].reason.coding.display | Status display | Rejected |
| ClaimResponse.disposition | Human-readable rejection reason | Rejected Claim for claim VB26AA2600001 |
| ClaimResponse.total[0].category.coding.code | Benefit amount category | benefit |
| ClaimResponse.total[0].amount.value | Benefit amount — carried over but voided | 2700.00 |

ℹ Note: When a Claim is rejected, ClaimResponse.outcome is 'complete' (the claim was fully processed) but the adjudication reason is Rejected. This is different from a queried response where outcome may be 'partial'.

## Section 11: Use Case 6 — Payment Lifecycle

### 11.1 Business context

The Payment Notice use case in NHCX enables the payer to formally notify a provider that a payment has been initiated or settled against an approved claim. Unlike the ClaimResponse  which communicates an adjudication decision, the Payment Notice carries actual financial settlement information: the payment amount, the UTR (Unique Transaction Reference) number, TDS deductions, and the payment date.

This is a payer-initiated transaction. The payer builds a Task bundle containing a PaymentNotice and a PaymentReconciliation resource, encrypts it as JWE, and pushes it to the provider's registered callback endpoint via the NHCX gateway. The provider must acknowledge receipt by submitting a separate acknowledgement Task bundle using POST /v1/task/submit.

- Payment Notice is triggered after the payer has processed and approved the final claim (workflow 26).

- Three workflow codes cover the payment journey: wf 30 (payment initiated), wf 31 (payment processed), and wf 33 (payment settled — UTR available).

- The PaymentReconciliation resource within the bundle itemises the breakdown: net payment amount, TDS deducted, and any other adjustment details.

- The provider must respond with a Payment Acknowledgement Task (Task.output: paymentack) to confirm receipt of the notice.

- Only after the provider sends the acknowledgement is the full payment lifecycle considered closed.

Note: The UTR number identifying the bank transfer is carried in PaymentReconciliation.paymentIdentifier.value. Providers must persist this for audit, reconciliation, and any future dispute resolution.

### 11.2 FHIR resources used

| Resource | Direction | Role in payment notice | API endpoint |
|---|---|---|---|
| Task | Payer → Provider | Wrapper resource carrying the payment notification instruction. Task.code: deliver | /paymentnotice/request |
| PaymentNotice | Payer → Provider | Carries payment status, amount, recipient reference, and link to reconciliation | /paymentnotice/request |
| PaymentReconciliation | Payer → Provider | Itemises payment breakdown: net amount, TDS, payment date, UTR number | /paymentnotice/request |
| Organization (Provider) | Both directions | Provider Organisation resource — Task.owner references this | Bundle entry |
| Organization (Payer) | Both directions | Payer Organisation resource — Task.requester references this | Bundle entry |
| Task (ACK) | Provider → Payer | Acknowledgement Task — Task.status: completed, Task.output: paymentack | /v1/task/submit |

### 11.3 Lifecycle diagram

Figure 13 — Payment Notice NHCX Lifecycle

### 11.4 API and workflow codes

| Workflow code | Constant | Direction | Description |
|---|---|---|---|
| 30 | PAYMENT_INITIATED | Payer → Provider | Payer has initiated the payment transfer |
| 31 | PAYMENT_PROCESSED | Payer → Provider | Payment has been processed by the banking system |
| 33 | PAYMENT_SETTLED | Payer → Provider | Payment fully settled — UTR number available in PaymentReconciliation |
| 17 | PAYMENT_RECEIVED | Provider → Payer | Provider acknowledges receipt of payment notification via /v1/task/submit |

### 11.5 Payment Notice request bundle — FHIR element tables

The payer sends this bundle to the provider's registered callback endpoint. After decryption, the provider system receives a collection Bundle containing the resources listed below.

#### 1. Task — payment notification instruction

| FHIR element | Cardinality | Description | Sample value |
|---|---|---|---|
| Task.resourceType | 1..1 | Resource type identifier | Task |
| Task.meta.tag.code | 0..1 | Resource encoded in summary mode | SUBSETTED |
| Task.status | 1..1 | Task lifecycle status — payer has requested provider action | requested |
| Task.intent | 1..1 | Task intent | order |
| Task.code.coding.system | 1..1 | NDHM task codes system | https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-codes |
| Task.code.coding.code | 1..1 | Task action — deliver indicates payment notification delivery | deliver |
| Task.code.coding.display | 0..1 | Display for task code | deliver |
| Task.description | 0..1 | Human-readable description of the payment event | Payment initiated |
| Task.authoredOn | 1..1 | Date and time the task was created by the payer | 2026-02-27T15:36:08+05:30 |
| Task.requester.reference | 0..1 | URL reference to the payer Organisation | https://payer.nha.gov.in/.../organization/payer/1518 |
| Task.owner.reference | 0..1 | URL reference to the provider Organisation (payment recipient) | https://payer.nha.gov.in/.../organization/provider/IN1910000151 |
| Task.input[0].type.coding.code | 0..1 | Input type — status reference for the payment notice | status |
| Task.input[0].valueReference.reference | 0..1 | Reference to the PaymentNotice resource in this bundle | https://payer.nha.gov.in/.../EO26AA2700001 |

#### 2. PaymentNotice

| FHIR element | Cardinality | Description | Sample value |
|---|---|---|---|
| PaymentNotice.resourceType | 1..1 | Resource type identifier | PaymentNotice |
| PaymentNotice.meta.tag.code | 0..1 | Resource encoded in summary mode | SUBSETTED |
| PaymentNotice.identifier[0].type.coding.code | 0..1 | Identifier type — claim number | CLN |
| PaymentNotice.identifier[0].system | 0..1 | HCX PMJAY namespace for the identifier | https://hcx.pmjay.gov.in/v1/preauthorization |
| PaymentNotice.identifier[0].value | 0..1 | Payment notice identifier value | EO26AA2700001 |
| PaymentNotice.status | 1..1 | Status of the payment notice record | active |
| PaymentNotice.created | 0..1 | Date and time the notice was created | 2026-02-27T15:36:08+05:30 |
| PaymentNotice.payment.reference | 0..1 | Reference to the PaymentReconciliation resource for detail | https://payer.nha.gov.in/.../paymentreconciliation/EO26AA2700001 |
| PaymentNotice.recipient.reference | 0..1 | Reference to the provider Organisation receiving payment | https://payer.nha.gov.in/.../organization/provider/IN1910000151 |
| PaymentNotice.amount.value | 1..1 | Net payment amount after deductions | 2187 |
| PaymentNotice.amount.currency | 1..1 | Currency for the payment amount | INR |
| PaymentNotice.paymentStatus.coding.system | 0..1 | Coding system for payment status | http://terminology.hl7.org/CodeSystem/paymentstatus |
| PaymentNotice.paymentStatus.coding.code | 0..1 | Payment status code | paid |
| PaymentNotice.paymentStatus.coding.display | 0..1 | Display for payment status | Paid |

#### 3. PaymentReconciliation

| FHIR element | Cardinality | Description | Sample value |
|---|---|---|---|
| PaymentReconciliation.resourceType | 1..1 | Resource type identifier | PaymentReconciliation |
| PaymentReconciliation.meta.tag.code | 0..1 | Resource encoded in summary mode | SUBSETTED |
| PaymentReconciliation.identifier[0].type.coding.code | 0..1 | Identifier type — claim number | CLN |
| PaymentReconciliation.identifier[0].value | 0..1 | Reconciliation identifier value | EO26AA2700001 |
| PaymentReconciliation.status | 1..1 | Status of the reconciliation record | active |
| PaymentReconciliation.created | 0..1 | Date and time the reconciliation was created | 2026-02-27T15:36:08+05:30 |
| PaymentReconciliation.disposition | 0..1 | Human-readable description of the payment event | Payment initiated |
| PaymentReconciliation.paymentDate | 0..1 | Date the payment was made | 2026-02-27 |
| PaymentReconciliation.paymentAmount.value | 1..1 | Net payment amount transferred to provider | 2187 |
| PaymentReconciliation.paymentAmount.currency | 1..1 | Currency for the payment amount | INR |
| PaymentReconciliation.paymentIdentifier.type.coding.code | 0..1 | Identifier type — Unique Transaction Reference | UTR |
| PaymentReconciliation.paymentIdentifier.system | 0..1 | Namespace for the UTR identifier | https://hcx.pmjay.gov.in/v1/preauthorization |
| PaymentReconciliation.paymentIdentifier.value | 0..1 | UTR number for the bank transfer | PMJAY/HP/S/2024/R2/10000009/Normal |
| PaymentReconciliation.detail[0].id | 0..1 | Internal ID for TDS deduction detail line | PMJAY/HP/S/2024/R2/10000009/TDS |
| PaymentReconciliation.detail[0].type.coding.code | 0..1 | Type code for TDS deduction | TDS |
| PaymentReconciliation.detail[0].date | 0..1 | Date of the TDS deduction | 2026-02-27 |
| PaymentReconciliation.detail[0].amount.value | 0..1 | TDS amount deducted from gross payment | 243 |
| PaymentReconciliation.detail[1].id | 0..1 | Internal ID for net payment detail line | PMJAY/HP/S/2024/R2/10000009/Normal |
| PaymentReconciliation.detail[1].type.coding.code | 0..1 | Type code for net payment | Payment |
| PaymentReconciliation.detail[1].amount.value | 0..1 | Net payment amount (gross minus TDS) | 2187 |

### 11.6 Payment Acknowledgement bundle — FHIR element tables

After processing the payment notice, the provider sends an acknowledgement to the payer via POST /v1/paymentnotice/on_request. This confirms receipt and closes the payment lifecycle from the provider side.

#### 1. Task — acknowledgement

| FHIR element | Cardinality | Description | Sample value |
|---|---|---|---|
| Task.resourceType | 1..1 | Resource type identifier | Task |
| Task.id | 0..1 | UUID for this acknowledgement Task | a9f8295b-a0cf-410d-9ed5-1370523e57bd |
| Task.meta.profile[0] | 0..* | NDHM FHIR profile the Task conforms to | https://nrces.in/ndhm/fhir/r4/StructureDefinition/Task |
| Task.status | 1..1 | Task status — completed means provider has acknowledged | completed |
| Task.intent | 1..1 | Task intent | order |
| Task.code.coding.system | 0..1 | HL7 financial task code system | http://terminology.hl7.org/CodeSystem/financialtaskcode |
| Task.code.coding.code | 1..1 | Task action code — status for acknowledgement | status |
| Task.description | 0..1 | Human-readable confirmation of payment receipt | Recived the payment EO26AA2700001 |
| Task.authoredOn | 0..1 | Date and time the ACK was created by provider | 2026-02-27T10:06:18+05:30 |
| Task.requester.reference | 0..1 | URL reference to the provider Organisation (sender of ACK) | https://payer.nha.gov.in/.../organization/prov |
| Task.owner.reference | 0..1 | URL reference to the payer Organisation (recipient of ACK) | https://payer.nha.gov.in/.../organization/pay |
| Task.output[0].type.coding.system | 0..1 | Coding system for the output type | https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-output-type |
| Task.output[0].type.coding.code | 0..1 | Output type code | status |
| Task.output[0].valueCodeableConcept.coding.system | 0..1 | Coding system for the acknowledgement value | https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-output-value |
| Task.output[0].valueCodeableConcept.coding.code | 0..1 | Payment acknowledgement code confirming receipt | paymentack |
| Task.output[0].valueCodeableConcept.coding.display | 0..1 | Human-readable display for the acknowledgement | Payment is acknowledged |
| Task.output[1].type.coding.code | 0..1 | Second output — links ACK to specific claim number | claimNumber |
| Task.output[1].valueString | 0..1 | Claim number value being acknowledged | EO26AA2700001 |

### Implementation notes

- The Payment Notice uses a Task bundle (not a ClaimResponse bundle), the key resource is PaymentNotice, which references the PaymentReconciliation for the financial breakdown.

- Always extract the UTR number from PaymentReconciliation.paymentIdentifier.value and store it for audit and reconciliation purposes.

- The TDS amount is in PaymentReconciliation.detail where detail.type = TDS. The net payment amount is in the detail where type = Payment. Both plus TDS should equal the gross claim amount.

- The provider acknowledgement must be sent via POST /v1/paymentnotice/on_request with Task.output[0].valueCodeableConcept.coding.code = 'paymentack'. Failure to acknowledge does not block the payer but is required for complete lifecycle tracking.

- Note the typo in the real sample payload: Task.description reads 'Recived the payment' , validate this field loosely; do not rely on it for business logic.

## Section 12: Use Case 7 — Communication Lifecycle

### 12.1 Business context

The Communication Request use case enables the payer system to push structured notifications to a provider at any point during the claim lifecycle. Unlike ClaimResponse or PaymentNotice which are transactional responses, a Communication Request is an asynchronous, event-driven signal. It carries contextual information about an ongoing adjudication, a policy change, a TAT (turnaround time) breach alert, a patient wallet update, or a request for additional evidence.

The payer builds a Task bundle containing a CommunicationRequest resource, encrypts it as JWE, and posts it to the NHCX gateway via POST /communication/request. The gateway validates the workflow ID and routes the callback to the provider's registered endpoint. The provider must acknowledge receipt via POST /communication/on_request, closing the loop.

The Communication Request is triggered by the payer across five distinct operational scenarios:

| Use case | Task.reasonCode | Description |
|---|---|---|
| TAT query intimation | tatquery | Payer alerts provider that the preauth or claim has breached the turnaround time threshold. Provider must respond or escalate. This is the most common reason code seen in real-world PMJAY payloads. |
| Grievance communication | grievance | Payer communicates a patient or provider complaint that requires provider action — e.g., a beneficiary has raised a grievance about treatment denial or billing discrepancy. |
| Wallet or benefit update | walletupdate | Payer notifies the provider that the patient's benefit wallet balance, remaining limit, or scheme entitlement has changed since the original preauth was approved. |
| Policy change notification | policychange | Payer notifies provider of a change in scheme policy — e.g., a hospital has upgraded its speciality empanelment, a new package code is now covered, or an existing package rate has been revised. |
| Additional information request | additionalinfo | During claim adjudication, the payer needs supplementary documents or clinical clarification not covered by the original ClaimResponse query mechanism. |
| Claim Arbitration Intimation | claimArbitration | Payer will send out communication when they have acknowledged the request for the claim arbitration(reprocess/erroneous) |

### Lifecycle diagram

Figure — Communication Request NHCX Lifecycle: payer initiates → gateway routes → provider receives, classifies, and acknowledges

### 12.1 API and workflow codes

| API endpoint | Direction | Description |
|---|---|---|
| POST /communication/request | Payer → NHCX gateway → Provider | Payer submits the Communication Request bundle. Gateway validates JWE headers, workflow ID, and NIIP. Routes to provider's registered callback. |
| POST /communication/on_request | Provider → NHCX gateway → Payer | Provider submits the acknowledgement Task bundle. Must respond with HTTP 202 within 30 seconds. Task.status=completed confirms receipt. |

Workflow validation: The x-hcx-workflow_id in the JWE protected header is validated at the gateway for both the request and the acknowledgement. The x-hcx-correlation_id must be the same across the request–response pair to link them.

### 12.2 Communication Request bundle — FHIR element tables

The payer sends this bundle to the provider's registered callback endpoint. After JWE decryption, the provider system receives a collection Bundle containing the resources listed below. The sample bundle ID is PMJAY/CH/S/2024/R2/1000010394, captured at 2025-12-03T01:07:45+05:30.

#### Task — communication instruction

| FHIR element | Cardinality | Description | Sample value |
|---|---|---|---|
| Task.resourceType | 1..1 | Resource type identifier | Task |
| Task.id | 0..1 | Logical UUID for this Task | 1000010394 |
| Task.meta.tag.code | 0..1 | Resource encoded in summary mode | SUBSETTED |
| Task.identifier[0].system | 0..1 | Namespace for the Task identifier | https://payer.pmajy.nha.gov.in/Task/PMJAY/CH/S/2024/R2/1000010394 |
| Task.identifier[0].value | 0..1 | Task identifier value — same as claim / preauth reference | PMJAY/CH/S/2024/R2/1000010394 |
| Task.status | 1..1 | Task lifecycle status | completed |
| Task.intent | 1..1 | Task intent — proposal indicates payer-initiated communication instruction | proposal |
| Task.reasonCode.coding.system | 0..1 | NDHM reason code coding system | https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-reason-code |
| Task.reasonCode.coding.code | 1..1 | Reason code identifying the communication use case | tatquery |
| Task.reasonCode.coding.display | 0..1 | Human-readable display for the reason code | Tat Query Intimation |
| Task.code.coding.system | 1..1 | HL7 financial task code system | http://terminology.hl7.org/CodeSystem/financialtaskcode |
| Task.code.coding.code | 1..1 | Task action code — poll indicates data delivery / notification push | poll |
| Task.code.coding.display | 0..1 | Display for task code | Poll |
| Task.input[0].type.coding.system | 0..1 | HL7 financial task input type system | http://terminology.hl7.org/CodeSystem/financialtaskinputtype |
| Task.input[0].type.coding.code | 1..1 | Input type — include indicates the referenced resource is the payload | include |
| Task.input[0].type.coding.display | 0..1 | Display for input type | Include |
| Task.input[0].valueReference.reference | 1..1 | URL reference to the Communication resource carrying the message content | https://payer.pmajy.nha.gov.in/CommunicationRequest/PMJAY/CH/S/2024/R2/1000010394 |
| Task.input[0].valueReference.display | 0..1 | Display label for the referenced resource | Communication |

#### 2. Communication — message content and metadata

| FHIR element | Cardinality | Description | Sample value |
|---|---|---|---|
| Communication.resourceType | 1..1 | Resource type identifier | Communication |
| Communication.id | 0..1 | Logical identifier — same as the claim / preauth number | 1000010394 |
| Communication.meta.tag.code | 0..1 | Resource encoded in summary mode | SUBSETTED |
| Communication.identifier[0].type.coding.code | 0..1 | Identifier type — medical record number used as claim reference | MR |
| Communication.identifier[0].type.coding.display | 0..1 | Display for identifier type | Medical record number |
| Communication.identifier[0].system | 0..1 | PMJAY payer namespace for the identifier | https://payer.pmjay.gov.in |
| Communication.identifier[0].value | 0..1 | Communication identifier value — claim / preauth reference | PMJAY/CH/S/2024/R2/1000010394 |
| Communication.status | 1..1 | Status of the communication event | completed |
| Communication.category[0].coding.system | 0..1 | HL7 communication category coding system | http://terminology.hl7.org/CodeSystem/communication-category |
| Communication.category[0].coding.code | 1..1 | Category classifying the type of communication — reminder for TAT / follow-up alerts | reminder |
| Communication.category[0].coding.display | 0..1 | Display for category | Reminder |
| Communication.priority | 0..1 | Priority level for this communication — asap indicates urgent action expected | asap |
| Communication.topic.coding.system | 0..1 | HL7 communication topic coding system | http://terminology.hl7.org/CodeSystem/communication-topic |
| Communication.topic.coding.code | 0..1 | Topic of the communication — progress-update links to the active claim workflow | progress-update |
| Communication.topic.coding.display | 0..1 | Display for topic | Progress Update |

12.3 Communication acknowledgement bundle — /communication/on_request

After receiving and processing the communication, the provider submits an acknowledgement bundle via POST /communication/on_request. This bundle has an identical structure to the request bundle. The key difference is that in the acknowledgement, the organisation entry order is reversed. — the provider Organisation appears first .

#### Key fields that differ in the acknowledgement bundle

| FHIR element | Cardinality | Description | ACK value vs request value |
|---|---|---|---|
| Bundle.meta.lastUpdated | 0..1 | Timestamp updated to reflect acknowledgement time | 2025-12-03T01:17:54.894+05:30 (10 min after request) |
| Bundle.timestamp | 0..1 | Bundle assembly timestamp | 2025-12-03T01:17:54.894+05:30 |
| Task.status | 1..1 | Status — completed in both; confirms the payer's Task is done | completed (same) |
| Task.intent | 1..1 | Intent remains proposal in the acknowledgement | proposal (same) |
| Task.reasonCode.coding.code | 1..1 | Same reason code echoed back in the ACK | tatquery (same) |
| Task.code.coding.code | 1..1 | Same task code echoed back | poll (same) |
| Organization entry order | — | In ACK bundle, provider Organisation appears before payer | Provider (25724) first, Payer (7078) second |
| Organization identifier types | — | Swapped vs request in sandbox payload — data quality issue | Org 25724=NIIP, Org 7078=NPI (reversed — see note above) |

### Communication category and topic codes

| Code field | Code value | When to use |
|---|---|---|
| Communication.category | reminder | TAT breach notifications, follow-up reminders, deadline-driven alerts during active adjudication |
| Communication.category | notification | One-way informational push policy updates, wallet balance changes, scheme revision announcements |
| Communication.category | instruction | Actionable directives provider must perform a specific action (e.g., resubmit a specific document) |
| Communication.category | questionnaire | Structured question set requiring provider response — used for additional clinical information requests |
| Communication.topic | progress-update | Links communication to an active claim or preauth workflow most common topic for adjudication-related communications |
| Communication.topic | appointment-reminder | Operational reminders not tied to a specific claim workflow |
| Communication.priority | routine | Standard communications  no urgent action required |
| Communication.priority | urgent | High-priority but not time-critical respond within normal SLA |
| Communication.priority | asap | Immediate action expected TAT breach, urgent additional info, wallet exhaustion |
| Communication.priority | stat | Emergency  reserved for critical patient safety or fraud communications |

### Reason codes — Task.reasonCode

| Reason code | Display | Trigger scenario |
|---|---|---|
| tatquery | TAT Query Intimation | The preauth or claim has exceeded the payer's SLA threshold. Payer queries provider for status or action. |
| grievance | Grievance Communication | A beneficiary or provider grievance has been filed and requires provider acknowledgement or corrective action. |
| walletupdate | Wallet / Benefit Update | The patient's benefit wallet balance, scheme limit, or remaining entitlement has changed since original preauth. |
| policychange | Policy Change Notification | Scheme rates revised, new package codes added, speciality empanelment upgraded, or coverage rules changed. |
| additionalinfo | Additional Information Request | Payer needs supplementary documents or clinical clarification to complete adjudication beyond the standard query. |
| claimArbitartion | Claim Arbitration Intimation | Payer will send out communication when they have acknowledged the request for the claim arbitration(reprocess/erroneous) |

### Implementation notes

- The Communication Request does not replace the ClaimResponse query mechanism (outcome=partial, processNote with DOC_MISSING). It is a separate, asynchronous channel used when the payer needs to communicate outside of the direct request-response lifecycle particularly for TAT alerts, policy changes, and wallet updates.

- The Task.code=poll combined with Task.input.type=include is the standard NHCX pattern for push notifications. The poll code instructs the gateway to deliver the referenced resource (the Communication) to the recipient's endpoint.

- The Task.reasonCode is the primary field for routing logic on the provider side. Build your handler to switch on reasonCode.code and dispatch accordingly: tatquery → alert claims desk, walletupdate → refresh benefit cache, policychange → update package rate tables.

- Both the request and acknowledgement bundles carry Communication.status=completed. This reflects the FHIR status of the Communication event itself (it happened), not the resolution of the underlying issue (the TAT breach or grievance may still be open).

- The x-hcx-correlation_id must be identical in both the /communication/request and the /communication/on_request to allow the gateway and payer to link the acknowledgement to the original notification.

- Workflow ID validation: every incoming Communication Request must have its x-hcx-workflow_id validated against the known workflow for the associated claim or preauth.

## Appendix A: Code Reference Tables

### A.1 Supporting Info Category Codes

| Code | Display | Usage |
|---|---|---|
| ONS | Period — Start or End Dates | Admission/discharge date ranges |
| OTH | Other | General supporting information |
| INV | Investigation | Lab findings, diagnostic reports |
| ATT | Attachment | Uploaded documents and reports |
| HDS | Hospital Discharge Summary | Discharge summary document |
| DGN | Diagnosis | Diagnosis-related supporting information |
| EMP | Employment Impacted | Employment impact information |
| LAB | Lab Test | Laboratory test results |
| AOB | Onset of Current Symptoms | Symptom onset information |
| MB | Medical bill |  |
| DIA | Diagnostic report |  |
| CD | Clinical document |  |
| INF | Information | Additional info related to claim (conveying additional situation and condition information.) |
| DIS | Discharge status | Discharge status and discharge to location detail |
| POI | Proof of identity |  |
| POA | Proof of address |  |
| DOB | Proof of Date of Birth |  |
| DEF | Declaration form |  |
| FIR | FIR copy | FIR copy |

### A.2 Supporting Info Codes (Document Types)

| Code | Display | Usage |
|---|---|---|
| ADDD | Admission date - Discharge date | Inpatient admission period |
| EDT | EncounterDateTime | Date and time of the encounter |
| 100008 | General Findings | General clinical findings document |
| 100009 | Visual Acuity Report | Ophthalmology — mandatory visual acuity report |
| DIS | Discharge Summary | Hospital discharge summary document |
| PSP | PatientSurgeryPerformed | Date & Time of Surgery |
| DSDE | Discharge Date | Date & Time of Discharge |
| DTH | DischargeToHome |  |
| DTM | DischargetoMortuary |  |
| LAMA | Discharge with LAMA |  |
| DAMA | Discharge with DAMA |  |
| BCF | Biirth Certificate | Birth Certificate issued by Registrar of Birth, Municipal Corporation and other notified local government bodies like Taluk, Tehsil etc. |
| DCB | Discharge card/ slip for birth of a child | Discharge card/ slip issued by Government hospitals for birth of a child |

### A.3 Identifier Type Codes

| Code | Display | Usage |
|---|---|---|
| PMJAY | PMJAY Member ID | Beneficiary's PMJAY membership identifier |
| ABHA | ABHA Number | Ayushman Bharat Health Account number (no hyphens) |
| CLN | Claim Number | Unique claim identifier assigned by provider/payer |
| NPI | National Provider Identifier | Hospital/provider facility registry code |
| NIIP | National Insurance Payor Identifier | Payer/insurer facility registry code |
| NH | National Health Plan Identifier | Coverage/policy plan identifier |
| MD | Medical License Number | Practitioner's medical council registration number |

### A.4 Adjudication Category Codes

| Code | Display | Meaning |
|---|---|---|
| submitted | Submitted Amount | Total amount billed/submitted by provider |
| eligible | Eligible Amount | Amount deemed eligible under scheme rules |
| copay | Co-Payment | Patient's share of cost (zero = fully cashless under PMJAY) |
| benefit | Approved/Benefit Amount | Final amount the insurer will pay to the provider |
| eligpercent | Eligible % | Percentage of submitted amount that is eligible |
| eligquant | Eligible Quantity | Quantity eligible for reimbursement |
| reason | Reason for Adjudication | Explanation or audit trail for the adjudication decision |
| status | Item/Claim Status | Current adjudication status of the item or overall claim |

### A.5 Benefit Category Codes (PMJAY Specialities)

| Code | Speciality | Scope |
|---|---|---|
| GM | General Medicine | Medical conditions not requiring surgery |
| GS | General Surgery | Common surgical procedures |
| SE | Ophthalmology | Eye conditions and procedures including corneal grafting |
| OR | Orthopaedics | Bone and joint conditions |
| EN | ENT | Ear, Nose, and Throat conditions |
| CD | Cardiology | Heart and cardiovascular conditions |
| NR | Neurology | Neurological and nervous system conditions |
| UR | Urology | Urinary tract and renal conditions |

Note: These codes are samples as per PMJAY. Actual benefit categories will come from Insurance Plan resource.

### A.6 Diagnosis Type Codes

| Code | Display |
|---|---|
| admitting | Admitting Diagnosis — principal diagnosis at time of admission |
| clinical | Clinical Diagnosis — diagnosis established through clinical evaluation |
| discharge | Discharge Diagnosis — diagnosis confirmed at discharge |
| final | Final Diagnosis — definitive confirmed diagnosis |

### A.7 Composition Type Codes (SNOMED)

| SNOMED Code | Display | Usage |
|---|---|---|
| 721981007 | Diagnostic studies report | Lab and imaging document wrapper |
| 373942005 | Discharge summary | Hospital discharge document |
| 4241000179101 | Laboratory report | Lab results section code |
| 4261000179100 | Diagnostic imaging report | Imaging section code |
| 422843007 | Chief complaint section | Discharge/chief complaint section |

## Appendix B: Cancellation Reason Codes

Used in Task.reasonCode.coding.code when submitting a preauth cancellation via POST /task/submit (Workflow 122).

Coding System: https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-reason-code

| Code | Display | When to Use |
|---|---|---|
| treatmentplanchanged | Treatment Plan Changed | Doctor changed the treatment approach during hospitalization |
| patientrequest | Patient Requested Cancellation | Patient asked to leave or changed to another hospital |
| financialconstraints | Financial Constraints | Patient cannot afford co-pay or uncovered costs |
| alternativetreatment | Alternative Treatment Chosen | A different procedure or treatment has been selected |
| duplicateclaim | Duplicate Claim/PreAuth | Preauth was accidentally submitted as a duplicate |
| administrativeerror | Administrative Error | Incorrect data was included in the original submission |
| other | Other Reason | Any other reason — provide free-text explanation in Task.description |

## Appendix C: Status Mapping Reference

### C.1 ClaimResponse Outcome → Internal Status

| FHIR Outcome | Internal Status | Claim Status | Action Required |
|---|---|---|---|
| complete (+ approved adjudication) | APPROVED | APPROVED | Proceed with treatment under preauth ref |
| partial (reduced amount) | PARTIALLY_APPROVED | PARTIALLY_APPROVED | Confirm with patient on gap amount if any |
| error | REJECTED | REJECTED | Review error codes and resubmit if applicable |
| partial (queried adjudication) | PENDING | SUBMITTED | Submit query response with additional documents (workflow 19) |
| complete (+ cancelled adjudication) | CANCELLED | CANCELLED | No further action — preauth has been voided |

### C.2 NHCX Protocol Status Values

| Status | Direction | Meaning |
|---|---|---|
| request.initiated | Outgoing | Provider has initiated a request — included in JWE header of all submissions |
| request.acknowledged | Incoming | NHCX gateway has acknowledged receipt of the request |
| request.queried | Incoming | Payer needs more information before making a decision |
| request.complete | Incoming | Request has been fully processed by payer |
| request.error | Incoming | Processing failed — check error details in ClaimResponse.error |
| request.rejected | Incoming | Request was rejected by payer or gateway |

## Appendix D: Error Codes (currently implemented in PMJAY)

### D1: Insurance Plan Error Codes

| Error Codes | Error Description | Remarks | Debugging steps |
|---|---|---|---|
| PAYR-1401 | <policy_code> policy not allowed for the hospital. Please reach out to technical support team. | This error occurs when the requested policy for fetching insurance plan is not applicable for the hospital which is initiating the request. | 1. Reach out to technical support team. |
| PAYR-1402 | Requested policy <policy_code> found not be associated with any payer for insurance plan request. Hence request will not be processed. | This error occurs when the requested policy for fetching insurance plan does not exist in the payer system. | 1. Verify the correctness of the policy value sent in the FHIR request.<br>2. If the above step does not resolve the issue, reach out to technical support team. |
| PAYR-1403 | Requested renewal <renewal_code> found not be associated with requested policy <policy_code> for insurance plan request. Hence request will not be processed. | This error occurs when the renewal code requested in insurance plan request is not found for policy, requested in insurance plan, in the payer system. | 1. Verify the correctness of the renewal value and policy value sent in the FHIR request.<br>2. If the above step does not resolve the issue, reach out to technical support team. |
| PAYR-1404 | No treatment provided for policy <policy_code> under any speciality. Please reach out to technical support team. | This error occurs when there is no speciality configured for the policy requested in insurance plan. | 1. Verify the correctness of the policy value sent in the FHIR request.<br>2. If the above step does not resolve the issue, reach out to technical support team. |
| PAYR-1405 | No enrolled hospital found for HFR id <hfr_id> or sender id <sender_code>. Please reach out to technical support team. | This error occurs when there is no data for the hospital found in the payer system. | 1. Verify the correctness of the HFR id sent in the FHIR request.<br>2. If the above step does not resolve the issue, reach out to technical support team. |
| PAYR-1406 | Existing request with correlation id %s is in progress with the payer. Hence this request will not be accepted until the execution for previous request is complete. Please wait for 15 - 60 minutes to allow the execution of previous requests. For further assistance, please reach out to technical support team. | This error occurs when a new request is received from the same hospital for the same policy, before the execution for previous request is completed. | 1. Wait for 15-60 mins before another request is raised.<br>2. If after 60 mins the response for previous request is not received, please reach out to the technical support team.<br> |

### D2: Coverage Error Codes

| Error Codes | Error Description |
|---|---|
| PAYR-1101 | Invalid purpose received as (%s) for beneficiary id (%s) from hospital id (%s). Hence no result will be returned. Please try again with a valid purpose. |
| PAYR-1102 | Invalid search parameter requested. Please try again with a valid id. |
| PAYR-1103 | Invalid careplan id received. Please try again with valid careplan id. |
| PAYR-1104 | Multiple records found for the beneficiary. Hence request will not be processed further. |
| PAYR-1105 | Hospital configuration not found. Please contact support team. |
| PAYR-1106 | No details found for the requested procedures in the system. |
| PAYR-1107 | No billable item received. Please try again with valid item data. |
| PAYR-1108 | No details found for the requested stratification in the system. |
| PAYR-1109 | No details found for the requested investigations in the system. |
| PAYR-1110 | No details found for the requested implants in the system. |
| PAYR-1111 | Rule failure. |
| PAYR-1112 | Invalid payer id received. Please try again ith valid payer details |
| PAYR-1113 | Invalid item code received as %s. Please try again with valid data |
| PAYR-1114 | Invalid speciality code received as %s for item %s. Please try again with valid data. Speciality code is available as the code of the category for specific cost of plan in isurance plan |
| PAYR-1115 | Invalid procedure quantity received as %s for item %s. Please try again with valid data. Item quantity should be greater than 1 |
| PAYR-1116 | Hospital is not authorized to raise any case under policy %s. Hence request will not be processed further. Please connect with the support team to get the required authorization |
| PAYR-1117 | No policy details found for %s. Hence request will not be processed further |
| PAYR-1118 | No details found for requested items. Hence request will not be processed further |
| PAYR-1119 | No payer details received for payer id %s from HCX. Please try again with valid payer details. |
| PAYR-1120 | Duplicate reference id found as %s. Please try again with valid reference details. |
| PAYR-1121 | No policy details found for %s for beneficiary %s. Hence request will not be processed further. |
| PAYR-1122 | No policy details found for beneficiary %s. Hence request will not be processed further. |
| PAYR-1123 | Beneficiary is not a covered member for requested payer. Please enroll beneficiary for applicable policy of requested payer and try again. |
| PAYR-1005 | Beneficiary is not a covered member for requested policy. Please enroll beneficiary for the policy and try again. |

### D3: Preauthorisation Error Codes

| Error Codes | Error Description |
|---|---|
| PAYR-1201 | Invalid claimed amount received for case number %s. Please try again with a valid claim amount. Claimed amount should be greater than INR 0 and less than equals to balance wallet amount of the beneficiary. |
| PAYR-1202 | Invalid speciality code received as %s for item %s for case number %s. Please try again with valid data. Speciality code is available as the code of the category for specific cost of plan in isurance plan. |
| PAYR-1203 | Invalid speciality description received as %s for procedure %s for case number %s. Please try again with valid data. Speciality description is available as the display of the category for specific cost of plan in isurance plan. |
| PAYR-1204 | Invalid procedure code received as %s for case number %s. Please try again with valid data. Procedure code is available as the code of the type for benefit component, of specific cost, of plan in isurance plan. |
| PAYR-1205 | Invalid procedure description received as %s for procedure %s for case number %s. Please try again with valid data. Procedure description is available as the display of the type for benefit component, of specific cost, of plan in isurance plan. |
| PAYR-1206 | Invalid procedure type received as %s for procedure %s for case number %s. Please try again with valid data. |
| PAYR-1207 | Invalid procedure factor received as %s for procedure %s for case number %s. Please try again with valid data. |
| PAYR-1208 | Invalid procedure quantity received as %s for item %s for case number %s. Please try again with valid data. Item quantity should be greater than 1. |
| PAYR-1209 | Invalid net amount received as INR %s for item %s for case number %s. Please try again with valid data. Item net amount should be greater than INR 0. |
| PAYR-1210 | Invalid procedure status received as %s for procedure %s for case number %s. Please try again with valid data. |
| PAYR-1211 | Requested beneficary details and careplan details does not match any criteria for processing the case at this hospital. Please try again with valid data. |
| PAYR-1212 | No previous preauthorization approved record found for the enhancement request for case number %s. Hence request will not be processed further. Please initiate a new preauthorization. |
| PAYR-1213 | Existing case in progress found for case number %s. Hence enhancement request will not be accepted. Please try after the adjudication is completed for the current case. |
| PAYR-1214 | No previous preauthorization approved record found for the resubmission request for case number %s. Hence request will not be processed further. Please initiate a new preauthorization. |
| PAYR-1215 | Existing case in progress found for case number %s. Hence resubmission request will not be accepted. Please try after the adjudication is completed for the current case. |
| PAYR-1216 | Existing case in progress found for case number %s. Hence new preauthorization request will not be accepted. |
| PAYR-1217 | Previous preauthorization approved record found for the new preauthorization request for case number %s. Hence request will not be processed further. Please initiate enhancement/resubmission. |
| PAYR-1218 | No queried preauthorization record found for the query update request for case number %s. Hence request will not be processed further. |
| PAYR-1219 | Case number %s is not queried. Hence query updation request will not be processed further. |
| PAYR-1220 | Invalid investigation description received as %s for investigation code %s for case number %s. Please try again with valid data. |
| PAYR-1221 | Invalid investigation code received as %s for case number %s. Please try again with valid data. |
| PAYR-1222 | Invalid investigation status received as %s for investigation %s for case number %s. Please try again with valid data. |
| PAYR-1223 | Invalid investigation attachment received for investigation %s for case number %s. Please try again with valid data. |
| PAYR-1224 | Invalid implant description received as %s for implant code %s for case number %s. Please try again with valid data. |
| PAYR-1225 | Invalid implant code received as %s for case number %s. Please try again with valid data. |
| PAYR-1226 | Invalid implant status received as %s for investigation %s for case number %s. Please try again with valid data. |
| PAYR-1227 | Invalid implant attachment received for investigation %s for case number %s. Please try again with valid data. |
| PAYR-1228 | Invalid implant quantity received as %s for implant %s for case number %s. Please try again with valid data. |
| PAYR-1229 | Invalid implant net amount received as INR %s for implant %s for case number %s. Please try again with valid data. |
| PAYR-1230 | Invalid implant unit price received as INR %s for implant %s for case number %s. Please try again with valid data. |
| PAYR-1231 | Claim has already been raised for case number %s. Hence preauthorization request will not be accepted. |
| PAYR-1232 | No investigation found for case number %s. Investigation details are mandatory for private hospitals. |
| PAYR-1233 | Patient liability is not aplicable for the hospital and beneficiary do not have enough wallet balance with deficit amount INR %s for the requested preauthorization for case number %s. |
| PAYR-1234 | No preauthorization record found for case number %s. Hence the request will not be processed. |
| PAYR-1235 | Insufficient wallet balance. Hence the request will not be processed. |
| PAYR-1236 | Invalid claim type (in-patient/out-patient) received. Hence the request will not be processed. |
| PAYR-1237 | Beneficiary is having an active preauthorization request at %s. Hence the request will not be processed. Kindly inform %s to cancel the active preauthorization request or raise a claim to proceed with current preauthorization. |
| PAYR-1238 | Beneficiary is having an active preauthorization request at this hospital with reference number %s. Hence the request will not be processed. Kindly cancel the active preauthorization request or raise a claim to proceed with current preauthorization. |
| PAYR-1239 | Hospital configuration not found. Please contact support team. |
| PAYR-1240 | No details found for the requested procedures in the system. |
| PAYR-1241 | Invalid registration date received for case number %s. Hence the request will not be processed. |
| PAYR-1242 | Invalid registration date format received for case number %s. Hence the request will not be processed. |
| PAYR-1243 | Invalid admission date received for case number %s. Hence the request will not be processed. |
| PAYR-1244 | Invalid admission date format received for case number %s. Hence the request will not be processed. |
| PAYR-1245 | Rule failure. |
| PAYR-1246 | Invalid payer id received as %s. Please try again with valid payer id. |
| PAYR-1247 | Payer details for payer id %s is not received from HCX for the request. Hence the request will not be processed. |
| PAYR-1248 | Invalid item code received as %s for item sequence %s case number %s. Please try again with valid data. |
| PAYR-1249 | Invalid item sequence received as %s for case number %s. Please try again with valid data. |
| PAYR-1250 | Requested policy %s is not listed. Please try again with valid policy code. |
| PAYR-1251 | No billable treatment plan received for case number %s. Please try again with valid treatment plan data. |
| PAYR-1252 | Case number %s is not in active preauthorization state with the current status of the case with the payer system is %s. Hence the preauthorization can not be cancelled. Only the cases with current status as preauthorization submitted or preauthorization approved can be cancelled. |
| PAYR-1253 | Case number %s is already cancelled. Hence the preauthorization can not be cancelled again. Only the cases with current status as preauthorization submitted or preauthorization approved can be cancelled. |
| PAYR-1254 | Response for STG Questionnaire id %s is mandatory for procedure code %s. Hence the preauthorization request will not be processed as the questionnaire response is not received for procedure code. |
| PAYR-1255 | Case number %s is already cancelled. Hence no preauthorization request will be accepted for this case number. New preauthorization request needs to be raised with new case/reference number to proceed further. |
| PAYR-1256 | Response for Authentication Consent Questionnaire is missing for case number %s. This must be sent if the biometric authentication for patient is not available. For new preauthorization request, either biometric authentication for patient or response for Authentication Consent questionnaire must be sent. Please check/update the insurance plan for the policy for the details of the questionnaire. Please adhere to the response of the coverage eligibility for auth-requirements purpose to check the mandatory documents to be attached with the request |
| PAYR-1257 | Payment is initiated for case number %s. Hence the preauthorization can not be cancelled again. Only the cases with current status as preauthorization submitted or preauthorization approved can be cancelled |
| PAYR-1258 | Payment is accomplished/cleared for case number %s. Hence the preauthorization can not be cancelled again. Only the cases with current status as preauthorization submitted or preauthorization approved can be cancelled |
| PAYR-1259 | DOB is missing for new born for the case number (%s) with correlation id as (%s) at (%s) |
| PAYR-1260 | DOB cannot be a future date for the case number (%s) with correlation id as (%s) at (%s) |
| PAYR-1261 | Invalid new born details for the case number (%s) with correlation id as (%s) at (%s) |
| PAYR-1262 | Gender is mandatory for the new born beneficiary |
| PAYR-1263 | Documents are mandatory for the new born beneficiary |
| PAYR-1264 | Documents are mandatory for the new born beneficiary |
| PAYR-1265 | Documents are mandatory for the new born beneficiary |
| PAYR-1266 | Documents are mandatory for the new born beneficiary |
| PAYR-1267 | Beneficiary is having an active preauthorization request for new born case at this hospital with reference number %s. Hence the request will not be processed. Kindly cancel the active preauthorization request or raise a claim to proceed with current preauthorization |
| PAYR-1268 | Beneficiary is having an active preauthorization request for new born case at %s. Hence the request will not be processed. Kindly inform %s to cancel the active preauthorization request or raise a claim to proceed with current preauthorization |
| PAYR-1269 | Date of birth received for new born beneficiary exceeds 6 years before the current date. New born cases can be raised only for the beneficiary whose date of birth is within 6 years of current date |
| PAYR-1270 | Item LM100 is not applicable for preauthorization request. This item is expected/mandated only during claim submission if the patient is discharged after/during surgery under LAMA/DAMA category for PMJAY cases. |
| PAYR-1271 | No value received for link id %s for Authentication Consent Questionnaire for preauthorization request. This must be sent if the biometric authentication for patient is not available. For new preauthorization request, either biometric authentication for patient or response for Authentication Consent questionnaire must be sent. Please check/update the insurance plan for the policy for the details of the questionnaire. Please adhere to the response of the coverage eligibility for auth-requirements purpose to check the mandatory documents to be attached with the request. |
| PAYR-1272 | Invalid biometric user token received. Please try again with valid valid biometric details of the beneficiary. For any issues with biometric, please try with Authentication Consent Questionnaire, details for which has been received in response for coverage eligibliity auth-requirements. |
| PAYR-1273 | No questionnaire found for the received selection. Please validate the questionnaire url from insurance plan/coverage auth-requirements response. |
| PAYR-1005 | Beneficiary is not a covered member for requested policy. Please enroll beneficiary for the policy and try again. |
| PAYR-1101 | Invalid purpose received as (%s) for beneficiary id (%s) from hospital id (%s). Hence no result will be returned. Please try again with a valid purpose. |
| PAYR-1102 | Invalid PMJAY ID requested. Please try again with a valid id. |
| PAYR-1103 | Invalid careplan id received. Please try again with valid careplan id. |
| PAYR-1104 | Multiple records found for the beneficiary. Hence request will not be processed further. |

### D4: Claim Error Codes

| Error Codes | Error Description |
|---|---|
| PAYR-1301 | Claim has already been raised for case number %s. Hence new claim request will not be accepted. |
| PAYR-1302 | No preauthorization approved record found for case number %s. Hence new claim request will not be accepted. |
| PAYR-1303 | No active claim record found for case number %s. Hence query updation request will not be accepted. |
| PAYR-1304 | No claim queried record found for case number %s. Hence query updation request will not be accepted. |
| PAYR-1305 | Invalid usecase requested for case number %s. Please try again with valid usecase. |
| PAYR-1306 | No item found in preauthorization request for procedure %s with item sequence %s for case number %s. Please try again with valid items. |
| PAYR-1307 | Invalid quantity requested for procedure %s with item sequence %s for case number %s. Please try again with valid quantity. |
| PAYR-1308 | No item found in active claim request for procedure %s with item sequence %s for case number %s. Please try again with valid items. |
| PAYR-1309 | No item found in preauthorization request for implant %s with item sequence %s for case number %s. Please try again with valid items. |
| PAYR-1310 | Invalid quantity requested for implant %s with item sequence %s for case number %s. Please try again with valid quantity. |
| PAYR-1311 | No item found in active claim request for implant %s with item sequence %s for case number %s. Please try again with valid items. |
| PAYR-1312 | No item found in preauthorization request for investigation %s with item sequence %s for case number %s. Please try again with valid items. |
| PAYR-1313 | Invalid quantity requested for investigation %s with item sequence %s for case number %s. Please try again with valid quantity. |
| PAYR-1314 | No item found in active claim request for investigation %s with item sequence %s for case number %s. Please try again with valid items. |
| PAYR-1315 | Rejected item found for preauthorization for procedure %s with item sequence %s for case number %s. Please try again with valid items. |
| PAYR-1316 | Rejected item found for preauthorization for investigation %s with item sequence %s for case number %s. Please try again with valid items. |
| PAYR-1317 | Rejected item found for preauthorization for implant %s with item sequence %s for case number %s. Please try again with valid items. |
| PAYR-1318 | No requested treatment plan found for case number %s. Please try again with valid items. |
| PAYR-1319 | No requested investigation plan found for case number %s. Please try again with valid items. |
| PAYR-1320 | No details found for the requested investigations in the system. Hence request will not be processed. |
| PAYR-1321 | Error occurred while processing the request due to invalid workflow id as (%s) |
| PAYR-1322 | No active case found for the given case number. |
| PAYR-1323 | Insufficient wallet balance. Hence the request will not be processed. |
| PAYR-1324 | Invalid discharge stage received for case number %s. Hence the request will not be processed. |
| PAYR-1325 | Invalid admission date received for case number %s. Hence the request will not be processed. |
| PAYR-1326 | Invalid discharge date received for case number %s. Hence the request will not be processed. |
| PAYR-1327 | Invalid admission date format received for case number %s. Hence the request will not be processed. |
| PAYR-1328 | Invalid discharge date format received for case number %s. Hence the request will not be processed. |
| PAYR-1329 | Invalid registration date received for case number %s. Hence the request will not be processed. |
| PAYR-1330 | Invalid registration date format received for case number %s. Hence the request will not be processed. |
| PAYR-1331 | Receiver not registered in NHCX. Please try again with valid receiver details. |
| PAYR-1332 | Invalid CRC request. |
| PAYR-1333 | Invalid claim type (in-patient/out-patient) received. Hence the request will not be processed. |
| PAYR-1334 | Hospital configuration not found. Please contact support team. |
| PAYR-1335 | Invalid implant quantity received as %s for implant %s for case number %s. Please try again with valid data. |
| PAYR-1336 | Invalid implant unit price received as INR %s for implant %s for case number %s. Please try again with valid data. |
| PAYR-1337 | Invalid implant net amount received as INR %s for implant %s for case number %s. Please try again with valid data. |
| PAYR-1338 | Invalid implant attachment received for investigation %s for case number %s. Please try again with valid data. |
| PAYR-1339 | Invalid implant status received as %s for investigation %s for case number %s. Please try again with valid data. |
| PAYR-1340 | Invalid investigation status received as %s for investigation %s for case number %s. Please try again with valid data. |
| PAYR-1341 | Invalid investigation attachment received for investigation %s for case number %s. Please try again with valid data. |
| PAYR-1342 | Existing case in progress found for case number %s. Hence new reimbursement request will not be accepted. |
| PAYR-1343 | Previous reimbursement approved record found for the new reimbursement request for case number %s. Hence request will not be processed further. |
| PAYR-1344 | No details found for the requested procedures in the system. |
| PAYR-1345 | Invalid procedure status received as %s for procedure %s for case number %s. Please try again with valid data. |
| PAYR-1346 | Invalid procedure description received as %s for procedure %s for case number %s. Please try again with valid data. |
| PAYR-1347 | Invalid procedure type received as %s for procedure %s for case number %s. Please try again with valid data. |
| PAYR-1348 | Invalid procedure factor received as %s for procedure %s for case number %s. Please try again with valid data. |
| PAYR-1349 | Invalid procedure quantity received as %s for procedure %s for case number %s. Please try again with valid data. |
| PAYR-1350 | Invalid procedure net amount received as INR %s for procedure %s for case number %s. Please try again with valid data. |
| PAYR-1351 | Invalid speciality code received as %s for procedure %s for case number %s. Please try again with valid data. |
| PAYR-1352 | Requested beneficary details and careplan details does not match any criteria for processing the case at this hospital. Please try again with valid data. |
| PAYR-1353 | Invalid careplan id received. Please try again with valid careplan id. |
| PAYR-1354 | Rule failure. |
| PAYR-1355 | No details found for the requested implants in the system. Hence request will not be processed. |
| PAYR-1356 | Patient liability is not aplicable for the hospital and beneficiary do not have enough wallet balance with deficit amount INR %s for the requested preauthorization for case number %s. |
| PAYR-1357 | Admission date cannot be after the discharge date. Hence request will not be processed. Please correct the data and try again. |
| PAYR-1358 | Registration of the patient is allowed maximum upto %s days after admission. Hence request will not be processed. Please correct the data and try again. |
| PAYR-1359 | No billable treatment plan received for case number %s. Please try again with valid treatment plan data. |
| PAYR-1360 | Invalid item code received as %s for item sequence %s case number %s. Please try again with valid data. |
| PAYR-1361 | Invalid item sequence received as %s for case number %s. Please try again with valid data. |
| PAYR-1362 | No procedure with code LM100 received with 'Requested' status for case number %s. Please try again with valid data. For PMJAY claims, if case comes under LAMA/DAMA scenario with beneficiary being discharged before surgery or during surgery, procedure with code LM100 is mandatory. Only this procedure code will be accepted for LAMA/DAMA case, and all other previous preauthorization approved items will get disqualified for the claim submission |
| PAYR-1363 | Response for Authentication Consent Questionnaire is missing for case number %s. This must be sent if the biometric authentication for patient is not available during discharge. For new claim request, either biometric authentication for patient during discharge, or response for Authentication Consent questionnaire must be sent. Please check/update the insurance plan for the policy for the details of the questionnaire. |
| PAYR-1364 | No value received for link id %s for Authentication Consent Questionnaire for claim request. This must be sent if the biometric authentication for patient is not available during discharge. For new claim request, either biometric authentication for patient during discharge, or response for Authentication Consent questionnaire must be sent. Please check/update the insurance plan for the policy for the details of the questionnaire. |
| PAYR-1365 | Response for STG Questionnaire id %s is mandatory for procedure code %s. Hence the preauthorization request will not be processed as the questionnaire response is not received for procedure code. |
| PAYR-1366 | Invalid biometric user token received. Please try again with valid biometric details of the beneficiary. For any issues with biometric, please try with Authentication Consent Questionnaire for discharge, details for which has been received in insurance plan. |
| PAYR-1367 | No biometric records found for the beneficiary for %s. Please ensure correctness of biometric authentication date for the day for cyclic procedure %s. |
| PAYR-1368 | %s units of cycle information received for procedure code %s with item sequence %s. Cycle information should be sent for all the requested/processed cycles. |
| PAYR-1369 | Biometric authentication cannot be performed more than once on the same date. Multiple biometric authentication information has been provided for same date for cyclic procedure %s. Hence case will not be processed. Please check and update biometric authentication execution dates and try again. |
| PAYR-1370 | Received invalid start date as %s for supporting details with item sequence %s. Please try again with valid start date. |
| PAYR-1201 | Invalid claimed amount received for case number %s. Please try again with a valid claim amount. Claimed amount should be greater than INR 0 and less than equals to balance wallet amount of the beneficiary. |
| PAYR-1203 | Invalid speciality description received as %s for procedure %s for case number %s. Please try again with valid data. Speciality description is available as the display of the category for specific cost of plan in isurance plan. |
| PAYR-1204 | Invalid procedure code received as %s for case number %s. Please try again with valid data. Procedure code is available as the code of the type for benefit component, of specific cost, of plan in isurance plan. |
| PAYR-1220 | Invalid investigation description received as %s for investigation code %s for case number %s. Please try again with valid data. |
| PAYR-1221 | Invalid investigation code received as %s for case number %s. Please try again with valid data. |
| PAYR-1224 | Invalid implant description received as %s for implant code %s for case number %s. Please try again with valid data. |
| PAYR-1225 | Invalid implant code received as %s for case number %s. Please try again with valid data. |
| PAYR-1102 | Invalid search parameter requested. Please try again with a valid id. |
| PAYR-1003 | Invalid workflow requested. Hence request will not be processed further. |
| PAYR-1005 | Beneficiary is not a covered member for requested policy. Please enroll beneficiary for the policy and try again. |

### D5: NHCX Error Codes

| Error Codes | Error Description | Type of error |
|---|---|---|
| NHCX-1001 | Receiver system is not reachable. | Transport |
| NHCX-1002 | Sender not registered in NHCX. Please register in NHCX portal and try again. | Business |
| NHCX-1003 | Receiver not registered in NHCX. Please try again with valid receiver details. | Business |
| NHCX-1004 | No receiver registered in NHCX for the requested scheme. Please try again with valid receiver details for the scheme. | Business |
| NHCX-1005 | Invalid request header. Please try again with valid headers. | Business |
| NHCX-1006 | Duplicate request. Request with same correlation id already exist in the system. | Business |
| NHCX-1007 | Something went wrong while processing the request. Please check the request structure and values and try again. | Business |
| NHCX-1008 | Something went wrong while processing the request. Please try again after sometime. | Business |
| NHCX-1009 | Something went wrong while processing the request. Please check log for more details. | Business |
| NHCX-1010 | No Data with given Correlation id for call back request, please check status for more details | Business |
| NHCX-1011 | Invalid Status, please check x-hcx-status value from the protected header | Business |
| NHCX-1012 | No records found with the requested api caller id. Please try again with a valid api caller id. | Business |
| NHCX-1013 | Invalid or blank request found. | Business |
| NHCX-1014 | Unable to send protocol response to sender. | Business |
| NHCX-401 | User Unauthorized | Business |
| NHCX-1015 | Invalid response received from receiver. | Business |
| NHCX-1016 | Invalid Api Action, please check the request action for this correlationId before trying again | Business |
| NHCX-1017 | Invalid response received from receiver | Business |
| NHCX-1018 | Invalid ABHA number received. ABHA number should be sent in the format XX-XXXX-XXXX-XXXX | Business |

### D6: NHCX Bridge Error Codes

| Error Codes | Error Description |
|---|---|
| PAYR-1001 | Error occurred while decrypting payload for receiver code <receiver_code> with correlation id <sender_correlation_id>. |
| PAYR-1002 | Error occurred while encrypting payload for receiver code <receiver_code> with correlation id <sender_correlation_id>. |
| PAYR-1003 | Invalid workflow requested. Hence request will not be processed further. |
| PAYR-1004 | Received FHIR bundle is malformed. Please correct the bundle and try again. <Error details> |
| PAYR-1005 | Maximum time limit exceeded in receiving the request. Please try again. |
| PAYR-1006 | Invalid name in request. Hence request will not be processed further. |
| PAYR-1007 | Invalid gender in request. Hence request will not be processed further. |
| PAYR-1008 | Invalid FHIR bundle received. Hence request will not be processed further. |
|  | Invalid input, code and reason code received. Please try again with valid combination. To get the valid combination for task request, please refer to the document. |
|  | Invalid case number received. Please try again with valid case number. |
|  | Invalid Base64 value received in attachment. Please try again with valid Base64 value. Please refer to https://hl7.org/fhir/R4/datatypes.html#Attachment |
|  | Invalid attachment name received in attachment. Please try again with valid name. |
|  | Invalid content type received in attachment. Please try again with valid name. Applicable content types are - application/pdf, application/jpg, application/jpeg, application/png, application/fhir+json. For further information please refer to NHCX Integration Handbook document. |
|  | No user role found/associated for sender code %s in NHCX system. Please try again with valid sender details. |
|  | Invalid HFR Id received. Please try again with valid HFR details. |
|  | HFR Id in the request does not match with the associated registry id in NHCX. Please try again with valid HFR details. Please ensure the HFR id sent in the FHIR request must match with the registry id specified in NHCX for the sender. |
|  | Invalid Base64 value received in attachment for item <item code>. Please try again with valid Base64 value. Please refer to https://hl7.org/fhir/R4/datatypes.html#Attachment |
|  | Invalid attachment name received in attachment for item %s. Please try again with valid name. |
|  | Invalid content type received in attachment for item %s. Please try again with valid content type. Applicable content types are - application/pdf, application/jpg, application/jpeg, application/png, application/fhir+json. For further information please refer to NHCX Integration Handbook document. |
|  | Invalid Base64 value received in attachment for date of birth for new born beneficiary. Please try again with valid Base64 value. Please refer to https://hl7.org/fhir/R4/datatypes.html#Attachment |
|  | Invalid attachment name received in attachment for date of birth for new born beneficiary. Please try again with valid name. |
|  | Invalid content type received in attachment for date of birth for new born beneficiary. Please try again with valid content type. Applicable content types are - application/pdf, application/jpg, application/jpeg, application/png, application/fhir+json. For further information please refer to NHCX Integration Handbook document. |
|  | Invalid hospital id received. Please try again with valid hospital details. |
| PAYR-1009 | No identifier found for patient component. Hence request will not be processed further. https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Patient.html |
| PAYR-1010 | No type found for patient component identifier. Hence request will not be processed further. https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Patient.html |
| PAYR-1011 | No identifier found for claim component. Hence request will not be processed further. |
| PAYR-1012 | No type found for claim component identifier. Hence request will not be processed further. |
| PAYR-1013 | No identifier found for organization component for provider. Hence request will not be processed further. |
| PAYR-1014 | No type found for organization component identifier for provider. Hence request will not be processed further. |
| PAYR-1015 | No identifier found for organization component for payer. Hence request will not be processed further. |
| PAYR-1016 | No type found for organization component identifier for payer. Hence request will not be processed further. |
| PAYR-1017 | No task code received. Hence request will not be processed further. |
| PAYR-1018 | No task reason code received. Hence request will not be processed further. |
| PAYR-1019 | Invalid sequence received in supporting info element. Hence request will not be processed further. |
| PAYR-1020 | Invalid category received in supporting info element for sequence %s. Hence request will not be processed further. |
| PAYR-1021 | Invalid code received in supporting info element for sequence %s. Hence request will not be processed further. |
| PAYR-1023 | Invalid procedure category received for procedure component. Hence request will not be processed further. |
| PAYR-1024 | Invalid procedure status received for procedure component. Hence request will not be processed further. |
| PAYR-1025 | Invalid procedure sequence received for procedure component. Hence request will not be processed further. |
| PAYR-1026 | No procedure component found for reference in claim component. Hence request will not be processed further. |
| PAYR-1027 | Invalid item id found for item in claim component. Hence request will not be processed further. |
| PAYR-1028 | Invalid item sequence received for item in claim component. Hence request will not be processed further. |
| PAYR-1029 | Invalid bundle id received for FHIR bundle. Hence request will not be processed further. |
| PAYR-1030 | Invalid questionnaire id received in FHIR bundle for questionnaire component. Hence request will not be processed further. |
| PAYR-1031 | Invalid url received for bundle entry in FHIR bundle. Hence request will not be processed further. Please reach out to technical team. |
| PAYR-1032 | Invalid purpose received for coverage eligibility request. Hence request will not be processed further. Please try again with valid purpose details. |
| PAYR-1033 | No items received for coverage eligibility purpose. Since items are mandatory for the requested purpose, hence request will not be processed further. Please try again with valid item details. |
| PAYR-1034 | Invalid procedure code received. Please try again with valid procedure details. |
| PAYR-1035 | Invalid policy code received. Please try again with valid policy details. |
| PAYR-1036 | Invalid attachment received in supporting info with sequence number %s. Please try again with valid attachment details as attachment value is expected. If issue is not resolved, please reach out to technical team. |
| PAYR-1037 | No identifier found for communication component. Hence request will not be processed further. |
| PAYR-1038 | No type found for communication component identifier. Hence request will not be processed further. |
| PAYR-1039 | No payload found for communication component. Hence request will not be processed further. |
| PAYR-1040 | No component found for given reference. Hence request will not be processed further. |
| PAYR-1041 | No identifier found for procedure component. Hence request will not be processed further. |
| PAYR-1042 | No type found for procedure component identifier. Hence request will not be processed further. |
| PAYR-1043 | Date received in the request does not adhere to the NRCES date datatype format. Hence request will not be processed further. Please refere to the date format in NRCES portal. |
| PAYR-1044 | Date and time received in the request does not adhere to the NRCES date datatype format. Hence request will not be processed further. Please refere to the date time format in NRCES portal. |
| PAYR-1045 | Invalid quantity received for item. Hence request will not be processed further. |
| PAYR-1046 | No value or timing details received for supporting info for sequence %s. Hence request will not be processed further. Please reach out to technical team. |
| PAYR-1047 | Invalid reference received in supporting info with sequence number %s. Please try again with valid resource as reference value. |
| PAYR-1048 | No reference resource received for supporting info with sequence number %s. Please try again with valid resource for reference value. |
| PAYR-1049 | Invalid FHIR bundle received. Hence request will not be processed further. please reach out to technical team. |
| PAYR-1050 | No type found for practitioner component identifier. Hence request will not be processed further. |
| PAYR-1051 | No section found for composition component. Hence request will not be processed further. |
| PAYR-1052 | No references found in composition section. Hence request will not be processed further. |
| PAYR-1053 | Invalid reference found in child sections of composition section. Hence request will not be processed further. |
| PAYR-1054 | No section content found for composition component. Hence request will not be processed further. |
| PAYR-1055 | No subject found for composition component. Hence request will not be processed further. |
| PAYR-1055 | Invalid subject type found for composition component. This should be of type Patient. Hence request will not be processed further. Please try again with valid subject type for the composition. |
| PAYR-1056 | Invalid contact organization found for subject in composition component. This should be of type Organization. Hence request will not be processed further. Please try again with valid data. |
| PAYR-1057 | Invalid general practioner type found for subject in composition component. This should be of type Organization/Practitioner/PractitionerRole. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Patient.html |
| PAYR-1058 | Invalid managing organization type found for subject in composition component. This should be of type Organization. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Patient.html |
| PAYR-1059 | Invalid encounter type found for composition/observation component. This should be of type Encounter. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-DiagnosticReportRecord.html |
| PAYR-1060 | No encounter found for composition/observation component. Hence request will not be processed further. |
| PAYR-1060 | No subject found for encounter in composition component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Encounter.html |
| PAYR-1061 | Invalid subject type found for encounter in composition/observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Encounter.html |
| PAYR-1062 | No episode of care found for encounter in composition/observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Encounter.html |
| PAYR-1063 | Invalid episode of care type found for encounter in composition/observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Encounter.html |
| PAYR-1064 | No based on found for encounter in composition/observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Encounter.html |
| PAYR-1065 | Invalid based on type found for encounter in composition/observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Encounter.html |
| PAYR-1066 | No appointment found for encounter in composition/observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Encounter.html |
| PAYR-1067 | Invalid appointment type found for encounter in composition/observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Encounter.html |
| PAYR-1068 | No reason reference found for encounter in composition/observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Encounter.html |
| PAYR-1069 | Invalid reason reference type found for encounter in composition/observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Encounter.html |
| PAYR-1070 | No author found for composition component. Hence request will not be processed further. |
| PAYR-1071 | Invalid author type found for composition component. This should be of type Practitioner / PractitionerRole / Organization / Patient / Device / RelatedPerson. Hence request will not be processed further. Please try again with valid author type for the composition. |
| PAYR-1072 | No procedure reference received for procedure element in claim resource. Hence request will not be processed further. |
| PAYR-1073 | No based on found for observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Observation.html |
| PAYR-1074 | Invalid based on type found for observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Observation.html |
| PAYR-1075 | No part of found for observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Observation.html |
| PAYR-1076 | Invalid part of type found for observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Observation.html |
| PAYR-1077 | No subject found for observation component. Hence request will not be processed further. |
| PAYR-1078 | Invalid subject type found for observation component. This should be of type Patient. Hence request will not be processed further. Please try again with valid subject type for the observation. |
| PAYR-1079 | No care team details received. Hence request will not be processed further. Please add the care team details and try again. |
| PAYR-1080 | Invalid HPR details received for practioner resource with url %s. Hence request will not be processed further. Please try again with valid HPR id. |
| PAYR-1081 | Invalid service date received for item with sequence %s in claim resource. Hence request will not be processed further. Please try again with valid item service date. |
| PAYR-1082 | Invalid title received for composition for supporting info with sequence %s in claim resource. Hence request will not be processed further. Please try again with valid composition title. |
| PAYR-1083 | No HPR details found for the practitioner for resource %s. Hence request will not be processed further. Please send the details in the identifier for Practitioner resource with category code as HPIN. |
| PAYR-1084 | No questionnaire response resource found for url %s. Hence request will not be processed further. Please add the resources for all the references given in the FHIR bundle and try again. |
| PAYR-1085 | Invalid questionnaire response resource type found in the FHIR bundle for url %s. Hence request will not be processed further. |
| PAYR-1086 | No procedure resource found for url %s. Hence request will not be processed further. Please add the resources for all the references given in the FHIR bundle and try again. |
| PAYR-1087 | Invalid procedure resource type found in the FHIR bundle for url %s. Hence request will not be processed further. Procedure resource type is expected. |
| PAYR-1088 | Invalid composition details. |
| PAYR-1089 | No billing items found. Hence request will not be processed further. Please try again with valid billing items. |
| PAYR-1090 | No identifier found for coverage component. Hence request will not be processed further. |
| PAYR-1091 | No type found for coverage component identifier. Hence request will not be processed further. |
| PAYR-1092 | Something went wrong while processing request, kindly intiate new request |
| PAYR-1093 | No subject found for encounter in composition component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Encounter.html |
| PAYR-1094 | Invalid subject type found for encounter in composition/observation component. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Encounter.html |
| PAYR-1095 | Invalid discharge information received for claim request. Hence request will not be processed further. Please send the discharge information in supporting info in claim resource, with category as DIS (refer - https://www.nrces.in/ndhm/fhir/r4/ValueSet-ndhm-supportinginfo-category.html), and codes in LAMA/DAMA/DTH/DTM (refer - https://www.nrces.in/ndhm/fhir/r4/ValueSet-ndhm-supportinginfo-code.html). |
| PAYR-1096 | Invalid death date received for claim request. Hence request will not be processed further. Please send the death date information in supporting info in claim resource, with category as ONS (refer - https://www.nrces.in/ndhm/fhir/r4/ValueSet-ndhm-supportinginfo-category.html), and code as DTM (refer - https://www.nrces.in/ndhm/fhir/r4/ValueSet-ndhm-supportinginfo-code.html). |
| PAYR-1097 | No payload found in the request. Please ensure that the request that is being sent, contains encrypted payload within the mandatory payload properties. |
| PAYR-1098 | Value type received as %s for category - OTH and code - EDT for item with sequence %s in supporting info in claim resource. In supporting info list, item with category - OTH and code - EDT combination is used to get the registration date. So the registration date should be sent as timing (date or period) or as a string value, adhering to the NRCES standards, with the category - OTH and code - EDT. |
| PAYR-1099 | Value type received as %s for category - ONS and code - DSDE for item with sequence %s in supporting info in claim resource. In supporting info list, item with category - ONS and code - DSDE combination is used to get the discharge date. So the discharge date should be sent as timing (date or period) or as a string value, adhering to the NRCES standards, with the category - ONS and code - DSDE. |
| PAYR-1501 | Value type received as %s for category - ONS and code - PSP for item with sequence %s in supporting info in claim resource. In supporting info list, item with category - ONS and code - PSP combination is used to get the surgery date. So the surgery date should be sent as timing (date or period) or as a string value, adhering to the NRCES standards, with the category - ONS and code - PSP. |
| PAYR-1502 | Value type received as %s for category - ONS and code - ADDD for item with sequence %s in supporting info in claim resource. In supporting info list, item with category - ONS and code - ADDD combination is used to get the admission date. So the admission date should be sent as timing (date or period) or as a string value, adhering to the NRCES standards, with the category - ONS and code - ADDD. |
| PAYR-1503 | Value type received as %s for category - ONS and code - DTM for item with sequence %s in supporting info in claim resource. In supporting info list, item with category - ONS and code - DTM combination is used to get the death date. So the death date should be sent as timing (date or period) or as a string value, adhering to the NRCES standards, with the category - ONS and code - DTM. |
| PAYR-1504 | Value type received as %s for category - NMI and code - CQD for item with sequence %s in supporting info in claim resource. In supporting info list, item with category - NMI and code - CQD combination is used to get the overall case remarks for query response. So the case remarks for query response should be sent as a string value, adhering to the NRCES standards, with the category - NMI and code - CQD. |
| PAYR-1505 | Category received as %s and code received as %s for item with sequence %s in supporting info in claim resource, where the reference value redirects to Questionnaire Response resource in the FHIR bundle. To include a policy/case level Questionnaire Response, in supporting info list there should be an entry with category - INF and code - ODN , and the value as reference. This reference value should refer to a resource of Questionnaire Response in the FHIR bundle. To include response for any STG questionnaire, in supporting info list there should be an entry with category - STG, and the value as reference |
| PAYR-1506 | Invalid gender received for new born patient. Please try agian with valid gender data as it is mandatory for PMJAY in new born case. Please refer to the valid gender values at https://hl7.org/fhir/R4/valueset-administrative-gender.html |
| PAYR-1507 | Invalid date of birth received for new born patient. Please try agian with valid date of birth as it is mandatory for PMJAY in new born case. |
| PAYR-1508 | Invalid resource received for new born patient for url %s. Please try agian with valid Patient resource for the link reference as linked Patient resource is mandatory for PMJAY in new born case |
| PAYR-1509 | Invalid attachment received for new born patient. Please try agian with valid attachment as attachment is mandatory for PMJAY in new born case |
| PAYR-1510 | Invalid parameter code received. Please check and try again with a valid parameter code |
| PAYR-1511 | Invalid parameter value received. Please check and try again with a valid parameter value |
| PAYR-1512 | Invalid resource received for patient for url %s. Please try agian with valid Patient resource for the reference |
| PAYR-1513 | Invalid diagnosis received in DiagnosisComponent. In DiagnosisComponent, diagnosis should be sent as CodeableConcept. Please try agian with valid data |
| PAYR-1514 | Value type received as %s for category - DIS for item with sequence %s in supporting info in claim resource. In supporting info list, item with category - DIS is used to get the discharge related information. So the discharge information should be sent as string value, with value representing discharge stage (After Surgery / Before Surgery / During Surgery), with the category - DIS and code - DTH/LAMA/DAMA/DTM |
| PAYR-1515 | Invalid name received for organization resource with url %s. Name is mandatory for organization resource. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Organization.html |
| PAYR-1516 | No event found for api-caller-id %s and correlation id %s for sender code %s. Hence error response willnot be accepted. |
| PAYR-1517 | Invalid error structure received for NHCX error. Protocol response structure is expected, but received JWEPayloadResponse. |
| PAYR-1518 | No input parameters received for task resource. Input parameters are expected for task resource, but not received. Please try again with valid data. |
| PAYR-1519 | No type found for task input parameters. Hence request will not be processed further. Please refer to https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Task.html |
| PAYR-1520 | Invalid resource received for communication for url %s. Please try agian with valid Communication resource for the reference. |

## Quick Reference Card

Key values and constants for NHCX integration — print and keep at your engineering workstation.

| Parameter | Value |
|---|---|
| JWE Algorithm | RSA-OAEP-256 + A256GCM |
| Bundle Type | collection |
| Timestamp Timezone | IST (+05:30) — all timestamps must include this offset |
| Callback Response | HTTP 202 within 30 seconds |
| Patient IDs Required | PMJAY Member ID + ABHA number (ABHA without hyphens) |
| Provider ID Type | NPI |
| Payer ID Type | NIIP |
| Claim.use for PreAuth | preauthorization |
| Claim.use for Final Claim | claim |
| Diagnosis Coding System | ICD-10 — http://hl7.org/fhir/sid/icd-10 |
| Procedure Coding System | NRCes — https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-procedure-code |
| Lab Codes | LOINC — http://loinc.org |
| Clinical Codes | SNOMED CT — http://snomed.info/sct |
| Certificate Cache TTL | 24 hours |
| Workflow: New PreAuth | 12 → PREAUTH_REQUEST_INITIATED |
| Workflow: Resubmit PreAuth | 121 → PREAUTH_REQUEST_RESUBMITTED |
| Workflow: Enhancement | 13 → ENHANCEMENT_REQUEST_INITIATED |
| Workflow: Cancel PreAuth | 122 → PREAUTH_CANCEL_INITIATED (via /task/submit) |
| Workflow: Query Response | 19 → PREAUTH_QUERY_RESPONSE_SUBMITTED |
| Workflow: Final Claim | 15 → CLAIM_REQUEST_INITIATED |
| Sandbox URL | https://apisbx.abdm.gov.in/pmjay/sbxhcx |
| Production URL | https://apis.abdm.gov.in/pmjay/hcx |

* This handbook is based on the NRCes FHIR R4 specification, NHCX protocol documentation, and production implementation patterns. Always refer to the latest NHA/NRCes specifications for updates.


---

*13 embedded image(s) extracted to `NHCX PMJAY Integration Handbook_images/`*