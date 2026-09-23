# Submit the session token

`POST /api/hiecm/gateway/v3/sessions`

Mints the ABDM gateway session token that every NHCX call carries, from the client ID and secret issued for Milestone 1.

### Business purpose

The token does not come from NHCX. It comes from the ABDM gateway, and one token serves every call: the participant service, the use-case endpoints and the status check. Nothing else in this collection works without it, which is why the post-response script below stores it in `token`, so that running this request once arms the rest of the collection.

### When to use

Call it before your first NHCX call. Call it again when your token is more than about 18 minutes old, ahead of its 20-minute (1200-second) expiry, or when any call answers `401`.

### Preconditions

- You have finished Milestone 1 and hold its client ID and secret.
- `REQUEST-ID` is a new UUID and `TIMESTAMP` is the current UTC time from a synced clock.
- `X-CM-ID` is `sbx` on the sandbox.
- The body sets `grantType` to `client_credentials`.

### Postconditions

The gateway returns an access token in `accessToken`. Send it on every NHCX call as `Bearer <token>`, in both `bearer_auth` and `Authorization`. The token lasts 1200 seconds (20 minutes), stated in `expiresIn`.

### Common mistakes

- Copying a `REQUEST-ID` from an example instead of making a new one.
- Typing the `TIMESTAMP` by hand, or reading it from a clock that has drifted.
- Leaving out `grantType`, as older samples do.
- Sending the token without the `Bearer ` prefix.

### Best practices

- Keep the token together with the time you got it, and fetch a new one before a call if it is more than about 18 minutes old, ahead of the 20-minute expiry.
- On any `401`, get a new token and retry that call once.
- Send the token on both `bearer_auth` and `Authorization`.
- Keep the clock synchronised with NTP and let a date library format the timestamp.

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

- `200`: The gateway returns `accessToken`, `expiresIn` `1200` (20 minutes), `refreshToken` and `tokenType` `bearer`.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "expiresIn": 1200,
  "refreshTokenIn": 300,
  "refreshToken": "eyJhbGciOiJSUzI1NiIs...",
  "tokenType": "bearer"
}
```
