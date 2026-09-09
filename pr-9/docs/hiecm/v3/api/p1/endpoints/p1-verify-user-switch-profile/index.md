# Verify User Switch Profile

`POST /profile/phr/verify/switch-profile/user`

Completes a profile switch: selects the ABHA address to continue as and returns its session tokens.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/profile/phr/verify/switch-profile/user \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>",
  "txnId": "<TXN_ID>"
}'
```
