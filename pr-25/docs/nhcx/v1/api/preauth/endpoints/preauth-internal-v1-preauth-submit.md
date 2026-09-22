# Submit the pre-authorisation submit (internal) (adapter)

`POST /internal/v1/preauth/submit`

Internal twin of /v1/preauth/submit (operationId preauthSubmitPostInternal) with the same JWEPayload body and response set. Exposed for the NHCX adapter deployment rather than for direct integration.

### Business purpose

The preauth service publishes its submit operation twice, at /v1 and at /internal/v1, with identical descriptions, request bodies and response sets. Only the operationId differs, by an Internal suffix. The /internal prefix is the route the NHCX adapter sits on: a participant running the adapter alongside its own system calls the internal path, and the adapter handles the encryption, headers and gateway hop. A participant integrating directly against NHCX calls the public path and does that work itself. No separate business purpose is documented for the internal route beyond that.

### When to use

Use it only when you are running the NHCX adapter and it is configured to serve this path; otherwise call /v1/preauth/submit. Everything else is unchanged: the same JWEPayload body, the same x-hcx-* protected header, the same workflow discriminators and the same asynchronous callback. The specs do not document what makes the internal variant different beyond the operationId, so treat it as a mirror of the public path and confirm with NHCX onboarding before pointing production at it.

### Preconditions

Identical to /v1/preauth/submit. Nothing additional is documented for the internal route, beyond an adapter deployment that actually serves the /internal prefix.

### Postconditions

NHCX returns HTTP 202 Accepted with a StatusSuccessResponse acknowledgement (entity_type preauth, protocol_status request.queued or request.dispatched). This is not an adjudication; the gateway validates structure and open headers, then forwards asynchronously. The payer may first acknowledge under workflow 20, then answer on /v1/preauth/on_submit with a ClaimResponseBundle: 21 approved (preAuthRef issued), 23 rejected, 24 queried, 22 enhancement approved or 241 enhancement queried, 261, 262 or 263 for discharge. Protocol failures return a ProtocolResponse with x-hcx-error_details. Errors marked 400, 404 and 500 carry the same schema.

### Common mistakes

- Assuming a different body or different semantics for the internal route; the spec gives it the same JWEPayload body and the same responses.
- Calling it without an adapter deployment behind it and then chasing a 404.
- Every pitfall of the public path applies unchanged.

### Best practices

- Default to /v1/preauth/submit and keep the internal path as a configuration option only.
- Share one client implementation across both paths, so header hygiene, encryption and correlation handling cannot diverge between them.
- Record which variant carried each correlation ID, for support conversations.

### Related scenario

A vendor reading the preauth OpenAPI document sees preauthSubmitPostInternal sitting beside its public twin and asks which one to build against. The answer is the public path, unless NHCX onboarding has given them an adapter deployment, in which case the adapter takes the bundle unencrypted on the internal path and does the JWE and the gateway hop for them. The end-to-end flow is identical either way.

### Specification

Chapter [Preauthorisation request](/docs/nhcx/v1/reference/fhir/preauthorisation-request) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/internal/v1/preauth/submit \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1000004446@hcx' \
  --header 'x-hcx-recipient_code: 1518@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 12' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: request.initiated' \
  --header 'x-hcx-ben-abha-id: 91711234567890' \
  --header 'x-hcx-use_case: New' \
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
- `x-hcx-use_case` (string): Values differ by exchange, see below. Optional on the envelope.

## Body

- `payload` (string)

## Responses

- `202`: NHCX returns HTTP 202 Accepted with a StatusSuccessResponse acknowledgement (entity_type preauth, protocol_status request.queued or request.dispatched).

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "19/03/2026 11:46:35:120",
  "api_call_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "correlation_id": "11223344-5566-7788-99aa-bbccddeeff00",
  "result": {
    "sender_code": "1000004446@hcx",
    "recipient_code": "1518@hcx",
    "entity_type": "preauth",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
