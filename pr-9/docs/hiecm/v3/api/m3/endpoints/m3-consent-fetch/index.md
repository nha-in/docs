# Fetch the full consent artefact

`POST /hiecm/consent/v3/fetch`

Also known as: Consent Fetch.
Fetches the full consent artefact for a given consent artefact ID.
Should be called after receiving the `on-notify` callback with status `GRANTED`.

The artefact contains:
- Exact care contexts approved
- HI types permitted
- Date range for data access
- Data erase date
- Digital signature for validation
- HIP and HIU identifiers

Store the artefact securely, it is required for the health information request.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/consent/v3/fetch \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "consentId": "consent-art-uuid-001"
}'
```
