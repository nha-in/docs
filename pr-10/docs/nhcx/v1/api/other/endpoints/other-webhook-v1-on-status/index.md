# Receive status callback

`POST v1_on_status`

Hosted by the provider. The exchange posts this message to the `endpoint_url` you registered, at `/v1/on_status`, with the headers and the sealed payload the sender posted. Answer HTTP 202 with the receipt first and process afterwards; [Receiving a callback](/docs/nhcx/v1/getting-started/receiving-a-callback) has the rules.

The answer to a status request, delivered to the sender that asked. The `x-hcx-status` in the protected header says where the message you asked about got to. The payload is an empty string.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcxv1_on_status \
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
