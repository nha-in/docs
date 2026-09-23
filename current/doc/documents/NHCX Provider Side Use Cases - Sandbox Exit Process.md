# NHCX Provider Side Use Cases - Sandbox Exit Process

*Source: `documents/NHCX Provider Side Use Cases - Sandbox Exit Process.pdf` — extracted full text*

**Pages: 7**


---

## Page 1

Provider:
Use case 1 Get Participant List –
APIs to be called /fetch/participants/list
Use case description Retrieve the list of participants in the registry
based on the role
Entity to Implement the API called NHCX
Use case 2 Get Policy
APIs to be called /participant/get/policies
API to be Implemented NA
Use case description Get the list of policies for the beneficiary based on
the mobile number or ABHA
Entity to Implement the API called NHCX
Use case 3 Get public Key
APIs to be called /fetch/certs
API to be Implemented NA
Use case description Retrieve the public key of the receiver, that is to be
used to encrypt the payload for the receiver.
participant id must be mandatorily provided in the
request.
Entity to Implement the API called NHCX
Use case 4 Get the auth token
APIs to be called /get/session
API to be Implemented NA
Use case description To generate the token to authenticate NHCX API
calls
Entity to Implement the API called NHCX
Use case 5 Check the coverage eligibility
APIs to be called /v1/coverageeligibility/check
Callback API to be Implemented /v1/coverageeligibility/on_check
Use case description To check the eligibility of a beneficiary with the
payers via NHCX.
This API should be used to request whether the
patient's coverage is in force, whether it is valid at

**Table 1.1**

| Use case 1 | Get Participant List – |
|---|---|
| APIs to be called | /fetch/participants/list |
|  |  |
| Use case description | Retrieve the list of participants in the registry<br>based on the role |
| Entity to Implement the API called | NHCX |


**Table 1.2**

| Use case 2 | Get Policy |
|---|---|
| APIs to be called | /participant/get/policies |
| API to be Implemented | NA |
| Use case description | Get the list of policies for the beneficiary based on<br>the mobile number or ABHA |
| Entity to Implement the API called | NHCX |


**Table 1.3**

| Use case 3 | Get public Key |
|---|---|
| APIs to be called | /fetch/certs |
| API to be Implemented | NA |
| Use case description | Retrieve the public key of the receiver, that is to be<br>used to encrypt the payload for the receiver.<br>participant id must be mandatorily provided in the<br>request. |
| Entity to Implement the API called | NHCX |


**Table 1.4**

| Use case 4 | Get the auth token |
|---|---|
| APIs to be called | /get/session |
| API to be Implemented | NA |
| Use case description | To generate the token to authenticate NHCX API<br>calls |
| Entity to Implement the API called | NHCX |


**Table 1.5**

| Use case 5 | Check the coverage eligibility |
|---|---|
| APIs to be called | /v1/coverageeligibility/check |
| Callback API to be Implemented | /v1/coverageeligibility/on_check |
| Use case description | To check the eligibility of a beneficiary with the<br>payers via NHCX.<br>This API should be used to request whether the<br>patient's coverage is in force, whether it is valid at |


---

## Page 2

this or specified date, and/or for requesting the
benefits & plan details associated with the
coverage.
Entity to Implement the API called Payer
Protocol status request.initiated
Request Payload Encrypted payload of
CoverageEligibilityRequestBundle
Validations Payload should be validated against the profiles
published by NRCES.
Callback API logic Callback API should be implemented by provider
systems. It should accept the payload in two forms
and it will be derived based on “type” param of the
response.
1. Encrypted format (As per RFC7516) and
decrypt using the private key of the
provider entity.
Encrypted payload comes as response only
when the payer processed the request and
responded when everything is validated
and verified.
2. ProtocolResponse.
ProtolcolReponse comes as response only
when the payer couldnot able to process
the request due to payload is invalid or not
able to decrypt or any protocol errors.
Use case 6 Request insurance plan details
APIs to be called /v1/insuranceplan/request
Callback API to be Implemented /v1/insuranceplan/on_request
Use case description Request insurance plan details from the Payer via
HCX
Protocol status request.initiated
Request Payload Encrypted payload of TaskBundle
Validations Payload should be validated against the profiles
published by NRCES.
Entity to Implement the API called Payer

**Table 2.1**

