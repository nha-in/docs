# Search submit

`POST /v1/search/submit`

Authorised entity such as NHA or IRDAI sends a Task to retrieve claim information for a case; the payer returns the documents on the search callback.

### Business purpose

Regulators and scheme authorities need to see what was actually claimed and decided for a given case without being a party to the original exchange. The Search API is that privileged pull path: an authorised entity submits a Task naming the case, and the payer supplies the claim documents. It supports oversight, audit and dispute review, and it lets payers answer such requests through the same encrypted, correlated channel as everything else on NHCX. The documented callers are NHA and IRDAI; a provider integration usually implements only the responding side.

### When to use

Use it when an authorised entity needs the claim documents for a known case number, for example during a regulatory audit or a dispute. It is a pull, not a lifecycle step, and sits outside the workflow-code sequence. The protected header's x-hcx-correlation_id carries the correlation id of the request being queried, and x-hcx-status is request.initiated. The result arrives asynchronously on /v1/search/on_submit with task type code=poll; if the search is for a claim document, the callback payload is the ClaimResponse for the reference number.

### Preconditions

- The caller is an entity authorised to search claim information (the source names NHA and IRDAI) and is registered on NHCX with a valid Bearer token.
- Request body is a JWE per RFC-7516 with protocol headers per the ProtocolHeader schema.
- Domain payload is an encrypted Task built per the TaskBundle, with the entity being queried referenced in the about element using the sender's reference id.
- Protected header carries sender_code, recipient_code, a fresh api_call_id, the correlation id of the request being queried, an IST timestamp and status request.initiated.
- HTTP headers Accept, Content-Type and bearer_auth.

### Postconditions

The gateway returns HTTP 202 with a StatusSuccessResponse (timestamp, api_call_id, correlation_id, result with sender_code, recipient_code, entity_type and protocol_status, and error), or 400, 404 or 500 in the same envelope. It forwards the Task to the payer, who responds later on /v1/search/on_submit with the claim document: a ClaimResponse whose basedOn carries the sender's reference id and whose about carries the recipient's reference id and the current status of the response entity. No case state changes; Search only reads.

### Common mistakes

- Using Search as a general status lookup; Status answers where a request is, Search returns documents.
- Sending a CommunicationRequest as the domain payload; Search uses a Task (Status is the one that uses CommunicationRequest).
- Forgetting the about reference with the sender's reference id, leaving the payer with nothing to search for (PAYR-1102 Invalid search parameter requested).
- Minting a new correlation id rather than carrying the one for the request being queried.
- Calling it from a participant that is not an authorised entity; the description scopes it explicitly.
- Expecting the documents in the synchronous 202.

### Best practices

- Reference the case in Task.about using the sender's own reference id and keep it consistent with the correlation id you carry.
- Persist the correlation id so the on_submit result can be matched.
- Use fresh api_call_id values, IST timestamps and request.initiated on the outbound header.
- Handle 404 as a signal that the correlation id is unknown to the gateway, not as a retry trigger.
- Implement v1/error and the on_submit receiver before submitting searches.

### Related scenario

A scheme authority reviewing a grievance about a rejected claim needs the payer's adjudication record. Its integration posts /v1/search/submit with a Task whose about element names the case and whose header carries the claim's correlation id. The gateway acknowledges with 202 and forwards the Task to the payer. The payer's system locates the ClaimResponse for the reference number and returns it on /v1/search/on_submit with basedOn holding the authority's reference and about holding the payer's reference and current status. The authority then compares it with the provider's original /v1/claim/submit bundle.

### Specification

Chapter [NHCX adapter (Optional)](/docs/nhcx/v1/getting-started/nhcx-adapter) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/search/submit \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1000004446@hcx' \
  --header 'x-hcx-recipient_code: 1518@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: request.initiated' \
  --header 'x-hcx-ben-abha-id: 91711234567890' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwieC1oY3gtc2VuZGVyX2NvZGUiOiJOSEExQGhjeCJ9.encrypted_key.iv.ciphertext.tag"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.
- `x-hcx-sender_code` (string, required): Your participant code. Mandatory on the envelope.
- `x-hcx-recipient_code` (string, required): The recipient's. For a provider, the processor code from the policy lookup. Mandatory on the envelope.
- `x-hcx-api_call_id` (string, required): Fresh on every message, including responses. Mandatory on the envelope.
- `x-hcx-request_id` (string): One per originating request. The Open Protocol page marks it Mandatory; the Technical Specifications page marks it Optional. Optional on the envelope.
- `x-hcx-correlation_id` (string, required): The thread. See the rule below. Mandatory on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string, required): The beneficiary's ABHA number. Mandatory on every exchange, including those with no beneficiary in the payload. Mandatory on the envelope.

## Body

- `payload` (string)

## Responses

- `202`: The gateway returns HTTP 202 with a StatusSuccessResponse (timestamp, api_call_id, correlation_id, result with sender_code, recipient_code, entity_type and protocol_status, and error), or 400, 404 or 500 in the same envelope.

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "25/08/2026 14:00:00:098",
  "api_call_id": "f6a7b8c9-d0e1-2345-f012-456789012345",
  "correlation_id": "33445566-7788-99aa-bbcc-ddeeff001122",
  "result": {
    "sender_code": "1000004446@hcx",
    "recipient_code": "1518@hcx",
    "entity_type": "task",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
