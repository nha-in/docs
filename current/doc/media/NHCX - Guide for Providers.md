# NHCX - Guide for Providers

*Source: `media/NHCX - Guide for Providers.pdf` — extracted full text*

**Pages: 16**


---

## Page 1

National Health Claims Exchange
The next step in Digital Health Interoperability
.
Integrators Guide

**Table 1.1**

| National Health Claims Exchange<br>The next step in Digital Health Interoperability<br>.<br>Integrators Guide |
|---|
|  |
|  |
|  |


---

## Page 2

Integrator’s Journey
Guidelines for Participant Onboarding on NHCX
To gain
1. Create HFR ID
NHCX
NHCX Access to Go Live on
2. Get Functional
Compliant for Sandbox NHCX NHCX
testing
ABDM M1 Production
➢Send Request to ➢Decide your role ➢Internal Demo: Test ➢Role Assignment in
access Sandbox (Payer/ Provider) and Showcase production
APIs ➢Register on NHCX Interoperability, ➢NHCX Production Participant
➢Get access after Sandbox, generate FHIR Bundle ID creation
health tech participant ID Validation
committee approval ➢Technology ➢HTC Demo
➢Integrate with Development- ➢NHCX Sandbox
Sandbox APIs for Upgrade your Signoff
Milestone 1 application to
➢Functional Testing/ complete NHCX
WASA (Security API integration
audit)
➢HTC Demo
➢Go Live for ABDM
M1

---

## Page 3

NHCX Pre-Requisites
To gain
1. Create HFR ID
NHCX
NHCX Access to Go Live on
2. Get Functional
Compliant for Sandbox NHCX NHCX
testing
ABDM M1 Production
Step 1: Registration with Health Facility Registry (HFR)
Please visit https://facility.abdm.gov.in/ or https://nhpr.abdm.gov.in/home to complete the facility registration process. Please write to
facility@nha.gov.in in case of any question on this step.
Step 2: Apply on ABDM sandbox by filling the registration form
The pre-requisite for NHCX is ABHA creation and verification. This implies that you must also complete the milestone M1 integration
process.
Firstly, apply for sandbox registration : https://sandbox.abdm.gov.in/sandbox/v3/
In order to participate for NHCX integration select "Providers and Payer" and M1 as an intent for request.
Once your application is reviewed and approved, you can begin your integration journey using the provided client ID and secret key .
Step 3: Successful M1 Integration under ABDM
Once your functional testing and WASA (security audit) are completed, an HTC demo will be conducted. Completing these steps will enable
you to proceed to ABDM production.
Your software must have ABDM M1 functionalities enabled to proceed with NHCX integration.

---

## Page 4

HFR Registration
1. To login or register in HFR, click on “Login/Registration.”
2. For detailed guide please refer to the below link: HFR creation

---

## Page 5

ABDM M1 Integration
Functionalities to be implemented as part of M 1 Documentation on ABDM M1
1.Create ABHA number using Aadhaar / Driving License • https://sandbox.abdm.gov.in/sandbox/v3
/new-documentation?doc=getting-
2.Verify ABHA Number / ABHA address during patient registration
started
• https://sandbox.abdm.gov.in/sandbox/v3
/new-
documentation?doc=Milestone_one
• https://sandbox.abdm.gov.in/sandbox/v3
/new-
documentation?doc=postman_collections
• https://sandbox.abdm.gov.in/sandbox/v3
/new-documentation?doc=ABDM_M3_V1
Please follow our test cases for M1
https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=TestCases
Note: Integration support team will guide you if you encounter any roadblocks in the process. Please reach out to integration.support@nha.gov.in

**Table 5.1**

|  |
|---|
| Functionalities to be implemented as part of M 1 |


---

## Page 6

Integrator’s Journey (Sandbox Participant Creation)
Guidelines for Participant Onboarding on NHCX
To gain
1. Create HFR ID
NHCX
NHCX Access to Go Live on
2. Get Functional
Compliant for Sandbox NHCX NHCX
testing
ABDM M1 Production
1. Register on the Sandbox
a) Click on the following link to register: https://sandbox.abdm.gov.in/sandbox/v3/sandbox-
Valid Role Enums :
registration PROVIDER("10001")
b) Use your ABDM sandbox client ID and secret key during the registration process. PAYER("10002")
AGENCY_TPA("10003")
2. Obtain Credentials AGENCY_REGULATOR("10004")
After submitting the registration form, you will be assigned roles to access the NHCX Sandbox RESEARCH("10005")
environment.
3. Generate Your Participant ID Valid Registry Enums:
HFR ("10001")
a) Use the client ID and client secret obtained from the ABDM sandbox portal during
NIN ("10002")
Milestone 1 integration to generate an access token.
ROHINI(" 10003")
API to generate access token: https://dev.abdm.gov.in/gateway/v0.5/sessions
PAYER ("10004")
b) Pass the access token in the headers of the following API: - API to create participant:
https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/create API
c) Use the same credentials to create participant code for all the facilities using their
respective HFR ID."

