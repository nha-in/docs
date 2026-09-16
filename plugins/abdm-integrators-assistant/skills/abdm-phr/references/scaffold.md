# HIE-CM phr build

Scaffolds an ABDM phr integration one journey at a time. It covers the patient side: ABHA address, login, discovery, linking, consent and lockers.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### Hip-initiated-linking (`phr-abdm-hip-initiated-linking-phr`)

**Act: the calls in this journey, in order**

#### 1. This is the PHR  APP API, this api will used to fetch all link care-context for a patient.  (`phr_get_hip_v3_link_patient_links`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/hip/v3/link/patient/links \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <X_AUTH_TOKEN>'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "Patient": {
    "id": "<ABHA_ADDRESS>",
    "links": [
      {
        "hip": {
          "id": "ABDM_HIP",
          "name": "ABC Hospital",
          "type": "HIP"
        },
        "referenceNumber": "string",
        "display": "string",
        "hiType": "DiagnosticReport",
        "careContexts": [
          {
            "referenceNumber": "TMH-PUID-001",
            "display": "display 1"
          }
        ],
        "dateCreated": "2024-05-09T10:34:00.387Z"
      }
    ]
  }
}
```

### User-initiated-linking (`phr-abdm-user-initiated-linking-phr`)

**Act: the calls in this journey, in order**

#### 1. This API will be invoked by the patient/user from PHR application to discover his/her health records. (`phr_post_user_initiated_linking_v3_patient_care_context_discover`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/user-initiated-linking/v3/patient/care-context/discover \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "hip": {
    "id": "cowin_hip_01"
  },
  "unverifiedIdentifiers": [
    {
      "type": "MOBILE",
      "value": "+9198765*****"
    }
  ]
}'
```

#### 2. This API endpoint is used by healthcare information users (HIUs) to receive the discovered care contexts of a patient. It provides detailed information about the patient’s care contexts, including any errors encountered during the discovery process. (`phr_post_v3_hiu_patient_care_context_on_discover`)

Inbound to your bridge at `/api/v3/hiu/patient/care-context/on-discover`. Acknowledge it and continue.

#### 3. This API will be invoked by the patient/user to link his/her health records. (`phr_post_user_initiated_linking_v3_link_care_context_init`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/user-initiated-linking/v3/link/care-context/init \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "transactionId": "f901b782-bfdf-4224-9f8d-da2cadc20c0d",
  "patient": [
    {
      "referenceNumber": "<ABHA_ADDRESS>",
      "display": "Test",
      "careContexts": [
        {
          "referenceNumber": "abc123",
          "display": "Sugar Test"
        }
      ],
      "hiType": "OPConsultation",
      "count": 1
    }
  ]
}'
```

#### 4. This API endpoint is used by healthcare information users (HIUs) to receive the initial linking of care contexts for a patient. It provides detailed information about the linking process, including authentication details and any errors encountered. (`phr_post_v3_hiu_patient_care_context_on_init`)

Inbound to your bridge at `/api/v3/hiu/patient/care-context/on-init`. Acknowledge it and continue.

#### 5. This API will be invoked by the patient/user to confirm his/her health records. (`phr_post_user_initiated_linking_v3_link_care_context_confirm`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/user-initiated-linking/v3/link/care-context/confirm \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "token": 123456,
  "linkRefNumber": "d353b782-bfdf-4224-9f8d-da2cadc20c0d"
}'
```

#### 6. This API endpoint is used by healthcare information users (HIUs) to receive confirmation of the linked care contexts for a patient. It provides detailed information about the patient’s care contexts, including any errors encountered during the confirmation process. (`phr_post_v3_hiu_patient_care_context_on_confirm`)

Inbound to your bridge at `/api/v3/hiu/patient/care-context/on-confirm`. Acknowledge it and continue.

**Exit condition (Observe until this is true)**

A 200 response. The specification gives no body for it, so read what comes back.

### Hiecm-patient-share (`phr-abdm-hiecm-patient-share-phr`)

**Act: the calls in this journey, in order**

