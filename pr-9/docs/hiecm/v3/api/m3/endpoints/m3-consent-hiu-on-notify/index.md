# Acknowledge a consent notification

`POST /hiecm/consent/v3/request/hiu/on-notify`

Also known as: Consent HIU On-Notify.
**Async Callback:** After ABDM Gateway sends a consent grant/deny notification to the HIU
bridge URL (`{bridgeUrl}/v0.5/consents/hiu/notify`), the HIU calls this Gateway endpoint
to acknowledge receipt.

The Gateway sends this notification when:
- Patient grants the consent
- Patient denies the consent
- A previously granted consent is revoked

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/consent/v3/request/hiu/on-notify \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'Content-Type: application/json' \
  --data '{
  "acknowledgement": [
    {
      "status": "OK",
      "consentId": "consent-art-uuid-001"
    }
  ],
  "response": {
    "requestId": "req-uuid-from-hiu-notify"
  }
}'
```
