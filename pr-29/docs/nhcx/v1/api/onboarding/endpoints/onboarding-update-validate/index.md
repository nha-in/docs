# Validate participant update

`GET /update/validate`

Confirms a participant update by presenting the SMS passcode and the transactionId returned by /v2/participant/update.

### Business purpose

Changing a participant's encryption certificate or callback endpoint changes where encrypted claims data is delivered and who can decrypt it, so the registry does not apply such updates on an API call alone. /v2/participant/update stages the change and sends a passcode to the registered mobile number; this call confirms it. It is step 4 of the production onboarding sequence and the same approval mechanism protects every later certificate or bridge rotation done through the v2 update.

### When to use

Call it after `/v2/participant/update` returns a `transactionid` and the passcode arrives by SMS, within 24 hours. It makes the new certificate and callback URL live.

### Preconditions

- The participant was created and confirmed through `/validate`.
- You have the `transactionid` from the update call and its SMS passcode.
- You have a valid access token.

### Postconditions

The new certificate and callback URL become live. Other participants now fetch the new certificate.

### Common mistakes

- Assuming the update is live before this call succeeds.
- Using a passcode from an earlier update attempt.
- Calling `/validate` instead. That one confirms creation.

### Best practices

- Rotate keys in two phases: keep the old private key available for decrypting inbound callbacks until the update is validated and cached certificates (24-hour TTL on the payer side) have refreshed.
- Persist transactionid with its 24-hour expiry and record who completed validation, for audit.
- Never log the passcode; treat it as a one-time credential.
- After success, call /participant/search on your own code to confirm encryption_cert and endpoint_URL reflect the change.

### Related scenario

A year after go-live a payer's security team rotates the encryption key pair. The integrator generates a new self-signed X.509 certificate, Base64-encodes it and calls /v2/participant/update with participantcode and encryptioncert. The registry returns status and a new transactionid and sends a passcode to the registered mobile. Within the hour the team calls GET /update/validate with both values; on 200 the new certificate is live. Providers that cached the old certificate pick up the new one at their next 24-hour refresh, and the payer keeps the old private key for one more day to decrypt in-flight callbacks.

### Specification

Chapter [Your certificate](/docs/nhcx/v1/getting-started/your-certificate) of the NHCX integration specification.

```bash
curl --request GET \
  --url "https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/update/validate?transactionId=<TRANSACTIONID>&passcode=<PASSCODE>" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Query parameters

- `transactionId` (string, required)
- `passcode` (string, required)

## Responses

- `200`: HTTP 200 with a bare string body (operation particiapntUpdateValidate, response type string).

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "_contentType": "string",
  "_body": "<confirmation string as declared by the OpenAPI 200 response>"
}
```
