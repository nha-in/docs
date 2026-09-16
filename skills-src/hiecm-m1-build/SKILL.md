---
name: hiecm-m1-build
description: "Use when scaffolding an integration against ABDM M1 (ABHA creation, login and profile management): builds each journey as an observe-orient-decide-act loop against the sandbox."
---
# HIE-CM m1 build

Scaffolds an ABDM m1 integration one journey at a time. It covers ABHA creation, login and profile management.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### Session, tokens and certificate (`m1-session`)

**Act: the calls in this journey, in order**

#### 1. This API is invoked to generate keycloak token/access token. (`gateway_post_gateway_v3_sessions`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "SBX_0000",
  "clientSecret": "0******-***-***-***-a****",
  "grantType": "client_credentials"
}'
```

#### 2. Use Case: Used to Fetch Public Key (`m1_get_v3_profile_public_certificate`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/public/certificate \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8'
```

#### 3. Use Case: Request a token for accessing a user’s ABHA (`m1_get_v3_profile_account_request_token`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/token \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'R-token: Bearer {{R-jwtToken}}' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000
}
```

### ABHA creation, Aadhaar OTP (`m1-create-aadhaar-otp`)

**Act: the calls in this journey, in order**

#### 1. This API is invoked to generate keycloak token/access token. (`gateway_post_gateway_v3_sessions`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "SBX_0000",
  "clientSecret": "0******-***-***-***-a****",
  "grantType": "client_credentials"
}'
```

#### 2. Use Case: Used to Fetch Public Key (`m1_get_v3_profile_public_certificate`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/public/certificate \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8'
```

#### 3. Use Case: ABHA enrollment - Send OTP using Aadhaar number Mobile number, ABHA number and Email address (`m1_post_v3_enrollment_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "{{txnId}}",
  "scope": [
    "abha-enrol"
  ],
  "loginHint": "aadhaar",
  "loginId": "{{encrypted aadhaar number}}",
  "otpSystem": "aadhaar"
}'
```

#### 4. UseCase : Create ABHA number Via Aadhaar by verifying Aadhaar OTP, using Biometrics, using demoAuth and Child ABHA Creation. (`m1_post_v3_enrollment_enrol_byaadhaar`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted otp}}",
      "mobile": "{{mobile number}}"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```

#### 5. Use Case: ABHA enrollment - Send OTP using Aadhaar number Mobile number, ABHA number and Email address (optional) (`m1_post_v3_enrollment_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "{{txnId}}",
  "scope": [
    "abha-enrol",
    "mobile-verify"
  ],
  "loginHint": "mobile",
  "loginId": "{{encrypted mobileNumber}}",
  "otpSystem": "abdm"
}'
```

#### 6. UseCase : Verify- Mobile OTP (optional) (`m1_post_v3_enrollment_auth_byabdm`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/auth/byAbdm \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted otp}}"
    }
  }
}'
```

#### 7. UseCase: ABHA address suggestion (`m1_get_v3_enrollment_enrol_suggestion`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/suggestion \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TRANSACTION_ID: {{txnId}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 8. UseCase: Create ABHA address (`m1_post_v3_enrollment_enrol_abha_address`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/abha-address \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "{{txnId}}",
  "abhaAddress": "{{ABHA Address}}",
  "preferred": 1
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "23acf181-339d-4771-b532-5c5df4a28d19",
  "healthIdNumber": "91-7561-4088-XXXX",
  "preferredAbhaAddress": "<ABHA_ADDRESS>"
}
```

### ABHA creation, face authentication (`m1-create-face`)

**Act: the calls in this journey, in order**

#### 1. This API is invoked to generate keycloak token/access token. (`gateway_post_gateway_v3_sessions`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "SBX_0000",
  "clientSecret": "0******-***-***-***-a****",
  "grantType": "client_credentials"
}'
```

#### 2. Use Case: Used to Fetch Public Key (`m1_get_v3_profile_public_certificate`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/public/certificate \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8'
```

#### 3. UseCase : It will generate the Transaction ID. This Transaction ID will be used for whole face authentication process. (`m1_post_v3_enrollment_enrol_auth_init`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/auth/init \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
    "face-auth"
  ]
}'
```

#### 4. UseCase : This API is used to check the status of the transaction ID. (`m1_post_v3_enrollment_enrol_capturepid`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/capturePID \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
    "face-verify"
  ],
  "txnId": "ea1dc7aa-d7c3-40ab-bee8-84c6f1eb90fa"
}'
```

#### 5. UseCase : Create ABHA number Via Aadhaar by verifying Aadhaar OTP, using Biometrics, using demoAuth and Child ABHA Creation. (`m1_post_v3_enrollment_enrol_byaadhaar`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "face_auth"
    ],
    "face": {
      "txnId": "881f2bf5-7377-4067-b50e-1e6ff100b3cc",
      "aadhaar": "{{encrypted aadhaar number}}",
      "mobile": "{{mobile number}}"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```

#### 6. Use Case: ABHA enrollment - Send OTP using Aadhaar number Mobile number, ABHA number and Email address (optional) (`m1_post_v3_enrollment_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "{{txnId}}",
  "scope": [
    "abha-enrol",
    "mobile-verify"
  ],
  "loginHint": "mobile",
  "loginId": "{{encrypted mobileNumber}}",
  "otpSystem": "abdm"
}'
```

#### 7. UseCase : Verify- Mobile OTP (optional) (`m1_post_v3_enrollment_auth_byabdm`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/auth/byAbdm \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted otp}}"
    }
  }
}'
```

