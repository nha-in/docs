# ENCRYPTION

`POST /abha/api/v3/phr/app/enrollment/encrypt`

Encrypts a value with the ABDM public key so it can be sent in the fields that only accept ciphertext, such as `loginId` and OTP values.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/encrypt \
  --header 'Content-Type: application/json' \
  --data '{
  "data": "<ABHA_NUMBER>"
}'
```
