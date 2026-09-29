# OPD Token History

`GET /api/hiecm/patient-share/v3/profile/getTokenDetails`

This is an API will be invoked get the historical token numbers of the patient.

 **Header**

AUTHORIZATION will be provided by the gateway session API after the successful verification of client ID and Secret [ Example: ]

REQUEST-ID unique UUID[ Example: 18235d89-cb13-479d-ad71-7a57d5f669a8 ]

TIMESTAMP actual time of the requested was initiated[ Example: 2022-10-06T10:10:00.587Z ]

```bash
curl --request GET \
  --url "https://dev.abdm.gov.in/api/hiecm/patient-share/v3/profile/getTokenDetails?limit=<LIMIT>" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: Bearer <TOKEN>'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended
- `X-AUTH-TOKEN` (string, required): JWT Authentication token which was issued by ABDM after successful validation of username and password

## Query parameters

- `limit` (string, required): The limit of data to be fetched

## Responses

- `200`: OK
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1006 - Bad Request, invalid request Body. May be returned either bare (`ABDM-1006`) or with a trailing ": " separator (`ABDM-1006: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900901 - Invalid Credentials. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
- `404`: Not Found
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1001 - No data found. May be returned either bare (`ABDM-1001`) or with a trailing ": " separator (`ABDM-1001: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `408`: Request Timeout
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1007 - Connection failed due to timeout. May be returned either bare (`ABDM-1007`) or with a trailing ": " separator (`ABDM-1007: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `429`: Too Many Requests
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1022 - Too many requests. May be returned either bare (`ABDM-1022`) or with a trailing ": " separator (`ABDM-1022: `); match on the code itself and tolerate the separator.
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
[
  {
    "id": 1,
    "patientId": "<ABHA_ADDRESS>",
    "tokenNumber": "1",
    "hipId": "ABDM_HIP",
    "hipName": "Health Information Provider Name",
    "hipAddress": "sample address",
    "expiresIn": 1800,
    "clientId": "ABDM",
    "dateCreated": "2024-09-11T07:31:02.357Z",
    "counterCode": "Counter 1"
  }
]
```
