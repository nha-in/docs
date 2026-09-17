---
id: hiecm.endpoint.p3-subscription-request-hiu-on-notify
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Subscription Request HIU – on notify
summary: >
  This is the API that will be invoked by the HIU to notify HIECM that HIU has raised the subscription request.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 8.3.6. The path, the method, the request body
      and the error scenarios below are transcribed from it.
related:
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p3-build
---

# Subscription Request HIU – on notify

## In plain words

This is the API that will be invoked by the HIU to notify HIECM that HIU has raised the subscription request.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The identifiers this call names in its body, held from the step before it.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/hiu/on-notify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "acknowledgement": { "status": "OK", "subscriptionRequestId": "2b8ddd74-5e5e-475b-8778-21603e05a8b4" }, "response": { "requestId": "a4b51f47-f70f-4291-9599-8e39b7893cfc" } }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 8.3.6.

## How you know it worked

NHA's document records no response body for this call. Read the
acknowledgement, and where the exchange is asynchronous treat the
callback that answers it as the thing to observe rather than this
response. Nothing here has been called from this repository.

## When it goes wrong

The error scenarios NHA records against this call: none recorded in this section. The PHR codes
are the AS series, recorded once against P1 for the whole patient side.
The gateway codes are the ABDM series, listed in the error reference.
