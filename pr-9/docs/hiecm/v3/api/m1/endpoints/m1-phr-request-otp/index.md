# Send OTP for ABHA Address Login

`POST /phr/web/login/abha/request/otp`

Send OTP to login via ABHA Address.

| scope | loginHint | Method |
|-------|-----------|--------|
| `["abha-address-login","mobile-verify"]` | `abha-address` | Mobile OTP |
| `["abha-address-login","aadhaar-verify"]` | `abha-address` | Aadhaar OTP |
| `["abha-login","aadhaar-bio-verify"]` | `abha-address` | Fingerprint |
| `["abha-login","aadhaar-face-verify"]` | `abha-address` | Face |
| `["abha-login","aadhaar-iris-verify"]` | `abha-address` | Iris |

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/phr/web/login/abha/request/otp \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-login",
    "mobile-verify"
  ],
  "loginHint": "abha-address",
  "loginId": "{{RSA_encrypted_abha_address}}",
  "otpSystem": "abdm, aadhaar"
}'
```
