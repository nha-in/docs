# Share payment bundle alone with procedures of the patient

`POST /api/hiecm/scan-gateway/v3/patient/on-selection`

Share payment bundle alone with procedures of the patient. The HIP will sent the payment bundle to HIU.

 **Header**

AUTHORIZATION will be provided by the gateway session API after the successful verification of client ID and Secret [ Example: Bearer ]

REQUEST-ID unique UUID[ Example: 18235d89-cb13-479d-ad71-7a57d5f669a8 ]

TIMESTAMP actual time of the requested was initiated[ Example: 2022-10-06T10:10:00.587Z ]

X-CM-ID consent manager ID[ Example: sbx ]

 **Request Body**

intent This is a key value pair which contains the purpose [ Example: type: PAYMENT_ORDER ]

openOrderRequestId from the share open order requestId [ Example: 059fcb69-****-4789-a049-62db16c7b5a0 ]

abhaAddress of the user/patient

error is optional object in case of any error or Failure then only send error object

Procedures which contains the list of open order

paymentBundle which contains payments details

response which contains the requestId [ Example: requestId: 059fcb69-8ad8-4789-a049-62db16c7b5a0 ]

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/on-selection \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "intent": "PAYMENT_ORDER",
  "openOrderRequestId": "b767614f-153a-4aa3-946f-1622596f0fab",
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
  ],
  "paymentBundle": {
    "paymentMode": "GATEWAY",
    "paymentUrl": "string",
    "orderNumber": "string",
    "amount": 1250.55,
    "merchantId": "123465",
    "description": "Testing"
  },
  "response": {
    "requestId": "6c3d4e5c-09d1-***-817b-a0c82d130c53"
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
- `openOrderRequestId` (object, required): This is the request-id which is generated from the share/Open Order Request id api
- `abhaAddress` (string, required): abha address of the user/patient.
- `procedures` (object[], required)
- `procedures.category` (string, required): The category of the procedure
- `procedures.services` (object[], required)
- `procedures.services.serviceId` (string): Unique identifier for the service
- `procedures.services.name` (string, required): Name of the service
- `procedures.services.description` (string): Description of the service
- `procedures.services.amount` (number, required): Amount for the service
- `paymentBundle` (object, required): This should be populated for payments
- `paymentBundle.paymentMode` (string, required): Specifies the mode of payment. For example, “GATEWAY” indicates that the payment is processed through a payment gateway
- `paymentBundle.paymentUrl` (string, required): A URL provided by the payment gateway for processing the payment. This is typically a link where the user can complete the payment transaction.
- `paymentBundle.orderNumber` (string, required): A unique identifier for the order associated with the payment. This helps in tracking and referencing the specific transaction.
- `paymentBundle.amount` (number, required): The total amount to be paid. This is usually a numeric value representing the cost of the transaction.
- `paymentBundle.merchantId` (string, required): A unique identifier for the merchant receiving the payment. This ID is used to identify the merchant in the payment system.
- `paymentBundle.description` (string, required): A brief description of the payment or the transaction. This can include details about what the payment is for or any other relevant information.
- `response` (object, required): This is the response request-id which is generated randomly.
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