#### 8. UseCase: ABHA address suggestion (`m1_get_v3_enrollment_enrol_suggestion`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/suggestion \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TRANSACTION_ID: {{txnId}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 9. UseCase: Create ABHA address (`m1_post_v3_enrollment_enrol_abha_address`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/abha-address \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "{{txnId}}",
  "abhaAddress": "{{ABHA Address}}",
  "preferred": 1
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "23acf181-339d-4771-b532-5c5df4a28d19",
  "healthIdNumber": "91-7561-4088-XXXX",
  "preferredAbhaAddress": "<ABHA_ADDRESS>"
}
```

### ABHA creation, fingerprint (`m1-create-fingerprint`)

**Act: the calls in this journey, in order**

#### 1. This API is invoked to generate keycloak token/access token. (`gateway_post_gateway_v3_sessions`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "SBX_0000",
  "clientSecret": "0******-***-***-***-a****",
  "grantType": "client_credentials"
}'
```

#### 2. Use Case: Used to Fetch Public Key (`m1_get_v3_profile_public_certificate`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/public/certificate \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8'
```

#### 3. UseCase : Create ABHA number Via Aadhaar by verifying Aadhaar OTP, using Biometrics, using demoAuth and Child ABHA Creation. (`m1_post_v3_enrollment_enrol_byaadhaar`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "bio"
    ],
    "bio": {
      "aadhaar": "{{encrypted aadhaar number}}",
      "fingerPrintAuthPid": "{{fingerPrintAuthPid}}",
      "mobile": "{{mobile number}}"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```

#### 4. Use Case: ABHA enrollment - Send OTP using Aadhaar number Mobile number, ABHA number and Email address (optional) (`m1_post_v3_enrollment_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "{{txnId}}",
  "scope": [
    "abha-enrol",
    "mobile-verify"
  ],
  "loginHint": "mobile",
  "loginId": "{{encrypted mobileNumber}}",
  "otpSystem": "abdm"
}'
```

#### 5. UseCase : Verify- Mobile OTP (optional) (`m1_post_v3_enrollment_auth_byabdm`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/auth/byAbdm \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted otp}}"
    }
  }
}'
```

#### 6. UseCase: ABHA address suggestion (`m1_get_v3_enrollment_enrol_suggestion`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/suggestion \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TRANSACTION_ID: {{txnId}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 7. UseCase: Create ABHA address (`m1_post_v3_enrollment_enrol_abha_address`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/abha-address \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "{{txnId}}",
  "abhaAddress": "{{ABHA Address}}",
  "preferred": 1
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "23acf181-339d-4771-b532-5c5df4a28d19",
  "healthIdNumber": "91-7561-4088-XXXX",
  "preferredAbhaAddress": "<ABHA_ADDRESS>"
}
```

### ABHA creation, iris (`m1-create-iris`)

**Act: the calls in this journey, in order**

#### 1. This API is invoked to generate keycloak token/access token. (`gateway_post_gateway_v3_sessions`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "SBX_0000",
  "clientSecret": "0******-***-***-***-a****",
  "grantType": "client_credentials"
}'
```

#### 2. Use Case: Used to Fetch Public Key (`m1_get_v3_profile_public_certificate`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/public/certificate \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8'
```

#### 3. UseCase : Create ABHA number Via Aadhaar by verifying Aadhaar OTP, using Biometrics, using demoAuth and Child ABHA Creation. (`m1_post_v3_enrollment_enrol_byaadhaar`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "iris"
    ],
    "iris": {
      "aadhaar": "{{encrypted aadhaar number}}",
      "pid": "{{PID}}",
      "mobile": "{{mobile number}}"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```

#### 4. Use Case: ABHA enrollment - Send OTP using Aadhaar number Mobile number, ABHA number and Email address (optional) (`m1_post_v3_enrollment_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "{{txnId}}",
  "scope": [
    "abha-enrol",
    "mobile-verify"
  ],
  "loginHint": "mobile",
  "loginId": "{{encrypted mobileNumber}}",
  "otpSystem": "abdm"
}'
```

#### 5. UseCase : Verify- Mobile OTP (optional) (`m1_post_v3_enrollment_auth_byabdm`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/auth/byAbdm \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted otp}}"
    }
  }
}'
```

#### 6. UseCase: ABHA address suggestion (`m1_get_v3_enrollment_enrol_suggestion`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/suggestion \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TRANSACTION_ID: {{txnId}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 7. UseCase: Create ABHA address (`m1_post_v3_enrollment_enrol_abha_address`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/abha-address \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "{{txnId}}",
  "abhaAddress": "{{ABHA Address}}",
  "preferred": 1
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "23acf181-339d-4771-b532-5c5df4a28d19",
  "healthIdNumber": "91-7561-4088-XXXX",
  "preferredAbhaAddress": "<ABHA_ADDRESS>"
}
```

### ABHA creation, demographic authentication (`m1-create-demographic`)

**Act: the calls in this journey, in order**

#### 1. This API is invoked to generate keycloak token/access token. (`gateway_post_gateway_v3_sessions`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "SBX_0000",
  "clientSecret": "0******-***-***-***-a****",
  "grantType": "client_credentials"
}'
```

#### 2. Use Case: Used to Fetch Public Key (`m1_get_v3_profile_public_certificate`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/public/certificate \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8'
```

#### 3. UseCase : Create ABHA number Via Aadhaar by verifying Aadhaar OTP, using Biometrics, using demoAuth and Child ABHA Creation. (`m1_post_v3_enrollment_enrol_byaadhaar`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "demo_auth"
    ],
    "demo_auth": {
      "aadhaarNumber": "{{encrypted aadhaar number}}",
      "districtCode": "{{District code}}",
      "stateCode": "{{State code}}",
      "dateOfBirth": "{{DOB}}",
      "gender": "{{Gender}}",
      "name": "{{Full name}}",
      "mobile": "{{Mobile number}}",
      "profilePhoto": "{{Base64 plain String}}",
      "pinCode": "110092",
      "address": "House No.1234 Anand Vihar, Delhi"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```

