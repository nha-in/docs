# Submit the status check

`POST /v1/status`

Sender asks NHCX where its own in-flight request stands; the gateway answers request.queued or request.dispatched, and only dispatched yields a callback.

### Business purpose

Asynchronous exchanges lose messages, stall in queues and outlive the shift of the desk operator who started them. The Status API exists so the original sender can find out which side of the exchange is holding a request without resubmitting it and creating a duplicate. It answers the hospital desk's most common question, where is my preauth, by telling it whether the gateway has forwarded the request to the payer at all. Providers, payers and TPAs all benefit because it separates gateway delay from payer delay before anyone escalates.

### When to use

Use it when the callback for a request you sent has not arrived. Set `x-hcx-correlation_ID` to the `x-hcx-API_call_ID` of that request. You can only check requests you sent yourself.

### Preconditions

- You sent the original request and kept its `API_call_ID`.
- You have a valid access token.
- The encrypted payload is an empty string, and the header status is `request.initiated`.

### Postconditions

NHCX answers at once with `request.queued` or `request.dispatched`. Queued means the payer has not seen the request, and no callback follows. Dispatched means the payer has it and will answer on the status callback.

### Common mistakes

- Making a new correlation ID instead of using the original request's `API_call_ID`.
- Polling in a tight loop.
- Resubmitting the original request after `request.queued`, which creates a duplicate.

### Best practices

- Persist the correlation ID against the case record before every submission so a status check is always possible.
- Use a bounded, spaced schedule tied to the correlation ID, then escalate; do not poll aggressively.
- Branch on protocol_status: wait on request.queued, expect the status callback on request.dispatched.
- Use a fresh x-hcx-API_call_ID per status call and IST timestamps.
- Treat Status as transport position only; the decision lives in the original on_ callback or a Search for the claim document.
- Implement the status callback and v1/error so both branches of the answer have somewhere to land.

### Related scenario

A hospital's TPA desk submitted a preauth on /v1/preauth/submit at 09:00 and by 13:00 nothing has arrived on /v1/preauth/on_submit. Rather than resubmit, the integration posts /v1/status with the preauth's correlation ID. The synchronous reply shows protocol_status request.dispatched, so the request is with the payer, not stuck at the gateway; the desk stops worrying about a lost message and waits for the status callback and the eventual preauth decision. Had the reply been request.queued, the desk would have waited on the gateway and, if the delay persisted, escalated to NHCX support with the correlation ID.

### Specification

Chapter [NHCX adapter (Optional)](/docs/nhcx/v1/getting-started/nhcx-adapter) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/status \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1000004446@hcx' \
  --header 'x-hcx-recipient_code: 1518@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <original api call id>' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: request.initiated' \
  --header 'x-hcx-ben-abha-id: 91711234567890' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwieC1oY3gtc2VuZGVyX2NvZGUiOiIxMDAwMDA0NDQ2QGhjeCJ9.encrypted_key.iv.ciphertext.tag"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.
- `x-hcx-sender_code` (string, required): Your participant code. Mandatory on the envelope.
- `x-hcx-recipient_code` (string, required): The recipient's. For a provider, the processor code from the policy lookup. Mandatory on the envelope.
- `x-hcx-api_call_id` (string, required): Fresh on every message, including responses. Mandatory on the envelope.
- `x-hcx-request_id` (string): One per originating request. The Open Protocol page marks it Mandatory; the Technical Specifications page marks it Optional. Optional on the envelope. Send it anyway, as a fresh UUID per originating request: it is cheap and satisfies both readings until NHA rules.
- `x-hcx-correlation_id` (string, required): The thread. See the rule below. Mandatory on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string): The beneficiary's ABHA number. Optional: send it when the beneficiary has an ABHA number. Optional on the envelope.

## Body

- `payload` (string)

## Responses

- `202`: The gateway validates the request and returns the protocol status synchronously in the HTTP response: HTTP 202 with a StatusSuccessResponse whose result carries sender_code, recipient_code, entity_type and protocol_status of request.queued or request.dispatched.

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "25/08/2026 13:00:00:215",
  "api_call_id": "e5f6a7b8-c9d0-1234-ef01-345678901234",
  "correlation_id": "11223344-5566-7788-99aa-bbccddeeff00",
  "result": {
    "sender_code": "1000004446@hcx",
    "recipient_code": "1518@hcx",
    "entity_type": "preauth",
    "protocol_status": "request.dispatched"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
