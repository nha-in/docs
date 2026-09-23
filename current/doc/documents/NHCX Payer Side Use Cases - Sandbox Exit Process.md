# NHCX Payer Side Use Cases - Sandbox Exit Process

*Source: `documents/NHCX Payer Side Use Cases - Sandbox Exit Process.pdf` — extracted full text*

**Pages: 7**


---

## Page 1

Payer:
Use case 1 Link ABHA with Policy
APIs to be called /participant/link/abha/policy
API to be Implemented NA
Use case description Link ABHA Number to the Policy purchased by the
individual at the time of policy creation at payer
systems.
Entity to Implement the API called NHCX
Use case 2 Get Policy
APIs to be called /participant/get/policies
API to be Implemented NA
Use case description Get the list of policies for the beneficiary based on
the mobile number or ABHA
Entity to Implement the API called NHCX
Use case 3 De-Link ABHA from Policy
APIs to be called /participant/delink/abha/policy
API to be Implemented NA
Use case description De-Link Policy Number from ABHA profile
Entity to Implement the API called NHCX
Use case 4 Get Participant List
APIs to be called /fetch/participants/list
API to be Implemented NA
Use case description Retrieve the list of participants in the registry
based on the role
Entity to Implement the API called NHCX
Use case 5 Get public Key
APIs to be called /fetch/certs
API to be Implemented NA
Use case description Retrieve the public key of the receiver, that is to be
used to encrypt the payload for the receiver.
participant id must be mandatorily provided in the
request.
Entity to Implement the API called NHCX
Use case 6 Get the auth token
APIs to be called /get/session

**Table 1.1**

| Use case 1 | Link ABHA with Policy |
|---|---|
| APIs to be called | /participant/link/abha/policy |
| API to be Implemented | NA |
| Use case description | Link ABHA Number to the Policy purchased by the<br>individual at the time of policy creation at payer<br>systems. |
| Entity to Implement the API called | NHCX |


**Table 1.2**

| Use case 2 | Get Policy |
|---|---|
| APIs to be called | /participant/get/policies |
| API to be Implemented | NA |
| Use case description | Get the list of policies for the beneficiary based on<br>the mobile number or ABHA |
| Entity to Implement the API called | NHCX |


**Table 1.3**

| Use case 3 | De-Link ABHA from Policy |
|---|---|
| APIs to be called | /participant/delink/abha/policy |
| API to be Implemented | NA |
| Use case description | De-Link Policy Number from ABHA profile |
| Entity to Implement the API called | NHCX |


**Table 1.4**

| Use case 4 | Get Participant List |
|---|---|
| APIs to be called | /fetch/participants/list |
| API to be Implemented | NA |
| Use case description | Retrieve the list of participants in the registry<br>based on the role |
| Entity to Implement the API called | NHCX |


**Table 1.5**

| Use case 5 | Get public Key |
|---|---|
| APIs to be called | /fetch/certs |
| API to be Implemented | NA |
| Use case description | Retrieve the public key of the receiver, that is to be<br>used to encrypt the payload for the receiver.<br>participant id must be mandatorily provided in the<br>request. |
| Entity to Implement the API called | NHCX |


**Table 1.6**

| Use case 6 | Get the auth token |
|---|---|
| APIs to be called | /get/session |


---

## Page 2

API to be Implemented NA
Use case description To generate the token to authenticate the API calls
Entity to Implement the API called NHCX
Use case 7 Response to the coverageeligibility request
APIs to be called /v1/coverageeligibility/on_check
API to be Implemented /v1/coverageeligibility/check
Use case description Payer to respond with API payload which should
contain the eligibility and plan details of the
beneficiary for whom the details are requested for.
Entity to Implement the API called Provider
Protocol Status response.complete
Validations 1. Payload should be validated against the
profiles published by NRCES.
2. Api caller ID and Correlation ID should be
different.
3. Correlation ID should be the API caller ID
of the request that you are responding to.
4. Receiver code should be the same as
Sender ID of the request that Payer system
is responding to.
API logic This API should be called by payers by passing the
appropriate payload. It should be prepared in two
types based on the processing of the request.
Prepare the response keeping the “type” param of
as “JWEPayloadResponse” or “ProtocolResponse”
1. Encrypt the payload (As per RFC7516)
using the public key of the recipient entity.
Encrypted payload will be prepared only
when the payer validated and processed
the request at their systems.
2. ProtocolResponse.
ProtolcolReponse will be prepared as
response only when the payer could not
validate and process the request due to
payload is invalid or not able to decrypt or
any protocol errors.
Use case 8 Response to the insurance plan request
APIs to be called /v1/insuranceplan/on_request
API to be Implemented /v1/insuranceplan/request

