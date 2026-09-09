# Get Gateway JWKS Certificates

`GET /api/hiecm/gateway/v3/certs`

Get the JSON Web Key Set (JWKS) to verify JWT signatures in gateway callbacks.

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/certs \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z'
```
