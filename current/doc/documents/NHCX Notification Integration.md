# NHCX Notification Integration

*Source: `documents/NHCX Notification Integration.docx` — extracted full content*

## NHCX Notification Integration for PHR Applications

Approach:  Subscribe-on-Login

Version: 1.0
Protocol: NHCX V1.0

## 1. Executive Summary

This document describes implementing NHCX (National Health Claims Exchange) notification integration for Personal Health Record (PHR) applications using the Last Linked Wins approach. When a beneficiary logs into a PHR app using their ABHA ID, that app becomes the active recipient for all claim-related notifications. Any previously linked PHR app subscription is replaced.

Key Benefits:

- Clean routing - only one BSP receives notifications per ABHA at any time

- No duplicate notification handling required

- Immediate activation on user login

## 2. Architecture Overview

The notification flow operates as follows:

Step 1: Beneficiary logs into PHR App using ABHA address

Step 2: PHR App calls NHCX subscribe API

Step 3: Hospital submits preauth/claim with beneficiary ABHA ID

Step 4: Payor processes and responds to NHCX

Step 5: NHCX pushes on_subscribe callback to PHR App

## 3. Prerequisites

### 3.1 ABDM M1 Integration

PHR app must complete Ayushman Bharat Digital Mission (ABDM) M1 integration. This is essential for NHCX integration.

### 3.2 BSP Registration

Register as a Beneficiary Service Provider (BSP) in NHCX:

- Complete sandbox testing on hcxsbx.abdm.gov.in

- Obtain sandbox certification

- Onboard to production NHCX registry

### 3.3 Technical Requirements

- HTTPS endpoint with SSL/TLS 1.2+

- JWT token generation capability

## 4. API Specifications

### 4.1 Authentication - Generate API Token

Endpoint:

- POST https://dev.abdm.gov.in/gateway/v0.5/sessions

Request Headers:

| Header | Value |
|---|---|
| Content-Type | application/json |

Request Parameters:

| Parameter | Type | Required | Description |
|---|---|---|---|
| clientId | String | Yes | Client ID received from ABDM |
| clientSecret | String | Yes | Secret from BSP onboarding |

Example Request Body:

{
  "clientId": "BSP_0001 ",
  "clientSecret": "Abc123XyzSecret!"
}

Response Fields:

| Field | Type | Description |
|---|---|---|
| access_token | String | JWT token for API calls |
| expires_in | Integer | Token validity (6000 seconds) |

Example Response:

{
  "access_token": "eyJhbGciOi...",
  "expires_in": 6000
}

### 4.2 Subscribe to Notifications

Subscribe to receive workflow notifications for a specific beneficiary. Call this when a user logs in with their ABHA ID.

Endpoint:

- POST https://hcxsbx.abdm.gov.in/v1/notification/subscribe

Request Headers:

| Header | Value |
|---|---|
| Authorization | Bearer {access_token} |
| Content-Type | application/json |

Protected Headers (JWE):

| Header | Required | Description |
|---|---|---|
| alg | Yes | RSA-OAEP |
| enc | Yes | A256GCM |
| x-hcx-sender_code | Yes | Your BSP code |
| x-hcx-recipient_code | Yes | NHCX gateway code |
| x-hcx-timestamp | Yes | ISO 8601 timestamp |
| x-hcx-correlation_id | Yes | Unique UUID |

Payload Parameters:

| Parameter | Type | Required | Description |
|---|---|---|---|
| subscription_id | String | Yes | Unique subscription ID |
| topic_code | Array of Strings | Yes | Array of notification topics: ["workflow_events", "network_events", "participant_events"] |
| recipient_code | String | Yes | Your BSP code |
| subscriber.id | String | Yes | ABHA ID (e.g. ravi@abdm) |
| on_notification_url | String | Yes | Your callback endpoint |
| expiry | String | No | Subscription expiry |

Example Payload:

{
  "subscription_id": "sub_ravi_001",
  "topic_code": ["workflow_events"],
  "recipient_code": "phr-app-xyz@bsp",
  "subscriber": {"id": "ravi@abdm"},
  "on_notification_url": "https://api.phrapp.com/ "
}

Note: Previous subscriptions for this ABHA will be replaced.

Available Topic Codes:

- workflow_events - Claim lifecycle events (preauth, claim, payment)

- network_events - NHCX platform updates and maintenance

- participant_events - Changes to payor/provider registrations

Note: You can subscribe to multiple topics by passing an array. Most PHR apps only need ["workflow_events"] for claim notifications.

### 4.3 Receive Notifications

