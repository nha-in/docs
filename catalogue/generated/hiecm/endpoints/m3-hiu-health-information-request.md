---
id: hiecm.endpoint.m3-hiu-health-information-request
type: endpoint
gateway: hiecm
milestone: M3
version: abdm-v3
title: Request a patient's health information
summary: The HIU asks for the records a consent artefact covers, with its ECDH
  key material and the URL to push them to.
generated: true
operation: m3_post_data_flow_v3_health_information_request
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_data_flow_v3_health_information_request.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_data_flow_v3_health_information_request.mdx#m3-hiu-health-information-request.
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

# Request a patient's health information

## In plain words

Ask for the records a [consent artefact](/docs/hiecm/v3/getting-started/glossary#consent-artefact) covers. Before the call, generate an [ECDH](/docs/hiecm/v3/getting-started/glossary#ecdh) key pair on `Curve25519` and a 32 byte nonce. Send the public key and nonce in `keyMaterial`, with the `dataPushUrl` where the [HIP](/docs/hiecm/v3/getting-started/glossary#hip) should push the records. The HIP encrypts each entry with AES-GCM. Decrypt with your private key, the HIP's public key and both nonces.

## Before you start

A gateway session token, a fetched consent artefact and a public `dataPushUrl`. Send the `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID` and `X-HIU-ID` headers.

## What happens

`cryptoAlg` is `ECDH`. `keyValue` is the public key, Base64 encoded, in X.509 SubjectPublicKeyInfo form. The nonce is 32 random bytes, Base64 encoded. The call returns 202 Accepted.

## How you know it worked

An acknowledgement on `/api/v3/hiu/health-information/on-request` carries the `transactionId`, and the records reach your `dataPushUrl`.

## When it goes wrong

`ABDM-1015` (Invalid Response). Keep the private key until the transfer completes, or the data cannot be decrypted. `ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
