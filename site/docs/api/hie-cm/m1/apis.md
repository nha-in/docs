---
title: M1 API reference
sidebar_label: APIs
sidebar_position: 7
description: Every M1 endpoint with its method, path, headers, request fields, response fields and a curl sample.
verification: unverified
source: ABDM__M1_ABHA_Collection.postman_collection.md
---

# M1 API reference

This page lists the Milestone 1 ([M1](/docs/api/hie-cm/m1)) endpoints of [ABDM](/docs/overview/glossary#abdm). Each section gives the method, the path, what the call is for, the headers, the request fields, the response fields and a curl sample. The detail comes from [NHA](/docs/overview/glossary#nha)'s M1 [ABHA](/docs/overview/glossary#abha) Postman collection, which is the only M1 source that carries real request text. Read the [API sequence](/docs/api/hie-cm/m1/api-sequence) first if you want the call order.

:::note[Documented, not verified]
This page follows NHA's published document for the M1 ABHA Postman collection. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## How to read this page

The M1 surface is smaller than it looks. There are about twenty paths, and most of them are reused for several jobs. What changes is the `scope` array in the body. The same `POST enrollment/request/otp` sends the Aadhaar OTP, the mobile OTP and the email OTP. The scope tells NHA's service which one you mean.

Two more things to know before the tables.

**Sensitive fields travel encrypted.** Aadhaar numbers, mobile numbers, email addresses, OTP values and passwords are RSA encrypted with NHA's public certificate before they go in the body. Placeholders below are named for that, for example `<RSA_ENCRYPTED_AADHAAR_NUMBER>`.

**There are two tokens, and they are not interchangeable.** The gateway access token from the sessions call goes in `Authorization`. The user token you get back from an enrolment or a login goes in `X-token`. Profile endpoints need both.

## Base URLs

| Environment | Base URL |
|---|---|
| Sandbox ABHA service | `https://abhasbx.abdm.gov.in/abha/api/v3/` |
| Production ABHA service | `https://abha.abdm.gov.in/api/abha/v3/` |
| Sandbox gateway (sessions only) | `https://apissbx.abdm.gov.in/api/hiecm/` |

The Postman collection uses variables named `aws-sbx` and `aws-prod` for the ABHA base URL, and the export ships them empty. The samples below use the sandbox base URL from NHA's M1 document. Several requests in the collection are saved against `aws-prod` rather than `aws-sbx`. Neither source says the two hosts differ in anything but the host name, and we have not compared them.

A few login routes use v3.1 instead of v3, at `https://abhasbx.abdm.gov.in/abha/api/v3.1/`. Those are called out in their sections.

## Common headers

| Header | Value | Sent on |
|---|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` | Every ABHA service call |
| `REQUEST-ID` | A fresh UUID for each call | Every call, including sessions |
| `TIMESTAMP` | An ISO 8601 UTC timestamp | Every call, including sessions |
| `Content-Type` | `application/json` | Every call with a body |
| `X-token` | `Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>` | Profile endpoints, after login |
| `R-token` | `Bearer <REFRESH_TOKEN_FROM_LOGIN_VERIFY>` | The refresh token call only |
| `TRANSACTION_ID` | `<TXN_ID_FROM_ENROL_BY_AADHAAR>` | The ABHA address suggestion call only |
| `X-CM-ID` | `sbx` | The sessions call only |
| `BENEFIT_NAME` | Your registered benefit name | Some enrolment calls, see below |

`REQUEST-ID` and `TIMESTAMP` appear on the requests throughout the collection, the sessions call included. Postman fills them with `{{$randomUUID}}` and `{{$isoTimestamp}}`, so generate a new pair per call rather than reusing one.

`BENEFIT_NAME` is enabled on the enrol and search calls and disabled on the OTP request calls. The collection uses the literal value `healthid api`. Government integrators using the benefit programme APIs need it. If you are a private integrator, follow what NHA gives you at onboarding.

## Endpoint index

| Endpoint | Method | Path | Purpose |
|---|---|---|---|
| [Get an access token](#get-an-access-token) | POST | `gateway/v3/sessions` | Exchange client credentials for a gateway token |
| [Encrypt a field](#encrypt-a-field) | POST | `phr/app/enrollment/encrypt` | Ask NHA to RSA encrypt one value |
| [Request an enrolment OTP](#request-an-enrolment-otp) | POST | `enrollment/request/otp` | Send an Aadhaar, mobile or email OTP during enrolment |
| [Enrol by Aadhaar](#enrol-by-aadhaar) | POST | `enrollment/enrol/byAadhaar` | Verify the Aadhaar factor and create the ABHA number |
| [Verify an enrolment OTP](#verify-an-enrolment-otp) | POST | `enrollment/auth/byAbdm` | Verify the mobile or email OTP that NHA sent |
| [Get ABHA address suggestions](#get-abha-address-suggestions) | GET | `enrollment/enrol/suggestion` | Fetch candidate ABHA addresses |
| [Link an ABHA address](#link-an-abha-address) | POST | `enrollment/enrol/abha-address` | Attach the chosen ABHA address |
| [Start a face or biometric transaction](#start-a-face-or-biometric-transaction) | POST | `enrollment/enrol/auth/init` | Open a transaction for face or biometric auth |
| [Poll PID capture](#poll-pid-capture) | POST | `enrollment/enrol/capturePID` | Check whether the device has returned a personal identity data (PID) block |
| [Enrol by document](#enrol-by-document) | POST | `enrollment/enrol/byDocument` | Create an ABHA from a driving licence |
| [Request a login OTP](#request-a-login-otp) | POST | `profile/login/request/otp` | Send the OTP that starts a login |
| [Verify a login](#verify-a-login) | POST | `profile/login/verify` | Complete a login and receive the user token |
| [Verify the user](#verify-the-user) | POST | `profile/login/verify/user` | Pick one ABHA when a mobile has several |
| [Search for an ABHA](#search-for-an-abha) | POST | `profile/account/abha/search` | Find ABHA accounts behind a mobile number |
| [Get the profile](#get-the-profile) | GET | `profile/account` | Read the logged in person's profile |
| [Update the profile](#update-the-profile) | PATCH | `profile/account` | Change a profile field such as the photo |
| [Get the ABHA QR code](#get-the-abha-qr-code) | GET | `profile/account/qrCode` | Fetch the quick response (QR) code for the account |
| [Generate the ABHA card](#generate-the-abha-card) | GET | `profile/account/abha-card` | Render the ABHA card |
| [Download the ABHA card](#download-the-abha-card) | GET | `profile/account/download-abha-card` | Download the ABHA card file |
| [Request a profile OTP](#request-a-profile-otp) | POST | `profile/account/request/otp` | Start a mobile update, email update, password change, re-KYC, delete or deactivate |
| [Verify a profile change](#verify-a-profile-change) | POST | `profile/account/verify` | Complete whichever profile change you started |
| [Refresh the user token](#refresh-the-user-token) | GET | `profile/account/request/token` | Swap a refresh token for a fresh user token |
| [Log out](#log-out) | GET | `profile/account/request/logout` | End the user session |

Government integrators also get the benefit programme endpoints under `profile/benefit/`. They are listed at the [bottom of this page](#government-only-endpoints).

## Get an access token

**POST** `https://apissbx.abdm.gov.in/api/hiecm/gateway/v3/sessions`

Exchange your sandbox client credentials for the gateway access token that every other M1 call carries. This is the only M1 call that does not itself need a token.

### Headers

| Header | Value |
|---|---|
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `X-CM-ID` | `sbx` |
| `Content-Type` | `application/json` |

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `clientId` | string | Yes | Your client ID from sandbox signup. The collection uses `healthid-api`. |
| `clientSecret` | string | Yes | Your client secret from sandbox signup. |
| `grantType` | string | Yes | `client_credentials`. |

### Response

The collection's test script reads `accessToken` from the response and stores it for later calls. That field is confirmed by the script. The collection saved no example body for this call, so the other response fields, including any expiry, are not transcribed from NHA's document.

| Field | What it is |
|---|---|
| `accessToken` | The gateway token. Send it as `Authorization: Bearer <token>` on every ABHA service call. |

```bash
curl -X POST 'https://apissbx.abdm.gov.in/api/hiecm/gateway/v3/sessions' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -d '{
    "clientId": "<CLIENT_ID_FROM_SANDBOX_SIGNUP>",
    "clientSecret": "<CLIENT_SECRET_FROM_SANDBOX_SIGNUP>",
    "grantType": "client_credentials"
  }'
```

## Encrypt a field

**POST** `phr/app/enrollment/encrypt`

Ask NHA's service to RSA encrypt one value for you. This is the alternative to fetching NHA's public certificate and encrypting the value yourself. NHA's M1 document also points at the RSA tool at [devbeaver.com](https://devbeaver.com/rsa-encryption-decryption-tool) for checking your work by hand. Do not send live personal data to a third party tool.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `KEY_TYPE` | `ABHA` |
| `Content-Type` | `application/json` |

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `data` | string | Yes | The plain value to encrypt. The collection passes a mobile number, and a commented out line shows an ABHA number works too. |

### Response

| Field | What it is |
|---|---|
| `encryptedData` | The encrypted value. Confirmed by the collection's test script, which stores it. No saved example body was recorded. |

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/encrypt' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -H 'KEY_TYPE: ABHA' \
  -d '{
    "data": "<PLAIN_MOBILE_NUMBER_OR_ABHA_NUMBER>"
  }'
```

## Request an enrolment OTP

**POST** `enrollment/request/otp`

One path, three jobs. It sends the Aadhaar [OTP](/docs/overview/glossary#otp) that starts an enrolment, the mobile OTP that verifies the communication number afterwards, and the optional email OTP. The `scope` array picks the job.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `Content-Type` | `application/json` |

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `scope` | array of string | Yes | `["abha-enrol"]` for the Aadhaar step. `["abha-enrol","mobile-verify"]` for the mobile step. `["abha-enrol","email-verify"]` for the email step. |
| `loginHint` | string | Yes | Which kind of identifier `loginId` holds: `aadhaar`, `mobile` or `email`. |
| `loginId` | string | Yes | The identifier, RSA encrypted. |
| `otpSystem` | string | Yes | `aadhaar` when the OTP goes to the Aadhaar linked mobile. `abdm` when NHA sends it. |
| `txnId` | string | Conditional | Omitted on the first Aadhaar call. Required on the mobile and email calls, carrying the transaction forward. |

### Response

| Field | What it is |
|---|---|
| `txnId` | The enrolment transaction ID. Confirmed by the collection's test script, which stores it into `lastResponseTxnId` and feeds it into the next call. |

No example body was saved for this path. A sibling OTP path did save one, and it is shown under [Request a login OTP](#request-a-login-otp). The shape looks the same, but that is inference, not something NHA's document states for this path.

```bash
# Step 1: the Aadhaar OTP that starts an enrolment
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -d '{
    "scope": ["abha-enrol"],
    "loginHint": "aadhaar",
    "loginId": "<RSA_ENCRYPTED_AADHAAR_NUMBER>",
    "otpSystem": "aadhaar"
  }'
