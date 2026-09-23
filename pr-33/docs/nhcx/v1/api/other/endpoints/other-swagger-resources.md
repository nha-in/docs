# Get the swagger resources list

`GET /swagger-resources`

Lists the Swagger resources (API document locations) exposed by the status service; used by Swagger UI, not by integrations.

### Business purpose

Swagger UI discovers which API documents a service offers by reading this list. On the status service it points the UI at the /v2/api-docs and /v3/api-docs documents so that an engineer can browse the /v1/status operation interactively. It carries no claim-settlement data and involves no business logic; the endpoint index describes it simply as the list of Swagger resources.

### When to use

Use it only with Swagger UI, or when a tool needs to find the service's API documents. Integrations never call it.

### Preconditions

- A plain `GET` to the status service host, under `/statushcxservice`.
- No encryption, no `x-hcx-*` headers and no request body.

### Postconditions

The service returns `200` with a list of where its API documents live. Nothing changes and no callback follows.

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

An integration engineer opens Swagger UI against the status service in the sandbox to reproduce a colleague's failing status call. The UI first requests /swagger-resources to learn where the API documents live, then loads /v3/api-docs. The engineer inspects the /v1/status operation, notices the colleague had minted a fresh correlation ID instead of reusing the original preauth correlation ID, and fixes the client before retrying the status request.

### Specification

Chapter [Environments and addresses](/docs/nhcx/v1/reference/environments-and-addresses) of the NHCX integration specification.

```bash
curl --request GET \
  --url https://apisbx.abdm.gov.in/hcx/swagger-resources \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Responses

- `200`: The service returns HTTP 200 with a JSON list of resource descriptors that locate the service's API documents.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "_note": "The service returns a JSON array of resource descriptors; wrapped here for display.",
  "resources": [
    {
      "name": "default",
      "url": "/v3/api-docs",
      "swaggerVersion": "3.0"
    }
  ]
}
```
