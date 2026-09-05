---
id: hiecm.endpoint.p3-consent-auto-approve
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Set an auto approval policy
summary: >
  Creates the policy that grants matching consent requests without asking the person each time.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 6.13. The path, the method, the
      request body and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  flows: [hiecm.flow.p3-subscribe-and-auto-approve]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p3-build
---

# Set an auto approval policy

## In plain words

Without a policy, a person approves a request every time a hospital adds one record. This is the policy that stops that.

## Before you start

- A gateway session token. See [the gateway session](../concepts/gateway-session.md).
- The person's explicit agreement that records may be retrieved automatically, taken as a separate question from the subscription.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/consent/v3/auto/approve' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "isApplicableForAllHIPs": **true**, "hiu": { "id": "*{{hiu-id}}*" }, "includedSources": [ { "hiTypes": [ "Prescription", "DiagnosticReport", "OPConsultation", "DischargeSummary", "ImmunizationRecord", "HealthDocumentRecord", "WellnessRecord", "Invoice" ], "purpose": { "text": "Care Management", "code": "CAREMGT", "refUri": "www.abdm.gov.in" }, "period": { "from": "2024-11-27T16:21:00.000Z", "to": "2024-12-30T00:00:00.000Z" } } ], "excludedSources": [] }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 6.13. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The response carries an auto approval id. Store it: without it the person cannot turn the policy off, and they must be able to at any time.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1016, ABDM-1030, ABDM-1064. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
