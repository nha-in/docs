---
title: Core concepts
sidebar_label: What a claim is made of
description: What a claim is made of on NHCX, at the level the documentation set records.
verification: unverified
source: NHCX__NHCX-Website_DocumentDetails.md
sidebar_position: 4
---

# Core concepts

This page records what the NHCX documentation set covers. An index is not a
specification: it names what each document covers without describing it. Nothing here has been
read from a payload or run against the exchange, and the rows are cited so you can go to the
source.

## A claim is a FHIR bundle

[FHIR](/docs/nhcx/v1/getting-started/glossary#fhir) is the format ABDM uses for clinical data, and NHCX uses it
for claims. Row 11 of [the index](/docs/nhcx/v1) holds which bundle to use per use case, which
value sets to build it from and which values are mandatory, one tab per use case. Row 14 is the
FHIR implementation guide covering both ABDM and NHCX. Row 2 introduces the standards.

A claim being FHIR does not make it a health record. Records move on
[HIE-CM](/docs/nhcx/v1/getting-started/glossary#hie-cm), under a consent artefact, and a claim carries no consent
of its own.

## A workflow status travels in the protected header

Each message carries a protected header, and in it a workflow status code that says where the
request has reached. Row 12 is the sheet of those codes. It is updated when codes change, which
means the codes are data your integration should read rather than constants to compile in.

## A request cycle is closed by a protocol response

A call is not finished when it is accepted. The sender has to send a protocol response back to
close the cycle. Row 15 covers that, together with how to handle error scenarios. Row 18 is the
sheet of every error code and scenario, by use case, for the bridge and for NHCX.

## The two ends and the exchange

A provider submits, a payer adjudicates, NHCX routes. Rows 9 and 10 hold the use cases each side
must cover for sandbox exit: which API, at whose end, which bundle, which status and the callback
logic. Row 8 covers policy linking and de-linking for a payer or TPA. Row 19 is the dummy payer
implementation, which is what a provider tests against before a real payer exists.

## Tokens and keys

Row 3 covers generating a token with the ABDM API for the NHCX APIs, so the session is ABDM's,
not a separate one. Row 20 covers generating the encryption certificate, a public and private key
pair.

## What is missing

No endpoint, no request shape, no response shape and no test case for this gateway is documented
in this portal. Row 23 is the Swagger for the use case APIs and the participant service, and it
is the first thing to read when this section is filled in.

## Next

- [Registries](/docs/nhcx/v1/registries), who is registered on NHCX
- [NHCX](/docs/nhcx/v1), the full document index
