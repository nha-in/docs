# Check the status of a consent request

`POST /hiecm/consent/v3/request/status`

Also known as: Consent Request Status.
Checks the current status of a previously initiated consent request.
Can be polled periodically while awaiting patient action.

**Status values:**
- `REQUESTED`, Awaiting patient action
- `GRANTED`, Patient approved; `consentArtefacts` array will contain artefact IDs
- `DENIED`, Patient denied the request
- `EXPIRED`, Request timed out without patient action
- `REVOKED`, Previously granted consent was revoked by the patient

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/consent/v3/request/status \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "consentRequestId": "req-uuid-001"
}'
```
