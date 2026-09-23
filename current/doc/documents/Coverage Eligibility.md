# Coverage Eligibility

*Source: `documents/Coverage Eligibility.pdf` — extracted full text*

**Pages: 5**


---

## Page 1

Check Coverage Eligibility
Check Coverage Eligibility - Request
This functionality will be called by providers to check the eligibility of a beneficiary with
the payers via NHCX. This feature will be used to request whether the patient's coverage
is in force, whether it is valid at this or specified date, and/or for requesting the benefits
& plan details associated with the coverage. Providers should send the following details
in the request body while making a call for coverage eligibility check:
1. A set of header attributes that provide transport, security, message integrity and
summary information about the message being exchanged. This information is
used by the NHCX gateway for routing the request and auditing purposes.
2. Domain payload containing the CoverageEligibilityRequest domain entity as
prescribed for the use case by the domain specifications.
https://nrces.in/preview/ndhm/fhir/r4/StructureDefinition-
CoverageEligibilityRequest.html.
3. This needs to be encrypted so that NHCX cannot read and can be decrypted &
processed only by the intended recipient. The domain payload should be a
CoverageEligibilityRequest document resource as per NHCX FHIR profile
definitions (an extension of HL7 FHIR).
4. Request body (header attributes and the FHIR payload) should be sent in the form
of a JWE token (RFC-7516) using the steps defined in the link.
https://datatracker.ietf.org/doc/html/rfc7516
The response to this functionality will be one of the following:
5. A successful accepted response from the HCX gateway if the structure of the
request is valid and the validation of open attributes (protocol headers) is
successful. Upon successful validation, HCX gateway forwards the same request to
the intended recipient asynchronously.
6. An error response if any of the validations fail. If the request is successfully
accepted by the NHCX gateway and forwarded to the recipient (i.e. the payer), the
provider (who made the Coverage Eligibility Request API call) should expect the
response via a call back to Coverage Eligibility Response API asynchronously.
7. The response API payload may either contain the requested coverage details or
error details in case of any errors during processing.
8. An alternate scenario is when the Payer might respond with a forward instruction
asking the NHCX to submit the same request to another Payer.
9. Payer will respond with CoverageEligibilityResponse object upon successful
processing of the request at payer systems by calling /on_request API.

---

## Page 2

Check Coverage Eligibility - Response
This API is for payers to send the response for a coverage eligibility request to the
providers. In case of a successful scenario, this API payload should contain the eligibility
and plan details of the beneficiary for whom the details are requested for. Payers should
send the following details as the request payload in the coverage eligibility response API:
1. A set of header attributes that provide transport, security, message integrity and
summary information about the message being exchanged. This information is
used by the HCX gateway for routing the request and auditing purposes.
2. If the coverage eligibility request is successfully processed, payer should send a
CoverageEligibilityResponse domain entity as specified for the use case in domain
specifications in the link.
https://nrces.in/preview/ndhm/fhir/r4/StructureDefinitionCoverageEligibilityRes
ponse.html.
3. This needs to be encrypted so that NHCX cannot read this, and this can be
decrypted & processed only by the intended recipient.
4. In any scenario if Payer is unable to process the request due to provider is invalid
or decryption of the message fails or any mandatory protocol attributes are
missing with regards to the use case, an error message will be sent as “protocol
response” which contains the same protocol header attributes along with error
messages.
5. The error details should be sent in the following manner: - Basic details about the
error must be sent as part of the header attributes. NHCX gateway shall read and
store this information for audit & search purposes.
6. Following header attributes should be used for sending the error details: - **x-
hcx-status** should be set to **response.fail**. - **x-hcx-error_details**
attribute should be set with the appropriate error code, message, and trace details
(if available).
7. In case where there are clinical, patient, or business-related errors, the payer
should send exact details of the error to the recipient. These details should not be
shared with the HCX gateway and hence, should be sent in encrypted form. Payor
should embed the error details within the CoverageEligibilityResponse resource
that is sent as part of the request body.
Note: Refer to the JWEPayload schema definition for details & structure of the JWE
token that must be sent as the request body in this API. The response to this API
could be one of the following:
a. A successful accepted response from the HCX gateway if the structure of the
request payload is valid and the validation of open attributes (protocol
headers) is successful. Upon successful validation, HCX gateway forwards the
same request to the intended recipient asynchronously.
b. An error response if any of the validations

