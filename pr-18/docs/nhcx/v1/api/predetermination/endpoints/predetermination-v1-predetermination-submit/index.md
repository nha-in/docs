# Submit the predetermination request

`POST /v1/predetermination/submit`

Provider asks the payer what it would approve for a proposed treatment before committing to a pre-authorisation. The bundle has the pre-authorisation's shape with `Claim.use` `predetermination`. This is use case B9.

### Business purpose

A hospital planning a treatment can learn the benefit a payer would approve for it before the patient is admitted, and plan the admission and the patient's share of the cost around the answer. The payer gives an estimate only. Nothing is reserved, and the treatment still needs a pre-authorisation when it happens.

### When to use

Before a planned admission, with a payer that has confirmed it supports predetermination. The exchange is specified but seldom used, so confirm support with the payer before building it. Send `x-hcx-status` `request.initiated` with a new correlation ID. The payer's answer, use case C11, arrives on `/v1/predetermination/on_submit`.

### Preconditions

- The payer has confirmed that it answers predetermination requests.
- The bundle carries `Claim`, `Patient`, the provider and payer `Organization`, `Coverage`, `Practitioner` and `Procedure`, shaped as in the pre-authorisation chapters.
- `Claim.use` is `predetermination`, and `Claim.identifier[0].value` carries your predetermination reference.
- A valid session token, the recipient's certificate, and the bundle sealed as a JWE in `payload`, with the protected headers mirrored onto the wire.
- A fresh `x-hcx-API_call_ID` and a new `x-hcx-correlation_ID` for the cycle.

### Postconditions

NHCX returns HTTP 202 with the acknowledgement and forwards the request asynchronously. The payer answers on `/v1/predetermination/on_submit` with a `ClaimResponse` whose `use` is `predetermination`, carrying the estimated approved benefit in `ClaimResponse.total` under category `benefit`. Nothing is reserved against the policy.

### Common mistakes

- Building the exchange before the payer has confirmed it supports it.
- Leaving `Claim.use` as `preauthorization` when reusing the pre-authorisation builder.
- Treating the estimate as an approval and skipping the pre-authorisation at admission.
- Reusing a correlation ID from an earlier cycle, which NHCX refuses as a duplicate (`NHCX-1006`).

### Best practices

- Reuse the pre-authorisation bundle builder and change only `Claim.use` and the reference.
- Store the answer against the planned case, labelled as an estimate.
- Key the request on its correlation ID, and host `/v1/error` so an undelivered request does not look like one still under review.

### Related scenario

A hospital planning an elective admission asks the payer what it would approve for procedure `MG004A`. It builds the pre-authorisation bundle with `Claim.use` `predetermination` and reference `PD0000000001`, posts it here with a new correlation ID, and gets 202 back. The payer's `ClaimResponse` arrives later on `/v1/predetermination/on_submit` with an estimated benefit of 15500.00. The desk records it as an estimate, and raises a pre-authorisation when the patient is admitted.

### Specification

Chapter [Predetermination, status and search](/docs/nhcx/v1/reference/fhir/predetermination-status-and-search) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/predetermination/submit \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: <participant code>' \
  --header 'x-hcx-recipient_code: <recipient code>' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-correlation_id: <correlation id>' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: request.initiated' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "<compact JWE>"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.
- `x-hcx-sender_code` (string, required): Your participant code. Mandatory on the envelope.
- `x-hcx-recipient_code` (string, required): The recipient's. For a provider, the processor code from the policy lookup. Mandatory on the envelope.
- `x-hcx-api_call_id` (string, required): Fresh on every message, including responses. Mandatory on the envelope.
- `x-hcx-correlation_id` (string, required): The thread. See the rule below. Mandatory on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.

## Body

- `payload` (string)

## Responses

- `202`: NHCX returns HTTP 202 with the acknowledgement and forwards the request asynchronously.

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "19/03/2026 11:46:35:120",
  "api_call_id": "{{$guid}}",
  "correlation_id": "{{correlationId}}",
  "error": {
    "code": "",
    "message": ""
  }
}
```
