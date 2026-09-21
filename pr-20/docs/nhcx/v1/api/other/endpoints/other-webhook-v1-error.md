# Receive error report (callback)

`POST v1_error`

Hosted by every participant. The exchange posts this message to the `endpoint_URL` you registered, at `/v1/error`, with the headers and the sealed payload the sender posted. Answer HTTP 202 with the receipt first and process afterwards; [Receiving a callback](/docs/nhcx/v1/getting-started/receiving-a-callback) has the rules.

Where the exchange tells a sender that a request could not be delivered after five attempts. Received by every participant under its registered address. There is no outbound form.

```bash
curl --request POST \
  --url {bridgeUrl}v1_error \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: nhcx-gateway@hcx' \
  --header 'x-hcx-recipient_code: 1000004446@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-correlation_id: <correlation id>' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: response.error' \
  --header 'Content-Type: application/json' \
  --data '{
  "type": "ProtocolResponse",
  "x-hcx-sender_code": "nhcx-gateway@hcx",
  "x-hcx-recipient_code": "1000004446@hcx",
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

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.
- `x-hcx-sender_code` (string, required): Your participant code. Mandatory on the envelope.
- `x-hcx-recipient_code` (string, required): The recipient's. For a provider, the processor code from the policy lookup. Mandatory on the envelope.
- `x-hcx-api_call_id` (string, required): Fresh on every message, including responses. Mandatory on the envelope.
- `x-hcx-correlation_id` (string, required): The thread. See the rule below. Mandatory on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.

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

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "04/09/2026 11:46:41:305",
  "api_call_id": "<from the incoming header>",
  "correlation_id": "<from the incoming header>",
  "result": {
    "sender_code": "1000003538@hcx",
    "recipient_code": "1000004446@hcx",
    "entity_type": "preauth",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
