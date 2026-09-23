# Validate participant creation

`GET /validate`

Confirms a participant creation by presenting the SMS passcode and the transactionId returned by /v2/participant/create.

### Business purpose

Registering an organisation on a national claims exchange must be authorised by someone who actually controls that organisation's registered contact channel. The create call therefore only stages the record and sends a passcode to the mobile number held in HFR or the NHCX payer details; this validation call closes the loop by proving possession of that passcode. It is step 2 of the four-step production onboarding sequence and is what turns a staged participant into a confirmed one.

### When to use

Call it after `/v2/participant/create` returns a `transactionid` and the passcode arrives by SMS. Do it within 24 hours, and before any `/v2/participant/update`.

### Preconditions

- You have the `transactionid` from the create call.
- You have the SMS passcode for that same transaction.
- You have a valid access token.

### Postconditions

The participant is confirmed in the registry. You can now upload the certificate and callback URL with `/v2/participant/update`.

### Common mistakes

- Waiting more than 24 hours, so both values expire.
- Calling create again while a passcode is pending, which replaces the earlier pair.
- Calling `/update/validate` instead. That one confirms updates.

### Best practices

- Treat the passcode like a one-time credential: never log it, and hand it from the phone holder to the integrator through a controlled channel.
- Store transactionid with a 24-hour expiry so the operator dashboard can show whether confirmation is still possible.
- Send parameters as query string values on a GET; there is no JSON body.
- After success, proceed straight to /v2/participant/update so the certificate and endpoint are in place before any counterparty tries to fetch them.

### Related scenario

A hospital's production onboarding started with /v2/participant/create, which returned transactionid 1vouv8tlz2tnl-1fpspjhwj07c6 and triggered a passcode to the medical superintendent's registered phone. The superintendent reads the passcode to the integration engineer, who calls GET /validate?transactionId=1vouv8tlz2tnl-1fpspjhwj07c6&passcode=482913 with the Bearer token. The registry returns 200 and the participant is confirmed. The engineer then calls /v2/participant/update with the Base64 certificate and callback URL, and completes that change with /update/validate.

### Specification

Chapter [Your certificate](/docs/nhcx/v1/getting-started/your-certificate) of the NHCX integration specification.

```bash
curl --request GET \
  --url "https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/validate?transactionId=<TRANSACTIONID>&passcode=<PASSCODE>" \
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

- `200`: HTTP 200 with a bare string body; the OpenAPI declares the 200 response type as string and the operation (particiapntValidate) as validating approval from the participant for participant creation.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "_contentType": "string",
  "_body": "<confirmation string as declared by the OpenAPI 200 response>"
}
```
