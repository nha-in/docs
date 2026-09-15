# Payment notice acknowledgement (internal) (adapter)

`POST /internal/v1/paymentnotice/on_request`

Internal twin of /v1/paymentnotice/on_request (operationId paymentNoticeOnRequestPostInternal) with the same JWEPayload body and response set. Exposed for the NHCX adapter deployment rather than for direct integration.

### Business purpose

The paymentnotice service publishes its on_request operation twice, at /v1 and at /internal/v1, with identical descriptions, request bodies and response sets. Only the operationId differs, by an Internal suffix. The /internal prefix is the route the NHCX adapter sits on: a participant running the adapter alongside its own system calls the internal path, and the adapter handles the encryption, headers and gateway hop. A participant integrating directly against NHCX calls the public path and does that work itself. No separate business purpose is documented for the internal route beyond that.

### When to use

Use it only when you are running the NHCX adapter and it is configured to serve this path; otherwise call /v1/paymentnotice/on_request. Everything else is unchanged: the same JWEPayload body, the same x-hcx-* protected header, the same workflow discriminators and the same asynchronous callback. The specs do not document what makes the internal variant different beyond the operationId, so treat it as a mirror of the public path and confirm with NHCX onboarding before pointing production at it.

### Preconditions

Identical to /v1/paymentnotice/on_request. Nothing additional is documented for the internal route, beyond an adapter deployment that actually serves the /internal prefix.

### Postconditions

NHCX returns HTTP 202 Accepted with a StatusSuccessResponse acknowledgement (entity_type payment) and forwards the Task to the payer asynchronously; the payer's endpoint must acknowledge with 202 within 30 seconds or NHCX retries up to five times. If the payer cannot process the acknowledgement (invalid provider, decryption failure, missing mandatory protocol attributes) it returns a protocol response with x-hcx-error_details populated. On success the payment lifecycle for that claim is closed on both sides.

### Common mistakes

- Assuming a different body or different semantics for the internal route; the spec gives it the same JWEPayload body and the same responses.
- Calling it without an adapter deployment behind it and then chasing a 404.
- Every pitfall of the public path applies unchanged.

### Best practices

- Default to /v1/paymentnotice/on_request and keep the internal path as a configuration option only.
- Share one client implementation across both paths, so header hygiene, encryption and correlation handling cannot diverge between them.
- Record which variant carried each correlation ID, for support conversations.

### Related scenario

A vendor reading the paymentnotice OpenAPI document sees paymentNoticeOnRequestPostInternal sitting beside its public twin and asks which one to build against. The answer is the public path, unless NHCX onboarding has given them an adapter deployment, in which case the adapter takes the bundle unencrypted on the internal path and does the JWE and the gateway hop for them. The end-to-end flow is identical either way.

### Specification

Chapter [Payment notice and acknowledgement](/docs/nhcx/v1/reference/fhir/payment-notice-and-acknowledgement) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/internal/v1/paymentnotice/on_request \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1000004446@hcx' \
  --header 'x-hcx-recipient_code: 1518@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 17' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: response.complete' \
  --header 'x-hcx-ben-abha-id: 91711234567890' \
  --header 'x-hcx-debug_flag: INFO' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwieC1oY3gtc2VuZGVyX2NvZGUiOi4uLn0.encrypted_key.iv.ciphertext.tag"
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
- `x-hcx-workflow_id` (string): Which step, or which case. See the two readings below. Optional on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string, required): The beneficiary's ABHA number. Mandatory on every exchange, including those with no beneficiary in the payload. Mandatory on the envelope.
- `x-hcx-debug_flag` (string): `Error`, `Info` or `Debug`. A server may ignore it. Optional on the envelope.

## Body

- `payload` (string)

## Responses

- `202`: NHCX returns HTTP 202 Accepted with a StatusSuccessResponse acknowledgement (entity_type payment) and forwards the Task to the payer asynchronously; the payer's endpoint must acknowledge with 202 within 30 seconds or NHCX retries up to five times.

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "27/02/2026 10:06:19:310",
  "api_call_id": "b1a2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "correlation_id": "c3d2e1f0-a9b8-4c7d-9e6f-5a4b3c2d1e0f",
  "result": {
    "sender_code": "1000004446@hcx",
    "recipient_code": "1518@hcx",
    "entity_type": "payment",
    "protocol_status": "request.dispatched"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
