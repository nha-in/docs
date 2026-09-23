# Get beneficiary policies (V2)

`POST /V2/participant/get/policies`

V2 variant of the beneficiary policy lookup; same FetchParticipantPoliciesRequest body and ParticipantListResponse as the unversioned call.

### Business purpose

This endpoint answers the same question as /participant/get/policies: which payer products is this beneficiary linked to, and therefore which payer or TPA should the hospital address. The OpenAPI document exposes it as getParticipantGetPoliciesV2 with an identical request and response schema and the same Registry APIs tag; the documentation records no behavioural difference beyond the path. Integrations that use the V2 link and de-link calls typically read back through this endpoint.

### When to use

Use it at the same point as the v1 lookup, before eligibility and pre-authorisation. Payers also use it to check a link they just made.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- The payer or TPA has already linked the member.
- Send the ABHA number without hyphens. The path starts with a capital `V2`.

### Postconditions

You get the member's linked policies. Cache them, and force a refresh when something changes on the payer side.

### Common mistakes

- Using the payer ID as `x-hcx-recipient_code`. Use the processing ID from this response.
- Sending the ABHA number with hyphens.
- Trying only one identifier type.
- Writing the path with a lower-case `v2`.

### Best practices

- Normalise the ABHA number (strip separators) before the call and try identifiers in the documented priority order: ABHA, then MemberId from the latest admission, then mobile number.
- Cache successful lookups keyed by patient, but expose a forceRefresh path and use it as the first diagnostic step when a preauth is rejected for a coverage mismatch.
- Store payerId, memberId, productId, productName and policyNumber from the result; these feed x-hcx-recipient_code, the Coverage and Patient identifiers and the InsurancePlan lookup.
- If the lookup yields nothing, fall back to a coverage-eligibility check with purpose discovery to obtain the active policy code.
- Keep the token fresh; retry once on 401.

### Related scenario

A TPA has just linked a new member through /V2/participant/link/abha/policy and wants to verify the write before closing the ticket. It calls /V2/participant/get/policies with identifiertype AbhaNumber and the member's hyphen-free ABHA number and sees the product returned. Months later the same member is admitted; the hospital's HMIS runs the identifier cascade (ABHA, then member ID, then mobile) against this endpoint, caches the result, and proceeds to /v1/insuranceplan/request and /v1/preauth/submit addressed to the TPA's participant code taken from processingID.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/V2/participant/get/policies \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "identifiertype": "MemberId",
  "identifiervalue": "MEM-2026-000123"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `identifiertype` (string)
- `identifiervalue` (string)

## Responses

- `200`: Returns HTTP 200 with ParticipantListResponse (optional participantdetails array of participantcode, participantname, address, state).

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "participantdetails": [
    {
      "participantcode": "100234@sbx",
      "participantname": "Demo Health Insurance Co",
      "address": "Plot 12, Sector 5, Gurugram",
      "state": "Haryana"
    }
  ]
}
```
