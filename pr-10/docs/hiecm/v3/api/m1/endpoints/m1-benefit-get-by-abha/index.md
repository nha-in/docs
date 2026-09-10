# Get the benefit record for an ABHA number

`GET /v3/profile/benefit/abha/{abhaNumber}`

Reads the benefit record attached to one ABHA number.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/abha/{abhaNumber} \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'BENEFIT_NAME: healthid api'
```
