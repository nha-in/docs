# Onboarding providers and payers in Sandbox

*Source: `documents/Onboarding providers and payers in Sandbox.pdf` — extracted full text*

**Pages: 3**


---

## Page 1

Onboarding providers and payers
NHCX participant registry acts as a source of truth for participant information on the
platform. This registry stores key details about the participants on the exchange who can
exchange data through it and exposes open APIs to manage & access the registry data.
• A Payer when registering with the NHCX provides required details necessary for
validation. It is validated against a trusted Payer registry.
• A TPA when registering with the NHCX platform provides required details
necessary for validation. It is validated against a trusted TPA registry.
• A Provider when registering with the NHCX platform provides required details
necessary for validation. It is validated against a trusted Provider registry ie HFR
registry of ABDM.
• A Provider or Payer (TPA or IC) can execute claims requests in NHCX only when
they are validated by the platform. Claims request however needs to be validated
separately.
API Definition - Create Participant
Name of the API /participate/create
This API is to create a participant in the registry. API generates
Description/Purpose a unique participant code and returns the code in the
response on successful creation of participant.
Input providers, payers
(API to be consumed by)
Key Validate the linked registry codes
Processing/Validations
HTTP Method POST
External API Not Required
Input JSON Structure Please refer the API specification published
{
Response JSON Structure "participant_code": "100001@sbx"
}
HTTP Response Status 200
Code
400-client error
Exception Code 404-Resource not found
500 – Downstream systems down/unhandled exceptions
Error Response As per API specification published
Remarks (If Any)

**Table 1.1**

| Name of the API | /participate/create |
|---|---|
| Description/Purpose | This API is to create a participant in the registry. API generates<br>a unique participant code and returns the code in the<br>response on successful creation of participant. |
| Input<br>(API to be consumed by) | providers, payers |
| Key<br>Processing/Validations | Validate the linked registry codes |
| HTTP Method | POST |
| External API | Not Required |
| Input JSON Structure | Please refer the API specification published |
| Response JSON Structure | {<br>"participant_code": "100001@sbx"<br>} |
| HTTP Response Status<br>Code | 200 |
| Exception Code | 400-client error<br>404-Resource not found<br>500 – Downstream systems down/unhandled exceptions |
| Error Response | As per API specification published |
| Remarks (If Any) |  |


---

## Page 2

API Definition - Delete Participant
Name of the API /participate/delete
This API is to delete a participant from the registry. API only
Description/Purpose does a soft delete of the participant.
Input providers, payers
(API to be consumed by)
Key Validate the participant id provided
Processing/Validations
HTTP Method POST
External API
{
Input JSON Structure “participant_code”:”10001@sbx”
}
{
Response JSON Structure “message”:”Deleted”
}
HTTP Response Status 200
Code
400-client error
Exception Code 404-Resource not found
500 – Downstream systems down/unhandled exceptions
Remarks (If Any)
API Definition - Update Participant
Name of the API /participate/update
This API is to update a participant's information in the registry.
participant_code must be mandatorily provided in the
request. This API will be used to update the bridge URL or
Description/Purpose
encryption_cert or any other attribute which participant
would like to update in the registry.
Input providers,payers
(API to be consumed by)
Key Validate the linked registry codes
Processing/Validations

**Table 2.1**

| Name of the API | /participate/delete |
|---|---|
| Description/Purpose | This API is to delete a participant from the registry. API only<br>does a soft delete of the participant. |
| Input<br>(API to be consumed by) | providers, payers |
| Key<br>Processing/Validations | Validate the participant id provided |
| HTTP Method | POST |
| External API |  |
| Input JSON Structure | {<br>“participant_code”:”10001@sbx”<br>} |
| Response JSON Structure | {<br>“message”:”Deleted”<br>} |
| HTTP Response Status<br>Code | 200 |
| Exception Code | 400-client error<br>404-Resource not found<br>500 – Downstream systems down/unhandled exceptions |
| Remarks (If Any) |  |


**Table 2.2**

| Name of the API | /participate/update |
|---|---|
| Description/Purpose | This API is to update a participant's information in the registry.<br>participant_code must be mandatorily provided in the<br>request. This API will be used to update the bridge URL or<br>encryption_cert or any other attribute which participant<br>would like to update in the registry. |
| Input<br>(API to be consumed by) | providers,payers |
| Key<br>Processing/Validations | Validate the linked registry codes |


---

## Page 3

HTTP Method POST
External API
As per the API specification published
Input JSON Structure
{
Response JSON Structure "participant_code": "100001@sbx"
}
HTTP Response Status 200
Code
400-client error
Exception Code 404-Resource not found
500 – Downstream systems down/unhandled exceptions
Error Response As per API specification published
Remarks (If Any)
Any entity who registers in NHCX registry considered as valid participant to communicate
through NHCX.

**Table 3.1**

| HTTP Method | POST |
|---|---|
| External API |  |
| Input JSON Structure | As per the API specification published |
| Response JSON Structure | {<br>"participant_code": "100001@sbx"<br>} |
| HTTP Response Status<br>Code | 200 |
| Exception Code | 400-client error<br>404-Resource not found<br>500 – Downstream systems down/unhandled exceptions |
| Error Response | As per API specification published |
| Remarks (If Any) |  |
