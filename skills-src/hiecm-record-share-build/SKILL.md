---
name: hiecm-record-share-build
description: "Use when scaffolding an integration against ABDM RECORD-SHARE (a patient sharing chosen records with an HIU from a PHR app after scanning its QR code): builds each journey as an observe-orient-decide-act loop against the sandbox."
---
# HIE-CM record-share build

Scaffolds an ABDM record-share integration one journey at a time. It covers a patient sharing chosen records with an HIU from a PHR app after scanning its QR code.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### Record share, PHR app side (`record-share-phr`)

**Act: the calls in this journey, in order**

#### 1. Share a patient's records with the HIU whose QR code was scanned (`record-share_post_patient_record_v3_share`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/patient-record/v3/share \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIU-ID: HIU_ID' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: Bearer <USER_TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "metaData": {
    "hiuId": "MANISH_HIU",
    "counterId": "IN081010313"
  },
  "profile": {
    "patient": {
      "abhaNumber": null,
      "abhaAddress": "abhaAddress@sbx",
      "name": "String",
      "gender": "M",
      "dayOfBirth": "18",
      "monthOfBirth": "10",
      "yearOfBirth": "1991",
      "address": {
        "line": "String",
        "district": "String",
        "state": "String",
        "pincode": "XXXXXX"
      },
      "phoneNumber": "989141XXXX"
    }
  },
  "sharedRecordCount": 2,
  "consent": {
    "careContexts": [
      {
        "patientReference": "manishk1991@sbx",
        "careContextReference": "10004-20200001768-1"
      },
      {
        "patientReference": "manishk1991@sbx",
        "careContextReference": "10004-20200001768-2"
      }
    ],
    "permission": {
      "accessMode": "VIEW"
    },
    "dataEraseAt": "2025-10-11T08:58:09.738Z"
  }
}'
```

#### 2. Receive the HIU's data push URL and encryption key, as the PHR app (`record-share_post_v3_patient_record_on_share`)

Inbound to your bridge at `/api/v3/patient-record/on-share`. Acknowledge it and continue.

#### 3. Push the encrypted records to the HIU's data push URL, as the PHR app (`record-share_post_health_information_transfer`)

Outbound from your app. POST the encrypted records to the `dataPushUrl` the HIU sent in the on-share of step 2. The call goes straight to the HIU, not through the gateway. The HIU answers 202.

#### 4. Notify patient record (`record-share_post_patient_record_v3_notify`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/patient-record/v3/notify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIU-ID: HIU_ID' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "notification": {
    "transactionId": "a0e7bed4-ef98-4ea8-9077-f4a6192bfe2b",
    "doneAt": "2026-03-19T08:01:11.090Z",
    "statusNotification": {
      "sessionStatus": "TRANSFERRED",
      "statusResponses": [
        {
          "careContextReference": "COC497647c1-0627-48fa-8131-0dddc1b3e0b4",
          "hiStatus": "DELIVERED",
          "description": "Data sent successfully"
        },
        {
          "careContextReference": "COC497647c1-0627-48fa-8131-0dddc1b3e0b5",
          "hiStatus": "DELIVERED",
          "description": "Data sent successfully"
        }
      ]
    }
  }
}'
```

#### 5. Receive the other side's transfer status (`record-share_post_v3_patient_record_on_notify`)

Inbound to your bridge at `/api/v3/patient-record/on-notify`. Acknowledge it and continue.

#### 6. List the record sharing history of the signed in user (`record-share_get_patient_record_v3_audit_history`)

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/patient-record/v3/audit-history \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: Bearer <USER_TOKEN>'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
[
  {
    "requestId": "ed9f451d-9e07-484d-ab68-9972d6529d68",
    "abhaAddress": "manishk1991@sbx",
    "senderFacilityId": "MANISH_PHR_TEST",
    "senderFacilityName": "MANISH-PHR-TEST",
    "receiverFacilityId": "MANISH_HIU",
    "receiverFacilityName": "MANISH_HIU",
    "counterCode": "f4cd0d8e-25ec-465f-993c-01c91a56e0e4",
    "transactionId": "f413b202-16b6-4d4a-9900-5cdcfb8baa50",
    "status": "RECORD_SHARE_REQUESTED",
    "sharedRecordCount": 2,
    "consent": {
      "accessMode": "VIEW",
      "dataEraseAt": "2026-10-12T08:58:09.738Z",
      "careContexts": [
        {
          "patientReference": "manikandanb87@sbx",
          "careContextReference": "COC497647c1-0627-48fa-8131-0dddc1b3e0b4"
        },
        {
          "patientReference": "manikandanb87@sbx",
          "careContextReference": "COC497647c1-0627-48fa-8131-0dddc1b3e0b5"
        }
      ]
    },
    "dateCreated": "2025-12-08T12:04:53.594Z",
    "dateModified": "2025-12-08T12:04:53.594Z"
  }
]
```

### Record share, HIU side (`record-share-hiu`)

**Act: the calls in this journey, in order**

#### 1. Receive a patient's share request, as the HIU (`record-share_post_v3_patient_record_share`)

Inbound to your bridge at `/api/v3/patient-record/share`. Acknowledge it and continue.

#### 2. Submit the reply to a share request with the data push URL and the encryption key (`record-share_post_patient_record_v3_on_share`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/patient-record/v3/on-share \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIU-ID: HIU_ID' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "hiRequest": {
    "transactionId": "18235d89-cb13-479d-ad71-7a57d5f669a8",
    "dataPushUrl": "https://webhook.site/a2477c41-2185-47eb-835a/health-information/transfer",
    "keyMaterial": {
      "cryptoAlg": "ECDH.",
      "curve": "curve25519",
      "dhPublicKey": {
        "expiry": "2022-12-28T13:18:20.742Z",
        "parameters": "Ephemeral public key.",
        "keyValue": "BFN7KTdOT0jIAExG2A8Jg+01wMPWxptiGqwHRVvtiVEsUq2FR7P2UdqZxJyPJSeR6muai21iQhasNxnhh8I5M+g="
      },
      "nonce": "28236d89-cb13-479d-ad71-7a57d5f669a9"
    }
  },
  "response": {
    "requestId": "efd6964f-6893-4b66-9e4e-28afc164126b"
  }
}'
```

#### 3. Receive the encrypted records at the data push URL, as the HIU (`record-share_post_health_information_transfer`)

Inbound to your bridge at `/health-information/transfer`. Acknowledge it and continue.

#### 4. Receive the other side's transfer status (`record-share_post_v3_patient_record_on_notify`)

Inbound to your bridge at `/api/v3/patient-record/on-notify`. Acknowledge it and continue.

#### 5. Notify patient record (`record-share_post_patient_record_v3_notify`)

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/patient-record/v3/notify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIU-ID: HIU_ID' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "notification": {
    "transactionId": "3acbbb52-6de0-441f-b452-3c9488462b25",
    "doneAt": "2023-01-24T06:35:44.167Z",
    "statusNotification": {
      "sessionStatus": "RECEIVED",
      "statusResponses": [
        {
          "careContextReference": "10004-20200001768-1",
          "hiStatus": "VALID",
          "description": "Data received successfully"
        },
        {
          "careContextReference": "10004-20200001768-2",
          "hiStatus": "ERRORED",
          "description": "Data could not be decrypted"
        }
      ]
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 202 response. The specification gives no body for it, so read what comes back.

## Where the detail is

- Every operation, with its body fields and responses: /docs/hiecm/v3/api/record-share
- Error codes: /docs/hiecm/v3/api/record-share/errors