#### 1. This API will be invoked from the PHR-HIU application for sharing the patient/user profile with the HMIS/LIMS. (`phr_post_patient_share_v3_share`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/patient-share/v3/share \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-HIU-ID: HIU_ID' \
  --header 'X-AUTH-TOKEN: Bearer <TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "intent": "PROFILE_SHARE",
  "metaData": {
    "hipId": "HIP_1",
    "context": "6",
    "hprId": "<EMAIL>",
    "latitude": 20.5937,
    "longitude": 78.9629
  },
  "profile": {
    "patient": {
      "abhaNumber": "<ABHA_NUMBER>",
      "abhaAddress": "<ABHA_ADDRESS>",
      "name": "Abdul Kalam",
      "gender": "M",
      "dayOfBirth": "1",
      "monthOfBirth": "8",
      "yearOfBirth": "9999",
      "address": {
        "line": "Address line 1",
        "district": "Coimbatore",
        "state": "Tamil Nadu",
        "pincode": "641050"
      },
      "phoneNumber": "<MOBILE_NUMBER>"
    }
  }
}'
```

#### 2. This API will be invoked to the HIU for sharing the response of HIECM's /api/hiecm/patient-share/v3/on-share API (`phr_post_v3_hiu_patient_on_share`)

Inbound to your bridge at `/api/v3/hiu/patient/on-share`. Acknowledge it and continue.

#### 3. This API will be invoked to get the historical token numbers of the patient (`phr_get_patient_share_v3_profile_gettokendetails`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/patient-share/v3/profile/getTokenDetails \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: Bearer <TOKEN>'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
"<VALUE>"
```

### Consent-management-data-flow (`phr-consent-management-data-flow-phr`)

**Act: the calls in this journey, in order**

#### 1. This is ABDM HIE-CM API called by patients to approve the consent request raised by HIU from PHR/mobile application. (`phr_post_consent_v3_request_request_id_approve`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/consent/v3/request/{request-id}/approve \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "consents": [
    {
      "hiTypes": [
        "Prescription"
      ],
      "hip": {
        "id": "ABCD_12345",
        "name": "ABCD Hospital",
        "type": "HIP"
      },
      "careContexts": [
        {
          "patientReference": "batman@tmh",
          "careContextReference": "Episode1"
        }
      ],
      "permission": {
        "dateRange": {
          "from": "2021-09-28T12:30:08.573Z",
          "to": "2021-09-28T12:30:08.573Z"
        },
        "frequency": {
          "unit": "HOUR",
          "value": 1,
          "repeats": 0
        },
        "accessMode": "VIEW",
        "dataEraseAt": "2021-09-28T12:30:08.573Z"
      }
    }
  ]
}'
```

#### 2. This is ABDM HIE-CM API called by patients to deny the consent request raised by HIU from PHR/mobile application. (`phr_post_consent_v3_request_request_id_deny`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/consent/v3/request/{request-id}/deny \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "reason": "Not authorized"
}'
```

#### 3. This is ABDM HIE-CM API called by patients to revoke the granted consent from PHR/mobile application. (`phr_post_consent_v3_revoke`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/consent/v3/revoke \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "consents": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ]
}'
```

#### 4. This is ABDM HIE-CM API called to get the consent request details by request id. (`phr_get_consent_v3_request_request_id`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/consent/v3/request/{request-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 5. This is ABDM HIE-CM API called to fetch all the consent request details of a patient. (`phr_get_consent_v3_request`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/consent/v3/request \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 6. This is ABDM HIE-CM API called to fetch all the consent artefact details associated with a consent request request-id. (`phr_get_consent_v3_artefact_request_request_id`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/consent/v3/artefact/request/{request-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 7. This is ABDM HIE-CM API called to fetch the consent artefact details associated with the artefact-id. (`phr_get_consent_v3_artefact_artefact_id`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/consent/v3/artefact/{artefact-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 8. This is ABDM HIE-CM API called to fetch all the consent artefact details of a patient. (`phr_get_consent_v3_artefact`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/consent/v3/artefact \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 9. This is ABDM HIE-CM API called to setup an auto-approval policy for given HIU. (`phr_post_consent_v3_auto_approve`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/consent/v3/auto/approve \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "isApplicableForAllHIPs": false,
  "hiu": {
    "id": "cowin_hiu_01",
    "name": "Cowin",
    "type": "HIU"
  },
  "includedSources": [
    {
      "hiTypes": [
        "Prescription"
      ],
      "purpose": {
        "text": "Care Management",
        "code": "CAREMGT",
        "refUri": "www.abc.com"
      },
      "hip": {
        "id": "cowin_hip_01",
        "name": "Cowin",
        "type": "HIP"
      },
      "period": {
        "from": "2021-09-28T12:30:08.573Z",
        "to": "2021-09-28T12:30:08.573Z"
      }
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
        "refUri": "www.abc.com"
      },
      "hip": {
        "id": "cowin_hip_01",
        "name": "Cowin",
        "type": "HIP"
      },
      "period": {
        "from": "2021-09-28T12:30:08.573Z",
        "to": "2021-09-28T12:30:08.573Z"
      }
    }
  ]
}'
```

