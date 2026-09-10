# Update a participant record (sandbox)

`POST /participant/update`

The same shape as create, keyed on the participant code. Used to change the encryption certificate or the callback address.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/update \
  --header 'Accept: <ACCEPT>' \
  --header 'Content-Type: application/json' \
  --data '{
  "participant_code": "1000004446@hcx",
  "participant_name": "<PARTICIPANT_NAME>",
  "scheme_code": "<SCHEME_CODE>",
  "roles": [
    "<ROLES>"
  ],
  "primaryEmail": "<PRIMARY_EMAIL>",
  "phone": [
    "<PHONE>"
  ],
  "primaryMobile": "<PRIMARY_MOBILE>",
  "endpoint_url": "<ENDPOINT_URL>",
  "signing_cert_path": "<SIGNING_CERT_PATH>",
  "encryption_cert": "<ENCRYPTION_CERT>"
}'
```
