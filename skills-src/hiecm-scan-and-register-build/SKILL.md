---
name: hiecm-scan-and-register-build
description: "Use when scaffolding an integration against ABDM SCAN-AND-REGISTER (receiving the profile a patient shares by QR code at a counter and answering with a queue token): builds each journey as an observe-orient-decide-act loop against the sandbox."
---
# HIE-CM scan-and-register build

Scaffolds an ABDM scan-and-register integration one journey at a time. It covers receiving the profile a patient shares by QR code at a counter and answering with a queue token.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### Scan and register (`scan-and-register-abdm-patient-share-hip`)

**Act: the calls in this journey, in order**

#### 1. Share HIP patient (`scan-and-register_post_v3_hip_patient_share`)

Inbound to your bridge at `/api/v3/hip/patient/share`. Acknowledge it and continue.

#### 2. Answer the patient share request (`scan-and-register_post_patient_share_v3_on_share`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/patient-share/v3/on-share \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "acknowledgement": {
    "status": "SUCCESS",
    "abhaAddress": "<ABHA_ADDRESS>",
    "profile": {
      "context": "43",
      "tokenNumber": "3",
      "expiry": 180
    }
  },
  "error": {
    "code": "ABDM-9999",
    "message": "Unknown exception"
  },
  "response": {
    "requestId": "6f0b4665-a915-4c92-aa36-65afb4a2cd71"
  }
}'
```

**Exit condition (Observe until this is true)**

A 202 response. The specification gives no body for it, so read what comes back.

## Where the detail is

- Every operation, with its body fields and responses: /docs/hiecm/v3/api/scan-and-register
- Error codes: /docs/hiecm/v3/api/scan-and-register/errors
