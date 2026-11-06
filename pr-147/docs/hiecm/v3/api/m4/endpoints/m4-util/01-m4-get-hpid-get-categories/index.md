# Fetch HPID categories

`GET /hpid/get/categories`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/hpid/get/categories \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string, required)

## Query parameters

- `role` (integer)

## Responses

- `200`: OK
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
[
  {
    "code": 1,
    "name": "Doctor",
    "subCategories": [
      {
        "code": "220",
        "name": "Yoga and Naturopathy"
      },
      {
        "code": "1",
        "name": "Modern Medicine"
      },
      "... 1 more of the same shape"
    ]
  },
  {
    "code": 2,
    "name": "Nurse",
    "subCategories": [
      {
        "code": "9",
        "name": "Registered Nurse and Registered Midwife (RN & RM)"
      },
      {
        "code": "10",
        "name": "Registered Lady Health Visitor (RLHV)"
      },
      "... 1 more of the same shape"
    ]
  },
  "... 1 more of the same shape"
]
```
