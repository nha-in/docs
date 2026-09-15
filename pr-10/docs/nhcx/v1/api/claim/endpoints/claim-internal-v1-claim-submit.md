# Claim submit (internal) (adapter)

`POST /internal/v1/claim/submit`

Internal twin of /v1/claim/submit (operationId claimSubmitPostInternal) with the same JWEPayload body and response set.

### Business purpose

The claim service publishes its submit operation twice, at /v1 and at /internal/v1. Both let a provider submit or resubmit the final claim bundle for adjudication and settlement. The internal path is documented only as a distinct operationId on the same contract; no separate business purpose is described for it.

### When to use

Documented as the internal variant of claim submit, consumed by providers with a JWEPayload body. The same workflow discriminators apply: 15 for the final claim, 151 for a claim query response, with x-hcx-use_case New or Resubmit and x-hcx-status request.initiated. The OpenAPI specs expose this operation twice, at /v1/... and at /internal/v1/..., with identical descriptions, request bodies and response sets; only the operationId differs (an Internal suffix). The specs do not document what makes the internal variant different beyond that suffix, so treat it as a mirror of the public path and integrate against the public /v1 path unless NHCX onboarding tells you otherwise.

### Preconditions

Identical to /v1/claim/submit: an approved preauth for the case, Claim.use set to claim with preAuthRef and final amounts, the complete document set and discharge information, PMJAY authentication or consent questionnaire, a valid Bearer token, the payer certificate, JWE encryption and a fresh correlation ID. Nothing additional is documented for the internal route.

### Postconditions

Same as the public path: HTTP 202 Accepted with a StatusSuccessResponse acknowledgement, asynchronous forwarding to the payer, and one or more ClaimResponseBundles on the claim callback (the internal twin /internal/v1/claim/on_submit exists with the same body). 400, 404 and 500 carry the same schema.

### Common mistakes

- Assuming a different body or semantics for the internal route; the spec gives it the same JWEPayload body and responses.
- Using it without confirmation from NHCX onboarding and then chasing a 404; try the alternate host and prefix shape before escalating.
- Every public claim-submit pitfall applies unchanged: no approved preauth (PAYR-1302), duplicate claim (PAYR-1301), amount above the approved preauth (PAYR-1012), wrong workflow ID (PAYR-1321), reused correlation ID (NHCX-1006).

### Best practices

- Default to /v1/claim/submit and keep the internal path as a configuration option only.
- Share one client implementation across both paths so header hygiene, encryption and correlation handling cannot diverge.
- Record which variant carried each correlation ID for support conversations.

### Related scenario

A hospital's HMIS vendor reading the claimhcxservice OpenAPI notices claimSubmitPost and claimSubmitPostInternal side by side. They implement a single claim client against /v1/claim/submit, parameterise the base path, and ask NHCX support whether the internal twin is relevant to their deployment. The end-to-end flow is unchanged: the claim goes out under workflow 15 after discharge, returns a 202, and the payer's adjudication arrives on the claim callback.

### Specification

Chapter [Claim request](/docs/nhcx/v1/reference/fhir/claim-request) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/internal/v1/claim/submit \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1000004446@hcx' \
  --header 'x-hcx-recipient_code: 1518@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 15' \
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

- `202`: Same as the public path: HTTP 202 Accepted with a StatusSuccessResponse acknowledgement, asynchronous forwarding to the payer, and one or more ClaimResponseBundles on the claim callback (the internal twin /internal/v1/claim/on_submit exists with the same body).

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "19/03/2026 11:46:35:120",
  "api_call_id": "5d4c3b2a-1f0e-4d9c-8b7a-6f5e4d3c2b1a",
  "correlation_id": "5d4c3b2a-1f0e-4d9c-8b7a-6f5e4d3c2b1a",
  "result": {
    "sender_code": "1000004446@hcx",
    "recipient_code": "1518@hcx",
    "entity_type": "claim",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
