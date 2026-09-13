# Receive error report (callback)

`POST v1_error`

Hosted by every participant. The exchange posts this message to the `endpoint_url` you registered, at `/v1/error`, with the headers and the sealed payload the sender posted. Answer HTTP 202 with the receipt first and process afterwards; [Receiving a callback](/docs/nhcx/v1/getting-started/receiving-a-callback) has the rules.

Where the exchange tells a sender that a request could not be delivered after five attempts. Received by every participant under its registered address. There is no outbound form.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcxv1_error \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: nhcx-gateway@hcx' \
  --header 'x-hcx-recipient_code: 1000004446@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-correlation_id: <correlation id>' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: response.error' \
  --header 'Content-Type: application/json' \
  --data '{
  "type": "ProtocolResponse",
  "x-hcx-sender_code": "nhcx-gateway@hcx",
  "x-hcx-recipient_code": "1000004446@hcx",
  "x-hcx-api_call_id": "<uuid>",
  "x-hcx-correlation_id": "<correlation id>",
  "x-hcx-workflow_id": "12",
  "x-hcx-timestamp": "<iso timestamp>",
  "x-hcx-status": "response.error",
  "x-hcx-error_details": {
    "code": "ERR_DELIVERY_FAILED",
    "message": "Recipient endpoint unreachable after five attempts",
    "trace": ""
  },
  "x-hcx-entity-type": "preauth"
}'
```
