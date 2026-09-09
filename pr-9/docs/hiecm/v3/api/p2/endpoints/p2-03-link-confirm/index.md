# 03 link-confirm

`POST /user-initiated-linking/link/confirm`

Confirms a user-initiated link with the OTP the HIP sent, completing the link of the discovered care contexts.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/user-initiated-linking/link/confirm \
  --header 'Content-Type: application/json' \
  --data '{
  "token": 123456,
  "linkRefNumber": "<TXN_ID>"
}'
```
