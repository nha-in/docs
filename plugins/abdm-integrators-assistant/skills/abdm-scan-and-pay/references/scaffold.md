# HIE-CM scan-and-pay build

Scaffolds an ABDM scan-and-pay integration one journey at a time. It covers open orders, patient selection and payment status between a facility and a PHR app.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### Scan-pay (`scan-and-pay-abdm-scan-pay-hip`)

**Act: the calls in this journey, in order**

#### 1. This is an API is called by HIU to check the status of reports. (`scan-and-pay_post_v3_patient_share_open_order`)

Inbound to your bridge at `/v3/patient/share/open-order`. Acknowledge it and continue.

#### 2. This is an API called by HIP to HIE-CM to send all the open order for patient. (`scan-and-pay_post_scan_gateway_v3_patient_on_share_open_order`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/on-share/open-order \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '"<VALUE>"'
```

#### 3. This is the call back api for the selection API. This API needs to implement by HIP to receive all selected open order . (`scan-and-pay_post_v3_patient_selection`)

Inbound to your bridge at `/v3/patient/selection`. Acknowledge it and continue.

#### 4. This is an API is called by HIP to share payment bundle alone with procedures of the patient. (`scan-and-pay_post_scan_gateway_v3_patient_on_selection`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/on-selection \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '"<VALUE>"'
```

#### 5. This is an API called by HIP to send the payment status to HIU. (`scan-and-pay_post_scan_gateway_v3_patient_scan_pay_notify`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/scan-pay/notify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-HIP-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "acknowledgement": {
    "status": "SUCCESS/ CANCELED/ PENDING/ FAIL/ REFUND_INITIATED/ REFUND_SUCCESS",
    "abhaAddress": "<username>@sbx",
    "transactionId": "string",
    "orderNumber": "string",
    "openOrderRequestId": "b767614f-153a-4aa3-946f-1622596f0fab",
    "paymentDate": "2025-01-20T07:47:49.102Z",
    "paymentRecipetLink": "PDF URL LINK of RECIPT"
  }
}'
```

#### 6. This is an callback API for on-notify API need to implement by HIP to received the confirmation of notification. (`scan-and-pay_post_v3_patient_scan_pay_on_notify`)

Inbound to your bridge at `/v3/patient/scan-pay/on-notify`. Acknowledge it and continue.

#### 7. This is callback API for the order_status API. This Api needs to implement by HIP to receive the request for payment status. (`scan-and-pay_post_v3_patient_scan_pay_order_status`)

Inbound to your bridge at `/v3/patient/scan-pay/order-status`. Acknowledge it and continue.

#### 8. This is an API is called by HIP to check the status of reports. (`scan-and-pay_post_scan_gateway_v3_patient_scan_pay_on_order_status`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/scan-pay/on-order-status \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '"<VALUE>"'
```

**Exit condition (Observe until this is true)**

A 202 response. The specification gives no body for it, so read what comes back.

### Utility (`scan-and-pay-utility`)

**Act: the calls in this journey, in order**

#### 1. This is retrieve the all the details of the user. (`scan-and-pay_get_scan_gateway_v3_patient_scan_pay_details`)

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/scan-pay/details \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJ2YXNhbnRoYWt1bWFyLmtlc2F2'
```

#### 2. This API is used to update version to the serviceId. (`scan-and-pay_patch_gateway_v3_scanpay_updateversion`)

```bash
curl --request PATCH \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/scanPay/updateVersion \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "recordShareEnabled": true,
  "scanPayEnabled": true,
  "scanPayVersion": "v2",
  "serviceId": [
    "****_HIP, ***_HIU"
  ]
}'
```

**Exit condition (Observe until this is true)**

A 200 response. The specification gives no body for it, so read what comes back.

## Where the detail is

- Every operation, with its body fields and responses: /docs/hiecm/v3/api/scan-and-pay
- Error codes: /docs/hiecm/v3/api/scan-and-pay/errors
