# Get the ABHA QR code

`GET /v3/profile/account/qrCode`

The QR a person shows at a facility so their ABHA address can be read
without typing. Returns the image payload for the signed in account.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/qrCode \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'X-token: Bearer <X_TOKEN_FROM_LOGIN_VERIFY>'
```
