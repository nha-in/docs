# Add Feedback

`POST /api/notification/feedback`

Records feedback from the person, with a title and body, against their ABHA.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/notification/feedback \
  --header 'Content-Type: application/json' \
  --data '{
  "healthId": "<ABHA_ADDRESS>",
  "emailId": "<EMAIL>",
  "title": "feedback",
  "body": "AarogyaSethu feedback test-1"
}'
```
