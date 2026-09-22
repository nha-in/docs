# Receive the HIU patient on share

`POST /api/v3/hiu/patient/on-share`

**Hosted by the HIP/HIU, not by ABDM.** ABDM calls this endpoint at the callback URL registered for your bridge, so the path below is relative to that URL.
This is an API will be invoked by **HIU** to share the response of HIECM's /api/hiecm/patient-share/v3/on-share API.

 **Header**

Authorisation will be provided by the gateway session API after the successful verification of client ID and Secret [ Example: ]

REQUEST-ID unique UUID[ Example: 18235d89-cb13-479d-ad71-7a57d5f669a8 ]

TIMESTAMP actual time of the requested was initiated[ Example: 2022-10-06T10:10:00.587Z ]

X-HIU-ID HIU ID[ Example: HIU ]

 **Request Body**

Incase of success scenario,acknowledgement is mandatory and error is optional

Incase if failure scenario,error is mandatory and acknowledgment is optional

response is mandatory object in both the cases

```bash
curl --request POST \
  --url {bridgeUrl}/api/v3/hiu/patient/on-share \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIU-ID: HIU_ID' \
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
- `X-HIU-ID` (string, required): Identifier of the health information user to which the request was intended

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

- `200`: OK
- `400`: Bad Request. The request could not be processed because it was malformed or failed validation - a missing mandatory field, a value in the wrong format, or a header that did not match the body.
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
- `401`: Unauthorized. The request carried no valid credentials, or the access token has expired. Obtain a fresh token from the session API and retry.
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `403`: Forbidden. The caller is authenticated but is not permitted to perform this operation on this resource.
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
- `408`: Request Timeout
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
- `503`: Service Unavailable
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