```

```bash
# Step 3: the mobile OTP for the communication number
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -d '{
    "txnId": "<TXN_ID_FROM_ENROL_BY_AADHAAR>",
    "scope": ["abha-enrol", "mobile-verify"],
    "loginHint": "mobile",
    "loginId": "<RSA_ENCRYPTED_MOBILE_NUMBER>",
    "otpSystem": "abdm"
  }'
```

## Enrol by Aadhaar

**POST** `enrollment/enrol/byAadhaar`

Verify the Aadhaar factor and create the ABHA number. The `authMethods` array picks the factor: `otp`, `face_auth`, biometric or demographic. This is the call that issues the 14 digit ABHA number.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `BENEFIT_NAME` | Your registered benefit name, for example `healthid api` |
| `Content-Type` | `application/json` |

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `authData.authMethods` | array of string | Yes | The factor being used. `["otp"]` for the Aadhaar OTP route. |
| `authData.otp.txnId` | string | Yes for OTP | The `txnId` from the enrolment OTP request. |
| `authData.otp.otpValue` | string | Yes for OTP | The OTP the person typed, RSA encrypted. |
| `authData.otp.mobile` | string | No | The mobile number, masked in the collection sample as `788****828`. |
| `consent.code` | string | Yes | `abha-enrollment`. |
| `consent.version` | string | Yes | `1.4` in the collection. |

For the face auth route, `authMethods` is `["face_auth"]` and the `otp` object is replaced by a `face` object carrying a `txnId`. The rest of that object is in the collection but the face route is optional for both private and government integrators, so it is not expanded here.

### Response

Read off the collection's test script, which pulls these three out of the response:

| Field | What it is |
|---|---|
| `txnId` | The transaction ID, carried into the mobile verification step. |
| `tokens.token` | The user token. Send it as `X-token: Bearer <token>` on profile endpoints. |
| `tokens.refreshToken` | The refresh token. Send it as `R-token` when the user token expires. |
| `ABHAProfile.ABHANumber` | The new 14 digit ABHA number. |

The demographic auth variant of this same call reads `token` at the top level of the response instead of `tokens.token`. The collection contains both scripts. NHA's document does not explain the difference, and no example body was saved for either, so treat the exact envelope as unconfirmed.

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -H 'BENEFIT_NAME: <YOUR_REGISTERED_BENEFIT_NAME>' \
  -d '{
    "authData": {
      "authMethods": ["otp"],
      "otp": {
        "txnId": "<TXN_ID_FROM_REQUEST_OTP>",
        "otpValue": "<RSA_ENCRYPTED_AADHAAR_OTP>",
        "mobile": "<PLAIN_MOBILE_NUMBER>"
      }
    },
    "consent": {
      "code": "abha-enrollment",
      "version": "1.4"
    }
  }'
```

