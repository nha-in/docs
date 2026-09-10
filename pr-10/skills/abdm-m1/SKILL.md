---
name: abdm-m1
description: Use when building, debugging or testing ABDM Milestone 1: creating an ABHA number or address, ABHA login, profile management, or the gateway session token. Carries the endpoints, the required headers, the two token rule, the encryption rule, every recorded error code and the M1 test matrix.
---

# ABDM M1, ABHA identity

Generated from the ABDM Developer Portal on 2026-09-10, catalogue version 2026.08.24. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.

This file is a snapshot. Re-download it from https://nha-in.github.io/docs/pr-10/skills/abdm-m1/SKILL.md when it is older than the work you are doing.
If the abdm-docs MCP server is connected, trust its answers over this file: it serves the current catalogue and stamps every response with its catalogue_version, which you can compare against the version above.

## What this skill covers

- **Integrate.** 55 operations, with their hosts and headers.
- **Debug.** 89 recorded error codes, with the message and what to do.
- **Test.** 61 test cases, each with the call it makes and what to see when it passes.

## Before anything else

- Nothing here has been run against the ABDM sandbox. Treat request and response shapes as unconfirmed, and check a response before you rely on its shape.
- Get an access token first, from the gateway session endpoint. Every other call needs it in `Authorization: Bearer <token>`.
- Two tokens exist and they are not interchangeable. The gateway access token goes in `Authorization`. The user token from an enrolment or a login goes in `X-token`. Profile endpoints need both.
- Sensitive fields travel encrypted. Aadhaar numbers, mobile numbers, email addresses, OTP values and passwords are RSA encrypted with NHA's public certificate before they go in the body.
- One path serves several jobs. The `scope` array in the body picks which one, so read it before assuming an endpoint does one thing.

## Hosts

- `https://abhasbx.abdm.gov.in/abha/api` ABHA Server, Sandbox (primary)
- `https://dev.abdm.gov.in/api/hiecm` ABDM Gateway, Dev
- `https://dev.abdm.gov.in` Sandbox. Pair it with the `X-CM-ID: sbx` header.
- `https://apis.abdm.gov.in` Production. Pair it with the `X-CM-ID: abdm` header.

## Endpoints

55 operations, grouped by the journey they belong to.

### ABHA creation, Aadhaar biometric

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/v3/enrollment/enrol/auth/init` | Start face or biometric authentication and get a transaction id |
| `POST` | `/v3/enrollment/enrol/capturePID` | Submit a captured biometric or face authentication block |

### ABHA creation, Aadhaar OTP

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/v3/enrollment/auth/byAbdm` | Verify an OTP that ABDM sent, during enrolment |
| `POST` | `/v3/enrollment/enrol/abha-address` | Claim a chosen ABHA address |
| `POST` | `/v3/enrollment/enrol/byAadhaar` | Create an ABHA from a verified Aadhaar OTP |
| `GET` | `/v3/enrollment/enrol/suggestion` | Get suggested ABHA addresses for a new account |
| `POST` | `/v3/enrollment/request/otp` | Send an OTP to begin or continue an enrolment |

### ABHA creation, demographic authentication

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/v3/enrollment/profile/children` | List the child ABHA accounts linked to this account |

### ABHA creation, driving licence or PAN

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/v3/enrollment/enrol/byDocument` | Create an ABHA from an identity document |

### ABHA Profile

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/profile/account/request/emailVerificationLink` | Send Email Verification Link |

### ABHA QR code

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/v3/profile/account/abha-card` | Get the ABHA card |
| `GET` | `/v3/profile/account/download-abha-card` | Download the ABHA card as a file |
| `GET` | `/v3/profile/account/qrCode` | Get the ABHA QR code |

### ABHA verification, Aadhaar OTP

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/v3.1/profile/login/request/otp` | Send a login OTP, v3.1 |
| `POST` | `/v3.1/profile/login/verify` | Verify a login OTP, v3.1 |

### ABHA verification, mobile OTP

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/v3/profile/login/request/otp` | Send a login OTP |
| `POST` | `/v3/profile/login/verify` | Verify a login OTP and get a user token |
| `POST` | `/v3/profile/login/verify/user` | Choose which ABHA to sign in to |

### Authentication

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/profile/public/certificate` | Get RSA Public Certificate |

### bridge

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/v4/int/v1/bridges/MutipleHRPAddUpdateServices` | Register / Update Bridge Services (HIU) |

