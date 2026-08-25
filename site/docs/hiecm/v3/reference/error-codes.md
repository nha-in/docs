---
title: Error codes
sidebar_label: Error codes
sidebar_position: 3
description: Every error code the specifications carry, with its message and what to do.
verification: unverified
source: the published OpenAPI specifications
---

# Error codes

Generated from the specifications. A code is on this page because a specification records it.

## M1 ABHA identity

Saved example responses in NHA's M1 ABHA Postman collection. NHA's M1 document carries its code reference as screenshots with no text.

| Code | Message | What to do |
| --- | --- | --- |
| `ABDM-1013` | Invalid ABHA Number | Fix request |
| `ABDM-1094` | Access to this feature is restricted. Please contact NHA to enable it. | Fix auth |
| `ABDM-1094` | Invalid Benefit Name | Fix auth |
| `ABDM-1138` | The benefit record has already been de-linked | Treat as success |
| `ABDM-1140` | The benefit record has already been linked | Treat as success |
| `ABDM-1204` | A UIDAI failure passed through. The UIDAI code and text sit inside the message string | Fix request |
| `ABDM-1224` | Login via Biometric is not allowed. | Fix auth |
| `ABDM-9999` | Recorded as `ABDM-9999: ` with an `ABDM-1094` message stuck to the front of the text | Fix auth |

## M1 ABHA identity, untagged

The same collection, and the only source that recorded HTTP statuses.

