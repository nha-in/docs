# Submit the de-link payer product

`POST /product/delink`

Removes a product (product ID and name) from a payer's participant code in the registry.

### Business purpose

When a payer withdraws a product from the market or replaces it, the registry entry created by /product/link should be removed so that it is no longer resolvable and cannot be referenced by new member links. The OpenAPI document describes this Retrieving API call as the API to de-link products by the payers or insurance companies. Keeping the catalogue accurate protects providers from matching on retired products when they resolve coverage for InsurancePlan and preauthorisation.

### When to use

Use it when a product is discontinued or renamed (the docs give no rename operation, so de-link and re-link), after the member links that reference it have been handled through /participant/delink/abha/policy. It is a payer-side catalogue maintenance step and is not tied to any claim workflow code. The documentation does not state whether de-linking a product that still has member links is refused, so remove member links first.

### Preconditions

- A valid Bearer token from the client-credentials call (POST /get/session, form-urlencoded client_ID, client_secret, grant_type=client_credentials); tokens last 1200 seconds, so refresh before expiry.
- HTTP headers Accept: application/json, Content-Type: application/json and bearer_auth: Bearer <token> (the participant service uses bearer_auth, not Authorisation).
- Base path for the participant service: https://apisbx.ABDM.gov.in/pmjay/sbxhcx/participanthcxservice (sandbox) or https://apisprod.NHA.gov.in/pmjay/hcx/participanthcxservice (production).
- This is a synchronous plain-JSON registry call: no JWE envelope, no x-hcx-* protocol headers and no correlation ID are involved.
- The payer or insurance company must already be a registered participant with its own participant code.
- Body is ProductLinkRequest with all three fields required: productid, productname and participantcode.

### Postconditions

On success the endpoint returns HTTP 200 with ParticipantCreateResponse containing the optional participant_code. No callback follows. The product should no longer resolve to the payer through /product/getowner. Failures return 400, 404 or 500 with the ErrorResponse envelope. Provider-side policy caches are documented as permanent, so a product that hospitals have already cached will still appear there until they pass forceRefresh: true.

### Common mistakes

- Sending only productid; ProductLinkRequest requires productid, productname and participantcode for de-link as well.
- De-linking a product while members are still linked to it, then finding those member links inconsistent; de-link members first.
- Using a participantcode from the wrong environment or with wrong casing.
- Assuming providers see the change immediately; their cached policies persist without TTL.
- Missing the Accept header or sending the token without the Bearer prefix.

### Best practices

- Enumerate and de-link affected member policies before removing the product.
- Use the exact productid and productname that were registered with /product/link.
- Verify afterwards with /product/getowner that the product no longer resolves to your participant code.
- Log the request and the returned participant_code for audit.
- Refresh the Bearer token proactively and retry once on 401.

### Related scenario

An insurer retires its old Individual Health Silver product at the end of a policy year, having migrated every member to a successor product. Its system first runs /participant/delink/abha/policy for each member still linked to the old product, then calls /product/delink with the product ID, product name and the insurer's participant code. A confirmation call to /product/getowner shows the product no longer resolves. The insurer notifies its network hospitals, whose desks force a refresh of cached policies so that the next coverage-eligibility check and preauthorisation reference the successor product.

### Specification

Chapter [Participants and policies](/docs/nhcx/v1/registries) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/product/delink \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "productid": "PRD-INDIV-07",
  "productname": "Individual Health Silver",
  "participantcode": "100234@sbx"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `productid` (string)
- `productname` (string)
- `participantcode` (string)

## Responses

- `200`: On success the endpoint returns HTTP 200 with ParticipantCreateResponse containing the optional participant_code.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "participant_code": "100234@sbx"
}
```
