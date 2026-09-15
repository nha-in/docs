# Fetch certificate path

`POST /fetch/certs/path`

Companion to /fetch/certs: takes the same participantid body and returns a string described as the participant's certificate path.

### Business purpose

The registry stores a participant's encryption certificate as a URI or file path in the encryption_cert field, and this endpoint exposes that reference for a given participant. It exists alongside /fetch/certs, which the Integration Handbook names as the call to use when obtaining key material for encryption. Both serve the same underlying need, resolving a counterparty's public key before building a JWE, but the OpenAPI documents them identically and does not describe how their returned strings differ.

### When to use

Use it only if your HCX instance or onboarding contact tells you to; the chapter's guidance is to treat /fetch/certs as the one to use for encryption. Both endpoints are POST, both carry the Registry APIs tag, both take ParticipantCertRequest and both declare a string 200 response with 400, 404 and 500 ErrorResponse outcomes. It is a synchronous JSON registry call with no workflow or x-hcx-status codes.

### Preconditions

- Bearer token from /get/session in bearer_auth with the Bearer prefix; Accept and Content-Type: application/json.
- ParticipantCertRequest with participantid (required), the target's participant code in <code>@hcx form.
- The target participant has completed onboarding with an encryption certificate registered.

### Postconditions

HTTP 200 with a string body. The spec describes the operation (fetchCertsPath) with the same text as /fetch/certs, so the precise content of the string beyond being a certificate path is not documented. No registry state changes and no callback. Errors use the ErrorResponse envelope on 400, 404 and 500.

### Common mistakes

- Assuming this returns the same PEM as /fetch/certs and feeding a path string into a key-import routine.
- Choosing it over /fetch/certs for encryption without instance-specific guidance; the handbook names /fetch/certs.
- Passing participant_code instead of participantid.
- Omitting Accept or the Bearer prefix on the token.

### Best practices

- Prefer /fetch/certs for obtaining key material; use this endpoint only where the instance documents a use for the path form.
- If you do use it, log the returned string shape once so a change in behaviour is noticed.
- Apply the same 24-hour cache discipline keyed by participantid.
- Keep both calls behind one client function so the choice is a configuration switch.

### Related scenario

An integrator building a registry inspection tool for a TPA wants to show, for each payer, where the registry references its certificate as well as the certificate itself. The tool obtains a Bearer token, calls /fetch/certs/path with participantid 1518@hcx and displays the returned path string, then calls /fetch/certs for the PEM used for actual encryption. The production claims engine itself only uses /fetch/certs, as the Integration Handbook prescribes, before each /v1/claim/submit.

### Specification

Chapter [Finding participants and policies](/docs/nhcx/v1/getting-started/finding-participants-and-policies) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs/path \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "participantid": "1518@hcx"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `participantid` (string)

## Responses

- `200`: HTTP 200 with a string body.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "_contentType": "string",
  "_body": "<certificate path string as declared by the OpenAPI 200 response>"
}
```
