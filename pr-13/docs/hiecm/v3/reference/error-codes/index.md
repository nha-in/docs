# Error codes

Seeing a symptom rather than a code? Start at [Troubleshooting](/docs/pr-13/docs/hiecm/v3/troubleshooting/).

Generated from the specifications. A code is on this page because a specification records it.

## Gateway session

Code, message and error name are as published. The heading each code sits under reads the message text by a documented rule, and says Unclassified where the rule could not classify one.

### Fix request

| Code        | Message                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| `ABDM-1068` | Both Patient and Error details cannot be null                                                            |
| `ABDM-1069` | Invalid Authentication type                                                                              |
| `ABDM-1076` | One or more invalid HIP is exist in the request                                                          |
| `ABDM-1089` | Payment information cannot be null                                                                       |
| `ABDM-1098` | Duplicate Gateway Government Program request                                                             |
| `ABDM-1125` | ABHA number and ABHA address cannot be null                                                              |
| `ABDM-1128` | T-Token Expired                                                                                          |
| `ABDM-1129` | Invalid T-Token                                                                                          |
| `ABDM-1130` | Invalid X-Token                                                                                          |
| `ABDM-1131` | X-Token Expired                                                                                          |
| `ABDM-1210` | Login via Email Address OTP is not allowed                                                               |
| `ABDM-1212` | Email address not found.                                                                                 |
| `ABDM-1215` | Login via Mobile Number OTP is not allowed                                                               |
| `ABDM-1217` | Login is not allowed                                                                                     |
| `ABDM-1301` | The mobile number you have entered has already been verified. Please provide an alternate mobile number. |
| `ABDM-1302` | The emailId you have entered has already been verified. Please provide an alternate emailId.             |
| `ABDM-1305` | Mobile number is missing for this ABHA address. Please update your mobile number.                        |
| `ABDM-1506` | Invalid callback resp id                                                                                 |
| `ABDM-1919` | Invalid Refresh token                                                                                    |
| `ABDM-1920` | Invalid grant type                                                                                       |
| `ABDM-1921` | Invalid client id                                                                                        |
| `ABDM-1922` | Invalid client secret                                                                                    |
| `ABDM-1923` | Invalid client id and secret                                                                             |
| `ABDM-1931` | Service-Id= (.\*?) is already exists                                                                     |
| `ABDM-1933` | Bridge registry request is invalid                                                                       |

### Retry

| Code        | Message                                                     |
| ----------- | ----------------------------------------------------------- |
| `ABDM-1208` | Abha Profile Gateway is unavailable                         |
| `ABDM-1209` | PHR DB service unavailable                                  |
| `ABDM-1221` | Face verification has been failed, please try again.        |
| `ABDM-1222` | Fingerprint verification has been failed, please try again. |
| `ABDM-1223` | IRIS verification has been failed, please try again.        |

### Cannot proceed

| Code        | Message                                                             |
| ----------- | ------------------------------------------------------------------- |
| `ABDM-1096` | Duplicate Gateway Consent Manager request                           |
| `ABDM-1097` | Duplicate Gateway Consent Manager patch request                     |
| `ABDM-1216` | The ABHA Address is deactivated.                                    |
| `ABDM-1308` | This account is deactivated. Please reactivate it from ABHA portal. |

### Unclassified

| Code        | Message                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `ABDM-1053` | Problem occurred while loading overlay image                                                                            |
| `ABDM-1073` | if is applicable for all HIP's is true;then HIP object must be null                                                     |
| `ABDM-1088` | Captcha verification failed, Please enter valid code.                                                                   |
| `ABDM-1123` | User authentication failed                                                                                              |
| `ABDM-1213` | User not active.                                                                                                        |
| `ABDM-1214` | Mobile/Email verification is pending.                                                                                   |
| `ABDM-1300` | Provided emailId doesn't match with existing emailId                                                                    |
| `ABDM-1303` | Your mobile number is not linked to the ABHA number. Please update your mobile number in ABHA or try using Aadhaar OTP. |
| `ABDM-1304` | Mobile number is not linked to your ABHA address. Please update your mobile number in ABHA.                             |
| `ABDM-1932` | HFR request failed, rollback successful for hfr-id= (\S+)\s\*                                                           |
| `ABDM-1935` | All the provided service IDs do not match with the client ID                                                            |
| `ABDM-9008` | No CR Mapped with Abha Address                                                                                          |

## M1 ABHA identity

Code, message and error name are as published. The action column reads the message text by a documented rule, and says Unclassified where the rule could not classify one.

### Fix request

| Code        | Message                                                                                                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ABDM-1002` | Invalid frequency unit, it must be in HOUR, WEEK, DAY, MONTH, YEAR                                                                                         |
| `ABDM-1006` | Invalid HIType, it must be in Prescription,DiagnosticReport,OPConsultation,DischargeSummary,ImmunizationRecord,HealthDocumentRecord,WellnessRecord,Invoice |
| `ABDM-1013` | Invalid ABHA Number                                                                                                                                        |
| `ABDM-1016` | Invalid Timestamp                                                                                                                                          |
| `ABDM-1017` | Invalid Transaction Id                                                                                                                                     |
| `ABDM-1021` | Lack of required priviledges                                                                                                                               |
| `ABDM-1030` | Request id not found                                                                                                                                       |
| `ABDM-1047` | Purpose does not exist                                                                                                                                     |
| `ABDM-1065` | Health facility does not exist                                                                                                                             |
| `ABDM-1101` | This ABHA Address already exists. Please create with unique ABHA address                                                                                   |
| `ABDM-1105` | Invalid request for parent linking                                                                                                                         |
| `ABDM-1107` | Invalid combinations of scopes                                                                                                                             |
| `ABDM-1109` | Invalid On discovery response                                                                                                                              |
| `ABDM-1111` | Invalid old password, please try with valid password.                                                                                                      |
| `ABDM-1113` | Duplicate health information provider data flow response data flow resoponse                                                                               |
| `ABDM-1115` | Invalid patient information. At least one patient information is required.                                                                                 |
| `ABDM-1117` | Auto approval id is already active                                                                                                                         |
| `ABDM-1118` | Login via ABHA Number OTP is not allowed                                                                                                                   |
| `ABDM-1119` | Login via Aadhaar OTP is not allowed                                                                                                                       |
| `ABDM-1121` | Invalid Enrolment Number                                                                                                                                   |
| `ABDM-1124` | The mobile number provided by you is already linked to 6 ABHA Numbers. Please provide a different Mobile Number.                                           |
| `ABDM-1126` | F-Token Expired                                                                                                                                            |
| `ABDM-1127` | Invalid F-Token                                                                                                                                            |
| `ABDM-1133` | Please enter a valid captcha result. Entered captcha result is incorrect.                                                                                  |
| `ABDM-1135` | The email address provided by you is already linked to 6 ABHA Numbers. Please provide a different email Id.                                                |
| `ABDM-1137` | Benefit Name Not Found                                                                                                                                     |
| `ABDM-1139` | Benefit record not found                                                                                                                                   |
| `ABDM-1142` | Please enter a valid captcha. Entered captcha is expired.                                                                                                  |
| `ABDM-1144` | Incorrect facility ID or password.                                                                                                                         |
| `ABDM-1158` | Invalid X-Token                                                                                                                                            |
| `ABDM-1204` | A UIDAI failure passed through. The UIDAI code and text sit inside the message string                                                                      |
| `ABDM-1207` | The information you provided does not match the details on record with Aadhaar. Please verify and provide accurate information.                            |
| `ABDM-1218` | Role for the user does not exist.                                                                                                                          |

### Retry

| Code        | Message                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `ABDM-1019` | Dependent Service Unavailable                                                                                                              |
| `ABDM-1022` | Too many requests                                                                                                                          |
| `ABDM-1029` | Redis server is unavailable                                                                                                                |
| `ABDM-1034` | Notification service unavailable                                                                                                           |
| `ABDM-1048` | Timeout                                                                                                                                    |
| `ABDM-1100` | You have requested multiple OTPs Or Exceeded maximum number of attempts for OTP match in this transaction. Please try again in 30 minutes. |
| `ABDM-1108` | Notification DB service unavailable                                                                                                        |
| `ABDM-1200` | LGD Gateway is unavailable                                                                                                                 |
| `ABDM-1201` | IDP Gateway is unavailable                                                                                                                 |
| `ABDM-1202` | Document Gateway is unavailable                                                                                                            |
| `ABDM-1205` | Document DB Gateway is unavailable                                                                                                         |
| `ABDM-1206` | Aadhaar Gateway is unavailable                                                                                                             |
| `ABDM-1220` | Sorry, Unable to process your request at this time. Please try again later.                                                                |
| `ABDM-1226` | Vault service unavailable                                                                                                                  |

### Fix auth

| Code        | Message                                                                             |
| ----------- | ----------------------------------------------------------------------------------- |
| `ABDM-1094` | Access to this feature is restricted. Please contact NHA to enable it.              |
| `ABDM-1094` | Invalid Benefit Name                                                                |
| `ABDM-1224` | Login via Biometric is not allowed.                                                 |
| `ABDM-9999` | Recorded as `ABDM-9999: `with an `ABDM-1094` message stuck to the front of the text |

### Cannot proceed

| Code        | Message                                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `ABDM-1134` | Deactivated ABHA Account                                                                                        |
| `ABDM-1228` | Your ABHA is linked with govt benefit programme, so it can not be deactivated- ABDM, National Health Authority. |

### Treat as success

| Code        | Message                                       |
| ----------- | --------------------------------------------- |
| `ABDM-1138` | The benefit record has already been de-linked |
| `ABDM-1140` | The benefit record has already been linked    |

### Unclassified

| Code        | Message                                                                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ABDM-1001` | Subscription source update returned empty                                                                                                                                               |
| `ABDM-1008` | SMS service currently disabled                                                                                                                                                          |
| `ABDM-1009` | Email service currently disabled                                                                                                                                                        |
| `ABDM-1010` | No pending care context found for this abha address                                                                                                                                     |
| `ABDM-1045` | Database Access is restricted                                                                                                                                                           |
| `ABDM-1066` | Please enter a valid Password                                                                                                                                                           |
| `ABDM-1102` | Mobile number verification is pending.                                                                                                                                                  |
| `ABDM-1103` | Cannot link with CHILD ABHA Number                                                                                                                                                      |
| `ABDM-1104` | Cannot link with same ABHA Number                                                                                                                                                       |
| `ABDM-1110` | Your new password must be different from your old password. Please enter a unique new password.                                                                                         |
| `ABDM-1112` | The provided gender does not match the gender in DigiLocker records                                                                                                                     |
| `ABDM-1114` | The provided name does not match the name in DigiLocker records                                                                                                                         |
| `ABDM-1116` | generate\_and\_save\_link\_token : 'NoneType' object has no attribute 'get'                                                                                                             |
| `ABDM-1122` | Request can not be processed                                                                                                                                                            |
| `ABDM-1132` | Kindly enter valid linked ABHA Address                                                                                                                                                  |
| `ABDM-1136` | message should not be null or empty.                                                                                                                                                    |
| `ABDM-1141` | An existing ABHA number created using this Aadhaar number has been found. It is advisable to delete this account and use ABHA number ((\[0-9]{2}(?:-\[0-9]{4}){3})) for future purpose. |
| `ABDM-1143` | Captcha limit exceeded.                                                                                                                                                                 |
| `ABDM-1155` | Parents must be 18 years of age or older to create a Child ABHA Account                                                                                                                 |
| `ABDM-1156` | Please ensure that the mobile number is mapped to the parent's ABHA number                                                                                                              |
| `ABDM-1157` | Child ABHA’s account limit has been exceeded for the requested Abha ID number ‘(.\*?)                                                                                                   |
| `ABDM-1159` | Children’s ages should be below '(.\*?)' years as of the current date                                                                                                                   |
| `ABDM-1160` | Non KYC CHILD ABHA is allowed to update their profile only once                                                                                                                         |
| `ABDM-1203` | TEST                                                                                                                                                                                    |
| `ABDM-1211` | Email Sending Limit Exceeded                                                                                                                                                            |
| `ABDM-1219` | Your ABHA is linked with govt benefit programme, so it can not be deleted- ABDM, National Health Authority.                                                                             |
| `ABDM-1227` | This client ID has reached the maximum limit of 100 ABHA account creations.                                                                                                             |

