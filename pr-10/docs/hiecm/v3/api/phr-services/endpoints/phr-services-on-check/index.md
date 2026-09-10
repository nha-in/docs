# on_check

`POST /nhcx/v1/coverageeligibility/on_check`

Callback carrying the payer's answer to a coverage eligibility check.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/nhcx/v1/coverageeligibility/on_check \
  --header 'Content-Type: application/json' \
  --data '{
  "type": "JWEPayload",
  "payload": ""
}'
```
