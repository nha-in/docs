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
  - file: site/docs/overview/glossary.md
    fetched: 2026-08-24
    hash: sha256:b78c776025d0fb07e54d0b4c7d6e0266aba75872c382760ee0e177c6a3b2381e
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.care-context]
---

## In plain words

ABHA expands to Ayushman Bharat Health Account. In practice it means two
different things: the ABHA number, a 14 digit identifier issued after a
KYC check that validates under the Luhn algorithm, and the ABHA address,
a readable name on the HIE-CM such as `name@abdm` that routes records.
You will meet both in every module; when a document says "the patient's
ABHA", work out which of the two it means before writing code against it.

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
