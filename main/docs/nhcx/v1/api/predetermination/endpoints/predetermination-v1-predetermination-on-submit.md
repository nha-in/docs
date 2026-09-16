# Predetermination callback

`POST /v1/predetermination/on_submit`

Payer returns its estimate for a predetermination request to the provider: a `ClaimResponse` with `use` `predetermination` and the benefit it would approve. This is use case C11.

### Business purpose

The callback carries the payer's view of what it would pay for a proposed treatment, so the hospital can plan the admission and counsel the patient before any money is committed. For the payer it is the record of the estimate it gave.

### When to use

Called by the payer after it has assessed a request received on `/v1/predetermination/submit`, echoing that request's correlation ID with `x-hcx-status` `response.complete`. Only payers that have agreed to support predetermination send it.

### Preconditions

- A predetermination request with this correlation ID exists in NHCX. A callback for an unknown one is refused with `NHCX-1010`.
- The bundle carries `ClaimResponse`, `Patient`, the payer and provider `Organization` and `Coverage`.
- `ClaimResponse.use` is `predetermination`, and the estimated approved benefit is in `ClaimResponse.total` under category `benefit`.
- The payer holds a valid session token and the provider's certificate, and seals the bundle for the provider.
- `x-hcx-correlation_id` echoes the request, `x-hcx-api_call_id` is new, and the sender and recipient codes are swapped.

### Postconditions

NHCX returns HTTP 202 with the acknowledgement and delivers the callback to the provider, which must answer 202 with a receipt within 30 seconds. A delivery that is not acknowledged is retried five times, after which the exchange retires the correlation ID and reports the failure on `/v1/error`. The estimate reserves nothing against the policy.

### Common mistakes

- Minting a new correlation ID instead of echoing the request's.
- Reading the estimate as an approval on the provider side.
- The provider answering with anything other than 202 and the receipt, which triggers retries.

### Best practices

- Provider: acknowledge first, then decrypt, then store the estimate against the planned case.
- Provider: make the handler idempotent, since a missed receipt means the same message arrives again with the same `x-hcx-api_call_id`.
- Payer: explain the estimate in `ClaimResponse.disposition`, as the reference sample does.

### Related scenario

A payer receives a predetermination request for procedure `MG004A` under reference `PD0000000001`. Its adjudicator assesses the proposed treatment, and the payer posts a `ClaimResponse` with `use` `predetermination`, outcome `complete` and a benefit total of 15500.00 to this endpoint on the request's correlation ID. The hospital's callback answers 202 within 30 seconds and files the figure as an estimate for the planned admission.

### Specification

Chapter [Predetermination, status and search](/docs/nhcx/v1/reference/fhir/predetermination-status-and-search) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/predetermination/on_submit \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: <participant code>' \
  --header 'x-hcx-recipient_code: <recipient code>' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-correlation_id: <correlation id>' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: response.complete' \
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

- `202`: NHCX returns HTTP 202 with the acknowledgement and delivers the callback to the provider, which must answer 202 with a receipt within 30 seconds.

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
