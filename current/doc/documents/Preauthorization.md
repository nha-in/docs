# Preauthorization

*Source: `documents/Preauthorization.pdf` — extracted full text*

**Pages: 5**


---

## Page 1

Preauthorization Submission
Preauthorization Submission - Request
Providers should send the following details in the request body while making a call for
Preauthorization Submit:
• A set of header attributes that provide transport, security, message integrity
and summary information about the message being exchanged. This
information is used by the NHCX gateway for routing the request and auditing
purposes.
2. Domain payload containing the “Claim” as prescribed for the use case by the
domain specifications. This needs to be encrypted so that NHCX cannot read
this and can be decrypted & processed only by the intended recipient. Please
refer the link for Domain specifications of Claim bundle.
https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClaimBundle
3. Request body (header attributes and the FHIR bundle) should be sent in the
form of a JWE token (RFC-7516) using the steps defined in the link
https://datatracker.ietf.org/doc/html/rfc7516.
The response to this API could be one of the following:
4. A successful accepted response from the NHCX gateway if the structure of the
request is valid and the validation of open attributes (protocol headers) is
successful. Upon successful validation, NHCX gateway forwards the same
request to the intended recipient asynchronously.
5. An error response if any of the validations fail.
Preauthorization Submission – Response
This is the callback API on NHCX gateways and on Provider systems which will be called
by Payer systems and NHCX gateways to return the response for Pre-Authorization
requests. Payload for this API has to be created as per the specifications of NHCX
published in the link https://nrces.in/preview/ndhm/fhir/r4/StructureDefinition-
ClaimResponseBundle.html.
2. A set of header attributes that provide transport, security, message integrity
and summary information about the message being exchanged. This
information is used by the NHCX gateway for routing the request and auditing
purposes.

---

## Page 2

3. If Preauth Submit request is successfully processed, payer should send a
ClaimResponse domain entity as specified for the use case in domain
specifications in the link.
https://nrces.in/preview/ndhm/fhir/r4/StructureDefinition-
ClaimResponseBundle.html.
4. This needs to be encrypted so that NHCX cannot read this, and this can be
decrypted & processed only by the intended recipient.
5. In any scenario if Payer is unable to process the request due to provider is
invalid or decryption of the message fails or any mandatory protocol attributes
are missing with regards to the use case, an error message will be sent as
“protocol response” which contains the same protocol header attributes along
with error messages.
The error details should be sent in the following manner:
• Basic details about the error must be sent as part of the header
attributes. NHCX gateway shall read and store this information for
audit & search purposes.
• Following header attributes should be used for sending the error
details: - **x-hcx-status** should be set to **response.fail**.
• **x-hcx-error_details** attribute should be set with the
appropriate error code, message and trace details (if available).
6. In case where there are clinical, patient or business-related errors, the payer
should send exact details of the error to the recipient. These details should not
be shared with the NHCX gateway and hence, should be sent in encrypted
form. Payor should embed the error details within the
CoverageEligibilityResponse resource that is sent as part of the request body.
Note: Refer to the JWEPayload schema definition for details & structure of the JWE
token that has to be sent as the request body in this API. The response to this API
could be one of the following:
7. A successful accepted response from the NHCX gateway if the structure of the
request payload is valid and the validation of open attributes (protocol
headers) is successful. Upon successful validation, NHCX gateway forwards the
same request to the intended recipient asynchronously.
8. An error response if any of the validations fail.

---

## Page 3

iii. Sequence Diagram
High-level definition of API
API Definition – Preauth Submission - Payer
Name of the API /preauth/submit
This API is for providers to submit preauth requests (and
resubmit updated request) to NHCX gateway and for NHCX
Description/Purpose
gateway to route the same request to payers. Payload for
this API must be created as per the Claim Request bundle

**Table 3.1**

| Name of the API | /preauth/submit |
|---|---|
| Description/Purpose | This API is for providers to submit preauth requests (and<br>resubmit updated request) to NHCX gateway and for NHCX<br>gateway to route the same request to payers. Payload for<br>this API must be created as per the Claim Request bundle |


---

## Page 4

defined in NHCX Specifications and serialized as per the
guidelines in NHCX Specifications.
Input Provider
(API to be consumed by)
Key Processing/Validations Validate the protected header values.
HTTP Method POST
External API
Input JSON Structure As per the API specifications published
Response JSON Structure As per the API specifications published
HTTP Response Status Code 202- Accepted
400 – Request Validation Failed
Exception Code 404- Request resource was not found
500 – Downstream systems down/unhandled exception
Error Response JSON As per the API specifications published
Remarks (If Any)
API Definition – Preauth Submission - Provider
Name of the API /preauth/on_submit
This is the callback API on NHCX gateways and on Provider
systems which will be called by Payor systems and NHCX
gateways to return the response for Pre-Authorization
Description/Purpose requests.
Payload for this API has to be created as per the Claim
Response bundle defined in NHCX Specifications and
serialized as per the guidelines in NHCX Specifications.
Input Payers
(API to be consumed by)
Key Processing/Validations Validate the protected header values.
HTTP Method POST
External API
Input JSON Structure As per the API specifications published
Response JSON Structure As per the API specifications published

**Table 4.1**

|  | defined in NHCX Specifications and serialized as per the<br>guidelines in NHCX Specifications. |
|---|---|
| Input<br>(API to be consumed by) | Provider |
| Key Processing/Validations | Validate the protected header values. |
| HTTP Method | POST |
| External API |  |
| Input JSON Structure | As per the API specifications published |
| Response JSON Structure | As per the API specifications published |
| HTTP Response Status Code | 202- Accepted |
| Exception Code | 400 – Request Validation Failed<br>404- Request resource was not found<br>500 – Downstream systems down/unhandled exception |
| Error Response JSON | As per the API specifications published |
| Remarks (If Any) |  |


**Table 4.2**

| Name of the API | /preauth/on_submit |
|---|---|
| Description/Purpose | This is the callback API on NHCX gateways and on Provider<br>systems which will be called by Payor systems and NHCX<br>gateways to return the response for Pre-Authorization<br>requests.<br>Payload for this API has to be created as per the Claim<br>Response bundle defined in NHCX Specifications and<br>serialized as per the guidelines in NHCX Specifications. |
| Input<br>(API to be consumed by) | Payers |
| Key Processing/Validations | Validate the protected header values. |
| HTTP Method | POST |
| External API |  |
| Input JSON Structure | As per the API specifications published |
| Response JSON Structure | As per the API specifications published |


---

## Page 5

HTTP Response Status Code 202- Accepted
400 – Request Validation Failed
Exception Code 404- Request resource was not found
500 – Downstream systems down/unhandled exception
Error Response JSON As per the API specifications published
Remarks (If Any)

**Table 5.1**

| HTTP Response Status Code | 202- Accepted |
|---|---|
| Exception Code | 400 – Request Validation Failed<br>404- Request resource was not found<br>500 – Downstream systems down/unhandled exception |
| Error Response JSON | As per the API specifications published |
| Remarks (If Any) |  |


---

*1 embedded image(s) extracted to `Preauthorization_images/`*