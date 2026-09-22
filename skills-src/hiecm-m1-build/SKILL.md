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

### Create ABHA, Aadhaar OTP (`m1-create-abha-aadhaar-otp`)

**Act: the calls in this journey, in order**

#### 1. Send Aadhaar OTP for ABHA enrolment (`m1_post_v3_enrollment_request_otp_aadhaar_otp`)

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

#### 2. Create ABHA - verify Aadhaar OTP (`m1_post_v3_enrollment_enrol_byaadhaar_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
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

#### 3. After ABHA creation - send OTP to verify mobile (optional) (`m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_1b66bb`)

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

#### 4. After ABHA creation - verify mobile OTP (optional) (`m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_091285`)

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

#### 5. After ABHA creation - send OTP to verify email (optional) (`m1_post_v3_enrollment_request_otp_email_verify_create_abh_ddbed1`)

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
    "email-verify"
  ],
  "loginHint": "email",
  "loginId": "{{encrypted email}}",
  "otpSystem": "abdm"
}'
```

#### 6. After ABHA creation - verify email OTP (optional) (`m1_post_v3_enrollment_auth_byabdm_email_verify_create_abh_6d732c`)

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
    "email-verify"
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

#### 7. After ABHA creation - get ABHA address suggestions (`m1_get_v3_enrollment_enrol_suggestion_create_abha_aadhaar_otp`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/suggestion \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TRANSACTION_ID: {{txnId}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 8. After ABHA creation - create ABHA address (`m1_post_v3_enrollment_enrol_abha_address_create_abha_aadhaar_otp`)

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
  "healthIdNumber": "<ABHA_NUMBER>",
  "preferredAbhaAddress": "<ABHA_ADDRESS>"
}
```

### Create ABHA, Face Authentication (`m1-create-abha-face-authentication`)

**Act: the calls in this journey, in order**

#### 1. Face auth - generate transaction ID (init) (`m1_post_v3_enrollment_enrol_auth_init_create_abha_face_au_4dea33`)

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

#### 2. Face auth - capture PID / track status (`m1_post_v3_enrollment_enrol_capturepid_create_abha_face_a_417d5e`)

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

#### 3. Create ABHA - Aadhaar face authentication (`m1_post_v3_enrollment_enrol_byaadhaar_face`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
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

#### 4. After ABHA creation - send OTP to verify mobile (optional) (`m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_6474ce`)

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

#### 5. After ABHA creation - verify mobile OTP (optional) (`m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_b555fb`)

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

#### 6. After ABHA creation - send OTP to verify email (optional) (`m1_post_v3_enrollment_request_otp_email_verify_create_abh_880d7e`)

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
    "email-verify"
  ],
  "loginHint": "email",
  "loginId": "{{encrypted email}}",
  "otpSystem": "abdm"
}'
```

#### 7. After ABHA creation - verify email OTP (optional) (`m1_post_v3_enrollment_auth_byabdm_email_verify_create_abh_d8de3e`)

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
    "email-verify"
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

#### 8. After ABHA creation - get ABHA address suggestions (`m1_get_v3_enrollment_enrol_suggestion_create_abha_face_au_848b26`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/suggestion \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TRANSACTION_ID: {{txnId}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 9. After ABHA creation - create ABHA address (`m1_post_v3_enrollment_enrol_abha_address_create_abha_face_4b1f33`)

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
  "healthIdNumber": "<ABHA_NUMBER>",
  "preferredAbhaAddress": "<ABHA_ADDRESS>"
}
```

### Create ABHA, Fingerprint (`m1-create-abha-fingerprint`)

**Act: the calls in this journey, in order**

#### 1. Create ABHA - Aadhaar fingerprint (bio) (`m1_post_v3_enrollment_enrol_byaadhaar_fingerprint`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
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

#### 2. After ABHA creation - send OTP to verify mobile (optional) (`m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_64b04e`)

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

#### 3. After ABHA creation - verify mobile OTP (optional) (`m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_3b237a`)

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

