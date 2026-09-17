---
id: hiecm.endpoint.p3-get-all-consent-artefact-details-by-request-id
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Get All consent-artefact-details-by-request-id
summary: >
  Lists every consent artefact one consent request produced.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 6.18. The path, the method
      and the error scenarios below are transcribed from it.
related:
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p3-build
---

# Get All consent-artefact-details-by-request-id

## In plain words

This API will be invoked by HIU to get the All-consent artifact details by request id.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The identifiers this call names in its body, held from the step before it.

## What happens

```bash
curl -X GET 'https://dev.abdm.gov.in/api/hiecm/consent/v3/artefact/request/{{consentRequestId}}' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The path, the method and the body come from NHA's PHR V3 document,
section 6.18. That section gives no request body, so the body above is a placeholder rather than a transcription.

## How you know it worked

NHA's document gives this response:

```json
[ { "status": "GRANTED", "consentDetail": { "consentId": "e5ec415f-c098-40f6-a0db-faa162fc5295", "purpose": { "text": "Care Management", "code": "CAREMGT", "refUri": "www.abc.com" }, "patient": { "id": "abdulkalam@abdm" }, "hip": { "id": "cowin\_hip\_01", "name": "Cowin", "type": "HIP" }, "hiu": { "id": "cowin\_hiu\_01", "name": "Cowin", "type": "HIU" }, "careContexts": [ { "patientReference": "batman@tmh", "careContextReference": "Episode1" } ], "requester": { "name": "abdulkalam@abdm", "identifier": { "value": "REG1", "type": "MH1001", "system": "https://www.sample.com" } }, "createdAt": "2021-09-28T12:30:08.573Z", "lastUpdated": "2021-09-28T12:30:08.573Z", "schemaVersion": "v3", "consentManager": { "id": "abdm" }, "hiTypes": [ "Prescription" ], "permission": { "accessMode": "VIEW", "dateRange": { "from": "2021-09-28T12:30:08.573Z", "to": "2021-09-28T12:30:08.573Z" }, "dataEraseAt": "2021-09-28T12:30:08.573Z", "frequency": { "unit": "HOUR", "value": 1, "repeats": 0 } } }, "signature": "Signature of CM as defined in W3C standards; Base64 encoded" } ]
```

Nothing here has been called from this repository, so treat the shape as
unconfirmed until you have seen one.

## When it goes wrong

The error scenarios NHA records against this call: none recorded in this section. The PHR codes
are the AS series, recorded once against P1 for the whole patient side.
The gateway codes are the ABDM series, listed in the error reference.
