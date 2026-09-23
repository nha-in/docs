# Submit the task submit (reprocess or cancel)

`POST /v1/task/submit`

Provider sends an FHIR Task asking the payer to reprocess a rejected or short-paid claim or to cancel a preauth; Task.code and reasonCode set the intent.

### Business purpose

Claims are often not fully approved first time, for mundane reasons: missing documents, policy interpretation differences, package or pricing discrepancies. Without a formal appeal path, disputes leave the system and become phone calls and email. The Task flow gives providers a structured, auditable way to contest a decision with new evidence, and to withdraw a pre-authorisation that will never be used. Payers get a controlled re-adjudication workflow with SLA adherence, aligned with NHA and IRDAI expectations of transparent dispute resolution.

### When to use

Use it to ask the payer to reprocess a rejected or short-paid claim, or to cancel a pre-authorisation. Reprocess uses workflow `36`. Cancel uses workflow `PC01` and is answered on `PC02`.

### Preconditions

- You have a valid access token and the payer's certificate.
- The original claim or pre-authorisation exists, and the Task points to it.
- A reprocess has a clear reason and new supporting documents attached.
- The header carries the correlation ID of the original claim or pre-authorisation.

### Postconditions

- NHCX answers `202` at once. That only means the message was accepted.
- The payer's answer arrives later on `/v1/task/on_submit`.
- Only a submitted or approved pre-authorisation can be cancelled.

### Common mistakes

- Leaving out the reference to the original claim or pre-authorisation.
- Using a new correlation ID instead of the original one.
- Spelling the input anything other than `intimationNumber`.
- Cancelling a pre-authorisation that is already cancelled or paid.

### Best practices

- Link the Task to the original entity twice: basedOn with the sender's reference ID and Task.input with claimNumber and intimation number.
- Use reasonCode other only with a clear Task.description.
- Persist the correlation ID and workflow ID so the on_submit Task bundle can be matched and the ClaimResponse extracted from Task.output.
- Design the case state machine so 252 or 253 terminates the appeal branch.
- Fresh API_call_ID per call, IST timestamps, request.initiated on the outbound header.
- Implement v1/error; a Task that never reaches the payer is otherwise silent.

### Related scenario

A hospital's claim for a cardiac package, submitted on /v1/claim/submit, comes back on /v1/claim/on_submit rejected for a missing implant invoice. The billing team obtains the invoice and the integration builds a Task: code reprocess, reasonCode claimrejected, basedOn the original claim, input claimNumber and intimation number, the invoice attached, workflow 18, and the claim's correlation ID. It posts /v1/task/submit and receives 202. The payer acknowledges (251), re-adjudicates and returns a Task bundle on /v1/task/on_submit whose Task.output wraps a ClaimResponse with outcome complete and workflow 252; a payment notice follows on /v1/paymentnotice/request.

### Specification

Chapter [Cancel, reprocess and shortfall](/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/task/submit \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1000004446@hcx' \
  --header 'x-hcx-recipient_code: 1518@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 18' \
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
- `x-hcx-workflow_id` (string): Which step, or which case. See the two readings below. Optional on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string): The beneficiary's ABHA number. Optional: send it when the beneficiary has an ABHA number. Optional on the envelope.

## Body

- `payload` (string)

## Responses

- `202`: The gateway returns HTTP 202 with a StatusSuccessResponse whose result carries entity_type task and a protocol_status; 400, 404 and 500 use the same envelope.

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "25/08/2026 10:00:00:154",
  "api_call_id": "f2a3b4c5-d6e7-8901-5678-012345678901",
  "correlation_id": "66778899-aabb-ccdd-eeff-001122334455",
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
