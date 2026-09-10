# Refresh the user token

`GET /hcx/abha/biometric/auth/refresh/token`

Extends the 30 minute user token through a long transaction. A refresh token is not accepted in place of a live capture on a cyclic procedure's per-visit authentication; only for the final claim.

```bash
curl --request GET \
  --url https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/refresh/token \
  --header 'R-token: <R_TOKEN>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'payerid: <PAYERID>' \
  --header 'process: <PROCESS>'
```