## M1 ABHA identity, Untagged

The same collection, and the only source that recorded HTTP statuses.

### Fix auth

| Code     | HTTP | Message                                                                                                                                   |
| -------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `900901` | 401  | Invalid Credentials, invalid JWT token. From the API gateway in front of the ABHA service, before your request reaches the business logic |
| `900900` | 500  | Unclassified authentication failure. The one saved example had a bad path and a bad token together, so read it as a client error first    |

### Fix request

| Code  | HTTP | Message                                                                                |
| ----- | ---- | -------------------------------------------------------------------------------------- |
| `404` | 404  | No matching resource found for given API Request\`. A wrong path, not a missing record |

## M1 ABHA identity, UIDAI

Codes from the Unique Identification Authority of India, passed through inside the message of ABDM-1204. More codes pass through than are listed here, so parse the message.

### Unclassified

| Code  | Message                |
| ----- | ---------------------- |
| `300` | Biometric mismatch     |
| `561` | Request expired        |
| `563` | Duplicate request      |
| `810` | Missing biometric data |

## M2 Linking and sharing

Code, message and error name are as published. The heading each code sits under reads the message text by a documented rule, and says Unclassified rather than guessing.

### Fix request

| Code        | Message                                                                                                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ABDM-1001` | No data found                                                                                                                                              |
| `ABDM-1006` | Invalid HIType, it must be in Prescription,DiagnosticReport,OPConsultation,DischargeSummary,ImmunizationRecord,HealthDocumentRecord,WellnessRecord,Invoice |
| `ABDM-1006` | Bad Request, invalid request Body                                                                                                                          |
| `ABDM-1006` | Invalid combinations of scopes                                                                                                                             |
| `ABDM-1006` | Invalid count, must be 2 digit and ranges between 1 to 20                                                                                                  |
| `ABDM-1010` | Validation failed                                                                                                                                          |
| `ABDM-1012` | No records found against the ABHA Address                                                                                                                  |
| `ABDM-1013` | Invalid ABHA Number                                                                                                                                        |
| `ABDM-1015` | Invalid Response                                                                                                                                           |
| `ABDM-1016` | Invalid TimeStamp                                                                                                                                          |
| `ABDM-1017` | Invalid TransactionId                                                                                                                                      |
| `ABDM-1023` | Invalid User                                                                                                                                               |
| `ABDM-1025` | Invalid ServiceId                                                                                                                                          |
| `ABDM-1030` | Invalid request ID                                                                                                                                         |
| `ABDM-1030` | Request id not found                                                                                                                                       |
| `ABDM-1031` | Invalid request                                                                                                                                            |
| `ABDM-1032` | Invalid header                                                                                                                                             |
| `ABDM-1035` | Invalid HIP ID                                                                                                                                             |
| `ABDM-1036` | Data does not matched                                                                                                                                      |
| `ABDM-1037` | Counter and Care context count mismatch                                                                                                                    |
| `ABDM-1040` | Invalid HIU ID                                                                                                                                             |
| `ABDM-1041` | Invalid Acknowledgement                                                                                                                                    |
| `ABDM-1042` | Provider Mandatory                                                                                                                                         |
| `ABDM-1043` | ABHA Address does not match with KYC details.                                                                                                              |
| `ABDM-1051` | Invalid ABHA Number or ABHA Address                                                                                                                        |
| `ABDM-1052` | Invalid TransactionId or response's requestId                                                                                                              |
| `ABDM-1055` | Invalid HIP Id or PHR Id                                                                                                                                   |
| `ABDM-1056` | Invalid Link Reference Number                                                                                                                              |
| `ABDM-1057` | Invalid Care Contexts                                                                                                                                      |
| `ABDM-1059` | Invalid Care Contexts count                                                                                                                                |
| `ABDM-1060` | Invalid Patient Reference Number                                                                                                                           |
| `ABDM-1061` | Invalid Patient Display                                                                                                                                    |
| `ABDM-1064` | Request body was missing                                                                                                                                   |
| `ABDM-1067` | Request body not required                                                                                                                                  |
| `ABDM-1109` | Invalid On discovery response                                                                                                                              |
| `ABDM-1110` | Invalid On init response                                                                                                                                   |
| `ABDM-1111` | Invalid On confirm response                                                                                                                                |
| `ABDM-1149` | Intent type is not supported at HIP end                                                                                                                    |
| `ABDM-1170` | Invalid ABHA address                                                                                                                                       |
| `ABDM-1407` | The ABHA Number associated with this ABHA Address is currently deactivated. Please reactivate it.                                                          |
| `ABDM-2402` | Invalid Timestamp                                                                                                                                          |
| `ABDM-2403` | Invalid X-CM-ID                                                                                                                                            |
| `ABDM-2404` | Invalid Request Id                                                                                                                                         |
| `ABDM-2406` | Invalid API sequence flow, please follow logical flow                                                                                                      |
| `ABDM-2406` | The status is invalid. Please follow the logical status flow or transition.                                                                                |
| `ABDM-2500` | No mapping found for                                                                                                                                       |

### Retry

| Code        | Message                                                                      |
| ----------- | ---------------------------------------------------------------------------- |
| `ABDM-1000` | Unable to connect the database                                               |
| `ABDM-1004` | SMS Gateway is unavailable                                                   |
| `ABDM-1007` | Connection failed due to timeout                                             |
| `ABDM-1008` | SMS service currently disabled                                               |
| `ABDM-1011` | Gateway database unavailable                                                 |
| `ABDM-1018` | Share Profile database unavailable                                           |
| `ABDM-1019` | Dependent Service Unavailable                                                |
| `ABDM-1020` | Unknown database                                                             |
| `ABDM-1024` | Dependent service unavailable                                                |
| `ABDM-1029` | Redis server is unavailable                                                  |
| `ABDM-1034` | Notification service unavailable                                             |
| `ABDM-1044` | Broadcast Failed                                                             |
| `ABDM-1045` | Database Access is restricted                                                |
| `ABDM-1048` | Timeout                                                                      |
| `ABDM-1108` | Notification DB service unavailable                                          |
| `ABDM-1109` | ABHA DB service unavailable                                                  |
| `ABDM-1201` | IDP Gateway is unavailable                                                   |
| `ABDM-9003` | Hospital services temporarily unavailable. Please try again after some time. |
| `ABDM-9004` | Services disrupted, please try again.                                        |
| `ABDM-9999` | Unknown exception                                                            |
| `ABDM-9999` | Cannot process the request at the moment, please try later.                  |
| `ABDM-9999` | User not found                                                               |

### New request id

| Code        | Message                                                  |
| ----------- | -------------------------------------------------------- |
| `ABDM-1064` | request with this request id already exists              |
| `ABDM-1087` | Duplicate patient share request                          |
| `ABDM-1090` | Duplicate HIP link request                               |
| `ABDM-1091` | Duplicate Get links request                              |
| `ABDM-1092` | Duplicate Link token request                             |
| `ABDM-1093` | Duplicate Bridge request                                 |
| `ABDM-1094` | Duplicate bridge patch request                           |
| `ABDM-1095` | Duplicate Bridge service request                         |
| `ABDM-1103` | Duplicate Discovery request                              |
| `ABDM-1104` | Duplicate Init request                                   |
| `ABDM-1105` | Duplicate Confirm request                                |
| `ABDM-1106` | Duplicate On discovery request                           |
| `ABDM-1107` | Duplicate On init request                                |
| `ABDM-1108` | Duplicate On confirm request                             |
| `ABDM-1113` | Duplicate health information provider data flow response |

