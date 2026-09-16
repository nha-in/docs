---
id: shared.glossary.x-cm-id
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: X-CM-ID, the consent manager header
summary: >
  The header naming which consent manager a request is meant for,
  carrying that consent manager's suffix.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-16/hiecm/gateway.yaml
    fetched: 2026-09-16
    hash: sha256:e7ca9d3e54d6e6c864f3f1ef7b2422a322c38f6ef0bf64e421c57960b8851dc7
verified:
  status: unverified
related: {}
---

# X-CM-ID, the consent manager header

## In plain words

`X-CM-ID` is a required header on the session call. The specification
describes it as:

> Suffix of the consent manager to which the request was intended

The example value given is `sbx`, the suffix that also ends an ABHA address
on that consent manager.

## Before you start

You need to know which environment you are calling, because the suffix is
what distinguishes one consent manager from another.

## What happens

`gateway_post_gateway_v3_sessions` requires this header, so the value is
settled before you hold an access token.

## How you know it worked

You have understood this when you can say where the suffix in an ABHA address
and the value of this header come from.

## When it goes wrong

Sending the suffix of one consent manager to the host of another, which makes
a routing mistake surface as an authorisation failure.
