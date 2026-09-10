# Verify - User

`POST /login/phr/verify/user`

Completes a login that matched more than one account: selects the ABHA address to sign in as and returns its session tokens.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/login/phr/verify/user \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>",
  "txnId": "<TXN_ID>"
}'
```
