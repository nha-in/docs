# Submit the predetermination request

`POST /v1/predetermination/submit`

Provider asks the payer what it would approve for a proposed treatment before committing to a pre-authorisation. The bundle has the pre-authorisation's shape with `Claim.use` `predetermination`. This is use case B9.

### Business purpose

A hospital planning a treatment can learn the benefit a payer would approve for it before the patient is admitted, and plan the admission and the patient's share of the cost around the answer. The payer gives an estimate only. Nothing is reserved, and the treatment still needs a pre-authorisation when it happens.

### When to use

Use it before a planned admission to ask what the payer would approve for a treatment. Few payers support it, so confirm with the payer first.

### Preconditions

- The payer has confirmed it answers predetermination requests.
- You have a valid access token and the payer's certificate.
- The bundle is an FHIR `Claim` with `use` set to `predetermination`, encrypted for the payer.
- The correlation ID is new for this request.

### Postconditions

- NHCX answers `202` at once and forwards the request.
- The payer's estimate arrives later on `/v1/predetermination/on_submit`. Nothing is reserved against the policy.

### Common mistakes

- Building the exchange before the payer confirms support.
- Leaving `use` as `preauthorization` when reusing the pre-authorisation code.
- Treating the estimate as an approval and skipping the pre-authorisation.
- Reusing a correlation ID from an earlier request.

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
