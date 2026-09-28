# M1 Identity errors

Seeing a symptom rather than a code? Start at [Troubleshooting](/docs/main/docs/hiecm/v3/troubleshooting/).

## Codes

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

Every code above is recorded in the specification that owns it. The aggregated list across modules is at [error codes](/docs/main/docs/hiecm/v3/reference/error-codes).

## What the codes mean

### 900900: authentication failed without a reason

The [ABHA](/docs/main/docs/hiecm/v3/getting-started/glossary#abha) service returns `900900` with HTTP 500 and the message "Unclassified Authentication Failure". The `description` field names the API that refused the call. Authentication failed, and the response does not say which credential was at fault.

Notes for AI agents

**What happens.** The M1 examples return it where the access token is not valid. Many M1 calls take two tokens, the access token in `Authorization` and the person's token in `X-token`, so either can be the cause.

**When it goes wrong.** Check both tokens. `Authorization` must carry a current access token from the session call. `X-token`, where the call takes one, must be the token issued when this person logged in. If both are current, confirm your client is allowed to call this API.

### 900901: the credentials are not valid

The [ABHA](/docs/main/docs/hiecm/v3/getting-started/glossary#abha) service returns `900901` with HTTP 401 and the message "Invalid Credentials". The token or client credential you sent was rejected outright. `900902`, "Missing Credentials", means no credential arrived at all.

Notes for AI agents

**What happens.** The `description` reads "Invalid JWT token. Make sure you have provided the correct security credentials" or "Invalid Credentials. Make sure you have provided the correct security credentials".

**When it goes wrong.** Check the client id and secret against the environment you are calling. A production client id against a sandbox host, or the reverse, fails. Then get a fresh access token from the session call and use it at once.

### ABDM-1016: the timestamp is not valid

The service refused the `TIMESTAMP` header before it read the rest of the request. The message is "Invalid Timestamp". The profile calls return it with HTTP 404, and the public certificate call with HTTP 400.

Send `TIMESTAMP` as ISO 8601 in UTC, with milliseconds and the `Z` suffix, for example `2022-10-06T15:10:00.587Z`. The code arrives as `ABDM-1016:` followed by a space, inside an `error` object.

Notes for AI agents

**What happens.** A 404 here does not mean the path is wrong. Match on the code in the body, not on the HTTP status. Trim the code, or match on its prefix, because an exact match on `ABDM-1016` misses the trailing colon and space.

**How you know it worked.** The same request, with only `TIMESTAMP` corrected, returns its normal response.

**When it goes wrong.** Generate the value with a date library, never by hand. If a well formed UTC value still fails, compare your host clock with a time server, and see [ABDM-2402](/docs/main/docs/hiecm/v3/api/m2/errors#abdm-2402).

### ABDM-1094: access to this feature is refused

Your client, or the person's token, is not allowed to do what the call tried. The M1 calls return `ABDM-1094` with HTTP 401 and one of three messages:

- "X-token expired", on child ABHA enrolment. The parent's `X-token` has expired.
- "Invalid Benefit Name", on benefit link and de-link. The `BENEFIT_NAME` header does not name a benefit programme your client can use.
- "Access to this feature is restricted. Please contact NHA to enable it.", on benefit link and de-link. Your client is not enabled for this feature.

Notes for AI agents

**What happens.** This code arrives with `code` at the top level beside a `timestamp`, while other M1 errors wrap it in an `error` object. Read the `code` inside `error` when it is present, and fall back to the top level `code`.

**When it goes wrong.** Retrying does not help. For "X-token expired", have the parent log in again and send the new `X-token`. For "Invalid Benefit Name", send the benefit name exactly as registered, as in the example `healthid api`. For the restricted message, stop calling the feature until NHA enables it for your client.

[NextStill stuck? Ask for helpWhere to file what you hit, so the answer lands back in these pages.](/docs/support)
