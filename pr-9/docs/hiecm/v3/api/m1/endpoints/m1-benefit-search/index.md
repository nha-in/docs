# Search benefit records for a person

`POST /v3/profile/benefit/search`

Searches by encrypted XML UID or by ABHA number, depending on
`loginHint`. Returns an array, one entry per benefit scheme, each with
the scheme name, its identifier and a status.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/search \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'BENEFIT_NAME: healthid api' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "search"
  ],
  "loginHint": "xmlUid",
  "loginId": "<ENCRYPTED_XML_UID>"
}'
```
