# Receive the patient scan pay on order status

`POST /v3/patient/scan-pay/on-order-status`

**Hosted by the HIP/HIU, not by ABDM.** ABDM calls this endpoint at the callback URL registered for your bridge, so the path below is relative to that URL.
This is callback for the on-order-status API. This API needs to implement by HIU for receive the payment status.

 **Header**

 X-HIU-ID [Example: HIU_ID]

Authorisation will be provided by the gateway session API after the successful verification of client ID and Secret [ Example: Bearer ]

REQUEST-ID unique UUID[ Example: 18235d89-cb13-479d-ad71-7a57d5f669a8 ]

TIMESTAMP actual time of the requested was initiated[ Example: 2022-10-06T10:10:00.587Z ]

 **Request Body**

acknowledgement This is a key value which contains the payment status abhaAddress transactionId orderNumber paymentRecipetURL[ Example: { status: [SUCCESS, CANCELED, PENDING, FAIL, REFUND_INITIATED, REFUND_SUCCESS] abhaAddress: transactionId: uniqueId orderNumber: 76274**** paymentRecipetURL: URL } ]

resp which contains the requestId [ Example: requestId: 059fcb69-8ad8-4789-a049-62db16c7b5a0 ]

```bash
curl --request POST \
  --url {bridgeUrl}/v3/patient/scan-pay/on-order-status \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "acknowledgement": {
    "status": "SUCCESS/ CANCELED/ PENDING/ FAIL/ REFUND_INITIATED/ REFUND_SUCCESS",
    "abhaAddress": "<username>@sbx",
    "transactionId": "string",
    "orderNumber": "string",
    "openOrderRequestId": "Queried Request id",
    "paymentDate": "Transaction Date UTC",
    "paymentRecipetLink": "PDF URL LINK of RECIPT"
  },
  "response": {
    "requestId": "b767614f-153a-4aa3-946f-1622596f0fab"
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds.
- `X-HIU-ID` (string, required): Identifier of the health information user to which the request was intended

## Body

- `acknowledgement` (object, required): The intention of share API call
- `acknowledgement.status` (string, required): Indicates the outcome of the transaction. Possible values are: SUCCESS: The transaction was completed successfully. FAIL: The transaction failed. CANCELED: The transaction was cancelled. PENDING: The transaction in pending. REFUND_INITIATED: refund initiated. REFUND_SUCCESS: refunded successfully
- `acknowledgement.abhaAddress` (string, required): The abha Address of the user, formatted as . This is a unique identifier for the user in the health system.
- `acknowledgement.transactionId` (string, required): A unique identifier for the transaction. This helps in tracking and referencing the specific transaction.
- `acknowledgement.orderNumber` (string, required): A unique identifier for the order associated with the transaction. This helps in tracking and referencing the specific order.
- `acknowledgement.openOrderRequestId` (string, required): The unique identifier for the queried request. This ID is used to track and reference the specific request within the system.
- `acknowledgement.paymentDate` (string, required): he date and time when the transaction occurred, formatted in UTC
- `acknowledgement.paymentRecipetLink` (string, required): This attribute holds the URL link to the payment receipt. It is a string that provides a direct link to a PDF document or other format of the receipt for the transaction.
- `response` (object, required): This is the response request-id which is generated from the share api
- `response.requestId` (string, required)

## Responses

- `200`: OK
- `400`: Bad Request. The request could not be processed because it was malformed or failed validation - a missing mandatory field, a value in the wrong format, or a header that did not match the body.
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1006 - Bad Request, invalid request Body. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `error.message` (string, required): Short description of the failure.
- `401`: Unauthorized. The request carried no valid credentials, or the access token has expired. Obtain a fresh token from the session API and retry.
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900901 - Invalid Credentials. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string): Short description of the failure.
  - `description` (string): Detailed description of the failure.
- `403`: Forbidden. The caller is authenticated but is not permitted to perform this operation on this resource.
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
