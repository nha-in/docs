# Initiate ABHA policy link (v2)

`POST /v2/participant/link/abha/policy/init`

First half of the two-step v2 link: submits the ABHA policy link request, to be confirmed with a passcode via the validate endpoint.

### Business purpose

The init variant exists so that a policy link can be confirmed out of band before it takes effect. It takes the same ParticipantLinkAbhaRequest as the direct link calls but pairs with GET /v2/participant/link/abha/policy/validate, which accepts a passcode and transactionId. This mirrors the passcode-confirmed pattern already used for participant creation (/validate) and update (/update/validate), giving payers and TPAs an approval gate on member-layer writes. The documentation describes the pairing but does not detail how the passcode is delivered for this endpoint.

### When to use

Use it when your NHCX instance needs linking confirmed with a passcode. Start the link here, then finish it with the validate call.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You are the payer or its TPA, using the credentials that participant was created with.
- The body carries the member, the payer and the policies to link.

### Postconditions

The link is started but not confirmed. Do not rely on it until the validate call succeeds.

### Common mistakes

- Stopping here and never calling the validate step.
- Using a token from different credentials than the payer or TPA was created with.
- Mixing up `payerid` and `processingid`.

### Best practices

- Persist the requestid you sent and the transaction identifier you receive together, so the validate step can be completed by a different process or after a restart.
- Complete the validate step promptly; the sibling participant create and update passcodes expire after 24 hours, so do not assume a longer window here.
- Use the same product identifiers as registered through /product/link.
- Confirm the outcome with /participant/get/policies before informing the provider or beneficiary.
- Refresh the Bearer token proactively and retry once on 401.

### Related scenario

An insurer's policy administration team is required by its NHCX instance to confirm member links by passcode. When a new policy is issued, the system posts the ParticipantLinkAbhaRequest to /v2/participant/link/abha/policy/init and records the transaction identifier. The authorised operator receives the passcode and the system calls GET /v2/participant/link/abha/policy/validate with passcode and transactionId to complete the link. The team then checks /v2/participant/get/policies for the member's ABHA number and, satisfied, closes the case; the hospital will discover the policy on the beneficiary's next admission.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/participant/link/abha/policy/init \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "requestid": "3c9e8d2f-5b4a-4e1c-9f7d-8a6b5c4d3e21",
  "abhanumber": "12345678910111",
  "mobilenumber": "9876543210",
  "memberid": "MEM-2026-000123",
  "payerid": "100234@sbx",
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

- `200`: The service answers synchronously with HTTP 200 and ParticipantLinkAbhaResponse (optional result and errormessage).
  - `result` (string)

Example 200 response. The values are placeholders:

```json
{
  "result": "success"
}
```
