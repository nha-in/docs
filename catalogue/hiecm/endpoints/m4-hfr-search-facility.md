---
id: hiecm.endpoint.m4-hfr-search-facility
type: endpoint
gateway: hiecm
milestone: M4
version: abdm-v3
title: Search the facility registry before creating anything
summary: >
  Finds facilities that already match a name and location, so a second
  record is never created for one that exists.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/HFR-M4-Mar-16-2024.xlsx
    fetched: 2026-09-04
    hash: sha256:08073c49d97b0550078995d8ab3b4f5f1ce7f28f6deb6ce6109a34fc0efd474e
    note: >
      NHA's own test case sheet, which names the sandbox host and path for
      this call. It gives no request or response schema, so the body below
      is not transcribed from one.
verified:
  status: unverified
  against: docs-only
related:
  flows: [hiecm.flow.m4-onboard-facility]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m4-build
---

# Search the facility registry before creating anything

## In plain words

The deduplicate search. It is the first call in onboarding and the one
that stops a facility being registered twice.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The facility's name, district and sub district, the three parameters the
  search requires. District and sub district go in as LGD codes.

## What happens

```bash
curl -X POST 'https://facilitysbx.abdm.gov.in/FacilityManagement/v1.5/facility/search' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The path and host come from NHA's test case sheet, which cites this call
against test cases HFR-001 to HFR-009 and HPR-076. No request or response schema is published for it in any
source this catalogue holds, so the body is a placeholder rather than a
transcription. Read the field tables on the M4 operations page at
/docs/hiecm/v3/api/m4/undocumented before you build the body.

## How you know it worked

The response lists the facilities that match, or none. A match means
stop and take that facility's id rather than creating a record.

Nothing here has been run against the ABDM sandbox from this repository,
so treat the response shape as unconfirmed until you have seen one.

## When it goes wrong

The M4 error codes are the HIS series, listed in full in the M4
reference. The ones this call reaches most often are a rejected field on
validation and an expired session behind the transaction id. See
[HIS-2045](hiecm.error.his-2045).
