# NHCX: report a request it could not deliver

`POST /v1/error`

Where the exchange tells a sender that a request could not be delivered after five attempts. Received by every participant under its registered address. There is no outbound form.

### Business purpose

When the exchange cannot deliver a request, it tries five times, retires the correlation ID and tells the original sender here. A system without this endpoint never learns that its request died, and a dead request looks exactly like a case still under review. Every participant must host it.

### When to use

You host this path and never call it. Providers and payers both need it, so build it first.

### Preconditions

- Your callback URL is registered: a domain name over HTTPS, hosted in India, answering within 30 seconds.
- Your handler accepts a body it does not know. The report is plain JSON, not encrypted.

### Postconditions

Answer `202`. The original request is dead, so a retry needs a new correlation ID.

### Common mistakes

- Not hosting it, so failed deliveries go unseen.
- Rejecting the report because it does not match a fixed schema.
- Retrying the failed request on the old correlation ID.

### Best practices

- Store the report whole before doing anything with it.
- Mark the case it names as undelivered, so the desk does not wait for a decision that will not come.
- Check it first when a case goes quiet, before asking the exchange with `/v1/status`.

### Related scenario

A hospital posts a pre-authorisation and gets its receipt, but the payer's endpoint is down. The exchange tries five times, retires the correlation ID and posts a report to the hospital's `/v1/error`. The handler stores the report whole, answers 202 with the receipt, and marks the pre-authorisation undelivered. The desk resubmits it with a fresh correlation ID once the payer is reachable.

### Specification

Chapter [Building and sending a JWE](/docs/nhcx/v1/getting-started/building-and-sending-a-jwe) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/error \
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

- `200`: Answer 202 with the receipt, like every other delivery, filling in whatever identifiers the report carries and leaving the rest empty.
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

Example 200 response. The values are placeholders:

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
