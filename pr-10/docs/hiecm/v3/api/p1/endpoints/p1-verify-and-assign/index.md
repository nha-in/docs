# verify and assign

`POST /family-management/verify-and-assign`

Verifies the OTP for a family link transaction and, in the same step, links the given ABHA address under the relationship type. May also unassign a previous address.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/family-management/verify-and-assign \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddressToLink": "<ABHA_ADDRESS_TO_LINK>",
  "txnId": "<TXN_ID>",
  "relationshipTypeId": 0,
  "abhaAddressToUnassign": "<ABHA_ADDRESS_TO_UNASSIGN>"
}'
```
