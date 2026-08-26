# Correction, TIMESTAMP is UTC, 26 August 2026

Our gateway spec and the glossary said the `TIMESTAMP` header is IST, the
+05:30 offset. The sandbox says otherwise, and NHA's own spec agreed with
the sandbox all along. This file records what we claimed, why we claimed
it, what was observed, and what changed. Nothing was fixed silently.

## What we claimed

Two places carried the IST claim, both in our own editorial prose, neither
in NHA's wording:

- `catalogue/openapi/hiecm/v3/hiecm-gateway.yaml`, the shared `Timestamp`
  parameter: "in IST, the +05:30 offset", with the example
  `2026-08-24T15:45:30.000+05:30`, and the sentence "Working integrations
  send IST even though NHA's collection fills this with Postman's
  `$isoTimestamp`, which emits UTC."
- `catalogue/shared/glossary/timestamp-header.md`, and through it the fix
  text in `catalogue/hiecm/errors/abdm-2402.md`, which repeated the same
  format and example.

## Why we claimed it

A misreading during the Postman review. We noticed that NHA's collection
fills the header with `$isoTimestamp`, which emits UTC, and set that
aside in favour of a belief about what "working integrations" send. That
belief was never sourced to an observation. It should not have survived
contact with the collection, and it did.

## What was observed

On 25 August 2026, against `https://abhasbx.abdm.gov.in`, the ABHA
sandbox service, during a real integration session:

- `TIMESTAMP: 2026-08-25T21:12:40.588+05:30`, the IST format our prose
  prescribed, was rejected: HTTP 404 with body
  `{"error":{"code":"ABDM-1016: ","message":"Invalid Timestamp"}}`.
- `TIMESTAMP: 2026-08-25T15:51:15.339Z`, UTC with milliseconds and the
  `Z` suffix, was accepted on `POST /v3/phr/app/enrollment/encrypt` with
  a valid bearer token.

NHA's ingested M1 spec, `catalogue/openapi/hiecm/v3/hiecm-m1.yaml`,
Timestamp component, says "ISO 8601 UTC timestamp of the request." The
sandbox agrees with the spec. Our prose was the odd one out.

## What changed

- `catalogue/openapi/hiecm/v3/hiecm-gateway.yaml`: the `Timestamp`
  parameter description now says UTC with milliseconds and `Z`, and the
  example is `2026-08-25T15:51:15.339Z`. Nothing else in the file was
  touched.
- `catalogue/shared/glossary/timestamp-header.md`: rewritten to state the
  UTC format, record the evidence above, and say in the body that an
  earlier version claimed IST. `hiecm.error.abdm-1016` added to its
  related errors.
- `catalogue/hiecm/errors/abdm-2402.md`: the fix text now prescribes UTC
  with `Z` and carries a one line note of the change.
- `ABDM-1016` is the rejection code the sandbox returned for the bad
  format. Its error atom is `catalogue/hiecm/errors/abdm-1016.md`.