|  | this or specified date, and/or for requesting the<br>benefits & plan details associated with the<br>coverage. |
|---|---|
| Entity to Implement the API called | Payer |
| Protocol status | request.initiated |
| Request Payload | Encrypted payload of<br>CoverageEligibilityRequestBundle |
| Validations | Payload should be validated against the profiles<br>published by NRCES. |
| Callback API logic | Callback API should be implemented by provider<br>systems. It should accept the payload in two forms<br>and it will be derived based on “type” param of the<br>response.<br>1. Encrypted format (As per RFC7516) and<br>decrypt using the private key of the<br>provider entity.<br>Encrypted payload comes as response only<br>when the payer processed the request and<br>responded when everything is validated<br>and verified.<br>2. ProtocolResponse.<br>ProtolcolReponse comes as response only<br>when the payer couldnot able to process<br>the request due to payload is invalid or not<br>able to decrypt or any protocol errors. |
|  |  |


**Table 2.2**

| Use case 6 | Request insurance plan details |
|---|---|
| APIs to be called | /v1/insuranceplan/request |
| Callback API to be Implemented | /v1/insuranceplan/on_request |
| Use case description | Request insurance plan details from the Payer via<br>HCX |
| Protocol status | request.initiated |
| Request Payload | Encrypted payload of TaskBundle |
| Validations | Payload should be validated against the profiles<br>published by NRCES. |
| Entity to Implement the API called | Payer |


---

## Page 3

Callback API logic Callback API should be implemented by provider
systems. It should accept the payload in two forms,
and it will be derived based on “type” param of the
response.
3. Encrypted format (As per RFC7516) of the
payload InsurancePlanBundle using the
private key of the provider entity.
Encrypted payload comes as response only
when the payer processed the request and
responded when everything is validated
and verified.
4. ProtocolResponse.
ProtolcolReponse comes as response only
when the payer couldnot able to process
the request due to payload is invalid or not
able to decrypt or any protocol errors.
Use case 7 Preauthorization submission
APIs to be called /v1/preauth/submit
API to be Implemented /v1/preauth/on_submit
Use case description Submit the Preauthorization request from the
Provider end.
Entity to Implement the API called Payer
Protocol status request.initiated
Request Payload Encrypted payload of ClaimBundle
Validations Payload should be validated against the profiles
published by NRCES.
Callback API logic Callback API should be implemented by provider
systems. It should accept the payload in two forms,
and it will be derived based on “type” param of the
response.
1. Encrypted format (As per RFC7516) of the
payload ClaimResponseBundle and
decrypt using the private key of the
provider entity.
Encrypted payload comes as response only
when the payer processed the request and
responded when everything is validated
and verified.
2. ProtocolResponse.

**Table 3.1**

| Callback API logic | Callback API should be implemented by provider<br>systems. It should accept the payload in two forms,<br>and it will be derived based on “type” param of the<br>response.<br>3. Encrypted format (As per RFC7516) of the<br>payload InsurancePlanBundle using the<br>private key of the provider entity.<br>Encrypted payload comes as response only<br>when the payer processed the request and<br>responded when everything is validated<br>and verified.<br>4. ProtocolResponse.<br>ProtolcolReponse comes as response only<br>when the payer couldnot able to process<br>the request due to payload is invalid or not<br>able to decrypt or any protocol errors. |
|---|---|


**Table 3.2**

| Use case 7 | Preauthorization submission |
|---|---|
| APIs to be called | /v1/preauth/submit |
| API to be Implemented | /v1/preauth/on_submit |
| Use case description | Submit the Preauthorization request from the<br>Provider end. |
| Entity to Implement the API called | Payer |
| Protocol status | request.initiated |
| Request Payload | Encrypted payload of ClaimBundle |
| Validations | Payload should be validated against the profiles<br>published by NRCES. |
| Callback API logic | Callback API should be implemented by provider<br>systems. It should accept the payload in two forms,<br>and it will be derived based on “type” param of the<br>response.<br>1. Encrypted format (As per RFC7516) of the<br>payload ClaimResponseBundle and<br>decrypt using the private key of the<br>provider entity.<br>Encrypted payload comes as response only<br>when the payer processed the request and<br>responded when everything is validated<br>and verified.<br>2. ProtocolResponse. |


---

## Page 4

