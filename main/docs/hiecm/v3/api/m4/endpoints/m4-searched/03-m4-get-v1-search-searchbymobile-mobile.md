# Search user by mobile no

`GET /v1/search/searchByMobile/{mobile}`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1/search/searchByMobile/{mobile} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Path parameters

- `mobile` (string, required)

## Responses

- `200`: OK
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
[
  {
    "hprIdNumber": "<HPR_ID>",
    "name": "Ayushman Bharat Mission",
    "authMethods": [
      "PASSWORD",
      "MOBILE_OTP",
      "... 1 more of the same shape"
    ],
    "hprId": "<EMAIL>",
    "categoryId": "1",
    "subCategoryId": "1"
  }
]
```
