---
id: shared.glossary.hiu
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HIU, health information user
summary: >
  The role held by a system that asks a patient for consent and then
  fetches records held elsewhere.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-16/hiecm/consent-management-data-flow.yaml
    fetched: 2026-09-16
    hash: sha256:4b0af51af2e2b5bfbf08f5e8745a940f59c550f8a1e4600c970c526f27bc8718
related: {}
---

# HIU, health information user

## In plain words

A health information user is the side of an exchange that wants records it
does not hold. It is identified by a service id, carried in the `X-HIU-ID`
header, which the specification describes as:

> Identifier of the health information user to which the request was intended

The same organisation often holds both roles, one for the records it keeps
and one for the records it wants to read.

## Before you start

You need a consent request the patient has approved, because this role reads
nothing without one.

## What happens

`m3_post_consent_v3_request_init` raises the consent request that this role
begins every exchange with.

## How you know it worked

You have understood this when you can say which role a consent request is
raised by and which role it is served against.

## When it goes wrong

Requesting health information on a consent artefact that has expired or been
revoked, which the specification states must not be done.