**Table 2.1**

| API to be Implemented | NA |
|---|---|
| Use case description | To generate the token to authenticate the API calls |
| Entity to Implement the API called | NHCX |


**Table 2.2**

| Use case 7 | Response to the coverageeligibility request |
|---|---|
| APIs to be called | /v1/coverageeligibility/on_check |
| API to be Implemented | /v1/coverageeligibility/check |
| Use case description | Payer to respond with API payload which should<br>contain the eligibility and plan details of the<br>beneficiary for whom the details are requested for. |
| Entity to Implement the API called | Provider |
| Protocol Status | response.complete |
| Validations | 1. Payload should be validated against the<br>profiles published by NRCES.<br>2. Api caller ID and Correlation ID should be<br>different.<br>3. Correlation ID should be the API caller ID<br>of the request that you are responding to.<br>4. Receiver code should be the same as<br>Sender ID of the request that Payer system<br>is responding to. |
| API logic | This API should be called by payers by passing the<br>appropriate payload. It should be prepared in two<br>types based on the processing of the request.<br>Prepare the response keeping the “type” param of<br>as “JWEPayloadResponse” or “ProtocolResponse”<br>1. Encrypt the payload (As per RFC7516)<br>using the public key of the recipient entity.<br>Encrypted payload will be prepared only<br>when the payer validated and processed<br>the request at their systems.<br>2. ProtocolResponse.<br>ProtolcolReponse will be prepared as<br>response only when the payer could not<br>validate and process the request due to<br>payload is invalid or not able to decrypt or<br>any protocol errors. |


**Table 2.3**

| Use case 8 | Response to the insurance plan request |
|---|---|
| APIs to be called | /v1/insuranceplan/on_request |
| API to be Implemented | /v1/insuranceplan/request |


---

## Page 3

Use case description Respond with the insurance plan details request
via NHCX
Entity to Implement the API called Provider
Protocol Status response.complete
Validations 1. Payload should be validated against the
profiles published by NRCES.
2. Api caller ID and Correlation ID should be
different.
3. Correlation ID should be the API caller ID
of the request that you are responding to.
4. Receiver code should be the same as
Sender ID of the request that Payer system
is responding to.
API logic This API should be called by payers by passing the
appropriate payload.
Use case 9 Respond to the Preauthorization Submitted
APIs to be called /v1/preauth/on_submit
API to be Implemented /v1/preauth/submit
Use case description Payer to respond with API payload which should
contain the adjudicated Preauthorization details.
Entity to Implement the API called Provider
Protocol Status response.complete
Validations 1. The payload should be validated against
the profiles published by NRCES.
2. Api caller ID and Correlation ID should be
different.
3. Correlation ID should be the API caller ID
of the request that you are responding to.
4. Receiver code should be the same as
Sender ID of the request that Payer system
is responding to.
API logic This API should be called by payers by passing the
appropriate payload. It should be prepared in two
types based on the processing of the request.
Prepare the response keeping the “type” param of
as “JWEPayloadResponse” or “ProtocolResponse”
3. Encrypt the payload (As per RFC7516)
using the public key of the recipient entity.
Encrypted payload will be prepared only
when the payer validated and processed
the request at their systems.

**Table 3.1**

| Use case description | Respond with the insurance plan details request<br>via NHCX |
|---|---|
| Entity to Implement the API called | Provider |
| Protocol Status | response.complete |
| Validations | 1. Payload should be validated against the<br>profiles published by NRCES.<br>2. Api caller ID and Correlation ID should be<br>different.<br>3. Correlation ID should be the API caller ID<br>of the request that you are responding to.<br>4. Receiver code should be the same as<br>Sender ID of the request that Payer system<br>is responding to. |
| API logic | This API should be called by payers by passing the<br>appropriate payload. |
|  |  |


