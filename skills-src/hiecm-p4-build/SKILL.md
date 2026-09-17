---
name: hiecm-p4-build
description: "Use when scaffolding an integration against ABDM P4 (setting up a health locker and listing the lockers and requests on an ABHA address): builds each journey as an observe-orient-decide-act loop against the sandbox."
---
# HIE-CM p4 build

Scaffolds an ABDM p4 integration one journey at a time. It covers setting up a health locker and listing the lockers and requests on an ABHA address.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### Subscription (`p4-subscription-phr`)

**Act: the calls in this journey, in order**

#### 1. This API will be invoked to get all the consent and subscription requests with given filters. (`p4_get_subscription_requests_v3_patients_requests`)

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/requests \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 2. This API will be invoked to get health locker settings of a patient by locker id. (`p4_get_subscription_requests_v3_patients_lockers_lockerid`)

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/lockers/{lockerId} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 3. The API provides the list of health locker that the ABHA address is subscribed to. (`p4_get_subscription_requests_v3_patients_lockers`)

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/lockers \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
[
  {
    "id": 212,
    "lockerId": "HIU_V3",
    "lockerName": "HIU_V3",
    "patientId": "<ABHA_ADDRESS>",
    "dateCreated": "2024-03-15T01:49:16.316Z",
    "dateModified": "2024-03-120T01:49:16.316Z",
    "isActive": true
  }
]
```

### Health-locker (`p4-health-locker`)

**Act: the calls in this journey, in order**

#### 1. This API will be invoked to setup health locker for a patient. (`p4_post_subscription_requests_v3_setup_locker`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/setup-locker \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
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

- Every operation, with its body fields and responses: /docs/hiecm/v3/api/p4
- Error codes: /docs/hiecm/v3/api/p4/errors
