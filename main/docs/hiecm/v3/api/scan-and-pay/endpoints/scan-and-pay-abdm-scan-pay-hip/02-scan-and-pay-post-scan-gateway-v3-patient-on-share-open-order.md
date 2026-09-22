# Submit the HIE-CM to send all the open order for patient

`POST /api/hiecm/scan-gateway/v3/patient/on-share/open-order`

Share the response of HIECM's /hiecm/api/v3/scan-gateway/patient/on-share/open API.

 **Header**

AUTHORIZATION will be provided by the gateway session API after the successful verification of client ID and Secret [ Example: Bearer ]

REQUEST-ID unique UUID[ Example: 18235d89-cb13-479d-ad71-7a57d5f669a8 ]

TIMESTAMP actual time of the requested was initiated[ Example: 2022-10-06T10:10:00.587Z ]

X-CM-ID consent manager ID [ Example: sbx ]

 **Request Body**

intent This is a key value pair which contains the purpose [ Example: type: OPEN_PAYMENT_ORDER ]

ABHA address of the user.

PatientUid of the user.

error is optional object in case of any error or Failure then only send error object

procedures which contains the list of open order

response which contains the requestId [ Example: requestId: 059fcb69-8ad8-4789-a049-62db16c7b5a0 ]

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/on-share/open-order \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "intent": "OPEN_PAYMENT_ORDER",
  "abhaAddress": "<ABHA_ADDRESS>",
  "patientUid": "string",
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
    },
    {
      "category": "Miscellaneous/Other",
      "services": [
        {
          "name": "Miscellaneous",
          "serviceId": "service-12345",
          "description": "Albumin 24 hrs Urine",
          "amount": 629.12
        }
      ]
    }
  ],
  "response": {
    "requestId": "6c3d4e5c-09d1-****-817b-a0c82d130c53"
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds.
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended

## Body

- `intent` (string, required): The intention of share API call
- `abhaAddress` (string, required): The abha address of the patient. Should start with Alphanumeric . and _ in the middle and must be ending with @abdm or @sbx
- `patientUid` (string, required): Patient UId(unique ID).
- `procedures` (object[], required)
- `procedures.category` (string, required): The category of the procedure
- `procedures.services` (object[], required)
- `procedures.services.serviceId` (string): Unique identifier for the service
- `procedures.services.name` (string, required): Name of the service
- `procedures.services.description` (string): Description of the service
- `procedures.services.amount` (number, required): Amount for the service
- `response` (object, required): This is the response request-id which is generated from the share API
- `response.requestId` (string, required)

## Responses

- `202`: Accepted
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
- `404`: Not Found
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
- `429`: Too Many Requests
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
- `503`: Service Unavailable
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
