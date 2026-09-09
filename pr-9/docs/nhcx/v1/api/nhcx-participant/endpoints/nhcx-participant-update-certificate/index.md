# Replace only the encryption certificate (production)

`POST /v2/update/cert`

A shorter path that skips the passcode, for the yearly key rotation NHA recommends. Not present in the Postman collection; documented on the onboarding page.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/update/cert \
  --header 'Content-Type: application/json' \
  --data '{
  "participantId": "<PARTICIPANT_ID>",
  "certificate": "<CERTIFICATE>"
}'
```
