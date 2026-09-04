---
id: hiecm.endpoint.p3-approve-subscription-request
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Approve Subscription Request
summary: >
  This Api will be invoked by the patient/user from PHR application to approve the subscription request raised by the health locker/PHR
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 8.3.4. The path, the method, the request body
      and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p3-build
---

# Approve Subscription Request

## In plain words

This Api will be invoked by the patient/user from PHR application to approve the subscription request raised by the health locker/PHR

## Before you start

- A gateway session token. See [the gateway session](../concepts/gateway-session.md).
- The identifiers this call names in its body, held from the step before it.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/subscription-' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "isApplicableForAllHIPs": **false**, "includedSources": [ { "hiTypes": [ "Prescription", "DiagnosticReport", "OPConsultation", "DischargeSummary", "ImmunizationRecord", "HealthDocumentRecord", "WellnessRecord" , "Invoice" ], "purpose": { "text": "Care Management", "code": "CAREMGT", "refUri": "www.abc.com7" }, "hip": { "id": "HIP\_ID", "name": "HIP\_NAME " }, "categories": [ "DATA", "LINK" ], "period": { "from": "2023-04-27T04:03:40.079Z", "to": "2023-04-27T04:03:40.079Z" } } ] } "LINK", "DATA" ], "period": { "from": "2023-04-04T09:52:39.235Z", "to": "2023-04-20T09:52:39.235Z" } } ], "excludedSources": [ { "hiTypes": [ "PRESCRIPTION" ], "purpose": { "text": "Self Requested", "code": "PATRQT", "refUri": "www.test.com" },'
```

The path, the method and the body come from NHA's PHR V3 document,
section 8.3.4.

## How you know it worked

NHA's document records no response body for this call. Read the
acknowledgement, and where the exchange is asynchronous treat the
callback that answers it as the thing to observe rather than this
response. Nothing here has been called from this repository.

## When it goes wrong

The error scenarios NHA records against this call: none recorded in this section. The PHR codes
are the AS series, recorded once against P1 for the whole patient side.
The gateway codes are the ABDM series, listed in the error reference.