#### 4. Use Case: Get User Profile Details (`m1_get_v3_profile_account`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "ABHANumber": "91-7561-4088-XXXX",
  "preferredAbhaAddress": "<ABHA_ADDRESS>",
  "mobile": "******0903",
  "firstName": "Username",
  "middleName": "Kailas",
  "lastName": "Shelke",
  "name": "Username Kailas Shelke",
  "yearOfBirth": "1999",
  "dayOfBirth": "26",
  "monthOfBirth": "06",
  "gender": "M",
  "profilePhoto": "<BASE64_PHOTO>",
  "status": "ACTIVE",
  "stateCode": "27",
  "districtCode": "478",
  "pincode": "424201",
  "address": "LOHARA, AT POST LOHARA TQ PACHORA DIST JALGAON, Lohara, Pachora, Jalgaon, Maharashtra",
  "kycPhoto": "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",
  "stateName": "MAHARASHTRA",
  "districtName": "JALGAON",
  "subdistrictName": "JALGAON",
  "authMethods": [
    "MOBILE_OTP",
    "AADHAAR_BIO",
    "AADHAAR_OTP",
    "DEMOGRAPHICS",
    "PASSWORD"
  ],
  "tags": {},
  "kycVerified": true,
  "verificationStatus": "VERIFIED",
  "verificationType": "AADHAAR",
  "localizedDetails": {
    "name": "कैलास कैलास शेळके",
    "stateName": "महाराष्ट्र",
    "districtName": "जळगाव",
    "villageName": "लोहारा",
    "townName": "मु पोस्ट लोहारा ता पाचोरा जि. जळगाव",
    "gender": "पुरुष",
    "localizedLabels": {
      "name": "नाव",
      "abhaNumber": "आभा क्रमांक",
      "abhaAddress": "आभा पत्ता",
      "gender": "लिंग",
      "dob": "जन्मतारीख",
      "mobile": "मोबाईल"
    }
  },
  "createdDate": "07-05-2024"
}
```

### ABHA creation, child ABHA (`m1-create-child`)

**Act: the calls in this journey, in order**

#### 1. UseCase : Create ABHA number Via Aadhaar by verifying Aadhaar OTP, using Biometrics, using demoAuth and Child ABHA Creation. (`m1_post_v3_enrollment_enrol_byaadhaar`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "child"
    ],
    "child": {
      "dayOfBirth": "{{day Of Birth}}",
      "monthOfBirth": "{{month Of Birth}}",
      "yearOfBirth": "{{year Of Birth}}",
      "gender": "{{Gender}}",
      "password": "",
      "name": "{{Name}}",
      "profilePhoto": "",
      "parentConsent": "true"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```

#### 2. UseCase: Get Child ABHA address (`m1_get_v3_enrollment_profile_children`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/profile/children \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'Content-Type: application/json' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'X-token: Bearer {{X-token}}'
```

#### 3. Use Case: Update the user ABHA Profile Photo , Update the Child ABHA Profile (`m1_patch_v3_profile_account`)

```bash
curl --request PATCH \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: <X_TOKEN>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaNumber": "91-5553-4126-XXXX",
  "dob": "21-2-2021",
  "name": "Mohite",
  "gender": "F"
}'
```

#### 4. Use Case: Send OTP - ReKyc, Update Mobile, Child ABHA KYC Request OTP (`m1_post_v3_profile_account_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-profile",
    "re-kyc"
  ],
  "loginHint": "aadhaar",
  "loginId": "{{encrypted aadhaar number}}",
  "otpSystem": "aadhaar"
}'
```

#### 5. Use Case: Verify OTP - ReKyc, Update Mobile, CHILD ABHA KYC (`m1_post_v3_profile_account_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-profile",
    "re-kyc"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted otp value}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "6e3c1761-8e4c-44a3-929e-32b2c16083d5",
  "authResult": "success",
  "message": "Password updated successfully",
  "accounts": [
    {
      "ABHANumber": "91-4173-3253-XXXX"
    }
  ]
}
```

### ABHA login, mobile number (`m1-login-mobile`)

**Act: the calls in this journey, in order**

#### 1. Use Case: ABHA Login - Send OTP using Aadhaar number, ABHA number, Mobile number, Biometric Login, Search ABHA, Find ABHA via Biometrics (`m1_post_v3_profile_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "mobile-verify"
  ],
  "loginHint": "mobile",
  "loginId": "{{encrypted mobile number}}",
  "otpSystem": "abdm"
}'
```

#### 2. Use Case: ABHA Login - Verify OTP using Aadhaar number, ABHA number, Mobile number, Biometric Verify Login, Find ABHA via Aadhaar, Mobile, Biometrics (`m1_post_v3_profile_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted OTP}}"
    }
  }
}'
```

#### 3. Use Case: This API is used to verify and confirm the selected ABHA user during login, so the correct account is authenticated and access is granted securely. (`m1_post_v3_profile_login_verify_user`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify/user \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'T-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "ABHANumber": "{{abha-number}}",
  "txnId": "{{txnId}}"
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000
}
```

### ABHA login, Aadhaar number (`m1-login-aadhaar`)

**Act: the calls in this journey, in order**