**Table 3.2**

| Use case 9 | Respond to the Preauthorization Submitted |
|---|---|
| APIs to be called | /v1/preauth/on_submit |
| API to be Implemented | /v1/preauth/submit |
| Use case description | Payer to respond with API payload which should<br>contain the adjudicated Preauthorization details. |
| Entity to Implement the API called | Provider |
| Protocol Status | response.complete |
| Validations | 1. The payload should be validated against<br>the profiles published by NRCES.<br>2. Api caller ID and Correlation ID should be<br>different.<br>3. Correlation ID should be the API caller ID<br>of the request that you are responding to.<br>4. Receiver code should be the same as<br>Sender ID of the request that Payer system<br>is responding to. |
| API logic | This API should be called by payers by passing the<br>appropriate payload. It should be prepared in two<br>types based on the processing of the request.<br>Prepare the response keeping the “type” param of<br>as “JWEPayloadResponse” or “ProtocolResponse”<br>3. Encrypt the payload (As per RFC7516)<br>using the public key of the recipient entity.<br>Encrypted payload will be prepared only<br>when the payer validated and processed<br>the request at their systems. |


---

## Page 4

4. ProtocolResponse.
ProtolcolReponse will be prepared as
response only when the payer could not
validate and process the request due to
payload is invalid or not able to decrypt or
any protocol errors.
Use case 10 Raise communication request
APIs to be called /v1/communication/request
API to be Implemented /v1/communication/on_request
Use case description Raise a communication request to Provider via HCX
in a claim cycle for any additional documents
required from provider.
Entity to Implement the API called Provider
Protocol Status request.initiated
Validations Payload should be validated against the profiles
published by NRCES.
API logic API should be called by payer systems to get the
additional documents from the privider. Payload
will be prepared as TaskBundle having
CommunicationRequest as bundle component.
Use case 11 Respond to the Claim Submitted
APIs to be called /v1/claim/on_submit
API to be Implemented /v1/claim/submit
Use case description Payer to respond with API payload which should
contain the adjudicated Claim details.
Entity to Implement the API called Provider
Protocol Status response.complete or response.partial
Validations 1. The payload should be validated against
the profiles published by NRCES.
2. Api caller ID and Correlation ID should be
different.
3. Correlation ID should be the API caller ID
of the request that you are responding to.
4. Receiver code should be the same as
Sender ID of the request that Payer system
is responding to.
API logic This API should be called by payers by passing the
appropriate payload. It should be prepared in two
types based on the processing of the request.
Prepare the response keeping the “type” param of

**Table 4.1**

|  | 4. ProtocolResponse.<br>ProtolcolReponse will be prepared as<br>response only when the payer could not<br>validate and process the request due to<br>payload is invalid or not able to decrypt or<br>any protocol errors. |
|---|---|
|  |  |


**Table 4.2**

| Use case 10 | Raise communication request |
|---|---|
| APIs to be called | /v1/communication/request |
| API to be Implemented | /v1/communication/on_request |
| Use case description | Raise a communication request to Provider via HCX<br>in a claim cycle for any additional documents<br>required from provider. |
| Entity to Implement the API called | Provider |
| Protocol Status | request.initiated |
| Validations | Payload should be validated against the profiles<br>published by NRCES. |
| API logic | API should be called by payer systems to get the<br>additional documents from the privider. Payload<br>will be prepared as TaskBundle having<br>CommunicationRequest as bundle component. |
|  |  |


**Table 4.3**

| Use case 11 | Respond to the Claim Submitted |
|---|---|
| APIs to be called | /v1/claim/on_submit |
| API to be Implemented | /v1/claim/submit |
| Use case description | Payer to respond with API payload which should<br>contain the adjudicated Claim details. |
| Entity to Implement the API called | Provider |
| Protocol Status | response.complete or response.partial |
| Validations | 1. The payload should be validated against<br>the profiles published by NRCES.<br>2. Api caller ID and Correlation ID should be<br>different.<br>3. Correlation ID should be the API caller ID<br>of the request that you are responding to.<br>4. Receiver code should be the same as<br>Sender ID of the request that Payer system<br>is responding to. |
| API logic | This API should be called by payers by passing the<br>appropriate payload. It should be prepared in two<br>types based on the processing of the request.<br>Prepare the response keeping the “type” param of |


