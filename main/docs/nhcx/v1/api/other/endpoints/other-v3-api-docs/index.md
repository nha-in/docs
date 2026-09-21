# Get the openAPI 3 document (status service)

`GET /v3/api-docs`

Serves the status service's OpenAPI 3 document, optionally filtered by a group query parameter; a discovery endpoint, not a protocol API.

### Business purpose

Integrators need a machine-readable contract for the Status API in order to generate clients, validate their requests and confirm the server prefix. This endpoint serves that contract in OpenAPI 3 form for the status service (statushcxservice, OpenAPI 3.0.1, service version 1.0.0). It carries no claim-settlement data and involves no payer or provider business logic; its value is purely in making the /v1/status operation discoverable and verifiable during integration and troubleshooting.

### When to use

Use it during integration setup, when generating or refreshing an API client, and when a status call is failing and you want to confirm the exact schema and server prefix the service advertises. The endpoint index lists it as endpoint 19 with an optional group query parameter. It is not part of any transaction workflow and is not referenced by the sandbox exit checklists.

### Preconditions

- A GET request to the status service host; the OpenAPI documents in this corpus were captured from https://hcxsbx.ABDM.gov.in//api-docs, and the status service declares the server prefix /statushcxservice.
- No JWE envelope, no x-hcx-* protocol headers and no correlation ID; the docs do not state that a Bearer token is required for these discovery endpoints.
- No request body.

### Postconditions

The service returns HTTP 200 with a JSON OpenAPI 3 document describing the status service: its info block, the /statushcxservice server entry and the /v1/status operation with its StatusSuccessResponse responses. Nothing changes on NHCX and no callback follows. The document is a description of the service as deployed and may differ from the handbook's gateway-side conventions, which the docs flag as an unresolved conflict.

### Common mistakes

- Pointing at the gateway base https://apisbx.ABDM.gov.in/pmjay/sbxhcx and expecting the per-service spec host; the docs advise swapping between the two URL shapes when a path 404s.
- Treating the served document as the integration contract for gateway traffic; the handbook's gateway base and header conventions take precedence where the two disagree.
- Sending a POST or a JSON body to a GET discovery endpoint.
- Wrapping the call in JWE or adding x-hcx-* headers, which only apply to protocol APIs such as /v1/status.

### Best practices

- Use these endpoints for exploration and client generation in the sandbox, and cache the document rather than fetching it on every run.
- Diff the served document against the corpus (Status service: OpenAPI 3.0.1, version 1.0.0) when behaviour changes unexpectedly.
- Never let production traffic depend on the availability of the documentation endpoints.
- Keep the /v1/status protocol rules in mind when reading the spec: x-hcx-correlation_ID must carry the original request's correlation ID.

### Related scenario

A hospital's integration team is building status polling for stalled preauthorisations. Before wiring /v1/status, an engineer fetches /v3/api-docs from the status service host, confirms the server prefix and the response schema, and generates a typed client. The team then implements the status request with the original correlation ID in x-hcx-correlation_ID, handles the synchronous request.queued and request.dispatched outcomes, and receives the payer's answer on the status callback.

### Specification

Chapter [Environments and addresses](/docs/nhcx/v1/reference/environments-and-addresses) of the NHCX integration specification.

```bash
curl --request GET \
  --url https://apisbx.abdm.gov.in/hcx/v3/api-docs \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Responses

- `200`: The service returns HTTP 200 with a JSON OpenAPI 3 document describing the status service: its info block, the /statushcxservice server entry and the /v1/status operation with its StatusSuccessResponse responses.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "Status service",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "/statushcxservice"
    }
  ],
  "paths": {
    "/v1/status": {
      "post": {
        "operationId": "status",
        "responses": {
          "202": {
            "description": "Accepted"
          }
        }
      }
    }
  }
}
```
