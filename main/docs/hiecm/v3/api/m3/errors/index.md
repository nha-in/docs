# M3 Consent and fetching errors

Seeing a symptom rather than a code? Start at [Troubleshooting](/docs/main/docs/hiecm/v3/troubleshooting/).

## Codes

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

The rule that reads the message could not classify these. Read the message and decide.

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

Every code above is recorded in the specification that owns it. The aggregated list across modules is at [error codes](/docs/main/docs/hiecm/v3/reference/error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/main/docs/support)
