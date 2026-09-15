---
id: nhcx.endpoint.notification-subscribe
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v1/notification/subscribe
summary: >-
  Let a patient's health record app receive plain-language updates about that patient's
  insurance claims.
sources:
- url: https://hcxsbx.abdm.gov.in/images/01db86335b7c226eb745.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Notification Integration.docx
  hash: sha256:05908862c103522fac0dbb482f8eb6a0f8536fc12b1ae3bdb0e98615f30812aa
  fetched: '2026-09-14'
  note: NHCX Notification Integration, listed on https://hcxsbx.abdm.gov.in/#/documents, not named in the NHCX document sheet. sections 2, 3, 4.2, 6.1, 6.3, 7.3.
- url: https://hcxsbx.abdm.gov.in/subscriptionhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/subscriptionhcxservice.json
  hash: sha256:0d0d4781aa96017c06c8c2533e63dd1a6b36bb2342ebb51aeefca3349d892029
  fetched: '2026-09-14'
  note: 'API specification: subscriptionhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/notification/subscribe.post; components.schemas.SubscribeResponse.'
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.session-token
  callbacks:
  - nhcx.callback.notification-delivery
  errors:
  - nhcx.error.nhcx-401
  concepts:
  - nhcx.concept.notifications
  - nhcx.concept.jwe-envelope
  - nhcx.concept.protocol-headers
  - nhcx.concept.beneficiary-consent
  flows:
  - nhcx.flow.notification-subscribe
  decisions:
  - nhcx.decision.session-endpoint
---

# POST /v1/notification/subscribe

## In plain words

A [PHR](../../shared/glossary/phr.md) app registered with [NHCX](../../shared/glossary/nhcx.md) as a Beneficiary Service Provider subscribes a beneficiary to claim notifications. Afterwards, when a hospital and payer exchange a pre-authorisation, claim, payment or communication for that beneficiary, NHCX pushes a readable message to the app.

You call it every time the beneficiary logs in to your app with their ABHA address. Only the most recently subscribed app receives notifications for an ABHA.

## Before you start

- [Milestone 1](../../shared/glossary/m1.md) integration complete, and your app registered in NHCX as a Beneficiary Service Provider.
- A session token, sent on `Authorization`. See [which session endpoint to call](../decisions/session-endpoint.md).
- An HTTPS callback endpoint, TLS 1.2 or newer, for notifications. See [receiving a notification](../callbacks/notification-delivery.md).
- The beneficiary's explicit consent to subscribe, and their [ABHA address](../../shared/glossary/abha-address.md).

## What happens

Your app calls NHCX on the portal host, not on the exchange host the other `/v1` calls use.

Seal the subscription as a [JWE](../glossary/jwe.md) with these protected headers:

```json
{
  "alg": "RSA-OAEP",
  "enc": "A256GCM",
  "x-hcx-sender_code": "<YOUR_BSP_CODE>",
  "x-hcx-recipient_code": "<NHCX_GATEWAY_CODE>",
  "x-hcx-timestamp": "<CURRENT_ISO_8601_TIMESTAMP>",
  "x-hcx-correlation_id": "<NEW_UUID_FOR_THIS_ATTEMPT>"
}
```

The sealed payload:

```json
{
  "subscription_id": "<YOUR_SUBSCRIPTION_ID>",
  "topic_code": ["workflow_events"],
  "recipient_code": "<YOUR_BSP_CODE>",
  "subscriber": { "id": "<BENEFICIARY_ABHA_ADDRESS>" },
  "on_notification_url": "<YOUR_NOTIFICATION_CALLBACK_URL>"
}
```

`topic_code` also accepts `network_events` and `participant_events`. `expiry` is optional.

```bash
curl --location --request POST 'https://hcxsbx.abdm.gov.in/v1/notification/subscribe' \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "payload": "<JWE_COMPACT_STRING>"
  }'
```

**Idempotency.** A subscription for an ABHA replaces any earlier one, from your app or another. Subscribing again on every login is safe. Generate a new `x-hcx-correlation_id` for every attempt, a retry included.

## How you know it worked

You receive HTTP `200` with the subscription state:

```json
{
  "timestamp": "<TIMESTAMP>",
  "api_call_id": "<API_CALL_ID>",
  "correlation_id": "<YOUR_CORRELATION_ID>",
  "subscription_id": "<YOUR_SUBSCRIPTION_ID>",
  "subscription_status": "active",
  "expiry": "",
  "message": "<MESSAGE>"
}
```

The step is done when `subscription_status` is `active` for your `subscription_id`. Store the `subscription_id`, and show the status in your app's settings. A later `replaced` means another app has taken the beneficiary's notifications.

## When it goes wrong

- `401 Unauthorized`: the token expired. Get a new one and subscribe again.
- `403 Forbidden`: your app is not authorised. Check your registry entry in NHCX.
- `409 Conflict`: this should not occur when every attempt carries a new `x-hcx-correlation_id`.
- `500`: a gateway fault. Retry with backoff and a new correlation id.
- The call goes to `https://apisbx.abdm.gov.in/hcx`, or carries the token on `bearer_auth` only. Use the portal host and `Authorization`.