### Fetch ABHA by Aadhaar number

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/v3/profile/benefit/abha/{abhaNumber}` | Get the benefit record for an ABHA number |
| `GET` | `/v3/profile/benefit/abha/search/insurance/{abhaNumber}` | Find insurance cover recorded against an ABHA number |
| `GET` | `/v3/profile/benefit/abha/statedistrict/{abhaNumber}` | Get the state and district recorded against an ABHA number |
| `POST` | `/v3/profile/benefit/linkAndDelink` | Link or unlink a benefit record from an ABHA |
| `POST` | `/v3/profile/benefit/search` | Search benefit records for a person |
| `GET` | `/v3/profile/benefit/search/aadhaarByAbha` | Find the Aadhaar number behind an ABHA number |
| `GET` | `/v3/profile/benefit/search/abhaByAadhaar` | Find an ABHA number from an Aadhaar number |

### Fetch ABHA by mobile number

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/v3/profile/account/abha/search` | Find an ABHA for somebody who does not know theirs |

### Gateway & Bridge

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/api/hiecm/gateway/v3/.well-known/openid-configuration` | Get OIDC Discovery Document |
| `GET` | `/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}` | Find Bridge Service by Service ID |
| `GET` | `/api/hiecm/gateway/v3/bridge-services` | List All Bridge Services |
| `PATCH` | `/api/hiecm/gateway/v3/bridge/url` | Update HIP/HIU Bridge Callback URL |
| `GET` | `/api/hiecm/gateway/v3/certs` | Get Gateway JWKS Certificates |
| `POST` | `/v1/bridges/MutipleHRPAddUpdateServices` | Register / Update HIP-HIU Services (Facility Registry) |

### Login & Verification

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/profile/login/search` | Search ABHA Profile (for Password Login) |

### PHR & ABHA Address

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/phr/web/login/abha/request/otp` | Send OTP for ABHA Address Login |
| `POST` | `/phr/web/login/abha/search` | Search ABHA Address, Get Auth Methods |
| `POST` | `/phr/web/login/abha/verify` | Verify OTP / Biometric for ABHA Address Login |
| `GET` | `/phr/web/login/profile/abha-profile` | Get PHR Profile |
| `GET` | `/phr/web/login/profile/abha/phr-card` | Download PHR Card |
| `GET` | `/phr/web/login/profile/abha/qr-code` | Download PHR QR Code |

### Profile update

| Method | Path | What it does |
| --- | --- | --- |
| `PATCH` | `/v3/profile/account` | Update fields on an ABHA profile |
| `POST` | `/v3/profile/account/request/otp` | Send an OTP to change something on the profile |
| `POST` | `/v3/profile/account/verify` | Verify the OTP for a profile change |

### Provider directory

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/api/hiecm/gateway/v3/govt-programs` | List government programs |
| `GET` | `/api/hiecm/gateway/v3/health-lockers` | List health-locker-enabled providers |
| `GET` | `/api/hiecm/gateway/v3/providers` | List providers by name |
| `GET` | `/api/hiecm/gateway/v3/providers/{provider-id}` | Get a provider by id |

### Scan & Share

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/patient-share/v3/on-share` | Send Share Acknowledgement (HIP → Gateway) |
| `POST` | `/patient-share/v3/share` | Receive a patient's shared profile |

### Session and tokens

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/api/hiecm/gateway/v3/sessions` | Create a session and get an access token |
| `POST` | `/v3/phr/app/enrollment/encrypt` | Encrypt a value with the ABDM public key |
| `GET` | `/v3/profile/account/request/logout` | Log the person out and invalidate their user token |
| `GET` | `/v3/profile/account/request/token` | Get a new user token from a refresh token |

