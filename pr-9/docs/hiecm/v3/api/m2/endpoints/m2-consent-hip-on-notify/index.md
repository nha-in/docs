# Acknowledge a consent notification

`POST /hiecm/consent/v3/request/hip/on-notify`

Also known as: Consent HIP On-Notify.
**Async Callback:** After ABDM Gateway sends a consent grant notification to the HIP bridge URL
(`{bridgeUrl}/v0.5/consents/hip/notify`), the HIP calls this Gateway endpoint to
acknowledge receipt of the consent artefact.

The consent notification contains the full consent details including care contexts,
HI types, date range, and digital signature for validation.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/consent/v3/request/hip/on-notify \
  --header 'Content-Type: application/json' \
  --data '{
  "acknowledgement": {
    "status": "OK",
    "consentId": "consent-art-uuid-001"
  },
  "response": {
    "requestId": "req-uuid-from-hip-notify"
  }
}'
```
