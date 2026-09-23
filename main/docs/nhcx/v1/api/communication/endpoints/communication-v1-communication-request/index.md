# Submit the communication request

`POST /v1/communication/request`

Payer pushes a Task plus Communication bundle to a provider mid-claim: TAT alerts, wallet or policy changes, grievances or extra-information requests.

### Business purpose

Every other NHCX exchange is provider-initiated and expects a matching response. Communication inverts that: it is the payer's asynchronous, event-driven channel into the hospital system, used when something must be said about an in-flight case without the provider having asked. It carries TAT breach alerts, grievance notices, wallet or benefit updates, policy or package-rate changes, requests for additional evidence and claim-arbitration intimations. Hospitals benefit because these signals arrive in a structured, routable bundle rather than by phone or email, and payers benefit because adjudication can proceed without waiting for an out-of-band exchange.

### When to use

The payer uses it to send the provider a message outside the pre-authorisation or claim flow, such as a delay notice, a grievance or a request for more information. The workflow code in the header must match the related claim or pre-authorisation.

### Preconditions

- A valid access token and the provider's certificate.
- The bundle is encrypted for the provider.
- The header carries `x-hcx-status` `request.initiated` and a fresh correlation ID.

### Postconditions

- NHCX answers `202` at once. That only means the message was accepted.
- The provider's acknowledgement arrives later on `/v1/communication/on_request`, with the same correlation ID.

### Common mistakes

- Treating the `202` as the provider's answer.
- Sending a workflow code that does not match the related claim or pre-authorisation.
- Reusing a correlation ID from an earlier or failed cycle.
- Using it in place of the query inside a `ClaimResponse`.

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
- `x-hcx-request_id` (string): One per originating request. The Open Protocol page marks it Mandatory; the Technical Specifications page marks it Optional. Optional on the envelope. Send it anyway, as a fresh UUID per originating request: it is cheap and satisfies both readings until NHA rules.
- `x-hcx-correlation_id` (string, required): The thread. See the rule below. Mandatory on the envelope.
- `x-hcx-workflow_id` (string): Which step, or which case. See the two readings below. Optional on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string): The beneficiary's ABHA number. Optional: send it when the beneficiary has an ABHA number. Optional on the envelope.

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
