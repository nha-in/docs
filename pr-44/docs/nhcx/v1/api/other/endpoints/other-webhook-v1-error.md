# Participant receives an error report

`POST /v1/error`

Hosted by every participant. The exchange posts this message to the `endpoint_URL` you registered, at `/v1/error`, with the headers and the sealed payload the sender posted. Answer HTTP 202 with the receipt first and process afterwards; [Receiving a callback](/docs/nhcx/v1/getting-started/receiving-a-callback) has the rules.

Where the exchange tells a sender that a request could not be delivered after five attempts. Received by every participant under its registered address. There is no outbound form.

```bash
curl --request POST \
  --url {bridgeUrl}/v1/error \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "type": "ProtocolResponse",
  "x-hcx-sender_code": "nhcx-gateway@hcx",
  "x-hcx-recipient_code": "<provider participant code>",
  "x-hcx-api_call_id": "<uuid>",
  "x-hcx-correlation_id": "<correlation id>",
  "x-hcx-workflow_id": "12",
  "x-hcx-timestamp": "<iso timestamp>",
  "x-hcx-status": "response.error",
  "x-hcx-error_details": {
    "code": "ERR_DELIVERY_FAILED",
    "message": "Recipient endpoint unreachable after five attempts",
    "trace": ""
  },
  "x-hcx-entity-type": "preauth"
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
- `x-hcx-correlation_id` (string, required): The thread that ties a request to its answers. [The correlation ID rule](/docs/nhcx/v1/reference/envelope-fields#the-correlation-id-rule-in-full) says when to reuse it. Mandatory on the envelope.
- `x-hcx-timestamp` (string, required): The time the message was made. [Timestamp](/docs/nhcx/v1/reference/envelope-fields#timestamp) gives the format. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. [Status words](/docs/nhcx/v1/reference/envelope-fields#status-words) lists the values. Mandatory on the envelope.

## Body

- `type` (string)
- `x-hcx-sender_code` (string)
- `x-hcx-recipient_code` (string)
- `x-hcx-api_call_id` (string)
- `x-hcx-correlation_id` (string)
- `x-hcx-workflow_id` (string)
- `x-hcx-timestamp` (string)
- `x-hcx-status` (string)
- `x-hcx-error_details` (object)
- `x-hcx-error_details.code` (string)
- `x-hcx-error_details.message` (string)
- `x-hcx-error_details.trace` (string)
- `x-hcx-entity-type` (string)

## Responses

- `202`: Received. The receipt names the message it answers; the answer itself follows as a call of your own.
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
  "timestamp": "04/09/2026 11:46:41:305",
  "api_call_id": "<from the incoming header>",
  "correlation_id": "<from the incoming header>",
  "result": {
    "sender_code": "1000003538@hcx",
    "recipient_code": "<provider participant code>",
    "entity_type": "preauth",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