### Fix auth

| Code        | Message                                    |
| ----------- | ------------------------------------------ |
| `ABDM-1026` | Invalid Link Token                         |
| `ABDM-1038` | ABHA address and Link token mismatch       |
| `ABDM-1062` | ABHA number mismatch with Link token       |
| `ABDM-1063` | HIP Id mismatch with Link token            |
| `ABDM-1065` | Invalid X Auth token                       |
| `ABDM-1066` | Invalid JWT token                          |
| `ABDM-1084` | ABHA address mismatch with X Auth token    |
| `ABDM-1085` | ABHA number mismatch with X Auth token     |
| `ABDM-1086` | Patient profile mismatch with X Auth token |
| `ABDM-2401` | The X Auth token is invalid.               |
| `ABDM-2500` | Authorization header is missing            |

### Ask support

| Code        | Message                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| `ABDM-1049` | Invalid Profile Share Intent Keys                                                                           |
| `ABDM-1050` | Invalid Profile Share Metadata Keys                                                                         |
| `ABDM-1102` | Profile information cannot be null                                                                          |
| `ABDM-1150` | Bridge API version cannot be null                                                                           |
| `ABDM-2501` | Payment status should be : \`SUCCESS,CANCELED,PENDING,FAIL,REFUND\_INITIATED,REFUND\_SUCCESS                |
| `ABDM-9001` | No open order against ABHA. Please ensure a minimum of one open order                                       |
| `ABDM-9002` | No registration found at `<<hospital name>>`. Contact counter support                                       |
| `ABDM-9005` | Bank server not responding. Please try again later                                                          |
| `ABDM-9006` | Service details mismatch. Please ensure original service ID from HMIS                                       |
| `ABDM-9007` | The Scan and Pay functionality is not enabled at this facility. Kindly contact the hospital administration. |

### New consent

| Code        | Message                                        |
| ----------- | ---------------------------------------------- |
| `ABDM-1046` | Invalid Purpose                                |
| `ABDM-1047` | Purpose does not exist                         |
| `ABDM-1061` | Consent artefact expired                       |
| `ABDM-1062` | Consent Not granted                            |
| `ABDM-1063` | Date Range given is invalid                    |
| `ABDM-1112` | Invalid or already expired consent artefact id |

### Chase the HIP

| Code        | Message                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| `ABDM-1028` | HIP is unavailable                                                      |
| `ABDM-1401` | HIP is not available                                                    |
| `ABDM-1402` | Acknowledgement is not received from HIP                                |
| `ABDM-9999` | HIP is unable to generate a token at this time. Please try again later. |
| `ABDM-9999` | HIP is unable to process at this time. Please try again later.          |

### Back off

| Code        | Message                 |
| ----------- | ----------------------- |
| `ABDM-1022` | Too many requests       |
| `ABDM-2429` | Too many requests found |

### Blocked, no retry

| Code        | Message                                           |
| ----------- | ------------------------------------------------- |
| `ABDM-1027` | You are blocked. Please try again after 24 hours. |

### Chase the HIU

| Code        | Message            |
| ----------- | ------------------ |
| `ABDM-1033` | HIU is unavailable |

### Treat as success

| Code        | Message                                    |
| ----------- | ------------------------------------------ |
| `ABDM-1056` | This care contexts has been already linked |

## M3 Consent and fetching

Code, message and error name are as published. The heading each code sits under reads the message text by a documented rule, and says Unclassified where the rule could not classify one.

### Fix request

| Code        | Message                                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ABDM-1002` | Invalid frequency unit, it must be in HOUR, WEEK, DAY, MONTH, YEAR                                                                                            |
| `ABDM-1005` | Invalid receiver                                                                                                                                              |
| `ABDM-1006` | Invalid HIType, it must be in Prescription,DiagnosticReport,OPConsultation,DischargeSummary,ImmunizationRecord,HealthDocumentRecord,WellnessRecord,Invoice    |
| `ABDM-1013` | Invalid ABHA Number                                                                                                                                           |
| `ABDM-1014` | Invalid Mobile Email                                                                                                                                          |
| `ABDM-1015` | Invalid Response                                                                                                                                              |
| `ABDM-1016` | Invalid Timestamp                                                                                                                                             |
| `ABDM-1017` | Invalid Transaction Id                                                                                                                                        |
| `ABDM-1021` | Lack of required priviledges                                                                                                                                  |
| `ABDM-1023` | Invalid User                                                                                                                                                  |
| `ABDM-1025` | Invalid ServiceId                                                                                                                                             |
| `ABDM-1026` | Bridge Id not found                                                                                                                                           |
| `ABDM-1030` | Request id not found                                                                                                                                          |
| `ABDM-1031` | Invalid reason. Reason should not be null or empty and should contains only alphabets, dot(.) and comma(,)                                                    |
| `ABDM-1032` | Invalid header                                                                                                                                                |
| `ABDM-1040` | Invalid Locker ID                                                                                                                                             |
| `ABDM-1041` | Invalid Acknowledgement                                                                                                                                       |
| `ABDM-1046` | Invalid Purpose                                                                                                                                               |
| `ABDM-1047` | Purpose does not exist                                                                                                                                        |
| `ABDM-1051` | Invalid ABHA Number or ABHA Address                                                                                                                           |
| `ABDM-1054` | Invalid Subscription Request Id                                                                                                                               |
| `ABDM-1057` | Invalid Care Contexts                                                                                                                                         |
| `ABDM-1058` | Invalid HI Types                                                                                                                                              |
| `ABDM-1060` | Invalid Patient Reference Number                                                                                                                              |
| `ABDM-1062` | ABHA number mismatch with Link token),                                                                                                                        |
| `ABDM-1063` | HIP Id mismatch with Link token                                                                                                                               |
| `ABDM-1064` | request with this request id already exists                                                                                                                   |
| `ABDM-1065` | Health facility does not exist                                                                                                                                |
| `ABDM-1074` | HIP object cannot be null in excluded sources                                                                                                                 |
| `ABDM-1075` | HIP object cannot be null in included sources                                                                                                                 |
| `ABDM-1079` | Auto approval id is already disabled                                                                                                                          |
| `ABDM-1080` | Subscription request may be already approved or denied                                                                                                        |
| `ABDM-1085` | ABHA number mismatch with X Auth token                                                                                                                        |
| `ABDM-1099` | Invalid event Id, it cannot be null                                                                                                                           |
| `ABDM-1113` | Duplicate health information provider data flow response data flow resoponse                                                                                  |
| `ABDM-1117` | Auto approval id is already active                                                                                                                            |
| `ABDM-1118` | Login via ABHA Number OTP is not allowed                                                                                                                      |
| `ABDM-1119` | Login via Aadhaar OTP is not allowed                                                                                                                          |
| `ABDM-1144` | Incorrect facility ID or password.                                                                                                                            |
| `ABDM-1145` | Subscription is already disabled                                                                                                                              |
| `ABDM-1151` | Health locker is already setup for the user                                                                                                                   |
| `ABDM-1152` | Subscription not found for the locker                                                                                                                         |
| `ABDM-1170` | Invalid ABHA address                                                                                                                                          |
| `ABDM-1404` | Patient record share detail not found                                                                                                                         |
| `ABDM-1405` | Invalid health information status                                                                                                                             |
| `ABDM-1406` | Invalid session status, Status should be TRANSFERRED, PARTIAL\_TRANSFERRED or FAILED                                                                          |
| `ABDM-1408` | Invalid API sequence flow, please follow logical flow                                                                                                         |
| `ABDM-9999` | Invalid purpose text, it must be in Care Management, Break the Glass, Public Health, Healthcare Payment, Disease Specific Healthcare Research, Self Requested |

### Retry

| Code        | Message                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `ABDM-1000` | Unable to connect the database                                                                                                             |
| `ABDM-1003` | Email Gateway is unavailable                                                                                                               |
| `ABDM-1004` | SMS Gateway is unavailable                                                                                                                 |
| `ABDM-1007` | Connection failed due to timeout                                                                                                           |
| `ABDM-1011` | Gateway database unavailable                                                                                                               |
| `ABDM-1018` | Share Profile database unavailable                                                                                                         |
| `ABDM-1019` | Dependent Service Unavailable                                                                                                              |
| `ABDM-1022` | Too many requests                                                                                                                          |
| `ABDM-1024` | Dependent service unavailable                                                                                                              |
| `ABDM-1028` | HIP is unavailable                                                                                                                         |
| `ABDM-1029` | Redis server is unavailable                                                                                                                |
| `ABDM-1033` | HIU is unavailable                                                                                                                         |
| `ABDM-1034` | Notification service unavailable                                                                                                           |
| `ABDM-1048` | Timeout                                                                                                                                    |
| `ABDM-1100` | You have requested multiple OTPs Or Exceeded maximum number of attempts for OTP match in this transaction. Please try again in 30 minutes. |

### Cannot proceed

| Code        | Message                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------- |
| `ABDM-1027` | You are blocked. Please try again after 24 hours.                                                 |
| `ABDM-1039` | Invalid Consent request id                                                                        |
| `ABDM-1061` | Consent artefact expired                                                                          |
| `ABDM-1070` | Duplicate consent request                                                                         |
| `ABDM-1153` | Unable to create Consent Auto Approval for the health locker                                      |
| `ABDM-1407` | The ABHA Number associated with this ABHA Address is currently deactivated. Please reactivate it. |
| `ABDM-8877` | HIP did not acknowledge the HIP consent notify. Please try again after some time                  |

### Unclassified

