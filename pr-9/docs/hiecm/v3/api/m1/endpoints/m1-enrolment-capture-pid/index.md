# Submit a captured biometric or face authentication block

`POST /v3/enrollment/enrol/capturePID`

Hands over the PID block produced by the Aadhaar RD service. The block is
encrypted by the device and is time limited, so send it as soon as the
capture returns rather than storing it.

This is a polling loop. All three states come back as HTTP 200, so
branch on `status` and not on the status code. `PENDING` and `VERIFIED`
both mean the capture has not landed yet and carry the same message,
`Awaiting PID capture`. Only `COMPLETE` carries the `txnId` you take
into the next call. Keep polling until you see it.

One caveat about where these came from. NHA saved the `COMPLETE`
example against `enrollment/enrol/capturePID`, and saved the `PENDING`
and `VERIFIED` examples against `enrollment/enrol/internal/capturePID`,
a path that appears nowhere else in the collection and that NHA's M1
document never mentions. Whether the two paths are one endpoint is
unresolved here.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/capturePID \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
    "face-verify"
  ],
  "txnId": "<TXN_ID>"
}'
```