---

## Page 3

Sequence Diagram
High-level definitions of API
API Definition - Check Eligibility API - Payer
Name of the API /coverageeligibility/check
This API is for providers to check the eligibility of a beneficiary
with the payors via HCX. This API should be used to request
whether the patient's coverage is in force, whether it is valid
Description/Purpose
at this or specified date, and/or for requesting the benefits &
plan details associated with the coverage.

**Table 3.1**

| Name of the API | /coverageeligibility/check |
|---|---|
| Description/Purpose | This API is for providers to check the eligibility of a beneficiary<br>with the payors via HCX. This API should be used to request<br>whether the patient's coverage is in force, whether it is valid<br>at this or specified date, and/or for requesting the benefits &<br>plan details associated with the coverage. |


---

## Page 4

Input provider
(API to be consumed by)
Key Validate benefit id, Payor id and provider id as per the logic.
Processing/Validations
HTTP Method POST
External API
Input JSON Structure As per the API specification published
Response JSON Structure As per the API specification published
HTTP Response Status 202 - Accepted
Code
400 – Request Validation Failed
Exception Code 404- Request resource was not found
500 – Downstream systems down/unhandled exception
Error Response As per the API specification published
Any Remarks
API Definition - Check Eligibility API - Provider
Name of the API /coverageeligibility/on_check
This API is for payors to send the response for a coverage
eligibility request to the providers. In case of a successful
Description/Purpose scenario, this API payload should contain the eligibility and
plan details of the beneficiary for whom the details are
requested for.
Input (API to be payer
consumed by)
Key Validate benefit id, Payor id and provider id as per the logic.
Processing/Validations
HTTP Method POST
External API
Input JSON Structure As per the API specification published
Response JSON Structure
HTTP Response Status 202 - Accepted
Code
400 – Request Validation Failed
Exception Code 404- Request resource was not found
500 – Downstream systems down/unhandled exception

**Table 4.1**

| Input<br>(API to be consumed by) | provider |
|---|---|
| Key<br>Processing/Validations | Validate benefit id, Payor id and provider id as per the logic. |
| HTTP Method | POST |
| External API |  |
| Input JSON Structure | As per the API specification published |
| Response JSON Structure | As per the API specification published |
| HTTP Response Status<br>Code | 202 - Accepted |
| Exception Code | 400 – Request Validation Failed<br>404- Request resource was not found<br>500 – Downstream systems down/unhandled exception |
| Error Response | As per the API specification published |
| Any Remarks |  |


**Table 4.2**

| Name of the API | /coverageeligibility/on_check |
|---|---|
| Description/Purpose | This API is for payors to send the response for a coverage<br>eligibility request to the providers. In case of a successful<br>scenario, this API payload should contain the eligibility and<br>plan details of the beneficiary for whom the details are<br>requested for. |
| Input (API to be<br>consumed by) | payer |
| Key<br>Processing/Validations | Validate benefit id, Payor id and provider id as per the logic. |
| HTTP Method | POST |
| External API |  |
| Input JSON Structure | As per the API specification published |
| Response JSON Structure |  |
| HTTP Response Status<br>Code | 202 - Accepted |
| Exception Code | 400 – Request Validation Failed<br>404- Request resource was not found<br>500 – Downstream systems down/unhandled exception |


---

## Page 5

Error Response
Any Remarks

**Table 5.1**

| Error Response |  |
|---|---|
| Any Remarks |  |


---

*1 embedded image(s) extracted to `Coverage Eligibility_images/`*