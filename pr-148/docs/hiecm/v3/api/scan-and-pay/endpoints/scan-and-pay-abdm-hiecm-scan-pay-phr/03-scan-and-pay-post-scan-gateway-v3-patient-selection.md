# Select the all open-order and send to HIP for a payment request detail

`POST /api/hiecm/scan-gateway/v3/patient/selection`

Select the all open-order and send to HIP for a payment request detail. In this user can select the multiple procedures.

 **Header**

Authorisation will be provided by the gateway session API after the successful verification of client ID and Secret [ Example: Bearer ]

REQUEST-ID unique UUID[ Example: 18235d89-cb13-479d-ad71-7a57d5f669a8 ]

TIMESTAMP actual time of the requested was initiated[ Example: 2022-10-06T10:10:00.587Z ]

X-CM-ID consent manager ID[ Example: sbx ]

X-AUTH-TOKEN JWT Authentication token which was issued by ABDM after successful validation of user[ Example: Bearer ]

X-HIU-ID [ Example: HIU ID ]

 **Request Body**

intent This is a key value pair which contains the purpose [ Example: type: PAYMENT_ORDER ]

openOrderRequestId from the share open order requestId [ Example: 059fcb69-****-4789-a049-62db16c7b5a0 ]

 abhaAddress of the user/patient

Procedures which contains the list of open order

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/selection \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "intent": "PAYMENT_ORDER",
  "openOrderRequestId": "b767614f-153a-***-946f-1622596f0fab",
  "abhaAddress": "<ABHA_ADDRESS>",
  "procedures": [
    {
      "category": "OPD consultation",
      "services": [
        {
          "name": "consultation",
          "serviceId": "service-12345",
          "description": "Albumin 24 hrs Urine",
          "amount": 629.12
        }
      ]
    },
    {
      "category": "Laboratory and Diagnostics",
      "services": [
        {
          "name": "Diagnostics",
          "serviceId": "service-12345",
          "description": "Albumin 24 hrs Urine",
          "amount": 629.12
        }
      ]
    },
    {
      "category": "Pharmacy",
      "services": [
        {
          "name": "Pharmacy",
          "serviceId": "service-12345",
          "description": "Albumin 24 hrs Urine",
          "amount": 629.12
        }
      ]
    }
  ]
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds.
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended
- `X-AUTH-TOKEN` (string, required): JWT Authentication token which was issued by ABDM after successful validation of username and password
- `X-HIU-ID` (string, required): Identifier of the health information user to which the request was intended

## Body

- `intent` (string, required): The intention of share API call
- `openOrderRequestId` (object, required): This is the response request-id which is generated from the share/openOrder api
- `abhaAddress` (string, required): abha address of the user/patient.
- `procedures` (object[], required)
- `procedures.category` (string, required): The category of the procedure
- `procedures.services` (object[], required)
- `procedures.services.serviceId` (string): Unique identifier for the service
- `procedures.services.name` (string, required): Name of the service
- `procedures.services.description` (string): Description of the service
- `procedures.services.amount` (number, required): Amount for the service

## Responses

- `202`: Accepted
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-2500 - no mapping found to the resp.requestId cache. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900901 - Invalid Credentials. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
- `404`: Not Found
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
- `429`: Too Many Requests
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-2429 - Too Many Requests found. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-2500 - Unknown error occurred. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `503`: Service Unavailable
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
  - `code` (string, required): ABDM-2500 - Service Unavailable. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string, required)
