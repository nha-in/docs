# Get the openAPI 3 document (status service)

`GET /v3/api-docs`

Serves the status service's OpenAPI 3 document, optionally filtered by a group query parameter; a discovery endpoint, not a protocol API.

### Business purpose

Integrators need a machine-readable contract for the Status API in order to generate clients, validate their requests and confirm the server prefix. This endpoint serves that contract in OpenAPI 3 form for the status service (statushcxservice, OpenAPI 3.0.1, service version 1.0.0). It carries no claim-settlement data and involves no payer or provider business logic; its value is purely in making the /v1/status operation discoverable and verifiable during integration and troubleshooting.

### When to use

Use it when you set up an integration or generate a client, to read the status service's contract. It is not part of any claim flow.

### Preconditions

- A plain `GET` to the status service host, under `/statushcxservice`.
- No encryption, no `x-hcx-*` headers and no request body.

### Postconditions

The service returns `200` with its OpenAPI 3 document. Nothing changes and no callback follows.

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