| Code        | Message                                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `ABDM-1001` | Subscription source update returned empty                                                                                          |
| `ABDM-1008` | SMS service currently disabled                                                                                                     |
| `ABDM-1009` | Email service currently disabled                                                                                                   |
| `ABDM-1010` | No pending care context found for this abha address                                                                                |
| `ABDM-1012` | No records found against the ABHA Address                                                                                          |
| `ABDM-1020` | Unknown database                                                                                                                   |
| `ABDM-1035` | OTP does not matched                                                                                                               |
| `ABDM-1071` | User doesn't belongs to same organisation                                                                                          |
| `ABDM-1072` | Included source size must be at least 1                                                                                            |
| `ABDM-1077` | Auto approval policy id doesn't exist.                                                                                             |
| `ABDM-1078` | Failed to upload documents                                                                                                         |
| `ABDM-1081` | Please upload registration certificate of your organisation                                                                        |
| `ABDM-1082` | Please upload authority letter from your organisation                                                                              |
| `ABDM-1083` | User doesn't belongs to same organisation                                                                                          |
| `ABDM-1084` | The Details fetched from Aadhaar is not matching with our database. Please select the correct details to proceed                   |
| `ABDM-1112` | The provided gender does not match the gender in DigiLocker records                                                                |
| `ABDM-1116` | generate\_and\_save\_link\_token : 'NoneType' object has no attribute 'get'                                                        |
| `ABDM-1120` | No care context is available for this patient.                                                                                     |
| `ABDM-1146` | Subscription is not in revoked state                                                                                               |
| `ABDM-1147` | Subscription is not in granted state                                                                                               |
| `ABDM-1148` | Subscription id does not belong to the patient                                                                                     |
| `ABDM-1154` | Unable to save user health locker                                                                                                  |
| `ABDM-1401` | Your mobile number is not linked to the ABHA number. Please update your mobile number in ABHA or try to register using Aadhaar OTP |
| `ABDM-1402` | Transaction Id is not matching with response                                                                                       |
| `ABDM-1403` | As per NHA policy, you have exceeded ABHA address creation limit, please link your ABHA address to ABHA number.                    |

## M4 HPR and HFR

The ranges below, with examples. The full list is in the sandbox documentation for the healthcare professional registry. Code, message and error name are as published. The heading each code sits under reads the message text by a documented rule, and says Unclassified where the rule could not classify one.

| Range                | What it covers                              | Examples                                                                                                                                         |
| -------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `HIS-400 to HIS-504` | The HTTP level failures                     | HIS-401 user is not authorized, HIS-403 forbidden, HIS-503 requested service is unavailable                                                      |
| `HIS-1xxx`           | Validation and facility errors, 103 of them | HIS-1002 the field value should not be empty, HIS-1124 bridge not linked, HIS-1128 HIP name already exists, HIS-1132 duplicate facility detected |
| `HIS-2xxx`           | Aadhaar, OTP and session errors             | HIS-2022 invalid OTP, HIS-2031 request expired, HIS-2045 session expired                                                                         |
| `HIS-3xxx`           | Aadhaar data and HPID state                 | HIS-3001 resident data not available, HIS-3021 HPRID already exists, HIS-3031 invalid token                                                      |
| `HIS-4xxx`           | Facility record errors                      | HIS-4003 facility already exists, HIS-4032 invalid state code, HIS-4055 invalid image format                                                     |
| `HIS-5xxx`           | Registration workflow errors                | HIS-5005 already registered, HIS-5011 token expired                                                                                              |

## M4 HPR and HFR

The ranges below, with examples. The full list is in the sandbox documentation for the healthcare professional registry. Code, message and error name are as published. The heading each code sits under reads the message text by a documented rule, and says Unclassified where the rule could not classify one.

### Fix request

| Code       | Message                                               |
| ---------- | ----------------------------------------------------- |
| `HIS-400`  | Request is invalid. Please enter the correct data.    |
| `HIS-1001` | Doctor info not found for healthProfessionalId: (.\*) |
| `HIS-1003` | Invalid pattern found.                                |
| `HIS-1004` | Type mismatched. Please send the correct type.        |
| `HIS-1008` | Invalid HPID/USERID.                                  |
| `HIS-1010` | Password must follow required format.                 |
| `HIS-1013` | Incorrect OTP entered.                                |
| `HIS-1015` | HPID already exists.                                  |
| `HIS-1020` | Facility already registered with HPID.                |
| `HIS-1024` | Invalid state.                                        |
| `HIS-1025` | Invalid district.                                     |
| `HIS-1026` | Transaction not found.                                |
| `HIS-1028` | Aadhaar required for KYC.                             |
| `HIS-1029` | HPID already linked with Aadhaar.                     |
| `HIS-1030` | Name mismatch with Aadhaar records.                   |
| `HIS-1032` | Integrated program not found.                         |
| `HIS-1034` | Invalid date format.                                  |
| `HIS-1035` | Invalid Healthcare Professional ID.                   |
| `HIS-1042` | Invalid OIDC transition.                              |
| `HIS-1043` | Redirect URL mismatch.                                |
| `HIS-1044` | Access code expired.                                  |
| `HIS-1046` | Same mobile number not allowed.                       |
| `HIS-1054` | Invalid document type.                                |
| `HIS-1055` | Invalid gender code.                                  |
| `HIS-1059` | Invalid data provided.                                |
| `HIS-1060` | OTP expired or invalid.                               |
| `HIS-1061` | Invalid category ID.                                  |
| `HIS-1062` | Invalid sub category ID.                              |
| `HIS-1063` | Invalid image uploaded.                               |
| `HIS-1064` | Invalid image size.                                   |
| `HIS-1066` | Incorrect captcha.                                    |
| `HIS-1067` | Invalid credentials.                                  |
| `HIS-1068` | Mobile verification required.                         |
| `HIS-1070` | Required field is empty.                              |
| `HIS-1100` | Invalid Bridge ID.                                    |
| `HIS-1101` | Bridge ID already registered.                         |
| `HIS-1102` | Self transfer not allowed.                            |
| `HIS-1103` | Facility transfer request already initiated.          |
| `HIS-1104` | Linked program already in use.                        |
| `HIS-1105` | Operation not allowed.                                |
| `HIS-1106` | Required fields missing.                              |
| `HIS-1107` | Reassign to same manager not allowed.                 |
| `HIS-1108` | Invalid attempt.                                      |
| `HIS-1109` | Professional type mismatch.                           |
| `HIS-1113` | Invalid facility ID format.                           |
| `HIS-1114` | Invalid pin code.                                     |
| `HIS-1115` | Invalid ownership code.                               |
| `HIS-1116` | HPR ID required.                                      |
| `HIS-1117` | Transaction ID required.                              |
| `HIS-1118` | Invalid password format.                              |
| `HIS-1119` | Invalid token.                                        |
| `HIS-1120` | Invalid facility ID or name.                          |
| `HIS-1121` | Invalid facility details.                             |
| `HIS-1123` | Request body missing fields.                          |
| `HIS-1125` | Invalid HIP name.                                     |
| `HIS-1126` | Invalid Bridge ID.                                    |
| `HIS-1127` | Invalid HIP ID.                                       |
| `HIS-1128` | HIP name already exists.                              |
| `HIS-1129` | Invalid HIP name format.                              |
| `HIS-1132` | Duplicate facility detected.                          |
| `HIS-1150` | Invalid private facility.                             |
| `HIS-1151` | Facility ministry mismatch.                           |
| `HIS-1152` | Mobile number not found.                              |
| `HIS-1153` | PSU mismatch.                                         |
| `HIS-2001` | Invalid Aadhaar number.                               |
| `HIS-2022` | Invalid OTP.                                          |
| `HIS-2031` | Request expired.                                      |
| `HIS-2045` | Session expired.                                      |
| `HIS-2055` | Invalid gender.                                       |
| `HIS-2057` | Invalid category.                                     |
| `HIS-2062` | Invalid medical council.                              |
| `HIS-2075` | Invalid reason of not working.                        |
| `HIS-2076` | Invalid work status.                                  |
| `HIS-2081` | Invalid boolean value.                                |
| `HIS-2082` | Invalid reason of not working.                        |
| `HIS-2083` | Invalid ministry.                                     |
| `HIS-2084` | Invalid category.                                     |
| `HIS-2094` | Work status not required.                             |
| `HIS-2095` | Facility declaration not required.                    |
| `HIS-3006` | Document mismatch.                                    |
| `HIS-3021` | HPRID already exists.                                 |
| `HIS-3031` | Invalid token.                                        |
| `HIS-4003` | Facility already exists.                              |
| `HIS-4015` | Invalid ownership subtype.                            |
| `HIS-4020` | Invalid longitude.                                    |
| `HIS-4032` | Invalid state code.                                   |
| `HIS-4044` | Invalid page number.                                  |
| `HIS-4055` | Invalid image format.                                 |
| `HIS-4061` | Facility status change not allowed.                   |
| `HIS-5002` | Qualification missing.                                |
| `HIS-5005` | Already registered.                                   |
| `HIS-5006` | Invalid practitioner DTO.                             |
| `HIS-5007` | Invalid personal DTO.                                 |
| `HIS-5008` | Invalid academic DTO.                                 |
| `HIS-5009` | Invalid registration DTO.                             |
| `HIS-5010` | Invalid work DTO.                                     |
| `HIS-5011` | Token expired.                                        |

### Cannot proceed

| Code       | Message                       |
| ---------- | ----------------------------- |
| `HIS-401`  | User is not authorized.       |
| `HIS-403`  | Forbidden.                    |
| `HIS-1065` | Consent required.             |
| `HIS-1072` | Mobile number not registered. |

### Retry

| Code       | Message                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| `HIS-500`  | An unexpected error has occurred. Please try again in some time {0}{1}. |
| `HIS-503`  | Requested service is unavailable.                                       |
| `HIS-3015` | Server timeout.                                                         |

