---
id: shared.glossary.hip
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HIP, health information provider
summary: >
  The role held by a system that holds a patient's records and shares
  them when a consent allows it.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-16/hiecm/consent-management-data-flow.yaml
    fetched: 2026-09-16
    hash: sha256:78f8bc3102976944a630081e63cf34e046ee6cd337065c815473cf77b31bdbf2
verified:
  status: unverified
related: {}
---

# HIP, health information provider

## In plain words

A health information provider is the side of an exchange that holds health
records and hands them over. It is identified by a service id, carried in the
`X-HIP-ID` header, which the specification describes as:

> Identifier of the health information provider to which the request was
> intended

A hospital, a lab or a clinic system acts in this role when it shares what it
recorded.

## Before you start

You need your bridge registered and its service id in hand, because the
header value is that id rather than a name.

## What happens

ABDM calls `m2_post_consent_v3_request_hip_on_notify` at your callback URL to
tell you a consent covering your records was granted, revoked or expired.

## How you know it worked

You have understood this when you can say which side of a data exchange holds
the records and which side asks for them.

## When it goes wrong

Building only the request side and leaving the callback endpoints unbuilt,
which leaves ABDM with nowhere to deliver the notifications this role
receives.
