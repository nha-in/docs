# Patient app: subscribe an ABHA number to notifications

`POST /v1/notification/subscribe`

A Beneficiary Service Provider (PHR app) subscribes an ABHA ID to notification topics; NHCX persists it synchronously, Last-Linked-Wins per ABHA ID.

### Business purpose

Every other flow is a two-party exchange between hospital and payer. Notifications let a third party, the beneficiary through a PHR app, watch a claim move without being a sender or recipient on the underlying preauth or claim. The caller is a Beneficiary Service Provider (BSP), not a hospital or insurer; the persona label here is the nearest available. The subscription is what routes human-readable messages such as a preauth approval with amount and validity to the patient's app, giving beneficiaries transparency and reducing calls to the hospital desk.

### When to use

Call it every time a beneficiary logs in to your app. The last app to subscribe an ABHA ID wins, so do not trust a stored subscription.

### Preconditions

- You have a valid access token, sent in the `Authorization` header.
- Your callback URL is registered over HTTPS, with TLS 1.2 or higher.
- The user has agreed to receive notifications.
- The body is encrypted and carries a new `x-hcx-correlation_ID`.

### Postconditions

NHCX saves the subscription and answers `200` with a `subscription_ID` and its status. From then on, claim events for that ABHA ID are pushed to your callback.

### Common mistakes

- Reusing a correlation ID on a retry, which returns `409`.
- Subscribing once and assuming it still holds after another app logs in.
- Sending it to the exchange host instead of `https://hcxsbx.abdm.gov.in/v1/notification/subscribe`.
- Sending the token on `bearer_auth` instead of `Authorization`.

### Best practices

- Subscribe on every login and refresh the token before its 20-minute (1200-second) expiry; store access_token encrypted and never log the secret.
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
  --url https://hcxsbx.abdm.gov.in/v1/notification/subscribe \
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

## Protected header

These fields go in the JWE protected header of `payload`, not as HTTP headers.

- `alg` (string, required): Key management algorithm. Always `RSA-OAEP-256`: the content key is wrapped with the recipient's RSA public key.
- `enc` (string, required): Content encryption algorithm. Always `A256GCM`.
- `x-hcx-sender_code` (string, required): Your participant code. Mandatory on the envelope.
- `x-hcx-recipient_code` (string, required): The recipient's. For a provider, the processor code from the policy lookup. Mandatory on the envelope.
- `x-hcx-timestamp` (string, required): The time the message was made. [Timestamp](/docs/nhcx/v1/reference/envelope-fields#timestamp) gives the format. Mandatory on the envelope.
- `x-hcx-correlation_id` (string, required): The thread that ties a request to its answers. [The correlation ID rule](/docs/nhcx/v1/reference/envelope-fields#the-correlation-id-rule-in-full) says when to reuse it. Mandatory on the envelope.

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
  - `timestamp` (string)
  - `api_call_id` (string)
  - `correlation_id` (string)
  - `subscription_id` (string)
  - `subscription_status` (string)
  - `expiry` (string)
  - `message` (string)

Example 200 response. The values are placeholders:

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
