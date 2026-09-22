# Get the patient scan pay details

`GET /api/hiecm/scan-gateway/v3/patient/scan-pay/details`

Retrieve the all the details of the user/patient based on the date ranges.

 **Header**

AUTHORIZATION will be provided by the gateway session API after the successful verification of client ID and Secret [ Example: Bearer ]

REQUEST-ID unique UUID[ Example: 18235d89-cb13-479d-ad71-7a57d5f669a8 ]

TIMESTAMP actual time of the requested was initiated[ Example: 2022-10-06T10:10:00.587Z ]

X-AUTH-TOKEN JWT Authentication token which was issued by ABDM after successful validation of user[ Example: Bearer ]

X-CM-ID consent manager ID [ Example: sbx ]

status [ Example: SUCCESS, CANCELED, PENDING, FAIL, REFUND_INITIATED, REFUND_SUCCESS,ALL ]

limit [ Example: 10]

startDate [ Example: 2024-07-13T07:30:10.186Z]

endDate [ Example: 2025-02-18T08:30:50.189Z]

offset [ Example: 0]

```bash
curl --request GET \
  --url "https://dev.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/scan-pay/details?status=SUCCESS&limit=10&startDate=2024-07-13T07:30:10.186Z&endDate=2025-02-18T08:30:50.189Z&offset=0" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds.
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended
- `X-AUTH-TOKEN` (string, required): JWT Authentication token which was issued by ABDM after successful validation of username and password

## Query parameters

- `status` (string, required): Payment status
- `limit` (integer, required): It describes the no. of records.
- `startDate` (string, required): start date of the records.
- `endDate` (string, required): start date of the records.
- `offset` (integer, required): retrieval of records starts from the very first record in the dataset.

## Responses

- `200`: OK
- `400`: Bad Request. The request could not be processed because it was malformed or failed validation - a missing mandatory field, a value in the wrong format, or a header that did not match the body.
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors
- `503`: Service Unavailable
  See Error codes for this module: /docs/hiecm/v3/api/scan-and-pay/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
[
  "<VALUE>"
]
```
