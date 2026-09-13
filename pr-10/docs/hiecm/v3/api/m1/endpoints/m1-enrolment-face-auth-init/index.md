# Start face or biometric authentication and get a transaction id

`POST /v3/enrollment/enrol/auth/init`

Returns the `txnId` that a QR code is built from. The person scans that QR
with the ABHA app, completes face authentication through the Aadhaar RD
service, and you then continue with the captured result.

The same call starts the face authentication login flow, not only
enrolment.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/auth/init \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
    "face-auth"
  ]
}'
```
