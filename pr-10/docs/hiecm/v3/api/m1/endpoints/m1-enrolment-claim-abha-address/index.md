# Claim a chosen ABHA address

`POST /v3/enrollment/enrol/abha-address`

Attaches the address the person picked to the ABHA number created
earlier. `preferred: 1` marks it as the one to show.

Until this succeeds the account has only the default address that the service
issues automatically, which is the fourteen digit number followed by
`@sbx` or `@abdm` and which nobody can remember.

The ABHA number comes back from this call as `healthIdNumber`, not as
`ABHANumber`. The enrol response spells the same value `ABHANumber`, so
a client that reuses its enrol parsing here reads nothing.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/abha-address \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "<TXN_ID>",
  "abhaAddress": "<ABHA_ADDRESS>",
  "preferred": 1
}'
```
