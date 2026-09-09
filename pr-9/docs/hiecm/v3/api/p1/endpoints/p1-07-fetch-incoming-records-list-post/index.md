# 07 - Fetch Incoming Records List [POST]

`POST /digi-locker/incoming/records/list`

Lists the records a HIP has sent to the person's DigiLocker within a date range.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/digi-locker/incoming/records/list \
  --header 'Content-Type: application/json' \
  --data '{
  "hipId": "IN0710000700",
  "fromDate": "2026-01-01T00:00:00.000Z",
  "toDate": "2026-06-17T23:59:59.000Z"
}'
```
