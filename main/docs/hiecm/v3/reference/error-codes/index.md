# Error codes

Seeing a symptom rather than a code? Start at [Troubleshooting](/docs/main/docs/hiecm/v3/troubleshooting/).

A code is on this page because a response example in a specification returns it.

## M1 Identity

| Code        | HTTP | Message                                                                                                                         | Returned by                                                        |
| ----------- | ---- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `404`       | 404  | Runtime Error                                                                                                                   | `m1_post_v3_profile_login_verify_find_abha_face`                   |
| `900900`    | 500  | Unclassified Authentication Failure                                                                                             | `m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_091285` |
| `900901`    | 401  | Invalid Credentials                                                                                                             | `m1_post_v3_enrollment_request_otp_aadhaar_otp`                    |
| `900902`    | 401  | Missing Credentials                                                                                                             | `m1_post_v3_profile_benefit_search_xmluid`                         |
| `ABDM-1017` | 401  | Invalid Transaction Id                                                                                                          | `m1_get_v3_enrollment_enrol_suggestion_create_abha_aadhaar_otp`    |
| `ABDM-1021` | 401  | Lack of required priviledges                                                                                                    | `m1_post_v3_enrollment_enrol_byaadhaar_child_child_abha`           |
| `ABDM-1094` | 401  | X-token expired                                                                                                                 | `m1_post_v3_enrollment_enrol_byaadhaar_child_child_abha`           |
| `ABDM-1114` | 404  | User not found                                                                                                                  | `m1_patch_v3_profile_account_child_child_abha`                     |
| `ABDM-1124` | 422  | The mobile number provided by you is already linked to 6 ABHA Numbers. Please provide a different Mobile Number.                | `m1_post_v3_enrollment_enrol_byaadhaar_demo_auth_create_ab_81107d` |
| `ABDM-1138` | 400  | The benefit record has already been de-linked                                                                                   | `m1_post_v3_profile_benefit_linkanddelink_x_token`                 |
| `ABDM-1140` | 400  | The benefit record has already been linked                                                                                      | `m1_post_v3_profile_benefit_linkanddelink_x_token`                 |
| `ABDM-1157` | 422  | Child ABHA’s account limit has been exceeded for the requested Abha ID number ‘\<ABHA\_NUMBER>                                  | `m1_post_v3_enrollment_enrol_byaadhaar_child_child_abha`           |
| `ABDM-1160` | 422  | Non KYC CHILD ABHA is allowed to update their profile only once                                                                 | `m1_patch_v3_profile_account_child_child_abha`                     |
| `ABDM-1204` | 422  | UIDAI Error code : 400 : Invalid Aadhaar OTP value.                                                                             | `m1_post_v3_enrollment_enrol_byaadhaar_otp`                        |
| `ABDM-1207` | 422  | The information you provided does not match the details on record with Aadhaar. Please verify and provide accurate information. | `m1_post_v3_enrollment_enrol_byaadhaar_demo_auth_create_ab_81107d` |
| `ABDM-1211` | 400  | User not found.                                                                                                                 | `m1_post_v3_phr_web_login_abha_search_abha_address_login_m_27a20f` |
| `ABDM-1224` | 401  | Login via Biometric is not allowed.                                                                                             | `m1_post_v3_profile_login_request_otp_find_abha_face`              |

## M2 Health Information Provider

