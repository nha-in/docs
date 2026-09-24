# Notify to HIP so that confirm that the HIU received the payment status

`POST /api/hiecm/scan-gateway/v3/patient/scan-pay/on-notify`

Notify to HIP so that confirm that the HIU received the payment status. This HIU will confirm the we will received the payment bundle(SUCCESS,CANCELED,PENDING,FAIL,REFUND_INITIATED, REFUND_SUCCESS) from HIP.

 **Header**

AUTHORIZATION will be provided by the gateway session API after the successful verification of client ID and Secret [ Example: Bearer ]

REQUEST-ID unique UUID[ Example: 18235d89-cb13-479d-ad71-7a57d5f669a8 ]

TIMESTAMP actual time of the requested was initiated[ Example: 2022-10-06T10:10:00.587Z ]

X-CM-ID consent manager ID[ Example: sbx ]

 **Request Body**

acknowledgement This is a key value which contains the payment status abhaAddress transactionId orderNumber paymentRecipetURL[ Example: { status: [SUCCESS, CANCELED, PENDING, FAIL, REFUND_INITIATED, REFUND_SUCCESS] abhaAddress: transactionId: uniqueId orderNumber: 76274**** openOrderRequestId: 939** 800-325d-42c3-****-1******* paymentDate: 2025-01-20T07:47:49.102Z paymentRecipetURL: URL } ]

error is optional object in case of any error or Failure then only send error object

response which contains the requestId [ Example: requestId: 059fcb69-8ad8-4789-a049-62db16c7b5a0 ]

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/scan-pay/on-notify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "acknowledgement": {
    "status": "SUCCESS/ CANCELED/ PENDING/ FAIL/ REFUND_INITIATED/ REFUND_SUCCESS",
    "abhaAddress": "<username>@sbx",
    "transactionId": "string",
    "orderNumber": "string",
    "openOrderRequestId": "b767614f-153a-4aa3-946f-1622596f0fab",
    "paymentDate": "2025-01-20T07:47:49.102Z",
    "paymentRecipetLink": "PDF URL LINK of RECIPT"
  },
  "response": {
    "requestId": "b767614f-153a-***-946f-1622596f0fab"
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

- `acknowledgement` (object, required): error is optional, incase of success case.
- `acknowledgement.status` (string, required): Indicates the outcome of the transaction. Possible values are: SUCCESS: The transaction was completed successfully. FAIL: The transaction failed. CANCELED: The transaction was cancelled. PENDING: The transaction in pending. REFUND_INITIATED: refund initiated. REFUND_SUCCESS: refunded successfully
- `acknowledgement.abhaAddress` (string, required): The health ID of the user, formatted as . This is a unique identifier for the user in the health system.
- `acknowledgement.transactionId` (string, required): A unique identifier for the transaction. This helps in tracking and referencing the specific transaction.
- `acknowledgement.orderNumber` (string, required): A unique identifier for the order associated with the transaction. This helps in tracking and referencing the specific order.
- `acknowledgement.openOrderRequestId` (object, required): This is the response request-id which is generated from the share/openOrder api
- `acknowledgement.paymentDate` (string, required): ISO Timestamp.
- `acknowledgement.paymentRecipetLink` (string, required): This attribute holds the URL link to the payment receipt. It is a string that provides a direct link to a PDF document or other format of the receipt for the transaction. The intention of share API call
- `response` (object, required): This is the response request-id which is generated from the share api
- `response.requestId` (string, required)

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
