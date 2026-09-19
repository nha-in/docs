# Submit the communication acknowledgement callback (internal variant) (adapter)

`POST /internal/v1/communication/on_request`

Internal twin of /v1/communication/on_request: the provider acknowledgement Task bundle, operationId communicationOnRequestPostInternal.

### Business purpose

This is the internal-path form of the provider acknowledgement that closes a payer communication. The OpenAPI document lists it with the same description and bare object request body as the public callback and distinguishes it only by the operationId suffix. Its business role is unchanged: give the payer auditable confirmation that a TAT alert, grievance, wallet or policy update or additional-information request reached the hospital, so adjudication and SLA tracking can proceed inside NHCX rather than over phone or email.

### When to use

Use it in the same circumstances as the public on_request callback: after receiving, acknowledging with a synchronous 202, and persisting a communication request, the provider posts a mirror-image Task bundle with the same reasonCode, Task.code poll, Task.intent proposal, Task.status completed and the same x-hcx-correlation_ID. The responder status is response.complete, response.partial or response.error. The specs do not say when the internal path is used instead of the public one; follow your onboarding instructions.

### Preconditions

- The inbound communication was decrypted and its correlation ID, status and workflow ID captured.
- A valid Bearer token and the payer's certificate for encrypting the acknowledgement.
- The acknowledgement bundle mirrors the request, provider Organisation first, timestamps updated.
- Protected header echoes the request's x-hcx-correlation_ID, carries a fresh x-hcx-API_call_ID, an IST TIMESTAMP and a responder status; x-hcx-workflow_ID is validated at the gateway.
- Confirm the internal prefix is the route you were onboarded to before using it.

### Postconditions

Same as the public callback: HTTP 202 with the StatusSuccessResponse envelope, or 400, 404 or 500 in the same shape; the bundle is forwarded to the payer, who links it to the original notification by correlation ID and by the shared claim or preauth reference. The underlying issue remains open until resolved through the preauth or claim path. No additional behaviour is documented for the internal variant.

### Common mistakes

- Expecting the internal path to relax any rule; it carries the same validation and the same errors (NHCX-1010 for an unknown correlation ID, NHCX-1011 for a bad status value).
- Minting a new correlation ID on the acknowledgement.
- Sending this call in place of the synchronous 202, which triggers the five-attempt retry loop and deletion of the request.
- Closing the case because Communication.status is completed.
- Using an unconfigurable path prefix that cannot switch between public and internal forms.

### Best practices

- Share one acknowledgement builder with the public callback; only the path differs.
- Return 202 within 30 seconds first, then post the acknowledgement asynchronously.
- Be idempotent on correlation ID; expect redeliveries.
- Route on Task.reasonCode and log reason, category, priority and correlation ID.
- Keep IST timestamps and a fresh API_call_ID on every call.

### Related scenario

A hospital integrator generating client code from the communicationhcxservice Swagger finds two acknowledgement operations, communicationOnRequestPost and communicationOnRequestPostInternal, with identical descriptions. The team implements one handler for inbound communications, answers 202 immediately, and posts the acknowledgement Task to the public /v1/communication/on_request path as the handbook documents, leaving the internal form selectable by configuration. When a walletupdate arrives for a patient mid-admission, the same handler refreshes the benefit cache before the enhancement request goes out on /v1/preauth/submit.

### Specification

Chapter [Communication](/docs/nhcx/v1/reference/fhir/communication) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/internal/v1/communication/on_request \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1000004446@hcx' \
  --header 'x-hcx-recipient_code: 1518@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 15' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: response.complete' \
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
- `x-hcx-request_id` (string): One per originating request. The Open Protocol page marks it Mandatory; the Technical Specifications page marks it Optional. Optional on the envelope.
- `x-hcx-correlation_id` (string, required): The thread. See the rule below. Mandatory on the envelope.
- `x-hcx-workflow_id` (string): Which step, or which case. See the two readings below. Optional on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string, required): The beneficiary's ABHA number. Mandatory on every exchange, including those with no beneficiary in the payload. Mandatory on the envelope.

## Body

- `payload` (string)

## Responses

- `202`: Same as the public callback: HTTP 202 with the StatusSuccessResponse envelope, or 400, 404 or 500 in the same shape; the bundle is forwarded to the payer, who links it to the original notification by correlation id and by the shared claim or preauth reference.

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "25/08/2026 12:15:00:377",
  "api_call_id": "d4e5f6a7-b8c9-0123-def0-234567890123",
  "correlation_id": "22334455-6677-8899-aabb-ccddeeff0011",
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
