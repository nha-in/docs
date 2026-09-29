---
id: hiecm.flow.m3-fetch-records
type: flow
gateway: hiecm
milestone: M3
version: abdm-v3
title: Fetch the records a granted consent artefact covers
summary: Fetch a granted consent artefact, request the records it covers, and
  decrypt what the HIP pushes to your data push URL.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m3.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/milestones/m3.mdx#m3-fetch-records. Edit
      the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m3-consent-fetch
    - hiecm.endpoint.m3-hiu-health-information-request
    - hiecm.endpoint.m3-hiu-data-flow-notify
  callbacks:
    - hiecm.callback.m3-on-consent-fetch
    - hiecm.callback.m3-on-health-information-request
  concepts:
    - hiecm.concept.consent-artefact
    - hiecm.concept.gateway-session
  troubleshooting:
    - hiecm.troubleshooting.accepted-then-nothing
    - hiecm.troubleshooting.callback-never-arrives
  errors:
    - hiecm.error.abdm-1062
    - hiecm.error.abdm-1112
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  glossary:
    - hiecm.glossary.hiu
    - hiecm.glossary.hip
    - hiecm.glossary.ecdh
    - hiecm.glossary.key-material
    - shared.glossary.fhir
---

# Fetch the records a granted consent artefact covers

## In plain words

Using the consent artefact ID, the HIU fetches the consent artefact and
requests the health information covered under that consent. The requested
health data is then securely delivered to the data push URL provided by the
HIU.

```mermaid
sequenceDiagram
    autonumber
    participant S as Application/System
    participant CM as HIE-CM
    participant H as HIP
    S->>CM: POST /api/hiecm/consent/v3/fetch<br/>consentId
    CM-)S: callback POST {bridgeUrl}/api/v3/hiu/consent/on-fetch<br/>consent {status, consentDetail {hip, careContexts,<br/>hiTypes, permission.dateRange}, signature}
    S->>S: Generates an ECDH key pair on Curve25519<br/>and a 32 byte nonce for this transaction
    S->>CM: POST /api/hiecm/data-flow/v3/health-information/request<br/>hiRequest {consent.id, dateRange {from, to},<br/>dataPushUrl, keyMaterial {cryptoAlg ECDH,<br/>curve Curve25519, dhPublicKey {expiry, parameters,
    CM-)S: callback POST {bridgeUrl}/api/v3/hiu/health-information/on-request<br/>hiRequest {transactionId, sessionStatus REQUESTED},<br/>response.requestId
    CM->>H: Forwards the request to the HIP on its bridge
    H->>S: POST dataPushUrl<br/>pageNumber, pageCount, transactionId,<br/>entries [content (encrypted FHIR bundle), checksum,<br/>careContextReference],
    S->>S: Derives the shared key from the HIP keyMaterial,<br/>decrypts and verifies each entry
    S->>CM: POST /api/hiecm/data-flow/v3/health-information/notify<br/>notification {consentId, transactionId,<br/>notifier {type HIU, id},<br/>statusNotification {sessionStatus RECEIVED or FAILED,
    S->>CM: GET /api/hiecm/data-flow/v3/health-information/request/status/{transaction-id}<br/>to check a transfer that has not arrived
```

A decrypted bundle today is not a standing right to fetch again tomorrow. Every
fetch is a fresh permission check against an artefact the patient can revoke.

## Before you start

A granted consent request with at least one artefact id, a gateway session token, and a `dataPushUrl` endpoint of your own that accepts the encrypted FHIR bundles. Use a maintained implementation of the key exchange rather than writing it yourself: see [how a record travels](/docs/hiecm/v3/concepts/data-flow).

## What happens

Fetch the artefact and store what arrives on `/api/v3/hiu/consent/on-fetch`: the care contexts, HI types and date range it allows. Generate an ECDH key pair on `Curve25519` and a nonce for this transaction. Send the health information request with the consent id, a date range inside the artefact's, your `dataPushUrl` and your public key in `keyMaterial`. The on-request callback carries the `transactionId`. The HIP posts the pages to your `dataPushUrl` directly, not through the gateway. Derive the shared key from the HIP's `keyMaterial`, decrypt, then send the notify call.

## How you know it worked

Every entry for every care context decrypts, and your notify call reports `sessionStatus` `RECEIVED`.

## When it goes wrong

The chain stops between fetch, request and push: find the missing step on [accepted, then nothing](/docs/hiecm/v3/troubleshooting/accepted-then-nothing), and check the `dataPushUrl` you sent rather than your registered callback URL. `ABDM-1062`, consent not granted: the patient revoked or the grant lapsed mid flow. `ABDM-1112`: the artefact id is invalid or already expired. A transfer that never arrives can be checked with the status call against its `transactionId`.
