# Notify a change to a linked care context

`POST /api/hiecm/hip/v3/link/context/notify`

Notify the Consent Management (CM) system about any updates HiTypes of the already linked care context for a patient. By invoking this API, Health Information Providers (HIPs) can inform the CM system of changes or updates to the patient’s care context, ensuring that the most current and accurate health information is maintained. This process is crucial for the integrity and synchronization of patient health records across the network, supporting seamless and efficient health information exchange.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/hip/v3/link/context/notify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-HIP-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "notification": {
    "patient": {
      "id": "<ABHA_ADDRESS>"
    },
    "careContext": {
      "patientReference": "<ABHA_ADDRESS>",
      "careContextReference": "b009a970-8b04-4779-abd1-b50f113245bf"
    },
    "hiTypes": [
      "DiagnosticReport"
    ],
    "date": "2024-05-09T10:34:00.387Z",
    "hip": {
      "id": "ABDM_HIP"
    }
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended
- `X-HIP-ID` (string, required): Identifier of the health information provider to which the request was intended

## Body

- `notification` (object, required)
- `notification.patient` (object, required)
- `notification.patient.id` (string, required): The abha address of the patient
- `notification.careContext` (object, required): A care context - one episode or record grouping at the HIP.
- `notification.careContext.patientReference` (string, required): "A patient identifier with which patient is registered in the facility/hospital"
- `notification.careContext.careContextReference` (string, required): An identifier of patient's care context created in HIP. A care context is a group of patient's health data (Not the actual health data)
- `notification.hiTypes` (string[], required): Type of health data that created in the care context
- `notification.date` (string, required): This should be a UTC Date & Time in ISO format
- `notification.hip` (object, required): The HIP that linked the care context. Only id is required.
- `notification.hip.id` (string, required): The service ID of the health information provider

## Responses

- `202`: Accepted
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/m2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1006 - Bad Request, invalid request Body. May be returned either bare (`ABDM-1006`) or with a trailing ": " separator (`ABDM-1006: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900902 - Unauthorized. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/m2/errors
- `404`: server cannot find the requested resource
  See Error codes for this module: /docs/hiecm/v3/api/m2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1001 - No data found. May be returned either bare (`ABDM-1001`) or with a trailing ": " separator (`ABDM-1001: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/m2/errors
  - `code` (string): ABDM-9999 - Unknown exception. May be returned either bare (`ABDM-9999`) or with a trailing ": " separator (`ABDM-9999: `); match on the code itself and tolerate the separator.
  - `message` (string)
