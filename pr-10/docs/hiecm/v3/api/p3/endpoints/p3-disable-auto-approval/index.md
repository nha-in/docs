# Disable Auto Approval

`POST /api/consent-management/consents/auto-approval-policy/{autoApprovalId}/disable`

Turns off an auto-approval policy, so later consent requests it would have matched wait for the person again.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/consent-management/consents/auto-approval-policy/{autoApprovalId}/disable
```
