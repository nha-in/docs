# Receive predetermination callback

`POST v1_predetermination_on_submit`

Hosted by the provider. The exchange posts this message to the `endpoint_url` you registered, at `/v1/predetermination/on_submit`, with the headers and the sealed payload the sender posted. Answer HTTP 202 with the receipt first and process afterwards; [Receiving a callback](/docs/nhcx/v1/getting-started/receiving-a-callback) has the rules.

Payer returns its estimate for a predetermination request to the provider: a `ClaimResponse` with `use` `predetermination` and the benefit it would approve. This is use case C11.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcxv1_predetermination_on_submit \
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
