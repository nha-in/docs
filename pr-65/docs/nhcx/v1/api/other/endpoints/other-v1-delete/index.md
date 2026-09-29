# Support: delete records by correlation ID

`POST /v1/delete`

Internal troubleshooting operation on the claim service that deletes records by correlationid and action; not part of the business transaction flows.

### Business purpose

`/v1/delete` is a troubleshooting operation on the claim service. It deletes the record identified by a correlation ID and an action, to clear a stuck or erroneous record during integration testing and support. It does not move a claim through its lifecycle.

### When to use

Only for troubleshooting, and only when NHCX support asks you to. It is not part of any claim flow.

### Preconditions

- You have a valid access token.
- You know the correlation ID and the action of the record to remove.
- NHCX support agrees that deleting it is the right fix.

### Postconditions

The record is removed. To carry on, start a new request with a new correlation ID.

### Common mistakes

- Using it to cancel a pre-authorisation. Cancel with a `Task` on `/v1/task/submit`, workflow `PC01`.
- Reusing the old correlation ID after a delete.
- Calling it in production without NHCX support.

### Best practices

- Reserve this call for sandbox troubleshooting and only on NHCX support's instruction.
- Record the correlation ID, action and reason for every deletion in your own audit log, since the docs describe no NHCX-side confirmation beyond the HTTP status.
- Prefer /v1/status to inspect a stuck correlation ID before deleting anything.
- Mint a new correlation UUID for any re-submission after a deletion.

### Related scenario

During sandbox testing a hospital's integrator submits a claim whose callback keeps failing because their endpoint returned 200 instead of 202. NHCX support asks them to fix the acknowledgement and then clears the stuck record by correlation ID and action using /v1/delete so the test case can be rerun cleanly. The integrator resubmits the claim to /v1/claim/submit under a new correlation UUID, receives a 202, and this time the on_submit callback is acknowledged correctly.

### Specification

No chapter of the current documentation covers this operation. It appears only in the claim service's OpenAPI.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/delete \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "correlationid": "5d4c3b2a-1f0e-4d9c-8b7a-6f5e4d3c2b1a",
  "action": "/v1/claim/submit"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Body

- `correlationid` (string)
- `action` (string)

## Responses

- `200`: The endpoint sits in the claim service, whose domain operations all return 202 Accepted, 400 Request Validation failed, 404 Requested resource was not found and 500 Downstream systems down, each carrying StatusSuccessResponse.
  - `httpStatus` (integer)
  - `schema` (string)
  - `note` (string)

Example 200 response. The values are placeholders:

```json
{
  "httpStatus": 202,
  "schema": "StatusSuccessResponse",
  "note": "The claim service spec lists 202, 400, 404 and 500, all carrying StatusSuccessResponse; no worked response body is published for /v1/delete."
}
```
