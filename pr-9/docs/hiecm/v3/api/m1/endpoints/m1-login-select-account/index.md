# Choose which ABHA to sign in to

`POST /v3/profile/login/verify/user`

Used when one mobile number carries several ABHA accounts, which is
common in a family. Send the `txnId` from the verify call and the ABHA
number the person picked.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify/user \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'T-token: <T_TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "ABHANumber": "<ABHA_NUMBER>",
  "txnId": "<TXN_ID>"
}'
```