#### 1. Use Case: ABHA Login - Send OTP using Aadhaar number, ABHA number, Mobile number, Biometric Login, Search ABHA, Find ABHA via Biometrics (`m1_post_v3_profile_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-verify"
  ],
  "loginHint": "aadhaar",
  "loginId": "{{encrypted aadhaar-number}}",
  "otpSystem": "aadhaar"
}'
```

#### 2. Use Case: ABHA Login - Verify OTP using Aadhaar number, ABHA number, Mobile number, Biometric Verify Login, Find ABHA via Aadhaar, Mobile, Biometrics (`m1_post_v3_profile_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted OTP}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "authResult": "success",
  "message": "Password verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1296000,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": []
}
```

### ABHA login, ABHA number with Aadhaar OTP (`m1-login-abha-number-aadhaar-otp`)

**Act: the calls in this journey, in order**

#### 1. Use Case: ABHA Login - Send OTP using Aadhaar number, ABHA number, Mobile number, Biometric Login, Search ABHA, Find ABHA via Biometrics (`m1_post_v3_profile_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-verify"
  ],
  "loginHint": "abha-number",
  "loginId": "{{encrypted abha-number}}",
  "otpSystem": "aadhaar"
}'
```

#### 2. Use Case: ABHA Login - Verify OTP using Aadhaar number, ABHA number, Mobile number, Biometric Verify Login, Find ABHA via Aadhaar, Mobile, Biometrics (`m1_post_v3_profile_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted OTP}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "authResult": "success",
  "message": "Password verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1296000,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": []
}
```

### ABHA login, ABHA number with mobile OTP (`m1-login-abha-number-mobile-otp`)

**Act: the calls in this journey, in order**

#### 1. Use Case: ABHA Login - Send OTP using Aadhaar number, ABHA number, Mobile number, Biometric Login, Search ABHA, Find ABHA via Biometrics (`m1_post_v3_profile_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "mobile-verify"
  ],
  "loginHint": "abha-number",
  "loginId": "{{encrypted abha-number}}",
  "otpSystem": "abdm"
}'
```

#### 2. Use Case: ABHA Login - Verify OTP using Aadhaar number, ABHA number, Mobile number, Biometric Verify Login, Find ABHA via Aadhaar, Mobile, Biometrics (`m1_post_v3_profile_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted OTP}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "authResult": "success",
  "message": "Password verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1296000,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": []
}
```

### ABHA login, face authentication (`m1-login-face`)

**Act: the calls in this journey, in order**

#### 1. Use Case: ABHA Login - Send OTP using Aadhaar number, ABHA number, Mobile number, Biometric Login, Search ABHA, Find ABHA via Biometrics (`m1_post_v3_profile_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-face-verify"
  ],
  "loginHint": "abha-number",
  "loginId": "{{encrypted abha-number}}",
  "otpSystem": "abdm"
}'
```

#### 2. Use Case: ABHA Login - Verify OTP using Aadhaar number, ABHA number, Mobile number, Biometric Verify Login, Find ABHA via Aadhaar, Mobile, Biometrics (`m1_post_v3_profile_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-face-verify"
  ],
  "authData": {
    "authMethods": [
      "face"
    ],
    "face": {
      "txnId": "{{txnId}}",
      "faceAuthPid": "{{PID}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "authResult": "success",
  "message": "Password verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1296000,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": []
}
```

### ABHA login, fingerprint (`m1-login-fingerprint`)

**Act: the calls in this journey, in order**

#### 1. Use Case: ABHA Login - Send OTP using Aadhaar number, ABHA number, Mobile number, Biometric Login, Search ABHA, Find ABHA via Biometrics (`m1_post_v3_profile_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-verify"
  ],
  "loginHint": "abha-number",
  "loginId": "{{encrypted abha-number}}",
  "otpSystem": "abdm"
}'
```

#### 2. Use Case: ABHA Login - Verify OTP using Aadhaar number, ABHA number, Mobile number, Biometric Verify Login, Find ABHA via Aadhaar, Mobile, Biometrics (`m1_post_v3_profile_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-verify"
  ],
  "authData": {
    "authMethods": [
      "bio"
    ],
    "bio": {
      "txnId": "{{txnId}}",
      "fingerPrintAuthPid": "{{PID}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "authResult": "success",
  "message": "Password verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1296000,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": []
}
```

### ABHA login, iris (`m1-login-iris`)

**Act: the calls in this journey, in order**

#### 1. Use Case: ABHA Login - Send OTP using Aadhaar number, ABHA number, Mobile number, Biometric Login, Search ABHA, Find ABHA via Biometrics (`m1_post_v3_profile_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-iris-verify"
  ],
  "loginHint": "abha-number",
  "loginId": "{{encrypted abha-number}}",
  "otpSystem": "abdm"
}'
```

#### 2. Use Case: ABHA Login - Verify OTP using Aadhaar number, ABHA number, Mobile number, Biometric Verify Login, Find ABHA via Aadhaar, Mobile, Biometrics (`m1_post_v3_profile_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-iris-verify"
  ],
  "authData": {
    "authMethods": [
      "iris"
    ],
    "iris": {
      "txnId": "{{txnId}}",
      "irisAuthPid": "{{PID}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "authResult": "success",
  "message": "Password verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1296000,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": []
}
```

### ABHA login, ABHA address with mobile OTP (`m1-login-abha-address-mobile-otp`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Search ABHA Profile using ABHA address (`m1_post_v3_phr_web_login_abha_search`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/search \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>"
}'
```

#### 2. Use Case: Sends an OTP to the Mobile Number, Aadhaar Number, Request Biometric Authentication (`m1_post_v3_phr_web_login_abha_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-login",
    "mobile-verify"
  ],
  "loginHint": "abha-address",
  "loginId": "{{encryptedAbhaAddress}}",
  "otpSystem": "abdm"
}'
```

#### 3. Use Case: Verify OTP - Aadhaar Number, Mobile Number, Verify via Biometric (`m1_post_v3_phr_web_login_abha_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-login",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "41e59beb-6ee7-421e-a844-3652b2482038",
      "otpValue": "{{encryptedOtpValue}}"
    }
  }
}'
```

#### 4. Use Case: Retrieves the user’s ABHA Profile (`m1_get_v3_phr_web_login_profile_abha_profile`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha-profile \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 5. Use Case: Generate a PHR Card Profile (`m1_get_v3_phr_web_login_profile_abha_phr_card`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha/phr-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 6. Use Case: Generate QR Code By Passing X-token to share user ABHA address Profile Information. (`m1_get_v3_phr_web_login_profile_abha_qr_code`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha/qr-code \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

**Exit condition (Observe until this is true)**

A 200 response. The specification gives no body for it, so read what comes back.

### ABHA login, ABHA address with Aadhaar OTP (`m1-login-abha-address-aadhaar-otp`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Search ABHA Profile using ABHA address (`m1_post_v3_phr_web_login_abha_search`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/search \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>"
}'
```

