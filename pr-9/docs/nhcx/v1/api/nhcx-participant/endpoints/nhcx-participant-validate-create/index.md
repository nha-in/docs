# Confirm the create passcode (production, step 2 of 4)

`GET /validate`

Confirms the passcode sent by the create call and makes the participant active. Note the method: both confirmation calls are GETs, not POSTs.

```bash
curl --request GET \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/validate \
  --header 'Accept: <ACCEPT>'
```