#### 4. After ABHA creation - send OTP to verify email (optional) (`m1_post_v3_enrollment_request_otp_email_verify_create_abh_4833d9`)

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
    "email-verify"
  ],
  "loginHint": "email",
  "loginId": "{{encrypted email}}",
  "otpSystem": "abdm"
}'
```

#### 5. After ABHA creation - verify email OTP (optional) (`m1_post_v3_enrollment_auth_byabdm_email_verify_create_abh_b696ba`)

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
    "email-verify"
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

#### 6. After ABHA creation - get ABHA address suggestions (`m1_get_v3_enrollment_enrol_suggestion_create_abha_fingerprint`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/suggestion \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TRANSACTION_ID: {{txnId}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 7. After ABHA creation - create ABHA address (`m1_post_v3_enrollment_enrol_abha_address_create_abha_fingerprint`)

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
  "healthIdNumber": "<ABHA_NUMBER>",
  "preferredAbhaAddress": "<ABHA_ADDRESS>"
}
```

### Create ABHA, IRIS (`m1-create-abha-iris`)

**Act: the calls in this journey, in order**

#### 1. Create ABHA - Aadhaar IRIS (`m1_post_v3_enrollment_enrol_byaadhaar_iris`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
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

#### 2. After ABHA creation - send OTP to verify mobile (optional) (`m1_post_v3_enrollment_request_otp_mobile_verify_create_abha_iris`)

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

#### 3. After ABHA creation - verify mobile OTP (optional) (`m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_abha_iris`)

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

#### 4. After ABHA creation - send OTP to verify email (optional) (`m1_post_v3_enrollment_request_otp_email_verify_create_abha_iris`)

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
    "email-verify"
  ],
  "loginHint": "email",
  "loginId": "{{encrypted email}}",
  "otpSystem": "abdm"
}'
```

#### 5. After ABHA creation - verify email OTP (optional) (`m1_post_v3_enrollment_auth_byabdm_email_verify_create_abha_iris`)

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
    "email-verify"
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

#### 6. After ABHA creation - get ABHA address suggestions (`m1_get_v3_enrollment_enrol_suggestion_create_abha_iris`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/suggestion \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TRANSACTION_ID: {{txnId}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 7. After ABHA creation - create ABHA address (`m1_post_v3_enrollment_enrol_abha_address_create_abha_iris`)

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
  "healthIdNumber": "<ABHA_NUMBER>",
  "preferredAbhaAddress": "<ABHA_ADDRESS>"
}
```

### Create ABHA, Demo Auth (`m1-create-abha-demo-auth`)

**Act: the calls in this journey, in order**

#### 1. Create ABHA - Demographic authentication (Demo Auth) (`m1_post_v3_enrollment_enrol_byaadhaar_demo_auth_create_ab_81107d`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
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
      "pinCode": "<PINCODE>",
      "address": "<ADDRESS>"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "healthIdNumber": "<ABHA_NUMBER>",
  "healthId": "<ABHA_ADDRESS>",
  "mobile": "******0903",
  "firstName": "Username",
  "middleName": "<NAME>",
  "lastName": "<NAME>",
  "name": "<NAME>",
  "yearOfBirth": "<DOB>",
  "dayOfBirth": "<DOB>",
  "monthOfBirth": "<DOB>",
  "gender": "F",
  "stateCode": "27",
  "districtCode": "490",
  "stateName": "MAHARASHTRA",
  "districtName": "<ADDRESS>",
  "kycVerified": true,
  "token": "<TOKEN>",
  "jwtResponse": {
    "token": "<TOKEN>",
    "expiresIn": 1800,
    "refreshToken": "<TOKEN>",
    "refreshExpiresIn": 1296000
  },
  "status": "ACTIVE",
  "new": true
}
```

### Child ABHA (`m1-child-abha`)

**Act: the calls in this journey, in order**

#### 1. Create Child ABHA (`m1_post_v3_enrollment_enrol_byaadhaar_child_child_abha`)

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

#### 2. Get Child ABHA list of the parent (`m1_get_v3_enrollment_profile_children_child_abha`)

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

#### 3. Update Child ABHA profile (`m1_patch_v3_profile_account_child_child_abha`)

```bash
curl --request PATCH \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaNumber": "<ABHA_NUMBER>",
  "dob": "<DOB>",
  "name": "<NAME>",
  "gender": "F"
}'
```

#### 4. Child ABHA KYC - send Aadhaar OTP (`m1_post_v3_profile_account_request_otp_child_kyc_child_abha`)

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

#### 5. Child ABHA KYC - verify Aadhaar OTP (`m1_post_v3_profile_account_verify_child_kyc_child_abha`)

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
  "txnId": "bb548986-e96d-4b48-be1b-1e36741e867d",
  "authResult": "success",
  "message": "KYC verification has been done",
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>"
    },
    {
      "mobileVerified": "true"
    }
  ]
}
```

