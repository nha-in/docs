# Find the Aadhaar number behind an ABHA number

`GET /v3/profile/benefit/search/aadhaarByAbha`

The reverse lookup. It returns a national identity number, so treat both
the request and the response as sensitive and log neither.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/search/aadhaarByAbha \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'BENEFIT_NAME: healthid api' \
  --header 'healthIdNumber: <ABHA_NUMBER>'
```
