# Get master data

`GET /v1.5/facility/get-master-data`

```bash
curl --request GET \
  --url "https://apihspsbx.abdm.gov.in/v4/int/v1.5/facility/get-master-data?type=<TYPE>" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The HPID calls publish POST /getManagementToken.

## Query parameters

- `type` (string, required)

## Responses

- `200`: OK
  - `type` (string)
  - `data` (object[])
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "type": "MEDICINE",
  "data": [
    {
      "code": "H",
      "value": "Homeopathy"
    },
    {
      "code": "UN",
      "value": "Unani"
    },
    "... 1 more of the same shape"
  ]
}
```