---

## Page 7

Integrator’s Journey (Technology Upgradation)
Guidelines for Participant Onboarding on NHCX
To gain
1. Create HFR ID
NHCX
NHCX Access to Go Live on
2. Get Functional
Compliant for Sandbox NHCX NHCX
testing
ABDM M1 Production
1. Base URL for Sandbox:
Use Case APIs(useCaseBaseUrl)- https://apisbx.abdm.gov.in/hcx
2. Please visit https://hcxsbx.abdm.gov.in/#/documents. The use case documents for providers and
payers are available on the website and can be downloaded.

---

## Page 8

Integrator’s Journey
Guidelines for Participant Onboarding on NHCX
To gain
1. Create HFR ID
NHCX
NHCX Access to Go Live on
2. Get Functional
Compliant for Sandbox NHCX NHCX
testing
ABDM M1 Production
1. FHIR Bundle Validation:
Please send the FHIR bundles to hcx.integration@nha.gov.in for validation by the NRCeS Team.
2. Functional Testing:
a. Internal Demo: NHA team will be conducting this demo to check the use cases
b. HTC demo: This will be conducted by NRCeS, IRDAI, TCS and NHA teams
Please Note: to request for the demos, the integrators will have to write an email on the above-mentioned
email
3. After successfully completing the demos and FHIR bundle validation, you will receive a communication
from NHA confirming your successful integration on the NHCX sandbox.

---

## Page 9

Integrator’s Journey
Guidelines for Participant Onboarding on NHCX
To gain
1. Create HFR ID
NHCX
NHCX Access to Go Live on
2. Get Functional
Compliant for Sandbox NHCX NHCX
testing
ABDM M1 Production
➢ After successful integration, NHA team will assign provider role to your M1 production clientID and same will be
used for NHCX production access.
➢ Base URL for production: Will be shared post successful integration on NHCX Sandbox
➢ Use this link for onboarding APIs on NHCX production and usecases: https://nhcx.abdm.gov.in/
Please refer this link for detailed documentation on Production: https://nhcx.abdm.gov.in/

---

## Page 10

Integrator’s Journey
Guidelines for Participant Onboarding on NHCX
To gain
1. Create HFR ID
NHCX
NHCX Access to Go Live on
2. Get Functional
Compliant for Sandbox NHCX NHCX
testing
ABDM M1 Production
1. Participants must prepare their application for go-live in their respective environments after obtaining the
production credentials.
2. NHCX recommends conducting necessary training for staff and planning for change management before
going live in production, preferably after a pilot with a small set of clients.

---

## Page 11

Error Handling
Acceptance scenario
Whenever recipient receives a request from the sender (through NHCX) the return type should be as below with http status
as 202 Accepted.
{
"timestamp":"DD/MM/YYYY hh:mm:ss:sss",
"api_call_id":"UUID",
"correlation_id":"UUID",
"result":{
"sender_code":"PYRXX@hcx",
"recipient_code":"INXXXXX@hcx",
"entity_type":"coverageeligibility/preauth/claim/task/payment/insuranceplan",
"protocol_status":"request.queued/request.dispatched/request.error"
},
"error":{
"code":"",
"message":""
}
}

---

## Page 12

Error Handling
Protocol Response in case of error scenarios to be sent back by the receiver in
case of not acceptance after evaluation:
{
Error Scenario
"type":"ProtocolResponse",
"x-hcx-sender_code": "",
If the recipient rejects the payload sent by the sender for any
"x-hcx-recipient_code": "",
reason, or if the required format is not followed, the system "x-hcx-api_call_id": "UUID",
will treat it as an error. In such cases, the system will attempt "x-hcx-correlation_id": "UUID",
"x-hcx-workflow_id": "UUID",
to resend the request up to five times before ultimately
"x-hcx-timestamp": "",
terminating the entire request.
"x-hcx-debug_flag": "Error",
"x-hcx-status": "response.error",
After five failed attempts, the request associated with the
"x-hcx-redirect_to": "",
specific correlation ID will be deleted from the NHCX system. "x-hcx-error_details": {
"code": "String",
"message": "String",
To avoid issues, the receiver should correctly follow the
"trace": "String"
acceptance process or send an appropriate response if
},
rejecting the payload. If the receiver fails to handle the error
"x-hcx-debug_details": {
properly or if there is a server-side issue, the request will be
"code": "String",
returned to the sender. "message": "String",
"trace": "String"
},
"x-hcx-domain-header": {
So, every integrator should implement the v1/error API at
"use_case_name": "String",
their end where they will get the reject details and respond
"amt_processed": "String"
back.
},
"x-hcx-entity-type": "coverageeligibility | payment | insuranceplan | task | claim | preauth",
"x-hcx-ben-abha-id":"abha number"
}

