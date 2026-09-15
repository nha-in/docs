# Claim callback

`POST /v1/claim/on_submit`

Payer returns interim (response.partial) and final (response.complete) ClaimResponseBundles for a claim to the provider via NHCX.

### Business purpose

This callback carries the payer's adjudication of the final claim, possibly in several stages. Interim partial responses let the payer signal receipt, processing and queries while the claim stays open; the complete response fixes the financial decision (approved, partially approved or rejected) and triggers payment advice and settlement. For the hospital it is the source of truth for what will be paid and why; for the payer it is the auditable record of the decision.

### When to use

Called by the payer or TPA after each adjudication step on a /v1/claim/submit message, with the same correlation ID. Workflow IDs: 25 CLAIM_REQUEST_RECEIVED, 28 CLAIM_REQUEST_IN_PROCESS and 29 CLAIM_FORWARDED with x-hcx-status response.partial; 27 CLAIM_REQUEST_QUERIED (framed as request.initiated in the NHA sheet, answered by the provider under 151); 26 CLAIM_REQUEST_APPROVED with response.complete; rejection with outcome complete and adjudication reason cancelled. ClaimResponse.outcome complete plus reason approved is approval, complete plus cancelled is rejection, partial plus approved is partial approval, partial plus queried is a query with totals at zero.

### Preconditions

- A claim request with this correlation ID exists in NHCX (NHCX-1010 otherwise) and has not been closed by an earlier response.complete.
- The payer has a valid Bearer token and the provider's certificate, and encrypts the ClaimResponseBundle for the provider.
- x-hcx-correlation_id echoes the request; x-hcx-api_call_id is new; sender and recipient codes are swapped; x-hcx-status is response.partial, response.complete or response.error.
- Adjudication categories (submitted, eligible, copay, benefit) and total[].category codes are populated; processNote explains reductions; query text is carried in the adjudication reason display.
- Protocol errors are a ProtocolResponse with x-hcx-error_details; business errors are inside the encrypted resource.

### Postconditions

HTTP 202 Accepted with the StatusSuccessResponse acknowledgement (entity_type claim) from NHCX, then asynchronous delivery to the provider's callback, which must acknowledge with 202 within 30 seconds or NHCX retries up to five times before deleting the request. After a response.partial the claim remains open and further callbacks on the same correlation ID are expected. After a response.complete no further provider submissions or payer responses are permitted against that claim identifier; an approval starts the payment notices 30, 31 and 33, and a rejection leaves the provider the option of a reprocess request (workflow 36) via /v1/task/submit.

### Common mistakes

- Provider side: treating outcome complete as approval without checking adjudication[0].reason.coding.code; a rejection is also complete.
- Provider side: stopping monitoring after the first callback; multiple partial responses may precede the complete one.
- Provider side: reading a carried-over benefit total on a rejected response as payable, or keying totals by array index instead of category code.
- Provider side: returning anything other than 202 with the acceptance body, which triggers retries and eventual deletion.
- Payer side: sending a further response after response.complete on the same claim identifier, or minting a new correlation ID.
- Payer side: using JWEPayloadResponse instead of ProtocolResponse for protocol rejections (PAYR-1517).

### Best practices

- Provider: acknowledge first, then decrypt, then update case state; be idempotent on correlation ID and api_call_id.
- Provider: parse the PMJAY query audit trail (USER~datetime~type~comment~trust, entries separated by |) as a plain string.
- Provider: on complete plus approved, trigger settlement tracking and await 30, 31 and 33; the claim is only closed when 33 arrives and the UTR is persisted.
- Payer: emit 25 on receipt and 28 during processing so the desk sees progress, and put reduction reasons in processNote linked by noteNumber.
- Both: keep x-hcx-status and x-hcx-workflow_id consistent with the NHA status sheet, since the pair identifies the message.

### Related scenario

A state health agency receives a final claim for 13700 INR against an approved preauth. Its bridge first posts 25 (received) and 28 (in process) as response.partial to /v1/claim/on_submit. The medical auditor finds the investigation report missing and the bridge posts 27 with the query text in the adjudication reason display; the hospital answers under 151 on /v1/claim/submit. Satisfied, the payer posts 26 with outcome complete, reason approved and benefit 13700 as response.complete. The hospital's callback acknowledges each message within 30 seconds, marks the claim adjudicated and waits for the payment notice under workflow 30.

### Specification

Chapter [Claim response](/docs/nhcx/v1/reference/fhir/claim-response) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/claim/on_submit \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1518@hcx' \
  --header 'x-hcx-recipient_code: 1000004446@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 26' \
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

- `202`: HTTP 202 Accepted with the StatusSuccessResponse acknowledgement (entity_type claim) from NHCX, then asynchronous delivery to the provider's callback, which must acknowledge with 202 within 30 seconds or NHCX retries up to five times before deleting the request.

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "19/03/2026 11:46:35:120",
  "api_call_id": "9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d",
  "correlation_id": "5d4c3b2a-1f0e-4d9c-8b7a-6f5e4d3c2b1a",
  "result": {
    "sender_code": "1518@hcx",
    "recipient_code": "1000004446@hcx",
    "entity_type": "claim",
    "protocol_status": "request.dispatched"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