### Login, Mobile Number (`m1-login-mobile-number`)

**Act: the calls in this journey, in order**

#### 1. Login via Mobile number - send OTP (`m1_post_v3_profile_login_request_otp_mobile`)

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

#### 2. Login via Mobile number - verify OTP (`m1_post_v3_profile_login_verify_mobile_otp`)

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

#### 3. Login via Mobile number - verify user (select ABHA) (`m1_post_v3_profile_login_verify_user`)

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

### Login, ABHA Number (Aadhaar OTP) (`m1-login-abha-number-aadhaar-otp`)

**Act: the calls in this journey, in order**

#### 1. Login via ABHA number - send Aadhaar OTP (`m1_post_v3_profile_login_request_otp_abha_number_aadhaar_otp`)

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

#### 2. Login via ABHA number - verify Aadhaar OTP (`m1_post_v3_profile_login_verify_abha_number_aadhaar_otp`)

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
  "txnId": "9fc6af6a-374f-4b6a-9cbe-791d360dfc28",
  "authResult": "success",
  "message": "OTP verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```

### Login, ABHA Number (Mobile OTP) (`m1-login-abha-number-mobile-otp`)

**Act: the calls in this journey, in order**

#### 1. Login via ABHA number - send ABHA (mobile) OTP (`m1_post_v3_profile_login_request_otp_abha_number_abha_otp`)

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

#### 2. Login via ABHA number - verify ABHA (mobile) OTP (`m1_post_v3_profile_login_verify_abha_number_abha_otp`)

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
  "txnId": "160ce506-4ef8-462e-ba2f-413c6f17852e",
  "authResult": "success",
  "message": "OTP verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```

### Login, Biometric v3.1 (`m1-login-biometric-v3-1`)

**Act: the calls in this journey, in order**

#### 1. Login via Biometric (Fingerprint) - v3.1 single step (`m1_post_v3_1_profile_login_verify_fingerprint`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3.1/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-login-verify"
  ],
  "authData": {
    "authMethods": [
      "bio_login"
    ],
    "bio_login": {
      "aadhaar": "{{encryptedAadhaar}}",
      "fingerPrintAuthPid": "{{fingerPrintAuthPid}}"
    }
  }
}'
```

#### 2. Login via Biometric (Iris) - v3.1 single step (`m1_post_v3_1_profile_login_verify_iris`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3.1/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-iris-login-verify"
  ],
  "authData": {
    "authMethods": [
      "iris_login"
    ],
    "iris_login": {
      "aadhaar": "{{encryptedAadhaar}}",
      "irisAuthPid": "{{irisAuthPid}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "a2s9f59d-dfba-4261-8ea2-16541cfd6f2a",
  "authResult": "success",
  "message": "IRIS verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```

### Login, Face Auth QR (v3.1) (`m1-login-face-auth-qr-v3-1`)

**Act: the calls in this journey, in order**

#### 1. Face auth - generate transaction ID (init) (`m1_post_v3_enrollment_enrol_auth_init_login_face_auth_qr_v3_1`)

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

#### 2. Face auth - capture PID / track status (`m1_post_v3_enrollment_enrol_capturepid_login_face_auth_qr_v3_1`)

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

