# Link ABHA number to policies (v2)

`POST /v2/participant/link/abha/policy`

v2 variant of the ABHA policy link; same ParticipantLinkAbhaRequest body and ParticipantLinkAbhaResponse as the unversioned call.

### Business purpose

This endpoint serves the same business need as /participant/link/abha/policy: it lets a payer (or the TPA processing on its behalf) record which products a beneficiary holds, keyed by ABHA number and member ID, so that providers can discover the policy and route claims correctly. The OpenAPI document exposes it as operation participantLinkAbhaPolicyV2 with an identical request and response schema to the v1 path; the documentation does not describe any behavioural difference beyond the path and operationId.

### When to use

Use it in the same cases as the v1 link call. Pick the v1 or v2 path and use it throughout your integration.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You are the payer or its TPA, using the credentials that participant was created with.

### Postconditions

The member's policies are linked at once and providers can find them. Only the de-link calls reverse it.

### Common mistakes

- Using a token from different credentials than the payer or TPA was created with.
- Mixing up `payerid` and `processingid`.
- Leaving out a required field.

### Best practices

- Generate a fresh UUID for requestid on every call and log it with the response so a duplicate submission can be traced.
- Keep the ABHA number in the form the member layer expects (the identifier table and get/policies documentation both specify ABHA without hyphens) and store it in that form.
- Make sure productid and productname exactly match the payer's product catalogue as registered through /product/link, because providers will later match on these values.
- Cache and proactively refresh the Bearer token; retry once on 401 with a new token, then stop and alert.
- After linking, verify the result with /participant/get/policies using the same identifier before telling the provider the member is ready.

### Related scenario

A TPA that processes claims for several insurers migrates its integration to the v2 participant APIs. When one of its insurers issues a new individual health policy, the TPA's system calls /v2/participant/link/abha/policy with the insurer's participant code as payerid and its own code as processingid, listing the product from the insurer's catalogue. The TPA then confirms the link with /v2/participant/get/policies using the member's ABHA number. When the beneficiary later visits a hospital, the provider resolves the processingid as the receiver code and submits the coverage-eligibility check and preauthorisation to the TPA.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/participant/link/abha/policy \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "requestid": "0b1d6c1e-6a5f-4d3c-8b9a-4f2e7c0d1a22",
  "abhanumber": "12345678910111",
  "mobilenumber": "9876543210",
  "memberid": "MEM-2026-000123",
  "payerid": "100234@sbx",
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
- `abhanumber` (string)
- `mobilenumber` (string)
- `memberid` (string)
- `payerid` (string)
- `policies` (object[])
- `policies.productid` (string)
- `policies.productname` (string)
- `processingid` (string)

## Responses

- `200`: A successful call returns HTTP 200 with ParticipantLinkAbhaResponse (optional result string and optional errormessage with errorcode and errordescription).
  - `result` (string)

Example 200 response. The values are placeholders:

```json
{
  "result": "success"
}
```
