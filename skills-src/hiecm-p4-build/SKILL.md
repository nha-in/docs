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

### Locker (`p4-locker`)

**Act: the calls in this journey, in order**

#### 1. Setup health locker for a patient (`p4_post_subscription_requests_v3_setup_locker`)

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

#### 2. Get the subscription requests patients lockers (`p4_get_subscription_requests_v3_patients_lockers`)

```bash
curl --request GET \
  --url "https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/lockers?includeInactive=true" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 3. Get health locker settings of a patient by locker ID (`p4_get_subscription_requests_v3_patients_lockers_lockerid`)

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/lockers/{locker-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 4. Get all the consent and subscription requests with given filters (`p4_get_subscription_requests_v3_patients_requests`)

```bash
curl --request GET \
  --url "https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/requests?consentLimit=<CONSENTLIMIT>&consentOffset=<CONSENTOFFSET>&subscriptionLimit=<SUBSCRIPTIONLIMIT>&subscriptionOffset=<SUBSCRIPTIONOFFSET>&status=ALL" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 5. Fetch the record with health locker enabled provider details (`p4_get_gateway_v3_health_lockers`)

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/health-lockers \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
[
  {
    "identifier": {
      "name": "AB - PMJAY",
      "id": "PMJAY"
    },
    "facilityType": [
      "HIP"
    ],
    "isHip": true,
    "isGovtEntity": false,
    "endpoints": {
      "healthLockerEndpoints": [
        {
          "use": "registration",
          "connectionType": "HTTPS",
          "address": "https://abc.com/register"
        }
      ]
    }
  }
]
```

## Where the detail is

- Every operation, with its body fields and responses: /docs/hiecm/v3/api/p4
