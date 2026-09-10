# Verify a face capture against Aadhaar

`POST /pmjay/sbxhcx/abdmproxy/abha/biometric/v2/auth/verify`

Completes the face flow. The `aadhaar` field is the beneficiary's Aadhaar number encrypted under the public key the portal supplies, not the twelve digits in the clear. Do not log it, do not display it, and do not validate it as a number.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/v2/auth/verify \
  --header 'payerid: <PAYERID>' \
  --header 'process: <PROCESS>' \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "face_auth"
    ],
    "face": {
      "txnId": "5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11",
      "aadhaar": "<AADHAAR>"
    }
  }
}'
```