#### 10. This is ABDM HIE-CM API called to disable the auto-approval policy. (`phr_post_consent_v3_auto_approve_auto_approval_id_disable`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/consent/v3/auto/approve/{auto-approval-id}/disable \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 11. This is ABDM HIE-CM API called to enable the auto-approval policy. (`phr_post_consent_v3_auto_approve_auto_approval_id_enable`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/consent/v3/auto/approve/{auto-approval-id}/enable \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

**Exit condition (Observe until this is true)**

A 202 whose body matches:

```json
{
  "message": "Successfully enabled auto approval policy",
  "error": {
    "code": "ABDM-1001",
    "message": "unable to connect database"
  }
}
```

### Subscription (`phr-subscription-phr`)

**Act: the calls in this journey, in order**

#### 1. This API will be invoked by the patient/user from PHR application to fetch his/her subscription requests details. (`phr_get_subscription_requests_v3_requests`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/subscription-requests/v3/requests \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 2. This API will be invoked by the patient/user from PHR application to approve subscription request. (`phr_post_subscription_requests_v3_request_id_approve`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/subscription-requests/v3/{request-id}/approve \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "isApplicableForAllHIPs": false,
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
      }
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
      }
    }
  ]
}'
```

#### 3. This API will be invoked by the patient/user from PHR application to deny subscription request. (`phr_post_subscription_requests_v3_request_id_deny`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/subscription-requests/v3/{request-id}/deny \
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

#### 4. This API will be invoked to edit the subscription details. (`phr_put_subscription_requests_v3_patients_subscription_id`)

```bash
curl --request PUT \
  --url https://abhasbx.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/{subscription-id} \
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

#### 5. This API will be invoked to enable the subscription by subscription id. (`phr_post_subscription_requests_v3_enable_subscription_id`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/subscription-requests/v3/enable/{subscription-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 6. This API will be invoked to disable the subscription by subscription id. (`phr_post_subscription_requests_v3_disable_subscription_id`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/subscription-requests/v3/disable/{subscription-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 7. This API will be invoked by the patient/user from PHR application to fetch his/her subscription details by subscription id. (`phr_get_subscription_requests_v3_subscription_id`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/subscription-requests/v3/{subscription-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 8. This API will be invoked by the patient/user from PHR application to fetch his/her subscription details by subscription request id. (`phr_get_subscription_requests_v3_request_request_id`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/subscription-requests/v3/request/{request-id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 9. This API will be invoked to get all the consent and subscription requests with given filters. (`phr_get_subscription_requests_v3_patients_requests`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/requests \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 10. This API will be invoked to get health locker settings of a patient by locker id. (`phr_get_subscription_requests_v3_patients_lockers_lockerid`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/lockers/{lockerId} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

#### 11. The API provides the list of health locker that the ABHA address is subscribed to. (`phr_get_subscription_requests_v3_patients_lockers`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/lockers \
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

### Hiecm-scan-pay (`phr-abdm-hiecm-scan-pay-phr`)

**Act: the calls in this journey, in order**

#### 1. This API will be invoked from the integrator application (any PHR application, just like ABHA) to share the user/patient payment details with HMIS/LIMS. (`phr_post_scan_gateway_v3_patient_share_open_order`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/share/open-order \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "intent": "OPEN_PAYMENT_ORDER",
  "metaData": {
    "hipId": "HIP_1",
    "counterId": "123-456"
  },
  "profile": {
    "patient": {
      "abhaNumber": "91-7507-xxxx-xxxx",
      "abhaAddress": "<ABHA_ADDRESS>",
      "name": "name",
      "gender": "M",
      "dayOfBirth": "string",
      "monthOfBirth": "string",
      "yearOfBirth": "string",
      "address": {
        "line": "Address line 1",
        "district": "XXXXXXX",
        "state": "XXXXXX",
        "pincode": "XXXXXX"
      },
      "phoneNumber": "987654xxxx"
    }
  }
}'
```

#### 2. This is a callback API for patient on-share. This Api needs to implement by HIU for receive all the open order. (`phr_post_v3_patient_on_share_open_order`)

Inbound to your bridge at `/v3/patient/on-share/open-order`. Acknowledge it and continue.

#### 3. This is an API called by HIU to select the all open-order and send to HIP for a payment request detail. (`phr_post_scan_gateway_v3_patient_selection`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/selection \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '"<VALUE>"'
```

