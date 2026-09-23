# API Response Handling to avoid Failures

*Source: `documents/API Response Handling to avoid Failures.pdf` — extracted full text*

**Pages: 2**


---

## Page 1

Error handling at the integrator’s end:
Acceptance scenario:
Whenever recipient receives request from sender(through NHCX) the return type should be as
below with http status as 202 Accepted.
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
Error scenario:
Whenever the recipient is rejecting the payload sent by the sender for any reason or
The above format is not followed and system treats it like an error the error scenario
occurs and system tries to send the same request for 5 times before finally terminating
the entire request as a whole.
The request pointed with the correlation id will be deleted from the NHCX system after 5
attempts.
The receiver should follow the acceptance scenario properly or send proper response
for rejections to avoid such hiccups.
If the receiver fails to handle the error or any server side issue happens, the request will
be sent back to the sender.
So,every integrator should implement the v1/error API at their end where they will get
the reject details and respond back.

**Table 1.1**

| { |  |  |
|---|---|---|
| "timestamp":" | DD/MM/YYYY hh:mm:ss:sss | ", |
| "api_call_id":"UUID", |  |  |
| "correlation_id":"UUID", |  |  |
| "result":{ |  |  |
| "sender_code":"PYRXX@hcx", |  |  |
| "recipient_code":"INXXXXX@hcx", |  |  |
| "entity_type":"coverageeligibility/preauth/claim/task/payment/insuranceplan", |  |  |
| "protocol_status":"request.queued/request.dispatched/request.error" |  |  |
| }, |  |  |
| "error":{ |  |  |
| "code":"", |  |  |
| "message":"" |  |  |
| } |  |  |
| } |  |  |
|  |  |  |
| Error scenario: |  |  |
|  |  |  |
| Whenever the recipient is rejecting the payload sent by the sender for any reason or |  |  |
| The above format is not followed and system treats it like an error the error scenario |  |  |
| occurs and system tries to send the same request for 5 times before finally terminating |  |  |
| the entire request as a whole. |  |  |
| The request pointed with the correlation id will be deleted from the NHCX system after 5 |  |  |
| attempts. |  |  |
|  |  |  |
| The receiver should follow the acceptance scenario properly or send proper response |  |  |
| for rejections to avoid such hiccups. |  |  |
|  |  |  |
| If the receiver fails to handle the error or any server side issue happens, the request will |  |  |
| be sent back to the sender. |  |  |
| So,every integrator should implement the v1/error API at their end where they will get |  |  |
| the reject details and respond back. |  |  |
|  |  |  |


---

## Page 2

Protocol Response in case of error scenarios to be sent back by the receiver in case of
not acceptance after evaluation:
{
"type":"ProtocolResponse",
"x-hcx-sender_code": "",
"x-hcx-recipient_code": "",
"x-hcx-api_call_id": "UUID",
"x-hcx-correlation_id": "UUID",
"x-hcx-workflow_id": "UUID",
"x-hcx-timestamp": "",
"x-hcx-debug_flag": "Error",
"x-hcx-status": "response.error",
"x-hcx-redirect_to": "",
"x-hcx-error_details": {
"code": "String",
"message": "String",
"trace": "String"
},
"x-hcx-debug_details": {
"code": "String",
"message": "String",
"trace": "String"
},
"x-hcx-domain-header": {
"use_case_name": "String",
"amt_processed": "String"
},
"x-hcx-entity-type": "coverageeligibility | payment | insuranceplan | task | claim |
preauth",
"x-hcx-ben-abha-id":"abha number"
}

**Table 2.1**

| Protocol Response in case of error scenarios to be sent back by the receiver in case of |
|---|
| not acceptance after evaluation: |
| { |
| "type":"ProtocolResponse", |
| "x-hcx-sender_code": "", |
| "x-hcx-recipient_code": "", |
| "x-hcx-api_call_id": "UUID", |
| "x-hcx-correlation_id": "UUID", |
| "x-hcx-workflow_id": "UUID", |
| "x-hcx-timestamp": "", |
| "x-hcx-debug_flag": "Error", |
| "x-hcx-status": "response.error", |
| "x-hcx-redirect_to": "", |
| "x-hcx-error_details": { |
| "code": "String", |
| "message": "String", |
| "trace": "String" |
| }, |
| "x-hcx-debug_details": { |
| "code": "String", |
| "message": "String", |
| "trace": "String" |
| }, |
| "x-hcx-domain-header": { |
| "use_case_name": "String", |
| "amt_processed": "String" |
| }, |
| "x-hcx-entity-type": "coverageeligibility \| payment \| insuranceplan \| task \| claim \| |
| preauth", |
| "x-hcx-ben-abha-id":"abha number" |
| } |
|  |
|  |
|  |
|  |
