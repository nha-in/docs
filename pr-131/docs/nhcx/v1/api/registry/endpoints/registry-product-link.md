# Link payer product

`POST /product/link`

Registers a product (product ID and name) against a payer's participant code, so that it can be referenced in ABHA policy links.

### Business purpose

Products are the payer's catalogue entries that policies[].productid and productname refer to when a beneficiary is linked. This Retrieving API call, described in the OpenAPI document as the API to list products by the payers or insurance companies, is how an insurer places a product in the registry under its own participant code. Doing so makes the product ownership resolvable through /product/getowner and gives providers a stable productId and productName to match against when they resolve coverage for InsurancePlan and preauth.

### When to use

Use it when a payer launches a new product, before any member is linked to it.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- The payer is already registered.
- You send `productid`, `productname` and `participantcode`. All three are required.

### Postconditions

The product is registered to the payer, and policy links can now refer to it.

### Common mistakes

- Leaving out one of the three fields.
- Using a participant code from the wrong environment.
- Linking members to a product before registering it here.

### Best practices

- Keep productid values stable and unique within the payer; providers use productId for product-level matching and productName as the practical policy or coverage code for plan lookup.
- Register products before linking members, and verify with /product/getowner that the product resolves to your participant code.
- Log the participant_code returned with the product identifiers for reconciliation.
- Refresh the Bearer token proactively and retry once on 401.

### Related scenario

An insurer launches a new family floater plan. Before its policy administration system can link any member, it calls /product/link with the product ID, the product name that hospitals will see, and the insurer's participant code, receiving its participant_code back in the response. It then checks /product/getowner with the product ID to confirm ownership, and begins linking members with /participant/link/abha/policy. Hospitals that later call /participant/get/policies will see the product ID and name, use productName for the InsurancePlan lookup and productId for coverage matching in the preauth.

### Specification

Chapter [Participants and policies](/docs/nhcx/v1/registries) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/product/link \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "productid": "PRD-FLOATER-01",
  "productname": "Family Floater Gold",
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

- `200`: On success the endpoint returns HTTP 200 with ParticipantCreateResponse, whose single optional field participant_code is the machine-generated participant identifier on the HCX instance.
  - `participant_code` (string)

Example 200 response. The values are placeholders:

```json
{
  "participant_code": "100234@sbx"
}
```