#### 4. This is callback api for the  API. This Api needs to implement by HIU to received all the select open order payment requests. (`phr_post_v3_patient_on_selection`)

Inbound to your bridge at `/v3/patient/on-selection`. Acknowledge it and continue.

#### 5. This is callback API for the notify API. This API needs to implement by HIU to received the payment status. (`phr_post_v3_patient_scan_pay_notify`)

Inbound to your bridge at `/v3/patient/scan-pay/notify`. Acknowledge it and continue.

#### 6. This is an API is called by HIU to notify to HIP so that confirm that the HIU received the payment status. (`phr_post_scan_gateway_v3_patient_scan_pay_on_notify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/scan-pay/on-notify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '"<VALUE>"'
```

#### 7. This is an API is called by HIU to check the status of reports. (`phr_post_scan_gateway_v3_patient_scan_pay_order_status`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/scan-pay/order-status \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "queryStatus": {
    "orderNumber": "string",
    "abhaAddress": "<ABHA_ADDRESS>",
    "openOrderRequestId": "0d8bd16b-117c-4d07-9916-109fe3a9ab88"
  }
}'
```

#### 8. This is callback for the on-order-status API. This API needs to implement by HIU for receive the payment status. (`phr_post_v3_patient_scan_pay_on_order_status`)

Inbound to your bridge at `/v3/patient/scan-pay/on-order-status`. Acknowledge it and continue.

**Exit condition (Observe until this is true)**

A 200 response. The specification gives no body for it, so read what comes back.

### P1 - Create ABHA Address Flow (`phr-p1-create-abha-address-flow`)

**Act: the calls in this journey, in order**

#### 1. 3 flows: Enroll ABHA Address (`phr_post_v3_phr_app_enrollment_enrol`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/enrol \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "27d444b7-2a3d-46d8-bf67-e5590b6c46b6",
  "phrDetails": {
    "mobile": "<BASE64_PHOTO>",
    "firstName": "John",
    "middleName": "",
    "lastName": "Doe",
    "yearOfBirth": "1997",
    "dayOfBirth": "",
    "monthOfBirth": "01",
    "gender": "M",
    "email": "",
    "profilePhoto": "",
    "address": "pune Maharashtra",
    "stateName": "Maharashtra",
    "stateCode": "27",
    "districtName": "Nashik",
    "districtCode": "123",
    "pinCode": "422003",
    "abhaAddress": "<ABHA_ADDRESS>",
    "password": "<BASE64_PHOTO>"
  }
}'
```

#### 2. 3 flows: isExists API, isExists API Copy (`phr_get_v3_phr_app_enrollment_isexists`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/isExists \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 3. 3 flows: OTP Request - Mobile, OTP Request - ABHA OTP, OTP Request - AADHAR OTP (`phr_post_v3_phr_app_enrollment_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/request/otp \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-enroll",
    "mobile-verify"
  ],
  "loginHint": "mobile-number",
  "loginId": "{{encryptedData}}",
  "otpSystem": "abdm"
}'
```

#### 4. 3 flows: Suggestion API (`phr_post_v3_phr_app_enrollment_suggestion`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/suggestion \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "ee10d1c7-e25f-40e0-a3a1-df4c1dda02211",
  "firstName": "John",
  "lastName": "Doe",
  "dayOfBirth": "01",
  "monthOfBirth": "01",
  "yearOfBirth": "1990",
  "email": ""
}'
```

