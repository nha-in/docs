# 3. PHR Address Suggestion

`POST /api/registration/phr/suggestion`

Suggests available ABHA addresses from the person's name and date of birth, for a mobile-based registration transaction.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/registration/phr/suggestion \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "<TXN_ID>",
  "firstName": "<FIRST_NAME>",
  "lastName": "<LAST_NAME>",
  "dayOfBirth": "14",
  "monthOfBirth": "10",
  "yearOfBirth": "1999"
}'
```