#### 3. Login via Face Auth (QR) - verify (`m1_post_v3_1_profile_login_verify_face_auth_qr`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3.1/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-face-login-verify"
  ],
  "authData": {
    "authMethods": [
      "face_auth"
    ],
    "face_login": {
      "txnId": "8220299c-40ad-40b6-bc52-13a7d46a69d0",
      "aadhaar": "{{encrypted aadhaar number}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "ad0aff4b-77dc-48c0-9c4a-18ac4f13af49",
  "authResult": "success",
  "message": "FACE verified successfully",
  "token": "<TOKEN>...",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>...",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "{{base64 profile photo}}"
    }
  ]
}
```

### Login, Aadhaar Number (`m1-login-aadhaar-number`)

**Act: the calls in this journey, in order**

#### 1. Login via Aadhaar number - send Aadhaar OTP (`m1_post_v3_profile_login_request_otp_aadhaar`)

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

#### 2. Login via Aadhaar number - verify Aadhaar OTP (`m1_post_v3_profile_login_verify_aadhaar_otp`)

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
  "txnId": "9fc6af6a-374f-4b6a-9cbe-791d360dfc28",
  "authResult": "success",
  "message": "OTP verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```

### Login, Biometric v3 (Fingerprint) (`m1-login-biometric-v3-fingerprint`)

**Act: the calls in this journey, in order**

#### 1. Login via Biometric (Fingerprint) - send authentication request (`m1_post_v3_profile_login_request_otp_biometric_fingerprint`)

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

#### 2. Login via Biometric (Fingerprint) - verify (`m1_post_v3_profile_login_verify_biometric_fingerprint`)

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
  "txnId": "fe1c527e-1ab8-40c4-84d2-9eedb3378d39",
  "authResult": "success",
  "message": "BIO verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```

### Login, Biometric v3 (Iris) (`m1-login-biometric-v3-iris`)

**Act: the calls in this journey, in order**

#### 1. Login via Biometric (Iris) - send authentication request (`m1_post_v3_profile_login_request_otp_biometric_iris`)

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

#### 2. Login via Biometric (Iris) - verify (`m1_post_v3_profile_login_verify_biometric_iris`)

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
  "txnId": "a2s9f59d-dfba-4261-8ea2-16541cfd6f2a",
  "authResult": "success",
  "message": "IRIS verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```

### Profile, Update Mobile (`m1-profile-update-mobile`)

**Act: the calls in this journey, in order**

#### 1. Update mobile - send OTP (`m1_post_v3_profile_account_request_otp_update_mobile`)

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

#### 2. Update mobile - verify OTP (`m1_post_v3_profile_account_verify_update_mobile`)

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

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "01bb3a4c-4588-4734-aff4-23d3978e50be",
  "authResult": "success",
  "message": "Mobile Number linked successfully",
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>"
    }
  ]
}
```

### Profile, Re-KYC (`m1-profile-re-kyc`)

**Act: the calls in this journey, in order**

#### 1. Re-KYC - send Aadhaar OTP (`m1_post_v3_profile_account_request_otp_re_kyc`)

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

#### 2. Re-KYC - verify Aadhaar OTP (`m1_post_v3_profile_account_verify_re_kyc`)

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

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "bb548986-e96d-4b48-be1b-1e36741e867d",
  "authResult": "success",
  "message": "Re-kyc done successfully",
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>"
    }
  ]
}
```

### ABHA Card & Profile (`m1-abha-card-profile`)

**Act: the calls in this journey, in order**

#### 1. Get ABHA QR code (`m1_get_v3_profile_account_qrcode`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/qrCode \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 2. Retrieve ABHA card image (`m1_get_v3_profile_account_abha_card`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/abha-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 3. Get ABHA profile (`m1_get_v3_profile_account`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 4. Download ABHA card (`m1_get_v3_profile_account_download_abha_card`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/download-abha-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 5. Refresh user token (`m1_get_v3_profile_account_request_token`)

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

### Profile, Update Photo (`m1-profile-update-photo`)

**Act: the calls in this journey, in order**

#### 1. Update profile photo (`m1_patch_v3_profile_account_profile_photo`)

