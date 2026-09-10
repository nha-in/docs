# Encrypt a value with the ABDM public key

`POST /v3/phr/app/enrollment/encrypt`

Every `loginId` in M1 is encrypted rather than sent raw, and this is the
hosted helper for doing it. It is convenient for trying a flow by hand.

Do not put it in a production path. Sending an Aadhaar or mobile number to
a remote endpoint so that it can be encrypted defeats the point of
encrypting it. Encrypt locally against NHA's published public key
instead.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/encrypt \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'KEY_TYPE: <KEY_TYPE>' \
  --header 'Content-Type: application/json' \
  --data '{
  "data": "1"
}'
```
