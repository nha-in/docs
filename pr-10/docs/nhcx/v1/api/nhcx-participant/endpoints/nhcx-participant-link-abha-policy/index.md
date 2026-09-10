# Link a policy to an ABHA number

`POST /participant/link/abha/policy`

The payer's half, performed when the policy is written or renewed. It is what makes the beneficiary findable by ABHA number at the point of care. Only the participants named as `payerid` or `processingid` may change the link later, and the exchange checks the caller's token against them, so the linking job must run under the same credentials that created the participant.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/link/abha/policy \
  --header 'Accept: <ACCEPT>' \
  --header 'Content-Type: application/json' \
  --data '{
  "requestid": "5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11",
  "abhanumber": "<ABHANUMBER>",
  "mobilenumber": "<MOBILENUMBER>",
  "memberid": "<MEMBERID>",
  "payerid": "<PAYERID>",
  "processingid": "<PROCESSINGID>",
  "policies": [
    {
      "productid": "<PRODUCTID>",
      "productname": "<PRODUCTNAME>"
    }
  ]
}'
```