#### 2. Use Case: Sends an OTP to the Mobile Number, Aadhaar Number, Request Biometric Authentication (`m1_post_v3_phr_web_login_abha_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-login",
    "aadhaar-verify"
  ],
  "loginHint": "abha-address",
  "loginId": "{{encryptedAbhaAddress}}",
  "otpSystem": "aadhaar"
}'
```

#### 3. Use Case: Verify OTP - Aadhaar Number, Mobile Number, Verify via Biometric (`m1_post_v3_phr_web_login_abha_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-login",
    "aadhaar-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "41e59beb-6ee7-421e-a844-3652b2482038",
      "otpValue": "{{encryptedOtpValue}}"
    }
  }
}'
```

#### 4. Use Case: Retrieves the user’s ABHA Profile (`m1_get_v3_phr_web_login_profile_abha_profile`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha-profile \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 5. Use Case: Generate a PHR Card Profile (`m1_get_v3_phr_web_login_profile_abha_phr_card`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha/phr-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 6. Use Case: Generate QR Code By Passing X-token to share user ABHA address Profile Information. (`m1_get_v3_phr_web_login_profile_abha_qr_code`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha/qr-code \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

**Exit condition (Observe until this is true)**

A 200 response. The specification gives no body for it, so read what comes back.

### ABHA login, ABHA address with fingerprint (`m1-login-abha-address-fingerprint`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Search ABHA Profile using ABHA address (`m1_post_v3_phr_web_login_abha_search`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/search \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>"
}'
```

#### 2. Use Case: Sends an OTP to the Mobile Number, Aadhaar Number, Request Biometric Authentication (`m1_post_v3_phr_web_login_abha_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-verify"
  ],
  "loginHint": "abha-address",
  "loginId": "{{encryptedAbhaAddress}}",
  "otpSystem": "aadhaar"
}'
```

#### 3. Use Case: Verify OTP - Aadhaar Number, Mobile Number, Verify via Biometric (`m1_post_v3_phr_web_login_abha_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-verify"
  ],
  "authData": {
    "authMethods": [
      "bio"
    ],
    "bio": {
      "txnId": "41e59beb-6ee7-421e-a844-3652b2482038",
      "fingerPrintAuthPid": "{{fingerPrintAuthPid}}"
    }
  }
}'
```

#### 4. Use Case: Retrieves the user’s ABHA Profile (`m1_get_v3_phr_web_login_profile_abha_profile`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha-profile \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "abhaAddress": "<ABHA_ADDRESS>",
  "fullName": "Hemant Prakash Bodhai",
  "profilePhoto": "<BASE64_PHOTO>",
  "firstName": "Hemant",
  "middleName": "Prakash",
  "lastName": "Bodhai",
  "dayOfBirth": "14",
  "monthOfBirth": "11",
  "yearOfBirth": "1995",
  "dateOfBirth": "14-11-1995",
  "gender": "M",
  "email": "<EMAIL>",
  "mobile": "<MOBILE_NUMBER>",
  "abhaNumber": "<ABHA_NUMBER>",
  "address": "house no-620, main road, Nashik, Nashik, Maharashtra",
  "stateName": "MAHARASHTRA",
  "pinCode": "422003",
  "stateCode": "27",
  "districtCode": "487",
  "authMethods": [
    "AADHAAR_OTP",
    "MOBILE_OTP"
  ],
  "status": "ACTIVE",
  "subDistrictCode": "",
  "subDistrictName": "",
  "emailVerified": "false",
  "mobileVerified": "true",
  "kycStatus": "VERIFIED"
}
```

