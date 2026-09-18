---
id: hiecm.endpoint.m3-consent-request-init
type: endpoint
gateway: hiecm
milestone: M3
version: abdm-v3
title: Initiate a consent request
summary: >
  Initiates a new consent request for a patient's health records.  The
  Gateway notifies the patient via the ABHA App.
sources:
  - file: catalogue/openapi/.raw/ABDM_M3_API_Swagger.yaml
    hash: sha256:6d56fd91a3f75575c4382de1489ad4a6a0091d0eece9dfa5278c4d248f6fcf6b
    fetched: 2026-08-25
    note: >
      NHA's M3 OpenAPI file.
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, its consent request init section, which
      publishes the request
      body this atom had as a placeholder.
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m3-build
---

# Consent Init Request

## In plain words

Initiates a new consent request for a patient's health records.

The Gateway notifies the patient via the ABHA App. The patient can approve or deny.
The HIU receives the patient's decision via a callback to `{hiuBridgeUrl}/v0.5/consents/hiu/notify`.

**Key fields:**
- `purpose.code`, ABDM-defined purpose codes (e.g. `CAREMGT`, `BTG`, `PUBHLTH`, `HPAYMT`, `DSRCH`, `PATRQST`)
- `hiTypes`, Health Information types requested
- `permission.accessMode`, `VIEW` (read-only) or `STORE`
- `permission.dataEraseAt`, Consent expiry after which data access is revoked

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/consent/v3/request/init' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{ "consent": { "hip": { "id": "HIP\_ID" }, "hiu": { "id": "HIU\_ID" }, "hiTypes": [ "Prescription", "DiagnosticReport", "DischargeSummary", "ImmunizationRecord", "HealthDocumentRecord", "WellnessRecord", "OPConsultation" , "Invoice" , ], "patient": { "id": "abhaaddress@sbx" }, "purpose": { "code": "CAREMGT", "text": "Care Management", "refUri": "www.abdm.gov.in" }, "requester": { "name": "Dr. Manju", "identifier": { "type": "REGNO", "value": "MH1001", "system": "https://www.mciindia.org" } }, "permission": { "dateRange": { "to": "2024-07-17T12:05:57.151Z", "from": "1924-07-09T12:05:57.151Z" }, "frequency": { "unit": "DAY", "value": 0, "repeats": 0 }, "accessMode": "VIEW", "dataEraseAt": "2124-11-09T00:00:00.000Z" }, "careContexts": [ { "patientReference": "xxxx@sbx", "careContextReference": "COCa496bc2f-ca6c-4af5-b973-02e915fd9815" } ] } }'
```

The body above is transcribed from NHA's PHR V3 document, from its consent request init section, which publishes it for this call. It has not been sent to the
sandbox from this repository.

The request and response schemas for this operation are in the M3 specification, published at /specs/hiecm-m3.yaml and rendered field by field at /docs/hiecm/v3/api/m3. It is NHA's file as ingested.

NHA calls this operation `consentRequestInit`.

## How you know it worked

NHA's file documents a response schema for this operation. Read it in `hiecm-m3.yaml` rather than assuming a shape.

It has not been run against the sandbox from this repository, so the schema is what NHA says, not what was observed. When you run it, record the real response here and set `verified.status`.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

