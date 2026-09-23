# Update ABHA number

`POST /update/abhanumber`

Replaces a placeholder (dummy) ABHA number with the beneficiary's real ABHA number in the ABHA_AUTH_TRANSACTION table.

### Business purpose

Beneficiaries are sometimes onboarded before their real ABHA is known, using a placeholder value. Because the member layer and the Patient resource both key on the ABHA number, a placeholder that is never corrected leaves the beneficiary undiscoverable and breaks the identifier rules for claim bundles. This endpoint, tagged Retrieving API and implemented by updateAbhaNumberController, lets the placeholder be swapped for the real number so that later policy lookups and claim transactions line up. The docs describe it as updating the ABHA number in the ABHA_AUTH_TRANSACTION table.

### When to use

Use it when a member's real ABHA number becomes available after they were set up with a placeholder. Do it before you rely on ABHA-based lookups.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You know both the placeholder and the real ABHA number.

### Postconditions

The member's ABHA number is updated. Errors come back in the same response shape as success, so read `errorMessage`.

### Common mistakes

- Reading errors as the usual registry error format.
- Sending an empty body.
- Forgetting to refresh cached policies that still use the placeholder.

### Best practices

- Record both the placeholder and the real ABHA with the timestamp of the change for audit purposes.
- Read successMessage and errorMessage on every response and treat a non-200 status as failure even if the body parses.
- Immediately re-run /participant/get/policies with forceRefresh: true for the affected beneficiary.
- Keep the ABHA formatting rule per field: hyphen-free for member lookups and x-hcx-ben-ABHA-ID, XX-XXXX-XXXX-XXXX where NHCX-1018 applies.
- Never log the token; log the ABHA change with the request identifier only.

### Related scenario

A state scheme enrols a beneficiary in a hurry with a dummy ABHA so that a policy can be linked and an emergency admission can proceed. After discharge the beneficiary completes ABHA creation and the real number is captured. The payer's system calls /update/abhanumber with dummyAbha and realAbha, receives a successMessage, and then calls /participant/get/policies with forceRefresh to make sure the real ABHA resolves the linked product. The hospital's billing team, preparing the final claim, refreshes its own policy cache so that the Claim bundle's Patient identifiers carry the PMJAY member ID and the real hyphen-free ABHA.

### Specification

Chapter [Participants and policies](/docs/nhcx/v1/registries) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/update/abhanumber \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "dummyAbha": "99999999999999",
  "realAbha": "12345678910111"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `dummyAbha` (string)
- `realAbha` (string)

## Responses

- `200`: A successful call returns HTTP 200 with UpdateAbhaResponse, which carries optional successMessage and errorMessage strings.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "successMessage": "ABHA number updated successfully"
}
```