```bash
curl --request PATCH \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "profilePhoto": "{{profile photo string}}"
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "ABHANumber": "<ABHA_NUMBER>",
  "preferredAbhaAddress": "<ABHA_ADDRESS>",
  "mobile": "******0903",
  "firstName": "<NAME>",
  "middleName": "<NAME>",
  "lastName": "<NAME>",
  "yearOfBirth": "<DOB>",
  "monthOfBirth": "<DOB>",
  "dayOfBirth": "<DOB>",
  "gender": "F",
  "status": "ACTIVE",
  "stateCode": 27,
  "districtCode": 290,
  "stateName": "Maharashtra",
  "districtName": "<ADDRESS>",
  "subdistrictName": "<ADDRESS>",
  "authMethods": [
    "MOBILE_OTP"
  ],
  "kycVerified": false,
  "verificationStatus": "VERIFIED",
  "verificationType": "CHILD_ABHA",
  "createdDate": "10-05-2024"
}
```

### Find ABHA, Mobile OTP (`m1-find-abha-mobile-otp`)

**Act: the calls in this journey, in order**

#### 1. Search ABHA by mobile (`m1_post_v3_profile_account_abha_search_find_abha_mobile_otp`)

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

#### 2. Find ABHA via Mobile - send OTP (`m1_post_v3_profile_login_request_otp_find_abha_mobile`)

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

#### 3. Find ABHA via Mobile - verify OTP (`m1_post_v3_profile_login_verify_find_abha_mobile`)

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
  "txnId": "dcc22def-8102-4c9a-a36e-15743556fdc4",
  "authResult": "success",
  "message": "OTP verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```

### Find ABHA, Face (`m1-find-abha-face`)

**Act: the calls in this journey, in order**

#### 1. Search ABHA by mobile (`m1_post_v3_profile_account_abha_search_find_abha_face`)

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

#### 2. Find ABHA via Face - send authentication request (`m1_post_v3_profile_login_request_otp_find_abha_face`)

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

#### 3. Face auth - capture PID / track status (`m1_post_v3_enrollment_enrol_capturepid_find_abha_face`)

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

#### 4. Find ABHA via Face - verify (`m1_post_v3_profile_login_verify_find_abha_face`)

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
      "face_auth"
    ],
    "face": {
      "txnId": "{{txnId}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "d17cb533-9bfa-40f5-a7bc-b84143516787",
  "authResult": "success",
  "message": "Aadhaar Face Authentication Success",
  "token": "<TOKEN>...",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>...",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "{{base64 profile photo}}",
      "mobileVerified": false
    }
  ]
}
```

### Find ABHA, Fingerprint (`m1-find-abha-fingerprint`)

**Act: the calls in this journey, in order**

#### 1. Search ABHA by mobile (`m1_post_v3_profile_account_abha_search_find_abha_fingerprint`)

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

#### 2. Find ABHA via Fingerprint - send authentication request (`m1_post_v3_profile_login_request_otp_find_abha_fingerprint`)

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

#### 3. Find ABHA via Fingerprint - verify (`m1_post_v3_profile_login_verify_find_abha_fingerprint`)

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
      "fingerPrintAuthPid": "{{fingerPrintAuthPid}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "fe1c527e-1ab8-40c4-84d2-9eedb3378d39",
  "authResult": "success",
  "message": "BIO verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```

### Find ABHA, Aadhaar OTP (`m1-find-abha-aadhaar-otp`)

**Act: the calls in this journey, in order**

#### 1. Search ABHA by mobile (`m1_post_v3_profile_account_abha_search_find_abha_aadhaar_otp`)

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

#### 2. Find ABHA via Aadhaar OTP - send OTP (`m1_post_v3_profile_login_request_otp_find_abha_aadhaar`)

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

#### 3. Find ABHA via Aadhaar OTP - verify OTP (`m1_post_v3_profile_login_verify_find_abha_aadhaar`)

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
  "txnId": "dcc22def-8102-4c9a-a36e-15743556fdc4",
  "authResult": "success",
  "message": "OTP verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```

### Find ABHA, IRIS (`m1-find-abha-iris`)

**Act: the calls in this journey, in order**

#### 1. Search ABHA by mobile (`m1_post_v3_profile_account_abha_search_find_abha_iris`)

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

#### 2. Find ABHA via IRIS - send authentication request (`m1_post_v3_profile_login_request_otp_find_abha_iris`)

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

