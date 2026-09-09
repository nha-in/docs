# Start a biometric authentication

`POST /hcx/abha/biometric/auth/init`

Opens an authentication transaction against the beneficiary's ABHA number and returns a transaction id the verify call quotes back. `authMode` picks the method.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/init \
  --header 'process: <PROCESS>' \
  --header 'payerid: <PAYERID>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-verify"
  ],
  "loginHint": "abha-number",
  "loginId": "91-XXXX-XXXX-0302",
  "otpSystem": "aadhaar",
  "authMode": "FINGERPRINT"
}'
```
