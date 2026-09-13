# Get RSA Public Certificate

`GET /profile/public/certificate`

Fetch the RSA public key used to encrypt all sensitive fields before transmission.
Fields requiring encryption: Aadhaar, Mobile, OTP, Password, ABHA Number, Email, Photo.

**Server:** `https://abhasbx.abdm.gov.in/abha/api`

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/profile/public/certificate \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>'
```
