---
id: shared.glossary.timestamp-header
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: TIMESTAMP
summary: >
  The header carrying the current time in ISO 8601 UTC, which the gateway
  rejects if the format is wrong or your clock has drifted.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: NHA's own M1 Postman collection, 123 requests.
  - file: catalogue/openapi/hiecm/v3/hiecm-m1.yaml
    status: ingested
    note: >
      NHA's ingested M1 spec. Its Timestamp component says "ISO 8601 UTC
      timestamp of the request."
  - url: https://abhasbx.abdm.gov.in
    fetched: 2026-08-25
    status: observed
    note: >
      Sandbox behaviour observed during a real integration session on
      25 August 2026. The evidence is quoted in the body.
verified:
  status: verified
  against: https://abhasbx.abdm.gov.in (ABHA sandbox)
  on: "2026-08-25"
  by: recorded integration session; request and response pairs in catalogue/openapi/corrections/2026-08-26-timestamp-utc.md
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-1016]
---

# TIMESTAMP

## In plain words

Every ABDM call carries a `TIMESTAMP` header in ISO 8601 UTC, with
milliseconds and the `Z` suffix, for example `2026-08-25T15:51:15.339Z`.
The gateway rejects other formats, and it rejects a well formed value if
your clock has drifted too far from its own.

It is present on 121 of the 123 requests in NHA's own M1 collection, so
treat it as required everywhere.

An earlier version of this entry said IST, the +05:30 offset. That was
wrong, and observation refuted it. On 25 August 2026, against
`https://abhasbx.abdm.gov.in`:

- `2026-08-25T21:12:40.588+05:30`, IST offset with milliseconds, was
  rejected: HTTP 404 with body
  `{"error":{"code":"ABDM-1016: ","message":"Invalid Timestamp"}}`.
- `2026-08-25T15:51:15.339Z`, UTC with milliseconds and `Z`, was
  accepted on `POST /v3/phr/app/enrollment/encrypt` with a valid bearer
  token.

NHA's ingested M1 spec agrees: "ISO 8601 UTC timestamp of the request."
NHA's collection fills the header with Postman's `$isoTimestamp`, which
emits exactly this format.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what TIMESTAMP is without using the acronym itself.

## When it goes wrong

A wrong format, including a non-UTC offset, is rejected with ABDM-1016,
"Invalid Timestamp": see hiecm.error.abdm-1016. A drifted clock fails
every call in the module, and the error does not mention the clock. Take
the value from a synchronised source and format it in UTC.