---

## Page 5

as “JWEPayloadResponse” or “ProtocolResponse”
5. Encrypt the payload (As per RFC7516)
using the public key of the recipient entity.
Encrypted payload will be prepared only
when the payer validated and processed
the request at their systems.
6. ProtocolResponse.
ProtolcolReponse will be prepared as
response only when the payer could not
validate and process the request due to
payload is invalid or not able to decrypt or
any protocol errors.
Use case 12 Respond to search request
APIs to be called /v1/search/on_submit
API to be Implemented /v1/search/submit
Use case description To respond for search requests based on the task
request. It provides the ClaimResponse(s) to the
given input criteria.
Entity to Implement the API called Provider
Validations 1. The payload should be validated against
the profiles published by NRCES.
2. Api caller ID and Correlation ID should be
different.
3. Correlation ID should be the API caller ID
of the request that you are responding to.
4. Receiver code should be the same as
Sender ID of the request that Payer system
is responding to.
API logic This API should be called by payers by passing the
appropriate payload. It should be prepared in two
types based on the processing of the request.
Prepare the response keeping the “type” param of
as “JWEPayloadResponse” or “ProtocolResponse”
7. Encrypt the payload (As per RFC7516)
using the public key of the recipient entity.
Encrypted payload will be prepared only
when the payer validated and processed
the request at their systems.

**Table 5.1**

|  | as “JWEPayloadResponse” or “ProtocolResponse”<br>5. Encrypt the payload (As per RFC7516)<br>using the public key of the recipient entity.<br>Encrypted payload will be prepared only<br>when the payer validated and processed<br>the request at their systems.<br>6. ProtocolResponse.<br>ProtolcolReponse will be prepared as<br>response only when the payer could not<br>validate and process the request due to<br>payload is invalid or not able to decrypt or<br>any protocol errors. |
|---|---|


**Table 5.2**

| Use case 12 | Respond to search request |
|---|---|
| APIs to be called | /v1/search/on_submit |
| API to be Implemented | /v1/search/submit |
| Use case description | To respond for search requests based on the task<br>request. It provides the ClaimResponse(s) to the<br>given input criteria. |
| Entity to Implement the API called | Provider |
| Validations | 1. The payload should be validated against<br>the profiles published by NRCES.<br>2. Api caller ID and Correlation ID should be<br>different.<br>3. Correlation ID should be the API caller ID<br>of the request that you are responding to.<br>4. Receiver code should be the same as<br>Sender ID of the request that Payer system<br>is responding to. |
| API logic | This API should be called by payers by passing the<br>appropriate payload. It should be prepared in two<br>types based on the processing of the request.<br>Prepare the response keeping the “type” param of<br>as “JWEPayloadResponse” or “ProtocolResponse”<br>7. Encrypt the payload (As per RFC7516)<br>using the public key of the recipient entity.<br>Encrypted payload will be prepared only<br>when the payer validated and processed<br>the request at their systems. |


---

## Page 6

8. ProtocolResponse.
ProtolcolReponse will be prepared as
response only when the payer could not
validate and process the request due to
payload is invalid or not able to decrypt or
any protocol errors.
Use case 13 Send Payment Notice
APIs to be called /v1/paymentnotice/request
API to be Implemented /v1/paymentnotice/on_request
Use case description Send Payment notification/reconciliation objects
to Providers via the HCX gateway
Entity to Implement the API called Payer
Protocol Status request.initiate
Validations Payload should be validated against the profiles
published by NRCES.
API logic API should be called by payer systems. Request will
be prepared as per the specifications.
Use case 14 Respond to the Task request submitted
APIs to be called /v1/task/on_submit
API to be Implemented /v1/task/submit
Use case description To return the response for task requests such as
reprocess/cancel.
Entity to Implement the API called Provider
Protocol Status response.complete
Validations 1. The payload should be validated against
the profiles published by NRCES.
2. Api caller ID and Correlation ID should be
different.
3. Correlation ID should be the API caller ID
of the request that you are responding to.
4. Receiver code should be the same as
Sender ID of the request that Payer system
is responding to.
API logic This API should be called by payers by passing the
appropriate payload. It should be prepared in two
types based on the processing of the request.
Prepare the response keeping the “type” param of
as “JWEPayloadResponse” or “ProtocolResponse”
9. Encrypt the payload (As per RFC7516)
using the public key of the recipient entity.

