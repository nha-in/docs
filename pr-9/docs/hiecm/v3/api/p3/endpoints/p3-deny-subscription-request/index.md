# Deny Subscription Request

`POST /api/consent-management/subscription-requests/{subscriptionRequestId}/deny`

Denies a subscription request, so the HIU is not notified of the person's new care contexts.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/consent-management/subscription-requests/{subscriptionRequestId}/deny \
  --header 'Content-Type: application/json' \
  --data '{}'
```
