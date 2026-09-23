# Get beneficiary policies

`POST /participant/get/policies`

Looks up the policies linked to a beneficiary by ABHA number, member ID or mobile number, returning the payer and product details needed for claims.

### Business purpose

This is the provider's window into the member layer that payers populate through the link API. A hospital cannot submit a coverage-eligibility check, preauthorisation or claim until it knows the payer participant code, member ID and product for the patient, and this call is where those values come from. The handbook lists policy discovery as step three of the fixed cashless sequence (payer search, payer selection, policy discovery, cache normalisation, effective payer resolution, InsurancePlan retrieval, optional eligibility, preauth). Payers and TPAs also use it to verify that their links were recorded.

### When to use

Call it after registering or admitting a patient, to find their policy and payer. It comes before eligibility and pre-authorisation.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- The payer or TPA has already linked the member.
- You search by ABHA number, member ID or mobile number. Send the ABHA number without hyphens.

### Postconditions

You get the member's linked policies. Cache them, and force a refresh when something changes on the payer side.

### Common mistakes

- Using the payer ID as `x-hcx-recipient_code`. Use the processing ID from this response.
- Sending the ABHA number with hyphens.
- Trying only one identifier. Try ABHA number, then member ID, then mobile number.
- Trusting an old cached result after the payer changed something.

### Best practices

- Normalise the ABHA number (strip separators) before the call and try identifiers in the documented priority order: ABHA, then MemberId from the latest admission, then mobile number.
- Cache successful lookups keyed by patient, but expose a forceRefresh path and use it as the first diagnostic step when a preauth is rejected for a coverage mismatch.
- Store payerId, memberId, productId, productName and policyNumber from the result; these feed x-hcx-recipient_code, the Coverage and Patient identifiers and the InsurancePlan lookup.
- If the lookup yields nothing, fall back to a coverage-eligibility check with purpose discovery to obtain the active policy code.
- Keep the token fresh; retry once on 401.

### Related scenario

A patient is admitted to a network hospital and the registration desk captures an ABHA number and a member ID. The HMIS has already called /fetch/participants/list to discover payers, and now calls /participant/get/policies with identifiertype AbhaNumber and the hyphen-free ABHA value. The response is normalised and cached against the patient, and the processingID becomes the receiver code. The desk then requests the plan through /v1/insuranceplan/request, optionally runs /v1/coverageeligibility/check, and submits the preauthorisation with /v1/preauth/submit; when the payer later queries a coverage detail, the desk forces a refresh of this lookup before responding.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/get/policies \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "identifiertype": "AbhaNumber",
  "identifiervalue": "12345678910111"
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

- `200`: The service answers synchronously with HTTP 200 and ParticipantListResponse: an optional participantdetails array whose entries carry optional participantcode, participantname, address and state.

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
