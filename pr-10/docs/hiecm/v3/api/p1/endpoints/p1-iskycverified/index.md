# IsKycVerified

`POST /login/phr/isKycVerified`

Reports whether the ABHA address given has completed KYC verification.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/login/phr/isKycVerified \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>"
}'
```