| Code        | HTTP | Message                                                                                                                                                    | Returned by |
| ----------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `ABDM-1000` |      | Unable to connect the database                                                                                                                             |             |
| `ABDM-1001` |      | No data found                                                                                                                                              |             |
| `ABDM-1004` |      | SMS Gateway is unavailable                                                                                                                                 |             |
| `ABDM-1006` |      | Bad Request, invalid request Body                                                                                                                          |             |
| `ABDM-1007` |      | Connection failed due to timeout                                                                                                                           |             |
| `ABDM-1008` |      | SMS service currently disabled                                                                                                                             |             |
| `ABDM-1010` |      | Validation failed                                                                                                                                          |             |
| `ABDM-1011` |      | Gateway database unavailable                                                                                                                               |             |
| `ABDM-1012` |      | No records found against the ABHA Address                                                                                                                  |             |
| `ABDM-1013` |      | Invalid ABHA Number                                                                                                                                        |             |
| `ABDM-1015` |      | Invalid Response                                                                                                                                           |             |
| `ABDM-1016` |      | Invalid TimeStamp                                                                                                                                          |             |
| `ABDM-1017` |      | Invalid TransactionId                                                                                                                                      |             |
| `ABDM-1018` |      | Share Profile database unavailable                                                                                                                         |             |
| `ABDM-1019` |      | Dependent Service Unavailable                                                                                                                              |             |
| `ABDM-1020` |      | Unknown database                                                                                                                                           |             |
| `ABDM-1022` |      | Too many requests                                                                                                                                          |             |
| `ABDM-1023` |      | Invalid User                                                                                                                                               |             |
| `ABDM-1024` |      | Dependent service unavailable                                                                                                                              |             |
| `ABDM-1025` |      | Invalid ServiceId                                                                                                                                          |             |
| `ABDM-1026` |      | Invalid Link Token                                                                                                                                         |             |
| `ABDM-1027` |      | You are blocked. Please try again after 24 hours.                                                                                                          |             |
| `ABDM-1028` |      | HIP is unavailable                                                                                                                                         |             |
| `ABDM-1029` |      | Redis server is unavailable                                                                                                                                |             |
| `ABDM-1030` |      | Invalid request ID                                                                                                                                         |             |
| `ABDM-1031` |      | Invalid request                                                                                                                                            |             |
| `ABDM-1032` |      | Invalid header                                                                                                                                             |             |
| `ABDM-1033` |      | HIU is unavailable                                                                                                                                         |             |
| `ABDM-1034` |      | Notification service unavailable                                                                                                                           |             |
| `ABDM-1035` |      | Invalid HIP ID                                                                                                                                             |             |
| `ABDM-1036` |      | Data does not matched                                                                                                                                      |             |
| `ABDM-1037` |      | Counter and Care context count mismatch                                                                                                                    |             |
| `ABDM-1038` |      | ABHA address and Link token mismatch                                                                                                                       |             |
| `ABDM-1040` |      | Invalid HIU ID                                                                                                                                             |             |
| `ABDM-1041` |      | Invalid Acknowledgement                                                                                                                                    |             |
| `ABDM-1042` |      | Provider Mandatory                                                                                                                                         |             |
| `ABDM-1043` |      | ABHA Address does not match with KYC details.                                                                                                              |             |
| `ABDM-1044` |      | Broadcast Failed                                                                                                                                           |             |
| `ABDM-1045` |      | Database Access is restricted                                                                                                                              |             |
| `ABDM-1046` |      | Invalid Purpose                                                                                                                                            |             |
| `ABDM-1047` |      | Purpose does not exist                                                                                                                                     |             |
| `ABDM-1048` |      | Timeout                                                                                                                                                    |             |
| `ABDM-1049` |      | Invalid Profile Share Intent Keys                                                                                                                          |             |
| `ABDM-1050` |      | Invalid Profile Share Metadata Keys                                                                                                                        |             |
| `ABDM-1051` |      | Invalid ABHA Number or ABHA Address                                                                                                                        |             |
| `ABDM-1052` |      | Invalid TransactionId or response's requestId                                                                                                              |             |
| `ABDM-1401` |      | HIP is not available                                                                                                                                       |             |
| `ABDM-1061` |      | Consent artefact expired                                                                                                                                   |             |
| `ABDM-1062` |      | Consent Not granted                                                                                                                                        |             |
| `ABDM-1063` |      | Date Range given is invalid                                                                                                                                |             |
| `ABDM-1064` |      | request with this request id already exists                                                                                                                |             |
| `ABDM-1109` |      | ABHA DB service unavailable                                                                                                                                |             |
| `ABDM-1108` |      | Notification DB service unavailable                                                                                                                        |             |
| `ABDM-1201` |      | IDP Gateway is unavailable                                                                                                                                 |             |
| `ABDM-9999` |      | Unknown exception                                                                                                                                          |             |
| `ABDM-1006` |      | Invalid combinations of scopes                                                                                                                             |             |
| `ABDM-1056` |      | This care contexts has been already linked                                                                                                                 |             |
| `ABDM-1055` |      | Invalid HIP Id or PHR Id                                                                                                                                   |             |
| `ABDM-1056` |      | Invalid Link Reference Number                                                                                                                              |             |
| `ABDM-1057` |      | Invalid Care Contexts                                                                                                                                      |             |
| `ABDM-1059` |      | Invalid Care Contexts count                                                                                                                                |             |
| `ABDM-1060` |      | Invalid Patient Reference Number                                                                                                                           |             |
| `ABDM-1061` |      | Invalid Patient Display                                                                                                                                    |             |
| `ABDM-1062` |      | ABHA number mismatch with Link token                                                                                                                       |             |
| `ABDM-1063` |      | HIP Id mismatch with Link token                                                                                                                            |             |
| `ABDM-1064` |      | Request body was missing                                                                                                                                   |             |
| `ABDM-1065` |      | Invalid X Auth token                                                                                                                                       |             |
| `ABDM-1066` |      | Invalid JWT token                                                                                                                                          |             |
| `ABDM-1067` |      | Request body not required                                                                                                                                  |             |
| `ABDM-1170` |      | Invalid ABHA address                                                                                                                                       |             |
| `ABDM-1084` |      | ABHA address mismatch with X Auth token                                                                                                                    |             |
| `ABDM-1085` |      | ABHA number mismatch with X Auth token                                                                                                                     |             |
| `ABDM-1086` |      | Patient profile mismatch with X Auth token                                                                                                                 |             |
| `ABDM-1087` |      | Duplicate patient share request                                                                                                                            |             |
| `ABDM-1090` |      | Duplicate HIP link request                                                                                                                                 |             |
| `ABDM-1091` |      | Duplicate Get links request                                                                                                                                |             |
| `ABDM-1092` |      | Duplicate Link token request                                                                                                                               |             |
| `ABDM-1093` |      | Duplicate Bridge request                                                                                                                                   |             |
| `ABDM-1094` |      | Duplicate bridge patch request                                                                                                                             |             |
| `ABDM-1095` |      | Duplicate Bridge service request                                                                                                                           |             |
| `ABDM-1102` |      | Profile information cannot be null                                                                                                                         |             |
| `ABDM-1103` |      | Duplicate Discovery request                                                                                                                                |             |
| `ABDM-1104` |      | Duplicate Init request                                                                                                                                     |             |
| `ABDM-1105` |      | Duplicate Confirm request                                                                                                                                  |             |
| `ABDM-1106` |      | Duplicate On discovery request                                                                                                                             |             |
| `ABDM-1107` |      | Duplicate On init request                                                                                                                                  |             |
| `ABDM-1108` |      | Duplicate On confirm request                                                                                                                               |             |
| `ABDM-1109` |      | Invalid On discovery response                                                                                                                              |             |
| `ABDM-1110` |      | Invalid On init response                                                                                                                                   |             |
| `ABDM-1111` |      | Invalid On confirm response                                                                                                                                |             |
| `ABDM-1112` |      | Invalid or already expired consent artefact id                                                                                                             |             |
| `ABDM-1113` |      | Duplicate health information provider data flow response                                                                                                   |             |
| `ABDM-1149` |      | Intent type is not supported at HIP end                                                                                                                    |             |
| `ABDM-1150` |      | Bridge API version cannot be null                                                                                                                          |             |
| `ABDM-1402` |      | Acknowledgement is not received from HIP                                                                                                                   |             |
| `ABDM-9999` |      | HIP is unable to generate a token at this time. Please try again later.                                                                                    |             |
| `ABDM-9999` |      | HIP is unable to process at this time. Please try again later.                                                                                             |             |
| `ABDM-1030` |      | Request id not found                                                                                                                                       |             |
| `ABDM-2500` |      | No mapping found for                                                                                                                                       |             |
| `ABDM-2401` |      | The X Auth token is invalid.                                                                                                                               |             |
| `ABDM-2402` |      | Invalid Timestamp                                                                                                                                          |             |
| `ABDM-2404` |      | Invalid Request Id                                                                                                                                         |             |
| `ABDM-2429` |      | Too many requests found                                                                                                                                    |             |
| `ABDM-2501` |      | Payment status should be : SUCCESS,CANCELED,PENDING,FAIL,REFUND\_INITIATED,REFUND\_SUCCESS                                                                 |             |
| `ABDM-2500` |      | Authorization header is missing                                                                                                                            |             |
| `ABDM-2403` |      | Invalid X-CM-ID                                                                                                                                            |             |
| `ABDM-2406` |      | Invalid API sequence flow, please follow logical flow                                                                                                      |             |
| `ABDM-2406` |      | The status is invalid. Please follow the logical status flow or transition.                                                                                |             |
| `ABDM-9999` |      | User not found                                                                                                                                             |             |
| `ABDM-9999` |      | Cannot process the request at the moment, please try later.                                                                                                |             |
| `ABDM-9001` |      | No open order against ABHA. Please ensure a minimum of one open order                                                                                      |             |
| `ABDM-9002` |      | No registration found at <>. Contact counter support                                                                                                       |             |
| `ABDM-9003` |      | Hospital services temporarily unavailable. Please try again after some time.                                                                               |             |
| `ABDM-9004` |      | Services disrupted, please try again.                                                                                                                      |             |
| `ABDM-9005` |      | Bank server not responding. Please try again later                                                                                                         |             |
| `ABDM-9006` |      | Service details mismatch. Please ensure original service ID from HMIS                                                                                      |             |
| `ABDM-9007` |      | The Scan and Pay functionality is not enabled at this facility. Kindly contact the hospital administration.                                                |             |
| `ABDM-1006` |      | Invalid count, must be 2 digit and ranges between 1 to 20                                                                                                  |             |
| `ABDM-1407` |      | The ABHA Number associated with this ABHA Address is currently deactivated. Please reactivate it.                                                          |             |
| `ABDM-1006` |      | Invalid HIType, it must be in Prescription,DiagnosticReport,OPConsultation,DischargeSummary,ImmunizationRecord,HealthDocumentRecord,WellnessRecord,Invoice |             |

## P1 Registration and login

| Code        | HTTP | Message                        | Returned by                                 |
| ----------- | ---- | ------------------------------ | ------------------------------------------- |
| `900902`    | 401  | Missing Credentials            | `p1_get_v3_phr_app_enrollment_isexists`     |
| `ABDM-1107` | 400  | Invalid combinations of scopes | `p1_post_v3_phr_app_login_verify`           |
| `ABDM-1211` | 400  | User not found.                | `p1_post_v3_phr_app_login_search`           |
| `ABDM-9999` | 400  | Invalid LoginId                | `p1_post_v3_phr_app_enrollment_request_otp` |

## P2 Consents Management

| Code        | HTTP | Message             | Returned by                                    |
| ----------- | ---- | ------------------- | ---------------------------------------------- |
| `900902`    | 401  | Missing Credentials | `p2_get_v3_phr_app_login_profile`              |
| `ABDM-9999` | 400  | Invalid LoginId     | `p2_post_v3_phr_app_login_profile_request_otp` |

143 codes are recorded. A code you meet that is not here is one the specifications do not carry yet.