## Verify an enrolment OTP

**POST** `enrollment/auth/byAbdm`

Verify the OTP that NHA itself sent, as opposed to the one Aadhaar sent. Used for the communication mobile number and for the optional email address. The `scope` array says which.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `Content-Type` | `application/json` |

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `scope` | array of string | Yes | `["abha-enrol","mobile-verify"]` or `["abha-enrol","email-verify"]`. |
| `authData.authMethods` | array of string | Yes | `["otp"]`. |
| `authData.otp.txnId` | string | Yes | The `txnId` from the matching OTP request. |
| `authData.otp.otpValue` | string | Yes | The OTP the person typed, RSA encrypted. |

### Response

| Field | What it is |
|---|---|
| `txnId` | The transaction ID, carried into the next enrolment step. Confirmed by the test script. |

No example body was saved for this path, so the full response is not transcribed from NHA's document.

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/auth/byAbdm' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -d '{
    "scope": ["abha-enrol", "mobile-verify"],
    "authData": {
      "authMethods": ["otp"],
      "otp": {
        "txnId": "<TXN_ID_FROM_MOBILE_OTP_REQUEST>",
        "otpValue": "<RSA_ENCRYPTED_MOBILE_OTP>"
      }
    }
  }'
```

## Get ABHA address suggestions

**GET** `enrollment/enrol/suggestion`

Fetch candidate ABHA addresses for the person to pick from. The transaction is passed in a header on this call, not in a body.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `TRANSACTION_ID` | `<TXN_ID_FROM_PREVIOUS_ENROLMENT_STEP>` |
| `Accept` | `application/json, text/plain, */*` |

### Request body

None. The collection sends an empty body.

### Response

Not transcribed. The collection saved no example, and no test script reads any field, so the shape of the suggestion list is unknown from these sources.

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/suggestion' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -H 'TRANSACTION_ID: <TXN_ID_FROM_PREVIOUS_ENROLMENT_STEP>'
```

## Link an ABHA address

**POST** `enrollment/enrol/abha-address`

Attach the ABHA address the person chose. This is the last step of enrolment.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `Content-Type` | `application/json` |

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `txnId` | string | Yes | The enrolment transaction ID. |
| `abhaAddress` | string | Yes | The chosen address, without the suffix. The collection sample uses `panditakushal11`. |
| `preferred` | number | Yes | `1` marks this address as the preferred one. |

### Response

| Field | What it is |
|---|---|
| `healthIdNumber` | The ABHA number. Confirmed by the test script, which stores it. Note the field is named `healthIdNumber` here, not `ABHANumber` as in the enrol response. |

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/abha-address' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -d '{
    "txnId": "<TXN_ID_FROM_PREVIOUS_ENROLMENT_STEP>",
    "abhaAddress": "<ADDRESS_CHOSEN_BY_THE_PERSON>",
    "preferred": 1
  }'
```

## Start a face or biometric transaction

**POST** `enrollment/enrol/auth/init`

Open a transaction for the optional face auth and biometric routes. The transaction ID it returns becomes the QR code the person scans in the ABHA app.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `Content-Type` | `application/json` |

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `scope` | array of string | Yes | `["abha-enrol","face-auth"]` for the route without a PID block. The collection's comment says `face-verify` is the variant with a PID block. |

### Response

Not transcribed. The collection saved no example for this call. A sibling call on the login path did save one, showing `{"txnId": "...", "message": "Transaction Id generated Successfully"}`.

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/auth/init' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -d '{
    "scope": ["abha-enrol", "face-auth"]
  }'
```

## Poll PID capture

**POST** `enrollment/enrol/capturePID`

Check whether the Aadhaar registered device has returned a signed personal identity data block yet. Your system calls this on a loop while the person completes face authentication in the ABHA app.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `Content-Type` | `application/json` |

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `scope` | array of string | Yes | `["abha-enrol","face-verify"]`. |
| `txnId` | string | Yes | The transaction ID from the auth init call. |

### Response

The collection saved three real examples, all HTTP 200.

| `status` | `message` | What it means |
|---|---|---|
| `PENDING` | `Awaiting PID capture` | The person has not started. Keep polling. |
| `VERIFIED` | `Awaiting PID capture` | Face auth passed but the block has not arrived. Keep polling. |
| `COMPLETE` | `PID capture successful` | Done. The response also carries `txnId`. Stop polling and move on. |

All three come back as HTTP 200, so branch on `status`, not on the status code.

One caveat on where those examples came from. The `COMPLETE` example was saved against `enrollment/enrol/capturePID`, the path documented here. The `PENDING` and `VERIFIED` examples were saved against `enrollment/enrol/internal/capturePID`, a path that appears nowhere else in the collection and that NHA's M1 document does not mention. The three status values look like one state machine, but whether the public path returns all three is not confirmed.

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/capturePID' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -d '{
    "scope": ["abha-enrol", "face-verify"],
    "txnId": "<TXN_ID_FROM_AUTH_INIT>"
  }'
```

## Enrol by document

**POST** `enrollment/enrol/byDocument`

Create an ABHA from a driving licence instead of Aadhaar. The collection has this flow, but NHA's M1 document does not describe it in the four creation routes it lists, so treat it as outside the mandatory path until NHA confirms otherwise.

The flow is three calls: `enrollment/request/otp`, then `enrollment/auth/byAbdm`, then this one. The collection's test script on this call reads `tokens.token` and `tokens.refreshToken` from the response, the same envelope as [Enrol by Aadhaar](#enrol-by-aadhaar). The request body for the document call is in the collection but is not reproduced here, because NHA's M1 document gives no field definitions for it.

## Request a login OTP

**POST** `profile/login/request/otp`

Send the OTP that starts a login. One path serves login by mobile number, by Aadhaar number, by ABHA number and by ABHA address. The `loginHint` and `otpSystem` fields pick the route.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `Content-Type` | `application/json` |

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `scope` | array of string | Yes | Always starts with `abha-login`. Add `mobile-verify` for a mobile OTP or `aadhaar-verify` for an Aadhaar OTP. |
| `loginHint` | string | Yes | `mobile`, `abha-number`, `aadhaar` or `index`. |
| `loginId` | string | Yes | The identifier, RSA encrypted. |
| `otpSystem` | string | Yes | `abdm` or `aadhaar`. |
| `txnId` | string | Conditional | Sent when the login follows an ABHA search, carrying the search transaction. |

The four combinations the collection uses:

| Login route | `scope` | `loginHint` | `otpSystem` |
|---|---|---|---|
| Mobile number | `["abha-login","mobile-verify"]` | `mobile` | `abdm` |
| ABHA number, Aadhaar OTP | `["abha-login","aadhaar-verify"]` | `abha-number` | `aadhaar` |
| ABHA number, mobile OTP | `["abha-login","mobile-verify"]` | `abha-number` | `abdm` |
| After an ABHA search | `["abha-login","search-abha","mobile-verify"]` | `index` | `abdm` |

The v3.1 route for login by Aadhaar number uses a third scope value, `aadhaar-otp-verify`, and `loginHint` of `aadhaar`. Its base URL is `https://abhasbx.abdm.gov.in/abha/api/v3.1/`.

### Response

Two real examples were saved on this path.

```json
{
    "txnId": "f0166d90-64bc-4cb2-8ef0-08ff1cf3ac8e",
    "message": "OTP is sent to Mobile number ending with ******0161"
}
```

```json
{
    "txnId": "905d71dd-bd43-47ba-a3b4-ff860f9dc839",
    "message": "Transaction Id generated Successfully"
}
```

| Field | What it is |
|---|---|
| `txnId` | The login transaction ID. Send it in the verify call. |
| `message` | Human readable status. The masked mobile in the first example is useful to show the person which number to check. |

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -d '{
    "scope": ["abha-login", "mobile-verify"],
    "loginHint": "mobile",
    "loginId": "<RSA_ENCRYPTED_MOBILE_NUMBER>",
    "otpSystem": "abdm"
  }'
```

## Verify a login

**POST** `profile/login/verify`

Complete the login and receive the user token. Every login route ends here, whether the factor was an OTP, a password, a face or a biometric.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `Content-Type` | `application/json` |

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `scope` | array of string | Yes | The same scope you used on the OTP request. |
| `authData.authMethods` | array of string | Yes | `["otp"]` or `["password"]`. Face and biometric use their own values. |
| `authData.otp.txnId` | string | Yes for OTP | The `txnId` from the OTP request. |
| `authData.otp.otpValue` | string | Yes for OTP | The OTP the person typed, RSA encrypted. |
| `authData.password.ABHANumber` | string | Yes for password | The ABHA number in `91-XXXX-XXXX-XXXX` form. |
| `authData.password.password` | string | Yes for password | The password, RSA encrypted. |

The password route uses `scope` of `["abha-login","password-verify"]`.

### Response

A real example was saved for the face auth variant of this call, HTTP 200. Tokens are shortened here.

```json
{
    "txnId": "d17cb533-9bfa-40f5-a7bc-b84143516787",
    "authResult": "success",
    "message": "Aadhaar Face Authentication Success",
    "token": "eyJhbGciOiJSUzUxMiJ9...",
    "expiresIn": 1800,
    "refreshToken": "eyJhbGciOiJSUzUxMiJ9..."
}
```

| Field | What it is |
|---|---|
| `txnId` | The login transaction ID. |
| `authResult` | `success` on a good login. |
| `message` | Human readable status. |
| `token` | The user token. Send it as `X-token: Bearer <token>` on profile endpoints. |
| `expiresIn` | Token life in seconds. `1800` in the saved example, so thirty minutes. |
| `refreshToken` | Use it with the [refresh call](#refresh-the-user-token) when `token` expires. |

The collection's test scripts on the OTP and password routes read `token` and `refreshToken` from the same top level, so this envelope looks common across routes. That is inference from the scripts, not a statement in NHA's document.

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -d '{
    "scope": ["abha-login", "mobile-verify"],
    "authData": {
      "authMethods": ["otp"],
      "otp": {
        "txnId": "<TXN_ID_FROM_LOGIN_REQUEST_OTP>",
        "otpValue": "<RSA_ENCRYPTED_LOGIN_OTP>"
      }
    }
  }'
```

## Verify the user

**POST** `profile/login/verify/user`

One mobile number can have several ABHA accounts behind it. After the mobile OTP passes, this call picks which one the person meant. It is the third and last call of the login by mobile number route.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `T-token` | `Bearer <TRANSACTION_TOKEN_FROM_LOGIN_VERIFY>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `Content-Type` | `application/json` |

The `T-token` header is unusual. It appears on this call only, and the collection fills it from the token returned by the preceding verify call.

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `ABHANumber` | string | Yes | The ABHA number the person picked, in `91-XXXX-XXXX-XXXX` form. |
| `txnId` | string | Yes | The login transaction ID. |

### Response

| Field | What it is |
|---|---|
| `token` | The user token for the chosen account. Confirmed by the test script. |
| `refreshToken` | The matching refresh token. Confirmed by the test script. |

No example body was saved for this call.

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify/user' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'T-token: Bearer <TRANSACTION_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -d '{
    "ABHANumber": "<ABHA_NUMBER_CHOSEN_BY_THE_PERSON>",
    "txnId": "<TXN_ID_FROM_LOGIN_VERIFY>"
  }'
```

## Search for an ABHA

**POST** `profile/account/abha/search`

Find the ABHA accounts behind a mobile number. This is the first call of the find ABHA flow, for a person who knows their mobile number but not their ABHA number.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `BENEFIT_NAME` | Your registered benefit name |
| `Content-Type` | `application/json` |

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `scope` | array of string | Yes | `["search-abha"]`. |
| `mobile` | string | Yes | The mobile number, RSA encrypted. |

### Response

The two sources inside the collection disagree here, so read this carefully before you write your parser.

The collection's test script reads `jsonData[0].txnId`, which means it expects a JSON array with a `txnId` on each element. That fits the purpose: one mobile can map to several accounts.

The saved example on the same request is a single object, and it looks like a response from a different path:

```json
{
    "txnId": "f0166d90-64bc-4cb2-8ef0-08ff1cf3ac8e",
    "message": "OTP is sent to Mobile number ending with ******0161"
}
```

The saved example also carries a URL of `profile/login/request/otp`, not the search path, so it was almost certainly saved against the wrong request. Trust the script over the example, and confirm against sandbox before you rely on either. We have not run this call.

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/abha/search' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -H 'BENEFIT_NAME: <YOUR_REGISTERED_BENEFIT_NAME>' \
  -d '{
    "scope": ["search-abha"],
    "mobile": "<RSA_ENCRYPTED_MOBILE_NUMBER>"
  }'
```

## Get the profile

**GET** `profile/account`

Read the logged in person's profile. This is the call that proves your login worked end to end.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `X-token` | `Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |

Both tokens are required. The gateway token says your system is allowed to call. The user token says which person's profile to return.

### Request body

None.

### Response

No example was saved for the GET. The collection did save one for the PATCH on the same path, and the field list below is taken from it. The saved example holds a sandbox person's ABHA number, ABHA address, mobile number, name and email address. Those five are replaced with placeholders below. The key names, the date of birth and the gender are as saved, so you can read the formats off them.

```json
{
    "ABHANumber": "91-XXXX-XXXX-XXXX",
    "preferredAbhaAddress": "91XXXXXXXXXXXX@abdm",
    "mobile": "XXXXXXXXXX",
    "firstName": "Given",
    "middleName": "",
    "lastName": "Family",
    "name": "Given Family",
    "yearOfBirth": "1998",
    "dayOfBirth": "31",
    "monthOfBirth": "05",
    "gender": "M",
    "email": "someone@example.com",
    "profilePhoto": "iVBORw0KGgoAAAANSUhEUg..."
}
```

| Field | What it is |
|---|---|
| `ABHANumber` | The 14 digit ABHA number, hyphenated. |
| `preferredAbhaAddress` | The ABHA address, with its suffix. |
| `mobile` | The communication mobile number, unmasked. |
| `firstName`, `middleName`, `lastName`, `name` | Name parts and the joined name. `middleName` can be an empty string. |
| `yearOfBirth`, `monthOfBirth`, `dayOfBirth` | Date of birth as three separate strings, zero padded. |
| `gender` | Single letter. `M` in the example. |
| `email` | Can be `null` when no email was verified. |
| `profilePhoto` | Base64 image data with no data URI prefix. |

Whether the GET returns exactly these fields is not confirmed. It is the same path, so the shape is likely to match, but NHA's document does not say so.

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'X-token: Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>'
```

## Update the profile

**PATCH** `profile/account`

Change a profile field. The collection only ever changes the photo.

### Headers

Same as [Get the profile](#get-the-profile), plus `Content-Type: application/json` and `BENEFIT_NAME`.

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `profilePhoto` | string | Yes | Base64 image data, no data URI prefix. |

### Response

The full profile object, as shown under [Get the profile](#get-the-profile).

```bash
curl -X PATCH 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'X-token: Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -H 'BENEFIT_NAME: <YOUR_REGISTERED_BENEFIT_NAME>' \
  -d '{
    "profilePhoto": "<BASE64_IMAGE_DATA_NO_DATA_URI_PREFIX>"
  }'
```

## Get the ABHA QR code

**GET** `profile/account/qrCode`

Fetch the QR code for the logged in account.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `X-token` | `Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |

### Request body

None.

### Response

Not transcribed. No example was saved and no script reads it. NHA's M1 document shows the response as a screenshot, which did not convert to text.

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/qrCode' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'X-token: Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>'
```

## Generate the ABHA card

**GET** `profile/account/abha-card`

Render the ABHA card for the logged in account.

Headers, body and response are the same story as [Get the ABHA QR code](#get-the-abha-qr-code). NHA's M1 document says the card is displayed in the response, but the example is a screenshot, so the content type and encoding are not transcribed.

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/abha-card' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'X-token: Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>'
```

## Download the ABHA card

**GET** `profile/account/download-abha-card`

Download the card as a file. Same headers as the two calls above. The response is not transcribed.

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/download-abha-card' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'X-token: Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>'
```

## Request a profile OTP

**POST** `profile/account/request/otp`

Start a change to an existing profile. One path covers mobile update, email update, password set or change, re-[KYC](/docs/overview/glossary#kyc), delete and deactivate. The `scope` array picks which.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `X-token` | `Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |
| `Content-Type` | `application/json` |

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `scope` | array of string | Yes | Always starts with `abha-profile`. See the table below. |
| `loginHint` | string | Yes | `mobile`, `email` or `abha-number`. |
| `loginId` | string | Yes | The identifier, RSA encrypted. |
| `otpSystem` | string | Yes | `abdm` or `aadhaar`. |

| Job | `scope` |
|---|---|
| Update the mobile number | `["abha-profile","mobile-verify"]` |
| Update the email address | `["abha-profile","email-verify"]` |
| Delete the ABHA number | `["abha-profile","delete"]` |

The password, re-KYC and deactivate flows use the same path with their own scope values. Those values are in the collection but NHA's M1 document does not define them in text, so they are not listed here as fact.

### Response

| Field | What it is |
|---|---|
| `txnId` | The transaction ID. Confirmed by the test scripts on all six flows, which store it. |

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'X-token: Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -d '{
    "scope": ["abha-profile", "mobile-verify"],
    "loginHint": "mobile",
    "loginId": "<RSA_ENCRYPTED_NEW_MOBILE_NUMBER>",
    "otpSystem": "abdm"
  }'
```

## Verify a profile change

**POST** `profile/account/verify`

Complete whichever profile change you started. Send back the same `scope`.

### Headers

Same as [Request a profile OTP](#request-a-profile-otp).

### Request body

| Field | Type | Required | What it is |
|---|---|---|---|
| `scope` | array of string | Yes | The same scope you sent on the OTP request. |
| `authData.authMethods` | array of string | Yes | `["otp"]`. |
| `authData.otp.txnId` | string | Yes | The `txnId` from the OTP request. |
| `authData.otp.otpValue` | string | Yes | The OTP the person typed, RSA encrypted. |
| `reasons` | array of string | Yes for delete | Free text reasons. The collection sample is `["I am planning to create a new ABHA number"]`. |

### Response

Not transcribed. Every test script on this path checks only that the status is 200 and reads no field.

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/verify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'X-token: Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>' \
  -d '{
    "scope": ["abha-profile", "mobile-verify"],
    "authData": {
      "authMethods": ["otp"],
      "otp": {
        "txnId": "<TXN_ID_FROM_PROFILE_REQUEST_OTP>",
        "otpValue": "<RSA_ENCRYPTED_PROFILE_OTP>"
      }
    }
  }'
```

## Refresh the user token

**GET** `profile/account/request/token`

Swap a refresh token for a fresh user token. The saved login example gives the user token a life of 1800 seconds, so a session that runs longer than thirty minutes needs this call.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `R-token` | `Bearer <REFRESH_TOKEN_FROM_LOGIN_VERIFY>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |

The refresh token goes in `R-token`, not in `X-token` and not in the body.

### Request body

None.

### Response

| Field | What it is |
|---|---|
| `token` | A fresh user token. Confirmed by the test script. |
| `refreshToken` | A fresh refresh token. Confirmed by the test script. Store both. |

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/token' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'R-token: Bearer <REFRESH_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>'
```

## Log out

**GET** `profile/account/request/logout`

End the user session.

### Headers

| Header | Value |
|---|---|
| `Authorization` | `Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` |
| `X-token` | `Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>` |
| `REQUEST-ID` | A fresh UUID |
| `TIMESTAMP` | ISO 8601 UTC |

### Request body

None.

### Response

Two real examples were saved, both HTTP 200 and both identical in shape.

```json
{
    "message": "You have been logged out",
    "timestamp": "2025-10-23 11:23:49"
}
```

| Field | What it is |
|---|---|
| `message` | `You have been logged out`. |
| `timestamp` | Server time as `YYYY-MM-DD HH:MM:SS`, not ISO 8601. The same format appears in several error bodies. |

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/logout' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'X-token: Bearer <USER_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'REQUEST-ID: <FRESH_UUID_PER_CALL>' \
  -H 'TIMESTAMP: <ISO_8601_UTC_TIMESTAMP>'
```

## Government only endpoints

NHA's M1 document marks the benefit programme APIs as available to government integrators only. If you are a private integrator, calling these returns `ABDM-1094`. See [errors](/docs/api/hie-cm/m1/errors).

| Endpoint | Method | Path | Purpose |
|---|---|---|---|
| Benefit search | POST | `profile/benefit/search` | Find benefit programmes for an ABHA number or XML UID |
| Benefit search by ABHA | GET | `profile/benefit/abha/{abhaNumber}` | Programmes for one ABHA number |
| State and district by ABHA | GET | `profile/benefit/abha/statedistrict/{abhaNumber}` | The state and district code on file |
| Insurance search | GET | `profile/benefit/abha/search/insurance/{abhaNumber}` | Insurance programmes linked to an ABHA number |
| Link or de-link | POST | `profile/benefit/linkAndDelink` | Attach or detach a benefit record |
| ABHA by Aadhaar | GET | `profile/benefit/search/abhaByAadhaar` | Look up an ABHA number from an Aadhaar number |
| Aadhaar by ABHA | GET | `profile/benefit/search/aadhaarByAbha` | The reverse lookup |
| Children of an ABHA | GET | `enrollment/profile/children` | Child ABHA numbers under a parent ABHA |

Child ABHA creation is restricted further still. NHA's document says access is given to specific government integrators on leadership approval.

## What is not on this page

Four things from NHA's M1 document have no transcribed detail, because the source shows them only as screenshots.

- The public certificate endpoint. NHA's document names a `public/certificate` API for fetching the public key, and points at it again under developer utilities. The curl example and the response are screenshots, so the full URL, the headers and the response body are not transcribed. The Postman collection does not contain this call.
- The response bodies for the QR code, ABHA card and download card calls.
- The full request body for the face auth and biometric enrolment routes.
- The Aadhaar demographic auth request body, which is mandatory for government integrators.

Next: [errors](/docs/api/hie-cm/m1/errors) for what comes back when a call fails, and [test cases](/docs/api/hie-cm/m1/test-cases) for what to run before you call M1 done. The interactive reference is at [M1 API reference](/reference/hiecm-m1).