ProtolcolReponse comes as response only
when the payer couldnot able to process
the request due to payload is invalid or not
able to decrypt or any protocol errors.
Use case 8 Respond to communication request received from
Payer for additional documents
Callback APIs to be called /v1/communication/on_request
API to be Implemented /v1/communication/request
Use case description Respond to the communication Request via NHCX.
This API will be called by payers to seek more
details of the case submitted by providers for
Preauthorization or for Claims.
Entity to Implement the Callback API called Payer
Protocol status response.completed
Response Payload Encrypted payload of TaskBundle should have
Comunication as input.
Validations Payload should be validated against the profiles
published by NRCES.
Use case 9 Claim Submission
APIs to be called /v1/claim/submit
API to be Implemented /v1/claim/on_submit
Use case description Submit the Claim from the Provider end to the
NHCX.
Entity to Implement the API called Payer
Protocol status request.initiated
Request Payload Encrypted payload of ClaimBundle
Validations Payload should be validated against the profiles
published by NRCES.
Callback API logic Callback API should be implemented by provider
systems. It should accept the payload in two forms,
and it will be derived based on “type” param of the
response.
1. Encrypted format (As per RFC7516) of the
payload ClaimResponseBundle and
decrypt using the private key of the
provider entity.
Encrypted payload comes as response only
when the payer processed the request and
responded when everything is validated

**Table 4.1**

|  | ProtolcolReponse comes as response only<br>when the payer couldnot able to process<br>the request due to payload is invalid or not<br>able to decrypt or any protocol errors. |
|---|---|
|  |  |


**Table 4.2**

| Use case 8 | Respond to communication request received from<br>Payer for additional documents |
|---|---|
| Callback APIs to be called | /v1/communication/on_request |
| API to be Implemented | /v1/communication/request |
| Use case description | Respond to the communication Request via NHCX.<br>This API will be called by payers to seek more<br>details of the case submitted by providers for<br>Preauthorization or for Claims. |
| Entity to Implement the Callback API called | Payer |
| Protocol status | response.completed |
| Response Payload | Encrypted payload of TaskBundle should have<br>Comunication as input. |
| Validations | Payload should be validated against the profiles<br>published by NRCES. |
|  |  |


**Table 4.3**

| Use case 9 | Claim Submission |
|---|---|
| APIs to be called | /v1/claim/submit |
| API to be Implemented | /v1/claim/on_submit |
| Use case description | Submit the Claim from the Provider end to the<br>NHCX. |
| Entity to Implement the API called | Payer |
| Protocol status | request.initiated |
| Request Payload | Encrypted payload of ClaimBundle |
| Validations | Payload should be validated against the profiles<br>published by NRCES. |
| Callback API logic | Callback API should be implemented by provider<br>systems. It should accept the payload in two forms,<br>and it will be derived based on “type” param of the<br>response.<br>1. Encrypted format (As per RFC7516) of the<br>payload ClaimResponseBundle and<br>decrypt using the private key of the<br>provider entity.<br>Encrypted payload comes as response only<br>when the payer processed the request and<br>responded when everything is validated |


---

## Page 5

and verified.
2. ProtocolResponse.
ProtolcolReponse comes as response only
when the payer couldnot able to process
the request due to payload is invalid or not
able to decrypt or any protocol errors.
Use case 10 Claim Search
APIs to be called /v1/search/submit
API to be Implemented /v1/search/on_submit
Use case description To search the claim related information by the
providers/regulatory bodies
Entity to Implement the API called Payer
Protocol status request.initiated
Request Payload Encrypted payload of TaskBundle with code as
“Search”
Validations Payload should be validated against the profiles
published by NRCES.
Callback API logic Callback API should be implemented by provider
systems. It should accept the payload in two forms,
and it will be derived based on “type” param of the
response.
1. Encrypted format (As per RFC7516) of the
payload TaskBundle and decrypt using the
private key of the provider entity.
Encrypted payload comes as response only
when the payer processed the request and
responded when everything is validated
and verified.
2. ProtocolResponse.
ProtolcolReponse comes as response only
when the payer couldnot able to process
the request due to payload is invalid or not
able to decrypt or any protocol errors.
Use case 11 Acknowledge Payment notice
Callback APIs to be called /v1/paymentnotice/on_request
API to be Implemented /v1/paymentnotice/request
Use case description Acknowledge the payment notification sent by the

**Table 5.1**

|  | and verified.<br>2. ProtocolResponse.<br>ProtolcolReponse comes as response only<br>when the payer couldnot able to process<br>the request due to payload is invalid or not<br>able to decrypt or any protocol errors. |
|---|---|
|  |  |


**Table 5.2**

| Use case 10 | Claim Search |
|---|---|
| APIs to be called | /v1/search/submit |
| API to be Implemented | /v1/search/on_submit |
| Use case description | To search the claim related information by the<br>providers/regulatory bodies |
| Entity to Implement the API called | Payer |
| Protocol status | request.initiated |
| Request Payload | Encrypted payload of TaskBundle with code as<br>“Search” |
| Validations | Payload should be validated against the profiles<br>published by NRCES. |
| Callback API logic | Callback API should be implemented by provider<br>systems. It should accept the payload in two forms,<br>and it will be derived based on “type” param of the<br>response.<br>1. Encrypted format (As per RFC7516) of the<br>payload TaskBundle and decrypt using the<br>private key of the provider entity.<br>Encrypted payload comes as response only<br>when the payer processed the request and<br>responded when everything is validated<br>and verified.<br>2. ProtocolResponse.<br>ProtolcolReponse comes as response only<br>when the payer couldnot able to process<br>the request due to payload is invalid or not<br>able to decrypt or any protocol errors. |


