# Submit the communication request

`POST /v1/communication/request`

Payer pushes a Task plus Communication bundle to a provider mid-claim: TAT alerts, wallet or policy changes, grievances or extra-information requests.

### Business purpose

Every other NHCX exchange is provider-initiated and expects a matching response. Communication inverts that: it is the payer's asynchronous, event-driven channel into the hospital system, used when something must be said about an in-flight case without the provider having asked. It carries TAT breach alerts, grievance notices, wallet or benefit updates, policy or package-rate changes, requests for additional evidence and claim-arbitration intimations. Hospitals benefit because these signals arrive in a structured, routable bundle rather than by phone or email, and payers benefit because adjudication can proceed without waiting for an out-of-band exchange.

### When to use

Call it whenever the payer needs to communicate outside the direct request-response lifecycle of a preauth or claim. It does not replace the in-band query path (ClaimResponse outcome=partial with a DOC_MISSING processNote); both can be in flight for the same case. The scenario is identified by Task.reasonCode: tatquery, grievance, walletupdate, policychange, additionalinfo and the arbitration code (spelt claimArbitration in one handbook table and claimArbitartion in another). Send x-hcx-status request.initiated; the x-hcx-workflow_ID must be the workflow of the associated claim or preauth and is validated at the gateway.

### Preconditions

- Payer and provider both registered on NHCX; a valid Bearer token from the client-credentials session call (1200 s expiry).
- The provider's public certificate fetched via /fetch/certs (cache up to 24 h) and used to JWE-encrypt with RSA-OAEP-256 and A256GCM.
- A collection Bundle containing a Task (status completed, intent proposal, code poll, input type include) that references a Communication or CommunicationRequest carrying category, priority and topic; the identifiers key off the claim or preauth reference.
- Protected header with x-hcx-sender_code, x-hcx-recipient_code, x-hcx-API_call_ID, x-hcx-correlation_ID, x-hcx-workflow_ID, x-hcx-timestamp (IST +05:30) and x-hcx-status request.initiated. A fresh UUID correlation ID opens the conversation.
- HTTP headers Accept, Content-Type and bearer_auth.

### Postconditions

The gateway validates the JWE headers, workflow ID and NIIP and returns HTTP 202 with a StatusSuccessResponse (timestamp, API_call_ID, correlation_ID, result with sender_code, recipient_code, entity_type and protocol_status, and an error object). Nothing is decided synchronously; the gateway forwards the bundle to the provider's registered callback. The provider must acknowledge with 202 within 30 seconds, then close the loop by posting an acknowledgement Task bundle to /v1/communication/on_request under the same x-hcx-correlation_ID. Errors are 400 (validation failed), 404 and 500, all in the same envelope. Communication.status completed describes the event, not the resolution of the underlying issue.

### Common mistakes

- Treating the 202 as delivery or as the provider's answer; the acknowledgement comes later on on_request.
- Sending a workflow ID that does not match the associated claim or preauth, which fails gateway validation (PAYR-1003 Invalid workflow requested).
- Wrong x-hcx-status spelling (request.initiate instead of request.initiated) producing NHCX-1011.
- Reusing a correlation ID from an earlier cycle (NHCX-1006 Duplicate request) or from a failed cycle, which NHCX has made inactive.
- Copying the sandbox sample's swapped Organisation identifier types (NIIP versus NPI), a known data-quality defect.
- Using Communication as a substitute for the in-band ClaimResponse query mechanism.

### Best practices

- Mint a new UUID for x-hcx-API_call_ID on every call and for x-hcx-correlation_ID on every new communication cycle, including retries after failure.
- Put the routing intent in Task.reasonCode and the message classification in Communication.category, topic and priority; pair additionalinfo with category instruction or questionnaire.
- Use IST timestamps; UTC causes validation failures.
- Persist the correlation ID before posting so the on_request acknowledgement can be matched.
- Expect up to five redeliveries if the provider mis-acknowledges; keep your own handling idempotent.
- Implement v1/error so a message that never reaches the provider is reported back to you.

### Related scenario

A state health agency's TPA notices that a cashless claim from a district hospital has sat in adjudication past the scheme's turnaround threshold. It builds a Task bundle with reasonCode tatquery, category reminder, topic progress-update and priority asap, encrypts it for the hospital and posts /v1/communication/request with the workflow ID of the claim submitted earlier on /v1/claim/submit. The gateway returns 202 and forwards the bundle. The hospital's claims desk is alerted, and its system posts the acknowledgement Task on /v1/communication/on_request with the same correlation ID. Adjudication then continues and the outcome arrives on /v1/claim/on_submit as usual.

### Specification

Chapter [Communication](/docs/nhcx/v1/reference/fhir/communication) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/communication/request \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1518@hcx' \
  --header 'x-hcx-recipient_code: 1000004446@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 15' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: request.initiated' \
  --header 'x-hcx-ben-abha-id: 91711234567890' \
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

- `202`: The gateway validates the JWE headers, workflow id and NIIP and returns HTTP 202 with a StatusSuccessResponse (timestamp, api_call_id, correlation_id, result with sender_code, recipient_code, entity_type and protocol_status, and an error object).

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "25/08/2026 11:46:35:120",
  "api_call_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "correlation_id": "11223344-5566-7788-99aa-bbccddeeff00",
  "result": {
    "sender_code": "1518@hcx",
    "recipient_code": "1000004446@hcx",
    "entity_type": "task",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
