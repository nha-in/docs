# Answer the patient share request

`POST /api/hiecm/patient-share/v3/on-share`

Share the response of HIECM's /api/hiecm/patient-share/v3/on-share API.

 **Header**

AUTHORIZATION will be provided by the gateway session API after the successful verification of client ID and Secret [ Example: ]

REQUEST-ID unique UUID[ Example: 18235d89-cb13-479d-ad71-7a57d5f669a8 ]

TIMESTAMP actual time of the requested was initiated[ Example: 2022-10-06T10:10:00.587Z ]

X-CM-ID consent manager ID[ Example: sbx ]

 **Request Body**

Incase of success scenario,acknowledgement is mandatory and error is optional

Incase of failure scenario,error is mandatory and acknowledgment is optional

response is mandatory object in both the cases

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

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended

## Body

- `acknowledgement` (object, required)
- `acknowledgement.status` (string, required): The status of the transaction.Allows like (SUCCESS|FAILED)
- `acknowledgement.abhaAddress` (string, required): The abha address of the patient. Should start with Alphanumeric . and  _  in the middle and must be ending with @abdm or @sbx and Allows alpha numeric character and special characters like ^[a-zA-Z0-9][a-zA-Z0-9_.\-!]+[a-zA-Z0-9]@(abdm|sbx)$
- `acknowledgement.profile` (object, required): Should be populated only if this is a response for PROFILE_SHARE request
- `acknowledgement.profile.context` (string, required): This is a counter Id. Allows alpha numeric character and special characters like ^(?:[a-zA-Z0-9 ]|[a-zA-Z0-9 ][a-zA-Z0-9.\\-_ ]*[a-zA-Z0-9 ]){1,250}$
- `acknowledgement.profile.tokenNumber` (string, required): The token number generated at HIP for the request
- `acknowledgement.profile.expiry` (number, required): The expiry time and should be only numeric value.Allows alpha numeric character and special characters like [\d]*$
- `error` (object, required): error is optional object in case of Sucess response.
- `error.code` (string, required): ABDM-9999 - Unknown exception. May be returned either bare (`ABDM-9999`) or with a trailing ": " separator (`ABDM-9999: `); match on the code itself and tolerate the separator.
- `error.message` (string, required)
- `response` (object, required)
- `response.requestId` (string, required): The requestId that was passed.Allows alpha numeric character and special characters like [0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}

## Responses

- `202`: Accepted
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-register/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1006 - Bad Request, invalid request Body. May be returned either bare (`ABDM-1006`) or with a trailing ": " separator (`ABDM-1006: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900901 - Invalid Credentials. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-register/errors
- `404`: Not Found
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-register/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1001 - No data found. May be returned either bare (`ABDM-1001`) or with a trailing ": " separator (`ABDM-1001: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `408`: Request Timeout
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-register/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1007 - Connection failed due to timeout. May be returned either bare (`ABDM-1007`) or with a trailing ": " separator (`ABDM-1007: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `429`: Too Many Requests
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-register/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1022 - Too many requests. May be returned either bare (`ABDM-1022`) or with a trailing ": " separator (`ABDM-1022: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-register/errors
  - `code` (string): 900900 - Unclassified Authentication Failure. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `503`: Service Unavailable
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-register/errors
  - `code` (string, required): ABDM-1024 - Dependent service unavailable. May be returned either bare (`ABDM-1024`) or with a trailing ": " separator (`ABDM-1024: `); match on the code itself and tolerate the separator.
  - `message` (string, required)
