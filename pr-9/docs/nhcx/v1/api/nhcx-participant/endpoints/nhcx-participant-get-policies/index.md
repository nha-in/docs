# Look up a beneficiary's policies

`POST /participant/get/policies`

Given something that identifies the patient, returns every policy linked to them. The three identifier types are not equal: try `AbhaNumber` first, then `MemberId`, then `MobileNo`, and stop at the first that returns a policy.

What comes back decides the address on every later envelope. `processingid` is the recipient, not `payerid`. Pointing at `payerid` is the portal's seventh most common mistake.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/get/policies \
  --header 'Accept: <ACCEPT>' \
  --header 'Content-Type: application/json' \
  --data '{
  "identifiertype": "AbhaNumber",
  "identifiervalue": "91123456781234"
}'
```
