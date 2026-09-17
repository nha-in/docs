---
id: shared.glossary.abha
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: ABHA
summary: >
  The patient's identity in ABDM, in two forms that look alike and are
  not: a 14 digit ABHA number and a readable ABHA address.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-16/abha/M1 ABHA Swagger 1.yaml
    hash: sha256:6ab5cfe77c29032fac5fbf25c8e28529f22951e459374fa618f570f15e25551b
    note: >
      The ABHA number and ABHA address validation patterns.
  - file: catalogue/openapi/.raw/nha-2026-09-16/phr/PHR and Locker Swagger.yaml
    hash: sha256:a7e1b7e0b56b75297623057678cf307f21ecdbfbc9ebdb022dc67df78540f6d5
    note: >
      The ABHA number described as 14 digits.
verified:
  status: unverified
  against: docs-only
related:
  
  glossary: [shared.glossary.ayushman-card]
---

## In plain words

ABHA expands to Ayushman Bharat Health Account. In practice it means two
different things: the ABHA number, a 14 digit identifier issued after a
KYC check, and the ABHA address, a readable name on the HIE-CM such as
`name@abdm` that routes records.
You will meet both in every module; when a document says "the patient's
ABHA", work out which of the two it means before writing code against it.

ABHA was called Health ID until NHA renamed it. The old name is still
live in NHA's own hostnames, `healthid.abdm.gov.in` among them, so both
names reach the same thing.

## Before you start

Nothing. This is a definition.

## What happens

Every ABHA number is issued a default address made from the number
itself, `14digit@sbx` in sandbox and `14digit@abdm` in production. A
person can also hold an ABHA address without an ABHA number.

## How you know it worked

Not applicable to a definition.

## When it goes wrong

The common mistake is passing an ABHA number where an API wants an ABHA
address, or the reverse. They are different fields with different
formats.

An earlier version of this entry said the ABHA number validates under
the Luhn algorithm. That claim came from this repository's own site
prose rather than from NHA, and no fetched NHA page states which
checksum the ABHA number uses. NHA's M1 documentation names Verhoeff,
but for the Aadhaar number inside the enrolment flow, which is a
different field. The claim is removed rather than replaced. Do not
restore either algorithm here without an NHA source.
