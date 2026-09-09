# Confirm the update passcode (production, step 4 of 4)

`GET /update/validate`

The certificate and address go live. The exchange can now reach you.

```bash
curl --request GET \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/update/validate \
  --header 'Accept: <ACCEPT>'
```
