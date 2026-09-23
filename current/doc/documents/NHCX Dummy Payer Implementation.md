# NHCX Dummy Payer Implementation

*Source: `documents/NHCX Dummy Payer Implementation.pdf` — extracted full text*

**Pages: 3**


---

## Page 1

Dummy Payer
Participant ID: 1000003538@hcx
The below usecases can be tested using the dummy payer:
• Insurance Plan
• Coverage Eligibility
• Preauth
• Claim
• Payment Notice
• Communication
Insurance Plan:
Trigger the v1/insuranceplan/request API with proper payload & headers.
Please use provider id as 32722 inside the FHIR bundle. and policy number as 100217(only
applicable for dummy payer).
Coverageeligibility:
Trigger the v1/coverageeligibility/check API with proper payload & headers.
Preauth:
Step 1: Trigger the v1/preauth/submit API with proper payload & headers.
Step 2: Use the /process/request API to trigger the onSubmit from Payer side with the desired
Action scenario (Approve/Reject/Query)
Step 3: If the process is triggered as query, The communication Request is triggered using
/communication/request from the Payer’s end, the claim/preauth is still with the payer.
Step 4: The provider must respond with the supporting documents by calling
/communication/on_request.
Step 5: The payer will respond with the final adjudicated response for the given preauth request by
calling /preauth/on_submit API.
Note: Steps 3 & 4 are applicable only in case of Query.
Claim:
Step 1: Trigger the v1/preauth/submit API with proper payload & headers.

**Table 1.1**

| Note: Steps 3 & 4 are applicable only in case of Query. |
|---|
|  |


---

## Page 2

Step 2: Use the /process/request API to trigger the onSubmit from Payer side with the desired
Action scenario (Approve/Reject/Query)
Step 3: If the process is triggered as query, The communication Request is triggered using
/communication/request from the Payer’s end, the claim/preauth is still with the payer.
Step 4: The provider must respond with the supporting documents by calling
/communication/on_request.
Step 5: The payer will respond with the final adjudicated response for the given preauth request by
calling claim/on_submit APIs.
Note: Steps 3 & 4 are applicable only in case of Query.
Payment Notice:
Step 1: Use the /paymentNotice/init API to trigger the payment notice prompt from the Payer side
to test the usecase.
Step 2: Send an acknowledgement.
Communication:
Step 1: Trigger the v1/preauth/submit API with proper payload & headers.
Step 2: Use the /process/request API to trigger the onSubmit from Payer side with the Query as
action, the communication from the Payer side is auto triggered.
Step 3: Send a response to the Payer using v1/communication/on_request API.
Step 4: The provider must respond with the supporting documents by calling
/communication/on_request to get the response back on /preauth/on_submit or claim/on_submit
APIs.
CURL for Test Usecase Action API:
curl --location --request POST
'https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/process/request' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header ‘bearer_auth: Bearer {{token}}’ \
--data-raw '{
"action":"Approve",//Approve|Reject|Query
"method":"Claim",//Preauth|Claim

---

## Page 3

"correlationId":"aed629f7-XXXX-XXXX-XXXX-2f225169e68c"
}'
CURL for Payment Notice Trigger API:
curl --location --request POST
'https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/paymentNotice/init' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header ‘bearer_auth: Bearer {{token}}’ \
--data-raw '{
"providerId":"XXXXXXX@hcx",
"claimNumber":""
}'