### Unclassified

| Code       | Message                                                  |
| ---------- | -------------------------------------------------------- |
| `HIS-422`  | Unable to process the current request due to wrong data. |
| `HIS-504`  | Database exception occurred while processing request.    |
| `HIS-1002` | The field value should not be empty.                     |
| `HIS-1005` | Please try logging in with the correct details.          |
| `HIS-1006` | Authentication is not initiated with provided method.    |
| `HIS-1007` | The user is disabled.                                    |
| `HIS-1009` | Error while connecting to UIDAI service.                 |
| `HIS-1011` | Please enter valid mobile number.                        |
| `HIS-1012` | Please enter valid Aadhaar number.                       |
| `HIS-1014` | Field contains only alphabets.                           |
| `HIS-1016` | HPID not available.                                      |
| `HIS-1018` | HPID creation allowed only for specific regions.         |
| `HIS-1019` | HP Facility ID not available.                            |
| `HIS-1021` | Current and new password cannot be same.                 |
| `HIS-1022` | Please verify captcha.                                   |
| `HIS-1023` | Please wait before sending another OTP.                  |
| `HIS-1027` | Benefit not integrated.                                  |
| `HIS-1031` | Password not set for HPID.                               |
| `HIS-1033` | Authentication failed.                                   |
| `HIS-1036` | ID type and domain not configured.                       |
| `HIS-1039` | Max login attempts exceeded.                             |
| `HIS-1040` | File size exceeds limit.                                 |
| `HIS-1041` | Max OTP attempts reached.                                |
| `HIS-1045` | Mobile update failed.                                    |
| `HIS-1047` | Input must be encrypted.                                 |
| `HIS-1048` | Unable to fetch document details.                        |
| `HIS-1056` | HPID not created via driving licence.                    |
| `HIS-1057` | Document details not available.                          |
| `HIS-1069` | No HPID found for Aadhaar.                               |
| `HIS-1071` | Old password does not match.                             |
| `HIS-1073` | New password cannot be same as old password.             |
| `HIS-1110` | Not a Central Government facility.                       |
| `HIS-1111` | Not a State facility.                                    |
| `HIS-1112` | Not a Government facility.                               |
| `HIS-1122` | User not government type.                                |
| `HIS-1124` | Bridge not linked.                                       |
| `HIS-1130` | Bridge request failed.                                   |
| `HIS-1131` | Geolocation limit exceeded.                              |
| `HIS-1148` | Not a government facility.                               |
| `HIS-1149` | Not a private facility.                                  |
| `HIS-2004` | OTP system error.                                        |
| `HIS-2085` | Validation / verification failure.                       |
| `HIS-2096` | Select State Govt facility.                              |
| `HIS-2097` | Select Central Govt facility.                            |
| `HIS-3001` | Resident data not available.                             |
| `HIS-5001` | Workflow not defined.                                    |

## P1 PHR identity and profile

Code and message are as published. The heading each code sits under reads the message text by a documented rule. These codes are the PHR facing wording of the core ABDM codes, row for row.

### Fix request

