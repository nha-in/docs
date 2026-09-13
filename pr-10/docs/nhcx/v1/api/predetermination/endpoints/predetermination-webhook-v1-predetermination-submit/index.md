# Receive predetermination request

`POST v1_predetermination_submit`

Hosted by the payer. The exchange posts this message to the `endpoint_url` you registered, at `/v1/predetermination/submit`, with the headers and the sealed payload the sender posted. Answer HTTP 202 with the receipt first and process afterwards; [Receiving a callback](/docs/nhcx/v1/getting-started/receiving-a-callback) has the rules.

Provider asks the payer what it would approve for a proposed treatment before committing to a pre-authorisation. The bundle has the pre-authorisation's shape with `Claim.use` `predetermination`. This is use case B9.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcxv1_predetermination_submit \
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
