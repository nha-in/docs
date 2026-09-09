# 09 - Pull / Refresh Records [POST]

`POST /digi-locker/pull/records`

Asks a HIP to send the person's latest records to DigiLocker. The records arrive later; poll the refresh endpoint for them.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/digi-locker/pull/records \
  --header 'Content-Type: application/json' \
  --data '{
  "hipId": "IN0710000700"
}'
```
