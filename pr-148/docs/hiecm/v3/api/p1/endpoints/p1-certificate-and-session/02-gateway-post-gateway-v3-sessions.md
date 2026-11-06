# Generate access token

`POST /api/hiecm/gateway/v3/sessions`

Generate an access token. When invoked, it facilitates the authentication process by providing a secure token that can be used to access various services and resources within the system. This functionality is essential for ensuring secure and authorised access, enabling users to interact with protected endpoints and perform operations that require authentication. By using this API, users can obtain the necessary tokens to maintain secure sessions and access the system’s features effectively.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "SBX_0000",
  "clientSecret": "0******-***-***-***-a****",
  "grantType": "client_credentials"
}'
```

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended

## Body

- `clientId` (string, required): The client ID issued to the integrator by ABDM at registration.
- `clientSecret` (string, required): The client secret issued to the integrator by ABDM along with the client ID.
- `grantType` (string, required): The method used by the client to obtain an access token, e.g. client_credentials. One of: client_credentials.

## Responses

- `202`: Accepted
  - `accessToken` (string)
  - `expiresIn` (integer)
  - `refreshExpiresIn` (integer)
  - `refreshToken` (string)
  - `tokenType` (string)
- `204`: No Content
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1001 - No data found. May be returned either bare (`ABDM-1001`) or with a trailing ": " separator (`ABDM-1001: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `400`: Bad Request
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1015 - Invalid Response. May be returned either bare (`ABDM-1015`) or with a trailing ": " separator (`ABDM-1015: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `401`: Unauthorized. The request carried no valid credentials, or the access token has expired. Obtain a fresh token from the session API and retry.
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900901 - Invalid Credentials. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string): Short description of the failure.
  - `description` (string): Detailed description of the failure.
- `403`: Forbidden. The caller is authenticated but is not permitted to perform this operation on this resource.
- `500`: Internal Server Error
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-9999 - Unknown exception. May be returned either bare (`ABDM-9999`) or with a trailing ": " separator (`ABDM-9999: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `503`: Service Unavailable
  - `code` (string, required): ABDM-1024 - Dependent service unavailable. May be returned either bare (`ABDM-1024`) or with a trailing ": " separator (`ABDM-1024: `); match on the code itself and tolerate the separator.
  - `message` (string, required)

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "accessToken": "<TOKEN>",
  "expiresIn": 1200,
  "refreshExpiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "tokenType": "bearer"
}
```
