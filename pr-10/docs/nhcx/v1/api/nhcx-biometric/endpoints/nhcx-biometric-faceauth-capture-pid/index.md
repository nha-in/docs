# Poll for the captured face PID

`POST /pmjay/sbxhcx/abdmproxy/abha/biometric/capture/pid`

Polled after init until the patient has completed the capture in the ABHA app. Returns the PID block the verify call sends.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/capture/pid \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11"
}'
```
