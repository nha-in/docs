# Submit the de-link ABHA policies

`POST /participant/delink/abha/policy`

Removes specific products from a member's policy link for a payer, keyed on payerid, memberid and the products listed.

### Business purpose

Policies lapse, members leave a product, and insurance companies move between TPAs. This call is the only documented way to reverse a link written through /participant/link/abha/policy, which keeps the registry honest so that providers do not route claims against coverage that no longer exists. Because there is no in-place re-parenting operation, de-link followed by a fresh link is also the documented procedure when a payer changes its processing TPA. The insurer and TPA control their own data; providers get accurate policy lookups.

### When to use

Use it when a member's policy should no longer be found: the policy ends, the member leaves, or the insurer changes TPA. To correct an ABHA number, use `/update/abhanumber` instead.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You are the payer or TPA that linked the policies.
- The body names the payer, the member and the policies to remove.

### Postconditions

The policies are no longer returned for that member. Providers that cached them keep seeing them until they force a refresh.

### Common mistakes

- Calling as a participant that did not create the link.
- Listing a policy that is not linked.
- Adding an ABHA number to the body. De-link does not use it.
- Expecting provider caches to update by themselves.

### Best practices

- De-link only the specific products that need removing; the policies array is the unit of work.
- When moving an insurer to a new TPA, follow the documented order: de-link the existing policies, then link them again with the new TPA's participant code as processingid.
- Generate a fresh UUID for requestid on every call and log it with the response.
- Confirm the result with /participant/get/policies afterwards, and remember that providers may need a forced refresh of their own policy cache.
- Refresh the Bearer token proactively and retry once on 401 before escalating.

### Related scenario

An insurance company ends its contract with one TPA and appoints another. Its integration first calls /participant/get/policies to enumerate the products linked for each affected member, then calls /participant/delink/abha/policy for each member with the insurer's participant code as payerid, the member ID and the products to remove. Once every de-link returns success, it calls /participant/link/abha/policy again with the new TPA's participant code as processingid. Hospitals that have cached these members' policies are told to refresh, so that their next coverage-eligibility check is addressed to the new TPA.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/delink/abha/policy \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "requestid": "9a7c5e3d-1b2f-4c8a-b6d4-0e9f8a7b6c55",
  "payerid": "100234@sbx",
  "memberid": "MEM-2026-000123",
  "policies": [
    {
      "productid": "PRD-FLOATER-01",
      "productname": "Family Floater Gold"
    }
  ],
  "processingid": "100235@sbx"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `requestid` (string)
- `payerid` (string)
- `memberid` (string)
- `policies` (object[])
- `policies.productid` (string)
- `policies.productname` (string)
- `processingid` (string)

## Responses

- `200`: A successful call returns HTTP 200 with ParticipantDeLinkAbhaResponse and the listed products are no longer returned by /participant/get/policies for that payer and member.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "result": "success"
}
```