**Table 6.1**

|  | 8. ProtocolResponse.<br>ProtolcolReponse will be prepared as<br>response only when the payer could not<br>validate and process the request due to<br>payload is invalid or not able to decrypt or<br>any protocol errors. |
|---|---|


**Table 6.2**

| Use case 13 | Send Payment Notice |
|---|---|
| APIs to be called | /v1/paymentnotice/request |
| API to be Implemented | /v1/paymentnotice/on_request |
| Use case description | Send Payment notification/reconciliation objects<br>to Providers via the HCX gateway |
| Entity to Implement the API called | Payer |
| Protocol Status | request.initiate |
| Validations | Payload should be validated against the profiles<br>published by NRCES. |
| API logic | API should be called by payer systems. Request will<br>be prepared as per the specifications. |


**Table 6.3**

| Use case 14 | Respond to the Task request submitted |
|---|---|
| APIs to be called | /v1/task/on_submit |
| API to be Implemented | /v1/task/submit |
| Use case description | To return the response for task requests such as<br>reprocess/cancel. |
| Entity to Implement the API called | Provider |
| Protocol Status | response.complete |
| Validations | 1. The payload should be validated against<br>the profiles published by NRCES.<br>2. Api caller ID and Correlation ID should be<br>different.<br>3. Correlation ID should be the API caller ID<br>of the request that you are responding to.<br>4. Receiver code should be the same as<br>Sender ID of the request that Payer system<br>is responding to. |
| API logic | This API should be called by payers by passing the<br>appropriate payload. It should be prepared in two<br>types based on the processing of the request.<br>Prepare the response keeping the “type” param of<br>as “JWEPayloadResponse” or “ProtocolResponse”<br>9. Encrypt the payload (As per RFC7516)<br>using the public key of the recipient entity. |


---

## Page 7

Encrypted payload will be prepared only
when the payer validated and processed
the request at their systems.
10. ProtocolResponse.
ProtolcolReponse will be prepared as
response only when the payer could not
validate and process the request due to
payload is invalid or not able to decrypt or
any protocol errors.
Use case 15 Get status
APIs to be called /v1/status
API to be Implemented /v1/on_status
Use case description Retrieve the status of any request that has been
triggered to NHCX
Entity to Implement the API called NHCX
Protocol status Request.initiated
Request Payload Encrypted payload of request for which the status
is seeking for.
Validations Payload should be validated against the profiles
published by NRCES.
Callback API logic Callback API should be implemented by provider
systems. It should accept the payload as
ProtocolHeader contains all the attributes.

**Table 7.1**

|  | Encrypted payload will be prepared only<br>when the payer validated and processed<br>the request at their systems.<br>10. ProtocolResponse.<br>ProtolcolReponse will be prepared as<br>response only when the payer could not<br>validate and process the request due to<br>payload is invalid or not able to decrypt or<br>any protocol errors. |
|---|---|
|  |  |


**Table 7.2**

| Use case 15 | Get status |
|---|---|
| APIs to be called | /v1/status |
| API to be Implemented | /v1/on_status |
| Use case description | Retrieve the status of any request that has been<br>triggered to NHCX |
| Entity to Implement the API called | NHCX |
| Protocol status | Request.initiated |
| Request Payload | Encrypted payload of request for which the status<br>is seeking for. |
| Validations | Payload should be validated against the profiles<br>published by NRCES. |
| Callback API logic | Callback API should be implemented by provider<br>systems. It should accept the payload as<br>ProtocolHeader contains all the attributes. |
