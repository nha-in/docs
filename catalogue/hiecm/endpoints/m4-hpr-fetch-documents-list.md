---
id: hiecm.endpoint.m4-hpr-fetch-documents-list
type: endpoint
gateway: hiecm
milestone: M4
version: abdm-v3
title: List the documents this professional must upload
summary: >
  Returns the document ids the registry expects for this professional.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/HPR-Test-Cases-Final.xlsx
    fetched: 2026-09-04
    hash: sha256:257abae73f4c07d5d5145047fa34f63a792783de52dedfc8dd3f5892c52a4eea
    note: >
      NHA's own test case sheet, which names the sandbox host and path for
      this call. It gives no request or response schema, so the body below
      is not transcribed from one.
related:
  flows: [hiecm.flow.m4-register-professional]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m4-build
---

# List the documents this professional must upload

## In plain words

Registration is not finished until its documents are attached. This call
says which ones the registry is waiting for.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- A registered professional.

## What happens

```bash
curl -X POST 'https://doctorsbx.abdm.gov.in/apis/v1/doctors/fetch-documents-list' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The path and host come from NHA's test case sheet, which cites this call
against test case HPR-080. No request or response schema is published for it in any
source this catalogue holds, so the body is a placeholder rather than a
transcription. Read the field tables on the M4 operations page at
/docs/hiecm/v3/api/m4/undocumented before you build the body.

## How you know it worked

The response lists document ids. Two are always among them, the degree
certificate and the registration certificate, and a proof of work
certificate joins them for a professional working in government.

Nothing here has been run against the ABDM sandbox from this repository,
so treat the response shape as unconfirmed until you have seen one.

## When it goes wrong

The M4 error codes are the HIS series, listed in full in the M4
reference. The ones this call reaches most often are a rejected field on
validation and an expired session behind the transaction id. See
[HIS-2045](hiecm.error.his-2045).
