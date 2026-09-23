# Get the swagger 2 document (status service)

`GET /v2/api-docs`

Serves the status service's Swagger 2 document, optionally filtered by a group query parameter; a discovery endpoint, not a protocol API.

### Business purpose

Some tooling still consumes Swagger 2 rather than OpenAPI 3. This endpoint serves the status service's contract in that older format so that such tools can generate clients and validate requests against /v1/status. It exists alongside /v3/api-docs and describes the same service; it carries no claim-settlement data and involves no business logic. Its value is limited to integration setup and troubleshooting.

### When to use

Use it when your tools need the older Swagger 2 format. It describes the same service as `/v3/api-docs`.

### Preconditions

- A plain `GET` to the status service host, under `/statushcxservice`.
- No encryption, no `x-hcx-*` headers and no request body.

### Postconditions

The service returns `200` with its Swagger 2 document. Nothing changes and no callback follows.

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

A TPA's legacy integration platform only imports Swagger 2 definitions. During onboarding to the status flow the team fetches /v2/api-docs from the status service, imports it, and confirms that the /v1/status operation and its StatusSuccessResponse are represented. They then implement the JWE-wrapped status request for preauthorisations that have not received an on_submit callback, and respond to providers' status requests on the status callback.

### Specification

Chapter [Environments and addresses](/docs/nhcx/v1/reference/environments-and-addresses) of the NHCX integration specification.

```bash
curl --request GET \
  --url https://apisbx.abdm.gov.in/hcx/v2/api-docs \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Responses

- `200`: The service returns HTTP 200 with a JSON Swagger 2 document (swagger: 2.0) describing the status service, its base path and the /v1/status operation.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "swagger": "2.0",
  "info": {
    "title": "Status service",
    "version": "1.0.0"
  },
  "basePath": "/statushcxservice",
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
