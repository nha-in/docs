---
id: hiecm.endpoint.m4-hpr-demographic-auth-mobile
type: endpoint
gateway: hiecm
milestone: M4
version: abdm-v3
title: Check whether the mobile number is the one on the Aadhaar record
summary: >
  Tells you whether the professional's mobile number is already verified
  against Aadhaar, which decides whether they need an OTP at all.
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

# Check whether the mobile number is the one on the Aadhaar record

## In plain words

The mobile number is confirmed by a fast path or a slow one. This call
decides which. The response field is \`demographicAuthViaMobile\`.

## Before you start

- A gateway session token. See [the gateway session](../concepts/gateway-session.md).
- The mobile number, encrypted with NHA's public certificate. See
  [encrypting an identifier](../concepts/input-encryption.md).

## What happens

```bash
curl -X POST 'https://hpridsbx.abdm.gov.in/api/v1/registration/aadhaar/demographicAuthViaMobile' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The path and host come from NHA's test case sheet, which cites this call
against test case HPR-010. No request or response schema is published for it in any
source this catalogue holds, so the body is a placeholder rather than a
transcription. Read the field tables on the M4 operations page at
/docs/hiecm/v3/api/m4/undocumented before you build the body.

## How you know it worked

The response carries \`demographicAuthViaMobile\`. True means the number is
already verified and the OTP steps are skipped. False means generate and
verify a mobile OTP before creating the HPID.

Nothing here has been run against the ABDM sandbox from this repository,
so treat the response shape as unconfirmed until you have seen one.

## When it goes wrong

The M4 error codes are the HIS series, listed in full in the M4
reference. The ones this call reaches most often are a rejected field on
validation and an expired session behind the transaction id. See
[HIS-2045](../errors/his-2045.md).
