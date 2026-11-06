# Submit the de-link payer product

`POST /product/delink`

Removes a product (product ID and name) from a payer's participant code in the registry.

### Business purpose

When a payer withdraws a product from the market or replaces it, the registry entry created by /product/link should be removed so that it is no longer resolvable and cannot be referenced by new member links. The OpenAPI document describes this Retrieving API call as the API to de-link products by the payers or insurance companies. Keeping the catalogue accurate protects providers from matching on retired products when they resolve coverage for InsurancePlan and preauthorisation.

### When to use

Use it when a product is withdrawn. Remove the member links to it first.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- Member links to the product are already removed.
- You send `productid`, `productname` and `participantcode`.

### Postconditions

The product no longer belongs to the payer in the registry. Providers that cached it keep seeing it until they force a refresh.

### Common mistakes

- Sending only `productid`. All three fields are required.
- Removing a product while members are still linked to it.
- Expecting providers to see the change at once.

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
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "productid": "PRD-INDIV-07",
  "productname": "Individual Health Silver",
  "participantcode": "100234@sbx"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Headers

- `Accept` (string, required): Always `application/json` on the participant service.

## Body

- `productid` (string)
- `productname` (string)
- `participantcode` (string)

## Responses

- `200`: On success the endpoint returns HTTP 200 with ParticipantCreateResponse containing the optional participant_code.
  - `participant_code` (string)

Example 200 response. The values are placeholders:

```json
{
  "participant_code": "100234@sbx"
}
```
