# Approve Subscription Request

`POST /api/consent-management/subscription-requests/{subscriptionRequestId}/approve`

Approves a subscription request for the sources included and not the ones excluded, or for every HIP.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/consent-management/subscription-requests/{subscriptionRequestId}/approve \
  --header 'Content-Type: application/json' \
  --data '{
  "isApplicableForAllHIPs": true,
  "includedSources": [
    {
      "hiTypes": [
        "Invoice",
        "HealthDocumentRecord"
      ],
      "purpose": {
        "text": "Care Management",
        "code": "CAREMGT",
        "refUri": "www.abdm.gov.in"
      },
      "categories": [
        "LINK",
        "DATA"
      ],
      "period": {
        "from": "2025-05-22T13:12:55.297Z",
        "to": "2125-05-22T13:11:55.300Z"
      }
    }
  ],
  "excludedSources": []
}'
```
