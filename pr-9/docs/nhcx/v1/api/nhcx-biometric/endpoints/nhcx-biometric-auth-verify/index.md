# Verify the captured biometric

`POST /hcx/abha/biometric/auth/verify`

Sends the captured PID block against the transaction opened by init. On success the response carries the user token that rides on the eligibility check and the preauthorisation.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/verify \
  --header 'process: <PROCESS>' \
  --header 'payerid: <PAYERID>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "<SCOPE>"
  ],
  "authMode": "FINGERPRINT",
  "authData": {
    "authMethods": [
      "bio"
    ],
    "bio": {
      "txnId": "5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11",
      "fingerPrintAuthPid": "<FINGER_PRINT_AUTH_PID>"
    },
    "iris": {
      "txnId": "5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11",
      "irisAuthPid": "<IRIS_AUTH_PID>"
    },
    "face": {
      "txnId": "5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11",
      "faceAuthPid": "<FACE_AUTH_PID>"
    },
    "otp": {
      "txnId": "5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11",
      "otpValue": "<OTP_VALUE>"
    }
  }
}'
```
