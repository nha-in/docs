# Insurance plan callback (internal variant) (adapter)

`POST /internal/v1/insuranceplan/on_request`

Internal twin of /v1/insuranceplan/on_request: the payer InsuranceplanBundle callback with identical semantics, distinct operationId.

### Business purpose

This is the internal-path form of the callback through which a payer delivers the digital policy: the InsurancePlan collection Bundle with packages, rates, qualifiers, claim conditions, mandatory documents and questionnaires for one policy and one hospital. The documentation lists it as an internal variant of the callback API with the same semantics as /v1/insuranceplan/on_request and does not describe any difference beyond the operationId. Its business value is unchanged: a machine-readable contract view that reduces rework and rejections.

### When to use

Same as the public callback: after receiving and acknowledging an insurance plan request Task, the payer posts the plan bundle under the request's correlation id with a responder status (response.complete, or response.error with x-hcx-error_details). The bundle may follow either documented structure and may be empty when no coverage matches. The specifications do not indicate when the internal path is used in preference to the public one.

### Preconditions

- Inbound request decrypted, correlation id captured, 202 acceptance already returned.
- Registered payer with a valid Bearer token and the provider's certificate for encryption.
- Collection Bundle containing InsurancePlan, Organization and any Questionnaire resources, filtered to the requesting provider per the MoU.
- Protected header echoing the request's correlation id with a fresh api_call_id, IST timestamp and responder status.
- Confirmation that the internal route is the one intended for your gateway integration.

### Postconditions

Returns 202 Accepted with the StatusSuccessResponse envelope, or 400, 404 or 500 in the same shape; the bundle is forwarded to the provider, which must acknowledge within 30 seconds and may then cache the plan and enforce its conditions before preauth. Insurance plan business errors are PAYR-1401 to PAYR-1406. No additional behaviour is documented for the internal variant.

### Common mistakes

- Expecting different validation or routing from the public callback; none is documented.
- Minting a new correlation id instead of echoing the request's (NHCX-1010).
- Populating cost.value with the package rate rather than the extra amount over the procedure cost.
- Returning an unfiltered package master rather than the provider-specific view.
- Provider side: failing to handle both structuring approaches or treating an empty plan as a fault.

### Best practices

- Share one bundle builder with the public callback; only the path differs.
- Acknowledge the inbound Task first, assemble the plan asynchronously, then post.
- Use the documented claim-condition codes and include Questionnaire resources for mandatory documents.
- Fresh api_call_id, IST timestamp, response.complete or response.error with error details.
- Provider side: cache, refresh periodically or on treatment change, validate preauth items against the plan.

### Related scenario

A payer platform team reviewing the insuranceplanhcxservice specification notices the callback appears twice, publicly and under /internal/v1. They implement a single plan-publication service that emits the InsurancePlan bundle under the request's correlation id, configured to the public /v1/insuranceplan/on_request path unless NHCX onboarding specifies the internal one. When a hospital's discovery Task arrives, the service returns 202, builds the filtered package master and posts it; the hospital acknowledges within 30 seconds and proceeds to eligibility and preauth.

### Specification

Chapter [Insurance plan response](/docs/nhcx/v1/reference/fhir/insurance-plan-response-overview) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/internal/v1/insuranceplan/on_request \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1518@hcx' \
  --header 'x-hcx-recipient_code: 1000004446@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: ' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: response.complete' \
  --header 'x-hcx-ben-abha-id: ' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwieC1oY3gtc2VuZGVyX2NvZGUiOiIxNTE4QGhjeCJ9.encrypted_key.iv.ciphertext.tag"
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

- `200`: Returns 202 Accepted with the StatusSuccessResponse envelope, or 400, 404 or 500 in the same shape; the bundle is forwarded to the provider, which must acknowledge within 30 seconds and may then cache the plan and enforce its conditions before preauth.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "25/08/2026 09:37:00:263",
  "api_call_id": "e1f2a3b4-c5d6-7890-4567-901234567890",
  "correlation_id": "55667788-99aa-bbcc-ddee-ff0011223344",
  "result": {
    "sender_code": "1518@hcx",
    "recipient_code": "1000004446@hcx",
    "entity_type": "insuranceplan",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
