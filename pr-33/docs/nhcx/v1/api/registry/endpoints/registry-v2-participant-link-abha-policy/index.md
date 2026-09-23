# Link ABHA number to policies (V2)

`POST /V2/participant/link/abha/policy`

V2 variant of the ABHA policy link; same ParticipantLinkAbhaRequest body and ParticipantLinkAbhaResponse as the unversioned call.

### Business purpose

This endpoint serves the same business need as /participant/link/abha/policy: it lets a payer (or the TPA processing on its behalf) record which products a beneficiary holds, keyed by ABHA number and member ID, so that providers can discover the policy and route claims correctly. The OpenAPI document exposes it as operation participantLinkAbhaPolicyV2 with an identical request and response schema to the v1 path; the documentation does not describe any behavioural difference beyond the path and operationId.

### When to use

Use it in the same cases as the v1 link call. Pick the v1 or V2 path and use it throughout your integration.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You are the payer or its TPA, using the credentials that participant was created with.
- The path starts with a capital `V2`.

### Postconditions

The member's policies are linked at once and providers can find them. Only the de-link calls reverse it.

### Common mistakes

- Using a token from different credentials than the payer or TPA was created with.
- Mixing up `payerid` and `processingid`.
- Writing the path with a lower-case `v2`, which is a different route.
- Leaving out a required field.

### Best practices

- Generate a fresh UUID for requestid on every call and log it with the response so a duplicate submission can be traced.
- Keep the ABHA number in the form the member layer expects (the identifier table and get/policies documentation both specify ABHA without hyphens) and store it in that form.
- Make sure productid and productname exactly match the payer's product catalogue as registered through /product/link, because providers will later match on these values.
- Cache and proactively refresh the Bearer token; retry once on 401 with a new token, then stop and alert.
- After linking, verify the result with /participant/get/policies using the same identifier before telling the provider the member is ready.

### Related scenario

A TPA that processes claims for several insurers migrates its integration to the V2 participant APIs. When one of its insurers issues a new individual health policy, the TPA's system calls /V2/participant/link/abha/policy with the insurer's participant code as payerid and its own code as processingid, listing the product from the insurer's catalogue. The TPA then confirms the link with /V2/participant/get/policies using the member's ABHA number. When the beneficiary later visits a hospital, the provider resolves the processingid as the receiver code and submits the coverage-eligibility check and preauthorisation to the TPA.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/V2/participant/link/abha/policy \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
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

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

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

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "result": "success"
}
```