#### 3. Find ABHA via IRIS - verify (`m1_post_v3_profile_login_verify_find_abha_iris`)

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
  "txnId": "a2s9f59d-dfba-4261-8ea2-16541cfd6f2a",
  "authResult": "success",
  "message": "IRIS verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```

### Forgot ABHA, Mobile OTP (`m1-forgot-abha-mobile-otp`)

**Act: the calls in this journey, in order**

#### 1. Forgot ABHA via Mobile - send OTP (`m1_post_v3_profile_login_request_otp_forgot_abha_mobile`)

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

#### 2. Forgot ABHA via Mobile - verify OTP (`m1_post_v3_profile_login_verify_forgot_abha_mobile`)

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
  "txnId": "c837a1bd-7694-4c06-a42c-7eb36e445d1d",
  "authResult": "success",
  "message": "OTP verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 300,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "gender": "M",
      "dob": "<DOB>",
      "verifiedStatus": "VERIFIED",
      "verificationType": "AADHAAR",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    },
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "gender": "M",
      "dob": "<DOB>",
      "verifiedStatus": "VERIFIED",
      "verificationType": "AADHAAR",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    },
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "gender": "M",
      "dob": "<DOB>",
      "verifiedStatus": "VERIFIED",
      "verificationType": "AADHAAR",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    },
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "gender": "M",
      "dob": "<DOB>",
      "verifiedStatus": "VERIFIED",
      "verificationType": "AADHAAR",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```

### Forgot ABHA, Aadhaar OTP (`m1-forgot-abha-aadhaar-otp`)

**Act: the calls in this journey, in order**

#### 1. Forgot ABHA via Aadhaar - send OTP (`m1_post_v3_profile_login_request_otp_forgot_abha_aadhaar`)

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
  "loginId": "{{encrypted Aadhaar}}",
  "otpSystem": "aadhaar"
}'
```

#### 2. Forgot ABHA via Aadhaar - verify OTP (`m1_post_v3_profile_login_verify_forgot_abha_aadhaar`)

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
  "txnId": "725a7e53-96c3-49c2-9596-232a726f62a5",
  "authResult": "success",
  "message": "OTP verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "91-****-****-5727",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE"
    }
  ]
}
```

### Benefit, Create ABHA via Demo Auth (`m1-benefit-create-abha-via-demo-auth`)

**Act: the calls in this journey, in order**

#### 1. Create ABHA - Demographic authentication (Demo Auth) (`m1_post_v3_enrollment_enrol_byaadhaar_demo_auth_benefit_c_d5c7c3`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
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
      "pinCode": "<PINCODE>",
      "address": "<ADDRESS>"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "healthIdNumber": "<ABHA_NUMBER>",
  "healthId": "<ABHA_ADDRESS>",
  "mobile": "******0903",
  "firstName": "Username",
  "middleName": "<NAME>",
  "lastName": "<NAME>",
  "name": "<NAME>",
  "yearOfBirth": "<DOB>",
  "dayOfBirth": "<DOB>",
  "monthOfBirth": "<DOB>",
  "gender": "F",
  "stateCode": "27",
  "districtCode": "490",
  "stateName": "MAHARASHTRA",
  "districtName": "<ADDRESS>",
  "kycVerified": true,
  "token": "<TOKEN>",
  "jwtResponse": {
    "token": "<TOKEN>",
    "expiresIn": 1800,
    "refreshToken": "<TOKEN>",
    "refreshExpiresIn": 1296000
  },
  "status": "ACTIVE",
  "new": true
}
```

### Benefit, Child ABHA (`m1-benefit-child-abha`)

**Act: the calls in this journey, in order**

