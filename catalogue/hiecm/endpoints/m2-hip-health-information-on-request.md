---
id: hiecm.endpoint.m2-hip-health-information-on-request
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Acknowledge a health information data request
summary: The HIP acknowledges a health information request, then encrypts the
  records and pushes them to the requester.
generated: true
operation: m2_post_data_flow_v3_health_information_hip_on_request
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_data_flow_v3_health_information_hip_on_request.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_data_flow_v3_health_information_hip_on_request.mdx#m2-hip-health-information-on-request.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.gateway-session
---

# Acknowledge a health information data request

## In plain words

Call this when a [health information request](/docs/hiecm/v3/api/m2/endpoints/m2-callbacks/09-m2-post-v3-hip-health-information-request) reaches your bridge. Return its `transactionId` with `sessionStatus` of `ACKNOWLEDGED`, and its request id in `response.requestId`. Then encrypt the records and push them to the `dataPushUrl`.

The requester's `keyMaterial` uses [ECDH](/docs/hiecm/v3/getting-started/glossary#ecdh) on `Curve25519`, with a public key and a 32 byte nonce. Generate your own key pair and nonce for the transaction. Derive the shared key, combine the two nonces, and encrypt each entry with AES-GCM. Send your public key and nonce with the data.

## Before you start

A gateway session token and the health information request. Send the `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID` headers.

## What happens

The call returns 202 Accepted. The push goes to the `dataPushUrl` directly, not through the gateway. `/health-information/transfer` documents that push.

## When it goes wrong

`ABDM-1031` (Invalid request): check the body. Never push data for a consent artefact that has expired or been revoked. `ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
