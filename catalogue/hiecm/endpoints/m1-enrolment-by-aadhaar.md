---
id: hiecm.endpoint.m1-enrolment-by-aadhaar
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Create an ABHA from a verified Aadhaar OTP
summary: >
  Exchanges the OTP you just received for a real ABHA number.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm-m1.yaml, which
      comes from this source.
verified:
  status: unverified
related:
  errors: [hiecm.error.900900, hiecm.error.abdm-2401, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  flows: [hiecm.flow.m1-create-abha-aadhaar-otp, hiecm.flow.m1-create-abha-face-auth]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Create an ABHA from a verified Aadhaar OTP

## In plain words

Exchanges the OTP you just received for a real ABHA number. Send the
`txnId` from the OTP request, the encrypted OTP value, and the consent
block recording that the person agreed.

This is the call that creates the account, so treat a success as a
permanent side effect. If you retry it blindly after a timeout you may be
asking NHA to enrol somebody twice.

`BENEFIT_NAME` is sent on this call in NHA's collection when the
enrolment belongs to a benefit scheme.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The person logged in, so you hold their `X-token`. See [log somebody in](../flows/m1-login-by-mobile.md).

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'BENEFIT_NAME: <BENEFIT_SCHEME_NAME>' \
  -H 'X-token: <X_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'Content-Type: application/json' \
  -d '{
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

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

Idempotency: not established. NHA does not document whether repeating this call with the same body is safe, and it has not been tested here. Treat a retry after a timeout as potentially creating a second effect until that is proven.

## How you know it worked

Not yet observed. NHA's collection saves no response body for this operation, so this catalogue does not state a shape, because guessing one is worse than admitting the gap.

When you run this against the sandbox, record the exact response here and set `verified.status` to verified with the date and who ran it. Until then treat any assumption about the response as unproven.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- The person scoped token is wrong or expired. See [ABDM-2401](../errors/abdm-2401.md).
- Authentication fails without saying why. See [900900](../errors/900900.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

