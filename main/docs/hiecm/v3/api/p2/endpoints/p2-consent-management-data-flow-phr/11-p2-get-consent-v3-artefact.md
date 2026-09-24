# Fetch all the consent artefact details of a patient

`GET /api/hiecm/consent/v3/artefact`

Fetch all consent artefact details for a patient. By invoking this API, users can retrieve comprehensive information about all consent artefacts associated with the patient’s health information. This functionality is essential for maintaining transparency and ensuring that users have access to complete and up-to-date consent artefact information. The API supports efficient tracking and management of consent artefacts, facilitating secure and compliant health information exchange within the healthcare ecosystem.

```bash
curl --request GET \
  --url "https://dev.abdm.gov.in/api/hiecm/consent/v3/artefact?limit=<LIMIT>" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for tracking the end-to-end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds, and milliseconds
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended
- `X-AUTH-TOKEN` (string, required): The user token the PHR service issued when the patient logged in.

## Query parameters

- `limit` (integer, required): The number of items to be returned at a time
- `offset` (integer): The number of items to be skipped before starting to collect data
- `status` (string): Status of the consent

## Responses

- `200`: Ok
  - `size` (integer)
  - `limit` (integer)
  - `offset` (integer)
  - `consentArtefacts` (object[]): List of consent artefact ids that were created.
  - `consentArtefacts.status` (string) One of: GRANTED, EXPIRED, REVOKED.
  - `consentArtefacts.consentDetail` (object)
  - `consentArtefacts.consentDetail.consentId` (string): Allows alpha numeric character and special characters like "^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$";
  - `consentArtefacts.consentDetail.purpose` (object, required)
  - `consentArtefacts.consentDetail.purpose.text` (string, required) One of: Care Management, Break the Glass, Public Health, Healthcare Payment, Disease Specific Healthcare Research, Self Requested.
  - `consentArtefacts.consentDetail.purpose.code` (string, required) One of: CAREMGT, BTG, PUBHLTH, HPAYMT, DSRCH, PATRQT.
  - `consentArtefacts.consentDetail.purpose.refUri` (string, required): The reference URL. Should be a valid URL
  - `consentArtefacts.consentDetail.patient` (object, required)
  - `consentArtefacts.consentDetail.patient.id` (string, required): The abha address of the patient
  - `consentArtefacts.consentDetail.hip` (object): Identifier and name of the health information provider.
  - `consentArtefacts.consentDetail.hip.id` (string, required): The service ID of the health information provider. Allows alpha numeric character and special characters like [A-Z a-z 0-9]+[A-Z a-z 0-9 //_//-]*[A-Z a-z 0-9]$
  - `consentArtefacts.consentDetail.hip.name` (string, required): The name of the health information provider. Allows alpha numeric and special characters like _\-@,():/
  - `consentArtefacts.consentDetail.hip.type` (string): The type of the health information provider. Allows alpha numeric and special characters like _\-@,. ":/
  - `consentArtefacts.consentDetail.hiu` (object, required)
  - `consentArtefacts.consentDetail.hiu.id` (string, required): The service ID of the health information user. Allows alpha numeric character and special characters like [A-Z a-z 0-9]+[A-Z a-z 0-9 //_//-]*[A-Z a-z 0-9]$
  - `consentArtefacts.consentDetail.hiu.name` (string, required): The name of the health information user. Allows alpha numeric and special characters like _\-@,():/
  - `consentArtefacts.consentDetail.hiu.type` (string): The type of the health information user. Allows alpha numeric and special characters like _\-@,. ":/
  - `consentArtefacts.consentDetail.careContexts` (object[]): List of care contexts linked at the HIP end for the identified patient.
  - `consentArtefacts.consentDetail.careContexts.patientReference` (string, required): A patient identifier with which patient is registered in the facility/hospital
  - `consentArtefacts.consentDetail.careContexts.careContextReference` (string, required): An identifier of patient's care context created in HIP. A care context is a group of patient's health data (Not the actual health data)
  - `consentArtefacts.consentDetail.requester` (object, required)
  - `consentArtefacts.consentDetail.requester.name` (string, required): The name of the requester
  - `consentArtefacts.consentDetail.requester.identifier` (object, required)
  - `consentArtefacts.consentDetail.createdAt` (string)
  - `consentArtefacts.consentDetail.lastUpdated` (string)
  - `consentArtefacts.consentDetail.schemaVersion` (string)
  - `consentArtefacts.consentDetail.consentManager` (object)
  - `consentArtefacts.consentDetail.consentManager.id` (string)
  - `consentArtefacts.consentDetail.hiTypes` (string[], required): Types of health information document.
  - `consentArtefacts.consentDetail.permission` (object, required)
  - `consentArtefacts.consentDetail.permission.accessMode` (string, required) One of: VIEW, STORE, STREAM, QUERY.
  - `consentArtefacts.consentDetail.permission.dateRange` (object, required)
  - `consentArtefacts.consentDetail.permission.dataEraseAt` (string, required): The date at which the consent expire. Should be UTC date time in ISO format
  - `consentArtefacts.consentDetail.permission.frequency` (object, required)
  - `consentArtefacts.signature` (string)
- `400`: Bad Request. The request could not be processed because it was malformed or failed validation - a missing mandatory field, a value in the wrong format, or a header that did not match the body.
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1006 - Bad Request, invalid request Body. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `error.message` (string, required): Short description of the failure.
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
  "size": 10,
  "limit": 10,
  "offset": 0,
  "consentArtefacts": [
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
      "signature": "e8nY601CYDsC0FKoDjSp+7GeQ2s2R8oZncLCz5ce+pEuDOr5bZV0aaHjwJg4b9S9V+twjt4hbojx3fl7egrt8+0c+lfPTi5/bBUAQXCABTfFmtFU7jn65HlTt8kgkiONx26ZBhJ0wX3xjYI72PPtzYIiT5Q08YtDoILA62KceioV7lwuKssw7wC4ECbBAvRuXT121TmtrPhf+0myJATSnaajS06S6OthrKfZLNTUFf3pFiJzqouSTrjNblOX6DT2+JuO3rom1Szz/03c0HQG+wWASv+PO3J6uRs0UI4JvKmM/4tP+Z+/HPKM15K5U5K+4pqf6czKrbIDpkT/kP8bGg=="
    }
  ]
}
```
