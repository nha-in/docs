# Task callback (internal variant) (adapter)

`POST /internal/v1/task/on_submit`

Internal twin of /v1/task/on_submit (hcxOnTaskPostInternal): the payer Task bundle wrapping the ClaimResponse outcome of a reprocess or cancel.

### Business purpose

This is the internal-path form of the callback that closes a reprocess or cancellation. The OpenAPI lists it with the same description and bare object body as the public callback and distinguishes it only by the operationId suffix. Its role is unchanged: deliver the payer's final, auditable decision on an appeal, or confirmation of a preauth cancellation, in a Task bundle whose Task.output references a ClaimResponse that hospitals can parse with their normal adjudication logic.

### When to use

Same as the public callback: after acknowledging and re-adjudicating a Task, the payer posts a Task bundle with status completed and Task.output referencing the ClaimResponse, under the original correlation id, with workflow 252, 253 or 254 (or PC02 for cancellation) and a responder status. The specifications do not say when the internal path is used in preference to the public one.

### Preconditions

- Inbound Task decrypted, correlation id captured, 202 acceptance returned within 30 seconds.
- Registered payer with a valid Bearer token and the provider's certificate.
- Task bundle with Task.status completed and Task.output[0].valueReference resolving to a ClaimResponse entry in the bundle.
- Protected header echoing the request's correlation id with a fresh api_call_id, IST timestamp, outcome workflow id and responder status.
- Confirmation that the internal route is the intended one.

### Postconditions

Returns 202 Accepted with the StatusSuccessResponse envelope, or 400, 404 or 500 in the same shape; the bundle is forwarded to the provider, which acknowledges within 30 seconds, extracts the ClaimResponse from Task.output and closes the appeal branch. The decision is final within the workflow context; approval leads to payment workflows 30, 31 and 33. No additional behaviour is documented for the internal variant.

### Common mistakes

- Expecting a different envelope or relaxed validation; none is documented.
- Sending a standalone ClaimResponse bundle rather than a Task wrapper, or minting a new correlation id (NHCX-1010).
- Provider side: reading the ClaimResponse from Bundle.entry directly, or treating outcome complete as approval without checking the adjudication reason.
- Using an unconfigurable path that cannot switch between public and internal forms.

### Best practices

- Share the public callback's bundle builder; only the path differs.
- Acknowledge the inbound Task first, re-adjudicate asynchronously, then post.
- Provider: reuse the claim ClaimResponse parser, reached via Task.output[0].valueReference.reference.
- Idempotent handling on correlation id; fresh api_call_id and IST timestamp on the callback.

### Related scenario

A payer platform reviewing the taskhcxservice specification sees hcxOnTaskPost and hcxOnTaskPostInternal side by side. It implements a single outcome publisher that wraps the ClaimResponse in a Task bundle and posts to the public /v1/task/on_submit path unless configured for the internal one. When a hospital's cancellation Task for an unused preauth is processed, the publisher posts the Task bundle with PC02 semantics under the preauth's correlation id; the hospital acknowledges within 30 seconds and raises a fresh preauth with a new case number for the revised treatment.

### Specification

Chapter [Cancel, reprocess and shortfall](/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/internal/v1/task/on_submit \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1518@hcx' \
  --header 'x-hcx-recipient_code: 1000004446@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: PC02' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: response.complete' \
  --header 'x-hcx-ben-abha-id: 91711234567890' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwieC1oY3gtc2VuZGVyX2NvZGUiOiIxNTE4QGhjeCJ9.encrypted_key.iv.ciphertext.tag"
}'
```
