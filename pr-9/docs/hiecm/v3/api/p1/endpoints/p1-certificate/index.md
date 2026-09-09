# Certificate

`GET /api/global/phr/public-certificate`

Returns the ABDM public key and the encryption algorithm to apply with it. Fetch it before encrypting any value for the PHR application services.

```bash
curl --request GET \
  --url https://phrsbx.abdm.gov.in/api/global/phr/public-certificate
```
