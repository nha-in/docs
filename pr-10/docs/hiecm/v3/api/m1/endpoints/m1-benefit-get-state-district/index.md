# Get the state and district recorded against an ABHA number

`GET /v3/profile/benefit/abha/statedistrict/{abhaNumber}`

Used to route a person to the right scheme, since eligibility is often
decided by where they live.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/abha/statedistrict/{abhaNumber} \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>'
```