| Code | HTTP | Message | What to do |
| --- | --- | --- | --- |
| `900901` | 401 | Invalid Credentials, invalid JWT token. From the API gateway in front of the ABHA service, before your request reaches the business logic | Fix auth |
| `900900` | 500 | Unclassified authentication failure. The one saved example had a bad path and a bad token together, so read it as a client error first | Fix auth |
| `404` | 404 | No matching resource found for given API Request`. A wrong path, not a missing record | Fix request |

## M1 ABHA identity, uidai

Codes from the Unique Identification Authority of India, passed through inside the message of ABDM-1204. NHA passes through more than these, so parse the message.

| Code | Message | What to do |
| --- | --- | --- |
| `300` | Biometric mismatch |  |
| `561` | Request expired |  |
| `563` | Duplicate request |  |
| `810` | Missing biometric data |  |

## M2 Linking and sharing

NHA's published M2 list, which carries code and message only. The action is this catalogue's reading of the message text.

| Code | Message | What to do |
| --- | --- | --- |
| `ABDM-1000` | Unable to connect the database | Retry |
| `ABDM-1001` | No data found | Fix request |
| `ABDM-1004` | SMS Gateway is unavailable | Retry |
| `ABDM-1006` | Invalid HIType, it must be in Prescription,DiagnosticReport,OPConsultation,DischargeSummary,ImmunizationRecord,HealthDocumentRecord,WellnessRecord,Invoice | Fix request |
| `ABDM-1006` | Bad Request, invalid request Body | Fix request |
| `ABDM-1006` | Invalid combinations of scopes | Fix request |
| `ABDM-1006` | Invalid count, must be 2 digit and ranges between 1 to 20 | Fix request |
| `ABDM-1007` | Connection failed due to timeout | Retry |
| `ABDM-1008` | SMS service currently disabled | Retry |
| `ABDM-1010` | Validation failed | Fix request |
| `ABDM-1011` | Gateway database unavailable | Retry |
| `ABDM-1012` | No records found against the ABHA Address | Fix request |
| `ABDM-1013` | Invalid ABHA Number | Fix request |
| `ABDM-1015` | Invalid Response | Fix request |
| `ABDM-1016` | Invalid TimeStamp | Fix request |
| `ABDM-1017` | Invalid TransactionId | Fix request |
| `ABDM-1018` | Share Profile database unavailable | Retry |
| `ABDM-1019` | Dependent Service Unavailable | Retry |
| `ABDM-1020` | Unknown database | Retry |
| `ABDM-1022` | Too many requests | Back off |
| `ABDM-1023` | Invalid User | Fix request |
| `ABDM-1024` | Dependent service unavailable | Retry |
| `ABDM-1025` | Invalid ServiceId | Fix request |
| `ABDM-1026` | Invalid Link Token | Fix auth |
| `ABDM-1027` | You are blocked. Please try again after 24 hours. | Blocked, no retry |
| `ABDM-1028` | HIP is unavailable | Chase the [HIP](/docs/hiecm/v3/getting-started/glossary#hip) |
| `ABDM-1029` | Redis server is unavailable | Retry |
| `ABDM-1030` | Invalid request ID | Fix request |
| `ABDM-1030` | Request id not found | Fix request |
| `ABDM-1031` | Invalid request | Fix request |
| `ABDM-1032` | Invalid header | Fix request |
| `ABDM-1033` | HIU is unavailable | Chase the [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) |
| `ABDM-1034` | Notification service unavailable | Retry |
| `ABDM-1035` | Invalid HIP ID | Fix request |
| `ABDM-1036` | Data does not matched | Fix request |
| `ABDM-1037` | Counter and Care context count mismatch | Fix request |
| `ABDM-1038` | ABHA address and Link token mismatch | Fix auth |
| `ABDM-1040` | Invalid HIU ID | Fix request |
| `ABDM-1041` | Invalid Acknowledgement | Fix request |
| `ABDM-1042` | Provider Mandatory | Fix request |
| `ABDM-1043` | ABHA Address does not match with KYC details. | Fix request |
| `ABDM-1044` | Broadcast Failed | Retry |
| `ABDM-1045` | Database Access is restricted | Retry |
| `ABDM-1046` | Invalid Purpose | New consent |
| `ABDM-1047` | Purpose does not exist | New consent |
| `ABDM-1048` | Timeout | Retry |
| `ABDM-1049` | Invalid Profile Share Intent Keys | Ask support |
| `ABDM-1050` | Invalid Profile Share Metadata Keys | Ask support |
| `ABDM-1051` | Invalid ABHA Number or ABHA Address | Fix request |
| `ABDM-1052` | Invalid TransactionId or response's requestId | Fix request |
| `ABDM-1055` | Invalid HIP Id or PHR Id | Fix request |
| `ABDM-1056` | This care contexts has been already linked | Treat as success |
| `ABDM-1056` | Invalid Link Reference Number | Fix request |
| `ABDM-1057` | Invalid Care Contexts | Fix request |
| `ABDM-1059` | Invalid Care Contexts count | Fix request |
| `ABDM-1060` | Invalid Patient Reference Number | Fix request |
| `ABDM-1061` | Invalid Patient Display | Fix request |
| `ABDM-1061` | Consent artefact expired | New consent |
| `ABDM-1062` | ABHA number mismatch with Link token | Fix auth |
| `ABDM-1062` | Consent Not granted | New consent |
| `ABDM-1063` | HIP Id mismatch with Link token | Fix auth |
| `ABDM-1063` | Date Range given is invalid | New consent |
| `ABDM-1064` | request with this request id already exists | New request id |
| `ABDM-1064` | Request body was missing | Fix request |
| `ABDM-1065` | Invalid X Auth token | Fix auth |
| `ABDM-1066` | Invalid JWT token | Fix auth |
| `ABDM-1067` | Request body not required | Fix request |
| `ABDM-1084` | ABHA address mismatch with X Auth token | Fix auth |
| `ABDM-1085` | ABHA number mismatch with X Auth token | Fix auth |
| `ABDM-1086` | Patient profile mismatch with X Auth token | Fix auth |
| `ABDM-1087` | Duplicate patient share request | New request id |
| `ABDM-1090` | Duplicate HIP link request | New request id |
| `ABDM-1091` | Duplicate Get links request | New request id |
| `ABDM-1092` | Duplicate Link token request | New request id |
| `ABDM-1093` | Duplicate Bridge request | New request id |
| `ABDM-1094` | Duplicate bridge patch request | New request id |
| `ABDM-1095` | Duplicate Bridge service request | New request id |
| `ABDM-1102` | Profile information cannot be null | Ask support |
| `ABDM-1103` | Duplicate Discovery request | New request id |
| `ABDM-1104` | Duplicate Init request | New request id |
| `ABDM-1105` | Duplicate Confirm request | New request id |
| `ABDM-1106` | Duplicate On discovery request | New request id |
| `ABDM-1107` | Duplicate On init request | New request id |
| `ABDM-1108` | Duplicate On confirm request | New request id |
| `ABDM-1108` | Notification DB service unavailable | Retry |
| `ABDM-1109` | Invalid On discovery response | Fix request |
| `ABDM-1109` | ABHA DB service unavailable | Retry |
| `ABDM-1110` | Invalid On init response | Fix request |
| `ABDM-1111` | Invalid On confirm response | Fix request |
| `ABDM-1112` | Invalid or already expired consent artefact id | New consent |
| `ABDM-1113` | Duplicate health information provider data flow response | New request id |
| `ABDM-1149` | Intent type is not supported at HIP end | Fix request |
| `ABDM-1150` | Bridge API version cannot be null | Ask support |
| `ABDM-1170` | Invalid ABHA address | Fix request |
| `ABDM-1201` | IDP Gateway is unavailable | Retry |
| `ABDM-1401` | HIP is not available | Chase the HIP |
| `ABDM-1402` | Acknowledgement is not received from HIP | Chase the HIP |
| `ABDM-1407` | The ABHA Number associated with this ABHA Address is currently deactivated. Please reactivate it. | Fix request |
| `ABDM-2401` | The X Auth token is invalid. | Fix auth |
| `ABDM-2402` | Invalid Timestamp | Fix request |
| `ABDM-2403` | Invalid X-CM-ID | Fix request |
| `ABDM-2404` | Invalid Request Id | Fix request |
| `ABDM-2406` | Invalid API sequence flow, please follow logical flow | Fix request |
| `ABDM-2406` | The status is invalid. Please follow the logical status flow or transition. | Fix request |
| `ABDM-2429` | Too many requests found | Back off |
| `ABDM-2500` | Authorization header is missing | Fix auth |
| `ABDM-2500` | No mapping found for | Fix request |
| `ABDM-2501` | Payment status should be : `SUCCESS,CANCELED,PENDING,FAIL,REFUND_INITIATED,REFUND_SUCCESS | Ask support |
| `ABDM-9001` | No open order against ABHA. Please ensure a minimum of one open order | Ask support |
| `ABDM-9002` | No registration found at `<<hospital name>>`. Contact counter support | Ask support |
| `ABDM-9003` | Hospital services temporarily unavailable. Please try again after some time. | Retry |
| `ABDM-9004` | Services disrupted, please try again. | Retry |
| `ABDM-9005` | Bank server not responding. Please try again later | Ask support |
| `ABDM-9006` | Service details mismatch. Please ensure original service ID from HMIS | Ask support |
| `ABDM-9007` | The Scan and Pay functionality is not enabled at this facility. Kindly contact the hospital administration. | Ask support |
| `ABDM-9999` | HIP is unable to generate a token at this time. Please try again later. | Chase the HIP |
| `ABDM-9999` | HIP is unable to process at this time. Please try again later. | Chase the HIP |
| `ABDM-9999` | Unknown exception | Retry |
| `ABDM-9999` | Cannot process the request at the moment, please try later. | Retry |
| `ABDM-9999` | User not found | Retry |

## M4 HPR and HFR

NHA's M4 document, which states the ranges and gives examples. The full list is in NHA's sandbox documentation for the healthcare professional registry.

| Range | What it covers | Examples |
| --- | --- | --- |
| `HIS-400 to HIS-504` | The HTTP level failures | HIS-401 user is not authorized, HIS-403 forbidden, HIS-503 requested service is unavailable |
| `HIS-1xxx` | Validation and facility errors, 103 of them | HIS-1002 the field value should not be empty, HIS-1124 bridge not linked, HIS-1128 HIP name already exists, HIS-1132 duplicate facility detected |
| `HIS-2xxx` | Aadhaar, OTP and session errors | HIS-2022 invalid OTP, HIS-2031 request expired, HIS-2045 session expired |
| `HIS-3xxx` | Aadhaar data and HPID state | HIS-3001 resident data not available, HIS-3021 HPRID already exists, HIS-3031 invalid token |
| `HIS-4xxx` | Facility record errors | HIS-4003 facility already exists, HIS-4032 invalid state code, HIS-4055 invalid image format |
| `HIS-5xxx` | Registration workflow errors | HIS-5005 already registered, HIS-5011 token expired |

135 codes are recorded. A code you meet that is not here is one the specifications do not carry yet.

