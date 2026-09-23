# Get linked registry master (internal)

`POST /get/linked/registry/mst`

Internal-use participant-service operation that fetches the linked registry master; listed in the OpenAPI but not intended for integrators.

### Business purpose

The participant registry can be extended from or linked to external registries such as the ABDM Health Facility Registry and the payer registry, and participant records carry linked_registry_codes in identifier@registry form with supported registry codes configured at instance level. This operation, described in the OpenAPI as for internal use and fetching the linked registry, appears to serve that master configuration to the platform itself. It is documented here for completeness of the 63-endpoint index, not as an integration point.

### When to use

Do not call it. It is for NHCX internal use. To see a participant's linked registries, read them from `/participant/search`.

### Preconditions

- It is internal. Integrators should not call it.

### Postconditions

It returns a string whose content is not documented. Nothing changes.

### Common mistakes

- Building your integration on an internal operation.
- Confusing it with the linked registry codes on a participant record.

### Best practices

- Leave it out of client libraries and Postman collections used for certification.
- Source registry codes from the onboarding documentation and participant records instead.
- If an onboarding contact directs you to it, record their exact instruction, since the specification documents neither a body nor the response content.

### Related scenario

While generating a client from the participanthcxservice OpenAPI document, a hospital integrator notices /get/linked/registry/mst next to /participant/search and asks whether to wire it into the payer picker. The answer from the documentation is no: it is an internal operation, and the picker should be built on /fetch/participants/list, with each selected payer confirmed through /participant/search and its linked_registry_codes read from that record. The generated method is left unused and excluded from the sandbox-exit test evidence.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/get/linked/registry/mst \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "_body": "No request body or parameters are documented in the OpenAPI entry for this internal operation."
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `_body` (string)

## Responses

- `200`: The OpenAPI declares a 200 response of type string, with 400 Client Error, 404 Resource not found and 500 Downstream systems down each returning the ErrorResponse envelope (timestamp plus error code, message and trace).

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "_contentType": "string",
  "_body": "<string as declared by the OpenAPI 200 response; content not documented>"
}
```
