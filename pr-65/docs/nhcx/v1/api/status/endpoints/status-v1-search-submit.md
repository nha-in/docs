# Authorised entity: search for claim information

`POST /v1/search/submit`

Authorised entity such as NHA or IRDAI sends a Task to retrieve claim information for a case; the payer returns the documents on the search callback.

### Business purpose

Regulators and scheme authorities need to see what was actually claimed and decided for a given case without being a party to the original exchange. The Search API is that privileged pull path: an authorised entity submits a Task naming the case, and the payer supplies the claim documents. It supports oversight, audit and dispute review, and it lets payers answer such requests through the same encrypted, correlated channel as everything else on NHCX. The documented callers are NHA and IRDAI; a provider integration usually implements only the responding side.

### When to use

Use it when an authorised body such as NHA or IRDAI needs the claim documents for a known case, for example during an audit. The result arrives later on `/v1/search/on_submit`.

### Preconditions

- You are an entity allowed to search, registered on NHCX, with a valid access token.
- The payload is an encrypted FHIR `Task` that points to the case being queried.
- `x-hcx-correlation_ID` carries the correlation ID of the request being queried.

### Postconditions

NHCX answers `202` at once. The payer sends the documents later on `/v1/search/on_submit`. Search only reads, so nothing about the case changes.

### Common mistakes

- Using search to ask where a request is. Use `/v1/status` for that.
- Sending a `CommunicationRequest` instead of a `Task`.
- Making a new correlation ID instead of carrying the one being queried.
- Expecting the documents in the `202`.

### Best practices

- Reference the case in Task.about using the sender's own reference ID and keep it consistent with the correlation ID you carry.
- Persist the correlation ID so the on_submit result can be matched.
- Use fresh API_call_ID values, IST timestamps and request.initiated on the outbound header.
- Handle 404 as a signal that the correlation ID is unknown to the gateway, not as a retry trigger.
- Implement v1/error and the on_submit receiver before submitting searches.

### Related scenario

A scheme authority reviewing a grievance about a rejected claim needs the payer's adjudication record. Its integration posts /v1/search/submit with a Task whose about element names the case and whose header carries the claim's correlation ID. The gateway acknowledges with 202 and forwards the Task to the payer. The payer's system locates the ClaimResponse for the reference number and returns it on /v1/search/on_submit with basedOn holding the authority's reference and about holding the payer's reference and current status. The authority then compares it with the provider's original /v1/claim/submit bundle.

### Specification

Chapter [NHCX adapter (Optional)](/docs/nhcx/v1/getting-started/nhcx-adapter) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/search/submit \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwieC1oY3gtc2VuZGVyX2NvZGUiOiJOSEExQGhjeCJ9.encrypted_key.iv.ciphertext.tag"
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

- `payload` (string)

## Responses

- `202`: The gateway returns HTTP 202 with a StatusSuccessResponse (timestamp, api_call_id, correlation_id, result with sender_code, recipient_code, entity_type and protocol_status, and error), or 400, 404 or 500 in the same envelope.
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
  "timestamp": "25/08/2026 14:00:00:098",
  "api_call_id": "f6a7b8c9-d0e1-2345-f012-456789012345",
  "correlation_id": "33445566-7788-99aa-bbcc-ddeeff001122",
  "result": {
    "sender_code": "<provider participant code>",
    "recipient_code": "<payer participant code>",
    "entity_type": "task",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
