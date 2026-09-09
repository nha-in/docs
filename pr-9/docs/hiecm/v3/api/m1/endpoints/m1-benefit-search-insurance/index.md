# Find insurance cover recorded against an ABHA number

`GET /v3/profile/benefit/abha/search/insurance/{abhaNumber}`

Documented responses include 400, 401 and 500 as well as 200. Handle
all four.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/abha/search/insurance/{abhaNumber} \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>'
```
