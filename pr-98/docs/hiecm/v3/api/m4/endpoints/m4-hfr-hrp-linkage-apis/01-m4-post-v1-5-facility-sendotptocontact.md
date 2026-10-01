# Send OTP to contact

`POST /v1.5/facility/sendOtpToContact`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1.5/facility/sendOtpToContact \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "facilityId": "IN2810002702"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `facilityId` (string)

## Responses

- `200`: OK
  - `facilityId` (string)
  - `status` (string)
  - `message` (string)
  - `transactionId` (string)
  - `errorStatus` (object[])
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "facilityId": "<FACILITY_ID>",
  "status": "<STATUS>",
  "message": "<MESSAGE>",
  "transactionId": "<TRANSACTION_ID>",
  "errorStatus": [
    "<ERROR_STATUS>"
  ]
}
```
