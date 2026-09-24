# Get session token

`POST /get/session`

Exchanges the participant's client_ID and client_secret (OAuth 2.0 client credentials) for a Bearer access_token valid for 1200 seconds.

### Business purpose

Every NHCX API call, whether a registry lookup, a certificate fetch or a claim submission, is rejected unless it carries a valid Bearer token, so this is the first call any integration makes and the first thing to check when a working integration starts failing. It answers the question of who is calling the gateway. It is deliberately separate from payload confidentiality: a request can be perfectly encrypted and still fail with 401, and vice versa.

### When to use

Call it when your system starts and again before the cached token expires. There is no refresh token: you simply call it again. Confirm the current host with your onboarding contact.

### Preconditions

- You have the `client_ID` and `client_secret` issued at onboarding.
- The credentials match the environment: sandbox and production credentials are separate.
- The body is form-encoded with `grant_type=client_credentials`.
- You do not need an access token for this call.

### Postconditions

You get an access token that lasts 20 minutes. Send it on every later call; after it expires, calls return `401`.

### Common mistakes

- Not renewing the token, so calls start failing with `401` after 20 minutes.
- Sending JSON instead of a form-encoded body.
- Asking for a new token on every request instead of caching it.
- Using a sandbox token against production.

### Best practices

- Cache the token in memory keyed by environment and refresh proactively at roughly 80 to 90 percent of the 1200-second (20-minute) lifetime, that is after 16 to 18 minutes.
- Serialise refresh behind a lock so concurrent workers do not fire simultaneous token requests.
- On any 401, discard the cached token, mint a new one and replay the original request exactly once; if the second attempt also fails, stop and alert, since the credentials are wrong or revoked.
- Never log the access_token or client_secret; log the expiry timestamp instead.
- Store secrets so they can be rotated without a code deploy.
- The token is validated by ABDM, so a 401 on any NHCX call carries no hint that expiry is the cause; treat 401 as refresh-and-retry first.

### Related scenario

At 09:00 a hospital's claims engine starts and POSTs its client_ID and client_secret to /get/session, receiving an access_token with expires_in 1200. It caches the token and immediately calls /fetch/certs for the payer it will submit to. At 09:17 a background timer renews the token before the 20-minute mark, so the /v1/preauth/submit sent at 09:21 carries a fresh Bearer header. Later a worker receives a 401 after a network stall; it drops the cached token, calls /get/session once more, replays the request and succeeds. Had the second attempt also failed, the engine would have alerted operations rather than looping.

### Specification

Chapter [Base URLs](/docs/nhcx/v1/getting-started/base-urls) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/get/session \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "_contentType": "application/x-www-form-urlencoded",
  "client_id": "<ABDM_CLIENT_ID>",
  "client_secret": "<ABDM_CLIENT_SECRET>",
  "grant_type": "client_credentials"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Body

- `_contentType` (string)
- `client_id` (string)
- `client_secret` (string)
- `grant_type` (string)

## Responses

- `200`: HTTP 200 with { access_token, expires_in: 1200, token_type: Bearer }.
  - `access_token` (string)
  - `expires_in` (integer)
  - `token_type` (string)

Example 200 response. The values are placeholders:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "expires_in": 1200,
  "token_type": "Bearer"
}
```
