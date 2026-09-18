# P1 PHR identity and profile errors

Seeing a symptom rather than a code? Start at [Troubleshooting](/docs/pr-14/docs/hiecm/v3/troubleshooting/).

## Codes

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

The rule that reads the message could not classify these. Read the message and decide.

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

Every code above is recorded in the specification that owns it. The aggregated list across modules is at [error codes](/docs/pr-14/docs/hiecm/v3/reference/error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/pr-14/docs/support)