### Share patient profile

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/v3/profile/account` | Read the signed in person's ABHA profile |

## Headers

| Header | What it is |
| --- | --- |
| `REQUEST-ID` | Unique UUID v4 per request. Used for idempotency and distributed tracing. Generate a fresh UUID for every cal… |
| `TIMESTAMP` | ISO 8601 UTC timestamp of the request. |
| `BENEFIT_NAME` | The benefit scheme an enrolment belongs to. On enrolment and benefit calls, the value is `healthid api` on th… |
| `X-token` | The user scoped token returned when a person logs in or verifies an OTP. Profile calls act on one account, so… |
| `TRANSACTION_ID` | The enrolment transaction this call belongs to, when the transaction is not carried in the body. |
| `T-token` | The transaction token that carries state between the two halves of a login. Returned by the verify call and s… |
| `healthIdNumber` | The 14 digit ABHA number, sent plain in the recorded request, in the dashed `91-XXXX-XXXX-XXXX` form. |
| `aadhaarNumber` | The person's Aadhaar number, RSA encrypted against the ABDM public key and sent as a header rather than in a … |
| `X-CM-ID` | Which consent manager you are talking to. `sbx` on the sandbox and `abdm` in production. Sending the wrong on… |
| `KEY_TYPE` | Which ABDM public key the encryption helper should use. |
| `R-token` | The refresh token, sent when asking for a new user token without making the person log in again. Required for… |

## A request, in full

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'BENEFIT_NAME: healthid api' \
  --header 'X-token: Bearer <X_TOKEN_FROM_LOGIN_VERIFY>' \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "<TXN_ID>",
      "otpValue": "<OTPVALUE>",
      "mobile": "<MOBILE>"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```

## Errors

### Four error shapes, not one

Do not write a parser that expects a single shape.

### Shape 1: the wrapped ABDM error

```json
{
    "error": {
        "code": "ABDM-1204",
        "message": "UIDAI Error code : 300 : Biometric data did not match."
    }
}
```

The code lives at `error.code`. This comes from the ABHA service's own business logic.

### Shape 2: the flat ABDM error

```json
{
    "code": "ABDM-1094",
    "message": "Access to this feature is restricted. Please contact NHA to enable it.",
    "timestamp": "2024-10-25 15:02:34"
}
```

Same family of codes, no `error` wrapper, plus a `timestamp`. The collection shows `ABDM-1094` in both shapes on different calls, so the wrapper is not tied to the code. Read `error.code` first and fall back to a top level `code`.

### Shape 3: field validation

```json
{
    "txnId": "Invalid Transaction Id",
    "timestamp": "2025-01-15 13:21:16"
}
```

No code at all. The key names the field you got wrong. Several bad fields produce several keys:

```json
{
    "scope": "Invalid Scope",
    "authData": "Invalid Auth Data",
    "timestamp": "2025-01-15 13:39:03"
}
```

Treat every key except `timestamp` as a field name. These always arrive as HTTP 400.

### Shape 4: the API gateway error

```json
{
    "code": "900901",
    "message": "Invalid Credentials",
    "description": "Invalid JWT token. Make sure you have provided the correct security credentials"
}
```

A numeric code, not an `ABDM-` code, plus a `description` field the other shapes lack. This comes from the API gateway in front of the ABHA service, before your request reaches the business logic. It almost always means the `Authorization` header is wrong or expired.

### Codes

Code, message and error name are as published. The action column reads the message text by a documented rule, and says Unclassified where the rule could not classify one.

