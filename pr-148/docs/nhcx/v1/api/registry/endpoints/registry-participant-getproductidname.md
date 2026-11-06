# Get product ID and name

`POST /participant/getProductIdName`

Retrieving API described as generating the product ID and product name; declared with a bare string request body and a participant-code response.

### Business purpose

The OpenAPI document describes this endpoint with the same sentence as /product/getowner, "This API is to generate the product ID and product Name", and it belongs to the payer product lifecycle alongside /product/link, /product/delink and /product/getowner. Its documented purpose is to resolve product identity information within the participant service. The specification is thin: the request body is declared as a bare string, the response is ParticipantCreateResponse (participant_code only), and the operationId participantCreatePost is reused from the participant-creation endpoints, so treat the operationId as non-unique.

### When to use

Use it only if your NHCX instance documents how. To find a product's payer, use `/product/getowner`. To find a member's products, use `/participant/get/policies`.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- The body is a plain string, not a JSON object. What it should hold is not documented.

### Postconditions

The documented response holds only a participant code. Check what your instance really returns before you depend on it.

### Common mistakes

- Sending a JSON object instead of a string.
- Expecting a product ID and name in the answer.
- Confusing it with `/product/getowner`.

### Best practices

- Confirm the request and response contract against your instance's live OpenAPI document before integrating.
- Prefer /product/getowner for owner resolution and /participant/get/policies for member products; use this call only where it is specifically required.
- Log both the raw request string and the full response body so the actual behaviour can be reconciled with the specification.
- Keep the Bearer token fresh and retry once on 401.

### Related scenario

A TPA's integration team is generating a client from the participant service OpenAPI document and notices that /participant/getProductIdName shares its operationId with participant creation and its description with /product/getowner. Rather than wire it into the admission flow, they exercise it once in the sandbox with a product key, record the participant_code returned, and decide to rely on /product/getowner and /participant/get/policies for production. The member journey therefore runs link, get policies, InsurancePlan request and preauthorisation without this call.

### Specification

Chapter [Participants and policies](/docs/nhcx/v1/registries) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/getProductIdName \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "_note": "The OpenAPI document declares the request body as a bare JSON string; shown here as the string value that would be posted.",
  "_body": "PRD-FLOATER-01"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Headers

- `Accept` (string, required): Always `application/json` on the participant service.

## Body

- `_note` (string)
- `_body` (string)

## Responses

- `200`: Returns HTTP 200 with ParticipantCreateResponse, whose only field, participant_code, is optional.
  - `participant_code` (string)
- `400`: Client error. The body is the participant service's ErrorResponse.
  - `timestamp` (string, required): When the response was sent, as a Unix timestamp in milliseconds.
  - `error` (object, required)
  - `error.code` (string): The error code, namespaced by the system that raised it.
  - `error.message` (string): A short description of the error.
  - `error.trace` (string): A longer description supporting the code.
- `404`: Resource not found. The body is the participant service's ErrorResponse.
  - `timestamp` (string, required): When the response was sent, as a Unix timestamp in milliseconds.
  - `error` (object, required)
  - `error.code` (string): The error code, namespaced by the system that raised it.
  - `error.message` (string): A short description of the error.
  - `error.trace` (string): A longer description supporting the code.
- `500`: Downstream systems down, or an unhandled exception. The body is the participant service's ErrorResponse.
  - `timestamp` (string, required): When the response was sent, as a Unix timestamp in milliseconds.
  - `error` (object, required)
  - `error.code` (string): The error code, namespaced by the system that raised it.
  - `error.message` (string): A short description of the error.
  - `error.trace` (string): A longer description supporting the code.

Example 200 response. The values are placeholders:

```json
{
  "participant_code": "100234@sbx"
}
```
