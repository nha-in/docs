# Share patient open order

`POST /api/hiecm/scan-gateway/v3/patient/share/open-order`

This is an API will be invoked from the **integrator application** to share the user/patient profile with HMIS/LIMS.

 **Header**

Authorisation will be provided by the gateway session API after the successful verification of client ID and Secret [ Example: Bearer ]

X-AUTH-TOKEN JWT Authentication token which was issued by ABDM after successful validation of user[ Example: Bearer ]

REQUEST-ID unique UUID[ Example: 18235d89-cb13-479d-ad71-7a57d5f669a8 ]

TIMESTAMP actual time of the requested was initiated[ Example: 2022-10-06T10:10:00.587Z ]

X-CM-ID consent manager ID[ Example: sbx ]

X-HIU-ID [ Example: HIU ID ]

 **Request Body**

intent This is a key value pair which contains the purpose [ Example: type: OPEN_PAYMENT_ORDER ]

metaData This is a key value pair which contains hipId, counterId[ Example: { hipId:IN3810000008
 counterId: 12123 } ]

profile which contains user details

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/scan-gateway/v3/patient/share/open-order \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "intent": "OPEN_PAYMENT_ORDER",
  "metaData": {
    "hipId": "HIP_1",
    "counterId": "123-456"
  },
  "profile": {
    "patient": {
      "abhaNumber": "91-7507-xxxx-xxxx",
      "abhaAddress": "<ABHA_ADDRESS>",
      "name": "name",
      "gender": "M",
      "dayOfBirth": "string",
      "monthOfBirth": "string",
      "yearOfBirth": "string",
      "address": {
        "line": "Address line 1",
        "district": "XXXXXXX",
        "state": "XXXXXX",
        "pincode": "XXXXXX"
      },
      "phoneNumber": "987654xxxx"
    }
  }
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
- `metaData` (object, required): A key-value pair carrying the location longitude and latitude.
- `metaData.hipId` (string, required): The service ID of the health information provider
- `metaData.counterId` (number, required)
- `profile` (object, required): This should populated only for PAYMENT_SHARE
- `profile.patient` (object, required)
- `profile.patient.abhaNumber` (string, required): The abha number of the patient. Should be only 14 digit
- `profile.patient.abhaAddress` (string, required): The abha address of the patient. Should start with Alphanumeric . and  _  in the middle and must be ending with @abdm or @sbx
- `profile.patient.name` (string, required): The name of the patient. Only alphabets.
- `profile.patient.gender` (string, required): The gender of the patient One of: M, F, O, D.
- `profile.patient.dayOfBirth` (string, required): The day of birth of the patient. Only allows numeric values between 1 abd 31
- `profile.patient.monthOfBirth` (string, required): The month of birth of the patient. Only allows numeric values between 1 abd 12
- `profile.patient.yearOfBirth` (string, required): The month of birth of the patient. Only allows numeric values and must be 4 digit ranging between 1900 and 2200
- `profile.patient.address` (object, required)
- `profile.patient.address.line` (string, required): The address line
- `profile.patient.address.district` (string): The district and should only contain alphabets
- `profile.patient.address.state` (string): The state and should only contain alphabets
- `profile.patient.address.pincode` (string): Should be 5 digits and only contain numbers
- `profile.patient.phoneNumber` (string, required): The mobile number of the patient. Must be 10 digit and contain only 0-9

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
