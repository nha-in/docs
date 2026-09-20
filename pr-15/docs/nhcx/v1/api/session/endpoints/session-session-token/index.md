# Submit the session token

`POST /api/hiecm/gateway/v3/sessions`

Mints the ABDM gateway session token that every NHCX call carries, from the client ID and secret issued for Milestone 1.

### Business purpose

The token does not come from NHCX. It comes from the ABDM gateway, and one token serves every call: the participant service, the use-case endpoints and the status check. Nothing else in this collection works without it, which is why the post-response script below stores it in `token`, so that running this request once arms the rest of the collection.

### When to use

Before the first call, and again whenever the token you hold is more than a few minutes old or any call answers `401`. Build against this v3 address.

### Preconditions

- Milestone 1 is complete and you hold its client ID and secret.
- `REQUEST-ID` is a fresh UUID generated for this call.
- `TIMESTAMP` is the current time in UTC, ISO 8601 with milliseconds and a trailing `Z`, as in `2026-09-04T06:15:51.975Z`, taken from a synchronised system clock.
- `X-CM-ID` is `sbx` on the sandbox.
- The body carries `grantType` `client_credentials`, which the v3 address requires.

### Postconditions

The gateway returns `accessToken`, `expiresIn`, `refreshToken` and `tokenType` `bearer`. On every NHCX call the token goes in `bearer_auth` as `Bearer <token>`. Some pages and the notification endpoint use `Authorization` instead, so this collection sends both with the same value. The documents put the token's life at 300, 1200 and 6000 seconds in different places, so do not rely on any of them.

### Common mistakes

- Reusing a `REQUEST-ID` copied from an example instead of generating a new one.
- A `TIMESTAMP` built by hand or read from a drifted clock, which is refused.
- Omitting `grantType`, as older samples do, which the v3 address rejects.
- Sending the token without the `Bearer ` prefix, the portal's own example of a `401`.
- Retrying a `401` with the same token. It fails the same way.
- Writing the token or the client secret to a log.

### Best practices

- Keep the token together with the time you got it, and fetch a new one before a call if it is more than a few minutes old.
- On any `401`, get a new token and retry that call once.
- Send the token on both `bearer_auth` and `Authorization`.
- Keep the clock synchronised with NTP and let a date library format the TIMESTAMP.

### Related scenario

A hospital's integration starts its first eligibility check of the day. It posts this request with a new `REQUEST-ID`, the current UTC `TIMESTAMP` and `X-CM-ID` `sbx`, stores the `accessToken` with the time it arrived, and sends it on the check as `bearer_auth: Bearer <token>`. Later a claim call answers `401 Sender is not authorized to execute the operation`. The integration mints a fresh token, retries the claim once, and it goes through.

### Specification

Chapter [Base URLs](/docs/nhcx/v1/getting-started/base-urls) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: <uuid>' \
  --header 'TIMESTAMP: <iso timestamp>' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "<client id>",
  "clientSecret": "<client secret>",
  "grantType": "client_credentials"
}'
```

## Headers

- `REQUEST-ID` (string, required): `REQUEST-ID` is a fresh UUID that you generate for every call. Sending the same one twice is the mistake to avoid; generate it, do not copy it from an example.
- `TIMESTAMP` (string, required): `TIMESTAMP` is the current time in UTC, ISO 8601 with milliseconds and a trailing `Z`, as in `2026-09-04T06:15:51.975Z`. A clock that has drifted will be refused, so take the time from the system rather than constructing it by hand. How to produce it in each language is at the end of this chapter.
- `X-CM-ID` (string, required): `X-CM-ID` names the environment. It is `sbx` on the sandbox. The mirror and the adapter both use lowercase.

## Body

- `clientId` (string)
- `clientSecret` (string)
- `grantType` (string)

## Responses

- `200`: The gateway returns `accessToken`, `expiresIn`, `refreshToken` and `tokenType` `bearer`.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "expiresIn": 300,
  "refreshTokenIn": 300,
  "refreshToken": "eyJhbGciOiJSUzI1NiIs...",
  "tokenType": "bearer"
}
```
