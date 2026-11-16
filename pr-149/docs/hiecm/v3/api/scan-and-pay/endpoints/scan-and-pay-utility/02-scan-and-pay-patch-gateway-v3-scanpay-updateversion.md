# Update version to the serviceId

`PATCH /api/hiecm/gateway/v3/scanPay/updateVersion`

This is used by the integrators to update the version for the particular service-ID.

 **Header**

Authorisation will be provided by the gateway session API after the successful verification of client ID and Secret [ Example: Bearer ]

REQUEST-ID unique UUID[ Example: 18235d89-cb13-479d-ad71-7a57d5f669a8 ]

TIMESTAMP actual time of the requested was initiated[ Example: 2022-10-06T10:10:00.587Z ]

X-CM-ID [ Example: sbx]

 **Request Body**

recordShareEnabled It describes whether the record share is enabled or not.

scanPayEnabled It describes whether the scan pay is enabled or not.

scanPayVersion This is a key value pair which contains the version [ Example: type: v2 / v3]

serviceId This is a key value pair which contains ServiceId[ Example: SERVICE_ID1,SERVICE_ID2 ]

```bash
curl --request PATCH \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/scanPay/updateVersion \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "recordShareEnabled": true,
  "scanPayEnabled": true,
  "scanPayVersion": "v2",
  "serviceId": [
    "****_HIP, ***_HIU"
  ]
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds.
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended

## Body

- `recordShareEnabled` (boolean, required): It describes whether the record share is enabled or not.
- `scanPayEnabled` (boolean, required): It describes whether the scan pay is enabled or not.
- `scanPayVersion` (string, required): It describes the version.
- `serviceId` (object[], required)

## Responses

- `200`: OK
- `400`: Bad Request. The request could not be processed because it was malformed or failed validation - a missing mandatory field, a value in the wrong format, or a header that did not match the body.
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1006 - Bad Request, invalid request Body. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `error.message` (string, required): Short description of the failure.
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900901 - Invalid Credentials. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-2500 - Unknown error occurred. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `503`: Service Unavailable
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
  - `code` (string, required): ABDM-2500 - Service Unavailable. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string, required)
