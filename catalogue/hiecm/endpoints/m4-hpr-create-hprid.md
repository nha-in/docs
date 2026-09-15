---
id: hiecm.endpoint.m4-hpr-create-hprid
type: endpoint
gateway: hiecm
milestone: M4
version: abdm-v3
title: Create the HPID
summary: >
  Issues the professional's 14 digit identity number and the token that
  stands for them on later calls.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/HPR-Test-Cases-Final.xlsx
    fetched: 2026-09-04
    hash: sha256:257abae73f4c07d5d5145047fa34f63a792783de52dedfc8dd3f5892c52a4eea
    note: >
      NHA's own test case sheet, which names the sandbox host and path for
      this call. It gives no request or response schema, so the body below
      is not transcribed from one.
verified:
  status: unverified
  against: docs-only
related:
  flows: [hiecm.flow.m4-create-hpid]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m4-build
---

# Create the HPID

## In plain words

The last call in the HPID journey. It takes the professional's details
and returns the HPID and an \`hprToken\`.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- A verified mobile number, a chosen username, and the category and
  subcategory codes fetched from the HPR master data calls.

## What happens

```bash
curl -X POST 'https://hpridsbx.abdm.gov.in/api/v1/registration/aadhaar/createHprIdWithPreVerified' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The path and host come from NHA's test case sheet, which cites this call
against test case HPR-011. No request or response schema is published for it in any
source this catalogue holds, so the body is a placeholder rather than a
transcription. Read the field tables on the M4 operations page at
/docs/hiecm/v3/api/m4/undocumented before you build the body.

## How you know it worked

The response carries an HPID of 14 digits and a non empty \`hprToken\`.
Keep the token: registering the professional's profile carries it in the
payload.

Nothing here has been run against the ABDM sandbox from this repository,
so treat the response shape as unconfirmed until you have seen one.

## When it goes wrong

The M4 error codes are the HIS series, listed in full in the M4
reference. The ones this call reaches most often are a rejected field on
validation and an expired session behind the transaction id. See
[HIS-2045](hiecm.error.his-2045).
