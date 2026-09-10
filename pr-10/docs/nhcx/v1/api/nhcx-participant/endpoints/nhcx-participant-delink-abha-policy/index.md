# Remove a policy link

`POST /participant/delink/abha/policy`

Only products already on the link can be removed; naming one that is not there returns "There is no policies with requested details". The commonest reason to de-link is a change of TPA, and there is no edit call, so plan that as a batch job.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/delink/abha/policy \
  --header 'Accept: <ACCEPT>' \
  --header 'Content-Type: application/json' \
  --data '{
  "requestid": "5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11",
  "payerid": "<PAYERID>",
  "processingid": "<PROCESSINGID>",
  "memberid": "<MEMBERID>",
  "policies": [
    {
      "productid": "<PRODUCTID>",
      "productname": "<PRODUCTNAME>"
    }
  ]
}'
```
