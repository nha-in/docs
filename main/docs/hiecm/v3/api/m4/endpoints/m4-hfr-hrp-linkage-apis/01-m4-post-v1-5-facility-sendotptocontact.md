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

- `Authorization` (bearer token, required): M4 declares bearer authentication. The HPID calls publish POST /getManagementToken.

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

Example 200 response. The values are placeholders:

```json
{
  "facilityId": "IN0610089709",
  "status": "Success",
  "message": "Otp sent successfully! Please keep transaction id for future reference",
  "transactionId": "3cf3de44-94a4-4f77-b7f9-de6ec86785b3",
  "errorStatus": null
}
```
