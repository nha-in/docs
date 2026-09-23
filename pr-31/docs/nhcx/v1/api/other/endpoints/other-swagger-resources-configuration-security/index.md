# Get the swagger security configuration

`GET /swagger-resources/configuration/security`

Returns the Swagger UI security configuration for the status service; consumed by Swagger UI, not by integrations.

### Business purpose

Swagger UI reads this endpoint to learn how to present authorisation inputs (such as a bearer token field) when a user tries operations from the browser. It describes UI behaviour only; it does not issue tokens, and it is unrelated to the client-credentials flow at /get/session or to the JWE encryption that protects protocol payloads. The endpoint index describes it as the Swagger security configuration.

### When to use

Use it only in a Swagger UI session against the status service. It does not issue tokens, and integrations never call it.

### Preconditions

- A plain `GET` to the status service host, under `/statushcxservice`.
- No encryption, no `x-hcx-*` headers and no request body.

### Postconditions

The service returns `200` with the UI's security settings. No token is issued and no callback follows.

### Common mistakes

- Calling the gateway address instead of the status service host.
- Treating this document as the contract for gateway traffic.
- Sending a `POST`, a request body or `x-hcx-*` headers.
- Mistaking it for a way to get a token.

### Best practices

- Use these endpoints for exploration and client generation in the sandbox, and cache the document rather than fetching it on every run.
- Diff the served document against the corpus (Status service: OpenAPI 3.0.1, version 1.0.0) when behaviour changes unexpectedly.
- Never let production traffic depend on the availability of the documentation endpoints.
- Keep the /v1/status protocol rules in mind when reading the spec: x-hcx-correlation_ID must carry the original request's correlation ID.

### Related scenario

A provider's engineer wants to try /v1/status from Swagger UI in the sandbox. The UI fetches /swagger-resources/configuration/security to decide how to show the authorisation dialog, and the engineer pastes a Bearer token obtained separately from the client-credentials call. Because the status request body must be a JWE built with the payer's certificate, the engineer ultimately uses the UI only to confirm the schema and runs the real status request from the integration code, which reuses the original preauth correlation ID.

### Specification

Chapter [Environments and addresses](/docs/nhcx/v1/reference/environments-and-addresses) of the NHCX integration specification.

```bash
curl --request GET \
  --url https://apisbx.abdm.gov.in/hcx/swagger-resources/configuration/security \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Responses

- `200`: The service returns HTTP 200 with a small JSON object describing how Swagger UI should handle security inputs.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "apiKeyVehicle": "header",
  "apiKeyName": "bearer_auth",
  "scopeSeparator": ","
}
```
