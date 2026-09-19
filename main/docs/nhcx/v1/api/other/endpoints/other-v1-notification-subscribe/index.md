# Submit the notification subscribe

`POST /v1/notification/subscribe`

A Beneficiary Service Provider (PHR app) subscribes an ABHA ID to notification topics; NHCX persists it synchronously, Last-Linked-Wins per ABHA ID.

### Business purpose

Every other flow is a two-party exchange between hospital and payer. Notifications let a third party, the beneficiary through a PHR app, watch a claim move without being a sender or recipient on the underlying preauth or claim. The caller is a Beneficiary Service Provider (BSP), not a hospital or insurer; the persona label here is the nearest available. The subscription is what routes human-readable messages such as a preauth approval with amount and validity to the patient's app, giving beneficiaries transparency and reducing calls to the hospital desk.

### When to use

Call it on every beneficiary login (Subscribe-on-Login): the user authenticates with the ABHA address, the app checks its NHCX token, refreshes via the sessions endpoint if expired, then subscribes the ABHA ID and stores the returned subscription_ID. Because Last-Linked-Wins replaces any earlier app's subscription, resubscribe on each login rather than trusting a stored ID. Most PHR apps need only topic_code workflow_events; network_events and participant_events are also defined. The call is synchronous and sits outside the workflow-code sequence; a fresh x-hcx-correlation_ID is required per attempt.

### Preconditions

- ABDM M1 integration completed; BSP sandbox testing on hcxsbx.ABDM.gov.in, certification and production registry onboarding.
- An HTTPS callback endpoint with TLS 1.2 or higher registered as on_notification_URL, and JWT capability.
- Access token from the ABDM session token call (01-session/session-token.bru); sent as Authorisation: Bearer with Content-Type application/json.
- Body is a JWEPayload whose compact JWE carries protected headers alg RSA-OAEP, enc A256GCM, x-hcx-sender_code (your BSP code), x-hcx-recipient_code (NHCX gateway code), x-hcx-TIMESTAMP (ISO 8601) and a unique x-hcx-correlation_ID, plus the subscribe JSON: subscription_ID, topic_code array, recipient_code, subscriber.ID (ABHA ID), on_notification_URL and optional expiry.
- Explicit user consent obtained before subscribing.

### Postconditions

NHCX decrypts the request with its private key, validates headers and payload, persists the subscription with Last-Linked-Wins per ABHA ID and returns the subscription state synchronously: HTTP 200 with a SubscribeResponse carrying TIMESTAMP, API_call_ID, correlation_ID, subscription_ID, subscription_status (active, replaced or expired), expiry and message. Thereafter, when a hospital submits a preauth or claim with that ABHA ID and the payer responds, NHCX pushes a notification (notification_ID, topic_code, TIMESTAMP, subscriber.ID, a displayable message and optional domain_values) to the registered callback. Errors: 400 validation, 401 sender not authorised, 403 sender not permitted, 409 duplicate correlation ID, 500 decryption or persistence failure.

### Common mistakes

- Reusing x-hcx-correlation_ID across attempts or retries, which returns 409 (the API reference defines 409 as replay detection, not an existing-subscription conflict).
- Subscribing once and trusting the stored subscription_ID; another app's login silently replaces it (subscription_status replaced).
- Sending it to the exchange host, https://apisbx.ABDM.gov.in/hcx, where the other /v1 calls go. The notification integration guide gives the portal host: https://hcxsbx.ABDM.gov.in/v1/notification/subscribe.
- Sending the token on bearer_auth. This call reads it from Authorisation: Bearer.
- Sending protocol headers in the clear rather than inside the JWE protected header.
- Using the NHCX client-credentials token endpoint instead of the ABDM gateway sessions endpoint.
- Subscribing silently without consent or without showing subscription status in settings.

### Best practices

- Subscribe on every login and refresh the token before its 100-minute expiry; store access_token encrypted and never log the secret.
- Generate a fresh UUID correlation ID per subscribe attempt, including retries; retry 500s with backoff, regenerate the token on 401, check the registry on 403.
- Subscribe only to the topics you need, typically workflow_events.
- Secure the callback: HTTPS with TLS 1.2 or higher, validate the JWT from NHCX, verify sender_code, rate-limit.
- Display the message field directly to users; treat domain_values as optional audit data and read status from x-hcx-status, not the workflow ID description.

### Related scenario

A beneficiary opens a PHR app and logs in with the ABHA address ravi@ABDM. The app confirms its NHCX token is valid, then posts /v1/notification/subscribe with subscription_ID sub_ravi_001, topic_code workflow_events, its BSP code and its on_notification_URL, under a fresh correlation ID. NHCX replies 200 with subscription_status active. Later that day a hospital submits a preauth for the same ABHA ID on /v1/preauth/submit and the payer approves it on /v1/preauth/on_submit; NHCX pushes a notification to the app's callback reading that the preauthorisation was approved for Rs. 50,000 with its validity dates, which the app displays as-is.

### Specification

Chapter [Notifications and patient apps](/docs/nhcx/v1/reference/notifications-and-patient-apps) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/notification/subscribe \
  --header 'x-hcx-sender_code: phr-app-xyz@bsp' \
  --header 'x-hcx-recipient_code: nhcx-gateway@hcx' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00iLCJ4LWhjeC1zZW5kZXJfY29kZSI6InBoci1hcHAteHl6QGJzcCJ9.encrypted_key.iv.ciphertext.tag",
  "_payload_plaintext": {
    "subscription_id": "sub_ravi_001",
    "topic_code": [
      "workflow_events"
    ],
    "recipient_code": "phr-app-xyz@bsp",
    "subscriber": {
      "id": "ravi@abdm"
    },
    "on_notification_url": "https://api.phrapp.com/v1/hcx/notification/on_subscribe"
  }
}'
```

## Headers

- `x-hcx-sender_code` (string, required): Your participant code. Mandatory on the envelope.
- `x-hcx-recipient_code` (string, required): The recipient's. For a provider, the processor code from the policy lookup. Mandatory on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-correlation_id` (string, required): The thread. See the rule below. Mandatory on the envelope.

## Body

- `payload` (string)
- `_payload_plaintext` (object)
- `_payload_plaintext.subscription_id` (string)
- `_payload_plaintext.topic_code` (string[])
- `_payload_plaintext.recipient_code` (string)
- `_payload_plaintext.subscriber` (object)
- `_payload_plaintext.subscriber.id` (string)
- `_payload_plaintext.on_notification_url` (string)

## Responses

- `200`: NHCX decrypts the request with its private key, validates headers and payload, persists the subscription with Last-Linked-Wins per ABHA id and returns the subscription state synchronously: HTTP 200 with a SubscribeResponse carrying timestamp, api_call_id, correlation_id, subscription_id, subscription_status (active, replaced or expired), expiry and message.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "2026-08-25T08:30:00+05:30",
  "api_call_id": "d6e7f8a9-b0c1-2345-9012-456789012345",
  "correlation_id": "8899aabb-ccdd-eeff-0011-223344556677",
  "subscription_id": "sub_ravi_001",
  "subscription_status": "active",
  "expiry": "",
  "message": "Subscription accepted"
}
```