| Code      | Message                                                                                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AS-1002` | No results found for the given input.                                                                                                                                       |
| `AS-1013` | No records found against the entered ABHA Address                                                                                                                           |
| `AS-1014` | Please enter a valid ABHA number.                                                                                                                                           |
| `AS-1015` | Please enter a valid mobile number and email address .                                                                                                                      |
| `AS-1016` | Invalid Response                                                                                                                                                            |
| `AS-1017` | The timestamp format is incorrect.                                                                                                                                          |
| `AS-1024` | Please enter a valid and registered user ID.                                                                                                                                |
| `AS-1037` | Please enter a valid and registered HIP Id.                                                                                                                                 |
| `AS-1043` | Please enter a valid and registered HIU Id.                                                                                                                                 |
| `AS-1044` | Please enter a valid and registered Locker Id.                                                                                                                              |
| `AS-1047` | Please enter a valid and registered provider Id.                                                                                                                            |
| `AS-1056` | The profile share metadata keys are invalid. Please review the shared data.                                                                                                 |
| `AS-1059` | The Transaction ID or response’s Request ID is invalid. Please verify and retry.                                                                                            |
| `AS-1061` | The entered data already exists in the system.                                                                                                                              |
| `AS-1066` | The selected care context is already associated with your ABHA address.                                                                                                     |
| `AS-1068` | The care context information provided is invalid. Please verify and retry.                                                                                                  |
| `AS-1069` | The health information types provided are invalid.                                                                                                                          |
| `AS-1072` | Patient display information is invalid or missing.                                                                                                                          |
| `AS-1079` | The selected date range is invalid.                                                                                                                                         |
| `AS-1080` | The request could not be processed because the request body is missing.                                                                                                     |
| `AS-1081` | A request with this request ID already exists.                                                                                                                              |
| `AS-1082` | Invalid X Auth token                                                                                                                                                        |
| `AS-1084` | JWT token is invalid                                                                                                                                                        |
| `AS-1085` | Please enter a valid password.                                                                                                                                              |
| `AS-1086` | Request body is not required.                                                                                                                                               |
| `AS-1087` | Both patient details and error information are missing. Please provide at least one.                                                                                        |
| `AS-1100` | Organisation was not found                                                                                                                                                  |
| `AS-1102` | User ID already exist                                                                                                                                                       |
| `AS-1103` | One or more HIPs provided in the request are invalid.                                                                                                                       |
| `AS-1104` | The registration number provided is incorrect.                                                                                                                              |
| `AS-1106` | The uploaded file format is not supported. Please upload a valid format.                                                                                                    |
| `AS-1107` | The auto-approval ID provided is invalid.                                                                                                                                   |
| `AS-1109` | This auto-approval ID has already been disabled.                                                                                                                            |
| `AS-1111` | This subscription request has already been processed.                                                                                                                       |
| `AS-1123` | Aadhaar details do not match our records. Please review and select the correct information.                                                                                 |
| `AS-1124` | Aadhaar details do not match our records. Please review and select the correct information.                                                                                 |
| `AS-1129` | A patient share request with the same details already exists.                                                                                                               |
| `AS-1131` | Health information cannot be null                                                                                                                                           |
| `AS-1132` | Captcha verification failed. Please enter the correct code to continue.                                                                                                     |
| `AS-1133` | Payment information cannot be null                                                                                                                                          |
| `AS-1141` | A bridge request with these details already exists.                                                                                                                         |
| `AS-1143` | A bridge patch request for this transaction already exists.                                                                                                                 |
| `AS-1145` | A bridge service request with the same details already exists.                                                                                                              |
| `AS-1146` | Please enter a valid registered email address.                                                                                                                              |
| `AS-1153` | Duplicate Health Information request                                                                                                                                        |
| `AS-1154` | This ABHA Address already exists. Please create with unique ABHA address.                                                                                                   |
| `AS-1155` | Profile information cannot be empty                                                                                                                                         |
| `AS-1170` | Invalid On init response                                                                                                                                                    |
| `AS-1171` | Your new password must be different from your old password. Please enter a unique new password.                                                                             |
| `AS-1172` | Invalid On confirm response                                                                                                                                                 |
| `AS-1176` | Duplicate health information provider data flow response                                                                                                                    |
| `AS-1177` | Please enter a valid Captcha                                                                                                                                                |
| `AS-1178` | Duplicate health information notification request                                                                                                                           |
| `AS-1180` | Patient information is invalid. Please provide at least one valid patient detail.                                                                                           |
| `AS-1181` | Mobile number not found.                                                                                                                                                    |
| `AS-1182` | The Auto approval request is invalid                                                                                                                                        |
| `AS-1183` | Aadhaar details not found in the system.                                                                                                                                    |
| `AS-1184` | This auto approval id is already active                                                                                                                                     |
| `AS-1188` | Invalid subscription edit payload                                                                                                                                           |
| `AS-1191` | Missing or invalid request ID header. Please ensure a valid REQUEST\_ID is provided.                                                                                        |
| `AS-1195` | The mobile number provided by you is already linked to 6 ABHA numbers. Please provide a different mobile number.                                                            |
| `AS-1196` | The mobile number provided by you is already linked to 6 ABHA numbers. Please provide a different mobile number.                                                            |
| `AS-1199` | Invalid F-Token                                                                                                                                                             |
| `AS-1201` | Invalid T-Token                                                                                                                                                             |
| `AS-1202` | Invalid X-Token                                                                                                                                                             |
| `AS-1204` | Kindly enter valid linked ABHA Address                                                                                                                                      |
| `AS-1207` | The email address provided by you is already linked to 6 ABHA Numbers. Please provide a different email address.                                                            |
| `AS-1209` | Benefit name not found. Please check the entered details.                                                                                                                   |
| `AS-1210` | This benefit record has already been de-linked.                                                                                                                             |
| `AS-1212` | The benefit record has already been linked                                                                                                                                  |
| `AS-1213` | This account already exist                                                                                                                                                  |
| `AS-1217` | This subscription is already enabled                                                                                                                                        |
| `AS-1219` | This subscription is already disabled.                                                                                                                                      |
| `AS-1225` | Health locker has already been set up for this user.                                                                                                                        |
| `AS-1232` | Invalid X-Token                                                                                                                                                             |
| `AS-1243` | The information you provided does not match the details on record with Aadhaar. Please verify and provide accurate information.                                             |
| `AS-1244` | The information you provided does not match the details on record with Aadhaar. Please verify and provide accurate information.                                             |
| `AS-1251` | Email address not found.                                                                                                                                                    |
| `AS-1258` | Notification templates not found                                                                                                                                            |
| `AS-1270` | Invalid callback resp id                                                                                                                                                    |
| `AS-1271` | Invalid Refresh token                                                                                                                                                       |
| `AS-1276` | Service ID ‘%s’ already exists. Please use a different service ID.                                                                                                          |
| `AS-1282` | Invalid X Auth token                                                                                                                                                        |
| `AS-1283` | Patient profile mismatch with X Auth token                                                                                                                                  |
| `AS-1286` | Open order not found                                                                                                                                                        |
| `AS-1292` | Duplicate relationship not allowed.A relationship already exists between %s and %s                                                                                          |
| `AS-1295` | The mobile number you have entered does not match with any of the records Please enter a different number                                                                   |
| `AS-1300` | The mobile number you have entered has already been verified. Please provide an alternate mobile number.                                                                    |
| `AS-1306` | Invalid photo. Please upload a file with a human face.                                                                                                                      |
| `AS-1312` | Mobile number is missing for this ABHA address. Please update your mobile number.                                                                                           |
| `AS-1314` | Required header 'X-token' is not present.                                                                                                                                   |
| `AS-1316` | Doctor info not found for healthProfessionalId :'%s'                                                                                                                        |
| `AS-1319` | Invalid Password Request, Please enter valid ABHA Address or valid password                                                                                                 |
| `AS-1320` | Invalid OTP Value                                                                                                                                                           |
| `AS-1324` | The mobile number you have entered does not match with any of the records. Please enter a different number                                                                  |
| `AS-1325` | Invalid Mobile Number                                                                                                                                                       |
| `AS-1327` | Mobile number is missing for this ABHA address. Please update your mobile number.                                                                                           |
| `AS-1328` | Transaction is not found for UUID.                                                                                                                                          |
| `AS-1332` | Please enter a valid and registered provider Id.                                                                                                                            |
| `AS-1342` | Invalid Face Auth PID                                                                                                                                                       |
| `AS-1348` | Service details mismatch. Please ensure original service ID from HMIS                                                                                                       |
| `AS-1353` | Invalid OTP Request                                                                                                                                                         |
| `AS-1355` | Invalid Mobile number.                                                                                                                                                      |
| `AS-1357` | Invalid Password                                                                                                                                                            |
| `AS-1358` | Invalid R-token                                                                                                                                                             |
| `AS-1359` | Required header 'T-token' is not present. Please provide a valid T-token.                                                                                                   |
| `AS-1360` | Required header 'R-token' is not present. Please provide a valid R-token.                                                                                                   |
| `AS-1361` | Required header 'X-token' is not present. Please provide a valid X-token.                                                                                                   |
| `AS-1363` | Invalid X-token                                                                                                                                                             |
| `AS-1364` | Invalid T-token                                                                                                                                                             |
| `AS-1369` | Invalid address line. It must be alphanumeric and can include the following special characters: ,.'/()-                                                                     |
| `AS-1373` | Invalid Credentials. Make sure your API invocation call has a header: 'Authorization : Bearer ACCESS\_TOKEN' or 'Authorization : Basic ACCESS\_TOKEN' or 'apikey: API\_KEY' |
| `AS-1374` | Invalid Credentials. Make sure you have provided the correct security credentials                                                                                           |
| `AS-1375` | Invalid Login Hint                                                                                                                                                          |
| `AS-1376` | Invalid Scope                                                                                                                                                               |
| `AS-1377` | Patient not found                                                                                                                                                           |
| `AS-1381` | The email Id you have entered has already been verified. Please provide an alternate email Id                                                                               |
| `AS-1384` | Invalid KYC XML                                                                                                                                                             |
| `AS-1386` | Invalid Email Id                                                                                                                                                            |
| `AS-1388` | Health Locker is Already Unsubscribed                                                                                                                                       |
| `AS-1396` | Aadhaar number is incorrect.Please use correct Aadhaar.                                                                                                                     |
| `AS-1400` | Invalid HEALTHLOCKER Id or PHR Id.                                                                                                                                          |
| `AS-1401` | Invalid Service ID, it must be Alpha numeric and @, \_ or - in middle.                                                                                                      |
| `AS-1403` | Invalid data erase date. Date must be a future date.                                                                                                                        |
| `AS-1408` | Invalid API sequence flow, please follow logical flow.                                                                                                                      |
| `AS-1409` | Invalid session status, Status should be TRANSFERRED, PARTIAL\_TRANSFERRED or FAILED.                                                                                       |
| `AS-1410` | Invalid health information status.                                                                                                                                          |
| `AS-1412` | Invalid Mobile Number.                                                                                                                                                      |
| `AS-1413` | LoginId is invalid.                                                                                                                                                         |
| `AS-1414` | Invalid Transaction Id.                                                                                                                                                     |
| `AS-1416` | Invalid PinCode, it must be only numbers and maximum length of 6.                                                                                                           |
| `AS-1419` | LoginId is invalid.                                                                                                                                                         |
| `AS-1420` | Invalid Otp System.                                                                                                                                                         |
| `AS-1421` | Invalid Auth Methods.                                                                                                                                                       |
| `AS-1422` | This Aadhaar number is already linked to the ABHA Number %s. Please re-login and try using another Aadhaar Number.                                                          |

### Retry

| Code      | Message                                                                                                                             |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `AS-1001` | Database connection failed. Please try again later.                                                                                 |
| `AS-1004` | Email gateway is temporarily unavailable.                                                                                           |
| `AS-1005` | SMS gateway is temporarily unavailable.                                                                                             |
| `AS-1006` | The recipient information is invalid. Please check and try again.                                                                   |
| `AS-1007` | Request could not be processed due to invalid data format. Please review and try again.                                             |
| `AS-1008` | Timeout error: Unable to connect to the server.                                                                                     |
| `AS-1009` | SMS service is temporarily unavailable.                                                                                             |
| `AS-1010` | Email service is temporarily unavailable.                                                                                           |
| `AS-1012` | Gateway database unavailable                                                                                                        |
| `AS-1019` | Share Profile database unavailable                                                                                                  |
| `AS-1020` | Dependent Service is unavailable.                                                                                                   |
| `AS-1023` | You have made too many requests. Please wait a moment and try again.                                                                |
| `AS-1025` | Dependent Service is unavailable.                                                                                                   |
| `AS-1026` | The selected service is invalid. Please check and try again.                                                                        |
| `AS-1027` | The entered Bridge ID does not exist. Please verify and try again.                                                                  |
| `AS-1030` | The requested HIP service is currently not accessible. Please try again later.                                                      |
| `AS-1031` | Redis server is temporarily unavailable.                                                                                            |
| `AS-1032` | The request ID is invalid. Please check and try again.                                                                              |
| `AS-1033` | Invalid request. Please check and try again.                                                                                        |
| `AS-1034` | The request header is invalid or missing required information. Please try again.                                                    |
| `AS-1035` | The requested HIU service is currently not accessible. Please try again later.                                                      |
| `AS-1036` | Notification service is temporarily unavailable                                                                                     |
| `AS-1039` | The entered information doesn’t match our records. Please verify and try again.                                                     |
| `AS-1041` | ABHA address does not match the linked token. Please check and try again.                                                           |
| `AS-1045` | Acknowledgement is invalid or not properly formatted. Please try again.                                                             |
| `AS-1048` | The ABHA address you entered doesn’t match the KYC details. Please verify and try again.                                            |
| `AS-1049` | Failed to send the broadcast message. Please try again later.                                                                       |
| `AS-1051` | The selected purpose is invalid. Please verify and try again                                                                        |
| `AS-1052` | The selected purpose is does not exist. Please verify and try again                                                                 |
| `AS-1054` | Request timed out. Please try again.                                                                                                |
| `AS-1055` | The profile share intent keys are invalid. Please check and try again.                                                              |
| `AS-1057` | The ABHA number or ABHA address entered is invalid. Please check and try again.                                                     |
| `AS-1058` | There was an issue while encoding the content. Please try again.                                                                    |
| `AS-1060` | Unable to load overlay image. Please refresh or try again later.                                                                    |
| `AS-1062` | We couldn’t convert the file to PNG format. Please try again or check the file type.                                                |
| `AS-1063` | The subscription request ID is invalid. Please check and try again.                                                                 |
| `AS-1065` | The HIP ID or PHR address is invalid. Please check and try again.                                                                   |
| `AS-1067` | The link reference number is invalid. Please check and try again.                                                                   |
| `AS-1071` | The patient reference number is invalid. Please check and try again.                                                                |
| `AS-1074` | The ABHA number you entered doesn’t match the linked token. Please verify and try again.                                            |
| `AS-1075` | The ABHA number you entered doesn’t match the linked token. Please verify and try again.                                            |
| `AS-1077` | The ABHA number you entered doesn’t match the linked token. Please verify and try again.                                            |
| `AS-1078` | The HIP Id doesn’t match the linked token. Please verify and try again.                                                             |
| `AS-1083` | Health facility does not exist. Please check and try again.                                                                         |
| `AS-1088` | The authentication type provided is invalid. Please check and try again.                                                            |
| `AS-1090` | The login credentials provided are incorrect. Please try again.                                                                     |
| `AS-1095` | User not found. Please verify and try again.                                                                                        |
| `AS-1108` | Document upload failed. Please try again.                                                                                           |
| `AS-1110` | Failed to update user status. Please try again later.                                                                               |
| `AS-1115` | Subscription approval data is invalid in payload. Please check and try again.                                                       |
| `AS-1120` | The subscription ID is invalid. Please check and try again.                                                                         |
| `AS-1126` | User not found. Please verify and try again.                                                                                        |
| `AS-1137` | A similar request to get links already exists. Please try again later.                                                              |
| `AS-1138` | The ABHA number must be 14 digits. Please correct it and try again.                                                                 |
| `AS-1152` | You've reached the maximum number of OTP attempts or the OTP wasn’t generated. Please wait 30 minutes and try again with a new OTP. |
| `AS-1162` | The request for linking a parent profile is invalid. Please check the details and try again.                                        |
| `AS-1167` | Notification service is currently unavailable. Please try again later.                                                              |
| `AS-1168` | The On-Discovery response received is invalid. Please try again.                                                                    |
| `AS-1169` | ABHA database is currently unavailable. Please try again later.                                                                     |
| `AS-1173` | The old password entered is incorrect. Please try again with a valid password.                                                      |
| `AS-1179` | User not found. Please verify and try again.                                                                                        |
| `AS-1192` | The enrolment number entered is invalid. Please verify and try again.                                                               |
| `AS-1193` | Your request could not be processed at the moment. Please try again later.                                                          |
| `AS-1205` | The captcha result entered is incorrect. Please try again with the correct value.                                                   |
| `AS-1218` | The facility ID or password is incorrect. Please check and try again.                                                               |
| `AS-1235` | The ABHA address entered is invalid. Please verify and try again.                                                                   |
| `AS-1236` | LGD Gateway is currently unavailable. Please try again later.                                                                       |
| `AS-1237` | IDP Gateway is currently unavailable. Please try again later.                                                                       |
| `AS-1238` | Document Gateway is currently unavailable. Please try again later.                                                                  |
| `AS-1241` | Document DB Gateway is currently unavailable. Please try again later.                                                               |
| `AS-1242` | Aadhaar Gateway is currently unavailable. Please try again later.                                                                   |
| `AS-1245` | ABHA profile gateway is currently unavailable.Please try again later.                                                               |
| `AS-1246` | PHR DB service is currently unavailable. Please try again later.                                                                    |
| `AS-1250` | User not found. Please verify and try again.                                                                                        |
| `AS-1260` | Sorry, Unable to process your request at this time. Please try again later.                                                         |
| `AS-1261` | Face verification has been failed, please try again.                                                                                |
| `AS-1262` | Fingerprint verification has been failed, please try again.                                                                         |
| `AS-1263` | IRIS verification has been failed, please try again.                                                                                |
| `AS-1265` | The email ID provided does not match the one registered. Please check and try again.                                                |
| `AS-1267` | HIP is currently unavailable. Please try again later.                                                                               |
| `AS-1269` | No acknowledgement was received from the HIP. Please try again later.                                                               |
| `AS-1272` | The grant type is invalid. Please check the request and try again.                                                                  |
| `AS-1273` | The client ID is invalid. Please verify and try again.                                                                              |
| `AS-1274` | The client secret is invalid. Please verify and try again.                                                                          |
| `AS-1275` | Both client ID and secret are invalid. Please verify and try again.                                                                 |
| `AS-1278` | The bridge registry request is invalid. Please verify and try again.                                                                |
| `AS-1281` | An unknown error occurred. Please try again later                                                                                   |
| `AS-1285` | Cannot process the request at the moment, please try later.                                                                         |
| `AS-1293` | We are facing some issue in server connectivity. Please try again                                                                   |
| `AS-1298` | It appears that you are either not connected to the internet or experiencing a slow connection. please try again.                   |
| `AS-1299` | UIDAI Error code : 953 : You have requested multiple OTPs in this transaction. Please try again in 30 minutes.                      |
| `AS-1310` | User not found. Please verify and try again.                                                                                        |
| `AS-1313` | The ABHA address entered is invalid. Please verify and try again.                                                                   |
| `AS-1317` | An unexpected error has occurred. Please try again in some time.                                                                    |
| `AS-1321` | External service is temporarily unavailable                                                                                         |
| `AS-1322` | User not found. Please verify and try again.                                                                                        |
| `AS-1323` | User not found. Please verify and try again.                                                                                        |
| `AS-1331` | The ABHA address entered is invalid. Please verify and try again.                                                                   |
| `AS-1345` | Hospital services temporarily unavailable. Please try again after some time                                                         |
| `AS-1346` | Services disrupted, please try again.                                                                                               |
| `AS-1347` | Bank server not responding. Please try again later                                                                                  |
| `AS-1349` | The HIMS service is currently unavailable. Please try again after some time                                                         |
| `AS-1350` | Cannot process the request at the moment, please try later                                                                          |
| `AS-1352` | Cannot process the request at the moment, please try later.                                                                         |
| `AS-1371` | External service is temporarily unavailable                                                                                         |
| `AS-1372` | External Service Unavailable                                                                                                        |
| `AS-1387` | You have exceeded the maximum limit of failed attempts Please try to login using other modes or try again in 24 hours               |
| `AS-1389` | Beneficiary is not a covered member for requested policy. Please enroll beneficiary for the policy and try again.                   |
| `AS-1391` | External Service Unavailable                                                                                                        |
| `AS-1393` | Digilocker Service Unavailable                                                                                                      |
| `AS-1394` | You have exceeded the maximum limit of failed attempts Please try to login using other modes or try again in 30 mins                |
| `AS-1395` | You have exceeded the maximum limit of failed attempts Please try to login using other modes or try again in 24 hours               |
| `AS-1398` | You have exceeded the maximum limit of failed attempts. Please try to login using other modes or try again in 12 hours.             |
| `AS-1417` | NHCX service is temporarily unavailable.                                                                                            |

### Cannot proceed

| Code      | Message                                                                                        |
| --------- | ---------------------------------------------------------------------------------------------- |
| `AS-1018` | Transaction ID is incorrect or has expired.                                                    |
| `AS-1022` | Permission denied - required privileges are missing.                                           |
| `AS-1028` | Link token is incorrect or has expired.                                                        |
| `AS-1029` | Your account is currently blocked. Please try again after 24 hours.                            |
| `AS-1038` | The entered OTP is incorrect or has expired. Please re-enter the correct OTP.                  |
| `AS-1042` | The consent request ID is invalid . Please verify and try again.                               |
| `AS-1073` | The consent artefact has expired. Please generate a new one to proceed.                        |
| `AS-1076` | Consent has not been granted.                                                                  |
| `AS-1089` | A consent request with the same details already exists.                                        |
| `AS-1092` | This user is not part of your organisation. Access denied.                                     |
| `AS-1093` | The consent PIN entered is invalid. Please check and try again.                                |
| `AS-1096` | The provided consent PIN does not exist.                                                       |
| `AS-1097` | HIP object must be empty when consent is applicable to all HIPs.                               |
| `AS-1113` | The consent artefact ID is invalid. Please verify and try again.                               |
| `AS-1118` | Duplicate consent approve request                                                              |
| `AS-1121` | The user is not associated with your organisation. Access denied.                              |
| `AS-1130` | Sorry, your session is expired. Please login to continue.                                      |
| `AS-1134` | Captcha expired or not loaded. Please reload and try again.                                    |
| `AS-1140` | A valid consent was not found for this request.                                                |
| `AS-1142` | The transaction ID or consent artefact ID provided is invalid. Please verify and try again.    |
| `AS-1144` | You are not authorized to update the status                                                    |
| `AS-1147` | Duplicate Gateway Consent Manager request                                                      |
| `AS-1148` | Duplicate Gateway Consent Manager patch request                                                |
| `AS-1174` | The consent artefact ID is either invalid or has expired.                                      |
| `AS-1198` | Sorry, your session is expired. Please login to continue.                                      |
| `AS-1200` | Sorry, your session is expired. Please try again.                                              |
| `AS-1203` | X-Token Expired                                                                                |
| `AS-1206` | This ABHA account has been deactivated.                                                        |
| `AS-1214` | Captcha has expired. Please enter a new captcha.                                               |
| `AS-1227` | Unable to create auto-approval consent for the health locker. Please try again later.          |
| `AS-1255` | The ABHA Address is deactivated.                                                               |
| `AS-1280` | HIP did not acknowledge the HIP consent notify. Please try again after some time               |
| `AS-1284` | Access Denied                                                                                  |
| `AS-1297` | This account is deactivated Please continue to reactivate abhaNumber %s                        |
| `AS-1302` | This account is deactivated. Please reactivate it from ABHA portal.                            |
| `AS-1315` | T-token expired                                                                                |
| `AS-1330` | T-token expired                                                                                |
| `AS-1334` | This account is deactivated. Please reactivate it from ABHA portal.                            |
| `AS-1354` | X-token expired                                                                                |
| `AS-1378` | This account is deactivated. Please reactivate it from ABHA portal.                            |
| `AS-1380` | Too many request attempted in short period of time. This method is blocked for next 30 minutes |
| `AS-1385` | R-token expired                                                                                |

### Unclassified

| Code      | Message                                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AS-1003` | There seems to be a data integrity issue. Please contact support team.                                                                                       |
| `AS-1011` | Validation failed.                                                                                                                                           |
| `AS-1021` | Unknown database                                                                                                                                             |
| `AS-1040` | The number of care contexts does not match the expected count. Please verify the data.                                                                       |
| `AS-1046` | Provider is Mandatory                                                                                                                                        |
| `AS-1050` | You do not have permission to access the database. Please contact your administrator.                                                                        |
| `AS-1053` | Validation failed                                                                                                                                            |
| `AS-1064` | An error occurred while generating the QR code. Please retry after some time.                                                                                |
| `AS-1070` | The number of care contexts does not match the expected count. Please review the request.                                                                    |
| `AS-1091` | At least one source must be included in the request.                                                                                                         |
| `AS-1094` | At least one source must be included in the request.                                                                                                         |
| `AS-1098` | Your user or manager profile is not e signed.                                                                                                                |
| `AS-1099` | HIP object cannot be null in excluded sources                                                                                                                |
| `AS-1101` | Included sources must contain a valid HIP object.                                                                                                            |
| `AS-1105` | Auto approval policy id doesn't exist.                                                                                                                       |
| `AS-1112` | Upload your organisation ID card image to proceed.                                                                                                           |
| `AS-1114` | Upload your organisation ID card image to proceed.                                                                                                           |
| `AS-1116` | Upload your organisation’s registration certificate to continue.                                                                                             |
| `AS-1117` | A care context exists without an associated HIP ID. Please correct the request.                                                                              |
| `AS-1119` | Upload an official authority letter from your organisation.                                                                                                  |
| `AS-1122` | ABHA number does not match the X Auth token. Please verify your session.                                                                                     |
| `AS-1125` | ABHA number does not match the X Auth token. Please verify your session.                                                                                     |
| `AS-1127` | Patient profile does not match the X Auth token. Please verify your session.                                                                                 |
| `AS-1128` | No transaction found for the provided UUID.                                                                                                                  |
| `AS-1135` | Duplicate HIP link request                                                                                                                                   |
| `AS-1136` | You can export up to 500 records at a time.                                                                                                                  |
| `AS-1139` | Duplicate Link token request                                                                                                                                 |
| `AS-1149` | Duplicate Gateway Government Program request                                                                                                                 |
| `AS-1150` | Duplicate Subscription request                                                                                                                               |
| `AS-1151` | Duplicate Subscription Approve request                                                                                                                       |
| `AS-1156` | Mobile number verification is pending.                                                                                                                       |
| `AS-1157` | Duplicate Discovery request                                                                                                                                  |
| `AS-1158` | Linking with CHILD ABHA Number is not allowed.                                                                                                               |
| `AS-1159` | Duplicate Init request                                                                                                                                       |
| `AS-1160` | You cannot link with sameABHA Number.Please use a different ABHA Number.                                                                                     |
| `AS-1161` | Duplicate Confirm request                                                                                                                                    |
| `AS-1163` | Duplicate On discovery request                                                                                                                               |
| `AS-1164` | Duplicate On init request                                                                                                                                    |
| `AS-1165` | The selected scopes combination are not valid together.                                                                                                      |
| `AS-1166` | Duplicate On confirm request                                                                                                                                 |
| `AS-1175` | Please ensure both old and new passwords are encrypted                                                                                                       |
| `AS-1185` | Login using password is not allowed. Please use other login methods.                                                                                         |
| `AS-1186` | Duplicate auto approval request                                                                                                                              |
| `AS-1187` | Login via ABHA Number OTP is not allowed. Please use other login methods.                                                                                    |
| `AS-1189` | Login via Aadhaar OTP is not allowed. Please use other login methods.                                                                                        |
| `AS-1190` | No care context is available for this patient.                                                                                                               |
| `AS-1194` | User authentication failed                                                                                                                                   |
| `AS-1197` | Both ABHA number and ABHA address cannot be null                                                                                                             |
| `AS-1208` | Message cannot be null or empty.                                                                                                                             |
| `AS-1211` | No benefit record found for the given details.                                                                                                               |
| `AS-1215` | Captcha attempts exceeded.                                                                                                                                   |
| `AS-1216` | Captcha attempts exceeded.                                                                                                                                   |
| `AS-1220` | Subscription is not in revoked state                                                                                                                         |
| `AS-1221` | Subscription is not in granted stat                                                                                                                          |
| `AS-1222` | This subscription ID does not belong to the patient.                                                                                                         |
| `AS-1223` | The requested intent type is not supported at the HIP.                                                                                                       |
| `AS-1224` | Bridge API version cannot be null                                                                                                                            |
| `AS-1226` | No active subscription found for the selected health locker.                                                                                                 |
| `AS-1228` | Unable to save user health locker details.                                                                                                                   |
| `AS-1229` | Parents must be 18 years of age or older to create a Child ABHA Account                                                                                      |
| `AS-1230` | Please ensure that the mobile number is mapped to the parent’s ABHA number                                                                                   |
| `AS-1231` | Maximum number of Child ABHA accounts reached for the given ABHA number ‘%s’                                                                                 |
| `AS-1233` | Children must be under '%s' years of age as of today to create a Child ABHA.                                                                                 |
| `AS-1234` | Non KYC CHILD ABHA is allowed to update their profile only once                                                                                              |
| `AS-1239` | TEST                                                                                                                                                         |
| `AS-1240` | TEST                                                                                                                                                         |
| `AS-1247` | Duplicate Notification request                                                                                                                               |
| `AS-1248` | Login via Email Address OTP is not allowed. Please use other login methods.                                                                                  |
| `AS-1249` | You have exceeded the email sending limit. Please wait before trying again.                                                                                  |
| `AS-1252` | User not active.                                                                                                                                             |
| `AS-1253` | Mobile/Email verification is pending.                                                                                                                        |
| `AS-1254` | Login via Mobile Number OTP is not allowed. Please use other login methods.                                                                                  |
| `AS-1256` | Login is not allowed                                                                                                                                         |
| `AS-1257` | No role has been assigned to this user.                                                                                                                      |
| `AS-1259` | Your ABHA is linked with govt benefit programme, so it can not be deleted- ABDM, National Health Authority.                                                  |
| `AS-1264` | Biometric login is currently not allowed. Please use an alternate login method.                                                                              |
| `AS-1266` | Mobile number is not linked to your ABHA address. Please update your mobile number in ABHA.                                                                  |
| `AS-1268` | Your mobile number is not linked to the ABHA number. Please update your mobile number in ABHA or try to register using Aadhaar OTP                           |
| `AS-1277` | HFR request failed, but rollback was successful for HFR ID ‘%s’.                                                                                             |
| `AS-1279` | All the provided service IDs do not match with the client ID                                                                                                 |
| `AS-1287` | Error in making call to target system Content type 'text/html' not supported for bodyType=java.util.HashMap                                                  |
| `AS-1288` | Cannot find any linked ABHA address. Please create ABHA address first.                                                                                       |
| `AS-1289` | OTP is not verified for this transaction                                                                                                                     |
| `AS-1290` | User is not kyc verified                                                                                                                                     |
| `AS-1291` | Self-relationship not allowed                                                                                                                                |
| `AS-1294` | UIDAI Error code : 300 : Biometric data did not match.                                                                                                       |
| `AS-1296` | You can request for new OTP after 30 seconds timestamp %s                                                                                                    |
| `AS-1301` | Old and New Passwords are same                                                                                                                               |
| `AS-1303` | No ABHA user registered with this Aadhaar number                                                                                                             |
| `AS-1304` | UIDAI Error code : 400 :OTP validation failed                                                                                                                |
| `AS-1305` | Please provide a photo featuring only one individual and not a group photo.                                                                                  |
| `AS-1307` | Your mobile number is not linked to the ABHA number. Please update your mobile number in ABHA or try using Aadhaar OTP.                                      |
| `AS-1308` | You can request for new OTP after 30 seconds                                                                                                                 |
| `AS-1309` | As per NHA policy, your mobile number has reached the limit of 6 self-declared ABHA addresses. Please link your existing ABHA addresses to your ABHA number. |
| `AS-1311` | No password is set for this profile. Please log in using other login modes.                                                                                  |
| `AS-1318` | Login via Password is not allowed                                                                                                                            |
| `AS-1326` | UIDAI Error code : 400 : OTP validation failed                                                                                                               |
| `AS-1329` | You can request for new OTP after 30 seconds                                                                                                                 |
| `AS-1333` | You can request for new OTP after 30 seconds                                                                                                                 |
| `AS-1335` | Login via Password is not allowed                                                                                                                            |
| `AS-1336` | No open order against ABHA. Please ensure a minimum of one open order                                                                                        |
| `AS-1337` | No CR Mapped with Abha Address                                                                                                                               |
| `AS-1338` | No pending care context found for this abha address                                                                                                          |
| `AS-1339` | The provided gender does not match the gender in DigiLocker records                                                                                          |
| `AS-1340` | The provided DOB does not match the DOB in DigiLocker records                                                                                                |
| `AS-1341` | The provided name does not match the name in DigiLocker records                                                                                              |
| `AS-1343` | No open order against ABHA. Please ensure a minimum of one open order                                                                                        |
| `AS-1344` | No registration found at %s. Contact counter support                                                                                                         |
| `AS-1351` | No user profile found.                                                                                                                                       |
| `AS-1356` | No pending care context found for this abha address                                                                                                          |
| `AS-1362` | Requested URL or resource is not available                                                                                                                   |
| `AS-1365` | The Scan and Pay functionality is not enabled at this facility. Kindly contact the hospital administration.                                                  |
| `AS-1366` | No CR Mapped with Abha Address                                                                                                                               |
| `AS-1367` | No care context is available for this patient.                                                                                                               |
| `AS-1368` | No registration found at %s. Contact counter support                                                                                                         |
| `AS-1370` | External service error                                                                                                                                       |
| `AS-1379` | Digilocker account creation fail.                                                                                                                            |
| `AS-1382` | Please avoid trying to generate the OTP multiple times within short time.                                                                                    |
| `AS-1383` | Sorry you have exceeded your feedback submission limit                                                                                                       |
| `AS-1390` | No Claim History with requested Details                                                                                                                      |
| `AS-1392` | Duplicate Link token request                                                                                                                                 |
| `AS-1397` | FileName can not be null or empty                                                                                                                            |
| `AS-1399` | Duplicate patient record share request.                                                                                                                      |
| `AS-1402` | Care context cannot be null or empty.                                                                                                                        |
| `AS-1404` | Data erase date cannot be null or empty.                                                                                                                     |
| `AS-1405` | Transaction Id is not matching with response.                                                                                                                |
| `AS-1406` | Request Timed out.                                                                                                                                           |
| `AS-1407` | expiry should be in future date.                                                                                                                             |
| `AS-1411` | endDate should be after startDate and before currentDate.                                                                                                    |
| `AS-1415` | Unable to fetch the file details.                                                                                                                            |
| `AS-1418` | Maximum number of attempts for OTP match is exceeded or OTP is not generated. Please generate a fresh OTP and try to authenticate again.                     |

922 codes are recorded. A code you meet that is not here is one the specifications do not carry yet.
