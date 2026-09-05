---
id: hiecm.endpoint.p3-consent-disable-auto-approve
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Consent Disable Auto Approve
summary: >
  Turns off automatic approval of consent requests for an HIU.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 6.14. The path, the method
      and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p3-build
---

# Consent Disable Auto Approve

## In plain words

This API is invoked by the Health Information User (HIU) to disable the automatic approval of consent requests.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The identifiers this call names in its body, held from the step before it.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/consent/v3/auto/approve/{{consentId}}/disable' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The path, the method and the body come from NHA's PHR V3 document,
section 6.14. That section gives no request body, so the body above is a placeholder rather than a transcription.

## How you know it worked

NHA's document records no response body for this call. Read the
acknowledgement, and where the exchange is asynchronous treat the
callback that answers it as the thing to observe rather than this
response. Nothing here has been called from this repository.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1016, ABDM-1030. The PHR codes
are the AS series, recorded once against P1 for the whole patient side.
The gateway codes are the ABDM series, listed in the error reference.
