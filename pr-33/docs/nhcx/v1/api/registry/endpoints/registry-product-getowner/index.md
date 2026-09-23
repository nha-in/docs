# Get product owner

`POST /product/getowner`

Resolves a product ID to the participant code of the payer that owns it.

### Business purpose

Given only a product identifier, an integrator often needs to know which payer stands behind it. This Retrieving API call takes a ProductOwnerRequest with productid and returns ParticipantCreateResponse, whose participant_code is the owning participant's identifier on the HCX instance. That makes it a useful bridge between a product seen on a policy document or in a policy lookup and the participant code that must go into routing. Note that the OpenAPI description reads "This API is to generate the product ID and product Name", which does not match the response schema; the source does not resolve this conflict.

### When to use

Use it when you have a product ID and need the payer that owns it.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You send the `productid`.
- The payer has registered the product.

### Postconditions

You get the owning payer's participant code. Nothing changes.

### Common mistakes

- Using this code as `x-hcx-recipient_code` when a TPA processes the payer's claims. Use the processing ID from get-policies.
- Expecting product details in the answer.
- Sending an empty body.

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
