# get-policies

`POST /nhcx/get-policies`

Lists the insurance policies held against an ABHA number. `encryptedAbhaNumber` is the ABHA number encrypted.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/nhcx/get-policies \
  --header 'Content-Type: application/json' \
  --data '{
  "encryptedAbhaNumber": "<ABHA_NUMBER>",
  "insuranceType": "pmjay"
}'
```
