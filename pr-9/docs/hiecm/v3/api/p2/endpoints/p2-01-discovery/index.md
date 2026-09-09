# 01 discovery

`POST /user-initiated-linking/link/discover`

Discovers the person's care contexts at a HIP using their demographics and any identifiers they hold there.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/user-initiated-linking/link/discover \
  --header 'Content-Type: application/json' \
  --data '{
  "hip": {
    "id": "<HIP_ID>",
    "name": "<NAME>"
  },
  "unverifiedIdentifiers": [
    {
      "type": "MR",
      "value": "<MOBILE>"
    }
  ]
}'
```