### ABHA login, ABHA address with face authentication (`m1-login-abha-address-face`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Search ABHA Profile using ABHA address (`m1_post_v3_phr_web_login_abha_search`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/search \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>"
}'
```

#### 2. Use Case: Sends an OTP to the Mobile Number, Aadhaar Number, Request Biometric Authentication (`m1_post_v3_phr_web_login_abha_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-face-verify"
  ],
  "loginHint": "abha-address",
  "loginId": "{{encryptedAbhaAddress}}",
  "otpSystem": "aadhaar"
}'
```

#### 3. Use Case: Verify OTP - Aadhaar Number, Mobile Number, Verify via Biometric (`m1_post_v3_phr_web_login_abha_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-face-verify"
  ],
  "authData": {
    "authMethods": [
      "face"
    ],
    "face": {
      "txnId": "41e59beb-6ee7-421e-a844-3652b2482038",
      "faceAuthPid": "{{faceAuthPid}}"
    }
  }
}'
```

#### 4. Use Case: Retrieves the user’s ABHA Profile (`m1_get_v3_phr_web_login_profile_abha_profile`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha-profile \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "abhaAddress": "<ABHA_ADDRESS>",
  "fullName": "Hemant Prakash Bodhai",
  "profilePhoto": "<BASE64_PHOTO>",
  "firstName": "Hemant",
  "middleName": "Prakash",
  "lastName": "Bodhai",
  "dayOfBirth": "14",
  "monthOfBirth": "11",
  "yearOfBirth": "1995",
  "dateOfBirth": "14-11-1995",
  "gender": "M",
  "email": "<EMAIL>",
  "mobile": "<MOBILE_NUMBER>",
  "abhaNumber": "<ABHA_NUMBER>",
  "address": "house no-620, main road, Nashik, Nashik, Maharashtra",
  "stateName": "MAHARASHTRA",
  "pinCode": "422003",
  "stateCode": "27",
  "districtCode": "487",
  "authMethods": [
    "AADHAAR_OTP",
    "MOBILE_OTP"
  ],
  "status": "ACTIVE",
  "subDistrictCode": "",
  "subDistrictName": "",
  "emailVerified": "false",
  "mobileVerified": "true",
  "kycStatus": "VERIFIED"
}
```

### ABHA login, ABHA address with iris (`m1-login-abha-address-iris`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Search ABHA Profile using ABHA address (`m1_post_v3_phr_web_login_abha_search`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/search \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>"
}'
```

#### 2. Use Case: Sends an OTP to the Mobile Number, Aadhaar Number, Request Biometric Authentication (`m1_post_v3_phr_web_login_abha_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-iris-verify"
  ],
  "loginHint": "abha-address",
  "loginId": "{{encryptedAbhaAddress}}",
  "otpSystem": "aadhaar"
}'
```

#### 3. Use Case: Verify OTP - Aadhaar Number, Mobile Number, Verify via Biometric (`m1_post_v3_phr_web_login_abha_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-iris-verify"
  ],
  "authData": {
    "authMethods": [
      "iris"
    ],
    "iris": {
      "txnId": "41e59beb-6ee7-421e-a844-3652b2482038",
      "irisAuthPid": "{{irisAuthPid}}"
    }
  }
}'
```

#### 4. Use Case: Retrieves the user’s ABHA Profile (`m1_get_v3_phr_web_login_profile_abha_profile`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha-profile \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "abhaAddress": "<ABHA_ADDRESS>",
  "fullName": "Hemant Prakash Bodhai",
  "profilePhoto": "<BASE64_PHOTO>",
  "firstName": "Hemant",
  "middleName": "Prakash",
  "lastName": "Bodhai",
  "dayOfBirth": "14",
  "monthOfBirth": "11",
  "yearOfBirth": "1995",
  "dateOfBirth": "14-11-1995",
  "gender": "M",
  "email": "<EMAIL>",
  "mobile": "<MOBILE_NUMBER>",
  "abhaNumber": "<ABHA_NUMBER>",
  "address": "house no-620, main road, Nashik, Nashik, Maharashtra",
  "stateName": "MAHARASHTRA",
  "pinCode": "422003",
  "stateCode": "27",
  "districtCode": "487",
  "authMethods": [
    "AADHAAR_OTP",
    "MOBILE_OTP"
  ],
  "status": "ACTIVE",
  "subDistrictCode": "",
  "subDistrictName": "",
  "emailVerified": "false",
  "mobileVerified": "true",
  "kycStatus": "VERIFIED"
}
```

### Find ABHA, mobile OTP (`m1-find-mobile-otp`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Search ABHA Profile (`m1_post_v3_profile_account_abha_search`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/abha/search \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "search-abha"
  ],
  "mobile": "{{rsaMobileEncryptionOutput}}"
}'
```

#### 2. Use Case: ABHA Login - Send OTP using Aadhaar number, ABHA number, Mobile number, Biometric Login, Search ABHA, Find ABHA via Biometrics (`m1_post_v3_profile_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "search-abha",
    "mobile-verify"
  ],
  "loginHint": "index",
  "loginId": "{{rsaIndexEncryptionOutput}}",
  "otpSystem": "abdm",
  "txnId": "{{searchTxnId}}"
}'
```

#### 3. Use Case: ABHA Login - Verify OTP using Aadhaar number, ABHA number, Mobile number, Biometric Verify Login, Find ABHA via Aadhaar, Mobile, Biometrics (`m1_post_v3_profile_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted OTP}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "authResult": "success",
  "message": "Password verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1296000,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": []
}
```

### Find ABHA, Aadhaar OTP (`m1-find-aadhaar-otp`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Search ABHA Profile (`m1_post_v3_profile_account_abha_search`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/abha/search \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "search-abha"
  ],
  "mobile": "{{rsaMobileEncryptionOutput}}"
}'
```

#### 2. Use Case: ABHA Login - Send OTP using Aadhaar number, ABHA number, Mobile number, Biometric Login, Search ABHA, Find ABHA via Biometrics (`m1_post_v3_profile_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "search-abha",
    "aadhaar-verify"
  ],
  "loginHint": "index",
  "loginId": "{{rsaIndexEncryptionOutput}}",
  "otpSystem": "aadhaar",
  "txnId": "{{searchTxnId}}"
}'
```

#### 3. Use Case: ABHA Login - Verify OTP using Aadhaar number, ABHA number, Mobile number, Biometric Verify Login, Find ABHA via Aadhaar, Mobile, Biometrics (`m1_post_v3_profile_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted OTP}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "authResult": "success",
  "message": "Password verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1296000,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": []
}
```

### Find ABHA, fingerprint (`m1-find-fingerprint`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Search ABHA Profile (`m1_post_v3_profile_account_abha_search`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/abha/search \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "search-abha"
  ],
  "mobile": "{{rsaMobileEncryptionOutput}}"
}'
```