#### 1. Create ABHA - Demographic authentication (Demo Auth) (`m1_post_v3_enrollment_enrol_byaadhaar_demo_auth_benefit_c_d20a11`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
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
      "pinCode": "<PINCODE>",
      "address": "<ADDRESS>"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```

#### 2. Create Child ABHA (`m1_post_v3_enrollment_enrol_byaadhaar_child_benefit_child_abha`)

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

#### 3. Get Child ABHA list of the parent (`m1_get_v3_enrollment_profile_children_benefit_child_abha`)

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

#### 4. Update Child ABHA profile (`m1_patch_v3_profile_account_child_benefit_child_abha`)

```bash
curl --request PATCH \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaNumber": "<ABHA_NUMBER>",
  "dob": "<DOB>",
  "name": "<NAME>",
  "gender": "F"
}'
```

#### 5. Child ABHA KYC - send Aadhaar OTP (`m1_post_v3_profile_account_request_otp_child_kyc_benefit__ec9035`)

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

#### 6. Child ABHA KYC - verify Aadhaar OTP (`m1_post_v3_profile_account_verify_child_kyc_benefit_child_abha`)

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
  "txnId": "bb548986-e96d-4b48-be1b-1e36741e867d",
  "authResult": "success",
  "message": "KYC verification has been done",
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>"
    },
    {
      "mobileVerified": "true"
    }
  ]
}
```

### Benefit, Search (`m1-benefit-search`)

**Act: the calls in this journey, in order**

#### 1. Benefit search by xmlUid (`m1_post_v3_profile_benefit_search_xmluid`)

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
  "loginHint": "xmlUid",
  "loginId": "{{encrypted xmlUid}}"
}'
```

#### 2. Benefit search by ABHA number (`m1_post_v3_profile_benefit_search_abha_number`)

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

#### 3. Get benefits linked to an ABHA number (`m1_get_v3_profile_benefit_abha_abhanumber`)

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
  "abhaNumber": "<ABHA_NUMBER>",
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

### Benefit, Link / De-link (`m1-benefit-link-de-link`)

**Act: the calls in this journey, in order**

#### 1. Link / De-link benefit using X-token (`m1_post_v3_profile_benefit_linkanddelink_x_token`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/linkAndDelink \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "link"
  ]
}'
```

#### 2. Link / De-link benefit using ABHA number (`m1_post_v3_profile_benefit_linkanddelink_abha_number`)

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

#### 3. Link / De-link benefit using xmlUid (`m1_post_v3_profile_benefit_linkanddelink_xmluid`)

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
    "de-link"
  ],
  "loginHint": "xmlUid",
  "loginId": "{{encrypted xmlUid}}"
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "benefitName": "COVIN",
  "healthId": "<ABHA_NUMBER>",
  "status": "Benefit record has been linked successfully"
}
```

### Access Tokens & Encryption (`m1-access-tokens-encryption`)

**Act: the calls in this journey, in order**

#### 1. Generate access token (`gateway_post_gateway_v3_sessions`)

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

#### 2. Get public certificate (RSA encryption key) (`m1_get_v3_profile_public_certificate`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/public/certificate \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "publicKey": "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO4Xb+59KYVm9Hywbo77qETZVAyc6VIsxU+UWhd/k/YtjZibCznB+HaXWX9TVTFs9Nwgv7LRGq5uLczpZQDrU7dnGkl/urRA8p0Jv/f8T0MZdFWQgks91uFffeBmJOb58u68ZRxSYGMPe4hb9XXKDVsgoSJaRNYviH7RgAI2QhTCwLEiMqIaUX3p1SAc178ZlN8qHXSSGXvhDR1GKM+y2DIyJqlzfik7lD14mDY/I4lcbftib8cv7llkybtjX1AayfZp4XpmIXKWv8nRM488/jOAF81Bi13paKgpjQUUuwq9tb5Qd/DChytYgBTBTJFe7irDFCmTIcqPr8+IMB7tXA3YXPp3z605Z6cGoYxezUm2Nz2o6oUmarDUntDhq/PnkNergmSeSvS8gD9DHBuJkJWZweG3xOPXiKQAUBr92mdFhJGm6fitO5jsBxgpmulxpG0oKDy9lAOLWSqK92JMcbMNHn4wRikdI9HSiXrrI7fLhJYTbyU3I4v5ESdEsayHXuiwO/1C8y56egzKSw44GAtEpbAkTNEEfK5H5R0QnVBIXOvfeF4tzGvmkfOO6nNXU3o/WAdOyV3xSQ9dqLY5MEL4sJCGY1iJBIAQ452s8v0ynJG5Yq+8hNhsCVnklCzAlsIzQpnSVDUVEzv17grVAw078CAwEAAQ==",
  "encryptionAlgorithm": "RSA/ECB/OAEPWithSHA-1AndMGF1Padding"
}
```

