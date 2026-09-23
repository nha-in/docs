# Get the swagger UI configuration

`GET /swagger-resources/configuration/ui`

Returns the Swagger UI display configuration for the status service; consumed by Swagger UI, not by integrations.

### Business purpose

Swagger UI reads this endpoint to learn how the service wants its documentation rendered (for example, expansion and deep-linking settings). It supports the interactive exploration of the status service's /v1/status operation and has no role in claim settlement, routing or security. The endpoint index describes it as the Swagger UI configuration.

### When to use

Use it only in a Swagger UI session against the status service. Integrations never call it.

### Preconditions

- A plain `GET` to the status service host, under `/statushcxservice`.
- No encryption, no `x-hcx-*` headers and no request body.

### Postconditions

The service returns `200` with a small set of UI settings. Nothing changes and no callback follows.

### Common mistakes

- Calling the gateway address instead of the status service host.
- Treating this document as the contract for gateway traffic.
- Sending a `POST`, a request body or `x-hcx-*` headers.

### Best practices

- Use these endpoints for exploration and client generation in the sandbox, and cache the document rather than fetching it on every run.
- Diff the served document against the corpus (Status service: OpenAPI 3.0.1, version 1.0.0) when behaviour changes unexpectedly.
- Never let production traffic depend on the availability of the documentation endpoints.
- Keep the /v1/status protocol rules in mind when reading the spec: x-hcx-correlation_ID must carry the original request's correlation ID.

### Related scenario

While preparing sandbox exit evidence, a payer's engineer captures screenshots of the status service's Swagger UI. The browser loads /swagger-resources/configuration/ui to decide how to render the page, then the resources list and the OpenAPI document. The engineer uses the rendered /v1/status operation to explain to the certification reviewer how the payer responds on the status callback when a provider asks about a dispatched preauthorisation.

### Specification

Chapter [Environments and addresses](/docs/nhcx/v1/reference/environments-and-addresses) of the NHCX integration specification.

```bash
curl --request GET \
  --url https://apisbx.abdm.gov.in/hcx/swagger-resources/configuration/ui \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Responses

- `200`: The service returns HTTP 200 with a small JSON object of UI settings.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "deepLinking": true,
  "docExpansion": "none",
  "displayRequestDuration": false
}
```
