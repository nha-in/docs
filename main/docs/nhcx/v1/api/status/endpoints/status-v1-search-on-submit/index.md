# Payer: send the search result

`POST /v1/search/on_submit`

Callback returning a search result for task type code=poll; for a claim-document search the payload is the ClaimResponse for the reference number.

### Business purpose

This is how a payer answers an authorised entity's search. It completes the oversight loop: the regulator or scheme authority asked for the claim documents for a case, and the payer returns the adjudication record through NHCX rather than by email or portal download. That keeps the answer encrypted, correlated to the original request and auditable. Providers benefit indirectly, because disputes and audits can be resolved from the record of what was actually submitted and decided rather than from reconstructed paperwork.

### When to use

The payer calls it to answer a `/v1/search/submit` request. For a claim document search, the payload is the `ClaimResponse` for the case.

### Preconditions

- You received and decrypted the search `Task`, and answered it with `202`.
- You have a valid access token and the requester's certificate.
- The header repeats the search's `x-hcx-correlation_ID`.

### Postconditions

NHCX answers `202` and passes the result to the requester. The claim itself does not change.

### Common mistakes

- Returning the result in the `202` instead of on this callback.
- Making a new correlation ID, so the requester cannot match the answer.
- Sending a `Task` or a bare bundle instead of the `ClaimResponse`.
- Missing the 30-second window on the incoming search, which causes redeliveries.

### Best practices

- Key the search on the sender's reference ID from Task.about and echo it in basedOn.
- Populate about with your own reference ID and the current status so the requester needs no further call.
- Return 202 to the inbound search first, resolve documents asynchronously, then post this callback.
- Be idempotent on correlation ID; the same search may be redelivered up to five times.
- Use a fresh API_call_ID, IST timestamp and a responder status from response.complete, response.partial or response.error.

### Related scenario

An insurer receives a search Task from the scheme authority for a claim its TPA rejected last quarter. The gateway-facing endpoint acknowledges with 202, and a worker retrieves the stored ClaimResponse for the reference number. The TPA posts /v1/search/on_submit with the ClaimResponse, basedOn set to the authority's reference ID and about set to the insurer's claim ID and current status, under the same correlation ID as the search. The authority's system acknowledges within 30 seconds and the reviewer compares the adjudication against the provider's original claim and any reprocess Task submitted on /v1/task/submit.

### Specification

Chapter [NHCX adapter (Optional)](/docs/nhcx/v1/getting-started/nhcx-adapter) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/search/on_submit \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "type": "JWEPayload",
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwieC1oY3gtc2VuZGVyX2NvZGUiOi4uLn0.encrypted_key.iv.ciphertext.tag"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Protected header

These fields go in the JWE protected header of `payload`, not as HTTP headers.

- `alg` (string, required): Key management algorithm. Always `RSA-OAEP-256`: the content key is wrapped with the recipient's RSA public key.
- `enc` (string, required): Content encryption algorithm. Always `A256GCM`.
- `x-hcx-sender_code` (string, required): Your participant code. Mandatory on the envelope.
- `x-hcx-recipient_code` (string, required): The recipient's. For a provider, the processor code from the policy lookup. Mandatory on the envelope.
- `x-hcx-api_call_id` (string, required): Fresh on every message, including responses. Mandatory on the envelope.
- `x-hcx-request_id` (string): One per originating request. The Open Protocol page marks it Mandatory; the Technical Specifications page marks it Optional. Optional on the envelope. Send it anyway, as a fresh UUID per originating request: it is cheap and satisfies both readings until NHA rules.
- `x-hcx-correlation_id` (string, required): The thread that ties a request to its answers. [The correlation ID rule](/docs/nhcx/v1/reference/envelope-fields#the-correlation-id-rule-in-full) says when to reuse it. Mandatory on the envelope.
- `x-hcx-timestamp` (string, required): The time the message was made. [Timestamp](/docs/nhcx/v1/reference/envelope-fields#timestamp) gives the format. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. [Status words](/docs/nhcx/v1/reference/envelope-fields#status-words) lists the values. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string): The beneficiary's ABHA number. Optional: send it when the beneficiary has an ABHA number. Optional on the envelope.

## Body

- `type` (string, required): Always `JWEPayload`. Every response (`on_`) call sends it beside `payload`. One of: JWEPayload.
- `payload` (string, required)

## Responses

- `202`: The gateway returns HTTP 202 with the StatusSuccessResponse envelope (or 400, 404, 500 in the same shape) and delivers the result to the requester's registered endpoint, which must acknowledge with 202 within 30 seconds.
  - `timestamp` (string)
  - `api_call_id` (string)
  - `correlation_id` (string)
  - `result` (object)
  - `result.sender_code` (string)
  - `result.recipient_code` (string)
  - `result.entity_type` (string)
  - `result.protocol_status` (string)
  - `error` (object)
  - `error.code` (string)
  - `error.message` (string)

Example 202 response. The values are placeholders:

```json
{
  "timestamp": "25/08/2026 14:20:00:341",
  "api_call_id": "a7b8c9d0-e1f2-3456-0123-567890123456",
  "correlation_id": "33445566-7788-99aa-bbcc-ddeeff001122",
  "result": {
    "sender_code": "<payer participant code>",
    "recipient_code": "<provider participant code>",
    "entity_type": "task",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
