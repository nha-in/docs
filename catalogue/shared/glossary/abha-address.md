---
id: shared.glossary.abha-address
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: ABHA address
summary: >
  The readable name, such as name@sbx, that ABDM uses to route a
  person's health records.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-16/abha/M1 ABHA Swagger 1.yaml
    fetched: 2026-09-16
    hash: sha256:6ab5cfe77c29032fac5fbf25c8e28529f22951e459374fa618f570f15e25551b
related:
  concepts: []
---

# ABHA address

## In plain words

An ABHA address looks like an email address, for example `ajeet123@abdm`
on production or `something@sbx` on the sandbox. It is the handle a
person shares at a facility, and the identifier that care contexts are
linked against.

NHA calls this the PHR address in much of its own documentation, and
says outright that the two terms mean the same thing. Older material
uses the `@ndhm` suffix from before the mission was renamed.

The part after the `@` is the domain of the HIE-CM holding the address.
That is where the value for the `X-CM-ID` header comes from.

Every ABHA number is issued a default address automatically, which is the
fourteen digits followed by the suffix. People pick a memorable one
instead, subject to NHA's policy: at least four characters, no leading
digit, and no leading or trailing dot.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what ABHA address is without using the acronym itself.

## When it goes wrong

The suffix differs by environment. An address ending `@sbx` will not work against production, and the mismatch reads as a not-found rather than as an environment error.

