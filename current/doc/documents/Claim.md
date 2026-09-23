# Claim

*Source: `documents/Claim.pdf` — extracted full text*

**Pages: 5**


---

## Page 1

Claim Submit
Claim Submit - Request
Providers should send the following details in the request body while making a call for
Claim Submit:
1. A set of header attributes that provide transport, security, message integrity and
summary information about the message being exchanged. This information is
used by the NHCX gateway for routing the request and auditing purposes.
2. Domain payload containing the ClaimRequest as specified for the use case by the
domain specifications
https://nrces.in/preview/ndhm/fhir/r4/StructureDefinition-ClaimBundle.html
3. This needs to be encrypted so that NHCX cannot read this and can be decrypted &
processed only by the intended recipient.
4. Request body (header attributes and the FHIR bundle) should be sent in the form
of a JWE token (RFC-7516) using the steps defined in NHCX specs.
The response to this API could be one of the following:
5. A successful accepted response from the NHCX gateway if the structure of the
request is valid and the validation of open attributes (protocol headers) is
successful. Upon successful validation, NHCX gateway forwards the same request
to the intended recipient asynchronously.
6. An error response if any of the validations fail.
Claim Submit – Response
This is the callback API on NHCX gateway and on Provider systems which will be called by
Payer systems and NHCX gateways to return the response for Claim Submit requests.
Payload for this API has to be created as per the specifications of NHCX published in the
link https://nrces.in/preview/ndhm/fhir/r4/StructureDefinition-
ClaimResponseBundle.html.
1. A set of header attributes that provide transport, security, message integrity and
summary information about the message being exchanged. This information is
used by the NHCX gateway for routing the request and auditing purposes.
2. If Claim Submit request is successfully processed, payer should send a
ClaimResponse domain entity as specified for the use case in domain specifications
in the link.
https://nrces.in/preview/ndhm/fhir/r4/StructureDefinition-
ClaimResponseBundle.html.

---

## Page 2

3. This needs to be encrypted so that NHCX cannot read, and this can be decrypted
& processed only by the intended recipient.
4. In any scenario if Payer is unable to process the request due to provider is invalid
or decryption of the message fails or any mandatory protocol attributes are
missing with regards to the use case, an error message will be sent as “protocol
response” which contains the same protocol header attributes along with error
messages. The error details should be sent in the following manner: - Basic details
about the error must be sent as part of the header attributes. HCX gateway shall
read and store this information for audit & search purposes.
5. Following header attributes should be used for sending the error details:
• **x-hcx-status** should be set to **response.fail**.
• **x-hcx-error_details** attribute should be set with the appropriate
error code, message, and trace details (if available).
6. In case where there are clinical, patient, or business-related errors, the payer
should send exact details of the error to the recipient. These details should not be
shared with the HCX gateway and hence, should be sent in encrypted form. Payer
should embed the error details within the ClaimResponse resource that is sent as
part of the request body.
Note: Refer to the JWEPayload schema definition for details & structure of the JWE
token that has to be sent as the request body in this API. The response to this API
could be one of the following:
7. A successful accepted response from the NHCX gateway if the structure of the
request payload is valid and the validation of open attributes (protocol headers) is
successful. Upon successful validation, NHCX gateway forwards the same request
to the intended recipient asynchronously.
8. An error response if any of the validations fail.

---

## Page 3

Sequence Diagram

---

## Page 4

High-level definition of API
API Definition – Claim Request Submission - Payer
Name of the API /claim/submit
This API is for providers to submit claim requests to
Description/Purpose NHCX gateway and for HCX gateway to route the same
request to payers.
Payload for this API must be created as per the Claim
Request bundle defined in HCX Specification and
serialized as per the guidelines in HCX Specifications.
Input (API to be consumed by) Providers
Key Processing/Validations Validate the protected header values
HTTP Method POST
External API
Input JSON Structure As per the API Specifications published
Response JSON Structure As per the API Specifications published
HTTP Response Status Code 202- Accepted
400 – Request Validation Failed
404- Request resource was not found
Exception Code
500 – Downstream systems down/unhandled
exception
Error Response JSON As per the API Specifications published
Remarks (If Any)
API Definition – Claim Request Response - Provider
Name of the API /claim/on_submit
This is the callback API on NHCX gateways and on
Provider systems which will be called by Payer systems
and NHCX gateways to return the response for Claim
requests.
Description/Purpose
Payload for this API must be created as per the Claim
Response bundle defined in NHCX Specifications and
serialized as per the guidelines in NHCX Specifications.

**Table 4.1**

| Name of the API | /claim/submit |
|---|---|
| Description/Purpose | This API is for providers to submit claim requests to<br>NHCX gateway and for HCX gateway to route the same<br>request to payers. |
|  | Payload for this API must be created as per the Claim<br>Request bundle defined in HCX Specification and<br>serialized as per the guidelines in HCX Specifications. |
| Input (API to be consumed by) | Providers |
| Key Processing/Validations | Validate the protected header values |
| HTTP Method | POST |
| External API |  |
| Input JSON Structure | As per the API Specifications published |
| Response JSON Structure | As per the API Specifications published |
| HTTP Response Status Code | 202- Accepted |
| Exception Code | 400 – Request Validation Failed<br>404- Request resource was not found<br>500 – Downstream systems down/unhandled<br>exception |
| Error Response JSON | As per the API Specifications published |
| Remarks (If Any) |  |


**Table 4.2**

| Name of the API | /claim/on_submit |
|---|---|
| Description/Purpose | This is the callback API on NHCX gateways and on<br>Provider systems which will be called by Payer systems<br>and NHCX gateways to return the response for Claim<br>requests.<br>Payload for this API must be created as per the Claim<br>Response bundle defined in NHCX Specifications and<br>serialized as per the guidelines in NHCX Specifications. |


---

## Page 5

Input (API to be consumed by) Payors
Key Processing/Validations Validate the protected header values
HTTP Method POST
External API
Input JSON Structure As per the API Specifications published
Response JSON Structure As per the API Specifications published
HTTP Response Status Code 202- Accepted
400 – Request Validation Failed
404- Request resource was not found
Exception Code
500 – Downstream systems down/unhandled
exception
As per the API Specifications published
Error Response JSON
Remarks (If Any)

**Table 5.1**

| Input (API to be consumed by) | Payors |
|---|---|
| Key Processing/Validations | Validate the protected header values |
| HTTP Method | POST |
| External API |  |
| Input JSON Structure | As per the API Specifications published |
| Response JSON Structure | As per the API Specifications published |
| HTTP Response Status Code | 202- Accepted |
| Exception Code | 400 – Request Validation Failed<br>404- Request resource was not found<br>500 – Downstream systems down/unhandled<br>exception |
| Error Response JSON | As per the API Specifications published |
| Remarks (If Any) |  |


---

*1 embedded image(s) extracted to `Claim_images/`*