#### 2. Use Case: ABHA Login - Send OTP using Aadhaar number, ABHA number, Mobile number, Biometric Login, Search ABHA, Find ABHA via Biometrics (`m1_post_v3_profile_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "search-abha",
    "aadhaar-bio-verify"
  ],
  "loginHint": "index",
  "loginId": "{{rsaIndexEncryptionOutput}}",
  "otpSystem": "aadhaar",
  "txnId": "{{searchTxnId}}"
}'
```

#### 3. Use Case: ABHA Login - Verify OTP using Aadhaar number, ABHA number, Mobile number, Biometric Verify Login, Find ABHA via Aadhaar, Mobile, Biometrics (`m1_post_v3_profile_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-verify"
  ],
  "authData": {
    "authMethods": [
      "bio"
    ],
    "bio": {
      "txnId": "{{txnId}}",
      "fingerPrintAuthPid": "{{PID}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "authResult": "success",
  "message": "Password verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1296000,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": []
}
```

### Find ABHA, face authentication (`m1-find-face`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Search ABHA Profile (`m1_post_v3_profile_account_abha_search`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/abha/search \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "search-abha"
  ],
  "mobile": "{{rsaMobileEncryptionOutput}}"
}'
```

#### 2. Use Case: ABHA Login - Send OTP using Aadhaar number, ABHA number, Mobile number, Biometric Login, Search ABHA, Find ABHA via Biometrics (`m1_post_v3_profile_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "search-abha",
    "aadhaar-face-verify"
  ],
  "loginHint": "index",
  "loginId": "{{rsaIndexEncryptionOutput}}",
  "otpSystem": "aadhaar",
  "txnId": "{{searchTxnId}}"
}'
```

#### 3. Use Case: ABHA Login - Verify OTP using Aadhaar number, ABHA number, Mobile number, Biometric Verify Login, Find ABHA via Aadhaar, Mobile, Biometrics (`m1_post_v3_profile_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-face-verify"
  ],
  "authData": {
    "authMethods": [
      "face"
    ],
    "face": {
      "txnId": "{{txnId}}",
      "faceAuthPid": "{{PID}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "authResult": "success",
  "message": "Password verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1296000,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": []
}
```

### Find ABHA, iris (`m1-find-iris`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Search ABHA Profile (`m1_post_v3_profile_account_abha_search`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/abha/search \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "search-abha"
  ],
  "mobile": "{{rsaMobileEncryptionOutput}}"
}'
```

#### 2. Use Case: ABHA Login - Send OTP using Aadhaar number, ABHA number, Mobile number, Biometric Login, Search ABHA, Find ABHA via Biometrics (`m1_post_v3_profile_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "search-abha",
    "aadhaar-iris-verify"
  ],
  "loginHint": "index",
  "loginId": "{{rsaIndexEncryptionOutput}}",
  "otpSystem": "aadhaar",
  "txnId": "{{searchTxnId}}"
}'
```

#### 3. Use Case: ABHA Login - Verify OTP using Aadhaar number, ABHA number, Mobile number, Biometric Verify Login, Find ABHA via Aadhaar, Mobile, Biometrics (`m1_post_v3_profile_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-iris-verify"
  ],
  "authData": {
    "authMethods": [
      "iris"
    ],
    "iris": {
      "txnId": "{{txnId}}",
      "irisAuthPid": "{{PID}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "authResult": "success",
  "message": "Password verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1296000,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": []
}
```

### Profile management, profile and ABHA card (`m1-profile-and-card`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Get User Profile Details (`m1_get_v3_profile_account`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 2. Use Case: Generate QR Code for an ABHA Profile (`m1_get_v3_profile_account_qrcode`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/qrCode \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 3. Use Case: Retrieve ABHA Card image (`m1_get_v3_profile_account_abha_card`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/abha-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 4. Use Case: Update the user ABHA Profile Photo , Update the Child ABHA Profile (`m1_patch_v3_profile_account`)

```bash
curl --request PATCH \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: <X_TOKEN>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "profilePhoto": "{{profile photo string}}"
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "ABHANumber": "91-5553-4126-XXXX",
  "preferredAbhaAddress": "<ABHA_ADDRESS>",
  "mobile": "******0903",
  "firstName": "Mohite",
  "middleName": "m",
  "lastName": "kale",
  "yearOfBirth": 2021,
  "monthOfBirth": 2,
  "dayOfBirth": 26,
  "gender": "F",
  "status": "ACTIVE",
  "stateCode": 27,
  "districtCode": 290,
  "stateName": "Maharashtra",
  "districtName": "PUNE",
  "subdistrictName": "PUNE",
  "authMethods": [
    "MOBILE_OTP"
  ],
  "tags": {},
  "kycVerified": false,
  "verificationStatus": "VERIFIED",
  "verificationType": "CHILD_ABHA",
  "createdDate": "10-05-2024"
}
```

### Profile management, mobile number update (`m1-update-mobile`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Send OTP - ReKyc, Update Mobile, Child ABHA KYC Request OTP (`m1_post_v3_profile_account_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-profile",
    "mobile-verify"
  ],
  "loginHint": "mobile",
  "loginId": "{{encrypted mobile number}}",
  "otpSystem": "abdm"
}'
```

#### 2. Use Case: Verify OTP - ReKyc, Update Mobile, CHILD ABHA KYC (`m1_post_v3_profile_account_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-profile",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted otp}}"
    }
  }
}'
```

#### 3. Use Case: Get User Profile Details (`m1_get_v3_profile_account`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "ABHANumber": "91-7561-4088-XXXX",
  "preferredAbhaAddress": "<ABHA_ADDRESS>",
  "mobile": "******0903",
  "firstName": "Username",
  "middleName": "Kailas",
  "lastName": "Shelke",
  "name": "Username Kailas Shelke",
  "yearOfBirth": "1999",
  "dayOfBirth": "26",
  "monthOfBirth": "06",
  "gender": "M",
  "profilePhoto": "<BASE64_PHOTO>",
  "status": "ACTIVE",
  "stateCode": "27",
  "districtCode": "478",
  "pincode": "424201",
  "address": "LOHARA, AT POST LOHARA TQ PACHORA DIST JALGAON, Lohara, Pachora, Jalgaon, Maharashtra",
  "kycPhoto": "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",
  "stateName": "MAHARASHTRA",
  "districtName": "JALGAON",
  "subdistrictName": "JALGAON",
  "authMethods": [
    "MOBILE_OTP",
    "AADHAAR_BIO",
    "AADHAAR_OTP",
    "DEMOGRAPHICS",
    "PASSWORD"
  ],
  "tags": {},
  "kycVerified": true,
  "verificationStatus": "VERIFIED",
  "verificationType": "AADHAAR",
  "localizedDetails": {
    "name": "कैलास कैलास शेळके",
    "stateName": "महाराष्ट्र",
    "districtName": "जळगाव",
    "villageName": "लोहारा",
    "townName": "मु पोस्ट लोहारा ता पाचोरा जि. जळगाव",
    "gender": "पुरुष",
    "localizedLabels": {
      "name": "नाव",
      "abhaNumber": "आभा क्रमांक",
      "abhaAddress": "आभा पत्ता",
      "gender": "लिंग",
      "dob": "जन्मतारीख",
      "mobile": "मोबाईल"
    }
  },
  "createdDate": "07-05-2024"
}
```

