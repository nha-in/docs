---
name: hiecm-subscription-build
description: "Use when scaffolding an integration against ABDM SUBSCRIPTION (subscribing an HIU to changes on an ABHA address, and health lockers): builds each journey as an observe-orient-decide-act loop against the sandbox."
---
# HIE-CM subscription build

Scaffolds an ABDM subscription integration one journey at a time. It covers subscribing an HIU to changes on an ABHA address, and health lockers.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### Subscription (`subscription-subscription-hiu`)

**Act: the calls in this journey, in order**

#### 1. This API will be invoked by the HIU/patient/user to initiate subscription request. (`subscription_post_subscription_requests_v3_init`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/init \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "subscription": {
    "purpose": {
      "text": "Care Management",
      "code": "CAREMGT",
      "refUri": "https://abc.def.in"
    },
    "patient": {
      "id": "radhikha@sbx"
    },
    "hiu": {
      "id": "INDIA_HIU",
      "name": "INDIA HIU",
      "type": "HIU"
    },
    "hips": [
      {
        "id": "INDIA_HIP",
        "name": "INDIA HIP",
        "type": "HIP"
      }
    ],
    "categories": [
      "LINK"
    ],
    "period": {
      "from": "2024-05-09T10:34:00.389Z",
      "to": "2024-05-09T10:34:00.389Z"
    }
  }
}'
```

#### 2. This is a callback api for /api/hiecm/subscription-requests/v3/init. (`subscription_post_v3_hiu_hiecm_subscription_requests_on_init`)

Inbound to your bridge at `/api/v3/hiu/hiecm/subscription-requests/on-init`. Acknowledge it and continue.

#### 3. This is a callback api when a subscription request is approved or denied. (`subscription_post_v3_hiu_subscription_requests_hiu_notify`)

Inbound to your bridge at `/api/v3/hiu/subscription-requests/hiu/notify`. Acknowledge it and continue.

#### 4. This API will be invoked by the HIU to respond to /subscription-requests/hiu/notify. (`subscription_post_subscription_requests_v3_hiu_on_notify`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/hiu/on-notify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "acknowledgement": {
    "status": "OK",
    "subscriptionRequestId": "f29f0e59-8388-4698-9fe6-05db67aeac46"
  },
  "error": {
    "code": "ABDM-1001",
    "message": "No data found"
  },
  "response": {
    "requestId": "f29f0e59-8388-4698-9fe6-05db67aeac46"
  }
}'
```

#### 5. This is a callback api to notify the subscribed HIU when a care context is linked or updated for a patient. (`subscription_post_v3_hiu_subscription_notify`)

Inbound to your bridge at `/api/v3/hiu/subscription/notify`. Acknowledge it and continue.

#### 6. This API will be invoked by the HIU to respond to /api/v3/hiu/subscription/notify. (`subscription_post_subscription_requests_v3_hiu_care_conte_96bc45`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/hiu/care-context/on-notify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "acknowledgement": {
    "status": "OK",
    "eventId": "3c2f0e59-8388-4698-9fe6-05db67aeac46"
  },
  "error": {
    "code": "ABDM-1001",
    "message": "No data found"
  },
  "response": {
    "requestId": "f29f0e59-8388-4698-9fe6-05db67aeac46"
  }
}'
```

**Exit condition (Observe until this is true)**

A 202 response. The specification gives no body for it, so read what comes back.

### Health-locker (`subscription-health-locker`)

**Act: the calls in this journey, in order**

#### 1. This API will be invoked to setup health locker for a patient. (`subscription_post_subscription_requests_v3_setup_locker`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/setup-locker \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJ2YXNhbnRoYWt1bWFyLmtlc2F2' \
  --header 'X-LOCKER-ID: <X_LOCKER_ID>'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "consentAutoApprovalId": "e5ec415f-c098-40f6-a0db-faa162fc5295"
}
```

## Where the detail is

- Every operation, with its body fields and responses: /docs/hiecm/v3/api/subscription
- Error codes: /docs/hiecm/v3/api/subscription/errors