| Code | Message | What to do |
| --- | --- | --- |
| `ABDM-1001` | Subscription source update returned empty | Unclassified |
| `ABDM-1002` | Invalid frequency unit, it must be in HOUR, WEEK, DAY, MONTH, YEAR | Fix request |
| `ABDM-1006` | Invalid HIType, it must be in Prescription,DiagnosticReport,OPConsultation,DischargeSummary,ImmunizationRecor… | Fix request |
| `ABDM-1008` | SMS service currently disabled | Unclassified |
| `ABDM-1009` | Email service currently disabled | Unclassified |
| `ABDM-1010` | No pending care context found for this abha address | Unclassified |
| `ABDM-1013` | Invalid ABHA Number | Fix request |
| `ABDM-1016` | Invalid Timestamp | Fix request |
| `ABDM-1017` | Invalid Transaction Id | Fix request |
| `ABDM-1019` | Dependent Service Unavailable | Retry |
| `ABDM-1021` | Lack of required priviledges | Fix request |
| `ABDM-1022` | Too many requests | Retry |
| `ABDM-1029` | Redis server is unavailable | Retry |
| `ABDM-1030` | Request id not found | Fix request |
| `ABDM-1034` | Notification service unavailable | Retry |
| `ABDM-1045` | Database Access is restricted | Unclassified |
| `ABDM-1047` | Purpose does not exist | Fix request |
| `ABDM-1048` | Timeout | Retry |
| `ABDM-1065` | Health facility does not exist | Fix request |
| `ABDM-1066` | Please enter a valid Password | Unclassified |
| `ABDM-1094` | Access to this feature is restricted. Please contact NHA to enable it. | Fix auth |
| `ABDM-1094` | Invalid Benefit Name | Fix auth |
| `ABDM-1100` | You have requested multiple OTPs Or Exceeded maximum number of attempts for OTP match in this transaction. Pl… | Retry |
| `ABDM-1101` | This ABHA Address already exists. Please create with unique ABHA address | Fix request |
| `ABDM-1102` | Mobile number verification is pending. | Unclassified |
| `ABDM-1103` | Cannot link with CHILD ABHA Number | Unclassified |
| `ABDM-1104` | Cannot link with same ABHA Number | Unclassified |
| `ABDM-1105` | Invalid request for parent linking | Fix request |
| `ABDM-1107` | Invalid combinations of scopes | Fix request |
| `ABDM-1108` | Notification DB service unavailable | Retry |
| `ABDM-1109` | Invalid On discovery response | Fix request |
| `ABDM-1110` | Your new password must be different from your old password. Please enter a unique new password. | Unclassified |
| `ABDM-1111` | Invalid old password, please try with valid password. | Fix request |
| `ABDM-1112` | The provided gender does not match the gender in DigiLocker records | Unclassified |
| `ABDM-1113` | Duplicate health information provider data flow response data flow resoponse | Fix request |
| `ABDM-1114` | The provided name does not match the name in DigiLocker records | Unclassified |
| `ABDM-1115` | Invalid patient information. At least one patient information is required. | Fix request |
| `ABDM-1116` | generate_and_save_link_token : 'NoneType' object has no attribute 'get' | Unclassified |
| `ABDM-1117` | Auto approval id is already active | Fix request |
| `ABDM-1118` | Login via ABHA Number OTP is not allowed | Fix request |
| `ABDM-1119` | Login via Aadhaar OTP is not allowed | Fix request |
| `ABDM-1121` | Invalid Enrolment Number | Fix request |
| `ABDM-1122` | Request can not be processed | Unclassified |
| `ABDM-1124` | The mobile number provided by you is already linked to 6 ABHA Numbers. Please provide a different Mobile Numb… | Fix request |
| `ABDM-1126` | F-Token Expired | Fix request |
| `ABDM-1127` | Invalid F-Token | Fix request |
| `ABDM-1132` | Kindly enter valid linked ABHA Address | Unclassified |
| `ABDM-1133` | Please enter a valid captcha result. Entered captcha result is incorrect. | Fix request |
| `ABDM-1134` | Deactivated ABHA Account | Cannot proceed |
| `ABDM-1135` | The email address provided by you is already linked to 6 ABHA Numbers. Please provide a different email Id. | Fix request |
| `ABDM-1136` | message should not be null or empty. | Unclassified |
| `ABDM-1137` | Benefit Name Not Found | Fix request |
| `ABDM-1138` | The benefit record has already been de-linked | Treat as success |
| `ABDM-1139` | Benefit record not found | Fix request |
| `ABDM-1140` | The benefit record has already been linked | Treat as success |
| `ABDM-1141` | An existing ABHA number created using this Aadhaar number has been found. It is advisable to delete this acco… | Unclassified |
| `ABDM-1142` | Please enter a valid captcha. Entered captcha is expired. | Fix request |
| `ABDM-1143` | Captcha limit exceeded. | Unclassified |
| `ABDM-1144` | Incorrect facility ID or password. | Fix request |
| `ABDM-1155` | Parents must be 18 years of age or older to create a Child ABHA Account | Unclassified |
| `ABDM-1156` | Please ensure that the mobile number is mapped to the parent's ABHA number | Unclassified |
| `ABDM-1157` | Child ABHA’s account limit has been exceeded for the requested Abha ID number ‘(.*?) | Unclassified |
| `ABDM-1158` | Invalid X-Token | Fix request |
| `ABDM-1159` | Children’s ages should be below '(.*?)' years as of the current date | Unclassified |
| `ABDM-1160` | Non KYC CHILD ABHA is allowed to update their profile only once | Unclassified |
| `ABDM-1200` | LGD Gateway is unavailable | Retry |
| `ABDM-1201` | IDP Gateway is unavailable | Retry |
| `ABDM-1202` | Document Gateway is unavailable | Retry |
| `ABDM-1203` | TEST | Unclassified |
| `ABDM-1204` | A UIDAI failure passed through. The UIDAI code and text sit inside the message string | Fix request |
| `ABDM-1205` | Document DB Gateway is unavailable | Retry |
| `ABDM-1206` | Aadhaar Gateway is unavailable | Retry |
| `ABDM-1207` | The information you provided does not match the details on record with Aadhaar. Please verify and provide acc… | Fix request |
| `ABDM-1211` | Email Sending Limit Exceeded | Unclassified |
| `ABDM-1218` | Role for the user does not exist. | Fix request |
| `ABDM-1219` | Your ABHA is linked with govt benefit programme, so it can not be deleted- ABDM, National Health Authority. | Unclassified |
| `ABDM-1220` | Sorry, Unable to process your request at this time. Please try again later. | Retry |
| `ABDM-1224` | Login via Biometric is not allowed. | Fix auth |
| `ABDM-1226` | Vault service unavailable | Retry |
| `ABDM-1227` | This client ID has reached the maximum limit of 100 ABHA account creations. | Unclassified |
| `ABDM-1228` | Your ABHA is linked with govt benefit programme, so it can not be deactivated- ABDM, National Health Authorit… | Cannot proceed |
| `ABDM-9999` | Recorded as `ABDM-9999: ` with an `ABDM-1094` message stuck to the front of the text | Fix auth |

