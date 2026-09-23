# Update certificate (v2, no passcode)

`POST /v2/update/cert`

Replaces a participant's public encryption certificate by participantId without passcode validation; the same schema is echoed back on success.

### Business purpose

Encryption keys are recommended to be rotated once a year, and a compromised key must be replaced immediately. The passcode-gated /v2/participant/update is the safer general route, but it needs a person with the registered phone and a 24-hour confirmation step. This endpoint exists for certificate-only updates without that validation, so an organisation can publish a new public certificate quickly. Only the certificate changes; the endpoint URL is untouched.

### When to use

Use it to replace your certificate, on schedule or in an emergency, without a passcode step. To change your callback URL too, use `/v2/participant/update`.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You send `participantId` and the new certificate, Base64-encoded.
- The matching new private key is already on your callback server.

### Postconditions

Your certificate is replaced at once, with no validation step. Some participants may keep the old one cached for up to 24 hours.

### Common mistakes

- Sending the raw certificate instead of the Base64-encoded one.
- Publishing the certificate before its private key is live.
- Deleting the old private key straight away. Keep it for 24 hours.
- Trying to change the callback URL here.

### Best practices

- Rotate in two phases: deploy the new PKCS8 private key, publish the certificate, and keep the old key for at least 24 hours.
- Generate a 2048-bit RSA key and a 365-day self-signed X.509 certificate so the validity matches the annual rotation recommendation.
- Verify with /participant/search or a /fetch/certs call against your own code that the new certificate is served.
- Restrict who can call this endpoint inside your organisation, since it replaces the key that protects all inbound health data without a passcode.
- Notify the ecosystem promptly if rotation is due to suspected compromise, as the protocol expects.

### Related scenario

A hospital's security audit finds its NHCX private key was copied to a shared drive. The team generates a new 2048-bit RSA key pair and 365-day self-signed certificate, deploys the PKCS8 private key to the callback host and Base64-encodes the certificate. With a Bearer token they call /v2/update/cert with participantId XXXXX7583@hcx and the certificate; the registry echoes the schema back. They keep the old key available for one day so payers still holding the cached certificate can be decrypted, then destroy it. The next /v1/preauth/on_submit from the payer, encrypted against the new certificate, decrypts cleanly.

### Specification

Chapter [Your certificate](/docs/nhcx/v1/getting-started/your-certificate) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/update/cert \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "participantId": "XXXX@hcx",
  "certificate": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t..."
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `participantId` (string)
- `certificate` (string)

## Responses

- `200`: HTTP 200 with the UpdateCertV2 schema echoed back (participantId and certificate).

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "participantId": "XXXX@hcx",
  "certificate": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t..."
}
```