#### 5. 3 flows: OTP Verify - Mobile, OTP Verify - ABHA OTP, OTP Verify - AADHAR OTP (`phr_post_v3_phr_app_enrollment_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/verify \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-enroll",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa",
      "otpValue": "{{encryptedData}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "1cba575d-02cd-40be-90e6-1e2edca88a88",
  "message": "OTP Verified Successfully",
  "authResult": "success",
  "users": [
    {
      "abhaAddress": "<ABHA_ADDRESS>",
      "fullName": "John Doe",
      "abhaNumber": "XX-XXXX-XXXX-1234",
      "status": "ACTIVE",
      "kycStatus": "VERIFIED"
    }
  ],
  "tokens": {
    "token": "<JWT TOKEN>",
    "expiresIn": 1800,
    "refreshToken": "<JWT TOKEN>",
    "refreshExpiresIn": 1296000
  }
}
```

### P2 -PHR Profile (`phr-p2-phr-profile`)

**Act: the calls in this journey, in order**

#### 1. Get Profile (`phr_get_v3_phr_app_login_profile`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 2. Get PHR Card (`phr_get_v3_phr_app_login_profile_phrcard`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/phrCard \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 3. Get QR Code (`phr_get_v3_phr_app_login_profile_qrcode`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/qrCode \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 4. Logout (`phr_get_v3_phr_app_login_profile_request_logout`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/request/logout \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 5. 4 flows: Send Otp - Update Email, Send Otp - Update Mobile, Send ABHA Otp - Link-DeLink, Send AADHAAR Otp - Link-DeLink (`phr_post_v3_phr_app_login_profile_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/request/otp \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-profile",
    "email-verify"
  ],
  "loginHint": "email",
  "loginId": "{{encryptedData}}",
  "otpSystem": "abdm"
}'
```

#### 6. Refresh Token (`phr_get_v3_phr_app_login_profile_request_token`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/request/token \
  --header 'R-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 7. Update Profile (`phr_post_v3_phr_app_login_profile_updateprofile`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/updateProfile \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "profilePhoto": "",
  "firstName": "John",
  "middleName": "",
  "lastName": "Doe",
  "dayOfBirth": "11",
  "monthOfBirth": "05",
  "yearOfBirth": "1997",
  "gender": "M",
  "email": "<EMAIL>",
  "mobile": "******0903",
  "address": "Patoda, Yeola, Nashik, Maharashtra1",
  "stateName": "Maharashtra",
  "districtName": "Nashik",
  "pinCode": "423401",
  "stateCode": "27",
  "districtCode": "12"
}'
```

#### 8. 5 flows: Verify Otp - Update Email, Verify Otp - Update Mobile, Verify Password - Update Password, Verify ABHA Otp - Link-DeLink, Verify AADHAAR Otp - Link-DeLink (`phr_post_v3_phr_app_login_profile_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/verify \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-profile",
    "email-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa",
      "otpValue": "{{encryptedData}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "e10ca603-97f5-4cf2-8191-d51ea7db3845",
  "message": "Entered OTP is incorrect. Kindly re-enter valid OTP.",
  "authResult": "failed",
  "users": []
}
```

### P2 - Link ABHA Number (`phr-p2-link-abha-number`)

**Act: the calls in this journey, in order**

#### 1. 2 flows: Link Request (`phr_post_v3_phr_app_login_profile_link`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/link \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "action": "LINK",
  "transactionId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa"
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "message": "ABHA number is securely linked to ABHA address",
  "authResult": "success"
}
```

### P2 - Switch Profile (`phr-p2-switch-profile`)

**Act: the calls in this journey, in order**

#### 1. Switch Profile (`phr_get_v3_phr_app_login_profile_switch_profile`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/switch-profile \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 2. Verify User Switch Profile (`phr_post_v3_phr_app_login_profile_verify_switch_profile_user`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/verify/switch-profile/user \
  --header 'T-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>",
  "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa"
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "token": "<JWT TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<JWT TOKEN>",
  "refreshExpiresIn": 1296000
}
```

### P1-Registration-login (`phr-p1-registration-login`)

**Act: the calls in this journey, in order**

#### 1. PHR Certificate (`phr_get_v3_phr_app_login_public_certificate`)

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/public/certificate \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

#### 2. 6 flows: Verify User, Verify - User (`phr_post_v3_phr_app_login_verify_user`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/verify/user \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'T-token: Bearer <JWT TOKEN>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>",
  "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa"
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "token": "<JWT TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<JWT TOKEN>",
  "refreshExpiresIn": 1296000
}
```

