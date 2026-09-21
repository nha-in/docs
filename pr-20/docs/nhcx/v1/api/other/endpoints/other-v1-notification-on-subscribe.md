# Submit the notification on_subscribe

`POST /v1/notification/on_subscribe`

BSP-side subscription acknowledgement; the same name denotes the callback where NHCX pushes claim-event notifications for a subscribed ABHA ID.

### Business purpose

Two things share this name. The API reference defines an NHCX-side operation (operationId onSubscribe) that takes a NotificationOnSubscribePayload with the beneficiary's abhaid, optional domain_values and plain header values, and returns a SubscribeResponse; it is described as the BSP-side subscription persistence acknowledgement. The integration guide uses the same path on the BSP's own host as the callback where NHCX delivers notifications. Together they complete the beneficiary-facing loop: the patient's app learns, in plain language, that a preauth was approved, a claim adjudicated, a payment made or information requested. The caller is a Beneficiary Service Provider; the persona label is the nearest available.

### When to use

As a BSP you implement this path on your host, registered through on_notification_URL, and receive a push whenever a workflow event occurs for a subscribed ABHA ID: preauth_request (queued, processing), preauth_response (approved, rejected), claim_request, claim_response, payment_notice (paid, pending) and communication (information_required). The NHCX-side operation is invoked with hvalues senderid, receiverid, correlationid and status required, and workflowid, source, API_caller_ID, call_type and usertoken optional. It sits outside the workflow-code sequence; domain_values may carry x-hcx-workflow_ID, x-hcx-correlation_ID, x-hcx-status, x-hcx-action and amount fields.

### Preconditions

- An active subscription created via /v1/notification/subscribe for the ABHA ID; Last-Linked-Wins means only the most recently linked app receives events.
- The BSP callback exposed over HTTPS with TLS 1.2 or higher at the registered on_notification_URL, validating the JWT from NHCX, verifying sender_code and rate-limiting.
- For the NHCX-side operation: a NotificationOnSubscribePayload with request.abhaid (required) and optional request.domain_values, plus hvalues with senderid, receiverid, correlationid and status.
- The ordinary preauth or claim exchange between hospital and payer has produced an event for that beneficiary.

### Postconditions

The NHCX-side operation returns HTTP 200 with a SubscribeResponse (timestamp, API_call_ID, correlation_ID, subscription_ID, subscription_status active, replaced or expired, expiry, message); 400, 401, 403, 409 and 500 return a StatusSuccessResponse with the same descriptions as the subscribe table. On the BSP callback the delivered payload carries notification_ID, topic_code, timestamp, subscriber.ID, a human-readable message that can be shown directly to the user, and optional domain_values with x-hcx-* headers for audit or custom formatting. Nothing changes in the hospital-payer exchange; the notification is a forked copy of the outcome.

### Common mistakes

- Conflating the NHCX-side operation with your own callback and implementing only one of them.
- Parsing domain_values to build the user message instead of displaying the message field; domain_values is optional and may be absent.
- Reading status from the x-hcx-workflow_ID description (approved, rejected, queued, processing), which is a documentation error; the example carries an identifier and status lives in x-hcx-status.
- Assuming the subscription is still yours; a subscription_status of replaced means another app took the routing slot on login.
- Accepting callbacks without validating the JWT or sender_code, or without TLS 1.2 or higher.
- Treating the senderid and receiverid descriptions (payer ID, hospital ID) literally in the notification context; they are inherited boilerplate.

### Best practices

- Display message verbatim; keep domain_values for audit logging or advanced formatting only.
- Validate the JWT and sender_code on every inbound push, enforce TLS 1.2 or higher and rate limiting.
- Map event types (preauth_response, claim_response, payment_notice, communication) to in-app timelines using x-hcx-action and x-hcx-status.
- Show subscription status in settings so a replaced subscription is visible to the user; resubscribe on next login.
- Keep the endpoint fast and idempotent on notification_ID.

### Related scenario

A PHR app has subscribed ravi@ABDM to workflow_events. A hospital submits a claim on /v1/claim/submit for that beneficiary and the payer adjudicates it on /v1/claim/on_submit. NHCX forks the outcome to the app's registered on_subscribe callback with topic_code workflow_events, a message stating the claim was approved with the amount, and domain_values including x-hcx-action claim_response and x-hcx-status response.complete. The app validates the JWT and sender_code, shows the message on the patient's timeline, and when the payer later sends a payment notice on /v1/paymentnotice/request the next push reads paid.

### Specification

Chapter [Notifications and patient apps](/docs/nhcx/v1/reference/notifications-and-patient-apps) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/notification/on_subscribe \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "request": {
    "abhaid": "ravi@abdm",
    "domain_values": {
      "x-hcx-workflow_id": "wf_20260825_001",
      "x-hcx-correlation_id": "corr_20260825_12345",
      "x-hcx-timestamp": "2026-08-25T14:30:00+05:30",
      "x-hcx-sender_code": "payor.icici@nhcx",
      "x-hcx-recipient_code": "bsp.phrapp@nhcx",
      "x-hcx-status": "response.complete",
      "x-hcx-action": "preauth_response",
      "x-hcx-amount_submitted": "75000.00"
    }
  },
  "hvalues": {
    "senderid": "payor.icici@nhcx",
    "receiverid": "bsp.phrapp@nhcx",
    "correlationid": "corr_20260825_12345",
    "status": "response.complete",
    "workflowid": "wf_20260825_001"
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `request` (object)
- `request.abhaid` (string)
- `request.domain_values` (object)
- `request.domain_values.x-hcx-workflow_id` (string)
- `request.domain_values.x-hcx-correlation_id` (string)
- `request.domain_values.x-hcx-timestamp` (string)
- `request.domain_values.x-hcx-sender_code` (string)
- `request.domain_values.x-hcx-recipient_code` (string)
- `request.domain_values.x-hcx-status` (string)
- `request.domain_values.x-hcx-action` (string)
- `request.domain_values.x-hcx-amount_submitted` (string)
- `hvalues` (object)
- `hvalues.senderid` (string)
- `hvalues.receiverid` (string)
- `hvalues.correlationid` (string)
- `hvalues.status` (string)
- `hvalues.workflowid` (string)

## Responses

- `200`: The NHCX-side operation returns HTTP 200 with a SubscribeResponse (timestamp, api_call_id, correlation_id, subscription_id, subscription_status active, replaced or expired, expiry, message); 400, 401, 403, 409 and 500 return a StatusSuccessResponse with the same descriptions as the subscribe table.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "2026-08-25T14:30:01+05:30",
  "api_call_id": "e7f8a9b0-c1d2-3456-0123-567890123456",
  "correlation_id": "corr_20260825_12345",
  "subscription_id": "sub_ravi_001",
  "subscription_status": "active",
  "expiry": "",
  "message": "Preauthorization approved for Rs. 50,000. Valid from 2026-08-25 to 2026-09-01. Reference: PA-2026-004567"
}
```
