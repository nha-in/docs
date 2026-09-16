# Insurance plan request (internal variant) (adapter)

`POST /internal/v1/insuranceplan/request`

Internal twin of /v1/insuranceplan/request on the insuranceplanhcxservice: same TaskBundle payload, same 202 envelope, distinct operationId.

### Business purpose

The insuranceplanhcxservice is one of six NHCX services that expose every operation at both /v1/... and /internal/v1/... with identical descriptions and bodies, differing only in the operationId suffix. This entry is the internal form of the provider's plan discovery request, whose purpose is to retrieve the payer's structured, provider-specific digital policy before treatment. The documentation states the internal variant has the same semantics as /v1/insuranceplan/request and does not describe any behavioural difference.

### When to use

Same circumstances as the public request: before any preauth or claim for a payer and policy, at registration or admission, and before cost estimation. The payload is the Task poll bundle with at least one of policyNumber or providerId; the header carries request.initiated. The specifications do not say when the internal path applies instead of the public one, so integrators should default to /v1/insuranceplan/request unless onboarding guidance names the internal route.

### Preconditions

- As for the public endpoint: registered provider and payer, Bearer token, payer certificate verified and used for JWE encryption.
- Body is a JWEPayload, { "payload": "<compact JWE>" }, whose plaintext is the TaskBundle.
- Protected header with sender_code, recipient_code, fresh api_call_id and correlation_id, IST timestamp, status request.initiated.
- Confirmation that the internal prefix is reachable and intended for your integration; the specs are silent on this.

### Postconditions

Returns 202 Accepted with StatusSuccessResponse (timestamp, api_call_id, correlation_id, result with sender_code, recipient_code, entity_type and protocol_status, error), or 400, 404 or 500 in the same envelope. The payer's plan arrives later on the insurance plan on_request callback under the same correlation id; the provider must acknowledge that within 30 seconds. An empty plan or a PAYR-1401 to PAYR-1406 error is a documented business outcome. No additional behaviour is documented for the internal variant.

### Common mistakes

- Assuming the internal route bypasses validation or returns the plan synchronously; it is documented as identical to the public request.
- Omitting both Task inputs; at least one of policyNumber or providerId is required.
- Resubmitting while a previous request is in progress (PAYR-1406).
- Hard-coding the internal prefix without confirming it is your onboarded route; a 404 may simply mean the wrong host or prefix shape.

### Best practices

- Reuse the public request's bundle builder and header hygiene; make only the path prefix configurable.
- Mint a fresh UUID correlation id per discovery cycle and a fresh api_call_id per call; use IST timestamps.
- Cache and periodically refresh the returned plan; enforce its claim conditions before preauth.
- Have the on_request receiver and v1/error in place before sending.

### Related scenario

A hospital information system vendor generating clients from the insuranceplanhcxservice Swagger finds both insuranceplanRequestPost-style operations and their Internal twins. The vendor implements one plan-discovery module that posts to /v1/insuranceplan/request by default, with the internal path selectable per deployment after confirmation from NHCX onboarding. Either way the flow is the same: 202 receipt, the package master arriving on the on_request callback, then coverage eligibility and preauth built against the cached plan.

### Specification

Chapter [Insurance plan request](/docs/nhcx/v1/reference/fhir/insurance-plan-request) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/internal/v1/insuranceplan/request \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1000004446@hcx' \
  --header 'x-hcx-recipient_code: 1518@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: ' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: request.initiated' \
  --header 'x-hcx-ben-abha-id: ' \
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

- `200`: Returns 202 Accepted with StatusSuccessResponse (timestamp, api_call_id, correlation_id, result with sender_code, recipient_code, entity_type and protocol_status, error), or 400, 404 or 500 in the same envelope.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "25/08/2026 09:30:00:077",
  "api_call_id": "d0e1f2a3-b4c5-6789-3456-890123456789",
  "correlation_id": "55667788-99aa-bbcc-ddee-ff0011223344",
  "result": {
    "sender_code": "1000004446@hcx",
    "recipient_code": "1518@hcx",
    "entity_type": "insuranceplan",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