NHCX pushes notifications to your callback endpoint when claim events occur.

Your Callback Endpoint:

- POST https://api.phrapp.com/v1/hcx/notification/on_subscribe

Payload Fields:

| Field | Type | Description |
|---|---|---|
| notification_id | String | Unique notification identifier |
| topic_code | String | Topic of the notification (e.g., workflow_events) |
| timestamp | String | Event timestamp (ISO 8601) |
| subscriber.id | String | Beneficiary ABHA ID |
| message | String | Human-readable event message that PHR app can display directly to the user (e.g., "Preauthorization approved for Rs. 50,000 valid till 2026-05-05") |
| domain_values | HashMap<String, String> | Optional. Domain headers (x-hcx-*) received from provider/payor for advanced processing or audit. PHR apps can ignore this field if only displaying the message. |

| Domain values | Type | Description |
|---|---|---|
| x-hcx-workflow_id | string | approved \| rejected \| queued \| processing |
| x-hcx-correlation_id | string | Request-response correlation ID (Reference ID (preauth_ref, claim_id, payment_id) |
| x-hcx-timestamp | string | Event timestamp (ISO 8601) |
| x-hcx-sender_code | string | Participant code of sender (payor/provider) |
| x-hcx-recipient_code | string | Participant code of recipient |
| x-hcx-api_call_id | string | API call identifier |
| x-hcx-status | string | request.queued \| request.dispatched \| response.complete |
| x-hcx-action | string | Event type (preauth, claim, etc.) |
| x-hcx-amount_submitted | String | Amount submitted by Provider for the given process |
| x-hcx-benefit-category_type | String | Benefit category type (Specialty) submitted by Provider |
| x-hcx-benefit_code | Array of String | Benefit / services submitted by provider |

Example Notification Payload:

{
  "notification_id": "notif_20260428_001",
  "topic_code": "workflow_events",
  "timestamp": "2026-04-28T14:30:00+05:30",
  "subscriber": {
    "id": "ravi@abdm"
  },
  "message": "Preauthorization approved for Rs. 50,000. Valid from 2026-04-28 to 2026-05-05. Reference: PA-2026-004567",
  "domain_values": {
    "x-hcx-workflow_id": "wf_20260428_001",
    "x-hcx-correlation_id": "corr_20260428_12345",
    "x-hcx-timestamp": "2026-04-28T14:30:00+05:30",
    "x-hcx-sender_code": "payor.icici@nhcx",
    "x-hcx-recipient_code": "bsp.phrapp@nhcx",
    "x-hcx-status": "response.complete",
    "x-hcx-action": "preauth_response",
    "x-hcx-amount_submitted": "75000.00"
  }
}

Note: PHR applications can directly display the message field to users without parsing individual domain header fields. The domain_values HashMap is provided for advanced use cases such as audit logging, custom message formatting, or detailed claim processing.

### 5. Notification Event Types

| Event Type | Description | Status Values |
|---|---|---|
| preauth_request | Provider submitted preauth | queued, processing |
| preauth_response | Payor preauth decision | approved, rejected |
| claim_request | Provider submitted claim | queued, processing |
| claim_response | Payor adjudication | approved, rejected |
| payment_notice | Payment processed | paid, pending |
| communication | Info requested | information_required |

## 6. Implementation Guide

### 6.1 User Login Workflow

- User authenticates with ABHA address

- App retrieves ABHA ID

- Check if NHCX token is valid

- If expired, call /sessions API

- Call /notification/subscribe with ABHA ID

- Store subscription_id locally

### 6.2 Encryption Implementation

Use JWE with RSA-OAEP and AES-256-GCM.

### 6.3 Error Handling

| Error Code | Description | Action |
|---|---|---|
| 401 Unauthorized | Token expired | Regenerate token |
| 403 Forbidden | Not authorized | Check registry |
| 409 Conflict | Subscription exists | Should not occur |
| 500 Server Error | Gateway issue | Retry with backoff |

## 7. Security Considerations

### 7.1 Token Management

- Store access_token securely (encrypted)

- Refresh before expiry (100 minutes)

- Never log participant_secret

### 7.2 Callback Security

- Enforce HTTPS with TLS 1.2+

- Validate JWT from NHCX

- Verify sender_code matches NHCX

- Implement rate limiting

### 7.3 Privacy

- Obtain explicit consent before subscribing

- Display subscription status in settings

## 8. Resources

Documentation:

- NHCX Sandbox: https://hcxsbx.abdm.gov.in

- ABDM Docs: https://sandbox.abdm.gov.in