**Table 5.3**

| Use case 11 | Acknowledge Payment notice |
|---|---|
| Callback APIs to be called | /v1/paymentnotice/on_request |
| API to be Implemented | /v1/paymentnotice/request |
| Use case description | Acknowledge the payment notification sent by the |


---

## Page 6

Payer.
Entity to Implement the API called Payer
Protocol status response.completed
Response Payload Encrypted payload of TaskBundle with Task
Resource
Validations Payload should be validated against the profiles
published by NRCES.
Use case 12 Request for Reprocess/Cancel
APIs to be called /v1/task/submit
API to be Implemented /v1/task/on_submit
Use case description To reprocess/cancel the claims or
preauthorisations, in case of rejection or partial
approval provider can raise reprocess.
Entity to Implement the API called Payer
Protocol status request.initiated
Request Payload Encrypted payload of TaskBundle with Task code as
“reprocess” or “cancel” or “release” or “nullify” as
per the usecase.
Validations Payload should be validated against the profiles
published by NRCES.
Callback API logic Callback API should be implemented by provider
systems. It should accept the payload in two forms,
and it will be derived based on “type” param of the
response.
3. Encrypted format (As per RFC7516) of the
payload TaskBundle and decrypt using the
private key of the provider entity.
Encrypted payload comes as response only
when the payer processed the request and
responded when everything is validated
and verified.
4. ProtocolResponse.
ProtolcolReponse comes as response only
when the payer couldnot able to process
the request due to payload is invalid or not
able to decrypt or any protocol errors.
Use case 13 Get status
APIs to be called /v1/status
API to be Implemented /v1/on_status
Use case description Retrieve the status of any request that has been

**Table 6.1**

|  | Payer. |
|---|---|
| Entity to Implement the API called | Payer |
| Protocol status | response.completed |
| Response Payload | Encrypted payload of TaskBundle with Task<br>Resource |
| Validations | Payload should be validated against the profiles<br>published by NRCES. |


**Table 6.2**

| Use case 12 | Request for Reprocess/Cancel |
|---|---|
| APIs to be called | /v1/task/submit |
| API to be Implemented | /v1/task/on_submit |
| Use case description | To reprocess/cancel the claims or<br>preauthorisations, in case of rejection or partial<br>approval provider can raise reprocess. |
| Entity to Implement the API called | Payer |
| Protocol status | request.initiated |
| Request Payload | Encrypted payload of TaskBundle with Task code as<br>“reprocess” or “cancel” or “release” or “nullify” as<br>per the usecase. |
| Validations | Payload should be validated against the profiles<br>published by NRCES. |
| Callback API logic | Callback API should be implemented by provider<br>systems. It should accept the payload in two forms,<br>and it will be derived based on “type” param of the<br>response.<br>3. Encrypted format (As per RFC7516) of the<br>payload TaskBundle and decrypt using the<br>private key of the provider entity.<br>Encrypted payload comes as response only<br>when the payer processed the request and<br>responded when everything is validated<br>and verified.<br>4. ProtocolResponse.<br>ProtolcolReponse comes as response only<br>when the payer couldnot able to process<br>the request due to payload is invalid or not<br>able to decrypt or any protocol errors. |


**Table 6.3**

| Use case 13 | Get status |
|---|---|
| APIs to be called | /v1/status |
| API to be Implemented | /v1/on_status |
| Use case description | Retrieve the status of any request that has been |


---

## Page 7

triggered to NHCX
Entity to Implement the API called NHCX
Protocol status request.initiated
Request Payload Encrypted payload of request for which the status
is seeking for.
Validations Payload should be validated against the profiles
published by NRCES.
Callback API logic Callback API should be implemented by provider
systems. It should accept the payload as
ProtocolHeader contains all the attributes.

**Table 7.1**

|  | triggered to NHCX |
|---|---|
| Entity to Implement the API called | NHCX |
| Protocol status | request.initiated |
| Request Payload | Encrypted payload of request for which the status<br>is seeking for. |
| Validations | Payload should be validated against the profiles<br>published by NRCES. |
| Callback API logic | Callback API should be implemented by provider<br>systems. It should accept the payload as<br>ProtocolHeader contains all the attributes. |
