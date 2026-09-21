# Get product ID and name

`POST /participant/getProductIdName`

Retrieving API described as generating the product ID and product name; declared with a bare string request body and a participant-code response.

### Business purpose

The OpenAPI document describes this endpoint with the same sentence as /product/getowner, "This API is to generate the product ID and product Name", and it belongs to the payer product lifecycle alongside /product/link, /product/delink and /product/getowner. Its documented purpose is to resolve product identity information within the participant service. The specification is thin: the request body is declared as a bare string, the response is ParticipantCreateResponse (participant_code only), and the operationId participantCreatePost is reused from the participant-creation endpoints, so treat the operationId as non-unique.

### When to use

Use it only where your NHCX instance documents a concrete contract for it, typically when you need product identity resolved from a string key held by the participant service. It plays no part in claim-side workflows and is not listed in either sandbox exit checklist. For resolving a product to its owning payer, /product/getowner has the clearer request schema; for discovering a member's products, use /participant/get/policies.

### Preconditions

- A valid Bearer token from the client-credentials call (POST /get/session, form-urlencoded client_ID, client_secret, grant_type=client_credentials); tokens last 1200 seconds, so refresh before expiry.
- HTTP headers Accept: application/json, Content-Type: application/json and bearer_auth: Bearer (the participant service uses bearer_auth, not Authorisation).
- Base path for the participant service: https://apisbx.ABDM.gov.in/pmjay/sbxhcx/participanthcxservice (sandbox) or https://apisprod.NHA.gov.in/pmjay/hcx/participanthcxservice (production).
- This is a synchronous plain-JSON registry call: no JWE envelope, no x-hcx-* protocol headers and no correlation ID are involved.
- The request body is declared in the OpenAPI document as a bare JSON string rather than an object; the docs do not say what the string should contain.
- The product concerned should have been registered by its payer through /product/link.

### Postconditions

Returns HTTP 200 with ParticipantCreateResponse, whose only field, participant_code, is optional. No callback follows and no state change is documented. Failures return 400, 404 or 500 with the ErrorResponse envelope. Because the description promises a product ID and name while the schema returns a participant code, verify the actual body returned by your instance before depending on either interpretation.

### Common mistakes

- Posting a JSON object when the schema declares a bare string body, or the reverse, and getting a 400.
- Expecting productid and productname fields in the response; the declared response carries only participant_code.
- Confusing it with /product/getowner because both carry the same description.
- Matching on operationId participantCreatePost in generated clients, which collides with the participant-creation operations.
- Omitting the Accept header or the Bearer prefix on bearer_auth.

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
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "_note": "The OpenAPI document declares the request body as a bare JSON string; shown here as the string value that would be posted.",
  "_body": "PRD-FLOATER-01"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `_note` (string)
- `_body` (string)

## Responses

- `200`: Returns HTTP 200 with ParticipantCreateResponse, whose only field, participant_code, is optional.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "participant_code": "100234@sbx"
}
```
