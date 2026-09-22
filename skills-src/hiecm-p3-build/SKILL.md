---
name: hiecm-p3-build
description: "Use when scaffolding an integration against ABDM P3 (reading, approving, denying, enabling, disabling and updating the patient's subscriptions and subscription requests, and the subscription request and notifications on the health locker side): builds each journey as an observe-orient-decide-act loop against the sandbox."
---
# HIE-CM p3 build

Scaffolds an ABDM p3 integration one journey at a time. It covers reading, approving, denying, enabling, disabling and updating the patient's subscriptions and subscription requests, and the subscription request and notifications on the health locker side.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### Subscription request and notifications, HIU side (`p3-subscription-hiu`)

**Act: the calls in this journey, in order**

#### 1. Initiate subscription request (`p3_post_subscription_requests_v3_init`)

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
      "id": "<ABHA_ADDRESS>"
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

#### 2. Receive the HIU subscription requests on init (`p3_post_v3_hiu_hiecm_subscription_requests_on_init`)

Inbound to your bridge at `/api/v3/hiu/hiecm/subscription-requests/on-init`. Acknowledge it and continue.

#### 3. Notify subscription requests HIU (`p3_post_v3_hiu_subscription_requests_hiu_notify`)

Inbound to your bridge at `/api/v3/hiu/subscription-requests/hiu/notify`. Acknowledge it and continue.

#### 4. Answer the subscription request notification (`p3_post_subscription_requests_v3_hiu_on_notify`)

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

#### 5. Notify HIU subscription (`p3_post_v3_hiu_subscription_notify`)

Inbound to your bridge at `/api/v3/hiu/subscription/notify`. Acknowledge it and continue.

#### 6. Answer the care context subscription notification (`p3_post_subscription_requests_v3_hiu_care_context_on_notify`)

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

### Subscription approval and management, PHR side (`p3-subscription-phr`)

**Act: the calls in this journey, in order**

#### 1. Approve subscription request (`p3_post_subscription_requests_v3_request_id_approve`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/{request-id}/approve \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "isApplicableForAllHIPs": true,
  "includedSources": [
    {
      "hiTypes": [
        "Prescription",
        "DiagnosticReport",
        "OPConsultation",
        "DischargeSummary",
        "ImmunizationRecord",
        "HealthDocumentRecord",
        "WellnessRecord",
        "Invoice"
      ],
      "purpose": {
        "text": "Care Management",
        "code": "CAREMGT",
        "refUri": "www.abdm.gov.in"
      },
      "categories": [
        "LINK",
        "DATA"
      ],
      "period": {
        "from": "2025-01-09T09:00:00.000Z",
        "to": "2124-12-31T09:00:00.000Z"
      }
    }
  ],
  "excludedSources": []
}'
```

#### 2. Deny subscription request (`p3_post_subscription_requests_v3_request_id_deny`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/{request-id}/deny \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "reason": "Subscription denied."
}'
```

#### 3. Fetch his/her subscription requests details (`p3_get_subscription_requests_v3_requests`)

```bash
curl --request GET \
  --url "https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/requests?limit=5&offset=5&status=ALL" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 4. Edit the subscription details (`p3_put_subscription_requests_v3_patients_subscription_id`)

```bash
curl --request PUT \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/{subscription-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "hiuId": "INDIA_HIU",
  "subscriptionEditAndApprovalRequest": {
    "isApplicableForAllHIPs": true,
    "includedSources": [
      {
        "hiTypes": [
          "Prescription"
        ],
        "purpose": {
          "text": "Care Management",
          "code": "CAREMGT",
          "refUri": "https://abc.def.in"
        },
        "hip": {
          "id": "INDIA_HIP",
          "name": "INDIA HIP",
          "type": "HIP"
        },
        "categories": [
          "LINK"
        ],
        "period": {
          "from": "2024-05-09T10:34:00.389Z",
          "to": "2024-05-09T10:34:00.389Z"
        },
        "status": "SUCCESS"
      }
    ],
    "excludedSources": [
      {
        "hiTypes": [
          "Prescription"
        ],
        "purpose": {
          "text": "Care Management",
          "code": "CAREMGT",
          "refUri": "https://abc.def.in"
        },
        "hip": {
          "id": "INDIA_HIP",
          "name": "INDIA HIP",
          "type": "HIP"
        },
        "categories": [
          "LINK"
        ],
        "period": {
          "from": "2024-05-09T10:34:00.389Z",
          "to": "2024-05-09T10:34:00.389Z"
        },
        "status": "SUCCESS"
      }
    ]
  }
}'
```

#### 5. Disable the subscription by subscription ID (`p3_post_subscription_requests_v3_disable_subscription_id`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/disable/{subscription-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 6. Enable the subscription by subscription ID (`p3_post_subscription_requests_v3_enable_subscription_id`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/enable/{subscription-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 7. Fetch his/her subscription details by subscription REQUEST-ID (`p3_get_subscription_requests_v3_request_request_id`)

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/request/{request-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 8. Fetch his/her subscription details by subscription ID (`p3_get_subscription_requests_v3_subscription_id`)

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/{subscription-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "subscriptionId": "f29f0e59-8388-4698-9fe6-05db67aeac46",
  "purpose": {
    "text": "Care Management",
    "code": "CAREMGT",
    "refUri": "https://abc.def.in"
  },
  "dateCreated": "2021-09-28T12:30:08.573Z",
  "status": "GRANTED",
  "dateGranted": "2021-09-28T12:30:08.573Z",
  "patient": {
    "id": "<ABHA_ADDRESS>"
  },
  "requester": {
    "id": "<ABHA_ADDRESS>",
    "name": "ABDM_HIU",
    "type": "HIU"
  },
  "includedSources": [
    {
      "hip": {
        "id": "INDIA_HIP",
        "name": "INDIA HIP",
        "type": "HIP"
      },
      "categories": [
        "LINK"
      ],
      "hiTypes": [
        "Prescription"
      ],
      "period": {
        "from": "2024-05-09T10:34:00.389Z",
        "to": "2024-05-09T10:34:00.389Z"
      },
      "status": "GRANTED"
    }
  ]
}
```

## Where the detail is

- Every operation, with its body fields and responses: /docs/hiecm/v3/api/p3
- Error codes: /docs/hiecm/v3/api/p3/errors
