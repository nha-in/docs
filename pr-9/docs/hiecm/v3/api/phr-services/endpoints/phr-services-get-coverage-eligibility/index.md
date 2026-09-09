# get-coverage-eligibility

`POST /nhcx/get-coverage-eligibility`

Checks whether a person's insurance policy covers them, through the National Health Claims Exchange. The result arrives at `on_check`.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/nhcx/get-coverage-eligibility \
  --header 'Content-Type: application/json' \
  --data '{
  "sno": "200012950",
  "abhanumber": "<ABHA_NUMBER>",
  "mobilenumber": "<MOBILE>",
  "memberid": "PM3T2HSBX",
  "payerid": "1518@hcx",
  "productid": "100155",
  "productname": "PMJAY/HP/S/G",
  "processingid": "1518@hcx"
}'
```
