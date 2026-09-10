# 2. Verify Aadhaar

`POST /api/registration/abha/verify/aadhaar`

Verifies the Aadhaar OTP for a registration transaction and records the person's consent to use Aadhaar for ABHA.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/registration/abha/verify/aadhaar \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "aadhaar-gateway"
    ],
    "gateway": {
      "txnId": "<TXN_ID>"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```
