# Get beneficiary policies (V2)

`POST /V2/participant/get/policies`

V2 variant of the beneficiary policy lookup; same FetchParticipantPoliciesRequest body and ParticipantListResponse as the unversioned call.

### Business purpose

This endpoint answers the same question as /participant/get/policies: which payer products is this beneficiary linked to, and therefore which payer or TPA should the hospital address. The OpenAPI document exposes it as getParticipantGetPoliciesV2 with an identical request and response schema and the same Registry APIs tag; the documentation records no behavioural difference beyond the path. Integrations that use the V2 link and de-link calls typically read back through this endpoint.

### When to use

Use it at the same point in the journey as the v1 lookup: after registration, before InsurancePlan retrieval, coverage eligibility and preauthorisation (workflow code 12), and whenever a cached policy needs to be re-validated with forceRefresh. Payers and TPAs use it to confirm a link or de-link they have just written. Pick one of the two get-policies paths and use it consistently.

### Preconditions

- A valid Bearer token from the client-credentials call (POST /get/session, form-urlencoded client_id, client_secret, grant_type=client_credentials); tokens last 1200 seconds, so refresh before expiry.
- HTTP headers Accept: application/json, Content-Type: application/json and bearer_auth: Bearer <token> (the participant service uses bearer_auth, not Authorization).
- Base path for the participant service: https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice (sandbox) or https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice (production).
- This is a synchronous plain-JSON registry call: no JWE envelope, no x-hcx-* protocol headers and no correlation id are involved.
- A payer or TPA must already have linked the beneficiary.
- Body: identifiertype (AbhaNumber, MemberId or MobileNo) and identifiervalue, both required; ABHA without hyphens.
- Note the capital V in /V2/.

### Postconditions

Returns HTTP 200 with ParticipantListResponse (optional participantdetails array of participantcode, participantname, address, state). No callback follows. The result is normalised and cached by the caller; the handbook documents that cache as permanent until forceRefresh: true is passed. The processingID from the response is the receiver code for NHCX routing, and payerId, memberId, productId, productName and policyNumber are resolved from the cached policies for the preauth. Errors return 400, 404 or 500 with the ErrorResponse envelope.

### Common mistakes

- Sending the ABHA number with hyphens; the identifier table specifies ABHA without hyphens for this lookup and a hyphenated value is a common cause of an empty result.
- Using the PayerID from the response as x-hcx-recipient_code; NHA's common mistake 7 says providers must use the processingID from the get/Policies response as the receiver code, otherwise NHCX-1003 (receiver not registered) or PAYR-1331 follows.
- Trying only one identifier type; the handbook prescribes a cascade of AbhaNumber, then MemberId, then MobileNo.
- Dereferencing fields blindly; every field of ParticipantDetails is optional and the response shape may arrive as participantdetails, participants or a raw array.
- Trusting a permanent policy cache after a payer-side change instead of passing forceRefresh: true.
- Lower-casing the path to /v2/participant/get/policies, which is not a documented route.

### Best practices

- Normalise the ABHA number (strip separators) before the call and try identifiers in the documented priority order: ABHA, then MemberId from the latest admission, then mobile number.
- Cache successful lookups keyed by patient, but expose a forceRefresh path and use it as the first diagnostic step when a preauth is rejected for a coverage mismatch.
- Store payerId, memberId, productId, productName and policyNumber from the result; these feed x-hcx-recipient_code, the Coverage and Patient identifiers and the InsurancePlan lookup.
- If the lookup yields nothing, fall back to a coverage-eligibility check with purpose discovery to obtain the active policy code.
- Keep the token fresh; retry once on 401.

### Related scenario

A TPA has just linked a new member through /V2/participant/link/abha/policy and wants to verify the write before closing the ticket. It calls /V2/participant/get/policies with identifiertype AbhaNumber and the member's hyphen-free ABHA number and sees the product returned. Months later the same member is admitted; the hospital's HMIS runs the identifier cascade (ABHA, then member id, then mobile) against this endpoint, caches the result, and proceeds to /v1/insuranceplan/request and /v1/preauth/submit addressed to the TPA's participant code taken from processingID.

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
