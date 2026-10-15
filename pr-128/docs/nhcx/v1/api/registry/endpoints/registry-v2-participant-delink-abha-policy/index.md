# Submit the de-link ABHA policies (v2)

`POST /v2/participant/delink/abha/policy`

v2 variant of the ABHA policy de-link; same ParticipantDeLinkAbhaRequest body and response as the unversioned call.

### Business purpose

This endpoint performs the same member-layer removal as /participant/delink/abha/policy: it takes products out of a member's link for a given payer so that providers stop discovering lapsed or migrated coverage. The OpenAPI document exposes it as participantDeLinkAbhaPolicyV2 with an identical request and response schema; the documentation does not describe any behavioural difference beyond the path and operationId. It is the natural partner of /v2/participant/link/abha/policy for integrations that have standardised on the v2 paths.

### When to use

Use it in the same cases as the v1 de-link. Pair it with the v2 link and get-policies calls.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You are the payer or TPA that linked the policies.

### Postconditions

The policies are no longer returned for that member. Providers that cached them keep seeing them until they force a refresh.

### Common mistakes

- Calling as a participant that did not create the link.
- Listing a policy that is not linked.
- Adding an ABHA number to the body.

### Best practices

- De-link only the specific products that need removing; the policies array is the unit of work.
- When moving an insurer to a new TPA, follow the documented order: de-link the existing policies, then link them again with the new TPA's participant code as processingid.
- Generate a fresh UUID for requestid on every call and log it with the response.
- Confirm the result with /participant/get/policies afterwards, and remember that providers may need a forced refresh of their own policy cache.
- Refresh the Bearer token proactively and retry once on 401 before escalating.

### Related scenario

A TPA is informed by one of its insurers that a corporate group policy has been cancelled mid-term. The TPA's system lists the affected members from its own records, calls /v2/participant/get/policies to confirm what NHCX currently holds, and then calls /v2/participant/delink/abha/policy per member with the insurer's participant code as payerid, its own code as processingid and the cancelled product. Each success is logged against the member. When a former member later presents at a hospital, the provider's policy lookup (after a forced cache refresh) no longer shows the product, and the desk proceeds as a self-pay case rather than submitting a coverage-eligibility check.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/participant/delink/abha/policy \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "requestid": "c4d2e1f0-8b7a-4c6d-9e5f-1a2b3c4d5e66",
  "payerid": "100234@sbx",
  "memberid": "MEM-2026-000123",
  "policies": [
    {
      "productid": "PRD-INDIV-07",
      "productname": "Individual Health Silver"
    }
  ],
  "processingid": "100235@sbx"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Headers

- `Accept` (string, required): Always `application/json` on the participant service.

## Body

- `requestid` (string)
- `payerid` (string)
- `memberid` (string)
- `policies` (object[])
- `policies.productid` (string)
- `policies.productname` (string)
- `processingid` (string)

## Responses

- `200`: On success the service returns HTTP 200 with ParticipantDeLinkAbhaResponse and the products are no longer visible through the get-policies endpoints for that payer and member.
  - `result` (string)

Example 200 response. The values are placeholders:

```json
{
  "result": "success"
}
```
