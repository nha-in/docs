# P1 Registration and login errors

Seeing a symptom rather than a code? Start at [Troubleshooting](/docs/pr-97/docs/hiecm/v3/troubleshooting/).

## Codes

| Code        | HTTP | Message                        | Returned by                                 |
| ----------- | ---- | ------------------------------ | ------------------------------------------- |
| `900902`    | 401  | Missing Credentials            | `p1_get_v3_phr_app_enrollment_isexists`     |
| `ABDM-1107` | 400  | Invalid combinations of scopes | `p1_post_v3_phr_app_login_verify`           |
| `ABDM-1211` | 400  | User not found.                | `p1_post_v3_phr_app_login_search`           |
| `ABDM-9999` | 400  | Invalid LoginId                | `p1_post_v3_phr_app_enrollment_request_otp` |

Every code above is recorded in the specification that owns it. The aggregated list across modules is at [error codes](/docs/pr-97/docs/hiecm/v3/reference/error-codes).

## What the codes mean

### ABDM-1107: the combination of scopes is not valid

`scope` is an array, and the call checks the combination rather than any one value in it. The personal health record (PHR) app login verification returns `ABDM-1107` with HTTP 400 and the message "Invalid combinations of scopes". The combination you sent is not one this call accepts, or not the one the one-time password (OTP) request opened the transaction with.

A login sends the same pair on the OTP request and on its verification:

| Logging in with | `scope`                            |
| --------------- | ---------------------------------- |
| A mobile OTP    | `["abha-login", "mobile-verify"]`  |
| An Aadhaar OTP  | `["abha-login", "aadhaar-verify"]` |

In the linking callbacks, the same code means "Duplicate On init request".

Notes for AI agents

**Before you start.** Have the scope the OTP request carried, and the scope in the example for the operation you are calling now.

**How you know it worked.** The verification returns its success response instead of this code.

**When it goes wrong.** You changed the scope between the OTP request and the verification: send the same array on both. You reused one scope across a whole journey: read the scope from the example for the operation you are calling, not from the one before it. You reused a `txnId` from another journey: start a new transaction for the new journey.

[NextStill stuck? Ask for helpWhere to file what you hit, so the answer lands back in these pages.](/docs/support)