### ABHA Address Login, Mobile OTP (`m1-abha-address-login-mobile-otp`)

**Act: the calls in this journey, in order**

#### 1. Search ABHA address (auth methods) (`m1_post_v3_phr_web_login_abha_search_abha_address_login_m_27a20f`)

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

#### 2. ABHA address login via Mobile OTP - send OTP (`m1_post_v3_phr_web_login_abha_request_otp_mobile_otp`)

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

#### 3. ABHA address login via Mobile OTP - verify (`m1_post_v3_phr_web_login_abha_verify_mobile_otp`)

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

#### 4. Get ABHA-address profile (`m1_get_v3_phr_web_login_profile_abha_profile_abha_address_b038c4`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha-profile \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 5. Get PHR card (`m1_get_v3_phr_web_login_profile_abha_phr_card_abha_addres_e1bae9`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha/phr-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 6. Get ABHA-address QR code (`m1_get_v3_phr_web_login_profile_abha_qr_code_abha_address_a48785`)

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

### ABHA Address Login, Aadhaar OTP (`m1-abha-address-login-aadhaar-otp`)

**Act: the calls in this journey, in order**

#### 1. Search ABHA address (auth methods) (`m1_post_v3_phr_web_login_abha_search_abha_address_login_a_de8184`)

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

#### 2. ABHA address login via Aadhaar OTP - send OTP (`m1_post_v3_phr_web_login_abha_request_otp_aadhaar_otp`)

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

#### 3. ABHA address login via Aadhaar OTP - verify (`m1_post_v3_phr_web_login_abha_verify_aadhaar_otp`)

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

#### 4. Get ABHA-address profile (`m1_get_v3_phr_web_login_profile_abha_profile_abha_address_c04e83`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha-profile \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 5. Get PHR card (`m1_get_v3_phr_web_login_profile_abha_phr_card_abha_addres_817c0d`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha/phr-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 6. Get ABHA-address QR code (`m1_get_v3_phr_web_login_profile_abha_qr_code_abha_address_26c955`)

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

### ABHA Address Login, Fingerprint (`m1-abha-address-login-fingerprint`)

**Act: the calls in this journey, in order**

#### 1. ABHA address login via Fingerprint - send authentication request (`m1_post_v3_phr_web_login_abha_request_otp_fingerprint`)

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

#### 2. ABHA address login via Fingerprint - verify (`m1_post_v3_phr_web_login_abha_verify_fingerprint`)

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

#### 3. Get ABHA-address profile (`m1_get_v3_phr_web_login_profile_abha_profile_abha_address_8ec4ee`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha-profile \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 4. Get PHR card (`m1_get_v3_phr_web_login_profile_abha_phr_card_abha_addres_e751bf`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha/phr-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 5. Get ABHA-address QR code (`m1_get_v3_phr_web_login_profile_abha_qr_code_abha_address_91c62b`)

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

### ABHA Address Login, IRIS (`m1-abha-address-login-iris`)

**Act: the calls in this journey, in order**

#### 1. ABHA address login via IRIS - send authentication request (`m1_post_v3_phr_web_login_abha_request_otp_iris`)

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

#### 2. ABHA address login via IRIS - verify (`m1_post_v3_phr_web_login_abha_verify_iris`)

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

#### 3. Get ABHA-address profile (`m1_get_v3_phr_web_login_profile_abha_profile_abha_address_809900`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha-profile \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 4. Get PHR card (`m1_get_v3_phr_web_login_profile_abha_phr_card_abha_addres_b64ebf`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha/phr-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 5. Get ABHA-address QR code (`m1_get_v3_phr_web_login_profile_abha_qr_code_abha_address_4b4e10`)

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

## Where the detail is

- Every operation, with its body fields and responses: /docs/hiecm/v3/api/m1
- Error codes: /docs/hiecm/v3/api/m1/errors
