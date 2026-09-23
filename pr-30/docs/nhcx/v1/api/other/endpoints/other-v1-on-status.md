# Submit the status callback

`POST /v1/on_status`

The answer to a status request, delivered to the sender that asked. The `x-hcx-status` in the protected header says where the message you asked about got to. The payload is an empty string.

### Business purpose

It separates "did my message arrive" from "what did the payer decide". A sender learns whether a quiet case is still held by the exchange, has reached the recipient, or is dead, without resubmitting it and creating a duplicate.

### When to use

Every participant that sends `/v1/status` hosts this path. It carries the answer to your status request.

### Preconditions

- You sent `/v1/status` and kept track of which request it asked about.
- Your callback URL is registered and answers `202` within 30 seconds.

### Postconditions

Read `x-hcx-status` in the header. `request.dispatched` means the message reached the recipient, and `request.queued` means NHCX still holds it. `request.stopped` means the request is dead, so a retry needs a new correlation ID. Answer `202`.

### Common mistakes

- Expecting a bundle. The payload is an empty string.
- Matching on the original request's correlation ID instead of your status request's.
- Retrying a stopped request on its old correlation ID.

### Best practices

- Keep every `API_call_ID` you send. Without it you cannot ask the question at all.
- Act on `request.stopped` at once, and treat `request.dispatched` as a reason to wait for the payer.
- Ask from a support screen when a case has gone quiet for longer than the payer's expected turnaround, not on a timer.

### Related scenario

A pre-authorisation has had no answer for longer than the payer's usual turnaround. The support screen sends `/v1/status` with that request's `API_call_ID` as the correlation ID. The answer arrives here with an empty payload and `x-hcx-status` `request.stopped`, so the desk knows the request is dead rather than slow, and resubmits it with a fresh correlation ID.

### Specification

Chapter [NHCX adapter (Optional)](/docs/nhcx/v1/getting-started/nhcx-adapter) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/on_status \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: <participant code>' \
  --header 'x-hcx-recipient_code: <recipient code>' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-correlation_id: <correlation id>' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: response.complete' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "<compact JWE>"
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

- `payload` (string)

## Responses

- `200`: Read `x-hcx-status` from the protected header.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "19/03/2026 11:46:35:120",
  "api_call_id": "{{$guid}}",
  "correlation_id": "{{correlationId}}",
  "error": {
    "code": "",
    "message": ""
  }
}
```
