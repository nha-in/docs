# 08 - Fetch Incoming Records Bundle [POST]

`POST /digi-locker/incoming/records`

Fetches the FHIR bundle for one care context that a HIP has sent to the person's DigiLocker.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/digi-locker/incoming/records \
  --header 'Content-Type: application/json' \
  --data '{
  "hipId": "IN0710000700",
  "careContextReference": "<TXN_ID>"
}'
```