### Codes, untagged

The same collection, and the only source that recorded HTTP statuses.

| Code | HTTP | Message | What to do |
| --- | --- | --- | --- |
| `900901` | 401 | Invalid Credentials, invalid JWT token. From the API gateway in front of the ABHA service, before your reques… | Fix auth |
| `900900` | 500 | Unclassified authentication failure. The one saved example had a bad path and a bad token together, so read i… | Fix auth |
| `404` | 404 | No matching resource found for given API Request`. A wrong path, not a missing record | Fix request |

### Codes, uidai

Codes from the Unique Identification Authority of India, passed through inside the message of ABDM-1204. More codes pass through than are listed here, so parse the message.

| Code | Message | What to do |
| --- | --- | --- |
| `300` | Biometric mismatch |  |
| `561` | Request expired |  |
| `563` | Duplicate request |  |
| `810` | Missing biometric data |  |

A code you meet that is not above is one the specifications do not carry yet. Read the code together with the message: a code can appear twice with different meanings.

## Test cases

61 cases, from NHA's M1 matrix for ABHA identity, registration and login. "Mandatory" is NHA's own marking.

### ABHA creation, Aadhaar OTP

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `CRT_ABHA_101` | Mandatory | Offer ABHA creation | `POST /v3/enrollment/request/otp` | The user is offered ABHA creation by Aadhaar OTP, and a code arrives on the mobile number linked to their Aad… |
| `B1` | Mandatory | Create the ABHA number | `POST /v3/enrollment/enrol/byAadhaar` | The person types the code and comes out with a 14 digit ABHA number. |
| `B2` | Optional | Reject a wrong Aadhaar OTP | `POST /v3/enrollment/enrol/byAadhaar` | A wrong code fails cleanly and creates nothing. |
| `B3` | Optional | Reject a reused transaction id | `POST /v3/enrollment/enrol/byAadhaar` | A finished attempt cannot be replayed to create a second ABHA. |
| `CRT_ABHA_102` | Mandatory | Request a communication mobile OTP | `POST /v3/enrollment/request/otp` | A code reaches the number the person wants health messages on. |
| `C1` | Mandatory | Verify the communication mobile | `POST /v3/enrollment/auth/byAbdm` | The number the person named is now on their profile. |
| `C2` | Optional | Keep the two OTP systems apart | `POST /v3/enrollment/enrol/byAadhaar` | A code from NHA is refused at the Aadhaar endpoint. |
| `C3` | Optional | Accept a non Aadhaar mobile number | `POST /v3/enrollment/request/otp` | A family phone or a changed number works as the communication number. |
| `CRT_ABHA_103` | Optional | Request an email verification OTP | `POST /v3/enrollment/request/otp` | A code reaches the email address the person gave. |
| `CRT_ABHA_104` | Optional | Verify the email address | `POST /v3/enrollment/auth/byAbdm` | The email address is attached to the new account. |
| `CRT_ABHA_105` | Mandatory | Show ABHA address suggestions | `GET /v3/enrollment/enrol/suggestion` | The person sees a list of addresses to pick from, or types their own. |
| `B4` | Mandatory | Link the chosen ABHA address | `POST /v3/enrollment/enrol/abha-address` | The address the person chose is the address they end up with. |

### ABHA creation, Aadhaar biometric

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `CRT_BIO_201` | Optional | Capture a fingerprint or iris |  | An Aadhaar registered device produces a signed capture of the person's fingerprint or iris. |
| `CRT_BIO_202` | Optional | Create the ABHA from the scan | `POST /v3/enrollment/enrol/byAadhaar` | The person gets a 14 digit ABHA number without typing a code. |
| `CRT_BIO_203` | Optional | Start a face authentication | `POST /v3/enrollment/enrol/auth/init` | The portal shows a QR code for the person to scan with the ABHA app. |
| `CRT_BIO_204` | Optional | Poll for the captured block | `POST /v3/enrollment/enrol/capturePID` | The portal waits until the person has finished on their phone, then moves on. |
| `CRT_BIO_205` | Optional | Create the ABHA from the face | `POST /v3/enrollment/enrol/byAadhaar` | The person gets a 14 digit ABHA number after face authentication. |

### ABHA creation, demographic authentication

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `CRT_DEMO_301` | Mandatory | Create the ABHA from demographics | `POST /v3/enrollment/enrol/byAadhaar` | The person gets a 14 digit ABHA number with no code and no scan. |
| `CRT_DEMO_302` | Optional | List the child accounts | `GET /v3/enrollment/profile/children` | The children mapped to a parent's ABHA number come back. |

### ABHA creation, driving licence or PAN

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `CRT_DOC_401` | Optional | Request a mobile OTP | `POST /v3/enrollment/request/otp` | A code reaches the mobile number the person gave. |
| `CRT_DOC_402` | Optional | Verify the mobile OTP | `POST /v3/enrollment/auth/byAbdm` | The mobile number is confirmed before the document goes anywhere. |
| `CRT_DOC_403` | Optional | Create the ABHA from the document | `POST /v3/enrollment/enrol/byDocument` | The person gets an ABHA number from an identity document instead of Aadhaar. |

### ABHA verification, Aadhaar OTP

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `VER_AADHAAR_501` | Mandatory | Request a login OTP from Aadhaar | `POST /v3/profile/login/request/otp` | A code reaches the mobile number linked to the person's Aadhaar. |
| `D2` | Mandatory | Verify the login OTP | `POST /v3/profile/login/verify` | A person who knows their 14 digit number is signed in. |
| `VER_AADHAAR_502` | Mandatory | Request an Aadhaar login OTP | `POST /v3.1/profile/login/request/otp` | A person who typed their Aadhaar number gets a code. |
| `VER_AADHAAR_503` | Mandatory | Verify the Aadhaar login OTP | `POST /v3.1/profile/login/verify` | The person is signed in with their Aadhaar number. |

### ABHA verification, mobile OTP

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `VER_MOBILE_601` | Mandatory | Request a login OTP by mobile | `POST /v3/profile/login/request/otp` | A code reaches the person, and the screen names the masked number it went to. |
| `VER_MOBILE_602` | Mandatory | Verify the mobile OTP | `POST /v3/profile/login/verify` | The code is accepted and the accounts on that number are offered. |
| `D1` | Mandatory | Pick an account and sign in | `POST /v3/profile/login/verify/user` | The person picks their ABHA from the list and is logged in. |
| `D3` | Optional | Reject a wrong login OTP | `POST /v3/profile/login/verify` | A wrong code does not log anybody in. |
| `VER_MOBILE_603` | Mandatory | Sign in by ABHA number | `POST /v3/profile/login/request/otp` | A person who knows their 14 digit number signs in with a code from NHA. |

### ABHA verification, biometric

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `VER_BIO_701` | Optional | Start a face login transaction | `POST /v3/enrollment/enrol/auth/init` | The portal shows a QR code for the person to scan with the ABHA app. |
| `VER_BIO_702` | Optional | Verify the face capture | `POST /v3.1/profile/login/verify` | The person is signed in after face authentication. |
| `VER_BIO_703` | Optional | Sign in by fingerprint or iris | `POST /v3.1/profile/login/verify` | The person is signed in with a scan from an Aadhaar registered device. |

### Fetch ABHA by mobile number

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `FND_MOBILE_801` | Mandatory | Encrypt the mobile number | `POST /v3/phr/app/enrollment/encrypt` | The mobile number leaves your system scrambled. |
| `FND_MOBILE_802` | Mandatory | Search for the accounts | `POST /v3/profile/account/abha/search` | The ABHA accounts held against that mobile number come back. |
| `FND_MOBILE_803` | Mandatory | Request a login OTP | `POST /v3/profile/login/request/otp` | A code reaches the person for the account they chose. |
| `FND_MOBILE_804` | Mandatory | Verify the OTP and sign in | `POST /v3/profile/login/verify` | The person is signed in to the ABHA they picked. |

### Fetch ABHA by Aadhaar number

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `FND_AADHAAR_901` | Optional | Find the ABHA behind an Aadhaar | `GET /v3/profile/benefit/search/abhaByAadhaar` | The ABHA number recorded against that Aadhaar number comes back. |
| `FND_AADHAAR_902` | Optional | Find the Aadhaar behind an ABHA | `GET /v3/profile/benefit/search/aadhaarByAbha` | The Aadhaar number recorded against that ABHA number comes back. |
| `F5` | Optional | Reject a restricted endpoint |  | A private integrator is turned away from the benefit endpoints. |

### ABHA QR code

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `QR_ABHA_1001` | Mandatory | Get the ABHA QR code | `GET /v3/profile/account/qrCode` | The person sees the QR code that shares their ABHA at a facility desk. |
| `QR_ABHA_1002` | Mandatory | Generate the ABHA card | `GET /v3/profile/account/abha-card` | The person sees their ABHA card. |
| `QR_ABHA_1003` | Mandatory | Download the ABHA card | `GET /v3/profile/account/download-abha-card` | The person can save their ABHA card as a file. |
| `E3` | Mandatory | Check the card and code render |  | The card and the QR code both come back and can be shown to the person. |

### Profile update

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `UPD_ABHA_1101` | Optional | Request a new number OTP | `POST /v3/profile/account/request/otp` | A code reaches the number the person wants to move to. |
| `C4` | Optional | Verify the profile change | `POST /v3/profile/account/verify` | The new number shows on the person's profile. |
| `UPD_ABHA_1102` | Optional | Change email, password or KYC | `POST /v3/profile/account/request/otp` | The same pair of calls covers the other profile changes. |
| `UPD_ABHA_1103` | Optional | Update self declared details | `PATCH /v3/profile/account` | The person's self declared details change on their profile. |

### Share patient profile

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `E1` | Mandatory | Read the profile back | `GET /v3/profile/account` | The profile shows the ABHA number, address and mobile the person created. |
| `E2` | Mandatory | Check both tokens are needed | `GET /v3/profile/account` | The profile comes back only when your system and the person both prove themselves. |
| `SHR_ABHA_1201` | Mandatory | Share the profile at the desk |  | The person shares their ABHA address and profile with the facility after consenting. |

### Session and tokens

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `A1` | Mandatory | Get a gateway access token | `POST /api/hiecm/gateway/v3/sessions` | Your system can prove who it is to NHA. |
| `A3` | Mandatory | Encrypt the sensitive fields | `POST /v3/phr/app/enrollment/encrypt` | The Aadhaar number, mobile number and code that leave your system are scrambled, not readable. |
| `A2` | Optional | Reject a call with no token | `GET /v3/profile/account` | A call that carries no token is refused. |
| `D4` | Mandatory | Refresh the user token | `GET /v3/profile/account/request/token` | A session longer than half an hour keeps working without showing the person an error. |
| `D5` | Optional | End the session | `GET /v3/profile/account/request/logout` | When the person logs out, their token stops working. |
| `F1` | Optional | Reject an unknown path |  | A wrong URL gives a clear not found. |
| `F2` | Optional | Reject an empty body | `POST /v3/profile/login/verify` | An empty request names the fields it wanted. |
| `F3` | Optional | Reject a malformed token |  | A broken Authorization value is refused. |
| `F4` | Optional | Reject a short ABHA number |  | A 13 digit ABHA number is refused. |

## Where the detail is

- Every endpoint, with its body fields and responses: /docs/hiecm/v3/api/m1
- The flows as diagrams: /docs/hiecm/v3/milestones/m1
- Every error code across modules: /docs/hiecm/v3/reference/error-codes
- Sandbox test data: /docs/hiecm/v3/reference/data-dictionary
- Terms: /docs/hiecm/v3/getting-started/glossary
