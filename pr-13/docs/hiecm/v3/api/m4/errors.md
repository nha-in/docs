# M4 HPR and HFR errors

Seeing a symptom rather than a code? Start at [Troubleshooting](/docs/pr-13/docs/hiecm/v3/troubleshooting/).

## Codes

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

The rule that reads the message could not classify these. Read the message and decide.

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

## Code ranges

| Range                | What it covers                              | Examples                                                                                                                                         |
| -------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `HIS-400 to HIS-504` | The HTTP level failures                     | HIS-401 user is not authorized, HIS-403 forbidden, HIS-503 requested service is unavailable                                                      |
| `HIS-1xxx`           | Validation and facility errors, 103 of them | HIS-1002 the field value should not be empty, HIS-1124 bridge not linked, HIS-1128 HIP name already exists, HIS-1132 duplicate facility detected |
| `HIS-2xxx`           | Aadhaar, OTP and session errors             | HIS-2022 invalid OTP, HIS-2031 request expired, HIS-2045 session expired                                                                         |
| `HIS-3xxx`           | Aadhaar data and HPID state                 | HIS-3001 resident data not available, HIS-3021 HPRID already exists, HIS-3031 invalid token                                                      |
| `HIS-4xxx`           | Facility record errors                      | HIS-4003 facility already exists, HIS-4032 invalid state code, HIS-4055 invalid image format                                                     |
| `HIS-5xxx`           | Registration workflow errors                | HIS-5005 already registered, HIS-5011 token expired                                                                                              |

Every code above is recorded in the specification that owns it. The aggregated list across modules is at [error codes](/docs/pr-13/docs/hiecm/v3/reference/error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/pr-13/docs/support)
