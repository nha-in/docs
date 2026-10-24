# Fetch the consent artefact details associated with the artefact-ID

`GET /api/hiecm/consent/v3/artefact/{consentId}`

Fetch the details of a consent artefact associated with a specific artefact ID. By invoking this API, users can retrieve comprehensive information about the consent artefact, including its status, scope, and any associated conditions. This functionality is essential for ensuring that users have access to accurate and up-to-date consent artefact information, supporting secure and compliant health information exchange. The API facilitates efficient management and verification of consent artefacts, enhancing the overall integrity of the consent management process.

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/consent/v3/artefact/{consentId} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended
- `X-AUTH-TOKEN` (string, required): The user token the PHR service issued when the patient logged in.

## Path parameters

- `consentId` (string, required): Consent artefact id

## Responses

- `200`: Ok
  - `status` (string, required) One of: GRANTED, DENIED, EXPIRED, REVOKED.
  - `consentDetail` (object, required)
  - `consentDetail.consentId` (string): Allows alpha numeric character and special characters like "^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$";
  - `consentDetail.purpose` (object, required)
  - `consentDetail.purpose.text` (string, required) One of: Care Management, Break the Glass, Public Health, Healthcare Payment, Disease Specific Healthcare Research, Self Requested.
  - `consentDetail.purpose.code` (string, required) One of: CAREMGT, BTG, PUBHLTH, HPAYMT, DSRCH, PATRQT.
  - `consentDetail.purpose.refUri` (string, required): The reference URL. Should be a valid URL
  - `consentDetail.patient` (object, required)
  - `consentDetail.patient.id` (string, required): The abha address of the patient
  - `consentDetail.hip` (object): Identifier and name of the health information provider.
  - `consentDetail.hip.id` (string, required): The service ID of the health information provider. Allows alpha numeric character and special characters like [A-Z a-z 0-9]+[A-Z a-z 0-9 //_//-]*[A-Z a-z 0-9]$
  - `consentDetail.hip.name` (string, required): The name of the health information provider. Allows alpha numeric and special characters like _\-@,():/
  - `consentDetail.hip.type` (string): The type of the health information provider. Allows alpha numeric and special characters like _\-@,. ":/
  - `consentDetail.hiu` (object, required)
  - `consentDetail.hiu.id` (string, required): The service ID of the health information user.  Allows alpha numeric character and special characters like [A-Z a-z 0-9]+[A-Z a-z 0-9 //_//-]*[A-Z a-z 0-9]$
  - `consentDetail.hiu.name` (string, required): The name of the health information user. Allows alpha numeric and special characters like _\-@,():/
  - `consentDetail.hiu.type` (string): The type of the health information user. Allows alpha numeric and special characters like _\-@,. ":/
  - `consentDetail.careContexts` (object[]): List of care contexts linked at the HIP end for the identified patient.
  - `consentDetail.careContexts.patientReference` (string, required): A patient identifier with which patient is registered in the facility/hospital
  - `consentDetail.careContexts.careContextReference` (string, required): An identifier of patient's care context created in HIP. A care context is a group of patient's health data (Not the actual health data)
  - `consentDetail.requester` (object, required)
  - `consentDetail.requester.name` (string, required): The name of the requester
  - `consentDetail.requester.identifier` (object, required)
  - `consentDetail.requester.identifier.value` (string, required): The type of the identification. Allows alpha numeric character and special characters like _\-@,. ":/
  - `consentDetail.requester.identifier.type` (string, required): The identification value. Allows alpha numeric character and special characters like _\-@,. ":/
  - `consentDetail.requester.identifier.system` (string, required): Allows alpha numeric character and special characters like _\-@,. ":/
  - `consentDetail.createdAt` (string)
  - `consentDetail.lastUpdated` (string)
  - `consentDetail.schemaVersion` (string)
  - `consentDetail.consentManager` (object)
  - `consentDetail.consentManager.id` (string)
  - `consentDetail.hiTypes` (string[], required): Types of health information document.
  - `consentDetail.permission` (object, required)
  - `consentDetail.permission.accessMode` (string, required) One of: VIEW, STORE, STREAM, QUERY.
  - `consentDetail.permission.dateRange` (object, required)
  - `consentDetail.permission.dateRange.from` (string, required): Should be UTC date time in ISO format
  - `consentDetail.permission.dateRange.to` (string, required): Should be UTC date time in ISO format
  - `consentDetail.permission.dataEraseAt` (string, required): The date at which the consent expire. Should be UTC date time in ISO format
  - `consentDetail.permission.frequency` (object, required)
  - `consentDetail.permission.frequency.unit` (string, required) One of: HOUR, DAY, WEEK, MONTH, YEAR.
  - `consentDetail.permission.frequency.value` (number, required): The frequency unit value. Should be be a integer
  - `consentDetail.permission.frequency.repeats` (number, required): Should be be a integer
  - `signature` (string, required)
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1080 - Invalid Consent artefact id. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900901 - Unauthorized. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
- `404`: Not Found
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1001 - No data found. May be returned either bare (`ABDM-1001`) or with a trailing ": " separator (`ABDM-1001: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `code` (string): 900900 - Unclassified Authentication Failure. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `503`: Service Unavailable
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `code` (string, required): ABDM-1024 - Dependent service unavailable. May be returned either bare (`ABDM-1024`) or with a trailing ": " separator (`ABDM-1024: `); match on the code itself and tolerate the separator.
  - `message` (string, required)

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "status": "GRANTED",
  "consentDetail": {
    "consentId": "e5ec415f-c098-40f6-a0db-faa162fc5295",
    "purpose": {
      "text": "Care Management",
      "code": "CAREMGT",
      "refUri": "www.abc.com"
    },
    "patient": {
      "id": "<ABHA_ADDRESS>"
    },
    "hip": {
      "id": "cowin_hip_01",
      "name": "Cowin",
      "type": "HIP"
    },
    "hiu": {
      "id": "cowin_hiu_01",
      "name": "Cowin",
      "type": "HIU"
    },
    "careContexts": [
      {
        "patientReference": "batman@tmh",
        "careContextReference": "Episode1"
      }
    ],
    "requester": {
      "name": "<ABHA_ADDRESS>",
      "identifier": {
        "value": "REG1",
        "type": "MH1001",
        "system": "https://www.sample.com"
      }
    },
    "createdAt": "2021-09-28T12:30:08.573Z",
    "lastUpdated": "2021-09-28T12:30:08.573Z",
    "schemaVersion": "v3",
    "consentManager": {
      "id": "abdm"
    },
    "hiTypes": [
      "Prescription"
    ],
    "permission": {
      "accessMode": "VIEW",
      "dateRange": {
        "from": "2021-09-28T12:30:08.573Z",
        "to": "2021-09-28T12:30:08.573Z"
      },
      "dataEraseAt": "2021-09-28T12:30:08.573Z",
      "frequency": {
        "unit": "HOUR",
        "value": 1,
        "repeats": 0
      }
    }
  },
  "signature": "Signature of CM as defined in W3C standards; Base64 encoded"
}
```