---

## Page 13

Important Links and URLs
5. Onboarding Documents:
1. Website Links:
Onboarding providers and payers in Sandbox
Sandbox:https://hcxsbx.abdm.gov.in/
Onboarding providers and payers in Production
Production: https://nhcx.abdm.gov.in/
2. Base URL for Sandbox:
6. Use Case Documents:
ParticipantAPIs(participantBaseUrl)-
NHCX Payer Side Use Cases- Sandbox Exit Process
https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice
NHCX Provider Side Use Cases- Sandbox Exit Process
Use Case APIs(useCaseBaseUrl)- https://apisbx.abdm.gov.in/hcx
3. Base URL for production:
ParticipantAPIs(participantBaseUrl)-
https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice
UseCase APIs(useCaseBaseUrl)- https://apisprod.nha.gov.in/hcx
4. Please refer to the documents here:
https://nhcx.abdm.gov.in/#/documents

---

## Page 14

FAQs
2. What is the process for Participant creation in the Sandbox in
1. How to generate session token in Sandbox environment while calling
NHCX?
NHCX APIs.
For creation of participant in NHCX, follow given steps.
For generating session token in Sandbox environment, you need to call sessions API.
Step 1: Use session API to generate session token which will be used in
subsequent API call.
URL: https://dev.abdm.gov.in/gateway/v0.5/sessions
URL for Sandbox: https://dev.abdm.gov.in/gateway/v0.5/sessions
REQUEST
Step 2: Use Participant Creation API to create participant id.
https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/par
ticipant/create
Validations:
· The registry type should be valid and one from the Valid Registry
RESPONSE
Enums directory provided.
· The role should be valid and one from the Valid Role Enums
directory provided.
· The mobile number should be a valid one and is already registered
in the system.
Mobile Number: It will be validated with the one recorded in the
HFR and both should match for the call to be successful.
· The passcode will be sent the registered number after successful
validation and the transaction id will be shared in the response;
both can be further used for confirmation.

**Table 14.1**

| https | : | //dev | .abdm | .gov | .in/gateway/v | 0 | .5 | /sessions |
|---|---|---|---|---|---|---|---|---|


---

## Page 15

FAQs
4. Which standard we are using for encrypting the json in NHCX?
3. How to fetch the public key of the participant in Sandbox?
We are using the RFC7516 standard for preparing JWE encrypted
To get the encryption certificate of the respective participant you need to call /fetch/certs payload.
API.
5. Where can I find all the use cases related to NHCX integration?
URL for Sandbox:
https://hcxsbx.abdm.gov.in/#/documents the use case documents
https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs
for provider & payer are present in the website and can be
REQUEST
downloaded.
6. What is the expected implementation for Providers?
Providers has to register as a provider(10001) in the NHCX
platform and generate their participant code. After this , They are
RESPONSE
required to implement provider side apis available at –
https://hcxsbx.abdm.gov.in/#/documents the use case documents
for provider & payer are present in the website and can be
downloaded.
7. How to Prepare a FHIR resource bundle for NHCX usescases?
Refer the NRCES technical specifications for the respective use
case . For any query regarding this , please connect with NRCES
team at mail id- nrc-help@cdac.in.

**Table 15.1**

| We |  | are u | sing | the | RFC | 7516 |  | standard |  | for | preparing | JWE | encrypted |  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| payload. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |


**Table 15.2**

| https | : | //apisbx | .abdm | .gov | .in/pmjay/sbxhcx/participanthcxservice/fetch/certs |
|---|---|---|---|---|---|


**Table 15.3**

| Provider | s | has |  | to |  | register |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| platform | and |  |  | generate |  |  |  | their |  | participant |  |  |  | c | ode. | Afte | r | this |  |  | , |  | They | are |  |
| required | to |  | implement |  |  |  |  | provider |  |  |  | side | apis |  | available |  | at |  |  | – |  |  |  |  |  |


**Table 15.4**

| Refer |  |  | th | e | NRCES |  |  | technical |  |  | specifications |  |  |  |  |  | fo | r | the | respective |  |  |  |  |  | use |  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| case |  | . | Fo | r | any | query |  |  |  | regarding |  |  | this | , | please |  |  | connect |  |  |  | with |  | NRCES |  |  |  |
| team |  | at |  | mail i |  | d- | nrc-help@cdac.in |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |


---

## Page 16

.
Thank You

**Table 16.1**

| .<br>Thank You |
|---|
|  |
|  |
|  |


---

*24 embedded image(s) extracted to `NHCX - Guide for Providers_images/`*