### Profile management, re-KYC (`m1-re-kyc`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Send OTP - ReKyc, Update Mobile, Child ABHA KYC Request OTP (`m1_post_v3_profile_account_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-profile",
    "re-kyc"
  ],
  "loginHint": "abha-number",
  "loginId": "{{encrypted abha-number}}",
  "otpSystem": "aadhaar"
}'
```

#### 2. Use Case: Verify OTP - ReKyc, Update Mobile, CHILD ABHA KYC (`m1_post_v3_profile_account_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-profile",
    "re-kyc"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted otp}}"
    }
  }
}'
```

#### 3. Use Case: Get User Profile Details (`m1_get_v3_profile_account`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "ABHANumber": "91-7561-4088-XXXX",
  "preferredAbhaAddress": "<ABHA_ADDRESS>",
  "mobile": "******0903",
  "firstName": "Username",
  "middleName": "Kailas",
  "lastName": "Shelke",
  "name": "Username Kailas Shelke",
  "yearOfBirth": "1999",
  "dayOfBirth": "26",
  "monthOfBirth": "06",
  "gender": "M",
  "profilePhoto": "<BASE64_PHOTO>",
  "status": "ACTIVE",
  "stateCode": "27",
  "districtCode": "478",
  "pincode": "424201",
  "address": "LOHARA, AT POST LOHARA TQ PACHORA DIST JALGAON, Lohara, Pachora, Jalgaon, Maharashtra",
  "kycPhoto": "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",
  "stateName": "MAHARASHTRA",
  "districtName": "JALGAON",
  "subdistrictName": "JALGAON",
  "authMethods": [
    "MOBILE_OTP",
    "AADHAAR_BIO",
    "AADHAAR_OTP",
    "DEMOGRAPHICS",
    "PASSWORD"
  ],
  "tags": {},
  "kycVerified": true,
  "verificationStatus": "VERIFIED",
  "verificationType": "AADHAAR",
  "localizedDetails": {
    "name": "कैलास कैलास शेळके",
    "stateName": "महाराष्ट्र",
    "districtName": "जळगाव",
    "villageName": "लोहारा",
    "townName": "मु पोस्ट लोहारा ता पाचोरा जि. जळगाव",
    "gender": "पुरुष",
    "localizedLabels": {
      "name": "नाव",
      "abhaNumber": "आभा क्रमांक",
      "abhaAddress": "आभा पत्ता",
      "gender": "लिंग",
      "dob": "जन्मतारीख",
      "mobile": "मोबाईल"
    }
  },
  "createdDate": "07-05-2024"
}
```

### Benefit programmes (`m1-benefit`)

**Act: the calls in this journey, in order**

#### 1. Use Case: Search for benefits associated with a user’s profile (`m1_post_v3_profile_benefit_search`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/search \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "search"
  ],
  "loginHint": "abha-number",
  "loginId": "{{encrypted abha-number}}"
}'
```

#### 2. Usecase : Benefit LINK or DELINK (`m1_post_v3_profile_benefit_linkanddelink`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/linkAndDelink \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "link"
  ],
  "loginHint": "abha-number",
  "loginId": "{{encrypted abha-number}}"
}'
```

#### 3. Use Case: Retrieve the benefit details associated with a specific ABHA number (`m1_get_v3_profile_benefit_abha_abhanumber`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/abha/{abhanumber} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "abhaNumber": "91-7722-7553-XXXX",
  "programme": [
    {
      "benefitName": "Poshan Abhiyaan"
    },
    {
      "benefitName": "Test Benefit Program"
    },
    {
      "benefitName": "Pradhan Mantri National Dialysis Programme"
    }
  ]
}
```

## Where the detail is

- Every operation, with its body fields and responses: /docs/hiecm/v3/api/m1
- Error codes: /docs/hiecm/v3/api/m1/errors
