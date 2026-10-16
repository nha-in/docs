# Validate ABHA policy link (v2)

`GET /v2/participant/link/abha/policy/validate`

Second half of the two-step v2 link: confirms an initiated ABHA policy link with the passcode and transactionId query parameters.

### Business purpose

This GET endpoint closes the approval loop opened by /v2/participant/link/abha/policy/init. By requiring a passcode tied to a transactionId, it ensures that a member-layer write attributed to a payer or TPA was actually authorised by that organisation, in the same way that participant creation and update are confirmed through /validate and /update/validate. The value to the ecosystem is trust in the registry: providers rely on the policy lookup, so the links behind it should be deliberate and traceable.

### When to use

Call it after the init call, once you have the passcode. It confirms the link.

### Preconditions

- An init call has returned a transaction ID.
- You have the passcode for that transaction.
- You have a valid access token in the `bearer_auth` header.

### Postconditions

The link is confirmed and providers can find the member's policies. If the passcode or transaction is wrong, start again with init.

### Common mistakes

- Sending `passcode` and `transactionId` in a body. They go in the query string.
- Using a transaction ID from a different call.
- Waiting until the passcode expires.

### Best practices

- URL-encode both query parameters and log the transactionId with the outcome.
- Treat a 404 or an errormessage as a signal to restart from init rather than retrying the same passcode indefinitely.
- Verify the confirmed link with /participant/get/policies using the same ABHA number.
- Keep the init and validate calls under the same participant token so the identity check passes.

### Related scenario

A TPA's operations desk initiated a policy link for a new member earlier in the day through /v2/participant/link/abha/policy/init and stored the transaction identifier against the case. When the authorised approver supplies the passcode, the system calls GET /v2/participant/link/abha/policy/validate?passcode=...&transactionId=... and receives a 200 with a result string. The desk then runs /v2/participant/get/policies for the member's ABHA number, sees the product listed, and closes the linking task; the next call in the member's journey will be the hospital's coverage-eligibility check.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request GET \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/participant/link/abha/policy/validate \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Headers

- `Accept` (string, required): Always `application/json` on the participant service.

## Responses

- `200`: On success the endpoint returns HTTP 200 with ParticipantLinkAbhaResponse (optional result and errormessage).
  - `result` (string)

Example 200 response. The values are placeholders:

```json
{
  "result": "success"
}
```
