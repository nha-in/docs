# Gateway session errors

Seeing a symptom rather than a code? Start at [Troubleshooting](/docs/pr-13/docs/hiecm/v3/troubleshooting/).

## Codes

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

The rule that reads the message could not classify these. Read the message and decide.

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

Every code above is recorded in the specification that owns it. The aggregated list across modules is at [error codes](/docs/pr-13/docs/hiecm/v3/reference/error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/pr-13/docs/support)
