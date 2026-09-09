# Start a face authentication

`POST /pmjay/sbxhcx/abdmproxy/abha/biometric/faceauth/init`

Opens the face flow and returns a transaction id. The patient then scans a QR code in the ABHA app; the capture is collected by polling the PID endpoint below.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/faceauth/init \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
    "face-auth"
  ]
}'
```
