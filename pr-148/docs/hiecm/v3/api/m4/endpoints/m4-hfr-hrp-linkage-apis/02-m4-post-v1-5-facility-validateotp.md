# Validate OTP

`POST /v1.5/facility/validateOtp`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1.5/facility/validateOtp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "facilityId": "IN2810002702",
  "sourceId": "AB-PMJAY",
  "otp": "885210",
  "source": "AB-PMJAY",
  "transactionId": "2ddfc7ec-9a9f-412c-8c50-c2be92da5781"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `facilityId` (string, required): Id of the facility. Should start with 'IN' and have the length of 12 characters.
- `sourceId` (string, required): Unique hospital identifier. Alphanumeric value.
- `otp` (string, required): Unique number to verify the mobile number. 6-digit number received from the SendOTPToContact API response. See `POST /v1.5/facility/sendOtpToContact`.
- `source` (string, required): Facility Source value. Accepted values: UWIN, PMNDP, AB-PMJAY, NHRR, HMIS-CDAC, NIN, eHospital, STHMISID, STINSID, COWIN.
- `transactionId` (string, required): Unique Id for a transaction. Use the transaction Id received in response from the SendOTPToContact API. See `POST /v1.5/facility/sendOtpToContact`.

## Responses

- `200`: OK
  - `facilityId` (string)
  - `status` (string)
  - `message` (string)
  - `errorStatus` (object[])
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "facilityId": "<FACILITY_ID>",
  "status": "<STATUS>",
  "message": "<MESSAGE>",
  "errorStatus": [
    "<ERROR_STATUS>"
  ]
}
```
