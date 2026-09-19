# Get product owner

`POST /product/getowner`

Resolves a product ID to the participant code of the payer that owns it.

### Business purpose

Given only a product identifier, an integrator often needs to know which payer stands behind it. This Retrieving API call takes a ProductOwnerRequest with productid and returns ParticipantCreateResponse, whose participant_code is the owning participant's identifier on the HCX instance. That makes it a useful bridge between a product seen on a policy document or in a policy lookup and the participant code that must go into routing. Note that the OpenAPI description reads "This API is to generate the product ID and product Name", which does not match the response schema; the source does not resolve this conflict.

### When to use

Use it when you hold a product ID but not the payer participant code, for example while normalising a policy lookup or verifying a newly linked product. It is a synchronous helper in the member layer, used before InsurancePlan retrieval, coverage eligibility or preauthorisation rather than during them. Payers use it after /product/link or /product/delink to confirm the registry state.

### Preconditions

- A valid Bearer token from the client-credentials call (POST /get/session, form-urlencoded client_ID, client_secret, grant_type=client_credentials); tokens last 1200 seconds, so refresh before expiry.
- HTTP headers Accept: application/json, Content-Type: application/json and bearer_auth: Bearer <token> (the participant service uses bearer_auth, not Authorisation).
- Base path for the participant service: https://apisbx.ABDM.gov.in/pmjay/sbxhcx/participanthcxservice (sandbox) or https://apisprod.NHA.gov.in/pmjay/hcx/participanthcxservice (production).
- This is a synchronous plain-JSON registry call: no JWE envelope, no x-hcx-* protocol headers and no correlation ID are involved.
- Body is ProductOwnerRequest with a single optional string, productid; supply it, since the lookup has no other input.
- The product must have been registered by its payer through /product/link.

### Postconditions

Returns HTTP 200 with ParticipantCreateResponse containing the optional participant_code of the owning participant. No callback follows and no state changes. Failures return 400, 404 or 500 with the ErrorResponse envelope. The returned code identifies the payer (the payerid used in policy links); remember that for NHCX routing the receiver code should come from the processingID given by the get-policies response, which may be a TPA rather than this owner.

### Common mistakes

- Using the returned participant_code directly as x-hcx-recipient_code when the payer is processed by a TPA; NHA's common mistake 7 says the receiver code is the processingID from get/Policies.
- Expecting product name or other product details in the response; only participant_code is returned.
- Sending an empty body; productid is optional in the schema but the lookup needs it.
- Confusing this endpoint with /participant/getProductIdName, which carries the same description but a different request shape.
- Omitting the Accept header or the Bearer prefix.

### Best practices

- Treat the result as the product owner (payerid), then resolve the effective receiver through the policy lookup.
- Cache owner lookups by productid; ownership changes rarely and only through /product/link and /product/delink.
- Handle a missing participant_code gracefully; every field in the response is optional.
- Refresh the Bearer token proactively and retry once on 401.

### Related scenario

A hospital receives a scanned policy card that shows only a product ID, and the patient's ABHA-based policy lookup returned more than one payer. The HMIS calls /product/getowner with the product ID and gets back the participant code of the insurer that owns it, which lets the desk pick the right entry from the /participant/get/policies result. With the matched policy in hand the system reads the processingID as the receiver code, requests the plan through /v1/insuranceplan/request and goes on to submit the preauthorisation.

### Specification

Chapter [Participants and policies](/docs/nhcx/v1/registries) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/product/getowner \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "productid": "PRD-FLOATER-01"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `productid` (string)

## Responses

- `200`: Returns HTTP 200 with ParticipantCreateResponse containing the optional participant_code of the owning participant.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "participant_code": "100234@sbx"
}
```
