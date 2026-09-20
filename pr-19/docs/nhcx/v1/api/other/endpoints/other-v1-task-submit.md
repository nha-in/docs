# Submit the task submit (reprocess or cancel)

`POST /v1/task/submit`

Provider sends an FHIR Task asking the payer to reprocess a rejected or short-paid claim or to cancel a preauth; Task.code and reasonCode set the intent.

### Business purpose

Claims are often not fully approved first time, for mundane reasons: missing documents, policy interpretation differences, package or pricing discrepancies. Without a formal appeal path, disputes leave the system and become phone calls and email. The Task flow gives providers a structured, auditable way to contest a decision with new evidence, and to withdraw a pre-authorisation that will never be used. Payers get a controlled re-adjudication workflow with SLA adherence, aligned with NHA and IRDAI expectations of transparent dispute resolution.

### When to use

After adjudication, when a claim was rejected or partially paid and you have valid justification and additional evidence: Task.code reprocess with reasonCode claimrejected (or partialpayment for a short payment; the handbook sample uses rejectiondisputed), workflow 18 REPROCESS_REQUEST_SUBMITTED, with 36 listed for the arbitration or erroneous case. For cancelling a submitted or approved preauth: Task.code cancel with a cancellation reasonCode (treatmentplanchanged, patientrequest, financialconstraints, alternativetreatment, duplicateclaim, administrativeerror, other), workflow 122 PREAUTH_CANCEL_INITIATED (PC01 in the scenario sheet). x-hcx-correlation_ID carries the correlation ID of the original claim or preauth. Reprocess outcomes are final within the workflow.

### Preconditions

- Provider is an active NHCX participant with a valid NPI facility code and Bearer token; payer certificate available for JWE encryption.
- The original claim or preauth exists; Task.basedOn references it with the sender's reference ID, and Task.input carries claimNumber and the intimation number.
- Patient resource carries PMJAY Member ID and ABHA number; supporting evidence attached (the FAQ says a document as valueAttachment is mandatory for reprocess).
- Task.status requested, Task.intent order, Task.code from http://terminology.hl7.org/CodeSystem/financialtaskcode, reasonCode from ndhm-reason-code; Task.description explains when reasonCode is other.
- Protected header with the original correlation ID, fresh API_call_ID, IST TIMESTAMP, workflow ID and status request.initiated.

### Postconditions

The gateway returns HTTP 202 with a StatusSuccessResponse whose result carries entity_type task and a protocol_status; 400, 404 and 500 use the same envelope. The payer validates completeness and eligibility (workflow 251 acknowledges receipt), re-adjudicates and answers on /v1/task/on_submit with a Task bundle whose Task.output references a ClaimResponse: 252 approved, 253 rejected (outcome complete with adjudication reason cancelled), 254 queried (answer with workflow 19). Approval may be followed by payment workflows 30, 31 and 33. For cancellation, only preauths in submitted or approved state can be cancelled; PAYR-1252, PAYR-1253, PAYR-1257 and PAYR-1258 explain refusals.

### Common mistakes

- Omitting Task.basedOn, so the payer has nothing to act on; or sending the sender's reference only in input and not in basedOn.
- Minting a fresh correlation ID instead of carrying the original claim or preauth's.
- Submitting a reprocess without new evidence; the handbook restricts appeals to cases with valid justification and supporting documents.
- Cancelling a preauth that is already cancelled, paid or not in an active state (PAYR-1252, PAYR-1253, PAYR-1257, PAYR-1258).
- Spelling the intimation input anything other than intimationNumber; a reprocess under another spelling is refused with PAYR-1008.
- Offering a second reprocess by default; the response is final unless scheme rules allow otherwise.
- Using unverified codes such as a numeric PC01 reason or workflow 36 for a plain reprocess without checking the workflow reference.

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
- `x-hcx-request_id` (string): One per originating request. The Open Protocol page marks it Mandatory; the Technical Specifications page marks it Optional. Optional on the envelope.
- `x-hcx-correlation_id` (string, required): The thread. See the rule below. Mandatory on the envelope.
- `x-hcx-workflow_id` (string): Which step, or which case. See the two readings below. Optional on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string, required): The beneficiary's ABHA number. Mandatory on every exchange, including those with no beneficiary in the payload. Mandatory on the envelope.

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