### P1 - PHR Login (`phr-p1-phr-login`)

**Act: the calls in this journey, in order**

#### 1. 7 flows: OTP Request - Mobile, OTP Request - Email, OTP Request -  ABHAADDRES Mobile, OTP Request - AADHAR OTP, OTP Request - ABHA OTP, OTP Request -  ABHAADDRES Email, new OTP Request- AADHAAR (`phr_post_v3_phr_app_login_request_otp`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-login",
    "mobile-verify"
  ],
  "loginHint": "mobile-number",
  "loginId": "{{encryptedData}}",
  "otpSystem": "abdm"
}'
```

#### 2. 8 flows: Login OTP Verify - Mobile, Login OTP Verify - Email, Login OTP Verify - ABHAADDRES Mobile, Login OTP Verify - AADHAR, Login OTP Verify - ABHA, Login Verify - Password, Login OTP Verify - ABHAADDRESS Email, new OTP verify- AADHAAR (`phr_post_v3_phr_app_login_verify`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/verify \
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
      "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa",
      "otpValue": "{{encryptedData}}"
    }
  }
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "txnId": "b81a963d-4b97-48b4-9f9f-acf9f13afab7",
  "message": "OTP verified successfully",
  "authResult": "success",
  "users": [
    {
      "abhaAddress": "<ABHA_ADDRESS>",
      "fullName": "John Doe",
      "abhaNumber": "91-5326-6278-XXXX",
      "status": "ACTIVE",
      "kycStatus": "VERIFIED"
    },
    {
      "abhaAddress": "<ABHA_ADDRESS>",
      "fullName": "John Doe",
      "abhaNumber": "91-5326-6278-XXXX",
      "status": "ACTIVE",
      "kycStatus": "PENDING"
    },
    {
      "abhaAddress": "<ABHA_ADDRESS>",
      "fullName": "John Doe",
      "status": "ACTIVE",
      "kycStatus": "PENDING"
    }
  ],
  "tokens": {
    "token": "<JWT TOKEN>",
    "expiresIn": 1800,
    "refreshToken": null,
    "refreshExpiresIn": null
  }
}
```

### P1 - Login via ABHA Address - Password (`phr-p1-login-via-abha-address-password`)

**Act: the calls in this journey, in order**

#### 1. Search Auth Methods - ABHAAddress (`phr_post_v3_phr_app_login_search`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/search \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>"
}'
```

**Exit condition (Observe until this is true)**

A 200 whose body matches:

```json
{
  "healthIdNumber": "91-5326-6278-XXXX",
  "abhaAddress": "<ABHA_ADDRESS>",
  "authMethods": [
    "MOBILE_OTP",
    "PASSWORD",
    "EMAIL_OTP"
  ],
  "blockedAuthMethods": [],
  "status": "ACTIVE",
  "message": null
}
```

### ABHA enrolment via Aadhaar (`phr-abha-enrolment-via-aadhaar`)

**Act: the calls in this journey, in order**

#### 1. Email Verification Link (`phr_post_v3_profile_account_request_emailverificationlink`)

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/emailVerificationLink \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-profile",
    "email-link-verify"
  ],
  "loginHint": "email",
  "loginId": "{{encrypted email}}",
  "otpSystem": "abdm"
}'
```

**Exit condition (Observe until this is true)**

A 2xx response. The specification gives no body for it, so read what comes back.

### Gateway (`phr-gateway`)

**Act: the calls in this journey, in order**

#### 1. v3/gateway/bridge-service (`phr_put_gateway_v3_bridge_service`)

```bash
curl --request PUT \
  --url https://abhasbx.abdm.gov.in/api/hiecm/gateway/v3/bridge-service \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "bridgeId": "{{bridgeId}}",
  "serviceId": "{{serviceId}}",
  "name": "TEST Gateway",
  "isHip": true,
  "isHiu": true,
  "isHealthLocker": null,
  "isPhr": false,
  "endpoints": {},
  "attributes": null,
  "active": true
}'
```

**Exit condition (Observe until this is true)**

A 2xx response. The specification gives no body for it, so read what comes back.

## Where the detail is

- Every operation, with its body fields and responses: /docs/hiecm/v3/api/phr
- Error codes: /docs/hiecm/v3/api/phr/errors
